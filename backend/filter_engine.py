"""
filter_engine.py
================
Filtermotor for rammevariabler (snitt, geografi, flyttevillighet).
Kjøres ETTER grunnscoringen — ikke del av dimensjonsscoring.

TODO:
  - Region-basert studiested-filtrering (trenger campus-data per studie)
  - Per-studie opptakskrav fra Poenggrenser_data.xlsx
  - Studielengde, gradstype, kravfag
"""

from __future__ import annotations

import logging
from typing import Any

logger = logging.getLogger(__name__)

# Sektorer som krever høyt snitt (fallback inntil per-studie krav er på plass)
_HOYPRESTIGE_SEKTORER: set[str] = {
    "Helse og omsorg",
    "Jus og rettsvesen",
    "Ingeniør og teknisk",
    "IT og teknologi",
}

# option_values som indikerer svakt snitt (v2-format + legacy)
_LAVT_SNITT_OPTION_VALUES: set[str] = {
    "1_2",
    "svake_karakterer",
    "svake karakterer",
}

_COUNTY_TIL_REGION: dict[str, str] = {
    "ostlandet":            "Østlandet",
    "oslo_og_omegn":        "Oslo og omegn",
    "bergen_vestlandet":    "Bergen/Vestlandet",
    "trondheim_trondelag":  "Trondheim/Trøndelag",
    "nord_norge":           "Nord-Norge",
    "sorlandet":            "Sørlandet",
}

_LOKAL_TILKNYTNING: set[str] = {"lokal_tilknytning"}
_MODERAT_FLEKSIBILITET: set[str] = {"moderat_fleksibilitet"}


def filtrer_anbefalinger(anbefalinger: dict[str, Any], filter_data: dict[str, Any]) -> dict[str, Any]:
    if not filter_data:
        return anbefalinger
    resultat = dict(anbefalinger)
    resultat = _filtrer_snitt(resultat, filter_data)
    resultat = _filtrer_geografi(resultat, filter_data)
    return resultat


def _filtrer_snitt(anbefalinger: dict[str, Any], filter_data: dict[str, Any]) -> dict[str, Any]:
    snitt_raw = filter_data.get("grade_average")
    if not snitt_raw:
        return anbefalinger
    snitt_verdier: list[str] = snitt_raw if isinstance(snitt_raw, list) else [snitt_raw]
    har_lavt_snitt = any(
        str(v).strip().lower() in {s.lower() for s in _LAVT_SNITT_OPTION_VALUES}
        for v in snitt_verdier
    )
    if not har_lavt_snitt:
        return anbefalinger

    logger.info("filter_engine: lavt snitt — fjerner høyprestige-sektorer")

    def _fjern(lst: list[dict]) -> list[dict]:
        return [item for item in lst if item.get("sektor") not in _HOYPRESTIGE_SEKTORER]

    return {
        **anbefalinger,
        "yrker":     _fjern(anbefalinger.get("yrker", [])),
        "studier":   _fjern(anbefalinger.get("studier", [])),
        "bedrifter": _fjern(anbefalinger.get("bedrifter", [])),
    }


def _filtrer_geografi(anbefalinger: dict[str, Any], filter_data: dict[str, Any]) -> dict[str, Any]:
    county_raw = filter_data.get("county")
    move_raw = filter_data.get("willing_to_move")
    if not county_raw and not move_raw:
        return anbefalinger

    county_val: str | None = None
    if county_raw:
        verdier = county_raw if isinstance(county_raw, list) else [county_raw]
        county_val = str(verdier[0]).strip() if verdier else None

    move_val: str | None = None
    if move_raw:
        verdier = move_raw if isinstance(move_raw, list) else [move_raw]
        move_val = str(verdier[0]).strip() if verdier else None

    region_label = _COUNTY_TIL_REGION.get(county_val or "", None)

    if move_val in _LOKAL_TILKNYTNING and region_label:
        logger.info("filter_engine: lokal tilknytning '%s'. TODO: filtrer studiesteder.", region_label)

    # TODO: implementer faktisk region-filtrering mot studiested-data
    return anbefalinger


def hent_aktive_filterregler(filter_data: dict[str, Any]) -> list[str]:
    aktive: list[str] = []
    if filter_data.get("grade_average"):
        aktive.append(f"grade_average={filter_data['grade_average']}")
    if filter_data.get("county"):
        aktive.append(f"county={filter_data['county']}")
    if filter_data.get("willing_to_move"):
        aktive.append(f"willing_to_move={filter_data['willing_to_move']}")
    return aktive
