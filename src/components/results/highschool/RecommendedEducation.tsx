
import React, { useState } from 'react';
import { Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { EducationRecommendation } from '@/utils/educationData';

interface RecommendedEducationProps {
  recommendations: EducationRecommendation[];
  nextSteps: string[];
  showAllRecommendations?: boolean;
}

const RecommendedEducation: React.FC<RecommendedEducationProps> = ({ 
  recommendations, 
  nextSteps,
  showAllRecommendations = false 
}) => {
  const [showMore, setShowMore] = useState(false);
  const displayedRecommendations = showMore ? recommendations : recommendations.slice(0, 3);
  
  // Format institutions to display nicely
  const formatInstitutions = (institutions: string) => {
    // Split by commas and remove duplicates
    const institutionList = [...new Set(institutions.split(', '))];
    
    if (institutionList.length <= 2) {
      return institutions;
    } else {
      // If there are many institutions, show first two and a count
      return `${institutionList[0]}, ${institutionList[1]} og ${institutionList.length - 2} flere`;
    }
  };
  
  return (
    <div className="animate-fade-up">
      <h3 className="text-2xl font-semibold mb-6">Anbefalte utdanninger</h3>
      <div className="grid grid-cols-1 gap-4 mb-8">
        {displayedRecommendations.map((edu, idx) => (
          <div 
            key={idx} 
            className="bg-card border rounded-lg p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
              <h4 className="font-semibold text-lg">{edu.name}</h4>
              {edu.link && (
                <a 
                  href={edu.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 flex items-center gap-1 text-sm"
                >
                  <span>Les mer</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
            
            <p className="text-sm text-muted-foreground mb-3">{formatInstitutions(edu.institution)}</p>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value={`item-${idx}`}>
                <AccordionTrigger className="text-sm py-2">Vis mer informasjon</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pt-2">
                    {edu.institutions && (
                      <div>
                        <span className="font-medium text-sm">Tilbys ved:</span> 
                        <span className="text-sm"> {edu.institution}</span>
                      </div>
                    )}
                    {edu.requirements && (
                      <div>
                        <span className="font-medium text-sm">Opptakskrav:</span> 
                        <span className="text-sm"> {edu.requirements}</span>
                      </div>
                    )}
                    {edu.description && (
                      <div>
                        <span className="font-medium text-sm">Beskrivelse:</span>
                        <p className="text-sm">{edu.description}</p>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <div className="bg-muted/40 p-3 rounded mt-3">
              <p className="text-sm">{edu.match}</p>
            </div>
          </div>
        ))}
      </div>
      
      {showAllRecommendations && recommendations.length > 3 && (
        <div className="flex justify-center mb-8">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => setShowMore(!showMore)}
          >
            <span>{showMore ? 'Vis færre utdanningsmuligheter' : 'Vis flere utdanningsmuligheter'}</span>
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      {/* Next steps */}
      <div className="bg-muted/10 p-6 rounded-lg border">
        <h3 className="text-xl font-semibold mb-4">Neste steg</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {nextSteps.map((step, idx) => (
            <li key={idx} className="flex items-start">
              <Check className="h-5 w-5 mr-2 mt-0.5 text-primary flex-shrink-0" />
              <span>{step}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecommendedEducation;
