

export const mapHighSchoolAnswersToApi = (highSchoolData: any): Record<string, number> => {
  console.log("Mapping high school data to API format:", highSchoolData);
  
  const apiAnswers: Record<string, number> = {};
  
  // Map high school data to elev API format (different from university API)
  // Using direct field mapping for high school specific questions
  
  // Interests mapping
  if (highSchoolData.interests) {
    if (highSchoolData.interests.naturvitenskap) apiAnswers['naturvitenskap'] = 1;
    if (highSchoolData.interests.teknologi) apiAnswers['teknologi'] = 1;
    if (highSchoolData.interests.helse) apiAnswers['helse'] = 1;
    if (highSchoolData.interests.økonomi) apiAnswers['økonomi'] = 1;
  }
  
  // Strengths mapping
  if (highSchoolData.strengths) {
    if (highSchoolData.strengths.analytisk) apiAnswers['analytisk'] = 1;
    if (highSchoolData.strengths.kreativ) apiAnswers['kreativ'] = 1;
    if (highSchoolData.strengths.samarbeidsvillig) apiAnswers['samarbeidsvillig'] = 1;
  }
  
  // Favorite subjects mapping
  if (highSchoolData.favoriteSubjects) {
    if (highSchoolData.favoriteSubjects.matematikk) apiAnswers['matematikk'] = 1;
    if (highSchoolData.favoriteSubjects.fysikk) apiAnswers['fysikk'] = 1;
    if (highSchoolData.favoriteSubjects.kjemi) apiAnswers['kjemi'] = 1;
  }
  
  console.log("Mapped high school answers for API:", apiAnswers);
  return apiAnswers;
};

