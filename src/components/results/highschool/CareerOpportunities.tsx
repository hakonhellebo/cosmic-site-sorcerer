
import React, { useState } from 'react';
import { 
  Briefcase, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  Building, 
  ChevronRight,
  UserCircle2
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface CareerOpportunitiesProps {
  recommendations: any[];
  showAllOpportunities?: boolean;
  maxCount?: number;
}

const CareerOpportunities: React.FC<CareerOpportunitiesProps> = ({ 
  recommendations, 
  showAllOpportunities = false, 
  maxCount = 3 
}) => {
  const [expandedProgram, setExpandedProgram] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(showAllOpportunities);
  const [expandedCompanies, setExpandedCompanies] = useState<Record<string, boolean>>({});
  
  // Toggle expanded career
  const toggleProgramDetails = (programName: string) => {
    setExpandedProgram(expandedProgram === programName ? null : programName);
  };
  
  // Toggle company list visibility
  const toggleCompanies = (jobId: string) => {
    setExpandedCompanies(prev => ({
      ...prev,
      [jobId]: !prev[jobId]
    }));
  };
  
  // Determine how many careers to show
  const displayRecommendations = showAll 
    ? recommendations 
    : recommendations.slice(0, maxCount);
    
  return (
    <div className="space-y-6 animate-fade-up">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Karrieremuligheter</h2>
            </div>
            {recommendations.length > maxCount && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowAll(!showAll)}
                className="flex items-center gap-1"
              >
                {showAll ? (
                  <>Vis topp {maxCount} <ChevronUp className="h-4 w-4" /></>
                ) : (
                  <>Vis alle {recommendations.length} <ChevronDown className="h-4 w-4" /></>
                )}
              </Button>
            )}
          </div>
          <p className="text-muted-foreground">
            Dette er mulige karriereveier etter fullført utdanning. Husk at mange yrkesveier er mulige og dette er bare eksempler.
          </p>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {displayRecommendations.map((rec, index) => (
              <Collapsible 
                key={index}
                open={expandedProgram === rec.title} 
                onOpenChange={() => toggleProgramDetails(rec.title)}
                className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <CollapsibleTrigger className="w-full" asChild>
                  <div className="flex justify-between items-center p-4 cursor-pointer bg-muted/30">
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{rec.title}</h3>
                        {index < 3 && <Badge variant="default" className="text-xs">Topp match</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">{rec.match}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="ml-2">
                      {expandedProgram === rec.title ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </Button>
                  </div>
                </CollapsibleTrigger>
                
                <CollapsibleContent className="border-t">
                  <div className="p-4">
                    {rec.description && (
                      <p className="text-sm mb-4">{rec.description}</p>
                    )}
                    
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                      <UserCircle2 className="h-4 w-4 text-primary" />
                      Mulige stillinger etter utdanningen
                    </h4>
                    
                    <div className="space-y-2 mb-4">
                      {rec.careers?.map((career: any, careerIndex: number) => {
                        const jobId = `${rec.title}-${careerIndex}`;
                        
                        return (
                          <div key={careerIndex} className="bg-muted/30 p-3 rounded-md">
                            <div 
                              className="flex justify-between items-center cursor-pointer" 
                              onClick={() => toggleCompanies(jobId)}
                            >
                              <span className="font-medium text-sm">{career.title}</span>
                              <Button variant="ghost" size="icon">
                                {expandedCompanies[jobId] ? 
                                  <ChevronUp size={16} /> : 
                                  <ChevronDown size={16} />
                                }
                              </Button>
                            </div>
                            
                            {expandedCompanies[jobId] && career.companies?.length > 0 && (
                              <div className="mt-2 pl-2 border-l-2 border-muted">
                                <h5 className="text-xs font-medium mb-1 flex items-center gap-1">
                                  <Building className="h-3 w-3 text-muted-foreground" />
                                  Eksempler på arbeidsplasser
                                </h5>
                                <ul className="space-y-1">
                                  {career.companies.map((company: any, idx: number) => (
                                    <li key={idx} className="text-xs flex items-center">
                                      <ChevronRight className="h-3 w-3 text-muted-foreground mr-1" />
                                      {typeof company === 'string' 
                                        ? company 
                                        : company.name ? company.name : JSON.stringify(company)}
                                      {company.website && (
                                        <a 
                                          href={company.website} 
                                          target="_blank" 
                                          rel="noopener noreferrer" 
                                          className="ml-1 inline-flex items-center text-primary hover:underline"
                                        >
                                          <ExternalLink className="h-3 w-3" />
                                        </a>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    
                    {rec.institution && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-1">Utdanningsinstitusjoner</h4>
                        <p className="text-sm">{rec.institution}</p>
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
          
          <div className="flex justify-center mt-6">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowAll(!showAll)}
              className="flex items-center gap-1"
            >
              {showAll ? (
                <>Vis færre karrieremuligheter <ChevronUp className="h-4 w-4" /></>
              ) : (
                <>Vis flere karrieremuligheter <ChevronDown className="h-4 w-4" /></>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CareerOpportunities;
