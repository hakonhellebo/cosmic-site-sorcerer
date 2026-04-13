"""
elev_scoring_map.py
===================
Python-basert scoringsmap for ny elevsurveyen (edpath_elev_sporreundersokelse.xlsx).

Bygger på de 23 kanoniske dimensjonene fra dimensjon_sektor_mapping.xlsx:
  Teknologi, Analytisk, Bærekraft, Helseinteresse, Kreativitet, Praktisk,
  Ambisjon, Selvstendighet, Sosialitet, Struktur, Fleksibilitet, Helse,
  Økonomi, Samfunnsfag, Kunst/design, Utdanning, Jus, Sikkerhet, Sport,
  Transport, Religion, Humaniora, Språk

Hvert spørsmål har en vekt som skalerer bidraget til dimensjonene.
Scoringsverdiene er 1–5 der 5 = veldig sterkt signal.

Vektingsprinsipp (DEL 2):
  - Interessespørsmål (seksjon 2):        vekt 0.80–1.00 — sterkeste signal
  - Fremtid/rolle-spørsmål (seksjon 6):   vekt 0.65–0.85 — nesten like sterkt
  - Ferdigheter (seksjon 4):              vekt 0.50–0.70 — middels signal
  - Fagbakgrunn/fag (seksjon 1):          vekt 0.40–0.60 — moderert
  - Arbeidsstil (seksjon 3):              vekt 0.40–0.55 — lett signal
  - Karrierepreferanser (seksjon 5):      vekt 0.30–0.45 — støttesignal

Bakoverkompatibilitet:
  Eksisterende question_id-er fra v2 Excel-matrisen (interest_fields, strongest_skills etc.)
  fortsetter å fungere via survey_loader + scoring_engine.
  Dette modulet aktiveres for question_id-er som matcher QUESTION_VEKTER nedenfor.

Survey-kilde: edpath_elev_sporreundersokelse.xlsx (april 2026)
  Seksjon 1: Bakgrunn og skole
  Seksjon 2: Interesser
  Seksjon 3: Arbeidsstil
  Seksjon 4: Ferdigheter
  Seksjon 5: Karrierepreferanser
  Seksjon 6: Fremtid og karrierevalg
"""

from __future__ import annotations

# ---------------------------------------------------------------------------
# Vekter per spørsmålsgruppe
# Høyere = sterkere signal i samlet dimensjonsprofil
# Maks bidrag per spørsmål = score (1–5) × vekt
# ---------------------------------------------------------------------------

QUESTION_VEKTER: dict[str, float] = {
    # ── Seksjon 2: Interesser (sterkest signal) ──────────────────────────
    "interest_areas":           1.00,   # «Hvilke områder er mest interessante?»  (max 3)
    "problem_types":            0.90,   # «Hvilke typer problemer er spennende?»  (max 2)
    "future_area":              0.85,   # «Hvis du kunne jobbet med ett område...» (single)
    "future_roles_ny":          0.80,   # «Hvilke roller ser du for deg?»          (max 3)
    "activities":               0.75,   # «Hvilke aktiviteter liker du best?»      (max 3)
    "industry_interest_ny":     0.70,   # «Hvilke bransjer virker spennende?»      (max 3)

    # ── Seksjon 6: Fremtid og karrierevalg ───────────────────────────────
    "future_industry":          0.65,   # «Hvilke bransjer synes du er spennende?» (max 3)
    "future_role_types_2":      0.60,   # «Hvilke typer roller?»                   (max 3)
    "future_vision":            0.50,   # «Arbeidshverdagen om 10 år?»             (single)

    # ── Seksjon 4: Ferdigheter ───────────────────────────────────────────
    "best_skills":              0.70,   # «Hvilke ferdigheter er du best på?»      (max 3)
    "independence_level":       0.55,   # «Klarer du å jobbe selvstendig?»         (single)
    "problem_approach":         0.55,   # «Hva gjør du oftest ved vanskel. prob.?» (single)
    "improve_skills":           0.25,   # «Vil bli bedre på» — aspirasjon, lav vekt

    # ── Seksjon 1: Bakgrunn og fag ───────────────────────────────────────
    "interesting_subjects":     0.60,   # «Hvilke fag synes du er mest interessante?» (max 3)
    "best_subjects_ny":         0.40,   # «Hvilke fag er du best i?»               (max 3)
    "realfag":                  0.45,   # «Hvilke realfag tar du?»                 (multi)
    "programfag":               0.45,   # «Hvilke programfag tar du?»              (multi)

    # ── Seksjon 3: Arbeidsstil ───────────────────────────────────────────
    "work_content":             0.55,   # «Hva liker du best å jobbe med?»         (single)
    "motivation_ny":            0.50,   # «Hva motiverer deg mest?»                (single)
    "daily_work_style":         0.45,   # «Hva slags arbeidshverdag passer?»       (single)
    "work_style":               0.40,   # «Hvordan liker du best å jobbe?»         (single)
    "learning_style_ny":        0.35,   # «Hvordan lærer du best?»                 (single)

    # ── Seksjon 5: Karrierepreferanser ───────────────────────────────────
    "work_environment":         0.45,   # «Hva slags arbeidsmiljø?»                (max 2)
    "future_role_type":         0.45,   # «Hvilken type rolle?»                    (single)
    "impact_importance":        0.40,   # «Viktig å gjøre positiv forskjell?»      (single)
    "salary_importance":        0.35,   # «Viktig å tjene godt?»                   (single)
    "stability_importance":     0.30,   # «Viktig med trygg og stabil jobb?»       (single)

    # ── Metadata / svak støtte ───────────────────────────────────────────
    "tech_comfort":             0.25,   # «Komfortabel med teknologi?»             (single)
}


