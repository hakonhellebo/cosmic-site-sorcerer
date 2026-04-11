
import type { EdPathMappedAnswers } from '@/services/edpathApi.types';

export const mapUniversityAnswersToApi = (universityData: any): EdPathMappedAnswers => {
  console.log("Mapping university data to API format:", universityData);
  
  const apiAnswers: EdPathMappedAnswers = {};

  // Spm 1 - User type
  apiAnswers['Spm 1'] = 'Student';

  // Spm 6 - Interests (multi-select → array)
  const selectedInterests: string[] = [];
  if (universityData.interests) {
    const interestMap: Record<string, string> = {
      teknologi: 'Teknologi',
      økonomi: 'Økonomi og finans',
      samfunnsvitenskap: 'Samfunnsvitenskap',
      humaniora: 'Humaniora',
      naturvitenskap: 'Naturvitenskap',
      helse: 'Helse og psykologi',
      kunst_og_design: 'Kunst og design',
      ingeniørfag: 'Ingeniørfag',
      lærerutdanning: 'Lærerutdanning',
      jus: 'Jus og rettvitenskap',
    };
    for (const [key, label] of Object.entries(interestMap)) {
      if (universityData.interests[key]) selectedInterests.push(label);
    }
  }
  if (selectedInterests.length > 0) apiAnswers['Spm 6'] = selectedInterests;

  // Spm 7 - Strengths (multi-select → array)
  const selectedStrengths: string[] = [];
  if (universityData.strengths) {
    const strengthMap: Record<string, string> = {
      kritisk_tenkning: 'Kritisk tenkning',
      problemløsning: 'Analytisk problemløsning',
      kreativitet: 'Kreativ problemløsning',
      kommunikasjon: 'Empati og kommunikasjon',
      selvledelse: 'Selvledelse',
      prosjektstyring: 'Prosjektstyring',
      teknologiforståelse: 'Teknologisk forståelse',
      empati: 'Menneskeforståelse',
    };
    for (const [key, label] of Object.entries(strengthMap)) {
      if (universityData.strengths[key]) selectedStrengths.push(label);
    }
  }
  if (selectedStrengths.length > 0) apiAnswers['Spm 7'] = selectedStrengths;

  // Spm 8 - Task preferences (multi-select → array)
  const selectedTasks: string[] = [];
  if (universityData.taskPreferences) {
    const taskMap: Record<string, string> = {
      analytical: 'Analytiske oppgaver',
      creative: 'Kreative oppgaver',
      practical: 'Praktiske oppgaver',
      leadership: 'Å lede eller organisere',
      helping: 'Å veilede eller hjelpe andre',
    };
    for (const [key, label] of Object.entries(taskMap)) {
      if (universityData.taskPreferences[key]) selectedTasks.push(label);
    }
  }
  if (selectedTasks.length > 0) apiAnswers['Spm 8'] = selectedTasks;

  // Spm 9 - Work preference (single value)
  if (universityData.workPreference) {
    const workMap: Record<string, number> = {
      alone: 3,
      team: 3,
      both: 2,
    };
    apiAnswers['Spm 9'] = workMap[universityData.workPreference] ?? 2;
  }

  // Spm 10 - AI/Technology comfort
  if (universityData.aiUsage) {
    const aiMap: Record<string, number> = { daily: 3, weekly: 2, monthly: 1, rarely: 0.5, never: 0 };
    apiAnswers['Spm 10'] = aiMap[universityData.aiUsage] ?? 1;
  }

  // Spm 11 - AI usage frequency
  if (universityData.aiUsage) {
    const aiFreqMap: Record<string, number> = { daily: 3, weekly: 2, monthly: 1, rarely: 0.5, never: 0 };
    apiAnswers['Spm 11'] = aiFreqMap[universityData.aiUsage] ?? 0;
  }

  // Spm 12 - Internship experience
  if (universityData.internship) {
    apiAnswers['Spm 12'] = universityData.internship === 'yes' ? 2 : 0;
  }

  // Spm 13 - Internship value
  if (universityData.internshipValue) {
    const internMap: Record<string, number> = { very: 3, somewhat: 2, 'not-really': 1, 'not-at-all': 0 };
    apiAnswers['Spm 13'] = internMap[universityData.internshipValue] ?? 0;
  }

  // Spm 14 - Study reason
  if (universityData.studyReason) {
    const reasonMap: Record<string, number> = {
      'secure-job': 2, 'good-salary': 3, 'make-difference': 3, 'follow-passion': 3, 'not-sure': 1,
    };
    apiAnswers['Spm 14'] = reasonMap[universityData.studyReason] ?? 1;
  }

  // Spm 15 - Salary importance
  if (universityData.salaryImportance) {
    const salaryMap: Record<string, number> = {
      'very-important': 3, important: 2, 'somewhat-important': 1, 'not-important': 0,
    };
    apiAnswers['Spm 15'] = salaryMap[universityData.salaryImportance] ?? 1;
  }

  // Spm 16 - Impact importance
  if (universityData.impactImportance) {
    const impactMap: Record<string, number> = {
      'very-important': 3, important: 2, 'somewhat-important': 1, 'not-important': 0,
    };
    apiAnswers['Spm 16'] = impactMap[universityData.impactImportance] ?? 1;
  }

  console.log("Mapped student answers for API:", apiAnswers);
  return apiAnswers;
};
