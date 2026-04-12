"""
supabase_preferanse_import.py
=============================
Legger til preferansespørsmål i Supabase survey-tabeller for alle tre målgrupper.

Nye spørsmål (valgfrie, type=multi_select_search):
  1. study_interest     — "Hvilke studier har du allerede vurdert?"
  2. career_interest    — "Hvilke yrker virker mest interessante for deg akkurat nå?"
  3. company_interest   — "Hvilke bedrifter eller selskaper kunne du tenke deg å jobbe i en dag?"
  4. industry_interest  — "Hvilke typer arbeidsmiljøer eller bransjer virker mest spennende for deg?"

Alternativene hentes direkte fra connections-sortert.xlsx (reell data).

Kjøring:
  cd backend/
  python supabase_preferanse_import.py
"""

from __future__ import annotations

import math
from pathlib import Path

import pandas as pd
from supabase import create_client, Client

# ---------------------------------------------------------------------------
# Konfigurasjon
# ---------------------------------------------------------------------------

SUPABASE_URL = "https://zcfclojzyqezuuwxzrzq.supabase.co"
SUPABASE_KEY = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
    "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjZmNsb2p6eXFlenV1d3h6cnpxIiwicm9sZSI6"
    "InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzUxNjM4MywiZXhwIjoyMDU5MDkyMzgzfQ."
    "DnCDEHCibOMmYCSdhFrWY6FAEsNjK5BpWzmPNatRcWc"
)

BASE_DIR = Path(__file__).parent
DATA_DIR = BASE_DIR / "data"
CONNECTIONS_FP = DATA_DIR / "connections-sortert.xlsx"
BATCH_SIZE = 200

# Alle tre survey-IDs
SURVEY_IDS = ["elev", "student", "worker"]

# Page for preferansespørsmål (settes etter siste eksisterende side)
PREFERANSE_PAGE_ID    = "preferanser_og_interesser"
PREFERANSE_PAGE_LABEL = "Dine preferanser"
PREFERANSE_PAGE_ORDER = 99  # etter alle eksisterende sider

# Faste bransje-alternativer (fra connections-sektornavn)
BRANSJE_ALTERNATIVER = [
    ("administrasjon_og_ledelse",     "Administrasjon og ledelse"),
    ("helse_og_omsorg",               "Helse og omsorg"),
    ("humaniora_og_sprak",            "Humaniora og språk"),
    ("ingenior_og_teknisk",           "Ingeniør og teknisk"),
    ("it_og_teknologi",               "IT og teknologi"),
    ("jus_og_rettsvesen",             "Jus og rettsvesen"),
    ("kunst_og_kultur",               "Kunst og kultur"),
    ("design_og_markedsforing",       "Design, markedsføring og kommunikasjon"),
    ("miljo_natur_og_forskning",      "Miljø, natur og forskning"),
    ("okonomi_og_finans",             "Økonomi og finans"),
    ("psykologi_og_radgivning",       "Psykologi og rådgivning"),
    ("religion_og_livssyn",           "Religion og livssyn"),
    ("samfunnsfag_og_politikk",       "Samfunnsfag og politikk"),
    ("sikkerhet_og_beredskap",        "Sikkerhet og beredskap"),
    ("sport_og_kroppsoving",          "Sport og kroppsøving"),
    ("transport_og_logistikk",        "Transport og logistikk"),
    ("undervisning_og_pedagogikk",    "Undervisning og pedagogikk"),
    ("offentlig_sektor",              "Offentlig sektor"),
    ("entrepenorskap",                "Entrepenørskap og oppstart"),
    ("konsulent_og_radgivning",       "Konsulent og rådgivning"),
]


# ---------------------------------------------------------------------------
# Hjelpefunksjoner
# ---------------------------------------------------------------------------

def _rens(v):
    if v is None:
        return None
    if isinstance(v, float) and (math.isnan(v) or math.isinf(v)):
        return None
    if isinstance(v, str) and v.strip().lower() in ("nan", "none", ""):
        return None
    return v


