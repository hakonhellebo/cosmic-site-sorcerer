
// Utilities for formatting high school data

export const formatInterests = (interests: Record<string, boolean> | undefined): string => {
  if (!interests) return "Ingen valgt";
  
  return Object.keys(interests)
    .filter(key => interests[key] === true)
    .map(interest => 
      interest === 'technology' ? 'Teknologi' :
      interest === 'artDesign' ? 'Kunst og design' :
      interest === 'sports' ? 'Sport' :
      interest === 'economyFinance' ? 'Økonomi og finans' :
      interest === 'travelCulture' ? 'Reise og kultur' :
      interest === 'healthCare' ? 'Helse og omsorg' :
      interest === 'environmentSustainability' ? 'Miljø og bærekraft' :
      interest
    ).join(', ') || "Ingen valgt";
};

export const formatCourses = (
  courses: Record<string, boolean> | undefined, 
  otherText?: string
): string => {
  if (!courses) return "Ingen valgt";
  
  return Object.keys(courses)
    .filter(key => courses[key] === true)
    .map(course => 
      course === 'mathematics' ? 'Matematikk' :
      course === 'norwegian' ? 'Norsk' :
      course === 'english' ? 'Engelsk' :
      course === 'socialStudies' ? 'Samfunnsfag' :
      course === 'science' ? 'Naturfag' :
      course === 'physEd' ? 'Gym' :
      course === 'artsCrafts' ? 'Kunst og håndverk' :
      course === 'foreignLanguage' ? 'Fremmedspråk' :
      course === 'other' ? otherText || 'Annet' : course
    ).join(', ') || "Ingen valgt";
};

export const formatLearningStyle = (learningStyle: Record<string, boolean> | undefined): string => {
  if (!learningStyle) return "Ikke spesifisert";
  
  return Object.keys(learningStyle)
    .filter(key => learningStyle[key] === true)
    .map(style => 
      style === 'reading' ? 'Lesing' :
      style === 'listening' ? 'Lytting' :
      style === 'practical' ? 'Praktisk' :
      style === 'discussing' ? 'Diskusjon' :
      style === 'watching' ? 'Observasjon' :
      style === 'unknown' ? 'Vet ikke' :
      style
    ).join(', ') || "Ikke spesifisert";
};

export const formatWorkPreference = (workPreference: string | undefined): string => {
  if (!workPreference) return "Ikke spesifisert";
  
  return workPreference === 'alone' ? 'Jobbe alene' : 
         workPreference === 'team' ? 'Jobbe i team' : 
         'Kombinasjon av alene og i team';
};

export const formatStudyDirection = (studyDirection: string | undefined): string => {
  if (!studyDirection) return "Ikke spesifisert";
  
  return studyDirection === 'general-studies' ? 'Studiespesialisering' :
         studyDirection === 'vocational' ? 'Yrkesfag' : 
         'Ikke spesifisert';
};

export const formatGrade = (grade: string | undefined): string => {
  if (!grade) return "Ikke spesifisert";
  
  return grade === 'vg1' ? 'VG1' : 
         grade === 'vg2' ? 'VG2' : 
         grade === 'vg3' ? 'VG3' : 
         'Ikke spesifisert';
};
