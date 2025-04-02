
import React, { useMemo } from 'react';
import { matchEducationPrograms } from '@/utils/educationData';
import UniversityIntro from './university/UniversityIntro';
import NextSteps from './university/NextSteps';
import BasicInfoCards from './university/BasicInfoCards';
import UniversityDimensions from './university/UniversityDimensions';
import UniversityEducation from './university/UniversityEducation';
import UniversityCareers from './university/UniversityCareers';
import { calculateUniversityDimensions, getTopDimensions } from '@/utils/universityDimensionCalculator';

interface UniversityResultsViewProps {
  userData: any;
}

export const UniversityResultsView: React.FC<UniversityResultsViewProps> = ({ userData }) => {
  const universityData = userData?.questionnaire?.university;
  
  if (!universityData) {
    return <div>Ingen data funnet</div>;
  }
  
  // Extract interests and strengths
  const interests = useMemo(() => {
    return Object.keys(universityData.interests || {})
      .filter(key => universityData.interests[key] === true);
  }, [universityData.interests]);
  
  const strengths = useMemo(() => {
    return Object.keys(universityData.strengths || {})
      .filter(key => universityData.strengths[key] === true);
  }, [universityData.strengths]);
  
  // Determine if bachelor or master student
  const isBachelorStudent = universityData.level?.toLowerCase().includes('bachelor');

  // Calculate dimension scores and get top dimensions
  const dimensionScores = useMemo(() => calculateUniversityDimensions(universityData), [universityData]);
  
  // Get top 3 dimensions
  const dimensions = useMemo(() => {
    return getTopDimensions(dimensionScores, 3);
  }, [dimensionScores]);
  
  // Get top dimension names for education recommendations
  const topDimensions = dimensions.map(dim => dim.name);
  
  // Match education programs based on dimensions - show more recommendations
  const educationRecommendations = useMemo(() => {
    return matchEducationPrograms(topDimensions, 8);
  }, [topDimensions]);
  
  return (
    <div className="space-y-10">
      {/* Personalized intro for university students */}
      <UniversityIntro 
        isBachelorStudent={isBachelorStudent} 
        dimensions={dimensions} 
      />
      
      {/* Dimension Ranking */}
      <UniversityDimensions userData={userData} />
      
      {/* Basic info cards */}
      <BasicInfoCards 
        universityData={universityData}
        interests={interests}
        strengths={strengths}
      />

      {/* Education recommendations section */}
      <UniversityEducation 
        recommendations={educationRecommendations}
        isBachelorStudent={isBachelorStudent}
      />
      
      {/* Career opportunities section */}
      <UniversityCareers recommendations={educationRecommendations} />
      
      {/* Next steps section */}
      <NextSteps />
    </div>
  );
};
