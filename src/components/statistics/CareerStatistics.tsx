
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, TrendingUp, Users, Search, Loader2 } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import CareerDetailsCard from './CareerDetailsCard';

const CareerStatistics = () => {
  const [careerData, setCareerData] = useState<any[]>([]);
  const [detailedCareerData, setDetailedCareerData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCareer, setSelectedCareer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCareerData();
  }, []);

  const fetchCareerData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Fetching career data from Yrke_statistikk...");
      
      // Fetch data from Yrke_statistikk table
      const { data: careerStats, error: careerError } = await supabase
        .from('Yrke_statistikk')
        .select('*')
        .order('antall_personer', { ascending: false });
      
      if (careerError) {
        console.error("Error fetching career data:", careerError);
        throw careerError;
      }
      
      console.log("Career data fetched:", careerStats?.length, "rows");
      console.log("First few rows:", careerStats?.slice(0, 3));
      setCareerData(careerStats || []);
      
      // Also fetch detailed data from Clean_11418
      const { data: detailedStats, error: detailedError } = await supabase
        .from('Clean_11418')
        .select('*')
        .limit(1000);
      
      if (detailedError) {
        console.warn("Could not fetch detailed career data:", detailedError);
      } else {
        console.log("Detailed career data fetched:", detailedStats?.length, "rows");
        setDetailedCareerData(detailedStats || []);
      }
      
    } catch (error) {
      console.error("Error in fetchCareerData:", error);
      setError("Kunne ikke hente yrkesdata fra databasen");
    } finally {
      setLoading(false);
    }
  };

  const filteredCareers = careerData.filter(career =>
    career.styrk08_navn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    career.styrk08_kortnavn?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const topCareers = filteredCareers.slice(0, 10);

  const handleCareerSelect = (careerName: string) => {
    setSelectedCareer(careerName);
  };

  const getCareerDetails = (careerName: string) => {
    const basicStats = careerData.find(c => c.styrk08_navn === careerName);
    const detailed = detailedCareerData.filter(d => d.Yrke === careerName);
    return { basicStats, detailed };
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p>Henter yrkesstatistikk...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 p-4 bg-red-50 rounded-lg">
        <h3 className="font-semibold mb-2">Feil:</h3>
        <p>{error}</p>
        <Button onClick={fetchCareerData} className="mt-4">
          Prøv igjen
        </Button>
      </div>
    );
  }

  if (selectedCareer) {
    const { basicStats, detailed } = getCareerDetails(selectedCareer);
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => setSelectedCareer(null)}
          >
            ← Tilbake til oversikt
          </Button>
          <h2 className="text-2xl font-bold">{selectedCareer}</h2>
        </div>
        
        <CareerDetailsCard 
          careerName={selectedCareer}
          basicStats={basicStats}
          detailedStats={detailed}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Yrkesstatistikk
          </CardTitle>
          <CardDescription>
            Statistikk over yrker basert på data fra Yrke_statistikk tabellen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Søk etter yrke..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={fetchCareerData} variant="outline">
              Oppdater data
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{careerData.length}</div>
                <div className="text-sm text-muted-foreground">Totalt antall yrker</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {careerData.reduce((sum, career) => sum + (career.antall_personer || 0), 0).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Totalt antall personer</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{detailedCareerData.length}</div>
                <div className="text-sm text-muted-foreground">Detaljerte datapunkter</div>
              </CardContent>
            </Card>
          </div>

          {/* Debug information */}
          {careerData.length === 0 && (
            <div className="bg-yellow-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold">Debug informasjon:</h4>
              <p>Ingen data funnet i Yrke_statistikk tabellen.</p>
              <p>Sjekk konsollen for mer informasjon.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {careerData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Topp 10 yrker etter antall personer</CardTitle>
            <CardDescription>
              {searchTerm ? `Viser søkeresultater for "${searchTerm}"` : 'De mest populære yrkene basert på antall personer'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Yrke</TableHead>
                    <TableHead>STYRK08 Kode</TableHead>
                    <TableHead className="text-right">Antall personer</TableHead>
                    <TableHead className="text-right">Antall menn</TableHead>
                    <TableHead className="text-right">Antall kvinner</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topCareers.map((career, index) => (
                    <TableRow key={career.id || index} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium">
                        {career.styrk08_navn}
                        {career.styrk08_kortnavn && (
                          <div className="text-sm text-muted-foreground">
                            {career.styrk08_kortnavn}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{career.styrk08}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {career.antall_personer?.toLocaleString() || 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        {career.antall_menn?.toLocaleString() || 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        {career.antall_kvinner?.toLocaleString() || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCareerSelect(career.styrk08_navn)}
                        >
                          Detaljer
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CareerStatistics;
