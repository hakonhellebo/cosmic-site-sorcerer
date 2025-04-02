
import React from 'react';
import DimensionRanking from '../DimensionRanking';

interface UniversityDimensionsProps {
  userData: any;
}

const UniversityDimensions: React.FC<UniversityDimensionsProps> = ({ userData }) => {
  return (
    <DimensionRanking 
      userData={userData} 
      questionnaire="university" 
    />
  );
};

export default UniversityDimensions;
