
import React, { useMemo } from 'react';
import DimensionRanking from './DimensionRanking';
import RecommendedEducation from './highschool/RecommendedEducation';
import CareerOpportunities from './highschool/CareerOpportunities';
import { matchEducationPrograms } from '@/utils/educationData';
import UniversityIntro from './university/UniversityIntro';
import NextSteps from './university/NextSteps';
import BasicInfoCards from './university/BasicInfoCards';
import { calculateUniversityDimensions, getTopDimensions } from '@/utils/universityDimensionCalculator';

interface UniversityResultsViewProps {
  userData: any;
}

export const UniversityResultsView: React.FC<UniversityResultsViewProps> = ({ userData }) => {
  const universityData = userData?.questionnaire?.university;
  
  if (!universityData) {
    return <div>Ingen data funnet</div>;
  }
  
  console.log("UniversityResultsView - Raw universityData:", universityData);
  
  // Extract interests and strengths
  const interests = Object.keys(universityData.interests || {})
    .filter(key => universityData.interests[key] === true);
  
  console.log("Filtered interests:", interests);
  
  const strengths = Object.keys(universityData.strengths || {})
    .filter(key => universityData.strengths[key] === true);
  
  console.log("Filtered strengths:", strengths);
  
  // Determine if bachelor or master student
  const isBachelorStudent = universityData.level?.toLowerCase().includes('bachelor');

  // Calculate dimension scores and get top dimensions
  const dimensionScores = useMemo(() => calculateUniversityDimensions(universityData), [universityData]);
  
  // Get top 3 dimensions
  const dimensions = useMemo(() => {
    return getTopDimensions(dimensionScores, 3);
  }, [dimensionScores]);
  
  console.log("Top 3 Calculated dimensions:", dimensions);
  
  // Get top dimension names for education recommendations
  const topDimensions = dimensions.map(dim => dim.name);
  
  // Match education programs based on dimensions - show more recommendations
  const educationRecommendations = useMemo(() => {
    return matchEducationPrograms(topDimensions, 8);
  }, [topDimensions]);
  
  console.log("Education recommendations:", educationRecommendations);
  
  return (
    <div className="space-y-10">
      {/* Personalized intro for university students */}
      <UniversityIntro 
        isBachelorStudent={isBachelorStudent} 
        dimensions={dimensions} 
      />
      
      {/* Dimension Ranking */}
      <DimensionRanking 
        userData={userData} 
        questionnaire="university" 
      />
      
      {/* Basic info cards */}
      <BasicInfoCards 
        universityData={universityData}
        interests={interests}
        strengths={strengths}
      />

      {/* Education recommendations section */}
      <RecommendedEducation 
        recommendations={educationRecommendations}
        nextSteps={[]}
        showAllRecommendations={true}
        title={isBachelorStudent ? "Anbefalte masterprogrammer" : "Anbefalte karriereveier"}
        subtitle={isBachelorStudent 
          ? "Basert på din profil har vi funnet disse masterprogrammene som kan passe for deg" 
          : "Basert på din profil har vi funnet disse karriereveiene som kan passe for deg"}
      />
      
      {/* Career opportunities section */}
      <CareerOpportunities 
        recommendations={educationRecommendations}
        showAllOpportunities={true}
      />
      
      {/* Next steps - updated content to match high school view */}
      <NextSteps />
    </div>
  );
};
