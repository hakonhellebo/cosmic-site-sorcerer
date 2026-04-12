"""
filter_engine.py
================
Filtermotor og re-ranking for rammevariabler.

Støttede regler (v2.1):
  - grade_average     : snittkarakter → ekskluderer prestisjeprogrammer ved lavt snitt
  - study_length      : ønsket studielengde → boost/filtrering etter varighet
  - education_level   : nåværende utdanningsnivå → matcher anbefalt neste steg
  - geography         : fylke + flyttevillighet → region-re-ranking (TODO: per-studie data)
  - preferred_region  : foretrukket studiested
  - admission_req     : opptakskrav / kravfag (TODO: per-studie data)

Arkitektur:
  - Alle regler er rene funksjoner: dict → dict
  - Regler kjøres i sekvens via filtrer_anbefalinger()
  - Re-ranking (boost/penalisering) skjer før endelig sort og dedup
  - Nye regler legges til ved å lage ny _regel_*-funksjon og registrere den
"""

from __future__ import annotations

import logging
import unicodedata
from typing import Any

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Konfigurasjon — sektorer og kategorier
# ---------------------------------------------------------------------------

# Sektorer som typisk krever høyt snitt / sterk akademisk bakgrunn
_HOYPRESTIGE_SEKTORER: set[str] = {
    "Helse og omsorg",
    "Jus og rettsvesen",
    "Ingeniør og teknisk",
    "IT og teknologi",
}

# Underkategorier innen høyprestige-sektorer med ekstra strenge krav
_HOYPRESTIGE_UNDERKAT: set[str] = {
    "Medisinsk behandling og diagnostikk",
    "Medisin og kirurgi",
    "Juridisk rådgivning",
    "Rettsvitenskap",
}

# option_values → karakter-nivå
_SNITT_NIVAA: dict[str, str] = {
    "1_2":                "lavt",
    "svake_karakterer":   "lavt",
    "svake karakterer":   "lavt",
    "3_4":                "middels",
    "middels_snitt":      "middels",
    "5_6":                "hoyt",
    "hoyt_snitt":         "hoyt",
    "vet_ikke":           "ukjent",
}

# Studielengde-alternativer → antall år (ca.)
_STUDIELENGDE_AR: dict[str, int] = {
    "1_ar":               1,
    "1_2_ar":             1,
    "to_ar":              2,
    "2_ar":               2,
    "tre_ar":             3,
    "3_ar":               3,   # bachelor
    "fire_ar":            4,
    "4_ar":               4,
    "fem_ar":             5,
    "5_ar":               5,   # master/sivilingeniør
    "kortere_enn_3":      2,
    "bachelor":           3,
    "master":             5,
    "fagskole":           2,
    "yrkesfag":           2,
    "vgs":                3,
}

# Nøkkelord i studienavn som indikerer kort vs. lang utdanning
_KORT_STUDIE_NOKKELORD: list[str] = [
    "fagskole", "årsstudium", "kortere", "1 år", "2 år",
    "grunnkurs", "kurs", "sertifikat",
]
_LANG_STUDIE_NOKKELORD: list[str] = [
    "master", "sivilingeniør", "siviløkonom", "phd", "doktorgrad",
    "5-årig", "5 år", "profesjonsstudium",
]

# Geografi: option_value → norsk regionlabel
_COUNTY_TIL_REGION: dict[str, str] = {
    "ostlandet":            "Østlandet",
    "oslo":                 "Østlandet",
    "oslo_og_omegn":        "Østlandet",
    "viken":                "Østlandet",
    "innlandet":            "Østlandet",
    "vestfold":             "Østlandet",
    "telemark":             "Østlandet",
    "bergen_vestlandet":    "Vestlandet",
    "vestland":             "Vestlandet",
    "rogaland":             "Vestlandet",
    "more_og_romsdal":      "Vestlandet",
    "trondheim_trondelag":  "Trøndelag",
    "trondelag":            "Trøndelag",
    "nord_norge":           "Nord-Norge",
    "nordland":             "Nord-Norge",
    "troms":                "Nord-Norge",
    "finnmark":             "Nord-Norge",
    "sorlandet":            "Sørlandet",
    "agder":                "Sørlandet",
}

# Regioner med kjente studiesentre (TODO: koble mot per-studie campus-data)
_REGION_STUDIESENTRE: dict[str, list[str]] = {
    "Østlandet":  ["Oslo", "UiO", "BI", "OsloMet", "NMBU", "Akershus"],
    "Vestlandet": ["Bergen", "UIB", "NHH", "Høgskulen på Vestlandet"],
    "Trøndelag":  ["Trondheim", "NTNU", "BI Trondheim"],
    "Nord-Norge": ["Tromsø", "UiT", "Nord"],
    "Sørlandet":  ["Kristiansand", "UiA"],
}

