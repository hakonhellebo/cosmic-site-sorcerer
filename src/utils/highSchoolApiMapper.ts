
export const mapHighSchoolAnswersToApi = (highSchoolData: any): Record<string, number> => {
  console.log("Mapping high school data to API format:", highSchoolData);
  
  const apiAnswers: Record<string, number> = {};
  
  // Map high school data to the exact same format as university API
  // Using the same question numbers and scoring system
  
  // Interests mapping (same as university)
  if (highSchoolData.interests) {
    if (highSchoolData.interests.teknologi) apiAnswers['Spm 6'] = 3;
    if (highSchoolData.interests.økonomi) apiAnswers['Spm 7'] = 2;
    if (highSchoolData.interests.naturvitenskap) apiAnswers['Spm 8'] = 3;
    if (highSchoolData.interests.helse) apiAnswers['Spm 9'] = 3;
  }
  
  // Strengths mapping (same as university)
  if (highSchoolData.strengths) {
    if (highSchoolData.strengths.analytisk) apiAnswers['Spm 10'] = 3; // kritisk_tenkning equivalent
    if (highSchoolData.strengths.kreativ) apiAnswers['Spm 11'] = 3; // kreativitet equivalent
    if (highSchoolData.strengths.samarbeidsvillig) apiAnswers['Spm 12'] = 2; // problemløsning equivalent
  }
  
  // Task preferences (map from favorite subjects to task preferences)
  if (highSchoolData.favoriteSubjects) {
    if (highSchoolData.favoriteSubjects.matematikk || highSchoolData.favoriteSubjects.fysikk) {
      apiAnswers['Spm 13'] = 3; // analytical tasks
    }
    if (highSchoolData.favoriteSubjects.kjemi) {
      apiAnswers['Spm 14'] = 3; // practical tasks
    }
  }
  
  // Default values for remaining questions to match university format
  apiAnswers['Spm 15'] = 3; // work preference (assume team)
  apiAnswers['Spm 16'] = 2; // ai usage (assume moderate)
  
  console.log("Mapped high school answers for API:", apiAnswers);
  return apiAnswers;
};
