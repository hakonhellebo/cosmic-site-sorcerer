
interface Company {
  Selskap: string;
  Sektor: string;
  sub_sektor: string;
  Beskrivelse: string;
  Lokasjon: string;
  Ansatte: string;
  'Driftsinntekter (MNOK)': string;
  Geografi: string;
  Linker: string;
  Karriereportal: string;
}

export const filterCompaniesBySector = (companies: Company[], sector: string): Company[] => {
  const relevant = companies.filter(company => 
    company.Sektor?.toLowerCase() === sector?.toLowerCase() ||
    company.sub_sektor?.toLowerCase() === sector?.toLowerCase()
  );
  
  // Shuffle and limit to show variety
  const shuffled = relevant.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 24); // Limit to 24 for performance
};
