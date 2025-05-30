import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase, Search, Loader2 } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getCareerStatistics, getDetailedCareerData } from '@/lib/supabase';
import CareerDetailsCard from './CareerDetailsCard';

const CareerStatistics = () => {
  const [selectedCareer, setSelectedCareer] = useState("");
  const [careerList, setCareerList] = useState<string[]>([]);
  const [filteredCareers, setFilteredCareers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [basicStats, setBasicStats] = useState<Record<string, any> | null>(null);
  const [detailedStats, setDetailedStats] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load available careers on component mount
  useEffect(() => {
    const loadCareers = async () => {
      try {
        console.log("Starting to load careers from Yrke_Statistikk table...");
        setError(null);
        
        const { data, error } = await getCareerStatistics();
        
        console.log("Raw response from getCareerStatistics:", { data, error });
        
        if (error) {
          console.error("Error fetching careers:", error);
          setError(`Feil ved henting av yrker: ${error.message || 'Ukjent feil'}`);
          setCareerList([]);
          return;
        }
        
        if (data && Array.isArray(data)) {
          console.log("Number of rows returned:", data.length);
          console.log("First few rows:", data.slice(0, 3));
          
          // Log all column names to see what's available
          if (data.length > 0) {
            console.log("Available columns:", Object.keys(data[0]));
          }
          
          // Try different possible column names for career/occupation
          const possibleCareerColumns = ['Yrke', 'yrke', 'Occupation', 'occupation', 'Career', 'career'];
          let careerColumnName = null;
          
          for (const columnName of possibleCareerColumns) {
            if (data.length > 0 && data[0].hasOwnProperty(columnName)) {
              careerColumnName = columnName;
              console.log(`Found career column: ${columnName}`);
              break;
            }
          }
          
          if (!careerColumnName) {
            console.error("No career column found. Available columns:", data.length > 0 ? Object.keys(data[0]) : 'No data');
            setError("Kunne ikke finne yrkeskolonne i dataene");
            setCareerList([]);
            return;
          }
          
          // Extract unique career names
          const careers = data
            .map(item => item[careerColumnName])
            .filter(Boolean)
            .filter(career => typeof career === 'string' && career.trim().length > 0);
            
          const uniqueCareers = [...new Set(careers)] as string[];
          
          console.log("Extracted careers:", uniqueCareers);
          console.log("Total unique careers found:", uniqueCareers.length);
          
          if (uniqueCareers.length === 0) {
            setError("Ingen gyldige yrker funnet i dataene");
          }
          
          setCareerList(uniqueCareers.sort());
          setFilteredCareers(uniqueCareers.sort());
        } else {
          console.log("No data returned from Yrke_Statistikk");
          setError("Ingen data returnert fra Yrke_Statistikk tabellen");
          setCareerList([]);
          setFilteredCareers([]);
        }
      } catch (error) {
        console.error("Error loading careers:", error);
        setError(`Feil ved lasting av yrker: ${error instanceof Error ? error.message : 'Ukjent feil'}`);
        setCareerList([]);
        setFilteredCareers([]);
      } finally {
        setInitialLoading(false);
      }
    };

    loadCareers();
  }, []);

  // Filter careers based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCareers(careerList);
    } else {
      const filtered = careerList.filter(career =>
        career.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCareers(filtered);
    }
  }, [searchTerm, careerList]);

  // Load statistics for selected career
  const loadCareerData = async (careerName: string) => {
    if (!careerName) return;
    
    setLoading(true);
    try {
      console.log("Loading data for career:", careerName);
      
      // Fetch basic statistics
      const { data: basicData, error: basicError } = await getCareerStatistics(careerName);
      if (basicError) {
        console.error("Error fetching basic stats:", basicError);
      } else if (basicData && basicData.length > 0) {
        console.log("Basic stats:", basicData[0]);
        setBasicStats(basicData[0]);
      } else {
        setBasicStats(null);
      }

      // Fetch detailed statistics
      const { data: detailedData, error: detailedError } = await getDetailedCareerData(careerName);
      if (detailedError) {
        console.error("Error fetching detailed stats:", detailedError);
      } else if (detailedData) {
        console.log("Detailed stats:", detailedData);
        setDetailedStats(detailedData);
      } else {
        setDetailedStats([]);
      }

    } catch (error) {
      console.error("Error loading career data:", error);
      setBasicStats(null);
      setDetailedStats([]);
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
        <p>Laster yrkesdata fra databasen...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <Briefcase className="h-16 w-16 mx-auto mb-6 text-red-500" />
            <h3 className="text-2xl font-semibold mb-4 text-red-600">Feil ved lasting av data</h3>
            <p className="text-muted-foreground mb-6">{error}</p>
            <p className="text-sm text-muted-foreground">
              Sjekk at Supabase-tilkoblingen fungerer og at tabellen 'Yrke_Statistikk' eksisterer.
            </p>
          </div>
        </CardContent>
      </Card>
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
            {careerList.length > 0 && ` (${careerList.length} yrker tilgjengelig)`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search input */}
          <Input
            placeholder="Søk etter yrke (f.eks. Sivilingeniør)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          
          {/* Career selection dropdown */}
          <div className="flex gap-4">
            <Select value={selectedCareer} onValueChange={handleCareerSelect}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder={
                  careerList.length > 0 
                    ? `Velg fra ${filteredCareers.length} yrker`
                    : "Ingen yrker funnet"
                } />
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-lg z-50">
                {filteredCareers.map((career) => (
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
          
          {/* Show filtered results count */}
          {searchTerm && (
            <p className="text-sm text-muted-foreground">
              Viser {filteredCareers.length} av {careerList.length} yrker
            </p>
          )}
          
          {/* Debug info */}
          {careerList.length > 0 && (
            <p className="text-xs text-muted-foreground">
              Eksempel på yrker: {careerList.slice(0, 3).join(", ")}
              {careerList.length > 3 && "..."}
            </p>
          )}
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
      {!selectedCareer && careerList.length > 0 && (
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

      {/* No careers available */}
      {!selectedCareer && careerList.length === 0 && !initialLoading && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Briefcase className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
              <h3 className="text-2xl font-semibold mb-4">Ingen yrker funnet</h3>
              <p className="text-muted-foreground mb-6">
                Kunne ikke hente yrker fra Yrke_Statistikk tabellen. 
                Sjekk at tabellen inneholder data og at tilkoblingen til Supabase fungerer.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CareerStatistics;
