"""
llm_engine.py
=============
OpenAI-basert forklaringsmotor for EdPath anbefalingssystemet.

Mottar en ferdig `llm_context` fra recommendation_engine og genererer
strukturert norsk karriereveiledning via GPT-4.1-mini.

Garantier:
  - Genererer ALDRI nye studier, yrker eller bedrifter
  - Overstyrer ALDRI match_score eller rangering
  - Leser ALDRI rå spørreskjemasvar — kun pre-computed metadata
  - Returnerer None ved manglende API-nøkkel eller feil (aldri krasj)

Miljøvariabel:
  OPENAI_API_KEY — settes i Railway/lokalt .env
"""

from __future__ import annotations

import json
import logging
import os
from typing import Optional

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# JSON-schema for strukturert LLM-output (OpenAI strict mode)
# ---------------------------------------------------------------------------

_OUTPUT_SCHEMA: dict = {
    "type": "object",
    "properties": {
        "resultat_sammendrag": {
            "type": "string",
            "description": (
                "2–3 setninger som oppsummerer elevens profil og hva "
                "profilens styrker naturlig peker mot"
            ),
        },
        "hvorfor_dette_passer": {
            "type": "array",
            "description": (
                "For hvert av de anbefalte studiene og yrkene: "
                "konkret forklaring på hvorfor det passer akkurat denne eleven"
            ),
            "items": {
                "type": "object",
                "properties": {
                    "navn":       {"type": "string"},
                    "forklaring": {"type": "string"},
                },
                "required": ["navn", "forklaring"],
                "additionalProperties": False,
            },
        },
        "veien_videre": {
            "type": "array",
            "description": "3–5 konkrete råd eleven bør følge nå",
            "items": {"type": "string"},
        },
        "obs_punkter": {
            "type": "array",
            "description": (
                "1–3 realistiske forbehold: karakterkrav, konkurranse, "
                "usikkerhet om veivalg, o.l."
            ),
            "items": {"type": "string"},
        },
    },
    "required": [
        "resultat_sammendrag",
        "hvorfor_dette_passer",
        "veien_videre",
        "obs_punkter",
    ],
    "additionalProperties": False,
}

# ---------------------------------------------------------------------------
# System-prompt (stabil instruksjon til LLM-en)
# ---------------------------------------------------------------------------

_DEVELOPER_PROMPT = """\
Du er en digital karriereveileder for EdPath, en norsk plattform for utdanning \
og karriereveiledning.

Du mottar strukturert data fra EdPaths anbefalingsmotor om en elev eller student.

DU SKAL:
- forklare elevens profil på en varm, konkret og personlig måte
- forklare KONKRET hvorfor hvert anbefalt studie og yrke passer denne eleven
- gi realistisk karriereveiledning
- foreslå 3–5 konkrete neste steg tilpasset situasjonen
- nevne 1–3 forbehold eller realistiske begrensninger (obs_punkter)

DU SKAL IKKE:
- finne på studier, yrker eller bedrifter som ikke finnes i dataene
- overstyre anbefalingenes rangering eller scorer
- finne på opptakskrav som ikke er nevnt i dataene
- bruke generiske, ukonkrete fraser — vær spesifikk om denne elevens profil

Skriv på norsk bokmål.
Lyd som en erfaren karriereveileder — varm, konkret og ærlig.
Hold hvert avsnitt kort (2–4 setninger). Unngå overskrifter inni teksten.
"""


# ---------------------------------------------------------------------------
# Prompt-builder
# ---------------------------------------------------------------------------

