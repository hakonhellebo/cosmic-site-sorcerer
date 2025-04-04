
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
  
  return (
    <div className="space-y-10">
      {/* Personalized intro for high school students */}
      <HighSchoolIntro userData={userData} dimensions={dimensions} />
      
      {/* Display top dimensions */}
      <DimensionsCard dimensions={dimensions} />
      
      {/* Education recommendations section */}
      <RecommendedEducation recommendations={educationRecommendations} />
      
      {/* Career opportunities section - pass the full education recommendations */}
      <CareerOpportunities recommendations={educationRecommendations} maxCount={5} />
    </div>
  );
};
