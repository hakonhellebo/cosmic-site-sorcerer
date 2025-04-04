
import { DimensionScores, Dimension } from './types';
import { getDimensionDescription } from './dimensionDescriptions';
import { updateScoresFromInterests } from './scoreUpdaters/interestsScoreUpdater';
import { updateScoresFromSkills, updateScoresFromStrengths } from './scoreUpdaters/skillsScoreUpdater';
import { 
  updateScoresFromWorkTasks, 
  updateScoresFromWorkEnvironment, 
  updateScoresFromWorkPreference 
} from './scoreUpdaters/workPreferenceScoreUpdater';
import { 
  updateScoresFromFavoriteCourses,
  updateScoresFromFavoriteSubjects
} from './scoreUpdaters/coursesScoreUpdater';
import {
  updateScoresFromSalaryImportance,
  updateScoresFromSocialImpact,
  updateScoresFromFutureWorkVision,
  updateScoresFromIndustries,
  updateScoresFromLearningStyle,
  updateScoresFromWorkEnvironmentPreferences,
  ensureMinimumScores
} from './scoreUpdaters/otherScoreUpdaters';

export const calculateHighSchoolDimensions = (highSchoolData: any): Dimension[] => {
  if (!highSchoolData) {
    console.log("No high school data provided for dimension calculation");
    return [];
  }

  // Initialize score counters with zero
  const scores: DimensionScores = {
    analytisk: 0,
    kreativitet: 0,
    struktur: 0, 
    sosialitet: 0,
    teknologi: 0,
    helseinteresse: 0,
    bærekraft: 0,
    ambisjon: 0,
    selvstendighet: 0,
    praktisk: 0
  };
  
  console.log("Starting dimension calculation with highSchoolData:", highSchoolData);
  
  // Apply all score updaters
  updateScoresFromInterests(scores, highSchoolData.interests);
  updateScoresFromSkills(scores, highSchoolData.goodSkills);
  updateScoresFromStrengths(scores, highSchoolData.strengths);
  updateScoresFromWorkTasks(scores, highSchoolData.workTasks);
  updateScoresFromWorkEnvironment(scores, highSchoolData.workEnvironment);
  updateScoresFromWorkPreference(scores, highSchoolData.workPreference);
  updateScoresFromSalaryImportance(scores, highSchoolData.salaryImportance);
  updateScoresFromSocialImpact(scores, highSchoolData.socialImpactImportance);
  updateScoresFromFutureWorkVision(scores, highSchoolData.futureWorkVision);
  updateScoresFromIndustries(scores, highSchoolData.interestingIndustries);
  updateScoresFromLearningStyle(scores, highSchoolData.learningStyle);
  updateScoresFromWorkEnvironmentPreferences(scores, highSchoolData.workEnvironmentPreferences);
  updateScoresFromFavoriteCourses(scores, highSchoolData.favoriteCourses);
  updateScoresFromFavoriteSubjects(scores, highSchoolData.favoriteSubjects);
  
  // Ensure minimum score for each dimension for presentation purposes
  ensureMinimumScores(scores);
  
  // Log the final scores before sorting
  console.log("Final dimension scores:", scores);
  
  // Convert to array and sort by score (highest first)
  return Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([dimension]) => getDimensionDescription(dimension));
};
