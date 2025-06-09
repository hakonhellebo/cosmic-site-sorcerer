
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";
import CareerCard from './CareerCard';

interface Career {
  Yrkesnavn: string;
  'Kort beskrivelse': string;
  'Detaljert beskrivelse': string;
  'Nøkkelkompetanser': string;
  'Relaterte yrker': string;
  Sektor: string;
  'Spesifikk sektor': string;
}

interface CareersGridProps {
  filteredCareers: Career[];
  loading: boolean;
  onCareerClick: (career: Career) => void;
  resetFilters: () => void;
}

const CareersGrid: React.FC<CareersGridProps> = ({
  filteredCareers,
  loading,
  onCareerClick,
  resetFilters
}) => {
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-muted-foreground">Laster yrker...</p>
      </div>
    );
  }

  if (filteredCareers.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Ingen yrker funnet</h3>
          <p className="text-muted-foreground mb-4">
            Prøv å justere søkekriteriene dine
          </p>
          <Button
            variant="outline"
            onClick={resetFilters}
          >
            Nullstill filtre
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredCareers.map((career, index) => (
        <CareerCard
          key={`${career.Yrkesnavn}-${index}`}
          career={career}
        />
      ))}
    </div>
  );
};

export default CareersGrid;
