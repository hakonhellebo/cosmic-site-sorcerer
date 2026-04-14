"""
import_elev_survey.py
====================
Erstatter elevsurveyen i Supabase med den nye strukturen fra
edpath_elev_sporreundersokelse.xlsx.

Kjøring:
  cd /Users/Skole/cosmic-site-sorcerer/backend
  python3 import_elev_survey.py

Hva dette gjør:
  1. Sletter gamle elev-seksjoner og spørsmål fra Supabase
  2. Importerer 6 nye seksjoner med 33 spørsmål
  3. Importerer alle svaralternativer
  4. Legger til søkbare preferanselister (studier, yrker, bedrifter) fra connections
  5. Verifiserer at alt er på plass

Bakoverkompatibilitet:
  Gammel Excel-scoring fortsetter å fungere for student/worker.
  Ny Python-scoring aktiveres automatisk for elev via elev_scoring_map.py.
"""

from __future__ import annotations
import math
import unicodedata
from pathlib import Path
import pandas as pd
from supabase import create_client, Client

# ---------------------------------------------------------------------------
SUPABASE_URL = "https://zcfclojzyqezuuwxzrzq.supabase.co"
SUPABASE_KEY = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
    "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjZmNsb2p6eXFlenV1d3h6cnpxIiwicm9sZSI6"
    "InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzUxNjM4MywiZXhwIjoyMDU5MDkyMzgzfQ."
    "DnCDEHCibOMmYCSdhFrWY6FAEsNjK5BpWzmPNatRcWc"
)
SURVEY_ID  = "elev"
BASE_DIR   = Path(__file__).parent
DATA_DIR   = BASE_DIR / "data"
BATCH_SIZE = 200
# ---------------------------------------------------------------------------


def _rens(v):
    if v is None: return None
    if isinstance(v, float) and (math.isnan(v) or math.isinf(v)): return None
    if isinstance(v, str) and v.strip().lower() in ("nan","none",""): return None
    return v

def _slug(tekst: str) -> str:
    nfkd = unicodedata.normalize("NFKD", tekst)
    s = "".join(c for c in nfkd if not unicodedata.combining(c))
    s = (s.lower().strip()
           .replace(" ","_").replace(",","").replace(".","")
           .replace("-","_").replace("/","_").replace("(","")
           .replace(")","").replace(":","_").replace("&","og")
           .replace("'","").replace('"',""))
    while "__" in s: s = s.replace("__","_")
    return s.strip("_")[:100]

_slug_reg: dict[str, set] = {}
def _uniq_slug(tekst: str, qid: str) -> str:
    _slug_reg.setdefault(qid, set())
    base = _slug(tekst)
    if base not in _slug_reg[qid]:
        _slug_reg[qid].add(base)
        return base
    import hashlib
    suffix = hashlib.md5(tekst.encode()).hexdigest()[:6]
    u = f"{base[:92]}_{suffix}"
    _slug_reg[qid].add(u)
    return u

def _upsert(sb: Client, table: str, rader: list[dict], conflict: str):
    keys = [k.strip() for k in conflict.split(",")]
    sett, unike = set(), []
    for r in rader:
        k = tuple(r.get(x) for x in keys)
        if k not in sett:
            sett.add(k); unike.append(r)
    for i in range(0, len(unike), BATCH_SIZE):
        batch = unike[i:i+BATCH_SIZE]
        sb.table(table).upsert(batch, on_conflict=conflict).execute()
        print(f"    [{table}] {min(i+BATCH_SIZE,len(unike))}/{len(unike)} ✓")


# ---------------------------------------------------------------------------
# SEKSJONER (6 sider — bakgrunn kommer FØRST)
# ---------------------------------------------------------------------------
SEKSJONER = [
    {"survey_id": SURVEY_ID, "target_group": SURVEY_ID,
     "page_id": "bakgrunn_og_skole",   "section_label": "Bakgrunn og skole",      "section_order": 1},
    {"survey_id": SURVEY_ID, "target_group": SURVEY_ID,
     "page_id": "interesser",          "section_label": "Interesser",              "section_order": 2},
    {"survey_id": SURVEY_ID, "target_group": SURVEY_ID,
     "page_id": "arbeidsstil",         "section_label": "Arbeidsstil",             "section_order": 3},
    {"survey_id": SURVEY_ID, "target_group": SURVEY_ID,
     "page_id": "ferdigheter",         "section_label": "Ferdigheter",             "section_order": 4},
    {"survey_id": SURVEY_ID, "target_group": SURVEY_ID,
     "page_id": "karrierepreferanser", "section_label": "Karrierepreferanser",     "section_order": 5},
    {"survey_id": SURVEY_ID, "target_group": SURVEY_ID,
     "page_id": "fremtid",             "section_label": "Fremtid og karrierevalg", "section_order": 6},
]


