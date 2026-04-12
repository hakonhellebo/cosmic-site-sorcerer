"""
schemas.py — Pydantic-modeller for EdPath API v2.1
"""

from typing import Any, Union
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
    match_score: float = 0.0     # sammensatt matchscore (0–100)
    preferanse_boost: bool = False  # True hvis fremmet pga. eksplisitt preferanse


class AnbefalingRespons(BaseModel):
    dimensjoner: list[DimensjonItem]
    topp_sektorer: list[SektorItem]
    yrker: list[AnbefalingItem]
    studier: list[AnbefalingItem]
    bedrifter: list[AnbefalingItem]
    profil: ProfilBeskrivelse
    preferanser: PreferanseSignaler