def _upsert(sb: Client, table: str, rader: list[dict], conflict: str) -> None:
    for i in range(0, len(rader), BATCH_SIZE):
        batch = rader[i: i + BATCH_SIZE]
        sb.table(table).upsert(batch, on_conflict=conflict).execute()
        done = min(i + BATCH_SIZE, len(rader))
        print(f"  [{table}] {done}/{len(rader)} ✓")


def _slug(tekst: str) -> str:
    """Gjør tekst om til lowercase underscore-slug for option_value."""
    import unicodedata
    nfkd = unicodedata.normalize("NFKD", tekst)
    ascii_str = "".join(c for c in nfkd if not unicodedata.combining(c))
    return (
        ascii_str.lower()
        .strip()
        .replace(" ", "_")
        .replace(",", "")
        .replace(".", "")
        .replace("-", "_")
        .replace("/", "_")
        .replace("(", "")
        .replace(")", "")
        [:80]  # maks 80 tegn
    )


# ---------------------------------------------------------------------------
# Hent data fra connections-sortert.xlsx
# ---------------------------------------------------------------------------

def hent_connections_data() -> tuple[list[str], list[str], list[str]]:
    """Henter unike studier, yrker og bedrifter fra connections-sortert.xlsx."""
    xl = pd.ExcelFile(CONNECTIONS_FP)
    studier: set[str] = set()
    yrker: set[str] = set()
    bedrifter: set[str] = set()

    for sheet in xl.sheet_names:
        df = pd.read_excel(CONNECTIONS_FP, sheet_name=sheet)
        df.columns = [str(c).strip() for c in df.columns]

        for col in ["Studielinje"]:
            if col in df.columns:
                for v in df[col].dropna():
                    val = str(v).strip()
                    if val:
                        studier.add(val)

        for col in ["Alle yrker", "Alle yrker 2"]:
            if col in df.columns:
                for v in df[col].dropna():
                    val = str(v).strip()
                    if val:
                        yrker.add(val)

        for col in ["Bedrifter"]:
            if col in df.columns:
                for v in df[col].dropna():
                    val = str(v).strip()
                    if val:
                        bedrifter.add(val)

    print(f"Hentet: {len(studier)} studier, {len(yrker)} yrker, {len(bedrifter)} bedrifter")
    return sorted(studier), sorted(yrker), sorted(bedrifter)


# ---------------------------------------------------------------------------
# Bygg spørsmål og alternativer
# ---------------------------------------------------------------------------