def _bygg_user_prompt(ctx: dict) -> str:
    """
    Konverterer llm_context-dicten til et fokusert user-prompt.
    Inkluderer kun felter som faktisk finnes (defensivt).
    """
    linjer: list[str] = ["Her er EdPaths anbefalingsdata for denne eleven/studenten:\n"]

    # Brukertype
    linjer.append(f"Brukertype: {ctx.get('brukertype', 'elev')}")

    # Profil-sammendrag og styrker
    sammendrag = ctx.get("profil_sammendrag", "")
    styrker    = ctx.get("styrker", [])
    if sammendrag:
        linjer.append(f"\nProfilsammendrag (fra EdPath): {sammendrag}")
    if styrker:
        linjer.append(f"Styrker: {', '.join(styrker)}")

    # Topp karrieredimensjoner
    dims = ctx.get("topp_dimensjoner", [])
    if dims:
        dims_str = ", ".join(
            f"{d['navn']} ({round(d.get('score_norm', 0))}%)"
            if isinstance(d, dict)
            else str(d)
            for d in dims[:5]
        )
        linjer.append(f"\nTopp karrieredimensjoner: {dims_str}")

    # Topp sektorer
    sektorer = ctx.get("topp_sektorer", [])
    if sektorer:
        sekt_str = ", ".join(
            f"{s['sektor']} ({round(s.get('score_norm', 0))}%)"
            if isinstance(s, dict)
            else str(s)
            for s in sektorer[:3]
        )
        linjer.append(f"Topp sektorer: {sekt_str}")

    # Anbefalte yrker og studier
    yrker   = ctx.get("topp_yrker", [])
    studier = ctx.get("topp_studier", [])
    if yrker:
        linjer.append(f"\nAnbefalte yrker:   {', '.join(yrker[:3])}")
    if studier:
        linjer.append(f"Anbefalte studier: {', '.join(studier[:3])}")

    # Match-temaer
    temaer = ctx.get("match_temaer", [])
    if temaer:
        linjer.append(f"\nMatch-temaer som gikk igjen i anbefalingene: {', '.join(temaer[:6])}")

    # Preferanser (eksplisitte signaler fra eleven)
    pref = ctx.get("preferanser", {}) or {}
    bransjer      = pref.get("bransjer", []) if isinstance(pref, dict) else []
    pref_yrker    = pref.get("yrker", [])    if isinstance(pref, dict) else []
    pref_studier  = pref.get("studier", [])  if isinstance(pref, dict) else []

    if bransjer or pref_yrker or pref_studier:
        linjer.append("\nElevens egne preferanser (oppgitt i spørreskjemaet):")
        if bransjer:
            linjer.append(f"  - Bransjer:  {', '.join(bransjer)}")
        if pref_yrker:
            linjer.append(f"  - Yrker:     {', '.join(pref_yrker)}")
        if pref_studier:
            linjer.append(f"  - Studier:   {', '.join(pref_studier)}")

    # Instruksjon
    alle_anbefalte = list(dict.fromkeys(yrker[:3] + studier[:3]))  # dedup, bevar rekkefølge
    if alle_anbefalte:
        anbefalte_str = ", ".join(alle_anbefalte)
        linjer.append(
            f"\nLag én forklaring (hvorfor_dette_passer) for hvert av disse: {anbefalte_str}"
        )

    linjer.append(
        "\nGenerer nå et strukturert svar med: resultat_sammendrag, "
        "hvorfor_dette_passer, veien_videre og obs_punkter."
    )

    return "\n".join(linjer)


# ---------------------------------------------------------------------------
# Hoved-funksjon
# ---------------------------------------------------------------------------

def generate_llm_explanation(llm_context: dict) -> Optional[dict]:
    """
    Genererer strukturert forklaringstekst fra OpenAI basert på llm_context.

    Returnerer None hvis:
      - OPENAI_API_KEY er ikke satt
      - API-kall feiler (nettverksfeil, rate limit, o.l.)
      - Responsen ikke er gyldig JSON
      - Annen uventet feil

    Aldri kast exception oppover — anbefalingen skal alltid returneres.

    Args:
        llm_context: pre-computed metadata fra recommendation_engine

    Returns:
        dict | None:
            {
                "resultat_sammendrag": str,
                "hvorfor_dette_passer": [{"navn": str, "forklaring": str}, ...],
                "veien_videre":  [str, ...],
                "obs_punkter":   [str, ...],
            }
    """
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        logger.info("OPENAI_API_KEY ikke satt — hopper over LLM-forklaring")
        return None

    try:
        from openai import OpenAI  # lat import — ikke krev openai hvis nøkkel mangler

        client = OpenAI(api_key=api_key)
        user_prompt = _bygg_user_prompt(llm_context)

        logger.debug("LLM user-prompt:\n%s", user_prompt)

        response = client.responses.create(
            model="gpt-4.1-mini",
            input=[
                {"role": "developer", "content": _DEVELOPER_PROMPT},
                {"role": "user",      "content": user_prompt},
            ],
            text={
                "format": {
                    "type":   "json_schema",
                    "name":   "llm_resultat",
                    "strict": True,
                    "schema": _OUTPUT_SCHEMA,
                }
            },
        )

        raw_text = response.output_text
        result   = json.loads(raw_text)

        logger.info(
            "LLM-forklaring generert: %d ord, %d anbefalinger forklart, %d neste-steg",
            len(result.get("resultat_sammendrag", "").split()),
            len(result.get("hvorfor_dette_passer", [])),
            len(result.get("veien_videre", [])),
        )
        return result

    except ImportError:
        logger.warning("openai-pakken er ikke installert — hopper over LLM")
        return None
    except json.JSONDecodeError as exc:
        logger.warning("LLM returnerte ugyldig JSON: %s", exc)
        return None
    except Exception as exc:
        logger.warning("LLM-forklaring feilet (%s): %s", type(exc).__name__, exc)
        return None
