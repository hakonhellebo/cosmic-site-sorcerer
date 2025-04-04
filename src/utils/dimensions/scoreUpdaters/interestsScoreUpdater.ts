
import { DimensionScores } from '../types';

// Updates scores based on interests
export const updateScoresFromInterests = (scores: DimensionScores, interests: Record<string, boolean> | undefined): void => {
  if (!interests) return;

  // English format
  if (interests.technology === true) {
    scores.teknologi += 5;
    console.log("Added 5 to teknologi from interests.technology");
  }
  if (interests.artDesign === true) {
    scores.kreativitet += 5;
    console.log("Added 5 to kreativitet from interests.artDesign");
  }
  if (interests.sports === true) {
    scores.praktisk += 3;
    console.log("Added 3 to praktisk from interests.sports");
  }
  if (interests.economyFinance === true) {
    scores.analytisk += 4;
    console.log("Added 4 to analytisk from interests.economyFinance");
  }
  if (interests.travelCulture === true) {
    scores.sosialitet += 3;
    console.log("Added 3 to sosialitet from interests.travelCulture");
  }
  if (interests.healthCare === true) {
    scores.helseinteresse += 5;
    console.log("Added 5 to helseinteresse from interests.healthCare");
  }
  if (interests.environmentSustainability === true) {
    scores.bærekraft += 5;
    console.log("Added 5 to bærekraft from interests.environmentSustainability");
  }
  
  // Norwegian format
  if (interests.teknologi === true) {
    scores.teknologi += 5;
    console.log("Added 5 to teknologi from interests.teknologi");
  }
  if (interests.kreativitet === true) {
    scores.kreativitet += 5;
    console.log("Added 5 to kreativitet from interests.kreativitet");
  }
  if (interests.idrett === true) {
    scores.praktisk += 3;
    console.log("Added 3 to praktisk from interests.idrett");
  }
  if (interests.okonomi === true) {
    scores.analytisk += 4;
    console.log("Added 4 to analytisk from interests.okonomi");
  }
  if (interests.reise === true) {
    scores.sosialitet += 3;
    console.log("Added 3 to sosialitet from interests.reise");
  }
  if (interests.helse === true) {
    scores.helseinteresse += 5;
    console.log("Added 5 to helseinteresse from interests.helse");
  }
  if (interests.miljo === true) {
    scores.bærekraft += 5;
    console.log("Added 5 to bærekraft from interests.miljo");
  }
  
  // Special handling for older Norwegian format
  if (interests.realfag === true) {
    scores.analytisk += 4;
    console.log("Added 4 to analytisk from interests.realfag");
  }
  if (interests.samfunnsfag === true) {
    scores.analytisk += 2;
    scores.sosialitet += 2;
    console.log("Added 2 to analytisk and 2 to sosialitet from interests.samfunnsfag");
  }
};
