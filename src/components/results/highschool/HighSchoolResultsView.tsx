
import React, { useMemo } from 'react';
import ResultCard from '../ResultCard';
import DimensionRanking from '../DimensionRanking';
import HighSchoolIntro from './HighSchoolIntro';
import RecommendedEducation from './RecommendedEducation';
import CareerOpportunities from './CareerOpportunities';
import { calculateHighSchoolDimensions } from '@/utils/dimensionCalculator';
import { matchEducationPrograms } from '@/utils/educationData';
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
  const dimensions = useMemo(() => {
    // Fallback for older data format (compatibilitetssjekk)
    if (highSchoolData.strengths && !highSchoolData.goodSkills) {
      // Convert strengths to compatible format with dimension calculator
      const convertedData = {
        ...highSchoolData,
        // Map strengths to goodSkills for compatibility
        goodSkills: {
          logicalThinking: highSchoolData.strengths.analytisk === true,
          creativity: highSchoolData.strengths.kreativ === true,
          collaboration: highSchoolData.strengths.samarbeidsvillig === true,
          communication: highSchoolData.strengths.kommunikativ === true,
          leadership: highSchoolData.strengths.lederskap === true,
          problemSolving: highSchoolData.strengths.problemlosning === true,
          technicalUnderstanding: highSchoolData.strengths.teknisk === true
        },
        // Map interests to compatible format if needed
        interests: {
          ...highSchoolData.interests,
          technology: highSchoolData.interests.teknologi === true,
          artDesign: highSchoolData.interests.kreativitet === true,
          sports: highSchoolData.interests.idrett === true,
          economyFinance: highSchoolData.interests.okonomi === true,
          travelCulture: highSchoolData.interests.reise === true,
          healthCare: highSchoolData.interests.helse === true,
          environmentSustainability: highSchoolData.interests.miljo === true
        }
      };
      console.log("Using converted data format for dimension calculation:", convertedData);
      return calculateHighSchoolDimensions(convertedData);
    }
    
    return calculateHighSchoolDimensions(highSchoolData);
  }, [highSchoolData]);
  
  console.log("Top 3 Calculated dimensions:", dimensions);
  
  // Få dimensjonsnavn fra dimensjonsobjektene
  const topDimensions = dimensions.map(dim => dim.name);
  
  // Match utdanningsprogrammer basert på dimensjoner - vis flere anbefalinger
  const educationRecommendations = useMemo(() => {
    return matchEducationPrograms(topDimensions, 8);
  }, [topDimensions]);
  
  console.log("Education recommendations:", educationRecommendations);
  
  // Extract favorite and difficult courses - only count explicit true values
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
  
  // Define next steps
  const nextSteps = [
    "Snakk med rådgiver på skolen",
    "Utforsk utdanningsprogrammer på utdanning.no",
    "Besøk åpen dag hos aktuelle utdanningsinstitusjoner",
    "Delta på karrieredager og møt potensielle arbeidsgivere",
    "Meld deg på fagforedrag om temaer som interesserer deg"
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
      
      {/* Dimension Ranking */}
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
        showAllRecommendations={true}
      />
      
      {/* Career Opportunities based on education recommendations */}
      <CareerOpportunities 
        recommendations={educationRecommendations}
        showAllOpportunities={true}
      />
    </div>
  );
};

