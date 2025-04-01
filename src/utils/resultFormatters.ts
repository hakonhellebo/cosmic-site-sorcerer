// Helper functions to format results data

export const getFormattedValue = (value: string | undefined): string => {
  if (!value) return "Ikke angitt";
  
  // Map some values to more readable Norwegian text
  const valueMap: Record<string, string> = {
    // Certainty levels
    'very': 'Veldig sikker',
    'quite': 'Ganske sikker',
    'little': 'Litt usikker',
    'not': 'Ikke sikker',
    
    // Yes/no
    'yes': 'Ja',
    'no': 'Nei',
    'maybe': 'Kanskje',
    
    // Importance levels
    'very-important': 'Veldig viktig',
    'somewhat-important': 'Noe viktig',
    'not-really': 'Ikke så viktig',
    'not-at-all': 'Ikke viktig',
    
    // Frequency
    'daily': 'Daglig',
    'weekly': 'Ukentlig',
    'monthly': 'Månedlig',
    'rarely': 'Sjelden',
    'never': 'Aldri',
    
    // Work-life balance
    'work-first': 'Arbeid først',
    'balanced': 'Balansert',
    'life-first': 'Fritid først',
    
    // Other common values
    'unsure': 'Usikker',
  };
  
  return valueMap[value] || value.replace(/-/g, ' ');
};
