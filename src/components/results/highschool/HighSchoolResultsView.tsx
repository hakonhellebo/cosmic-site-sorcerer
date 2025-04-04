
import React, { useMemo } from 'react';
import HighSchoolIntro from './HighSchoolIntro';
import RecommendedEducation from './RecommendedEducation';
import DimensionsCard from './DimensionsCard';
import CareerOpportunities from './CareerOpportunities';
import { matchEducationPrograms } from '@/utils/educationData';
import { calculateHighSchoolDimensions } from '@/utils/dimensionCalculator';

interface HighSchoolResultsViewProps {
  userData: any;
}

export const HighSchoolResultsView: React.FC<HighSchoolResultsViewProps> = ({ userData }) => {
  const highSchoolData = userData?.questionnaire?.highSchool;
  
  if (!highSchoolData) {
    return <div>Ingen data funnet.</div>;
  }
  
  // Calculate dimensions from the user data
  const dimensions = useMemo(() => calculateHighSchoolDimensions(highSchoolData), [highSchoolData]);
  
  // Get top dimension names for education recommendations
  const topDimensions = dimensions.map(dim => dim.name);
  
  // Match education programs based on dimensions - show more recommendations for variety
  const educationRecommendations = useMemo(() => {
    return matchEducationPrograms(topDimensions, 6);
  }, [topDimensions]);
  
  // Extract needed information from userData for HighSchoolIntro
  // Convert the interests object to a comma-separated string of selected interests
  const selectedInterests = Object.entries(highSchoolData?.interests || {})
    .filter(([_, value]) => value === true)
    .map(([key]) => {
      // Map keys to more readable names
      const interestMap: Record<string, string> = {
        'technology': 'Teknologi',
        'artDesign': 'Kunst og design',
        'sports': 'Fysisk aktivitet og sport',
        'economyFinance': 'Økonomi og finans',
        'travelCulture': 'Reiseliv og kultur',
        'healthCare': 'Helse og omsorg',
        'environmentSustainability': 'Miljø og bærekraft'
      };
      return interestMap[key] || key;
    })
    .join(', ');
  
  // Map learning style to readable format
  let learningStyle = '';
  if (highSchoolData?.learningStyle) {
    if (typeof highSchoolData.learningStyle === 'string') {
      // Handle if it's a direct string value
      learningStyle = highSchoolData.learningStyle;
    } else if (typeof highSchoolData.learningStyle === 'object') {
      // Handle if it's an object with boolean properties
      const selectedStyles = Object.entries(highSchoolData.learningStyle)
        .filter(([_, value]) => value === true)
        .map(([key]) => {
          const styleMap: Record<string, string> = {
            'reading': 'Lesing',
            'listening': 'Lytting',
            'practical': 'Praktisk arbeid',
            'discussing': 'Diskusjon',
            'watching': 'Observasjon'
          };
          return styleMap[key] || key;
        });
      learningStyle = selectedStyles.join(', ');
    }
  }
  
  // Map work preference to readable format
  let workPreference = '';
  if (highSchoolData?.workPreference) {
    const workPreferenceMap: Record<string, string> = {
      'alone': 'Jobbe alene',
      'team': 'Jobbe i team',
      'mixed': 'Kombinasjon av team og selvstendig arbeid'
    };
    workPreference = workPreferenceMap[highSchoolData.workPreference] || highSchoolData.workPreference;
  }
  
  // Define next steps for education recommendations
  const nextSteps = [
    "Undersøk utdanningsprogrammene på utdanning.no",
    "Snakk med en studieveileder på skolen din",
    "Delta på åpen dag på institusjonen",
    "Kontakt studenter som går på programmet for å høre deres erfaringer"
  ];
  
  return (
    <div className="space-y-10">
      {/* Personalized intro for high school students */}
      <HighSchoolIntro 
        dimensions={dimensions}
        interests={selectedInterests}
        learningStyle={learningStyle}
        workPreference={workPreference}
      />
      
      {/* Display top dimensions */}
      <DimensionsCard dimensions={dimensions} />
      
      {/* Education recommendations section */}
      <RecommendedEducation 
        recommendations={educationRecommendations}
        nextSteps={nextSteps}
      />
      
      {/* Career opportunities section - pass the full education recommendations */}
      <CareerOpportunities recommendations={educationRecommendations} maxCount={5} />
    </div>
  );
};
