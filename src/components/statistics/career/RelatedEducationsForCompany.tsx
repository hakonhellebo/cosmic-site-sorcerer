
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap } from "lucide-react";
import EducationCard from './EducationCard';
import { processEducationsData, ProcessedEducation } from './utils/educationProcessor';
import { supabase } from '@/lib/supabase';

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

interface RelatedEducationsForCompanyProps {
  sector: string;
  subSector?: string;
  sourceCompany?: {
    Selskap: string;
    Sektor: string;
    sub_sektor: string;
  };
}

const RelatedEducationsForCompany: React.FC<RelatedEducationsForCompanyProps> = ({ 
  sector, 
  subSector, 
  sourceCompany 
}) => {
  const [educations, setEducations] = useState<Education[]>([]);
  const [processedEducations, setProcessedEducations] = useState<ProcessedEducation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelevantEducations = async () => {
      setLoading(true);
      console.log("Fetching educations for sector:", sector, "subSector:", subSector);
      
      try {
        // Fetch all educations and filter client-side to avoid SQL parsing issues with special characters
        const { data, error } = await supabase
          .from('Student_data_ny')
          .select('*')
          .order('Lærestednavn', { ascending: true });
        
        if (error) {
          console.error("Error fetching educations:", error);
        } else {
          // Filter client-side for sector matches
          const filtered = (data || []).filter(education => {
            const eduSektor = education.Sektor?.toLowerCase() || '';
            const eduUndersektor = education.undersektor?.toLowerCase() || '';
            const sectorLower = sector?.toLowerCase() || '';
            const subSectorLower = subSector?.toLowerCase() || '';
            
            return eduSektor.includes(sectorLower) ||
                   eduUndersektor.includes(sectorLower) ||
                   (subSectorLower && eduSektor.includes(subSectorLower)) ||
                   (subSectorLower && eduUndersektor.includes(subSectorLower));
          });
          
          console.log(`Found ${filtered.length} relevant education records`);
          setEducations(filtered);
        }
      } catch (err) {
        console.error("Error:", err);
      }
      
      setLoading(false);
    };

    if (sector) {
      fetchRelevantEducations();
    }
  }, [sector, subSector]);

  useEffect(() => {
    if (educations.length > 0) {
      const processed = processEducationsData(educations, sector);
      setProcessedEducations(processed);
    }
  }, [educations, sector]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Relevante studielinjer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
            <span>Laster studielinjer...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (processedEducations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Relevante studielinjer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Ingen studielinjer funnet for denne sektoren.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          Relevante studielinjer
          <Badge variant="secondary" className="ml-2">
            {processedEducations.length} programmer
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {processedEducations.slice(0, 6).map((education, index) => (
            <EducationCard 
              key={`${education.programCode}-${index}`}
              education={education}
              sourceCompany={sourceCompany}
            />
          ))}
        </div>
        
        {processedEducations.length > 6 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Viser 6 av {processedEducations.length} studielinjer
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RelatedEducationsForCompany;
