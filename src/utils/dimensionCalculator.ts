
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
  
  // Ensure minimum score of 1 for all dimensions
  Object.keys(scores).forEach(key => {
    scores[key as keyof typeof scores] = Math.max(1, scores[key as keyof typeof scores]);
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
