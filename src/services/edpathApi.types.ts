
// ==========================================
// EdPath API Types
// ==========================================

/** A single dimension with name and score */
export interface EdPathDimension {
  navn: string;
  score: number;
}

/** A top sector with sector, subcategory, and score */
export interface EdPathTopSektor {
  sektor: string;
  underkategori: string;
  score: number;
}

/** A recommended career/job */
export interface EdPathYrke {
  navn: string;
  sektor: string;
  underkategori?: string;
  match_score?: number;
  match_reasons?: string[];
  preferanse_boost?: boolean;
}

/** A recommended study/education program */
export interface EdPathStudie {
  navn: string;
  sektor: string;
  underkategori?: string;
  lærested?: string;
  dimensjoner?: string[];
  stillinger?: string[];
  arbeidsgivere?: string[];
  match_score?: number;
  match_reasons?: string[];
  preferanse_boost?: boolean;
}

/** A recommended company */
export interface EdPathBedrift {
  navn: string;
  sektor: string;
  underkategori?: string;
  match_score?: number;
  match_reasons?: string[];
  preferanse_boost?: boolean;
}

/** Profile description returned by the API */
export interface EdPathProfil {
  profil_sammendrag: string;
  styrker: string[];
  laringsstil: string;
  arbeidsstil: string;
  motivasjonsstil: string;
  karriere_orientering?: string;
}

/** Preference signals from the user */
export interface EdPathPreferanser {
  studie_interesse: string[];
  yrke_interesse: string[];
  bedrift_interesse: string[];
  bransje_interesse: string[];
}

/** LLM-ready context block (input to the LLM engine) */
export interface EdPathLlmContext {
  brukertype: string;
  topp_dimensjoner: string[];
  topp_sektorer: string[];
  profil_sammendrag: string;
  styrker: string[];
  match_temaer: string[];
  preferanser: EdPathPreferanser;
  topp_yrker: string[];
  topp_studier: string[];
}

// ──────────────────────────────────────────────────────────
// LLM result types (output from llm_engine — gpt-4.1-mini)
// ──────────────────────────────────────────────────────────

/**
 * LLM-generated personal profile text.
 * Replaces static template text from profil_engine when available.
 * Frontend should prefer llm_resultat.profil.* over profil.* when present.
 */
export interface EdPathLlmProfil {
  profil_sammendrag:    string;   // 2–3 sentences: who the student is
  laringsstil:          string;   // how they learn best
  arbeidsstil:          string;   // preferred work style/environment
  motivasjonsstil:      string;   // what drives them
  karriere_orientering: string;   // long-term career direction
}

/** One strength dimension explained personally by the LLM */
export interface EdPathLlmStyrkForklart {
  dimensjon:  string;   // dimension name (e.g. "Analytisk")
  forklaring: string;   // concrete explanation for this specific student
}

/** One recommended study or career explained by the LLM */
export interface EdPathLlmAnbefaling {
  navn:       string;   // name of study or career
  type:       string;   // "studie" | "yrke"
  forklaring: string;   // concrete explanation of why it fits this student
}

/** One complete career path: study → career → employers */
export interface EdPathLlmKarrierevei {
  studie:     string;    // recommended study
  yrke:       string;    // career the study leads to
  bedrifter:  string[];  // example employers from the data
  forklaring: string;    // one sentence on relevance for this student
}

/** One alternative sector/direction the student could also consider */
export interface EdPathLlmAlternativRetning {
  sektor:     string;   // sector name in Norwegian
  forklaring: string;   // brief explanation of why it could fit
}

/** Full LLM result — attached to API response as llm_resultat */
export interface EdPathLlmResultat {
  profil:                EdPathLlmProfil;
  styrker_forklart:      EdPathLlmStyrkForklart[];
  hvorfor_anbefalinger:  EdPathLlmAnbefaling[];
  karriereveier:         EdPathLlmKarrierevei[];
  veien_videre:          string[];
  obs_punkter:           string[];
  alternative_retninger: EdPathLlmAlternativRetning[];
}

/** A sector group of studies */
export interface EdPathStudieGruppe {
  kategori: string;
  studier: EdPathStudie[];
}

/** A sector group of careers */
export interface EdPathYrkeGruppe {
  kategori: string;
  yrker: EdPathYrke[];
}

/** A sector group of companies */
export interface EdPathBedriftGruppe {
  kategori: string;
  bedrifter: EdPathBedrift[];
}

/** Full API response from the EdPath matching engine */
export interface EdPathApiResponse {
  dimensjoner: EdPathDimension[];
  topp_sektorer: EdPathTopSektor[];
  // Flat lists (backward compat / fallback)
  yrker: EdPathYrke[];
  studier: EdPathStudie[];
  bedrifter: EdPathBedrift[];
  // Grouped lists (primary UX structure — one group per sector)
  studier_grupper?: EdPathStudieGruppe[];
  yrker_grupper?: EdPathYrkeGruppe[];
  bedrifter_grupper?: EdPathBedriftGruppe[];
  profil?: EdPathProfil;
  preferanser?: EdPathPreferanser;
  llm_context?: EdPathLlmContext;
  /** LLM-generated explanation. null = OPENAI_API_KEY not set or call failed. */
  llm_resultat?: EdPathLlmResultat | null;
  // Legacy fields (may still be present)
  topp_dimensjoner?: string[];
}

/** User types supported by the API */
export type EdPathUserType = 'elev' | 'student' | 'arbeidstaker';

/** Request payload sent to the API */
export interface EdPathApiRequest {
  svar: Record<string, string | string[] | number>;
}

/** Mapped questionnaire answers ready for API submission */
export type EdPathMappedAnswers = Record<string, string | string[] | number>;
