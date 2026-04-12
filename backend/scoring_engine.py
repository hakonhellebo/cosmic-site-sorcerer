"""
scoring_engine.py
=================
Scorer brukerens svar mot dimensjoner fra v2-scoringsmatrisen.

Profilvariabler  (is_filter_dimension=False) → dimensjon_scores
Rammevariabler   (is_filter_dimension=True)  → filter_data
Preferansefelter (studie_interesse etc.)     → preferanse_signaler

Forbedringer v2.1:
  - Side-basert vekting: interessespørsmål vektes høyere enn arbeidsstil-spørsmål
  - Preferansesignal-ekstraksjon for eksplisitte brukerpreferanser
  - Normalisering per dimensjon for å hindre dominans fra én spørsmålsgruppe
"""

from __future__ import annotations

import logging
import unicodedata
from typing import Any

from schemas import PreferanseSignaler, ScoringResultat
from survey_loader import ScoringRegel, SurveyData, hent_survey

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Vekter per side (page_id) — justerer hvor mye hvert spørsmål bidrar til score
# ---------------------------------------------------------------------------
# Interesse og ferdigheter har høyest vekt; metadata/bakgrunn lavest
_PAGE_VEKTER: dict[str, float] = {
    # Elev
    "interesser_og_ferdigheter": 1.0,
    # Student
    "studieprofil":              1.0,
    "ferdighetsprofil":          0.9,
    # Arbeidstaker
    "fagprofil":                 1.0,
    "kompetanseprofil":          0.9,
    # Felles
    "motivasjon_og_verdier":     0.75,
    "fremtidsbilde_og_karriere": 0.70,
    "arbeidsstil_og_lring":      0.65,
    "arbeidsstil_og_laering":    0.65,
    "studievalg_og_avklaring":   0.50,
    "karrierevalg":              0.50,
    "bakgrunn":                  0.30,
    "demografi_og_erfaring":     0.30,
}
_DEFAULT_PAGE_VEKT = 0.55


# ---------------------------------------------------------------------------
# Spørsmål-ID-er som betraktes som eksplisitte preferansesignaler
# (ikke scoret mot dimensjoner, men ekstrahert som soft signals)
# ---------------------------------------------------------------------------
_PREFERANSE_FELT: dict[str, str] = {
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
    ascii_str = "".join(c for c in nfkd if not unicodedata.combining(c))
    return ascii_str.lower().strip()


def _svar_matcher_regel(svar_verdi: str, regel: ScoringRegel) -> bool:
    """Returnerer True hvis svar_verdi treffer scoring-regelen (eksakt eller normalisert)."""
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
# Hoved-scorer
# ---------------------------------------------------------------------------

def scorer_svar(brukertype: str, svar: dict[str, Any]) -> ScoringResultat:
    survey: SurveyData = hent_survey(brukertype)

    regler_per_spm: dict[str, list[ScoringRegel]] = {}
    for regel in survey.scoring_regler:
        regler_per_spm.setdefault(regel.question_id, []).append(regel)

    dimensjon_scores: dict[str, float] = {}
    filter_data: dict[str, Any] = {}
    preferanse_raw: dict[str, list[str]] = {k: [] for k in set(_PREFERANSE_FELT.values())}

    for spm_nøkkel, råsvar in svar.items():
        # --- Løs opp question_id / legacy_id ---
        if spm_nøkkel in survey.questions:
            question_id = spm_nøkkel
        elif spm_nøkkel in survey.legacy_lookup:
            question_id = survey.legacy_lookup[spm_nøkkel]
        else:
            # Sjekk om det er et preferansefelt (kan komme direkte uten å stå i matrisen)
            norm_key = _normaliser(spm_nøkkel)
            if norm_key in _PREFERANSE_FELT:
                felt = _PREFERANSE_FELT[norm_key]
                verdier = råsvar if isinstance(råsvar, list) else [råsvar]
                preferanse_raw[felt].extend(str(v).strip() for v in verdier if v)
            else:
                logger.debug("Ukjent spørsmålsnøkkel (ignoreres): %s", spm_nøkkel)
            continue

        q_meta = survey.questions[question_id]

        # --- Preferansefelt-ekstraksjon (også fra kjente question_id-er) ---
        q_norm = _normaliser(question_id)
        if q_norm in _PREFERANSE_FELT:
            felt = _PREFERANSE_FELT[q_norm]
            verdier = råsvar if isinstance(råsvar, list) else [råsvar]
            preferanse_raw[felt].extend(str(v).strip() for v in verdier if v)
            # Disse skal ikke scores videre
            continue

        # --- Filterdata ---
        if q_meta.is_filter:
            filter_data[question_id] = råsvar

        if not q_meta.collect_for_scoring:
            continue

        regler = regler_per_spm.get(question_id, [])
        if not regler:
            continue

        # Hent side-vekt for dette spørsmålet
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

    # Bygg PreferanseSignaler
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


def topp_dimensjoner(dimensjon_scores: dict[str, float], n: int = 5) -> list[tuple[str, float]]:
    """Returnerer de n høyest scorende dimensjonene, sortert fallende."""
    return sorted(dimensjon_scores.items(), key=lambda x: x[1], reverse=True)[:n]


def normaliser_scores(dimensjon_scores: dict[str, float]) -> dict[str, float]:
    """
    Normaliserer dimensjonscorene til 0–100-skala.
    Brukes for visningsformål og sammensatt matching.
    """
    if not dimensjon_scores:
        return {}
    maks = max(dimensjon_scores.values())
    if maks <= 0:
        return {k: 0.0 for k in dimensjon_scores}
    return {k: round(v / maks * 100, 1) for k, v in dimensjon_scores.items()}
