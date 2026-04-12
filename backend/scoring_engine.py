"""
scoring_engine.py
=================
Scorer brukerens svar mot dimensjoner fra v2-scoringsmatrisen.

Profilvariabler  (is_filter_dimension=False) → dimensjon_scores
Rammevariabler   (is_filter_dimension=True)  → filter_data
"""

from __future__ import annotations

import logging
import unicodedata
from typing import Any

from schemas import ScoringResultat
from survey_loader import ScoringRegel, SurveyData, hent_survey

logger = logging.getLogger(__name__)


def _normaliser(tekst: str) -> str:
    nfkd = unicodedata.normalize("NFKD", tekst)
    ascii_str = "".join(c for c in nfkd if not unicodedata.combining(c))
    return ascii_str.lower().strip()


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


def scorer_svar(brukertype: str, svar: dict[str, Any]) -> ScoringResultat:
    survey: SurveyData = hent_survey(brukertype)

    regler_per_spm: dict[str, list[ScoringRegel]] = {}
    for regel in survey.scoring_regler:
        regler_per_spm.setdefault(regel.question_id, []).append(regel)

    dimensjon_scores: dict[str, float] = {}
    filter_data: dict[str, Any] = {}

    for spm_nøkkel, råsvar in svar.items():
        if spm_nøkkel in survey.questions:
            question_id = spm_nøkkel
        elif spm_nøkkel in survey.legacy_lookup:
            question_id = survey.legacy_lookup[spm_nøkkel]
        else:
            logger.debug("Ukjent spørsmålsnøkkel (ignoreres): %s", spm_nøkkel)
            continue

        q_meta = survey.questions[question_id]

        if q_meta.is_filter:
            filter_data[question_id] = råsvar

        if not q_meta.collect_for_scoring:
            continue

        regler = regler_per_spm.get(question_id, [])
        if not regler:
            continue

        verdier: list[Any] = råsvar if isinstance(råsvar, list) else [råsvar]

        for v in verdier:
            if isinstance(v, str):
                for regel in regler:
                    if regel.rule_type != "choice":
                        continue
                    if _svar_matcher_regel(v, regel):
                        _akkumuler(dimensjon_scores, regel, regel.score)
            elif isinstance(v, (int, float)):
                for regel in regler:
                    if regel.rule_type in ("scale", "scale_1_5"):
                        _akkumuler(dimensjon_scores, regel, regel.score * float(v))

    return ScoringResultat(
        dimensjon_scores=dimensjon_scores,
        filter_data=filter_data,
    )


def _akkumuler(dimensjon_scores: dict[str, float], regel: ScoringRegel, score_bidrag: float) -> None:
    if regel.is_filter_dimension:
        return
    dim_label = regel.dimension_label or regel.dimension
    if dim_label:
        dimensjon_scores[dim_label] = dimensjon_scores.get(dim_label, 0.0) + score_bidrag


def topp_dimensjoner(dimensjon_scores: dict[str, float], n: int = 3) -> list[tuple[str, float]]:
    return sorted(dimensjon_scores.items(), key=lambda x: x[1], reverse=True)[:n]
