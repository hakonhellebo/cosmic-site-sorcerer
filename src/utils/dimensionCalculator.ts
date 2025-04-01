
// Utility functions for calculating dimensions based on questionnaire data

type DimensionScores = {
  analytisk: number;
  kreativitet: number;
  struktur: number;
  sosialitet: number;
  teknologi: number;
  helseinteresse: number;
  bærekraft: number;
  ambisjon: number;
  selvstendighet: number;
  praktisk: number;
};

type Dimension = {
  name: string;
  description: string;
};

export const calculateHighSchoolDimensions = (highSchoolData: any): Dimension[] => {
  if (!highSchoolData) {
    console.log("No high school data provided for dimension calculation");
    return [];
  }

  // Initialize score counters with zero
  const scores: DimensionScores = {
    analytisk: 0,
    kreativitet: 0,
    struktur: 0, 
    sosialitet: 0,
    teknologi: 0,
    helseinteresse: 0,
    bærekraft: 0,
    ambisjon: 0,
    selvstendighet: 0,
    praktisk: 0
  };
  
  console.log("Starting dimension calculation with highSchoolData:", highSchoolData);
  
  // Update scores based on interests - only count explicit true values
  if (highSchoolData.interests) {
    // Logikk for nytt format
    if (highSchoolData.interests.technology === true) {
      scores.teknologi += 5;
      console.log("Added 5 to teknologi from interests.technology");
    }
    if (highSchoolData.interests.artDesign === true) {
      scores.kreativitet += 5;
      console.log("Added 5 to kreativitet from interests.artDesign");
    }
    if (highSchoolData.interests.sports === true) {
      scores.praktisk += 3;
      console.log("Added 3 to praktisk from interests.sports");
    }
    if (highSchoolData.interests.economyFinance === true) {
      scores.analytisk += 4;
      console.log("Added 4 to analytisk from interests.economyFinance");
    }
    if (highSchoolData.interests.travelCulture === true) {
      scores.sosialitet += 3;
      console.log("Added 3 to sosialitet from interests.travelCulture");
    }
    if (highSchoolData.interests.healthCare === true) {
      scores.helseinteresse += 5;
      console.log("Added 5 to helseinteresse from interests.healthCare");
    }
    if (highSchoolData.interests.environmentSustainability === true) {
      scores.bærekraft += 5;
      console.log("Added 5 to bærekraft from interests.environmentSustainability");
    }
    
    // Logikk for gammelt format (norske nøkler)
    if (highSchoolData.interests.teknologi === true) {
      scores.teknologi += 5;
      console.log("Added 5 to teknologi from interests.teknologi");
    }
    if (highSchoolData.interests.kreativitet === true) {
      scores.kreativitet += 5;
      console.log("Added 5 to kreativitet from interests.kreativitet");
    }
    if (highSchoolData.interests.idrett === true) {
      scores.praktisk += 3;
      console.log("Added 3 to praktisk from interests.idrett");
    }
    if (highSchoolData.interests.okonomi === true) {
      scores.analytisk += 4;
      console.log("Added 4 to analytisk from interests.okonomi");
    }
    if (highSchoolData.interests.reise === true) {
      scores.sosialitet += 3;
      console.log("Added 3 to sosialitet from interests.reise");
    }
    if (highSchoolData.interests.helse === true) {
      scores.helseinteresse += 5;
      console.log("Added 5 to helseinteresse from interests.helse");
    }
    if (highSchoolData.interests.miljo === true) {
      scores.bærekraft += 5;
      console.log("Added 5 to bærekraft from interests.miljo");
    }
    
    // Spesialbehandling for eldre format med norske nøkler
    if (highSchoolData.interests.realfag === true) {
      scores.analytisk += 4;
      console.log("Added 4 to analytisk from interests.realfag");
    }
    if (highSchoolData.interests.samfunnsfag === true) {
      scores.analytisk += 2;
      scores.sosialitet += 2;
      console.log("Added 2 to analytisk and 2 to sosialitet from interests.samfunnsfag");
    }
  }
  
  // Update scores based on good skills - only count explicit true values
  if (highSchoolData.goodSkills) {
    if (highSchoolData.goodSkills.communication === true) {
      scores.sosialitet += 4;
      console.log("Added 4 to sosialitet from goodSkills.communication");
    }
    if (highSchoolData.goodSkills.logicalThinking === true) {
      scores.analytisk += 5;
      console.log("Added 5 to analytisk from goodSkills.logicalThinking");
    }
    if (highSchoolData.goodSkills.creativity === true) {
      scores.kreativitet += 5;
      console.log("Added 5 to kreativitet from goodSkills.creativity");
    }
    if (highSchoolData.goodSkills.technicalUnderstanding === true) {
      scores.teknologi += 5;
      console.log("Added 5 to teknologi from goodSkills.technicalUnderstanding");
    }
    if (highSchoolData.goodSkills.leadership === true) {
      scores.ambisjon += 4;
      scores.sosialitet += 2;
      console.log("Added 4 to ambisjon and 2 to sosialitet from goodSkills.leadership");
    }
    if (highSchoolData.goodSkills.collaboration === true) {
      scores.sosialitet += 5;
      console.log("Added 5 to sosialitet from goodSkills.collaboration");
    }
    if (highSchoolData.goodSkills.problemSolving === true) {
      scores.analytisk += 3;
      console.log("Added 3 to analytisk from goodSkills.problemSolving");
    }
  }
  
  // Håndtering av eldre format med strengths
  if (highSchoolData.strengths) {
    if (highSchoolData.strengths.analytisk === true) {
      scores.analytisk += 5;
      console.log("Added 5 to analytisk from strengths.analytisk");
    }
    if (highSchoolData.strengths.kreativ === true) {
      scores.kreativitet += 5;
      console.log("Added 5 to kreativitet from strengths.kreativ");
    }
    if (highSchoolData.strengths.samarbeidsvillig === true) {
      scores.sosialitet += 5;
      console.log("Added 5 to sosialitet from strengths.samarbeidsvillig");
    }
    if (highSchoolData.strengths.kommunikativ === true) {
      scores.sosialitet += 4;
      console.log("Added 4 to sosialitet from strengths.kommunikativ");
    }
    if (highSchoolData.strengths.lederskap === true) {
      scores.ambisjon += 4;
      scores.sosialitet += 2;
      console.log("Added 4 to ambisjon and 2 to sosialitet from strengths.lederskap");
    }
    if (highSchoolData.strengths.problemlosning === true) {
      scores.analytisk += 3;
      console.log("Added 3 to analytisk from strengths.problemlosning");
    }
    if (highSchoolData.strengths.teknisk === true) {
      scores.teknologi += 5;
      console.log("Added 5 to teknologi from strengths.teknisk");
    }
  }
  
  // Update scores based on work tasks - only count explicit true values
  if (highSchoolData.workTasks) {
    if (highSchoolData.workTasks.numbers === true) {
      scores.analytisk += 4;
      console.log("Added 4 to analytisk from workTasks.numbers");
    }
    if (highSchoolData.workTasks.practical === true) {
      scores.praktisk += 5;
      console.log("Added 5 to praktisk from workTasks.practical");
    }
    if (highSchoolData.workTasks.writing === true) {
      scores.kreativitet += 2;
      console.log("Added 2 to kreativitet from workTasks.writing");
    }
    if (highSchoolData.workTasks.leadership === true) {
      scores.ambisjon += 5;
      scores.sosialitet += 3;
      console.log("Added 5 to ambisjon and 3 to sosialitet from workTasks.leadership");
    }
    if (highSchoolData.workTasks.creative === true) {
      scores.kreativitet += 5;
      console.log("Added 5 to kreativitet from workTasks.creative");
    }
    if (highSchoolData.workTasks.supportive === true) {
      scores.sosialitet += 4;
      scores.helseinteresse += 2;
      console.log("Added 4 to sosialitet and 2 to helseinteresse from workTasks.supportive");
    }
  }
  
  // Calculate scores based on work environment preference
  if (highSchoolData.workEnvironment) {
    if (highSchoolData.workEnvironment === 'competitive') {
      scores.ambisjon += 4;
      scores.selvstendighet += 3;
      console.log("Added 4 to ambisjon and 3 to selvstendighet from workEnvironment=competitive");
    } else if (highSchoolData.workEnvironment === 'collaborative') {
      scores.sosialitet += 4;
      console.log("Added 4 to sosialitet from workEnvironment=collaborative");
    }
  }
  
  // Calculate scores based on work preference
  if (highSchoolData.workPreference) {
    if (highSchoolData.workPreference === 'alone') {
      scores.selvstendighet += 5;
      console.log("Added 5 to selvstendighet from workPreference=alone");
    } else if (highSchoolData.workPreference === 'team') {
      scores.sosialitet += 5;
      console.log("Added 5 to sosialitet from workPreference=team");
    }
  }
  
  // Calculate scores based on salary importance
  if (highSchoolData.salaryImportance === 'very-important') {
    scores.ambisjon += 4;
    console.log("Added 4 to ambisjon from salaryImportance=very-important");
  }
  else if (highSchoolData.salaryImportance === 'important') {
    scores.ambisjon += 2;
    console.log("Added 2 to ambisjon from salaryImportance=important");
  }
  
  // Calculate scores based on social impact importance
  if (highSchoolData.socialImpactImportance === 'very-important') {
    scores.bærekraft += 4;
    console.log("Added 4 to bærekraft from socialImpactImportance=very-important");
  }
  else if (highSchoolData.socialImpactImportance === 'important') {
    scores.bærekraft += 2;
    console.log("Added 2 to bærekraft from socialImpactImportance=important");
  }
  
  // Scoring based on futureWorkVision
  if (highSchoolData.futureWorkVision) {
    if (highSchoolData.futureWorkVision === 'technology') {
      scores.teknologi += 5;
      console.log("Added 5 to teknologi from futureWorkVision=technology");
    } else if (highSchoolData.futureWorkVision === 'creative') {
      scores.kreativitet += 5;
      console.log("Added 5 to kreativitet from futureWorkVision=creative");
    } else if (highSchoolData.futureWorkVision === 'secure') {
      scores.struktur += 5;
      console.log("Added 5 to struktur from futureWorkVision=secure");
    } else if (highSchoolData.futureWorkVision === 'leading') {
      scores.ambisjon += 5;
      console.log("Added 5 to ambisjon from futureWorkVision=leading");
    } else if (highSchoolData.futureWorkVision === 'helping') {
      scores.helseinteresse += 5;
      scores.sosialitet += 3;
      console.log("Added 5 to helseinteresse and 3 to sosialitet from futureWorkVision=helping");
    }
  }
  
  // Calculate scores based on interesting industries - check for true values only
  if (highSchoolData.interestingIndustries) {
    if (highSchoolData.interestingIndustries.technology === true) {
      scores.teknologi += 4;
      console.log("Added 4 to teknologi from interestingIndustries.technology");
    }
    if (highSchoolData.interestingIndustries.healthcare === true) {
      scores.helseinteresse += 4;
      console.log("Added 4 to helseinteresse from interestingIndustries.healthcare");
    }
    if (highSchoolData.interestingIndustries.finance === true) {
      scores.analytisk += 3;
      scores.ambisjon += 2;
      console.log("Added 3 to analytisk and 2 to ambisjon from interestingIndustries.finance");
    }
    if (highSchoolData.interestingIndustries.logistics === true) {
      scores.struktur += 4;
      console.log("Added 4 to struktur from interestingIndustries.logistics");
    }
  }
  
  // Calculate scores based on learning style
  if (highSchoolData.learningStyle) {
    if (highSchoolData.learningStyle.reading === true) {
      scores.analytisk += 2;
      console.log("Added 2 to analytisk from learningStyle.reading");
    }
    if (highSchoolData.learningStyle.practical === true) {
      scores.praktisk += 3;
      console.log("Added 3 to praktisk from learningStyle.practical");
    }
    if (highSchoolData.learningStyle.watching === true) {
      scores.analytisk += 1;
      console.log("Added 1 to analytisk from learningStyle.watching");
    }
  }
  
  // Calculate scores based on work environment preferences
  if (highSchoolData.workEnvironmentPreferences) {
    if (highSchoolData.workEnvironmentPreferences.structure === true) {
      scores.struktur += 5;
      console.log("Added 5 to struktur from workEnvironmentPreferences.structure");
    }
    if (highSchoolData.workEnvironmentPreferences.stability === true) {
      scores.struktur += 4;
      console.log("Added 4 to struktur from workEnvironmentPreferences.stability");
    }
  }
  
  // Legg til ekstra poeng basert på favorittfag (nye felter)
  if (highSchoolData.favoriteCourses) {
    if (highSchoolData.favoriteCourses.mathematics === true) {
      scores.analytisk += 3;
      console.log("Added 3 to analytisk from favoriteCourses.mathematics");
    }
    if (highSchoolData.favoriteCourses.science === true) {
      scores.analytisk += 2;
      scores.teknologi += 1;
      console.log("Added 2 to analytisk and 1 to teknologi from favoriteCourses.science");
    }
    if (highSchoolData.favoriteCourses.languages === true) {
      scores.kreativitet += 2;
      scores.sosialitet += 1;
      console.log("Added 2 to kreativitet and 1 to sosialitet from favoriteCourses.languages");
    }
    if (highSchoolData.favoriteCourses.socialStudies === true) {
      scores.sosialitet += 2;
      scores.analytisk += 1;
      console.log("Added 2 to sosialitet and 1 to analytisk from favoriteCourses.socialStudies");
    }
    if (highSchoolData.favoriteCourses.arts === true) {
      scores.kreativitet += 3;
      console.log("Added 3 to kreativitet from favoriteCourses.arts");
    }
    if (highSchoolData.favoriteCourses.physicalEd === true) {
      scores.praktisk += 3;
      console.log("Added 3 to praktisk from favoriteCourses.physicalEd");
    }
    if (highSchoolData.favoriteCourses.technology === true) {
      scores.teknologi += 3;
      console.log("Added 3 to teknologi from favoriteCourses.technology");
    }
    
    // Norske navn - eldre format
    if (highSchoolData.favoriteCourses.matematikk === true) {
      scores.analytisk += 3;
      console.log("Added 3 to analytisk from favoriteCourses.matematikk");
    }
    if (highSchoolData.favoriteCourses.naturfag === true) {
      scores.analytisk += 2;
      scores.teknologi += 1;
      console.log("Added 2 to analytisk and 1 to teknologi from favoriteCourses.naturfag");
    }
    if (highSchoolData.favoriteCourses.samfunnsfag === true) {
      scores.sosialitet += 2;
      scores.analytisk += 1;
      console.log("Added 2 to sosialitet and 1 to analytisk from favoriteCourses.samfunnsfag");
    }
  }
  
  // Sjekk på eldre format med favoriteSubjects
  if (highSchoolData.favoriteSubjects) {
    if (highSchoolData.favoriteSubjects.matematikk === true) {
      scores.analytisk += 3;
      console.log("Added 3 to analytisk from favoriteSubjects.matematikk");
    }
    if (highSchoolData.favoriteSubjects.naturfag === true) {
      scores.analytisk += 2;
      scores.teknologi += 1;
      console.log("Added 2 to analytisk and 1 to teknologi from favoriteSubjects.naturfag");
    }
    if (highSchoolData.favoriteSubjects.samfunnsfag === true) {
      scores.sosialitet += 2;
      scores.analytisk += 1;
      console.log("Added 2 to sosialitet and 1 to analytisk from favoriteSubjects.samfunnsfag");
    }
  }
  
  // Sjekk på industries i eldre format
  if (highSchoolData.industries) {
    if (highSchoolData.industries.it === true || highSchoolData.industries.teknologi === true) {
      scores.teknologi += 4;
      console.log("Added 4 to teknologi from industries.it/teknologi");
    }
    if (highSchoolData.industries.helse === true) {
      scores.helseinteresse += 4;
      console.log("Added 4 to helseinteresse from industries.helse");
    }
    if (highSchoolData.industries.kreativ === true) {
      scores.kreativitet += 4;
      console.log("Added 4 to kreativitet from industries.kreativ");
    }
  }
  
  // Ensure minimum score for each dimension for presentation purposes
  Object.keys(scores).forEach(key => {
    if (scores[key as keyof DimensionScores] === 0) {
      scores[key as keyof DimensionScores] = 1;
      console.log(`Set minimum score 1 for ${key}`);
    }
  });
  
  // Log the final scores before sorting
  console.log("Final dimension scores:", scores);
  
  // Convert to array and sort by score (highest first)
  return Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([dimension]) => {
      switch(dimension) {
        case 'analytisk': 
          return { name: 'Analytisk', description: 'Du har evne til å analysere informasjon, logisk tenkning og problemløsning' };
        case 'kreativitet': 
          return { name: 'Kreativitet', description: 'Du har evne til å tenke nytt, skape og uttrykke deg' };
        case 'struktur': 
          return { name: 'Struktur', description: 'Du liker orden, system og klar retning' };
        case 'sosialitet': 
          return { name: 'Sosialitet', description: 'Du trives med å jobbe sammen med andre mennesker' };
        case 'teknologi': 
          return { name: 'Teknologi', description: 'Du har interesse for og kunnskap om digitale verktøy og teknologiske løsninger' };
        case 'helseinteresse': 
          return { name: 'Helseinteresse', description: 'Du har interesse for helse, omsorg og velvære hos mennesker' };
        case 'bærekraft': 
          return { name: 'Bærekraft', description: 'Du har interesse for miljø, klima og bærekraftig utvikling' };
        case 'ambisjon': 
          return { name: 'Ambisjon', description: 'Du har ønske om å oppnå suksess, framgang og anerkjennelse' };
        case 'selvstendighet': 
          return { name: 'Selvstendighet', description: 'Du er flink til å arbeide og ta beslutninger på egenhånd' };
        case 'praktisk': 
          return { name: 'Praktisk', description: 'Du har evne til å håndtere konkrete oppgaver og praktisk arbeid' };
        default:
          return { name: dimension, description: 'En av dine fremste egenskaper' };
      }
    });
};
