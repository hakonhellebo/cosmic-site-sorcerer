"""
EdPath Anbefalings-API
======================
FastAPI-app for EdPath. Entry point for Railway-deploy.

Start lokalt:  uvicorn app:app --reload --port 8000
Railway start: uvicorn app:app --host 0.0.0.0 --port $PORT
"""

import logging
import os
from typing import Union

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from recommendation_engine import generer_anbefaling
from schemas import BrukerSvar

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="EdPath Anbefalings-API",
    description="Matcher spørreundersøkelsessvar mot utdanning, yrker og bedrifter.",
    version="2.0.0",
)

# ---------------------------------------------------------------------------
# CORS — tillater Lovable preview + produksjon
# ---------------------------------------------------------------------------
ALLOWED_ORIGINS = os.environ.get(
    "CORS_ORIGINS",
    "*",  # default: tillat alle (begrens til Lovable-URL i produksjon)
)
origins = [o.strip() for o in ALLOWED_ORIGINS.split(",")] if ALLOWED_ORIGINS != "*" else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Endepunkter
# ---------------------------------------------------------------------------

@app.get("/", include_in_schema=False)
def root():
    return {"status": "ok", "api": "EdPath Anbefalings-API v2.0"}


@app.get("/health", include_in_schema=False)
def health():
    return {"status": "ok"}


@app.post("/api/anbefaling/studenter", summary="Anbefaling for studenter")
def anbefaling_studenter(data: BrukerSvar):
    try:
        return generer_anbefaling("student", data.svar)
    except Exception as e:
        logger.exception("Feil i student-anbefaling")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/anbefaling/elever", summary="Anbefaling for VGS-elever")
def anbefaling_elever(data: BrukerSvar):
    try:
        return generer_anbefaling("elev", data.svar)
    except Exception as e:
        logger.exception("Feil i elev-anbefaling")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/anbefaling/arbeidstaker", summary="Anbefaling for arbeidstakere")
def anbefaling_arbeidstaker(data: BrukerSvar):
    try:
        return generer_anbefaling("arbeidstaker", data.svar)
    except Exception as e:
        logger.exception("Feil i arbeidstaker-anbefaling")
        raise HTTPException(status_code=500, detail=str(e))


# Bakoverkompatible aliaser
@app.post("/api/anbefaling", include_in_schema=False)
def anbefaling_legacy(data: BrukerSvar):
    return anbefaling_studenter(data)

@app.post("/api/anbefaling/student", include_in_schema=False)
def anbefaling_student_alias(data: BrukerSvar):
    return anbefaling_studenter(data)

@app.post("/api/anbefaling/elev", include_in_schema=False)
def anbefaling_elev_alias(data: BrukerSvar):
    return anbefaling_elever(data)
