
import React, { useState } from 'react';
import { Check, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface RecommendedEducationProps {
  recommendations: any[];
  nextSteps: string[];
  showAllRecommendations?: boolean;
  title?: string;
  subtitle?: string;
  maxCount?: number;
}

const RecommendedEducation: React.FC<RecommendedEducationProps> = ({ 
  recommendations, 
  nextSteps,
  showAllRecommendations = false,
  title = "Anbefalte utdanningsprogrammer",
  subtitle = "Basert på din profil, her er noen utdanningsprogrammer som kan passe for deg",
  maxCount = 6
}) => {
  const [expandedProgram, setExpandedProgram] = useState<string | null>(null);
  
  // Toggle expanded education program
  const toggleProgramDetails = (programName: string) => {
    setExpandedProgram(expandedProgram === programName ? null : programName);
  };
  
  // Determine how many recommendations to show (all, or just the specified max)
  const displayRecommendations = showAllRecommendations 
    ? recommendations 
    : recommendations.slice(0, maxCount);
  
  return (
    <div className="space-y-6 animate-fade-up">
      <div className="bg-card p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-muted-foreground mb-6">{subtitle}</p>
        
        <div className="space-y-4">
          {displayRecommendations.map((rec, index) => (
            <Collapsible 
              key={index}
              open={expandedProgram === rec.name} 
              onOpenChange={() => toggleProgramDetails(rec.name)}
              className="border rounded-lg overflow-hidden bg-muted/30 hover:shadow-md transition-shadow"
            >
              <CollapsibleTrigger className="w-full" asChild>
                <div className="flex justify-between items-center p-4 cursor-pointer">
                  <div className="text-left">
                    <h3 className="font-semibold">{rec.name}</h3>
                    <p className="text-sm text-muted-foreground">{rec.match}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="ml-2">
                    {expandedProgram === rec.name ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </Button>
                </div>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="border-t">
                <div className="p-4 space-y-4">
                  <p className="text-sm">{rec.description || 'Dette studieprogrammet passer med din profil.'}</p>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Utdanningsinstitusjoner</h4>
                    <p className="text-sm">{rec.institution}</p>
                  </div>
                  
                  {rec.requirements && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Opptakskrav</h4>
                      <p className="text-sm">{rec.requirements}</p>
                    </div>
                  )}
                  
                  {rec.link && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Les mer</h4>
                      <a 
                        href={rec.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-primary hover:underline inline-flex items-center text-sm"
                      >
                        Se utdanningen <ExternalLink size={14} className="ml-1" />
                      </a>
                    </div>
                  )}
                  
                  {rec.highlights && (
                    <div className="mt-3">
                      <h4 className="text-sm font-medium mb-2">Fordeler</h4>
                      {rec.highlights?.map((highlight: string, idx: number) => (
                        <div key={idx} className="text-sm flex items-start mb-1">
                          <Check className="h-4 w-4 mr-1 mt-0.5 text-green-500 flex-shrink-0" />
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
        
        {nextSteps.length > 0 && (
          <div className="mt-6 bg-muted/40 p-4 rounded-md">
            <h3 className="font-medium mb-2">Neste steg</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {nextSteps.map((step, index) => (
                <li key={index} className="flex items-start">
                  <Check className="h-5 w-5 mr-2 mt-0.5 text-primary flex-shrink-0" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendedEducation;
