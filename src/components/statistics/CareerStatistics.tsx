
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase, Search, Loader2 } from "lucide-react";
import { Button } from '@/components/ui/button';
import { getCareerStatistics, getDetailedCareerData } from '@/lib/supabase';
import CareerDetailsCard from './CareerDetailsCard';

const CareerStatistics = () => {
  const [selectedCareer, setSelectedCareer] = useState("");
  const [careerList, setCareerList] = useState<string[]>([]);
  const [basicStats, setBasicStats] = useState<Record<string, any> | null>(null);
  const [detailedStats, setDetailedStats] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Example careers to demonstrate (you can expand this list)
  const exampleCareers = [
    "Dataingeniør",
    "Markedsfører", 
    "Økonomirådgiver",
    "Prosjektleder",
    "Revisor"
  ];

  // Load available careers on component mount
  useEffect(() => {
    const loadCareers = async () => {
      try {
        const { data, error } = await getCareerStatistics();
        if (data && !error && Array.isArray(data)) {
          const uniqueCareers = [...new Set(data.map(item => item.Yrke).filter(Boolean))] as string[];
          setCareerList(uniqueCareers);
          
          // If no careers from database, use examples
          if (uniqueCareers.length === 0) {
            setCareerList(exampleCareers);
          }
        } else {
          console.log("Using example careers as fallback");
          setCareerList(exampleCareers);
        }
      } catch (error) {
        console.error("Error loading careers:", error);
        setCareerList(exampleCareers);
      } finally {
        setInitialLoading(false);
      }
    };

    loadCareers();
  }, []);

  // Load statistics for selected career
  const loadCareerData = async (careerName: string) => {
    if (!careerName) return;
    
    setLoading(true);
    try {
      // Fetch basic statistics
      const { data: basicData, error: basicError } = await getCareerStatistics(careerName);
      if (basicData && !basicError && basicData.length > 0) {
        setBasicStats(basicData[0]);
      }

      // Fetch detailed statistics
      const { data: detailedData, error: detailedError } = await getDetailedCareerData(careerName);
      if (detailedData && !detailedError) {
        setDetailedStats(detailedData);
      }

    } catch (error) {
      console.error("Error loading career data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCareerSelect = (careerName: string) => {
    setSelectedCareer(careerName);
    loadCareerData(careerName);
  };

  if (initialLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p>Laster yrkesdata...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Career Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Velg yrke
          </CardTitle>
          <CardDescription>
            Se detaljert statistikk for ulike yrker basert på arbeidsmarkedsdata
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Select value={selectedCareer} onValueChange={handleCareerSelect}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Velg et yrke for å se statistikk" />
              </SelectTrigger>
              <SelectContent>
                {careerList.map((career) => (
                  <SelectItem key={career} value={career}>
                    {career}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              onClick={() => selectedCareer && loadCareerData(selectedCareer)}
              disabled={!selectedCareer || loading}
            >
              <Search className="h-4 w-4 mr-2" />
              Søk
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Henter yrkesstatistikk...</span>
        </div>
      )}

      {/* Career Details */}
      {selectedCareer && !loading && (basicStats || detailedStats.length > 0) && (
        <CareerDetailsCard 
          careerName={selectedCareer}
          basicStats={basicStats}
          detailedStats={detailedStats}
        />
      )}

      {/* No Data Message */}
      {selectedCareer && !loading && !basicStats && detailedStats.length === 0 && (
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Ingen data funnet</h3>
              <p className="text-muted-foreground">
                Vi fant ingen statistikk for "{selectedCareer}" i databasen.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Initial State */}
      {!selectedCareer && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Briefcase className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
              <h3 className="text-2xl font-semibold mb-4">Yrkesstatistikk</h3>
              <p className="text-muted-foreground mb-6">
                Velg et yrke fra listen over for å se detaljert statistikk om lønn, 
                sektorfordeling og arbeidsmarkedsdata.
              </p>
              <p className="text-sm text-muted-foreground">
                Data hentet fra Yrke_Statistikk og clean_11418 tabellene
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CareerStatistics;