# ---------------------------------------------------------------------------
# Filterfelter — question_id → filter_data nøkkel
# Disse scores IKKE mot dimensjoner, men brukes av filter_engine
# ---------------------------------------------------------------------------

FILTER_FELT: dict[str, str] = {
    "grade_avg_ny":    "grade_average",   # videresend til eksisterende filter
    "school_year_ny":  "school_year",
    "program_type":    "program_type",    # studiespesialisering/yrkesfag etc.
    "study_certainty": "study_certainty", # hvor sikker er brukeren?
}

# Karaktergjennomsnitt fra ny survey → eksisterende filter-format
GRADE_AVG_MAP: dict[str, str] = {
    "under_3_0": "1_2",
    "3_0_3_4":   "1_2",
    "3_0_3_5":   "1_2",
    "3_5_3_9":   "3_4",
    "3_5_4_0":   "3_4",
    "4_0_4_4":   "3_4",
    "4_0_4_5":   "3_4",
    "4_5_4_9":   "5_6",
    "4_5_5_0":   "5_6",
    "5_0_5_4":   "5_6",
    "5_0_5_5":   "5_6",
    "5_5_6_0":   "5_6",
    "vet_ikke":  None,
}


# ---------------------------------------------------------------------------
# Preferansefelter — question_id → PreferanseSignaler-felt
# Disse sendes som soft signals til recommendation_engine
# ---------------------------------------------------------------------------

PREFERANSE_FELT: dict[str, str] = {
    "studies_considered":   "studie_interesse",
    "jobs_considered":      "yrke_interesse",
    "companies_considered": "bedrift_interesse",
    "industry_interest_ny": "bransje_interesse",
    "future_industry":      "bransje_interesse",
}


# ---------------------------------------------------------------------------
# Hoved-scoringstabell
# Format: question_id → { option_value → { dimensjon: score (1–5) } }
# Scorer akkumuleres (additivt) — flere svar gir høyere total
# Normalisert option_value brukes (lowercase, ingen diakritika, underscore)
# ---------------------------------------------------------------------------

