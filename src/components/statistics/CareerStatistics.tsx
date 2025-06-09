
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, TrendingUp, Users, Search, Loader2, ArrowRight } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import CareerDetailPage from './CareerDetailPage';

const CareerStatistics = () => {
  const [careerData, setCareerData] = useState<any[]>([]);
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
      
      console.log("Fetching career data from Yrker_database...");
      
      const { data: careerStats, error: careerError } = await supabase
        .from('Yrker_database')
        .select('*')
        .order('Yrkesnavn', { ascending: true });
      
      if (careerError) {
        console.error("Error fetching career data:", careerError);
        throw careerError;
      }
      
      console.log("Career data fetched:", careerStats?.length, "rows");
      setCareerData(careerStats || []);
      
    } catch (error) {
      console.error("Error in fetchCareerData:", error);
      setError("Kunne ikke hente yrkesdata fra databasen");
    } finally {
      setLoading(false);
    }
  };

  const filteredCareers = careerData.filter(career =>
    career.Yrkesnavn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    career['Kort beskrivelse']?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    career.Sektor?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCareerSelect = (careerName: string) => {
    setSelectedCareer(careerName);
  };

  const getCareerByName = (careerName: string) => {
    return careerData.find(c => c.Yrkesnavn === careerName);
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
    const careerDetails = getCareerByName(selectedCareer);
    return (
      <CareerDetailPage 
        career={careerDetails}
        onBack={() => setSelectedCareer(null)}
        onNavigateToCareer={handleCareerSelect}
        allCareers={careerData}
      />
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
            Utforsk yrker og deres beskrivelser fra Yrker_database
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Søk etter yrke, beskrivelse eller sektor..."
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
                  {[...new Set(careerData.map(c => c.Sektor).filter(Boolean))].length}
                </div>
                <div className="text-sm text-muted-foreground">Ulike sektorer</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {filteredCareers.length}
                </div>
                <div className="text-sm text-muted-foreground">Filtrerte resultater</div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {careerData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Yrker</CardTitle>
            <CardDescription>
              {searchTerm ? `Viser søkeresultater for "${searchTerm}"` : 'Alle tilgjengelige yrker'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Yrkesnavn</TableHead>
                    <TableHead>Kort beskrivelse</TableHead>
                    <TableHead>Sektor</TableHead>
                    <TableHead>Spesifikk sektor</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCareers.slice(0, 50).map((career, index) => (
                    <TableRow key={index} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium">
                        {career.Yrkesnavn}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-md">
                        {career['Kort beskrivelse']?.substring(0, 100)}
                        {career['Kort beskrivelse']?.length > 100 && '...'}
                      </TableCell>
                      <TableCell>
                        {career.Sektor && (
                          <Badge variant="outline">{career.Sektor}</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        {career['Spesifikk sektor']}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCareerSelect(career.Yrkesnavn)}
                          className="flex items-center gap-1"
                        >
                          Se detaljer
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {filteredCareers.length > 50 && (
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Viser de første 50 resultatene. Bruk søk for å filtrere.
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CareerStatistics;
