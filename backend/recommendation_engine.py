"""
recommendation_engine.py
========================
Full pipeline: svar → dimensjoner → sektorer → anbefalinger → filtrert respons.

Forbedringer v2.1:
  - Sammensatt matchscore per item (vektet sum av dimensjonscorer × sektor-score)
  - Preferanseboost: eksplisitte preferanser løfter relevante items
  - Bransje-boost: ønsket bransje mapper til sektorer og øker score
  - Bedre dedup: sorterer på match_score FØR dedup, ikke etterpå
  - Profilbeskrivelse: kaller profil_engine og returnerer norsk profiltekst
  - Returnerer 8 kandidater per kategori for bedre variasjon

Hoveddatakilde: backend/data/connections-sortert.xlsx
"""

from __future__ import annotations

import logging
import unicodedata
from functools import lru_cache
from pathlib import Path
from typing import Any

import pandas as pd

from filter_engine import filtrer_anbefalinger, hent_aktive_filterregler, sorter_etter_score
from mapping_engine import map_til_sektorer
from profil_engine import lag_profil_beskrivelse
from schemas import PreferanseSignaler
from scoring_engine import scorer_svar, topp_dimensjoner, normaliser_scores

logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).parent
DATA_DIR = BASE_DIR / "data"


# ---------------------------------------------------------------------------
# Preferanseboost-konfigurasjon
# ---------------------------------------------------------------------------

# Bransje-preferanser (option_value eller fri tekst) → sektornavn i connections
_BRANSJE_TIL_SEKTOR: dict[str, str] = {
    "teknologi":               "IT og teknologi",
    "it":                      "IT og teknologi",
    "it_og_teknologi":         "IT og teknologi",
    "helse":                   "Helse og omsorg",
    "helse_og_omsorg":         "Helse og omsorg",
    "medisin":                 "Helse og omsorg",
    "okonomi":                 "Økonomi og finans",
    "økonomi":                 "Økonomi og finans",
    "finans":                  "Økonomi og finans",
    "jus":                     "Jus og rettsvesen",
    "rettsvesen":              "Jus og rettsvesen",
    "kreativ":                 "Kunst og kultur",
    "kreativ_bransje":         "Kunst og kultur",
    "kunst":                   "Kunst og kultur",
    "design":                  "Design, markedsføring og kommun",
    "markedsforing":           "Design, markedsføring og kommun",
    "markedsføring":           "Design, markedsføring og kommun",
    "kommunikasjon":           "Design, markedsføring og kommun",
    "miljo":                   "Miljø, natur og forskning",
    "miljø":                   "Miljø, natur og forskning",
    "forskning":               "Miljø, natur og forskning",
    "naturvitenskap":          "Miljø, natur og forskning",
    "ingeniorfag":             "Ingeniør og teknisk",
    "ingeniørfag":             "Ingeniør og teknisk",
    "ingenior":                "Ingeniør og teknisk",
    "ingeniør":                "Ingeniør og teknisk",
    "samfunn":                 "Samfunnsfag og politikk",
    "politikk":                "Samfunnsfag og politikk",
    "pedagogikk":              "Undervisning og pedagogikk",
    "undervisning":            "Undervisning og pedagogikk",
    "laerer":                  "Undervisning og pedagogikk",
    "lærer":                   "Undervisning og pedagogikk",
    "psykologi":                    "Psykologi og rådgivning",
    "psykologi_og_radgivning":      "Psykologi og rådgivning",
    "psykologi_og_rådgivning":      "Psykologi og rådgivning",
    "radgivning":                   "Psykologi og rådgivning",
    "rådgivning":                   "Psykologi og rådgivning",
    "sikkerhet":               "Sikkerhet og beredskap",
    "beredskap":               "Sikkerhet og beredskap",
    "transport":               "Transport og logistikk",
    "logistikk":               "Transport og logistikk",
    "administrasjon":          "Administrasjon og ledelse",
    "ledelse":                 "Administrasjon og ledelse",
    "entrepreenerskap":        "Administrasjon og ledelse",
    "entrepenørskap":          "Administrasjon og ledelse",
    "konsulent":               "Administrasjon og ledelse",
    "sport":                   "Sport og kroppsøving",
    "idrett":                  "Sport og kroppsøving",
    "religion":                "Religion og livssyn",
    "humaniora":               "Humaniora og språk",
    "sprak":                   "Humaniora og språk",
    "språk":                   "Humaniora og språk",
    "offentlig_sektor":        "Administrasjon og ledelse",
}

