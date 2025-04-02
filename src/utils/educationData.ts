
// Datamodell for utdanningsanbefalinger
export interface EducationRecommendation {
  name: string;
  institution: string;
  match: string;
  link?: string;
  requirements?: string;
  description?: string;
  careers?: string[];
}

// Interface for dimensjoner
export interface Dimensions {
  [key: string]: number;
}

// Database over utdanninger med dimensjoner
// Dataen kommer fra en omfattende analyse av utdanningsprogrammer i Norge
export const educationDatabase: {
  dimensions: string[];
  program: string;
  institutions: string;
  requirements: string;
  description: string;
  link?: string;
}[] = [
  {
    dimensions: ['Helseinteresse', 'Ambisjon'],
    program: 'Medisin',
    institutions: 'Universitetet i Oslo (UiO), Universitetet i Bergen (UiB), NTNU, UiT Norges arktiske universitet',
    requirements: 'Ca. 60–62 poeng',
    description: 'Profesjonsstudium som utdanner leger. Krever høyt karaktersnitt og realfagskompetanse.',
    link: 'https://www.uio.no/studier/program/medisin/'
  },
  {
    dimensions: ['Helseinteresse', 'Analytisk'],
    program: 'Psykologi (profesjonsstudium)',
    institutions: 'Universitetet i Oslo (UiO), Universitetet i Bergen (UiB), NTNU, UiT Norges arktiske universitet',
    requirements: 'Ca. 56–57 poeng',
    description: 'Utdanning som fører til autorisasjon som psykolog. Høye opptakskrav.',
    link: 'https://www.uio.no/studier/program/psykologi-profesjon/'
  },
  {
    dimensions: ['Struktur', 'Helseinteresse'],
    program: 'Odontologi (tannlege)',
    institutions: 'Universitetet i Oslo (UiO), Universitetet i Bergen (UiB), UiT Norges arktiske universitet',
    requirements: 'Ca. 55–58 poeng',
    description: 'Profesjonsstudium som utdanner tannleger. Krever høyt karaktersnitt.',
    link: 'https://www.uio.no/studier/program/odontologi/'
  },
  {
    dimensions: ['Struktur', 'Analytisk'],
    program: 'Farmasi',
    institutions: 'Universitetet i Oslo (UiO), Universitetet i Bergen (UiB), NTNU, UiT Norges arktiske universitet',
    requirements: 'Varierer, ca. 50–55 poeng',
    description: 'Bachelorgrad som gir grunnlag for arbeid som farmasøyt.',
    link: 'https://www.uio.no/studier/program/farmasi/'
  },
  {
    dimensions: ['Helseinteresse', 'Sosialitet'],
    program: 'Sykepleie',
    institutions: 'OsloMet, Høgskulen på Vestlandet (HVL), NTNU, UiT Norges arktiske universitet',
    requirements: 'Ca. 42–50 poeng',
    description: 'Bachelorgrad som utdanner sykepleiere. Varierende opptakskrav.',
    link: 'https://www.oslomet.no/studier/hv/sykepleie'
  },
  {
    dimensions: ['Analytisk', 'Teknologi'],
    program: 'Informatikk',
    institutions: 'NTNU, UiO, UiB, UiT, OsloMet, UiS, UiA, HVL, HiØ',
    requirements: 'Varierer mellom institusjoner',
    description: 'Bachelorprogram som gir kunnskap om programmering, systemutvikling og IT-løsninger.',
    link: 'https://www.ntnu.no/studier/bit'
  },
  {
    dimensions: ['Kreativitet', 'Teknologi'],
    program: 'Informatikk: design, bruk, interaksjon',
    institutions: 'Universitetet i Oslo (UiO)',
    requirements: 'Varierer',
    description: 'Bachelor som kombinerer informatikk med design og brukervennlighet.',
    link: 'https://www.uio.no/studier/program/informatikk-design-master/'
  },
  {
    dimensions: ['Analytisk', 'Ambisjon'],
    program: 'Økonomi og administrasjon',
    institutions: 'Norges Handelshøyskole (NHH), NTNU, BI, NMBU, UiS, UiA, HVL, HiØ, OsloMet, USN',
    requirements: 'Generell studiekompetanse; Matematikk R1 eller S1+S2',
    description: 'Bachelor som gir grunnleggende kunnskap om økonomi, regnskap og ledelse.',
    link: 'https://www.nhh.no/studier/bachelor-i-okonomi-og-administrasjon/'
  },
  {
    dimensions: ['Bærekraft', 'Ledelse'],
    program: 'Bærekraftig økonomi og ledelse',
    institutions: 'Norges miljø- og biovitenskapelige universitet (NMBU)',
    requirements: 'Generell studiekompetanse',
    description: 'Bachelor med fokus på bærekraftig forretningsutvikling og ledelse.',
    link: 'https://www.nmbu.no/studier/studietilbud/bachelorprogrammer/barekraftig-okonomi-og-ledelse'
  },
  {
    dimensions: ['Analytisk', 'Struktur'],
    program: 'Statsvitenskap',
    institutions: 'Universitetet i Oslo (UiO), Universitetet i Bergen (UiB), UiS, UiA, Oslo Nye Høyskole',
    requirements: 'Generell studiekompetanse',
    description: 'Bachelor som studerer politiske systemer, offentlig administrasjon og internasjonale relasjoner.',
    link: 'https://www.uio.no/studier/program/statsvitenskap/'
  },
  {
    dimensions: ['Teknologi', 'Analytisk'],
    program: 'Prosessteknologi, ingeniør',
    institutions: 'UiT Norges arktiske universitet',
    requirements: 'Generell studiekompetanse med realfag',
    description: 'Studiet fokuserer på prosessindustri og teknologi knyttet til produksjon og bearbeiding av materialer.',
    link: 'https://www.uit.no/utdanning/program/268186/prosessteknologi_-_bachelor'
  },
  {
    dimensions: ['Bærekraft', 'Teknologi'],
    program: 'Fornybar energi, ingeniørutdanning',
    institutions: 'Universitetet i Agder (UiA)',
    requirements: 'Generell studiekompetanse med realfag',
    description: 'Studiet retter seg mot utvikling og implementering av bærekraftige energiløsninger.',
    link: 'https://www.uia.no/studier/fornybar-energi'
  },
  {
    dimensions: ['Kreativitet', 'Teknologi'],
    program: 'Master i arkitektur',
    institutions: 'Arkitektur- og designhøgskolen i Oslo (AHO), NTNU, Bergen Arkitekthøgskole (BAS)',
    requirements: 'Generell studiekompetanse + opptaksprøver',
    description: 'Femårig masterprogram som kombinerer kunstnerisk kreativitet med teknisk forståelse.',
    link: 'https://aho.no/no/studier/master-i-arkitektur'
  },
  {
    dimensions: ['Struktur', 'Analytisk'],
    program: 'Rettsvitenskap (jus)',
    institutions: 'Universitetet i Oslo (UiO), Universitetet i Bergen (UiB), Universitetet i Tromsø (UiT)',
    requirements: 'Ca. 55-60 poeng',
    description: 'Femårig profesjonsstudium som utdanner jurister. Krever høy struktur og analytiske ferdigheter.',
    link: 'https://www.uio.no/studier/program/jus/'
  },
  {
    dimensions: ['Struktur', 'Analytisk'],
    program: 'Bachelor i rettsvitenskap',
    institutions: 'Universitetet i Stavanger (UiS), USN, Høgskolen i Molde',
    requirements: 'Ca. 45-50 poeng',
    description: 'Treårig bachelorgrad som gir grunnleggende juridisk kunnskap.',
    link: 'https://www.uis.no/nb/studietilbud/jus-bachelorstudium'
  },
  {
    dimensions: ['Kreativitet', 'Teknologi'],
    program: 'Bachelor i animasjon og digital kunst',
    institutions: 'Universitetet i Innlandet',
    requirements: 'Generell studiekompetanse',
    description: 'Studiet gir innføring i mekanikken og anvendelser av modellering, animasjon og digital kunst.',
    link: 'https://www.inn.no/studier/studietilbud/media-og-kommunikasjon/bachelor-i-animasjon-og-digital-kunst/'
  },
  {
    dimensions: ['Kreativitet', 'Selvstendighet'],
    program: 'Visual Arts',
    institutions: 'Ringerike Folkehøgskole',
    requirements: 'Ingen formelle opptakskrav',
    description: 'Gir et godt grunnlag for videre studier innen billedkunst, design, foto og andre kreative yrkesveier.',
    link: 'https://ringerike.fhs.no/'
  },
  {
    dimensions: ['Struktur', 'Analytisk'],
    program: 'Master i regnskap og revisjon (MRR)',
    institutions: 'Norges Handelshøyskole (NHH), Handelshøyskolen BI, NTNU',
    requirements: 'Bachelorgrad med økonomisk-administrativ retning',
    description: 'Toårig masterprogram som gir teoretisk kompetanse for å bli statsautorisert revisor.',
    link: 'https://www.nhh.no/studier/master-i-regnskap-og-revisjon/'
  },
  {
    dimensions: ['Kreativitet', 'Teknologi'],
    program: 'Bachelor i interaksjonsdesign',
    institutions: 'Universitetet i Sørøst-Norge (USN)',
    requirements: 'Generell studiekompetanse',
    description: 'Studiet fokuserer på design av brukergrensesnitt og interaktive løsninger for digitale produkter.',
    link: 'https://www.usn.no/studier/finn-studier/ingenior-teknologi-og-it/bachelor-i-interaksjonsdesign'
  },
  {
    dimensions: ['Kreativitet', 'Struktur'],
    program: 'Bachelor i interiørarkitektur',
    institutions: 'Kunsthøgskolen i Oslo (KHiO)',
    requirements: 'Generell studiekompetanse + opptaksprøver',
    description: 'Utdanner interiørarkitekter med fokus på romlige løsninger og estetikk.',
    link: 'https://khio.no/studier/design/interiorarkitektur-og-mobeldesign'
  },
  {
    dimensions: ['Ambisjon', 'Selvstendighet'],
    program: 'Bachelor i entreprenørskap og bærekraftig innovasjon',
    institutions: 'Universitetet i Sørøst-Norge (USN)',
    requirements: 'Generell studiekompetanse',
    description: 'Treårig bachelorprogram som kombinerer entreprenørskap med fokus på bærekraftige løsninger.',
    link: 'https://www.usn.no/studier/finn-studier/okonomi-ledelse-og-innovasjon/bachelor-i-entreprenorskap-og-barekraftig-innovasjon/'
  },
  {
    dimensions: ['Sosialitet', 'Struktur'],
    program: 'Bachelor i HR og personalledelse',
    institutions: 'Høyskolen Kristiania, Oslo Nye Høyskole',
    requirements: 'Generell studiekompetanse',
    description: 'Treårig bachelorprogram som gir kompetanse til å jobbe med rekruttering, arbeidsmiljø og HMS-arbeid.',
    link: 'https://www.kristiania.no/studier/bachelor/HR-og-personalledelse/'
  },
  {
    dimensions: ['Analytisk', 'Bærekraft'],
    program: 'Bachelor i biologi',
    institutions: 'NTNU, UiB, NMBU, UiT, Nord universitet',
    requirements: 'Generell studiekompetanse med realfagskombinasjon',
    description: 'Treårig bachelorprogram med fokus på biologiske prosesser fra cellenivå til økosystemnivå.',
    link: 'https://www.ntnu.no/studier/nbbio'
  },
  {
    dimensions: ['Kreativitet', 'Ambisjon'],
    program: 'Bachelor i markedsføringsledelse',
    institutions: 'Handelshøyskolen BI, Høyskolen Kristiania',
    requirements: 'Generell studiekompetanse',
    description: 'Treårig bachelorprogram som lærer deg å omforme data til innsikt og bygge merkevarer.',
    link: 'https://www.bi.no/studier-og-kurs/bachelor/markedsforingsledelse/'
  },
  {
    dimensions: ['Sosialitet', 'Struktur'],
    program: 'Barnehagelærerutdanning',
    institutions: 'OsloMet, HVL, NLA Høgskolen, UiA, UiS, USN',
    requirements: 'Generell studiekompetanse',
    description: 'Treårig bachelorprogram som gir kompetanse til å jobbe som pedagogisk leder i barnehager.',
    link: 'https://www.oslomet.no/studier/lui/barnehagelaerer'
  },
  {
    dimensions: ['Sosialitet', 'Struktur'],
    program: 'Grunnskolelærerutdanning 1.–7. trinn',
    institutions: 'USN, UiA, OsloMet, NTNU, UiB',
    requirements: 'Generell studiekompetanse med spesifikke krav',
    description: 'Femårig masterprogram som kvalifiserer for undervisning på 1.–7. trinn i grunnskolen.',
    link: 'https://www.oslomet.no/studier/lui/master-grunnskolelarerutdanning-1-7'
  },
  {
    dimensions: ['Bærekraft', 'Teknologi'],
    program: 'Bachelor i fornybar energi',
    institutions: 'NMBU, UiA',
    requirements: 'Generell studiekompetanse med realfag',
    description: 'Treårig bachelorstudium som gir kompetanse innen fornybar energi og teknologi.',
    link: 'https://www.nmbu.no/studier/studietilbud/bachelorprogrammer/fornybar-energi'
  },
  {
    dimensions: ['Teknologi', 'Analytisk'],
    program: 'Bachelor i kunstig intelligens',
    institutions: 'Universitetet i Bergen (UiB)',
    requirements: 'Generell studiekompetanse med realfag',
    description: 'Treårig bachelorprogram som gir forståelse av kunstig intelligens og programmering.',
    link: 'https://www.uib.no/studier/BAMN-KINT'
  },
  {
    dimensions: ['Analytisk', 'Struktur'],
    program: 'Bachelor i filosofi',
    institutions: 'Universitetet i Oslo (UiO)',
    requirements: 'Generell studiekompetanse',
    description: 'Treårig bachelorprogram med fordypning i grunnleggende filosofiske spørsmål og logisk tenkning.',
    link: 'https://www.uio.no/studier/program/filosofi/'
  },
  {
    dimensions: ['Helseinteresse', 'Analytisk'],
    program: 'Bachelor i ernæring',
    institutions: 'Universitetet i Bergen (UiB), Universitetet i Oslo (UiO)',
    requirements: 'Generell studiekompetanse',
    description: 'Treårig bachelorprogram som gir kunnskap om ernæringens betydning for helse.',
    link: 'https://www.uib.no/studier/BAMD-ERNA'
  },
  {
    dimensions: ['Struktur', 'Selvstendighet'],
    program: 'Veterinærmedisin',
    institutions: 'NMBU – Norges miljø- og biovitenskapelige universitet',
    requirements: 'Generell studiekompetanse med realfag',
    description: 'Femårig profesjonsstudium som gir kompetanse innen dyrehelse og behandling.',
    link: 'https://www.nmbu.no/studier/studietilbud/femaarige/veterinaermedisin'
  },
  {
    dimensions: ['Analytisk', 'Ambisjon'],
    program: 'Bachelor i finans',
    institutions: 'Norges Handelshøyskole (NHH)',
    requirements: 'Generell studiekompetanse med Matematikk R1 eller S1+S2',
    description: 'Treårig bachelorprogram som gir innsikt i kapitalmarkeder, investeringsanalyse og risikostyring.',
    link: 'https://www.nhh.no/studier/bachelor-i-okonomi-og-administrasjon/'
  },
  {
    dimensions: ['Analytisk', 'Ambisjon'],
    program: 'Bachelor i finans',
    institutions: 'BI Norwegian Business School',
    requirements: 'Generell studiekompetanse',
    description: 'Treårig bachelorprogram med fokus på finansielle instrumenter, porteføljeforvaltning og risikostyring.',
    link: 'https://www.bi.no/studier-og-kurs/bachelor/finans/'
  },
  {
    dimensions: ['Analytisk', 'Ambisjon'],
    program: 'Bachelor i finans',
    institutions: 'Universitetet i Stavanger (UiS)',
    requirements: 'Generell studiekompetanse med Matematikk R1 eller S1+S2',
    description: 'Bachelorgrad som fokuserer på finansielle markeder, bedriftsøkonomi og finansiell strategi.',
    link: 'https://www.uis.no/nb/studietilbud/okonomi-og-ledelse/oekonomi-og-administrasjon-bachelorgradsstudium'
  },
  {
    dimensions: ['Analytisk', 'Ambisjon'],
    program: 'Bachelor i shipping management',
    institutions: 'NTNU, BI Norwegian Business School',
    requirements: 'Generell studiekompetanse',
    description: 'Treårig bachelorprogram som gir innsikt i rederidrift, skipsoperasjoner og maritim økonomi.',
    link: 'https://www.ntnu.no/studier/mtshm'
  },
  {
    dimensions: ['Analytisk', 'Ambisjon'], 
    program: 'Master i regnskap og revisjon',
    institutions: 'Norges Handelshøyskole (NHH), BI, NTNU',
    requirements: 'Bachelorgrad med økonomisk-administrativ retning',
    description: 'Toårig masterprogram som gir teoretisk kompetanse for å bli statsautorisert revisor.',
    link: 'https://www.nhh.no/studier/master-i-regnskap-og-revisjon/'
  }
];

