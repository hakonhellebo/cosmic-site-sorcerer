"""
survey_loader.py
================
Laster v2-scoringsmatriser fra backend/data/ og returnerer strukturert data.

Alle datafiler ligger i BASE_DIR/data/ (relativt til denne filen).
"""

from __future__ import annotations

import logging
from dataclasses import dataclass, field
from functools import lru_cache
from pathlib import Path
from typing import Any

import pandas as pd

logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).parent
DATA_DIR = BASE_DIR / "data"

_V2_FILER: dict[str, str] = {
    "elev":         "Scoringsmatrise - Elever v2.xlsx",
    "student":      "Scoringsmatrise - Studenter v2.xlsx",
    "arbeidstaker": "Scoringsmatrise - Arbeidstaker v2.xlsx",
}


@dataclass
class QuestionMeta:
    question_id: str
    legacy_id: str
    page_id: str
    question_order: int
    text: str
    question_type: str
    required: bool
    collect_for_scoring: bool
    is_metadata: bool
    is_filter: bool
    max_select: int = 1
    min_select: int = 0
    min_value: float | None = None
    max_value: float | None = None


@dataclass
class ScoringRegel:
    rule_id: str
    question_id: str
    legacy_id: str
    option_value: str
    option_label: str
    dimension_group: str
    dimension_group_label: str
    dimension: str
    dimension_label: str
    score: float
    rule_type: str
    is_filter_dimension: bool


@dataclass
class SurveyData:
    survey_id: str
    target_group: str
    questions: dict[str, QuestionMeta] = field(default_factory=dict)
    legacy_lookup: dict[str, str] = field(default_factory=dict)
    scoring_regler: list[ScoringRegel] = field(default_factory=list)


def _les_ark(fp: Path, sheet: str) -> pd.DataFrame:
    df = pd.read_excel(fp, sheet_name=sheet)
    df.columns = [str(c).strip() for c in df.columns]
    return df


def last_survey(brukertype: str) -> SurveyData:
    if brukertype not in _V2_FILER:
        raise ValueError(f"Ukjent brukertype: {brukertype!r}. Gyldige: {list(_V2_FILER)}")

    fp = DATA_DIR / _V2_FILER[brukertype]
    if not fp.exists():
        raise FileNotFoundError(f"Finner ikke v2-fil: {fp}")

    meta_df = _les_ark(fp, "Survey_Metadata")
    meta = dict(zip(meta_df["key"], meta_df["value"]))
    data = SurveyData(
        survey_id=meta.get("survey_id", brukertype),
        target_group=meta.get("target_group", brukertype),
    )

    q_df = _les_ark(fp, "Questions")
    for _, row in q_df.iterrows():
        qid = str(row["question_id"]).strip()
        lid = str(row.get("legacy_id", "")).strip() if pd.notna(row.get("legacy_id")) else ""
        qmeta = QuestionMeta(
            question_id=qid,
            legacy_id=lid,
            page_id=str(row.get("page_id", "")).strip(),
            question_order=int(row.get("question_order", 0)) if pd.notna(row.get("question_order")) else 0,
            text=str(row.get("text", "")).strip(),
            question_type=str(row.get("type", "text")).strip(),
            required=bool(row.get("required", False)),
            collect_for_scoring=bool(row.get("collect_for_scoring", False)),
            is_metadata=bool(row.get("is_metadata", False)),
            is_filter=bool(row.get("is_filter", False)),
            max_select=int(row["max_select"]) if pd.notna(row.get("max_select")) else 1,
            min_select=int(row["min_select"]) if pd.notna(row.get("min_select")) else 0,
            min_value=float(row["min_value"]) if pd.notna(row.get("min_value")) else None,
            max_value=float(row["max_value"]) if pd.notna(row.get("max_value")) else None,
        )
        data.questions[qid] = qmeta
        if lid:
            data.legacy_lookup[lid] = qid

    s_df = _les_ark(fp, "Scoring")
    for _, row in s_df.iterrows():
        rule_type = str(row.get("rule_type", "choice")).strip()
        if rule_type == "open_text":
            continue
        score_raw = row.get("score", 0)
        score = float(score_raw) if pd.notna(score_raw) else 0.0
        opt_val = str(row.get("option_value", "")).strip() if pd.notna(row.get("option_value")) else ""
        opt_lab = str(row.get("option_label", "")).strip() if pd.notna(row.get("option_label")) else ""
        dim = str(row.get("dimension", "")).strip() if pd.notna(row.get("dimension")) else ""
        dim_lab = str(row.get("dimension_label", "")).strip() if pd.notna(row.get("dimension_label")) else dim
        if not dim or dim == "value":
            continue
        data.scoring_regler.append(ScoringRegel(
            rule_id=str(row.get("rule_id", "")).strip(),
            question_id=str(row.get("question_id", "")).strip(),
            legacy_id=str(row.get("legacy_id", "")).strip() if pd.notna(row.get("legacy_id")) else "",
            option_value=opt_val,
            option_label=opt_lab,
            dimension_group=str(row.get("dimension_group", "")).strip(),
            dimension_group_label=str(row.get("dimension_group_label", "")).strip(),
            dimension=dim,
            dimension_label=dim_lab,
            score=score,
            rule_type=rule_type,
            is_filter_dimension=bool(row.get("is_filter_dimension", False)),
        ))

    logger.info("survey_loader: lastet %s — %d spørsmål, %d regler",
                brukertype, len(data.questions), len(data.scoring_regler))
    return data


@lru_cache(maxsize=None)
def hent_survey(brukertype: str) -> SurveyData:
    return last_survey(brukertype)
