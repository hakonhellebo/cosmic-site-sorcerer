
import { DimensionScores } from '../types';

// Updates scores based on skills
export const updateScoresFromSkills = (scores: DimensionScores, goodSkills: Record<string, boolean> | undefined): void => {
  if (!goodSkills) return;
  
  if (goodSkills.communication === true) {
    scores.sosialitet += 4;
    console.log("Added 4 to sosialitet from goodSkills.communication");
  }
  if (goodSkills.logicalThinking === true) {
    scores.analytisk += 5;
    console.log("Added 5 to analytisk from goodSkills.logicalThinking");
  }
  if (goodSkills.creativity === true) {
    scores.kreativitet += 5;
    console.log("Added 5 to kreativitet from goodSkills.creativity");
  }
  if (goodSkills.technicalUnderstanding === true) {
    scores.teknologi += 5;
    console.log("Added 5 to teknologi from goodSkills.technicalUnderstanding");
  }
  if (goodSkills.leadership === true) {
    scores.ambisjon += 4;
    scores.sosialitet += 2;
    console.log("Added 4 to ambisjon and 2 to sosialitet from goodSkills.leadership");
  }
  if (goodSkills.collaboration === true) {
    scores.sosialitet += 5;
    console.log("Added 5 to sosialitet from goodSkills.collaboration");
  }
  if (goodSkills.problemSolving === true) {
    scores.analytisk += 3;
    console.log("Added 3 to analytisk from goodSkills.problemSolving");
  }
};

// Handles scores from the older 'strengths' format
export const updateScoresFromStrengths = (scores: DimensionScores, strengths: Record<string, boolean> | undefined): void => {
  if (!strengths) return;
  
  if (strengths.analytisk === true) {
    scores.analytisk += 5;
    console.log("Added 5 to analytisk from strengths.analytisk");
  }
  if (strengths.kreativ === true) {
    scores.kreativitet += 5;
    console.log("Added 5 to kreativitet from strengths.kreativ");
  }
  if (strengths.samarbeidsvillig === true) {
    scores.sosialitet += 5;
    console.log("Added 5 to sosialitet from strengths.samarbeidsvillig");
  }
  if (strengths.kommunikativ === true) {
    scores.sosialitet += 4;
    console.log("Added 4 to sosialitet from strengths.kommunikativ");
  }
  if (strengths.lederskap === true) {
    scores.ambisjon += 4;
    scores.sosialitet += 2;
    console.log("Added 4 to ambisjon and 2 to sosialitet from strengths.lederskap");
  }
  if (strengths.problemlosning === true) {
    scores.analytisk += 3;
    console.log("Added 3 to analytisk from strengths.problemlosning");
  }
  if (strengths.teknisk === true) {
    scores.teknologi += 5;
    console.log("Added 5 to teknologi from strengths.teknisk");
  }
};