# Boost-faktorer (multiplikator på match_score)
_BRANSJE_BOOST     = 1.25   # bransje-preferanse matcher sektor
_STUDIE_BOOST      = 1.30   # studie nevnt av bruker finnes i resultater
_YRKE_BOOST        = 1.30   # yrke nevnt av bruker finnes i resultater
_BEDRIFT_BOOST     = 1.25   # bedrift nevnt av bruker finnes i resultater


# ---------------------------------------------------------------------------
# connections-sortert wrapper
# ---------------------------------------------------------------------------

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

    def _hent_kolonne(
        self,
        df: pd.DataFrame,
        verdi_col: str,
        underkat_col: str | None,
        sektor: str,
        base_score: float,
    ) -> list[dict]:
        resultat: list[dict] = []
        for _, row in df.iterrows():
            verdi = row.get(verdi_col)
            if pd.notna(verdi) and verdi:
                item: dict = {
                    "navn": str(verdi).strip(),
                    "sektor": sektor,
                    "underkategori": "",
                    "match_score": base_score,
                    "preferanse_boost": False,
                }
                if underkat_col:
                    uk = row.get(underkat_col)
                    if pd.notna(uk) and uk:
                        item["underkategori"] = str(uk).strip()
                resultat.append(item)
        return resultat

    def hent_scoret(
        self,
        sektor_tupler: list[tuple[str, str, float]],
        n: int = 8,
    ) -> dict[str, list[dict]]:
        """
        Henter og scorer anbefalinger fra connections.
        Sorterer på match_score (sektorens relevanscore) FØR dedup.
        """
        alle_yrker: list[dict] = []
        alle_studier: list[dict] = []
        alle_bedrifter: list[dict] = []

        # Bygg sektor → score dict for rask oppslag
        sektor_scores: dict[str, float] = {}
        for sektor, underkat, score in sektor_tupler:
            key = f"{sektor}||{underkat}" if underkat else sektor
            sektor_scores[key] = max(sektor_scores.get(key, 0.0), score)

        for sektor, underkat, score in sektor_tupler:
            ark = self._finn_ark(sektor)
            if ark is None:
                logger.warning("ingen ark for sektor '%s'", sektor)
                continue
            df = self._ark[ark].copy()

            # Filtrer på underkategori hvis spesifisert
            if underkat:
                yrke_df    = df[df["Underkategori_yrker"].fillna("") == underkat]       if "Underkategori_yrker"       in df.columns else df
                studie_df  = df[df["Underkategori_studielinje"].fillna("") == underkat] if "Underkategori_studielinje" in df.columns else df
                bedrift_df = df[df["Underkategori_bedrifter"].fillna("") == underkat]   if "Underkategori_bedrifter"   in df.columns else df
            else:
                yrke_df = studie_df = bedrift_df = df

            if "Alle yrker" in df.columns:
                alle_yrker += self._hent_kolonne(yrke_df, "Alle yrker", "Underkategori_yrker", ark, score)
            elif "Alle yrker 2" in df.columns:
                alle_yrker += self._hent_kolonne(yrke_df, "Alle yrker 2", None, ark, score)

            if "Studielinje" in df.columns:
                alle_studier += self._hent_kolonne(studie_df, "Studielinje", "Underkategori_studielinje", ark, score)

            if "Bedrifter" in df.columns:
                alle_bedrifter += self._hent_kolonne(bedrift_df, "Bedrifter", "Underkategori_bedrifter", ark, score)

        # Sorter etter match_score (høyest relevante sektorer øverst) FØR dedup
        alle_yrker.sort(key=lambda x: x["match_score"], reverse=True)
        alle_studier.sort(key=lambda x: x["match_score"], reverse=True)
        alle_bedrifter.sort(key=lambda x: x["match_score"], reverse=True)

        return {
            "yrker":     _dedup(alle_yrker, n),
            "studier":   _dedup(alle_studier, n),
            "bedrifter": _dedup(alle_bedrifter, n),
        }


def _dedup(lst: list[dict], maks: int) -> list[dict]:
    """Dedup på navn — beholder første (høyest scoret) forekomst."""
    sett: set[str] = set()
    ut: list[dict] = []
    for item in lst:
        if item["navn"] not in sett:
            sett.add(item["navn"])
            ut.append(item)
            if len(ut) == maks:
                break
    return ut


def _normaliser(tekst: str) -> str:
    nfkd = unicodedata.normalize("NFKD", tekst)
    return "".join(c for c in nfkd if not unicodedata.combining(c)).lower().strip()


