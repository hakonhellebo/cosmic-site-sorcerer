
export const processUniversityData = (
  allStudentData: any[],
  selectedUniversity: string,
  programSearchTerm: string
) => {
  if (allStudentData.length === 0) return [];
  
  // Filter data for selected university
  const universityData = selectedUniversity === "alle" 
    ? allStudentData 
    : allStudentData.filter(item => item.Lærestednavn === selectedUniversity);
  
  // Filter by search term if provided
  const filteredData = programSearchTerm.trim() === ""
    ? universityData 
    : universityData.filter(item => 
        item.Studienavn?.toLowerCase().includes(programSearchTerm.toLowerCase())
      );
  
  // Group by study program and aggregate the measures
  const programMap = new Map();
  
  filteredData.forEach(row => {
    const studienavn = row.Studienavn;
    const studiested = row.Studiested;
    const laerestednavn = row.Lærestednavn;
    const measureName = row['Measure Names'];
    const measureValue = row['Measure Values'];
    
    if (!studienavn || !measureName || !measureValue) return;
    
    const key = `${studienavn}-${studiested}-${laerestednavn}`;
    
    if (!programMap.has(key)) {
      programMap.set(key, {
        linje: studienavn,
        studiekode: row.Studiekode || 'N/A',
        studiested: studiested,
        universitet: laerestednavn,
        measures: {}
      });
    }
    
    const program = programMap.get(key);
    program.measures[measureName] = parseFloat(measureValue) || 0;
  });
  
  // Convert to array and add computed fields
  const processedData = Array.from(programMap.values()).map(program => ({
    ...program,
    snitt: program.measures['Snitt'] || 0,
    planlagteStudieplasser: program.measures['Planlagte studieplasser'] || 0,
    sokereMott: program.measures['Søkere møtt'] || 0,
    sokereTilbud: program.measures['Søkere tilbud'] || 0,
    sokereTilbudJaSvar: program.measures['Søkere tilbud ja-svar'] || 0,
    sokereKvalifisert: program.measures['Søkere kvalifisert'] || 0,
    sokere: program.measures['Søkere'] || 0,
    sokereMottPerStudieplass: program.measures['Søkere per plass'] || 0
  }));
  
  return processedData;
};

export const sortPrograms = (programs: any[], sortBy: string) => {
  return [...programs].sort((a, b) => {
    if (sortBy === "snitt") {
      const aVal = a.snitt === 0 ? -Infinity : a.snitt;
      const bVal = b.snitt === 0 ? -Infinity : b.snitt;
      return bVal - aVal;
    } else if (sortBy === "popularity") {
      return b.sokereMott - a.sokereMott;
    } else if (sortBy === "competition") {
      const aRatio = a.planlagteStudieplasser > 0 ? a.sokereKvalifisert / a.planlagteStudieplasser : 0;
      const bRatio = b.planlagteStudieplasser > 0 ? b.sokereKvalifisert / b.planlagteStudieplasser : 0;
      return bRatio - aRatio;
    }
    return 0;
  });
};
