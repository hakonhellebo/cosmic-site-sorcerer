"""
llm_engine.py
=============
OpenAI-basert karriereveiledningsmotor for EdPath.

Mottar `llm_context` (pre-computed metadata) fra recommendation_engine og
genererer komplett, strukturert norsk karriereveiledning via GPT-4.1-mini.

Garantier:
  - Genererer ALDRI nye studier, yrker eller bedrifter utover hva som finnes
    i anbefalingsdataene
  - Overstyrer ALDRI match_score eller rangering
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
# Alle objekter krever additionalProperties:false + alle keys i required.
# ---------------------------------------------------------------------------

_PROFIL_SCHEMA = {
    "type": "object",
    "description": (
        "Personlig profilbeskrivelse for eleven. "
        "Hvert felt: 1–3 setninger, lyd som en menneskelig veileder. "
        "Referér elevens konkrete topp-dimensjoner — ikke generiske fraser."
    ),
    "properties": {
        "profil_sammendrag": {
            "type": "string",
            "description": (
                "2–3 setninger: hvem er eleven faglig og som person? "
                "Hva peker styrkesettet mot? Nevn konkrete dimensjoner. "
                "Unngå 'du er en allsidig person'."
            ),
        },
        "laringsstil": {
            "type": "string",
            "description": (
                "Én setning om hvordan denne eleven lærer best, "
                "koblet til topp-dimensjonene. "
                "Eks: 'Du lærer best gjennom systematisk analyse og teori — "
                "dybdelesing og forelesninger gir deg mye.'"
            ),
        },
        "arbeidsstil": {
            "type": "string",
            "description": (
                "Én setning om hvilken arbeidsform som passer. "
                "Eks: 'Du trives i strukturerte miljøer med klare mål "
                "og rom for faglig fordypning.'"
            ),
        },
        "motivasjonsstil": {
            "type": "string",
            "description": (
                "Én setning om hva som driver og motiverer eleven. "
                "Eks: 'Du drives av å forstå komplekse systemer i dybden "
                "og se at løsningene dine fungerer i praksis.'"
            ),
        },
        "karriere_orientering": {
            "type": "string",
            "description": (
                "Én setning om langsiktig karriereretning koblet til "
                "anbefalte sektorer. "
                "Eks: 'Profilen din peker tydelig mot en spesialistkarriere "
                "innen teknologi eller analyse.'"
            ),
        },
    },
    "required": [
        "profil_sammendrag", "laringsstil", "arbeidsstil",
        "motivasjonsstil", "karriere_orientering",
    ],
    "additionalProperties": False,
}

_OUTPUT_SCHEMA: dict = {
    "type": "object",
    "properties": {

        # ── 1. Personlig profil ──
        "profil": _PROFIL_SCHEMA,

        # ── 2. Styrker forklart ──
        "styrker_forklart": {
            "type": "array",
            "description": (
                "For hvert av elevens topp-dimensjoner: forklar KONKRET hva den "
                "dimensjonen betyr for akkurat denne eleven — ikke generell "
                "definisjon. Maks 4 dimensjoner."
            ),
            "items": {
                "type": "object",
                "properties": {
                    "dimensjon":  {"type": "string"},
                    "forklaring": {
                        "type": "string",
                        "description": (
                            "2–3 setninger. Forklar hva styrken betyr i praksis "
                            "for eleven og hvilke situasjoner den kommer til nytte."
                        ),
                    },
                },
                "required": ["dimensjon", "forklaring"],
                "additionalProperties": False,
            },
        },

        # ── 3. Anbefalinger forklart ──
        "hvorfor_anbefalinger": {
            "type": "array",
            "description": (
                "For hvert anbefalt studie og yrke: KONKRET forklaring på "
                "HVORFOR det passer denne eleven. Referér spesifikke dimensjoner. "
                "Ikke bare gjenfortell tittelen."
            ),
            "items": {
                "type": "object",
                "properties": {
                    "navn":  {"type": "string"},
                    "type":  {
                        "type": "string",
                        "description": "Enten 'studie' eller 'yrke'",
                    },
                    "forklaring": {
                        "type": "string",
                        "description": (
                            "2–3 setninger om KOBLINGEN mellom elevens profil "
                            "og denne anbefalingen. Vær spesifikk."
                        ),
                    },
                },
                "required": ["navn", "type", "forklaring"],
                "additionalProperties": False,
            },
        },

        # ── 4. Karriereveier ──
        "karriereveier": {
            "type": "array",
            "description": (
                "3–4 konkrete karriereveier fra anbefalingsdataene. "
                "Bygg veier av faktiske studier → yrker → bedrifter som "
                "finnes i dataene. Ikke finn på nye."
            ),
            "items": {
                "type": "object",
                "properties": {
                    "studie": {
                        "type": "string",
                        "description": "Navn på studiet (fra anbefalte studier)",
                    },
                    "yrke": {
                        "type": "string",
                        "description": "Navn på yrket (fra anbefalte yrker)",
                    },
                    "bedrifter": {
                        "type": "array",
                        "description": "2–3 eksempel-arbeidsgivere fra anbefalingsdataene",
                        "items": {"type": "string"},
                    },
                    "forklaring": {
                        "type": "string",
                        "description": "Én setning om denne karriereveienes relevans for eleven",
                    },
                },
                "required": ["studie", "yrke", "bedrifter", "forklaring"],
                "additionalProperties": False,
            },
        },

        # ── 5. Veien videre ──
        "veien_videre": {
            "type": "array",
            "description": (
                "4–6 konkrete, handlingsrettede råd for eleven akkurat nå. "
                "Tilpass til de faktiske anbefalingene (nevn spesifikke studier, "
                "yrker eller bedrifter). Ikke generiske råd."
            ),
            "items": {"type": "string"},
        },

        # ── 6. Obs-punkter ──
        "obs_punkter": {
            "type": "array",
            "description": (
                "2–3 realistiske forbehold: karakterkrav, konkurranse om plasser, "
                "usikkerhet om veivalg, o.l. Vær ærlig men konstruktiv."
            ),
            "items": {"type": "string"},
        },

        # ── 7. Alternative retninger ──
        "alternative_retninger": {
            "type": "array",
            "description": (
                "2–3 sektorer eller retninger eleven OGSÅ kan vurdere, "
                "utover de primære anbefalingene. Basert på sekundære "
                "dimensjoner i profilen."
            ),
            "items": {
                "type": "object",
                "properties": {
                    "sektor": {
                        "type": "string",
                        "description": "Sektornavn på norsk",
                    },
                    "forklaring": {
                        "type": "string",
                        "description": (
                            "1–2 setninger om hvorfor denne sektoren "
                            "kan passe eleven som et alternativ"
                        ),
                    },
                },
                "required": ["sektor", "forklaring"],
                "additionalProperties": False,
            },
        },
    },
    "required": [
        "profil",
        "styrker_forklart",
        "hvorfor_anbefalinger",
        "karriereveier",
        "veien_videre",
        "obs_punkter",
        "alternative_retninger",
    ],
    "additionalProperties": False,
}


# ---------------------------------------------------------------------------
# System-prompt
# ---------------------------------------------------------------------------

_DEVELOPER_PROMPT = """\
Du er en digital karriereveileder for EdPath, en norsk plattform for utdanning \
og karriereveiledning rettet mot elever og studenter.

