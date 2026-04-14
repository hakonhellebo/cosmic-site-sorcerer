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

Output-struktur:
  {
    "profil": {
      "profil_sammendrag":   str,  # hvem eleven er faglig og personlig
      "laringsstil":         str,  # hvordan eleven lærer best
      "arbeidsstil":         str,  # hvilken arbeidsform som passer
      "motivasjonsstil":     str,  # hva som driver og motiverer eleven
      "karriere_orientering": str, # langsiktig karriereretning
    },
    "hvorfor_dette_passer": [{"navn": str, "forklaring": str}, ...],
    "veien_videre":  [str, ...],
    "obs_punkter":   [str, ...],
  }
"""

from __future__ import annotations

import json
import logging
import os
from typing import Optional

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# JSON-schema for strukturert LLM-output (OpenAI strict mode)
# Alle objekter krever additionalProperties:false + alle keys i required.
# ---------------------------------------------------------------------------

_OUTPUT_SCHEMA: dict = {
    "type": "object",
    "properties": {

        # ── Personlig profilbeskrivelse (erstatter statiske maler) ──
        "profil": {
            "type": "object",
            "description": (
                "Personlig profilbeskrivelse generert fra elevens dimensjoner "
                "og anbefalinger. Hvert felt skal lyde som skrevet av en erfaren "
                "karriereveileder, ikke som en automatisk mal."
            ),
            "properties": {
                "profil_sammendrag": {
                    "type": "string",
                    "description": (
                        "2–3 setninger som oppsummerer hvem eleven er faglig og personlig. "
                        "Nevn konkrete styrker og hva de naturlig peker mot. "
                        "Vær spesifikk — unngå fraser som 'du er en allsidig person'."
                    ),
                },
                "laringsstil": {
                    "type": "string",
                    "description": (
                        "Én setning om hvordan denne eleven lærer best, "
                        "basert på topp-dimensjonene. "
                        "Eksempel: 'Du lærer best gjennom analyse og systematisk fordypning — "
                        "forelesninger og pensumlitteratur gir deg mye.'"
                    ),
                },
                "arbeidsstil": {
                    "type": "string",
                    "description": (
                        "Én setning om hvilken type arbeidsmiljø og arbeidsform "
                        "som passer denne eleven. "
                        "Eksempel: 'Du trives i strukturerte miljøer der du kan jobbe "
                        "konsentrert, gjerne med klare mål og faglig dybde.'"
                    ),
                },
                "motivasjonsstil": {
                    "type": "string",
                    "description": (
                        "Én setning om hva som motiverer og driver eleven. "
                        "Eksempel: 'Du drives av å forstå systemer i dybden og se "
                        "at løsningene dine faktisk fungerer i praksis.'"
                    ),
                },
                "karriere_orientering": {
                    "type": "string",
                    "description": (
                        "Én setning om langsiktig karriereretning og ambisjoner, "
                        "koblet til de anbefalte sektorene. "
                        "Eksempel: 'Profilen din peker tydelig mot en faglig karriere "
                        "innen teknologi eller analyse, der du kan vokse som spesialist.'"
                    ),
                },
            },
            "required": [
                "profil_sammendrag",
                "laringsstil",
                "arbeidsstil",
                "motivasjonsstil",
                "karriere_orientering",
            ],
            "additionalProperties": False,
        },

        # ── Forklaring per anbefalt studie/yrke ──
        "hvorfor_dette_passer": {
            "type": "array",
            "description": (
                "For hvert av de anbefalte studiene og yrkene: "
                "konkret forklaring på HVORFOR akkurat det passer denne eleven. "
                "Nevn spesifikke dimensjoner eller egenskaper. "
                "Ikke gjenta tittelen — forklar koblingen til elevens profil."
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

        # ── Konkrete neste steg ──
        "veien_videre": {
            "type": "array",
            "description": (
                "3–5 konkrete, handlingsrettede råd eleven bør følge nå. "
                "Hvert råd skal være spesifikt og praktisk — ikke generisk. "
                "Eksempel: 'Sjekk opptakskrav for Informatikk på samordnaopptak.no' "
                "ikke 'Søk mer informasjon om studier'."
            ),
            "items": {"type": "string"},
        },

        # ── Realistiske forbehold ──
        "obs_punkter": {
            "type": "array",
            "description": (
                "1–3 realistiske forbehold eleven bør være klar over: "
                "karakterkrav, konkurranse om plasser, usikkerhet om veivalg, "
                "eller om anbefalingene er brede. Vær ærlig men konstruktiv."
            ),
            "items": {"type": "string"},
        },
    },
    "required": [
        "profil",
        "hvorfor_dette_passer",
        "veien_videre",
        "obs_punkter",
    ],
    "additionalProperties": False,
}


# ---------------------------------------------------------------------------
# System-prompt
# ---------------------------------------------------------------------------

_DEVELOPER_PROMPT = """\
Du er en digital karriereveileder for EdPath, en norsk plattform for utdanning \
og karriereveiledning.

Du mottar strukturert anbefalingsdata om en elev og skal skrive personlig, \
varm og presis karrieretekst på norsk bokmål.

PROFIL-FELTENE skal:
- Lyde som skrevet av en erfaren menneskelig veileder, ikke en algoritme
- Referere konkret til elevens faktiske topp-dimensjoner og anbefalinger
- Unngå generiske fraser som "du er en allsidig person" eller "du er flink til mye"
- Hvert felt: 1–3 setninger. Kortfattet og tydelig.

HVORFOR_DETTE_PASSER skal:
- Forklare den KONKRETE koblingen mellom elevens profil og hvert studie/yrke
- Nevne spesifikke dimensjoner (f.eks. analytisk tankegang, teknologiinteresse)
- Ikke bare gjenta tittelen — forklar HVORFOR det passer akkurat denne eleven

