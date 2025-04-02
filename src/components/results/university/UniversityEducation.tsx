
import React from 'react';
import RecommendedEducation from '../highschool/RecommendedEducation';

interface UniversityEducationProps {
  recommendations: any[];
  isBachelorStudent: boolean;
}

const UniversityEducation: React.FC<UniversityEducationProps> = ({ 
  recommendations, 
  isBachelorStudent 
}) => {
  return (
    <RecommendedEducation 
      recommendations={recommendations}
      nextSteps={[]}
      showAllRecommendations={true}
      title={isBachelorStudent ? "Anbefalte masterprogrammer" : "Anbefalte karriereveier"}
      subtitle={isBachelorStudent 
        ? "Basert på din profil har vi funnet disse masterprogrammene som kan passe for deg" 
        : "Basert på din profil har vi funnet disse karriereveiene som kan passe for deg"}
    />
  );
};

export default UniversityEducation;
