"""
recommendation_engine.py
========================
Full pipeline: svar → dimensjoner → sektorer → anbefalinger → filtrert respons.
Hoveddatakilde: backend/data/connections-sortert.xlsx
"""

from __future__ import annotations

import logging
from functools import lru_cache
from pathlib import Path
from typing import Any

import pandas as pd

from filter_engine import filtrer_anbefalinger, hent_aktive_filterregler
from mapping_engine import map_til_sektorer
from scoring_engine import scorer_svar, topp_dimensjoner

logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).parent
DATA_DIR = BASE_DIR / "data"


class _ConnectionsSortert:
    def __init__(self, fp: Path) -> None:
        xl = pd.ExcelFile(fp)
        self._ark: dict[str, pd.DataFrame] = {}
        for sheet in xl.sheet_names:
            df = pd.read_excel(fp, sheet_name=sheet)
            df.columns = [str(c).strip() for c in df.columns]
            self._ark[sheet] = df
        self._ark_navn = list(self._ark.keys())
        logger.info("connections: %d sektorer lastet", len(self._ark_navn))

    def alle_sektorer(self) -> list[str]:
        return self._ark_navn

    def _finn_ark(self, sektor: str) -> str | None:
        if sektor in self._ark:
            return sektor
        sl = sektor.lower()
        for navn in self._ark_navn:
            if sl in navn.lower() or navn.lower() in sl:
                return navn
        return None

    def _hent_kolonne(self, df: pd.DataFrame, verdi_col: str,
                      underkat_col: str | None, sektor: str) -> list[dict]:
        resultat: list[dict] = []
        for _, row in df.iterrows():
            verdi = row.get(verdi_col)
            if pd.notna(verdi) and verdi:
                item: dict = {"navn": str(verdi).strip(), "sektor": sektor, "underkategori": ""}
                if underkat_col:
                    uk = row.get(underkat_col)
                    if pd.notna(uk) and uk:
                        item["underkategori"] = str(uk).strip()
                resultat.append(item)
        return resultat

    def hent(self, sektor_underkat: list[tuple[str, str, float]], n: int = 5) -> dict[str, list[dict]]:
        alle_yrker: list[dict] = []
        alle_studier: list[dict] = []
        alle_bedrifter: list[dict] = []

        for sektor, underkat, _ in sektor_underkat:
            ark = self._finn_ark(sektor)
            if ark is None:
                logger.warning("ingen ark for sektor '%s'", sektor)
                continue
            df = self._ark[ark].copy()

            if underkat:
                yrke_df    = df[df["Underkategori_yrker"].fillna("") == underkat]       if "Underkategori_yrker"       in df.columns else df
                studie_df  = df[df["Underkategori_studielinje"].fillna("") == underkat] if "Underkategori_studielinje" in df.columns else df
                bedrift_df = df[df["Underkategori_bedrifter"].fillna("") == underkat]   if "Underkategori_bedrifter"   in df.columns else df
            else:
                yrke_df = studie_df = bedrift_df = df

            if "Alle yrker" in df.columns:
                alle_yrker += self._hent_kolonne(yrke_df, "Alle yrker", "Underkategori_yrker", ark)
            elif "Alle yrker 2" in df.columns:
                alle_yrker += self._hent_kolonne(yrke_df, "Alle yrker 2", None, ark)

            if "Studielinje" in df.columns:
                alle_studier += self._hent_kolonne(studie_df, "Studielinje", "Underkategori_studielinje", ark)

            if "Bedrifter" in df.columns:
                alle_bedrifter += self._hent_kolonne(bedrift_df, "Bedrifter", "Underkategori_bedrifter", ark)

        return {
            "yrker":     _dedup(alle_yrker, n),
            "studier":   _dedup(alle_studier, n),
            "bedrifter": _dedup(alle_bedrifter, n),
        }


def _dedup(lst: list[dict], maks: int) -> list[dict]:
    sett: set[str] = set()
    ut: list[dict] = []
    for item in lst:
        if item["navn"] not in sett:
            sett.add(item["navn"])
            ut.append(item)
            if len(ut) == maks:
                break
    return ut


@lru_cache(maxsize=None)
def _hent_connections() -> _ConnectionsSortert:
    fp = DATA_DIR / "connections-sortert.xlsx"
    if not fp.exists():
        raise FileNotFoundError(f"Finner ikke connections-fil: {fp}")
    return _ConnectionsSortert(fp)


def generer_anbefaling(brukertype: str, svar: dict[str, Any], n_resultater: int = 5) -> dict:
    scoring = scorer_svar(brukertype, svar)

    aktive_regler = hent_aktive_filterregler(scoring.filter_data)
    if aktive_regler:
        logger.info("(%s) aktive filterregler: %s", brukertype, aktive_regler)

    sektor_tupler = map_til_sektorer(scoring.dimensjon_scores)
    connections = _hent_connections()
    anbefalinger = connections.hent(sektor_tupler, n=n_resultater)
    anbefalinger = filtrer_anbefalinger(anbefalinger, scoring.filter_data)

    topp_dims = topp_dimensjoner(scoring.dimensjon_scores, n=3)
    dimensjoner_liste = [{"navn": navn, "score": round(score, 2)} for navn, score in topp_dims]

    topp_sektorer: list[dict] = []
    sett: set[str] = set()
    for sektor, underkat, score in sektor_tupler[:8]:
        label = f"{sektor}—{underkat}" if underkat else sektor
        if label not in sett:
            sett.add(label)
            topp_sektorer.append({"sektor": sektor, "underkategori": underkat, "score": score})
        if len(topp_sektorer) == 5:
            break

    return {
        "dimensjoner":   dimensjoner_liste,
        "topp_sektorer": topp_sektorer,
        **anbefalinger,
    }