VEIEN_VIDERE skal:
- Gi 3–5 spesifikke, handlingsrettede råd (ikke generiske)
- Tilpasses de konkrete anbefalingene og preferansene i dataene
- Inkludere praktiske neste steg (sjekke opptakskrav, snakke med rådgiver, osv.)

OBS_PUNKTER skal:
- Nevne realistiske forbehold uten å være nedslående
- Informere om karakterkrav, konkurranse eller bredde i anbefalingene hvis relevant

DU SKAL IKKE:
- Finne på studier, yrker eller bedrifter som ikke finnes i dataene
- Overstyre anbefalingenes rangering
- Finne på opptakskrav som ikke er nevnt
- Bruke overskrifter eller markdown i teksten
"""


# ---------------------------------------------------------------------------
# Prompt-builder
# ---------------------------------------------------------------------------

def _bygg_user_prompt(ctx: dict) -> str:
    """
    Konverterer llm_context til et fokusert, informasjonstett user-prompt.
    Kun felter som faktisk finnes inkluderes (defensivt).
    """
    linjer: list[str] = ["ANBEFALINGSDATA FRA EDPATH:\n"]

    bt = ctx.get("brukertype", "elev")
    linjer.append(f"Brukertype: {bt}")

    # Topp-dimensjoner (det viktigste signalet for profilering)
    dims = ctx.get("topp_dimensjoner", [])
    if dims:
        dims_str = ", ".join(
            f"{d['navn']} ({round(d.get('score_norm', 0))}%)"
            if isinstance(d, dict) else str(d)
            for d in dims[:5]
        )
        linjer.append(f"\nTopp karrieredimensjoner: {dims_str}")

    # Topp-sektorer
    sektorer = ctx.get("topp_sektorer", [])
    if sektorer:
        sekt_str = ", ".join(
            f"{s['sektor']} ({round(s.get('score_norm', 0))}%)"
            if isinstance(s, dict) else str(s)
            for s in sektorer[:3]
        )
        linjer.append(f"Topp sektorer: {sekt_str}")

    # Anbefalte yrker og studier
    yrker   = ctx.get("topp_yrker", [])
    studier = ctx.get("topp_studier", [])
    if yrker:
        linjer.append(f"\nAnbefalte yrker (topp 3):   {', '.join(yrker[:3])}")
    if studier:
        linjer.append(f"Anbefalte studier (topp 3): {', '.join(studier[:3])}")

    # Styrker fra statisk profil-engine (hjelper LLM å forstå profilen)
    styrker = ctx.get("styrker", [])
    if styrker:
        linjer.append(f"\nIdentifiserte styrker: {', '.join(styrker)}")

    # Match-temaer
    temaer = ctx.get("match_temaer", [])
    if temaer:
        linjer.append(f"Match-temaer: {', '.join(temaer[:6])}")

    # Preferanser
    pref         = ctx.get("preferanser", {}) or {}
    bransjer     = pref.get("bransjer", []) if isinstance(pref, dict) else []
    pref_yrker   = pref.get("yrker", [])    if isinstance(pref, dict) else []
    pref_studier = pref.get("studier", [])  if isinstance(pref, dict) else []

    if bransjer or pref_yrker or pref_studier:
        linjer.append("\nElevens egne preferanser:")
        if bransjer:
            linjer.append(f"  Bransjer:  {', '.join(bransjer)}")
        if pref_yrker:
            linjer.append(f"  Yrker:     {', '.join(pref_yrker)}")
        if pref_studier:
            linjer.append(f"  Studier:   {', '.join(pref_studier)}")

    # Instruksjon til LLM om hva som forventes
    alle_anbefalte = list(dict.fromkeys(yrker[:3] + studier[:3]))
    if alle_anbefalte:
        linjer.append(
            f"\nLag én 'hvorfor_dette_passer'-forklaring for hvert av disse: "
            f"{', '.join(alle_anbefalte)}"
        )

    linjer.append(
        "\nGenerer nå et JSON-svar med: profil (alle 5 felt), "
        "hvorfor_dette_passer, veien_videre og obs_punkter."
    )

    return "\n".join(linjer)


# ---------------------------------------------------------------------------
# Hoved-funksjon
# ---------------------------------------------------------------------------

def generate_llm_explanation(llm_context: dict) -> Optional[dict]:
    """
    Genererer strukturert forklaringstekst og profilbeskrivelse fra OpenAI.

    Returnerer None (uten krasj) hvis:
      - OPENAI_API_KEY er ikke satt
      - openai-pakken er ikke installert
      - API-kall feiler (nettverksfeil, rate limit, o.l.)
      - Responsen ikke er gyldig JSON

    Args:
        llm_context: pre-computed metadata fra recommendation_engine

    Returns:
        dict | None med struktur:
          {
            "profil": {
              "profil_sammendrag": str,
              "laringsstil": str,
              "arbeidsstil": str,
              "motivasjonsstil": str,
              "karriere_orientering": str,
            },
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
        from openai import OpenAI  # lat import — ikke krev pakken hvis nøkkel mangler

        client      = OpenAI(api_key=api_key)
        user_prompt = _bygg_user_prompt(llm_context)

        logger.debug("LLM user-prompt (%d tegn):\n%s", len(user_prompt), user_prompt)

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

        profil = result.get("profil", {})
        logger.info(
            "LLM OK — profil: %d ord | forklaringer: %d | neste-steg: %d | obs: %d",
            len(profil.get("profil_sammendrag", "").split()),
            len(result.get("hvorfor_dette_passer", [])),
            len(result.get("veien_videre", [])),
            len(result.get("obs_punkter", [])),
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
