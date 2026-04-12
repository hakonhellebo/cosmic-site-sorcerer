"""
EdPath Anbefalings-API v2.1
============================
FastAPI-app for EdPath. Entry point for Railway-deploy.

Start lokalt:  uvicorn app:app --reload --port 8000
Railway start: uvicorn app:app --host 0.0.0.0 --port $PORT

Endepunkter:
  POST /api/anbefaling/elever       — VGS-elever
  POST /api/anbefaling/studenter    — Studenter
  POST /api/anbefaling/arbeidstaker — Arbeidstakere i karriereskifte
  POST /api/profil                  — Kun profilbeskrivelse (uten anbefalinger)

Bakoverkompatible aliaser:
  POST /api/anbefaling              → studenter
  POST /api/anbefaling/student      → studenter
  POST /api/anbefaling/elev         → elever
"""

import logging
import os
from typing import Any, Union

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from recommendation_engine import generer_anbefaling
from profil_engine import lag_profil_beskrivelse
from scoring_engine import scorer_svar
from schemas import BrukerSvar

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="EdPath Anbefalings-API",
    description=(
        "Matcher spørreundersøkelsessvar mot utdanning, yrker og bedrifter. "
        "Returnerer personaliserte anbefalinger med profilbeskrivelse."
    ),
    version="2.1.0",
)

# ---------------------------------------------------------------------------
# CORS
# ---------------------------------------------------------------------------
ALLOWED_ORIGINS = os.environ.get("CORS_ORIGINS", "*")
origins = (
    [o.strip() for o in ALLOWED_ORIGINS.split(",")]
    if ALLOWED_ORIGINS != "*"
    else ["*"]
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Helse + root
# ---------------------------------------------------------------------------

@app.get("/", include_in_schema=False)
def root():
    return {"status": "ok", "api": "EdPath Anbefalings-API", "versjon": "2.1.0"}


@app.get("/health", include_in_schema=False)
def health():
    return {"status": "ok"}


# ---------------------------------------------------------------------------
# Anbefalingsendepunkter
# ---------------------------------------------------------------------------

@app.post(
    "/api/anbefaling/studenter",
    summary="Anbefaling for studenter",
    description="Returnerer personaliserte anbefalinger med profilbeskrivelse for studenter.",
)
def anbefaling_studenter(data: BrukerSvar):
    try:
        return generer_anbefaling("student", data.svar)
    except Exception as e:
        logger.exception("Feil i student-anbefaling")
        raise HTTPException(status_code=500, detail=str(e))


@app.post(
    "/api/anbefaling/elever",
    summary="Anbefaling for VGS-elever",
    description="Returnerer personaliserte anbefalinger med profilbeskrivelse for elever.",
)
def anbefaling_elever(data: BrukerSvar):
    try:
        return generer_anbefaling("elev", data.svar)
    except Exception as e:
        logger.exception("Feil i elev-anbefaling")
        raise HTTPException(status_code=500, detail=str(e))


@app.post(
    "/api/anbefaling/arbeidstaker",
    summary="Anbefaling for arbeidstakere",
    description="Returnerer personaliserte anbefalinger med profilbeskrivelse for arbeidstakere i karriereskifte.",
)
def anbefaling_arbeidstaker(data: BrukerSvar):
    try:
        return generer_anbefaling("arbeidstaker", data.svar)
    except Exception as e:
        logger.exception("Feil i arbeidstaker-anbefaling")
        raise HTTPException(status_code=500, detail=str(e))


# ---------------------------------------------------------------------------
# Profil-endepunkt (kun profilbeskrivelse, uten full anbefaling)
# ---------------------------------------------------------------------------

class ProfilRequest(BrukerSvar):
    brukertype: str = "elev"


@app.post(
    "/api/profil",
    summary="Kun profilbeskrivelse",
    description=(
        "Returnerer kun profilbeskrivelsen uten anbefalinger. "
        "Raskere enn full anbefaling — brukes f.eks. for live-oppdatering underveis i survey."
    ),
)
def hent_profil(data: ProfilRequest):
    try:
        scoring = scorer_svar(data.brukertype, data.svar)
        profil = lag_profil_beskrivelse(scoring.dimensjon_scores, data.brukertype)
        return {
            "profil": profil.model_dump(),
            "preferanser": scoring.preferanse_signaler.model_dump(),
        }
    except Exception as e:
        logger.exception("Feil i profil-generering")
        raise HTTPException(status_code=500, detail=str(e))


# ---------------------------------------------------------------------------
# Bakoverkompatible aliaser
# ---------------------------------------------------------------------------

@app.post("/api/anbefaling", include_in_schema=False)
def anbefaling_legacy(data: BrukerSvar):
    return anbefaling_studenter(data)


@app.post("/api/anbefaling/student", include_in_schema=False)
def anbefaling_student_alias(data: BrukerSvar):
    return anbefaling_studenter(data)


@app.post("/api/anbefaling/elev", include_in_schema=False)
def anbefaling_elev_alias(data: BrukerSvar):
    return anbefaling_elever(data)
