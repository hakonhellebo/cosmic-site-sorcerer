"""
enrich_bedrifter.py
===================
Beriker Bedrifter_ny-tabellen i Supabase med:

1. Excel-data   → ansetter_til_yrker + ansetter_fra_studier
                   (fra connections-sortert.xlsx, allerede i prosjektet)

2. Brønnøysund  → organisasjonsnummer, stiftelsesaar, nace_kode/beskrivelse,
Registeret API    antall_ansatte_tall
(gratis, offentlig)

3. Regnskaps-   → Driftsinntekter (MNOK), driftsresultat_mnok, regnskapsaar
registeret API    (gratis, offentlig — Brønnøy-delsystem)

4. OpenAI       → ai_beskrivelse: rik norsk beskrivelse (2–3 avsnitt)
                  basert på sektor + nace + yrker + studier + regnskapstall

Bruker:
  SUPABASE_URL          (eller VITE_SUPABASE_URL)
  SUPABASE_SERVICE_KEY  (service_role-nøkkel, hentes fra Supabase → Settings → API)
  OPENAI_API_KEY        (valgfri — hopper over AI-beskrivelse hvis mangler)

Kjøring:
  python enrich_bedrifter.py               # fullt kjør
  python enrich_bedrifter.py --dry-run     # vis hva som ville blitt gjort
  python enrich_bedrifter.py --skip-brreg  # bare Excel + AI (uten Brønnøy-lookup)
  python enrich_bedrifter.py --skip-ai     # bare Excel + Brønnøy (uten AI)
  python enrich_bedrifter.py --limit 20    # maks 20 bedrifter (test)
  python enrich_bedrifter.py --reset       # re-prosesser allerede beriket

Fortsettbar: sjekker `brreg_hentet` — hopper over bedrifter som er ferdig.
"""

from __future__ import annotations

import argparse
import json
import logging
import os
import time
from typing import Optional

import pandas as pd
import requests

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Konfig
# ---------------------------------------------------------------------------

EXCEL_PATH  = os.path.join(os.path.dirname(__file__), "data", "connections-sortert.xlsx")
BRREG_URL   = "https://data.brreg.no/enhetsregisteret/api/enheter"
REGNSKAP_URL= "https://data.brreg.no/regnskapsregisteret/regnskap"

BRREG_DELAY   = 0.4   # sekunder mellom Brønnøy-kall
REGNSKAP_DELAY= 0.3   # sekunder mellom regnskaps-kall
AI_DELAY      = 0.2   # sekunder mellom OpenAI-kall

MAX_YRKER   = 6       # maks antall yrker å lagre per bedrift
MAX_STUDIER = 6       # maks antall studier å lagre per bedrift


# ---------------------------------------------------------------------------
# 1. Excel → company_map  {navn_upper: {yrker, studier, sektorer}}
# ---------------------------------------------------------------------------

def bygg_excel_map(excel_path: str) -> dict[str, dict]:
    """Leser connections-sortert.xlsx og lager oppslags-dict per bedrift."""
    log.info("Laster Excel-data fra %s …", excel_path)
    xl  = pd.ExcelFile(excel_path)
    frames = []
    for sheet in xl.sheet_names:
        df = xl.parse(sheet)
        df["_sektor"] = sheet
        frames.append(df)
    all_data = pd.concat(frames, ignore_index=True)

    company_map: dict[str, dict] = {}
    for _, row in all_data.iterrows():
        navn = str(row.get("Bedrifter", "")).strip().upper()
        if not navn or navn == "NAN":
            continue

        entry = company_map.setdefault(navn, {
            "yrker":   set(),
            "studier": set(),
            "sektorer": set(),
        })

        yrke = str(row.get("Alle yrker", "")).strip()
        if yrke and yrke.upper() != "NAN":
            entry["yrker"].add(yrke)

        studie = str(row.get("Studielinje", "")).strip()
        if studie and studie.upper() != "NAN":
            entry["studier"].add(studie)

        sektor = str(row.get("_sektor", "")).strip()
        if sektor:
            entry["sektorer"].add(sektor)

    # Konverter sets → lister
    for key in company_map:
        entry = company_map[key]
        entry["yrker"]   = sorted(entry["yrker"])[:MAX_YRKER]
        entry["studier"] = sorted(entry["studier"])[:MAX_STUDIER]
        entry["sektorer"]= sorted(entry["sektorer"])

    log.info("Excel: %d unike bedrifter lest", len(company_map))
    return company_map


