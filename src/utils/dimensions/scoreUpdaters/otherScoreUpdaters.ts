
import { DimensionScores } from '../types';

// Updates scores based on salary importance
export const updateScoresFromSalaryImportance = (scores: DimensionScores, salaryImportance: string | undefined): void => {
  if (!salaryImportance) return;
  
  if (salaryImportance === 'very-important') {
    scores.ambisjon += 4;
    console.log("Added 4 to ambisjon from salaryImportance=very-important");
  }
  else if (salaryImportance === 'important') {
    scores.ambisjon += 2;
    console.log("Added 2 to ambisjon from salaryImportance=important");
  }
};

// Updates scores based on social impact importance
export const updateScoresFromSocialImpact = (scores: DimensionScores, socialImpactImportance: string | undefined): void => {
  if (!socialImpactImportance) return;
  
  if (socialImpactImportance === 'very-important') {
    scores.bærekraft += 4;
    console.log("Added 4 to bærekraft from socialImpactImportance=very-important");
  }
  else if (socialImpactImportance === 'important') {
    scores.bærekraft += 2;
    console.log("Added 2 to bærekraft from socialImpactImportance=important");
  }
};

// Updates scores based on future work vision
export const updateScoresFromFutureWorkVision = (scores: DimensionScores, futureWorkVision: string | undefined): void => {
  if (!futureWorkVision) return;
  
  if (futureWorkVision === 'technology') {
    scores.teknologi += 5;
    console.log("Added 5 to teknologi from futureWorkVision=technology");
  } else if (futureWorkVision === 'creative') {
    scores.kreativitet += 5;
    console.log("Added 5 to kreativitet from futureWorkVision=creative");
  } else if (futureWorkVision === 'secure') {
    scores.struktur += 5;
    console.log("Added 5 to struktur from futureWorkVision=secure");
  } else if (futureWorkVision === 'leading') {
    scores.ambisjon += 5;
    console.log("Added 5 to ambisjon from futureWorkVision=leading");
  } else if (futureWorkVision === 'helping') {
    scores.helseinteresse += 5;
    scores.sosialitet += 3;
    console.log("Added 5 to helseinteresse and 3 to sosialitet from futureWorkVision=helping");
  }
};

// Updates scores based on interesting industries
export const updateScoresFromIndustries = (scores: DimensionScores, industries: Record<string, boolean> | undefined): void => {
  if (!industries) return;
  
  // New format
  if (industries.technology === true) {
    scores.teknologi += 4;
    console.log("Added 4 to teknologi from interestingIndustries.technology");
  }
  if (industries.healthcare === true) {
    scores.helseinteresse += 4;
    console.log("Added 4 to helseinteresse from interestingIndustries.healthcare");
  }
  if (industries.finance === true) {
    scores.analytisk += 3;
    scores.ambisjon += 2;
    console.log("Added 3 to analytisk and 2 to ambisjon from interestingIndustries.finance");
  }
  if (industries.logistics === true) {
    scores.struktur += 4;
    console.log("Added 4 to struktur from interestingIndustries.logistics");
  }
  
  // Older format
  if (industries.it === true || industries.teknologi === true) {
    scores.teknologi += 4;
    console.log("Added 4 to teknologi from industries.it/teknologi");
  }
  if (industries.helse === true) {
    scores.helseinteresse += 4;
    console.log("Added 4 to helseinteresse from industries.helse");
  }
  if (industries.kreativ === true) {
    scores.kreativitet += 4;
    console.log("Added 4 to kreativitet from industries.kreativ");
  }
};

// Updates scores based on learning style
export const updateScoresFromLearningStyle = (scores: DimensionScores, learningStyle: Record<string, boolean> | undefined): void => {
  if (!learningStyle) return;
  
  if (learningStyle.reading === true) {
    scores.analytisk += 2;
    console.log("Added 2 to analytisk from learningStyle.reading");
  }
  if (learningStyle.practical === true) {
    scores.praktisk += 3;
    console.log("Added 3 to praktisk from learningStyle.practical");
  }
  if (learningStyle.watching === true) {
    scores.analytisk += 1;
    console.log("Added 1 to analytisk from learningStyle.watching");
  }
};

// Updates scores based on work environment preferences
export const updateScoresFromWorkEnvironmentPreferences = (scores: DimensionScores, preferences: Record<string, boolean> | undefined): void => {
  if (!preferences) return;
  
  if (preferences.structure === true) {
    scores.struktur += 5;
    console.log("Added 5 to struktur from workEnvironmentPreferences.structure");
  }
  if (preferences.stability === true) {
    scores.struktur += 4;
    console.log("Added 4 to struktur from workEnvironmentPreferences.stability");
  }
};

// Ensures minimum scores for all dimensions
export const ensureMinimumScores = (scores: DimensionScores): void => {
  Object.keys(scores).forEach(key => {
    if (scores[key as keyof DimensionScores] === 0) {
      scores[key as keyof DimensionScores] = 1;
      console.log(`Set minimum score 1 for ${key}`);
    }
  });
};
