
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, MapPin, Users, ChevronLeft, ChevronRight, Star } from "lucide-react";

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

interface ProcessedEducation {
  university: string;
  programCode: string;
  programName: string;
  educationType: string;
  location: string;
  sector: string;
  undersektor: string;
  avgGrade?: number;
  applicants?: number;
  spots?: number;
  competitiveness?: number;
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
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [processedEducations, setProcessedEducations] = useState<ProcessedEducation[]>([]);
  const educationsPerPage = 6;

  useEffect(() => {
    // Filter educations by matching sector or undersektor
    const relevant = educations.filter(education => 
      education.Sektor?.toLowerCase() === sector?.toLowerCase() ||
      education.undersektor?.toLowerCase() === sector?.toLowerCase()
    );

    // Group by program and aggregate data
    const programsMap = new Map<string, ProcessedEducation>();
    
    relevant.forEach(education => {
      const key = `${education.Lærestednavn}-${education.Studiekode}`;
      
      if (!programsMap.has(key)) {
        programsMap.set(key, {
          university: education.Lærestednavn,
          programCode: education.Studiekode,
          programName: education.Studienavn,
          educationType: education['Utdanningsområde- og type'],
          location: education.Studiested,
          sector: education.Sektor,
          undersektor: education.undersektor
        });
      }
      
      const program = programsMap.get(key)!;
      const measureName = education['Measure Names'];
      const measureValue = parseFloat(education['Measure Values']) || 0;
      
      if (measureName === 'Snitt' && measureValue > 0) {
        program.avgGrade = measureValue;
      } else if (measureName === 'Søkere' && measureValue > 0) {
        program.applicants = measureValue;
      } else if (measureName === 'Planlagte studieplasser' && measureValue > 0) {
        program.spots = measureValue;
      }
    });

    // Calculate competitiveness and convert to array
    const programsArray = Array.from(programsMap.values()).map(program => {
      if (program.applicants && program.spots && program.spots > 0) {
        program.competitiveness = program.applicants / program.spots;
      }
      return program;
    });

    // Sort by competitiveness (most competitive first) and limit
    const sorted = programsArray
      .sort((a, b) => (b.competitiveness || 0) - (a.competitiveness || 0))
      .slice(0, 24); // Limit for performance

    setProcessedEducations(sorted);
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

  const getCompetitivenessLevel = (competitiveness?: number) => {
    if (!competitiveness) return { level: 'Ukjent', color: 'gray' };
    if (competitiveness > 10) return { level: 'Svært høy', color: 'red' };
    if (competitiveness > 5) return { level: 'Høy', color: 'orange' };
    if (competitiveness > 2) return { level: 'Moderat', color: 'yellow' };
    return { level: 'Lav', color: 'green' };
  };

  const handleEducationClick = (education: ProcessedEducation) => {
    const educationSlug = `${education.university}-${education.programCode}`.toLowerCase().replace(/[^a-z0-9]/g, '-');
    navigate(`/utdanning/${educationSlug}`, { 
      state: { 
        program: {
          Lærestednavn: education.university,
          Studiekode: education.programCode,
          Studienavn: education.programName,
          'Utdanningsområde- og type': education.educationType,
          Studiested: education.location,
          Sektor: education.sector,
          undersektor: education.undersektor,
          avgGrade: education.avgGrade,
          applicants: education.applicants,
          spots: education.spots,
          competitiveness: education.competitiveness
        },
        sourceCareer: sourceCareer
      }
    });
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
        
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={prevPage}
              disabled={totalPages <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              {currentPage + 1} av {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={nextPage}
              disabled={totalPages <= 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentEducations.map((education, index) => {
            const competitiveness = getCompetitivenessLevel(education.competitiveness);
            
            return (
              <Card 
                key={`${education.programCode}-${index}`} 
                className="border-l-4 border-l-blue-500/20 hover:border-l-blue-500 transition-colors cursor-pointer hover:shadow-md"
                onClick={() => handleEducationClick(education)}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-lg line-clamp-2">{education.programName}</h4>
                      <p className="text-sm text-muted-foreground font-medium">{education.university}</p>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {education.undersektor || education.sector}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      {education.location && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{education.location}</span>
                        </div>
                      )}
                      
                      {education.educationType && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <GraduationCap className="h-3 w-3" />
                          <span>{education.educationType}</span>
                        </div>
                      )}
                      
                      {education.avgGrade && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Star className="h-3 w-3" />
                          <span>Snitt: {education.avgGrade.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center pt-2">
                      {education.competitiveness && (
                        <div className="text-xs">
                          <span className="text-muted-foreground">Konkurranse: </span>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              competitiveness.color === 'red' ? 'border-red-500 text-red-700' :
                              competitiveness.color === 'orange' ? 'border-orange-500 text-orange-700' :
                              competitiveness.color === 'yellow' ? 'border-yellow-500 text-yellow-700' :
                              competitiveness.color === 'green' ? 'border-green-500 text-green-700' :
                              'border-gray-500 text-gray-700'
                            }`}
                          >
                            {competitiveness.level}
                          </Badge>
                        </div>
                      )}
                      
                      {education.spots && (
                        <div className="text-xs text-muted-foreground">
                          {education.spots} plasser
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
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
