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
from llm_engine import generate_llm_explanation
from mapping_engine import map_til_sektorer, topp_dims_for_sektor
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
# Match-reasons: norske etiketter per dimensjon
# ---------------------------------------------------------------------------

_DIM_ETIKETT: dict[str, str] = {
    "Teknologi":        "teknologisk interesse",
    "Analytisk":        "analytisk tankegang",
    "Bærekraft":        "miljøengasjement",
    "Helseinteresse":   "interesse for helse",
    "Kreativitet":      "kreativ profil",
    "Praktisk":         "praktisk orientering",
    "Ambisjon":         "lederambisjoner",
    "Selvstendighet":   "selvstendig arbeidsform",
    "Sosialitet":       "sosial orientering",
    "Struktur":         "strukturert tilnærming",
    "Fleksibilitet":    "fleksibel arbeidsform",
    "Helse":            "helseorientering",
    "Økonomi":          "økonomiinteresse",
    "Samfunnsfag":      "samfunnsengasjement",
    "Kunst/design":     "estetisk sans",
    "Utdanning":        "pedagogisk interesse",
    "Jus":              "juridisk interesse",
    "Sikkerhet":        "sikkerhetsinteresse",
    "Sport":            "idrettsinteresse",
    "Transport":        "interesse for transport",
    "Religion":         "livssynsinteresse",
    "Humaniora":        "humanistisk orientering",
    "Språk":            "språkinteresse",
}


