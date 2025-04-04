
import React from 'react';
import { Dimension } from '@/utils/dimensions/types';
import RecommendedEducation from '../highschool/RecommendedEducation';

interface UniversityEducationProps {
  dimensions?: Dimension[];
  recommendations?: any[];
  nextSteps?: string[];
  title?: string;
  subtitle?: string;
  showAllRecommendations?: boolean;
  isBachelorStudent?: boolean;
}

const UniversityEducation: React.FC<UniversityEducationProps> = ({ 
  dimensions, 
  recommendations, 
  nextSteps,
  title = "Anbefalte utdanninger",
  subtitle = "Basert på din profil",
  showAllRecommendations = false,
  isBachelorStudent
}) => {
  // Format recommendations to match expected structure
  const formattedRecommendations = recommendations?.map(rec => ({
    title: rec.title,
    institution: rec.institution || rec.location,
    description: rec.description || rec.match,
    link: rec.link || "" // Ensure link always has a default value
  })) || [];
  
  return (
    <RecommendedEducation 
      dimensions={dimensions}
      recommendations={formattedRecommendations}
      nextSteps={nextSteps || []}
      title={title}
      subtitle={subtitle}
    />
  );
};

export default UniversityEducation;
