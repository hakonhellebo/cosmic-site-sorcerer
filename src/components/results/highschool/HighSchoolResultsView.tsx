
import React, { useMemo } from 'react';
import ResultCard from '../ResultCard';
import DimensionRanking from '../DimensionRanking';
import HighSchoolIntro from './HighSchoolIntro';
import RecommendedEducation from './RecommendedEducation';
import { calculateHighSchoolDimensions } from '@/utils/dimensionCalculator';
import { 
  formatInterests, 
  formatCourses, 
  formatLearningStyle,
  formatWorkPreference,
  formatStudyDirection,
  formatGrade
} from '@/utils/highschoolDataFormatters';

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
  const dimensions = useMemo(() => 
    calculateHighSchoolDimensions(highSchoolData), 
    [highSchoolData]
  );
  
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
        { 
          label: "Årstrinn", 
          value: formatGrade(highSchoolData.grade)
        },
        { 
          label: "Studieretning", 
          value: formatStudyDirection(highSchoolData.studyDirection)
        },
        { 
          label: "Karaktersnitt", 
          value: highSchoolData.averageGrade || 'Ikke spesifisert' 
        }
      ]
    },
    {
      title: "Dine fag og preferanser",
      icon: "award",
      items: [
        { 
          label: "Favorittfag", 
          value: formatCourses(highSchoolData.favoriteCourses, highSchoolData.favoriteCoursesOther)
        },
        { 
          label: "Utfordrende fag", 
          value: formatCourses(highSchoolData.difficultCourses, highSchoolData.difficultCoursesOther)
        },
        { 
          label: "Arbeidspreferanse", 
          value: formatWorkPreference(highSchoolData.workPreference)
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
  
  // Format the data for components
  const formattedInterests = formatInterests(highSchoolData.interests);
  const formattedLearningStyle = formatLearningStyle(highSchoolData.learningStyle);
  const formattedWorkPreference = formatWorkPreference(highSchoolData.workPreference);
  
  return (
    <div className="space-y-10">
      {/* Personalized intro for high school students */}
      <HighSchoolIntro 
        dimensions={dimensions}
        interests={formattedInterests}
        learningStyle={formattedLearningStyle}
        workPreference={formattedWorkPreference}
      />
      
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
      <RecommendedEducation 
        recommendations={educationRecommendations} 
        nextSteps={nextSteps} 
      />
    </div>
  );
};
