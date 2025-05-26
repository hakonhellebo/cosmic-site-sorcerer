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

  // Calculate local dimension scores
  const localDimensionScores = useMemo(() => {
    return calculateUniversityDimensions(universityData);
  }, [universityData]);
  
  // Use local dimensions regardless of API status for consistency
  const dimensions = useMemo(() => {
    return getTopDimensions(localDimensionScores, 3);
  }, [localDimensionScores]);
  
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
            ✅ Bruker EdPath AI-anbefalinger for studier og karrieremuligheter
          </p>
          <p className="text-green-700 text-xs mt-1">
            Dimensjoner beregnes fortsatt lokalt for å sikre konsistens
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
