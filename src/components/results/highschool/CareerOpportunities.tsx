
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink, Building } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Company {
  name: string;
  website: string;
}

interface Career {
  title: string;
  description: string;
}

interface CareerRecommendation {
  title: string;
  institution?: string;
  match?: string;
  description?: string;
  careers: Career[];
  companies?: Company[];
}

interface CareerOpportunitiesProps {
  recommendations: CareerRecommendation[];
  showAllOpportunities?: boolean;
  maxCount?: number;
}

const CareerOpportunities: React.FC<CareerOpportunitiesProps> = ({ 
  recommendations, 
  showAllOpportunities = false,
  maxCount = 6
}) => {
  const [expandedCareers, setExpandedCareers] = useState<{[key: string]: boolean}>({});
  const [showAll, setShowAll] = useState(showAllOpportunities);
  
  // Filter recommendations to only show maxCount if not showing all
  const visibleRecommendations = showAll 
    ? recommendations 
    : recommendations.slice(0, maxCount);
  
  const toggleCareerExpand = (careerKey: string) => {
    setExpandedCareers(prev => ({
      ...prev,
      [careerKey]: !prev[careerKey]
    }));
  };
  
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="bg-muted/30 p-6 rounded-lg">
        <p>Ingen karrieremuligheter funnet</p>
      </div>
    );
  }
  
  return (
    <div className="animate-fade-up">
      <h3 className="text-2xl font-semibold mb-6">Karrieremuligheter</h3>
      <p className="text-muted-foreground mb-6">
        Basert på anbefalte utdanninger, her er noen karrieremuligheter som kan passe for deg
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {visibleRecommendations.map((rec, recIndex) => {
          // Ensure we have at least some careers to display
          const careers = rec.careers && rec.careers.length > 0 
            ? rec.careers.slice(0, 3) 
            : [{ title: "Ingen karrieremuligheter funnet", description: "Prøv en annen utdanning" }];
            
          return (
            <div key={`${rec.title}-${recIndex}`} className="bg-white border rounded-lg shadow-sm overflow-hidden">
              <div className="p-5 border-b">
                <h4 className="font-semibold text-lg">{rec.title}</h4>
                {rec.match && <p className="text-sm text-muted-foreground mt-1">{rec.match}</p>}
              </div>
              
              <div className="divide-y">
                {careers.map((career, careerIndex) => {
                  const careerKey = `${rec.title}-${careerIndex}`;
                  const isExpanded = expandedCareers[careerKey] || false;
                  
                  // Get companies for this education program
                  const companies = rec.companies || [];
                  
                  return (
                    <div key={careerKey} className="p-4">
                      <div 
                        className="flex justify-between items-center cursor-pointer" 
                        onClick={() => toggleCareerExpand(careerKey)}
                      >
                        <div className="font-medium">{career.title}</div>
                        <div>
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                      
                      <div className={cn(
                        "overflow-hidden transition-all duration-300",
                        isExpanded ? "max-h-96 mt-3" : "max-h-0"
                      )}>
                        <p className="text-sm text-muted-foreground mb-3">{career.description}</p>
                        
                        {companies.length > 0 && (
                          <div className="mt-3">
                            <div className="font-medium text-sm mb-1 flex items-center">
                              <Building className="h-4 w-4 mr-1" />
                              <span>Mulige arbeidsplasser</span>
                            </div>
                            <div className="space-y-1.5">
                              {companies.slice(0, 5).map((company, idx) => (
                                <a 
                                  key={idx}
                                  href={company.website} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center text-sm text-primary hover:underline"
                                >
                                  <span>{company.name}</span>
                                  <ExternalLink className="h-3 w-3 ml-1" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      
      {recommendations.length > maxCount && !showAll && (
        <div className="text-center mt-6">
          <Button 
            variant="outline" 
            onClick={() => setShowAll(true)}
            className="inline-flex items-center gap-2"
          >
            <span>Se alle karrieremuligheter</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default CareerOpportunities;
