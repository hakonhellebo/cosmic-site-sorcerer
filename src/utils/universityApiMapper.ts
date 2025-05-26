
export const mapUniversityAnswersToApi = (universityData: any): Record<string, number> => {
  console.log("Mapping university data to API format:", universityData);
  
  const apiAnswers: Record<string, number> = {};
  
  // Question 6 - Interests (Hvilke fagfelt interesserer deg mest?)
  if (universityData.interests) {
    if (universityData.interests.teknologi) apiAnswers['6'] = 3; // Teknologi
    if (universityData.interests.økonomi) apiAnswers['6'] = 3; // Økonomi  
    if (universityData.interests.samfunnsvitenskap) apiAnswers['6'] = 2; // Samfunnsvitenskap
    if (universityData.interests.humaniora) apiAnswers['6'] = 2; // Humaniora
    if (universityData.interests.naturvitenskap) apiAnswers['6'] = 3; // Naturvitenskap (mapping to closest)
    if (universityData.interests.helse) apiAnswers['6'] = 3; // Helse og psykologi
    if (universityData.interests.kunst_og_design) apiAnswers['6'] = 3; // Kunst og design
    if (universityData.interests.ingeniørfag) apiAnswers['6'] = 3; // Teknologi related
    if (universityData.interests.lærerutdanning) apiAnswers['6'] = 2; // Education related
    if (universityData.interests.jus) apiAnswers['6'] = 2; // Law related
  }
  
  // Question 7 - Strengths (Hvilke ferdigheter føler du at du har styrke i?)
  if (universityData.strengths) {
    if (universityData.strengths.kritisk_tenkning) apiAnswers['7'] = 2; // Kritisk tenkning
    if (universityData.strengths.problemløsning) apiAnswers['7'] = 2; // Maps to analytical
    if (universityData.strengths.kreativitet) apiAnswers['7'] = 2; // Kreativ problemløsning
    if (universityData.strengths.kommunikasjon) apiAnswers['7'] = 2; // Empati og kommunikasjon
    if (universityData.strengths.selvledelse) apiAnswers['7'] = 2; // Maps to independence
    if (universityData.strengths.prosjektstyring) apiAnswers['7'] = 2; // Prosjektstyring
    if (universityData.strengths.teknologiforståelse) apiAnswers['7'] = 2; // Teknologisk forståelse
    if (universityData.strengths.empati) apiAnswers['7'] = 2; // Menneskeforståelse
  }
  
  // Question 8 - Preferred tasks (Hvilke type oppgaver liker du best?)
  // This maps to the task preferences in the questionnaire
  if (universityData.taskPreferences) {
    if (universityData.taskPreferences.analytical) apiAnswers['8'] = 3; // Analytiske oppgaver
    if (universityData.taskPreferences.creative) apiAnswers['8'] = 3; // Kreative oppgaver
    if (universityData.taskPreferences.practical) apiAnswers['8'] = 3; // Praktiske oppgaver
    if (universityData.taskPreferences.leadership) apiAnswers['8'] = 2; // Å lede eller organisere
    if (universityData.taskPreferences.helping) apiAnswers['8'] = 2; // Å veilede eller hjelpe andre
  }
  
  // Question 9 - Work preference (team vs solo)
  if (universityData.workPreference) {
    if (universityData.workPreference === 'alone') apiAnswers['9'] = 3; // Jobbe selvstendig
    if (universityData.workPreference === 'team') apiAnswers['9'] = 3; // Jobbe i team
    if (universityData.workPreference === 'both') apiAnswers['9'] = 2; // Litt av begge
  }
  
  // Question 10 - AI/Technology comfort
  if (universityData.aiUsage) {
    const aiMapping = {
      'daily': 3,        // Veldig komfortabel
      'weekly': 2,       // Ganske komfortabel  
      'monthly': 1,      // Litt komfortabel
      'rarely': 0.5,     // Sjeldnere enn månedlig
      'never': 0         // Ikke komfortabel i det hele tatt
    };
    apiAnswers['10'] = aiMapping[universityData.aiUsage as keyof typeof aiMapping] || 1;
  }
  
  // Question 11 - AI usage frequency (maps to same as question 10 in this context)
  if (universityData.aiUsage) {
    const aiFrequencyMapping = {
      'daily': 3,
      'weekly': 2,
      'monthly': 1,
      'rarely': 0.5,
      'never': 0
    };
    apiAnswers['11'] = aiFrequencyMapping[universityData.aiUsage as keyof typeof aiFrequencyMapping] || 0;
  }
  
  // Question 12 - Internship experience
  if (universityData.internship) {
    apiAnswers['12'] = universityData.internship === 'yes' ? 2 : 0;
  }
  
  // Question 13 - Internship value
  if (universityData.internshipValue) {
    const internshipMapping = {
      'very': 3,           // Veldig nyttig
      'somewhat': 2,       // Litt nyttig
      'not-really': 1,     // Ikke særlig nyttig
      'not-at-all': 0      // Ikke nyttig i det hele tatt
    };
    apiAnswers['13'] = internshipMapping[universityData.internshipValue as keyof typeof internshipMapping] || 0;
  }
  
  // Question 14 - Study reason
  if (universityData.studyReason) {
    const studyReasonMapping = {
      'secure-job': 2,        // For å få en sikker jobb
      'good-salary': 3,       // For å tjene godt
      'make-difference': 3,   // For å gjøre en forskjell
      'follow-passion': 3,    // For å følge lidenskapen min
      'not-sure': 1          // Jeg vet ikke ennå
    };
    apiAnswers['14'] = studyReasonMapping[universityData.studyReason as keyof typeof studyReasonMapping] || 1;
  }
  
  // Question 15 - Salary importance
  if (universityData.salaryImportance) {
    const salaryMapping = {
      'very-important': 3,      // Veldig viktig
      'important': 2,           // Litt viktig
      'somewhat-important': 1,  // Ikke så viktig
      'not-important': 0        // Ikke viktig i det hele tatt
    };
    apiAnswers['15'] = salaryMapping[universityData.salaryImportance as keyof typeof salaryMapping] || 1;
  }
  
  // Question 16 - Impact importance  
  if (universityData.impactImportance) {
    const impactMapping = {
      'very-important': 3,      // Veldig viktig
      'important': 2,           // Litt viktig
      'somewhat-important': 1,  // Ikke så viktig
      'not-important': 0        // Ikke viktig i det hele tatt
    };
    apiAnswers['16'] = impactMapping[universityData.impactImportance as keyof typeof impactMapping] || 1;
  }
  
  // Add more mappings for other questions as needed...
  // Questions 17-51 can be added based on the actual form fields
  
  console.log("Mapped answers for API:", apiAnswers);
  return apiAnswers;
};
