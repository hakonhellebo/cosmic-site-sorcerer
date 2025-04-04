
// Types related to dimension calculations
export type DimensionScores = {
  analytisk: number;
  kreativitet: number;
  struktur: number;
  sosialitet: number;
  teknologi: number;
  helseinteresse: number;
  bærekraft: number;
  ambisjon: number;
  selvstendighet: number;
  praktisk: number;
};

export type Dimension = {
  name: string;
  description: string;
};

// Common type for all score update functions
export type ScoreUpdater = (scores: DimensionScores, data: any) => void;