# Flyttevillighet-alternativenes verdi
_LOKAL_TILKNYTNING: set[str] = {"lokal_tilknytning", "nei", "no"}
_MODERAT_FLEKSIBILITET: set[str] = {"moderat_fleksibilitet", "kanskje", "maybe"}
_GEOGRAFISK_FLEKSIBEL: set[str] = {"geografisk_fleksibilitet", "ja", "yes", "fleksibel"}


# ---------------------------------------------------------------------------
# Hjelpefunksjoner
# ---------------------------------------------------------------------------

def _normaliser(tekst: str) -> str:
    nfkd = unicodedata.normalize("NFKD", tekst)
    return "".join(c for c in nfkd if not unicodedata.combining(c)).lower().strip()


def _hent_enkeltverdi(filter_data: dict[str, Any], *nokler: str) -> str | None:
    for nokkel in nokler:
        raw = filter_data.get(nokkel)
        if raw is None:
            continue
        verdier = raw if isinstance(raw, list) else [raw]
        if verdier:
            return str(verdier[0]).strip().lower()
    return None


def _hent_listeverdier(filter_data: dict[str, Any], *nokler: str) -> list[str]:
    for nokkel in nokler:
        raw = filter_data.get(nokkel)
        if raw is None:
            continue
        verdier = raw if isinstance(raw, list) else [raw]
        return [str(v).strip().lower() for v in verdier if v]
    return []


def _boost_item(item: dict, faktor: float, grunn: str) -> dict:
    """Øker match_score på ett item (non-destruktivt)."""
    ny = dict(item)
    ny["match_score"] = round(item.get("match_score", 0.0) * faktor, 2)
    ny["_boost_grunn"] = ny.get("_boost_grunn", []) + [grunn]
    return ny


def _penaliser_item(item: dict, faktor: float, grunn: str) -> dict:
    """Senker match_score på ett item."""
    ny = dict(item)
    ny["match_score"] = round(item.get("match_score", 0.0) * faktor, 2)
    ny["_penaliser_grunn"] = ny.get("_penaliser_grunn", []) + [grunn]
    return ny


# ---------------------------------------------------------------------------
# Hoved-funksjon
# ---------------------------------------------------------------------------

def filtrer_anbefalinger(anbefalinger: dict[str, Any], filter_data: dict[str, Any]) -> dict[str, Any]:
    """
    Kjør alle filterregler i sekvens.
    Returner oppdatert anbefalings-dict.
    """
    if not filter_data:
        return anbefalinger

    resultat = dict(anbefalinger)

    # --- Harde filtre (ekskluderer) ---
    resultat = _regel_snitt(resultat, filter_data)

    # --- Re-ranking (boost/penalisering basert på preferanser) ---
    resultat = _regel_studielengde(resultat, filter_data)
    resultat = _regel_geografi(resultat, filter_data)

    return resultat


# ---------------------------------------------------------------------------
# Regel: snittkarakter
# ---------------------------------------------------------------------------

def _regel_snitt(anbefalinger: dict[str, Any], filter_data: dict[str, Any]) -> dict[str, Any]:
    """
    Lavt snitt → ekskluder høyprestige-sektorer.
    Middels snitt → penaliser, men behold (re-rank).
    Høyt snitt → liten bonus til prestisjeprogrammer.
    """
    snitt_val = _hent_enkeltverdi(filter_data, "grade_average")
    if not snitt_val:
        return anbefalinger

    snitt_nivaa = _SNITT_NIVAA.get(snitt_val, "ukjent")
    logger.info("filter_engine: snitt=%s → nivå=%s", snitt_val, snitt_nivaa)

    if snitt_nivaa == "lavt":
        def _behandle(lst: list[dict]) -> list[dict]:
            ut = []
            for item in lst:
                sektor = item.get("sektor", "")
                underkat = item.get("underkategori", "")
                if sektor in _HOYPRESTIGE_SEKTORER or underkat in _HOYPRESTIGE_UNDERKAT:
                    logger.debug("filter_engine: fjerner '%s' (lavt snitt)", item.get("navn", ""))
                    continue
                ut.append(item)
            return ut

    elif snitt_nivaa == "middels":
        def _behandle(lst: list[dict]) -> list[dict]:
            return [
                _penaliser_item(item, 0.70, "middels_snitt")
                if item.get("sektor", "") in _HOYPRESTIGE_SEKTORER
                else item
                for item in lst
            ]

    elif snitt_nivaa == "hoyt":
        def _behandle(lst: list[dict]) -> list[dict]:
            return [
                _boost_item(item, 1.10, "hoyt_snitt")
                if item.get("sektor", "") in _HOYPRESTIGE_SEKTORER
                else item
                for item in lst
            ]

    else:
        return anbefalinger

    return {
        **anbefalinger,
        "yrker":     _behandle(anbefalinger.get("yrker", [])),
        "studier":   _behandle(anbefalinger.get("studier", [])),
        "bedrifter": _behandle(anbefalinger.get("bedrifter", [])),
    }


