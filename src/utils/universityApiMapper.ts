
export const mapUniversityAnswersToApi = (universityData: any): Record<string, number> => {
  console.log("Mapping university data to API format:", universityData);
  
  // This mapping will need to be adjusted based on your Excel file's question names
  // For now, I'm creating a basic mapping structure that you can customize
  const apiAnswers: Record<string, number> = {};
  
  // Map interests (assuming 1-5 scale where true=5, false=1)
  if (universityData.interests) {
    Object.entries(universityData.interests).forEach(([key, value], index) => {
      apiAnswers[`Spm ${index + 1}`] = value ? 5 : 1;
    });
  }
  
  // Map strengths
  if (universityData.strengths) {
    const startIndex = Object.keys(universityData.interests || {}).length;
    Object.entries(universityData.strengths).forEach(([key, value], index) => {
      apiAnswers[`Spm ${startIndex + index + 1}`] = value ? 5 : 1;
    });
  }
  
  // Map study field importance (if available)
  if (universityData.studyField) {
    const currentIndex = Object.keys(apiAnswers).length;
    // This is a placeholder - you'll need to map actual study fields to numbers
    apiAnswers[`Spm ${currentIndex + 1}`] = 3; // Default middle value
  }
  
  // Map salary importance
  if (universityData.salaryImportance) {
    const currentIndex = Object.keys(apiAnswers).length;
    const salaryMapping = {
      'very-important': 5,
      'important': 4,
      'somewhat-important': 3,
      'not-important': 2,
      'not-important-at-all': 1
    };
    apiAnswers[`Spm ${currentIndex + 1}`] = salaryMapping[universityData.salaryImportance as keyof typeof salaryMapping] || 3;
  }
  
  // Map impact importance
  if (universityData.impactImportance) {
    const currentIndex = Object.keys(apiAnswers).length;
    const impactMapping = {
      'very-important': 5,
      'important': 4,
      'somewhat-important': 3,
      'not-important': 2,
      'not-important-at-all': 1
    };
    apiAnswers[`Spm ${currentIndex + 1}`] = impactMapping[universityData.impactImportance as keyof typeof impactMapping] || 3;
  }
  
  console.log("Mapped answers for API:", apiAnswers);
  return apiAnswers;
};
