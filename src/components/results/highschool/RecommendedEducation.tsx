
import React from 'react';
import { Dimension } from '@/utils/dimensions/types';
import { School, ExternalLink, PlusCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RecommendedEducationProps {
  dimensions?: Dimension[];
  recommendations?: Array<{
    title: string;
    institution: string;
    description: string;
    link?: string;
  }>;
  nextSteps?: string[];
}

const RecommendedEducation: React.FC<RecommendedEducationProps> = ({ 
  dimensions = [], 
  recommendations = [],
  nextSteps = []
}) => {
  // Default recommendations if none provided
  const defaultRecommendations = [
    {
      title: "Studiespesialisering med realfag",
      institution: "Videregående skoler",
      description: "Fokus på matematikk, fysikk og naturfag.",
      link: "https://utdanning.no/utdanning/vgs/ssrea"
    },
    {
      title: "Medieproduksjon",
      institution: "Videregående skoler",
      description: "For deg som er kreativ og interessert i media og kommunikasjon.",
      link: "https://utdanning.no/utdanning/vgs/kda3_01"
    },
    {
      title: "Helse- og oppvekstfag",
      institution: "Videregående skoler",
      description: "For deg som vil jobbe med mennesker og helse.",
      link: "https://utdanning.no/utdanning/vgs/hshea"
    }
  ];

  // Default next steps if none provided
  const defaultNextSteps = [
    "Ta kontakt med rådgiver for å diskutere karrierevalg",
    "Undersøk aktuelle utdanningsprogrammer på utdanning.no",
    "Delta på åpen dag på videregående skoler du er interessert i",
    "Snakk med noen som jobber i bransjen du er interessert i"
  ];

  // Use provided data or defaults
  const educationRecommendations = recommendations.length > 0 ? recommendations : defaultRecommendations;
  const steps = nextSteps.length > 0 ? nextSteps : defaultNextSteps;

  return (
    <div className="bg-card p-6 rounded-lg border animate-fade-up">
      <div className="flex items-center mb-4">
        <School className="h-5 w-5 mr-2 text-primary" />
        <h2 className="text-xl font-semibold">Anbefalte utdanningsveier</h2>
      </div>
      
      <p className="text-muted-foreground mb-6">
        Basert på dine interesser og styrker har vi funnet noen utdanningsveier som kan passe for deg.
      </p>
      
      <div className="space-y-4 mb-8">
        {educationRecommendations.map((rec, index) => (
          <div key={index} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-lg">{rec.title}</h3>
                <p className="text-sm text-muted-foreground">{rec.institution}</p>
              </div>
              {rec.link && (
                <a 
                  href={rec.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-primary hover:underline inline-flex items-center text-sm"
                >
                  <span className="mr-1">Les mer</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
            <p className="mt-2">{rec.description}</p>
          </div>
        ))}
        
        <Button variant="outline" className="w-full mt-2 flex items-center justify-center gap-1">
          <PlusCircle className="h-4 w-4" />
          <span>Vis flere alternativer</span>
        </Button>
      </div>
      
      <div className="mt-8">
        <h3 className="font-semibold mb-3">Neste steg</h3>
        <div className="space-y-2">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start">
              <ArrowRight className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
              <p>{step}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecommendedEducation;
