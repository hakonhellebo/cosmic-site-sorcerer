
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap } from "lucide-react";
import EducationCard from './EducationCard';
import EducationPagination from './EducationPagination';
import { processEducationsData, ProcessedEducation } from './utils/educationProcessor';

interface Education {
  Lærestednavn: string;
  Studiekode: string;
  Studienavn: string;
  'Utdanningsområde- og type': string;
  Studiested: string;
  'Measure Names': string;
  'Measure Values': string;
  Sektor: string;
  undersektor: string;
}

interface RelatedEducationsProps {
  sector: string;
  educations: Education[];
  sourceCareer?: {
    Yrkesnavn: string;
    Sektor: string;
    'Spesifikk sektor': string;
  };
}

const RelatedEducations: React.FC<RelatedEducationsProps> = ({ sector, educations, sourceCareer }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [processedEducations, setProcessedEducations] = useState<ProcessedEducation[]>([]);
  const educationsPerPage = 6;

  useEffect(() => {
    const processed = processEducationsData(educations, sector);
    setProcessedEducations(processed);
  }, [sector, educations]);

  const totalPages = Math.ceil(processedEducations.length / educationsPerPage);
  const currentEducations = processedEducations.slice(
    currentPage * educationsPerPage,
    (currentPage + 1) * educationsPerPage
  );

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  if (processedEducations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Relevante utdanninger
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Ingen utdanninger funnet for denne sektoren.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          Relevante utdanninger
          <Badge variant="secondary" className="ml-2">
            {processedEducations.length} programmer
          </Badge>
        </CardTitle>
        
        <EducationPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onNextPage={nextPage}
          onPrevPage={prevPage}
        />
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentEducations.map((education, index) => (
            <EducationCard 
              key={`${education.programCode}-${index}`}
              education={education}
              sourceCareer={sourceCareer}
            />
          ))}
        </div>
        
        {processedEducations.length > educationsPerPage && (
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Viser {currentEducations.length} av {processedEducations.length} utdanninger
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RelatedEducations;