# ---------------------------------------------------------------------------
# SPØRSMÅL (33 totalt)
# ---------------------------------------------------------------------------
def _q(question_id, page_id, page_order, question_order, text, qtype,
       required=True, max_select=None, min_select=None,
       collect_for_scoring=True, is_filter=False, help_text=None, placeholder=None):
    return {
        "survey_id":           SURVEY_ID,
        "target_group":        SURVEY_ID,
        "version":             "v3_ny_elev",
        "question_id":         question_id,
        "legacy_id":           None,
        "page_id":             page_id,
        "page_label":          next(s["section_label"] for s in SEKSJONER if s["page_id"]==page_id),
        "page_order":          page_order,
        "question_order":      question_order,
        "text":                text,
        "help_text":           help_text,
        "type":                qtype,
        "required":            required,
        "max_select":          max_select,
        "min_select":          min_select or 0,
        "min_value":           None,
        "max_value":           None,
        "placeholder":         placeholder,
        "collect_for_scoring": collect_for_scoring,
        "is_metadata":         False,
        "is_filter":           is_filter,
        "depends_on_question_id":   None,
        "depends_on_option_value":  None,
    }

SPORSMAL = [
    # ── Seksjon 1: Bakgrunn og skole ────────────────────────────────────
    _q("school_year_ny", "bakgrunn_og_skole", 1, 1,
       "Hvilket trinn går du på i videregående?",
       "single_select", is_filter=True, collect_for_scoring=False),

    _q("program_type", "bakgrunn_og_skole", 1, 2,
       "Hvilket utdanningsprogram går du på?",
       "single_select", is_filter=True, collect_for_scoring=False),

    _q("grade_avg_ny", "bakgrunn_og_skole", 1, 3,
       "Hva er karaktergjennomsnittet ditt omtrent nå?",
       "single_select", required=False, is_filter=True, collect_for_scoring=False),

    _q("best_subjects_ny", "bakgrunn_og_skole", 1, 4,
       "Hvilke fag får du vanligvis best karakterer i?",
       "multi_select", help_text="Velg opptil 3", max_select=3),

    _q("interesting_subjects", "bakgrunn_og_skole", 1, 5,
       "Hvilke fag synes du er mest interessante?",
       "multi_select", help_text="Velg opptil 3", max_select=3),

    _q("realfag", "bakgrunn_og_skole", 1, 6,
       "Hvilke realfag tar du eller planlegger å ta?",
       "multi_select", required=False, help_text="Velg alle som passer"),

    _q("programfag", "bakgrunn_og_skole", 1, 7,
       "Hvilke programfag tar du eller planlegger å ta?",
       "multi_select", required=False, help_text="Velg alle som passer"),

    # ── Seksjon 2: Interesser ────────────────────────────────────────────
    _q("interest_areas", "interesser", 2, 8,
       "Hvilke områder synes du er mest interessante å lære mer om?",
       "multi_select", help_text="Velg opptil 3", max_select=3),

    _q("problem_types", "interesser", 2, 9,
       "Hvilke typer problemer synes du er mest spennende å jobbe med?",
       "multi_select", help_text="Velg opptil 2", max_select=2),

    _q("activities", "interesser", 2, 10,
       "Hvilke aktiviteter liker du best å bruke tid på?",
       "multi_select", help_text="Velg opptil 3", max_select=3),

    _q("industry_interest_ny", "interesser", 2, 11,
       "Hvilke bransjer virker mest spennende for deg?",
       "multi_select", help_text="Velg opptil 3", max_select=3),

    _q("future_roles_ny", "interesser", 2, 12,
       "Hvilke roller kunne du sett for deg i fremtiden?",
       "multi_select", help_text="Velg opptil 3", max_select=3),

    _q("future_area", "interesser", 2, 13,
       "Hvis du kunne jobbet med ett område i fremtiden, hva ville vært mest spennende?",
       "single_select"),

    # ── Seksjon 3: Arbeidsstil ───────────────────────────────────────────
    _q("work_style", "arbeidsstil", 3, 14,
       "Hvordan liker du best å jobbe?",
       "single_select"),

    _q("daily_work_style", "arbeidsstil", 3, 15,
       "Hva slags arbeidshverdag passer deg best?",
       "single_select"),

    _q("work_content", "arbeidsstil", 3, 16,
       "Hva liker du best å jobbe med?",
       "single_select"),

    _q("learning_style_ny", "arbeidsstil", 3, 17,
       "Hvordan lærer du best nye ting?",
       "single_select"),

    _q("motivation_ny", "arbeidsstil", 3, 18,
       "Hva motiverer deg mest når du jobber med noe?",
       "single_select"),

    # ── Seksjon 4: Ferdigheter ───────────────────────────────────────────
    _q("best_skills", "ferdigheter", 4, 19,
       "Hvilke ferdigheter føler du at du er best på?",
       "multi_select", help_text="Velg opptil 3", max_select=3),

    _q("improve_skills", "ferdigheter", 4, 20,
       "Hvilke ferdigheter ønsker du å bli bedre på?",
       "multi_select", help_text="Velg opptil 3", max_select=3),

    _q("tech_comfort", "ferdigheter", 4, 21,
       "Hvor komfortabel er du med å bruke teknologi og digitale verktøy?",
       "single_select"),

    _q("independence_level", "ferdigheter", 4, 22,
       "Hvor godt føler du at du klarer å jobbe selvstendig med oppgaver?",
       "single_select"),

    _q("problem_approach", "ferdigheter", 4, 23,
       "Når du møter et vanskelig problem, hva gjør du oftest?",
       "single_select"),

    # ── Seksjon 5: Karrierepreferanser ──────────────────────────────────
    _q("salary_importance", "karrierepreferanser", 5, 24,
       "Hvor viktig er det for deg å tjene godt i fremtiden?",
       "single_select"),

    _q("impact_importance", "karrierepreferanser", 5, 25,
       "Hvor viktig er det for deg å gjøre en positiv forskjell for andre eller samfunnet?",
       "single_select"),

    _q("work_environment", "karrierepreferanser", 5, 26,
       "Hva slags arbeidsmiljø passer deg best?",
       "multi_select", help_text="Velg opptil 2", max_select=2),

    _q("future_role_type", "karrierepreferanser", 5, 27,
       "Hvilken type rolle kunne du sett for deg i fremtiden?",
       "single_select"),

    _q("stability_importance", "karrierepreferanser", 5, 28,
       "Hvor viktig er det for deg å ha en trygg og stabil jobb?",
       "single_select"),

    # ── Seksjon 6: Fremtid og karrierevalg ──────────────────────────────
    _q("future_industry", "fremtid", 6, 29,
       "Hvilke bransjer synes du virker mest spennende?",
       "multi_select", help_text="Velg opptil 3", max_select=3),

    _q("future_role_types_2", "fremtid", 6, 30,
       "Hvilke typer roller kunne du sett for deg i fremtiden?",
       "multi_select", help_text="Velg opptil 3", max_select=3),

    _q("future_vision", "fremtid", 6, 31,
       "Hvordan ser du for deg arbeidshverdagen din om 10 år?",
       "single_select"),

    _q("study_certainty", "fremtid", 6, 32,
       "Hvor sikker er du på hva du vil studere etter videregående?",
       "single_select", is_filter=True, collect_for_scoring=False),

    _q("studies_considered", "fremtid", 6, 33,
       "Hvilke studier har du vurdert å søke på?",
       "multi_select_search", required=False, max_select=5, collect_for_scoring=False,
       help_text="Valgfritt — søk og velg opptil 5",
       placeholder="Søk etter studie..."),

    _q("jobs_considered", "fremtid", 6, 34,
       "Hvilke yrker kunne du sett for deg i fremtiden?",
       "multi_select_search", required=False, max_select=5, collect_for_scoring=False,
       help_text="Valgfritt — søk og velg opptil 5",
       placeholder="Søk etter yrke..."),

    _q("companies_considered", "fremtid", 6, 35,
       "Hvilke bedrifter eller organisasjoner kunne du tenke deg å jobbe i?",
       "multi_select_search", required=False, max_select=5, collect_for_scoring=False,
       help_text="Valgfritt",
       placeholder="Søk etter bedrift..."),
]


