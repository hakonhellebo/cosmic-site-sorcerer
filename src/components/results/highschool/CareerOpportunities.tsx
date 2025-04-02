
import React, { useMemo, useState } from 'react';
import { ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
}

const CareerOpportunities: React.FC<CareerOpportunitiesProps> = ({ recommendations, showAllOpportunities = false }) => {
  const [expandedCareer, setExpandedCareer] = useState<string | null>(null);
  
  // Extract all career paths from recommendations, remove duplicates
  const allCareers = useMemo(() => {
    const careers = recommendations.flatMap(rec => rec.careers || []);
    // Filter out duplicate careers by comparing lowercased strings
    return careers.filter((career, index, self) => 
      index === self.findIndex(c => c.toLowerCase() === career.toLowerCase())
    );
  }, [recommendations]);
  
  // Get detailed career info from careerRecommendations utility
  const careerDetails = useMemo(() => {
    // Get education program names from recommendations
    const educationPrograms = recommendations.map(rec => rec.title);
    // Get detailed career info
    return getCareerRecommendations(educationPrograms);
  }, [recommendations]);
  
  // Toggle expanded career
  const toggleCareerDetails = (career: string) => {
    if (expandedCareer === career) {
      setExpandedCareer(null);
    } else {
      setExpandedCareer(career);
    }
  };
  
  // Limit to 6 careers unless showAllOpportunities is true
  const displayedCareers = showAllOpportunities ? allCareers : allCareers.slice(0, 6);
  
  return (
    <div className="animate-fade-up">
      <h3 className="text-2xl font-semibold mb-6">Karrieremuligheter</h3>
      
      <div className="grid grid-cols-1 gap-4 mb-8">
        {displayedCareers.map((career, idx) => {
          // Find the career details that include this job title
          const matchingProgram = careerDetails.find(program => 
            program.jobs && program.jobs.some(job => job.title === career)
          );
          
          // Find the specific job details
          const jobDetails = matchingProgram?.jobs?.find(job => job.title === career);
          
          const isExpanded = expandedCareer === career;
          
          return (
            <Card key={idx} className="bg-card border hover:shadow-md transition-shadow">
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
                  {jobDetails?.description || "Basert på dine interesser og styrker"}
                </p>
                
                {isExpanded && matchingProgram && (
                  <div className="mt-4 space-y-4">
                    {matchingProgram.educationProgram && (
                      <div>
                        <h5 className="text-sm font-medium">Relevant utdanning</h5>
                        <p className="text-sm">{matchingProgram.educationProgram}</p>
                      </div>
                    )}
                    
                    {matchingProgram.companies && matchingProgram.companies.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium">Eksempler på arbeidsplasser</h5>
                        <ul className="text-sm mt-1 space-y-1">
                          {matchingProgram.companies.slice(0, 3).map((company, i) => (
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
                    
                    {matchingProgram.match && (
                      <div className="bg-primary/10 p-2 rounded-md text-sm mt-2">
                        {matchingProgram.match}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {!showAllOpportunities && allCareers.length > 6 && (
        <div className="mt-4">
          <Button variant="outline">
            Se flere karrieremuligheter
          </Button>
        </div>
      )}
      
      <div className="mt-8 p-4 bg-muted/30 rounded-lg">
        <p className="text-sm">
          <span className="font-medium">Tips:</span> Disse yrkene er basert på 
          utdanningene som matcher din profil. Du kan klikke på utdanningene over 
          for å lese mer om dem.
        </p>
      </div>
    </div>
  );
};

export default CareerOpportunities;
