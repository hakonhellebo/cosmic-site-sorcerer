
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase } from "lucide-react";
import CareerCard from './CareerCard';
import { supabase } from '@/lib/supabase';

interface Career {
  Yrkesnavn: string;
  'Kort beskrivelse': string;
  'Detaljert beskrivelse': string;
  'Nøkkelkompetanser': string;
  'Relaterte yrker': string;
  Sektor: string;
  'Spesifikk sektor': string;
}

interface RelatedCareersProps {
  sector: string;
  subSector?: string;
  sourceCompany?: {
    Selskap: string;
    Sektor: string;
    sub_sektor: string;
  };
}

const RelatedCareers: React.FC<RelatedCareersProps> = ({ sector, subSector, sourceCompany }) => {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelevantCareers = async () => {
      setLoading(true);
      console.log("Fetching careers for sector:", sector, "subSector:", subSector);
      
      try {
        const { data, error } = await supabase
          .from('Yrker_database')
          .select('*')
          .or(`Sektor.ilike.%${sector}%,Sektor.ilike.%${subSector || ''}%,"Spesifikk sektor".ilike.%${sector}%,"Spesifikk sektor".ilike.%${subSector || ''}%`)
          .order('Yrkesnavn', { ascending: true });
        
        if (error) {
          console.error("Error fetching careers:", error);
        } else {
          console.log(`Found ${data?.length || 0} relevant careers`);
          setCareers(data || []);
        }
      } catch (err) {
        console.error("Error:", err);
      }
      
      setLoading(false);
    };

    if (sector) {
      fetchRelevantCareers();
    }
  }, [sector, subSector]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Aktuelle stillinger
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
            <span>Laster stillinger...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (careers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Aktuelle stillinger
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Ingen stillinger funnet for denne sektoren.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Aktuelle stillinger
          <Badge variant="secondary" className="ml-2">
            {careers.length} yrker
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {careers.slice(0, 6).map((career, index) => (
            <CareerCard 
              key={`${career.Yrkesnavn}-${index}`}
              career={career}
              sourceCompany={sourceCompany}
            />
          ))}
        </div>
        
        {careers.length > 6 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Viser 6 av {careers.length} stillinger
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RelatedCareers;
