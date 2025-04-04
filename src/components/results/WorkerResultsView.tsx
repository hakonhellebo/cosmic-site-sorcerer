
import React from 'react';
import CareerOpportunities from '@/components/results/worker/CareerOpportunities';

interface WorkerResultsViewProps {
  userData: any;
}

export const WorkerResultsView: React.FC<WorkerResultsViewProps> = ({ userData }) => {
  // Mock career fields for the CareerOpportunities component
  const careerFields = [
    { 
      title: "Ledelse", 
      description: "Lede og utvikle team og prosjekter",
      opportunities: ["Prosjektleder", "Teamleder", "Avdelingsleder"]
    },
    { 
      title: "Fagspesialist", 
      description: "Spesialisere deg innen ditt fagfelt",
      opportunities: ["Senior konsulent", "Ekspert", "Spesialist"]
    },
    { 
      title: "Rådgivning", 
      description: "Dele din ekspertise med andre",
      opportunities: ["Konsulent", "Mentor", "Coach"]
    }
  ];

  return (
    <div>
      <h2>Worker Results</h2>
      <CareerOpportunities careerFields={careerFields} />
    </div>
  );
};

export default WorkerResultsView;