# ---------------------------------------------------------------------------
# 2. Brønnøysundregisteret
# ---------------------------------------------------------------------------

def brreg_sok(navn: str) -> Optional[dict]:
    """
    Søker på bedriftsnavn i Enhetsregisteret.
    Returnerer første treff som dict, eller None.
    """
    try:
        resp = requests.get(
            BRREG_URL,
            params={"navn": navn, "size": 5},
            headers={"Accept": "application/json"},
            timeout=10,
        )
        resp.raise_for_status()
        data = resp.json()
        enheter = data.get("_embedded", {}).get("enheter", [])
        if not enheter:
            return None

        # Velg beste treff: prøv eksakt match på navn (case-insensitiv)
        navn_norm = navn.upper().replace(" AS", "").replace(" ASA", "").strip()
        for enhet in enheter:
            brreg_navn = enhet.get("navn", "").upper().replace(" AS", "").replace(" ASA", "").strip()
            if brreg_navn == navn_norm:
                return enhet

        # Ellers: første treff
        return enheter[0]

    except Exception as exc:
        log.debug("Brønnøy-søk feilet for '%s': %s", navn, exc)
        return None


def parse_brreg(enhet: dict) -> dict:
    """Trekker ut relevante felter fra Brønnøy-enhet."""
    adresse = enhet.get("forretningsadresse", {})
    nace    = enhet.get("naeringskode1", {})
    return {
        "organisasjonsnummer": enhet.get("organisasjonsnummer"),
        "stiftelsesaar":       _aar(enhet.get("stiftelsesdato")),
        "nace_kode":           nace.get("kode"),
        "nace_beskrivelse":    nace.get("beskrivelse"),
        "antall_ansatte_tall": enhet.get("antallAnsatte"),
        "hjemsted":            adresse.get("poststed"),
    }


def _aar(dato_str: Optional[str]) -> Optional[int]:
    """Trekker ut årstall fra ISO-datostreng."""
    if not dato_str:
        return None
    try:
        return int(dato_str[:4])
    except (ValueError, TypeError):
        return None


# ---------------------------------------------------------------------------
# 3. Regnskapsregisteret
# ---------------------------------------------------------------------------

def hent_regnskap(orgnr: str) -> dict:
    """
    Henter siste tilgjengelige årsregnskap fra Regnskapsregisteret.
    Returnerer dict med omsetning_mnok, driftsresultat_mnok, regnskapsaar.
    """
    try:
        url  = f"{REGNSKAP_URL}/{orgnr}"
        resp = requests.get(url, headers={"Accept": "application/json"}, timeout=10)
        if resp.status_code == 404:
            return {}
        resp.raise_for_status()

        regnskaper = resp.json()
        if not regnskaper:
            return {}

        # Sorter på år (nyeste først)
        def _aar_key(r: dict) -> int:
            try:
                return int(r.get("regnskapsperiode", {}).get("fraDato", "0")[:4])
            except (ValueError, TypeError):
                return 0

        siste = sorted(regnskaper, key=_aar_key, reverse=True)[0]
        periode = siste.get("regnskapsperiode", {})
        fra_dato = periode.get("fraDato", "")
        aar = _aar(fra_dato)

        # Feltnavn varierer mellom regnskapstyper — prøv vanligste
        sum_inntekter = (
            siste.get("sumInntekter")
            or siste.get("driftsinntekter", {}).get("sumDriftsinntekter")
            or siste.get("virksomhet", {}).get("sumDriftsinntekter")
        )
        driftsres = (
            siste.get("driftsresultat")
            or siste.get("ordinaertResultatFoerSkattekostnad")
        )

        def to_mnok(val) -> Optional[float]:
            if val is None:
                return None
            try:
                return round(float(val) / 1_000_000, 1)
            except (ValueError, TypeError):
                return None

        return {
            "Driftsinntekter (MNOK)": str(to_mnok(sum_inntekter)) if to_mnok(sum_inntekter) else None,
            "driftsresultat_mnok":    to_mnok(driftsres),
            "regnskapsaar":           aar,
        }

    except Exception as exc:
        log.debug("Regnskap-kall feilet for orgnr %s: %s", orgnr, exc)
        return {}


