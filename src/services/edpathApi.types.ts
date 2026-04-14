
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

/** LLM-ready context block (for future AI explanations) */
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

/** Full API response from the EdPath matching engine */
export interface EdPathApiResponse {
  dimensjoner: EdPathDimension[];
  topp_sektorer: EdPathTopSektor[];
  yrker: EdPathYrke[];
  studier: EdPathStudie[];
  bedrifter: EdPathBedrift[];
  profil?: EdPathProfil;
  preferanser?: EdPathPreferanser;
  llm_context?: EdPathLlmContext;
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
