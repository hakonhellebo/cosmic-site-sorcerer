
// Calculate dimension scores for university students based on questionnaire answers

export const calculateUniversityDimensions = (universityData: any) => {
  const scores = {
    teknologi: 0,
    analytisk: 0,
    kreativitet: 0,
    struktur: 0,
    ambisjon: 0,
    sosialitet: 0,
    helseinteresse: 0,
    bærekraft: 0,
    praktisk: 0,
    selvstendighet: 0
  };

  // Process interests (properly handling boolean values)
  if (universityData.interests) {
    if (universityData.interests.teknologi === true) scores.teknologi += 3;
    if (universityData.interests.okonomi === true) scores.analytisk += 3;
    if (universityData.interests.samfunnsvitenskap === true) scores.bærekraft += 2;
    if (universityData.interests.humaniora === true) scores.kreativitet += 2;
    if (universityData.interests.naturvitenskap === true) scores.analytisk += 2;
    if (universityData.interests.helse === true) scores.helseinteresse += 3;
    if (universityData.interests.kunst === true) scores.kreativitet += 3;
    if (universityData.interests.ingenior === true) {
      scores.teknologi += 2;
      scores.analytisk += 1;
    }
    if (universityData.interests.larer === true) scores.sosialitet += 3;
    if (universityData.interests.jus === true) scores.struktur += 3;
  }

  // Process strengths (properly handling boolean values)
  if (universityData.strengths) {
    if (universityData.strengths.kritisk_tenkning === true) scores.analytisk += 2;
    if (universityData.strengths.problemlosning === true) scores.analytisk += 2;
    if (universityData.strengths.kreativitet === true) scores.kreativitet += 2;
    if (universityData.strengths.kommunikasjon === true) scores.sosialitet += 2;
    if (universityData.strengths.selvledelse === true) scores.selvstendighet += 2;
    if (universityData.strengths.prosjektstyring === true) scores.struktur += 2;
    if (universityData.strengths.teknologiforstaaelse === true) scores.teknologi += 2;
    if (universityData.strengths.empati === true) scores.sosialitet += 2;
  }

  // Learning style
  if (universityData.learningStyle) {
    if (universityData.learningStyle.lesing === true) scores.analytisk += 2;
    if (universityData.learningStyle.lytting === true) scores.sosialitet += 1;
    if (universityData.learningStyle.praksis === true) scores.praktisk += 3;
    if (universityData.learningStyle.diskusjon === true) scores.sosialitet += 2;
    if (universityData.learningStyle.video === true) scores.teknologi += 1;
  }

  // Collaboration style
  if (universityData.collaboration === 'independent') scores.selvstendighet += 3;
  else if (universityData.collaboration === 'team') scores.sosialitet += 3;
  else if (universityData.collaboration === 'daily') scores.sosialitet += 2;
  else if (universityData.collaboration === 'weekly') scores.selvstendighet += 1;

  // AI comfort level
  if (universityData.aiUsage === 'daily') scores.teknologi += 3;
  else if (universityData.aiUsage === 'weekly') scores.teknologi += 2;
  else if (universityData.aiUsage === 'monthly') scores.teknologi += 1;

  // Internship experience
  if (universityData.internship === 'yes') scores.praktisk += 2;
  
  if (universityData.internshipValue === 'very-useful') scores.praktisk += 3;
  else if (universityData.internshipValue === 'somewhat-useful') scores.praktisk += 2;

  // Study reason
  if (universityData.studyReason === 'job-security') scores.ambisjon += 2;
  else if (universityData.studyReason === 'salary') scores.ambisjon += 3;
  else if (universityData.studyReason === 'impact') scores.bærekraft += 3;
  else if (universityData.studyReason === 'interest') scores.kreativitet += 3;

  // Salary importance
  if (universityData.salaryImportance === 'very') scores.ambisjon += 3;
  else if (universityData.salaryImportance === 'somewhat') scores.ambisjon += 2;

  // Impact importance
  if (universityData.impactImportance === 'very') scores.bærekraft += 3;
  else if (universityData.impactImportance === 'somewhat') scores.bærekraft += 2;

  // Job priorities
  if (universityData.jobPriorities) {
    if (universityData.jobPriorities.fleksibilitet === true) scores.selvstendighet += 2;
    if (universityData.jobPriorities.hoy_lonn === true) scores.ambisjon += 2;
    if (universityData.jobPriorities.stabilitet === true) scores.struktur += 2;
    if (universityData.jobPriorities.karrieremuligheter === true) scores.ambisjon += 2;
    if (universityData.jobPriorities.mening === true) scores.bærekraft += 2;
    if (universityData.jobPriorities.innovasjon === true) scores.kreativitet += 2;
  }

  // Job challenges
  if (universityData.jobChallenges) {
    if (universityData.jobChallenges.konkurranse === true) scores.ambisjon += 2;
    if (universityData.jobChallenges.manglende_erfaring === true) scores.praktisk += 1;
    if (universityData.jobChallenges.hoye_krav === true) scores.struktur += 1;
    if (universityData.jobChallenges.usikker_jobbvalg === true) scores.struktur += 1;
  }

  // International importance
  if (universityData.internationalImportance === 'very') scores.selvstendighet += 3;
  else if (universityData.internationalImportance === 'somewhat') scores.selvstendighet += 2;
  else if (universityData.internationalImportance === 'not-really') scores.struktur += 1;

  // Entrepreneurship
  if (universityData.entrepreneurship === 'yes') scores.selvstendighet += 3;
  else if (universityData.entrepreneurship === 'maybe') scores.selvstendighet += 2;
  else if (universityData.entrepreneurship === 'no') scores.struktur += 1;

  // Future role
  if (universityData.futureRole === 'leader') scores.ambisjon += 3;
  else if (universityData.futureRole === 'specialist') scores.analytisk += 3;
  else if (universityData.futureRole === 'entrepreneur') scores.selvstendighet += 3;

  // Employer factors
  if (universityData.futureEmployerFactors) {
    if (universityData.futureEmployerFactors.hoy_lonn === true) scores.ambisjon += 2;
    if (universityData.futureEmployerFactors.godt_arbeidsmiljo === true) scores.sosialitet += 2;
    if (universityData.futureEmployerFactors.karriereutvikling === true) scores.ambisjon += 2;
    if (universityData.futureEmployerFactors.stabilitet === true) scores.struktur += 2;
    if (universityData.futureEmployerFactors.innovasjon === true) scores.kreativitet += 2;
  }

  // Preferred company
  if (universityData.preferredCompanyType === 'startup') scores.selvstendighet += 3;
  else if (universityData.preferredCompanyType === 'small-medium') scores.sosialitet += 2;
  else if (universityData.preferredCompanyType === 'large') scores.struktur += 2;
  else if (universityData.preferredCompanyType === 'public') scores.struktur += 2;
  else if (universityData.preferredCompanyType === 'nonprofit') scores.bærekraft += 2;

  // Technology importance
  if (universityData.technologyImportance === 'very') scores.teknologi += 3;
  else if (universityData.technologyImportance === 'somewhat') scores.teknologi += 2;

  // Work-life balance
  if (universityData.workLifeBalance === 'work') scores.ambisjon += 3;
  else if (universityData.workLifeBalance === 'balance') scores.struktur += 2;
  else if (universityData.workLifeBalance === 'life') scores.selvstendighet += 2;

  // Remote work importance
  if (universityData.remoteWorkImportance === 'very') scores.selvstendighet += 3;
  else if (universityData.remoteWorkImportance === 'somewhat') scores.selvstendighet += 2;
  else if (universityData.remoteWorkImportance === 'not-really') scores.struktur += 1;

  // Travel importance
  if (universityData.travelImportance === 'very') scores.selvstendighet += 3;
  else if (universityData.travelImportance === 'somewhat') scores.selvstendighet += 2;
  else if (universityData.travelImportance === 'not-really') scores.struktur += 1;

  // Satisfaction factors
  if (universityData.satisfactionFactors) {
    if (universityData.satisfactionFactors.meningsfylt === true) scores.bærekraft += 2;
    if (universityData.satisfactionFactors.hoy_lonn === true) scores.ambisjon += 2;
    if (universityData.satisfactionFactors.karriereutvikling === true) scores.ambisjon += 2;
    if (universityData.satisfactionFactors.fleksibilitet === true) scores.selvstendighet += 2;
    if (universityData.satisfactionFactors.innovasjon === true) scores.kreativitet += 2;
    if (universityData.satisfactionFactors.stabilitet === true) scores.struktur += 2;
  }

  // Preferred work environment
  if (universityData.preferredWorkEnvironment === 'structured') scores.struktur += 3;
  else if (universityData.preferredWorkEnvironment === 'creative') scores.kreativitet += 3;
  else if (universityData.preferredWorkEnvironment === 'social') scores.sosialitet += 3;
  else if (universityData.preferredWorkEnvironment === 'flexible') scores.selvstendighet += 3;

  // People vs tech
  if (universityData.peopleTech === 'people') scores.sosialitet += 3;
  else if (universityData.peopleTech === 'tech') scores.teknologi += 3;
  else if (universityData.peopleTech === 'both') scores.sosialitet += 1.5;

  // Project preference
  if (universityData.projectPreference === 'short') scores.praktisk += 2;
  else if (universityData.projectPreference === 'long') scores.struktur += 2;
  else if (universityData.projectPreference === 'mixed') scores.struktur += 1;

  // Study choice reason
  if (universityData.studyChoiceReason === 'interesse') scores.kreativitet += 2;
  else if (universityData.studyChoiceReason === 'lonn') scores.ambisjon += 3;
  else if (universityData.studyChoiceReason === 'prestisje') scores.ambisjon += 2;
  else if (universityData.studyChoiceReason === 'familie') scores.sosialitet += 2;
  else if (universityData.studyChoiceReason === 'trygt') scores.struktur += 2;

  // Study missing
  if (universityData.studyMissing) {
    if (universityData.studyMissing.praktisk_erfaring === true) scores.praktisk += 2;
    if (universityData.studyMissing.relevante_fag === true) scores.analytisk += 2;
    if (universityData.studyMissing.veiledning === true) scores.sosialitet += 2;
    if (universityData.studyMissing.nettverk === true) scores.sosialitet += 2;
    if (universityData.studyMissing.fleksibilitet === true) scores.selvstendighet += 2;
    if (universityData.studyMissing.kobling === true) scores.struktur += 2;
  }

  // Current grades
  if (universityData.currentGrades === 'high') scores.ambisjon += 3;
  else if (universityData.currentGrades === 'good') scores.ambisjon += 2;
  else if (universityData.currentGrades === 'average') scores.ambisjon += 1;

  // Best subjects
  if (universityData.bestSubjects) {
    if (universityData.bestSubjects.teknologi === true) scores.teknologi += 2;
    if (universityData.bestSubjects.okonomi === true) scores.analytisk += 2;
    if (universityData.bestSubjects.samfunnsvitenskap === true) scores.bærekraft += 2;
    if (universityData.bestSubjects.humaniora === true) scores.kreativitet += 2;
    if (universityData.bestSubjects.naturvitenskap === true) scores.analytisk += 2;
    if (universityData.bestSubjects.helse === true) scores.helseinteresse += 2;
    if (universityData.bestSubjects.kunst === true) scores.kreativitet += 2;
    if (universityData.bestSubjects.ingenior === true) scores.teknologi += 2;
    if (universityData.bestSubjects.larer === true) scores.sosialitet += 2;
    if (universityData.bestSubjects.jus === true) scores.struktur += 2;
  }

  // Work experience (hadJob - yes/no)
  if (universityData.hadJob === 'yes') scores.praktisk += 2;

  // Ensure minimum scores of 1 for all dimensions
  Object.keys(scores).forEach(key => {
    scores[key as keyof typeof scores] = Math.max(1, scores[key as keyof typeof scores]);
  });

  return scores;
};

// Get top dimensions sorted by score
export const getTopDimensions = (dimensionScores: Record<string, number>, count = 3) => {
  return Object.entries(dimensionScores)
    .map(([name, score]) => ({ name, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
};
