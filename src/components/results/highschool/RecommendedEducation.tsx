
import React from 'react';
import { Check } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface RecommendedEducationProps {
  recommendations: any[];
  nextSteps: string[];
  showAllRecommendations?: boolean;
  title?: string;
  subtitle?: string;
}

const RecommendedEducation: React.FC<RecommendedEducationProps> = ({ 
  recommendations, 
  nextSteps,
  showAllRecommendations = false,
  title = "Anbefalte utdanningsprogrammer",
  subtitle = "Basert på din profil, her er noen utdanningsprogrammer som kan passe for deg"
}) => {
  // Determine how many recommendations to show (all or just top 3)
  const displayRecommendations = showAllRecommendations 
    ? recommendations 
    : recommendations.slice(0, 3);
  
  return (
    <div className="space-y-6">
      <div className="bg-card p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-muted-foreground mb-4">{subtitle}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayRecommendations.map((rec, index) => (
            <Card key={index} className="bg-muted/30">
              <CardHeader className="pb-2">
                <h3 className="font-semibold">{rec.name}</h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                <div className="mt-2">
                  {rec.highlights?.map((highlight: string, idx: number) => (
                    <div key={idx} className="text-sm flex items-start mb-1">
                      <Check className="h-4 w-4 mr-1 mt-0.5 text-green-500 flex-shrink-0" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
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
