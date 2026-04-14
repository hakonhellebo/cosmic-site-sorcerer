"""
import_schools.py
=================
Importerer 432 videregående skoler fra CSV inn i survey_options
for spørsmål school_name_ny i elevsurveyen.

Kjøring:
  cd /Users/Skole/cosmic-site-sorcerer/backend
  python3 import_schools.py
"""

from __future__ import annotations
import csv
import io
from pathlib import Path
from supabase import create_client, Client

SUPABASE_URL = "https://zcfclojzyqezuuwxzrzq.supabase.co"
SUPABASE_KEY = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
    "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjZmNsb2p6eXFlenV1d3h6cnpxIiwicm9sZSI6"
    "InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzUxNjM4MywiZXhwIjoyMDU5MDkyMzgzfQ."
    "DnCDEHCibOMmYCSdhFrWY6FAEsNjK5BpWzmPNatRcWc"
)

SURVEY_ID   = "elev"
QUESTION_ID = "school_name_ny"
CSV_PATH    = Path("/Users/Skole/Downloads/Videregående skoler.csv")
BATCH_SIZE  = 100


def parse_schools() -> list[dict]:
    with open(CSV_PATH, encoding="latin-1") as f:
        content = f.read()

    reader = csv.DictReader(io.StringIO(content), delimiter=";")
    schools = []
    for row in reader:
        if row.get("EnhetNivaa", "").strip() == "3":
            name = row.get("EnhetNavn", "").strip()
            fylke = row.get("Fylke", "").strip()
            if name:
                schools.append({"name": name, "fylke": fylke})

    # Deduplicate by name
    seen = set()
    unique = []
    for s in schools:
        if s["name"] not in seen:
            seen.add(s["name"])
            unique.append(s)

    unique.sort(key=lambda x: x["name"])
    print(f"Parsed {len(unique)} unique schools from CSV")
    return unique


def main():
    sb: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

    # 1. Delete existing school options for this question
    print("Sletter eksisterende school_name_ny alternativer...")
    sb.table("survey_options").delete().eq("survey_id", SURVEY_ID).eq("question_id", QUESTION_ID).execute()
    print("  OK")

    # 2. Parse schools
    schools = parse_schools()

    # 3. Build rows
    rows = []
    for i, school in enumerate(schools):
        # option_value = normalized school name slug
        slug = school["name"].lower().replace(" ", "_").replace("(", "").replace(")", "").replace("/", "_")[:80]
        rows.append({
            "survey_id":    SURVEY_ID,
            "question_id":  QUESTION_ID,
            "option_value": slug,
            "option_label": school["name"],
            "option_order": i + 1,
            "is_exclusive": False,
            "is_open_text": False,
            "target_group": SURVEY_ID,
        })

    # 4. Insert in batches
    print(f"Inserter {len(rows)} skoler i Supabase...")
    inserted = 0
    for start in range(0, len(rows), BATCH_SIZE):
        batch = rows[start:start + BATCH_SIZE]
        sb.table("survey_options").insert(batch).execute()
        inserted += len(batch)
        print(f"  {inserted}/{len(rows)} ...")

    # 5. Verify
    res = sb.table("survey_options").select("option_value", count="exact").eq("survey_id", SURVEY_ID).eq("question_id", QUESTION_ID).execute()
    print(f"\n✓ Ferdig! {res.count} skoler i Supabase for school_name_ny")


if __name__ == "__main__":
    main()