# ---------------------------------------------------------------------------
# ALTERNATIVER per spørsmål
# ---------------------------------------------------------------------------
def _opt(survey_id, question_id, option_value, option_label, option_order,
         is_exclusive=False, is_unknown=False):
    return {
        "survey_id":     survey_id,
        "question_id":   question_id,
        "target_group":  survey_id,
        "legacy_id":     None,
        "option_value":  option_value,
        "option_label":  option_label,
        "option_order":  option_order,
        "is_exclusive":  is_exclusive,
        "is_unknown":    is_unknown,
        "is_open_text":  False,
        "depends_on_question_id":  None,
        "depends_on_option_value": None,
    }

def bygg_alternativer() -> list[dict]:
    s = SURVEY_ID
    o = _opt
    opts = []

    # school_year_ny
    for i, (v, l) in enumerate([
        ("vg1","Vg1"), ("vg2","Vg2"), ("vg3","Vg3")
    ], 1): opts.append(o(s,"school_year_ny",v,l,i))

    # program_type
    for i, (v, l) in enumerate([
        ("studiespesialisering","Studiespesialisering"),
        ("yrkesfag","Yrkesfag"),
        ("idrettsfag","Idrettsfag"),
        ("musikk_dans_drama","Musikk, dans og drama"),
        ("pabygg","Påbygg"),
    ], 1): opts.append(o(s,"program_type",v,l,i))

    # grade_avg_ny
    for i, (v, l) in enumerate([
        ("under_3_0","Under 3.0"), ("3_0_3_4","3.0 – 3.4"),
        ("3_5_3_9","3.5 – 3.9"), ("4_0_4_4","4.0 – 4.4"),
        ("4_5_4_9","4.5 – 4.9"), ("5_0_5_4","5.0 – 5.4"),
        ("5_5_6_0","5.5 – 6.0"), ("vet_ikke","Vet ikke"),
    ], 1): opts.append(o(s,"grade_avg_ny",v,l,i))

    # best_subjects_ny
    for i, (v, l) in enumerate([
        ("matematikk","Matematikk"), ("naturfag","Naturfag"),
        ("norsk","Norsk"), ("engelsk","Engelsk"),
        ("samfunnsfag","Samfunnsfag"), ("fremmedsprak","Fremmedspråk"),
        ("kroppsoving","Kroppsøving"), ("okonomi_markedsforing","Økonomi / markedsføring"),
        ("kreative_fag","Kreative fag (kunst, design, media)"),
        ("yrkesfaglige_fag","Yrkesfaglige fag"),
    ], 1): opts.append(o(s,"best_subjects_ny",v,l,i))

    # interesting_subjects
    for i, (v, l) in enumerate([
        ("matematikk","Matematikk"), ("naturfag_teknologi","Naturfag / teknologi"),
        ("samfunnsfag_politikk","Samfunnsfag / politikk"), ("okonomi_business","Økonomi / business"),
        ("psykologi_mennesker","Psykologi / mennesker"),
        ("kreative_fag","Kreative fag (design, media, kunst)"),
        ("idrett_fysisk_aktivitet","Idrett / fysisk aktivitet"),
        ("praktiske_fag_handverk","Praktiske fag / håndverk"),
    ], 1): opts.append(o(s,"interesting_subjects",v,l,i))

    # realfag
    for i, (v, l) in enumerate([
        ("r1_matematikk","R1 matematikk"), ("r2_matematikk","R2 matematikk"),
        ("s1_matematikk","S1 matematikk"), ("s2_matematikk","S2 matematikk"),
        ("fysikk","Fysikk"), ("kjemi","Kjemi"), ("biologi","Biologi"),
        ("informatikk_it","Informatikk / IT"),
        ("jeg_tar_ingen_realfag","Jeg tar ingen realfag"),
    ], 1): opts.append(o(s,"realfag",v,l,i,is_exclusive=(v=="jeg_tar_ingen_realfag")))

    # programfag
    for i, (v, l) in enumerate([
        ("okonomistyring","Økonomistyring"),
        ("markedsforing_og_ledelse","Markedsføring og ledelse"),
        ("entrepreenerskap","Entreprenørskap"),
        ("psykologi","Psykologi"),
        ("sosialkunnskap","Sosialkunnskap"),
        ("rettslare","Rettslære"),
        ("politikk_og_menneskerettigheter","Politikk og menneskerettigheter"),
        ("medie_og_informasjonskunnskap","Medie- og informasjonskunnskap"),
        ("design_og_arkitektur","Design og arkitektur"),
        ("informasjonsteknologi","Informasjonsteknologi"),
    ], 1): opts.append(o(s,"programfag",v,l,i))

    # interest_areas
    for i, (v, l) in enumerate([
        ("teknologi_og_programmering","Teknologi og programmering"),
        ("medisin_og_helse","Medisin og helse"),
        ("okonomi_business_og_finans","Økonomi, business og finans"),
        ("samfunn_politikk_og_internasjonale","Samfunn, politikk og internasjonale spørsmål"),
        ("psykologi_og_hvordan_mennesker","Psykologi og hvordan mennesker tenker"),
        ("miljo_klima_og_baerekraft","Miljø, klima og bærekraft"),
        ("kunst_design_og_kreativt_arbeid","Kunst, design og kreativt arbeid"),
        ("media_kommunikasjon_og_markedsforing","Media, kommunikasjon og markedsføring"),
        ("forskning_og_vitenskap","Forskning og vitenskap"),
        ("idrett_og_fysisk_prestasjon","Idrett og fysisk prestasjon"),
    ], 1): opts.append(o(s,"interest_areas",v,l,i))

    # problem_types
    for i, (v, l) in enumerate([
        ("analysere_data_og_finne_monstre","Analysere data og finne mønstre"),
        ("lose_tekniske_eller_matematiske","Løse tekniske eller matematiske problemer"),
        ("forsta_mennesker_og_hjelpe_dem","Forstå mennesker og hjelpe dem"),
        ("skape_nye_ideer_eller_produkter","Skape nye ideer eller produkter"),
        ("forbedre_organisasjoner_eller_bedrifter","Forbedre hvordan organisasjoner eller bedrifter fungerer"),
        ("jobbe_med_samfunnsutfordringer","Jobbe med samfunnsutfordringer"),
        ("utvikle_teknologi_eller_digitale","Utvikle teknologi eller digitale løsninger"),
    ], 1): opts.append(o(s,"problem_types",v,l,i))

    # activities
    for i, (v, l) in enumerate([
        ("programmering_eller_teknologi","Programmering eller teknologi"),
        ("diskutere_samfunn_og_politikk","Diskutere samfunn og politikk"),
        ("trene_eller_drive_med_idrett","Trene eller drive med idrett"),
        ("tegne_designe_eller_skape","Tegne, designe eller skape noe kreativt"),
        ("lese_eller_laere_om_nye_temaer","Lese eller lære om nye temaer"),
        ("starte_prosjekter_eller_ideer","Starte prosjekter eller ideer"),
        ("hjelpe_andre_eller_vaere_sosial","Hjelpe andre eller være sosial"),
        ("jobbe_praktisk_eller_bygge_ting","Jobbe praktisk eller bygge ting"),
    ], 1): opts.append(o(s,"activities",v,l,i))

    # industry_interest_ny  (brukes i BEGGE seksjon 2 og 6 — deles opp i frontend)
    bransjer = [
        ("teknologi_og_it","Teknologi og IT"),
        ("helse_og_medisin","Helse og medisin"),
        ("finans_og_okonomi","Finans og økonomi"),
        ("konsulent_og_radgivning","Konsulent og rådgivning"),
        ("media_og_kommunikasjon","Media og kommunikasjon"),
        ("utdanning_og_forskning","Utdanning og forskning"),
        ("energi_og_miljo","Energi og miljø"),
        ("bygg_ingenior_og_industri","Bygg, ingeniør og industri"),
        ("offentlig_sektor","Offentlig sektor"),
        ("idrett_og_prestasjon","Idrett og prestasjon"),
    ]
    for i, (v, l) in enumerate(bransjer, 1):
        opts.append(o(s,"industry_interest_ny",v,l,i))
    for i, (v, l) in enumerate(bransjer, 1):
        opts.append(o(s,"future_industry",v,l,i))

    # future_roles_ny  (brukes i seksjon 2 og 6)
    roller = [
        ("leder_eller_organisasjonsbygger","Leder eller organisasjonsbygger"),
        ("spesialist_innen_et_fagomrade","Spesialist innen et fagområde"),
        ("teknolog_eller_utvikler","Teknolog eller utvikler"),
        ("kreativ_rolle_design_media_kunst","Kreativ rolle (design, media, kunst)"),
        ("forsker_eller_analytiker","Forsker eller analytiker"),
        ("entrepreener_starte_egen_bedrift","Entreprenør / starte egen bedrift"),
        ("radgiver_eller_konsulent","Rådgiver eller konsulent"),
        ("jobbe_tett_med_mennesker","Jobbe tett med mennesker (lærer, psykolog, lege)"),
    ]
    for i, (v, l) in enumerate(roller, 1):
        opts.append(o(s,"future_roles_ny",v,l,i))
    for i, (v, l) in enumerate(roller, 1):
        opts.append(o(s,"future_role_types_2",v,l,i))

    # future_area
    for i, (v, l) in enumerate([
        ("utvikle_ny_teknologi","Utvikle ny teknologi"),
        ("jobbe_med_mennesker_og_helse","Jobbe med mennesker og helse"),
        ("bygge_eller_lede_en_bedrift","Bygge eller lede en bedrift"),
        ("forsta_samfunnet_og_pavirke","Forstå samfunnet og påvirke politikk"),
        ("skape_kreative_prosjekter_eller_media","Skape kreative prosjekter eller media"),
        ("forske_og_utvikle_ny_kunnskap","Forske og utvikle ny kunnskap"),
        ("jeg_er_usikker","Jeg er usikker"),
    ], 1): opts.append(o(s,"future_area",v,l,i))

    # work_style
    for i, (v, l) in enumerate([
        ("mest_alene","Mest alene"),
        ("mest_i_team","Mest i team"),
        ("litt_av_begge_deler","Litt av begge deler"),
    ], 1): opts.append(o(s,"work_style",v,l,i))

    # daily_work_style
    for i, (v, l) in enumerate([
        ("en_strukturert_hverdag","En strukturert hverdag med tydelige oppgaver"),
        ("en_variert_hverdag","En variert hverdag med ulike oppgaver"),
        ("en_kreativ_hverdag","En kreativ hverdag hvor jeg kan utvikle nye ideer"),
        ("en_hektisk_hverdag","En hektisk hverdag med høyt tempo"),
    ], 1): opts.append(o(s,"daily_work_style",v,l,i))

    # work_content
    for i, (v, l) in enumerate([
        ("analysere_tall_og_data","Analysere tall og data"),
        ("lose_tekniske_eller_praktiske","Løse tekniske eller praktiske problemer"),
        ("kommunisere_og_samarbeide","Kommunisere og samarbeide med mennesker"),
        ("skape_nye_ideer_eller_losninger","Skape nye ideer eller løsninger"),
        ("planlegge_og_organisere_arbeid","Planlegge og organisere arbeid"),
    ], 1): opts.append(o(s,"work_content",v,l,i))

    # learning_style_ny
    for i, (v, l) in enumerate([
        ("ved_a_lese_og_forsta_teori","Ved å lese og forstå teori"),
        ("ved_a_lose_oppgaver_og_problemer","Ved å løse oppgaver og problemer"),
        ("ved_a_diskutere_med_andre","Ved å diskutere med andre"),
        ("ved_a_prove_ting_i_praksis","Ved å prøve ting i praksis"),
        ("ved_a_se_videoer_eller_demonstrasjoner","Ved å se videoer eller demonstrasjoner"),
    ], 1): opts.append(o(s,"learning_style_ny",v,l,i))

    # motivation_ny
    for i, (v, l) in enumerate([
        ("a_lose_vanskelige_problemer","Å løse vanskelige problemer"),
        ("a_oppna_gode_resultater","Å oppnå gode resultater"),
        ("a_samarbeide_med_andre","Å samarbeide med andre"),
        ("a_skape_noe_nytt","Å skape noe nytt"),
        ("a_hjelpe_andre","Å hjelpe andre"),
    ], 1): opts.append(o(s,"motivation_ny",v,l,i))

    # best_skills
    ferdigheter = [
        ("analytisk_tenkning","Analytisk tenkning"),
        ("problemlosning","Problemløsning"),
        ("kreativitet","Kreativitet"),
        ("kommunikasjon","Kommunikasjon"),
        ("samarbeid","Samarbeid"),
        ("teknisk_forstaelse","Teknisk forståelse"),
        ("ledelse_og_organisering","Ledelse og organisering"),
        ("selvstendig_arbeid","Selvstendig arbeid"),
    ]
    for i, (v, l) in enumerate(ferdigheter, 1):
        opts.append(o(s,"best_skills",v,l,i))

    # improve_skills
    for i, (v, l) in enumerate([
        ("analytisk_tenkning","Analytisk tenkning"),
        ("problemlosning","Problemløsning"),
        ("kreativitet","Kreativitet"),
        ("kommunikasjon","Kommunikasjon"),
        ("samarbeid","Samarbeid"),
        ("teknologiforstaelse","Teknologiforståelse"),
        ("ledelse","Ledelse"),
        ("selvledelse_og_struktur","Selvledelse og struktur"),
    ], 1): opts.append(o(s,"improve_skills",v,l,i))

    # tech_comfort
    for i, (v, l) in enumerate([
        ("veldig_komfortabel","Veldig komfortabel"),
        ("ganske_komfortabel","Ganske komfortabel"),
        ("litt_komfortabel","Litt komfortabel"),
        ("ikke_saerlig_komfortabel","Ikke særlig komfortabel"),
    ], 1): opts.append(o(s,"tech_comfort",v,l,i))

    # independence_level
    for i, (v, l) in enumerate([
        ("veldig_godt","Veldig godt"),
        ("ganske_godt","Ganske godt"),
        ("middels","Middels"),
        ("ikke_sa_godt","Ikke så godt"),
    ], 1): opts.append(o(s,"independence_level",v,l,i))

    # problem_approach
    for i, (v, l) in enumerate([
        ("analysere_problemet_steg_for_steg","Analysere problemet steg for steg"),
        ("sporre_andre_om_hjelp","Spørre andre om hjelp eller diskutere løsninger"),
        ("prove_ulike_losninger","Prøve ulike løsninger til noe fungerer"),
        ("soke_informasjon_og_laere","Søke informasjon og lære mer om temaet"),
    ], 1): opts.append(o(s,"problem_approach",v,l,i))

    # salary_importance / impact_importance / stability_importance
    vikt_opts = [
        ("veldig_viktig","Veldig viktig"),
        ("ganske_viktig","Ganske viktig"),
        ("litt_viktig","Litt viktig"),
        ("ikke_sa_viktig","Ikke så viktig"),
    ]
    for qid in ["salary_importance","impact_importance","stability_importance"]:
        for i, (v, l) in enumerate(vikt_opts, 1):
            opts.append(o(s,qid,v,l,i))

    # work_environment
    for i, (v, l) in enumerate([
        ("et_sosialt_og_samarbeidsorientert","Et sosialt og samarbeidsorientert miljø"),
        ("et_rolig_og_strukturert","Et rolig og strukturert miljø"),
        ("et_kreativt_og_innovativt","Et kreativt og innovativt miljø"),
        ("et_malrettet_og_konkurransepreget","Et målrettet og konkurransepreget miljø"),
        ("et_fleksibelt_miljo","Et fleksibelt miljø med mye selvstendighet"),
    ], 1): opts.append(o(s,"work_environment",v,l,i))

    # future_role_type
    for i, (v, l) in enumerate([
        ("en_lederrolle","En lederrolle hvor jeg organiserer og tar beslutninger"),
        ("en_spesialistrolle","En spesialistrolle hvor jeg utvikler dyp kompetanse"),
        ("en_kreativ_rolle","En kreativ rolle hvor jeg skaper nye ideer eller produkter"),
        ("en_radgivende_rolle","En rådgivende rolle hvor jeg hjelper mennesker eller organisasjoner"),
        ("jeg_er_usikker","Jeg er usikker"),
    ], 1): opts.append(o(s,"future_role_type",v,l,i))

    # future_vision
    for i, (v, l) in enumerate([
        ("jeg_jobber_med_teknologi","Jeg jobber med teknologi eller utvikling"),
        ("jeg_jobber_med_mennesker","Jeg jobber med mennesker og hjelper andre"),
        ("jeg_leder_prosjekter","Jeg leder prosjekter eller en organisasjon"),
        ("jeg_jobber_kreativt","Jeg jobber kreativt med design, media eller kunst"),
        ("jeg_jobber_med_analyse_forskning","Jeg jobber med analyse, forskning eller strategi"),
        ("jeg_driver_egen_bedrift","Jeg driver egen bedrift"),
        ("jeg_vet_ikke_enna","Jeg vet ikke ennå"),
    ], 1): opts.append(o(s,"future_vision",v,l,i))

    # study_certainty
    for i, (v, l) in enumerate([
        ("jeg_vet_noeyaktig","Jeg vet nøyaktig hva jeg vil studere"),
        ("jeg_har_noen_ideer","Jeg har noen ideer"),
        ("jeg_er_ganske_usikker","Jeg er ganske usikker"),
        ("jeg_vet_ikke","Jeg vet ikke i det hele tatt"),
    ], 1): opts.append(o(s,"study_certainty",v,l,i))

    return opts


