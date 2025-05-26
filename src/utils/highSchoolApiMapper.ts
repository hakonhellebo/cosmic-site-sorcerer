
export const mapHighSchoolAnswersToApi = (highSchoolData: any): Record<string, number> => {
  console.log("Mapping high school data to API format:", highSchoolData);
  
  const apiAnswers: Record<string, number> = {};
  
  // Map high school data to the same format as university (Spm X)
  // This assumes the high school API uses the same question numbering
  
  // Interests mapping
  if (highSchoolData.interests) {
    if (highSchoolData.interests.naturvitenskap) apiAnswers['Spm 1'] = 1;
    if (highSchoolData.interests.teknologi) apiAnswers['Spm 2'] = 1;
    if (highSchoolData.interests.helse) apiAnswers['Spm 3'] = 1;
    if (highSchoolData.interests.økonomi) apiAnswers['Spm 4'] = 1;
  }
  
  // Strengths mapping
  if (highSchoolData.strengths) {
    if (highSchoolData.strengths.analytisk) apiAnswers['Spm 5'] = 1;
    if (highSchoolData.strengths.kreativ) apiAnswers['Spm 6'] = 1;
    if (highSchoolData.strengths.samarbeidsvillig) apiAnswers['Spm 7'] = 1;
  }
  
  // Favorite subjects mapping
  if (highSchoolData.favoriteSubjects) {
    if (highSchoolData.favoriteSubjects.matematikk) apiAnswers['Spm 8'] = 1;
    if (highSchoolData.favoriteSubjects.fysikk) apiAnswers['Spm 9'] = 1;
    if (highSchoolData.favoriteSubjects.kjemi) apiAnswers['Spm 10'] = 1;
  }
  
  console.log("Mapped high school answers for API:", apiAnswers);
  return apiAnswers;
};