# ---------------------------------------------------------------------------
# 4. OpenAI AI-beskrivelse
# ---------------------------------------------------------------------------

_AI_SYSTEM = """\
Du er en karriereveileder som skriver korte, informative bedriftsprofiler på norsk bokmål.
Skriv en sammenhengende beskrivelse i 3 avsnitt (ingen overskrifter):
1. Hva bedriften gjør og hvilken bransje de er i
2. Hvem de ansetter — typiske stillinger og relevante utdanningsbakgrunner
3. Størrelse, omsetning og/eller markedsposisjon hvis kjent

Hold hvert avsnitt til 2–3 setninger. Unngå fluffy markedsføringsspråk.
Returner KUN beskrivelsen — ingen JSON, ingen lister.
"""


def generer_ai_beskrivelse(
    navn: str,
    sektor: str,
    sub_sektor: str,
    nace_beskrivelse: Optional[str],
    yrker: list[str],
    studier: list[str],
    ansatte: Optional[str],
    omsetning_mnok: Optional[str],
    client,
) -> Optional[str]:
    """Genererer rik norsk bedriftsbeskrivelse med GPT-4.1-mini."""
    deler = [f"Bedrift: {navn}"]
    deler.append(f"Sektor: {sektor}" + (f" / {sub_sektor}" if sub_sektor else ""))
    if nace_beskrivelse:
        deler.append(f"Næringskode (NACE): {nace_beskrivelse}")
    if yrker:
        deler.append(f"Typiske stillinger: {', '.join(yrker[:4])}")
    if studier:
        deler.append(f"Relevante utdanninger: {', '.join(studier[:4])}")
    if ansatte:
        deler.append(f"Antall ansatte: {ansatte}")
    if omsetning_mnok:
        deler.append(f"Driftsinntekter: {omsetning_mnok} MNOK")

    user_prompt = "\n".join(deler) + "\n\nSkriv nå bedriftsprofilen:"

    try:
        resp = client.responses.create(
            model="gpt-4.1-mini",
            input=[
                {"role": "developer", "content": _AI_SYSTEM},
                {"role": "user",      "content": user_prompt},
            ],
        )
        tekst = resp.output_text.strip()
        return tekst if tekst else None
    except Exception as exc:
        log.debug("AI-beskrivelse feilet for '%s': %s", navn, exc)
        return None


# ---------------------------------------------------------------------------
# 5. Supabase-klient
# ---------------------------------------------------------------------------

def bygg_supabase_klient():
    """Lager Supabase-klient fra miljøvariabler."""
    from supabase import create_client

    url = os.getenv("SUPABASE_URL") or os.getenv("VITE_SUPABASE_URL")
    key = (
        os.getenv("SUPABASE_SERVICE_KEY")   # service_role — foretrekkes
        or os.getenv("SUPABASE_KEY")
        or os.getenv("VITE_SUPABASE_PUBLISHABLE_KEY")  # anon key — fallback
    )
    if not url or not key:
        raise ValueError(
            "Sett SUPABASE_URL og SUPABASE_SERVICE_KEY i miljøvariabler.\n"
            "Service key finner du her: Supabase → Settings → API → service_role"
        )
    log.info("Kobler til Supabase: %s", url)
    return create_client(url, key)


# ---------------------------------------------------------------------------
# 6. Hent alle bedrifter fra Supabase
# ---------------------------------------------------------------------------