Du mottar strukturert anbefalingsdata og skal generere komplett, personlig \
karriereveiledning på norsk bokmål.

GRUNNLEGGENDE REGLER:
- Bruk KUN studier, yrker og bedrifter som finnes i dataene — finn aldri på nye
- Referér konkret til elevens topp-dimensjoner i alle forklaringer
- Skriv som en erfaren menneskelig karriereveileder — varm, konkret, ærlig
- Unngå generiske fraser som "du er en allsidig person" eller "du liker å jobbe"
- Hold hvert felt kort: 1–3 setninger per felt, 2–3 per forklaring

PROFIL-FELTENE:
Hvert felt skal føles personlig og skrevet for akkurat denne eleven.
Referér til faktiske dimensjoner og sektorer.

STYRKER_FORKLART:
Forklar hva styrken betyr I PRAKSIS for eleven — ikke definisjoner.

HVORFOR_ANBEFALINGER:
Forklar KOBLINGEN mellom elevens profil og anbefalingen — ikke bare beskriv.

KARRIEREVEIER:
Bygg realistiske veier fra studier til yrke. Bruk faktiske bedrifter fra dataene.

VEIEN_VIDERE:
Gi spesifikke råd — nevn faktiske studier, yrker, bedrifter fra dataene.

ALTERNATIVE_RETNINGER:
Basér alternativer på sekundære dimensjoner (score 40–70%).
"""


# ---------------------------------------------------------------------------
# Prompt-builder
# ---------------------------------------------------------------------------

def _bygg_user_prompt(ctx: dict) -> str:
    """
    Konverterer llm_context til et strukturert, informasjonstett prompt.
    Inkluderer bare felter som faktisk finnes.
    """
    linjer: list[str] = [
        "ANBEFALINGSDATA FRA EDPATH — bruk KUN disse dataene:\n"
    ]

    bt = ctx.get("brukertype", "elev")
    linjer.append(f"Brukertype: {bt}\n")

    # Topp-dimensjoner med score
    dims = ctx.get("topp_dimensjoner", [])
    if dims:
        linjer.append("TOPP-DIMENSJONER (styrker):")
        for d in dims[:5]:
            if isinstance(d, dict):
                linjer.append(f"  - {d['navn']}: {round(d.get('score_norm', 0))}%")
            else:
                linjer.append(f"  - {d}")
        linjer.append("")

    # Topp-sektorer
    sektorer = ctx.get("topp_sektorer", [])
    if sektorer:
        linjer.append("TOPP-SEKTORER:")
        for s in sektorer[:3]:
            if isinstance(s, dict):
                linjer.append(f"  - {s['sektor']}: {round(s.get('score_norm', 0))}%")
            else:
                linjer.append(f"  - {s}")
        linjer.append("")

    # Anbefalte studier (med sektor)
    alle_studier = ctx.get("alle_studier", [])
    if alle_studier:
        linjer.append("ANBEFALTE STUDIER:")
        for s in alle_studier[:5]:
            if isinstance(s, dict):
                linjer.append(f"  - {s['navn']} ({s.get('sektor', '')})")
            else:
                linjer.append(f"  - {s}")
        linjer.append("")

    # Anbefalte yrker (med sektor)
    alle_yrker = ctx.get("alle_yrker", [])
    if alle_yrker:
        linjer.append("ANBEFALTE YRKER:")
        for y in alle_yrker[:5]:
            if isinstance(y, dict):
                linjer.append(f"  - {y['navn']} ({y.get('sektor', '')})")
            else:
                linjer.append(f"  - {y}")
        linjer.append("")

    # Anbefalte bedrifter (med sektor)
    alle_bedrifter = ctx.get("alle_bedrifter", [])
    if alle_bedrifter:
        linjer.append("TILGJENGELIGE BEDRIFTER (bruk disse i karriereveier):")
        for b in alle_bedrifter[:5]:
            if isinstance(b, dict):
                linjer.append(f"  - {b['navn']} ({b.get('sektor', '')})")
            else:
                linjer.append(f"  - {b}")
        linjer.append("")

    # Styrker fra statisk profil
    styrker = ctx.get("styrker", [])
    if styrker:
        linjer.append(f"Identifiserte styrker: {', '.join(styrker)}")

    # Match-temaer
    temaer = ctx.get("match_temaer", [])
    if temaer:
        linjer.append(f"Match-temaer på tvers: {', '.join(temaer[:6])}")

    # Preferanser
    pref = ctx.get("preferanser", {}) or {}
    if isinstance(pref, dict):
        bransjer     = pref.get("bransjer", [])
        pref_yrker   = pref.get("yrker", [])
        pref_studier = pref.get("studier", [])
        if bransjer or pref_yrker or pref_studier:
            linjer.append("\nElevens egne preferanser:")
            if bransjer:
                linjer.append(f"  Bransjer: {', '.join(bransjer)}")
            if pref_yrker:
                linjer.append(f"  Yrker: {', '.join(pref_yrker)}")
            if pref_studier:
                linjer.append(f"  Studier: {', '.join(pref_studier)}")

    linjer.append(
        "\nGenerer nå komplett karriereveiledning med alle 7 felt: "
        "profil, styrker_forklart, hvorfor_anbefalinger, karriereveier, "
        "veien_videre, obs_punkter, alternative_retninger."
    )

    return "\n".join(linjer)


# ---------------------------------------------------------------------------
# Hoved-funksjon
# ---------------------------------------------------------------------------

def generate_llm_explanation(llm_context: dict) -> Optional[dict]:
    """
    Genererer komplett AI-karriereveiledning fra OpenAI basert på llm_context.

    Returnerer None (uten krasj) hvis:
      - OPENAI_API_KEY er ikke satt
      - openai-pakken er ikke installert
      - API-kall feiler (nettverksfeil, rate limit, o.l.)
      - Responsen ikke er gyldig JSON

    Args:
        llm_context: pre-computed metadata fra recommendation_engine

    Returns:
        dict | None med 7 felter:
          profil, styrker_forklart, hvorfor_anbefalinger,
          karriereveier, veien_videre, obs_punkter, alternative_retninger
    """
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        logger.info("OPENAI_API_KEY ikke satt — hopper over LLM")
        return None

    try:
        from openai import OpenAI  # lat import

        client      = OpenAI(api_key=api_key)
        user_prompt = _bygg_user_prompt(llm_context)

        logger.debug("LLM prompt (%d tegn)", len(user_prompt))

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

        result = json.loads(response.output_text)

        logger.info(
            "LLM OK — styrker: %d | anbefalinger: %d | karriereveier: %d | "
            "neste-steg: %d | obs: %d | alternativer: %d",
            len(result.get("styrker_forklart", [])),
            len(result.get("hvorfor_anbefalinger", [])),
            len(result.get("karriereveier", [])),
            len(result.get("veien_videre", [])),
            len(result.get("obs_punkter", [])),
            len(result.get("alternative_retninger", [])),
        )
        return result

    except ImportError:
        logger.warning("openai-pakken ikke installert — hopper over LLM")
        return None
    except json.JSONDecodeError as exc:
        logger.warning("LLM returnerte ugyldig JSON: %s", exc)
        return None
    except Exception as exc:
        logger.warning("LLM feilet (%s): %s", type(exc).__name__, exc)
        return None
