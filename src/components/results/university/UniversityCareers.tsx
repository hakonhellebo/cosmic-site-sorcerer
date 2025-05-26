
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Building } from 'lucide-react';

interface UniversityCareersProps {
  recommendations: any[];
  apiCareers?: {
    navn: string;
    lærested: string;
    dimensjoner: string[];
    stillinger: string[];
    arbeidsgivere: string[];
  }[];
}

const UniversityCareers: React.FC<UniversityCareersProps> = ({ 
  recommendations, 
  apiCareers 
}) => {
  // Use API career data if available, otherwise fall back to existing logic
  const careerData = apiCareers || recommendations;
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold mb-2">Karrieremuligheter</h3>
        <p className="text-muted-foreground">
          Se hvilke stillinger og arbeidsgivere som passer til dine anbefalte studier
        </p>
      </div>
      
      <div className="grid gap-6">
        {careerData.slice(0, 4).map((item, index) => {
          // Handle both API format and existing format
          const studyName = item.navn || item.name || item.title;
          const institution = item.lærested || item.institution;
          const positions = item.stillinger || [];
          const employers = item.arbeidsgivere || [];
          
          return (
            <Card key={index} className="transition-all duration-200 hover:shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Briefcase className="h-5 w-5 text-primary" />
                  {studyName}
                </CardTitle>
                {institution && (
                  <p className="text-sm text-muted-foreground">{institution}</p>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {positions.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      Typiske stillinger
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {positions.slice(0, 5).map((position, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {position}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {employers.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                      <Building className="h-4 w-4" />
                      Aktuelle arbeidsgivere
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {employers.slice(0, 5).map((employer, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {employer}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {positions.length === 0 && employers.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Karriereinformasjon kommer snart
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default UniversityCareers;
