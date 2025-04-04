
import React from 'react';
import { Dimension } from '@/utils/dimensions/types';
import CareerOpportunities from '../highschool/CareerOpportunities';

interface UniversityCareersProps {
  dimensions?: Dimension[];
  careers?: Array<{
    title: string;
    description: string;
    fields?: string[];
  }>;
  recommendations?: any[];
  showAllOpportunities?: boolean;
}

const UniversityCareers: React.FC<UniversityCareersProps> = ({ 
  dimensions, 
  careers,
  recommendations,
  showAllOpportunities = false 
}) => {
  // Convert recommendations to the format expected by CareerOpportunities
  const formattedCareers = recommendations?.map(rec => ({
    title: rec.title,
    description: rec.description || rec.match,
    fields: rec.fields || [rec.location].filter(Boolean)
  })) || careers || [];
  
  return (
    <CareerOpportunities 
      dimensions={dimensions}
      careers={formattedCareers}
    />
  );
};

export default UniversityCareers;
