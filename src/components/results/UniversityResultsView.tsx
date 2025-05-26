import React, { useMemo, useState, useEffect } from 'react';
import { matchEducationPrograms } from '@/utils/educationData';
import UniversityIntro from './university/UniversityIntro';
import NextSteps from './university/NextSteps';
import BasicInfoCards from './university/BasicInfoCards';
import UniversityDimensions from './university/UniversityDimensions';
import UniversityEducation from './university/UniversityEducation';
import UniversityCareers from './university/UniversityCareers';
import { calculateUniversityDimensions, getTopDimensions } from '@/utils/universityDimensionCalculator';
import { getRecommendationsFromApi, EdPathApiResponse } from '@/services/edpathApi';
import { mapUniversityAnswersToApi } from '@/utils/universityApiMapper';
import { toast } from 'sonner';

interface UniversityResultsViewProps {
  userData: any;
}

export const UniversityResultsView: React.FC<UniversityResultsViewProps> = ({ userData }) => {
  const universityData = userData?.questionnaire?.university;
  const [apiRecommendations, setApiRecommendations] = useState<EdPathApiResponse | null>(null);
  const [isLoadingApi, setIsLoadingApi] = useState(true);
  const [useApiRecommendations, setUseApiRecommendations] = useState(false);
  
  if (!universityData) {
    return <div>Ingen data funnet</div>;
  }
  
  // Try to get recommendations from API
  useEffect(() => {
    const fetchApiRecommendations = async () => {
      try {
        setIsLoadingApi(true);
        const mappedAnswers = mapUniversityAnswersToApi(universityData);
        const recommendations = await getRecommendationsFromApi(mappedAnswers);
        setApiRecommendations(recommendations);
        setUseApiRecommendations(true);
        console.log("Successfully loaded API recommendations");
      } catch (error) {
        console.warn("Failed to load API recommendations, falling back to local calculation:", error);
        toast.warning("Bruker lokal beregning", {
          description: "Kunne ikke koble til EdPath API, bruker eksisterende anbefalinger"
        });
        setUseApiRecommendations(false);
      } finally {
        setIsLoadingApi(false);
      }
    };
    
    fetchApiRecommendations();
  }, [universityData]);
  
  // Extract interests and strengths (keep existing logic)
  const interests = useMemo(() => {
    return Object.keys(universityData.interests || {})
      .filter(key => universityData.interests[key] === true);
  }, [universityData.interests]);
  
  const strengths = useMemo(() => {
    return Object.keys(universityData.strengths || {})
      .filter(key => universityData.strengths[key] === true);
  }, [universityData.strengths]);
  
  // Determine if bachelor or master student
  const isBachelorStudent = universityData.level?.toLowerCase().includes('bachelor');

  // Use API recommendations or fall back to existing logic
  const dimensionScores = useMemo(() => {
    if (useApiRecommendations && apiRecommendations) {
      // Create mock dimension scores based on API response
      const mockScores = {
        analytisk: 0,
        kreativitet: 0,
        struktur: 0,
        sosialitet: 0,
        teknologi: 0,
        helseinteresse: 0,
        bærekraft: 0,
        ambisjon: 0,
        selvstendighet: 0,
        praktisk: 0
      };
      
      // Give high scores to the top dimensions from API
      apiRecommendations.topp_dimensjoner.forEach((dim, index) => {
        const score = 10 - index; // First dimension gets 10, second gets 9, etc.
        const dimKey = dim.toLowerCase() as keyof typeof mockScores;
        if (mockScores.hasOwnProperty(dimKey)) {
          mockScores[dimKey] = score;
        }
      });
      
      return mockScores;
    }
    return calculateUniversityDimensions(universityData);
  }, [universityData, useApiRecommendations, apiRecommendations]);
  
  // Get top 3 dimensions
  const dimensions = useMemo(() => {
    return getTopDimensions(dimensionScores, 3);
  }, [dimensionScores]);
  
  // Get top dimension names for education recommendations
  const topDimensions = dimensions.map(dim => dim.name);
  
  // Match education programs - use API data if available, otherwise fall back to existing logic
  const educationRecommendations = useMemo(() => {
    if (useApiRecommendations && apiRecommendations) {
      // Transform API response to match existing format
      return apiRecommendations.studier.map(studie => ({
        name: studie.navn,
        institution: studie.lærested,
        match: `Matches dimensions: ${studie.dimensjoner.join(', ')}`,
        description: `This program aligns with your top dimensions: ${studie.dimensjoner.join(', ')}`
      }));
    }
    return matchEducationPrograms(topDimensions, 8);
  }, [topDimensions, useApiRecommendations, apiRecommendations]);

  // Show loading state
  if (isLoadingApi) {
    return (
      <div className="space-y-10">
        <div className="text-center py-8">
          <p>Henter personlige anbefalinger...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-10">
      {/* Show API status */}
      {useApiRecommendations && apiRecommendations && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 text-sm">
            ✅ Bruker EdPath AI-anbefalinger basert på dine svar
          </p>
        </div>
      )}
      
      {/* Personalized intro for university students */}
      <UniversityIntro 
        isBachelorStudent={isBachelorStudent} 
        dimensions={dimensions} 
      />
      
      {/* Dimension Ranking */}
      <UniversityDimensions userData={userData} />
      
      {/* Basic info cards */}
      <BasicInfoCards 
        universityData={universityData}
        interests={interests}
        strengths={strengths}
      />

      {/* Education recommendations section */}
      <UniversityEducation 
        recommendations={educationRecommendations}
        isBachelorStudent={isBachelorStudent}
      />
      
      {/* Career opportunities section - enhanced with API data if available */}
      <UniversityCareers 
        recommendations={educationRecommendations}
        apiCareers={useApiRecommendations && apiRecommendations ? apiRecommendations.studier : undefined}
      />
      
      {/* Next steps section */}
      <NextSteps />
    </div>
  );
};