# ---------------------------------------------------------------------------
# Regel: studielengde
# ---------------------------------------------------------------------------

def _regel_studielengde(anbefalinger: dict[str, Any], filter_data: dict[str, Any]) -> dict[str, Any]:
    """
    Ønsket studielengde → boost/penaliser studier basert på lengde.
    Bruker nøkkelord i studienavnet som proxy (inntil vi har metadata per studie).
    """
    lengde_val = _hent_enkeltverdi(filter_data, "study_length", "preferred_study_length")
    if not lengde_val:
        return anbefalinger

    onsket_ar = _STUDIELENGDE_AR.get(lengde_val)
    if onsket_ar is None:
        return anbefalinger

    logger.info("filter_engine: ønsket studielengde=%s (ca. %d år)", lengde_val, onsket_ar)

    def _behandle_studie(item: dict) -> dict:
        navn_lower = _normaliser(item.get("navn", ""))
        er_kort = any(kw in navn_lower for kw in _KORT_STUDIE_NOKKELORD)
        er_lang = any(kw in navn_lower for kw in _LANG_STUDIE_NOKKELORD)

        if onsket_ar <= 2 and er_kort:
            return _boost_item(item, 1.15, "matchende_studielengde")
        if onsket_ar <= 2 and er_lang:
            return _penaliser_item(item, 0.75, "for_lang_utdanning")
        if onsket_ar >= 5 and er_lang:
            return _boost_item(item, 1.10, "matchende_studielengde")
        if onsket_ar >= 5 and er_kort:
            return _penaliser_item(item, 0.80, "for_kort_utdanning")
        return item

    return {
        **anbefalinger,
        "studier": [_behandle_studie(item) for item in anbefalinger.get("studier", [])],
    }


# ---------------------------------------------------------------------------
# Regel: geografi
# ---------------------------------------------------------------------------

def _regel_geografi(anbefalinger: dict[str, Any], filter_data: dict[str, Any]) -> dict[str, Any]:
    """
    Geografi + flyttevillighet → re-rank studier og yrker.

    Foreløpig: boost studier med studiestedsnøkkelord som matcher region.
    TODO: koble mot per-studie campus-data for presis filtrering.
    """
    county_val = _hent_enkeltverdi(filter_data, "county")
    move_val = _hent_enkeltverdi(filter_data, "willing_to_move")
    preferred_region = _hent_enkeltverdi(filter_data, "preferred_study_region")

    if not county_val and not preferred_region:
        return anbefalinger

    # Finn brukerens region
    bruker_region: str | None = None
    if county_val:
        bruker_region = _COUNTY_TIL_REGION.get(county_val)
    if not bruker_region and preferred_region:
        bruker_region = _COUNTY_TIL_REGION.get(preferred_region, preferred_region)

    er_lokal = move_val in _LOKAL_TILKNYTNING
    er_fleksibel = move_val in _GEOGRAFISK_FLEKSIBEL

    if not bruker_region:
        return anbefalinger

    logger.info("filter_engine: region=%s, lokal=%s, fleksibel=%s", bruker_region, er_lokal, er_fleksibel)

    sentre = _REGION_STUDIESENTRE.get(bruker_region, [])
    sentre_norm = [_normaliser(s) for s in sentre]

    def _behandle_studie(item: dict) -> dict:
        navn_lower = _normaliser(item.get("navn", ""))
        lokal_match = any(s in navn_lower for s in sentre_norm)

        if lokal_match:
            # Studiet ser ut til å passe regionen
            if er_lokal or not er_fleksibel:
                return _boost_item(item, 1.20, f"studie_i_region_{bruker_region}")
            else:
                return _boost_item(item, 1.05, f"studie_i_region_{bruker_region}")
        else:
            # Utenfor region
            if er_lokal:
                return _penaliser_item(item, 0.70, "utenfor_preferert_region")
        return item

    return {
        **anbefalinger,
        "studier": [_behandle_studie(item) for item in anbefalinger.get("studier", [])],
    }


# ---------------------------------------------------------------------------
# Hjelp til pipeline: hvilke filter er aktive
# ---------------------------------------------------------------------------

def hent_aktive_filterregler(filter_data: dict[str, Any]) -> list[str]:
    aktive: list[str] = []
    for felt in ["grade_average", "county", "willing_to_move", "study_length",
                 "preferred_study_region", "education_level"]:
        if filter_data.get(felt):
            aktive.append(f"{felt}={filter_data[felt]}")
    return aktive


# ---------------------------------------------------------------------------
# Sorterer en liste av items etter match_score fallende (brukes i rec.engine)
# ---------------------------------------------------------------------------

def sorter_etter_score(items: list[dict]) -> list[dict]:
    return sorted(items, key=lambda x: x.get("match_score", 0.0), reverse=True)
