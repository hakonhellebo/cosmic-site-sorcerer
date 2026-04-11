
import type { EdPathMappedAnswers } from '@/services/edpathApi.types';

export const mapHighSchoolAnswersToApi = (highSchoolData: any): EdPathMappedAnswers => {
  console.log("Mapping high school data to API format:", highSchoolData);
  
  const apiAnswers: EdPathMappedAnswers = {};

  // Spm 1 - User type
  apiAnswers['Spm 1'] = 'VGS';

  // Spm 6 - Interests (multi-select → array)
  const selectedInterests: string[] = [];
  if (highSchoolData.interests) {
    const interestMap: Record<string, string> = {
      naturvitenskap: 'Naturvitenskap',
      teknologi: 'Teknologi',
      helse: 'Helse',
      økonomi: 'Økonomi og finans',
      kreativitet: 'Kunst og design',
      idrett: 'Idrett',
      miljo: 'Miljø og bærekraft',
      samfunn: 'Samfunn og politikk',
    };
    for (const [key, label] of Object.entries(interestMap)) {
      if (highSchoolData.interests[key]) selectedInterests.push(label);
    }
  }
  if (selectedInterests.length > 0) apiAnswers['Spm 6'] = selectedInterests;

  // Spm 7 - Strengths (multi-select → array)
  const selectedStrengths: string[] = [];
  if (highSchoolData.strengths) {
    const strengthMap: Record<string, string> = {
      analytisk: 'Analytisk tenkning',
      kreativ: 'Kreativ problemløsning',
      samarbeidsvillig: 'Samarbeid',
      kommunikativ: 'Kommunikasjon',
      lederskap: 'Lederskap',
      problemlosning: 'Problemløsning',
      teknisk: 'Teknisk forståelse',
    };
    for (const [key, label] of Object.entries(strengthMap)) {
      if (highSchoolData.strengths[key]) selectedStrengths.push(label);
    }
  }
  if (selectedStrengths.length > 0) apiAnswers['Spm 7'] = selectedStrengths;

  // Spm 8 - Favorite subjects (multi-select → array)
  const selectedSubjects: string[] = [];
  if (highSchoolData.favoriteSubjects) {
    const subjectMap: Record<string, string> = {
      matematikk: 'Matematikk',
      fysikk: 'Fysikk',
      kjemi: 'Kjemi',
      norsk: 'Norsk',
      engelsk: 'Engelsk',
      samfunnsfag: 'Samfunnsfag',
      naturfag: 'Naturfag',
    };
    for (const [key, label] of Object.entries(subjectMap)) {
      if (highSchoolData.favoriteSubjects[key]) selectedSubjects.push(label);
    }
  }
  if (selectedSubjects.length > 0) apiAnswers['Spm 8'] = selectedSubjects;

  // Spm 9 - Work preference (default)
  apiAnswers['Spm 9'] = 2;

  // Spm 10 - Technology comfort (default moderate)
  apiAnswers['Spm 10'] = 2;

  // Spm 11 - AI usage (default moderate)
  apiAnswers['Spm 11'] = 2;

  // Spm 12 - Certainty level
  if (highSchoolData.certaintylevel) {
    const certaintyMap: Record<string, number> = {
      'very-certain': 3,
      'somewhat-certain': 2,
      'not-very-certain': 1,
      uncertain: 0,
    };
    apiAnswers['Spm 12'] = certaintyMap[highSchoolData.certaintylevel] ?? 1;
  }

  // Spm 13 - Future education
  if (highSchoolData.futureEducation) {
    const educationMap: Record<string, number> = {
      university: 3,
      vocational: 2,
      work: 1,
    };
    apiAnswers['Spm 13'] = educationMap[highSchoolData.futureEducation] ?? 1;
  }

  console.log("Mapped elev answers for API:", apiAnswers);
  return apiAnswers;
};
