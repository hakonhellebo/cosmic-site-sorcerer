"""
mapping_engine.py
=================
Mapper dimensjonsscorer til sektorer og underkategorier.
Kildefil: backend/data/dimensjon_sektor_mapping.xlsx
"""

from __future__ import annotations

import logging
import unicodedata
from functools import lru_cache
from pathlib import Path

import pandas as pd

logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).parent
DATA_DIR = BASE_DIR / "data"
_MAPPING_FP = DATA_DIR / "dimensjon_sektor_mapping.xlsx"

# Eksplisitte overrides: normalisert v2-dimensjonsnavn → mapping-filens Dimensjon
_DIMENSJON_OVERRIDES: dict[str, str] = {
    "kunst og design":          "Kunst/design",
    "miljo":                    "Bærekraft",
    "miljø":                    "Bærekraft",
    "sprak og kultur":          "Språk",
    "språk og kultur":          "Språk",
    "helse":                    "Helse",
    "helseinteresse":           "Helseinteresse",
    "tverrfaglig":              "Analytisk",
    "kritisk tenkning":         "Analytisk",
    "problemlosning":           "Analytisk",
    "problemløsning":           "Analytisk",
    "teknologisk forstaelse":   "Teknologi",
    "teknologisk forståelse":   "Teknologi",
    "kreativitet":              "Kreativitet",
    "ledelse":                  "Ambisjon",
    "planlegging":              "Struktur",
    "samarbeid":                "Sosialitet",
    "empati":                   "Sosialitet",
    "kommunikasjon":            "Sosialitet",
    "praktisk":                 "Praktisk",
    "strukturert":              "Struktur",
    "selvstendig":              "Selvstendighet",
    "sosial":                   "Sosialitet",
    "fleksibel":                "Fleksibilitet",
    "fleksibilitet":            "Fleksibilitet",
    "prestasjon":               "Ambisjon",
    "stabilitet":               "Struktur",
    "mening":                   "Sosialitet",
    "leder":                    "Ambisjon",
    "grunder":                  "Ambisjon",
    "gründer":                  "Ambisjon",
    "spesialist":               "Teknologi",
    "yrkesnaerhet":             "Praktisk",
    "yrkesnærhet":              "Praktisk",
}


def _strip_diakritika(tekst: str) -> str:
    nfkd = unicodedata.normalize("NFKD", tekst)
    return "".join(c for c in nfkd if not unicodedata.combining(c))


def _normaliser_dim(tekst: str) -> str:
    return _strip_diakritika(tekst).lower().strip()


@lru_cache(maxsize=None)
def _last_mapping() -> dict[str, list[tuple[str, str, float]]]:
    if not _MAPPING_FP.exists():
        raise FileNotFoundError(f"Finner ikke mapping-fil: {_MAPPING_FP}")

    df = pd.read_excel(_MAPPING_FP)
    df.columns = [str(c).strip() for c in df.columns]

    mapping: dict[str, list[tuple[str, str, float]]] = {}
    for _, row in df.iterrows():
        dim_rå = str(row["Dimensjon"]).strip()
        sektor = str(row["Sektor"]).strip()
        underkat = (
            str(row["Underkategori"]).strip()
            if pd.notna(row.get("Underkategori")) and row.get("Underkategori")
            else ""
        )
        vekt = float(row.get("Vekt", 1)) if pd.notna(row.get("Vekt")) else 1.0
        dim_norm = _normaliser_dim(dim_rå)
        mapping.setdefault(dim_norm, []).append((sektor, underkat, vekt))

    for dim in mapping:
        mapping[dim].sort(key=lambda x: x[2], reverse=True)

    logger.info("mapping_engine: lastet %d dimensjoner", len(mapping))
    return mapping


def _finn_mapping_key(dimension_label: str) -> str | None:
    mapping = _last_mapping()
    norm = _normaliser_dim(dimension_label)
    if norm in _DIMENSJON_OVERRIDES:
        target = _normaliser_dim(_DIMENSJON_OVERRIDES[norm])
        if target in mapping:
            return target
    if norm in mapping:
        return norm
    return None


def map_til_sektorer(dimensjon_scores: dict[str, float], topp_n: int = 8) -> list[tuple[str, str, float]]:
    mapping = _last_mapping()
    score_map: dict[tuple[str, str], float] = {}

    for dim_label, dim_score in dimensjon_scores.items():
        if dim_score <= 0:
            continue
        key = _finn_mapping_key(dim_label)
        if key is None:
            continue
        for sektor, underkat, vekt in mapping[key]:
            bucket = (sektor, underkat)
            score_map[bucket] = score_map.get(bucket, 0.0) + dim_score * vekt

    rangert = sorted(score_map.items(), key=lambda x: x[1], reverse=True)
    return [
        (sektor, underkat, round(score, 2))
        for (sektor, underkat), score in rangert[:topp_n]
    ]
