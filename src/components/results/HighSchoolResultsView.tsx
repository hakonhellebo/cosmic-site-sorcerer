
import React, { useMemo } from 'react';
import ResultCard from './ResultCard';
import { getFormattedValue } from '@/utils/resultFormatters';
import { Badge } from "@/components/ui/badge";
import { Check, BookOpen } from "lucide-react";
import DimensionRanking from './DimensionRanking';

interface HighSchoolResultsViewProps {
  userData: any;
}

export const HighSchoolResultsView: React.FC<HighSchoolResultsViewProps> = ({ userData }) => {
  const highSchoolData = userData?.questionnaire?.highSchool;
  
  if (!highSchoolData) {
    return <div>Ingen elevdata funnet</div>;
  }
  
  console.log("HighSchoolResultsView - Raw highSchoolData:", highSchoolData);
  
  // Extract interests, strengths, and subjects - only get the ones that are explicitly true
  const interests = Object.keys(highSchoolData.interests || {})
    .filter(key => highSchoolData.interests[key] === true);
  
  console.log("Filtered interests:", interests);
  
  const goodSkills = Object.keys(highSchoolData.goodSkills || {})
    .filter(key => highSchoolData.goodSkills[key] === true);
    
  console.log("Filtered goodSkills:", goodSkills);
  
  const workTasks = Object.keys(highSchoolData.workTasks || {})
    .filter(key => highSchoolData.workTasks[key] === true);
    
  console.log("Filtered workTasks:", workTasks);
  
  // Calculate dimensions based on the questionnaire data
  const calculateDimensions = useMemo(() => {
    // Initialize score counters with zero
    const scores = {
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
  }, [highSchoolData]);

  // Get the calculated dimensions
  const dimensions = calculateDimensions;
  console.log("Top 3 Calculated dimensions:", dimensions);
  
  // Extract favorite and difficult subjects - only count explicit true values
  const favoriteCourses = Object.keys(highSchoolData.favoriteCourses || {})
    .filter(key => highSchoolData.favoriteCourses[key] === true);
  
  const difficultCourses = Object.keys(highSchoolData.difficultCourses || {})
    .filter(key => highSchoolData.difficultCourses[key] === true);
  
  // Create basic info cards
  const basicInfoCards = [
    {
      title: "Din skoleprofil",
      icon: "education",
      items: [
        { label: "Årstrinn", value: highSchoolData.grade === 'vg1' ? 'VG1' : 
                                    highSchoolData.grade === 'vg2' ? 'VG2' : 
                                    highSchoolData.grade === 'vg3' ? 'VG3' : 'Ikke spesifisert' },
        { label: "Studieretning", value: highSchoolData.studyDirection === 'general-studies' ? 'Studiespesialisering' :
                                        highSchoolData.studyDirection === 'vocational' ? 'Yrkesfag' : 'Ikke spesifisert' },
        { label: "Karaktersnitt", value: highSchoolData.averageGrade || 'Ikke spesifisert' }
      ]
    },
    {
      title: "Dine fag og preferanser",
      icon: "award",
      items: [
        { 
          label: "Favorittfag", 
          value: favoriteCourses.length > 0 ? 
            favoriteCourses.map(course => 
              course === 'mathematics' ? 'Matematikk' :
              course === 'norwegian' ? 'Norsk' :
              course === 'english' ? 'Engelsk' :
              course === 'socialStudies' ? 'Samfunnsfag' :
              course === 'science' ? 'Naturfag' :
              course === 'physEd' ? 'Gym' :
              course === 'artsCrafts' ? 'Kunst og håndverk' :
              course === 'foreignLanguage' ? 'Fremmedspråk' :
              course === 'other' ? highSchoolData.favoriteCoursesOther : course
            ).join(', ') : 
            "Ingen valgt"
        },
        { 
          label: "Utfordrende fag", 
          value: difficultCourses.length > 0 ? 
            difficultCourses.map(course => 
              course === 'mathematics' ? 'Matematikk' :
              course === 'norwegian' ? 'Norsk' :
              course === 'english' ? 'Engelsk' :
              course === 'socialStudies' ? 'Samfunnsfag' :
              course === 'science' ? 'Naturfag' :
              course === 'physEd' ? 'Gym' :
              course === 'artsCrafts' ? 'Kunst og håndverk' :
              course === 'foreignLanguage' ? 'Fremmedspråk' :
              course === 'other' ? highSchoolData.difficultCoursesOther : course
            ).join(', ') : 
            "Ingen valgt"
        },
        { 
          label: "Arbeidspreferanse", 
          value: highSchoolData.workPreference === 'alone' ? 'Jobbe alene' : 
                 highSchoolData.workPreference === 'team' ? 'Jobbe i team' : 
                 'Kombinasjon av alene og i team'
        }
      ]
    }
  ];
  
  // Define recommended education options based on interests, skills and tasks
  const educationRecommendations = [
    { 
      name: interests.includes('technology') || goodSkills.includes('technicalUnderstanding') ? 
            "Informatikk" : "Økonomi",
      institution: "NTNU / UiO", 
      match: interests.includes('technology') ? 
             "Passer med din teknologiinteresse og analytiske evner" : 
             "Passer med din interesse for økonomi og analytiske evner"
    },
    { 
      name: interests.includes('economyFinance') ? 
            "Økonomi og administrasjon" : "Psykologi",
      institution: "NHH / BI / UiO", 
      match: interests.includes('economyFinance') ? 
             "Passer med din interesse for økonomi og finans" :
             "Passer med dine sosiale og analytiske evner"
    },
    { 
      name: workTasks.includes('leadership') ? 
            "Ledelse og organisasjon" : "Datavitenskap",
      institution: "BI / UiO", 
      match: workTasks.includes('leadership') ? 
             "Passer med dine lederegenskaper og analytiske evner" :
             "Passer med din tekniske forståelse og problemløsningsevner"
    }
  ];
  
  // Define next steps
  const nextSteps = [
    "Snakk med rådgiver på skolen",
    "Utforsk utdanningsprogrammer på utdanning.no",
    "Besøk åpen dag hos aktuelle utdanningsinstitusjoner",
    "Delta på karrieredager og møt potensielle arbeidsgivere"
  ];
  
  return (
    <div className="space-y-10">
      {/* Personalized intro for high school students */}
      <div className="bg-card p-6 rounded-lg border animate-fade-up relative overflow-hidden">
        <div className="absolute top-0 left-0 h-full w-1 bg-primary"></div>
        <div className="relative">
          <div className="flex items-center mb-4">
            <BookOpen className="h-6 w-6 mr-2 text-primary" />
            <h2 className="text-xl font-semibold">Videregåendeskole-elev</h2>
          </div>
          <p className="text-lg mb-6">
            Basert på svarene dine har vi laget en personlig profil som viser dine styrker, interesser 
            og mulige utdanningsveier. Dette er ikke en fasit – men en start på reisen mot noe som passer deg.
          </p>
          
          {/* Show calculated dimensions here */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Dine topp dimensjoner</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {dimensions.map((dim, index) => (
                <div key={index} className="p-3 bg-primary/10 rounded-md">
                  <h4 className="font-medium">{dim.name}</h4>
                  <p className="text-sm">{dim.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-md">
              <h4 className="font-medium">Interesser</h4>
              <p className="text-sm">{interests.length > 0 ? 
                interests.map(interest => 
                  interest === 'technology' ? 'Teknologi' :
                  interest === 'artDesign' ? 'Kunst og design' :
                  interest === 'sports' ? 'Sport' :
                  interest === 'economyFinance' ? 'Økonomi og finans' :
                  interest === 'travelCulture' ? 'Reise og kultur' :
                  interest === 'healthCare' ? 'Helse og omsorg' :
                  interest === 'environmentSustainability' ? 'Miljø og bærekraft' :
                  interest
                ).join(', ') : "Ingen valgt"}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-md">
              <h4 className="font-medium">Læringsstil</h4>
              <p className="text-sm">
                {highSchoolData.learningStyle ? 
                  Object.keys(highSchoolData.learningStyle)
                    .filter(key => highSchoolData.learningStyle[key] === true)
                    .map(style => 
                      style === 'reading' ? 'Lesing' :
                      style === 'listening' ? 'Lytting' :
                      style === 'practical' ? 'Praktisk' :
                      style === 'discussing' ? 'Diskusjon' :
                      style === 'watching' ? 'Observasjon' :
                      style === 'unknown' ? 'Vet ikke' :
                      style
                    ).join(', ') : 
                  "Ikke spesifisert"}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-md">
              <h4 className="font-medium">Arbeidspreferanser</h4>
              <p className="text-sm">
                {highSchoolData.workPreference === 'alone' ? 'Jobbe alene' : 
                 highSchoolData.workPreference === 'team' ? 'Jobbe i team' : 
                 'Kombinasjon av alene og i team'}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Dimension Ranking - Now passing actual user data with debugging */}
      <DimensionRanking userData={userData} questionnaire="highSchool" />
      
      {/* Basic info cards */}
      {basicInfoCards.map((card, index) => (
        <ResultCard 
          key={index} 
          title={card.title} 
          icon={card.icon} 
          items={card.items} 
        />
      ))}
      
      {/* Recommended education options */}
      <div className="animate-fade-up">
        <h3 className="text-2xl font-semibold mb-6">Anbefalte utdanninger</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {educationRecommendations.map((edu, idx) => (
            <div key={idx} className="bg-card border rounded-lg p-5 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-lg mb-2">{edu.name}</h4>
              <p className="text-sm text-muted-foreground mb-3">{edu.institution}</p>
              <div className="bg-muted/40 p-3 rounded">
                <p className="text-sm">Passer deg: {edu.match}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Next steps */}
        <div className="bg-muted/10 p-6 rounded-lg border">
          <h3 className="text-xl font-semibold mb-4">Neste steg</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {nextSteps.map((step, idx) => (
              <li key={idx} className="flex items-start">
                <Check className="h-5 w-5 mr-2 mt-0.5 text-primary flex-shrink-0" />
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
