
import React from 'react';
import CareerOpportunities, { CareerField } from '../worker/CareerOpportunities';

interface UniversityCareersProps {
  recommendations: any[];
}

const UniversityCareers: React.FC<UniversityCareersProps> = ({ recommendations }) => {
  // Transform recommendations into the format expected by CareerOpportunities
  const careerFields: CareerField[] = recommendations.map(rec => ({
    educationProgram: rec.title || rec.name || '',
    jobs: rec.careers?.map(career => ({
      title: career.title || '',
      description: career.description || ''
    })) || [],
    companies: rec.careers?.flatMap(career => 
      Array.isArray(career.companies) 
        ? career.companies.map(company => typeof company === 'string' ? company : company.name || '') 
        : []
    ) || []
  }));

  return (
    <CareerOpportunities careerFields={careerFields} />
  );
};

export default UniversityCareers;
