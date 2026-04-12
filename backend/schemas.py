"""
schemas.py — Pydantic-modeller for EdPath API.
"""

from typing import Any, Union
from pydantic import BaseModel


class BrukerSvar(BaseModel):
    svar: dict[str, Union[str, int, float, list[Any]]]


class ScoringResultat(BaseModel):
    dimensjon_scores: dict[str, float]
    filter_data: dict[str, Any]


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


class AnbefalingRespons(BaseModel):
    dimensjoner: list[DimensjonItem]
    topp_sektorer: list[SektorItem]
    yrker: list[AnbefalingItem]
    studier: list[AnbefalingItem]
    bedrifter: list[AnbefalingItem]