def hent_bedrifter(supabase_client, reset: bool) -> list[dict]:
    """Henter bedrifter som skal berikes."""
    query = supabase_client.table("Bedrifter_ny").select("*")
    if not reset:
        # Bare de som ikke er ferdig beriket ennå
        query = query.eq("brreg_hentet", False)
    resp = query.execute()
    rows = resp.data or []
    log.info("Fant %d bedrifter å berike", len(rows))
    return rows


# ---------------------------------------------------------------------------
# 7. Oppdater én bedrift i Supabase
# ---------------------------------------------------------------------------

def oppdater_bedrift(supabase_client, selskap: str, payload: dict, dry_run: bool):
    """Skriver beriket data tilbake til Supabase."""
    payload["brreg_hentet"]   = True
    payload["sist_oppdatert"] = "now()"

    if dry_run:
        log.info("[DRY-RUN] Ville oppdatert '%s':\n%s", selskap,
                 json.dumps({k: v for k, v in payload.items() if v is not None}, ensure_ascii=False, indent=2))
        return

    try:
        supabase_client.table("Bedrifter_ny") \
            .update(payload) \
            .eq("Selskap", selskap) \
            .execute()
    except Exception as exc:
        log.warning("Supabase-oppdatering feilet for '%s': %s", selskap, exc)


