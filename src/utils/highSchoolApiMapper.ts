
export const mapHighSchoolAnswersToApi = (highSchoolData: any): Record<string, number> => {
  console.log("Mapping high school data to API format:", highSchoolData);
  
  const apiAnswers: Record<string, number> = {};
  
  // Map high school data to same API format as university (using "Spm X" keys)
  // This should match the Excel file structure used by the API
  
  // Question 6 - Interests (Hvilke fagfelt interesserer deg mest?)
  if (highSchoolData.interests) {
    if (highSchoolData.interests.naturvitenskap) apiAnswers['Spm 6'] = 3;
    if (highSchoolData.interests.teknologi) apiAnswers['Spm 6'] = 3;
    if (highSchoolData.interests.helse) apiAnswers['Spm 6'] = 3;
    if (highSchoolData.interests.økonomi) apiAnswers['Spm 6'] = 3;
  }
  
  // Question 7 - Strengths (Hvilke ferdigheter føler du at du har styrke i?)
  if (highSchoolData.strengths) {
    if (highSchoolData.strengths.analytisk) apiAnswers['Spm 7'] = 2; // Maps to critical thinking
    if (highSchoolData.strengths.kreativ) apiAnswers['Spm 7'] = 2; // Maps to creativity
    if (highSchoolData.strengths.samarbeidsvillig) apiAnswers['Spm 7'] = 2; // Maps to collaboration
  }
  
  // Question 8 - Task preferences (derived from favorite subjects)
  if (highSchoolData.favoriteSubjects) {
    if (highSchoolData.favoriteSubjects.matematikk || highSchoolData.favoriteSubjects.fysikk) {
      apiAnswers['Spm 8'] = 3; // Analytical tasks
    }
    if (highSchoolData.favoriteSubjects.kjemi) {
      apiAnswers['Spm 8'] = 3; // Practical tasks  
    }
  }
  
  // Default mappings for other questions to ensure compatibility
  // These can be adjusted based on actual high school questionnaire fields
  apiAnswers['Spm 9'] = 2; // Work preference (default to mixed)
  apiAnswers['Spm 10'] = 2; // AI/Technology comfort (default to moderate)
  apiAnswers['Spm 11'] = 2; // AI usage frequency (default to moderate)
  
  // Map certainty level and future education to appropriate questions
  if (highSchoolData.certaintylevel) {
    const certaintyMapping = {
      'very-certain': 3,
      'somewhat-certain': 2,
      'not-very-certain': 1,
      'uncertain': 0
    };
    apiAnswers['Spm 12'] = certaintyMapping[highSchoolData.certaintylevel as keyof typeof certaintyMapping] || 1;
  }
  
  if (highSchoolData.futureEducation) {
    if (highSchoolData.futureEducation === 'university') apiAnswers['Spm 13'] = 3;
    if (highSchoolData.futureEducation === 'vocational') apiAnswers['Spm 13'] = 2;
    if (highSchoolData.futureEducation === 'work') apiAnswers['Spm 13'] = 1;
  }
  
  console.log("Mapped high school answers for API:", apiAnswers);
  return apiAnswers;
};
