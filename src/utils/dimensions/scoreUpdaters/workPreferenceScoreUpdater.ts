
import { DimensionScores } from '../types';

// Updates scores based on work tasks
export const updateScoresFromWorkTasks = (scores: DimensionScores, workTasks: Record<string, boolean> | undefined): void => {
  if (!workTasks) return;
  
  if (workTasks.numbers === true) {
    scores.analytisk += 4;
    console.log("Added 4 to analytisk from workTasks.numbers");
  }
  if (workTasks.practical === true) {
    scores.praktisk += 5;
    console.log("Added 5 to praktisk from workTasks.practical");
  }
  if (workTasks.writing === true) {
    scores.kreativitet += 2;
    console.log("Added 2 to kreativitet from workTasks.writing");
  }
  if (workTasks.leadership === true) {
    scores.ambisjon += 5;
    scores.sosialitet += 3;
    console.log("Added 5 to ambisjon and 3 to sosialitet from workTasks.leadership");
  }
  if (workTasks.creative === true) {
    scores.kreativitet += 5;
    console.log("Added 5 to kreativitet from workTasks.creative");
  }
  if (workTasks.supportive === true) {
    scores.sosialitet += 4;
    scores.helseinteresse += 2;
    console.log("Added 4 to sosialitet and 2 to helseinteresse from workTasks.supportive");
  }
};

// Updates scores based on work environment preference
export const updateScoresFromWorkEnvironment = (scores: DimensionScores, workEnvironment: string | undefined): void => {
  if (!workEnvironment) return;
  
  if (workEnvironment === 'competitive') {
    scores.ambisjon += 4;
    scores.selvstendighet += 3;
    console.log("Added 4 to ambisjon and 3 to selvstendighet from workEnvironment=competitive");
  } else if (workEnvironment === 'collaborative') {
    scores.sosialitet += 4;
    console.log("Added 4 to sosialitet from workEnvironment=collaborative");
  }
};

// Updates scores based on work preference
export const updateScoresFromWorkPreference = (scores: DimensionScores, workPreference: string | undefined): void => {
  if (!workPreference) return;
  
  if (workPreference === 'alone') {
    scores.selvstendighet += 5;
    console.log("Added 5 to selvstendighet from workPreference=alone");
  } else if (workPreference === 'team') {
    scores.sosialitet += 5;
    console.log("Added 5 to sosialitet from workPreference=team");
  }
};
