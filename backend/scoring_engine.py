"""
scoring_engine.py
=================
Scorer brukerens svar mot dimensjoner.

Støtter to scoring-modus som aktiveres parallelt:
  1. Excel-basert (v2-matriser via survey_loader) — bakoverkompatibel med gamle question_id-er
  2. Python-basert (elev_scoring_map.py) — ny elevsurveyen

Begge bidrar additivt til det endelige dimensjon_scores-resultatet.

Profilvariabler  (is_filter_dimension=False) → dimensjon_scores
Rammevariabler   (is_filter_dimension=True)  → filter_data
Preferansefelter                             → preferanse_signaler

Vektingsprinsipp (DEL 2 — dominansbegrensning):
  - Interessespørsmål gir sterkest signal (vekt 1.0)
  - Arbeidsstil og motivasjon gir moderat signal (vekt 0.40–0.55)
  - Karriereverdier og metadata gir svakt signal (vekt 0.25–0.35)
  - Gruppebasert dominansbegrensning: ett spørsmål kan ikke gi mer enn
    _MAKS_BIDRAG_PER_SPORSMAL poeng til én dimensjon etter skalering
  - Dette hindrer at én kategori (f.eks. interesse-seksjon) dominerer
    hele profilen og eliminerer andre signaler

Forbedringer v2.3:
  - Komplett ny elev-survey (26 spørsmål) via elev_scoring_map.py
  - 5 nye spørsmål (independence_level, problem_approach, salary_importance,
    impact_importance, stability_importance)
  - Dominansbegrensning per spørsmål
  - Bedre toleranse for varierte option_value-formater
"""

from __future__ import annotations

import logging
import unicodedata
from typing import Any

from schemas import PreferanseSignaler, ScoringResultat
from survey_loader import ScoringRegel, SurveyData, hent_survey

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Dominansbegrensning (DEL 2)
# Maks poeng ett enkelt spørsmål kan bidra med til én dimensjon etter skalering.
# Forhindrer at interessespørsmål med score=5 og vekt=1.0 gir mer enn dette
# per enkelt svar, slik at mange svake signaler teller like mye som ett sterkt.
# ---------------------------------------------------------------------------
_MAKS_BIDRAG_PER_SPORSMAL = 5.0   # cap per spørsmål × dimensjon

# ---------------------------------------------------------------------------
# Side-baserte vekter for Excel-basert scoring (v2-matriser)
# ---------------------------------------------------------------------------
_PAGE_VEKTER: dict[str, float] = {
    "interesser_og_ferdigheter": 1.00,
    "studieprofil":              1.00,
    "fagprofil":                 1.00,
    "kompetanseprofil":          0.90,
    "ferdighetsprofil":          0.90,
    "motivasjon_og_verdier":     0.75,
    "fremtidsbilde_og_karriere": 0.70,
    "arbeidsstil_og_lring":      0.65,
    "arbeidsstil_og_laering":    0.65,
    "arbeidsstil":               0.65,
    "karriere":                  0.65,
    "karrierevalg":              0.65,
    "studievalg_og_avklaring":   0.50,
    "refleksjon":                0.50,
    "bakgrunn":                  0.30,
    "demografi_og_erfaring":     0.30,
    "geografi":                  0.30,
    "erfaring":                  0.40,
    "erfaring_og_teknologi":     0.40,
    "tilfredshet_og_refleksjon": 0.40,
}
_DEFAULT_PAGE_VEKT = 0.55


# ---------------------------------------------------------------------------
# Preferansefelter (brukes i BEGGE scoring-modus)
# ---------------------------------------------------------------------------
_PREFERANSE_FELT_EXCEL: dict[str, str] = {
    "study_interest":    "studie_interesse",
    "studieinteresse":   "studie_interesse",
    "career_interest":   "yrke_interesse",
    "yrkesinteresse":    "yrke_interesse",
    "company_interest":  "bedrift_interesse",
    "bedriftsinteresse": "bedrift_interesse",
    "industry_interest": "bransje_interesse",
    "bransjeinteresse":  "bransje_interesse",
}


# ---------------------------------------------------------------------------
# Normaliseringshjelper
# ---------------------------------------------------------------------------

def _normaliser(tekst: str) -> str:
    nfkd = unicodedata.normalize("NFKD", tekst)
    return "".join(c for c in nfkd if not unicodedata.combining(c)).lower().strip()


def _svar_matcher_regel(svar_verdi: str, regel: ScoringRegel) -> bool:
    sv_norm = _normaliser(svar_verdi)
    if svar_verdi == regel.option_value:
        return True
    if svar_verdi == regel.option_label:
        return True
    if sv_norm == _normaliser(regel.option_value):
        return True
    if sv_norm == _normaliser(regel.option_label):
        return True
    return False


# ---------------------------------------------------------------------------
# Excel-basert scoring (bakoverkompatibel)
# ---------------------------------------------------------------------------