def bygg_sokelister(sb: Client) -> list[dict]:
    """Henter studier, yrker og bedrifter fra connections og bygger søkbare options."""
    fp = DATA_DIR / "connections-sortert.xlsx"
    xl  = pd.ExcelFile(fp)
    studier, yrker, bedrifter = set(), set(), set()
    for sheet in xl.sheet_names:
        df = pd.read_excel(fp, sheet_name=sheet)
        df.columns = [str(c).strip() for c in df.columns]
        for col in ["Studielinje"]:
            if col in df.columns:
                studier.update(str(v).strip() for v in df[col].dropna() if str(v).strip())
        for col in ["Alle yrker","Alle yrker 2"]:
            if col in df.columns:
                yrker.update(str(v).strip() for v in df[col].dropna() if str(v).strip())
        for col in ["Bedrifter"]:
            if col in df.columns:
                bedrifter.update(str(v).strip() for v in df[col].dropna() if str(v).strip())

    print(f"  Connections: {len(studier)} studier, {len(yrker)} yrker, {len(bedrifter)} bedrifter")
    opts = []
    for i, v in enumerate(sorted(studier), 1):
        opts.append(_opt(SURVEY_ID,"studies_considered",_uniq_slug(v,"studies_considered"),v,i))
    for i, v in enumerate(sorted(yrker), 1):
        opts.append(_opt(SURVEY_ID,"jobs_considered",_uniq_slug(v,"jobs_considered"),v,i))
    for i, v in enumerate(sorted(bedrifter), 1):
        opts.append(_opt(SURVEY_ID,"companies_considered",_uniq_slug(v,"companies_considered"),v,i))
    return opts


