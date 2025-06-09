
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building } from "lucide-react";

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
  index: number;
  onCareerClick: (career: Career) => void;
}

const CareerCard: React.FC<CareerCardProps> = ({ career, index, onCareerClick }) => {
  return (
    <Card 
      key={career.Yrkesnavn || index} 
      className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-primary/20 hover:border-l-primary"
      onClick={() => onCareerClick(career)}
    >
      <CardHeader>
        <CardTitle className="text-lg line-clamp-2">
          {career.Yrkesnavn}
        </CardTitle>
        <div className="flex flex-wrap gap-1">
          {career.Sektor && (
            <Badge variant="secondary" className="text-xs">
              <Building className="h-3 w-3 mr-1" />
              {career.Sektor}
            </Badge>
          )}
          {career['Spesifikk sektor'] && (
            <Badge variant="outline" className="text-xs">
              {career['Spesifikk sektor']}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {career['Kort beskrivelse']}
        </p>
        
        <div className="mt-4 pt-4 border-t">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              onCareerClick(career);
            }}
          >
            Se detaljer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CareerCard;
