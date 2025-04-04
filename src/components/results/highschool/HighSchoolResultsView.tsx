
import React, { useMemo } from 'react';
import HighSchoolIntro from './HighSchoolIntro';
import RecommendedEducation from './RecommendedEducation';
import DimensionsCard from './DimensionsCard';
import CareerOpportunities from './CareerOpportunities';
import { matchEducationPrograms } from '@/utils/educationData';
import { calculateHighSchoolDimensions } from '@/utils/dimensionCalculator';

interface HighSchoolResultsViewProps {
  userData: any;
}

export const HighSchoolResultsView: React.FC<HighSchoolResultsViewProps> = ({ userData }) => {
  const highSchoolData = userData?.questionnaire?.highSchool;
  
  if (!highSchoolData) {
    return <div>Ingen data funnet.</div>;
  }
  
  // Calculate dimensions from the user data
  const dimensions = useMemo(() => calculateHighSchoolDimensions(highSchoolData), [highSchoolData]);
  
  // Get top dimension names for education recommendations
  const topDimensions = dimensions.map(dim => dim.name);
  
  // Match education programs based on dimensions - show more recommendations for variety
  const educationRecommendations = useMemo(() => {
    return matchEducationPrograms(topDimensions, 6);
  }, [topDimensions]);
  
  // Extract needed information from userData for HighSchoolIntro
  const interests = highSchoolData?.interests?.join(', ') || '';
  const learningStyle = highSchoolData?.learningStyle || '';
  const workPreference = highSchoolData?.workPreference || '';
  
  // Define next steps for education recommendations
  const nextSteps = [
    "Undersøk utdanningsprogrammene på utdanning.no",
    "Snakk med en studieveileder på skolen din",
    "Delta på åpen dag på institusjonen",
    "Kontakt studenter som går på programmet for å høre deres erfaringer"
  ];
  
  return (
    <div className="space-y-10">
      {/* Personalized intro for high school students */}
      <HighSchoolIntro 
        dimensions={dimensions}
        interests={interests}
        learningStyle={learningStyle}
        workPreference={workPreference}
      />
      
      {/* Display top dimensions */}
      <DimensionsCard dimensions={dimensions} />
      
      {/* Education recommendations section */}
      <RecommendedEducation 
        recommendations={educationRecommendations}
        nextSteps={nextSteps}
      />
      
      {/* Career opportunities section - pass the full education recommendations */}
      <CareerOpportunities recommendations={educationRecommendations} maxCount={5} />
    </div>
  );
};
