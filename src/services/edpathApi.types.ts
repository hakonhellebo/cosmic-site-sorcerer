
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
}

/** A recommended company */
export interface EdPathBedrift {
  navn: string;
  sektor: string;
  underkategori?: string;
}

/** Full API response from the EdPath matching engine */
export interface EdPathApiResponse {
  dimensjoner: EdPathDimension[];
  topp_sektorer: EdPathTopSektor[];
  yrker: EdPathYrke[];
  studier: EdPathStudie[];
  bedrifter: EdPathBedrift[];
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
