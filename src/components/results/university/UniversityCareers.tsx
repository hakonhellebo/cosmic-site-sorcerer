
import React from 'react';
import CareerOpportunities from '../highschool/CareerOpportunities';

interface UniversityCareersProps {
  recommendations: any[];
}

const UniversityCareers: React.FC<UniversityCareersProps> = ({ recommendations }) => {
  return (
    <CareerOpportunities 
      recommendations={recommendations}
      showAllOpportunities={true}
    />
  );
};

export default UniversityCareers;
