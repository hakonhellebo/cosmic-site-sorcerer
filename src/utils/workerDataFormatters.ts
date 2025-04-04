
// Utility functions to format worker data for display

/**
 * Format interests object into readable text
 */
export const formatInterests = (interests: Record<string, boolean> | undefined): string => {
  if (!interests) return "Ingen oppgitt";
  
  const interestKeys = Object.keys(interests).filter(key => interests[key] === true);
  if (interestKeys.length === 0) return "Ingen oppgitt";
  
  // Map interest keys to more readable text if needed
  const readableInterests = interestKeys.map(key => {
    const interestMap: Record<string, string> = {
      teknologi: "Teknologi",
      okonomi: "Økonomi",
      ledelse: "Ledelse",
      design: "Design",
      kommunikasjon: "Kommunikasjon",
      markedsforing: "Markedsføring",
      salg: "Salg",
      utvikling: "Utvikling",
      forskning: "Forskning",
      analyse: "Analyse",
      prosjektledelse: "Prosjektledelse",
      undervisning: "Undervisning",
      radgivning: "Rådgivning",
      innovasjon: "Innovasjon",
      kreativitet: "Kreativitet"
    };
    
    return interestMap[key] || key.replace(/_/g, ' ');
  });
  
  return readableInterests.join(', ');
};

/**
 * Format skills object into readable text
 */
export const formatSkills = (skills: Record<string, boolean> | undefined): string => {
  if (!skills) return "Ingen oppgitt";
  
  const skillKeys = Object.keys(skills).filter(key => skills[key] === true);
  if (skillKeys.length === 0) return "Ingen oppgitt";
  
  // Map skill keys to more readable text if needed
  const readableSkills = skillKeys.map(key => {
    const skillMap: Record<string, string> = {
      programmering: "Programmering",
      dataanalyse: "Dataanalyse",
      prosjektledelse: "Prosjektledelse",
      kommunikasjon: "Kommunikasjon",
      teamarbeid: "Teamarbeid",
      problem_losning: "Problemløsning",
      kritisk_tenkning: "Kritisk tenkning",
      ledelse: "Ledelse",
      presentasjon: "Presentasjon",
      salg: "Salg",
      markedsforing: "Markedsføring",
      design: "Design",
      kreativitet: "Kreativitet",
      planlegging: "Planlegging",
      organisering: "Organisering"
    };
    
    return skillMap[key] || key.replace(/_/g, ' ');
  });
  
  return readableSkills.join(', ');
};

/**
 * Format work preference into readable text
 */
export const formatWorkPreference = (preference: string | undefined): string => {
  if (!preference) return "Ikke spesifisert";
  
  const preferenceMap: Record<string, string> = {
    remote: "Hjemmekontor/fjernarbeid",
    hybrid: "Hybrid (kontor og hjemmekontor)",
    office: "Fast kontor",
    flexible: "Fleksibel arbeidsplass",
    travel: "Arbeid som innebærer reising"
  };
  
  return preferenceMap[preference] || preference.replace(/-/g, ' ');
};

/**
 * Format development preference into readable text
 */
export const formatDevelopmentPreference = (preference: string | undefined): string => {
  if (!preference) return "Ikke spesifisert";
  
  const preferenceMap: Record<string, string> = {
    'very-important': 'Faglig utvikling er svært viktig',
    'somewhat-important': 'Faglig utvikling er viktig',
    'not-really': 'Faglig utvikling er mindre viktig',
    'not-at-all': 'Faglig utvikling er ikke viktig'
  };
  
  return preferenceMap[preference] || preference.replace(/-/g, ' ');
};