# ---------------------------------------------------------------------------
def main():
    print(f"Kobler til Supabase...")
    sb = create_client(SUPABASE_URL, SUPABASE_KEY)
    sb.table("survey_questions").select("id").limit(1).execute()
    print("Tilkobling OK ✓\n")

    # ── 1. Slett gamle elev-seksjoner og spørsmål ────────────────────────
    print("Steg 1: Sletter gamle elev-data fra Supabase...")
    old_page_ids = [
        "bakgrunn", "interesser_og_ferdigheter", "arbeidsstil_og_lring",
        "motivasjon_og_verdier", "fremtidsbilde_og_karriere",
        "studievalg_og_avklaring", "demografi_og_erfaring",
        "preferanser_og_interesser",
        # nye (i tilfelle re-run)
        "bakgrunn_og_skole","interesser","arbeidsstil",
        "ferdigheter","karrierepreferanser","fremtid",
    ]
    for pid in old_page_ids:
        sb.table("survey_options").delete()\
            .eq("survey_id", SURVEY_ID).eq("question_id",
                # hent question_ids for denne page_id
                "").execute() if False else None
    # Slett options basert på survey_id og alle question_ids
    r = sb.table("survey_questions").select("question_id")\
        .eq("survey_id", SURVEY_ID).execute()
    old_qids = [q["question_id"] for q in r.data]
    if old_qids:
        print(f"  Sletter options for {len(old_qids)} gamle question_ids...")
        for qid in old_qids:
            sb.table("survey_options").delete()\
                .eq("survey_id", SURVEY_ID).eq("question_id", qid).execute()
        print(f"  Sletter {len(old_qids)} gamle spørsmål...")
        sb.table("survey_questions").delete()\
            .eq("survey_id", SURVEY_ID).execute()
    # Slett seksjoner
    sb.table("survey_sections").delete().eq("survey_id", SURVEY_ID).execute()
    print("  Gammelt innhold slettet ✓\n")

    # ── 2. Importer seksjoner ────────────────────────────────────────────
    print("Steg 2: Importerer 6 seksjoner...")
    _upsert(sb, "survey_sections", SEKSJONER, "survey_id,page_id")

    # ── 3. Importer spørsmål ─────────────────────────────────────────────
    print(f"\nSteg 3: Importerer {len(SPORSMAL)} spørsmål...")
    _upsert(sb, "survey_questions", SPORSMAL, "survey_id,question_id")

    # ── 4. Importer faste alternativer ───────────────────────────────────
    print("\nSteg 4: Importerer faste svaralternativer...")
    opts = bygg_alternativer()
    print(f"  {len(opts)} alternativer totalt")
    _upsert(sb, "survey_options", opts, "survey_id,question_id,option_value")

    # ── 5. Importer søkelister fra connections ───────────────────────────
    print("\nSteg 5: Importerer søkelister fra connections-sortert.xlsx...")
    sok_opts = bygg_sokelister(sb)
    print(f"  {len(sok_opts)} søkbare alternativer")
    _upsert(sb, "survey_options", sok_opts, "survey_id,question_id,option_value")

    # ── 6. Verifiser ─────────────────────────────────────────────────────
    print("\nSteg 6: Verifiserer...")
    rq = sb.table("survey_questions").select("id", count="exact")\
        .eq("survey_id", SURVEY_ID).execute()
    rs = sb.table("survey_sections").select("id", count="exact")\
        .eq("survey_id", SURVEY_ID).execute()
    ro = sb.table("survey_options").select("id", count="exact")\
        .eq("survey_id", SURVEY_ID).execute()
    print(f"  Seksjoner: {rs.count}")
    print(f"  Spørsmål:  {rq.count}")
    print(f"  Options:   {ro.count}")

    print("""
╔══════════════════════════════════════════════════════╗
║  FERDIG! Elevsurveyen er oppdatert i Supabase.      ║
║                                                      ║
║  Lovable henter automatisk de nye spørsmålene.      ║
║  Backend scorer mot elev_scoring_map.py.            ║
╚══════════════════════════════════════════════════════╝
""")

if __name__ == "__main__":
    main()
