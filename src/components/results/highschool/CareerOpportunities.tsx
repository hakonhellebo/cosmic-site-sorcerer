
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
import { getCareerRecommendations } from "@/utils/careerRecommendations";

interface CareerOpportunitiesProps {
  recommendations: any[];
  showAllOpportunities?: boolean;
  maxCount?: number;
}

// Default fallback jobs to display when no specific careers are found
const DEFAULT_CAREERS = [
  { title: "Rådgiver", description: "Gir faglige råd og veiledning basert på din kompetanse." },
  { title: "Forsker", description: "Utfører forskningsarbeid innenfor relevante fagområder." },
  { title: "Faglærer", description: "Underviser andre i ditt spesialområde." },
  { title: "Bransjeanalytiker", description: "Analyserer trender og utvikling innen relevante bransjer." },
  { title: "Produktspesialist", description: "Utvikler, implementerer eller markedsfører spesialiserte produkter innen ditt fagfelt." }
];

// Default companies to show when no specific companies are found
const DEFAULT_COMPANIES = [
  { name: "Universiteter og høyskoler", website: "https://www.samordnaopptak.no" },
  { name: "Forskningsinstitusjoner", website: "https://www.forskningsradet.no" },
  { name: "Offentlige virksomheter", website: "https://www.nav.no" },
  { name: "Konsulentselskaper", website: "https://www.finn.no/job" },
  { name: "Bransjeorganisasjoner", website: "https://www.nho.no" }
];

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
    
  // Ensure career data is enriched with full information from the utility
  const enhancedRecommendations = React.useMemo(() => {
    // Get education program names to fetch career data
    const educationProgramNames = recommendations.map(rec => rec.title);
    
    // Get complete career data from our utility
    const careerData = getCareerRecommendations(educationProgramNames);
    
    // Merge the career data with our recommendations
    return displayRecommendations.map(rec => {
      // Find matching career data by program name
      const matchingCareerData = careerData.find(career => 
        (career.educationProgram.toLowerCase().includes(rec.title.toLowerCase()) ||
        rec.title.toLowerCase().includes(career.educationProgram.toLowerCase()))
      );
      
      if (matchingCareerData) {
        // Map jobs to include company data
        const careersWithCompanies = matchingCareerData.jobs && matchingCareerData.jobs.length > 0 
          ? matchingCareerData.jobs.map((job, idx) => {
              // Assign relevant companies to each job
              const startIdx = idx * 3 % Math.max(matchingCareerData.companies?.length || 1, 1);
              const jobSpecificCompanies = matchingCareerData.companies?.length 
                ? [
                    ...matchingCareerData.companies.slice(startIdx, startIdx + 3),
                    ...matchingCareerData.companies.slice(0, Math.max(0, 3 - (matchingCareerData.companies.length - startIdx)))
                  ].slice(0, 3)
                : DEFAULT_COMPANIES.slice(0, 3);
                
              return {
                title: job.title,
                description: job.description,
                companies: jobSpecificCompanies
              };
            })
          : DEFAULT_CAREERS.map((defaultJob, idx) => {
              return {
                ...defaultJob,
                companies: DEFAULT_COMPANIES.slice(0, 3)
              };
            });
        
        return {
          ...rec,
          careers: careersWithCompanies
        };
      }
      
      // If no matching career data, use default careers
      return {
        ...rec,
        careers: rec.careers && rec.careers.length > 0 
          ? rec.careers 
          : DEFAULT_CAREERS.map(job => ({
              ...job,
              companies: DEFAULT_COMPANIES.slice(0, 3)
            }))
      };
    });
  }, [displayRecommendations]);
  
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
            {enhancedRecommendations.map((rec, index) => (
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
                      {rec.careers && rec.careers.length > 0 ? (
                        rec.careers.map((career: any, careerIndex: number) => {
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
                              
                              {expandedCompanies[jobId] && (
                                <div className="mt-2 pl-2 border-l-2 border-muted space-y-3">
                                  {career.description && (
                                    <p className="text-xs text-muted-foreground">{career.description}</p>
                                  )}
                                  
                                  {career.companies?.length > 0 && (
                                    <div>
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
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <div className="space-y-2 mb-4">
                          {DEFAULT_CAREERS.map((career, careerIndex) => {
                            const jobId = `${rec.title}-default-${careerIndex}`;
                            
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
                                
                                {expandedCompanies[jobId] && (
                                  <div className="mt-2 pl-2 border-l-2 border-muted space-y-3">
                                    <p className="text-xs text-muted-foreground">{career.description}</p>
                                    
                                    <div>
                                      <h5 className="text-xs font-medium mb-1 flex items-center gap-1">
                                        <Building className="h-3 w-3 text-muted-foreground" />
                                        Eksempler på arbeidsplasser
                                      </h5>
                                      <ul className="space-y-1">
                                        {DEFAULT_COMPANIES.slice(0, 3).map((company, idx) => (
                                          <li key={idx} className="text-xs flex items-center">
                                            <ChevronRight className="h-3 w-3 text-muted-foreground mr-1" />
                                            {company.name}
                                            <a 
                                              href={company.website} 
                                              target="_blank" 
                                              rel="noopener noreferrer" 
                                              className="ml-1 inline-flex items-center text-primary hover:underline"
                                            >
                                              <ExternalLink className="h-3 w-3" />
                                            </a>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
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
