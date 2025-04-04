
// Utilities for formatting high school data

export const formatInterests = (interests: Record<string, boolean> | undefined): string => {
  if (!interests) return "Ingen valgt";
  
  const mappedInterests = Object.keys(interests)
    .filter(key => interests[key] === true)
    .map(interest => {
      switch(interest) {
        case 'technology': return 'Teknologi';
        case 'artDesign': return 'Kunst og design';
        case 'sports': return 'Sport';
        case 'economyFinance': return 'Økonomi og finans';
        case 'travelCulture': return 'Reise og kultur';
        case 'healthCare': return 'Helse og omsorg';
        case 'environmentSustainability': return 'Miljø og bærekraft';
        case 'teknologi': return 'Teknologi';
        case 'realfag': return 'Realfag';
        case 'samfunnsfag': return 'Samfunnsfag';
        case 'kreativitet': return 'Kreativitet';
        case 'entrepenørskap': return 'Entrepenørskap';
        case 'helse': return 'Helse';
        case 'språk': return 'Språk';
        case 'idrett': return 'Idrett';
        case 'okonomi': return 'Økonomi';
        case 'reise': return 'Reise';
        case 'miljø': return 'Miljø';
        default: return interest;
      }
    });
  
  return mappedInterests.length > 0 ? mappedInterests.join(', ') : "Ingen valgt";
};

export const formatCourses = (
  courses: Record<string, boolean> | undefined, 
  otherText?: string
): string => {
  if (!courses) return "Ingen valgt";
  
  const mappedCourses = Object.keys(courses)
    .filter(key => courses[key] === true)
    .map(course => {
      switch(course) {
        case 'mathematics': return 'Matematikk';
        case 'norwegian': return 'Norsk';
        case 'english': return 'Engelsk';
        case 'socialStudies': return 'Samfunnsfag';
        case 'science': return 'Naturfag';
        case 'physEd': return 'Gym';
        case 'artsCrafts': return 'Kunst og håndverk';
        case 'foreignLanguage': return 'Fremmedspråk';
        case 'matematikk': return 'Matematikk';
        case 'norsk': return 'Norsk';
        case 'engelsk': return 'Engelsk';
        case 'naturfag': return 'Naturfag';
        case 'samfunnsfag': return 'Samfunnsfag';
        case 'historie': return 'Historie';
        case 'geografi': return 'Geografi';
        case 'kroppsøving': return 'Kroppsøving';
        case 'teknologi': return 'Teknologi';
        case 'kunst': return 'Kunst';
        case 'other': return otherText || 'Annet';
        default: return course;
      }
    });
  
  return mappedCourses.length > 0 ? mappedCourses.join(', ') : "Ingen valgt";
};

export const formatLearningStyle = (learningStyle: Record<string, boolean> | string | undefined): string => {
  if (!learningStyle) return "Ikke spesifisert";
  
  // If learningStyle is already a string, return it
  if (typeof learningStyle === 'string') return learningStyle;
  
  const mappedStyles = Object.keys(learningStyle)
    .filter(key => learningStyle[key] === true)
    .map(style => {
      switch(style) {
        case 'reading': return 'Lesing';
        case 'listening': return 'Lytting';
        case 'practical': return 'Praktisk';
        case 'discussing': return 'Diskusjon';
        case 'watching': return 'Observasjon';
        case 'unknown': return 'Vet ikke';
        case 'visual': return 'Visuell';
        case 'auditory': return 'Auditiv';
        case 'writing': return 'Skriftlig';
        default: return style;
      }
    });
  
  return mappedStyles.length > 0 ? mappedStyles.join(', ') : "Ikke spesifisert";
};

export const formatWorkPreference = (workPreference: string | undefined): string => {
  if (!workPreference) return "Ikke spesifisert";
  
  switch(workPreference) {
    case 'alone': return 'Jobbe alene';
    case 'team': return 'Jobbe i team';
    case 'individual': return 'Jobbe alene';
    case 'mixed': return 'Kombinasjon av alene og i team';
    default: return workPreference || 'Kombinasjon av alene og i team';
  }
};

export const formatStudyDirection = (studyDirection: string | undefined): string => {
  if (!studyDirection) return "Ikke spesifisert";
  
  switch(studyDirection) {
    case 'general-studies': return 'Studiespesialisering';
    case 'vocational': return 'Yrkesfag';
    case 'studiespesialisering': return 'Studiespesialisering';
    case 'idrettsfag': return 'Idrettsfag';
    case 'musikk_dans_drama': return 'Musikk, dans og drama';
    case 'kunst_design': return 'Kunst og design';
    case 'medier_kommunikasjon': return 'Medier og kommunikasjon';
    case 'helse_oppvekst': return 'Helse og oppvekst';
    case 'teknologi_industri': return 'Teknologi og industri';
    case 'elektro_datateknologi': return 'Elektro og datateknologi';
    case 'bygg_anlegg': return 'Bygg og anlegg';
    case 'restaurant_matfag': return 'Restaurant og matfag';
    default: return studyDirection;
  }
};

export const formatGrade = (grade: string | undefined): string => {
  if (!grade) return "Ikke spesifisert";
  
  switch(grade) {
    case 'vg1': return 'VG1';
    case 'vg2': return 'VG2';
    case 'vg3': return 'VG3';
    default: return grade;
  }
};
