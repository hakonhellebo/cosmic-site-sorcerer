
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, GraduationCap, Star } from "lucide-react";

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

interface EducationCardProps {
  education: ProcessedEducation;
  sourceCompany?: {
    Selskap: string;
    Sektor: string;
    sub_sektor?: string;
  };
  sourceCareer?: {
    Yrkesnavn: string;
    Sektor: string;
    'Spesifikk sektor': string;
  };
}

const EducationCard: React.FC<EducationCardProps> = ({ education, sourceCompany, sourceCareer }) => {
  const navigate = useNavigate();

  const getCompetitivenessLevel = (competitiveness?: number) => {
    if (!competitiveness) return { level: 'Ukjent', color: 'gray' };
    if (competitiveness > 10) return { level: 'Svært høy', color: 'red' };
    if (competitiveness > 5) return { level: 'Høy', color: 'orange' };
    if (competitiveness > 2) return { level: 'Moderat', color: 'yellow' };
    return { level: 'Lav', color: 'green' };
  };

  const handleEducationClick = (education: ProcessedEducation) => {
    // Encode university name and study code for URL
    const universityEncoded = encodeURIComponent(education.university);
    const studiekodeEncoded = encodeURIComponent(education.programCode);
    
    console.log("Navigating to education:", {
      university: education.university,
      programCode: education.programCode,
      encodedUrl: `/utdanning/${universityEncoded}/${studiekodeEncoded}`
    });
    
    navigate(`/utdanning/${universityEncoded}/${studiekodeEncoded}`, { 
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
        sourceCompany: sourceCompany,
        sourceCareer: sourceCareer
      }
    });
  };

  const competitiveness = getCompetitivenessLevel(education.competitiveness);

  return (
    <Card 
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
};

export default EducationCard;