@lru_cache(maxsize=None)
def _hent_connections() -> _ConnectionsSortert:
    fp = DATA_DIR / "connections-sortert.xlsx"
    if not fp.exists():
        raise FileNotFoundError(f"Finner ikke connections-fil: {fp}")
    return _ConnectionsSortert(fp)


# ---------------------------------------------------------------------------
# Preferanseboost
# ---------------------------------------------------------------------------

def _appliser_preferanse_boost(
    anbefalinger: dict[str, list[dict]],
    preferanser: PreferanseSignaler,
    sektor_tupler: list[tuple[str, str, float]],
) -> dict[str, list[dict]]:
    """
    Booster items basert på brukerens eksplisitte preferanser.
    Opererer på en kopi — påvirker ikke originaldataene.
    """
    # Bygg sektor-boost fra bransje_interesse
    bransje_boost_sektorer: set[str] = set()
    for bransje in preferanser.bransje_interesse:
        norm = _normaliser(bransje)
        sektor = _BRANSJE_TIL_SEKTOR.get(norm)
        if sektor:
            bransje_boost_sektorer.add(sektor)
            logger.debug("bransje-boost: '%s' → sektor '%s'", bransje, sektor)

    # Normaliser preferanselister for matching
    studie_norm   = {_normaliser(s) for s in preferanser.studie_interesse}
    yrke_norm     = {_normaliser(y) for y in preferanser.yrke_interesse}
    bedrift_norm  = {_normaliser(b) for b in preferanser.bedrift_interesse}

    def _boost_liste(items: list[dict], kategori: str) -> list[dict]:
        boosted = []
        for item in items:
            ny = dict(item)
            navn_norm = _normaliser(item["navn"])
            sektor = item.get("sektor", "")

            # Bransje-boost
            if sektor in bransje_boost_sektorer:
                ny["match_score"] = round(ny.get("match_score", 1.0) * _BRANSJE_BOOST, 2)
                ny["preferanse_boost"] = True

            # Studie-boost
            if kategori == "studier" and studie_norm:
                if any(navn_norm in s or s in navn_norm for s in studie_norm):
                    ny["match_score"] = round(ny.get("match_score", 1.0) * _STUDIE_BOOST, 2)
                    ny["preferanse_boost"] = True

            # Yrke-boost
            if kategori == "yrker" and yrke_norm:
                if any(navn_norm in y or y in navn_norm for y in yrke_norm):
                    ny["match_score"] = round(ny.get("match_score", 1.0) * _YRKE_BOOST, 2)
                    ny["preferanse_boost"] = True

            # Bedrift-boost
            if kategori == "bedrifter" and bedrift_norm:
                if any(navn_norm in b or b in navn_norm for b in bedrift_norm):
                    ny["match_score"] = round(ny.get("match_score", 1.0) * _BEDRIFT_BOOST, 2)
                    ny["preferanse_boost"] = True

            boosted.append(ny)

        # Re-sorter etter boost
        return sorted(boosted, key=lambda x: x.get("match_score", 0.0), reverse=True)

    return {
        "yrker":     _boost_liste(anbefalinger.get("yrker", []), "yrker"),
        "studier":   _boost_liste(anbefalinger.get("studier", []), "studier"),
        "bedrifter": _boost_liste(anbefalinger.get("bedrifter", []), "bedrifter"),
    }


def _berik_med_preferanse_sektorer(
    sektor_tupler: list[tuple[str, str, float]],
    bransje_interesse: list[str],
) -> list[tuple[str, str, float]]:
    """
    Legger til sektorer fra bransje_interesse som ikke allerede finnes i sektor_tupler.
    Disse gis en base_score på 40% av høyeste eksisterende sektor-score.
    Sikrer at prefererte bransjer alltid er representert blant kandidatene.
    """
    if not bransje_interesse:
        return sektor_tupler

    eksisterende_sektorer = {s for s, _, _ in sektor_tupler}
    maks_score = sektor_tupler[0][2] if sektor_tupler else 10.0
    preferanse_score = round(maks_score * 0.40, 2)

    ekstra: list[tuple[str, str, float]] = []
    for bransje in bransje_interesse:
        sektor = _BRANSJE_TIL_SEKTOR.get(_normaliser(bransje))
        if sektor and sektor not in eksisterende_sektorer:
            ekstra.append((sektor, "", preferanse_score))
            eksisterende_sektorer.add(sektor)
            logger.info("preferanse-sektor tillagt: '%s' (score=%.2f)", sektor, preferanse_score)

    return list(sektor_tupler) + ekstra


def _normaliser_match_score(items: list[dict], maks_score: float) -> list[dict]:
    """Skalerer match_score til 0–100 relativt til høyeste score i listen."""
    if not items or maks_score <= 0:
        return items
    return [
        {**item, "match_score": round(item.get("match_score", 0) / maks_score * 100, 1)}
        for item in items
    ]


