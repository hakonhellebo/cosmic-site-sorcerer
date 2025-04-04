
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ExternalLink } from "lucide-react";
import { Dimension } from '@/utils/dimensions/types';

interface RecommendedEducationProps {
  dimensions?: Dimension[];
  recommendations?: {
    title: string;
    institution: string;
    description: string;
    link?: string; // Make link optional with ?
  }[];
  nextSteps?: string[];
  title?: string;
  subtitle?: string;
  maxRecommendations?: number;
}

const RecommendedEducation: React.FC<RecommendedEducationProps> = ({
  dimensions,
  recommendations = [],
  nextSteps = [],
  title = "Anbefalte utdanninger",
  subtitle = "Basert på din profil",
  maxRecommendations = 4
}) => {
  // Ensure recommendations is an array and limit the number shown
  const displayRecommendations = recommendations.slice(0, maxRecommendations);
  
  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-col md:flex-row md:items-end justify-between">
        <div>
          <h2 className="text-2xl font-semibold mb-1">{title}</h2>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>
        
        {/* Dimension badges */}
        {dimensions && dimensions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3 md:mt-0">
            {dimensions.slice(0, 3).map((dim, idx) => (
              <Badge 
                key={idx} 
                variant="outline" 
                className="bg-muted/30"
              >
                {dim.name}
              </Badge>
            ))}
          </div>
        )}
      </div>
      
      {displayRecommendations.length > 0 ? (
        <>
          {/* Table version for larger screens */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 font-medium">Utdanning</th>
                  <th className="text-left py-3 font-medium">Lærested</th>
                  <th className="text-left py-3 font-medium">Hvorfor passer det deg?</th>
                  <th className="text-left py-3"></th>
                </tr>
              </thead>
              <tbody>
                {displayRecommendations.map((rec, idx) => (
                  <tr key={idx} className="border-b hover:bg-muted/20">
                    <td className="py-3 font-medium">{rec.title}</td>
                    <td className="py-3">{rec.institution}</td>
                    <td className="py-3">{rec.description}</td>
                    <td className="py-3 text-right">
                      {rec.link && (
                        <a 
                          href={rec.link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center gap-1 text-primary hover:underline"
                        >
                          <span>Les mer</span>
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Card version for mobile */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {displayRecommendations.map((rec, idx) => (
              <div key={idx} className="border rounded-lg p-4 hover:bg-muted/10">
                <h3 className="font-medium text-lg">{rec.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{rec.institution}</p>
                <p className="mb-3">{rec.description}</p>
                {rec.link && (
                  <a 
                    href={rec.link}
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-1 text-primary hover:underline text-sm"
                  >
                    <span>Les mer</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
          
          {/* Show more button */}
          <div className="flex justify-end">
            <Button variant="outline" className="flex items-center gap-2 mt-2">
              <span>Se flere muligheter</span>
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </>
      ) : (
        <div className="p-6 border rounded-lg bg-muted/10 text-center">
          <p>Ingen anbefalte utdanninger funnet. Prøv å oppdatere profilen din.</p>
        </div>
      )}
      
      {/* Next steps section */}
      {nextSteps.length > 0 && (
        <div className="bg-card p-6 rounded-lg border-border border mt-6">
          <h3 className="font-semibold text-lg mb-4">Anbefalte neste steg</h3>
          <ul className="space-y-2">
            {nextSteps.map((step, idx) => (
              <li key={idx} className="flex items-start">
                <Check className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RecommendedEducation;