def bygg_preferanse_questions(survey_id: str) -> list[dict]:
    """Returnerer de 4 nye preferansespørsmålene for en survey."""
    base_order = 100  # høyt nummer for å ligge etter eksisterende spørsmål

    return [
        {
            "survey_id":            survey_id,
            "target_group":         survey_id,
            "version":              "v2_preferanser",
            "question_id":          "study_interest",
            "legacy_id":            None,
            "page_id":              PREFERANSE_PAGE_ID,
            "page_label":           PREFERANSE_PAGE_LABEL,
            "page_order":           PREFERANSE_PAGE_ORDER,
            "question_order":       base_order + 1,
            "text":                 "Hvilke studier har du allerede vurdert?",
            "help_text":            "Valgfritt — velg opptil 5. Søk i listen.",
            "type":                 "multi_select_search",
            "required":             False,
            "max_select":           5,
            "min_select":           0,
            "min_value":            None,
            "max_value":            None,
            "placeholder":          "Søk etter studie...",
            "collect_for_scoring":  False,
            "is_metadata":          False,
            "is_filter":            False,
            "depends_on_question_id":    None,
            "depends_on_option_value":   None,
        },
        {
            "survey_id":            survey_id,
            "target_group":         survey_id,
            "version":              "v2_preferanser",
            "question_id":          "career_interest",
            "legacy_id":            None,
            "page_id":              PREFERANSE_PAGE_ID,
            "page_label":           PREFERANSE_PAGE_LABEL,
            "page_order":           PREFERANSE_PAGE_ORDER,
            "question_order":       base_order + 2,
            "text":                 "Hvilke yrker virker mest interessante for deg akkurat nå?",
            "help_text":            "Valgfritt — velg opptil 5. Søk i listen.",
            "type":                 "multi_select_search",
            "required":             False,
            "max_select":           5,
            "min_select":           0,
            "min_value":            None,
            "max_value":            None,
            "placeholder":          "Søk etter yrke...",
            "collect_for_scoring":  False,
            "is_metadata":          False,
            "is_filter":            False,
            "depends_on_question_id":    None,
            "depends_on_option_value":   None,
        },
        {
            "survey_id":            survey_id,
            "target_group":         survey_id,
            "version":              "v2_preferanser",
            "question_id":          "company_interest",
            "legacy_id":            None,
            "page_id":              PREFERANSE_PAGE_ID,
            "page_label":           PREFERANSE_PAGE_LABEL,
            "page_order":           PREFERANSE_PAGE_ORDER,
            "question_order":       base_order + 3,
            "text":                 "Hvilke bedrifter eller selskaper kunne du tenke deg å jobbe i en dag?",
            "help_text":            "Valgfritt — velg opptil 5. Søk i listen.",
            "type":                 "multi_select_search",
            "required":             False,
            "max_select":           5,
            "min_select":           0,
            "min_value":            None,
            "max_value":            None,
            "placeholder":          "Søk etter bedrift...",
            "collect_for_scoring":  False,
            "is_metadata":          False,
            "is_filter":            False,
            "depends_on_question_id":    None,
            "depends_on_option_value":   None,
        },
        {
            "survey_id":            survey_id,
            "target_group":         survey_id,
            "version":              "v2_preferanser",
            "question_id":          "industry_interest",
            "legacy_id":            None,
            "page_id":              PREFERANSE_PAGE_ID,
            "page_label":           PREFERANSE_PAGE_LABEL,
            "page_order":           PREFERANSE_PAGE_ORDER,
            "question_order":       base_order + 4,
            "text":                 "Hvilke typer arbeidsmiljøer eller bransjer virker mest spennende for deg?",
            "help_text":            "Valgfritt — velg opptil 3.",
            "type":                 "multi_select",
            "required":             False,
            "max_select":           3,
            "min_select":           0,
            "min_value":            None,
            "max_value":            None,
            "placeholder":          None,
            "collect_for_scoring":  False,
            "is_metadata":          False,
            "is_filter":            False,
            "depends_on_question_id":    None,
            "depends_on_option_value":   None,
        },
    ]


def bygg_preferanse_options(
    survey_id: str,
    studier: list[str],
    yrker: list[str],
    bedrifter: list[str],
) -> list[dict]:
    """Returnerer alle alternativer for de 4 nye spørsmålene."""
    rader: list[dict] = []

    # study_interest → alle studier fra connections
    for i, studie in enumerate(studier, start=1):
        slug = _slug(studie)
        rader.append({
            "survey_id":     survey_id,
            "question_id":   "study_interest",
            "target_group":  survey_id,
            "legacy_id":     None,
            "option_value":  slug,
            "option_label":  studie,
            "option_order":  i,
            "is_exclusive":  False,
            "is_unknown":    False,
            "is_open_text":  False,
            "depends_on_question_id":   None,
            "depends_on_option_value":  None,
        })

    # career_interest → alle yrker fra connections
    for i, yrke in enumerate(yrker, start=1):
        slug = _slug(yrke)
        rader.append({
            "survey_id":     survey_id,
            "question_id":   "career_interest",
            "target_group":  survey_id,
            "legacy_id":     None,
            "option_value":  slug,
            "option_label":  yrke,
            "option_order":  i,
            "is_exclusive":  False,
            "is_unknown":    False,
            "is_open_text":  False,
            "depends_on_question_id":   None,
            "depends_on_option_value":  None,
        })

    # company_interest → alle bedrifter fra connections
    for i, bedrift in enumerate(bedrifter, start=1):
        slug = _slug(bedrift)
        rader.append({
            "survey_id":     survey_id,
            "question_id":   "company_interest",
            "target_group":  survey_id,
            "legacy_id":     None,
            "option_value":  slug,
            "option_label":  bedrift,
            "option_order":  i,
            "is_exclusive":  False,
            "is_unknown":    False,
            "is_open_text":  False,
            "depends_on_question_id":   None,
            "depends_on_option_value":  None,
        })

    # industry_interest → faste bransje-alternativer
    for i, (val, label) in enumerate(BRANSJE_ALTERNATIVER, start=1):
        rader.append({
            "survey_id":     survey_id,
            "question_id":   "industry_interest",
            "target_group":  survey_id,
            "legacy_id":     None,
            "option_value":  val,
            "option_label":  label,
            "option_order":  i,
            "is_exclusive":  False,
            "is_unknown":    False,
            "is_open_text":  False,
            "depends_on_question_id":   None,
            "depends_on_option_value":  None,
        })

    return rader