// Funksjon for å matche dimensjoner mot studieprogram
export function matchEducationPrograms(userDimensions: string[], count: number = 5): EducationRecommendation[] {
  // Ensure we're focusing on just the top 2-3 dimensions for better matches
  const topDimensions = userDimensions.slice(0, 3);
  console.log("Using top dimensions for matching:", topDimensions);
  
  // Find programs that match the TOP dimensions (not all dimensions)
  const matchedPrograms = educationDatabase.filter(program => {
    return program.dimensions.some(dim => topDimensions.includes(dim));
  });
  
  // Prioritize programs that match the highest ranked dimensions
  const sortedPrograms = matchedPrograms.sort((a, b) => {
    // Count matches only with the top 2-3 dimensions
    const aMatches = a.dimensions.filter(dim => topDimensions.includes(dim)).length;
    const bMatches = b.dimensions.filter(dim => topDimensions.includes(dim)).length;
    
    // If both have the same number of matches with top dimensions
    if (aMatches === bMatches) {
      // Check if either program matches the highest priority dimension (first one)
      const aHasTopDimension = a.dimensions.includes(topDimensions[0]);
      const bHasTopDimension = b.dimensions.includes(topDimensions[0]);
      
      if (aHasTopDimension && !bHasTopDimension) return -1;
      if (!aHasTopDimension && bHasTopDimension) return 1;
      
      // If both or neither match the top dimension, check second dimension
      if (topDimensions.length > 1) {
        const aHasSecondDimension = a.dimensions.includes(topDimensions[1]);
        const bHasSecondDimension = b.dimensions.includes(topDimensions[1]);
        
        if (aHasSecondDimension && !bHasSecondDimension) return -1;
        if (!aHasSecondDimension && bHasSecondDimension) return 1;
      }
    }
    
    // Primary sort by number of matches with top dimensions
    return bMatches - aMatches;
  });
  
  // Group programs by name to avoid duplicates
  const groupedPrograms: { [key: string]: any[] } = {};
  
  sortedPrograms.forEach(program => {
    if (!groupedPrograms[program.program]) {
      groupedPrograms[program.program] = [];
    }
    groupedPrograms[program.program].push(program);
  });
  
  // Convert grouped programs to recommendations
  const recommendations: EducationRecommendation[] = [];
  
  for (const programName in groupedPrograms) {
    const programs = groupedPrograms[programName];
    const firstProgram = programs[0];
    
    // Combine all institutions
    const allInstitutions = programs.map(p => p.institutions).join(', ');
    
    // Calculate match based on the top dimensions only
    const matchingDimensions = firstProgram.dimensions.filter(dim => topDimensions.includes(dim));
    const matchDescription = matchingDimensions.length > 1
      ? `Passer med dine dimensjoner: ${matchingDimensions.join(' og ')}`
      : `Passer med din ${matchingDimensions[0]}-dimensjon`;
    
    // Generate relevant careers based on the program name
    let careers: string[] = [];
    
    // Map common careers for different program types
    if (/medisin|helse|sykepleie|odontologi/i.test(programName)) {
      careers = ['Lege', 'Spesialist', 'Forsker', 'Konsulent innen helsesektoren'];
    } else if (/psykologi/i.test(programName)) {
      careers = ['Klinisk psykolog', 'Organisasjonspsykolog', 'Forsker', 'Terapeut'];
    } else if (/data|informatikk|teknologi/i.test(programName)) {
      careers = ['Systemutvikler', 'Prosjektleder', 'IT-konsulent', 'Data scientist', 'UX-designer'];
    } else if (/økonomi|finans|administrasjon/i.test(programName)) {
      careers = ['Finansanalytiker', 'Rådgiver', 'Controller', 'Prosjektleder', 'Konsulent'];
    } else if (/jus|rettsvitenskap/i.test(programName)) {
      careers = ['Advokat', 'Jurist', 'Dommer', 'Juridisk rådgiver'];
    } else if (/ingeniør/i.test(programName)) {
      careers = ['Ingeniør', 'Prosjektleder', 'Teknisk leder', 'Konsulent'];
    } else if (/kreativ|kunst|design/i.test(programName)) {
      careers = ['Designer', 'Art Director', 'Kreativ leder', 'Konsulent'];
    } else if (/stats|samfunn/i.test(programName)) {
      careers = ['Analytiker', 'Rådgiver', 'Forsker', 'Konsulent'];
    } else {
      // Default careers for other programs
      careers = ['Fagspesialist', 'Rådgiver', 'Prosjektleder', 'Forsker', 'Konsulent'];
    }
    
    recommendations.push({
      name: programName,
      institution: allInstitutions,
      match: matchDescription,
      link: firstProgram.link,
      requirements: firstProgram.requirements,
      description: firstProgram.description,
      careers: careers
    });
  }
  
  // Log the recommendations before returning
  console.log(`Generated ${recommendations.length} recommendations based on top dimensions:`, topDimensions);
  
  // Return top N programs
  return recommendations.slice(0, count);
}