def _score_excel(
    brukertype: str,
    svar: dict[str, Any],
    dimensjon_scores: dict[str, float],
    filter_data: dict[str, Any],
    preferanse_raw: dict[str, list[str]],
    ukjente_nokler: set[str],
) -> None:
    """
    Scorer svar mot v2 Excel-matrisen.
    Oppdaterer dimensjon_scores, filter_data og preferanse_raw in-place.
    Legger ukjente nøkler i ukjente_nokler for videre behandling.
    """
    try:
        survey: SurveyData = hent_survey(brukertype)
    except Exception as e:
        logger.warning("Kunne ikke laste survey for '%s': %s", brukertype, e)
        return

    regler_per_spm: dict[str, list[ScoringRegel]] = {}
    for regel in survey.scoring_regler:
        regler_per_spm.setdefault(regel.question_id, []).append(regel)

    for spm_nøkkel, råsvar in svar.items():
        if spm_nøkkel in survey.questions:
            question_id = spm_nøkkel
        elif spm_nøkkel in survey.legacy_lookup:
            question_id = survey.legacy_lookup[spm_nøkkel]
        else:
            ukjente_nokler.add(spm_nøkkel)
            continue

        q_meta = survey.questions[question_id]

        # Preferansefelter
        q_norm = _normaliser(question_id)
        if q_norm in _PREFERANSE_FELT_EXCEL:
            felt = _PREFERANSE_FELT_EXCEL[q_norm]
            verdier = råsvar if isinstance(råsvar, list) else [råsvar]
            preferanse_raw[felt].extend(str(v).strip() for v in verdier if v)
            continue

        if q_meta.is_filter:
            filter_data[question_id] = råsvar

        if not q_meta.collect_for_scoring:
            continue

        regler = regler_per_spm.get(question_id, [])
        if not regler:
            continue

        side_vekt = _PAGE_VEKTER.get(q_meta.page_id, _DEFAULT_PAGE_VEKT)
        verdier: list[Any] = råsvar if isinstance(råsvar, list) else [råsvar]

        for v in verdier:
            if isinstance(v, str):
                for regel in regler:
                    if regel.rule_type != "choice":
                        continue
                    if _svar_matcher_regel(v, regel):
                        _akkumuler(dimensjon_scores, regel, regel.score * side_vekt)
            elif isinstance(v, (int, float)):
                for regel in regler:
                    if regel.rule_type in ("scale", "scale_1_5"):
                        _akkumuler(dimensjon_scores, regel, regel.score * float(v) * side_vekt)


def _akkumuler(
    dimensjon_scores: dict[str, float],
    regel: ScoringRegel,
    score_bidrag: float,
) -> None:
    if regel.is_filter_dimension:
        return
    dim_label = regel.dimension_label or regel.dimension
    if dim_label:
        dimensjon_scores[dim_label] = dimensjon_scores.get(dim_label, 0.0) + score_bidrag


# ---------------------------------------------------------------------------
# Python-basert scoring (ny elevsurveyen)
# ---------------------------------------------------------------------------

def _score_python_elev(
    svar: dict[str, Any],
    dimensjon_scores: dict[str, float],
    filter_data: dict[str, Any],
    preferanse_raw: dict[str, list[str]],
    ukjente_nokler: set[str],
) -> None:
    """
    Scorer svar mot den nye elevsurveyen via elev_scoring_map.
    Oppdaterer dimensjon_scores, filter_data og preferanse_raw in-place.
    """
    from elev_scoring_map import (
        DIMENSJON_SCORING,
        FILTER_FELT,
        GRADE_AVG_MAP,
        PREFERANSE_FELT,
        QUESTION_VEKTER,
    )

    for spm_nøkkel, råsvar in svar.items():
        norm_key = _normaliser(spm_nøkkel)

        # --- Filterfelter ---
        if norm_key in FILTER_FELT:
            filter_key = FILTER_FELT[norm_key]
            verdier = råsvar if isinstance(råsvar, list) else [råsvar]
            if norm_key == "grade_avg_ny":
                # Konverter til eksisterende filter-format
                for v in verdier:
                    mapped = GRADE_AVG_MAP.get(_normaliser(str(v)))
                    if mapped is not None:   # None = "vet ikke", hopp over
                        filter_data["grade_average"] = mapped
            else:
                filter_data[filter_key] = råsvar
            ukjente_nokler.discard(spm_nøkkel)
            continue

        # --- Preferansefelter (som IKKE scores mot dimensjoner) ---
        if norm_key in PREFERANSE_FELT and norm_key not in DIMENSJON_SCORING:
            felt = PREFERANSE_FELT[norm_key]
            verdier = råsvar if isinstance(råsvar, list) else [råsvar]
            preferanse_raw[felt].extend(str(v).strip() for v in verdier if v)
            ukjente_nokler.discard(spm_nøkkel)
            continue

        # --- Dimensjonsscoring ---
        if norm_key not in DIMENSJON_SCORING:
            continue  # Håndteres av Excel-scoring eller ukjent

        ukjente_nokler.discard(spm_nøkkel)
        vekt = QUESTION_VEKTER.get(norm_key, 0.5)
        opsjons_map = DIMENSJON_SCORING[norm_key]
        verdier: list[Any] = råsvar if isinstance(råsvar, list) else [råsvar]

        # Preferansefelt som OGSÅ scores (bransjer)
        if norm_key in PREFERANSE_FELT:
            felt = PREFERANSE_FELT[norm_key]
            preferanse_raw[felt].extend(str(v).strip() for v in verdier if v)

        for v in verdier:
            v_norm = _normaliser(str(v))
            # Søk eksakt match, deretter normalisert match
            dim_bidrag = opsjons_map.get(v, opsjons_map.get(v_norm))
            if dim_bidrag is None:
                # Prøv å finne delvis match (nøkkel inneholder v_norm eller omvendt)
                for opt_key, bidrag in opsjons_map.items():
                    opt_norm = _normaliser(opt_key)
                    if v_norm == opt_norm:
                        dim_bidrag = bidrag
                        break
                    # Tillat delvis match bare hvis v_norm er ≥ 6 tegn (unngår falskt treff)
                    if len(v_norm) >= 6 and len(opt_norm) >= 6:
                        if v_norm in opt_norm or opt_norm in v_norm:
                            dim_bidrag = bidrag
                            break
            if dim_bidrag:
                for dimensjon, score in dim_bidrag.items():
                    # Beregn bidrag med dominansbegrensning per spørsmål
                    bidrag_skalert = min(score * vekt, _MAKS_BIDRAG_PER_SPORSMAL)
                    dimensjon_scores[dimensjon] = (
                        dimensjon_scores.get(dimensjon, 0.0) + bidrag_skalert
                    )