def bygg_preferanse_section(survey_id: str) -> dict:
    return {
        "survey_id":     survey_id,
        "target_group":  survey_id,
        "page_id":        PREFERANSE_PAGE_ID,
        "section_label": PREFERANSE_PAGE_LABEL,
        "section_order": PREFERANSE_PAGE_ORDER,
    }


# ---------------------------------------------------------------------------
# Hovedprogram
# ---------------------------------------------------------------------------

def main() -> None:
    print(f"Kobler til Supabase: {SUPABASE_URL}")
    sb = create_client(SUPABASE_URL, SUPABASE_KEY)

    # Sjekk tilkobling
    try:
        sb.table("survey_questions").select("id").limit(1).execute()
        print("Tilkobling OK ✓")
    except Exception as e:
        print(f"FEIL: Kan ikke koble til Supabase: {e}")
        return

    # Hent data fra connections
    print("\nHenter data fra connections-sortert.xlsx...")
    studier, yrker, bedrifter = hent_connections_data()

    # Import per survey
    for survey_id in SURVEY_IDS:
        print(f"\n=== {survey_id} ===")

        # Section
        section = bygg_preferanse_section(survey_id)
        print(f"  Upsert section: {PREFERANSE_PAGE_ID}")
        sb.table("survey_sections").upsert(section, on_conflict="survey_id,page_id").execute()

        # Questions (4 stk)
        questions = bygg_preferanse_questions(survey_id)
        print(f"  Upsert {len(questions)} spørsmål...")
        _upsert(sb, "survey_questions", questions, "survey_id,question_id")

        # Options (mange!)
        options = bygg_preferanse_options(survey_id, studier, yrker, bedrifter)
        print(f"  Upsert {len(options)} alternativer (studier={len(studier)}, "
              f"yrker={len(yrker)}, bedrifter={len(bedrifter)}, bransjer={len(BRANSJE_ALTERNATIVER)})...")
        _upsert(sb, "survey_options", options, "survey_id,question_id,option_value")

    # Verifisering
    print("\n=== Verifiserer ===")
    for survey_id in SURVEY_IDS:
        r = sb.table("survey_questions")\
            .select("id", count="exact")\
            .eq("survey_id", survey_id)\
            .eq("page_id", PREFERANSE_PAGE_ID)\
            .execute()
        print(f"  {survey_id}: {r.count} preferansespørsmål ✓")

    print("""
FERDIG!

De nye spørsmålene er nå tilgjengelige i Supabase.
Lovable henter dem dynamisk på lik linje med eksisterende spørsmål.

Frontend-bruk:
  - type="multi_select_search" → søkbar dropdown/autocomplete i Lovable
  - type="multi_select" → vanlig flervalg (bransjer)
  - Svarene sendes til backend som:
      { "study_interest":   ["Informatikk", "Data science"] }
      { "career_interest":  ["Data-analytiker"] }
      { "company_interest": ["Equinor ASA"] }
      { "industry_interest": ["it_og_teknologi"] }
  - Backend ekstraherer automatisk som soft signals (preferanse_boost)
""")


if __name__ == "__main__":
    main()
