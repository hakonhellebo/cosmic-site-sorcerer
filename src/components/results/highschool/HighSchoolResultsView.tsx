
import React, { useMemo } from 'react';
import { Check } from 'lucide-react';
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
  
  // Get dimension names from dimension objects
  const topDimensions = dimensions.map(dim => dim.name);
  
  // Match education programs based on dimensions - show only top 5 recommendations
  const educationRecommendations = useMemo(() => {
    return matchEducationPrograms(topDimensions, 5);
  }, [topDimensions]);
  
  console.log("Education recommendations:", educationRecommendations);
  
  // Transform education recommendations to the format expected by CareerOpportunities
  const careerRecommendations = useMemo(() => {
    return educationRecommendations.map(rec => ({
      title: rec.name,
      institution: rec.institution,
      match: rec.match,
      description: rec.description || '',
      careers: rec.careers || []
    }));
  }, [educationRecommendations]);

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
      
      {/* Top 5 recommended education options */}
      <RecommendedEducation 
        recommendations={educationRecommendations} 
        nextSteps={[]}
        showAllRecommendations={false}
        maxCount={5}
      />
      
      {/* Top 5 Career Opportunities based on education recommendations */}
      <CareerOpportunities 
        recommendations={careerRecommendations}
        showAllOpportunities={false}
        maxCount={5}
      />
      
      {/* Next steps - updated content */}
      <div className="bg-muted/10 p-6 rounded-lg border">
        <h3 className="text-xl font-semibold mb-4">Neste steg – dette får du snart tilgang til</h3>
        <p className="mb-4">EdPath blir mer enn bare anbefalinger. Du vil snart kunne:</p>
        
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <li className="flex items-start">
            <Check className="h-5 w-5 mr-2 mt-0.5 text-primary flex-shrink-0" />
            <span>Se hva andre med lik profil har valgt – og hvor de fikk jobb</span>
          </li>
          <li className="flex items-start">
            <Check className="h-5 w-5 mr-2 mt-0.5 text-primary flex-shrink-0" />
            <span>Utforske bedrifter og stillinger som passer akkurat deg, basert på dine styrker og interesser</span>
          </li>
          <li className="flex items-start">
            <Check className="h-5 w-5 mr-2 mt-0.5 text-primary flex-shrink-0" />
            <span>Få ferdige forslag til hva du kan skrive i en CV – og hvordan du matcher en jobb</span>
          </li>
          <li className="flex items-start">
            <Check className="h-5 w-5 mr-2 mt-0.5 text-primary flex-shrink-0" />
            <span>Få anbefalte kurs og ferdigheter som gjør deg mer attraktiv for arbeidsgivere</span>
          </li>
          <li className="flex items-start">
            <Check className="h-5 w-5 mr-2 mt-0.5 text-primary flex-shrink-0" />
            <span>Snakke med vår AI-rådgiver og få veiledning døgnet rundt</span>
          </li>
          <li className="flex items-start">
            <Check className="h-5 w-5 mr-2 mt-0.5 text-primary flex-shrink-0" />
            <span>Bygge din egen profil som oppdateres etter hvert som du lærer og utvikler deg</span>
          </li>
          <li className="flex items-start">
            <Check className="h-5 w-5 mr-2 mt-0.5 text-primary flex-shrink-0" />
            <span>Få kontakt med bransjer og arbeidsgivere – og se hvor du faktisk kan søke</span>
          </li>
          <li className="flex items-start">
            <Check className="h-5 w-5 mr-2 mt-0.5 text-primary flex-shrink-0" />
            <span>Få oversikt over relevante utdanninger, snitt og opptak – på én side</span>
          </li>
        </ul>
        
        <p className="mt-4">Alt dette er basert på dine svar – og vil tilpasse seg deg, ikke motsatt.</p>
      </div>
    </div>
  );
};