# ---------------------------------------------------------------------------
# 8. Hoved-løkke
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="Berik Bedrifter_ny-tabellen")
    parser.add_argument("--dry-run",    action="store_true", help="Vis hva som ville blitt gjort")
    parser.add_argument("--skip-brreg", action="store_true", help="Hopp over Brønnøy-oppslag")
    parser.add_argument("--skip-ai",    action="store_true", help="Hopp over AI-beskrivelse")
    parser.add_argument("--reset",      action="store_true", help="Re-prosesser allerede beriket")
    parser.add_argument("--limit",      type=int, default=0,  help="Maks antall bedrifter (0=alle)")
    args = parser.parse_args()

    # ── Klienter ──
    supabase_client = bygg_supabase_klient()
    excel_map       = bygg_excel_map(EXCEL_PATH)

    openai_client = None
    if not args.skip_ai:
        api_key = os.getenv("OPENAI_API_KEY")
        if api_key:
            from openai import OpenAI
            openai_client = OpenAI(api_key=api_key)
            log.info("OpenAI aktivert — vil generere AI-beskrivelser")
        else:
            log.warning("OPENAI_API_KEY ikke satt — hopper over AI-beskrivelser")

    # ── Hent bedrifter ──
    bedrifter = hent_bedrifter(supabase_client, args.reset)
    if args.limit:
        bedrifter = bedrifter[:args.limit]
        log.info("Begrenset til %d bedrifter", args.limit)

    stats = {"brreg_treff": 0, "regnskap_treff": 0, "ai_treff": 0, "feilet": 0}

    for i, row in enumerate(bedrifter, 1):
        selskap    = (row.get("Selskap") or "").strip()
        sektor     = row.get("Sektor") or ""
        sub_sektor = row.get("sub_sektor") or ""
        ansatte    = row.get("Ansatte") or ""
        omsetning  = row.get("Driftsinntekter (MNOK)") or ""

        if not selskap:
            continue

        log.info("[%d/%d] %s", i, len(bedrifter), selskap)
        payload: dict = {}

        # ── Excel-data ──
        excel_entry = excel_map.get(selskap.upper(), {})
        yrker   = excel_entry.get("yrker", [])
        studier = excel_entry.get("studier", [])

        if yrker:
            payload["ansetter_til_yrker"]   = ", ".join(yrker)
        if studier:
            payload["ansetter_fra_studier"] = ", ".join(studier)

        # ── Brønnøysundregisteret ──
        nace_beskrivelse = None
        orgnr            = None

        if not args.skip_brreg:
            enhet = brreg_sok(selskap)
            time.sleep(BRREG_DELAY)

            if enhet:
                brreg_data     = parse_brreg(enhet)
                orgnr          = brreg_data.get("organisasjonsnummer")
                nace_beskrivelse = brreg_data.get("nace_beskrivelse")

                # Oppdater ansatte-tall hvis Brønnøy har eksakt tall
                if brreg_data.get("antall_ansatte_tall") and not ansatte:
                    ansatte_txt = str(brreg_data["antall_ansatte_tall"])
                    payload["Ansatte"] = ansatte_txt
                    ansatte = ansatte_txt

                # Oppdater lokasjon hvis tom
                if brreg_data.get("hjemsted") and not row.get("Lokasjon"):
                    payload["Lokasjon"] = brreg_data["hjemsted"]

                for felt in ["organisasjonsnummer", "stiftelsesaar", "nace_kode",
                             "nace_beskrivelse", "antall_ansatte_tall"]:
                    if brreg_data.get(felt) is not None:
                        payload[felt] = brreg_data[felt]

                stats["brreg_treff"] += 1
                log.debug("  Brønnøy: orgnr=%s, nace=%s, ansatte=%s",
                          orgnr, nace_beskrivelse, brreg_data.get("antall_ansatte_tall"))
            else:
                log.debug("  Brønnøy: ingen treff")

            # ── Regnskapsregisteret ──
            if orgnr:
                regnskap = hent_regnskap(orgnr)
                time.sleep(REGNSKAP_DELAY)

                if regnskap:
                    # Oppdater omsetning bare hvis vi fikk et tall og feltet er tomt
                    if regnskap.get("Driftsinntekter (MNOK)") and not omsetning:
                        payload["Driftsinntekter (MNOK)"] = regnskap["Driftsinntekter (MNOK)"]
                        omsetning = regnskap["Driftsinntekter (MNOK)"]
                    if regnskap.get("driftsresultat_mnok") is not None:
                        payload["driftsresultat_mnok"] = regnskap["driftsresultat_mnok"]
                    if regnskap.get("regnskapsaar"):
                        payload["regnskapsaar"] = regnskap["regnskapsaar"]
                    stats["regnskap_treff"] += 1
                    log.debug("  Regnskap: omsetning=%s MNOK (år %s)",
                              omsetning, regnskap.get("regnskapsaar"))

        # ── AI-beskrivelse ──
        if openai_client and (not row.get("ai_beskrivelse") or args.reset):
            beskrivelse = generer_ai_beskrivelse(
                navn            = selskap,
                sektor          = sektor,
                sub_sektor      = sub_sektor,
                nace_beskrivelse= nace_beskrivelse,
                yrker           = yrker,
                studier         = studier,
                ansatte         = ansatte or None,
                omsetning_mnok  = omsetning or None,
                client          = openai_client,
            )
            time.sleep(AI_DELAY)
            if beskrivelse:
                payload["ai_beskrivelse"] = beskrivelse
                # Overskriv tom Beskrivelse med AI-versjon
                if not row.get("Beskrivelse"):
                    payload["Beskrivelse"] = beskrivelse
                stats["ai_treff"] += 1

        # ── Nøkkelord ──
        if yrker or studier or nace_beskrivelse:
            noekkelord_parts = list(yrker[:3]) + list(studier[:2])
            if nace_beskrivelse:
                noekkelord_parts.append(nace_beskrivelse)
            payload["noekkelord"] = ", ".join(noekkelord_parts)

        # ── Skriv til Supabase ──
        if payload:
            oppdater_bedrift(supabase_client, selskap, payload, args.dry_run)
        else:
            log.debug("  Ingen nye data funnet — hopper over")

    # ── Sluttrapport ──
    log.info(
        "\n=== FERDIG ===\n"
        "  Behandlet:       %d bedrifter\n"
        "  Brønnøy-treff:   %d\n"
        "  Regnskap-treff:  %d\n"
        "  AI-beskrivelser: %d\n"
        "  Feilet:          %d",
        len(bedrifter),
        stats["brreg_treff"],
        stats["regnskap_treff"],
        stats["ai_treff"],
        stats["feilet"],
    )


if __name__ == "__main__":
    main()
