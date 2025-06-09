
interface Education {
  Lærestednavn: string;
  Studiekode: string;
  Studienavn: string;
  'Utdanningsområde- og type': string;
  Studiested: string;
  'Measure Names': string;
  'Measure Values': string;
  Sektor: string;
  undersektor: string;
}

export interface ProcessedEducation {
  university: string;
  programCode: string;
  programName: string;
  educationType: string;
  location: string;
  sector: string;
  undersektor: string;
  avgGrade?: number;
  applicants?: number;
  spots?: number;
  competitiveness?: number;
}

export const processEducationsData = (educations: Education[], sector: string): ProcessedEducation[] => {
  // Filter educations by matching sector or undersektor
  const relevant = educations.filter(education => 
    education.Sektor?.toLowerCase() === sector?.toLowerCase() ||
    education.undersektor?.toLowerCase() === sector?.toLowerCase()
  );

  // Group by program and aggregate data
  const programsMap = new Map<string, ProcessedEducation>();
  
  relevant.forEach(education => {
    const key = `${education.Lærestednavn}-${education.Studiekode}`;
    
    if (!programsMap.has(key)) {
      programsMap.set(key, {
        university: education.Lærestednavn,
        programCode: education.Studiekode,
        programName: education.Studienavn,
        educationType: education['Utdanningsområde- og type'],
        location: education.Studiested,
        sector: education.Sektor,
        undersektor: education.undersektor
      });
    }
    
    const program = programsMap.get(key)!;
    const measureName = education['Measure Names'];
    const measureValue = parseFloat(education['Measure Values']) || 0;
    
    if (measureName === 'Snitt' && measureValue > 0) {
      program.avgGrade = measureValue;
    } else if (measureName === 'Søkere' && measureValue > 0) {
      program.applicants = measureValue;
    } else if (measureName === 'Planlagte studieplasser' && measureValue > 0) {
      program.spots = measureValue;
    }
  });

  // Calculate competitiveness and convert to array
  const programsArray = Array.from(programsMap.values()).map(program => {
    if (program.applicants && program.spots && program.spots > 0) {
      program.competitiveness = program.applicants / program.spots;
    }
    return program;
  });

  // Sort by competitiveness (most competitive first) and limit
  return programsArray
    .sort((a, b) => (b.competitiveness || 0) - (a.competitiveness || 0))
    .slice(0, 24); // Limit for performance
};
