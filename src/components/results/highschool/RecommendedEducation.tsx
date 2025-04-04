
import React from 'react';
import { ExternalLink, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dimension } from '@/utils/dimensions/types';

interface RecommendedEducationProps {
  dimensions?: Dimension[];
  recommendations?: Array<{
    title: string;
    institution: string;
    description: string;
    link?: string;
  }>;
  nextSteps?: string[];
  title?: string;
  subtitle?: string;
}

const RecommendedEducation: React.FC<RecommendedEducationProps> = ({ 
  dimensions = [],
  recommendations = [],
  nextSteps = [],
  title = "Anbefalte utdanninger",
  subtitle = "Basert på din profil"
}) => {
  // Default recommendations if none provided
  const defaultRecommendations = [
    {
      title: "Studiespesialisering med realfag",
      institution: "Videregående skoler",
      description: "Fokus på matematikk, fysikk og naturfag, egnet for teknologi-interesserte elever."
    },
    {
      title: "Medieproduksjon",
      institution: "Videregående skoler",
      description: "Kreativ utdanning med fokus på visuell kommunikasjon og digitale medier."
    },
    {
      title: "Helse- og oppvekstfag",
      institution: "Videregående skoler",
      description: "For deg som vil jobbe med mennesker innen helsesektoren."
    }
  ];

  // Default next steps if none provided
  const defaultNextSteps = [
    "Snakk med rådgiver på skolen din om mulighetene innen fagene du er interessert i",
    "Undersøk aktuelle utdanningsprogrammer på utdanning.no",
    "Delta på åpen dag på videregående skoler du er interessert i",
    "Ta en praksisdag hos bedrifter du synes virker spennende"
  ];
  
  const educationList = recommendations.length > 0 ? recommendations : defaultRecommendations;
  const steps = nextSteps.length > 0 ? nextSteps : defaultNextSteps;
  
  return (
    <div className="bg-card border p-6 rounded-lg animate-fade-up">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-muted-foreground mb-6">{subtitle}</p>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3">Utdanning</th>
              <th className="text-left py-3">Lærested</th>
              <th className="text-left py-3">Beskrivelse</th>
              <th className="text-left py-3"></th>
            </tr>
          </thead>
          <tbody>
            {educationList.map((edu, idx) => (
              <tr key={idx} className="border-b hover:bg-muted/30">
                <td className="py-3 font-medium">{edu.title}</td>
                <td className="py-3">{edu.institution}</td>
                <td className="py-3">{edu.description}</td>
                <td className="py-3 text-right">
                  {edu.link && (
                    <a 
                      href={edu.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center text-primary hover:underline"
                    >
                      <span className="mr-1">Les mer</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6">
        <Button variant="outline" className="flex items-center gap-2">
          <span>Se flere utdanningsmuligheter</span>
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="mt-8">
        <h3 className="font-semibold mb-4">Neste steg</h3>
        <ul className="space-y-2">
          {steps.map((step, idx) => (
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