def _dim_til_etikett(dim_label: str) -> str:
    """Konverterer dimensjonsnavn til norsk match-reason-tekst."""
    return _DIM_ETIKETT.get(dim_label, dim_label.lower())


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

        DEL 4 — Sammensatt multi-dimensjonal scoring:
          Items som dukker opp i FLERE relevante sektorer akkumulerer score.
          Første gang: full sektor-score.
          Gjentagelse: +25% av ny sektor-score (avtagende utbytte).
          Dette gir items som passer bredt i brukerens profil høyere score
          enn items som bare passer i én enkelt sektor.
        """
        # Bruk dict-akkumulering for å summere score på tvers av sektorer
        yrke_acc:    dict[str, dict] = {}
        studie_acc:  dict[str, dict] = {}
        bedrift_acc: dict[str, dict] = {}

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
                _akkumuler_items(yrke_acc, self._hent_kolonne(yrke_df, "Alle yrker", "Underkategori_yrker", ark, score))
            elif "Alle yrker 2" in df.columns:
                _akkumuler_items(yrke_acc, self._hent_kolonne(yrke_df, "Alle yrker 2", None, ark, score))

            if "Studielinje" in df.columns:
                _akkumuler_items(studie_acc, self._hent_kolonne(studie_df, "Studielinje", "Underkategori_studielinje", ark, score))

            if "Bedrifter" in df.columns:
                _akkumuler_items(bedrift_acc, self._hent_kolonne(bedrift_df, "Bedrifter", "Underkategori_bedrifter", ark, score))

        # Sorter akkumulerte dicts
        alle_yrker    = sorted(yrke_acc.values(),    key=lambda x: x["match_score"], reverse=True)
        alle_studier  = sorted(studie_acc.values(),  key=lambda x: x["match_score"], reverse=True)
        alle_bedrifter = sorted(bedrift_acc.values(), key=lambda x: x["match_score"], reverse=True)

        return {
            "yrker":     alle_yrker[:n],
            "studier":   alle_studier[:n],
            # Bedrifter: diversifiser på tvers av sektorer (maks 2 per sektor)
            "bedrifter": _dedup_diverse(alle_bedrifter, n, maks_per_sektor=2),
        }

    def bygg_navn_index(self) -> dict[str, set[str]]:
        """
        Bygger en omvendt indeks: normalisert_navn → sett av sektorer.
        Brukes til å finne hvilken sektor et yrke/studie/bedrift tilhører,
        slik at preferansesignaler kan knyttes til riktig sektor.
        """
        index: dict[str, set[str]] = {}
        kolonner = ["Alle yrker", "Alle yrker 2", "Studielinje", "Bedrifter"]
        for ark_navn, df in self._ark.items():
            for kol in kolonner:
                if kol not in df.columns:
                    continue
                for verdi in df[kol].dropna():
                    v = str(verdi).strip()
                    if v:
                        norm = _normaliser(v)
                        index.setdefault(norm, set()).add(ark_navn)
        return index


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


def _dedup_diverse(lst: list[dict], maks: int, maks_per_sektor: int = 2) -> list[dict]:
    """
    Dedup på navn med sektor-diversitet.
    Maks maks_per_sektor items per sektor i første runde.
    Deretter fylles opp med resterende (fra hvilken som helst sektor) til maks nås.
    Brukes for bedrifter for å sikre bredde på tvers av bransjer.
    """
    sett: set[str] = set()
    sektor_teller: dict[str, int] = {}
    ut: list[dict] = []
    venteliste: list[dict] = []

    for item in lst:
        if item["navn"] in sett:
            continue
        sektor = item.get("sektor", "")
        if sektor_teller.get(sektor, 0) < maks_per_sektor:
            sett.add(item["navn"])
            sektor_teller[sektor] = sektor_teller.get(sektor, 0) + 1
            ut.append(item)
            if len(ut) == maks:
                return ut
        else:
            venteliste.append(item)

    for item in venteliste:
        if item["navn"] not in sett:
            sett.add(item["navn"])
            ut.append(item)
            if len(ut) == maks:
                break
    return ut


def _normaliser(tekst: str) -> str:
    nfkd = unicodedata.normalize("NFKD", tekst)
    return "".join(c for c in nfkd if not unicodedata.combining(c)).lower().strip()


def _akkumuler_items(acc: dict[str, dict], nye_items: list[dict]) -> None:
    """
    DEL 4 — Akkumulerer items inn i en dict.
    Eksisterende item: legger til 25% av ny score (avtagende utbytte).
    Nytt item: legger til med full score.
    """
    for item in nye_items:
        navn = item["navn"]
        if navn in acc:
            # Item er allerede kjent fra en annen sektor — gi bonus
            acc[navn]["match_score"] = round(
                acc[navn]["match_score"] + item["match_score"] * 0.25, 2
            )
        else:
            acc[navn] = dict(item)


@lru_cache(maxsize=None)
def _hent_connections() -> _ConnectionsSortert:
    fp = DATA_DIR / "connections-sortert.xlsx"
    if not fp.exists():
        raise FileNotFoundError(f"Finner ikke connections-fil: {fp}")
    return _ConnectionsSortert(fp)


@lru_cache(maxsize=None)
def _hent_navn_sektor_index() -> dict[str, set[str]]:
    """
    DEL 3 — Omvendt indeks: normalisert_navn → sett av sektorer.
    Brukes til å finne hvilken sektor et yrke/bedrift/studie tilhører.
    Caches ved første kall.
    """
    return _hent_connections().bygg_navn_index()


def _finn_sektorer_fra_preferanse(navn_liste: list[str]) -> set[str]:
    """
    DEL 3 — Slår opp hvilke sektorer en liste av navn (yrker/bedrifter/studier)
    tilhører i connections-data. Brukes for å boost sektorer basert på
    eksplisitte preferanser, selv om brukeren ikke scoret høyt på den sektoren.
    """
    index = _hent_navn_sektor_index()
    sektorer: set[str] = set()
    for navn in navn_liste:
        navn_norm = _normaliser(navn)
        if navn_norm in index:
            sektorer.update(index[navn_norm])
        else:
            # Prøv delvis match for korte navn (f.eks. "Lege" → finnes i "Lege (spesialist)")
            for idx_key, idx_sektorer in index.items():
                if len(navn_norm) >= 4 and (navn_norm in idx_key or idx_key in navn_norm):
                    sektorer.update(idx_sektorer)
                    break
    return sektorer


# ---------------------------------------------------------------------------
# Preferanseboost
# ---------------------------------------------------------------------------

def _appliser_preferanse_boost(
    anbefalinger: dict[str, list[dict]],
    preferanser: PreferanseSignaler,
    sektor_tupler: list[tuple[str, str, float]],
) -> dict[str, list[dict]]:
    """
    DEL 3 — Booster items basert på brukerens eksplisitte preferanser.

    Signaltyper og effekt:
      bransje_interesse → boost alle items fra matchende sektor (navn-oppslag + direkte dict)
      studie_interesse  → boost studier som matcher navnmessig
                        → boost sektorer disse studiene tilhører (via reverse index)
      yrke_interesse    → boost yrker som matcher navnmessig
                        → boost sektorer disse yrkene tilhører (via reverse index)
      bedrift_interesse → boost bedrifter som matcher navnmessig
                        → boost sektoren bedriften tilhører (via reverse index)

    Boost-faktorer er moderate (1.25–1.30) slik at preferanser forbedrer
    rangeringen uten å overstyre profil-basert scoring.
    """
    # --- Bransje → sektor: direkte mapping + reverse index ---
    bransje_boost_sektorer: set[str] = set()
    for bransje in preferanser.bransje_interesse:
        norm = _normaliser(bransje)
        direkte = _BRANSJE_TIL_SEKTOR.get(norm)
        if direkte:
            bransje_boost_sektorer.add(direkte)
            logger.debug("bransje-boost (direkte): '%s' → '%s'", bransje, direkte)

    # --- Yrke → sektor: reverse index (DEL 3) ---
    yrke_boost_sektorer: set[str] = set()
    if preferanser.yrke_interesse:
        yrke_boost_sektorer = _finn_sektorer_fra_preferanse(preferanser.yrke_interesse)
        for s in yrke_boost_sektorer:
            logger.debug("yrke-sektor-boost: '%s'", s)

    # --- Bedrift → sektor: reverse index (DEL 3) ---
    bedrift_boost_sektorer: set[str] = set()
    if preferanser.bedrift_interesse:
        bedrift_boost_sektorer = _finn_sektorer_fra_preferanse(preferanser.bedrift_interesse)
        for s in bedrift_boost_sektorer:
            logger.debug("bedrift-sektor-boost: '%s'", s)

    # --- Studie → sektor: reverse index (DEL 3) ---
    studie_boost_sektorer: set[str] = set()
    if preferanser.studie_interesse:
        studie_boost_sektorer = _finn_sektorer_fra_preferanse(preferanser.studie_interesse)

    # Alle boost-sektorer samlet (for tverr-kategori bransje-boost)
    alle_boost_sektorer = bransje_boost_sektorer | yrke_boost_sektorer | bedrift_boost_sektorer | studie_boost_sektorer

    # Normaliser preferanselister for direkte navn-matching
    studie_norm  = {_normaliser(s) for s in preferanser.studie_interesse}
    yrke_norm    = {_normaliser(y) for y in preferanser.yrke_interesse}
    bedrift_norm = {_normaliser(b) for b in preferanser.bedrift_interesse}

    def _boost_liste(items: list[dict], kategori: str) -> list[dict]:
        boosted = []
        for item in items:
            ny = dict(item)
            navn_norm = _normaliser(item["navn"])
            sektor = item.get("sektor", "")

            # Sektor-boost (fra bransje + yrke + bedrift reverse lookup)
            if sektor in alle_boost_sektorer:
                ny["match_score"] = round(ny.get("match_score", 1.0) * _BRANSJE_BOOST, 2)
                ny["preferanse_boost"] = True

            # Direkte navn-match: studie
            if kategori == "studier" and studie_norm:
                if any(navn_norm in s or s in navn_norm for s in studie_norm):
                    ny["match_score"] = round(ny.get("match_score", 1.0) * _STUDIE_BOOST, 2)
                    ny["preferanse_boost"] = True

            # Direkte navn-match: yrke
            if kategori == "yrker" and yrke_norm:
                if any(navn_norm in y or y in navn_norm for y in yrke_norm):
                    ny["match_score"] = round(ny.get("match_score", 1.0) * _YRKE_BOOST, 2)
                    ny["preferanse_boost"] = True

            # Direkte navn-match: bedrift
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
# Grupperingslogikk
# ---------------------------------------------------------------------------

# Konfigurasjon for gruppert output
_MAKS_GRUPPER_STUDIER    = 4   # maks antall sektorgrupper for studier
_MAKS_GRUPPER_YRKER      = 4   # maks antall sektorgrupper for yrker
_MAKS_GRUPPER_BEDRIFTER  = 3   # litt færre for bedrifter
_ITEMS_PER_GRUPPE        = 4   # maks items per gruppe
_KANDIDAT_POOL           = 40  # hent dette mange kandidater (pool for groupering)


def _grupper_etter_sektor(
    items: list[dict],
    maks_grupper: int,
    items_per_gruppe: int = _ITEMS_PER_GRUPPE,
) -> list[dict]:
    """
    Grupperer en score-sortert liste av items etter sektor.

    Returnerer opptil maks_grupper grupper, sortert etter høyeste match_score
    innad i gruppen. Hver sektor representeres maks én gang.

    Resultatstruktur: [{"kategori": str, "items": [...]}, ...]

    Design-valg:
      - Én gruppe per sektor → brukeren ser tydelig ULIKE karriereveier
      - Items innad i gruppen sortert etter match_score (høyest først)
      - Grupper med < 2 items ekskluderes for å unngå tynne sektorer
        (én item er bare støy — men vi beholder det hvis totalt < 3 grupper finnes)
    """
    sektor_map: dict[str, list[dict]] = {}

    for item in items:
        sektor = item.get("sektor") or "Annet"
        if sektor not in sektor_map:
            sektor_map[sektor] = []
        if len(sektor_map[sektor]) < items_per_gruppe:
            sektor_map[sektor].append(item)

    # Bygg grupper og sorter etter toppscore
    grupper = [
        {"kategori": sektor, "items": gruppe_items}
        for sektor, gruppe_items in sektor_map.items()
        if gruppe_items
    ]
    grupper.sort(
        key=lambda g: g["items"][0].get("match_score", 0) if g["items"] else 0,
        reverse=True,
    )

    # Fjern grupper med bare 1 item — med mindre vi ellers ville hatt < 3 grupper
    rike_grupper   = [g for g in grupper if len(g["items"]) >= 2]
    tynne_grupper  = [g for g in grupper if len(g["items"]) < 2]

    if len(rike_grupper) >= 2:
        grupper = rike_grupper
    else:
        # Ta med tynne grupper for å nå minst 2 grupper
        grupper = (rike_grupper + tynne_grupper)

    return grupper[:maks_grupper]


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
    # Hent stor pool: nok til å fylle 4 grupper × 4 items = 16, pluss buffer.
    # _KANDIDAT_POOL = 40 sikrer at sektorer med lavere score også er representert.
    kandidater_n = max(_KANDIDAT_POOL, n_resultater * 8)
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

    # --- 8. Normaliser match_score til 0–100 (full pool — ikke trimmet ennå) ---
    alle_scores = [
        item.get("match_score", 0)
        for kat in ["yrker", "studier", "bedrifter"]
        for item in anbefalinger[kat]
    ]
    global_maks = max(alle_scores) if alle_scores else 1.0

    for kat in ["yrker", "studier", "bedrifter"]:
        anbefalinger[kat] = _normaliser_match_score(anbefalinger[kat], global_maks)
        # Ikke trim ennå — vi trenger hele poolen for groupering

    # --- 8b. Generer match_reasons per item (full pool) ---
    for kat in ["yrker", "studier", "bedrifter"]:
        for item in anbefalinger[kat]:
            _dims = topp_dims_for_sektor(item.get("sektor", ""), scoring.dimensjon_scores, n=3)
            item["match_reasons"] = [_dim_til_etikett(d) for d in _dims]

    # --- 8c. Grupper etter sektor (primær UX-struktur) ---
    # Gruppering skjer FØR trimming, slik at vi har nok pool til å fylle alle sektorer.
    _raw_studier_grupper  = _grupper_etter_sektor(
        anbefalinger["studier"],
        maks_grupper=_MAKS_GRUPPER_STUDIER,
        items_per_gruppe=_ITEMS_PER_GRUPPE,
    )
    _raw_yrker_grupper = _grupper_etter_sektor(
        anbefalinger["yrker"],
        maks_grupper=_MAKS_GRUPPER_YRKER,
        items_per_gruppe=_ITEMS_PER_GRUPPE,
    )
    _raw_bedrifter_grupper = _grupper_etter_sektor(
        anbefalinger["bedrifter"],
        maks_grupper=_MAKS_GRUPPER_BEDRIFTER,
        items_per_gruppe=_ITEMS_PER_GRUPPE,
    )

    # Konverter til riktig nøkkelstruktur for frontend
    studier_grupper  = [{"kategori": g["kategori"], "studier":   g["items"]} for g in _raw_studier_grupper]
    yrker_grupper    = [{"kategori": g["kategori"], "yrker":     g["items"]} for g in _raw_yrker_grupper]
    bedrifter_grupper = [{"kategori": g["kategori"], "bedrifter": g["items"]} for g in _raw_bedrifter_grupper]

    # --- 8d. Trim flate lister til n_resultater (bakoverkompatibel) ---
    for kat in ["yrker", "studier", "bedrifter"]:
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

    # --- 12. Bygg LLM-kontekst (DEL 6) ---
    # Strukturert metadata klar for prompt-generering til forklaringstekster.
    # Inneholder alt LLM trenger for å lage personlig, troverdig forklaring.
    alle_match_reasons: list[str] = list({
        r
        for kat in ["yrker", "studier", "bedrifter"]
        for item in anbefalinger.get(kat, [])
        for r in item.get("match_reasons", [])
    })
    llm_context = {
        "brukertype": brukertype,
        "topp_dimensjoner": [
            {"navn": navn, "score_norm": norm_scores.get(navn, 0.0)}
            for navn, _ in topp_dims
        ],
        "topp_sektorer": [
            {"sektor": s["sektor"], "score_norm": s["score"]}
            for s in topp_sektorer[:3]
        ],
        "profil_sammendrag": profil.profil_sammendrag,
        "styrker": profil.styrker,
        "match_temaer": alle_match_reasons[:6],   # unike match-reasons på tvers
        "preferanser": {
            "studier":  scoring.preferanse_signaler.studie_interesse[:3],
            "yrker":    scoring.preferanse_signaler.yrke_interesse[:3],
            "bransjer": scoring.preferanse_signaler.bransje_interesse[:3],
        },
        "topp_yrker":   [y["navn"] for y in anbefalinger.get("yrker", [])[:3]],
        "topp_studier": [s["navn"] for s in anbefalinger.get("studier", [])[:3]],
    }

    # --- 13. LLM-forklaring ---
    # Kall GPT med den pre-computed llm_context.
    # Returnerer None hvis OPENAI_API_KEY mangler eller kallet feiler —
    # anbefalingen returneres uansett.
    llm_resultat = generate_llm_explanation(llm_context)

    return {
        "dimensjoner":   dimensjoner_liste,
        "topp_sektorer": topp_sektorer,
        # Flate lister (bakoverkompatible — brukes som fallback i frontend)
        "yrker":         anbefalinger.get("yrker", []),
        "studier":       anbefalinger.get("studier", []),
        "bedrifter":     anbefalinger.get("bedrifter", []),
        # Grupperte lister (primær UX-struktur — én gruppe per sektor)
        "studier_grupper":   studier_grupper,
        "yrker_grupper":     yrker_grupper,
        "bedrifter_grupper": bedrifter_grupper,
        "profil":        profil.model_dump(),
        "preferanser":   scoring.preferanse_signaler.model_dump(),
        "llm_context":   llm_context,
        # LLM-forklaring — None hvis API-nøkkel mangler eller kall feiler
        "llm_resultat":  llm_resultat,
    }
