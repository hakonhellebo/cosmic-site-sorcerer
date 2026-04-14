"""
schemas.py — Pydantic-modeller for EdPath API v2.1
"""

from typing import Any, Optional, Union
from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Input
# ---------------------------------------------------------------------------

class BrukerSvar(BaseModel):
    svar: dict[str, Union[str, int, float, list[Any]]]


# ---------------------------------------------------------------------------
# Internt: scoring-resultat
# ---------------------------------------------------------------------------

class PreferanseSignaler(BaseModel):
    """Eksplisitte preferansesignaler fra brukeren (soft signals)."""
    studie_interesse: list[str] = Field(default_factory=list)   # studier brukeren allerede vurderer
    yrke_interesse: list[str] = Field(default_factory=list)     # yrker brukeren er nysgjerrig på
    bedrift_interesse: list[str] = Field(default_factory=list)  # bedrifter brukeren liker
    bransje_interesse: list[str] = Field(default_factory=list)  # bransjer/sektorer brukeren trekkes mot


class ScoringResultat(BaseModel):
    dimensjon_scores: dict[str, float]
    filter_data: dict[str, Any]
    preferanse_signaler: PreferanseSignaler = Field(default_factory=PreferanseSignaler)


# ---------------------------------------------------------------------------
# Output: profil
# ---------------------------------------------------------------------------

class ProfilBeskrivelse(BaseModel):
    """Menneskelig lesbar profilbeskrivelse på norsk."""
    profil_sammendrag: str
    styrker: list[str]
    laringsstil: str
    arbeidsstil: str
    motivasjonsstil: str
    karriere_orientering: str = ""


# ---------------------------------------------------------------------------
# Output: anbefalinger
# ---------------------------------------------------------------------------

class DimensjonItem(BaseModel):
    navn: str
    score: float


class SektorItem(BaseModel):
    sektor: str
    underkategori: str
    score: float


class AnbefalingItem(BaseModel):
    navn: str
    sektor: str
    underkategori: str = ""
    match_score: float = 0.0          # sammensatt matchscore (0–100)
    preferanse_boost: bool = False    # True hvis fremmet pga. eksplisitt preferanse
    match_reasons: list[str] = Field(default_factory=list)  # topp-dimensjoner bak anbefalingen


# ---------------------------------------------------------------------------
# Output: grupperte anbefalinger (én gruppe per sektor)
# ---------------------------------------------------------------------------

class StudieGruppe(BaseModel):
    """Én sektorgruppe med studier."""
    kategori: str                           # sektornavn (f.eks. "IT og teknologi")
    studier: list[AnbefalingItem] = Field(default_factory=list)


class YrkeGruppe(BaseModel):
    """Én sektorgruppe med yrker."""
    kategori: str
    yrker: list[AnbefalingItem] = Field(default_factory=list)


class BedriftGruppe(BaseModel):
    """Én sektorgruppe med bedrifter."""
    kategori: str
    bedrifter: list[AnbefalingItem] = Field(default_factory=list)


# ---------------------------------------------------------------------------
# Output: LLM-forklaring
# ---------------------------------------------------------------------------

class LLMForklaring(BaseModel):
    """Én anbefaling forklart av LLM-en."""
    navn: str
    forklaring: str


class LLMProfil(BaseModel):
    """
    Personlig profilbeskrivelse generert av LLM-en.
    Erstatter de statiske malene fra profil_engine når OPENAI_API_KEY er satt.
    Frontend bruker disse feltene fremfor ProfilBeskrivelse når de finnes.
    """
    profil_sammendrag:    str   # hvem eleven er faglig og personlig (2–3 setninger)
    laringsstil:          str   # hvordan eleven lærer best (1 setning)
    arbeidsstil:          str   # hvilken arbeidsform som passer (1 setning)
    motivasjonsstil:      str   # hva som driver og motiverer eleven (1 setning)
    karriere_orientering: str   # langsiktig karriereretning (1 setning)


class LLMResultat(BaseModel):
    """
    Strukturert forklaringstekst generert av GPT.

    Legges til som `llm_resultat` i API-responsen.
    Er None hvis OPENAI_API_KEY ikke er satt eller kallet feiler.

    Frontend-prioritet:
      Bruk llm_resultat.profil.* hvis tilgjengelig,
      fall tilbake på profil.* (statisk) ellers.
    """
    profil:               LLMProfil
    hvorfor_dette_passer: list[LLMForklaring] = Field(default_factory=list)
    veien_videre:         list[str] = Field(default_factory=list)
    obs_punkter:          list[str] = Field(default_factory=list)


class AnbefalingRespons(BaseModel):
    dimensjoner: list[DimensjonItem]
    topp_sektorer: list[SektorItem]
    # Flate lister — bakoverkompatible
    yrker: list[AnbefalingItem]
    studier: list[AnbefalingItem]
    bedrifter: list[AnbefalingItem]
    # Grupperte lister — primær UX-struktur (én gruppe per sektor)
    studier_grupper: list[StudieGruppe] = Field(default_factory=list)
    yrker_grupper: list[YrkeGruppe] = Field(default_factory=list)
    bedrifter_grupper: list[BedriftGruppe] = Field(default_factory=list)
    profil: ProfilBeskrivelse
    preferanser: PreferanseSignaler
    # LLM-forklaring — valgfri (None hvis API-nøkkel mangler eller kall feiler)
    llm_resultat: Optional[LLMResultat] = None
