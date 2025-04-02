
import React, { useMemo, useState } from 'react';
import { ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { getCareerRecommendations } from '@/utils/careerRecommendations';

interface CareerOpportunitiesProps {
  recommendations: {
    title: string;
    institution: string;
    match: string;
    description: string;
    careers: string[];
  }[];
  showAllOpportunities?: boolean;
  maxCount?: number;
}

const CareerOpportunities: React.FC<CareerOpportunitiesProps> = ({ 
  recommendations, 
  showAllOpportunities = false,
  maxCount = 6
}) => {
  const [expandedCareer, setExpandedCareer] = useState<string | null>(null);
  
  // Get education program names from recommendations
  const educationPrograms = useMemo(() => 
    recommendations.map(rec => rec.title),
    [recommendations]
  );
  
  // Get detailed career info from careerRecommendations utility
  const careerDetails = useMemo(() => {
    console.log("Getting career details for education programs:", educationPrograms);
    return getCareerRecommendations(educationPrograms);
  }, [educationPrograms]);
  
  // Extract all unique career paths from recommendations and career details
  const allCareers = useMemo(() => {
    console.log("Extracting all careers from recommendations");
    
    // First get all careers from education recommendations
    const recommendedCareers = recommendations.flatMap(rec => rec.careers || []);
    
    // Then get all careers from detailed career data (which is more accurate)
    const detailedCareers = careerDetails.flatMap(detail => 
      detail.jobs?.map(job => job.title) || []
    );
    
    // Combine both sources and remove duplicates
    const allSourcesCareers = [...recommendedCareers, ...detailedCareers];
    
    return allSourcesCareers.filter((career, index, self) => 
      index === self.findIndex(c => c.toLowerCase() === career.toLowerCase())
    );
  }, [recommendations, careerDetails]);
  
  // Toggle expanded career
  const toggleCareerDetails = (career: string) => {
    setExpandedCareer(expandedCareer === career ? null : career);
  };
  
  // Find career details for a specific job title
  const findCareerDetails = (jobTitle: string) => {
    // Look through all career details to find which education program has this job
    for (const detail of careerDetails) {
      const matchingJob = detail.jobs?.find(job => 
        job.title.toLowerCase() === jobTitle.toLowerCase()
      );
      
      if (matchingJob) {
        return {
          job: matchingJob,
          program: detail
        };
      }
    }
    
    return null;
  };
  
  // Group careers into rows of 3
  const careerRows = useMemo(() => {
    const rows = [];
    const displayedCareers = showAllOpportunities ? allCareers : allCareers.slice(0, maxCount);
    
    for (let i = 0; i < displayedCareers.length; i += 3) {
      rows.push(displayedCareers.slice(i, i + 3));
    }
    
    return rows;
  }, [allCareers, showAllOpportunities, maxCount]);
  
  return (
    <div className="animate-fade-up">
      <h3 className="text-2xl font-semibold mb-6">Karrieremuligheter</h3>
      
      {/* Display careers in rows of 3 */}
      <h3 className="text-xl font-semibold mb-4">Stillingstitler du kan sikte mot</h3>
      
      {careerRows.map((row, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {row.map((career, idx) => {
            // Find the details for this career
            const careerDetail = findCareerDetails(career);
            const isExpanded = expandedCareer === career;
            
            return (
              <Card key={idx} className="bg-card border hover:shadow-md transition-shadow h-full">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-lg">{career}</h4>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => toggleCareerDetails(career)}
                      className="p-1"
                    >
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {careerDetail?.job?.description || "Basert på dine interesser og styrker"}
                  </p>
                  
                  {isExpanded && careerDetail && (
                    <div className="mt-4 space-y-4">
                      {careerDetail.program.educationProgram && (
                        <div>
                          <h5 className="text-sm font-medium">Relevant utdanning</h5>
                          <p className="text-sm">{careerDetail.program.educationProgram}</p>
                        </div>
                      )}
                      
                      {careerDetail.program.companies && careerDetail.program.companies.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium">Eksempler på arbeidsplasser</h5>
                          <ul className="text-sm mt-1 space-y-1">
                            {careerDetail.program.companies.slice(0, 5).map((company, i) => (
                              <li key={i} className="flex items-center">
                                <a 
                                  href={company.website} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline flex items-center"
                                >
                                  {company.name}
                                  <ExternalLink size={14} className="ml-1" />
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {careerDetail.program.match && (
                        <div className="bg-primary/10 p-2 rounded-md text-sm mt-2">
                          {careerDetail.program.match}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ))}
      
      {!showAllOpportunities && allCareers.length > maxCount && (
        <div className="mt-4">
          <Button variant="outline">
            Se flere karrieremuligheter
          </Button>
        </div>
      )}
      
      <div className="mt-8 p-4 bg-muted/30 rounded-lg">
        <p className="text-sm">
          <span className="font-medium">Tips:</span> Disse yrkene er basert på 
          utdanningene som matcher din profil. Du kan utforske dem for å få en bedre 
          forståelse av mulige karriereveier.
        </p>
      </div>
    </div>
  );
};

export default CareerOpportunities;
