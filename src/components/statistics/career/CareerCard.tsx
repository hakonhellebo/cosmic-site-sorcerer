
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Building, Star } from "lucide-react";

interface Career {
  Yrkesnavn: string;
  'Kort beskrivelse': string;
  'Detaljert beskrivelse': string;
  'Nøkkelkompetanser': string;
  'Relaterte yrker': string;
  Sektor: string;
  'Spesifikk sektor': string;
}

interface CareerCardProps {
  career: Career;
  sourceCompany?: {
    Selskap: string;
    Sektor: string;
    sub_sektor?: string;
  };
}

const CareerCard: React.FC<CareerCardProps> = ({ career, sourceCompany }) => {
  const navigate = useNavigate();

  const handleCareerClick = (career: Career) => {
    const careerSlug = career.Yrkesnavn.toLowerCase().replace(/[^a-z0-9]/g, '-');
    navigate(`/karriere/${careerSlug}`, { 
      state: { 
        career: career,
        sourceCompany: sourceCompany
      }
    });
  };

  return (
    <Card 
      className="border-l-4 border-l-primary/20 hover:border-l-primary transition-colors cursor-pointer hover:shadow-md"
      onClick={() => handleCareerClick(career)}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-lg line-clamp-2">{career.Yrkesnavn}</h4>
            <Badge variant="outline" className="mt-1 text-xs">
              {career['Spesifikk sektor'] || career.Sektor}
            </Badge>
          </div>
          
          {career['Kort beskrivelse'] && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {career['Kort beskrivelse']}
            </p>
          )}
          
          {career['Nøkkelkompetanser'] && (
            <div className="text-xs text-muted-foreground">
              <span className="font-medium">Nøkkelkompetanser: </span>
              <span>{career['Nøkkelkompetanser'].slice(0, 100)}...</span>
            </div>
          )}
          
          {career['Relaterte yrker'] && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Building className="h-3 w-3" />
              <span className="line-clamp-1">Relaterte: {career['Relaterte yrker'].slice(0, 50)}...</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CareerCard;
