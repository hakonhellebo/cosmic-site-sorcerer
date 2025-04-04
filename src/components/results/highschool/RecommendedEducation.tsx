
import React, { useState } from 'react';
import { Check, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Dimension } from '@/utils/dimensions/types';

interface RecommendedEducationProps {
  recommendations?: any[];
  nextSteps?: string[];
  showAllRecommendations?: boolean;
  title?: string;
  subtitle?: string;
  maxCount?: number;
  dimensions?: Dimension[];
}

const RecommendedEducation: React.FC<RecommendedEducationProps> = ({ 
  recommendations = [], 
  nextSteps = [],
  showAllRecommendations = false,
  title = "Anbefalte utdanningsprogrammer",
  subtitle = "Basert på din profil, her er noen utdanningsprogrammer som kan passe for deg",
  maxCount = 3,
  dimensions = []
}) => {
  const [expandedProgram, setExpandedProgram] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(showAllRecommendations);
  
  // Generate some default recommendations based on dimensions if none provided
  const actualRecommendations = recommendations.length > 0 ? recommendations : [
    {
      name: "Studiespesialisering",
      match: "analytiske og strukturerte egenskaper",
      description: "Gir generell studiekompetanse for høyere utdanning og er et godt valg hvis du vil holde mulighetene åpne.",
      institution: "Tilbys ved de fleste videregående skoler",
      requirements: "Fullført grunnskole",
      highlights: ["Åpner for mange muligheter videre", "Bred kunnskapsbase", "Godt grunnlag for høyere utdanning"]
    },
    {
      name: "Teknologi og industrifag",
      match: "teknologiske interesser og praktiske ferdigheter",
      description: "For deg som er interessert i teknologi, robotikk, programmering og praktisk arbeid.",
      institution: "Tilbys ved mange yrkesfaglige skoler",
      requirements: "Fullført grunnskole",
      highlights: ["Praktisk læring", "Mulighet for læretid i bedrift", "Etterspurt kompetanse"]
    },
    {
      name: "Medier og kommunikasjon",
      match: "kreative evner og kommunikasjonsferdigheter",
      description: "For deg som er interessert i digitale medier, kommunikasjon og kreativt arbeid.",
      institution: "Tilbys ved utvalgte videregående skoler",
      requirements: "Fullført grunnskole",
      highlights: ["Kreativt og variert", "Praktisk medieproduksjon", "Digital kompetanse"]
    }
  ];
  
  // Generate some next steps based on dimensions if none provided
  const actualNextSteps = nextSteps.length > 0 ? nextSteps : [
    "Undersøk hvilke skoler i din region som tilbyr programmene du er interessert i",
    "Delta på åpen dag eller informasjonsmøter ved aktuelle skoler",
    "Snakk med en rådgiver om dine interesser og hvilke programmer som kan passe for deg",
    "Utforsk mulige karriereveier etter ulike utdanningsprogrammer"
  ];
  
  // Toggle expanded education program
  const toggleProgramDetails = (programName: string) => {
    setExpandedProgram(expandedProgram === programName ? null : programName);
  };
  
  // Determine how many recommendations to show (all, or just the specified max)
  const displayRecommendations = showAll 
    ? actualRecommendations 
    : actualRecommendations.slice(0, maxCount);
  
  return (
    <div className="space-y-6 animate-fade-up">
      <div className="bg-card p-6 rounded-lg border">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">{title}</h2>
          {actualRecommendations.length > maxCount && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowAll(!showAll)}
              className="flex items-center gap-1"
            >
              {showAll ? (
                <>Vis topp {maxCount} <ChevronUp className="h-4 w-4" /></>
              ) : (
                <>Vis alle {actualRecommendations.length} <ChevronDown className="h-4 w-4" /></>
              )}
            </Button>
          )}
        </div>
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
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{rec.name}</h3>
                      {index < 3 && <Badge variant="default" className="text-xs">Topp match</Badge>}
                    </div>
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
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Hvorfor passer dette deg?</h4>
                    <p className="text-sm">
                      Dette programmet matcher godt med dine {rec.match.toLowerCase()}
                    </p>
                  </div>
                  
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
        
        {actualNextSteps.length > 0 && (
          <div className="mt-6 bg-muted/40 p-4 rounded-md">
            <h3 className="font-medium mb-2">Neste steg</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {actualNextSteps.map((step, index) => (
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