DIMENSJON_SCORING: dict[str, dict[str, dict[str, float]]] = {

    # ===================================================================
    # SEKSJON 2 — INTERESSER (vekt 0.70 – 1.00)
    # ===================================================================

    "interest_areas": {
        # «Hvilke områder synes du er mest interessante å lære mer om?» (max 3)
        "teknologi_og_programmering":        {"Teknologi": 5},
        "medisin_og_helse":                  {"Helseinteresse": 5, "Helse": 2},
        "okonomi_business_og_finans":        {"Økonomi": 5},
        "okonomi_business_finans":           {"Økonomi": 5},
        "samfunn_politikk_og_internasjonale": {"Samfunnsfag": 5},
        "samfunn_politikk":                  {"Samfunnsfag": 5},
        "psykologi_og_hvordan_mennesker":    {"Sosialitet": 4, "Helseinteresse": 2},
        "psykologi_mennesker":               {"Sosialitet": 4, "Helseinteresse": 2},
        "miljo_klima_og_baerekraft":         {"Bærekraft": 5},
        "miljo_klima_baerekraft":            {"Bærekraft": 5},
        "kunst_design_og_kreativt_arbeid":   {"Kreativitet": 4, "Kunst/design": 5},
        "kunst_design_kreativitet":          {"Kreativitet": 4, "Kunst/design": 5},
        "media_kommunikasjon_og_markedsforing": {"Sosialitet": 3, "Kreativitet": 3},
        "media_kommunikasjon_markedsforing": {"Sosialitet": 3, "Kreativitet": 3},
        "forskning_og_vitenskap":            {"Analytisk": 5},
        "idrett_og_fysisk_prestasjon":       {"Sport": 5},
        "idrett_fysisk_prestasjon":          {"Sport": 5},
    },

    "problem_types": {
        # «Hvilke typer problemer synes du er spennende å jobbe med?» (max 2)
        "analysere_data_og_finne_monstre":   {"Analytisk": 5},
        "analysere_data":                    {"Analytisk": 5},
        "lose_tekniske_eller_matematiske":   {"Teknologi": 4, "Analytisk": 2},
        "lose_tekniske_matematiske":         {"Teknologi": 4, "Analytisk": 2},
        "forsta_mennesker_og_hjelpe_dem":    {"Sosialitet": 5},
        "forsta_mennesker":                  {"Sosialitet": 5},
        "skape_nye_ideer_eller_produkter":   {"Kreativitet": 5},
        "skape_nye_ideer":                   {"Kreativitet": 5},
        "forbedre_organisasjoner_eller_bedrifter": {"Ambisjon": 4, "Struktur": 3},
        "forbedre_organisasjoner":           {"Ambisjon": 4, "Struktur": 3},
        "jobbe_med_samfunnsutfordringer":    {"Samfunnsfag": 4, "Bærekraft": 3},
        "utvikle_teknologi_eller_digitale":  {"Teknologi": 5},
        "utvikle_teknologi_digitale":        {"Teknologi": 5},
    },

    "activities": {
        # «Hvilke aktiviteter liker du best å bruke tid på?» (max 3)
        "programmering_eller_teknologi":     {"Teknologi": 5},
        "programmering_teknologi":           {"Teknologi": 5},
        "diskutere_samfunn_og_politikk":     {"Samfunnsfag": 4},
        "diskutere_samfunn_politikk":        {"Samfunnsfag": 4},
        "trene_eller_drive_med_idrett":      {"Sport": 5},
        "trene_idrett":                      {"Sport": 5},
        "tegne_designe_eller_skape":         {"Kreativitet": 4, "Kunst/design": 4},
        "tegne_designe_skape":               {"Kreativitet": 4, "Kunst/design": 4},
        "lese_eller_laere_om_nye_temaer":    {"Analytisk": 3},
        "lese_laere":                        {"Analytisk": 3},
        "starte_prosjekter_eller_ideer":     {"Ambisjon": 4, "Selvstendighet": 3},
        "starte_prosjekter":                 {"Ambisjon": 4, "Selvstendighet": 3},
        "hjelpe_andre_eller_vaere_sosial":   {"Sosialitet": 4, "Helseinteresse": 2},
        "hjelpe_andre":                      {"Sosialitet": 4, "Helseinteresse": 2},
        "jobbe_praktisk_eller_bygge_ting":   {"Praktisk": 5},
        "jobbe_praktisk_bygge":              {"Praktisk": 5},
    },

    "industry_interest_ny": {
        # «Hvilke bransjer virker mest spennende for deg?» seksjon 2 (max 3)
        "teknologi_og_it":                   {"Teknologi": 4},
        "helse_og_medisin":                  {"Helseinteresse": 5, "Helse": 2},
        "finans_og_okonomi":                 {"Økonomi": 5},
        "konsulent_og_radgivning":           {"Ambisjon": 3, "Analytisk": 2},
        "media_og_kommunikasjon":            {"Sosialitet": 3, "Kreativitet": 3},
        "utdanning_og_forskning":            {"Analytisk": 3, "Utdanning": 3},
        "energi_og_miljo":                   {"Bærekraft": 5},
        "bygg_ingenior_og_industri":         {"Praktisk": 4},
        "bygg_ingenior_industri":            {"Praktisk": 4},
        "offentlig_sektor":                  {"Samfunnsfag": 3},
        "idrett_og_prestasjon":              {"Sport": 5},
    },

    "future_roles_ny": {
        # «Hvilke roller kunne du sett for deg i fremtiden?» seksjon 2 (max 3)
        "leder_eller_organisasjonsbygger":   {"Ambisjon": 5},
        "leder_organisasjonsbygger":         {"Ambisjon": 5},
        "spesialist_innen_et_fagomrade":     {"Selvstendighet": 4, "Teknologi": 1},
        "spesialist":                        {"Selvstendighet": 4, "Teknologi": 1},
        "teknolog_eller_utvikler":           {"Teknologi": 5},
        "teknolog_utvikler":                 {"Teknologi": 5},
        "kreativ_rolle_design_media_kunst":  {"Kreativitet": 5},
        "kreativ_rolle":                     {"Kreativitet": 5},
        "forsker_eller_analytiker":          {"Analytisk": 5},
        "forsker_analytiker":                {"Analytisk": 5},
        "entrepreener_starte_egen_bedrift":  {"Ambisjon": 4, "Selvstendighet": 3},
        "entrepenor":                        {"Ambisjon": 4, "Selvstendighet": 3},
        "radgiver_eller_konsulent":          {"Ambisjon": 3, "Analytisk": 3},
        "radgiver_konsulent":                {"Ambisjon": 3, "Analytisk": 3},
        "jobbe_tett_med_mennesker":          {"Sosialitet": 5, "Helseinteresse": 2},
    },

    "future_area": {
        # «Hvis du kunne jobbet med ett område, hva ville vært mest spennende?» (single)
        "utvikle_ny_teknologi":              {"Teknologi": 5},
        "jobbe_med_mennesker_og_helse":      {"Helseinteresse": 5, "Sosialitet": 3},
        "jobbe_med_mennesker_helse":         {"Helseinteresse": 5, "Sosialitet": 3},
        "bygge_eller_lede_en_bedrift":       {"Ambisjon": 5, "Selvstendighet": 2},
        "bygge_lede_bedrift":                {"Ambisjon": 5, "Selvstendighet": 2},
        "forsta_samfunnet_og_pavirke":       {"Samfunnsfag": 5},
        "forsta_samfunn_pavirke_politikk":   {"Samfunnsfag": 5},
        "skape_kreative_prosjekter_eller_media": {"Kreativitet": 5, "Kunst/design": 3},
        "skape_kreative_prosjekter":         {"Kreativitet": 5, "Kunst/design": 3},
        "forske_og_utvikle_ny_kunnskap":     {"Analytisk": 5},
        "forske":                            {"Analytisk": 5},
        "jeg_er_usikker":                    {},
        "usikker":                           {},
    },

    # ===================================================================
    # SEKSJON 4 — FERDIGHETER (vekt 0.25 – 0.70)
    # ===================================================================

    "best_skills": {
        # «Hvilke ferdigheter føler du at du er best på?» (max 3)
        "analytisk_tenkning":                {"Analytisk": 4},
        "problemlosning":                    {"Analytisk": 3, "Praktisk": 2},
        "kreativitet":                       {"Kreativitet": 4},
        "kommunikasjon":                     {"Sosialitet": 3},
        "samarbeid":                         {"Sosialitet": 3},
        "teknisk_forstaelse":                {"Teknologi": 4},
        "ledelse_og_organisering":           {"Ambisjon": 4, "Struktur": 2},
        "selvstendig_arbeid":                {"Selvstendighet": 4},
    },

    "independence_level": {
        # «Hvor godt føler du at du klarer å jobbe selvstendig med oppgaver?» (single)
        "veldig_godt":    {"Selvstendighet": 4},
        "ganske_godt":    {"Selvstendighet": 3},
        "middels":        {},
        "ikke_sa_godt":   {},
    },

    "problem_approach": {
        # «Når du møter et vanskelig problem, hva gjør du oftest?» (single)
        "analysere_problemet_steg_for_steg": {"Analytisk": 4},
        "sporre_andre_om_hjelp":             {"Sosialitet": 3},
        "prove_ulike_losninger":             {"Praktisk": 3},
        "soke_informasjon_og_laere":         {"Analytisk": 2},
    },

    "improve_skills": {
        # «Hvilke ferdigheter ønsker du å bli bedre på?» — aspirasjon, lavt vektet
        "analytisk_tenkning":                {"Analytisk": 2},
        "problemlosning":                    {"Analytisk": 2, "Praktisk": 1},
        "kreativitet":                       {"Kreativitet": 2},
        "kommunikasjon":                     {"Sosialitet": 2},
        "samarbeid":                         {"Sosialitet": 2},
        "teknologiforstaelse":               {"Teknologi": 2},
        "teknisk_forstaelse":                {"Teknologi": 2},
        "ledelse":                           {"Ambisjon": 2},
        "ledelse_og_organisering":           {"Ambisjon": 2, "Struktur": 1},
        "selvledelse_og_struktur":           {"Struktur": 3},
    },

    # ===================================================================
    # SEKSJON 1 — BAKGRUNN OG FAG (vekt 0.40 – 0.60)
    # ===================================================================

    "interesting_subjects": {
        # «Hvilke fag synes du er mest interessante?» (max 3)
        "matematikk":                        {"Analytisk": 3, "Teknologi": 1},
        "naturfag_teknologi":                {"Teknologi": 3, "Bærekraft": 2},
        "naturfag___teknologi":              {"Teknologi": 3, "Bærekraft": 2},
        "samfunnsfag_politikk":              {"Samfunnsfag": 3},
        "samfunnsfag___politikk":            {"Samfunnsfag": 3},
        "okonomi_business":                  {"Økonomi": 3},
        "okonomi___business":                {"Økonomi": 3},
        "psykologi_mennesker":               {"Sosialitet": 3, "Helseinteresse": 1},
        "psykologi___mennesker":             {"Sosialitet": 3, "Helseinteresse": 1},
        "kreative_fag_design_media_kunst":   {"Kreativitet": 3, "Kunst/design": 2},
        "kreative_fag":                      {"Kreativitet": 3, "Kunst/design": 2},
        "idrett_fysisk_aktivitet":           {"Sport": 3},
        "idrett___fysisk_aktivitet":         {"Sport": 3},
        "praktiske_fag_handverk":            {"Praktisk": 3},
        "praktiske_fag___handverk":          {"Praktisk": 3},
    },

    "best_subjects_ny": {
        # «Hvilke fag får du vanligvis best karakterer i?» (max 3)
        "matematikk":                        {"Analytisk": 3, "Teknologi": 1},
        "naturfag":                          {"Analytisk": 2, "Helse": 1},
        "norsk":                             {"Humaniora": 2},
        "engelsk":                           {"Humaniora": 1, "Språk": 2},
        "samfunnsfag":                       {"Samfunnsfag": 2},
        "fremmedsprak":                      {"Språk": 3, "Humaniora": 1},
        "fremmedsprak_2":                    {"Språk": 3, "Humaniora": 1},
        "kroppsoving":                       {"Sport": 2},
        "okonomi_markedsforing":             {"Økonomi": 3},
        "okonomi___markedsforing":           {"Økonomi": 3},
        "kreative_fag_kunst_design_media":   {"Kreativitet": 2, "Kunst/design": 2},
        "kreative_fag":                      {"Kreativitet": 2, "Kunst/design": 2},
        "yrkesfaglige_fag":                  {"Praktisk": 3},
    },

    "realfag": {
        # «Hvilke realfag tar du eller planlegger å ta?» (multi)
        "r1_matematikk":                     {"Analytisk": 3, "Teknologi": 1},
        "r2_matematikk":                     {"Analytisk": 4, "Teknologi": 2},
        "s1_matematikk":                     {"Analytisk": 2, "Økonomi": 1},
        "s2_matematikk":                     {"Analytisk": 3, "Økonomi": 1},
        "fysikk":                            {"Teknologi": 3, "Analytisk": 2},
        "kjemi":                             {"Helse": 2, "Bærekraft": 2},
        "biologi":                           {"Helse": 3, "Helseinteresse": 2},
        "informatikk_it":                    {"Teknologi": 4, "Analytisk": 2},
        "informatikk___it":                  {"Teknologi": 4, "Analytisk": 2},
        "jeg_tar_ingen_realfag":             {},
    },

    "programfag": {
        # «Hvilke programfag tar du eller planlegger å ta?» (multi)
        "okonomistyring":                    {"Økonomi": 3},
        "markedsforing_og_ledelse":          {"Ambisjon": 2, "Økonomi": 2},
        "entrepreenerskap":                  {"Ambisjon": 4, "Selvstendighet": 2},
        "entrepenorskap":                    {"Ambisjon": 4, "Selvstendighet": 2},
        "psykologi":                         {"Sosialitet": 2, "Helseinteresse": 2},
        "sosialkunnskap":                    {"Samfunnsfag": 2},
        "rettslare":                         {"Jus": 4},
        "politikk_og_menneskerettigheter":   {"Samfunnsfag": 3, "Jus": 2},
        "medie_og_informasjonskunnskap":     {"Kreativitet": 2, "Sosialitet": 1},
        "design_og_arkitektur":              {"Kreativitet": 3, "Kunst/design": 3},
        "informasjonsteknologi":             {"Teknologi": 4, "Analytisk": 1},
    },

    # ===================================================================
    # SEKSJON 3 — ARBEIDSSTIL (vekt 0.35 – 0.55)
    # ===================================================================

    "work_content": {
        # «Hva liker du best å jobbe med?» (single)
        "analysere_tall_og_data":            {"Analytisk": 4},
        "analysere_tall_data":               {"Analytisk": 4},
        "lose_tekniske_eller_praktiske":     {"Praktisk": 3, "Teknologi": 2},
        "lose_tekniske_praktiske":           {"Praktisk": 3, "Teknologi": 2},
        "kommunisere_og_samarbeide":         {"Sosialitet": 3},
        "kommunisere_samarbeide":            {"Sosialitet": 3},
        "skape_nye_ideer_eller_losninger":   {"Kreativitet": 3},
        "skape_nye_ideer":                   {"Kreativitet": 3},
        "planlegge_og_organisere_arbeid":    {"Struktur": 3, "Ambisjon": 2},
        "planlegge_organisere":              {"Struktur": 3, "Ambisjon": 2},
    },

    "daily_work_style": {
        # «Hva slags arbeidshverdag passer deg best?» (single)
        "en_strukturert_hverdag":            {"Struktur": 4},
        "strukturert_hverdag":               {"Struktur": 4},
        "en_variert_hverdag":                {"Fleksibilitet": 3},
        "variert_hverdag":                   {"Fleksibilitet": 3},
        "en_kreativ_hverdag":                {"Kreativitet": 3},
        "kreativ_hverdag":                   {"Kreativitet": 3},
        "en_hektisk_hverdag":                {"Ambisjon": 2},
        "hektisk_hverdag":                   {"Ambisjon": 2},
    },

    "motivation_ny": {
        # «Hva motiverer deg mest når du jobber med noe?» (single)
        "a_lose_vanskelige_problemer":       {"Analytisk": 3},
        "lose_vanskelige_problemer":         {"Analytisk": 3},
        "a_oppna_gode_resultater":           {"Ambisjon": 3},
        "oppna_gode_resultater":             {"Ambisjon": 3},
        "a_samarbeide_med_andre":            {"Sosialitet": 3},
        "samarbeide_med_andre":              {"Sosialitet": 3},
        "a_skape_noe_nytt":                  {"Kreativitet": 3},
        "skape_noe_nytt":                    {"Kreativitet": 3},
        "a_hjelpe_andre":                    {"Sosialitet": 3, "Helseinteresse": 1},
        "hjelpe_andre":                      {"Sosialitet": 3, "Helseinteresse": 1},
    },

    "work_style": {
        # «Hvordan liker du best å jobbe?» (single)
        "mest_alene":                        {"Selvstendighet": 3},
        "mest_i_team":                       {"Sosialitet": 3},
        "litt_av_begge_deler":               {"Fleksibilitet": 2},
        "litt_av_begge":                     {"Fleksibilitet": 2},
    },

    "learning_style_ny": {
        # «Hvordan lærer du best nye ting?» (single)
        "ved_a_lese_og_forsta_teori":        {"Analytisk": 2},
        "lese_teori":                        {"Analytisk": 2},
        "ved_a_lose_oppgaver_og_problemer":  {"Praktisk": 3},
        "lose_oppgaver":                     {"Praktisk": 3},
        "ved_a_diskutere_med_andre":         {"Sosialitet": 2},
        "diskutere":                         {"Sosialitet": 2},
        "ved_a_prove_ting_i_praksis":        {"Praktisk": 4},
        "prove_i_praksis":                   {"Praktisk": 4},
        "ved_a_se_videoer_eller_demonstrasjoner": {"Fleksibilitet": 1},
        "se_videoer":                        {"Fleksibilitet": 1},
    },

    # ===================================================================
    # SEKSJON 5 — KARRIEREPREFERANSER (vekt 0.30 – 0.45)
    # ===================================================================

    "work_environment": {
        # «Hva slags arbeidsmiljø passer deg best?» (max 2)
        "et_sosialt_og_samarbeidsorientert": {"Sosialitet": 3},
        "sosialt_og_samarbeidsorientert":    {"Sosialitet": 3},
        "et_rolig_og_strukturert":           {"Struktur": 3},
        "rolig_og_strukturert":              {"Struktur": 3},
        "et_kreativt_og_innovativt":         {"Kreativitet": 3},
        "kreativt_og_innovativt":            {"Kreativitet": 3},
        "et_malrettet_og_konkurransepreget": {"Ambisjon": 3},
        "malrettet_og_konkurransepreget":    {"Ambisjon": 3},
        "et_fleksibelt_miljo":               {"Selvstendighet": 3, "Fleksibilitet": 2},
        "fleksibelt_med_selvstendighet":     {"Selvstendighet": 3, "Fleksibilitet": 2},
    },

    "future_role_type": {
        # «Hvilken type rolle?» seksjon 5 (single)
        "en_lederrolle":                     {"Ambisjon": 4},
        "lederrolle":                        {"Ambisjon": 4},
        "en_spesialistrolle":                {"Selvstendighet": 3},
        "spesialistrolle":                   {"Selvstendighet": 3},
        "en_kreativ_rolle":                  {"Kreativitet": 4},
        "kreativ_rolle":                     {"Kreativitet": 4},
        "en_radgivende_rolle":               {"Sosialitet": 3, "Analytisk": 2},
        "radgivende_rolle":                  {"Sosialitet": 3, "Analytisk": 2},
        "jeg_er_usikker":                    {},
        "usikker":                           {},
    },

    "impact_importance": {
        # «Hvor viktig er det for deg å gjøre en positiv forskjell?» (single)
        "veldig_viktig":   {"Samfunnsfag": 3, "Helseinteresse": 2, "Bærekraft": 2},
        "ganske_viktig":   {"Samfunnsfag": 2, "Helseinteresse": 1},
        "litt_viktig":     {},
        "ikke_sa_viktig":  {},
    },

    "salary_importance": {
        # «Hvor viktig er det for deg å tjene godt i fremtiden?» (single)
        "veldig_viktig":   {"Økonomi": 3, "Ambisjon": 2},
        "ganske_viktig":   {"Økonomi": 2, "Ambisjon": 1},
        "litt_viktig":     {},
        "ikke_sa_viktig":  {},
    },

    "stability_importance": {
        # «Hvor viktig er det for deg å ha en trygg og stabil jobb?» (single)
        "veldig_viktig":   {"Struktur": 3},
        "ganske_viktig":   {"Struktur": 2},
        "litt_viktig":     {},
        "ikke_sa_viktig":  {"Selvstendighet": 1},
    },

    # ===================================================================
    # SEKSJON 6 — FREMTID OG KARRIEREVALG (vekt 0.50 – 0.65)
    # ===================================================================

    "future_industry": {
        # «Hvilke bransjer synes du virker spennende?» seksjon 6 (max 3)
        # OBS: også PREFERANSE_FELT (bransje_interesse)
        "teknologi_og_it":                   {"Teknologi": 4},
        "helse_og_medisin":                  {"Helseinteresse": 5, "Helse": 2},
        "okonomi_og_finans":                 {"Økonomi": 5},
        "finans_og_okonomi":                 {"Økonomi": 5},
        "konsulent_og_radgivning":           {"Ambisjon": 3, "Analytisk": 2},
        "media_og_kommunikasjon":            {"Sosialitet": 3, "Kreativitet": 3},
        "utdanning_og_forskning":            {"Analytisk": 3, "Utdanning": 3},
        "energi_og_miljo":                   {"Bærekraft": 5},
        "bygg_ingenior_og_industri":         {"Praktisk": 4},
        "bygg_ingenior_industri":            {"Praktisk": 4},
        "offentlig_sektor":                  {"Samfunnsfag": 3},
        "idrett_og_prestasjon":              {"Sport": 5},
    },

    "future_role_types_2": {
        # «Hvilke typer roller ser du for deg?» seksjon 6 (max 3)
        "leder_eller_organisasjonsbygger":   {"Ambisjon": 5},
        "leder_organisasjonsbygger":         {"Ambisjon": 5},
        "spesialist_innen_et_fagomrade":     {"Selvstendighet": 4},
        "spesialist":                        {"Selvstendighet": 4},
        "teknolog_eller_utvikler":           {"Teknologi": 5},
        "teknolog_utvikler":                 {"Teknologi": 5},
        "kreativ_rolle_design_media_kunst":  {"Kreativitet": 5},
        "kreativ_rolle":                     {"Kreativitet": 5},
        "forsker_eller_analytiker":          {"Analytisk": 5},
        "forsker_analytiker":                {"Analytisk": 5},
        "entrepreener_starte_egen_bedrift":  {"Ambisjon": 4, "Selvstendighet": 3},
        "entrepenor":                        {"Ambisjon": 4, "Selvstendighet": 3},
        "radgiver_eller_konsulent":          {"Ambisjon": 3, "Analytisk": 3},
        "radgiver_konsulent":                {"Ambisjon": 3, "Analytisk": 3},
        "jobbe_tett_med_mennesker":          {"Sosialitet": 5, "Helseinteresse": 2},
    },

    "future_vision": {
        # «Hvordan ser du for deg arbeidshverdagen din om 10 år?» (single)
        "jeg_jobber_med_teknologi":          {"Teknologi": 3},
        "jobber_med_teknologi":              {"Teknologi": 3},
        "jeg_jobber_med_mennesker":          {"Sosialitet": 3, "Helseinteresse": 2},
        "jobber_med_mennesker_hjelper":      {"Sosialitet": 3, "Helseinteresse": 2},
        "jeg_leder_prosjekter":              {"Ambisjon": 3},
        "leder_prosjekter_organisasjon":     {"Ambisjon": 3},
        "jeg_jobber_kreativt":               {"Kreativitet": 3},
        "jobber_kreativt":                   {"Kreativitet": 3},
        "jeg_jobber_med_analyse_forskning":  {"Analytisk": 3},
        "jobber_med_analyse_forskning":      {"Analytisk": 3},
        "jeg_driver_egen_bedrift":           {"Ambisjon": 4, "Selvstendighet": 2},
        "driver_egen_bedrift":               {"Ambisjon": 4, "Selvstendighet": 2},
        "jeg_vet_ikke_enna":                 {},
        "vet_ikke":                          {},
    },

    # ===================================================================
    # METADATA (vekt 0.25)
    # ===================================================================

    "tech_comfort": {
        # «Hvor komfortabel er du med å bruke teknologi og digitale verktøy?»
        "veldig_komfortabel":                {"Teknologi": 3},
        "ganske_komfortabel":                {"Teknologi": 2},
        "litt_komfortabel":                  {"Teknologi": 1},
        "ikke_saerlig_komfortabel":          {},
    },
}
