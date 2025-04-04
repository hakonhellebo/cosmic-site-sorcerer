
import React from 'react';
import HighSchoolResultsGenerator from './generators/HighSchoolResultsGenerator';
import UniversityResultsGenerator from './generators/UniversityResultsGenerator';
import WorkerResultsGenerator from './generators/WorkerResultsGenerator';
import DefaultResultsGenerator from './generators/DefaultResultsGenerator';

interface ResultsGeneratorProps {
  userData: any;
  userType?: 'highSchool' | 'university' | 'worker';
}

const ResultsGenerator: React.FC<ResultsGeneratorProps> = ({ userData, userType }) => {
  // Extract user's questionnaire data
  const questionnaire = userData.questionnaire || {};
  
  // Render appropriate generator based on user type
  if (userType === 'highSchool') {
    return <HighSchoolResultsGenerator userData={userData} />;
  } 
  else if (userType === 'university') {
    return <UniversityResultsGenerator userData={userData} />;
  } 
  else if (userType === 'worker') {
    return <WorkerResultsGenerator userData={userData} />;
  }
  else {
    // Default/fallback view when user type is not specified
    return <DefaultResultsGenerator userData={userData} />;
  }
};

export default ResultsGenerator;
