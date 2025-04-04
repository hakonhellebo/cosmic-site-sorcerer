
import React from 'react';
import CareerOpportunities from '@/components/results/worker/CareerOpportunities';

interface WorkerResultsViewProps {
  userData: any;
}

export const WorkerResultsView: React.FC<WorkerResultsViewProps> = ({ userData }) => {
  return (
    <div>
      <h2>Worker Results</h2>
      <CareerOpportunities />
    </div>
  );
};

export default WorkerResultsView;