# ---------------------------------------------------------------------------
# Hoved-scorer
# ---------------------------------------------------------------------------

def scorer_svar(brukertype: str, svar: dict[str, Any]) -> ScoringResultat:
    """
    Scorer brukerens svar mot dimensjoner.

    Aktiverer begge scoring-modus:
      1. Excel-basert for kjente v2-question_id-er
      2. Python-basert for nye elev-spørsmål

    Begge bidrar additivt til dimensjon_scores.
    """
    dimensjon_scores: dict[str, float] = {}
    filter_data: dict[str, Any] = {}
    preferanse_raw: dict[str, list[str]] = {
        "studie_interesse": [],
        "yrke_interesse": [],
        "bedrift_interesse": [],
        "bransje_interesse": [],
    }
    ukjente_nokler: set[str] = set(svar.keys())

    # --- Modus 1: Excel-basert (v2-matriser) ---
    _score_excel(brukertype, svar, dimensjon_scores, filter_data, preferanse_raw, ukjente_nokler)

    # --- Modus 2: Python-basert (ny elevsurveyen) ---
    # Aktiveres for alle brukertypes men har bare opsjons-map for elev p.t.
    _score_python_elev(svar, dimensjon_scores, filter_data, preferanse_raw, ukjente_nokler)

    # Logg ukjente nøkler som ikke ble håndtert av noen modus
    for nøkkel in ukjente_nokler:
        norm = _normaliser(nøkkel)
        # Sjekk om det er et preferansefelt sendt direkte
        alle_pref = {**_PREFERANSE_FELT_EXCEL}
        if norm in alle_pref:
            felt = alle_pref[norm]
            verdier = svar[nøkkel] if isinstance(svar[nøkkel], list) else [svar[nøkkel]]
            preferanse_raw[felt].extend(str(v).strip() for v in verdier if v)
        else:
            logger.debug("Ukjent spørsmålsnøkkel (ignoreres): %s", nøkkel)

    preferanser = PreferanseSignaler(
        studie_interesse=preferanse_raw["studie_interesse"],
        yrke_interesse=preferanse_raw["yrke_interesse"],
        bedrift_interesse=preferanse_raw["bedrift_interesse"],
        bransje_interesse=preferanse_raw["bransje_interesse"],
    )

    return ScoringResultat(
        dimensjon_scores=dimensjon_scores,
        filter_data=filter_data,
        preferanse_signaler=preferanser,
    )


# ---------------------------------------------------------------------------
# Hjelpefunksjoner for recommendation_engine
# ---------------------------------------------------------------------------

def topp_dimensjoner(dimensjon_scores: dict[str, float], n: int = 5) -> list[tuple[str, float]]:
    """Returnerer de n høyest scorende dimensjonene, sortert fallende."""
    return sorted(dimensjon_scores.items(), key=lambda x: x[1], reverse=True)[:n]


def normaliser_scores(dimensjon_scores: dict[str, float]) -> dict[str, float]:
    """Normaliserer dimensjonscorene til 0–100-skala for visningsformål."""
    if not dimensjon_scores:
        return {}
    maks = max(dimensjon_scores.values())
    if maks <= 0:
        return {k: 0.0 for k in dimensjon_scores}
    return {k: round(v / maks * 100, 1) for k, v in dimensjon_scores.items()}