# ---------------------------------------------------------------------------
# Hoved-funksjon
# ---------------------------------------------------------------------------

def generer_anbefaling(
    brukertype: str,
    svar: dict[str, Any],
    n_resultater: int = 5,
) -> dict:
    """
    Full pipeline:
      svar → scoring → dimensjoner → sektorer → connections
           → preferanseboost → filtrering → normalisering
           → profilbeskrivelse → API-respons
    """
    # --- 1. Score svar ---
    scoring = scorer_svar(brukertype, svar)

    # --- 2. Logg aktive filterregler ---
    aktive_regler = hent_aktive_filterregler(scoring.filter_data)
    if aktive_regler:
        logger.info("(%s) aktive filterregler: %s", brukertype, aktive_regler)

    # --- 3. Map dimensjoner til sektorer ---
    sektor_tupler = map_til_sektorer(scoring.dimensjon_scores, topp_n=10)

    # --- 3b. Tillegg: legg til foretrukkede bransjer som ekstra sektor-kandidater ---
    # Slik at bransje-preferanser alltid er representert, selv om de ikke dukker opp
    # i topp-dimensjonene. Disse gis en moderat base_score (40% av topp-sektor).
    sektor_tupler = _berik_med_preferanse_sektorer(
        sektor_tupler,
        scoring.preferanse_signaler.bransje_interesse,
    )

    # --- 4. Hent candidates fra connections (med base match_score = sektor_score) ---
    connections = _hent_connections()
    # Hent litt ekstra (n_resultater * 3) for å ha margin etter boost + dedup
    kandidater_n = n_resultater * 3
    anbefalinger = connections.hent_scoret(sektor_tupler, n=kandidater_n)

    # --- 5. Appliser preferanseboost ---
    anbefalinger = _appliser_preferanse_boost(
        anbefalinger,
        scoring.preferanse_signaler,
        sektor_tupler,
    )

    # --- 6. Bruk filterregler (snitt, geografi, studielengde) ---
    anbefalinger = filtrer_anbefalinger(anbefalinger, scoring.filter_data)

    # --- 7. Re-sort etter filter (filter kan ha endret match_score) ---
    for kat in ["yrker", "studier", "bedrifter"]:
        anbefalinger[kat] = sorter_etter_score(anbefalinger[kat])

    # --- 8. Normaliser match_score til 0–100 og trim til n_resultater ---
    alle_scores = [
        item.get("match_score", 0)
        for kat in ["yrker", "studier", "bedrifter"]
        for item in anbefalinger[kat]
    ]
    global_maks = max(alle_scores) if alle_scores else 1.0

    for kat in ["yrker", "studier", "bedrifter"]:
        anbefalinger[kat] = _normaliser_match_score(anbefalinger[kat], global_maks)
        anbefalinger[kat] = anbefalinger[kat][:n_resultater]

    # --- 9. Bygg dimensjon-liste (topp 5, normalisert) ---
    norm_scores = normaliser_scores(scoring.dimensjon_scores)
    topp_dims = topp_dimensjoner(scoring.dimensjon_scores, n=5)
    dimensjoner_liste = [
        {"navn": navn, "score": norm_scores.get(navn, round(score, 2))}
        for navn, score in topp_dims
    ]

    # --- 10. Bygg topp-sektorer ---
    topp_sektorer: list[dict] = []
    sett: set[str] = set()
    # Normaliser sektor-scorer til 0–100
    maks_sektor = sektor_tupler[0][2] if sektor_tupler else 1.0
    for sektor, underkat, score in sektor_tupler[:10]:
        label = f"{sektor}—{underkat}" if underkat else sektor
        if label not in sett:
            sett.add(label)
            topp_sektorer.append({
                "sektor": sektor,
                "underkategori": underkat,
                "score": round(score / maks_sektor * 100, 1),
            })
        if len(topp_sektorer) == 5:
            break

    # --- 11. Generer profilbeskrivelse ---
    profil = lag_profil_beskrivelse(scoring.dimensjon_scores, brukertype)

    return {
        "dimensjoner":   dimensjoner_liste,
        "topp_sektorer": topp_sektorer,
        "yrker":         anbefalinger.get("yrker", []),
        "studier":       anbefalinger.get("studier", []),
        "bedrifter":     anbefalinger.get("bedrifter", []),
        "profil":        profil.model_dump(),
        "preferanser":   scoring.preferanse_signaler.model_dump(),
    }
