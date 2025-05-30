
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Info, ExternalLink, TrendingUp, GraduationCap, Building } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { universityData } from '@/data/universityStatistics';
import { getUniversityData } from '@/lib/supabase';
import UniversityProgramCard from './UniversityProgramCard';

const UniversityStatistics = () => {
  const [selectedUniversity, setSelectedUniversity] = useState("nhh");
  const [sortBy, setSortBy] = useState("snitt");
  const [nhhSupabaseData, setNhhSupabaseData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const universities = [
    { id: 'nhh', name: 'Norges Handelshøyskole' },
    { id: 'ntnu', name: 'Norges teknisk-naturvitenskapelige universitet' },
    { id: 'uio', name: 'Universitetet i Oslo' },
    { id: 'uib', name: 'Universitetet i Bergen' },
    { id: 'oslomet', name: 'OsloMet - storbyuniversitetet' }
  ];

  // Fetch NHH data from Supabase when component mounts
  useEffect(() => {
    const fetchNhhData = async () => {
      if (selectedUniversity === 'nhh') {
        setLoading(true);
        console.log("Fetching NHH data for 2024...");
        
        // Fetch data for 2024 specifically
        const { data, error } = await getUniversityData('211', '2024');
        
        if (data && !error) {
          console.log("Raw NHH data from Supabase:", data);
          console.log("Number of records:", data.length);
          
          // Transform Supabase data to match expected format
          const transformedData = data.map((item, index) => {
            console.log(`Processing item ${index + 1}:`, item);
            
            // Focus on nus-kode as the primary studiekode field
            const linje = item.Studiets_navn || item.studienavn || `Studie ${index + 1}`;
            const studiekode = item['nus-kode'] || item.Studiekode || `NUS${index + 1}`;
            const snitt = parseFloat(item.Karaktersnitt) || parseFloat(item.karaktersnitt) || 0;
            const sokereMott = parseInt(item.Antall_moette) || parseInt(item.antall_moette) || 0;
            const planlagteStudieplasser = parseInt(item.Studieplasser) || parseInt(item.studieplasser) || 0;
            const sokereKvalifisert = parseInt(item.Kvalifiserte_sokere) || parseInt(item.kvalifiserte_sokere) || sokereMott * 2;
            const sokere = parseInt(item.Totale_sokere) || parseInt(item.totale_sokere) || sokereKvalifisert * 1.5;
            
            console.log(`Transformed: ${linje} - ${studiekode} - Snitt: ${snitt}`);
            
            return {
              linje,
              studiekode,
              snitt,
              sokereMott,
              sokereTilbudJaSvar: sokereMott,
              sokereTilbud: sokereKvalifisert,
              sokereKvalifisert,
              sokere,
              planlagteStudieplasser,
              universitet: "nhh",
              sokereMottPerStudieplass: planlagteStudieplasser > 0 ? sokereKvalifisert / planlagteStudieplasser : 0,
              beskrivelse: `${linje} ved Norges Handelshøyskole`,
              link: "https://www.nhh.no/studier/"
            };
          }).filter(item => item.studiekode && item.linje); // Only filter out items without both studiekode and linje
          
          console.log("Transformed NHH data:", transformedData);
          console.log("Final count after filtering:", transformedData.length);
          setNhhSupabaseData(transformedData);
        } else {
          console.error("Error fetching NHH data:", error);
        }
        setLoading(false);
      }
    };

    fetchNhhData();
  }, [selectedUniversity]);
  
  // Use Supabase data for NHH, fallback to hardcoded data for others
  const getCurrentUniversityData = () => {
    if (selectedUniversity === 'nhh' && nhhSupabaseData.length > 0) {
      return nhhSupabaseData;
    }
    return universityData[selectedUniversity] || [];
  };
  
  const currentUniversityData = getCurrentUniversityData();
  
  const sortedPrograms = [...currentUniversityData].sort((a, b) => {
    if (sortBy === "snitt") {
      // Handle '-1' or '0' values for sorting by average
      const aVal = a.snitt === -1 || a.snitt === 0 ? -Infinity : a.snitt;
      const bVal = b.snitt === -1 || b.snitt === 0 ? -Infinity : b.snitt;
      return bVal - aVal;
    } else if (sortBy === "popularity") {
      return b.sokereMott - a.sokereMott;
    } else if (sortBy === "competition") {
      // Higher value means more competition
      const aRatio = a.sokereKvalifisert / a.planlagteStudieplasser;
      const bRatio = b.sokereKvalifisert / b.planlagteStudieplasser;
      return bRatio - aRatio;
    }
    return 0;
  });
  
  // Get top 5 programs
  const topPrograms = sortedPrograms.slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Velg universitet
            </CardTitle>
            <CardDescription>Se topplinjene ved utvalgte universiteter</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedUniversity} onValueChange={setSelectedUniversity}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Velg et universitet" />
              </SelectTrigger>
              <SelectContent>
                {universities.map((uni) => (
                  <SelectItem key={uni.id} value={uni.id}>
                    {uni.name}
                    {uni.id === 'nhh' && ' (2024 data)'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Sorter etter
            </CardTitle>
            <CardDescription>Velg hvordan du vil sortere utdanningene</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Velg sorteringsmetode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="snitt">Karaktersnitt</SelectItem>
                <SelectItem value="popularity">Popularitet (antall møtt)</SelectItem>
                <SelectItem value="competition">Konkurransenivå (søkere per plass)</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            Topplinjene ved {universities.find(u => u.id === selectedUniversity)?.name || 'universitet'}
            {selectedUniversity === 'nhh' && (
              <Badge variant="secondary" className="ml-2">2024 data fra Supabase</Badge>
            )}
          </CardTitle>
          <CardDescription>
            De 5 mest {sortBy === 'snitt' ? 'krevende' : sortBy === 'popularity' ? 'populære' : 'konkurranseutsatte'} 
            utdanningene basert på 2024 data
            {loading && ' (Henter data...)'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
              <p>Henter 2024 data fra Supabase...</p>
            </div>
          ) : topPrograms.length > 0 ? (
            topPrograms.map((program, index) => (
              <UniversityProgramCard 
                key={program.studiekode} 
                program={program} 
                rank={index + 1} 
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Info className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Ingen 2024 data tilgjengelig</h3>
              <p className="text-muted-foreground">
                Vi fant ingen NHH-data for 2024 i databasen ennå.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Komplett liste over studielinjer (2024)</CardTitle>
          <CardDescription>Alle tilgjengelige studielinjer ved {universities.find(u => u.id === selectedUniversity)?.name} for 2024</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Linje</TableHead>
                  <TableHead>Studiekode</TableHead>
                  <TableHead className="text-right">Snitt</TableHead>
                  <TableHead className="text-right">Søkere møtt</TableHead>
                  <TableHead className="text-right">Studieplasser</TableHead>
                  <TableHead className="text-right">Søkere per plass</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedPrograms.map((program) => (
                  <TableRow key={program.studiekode}>
                    <TableCell className="font-medium">{program.linje}</TableCell>
                    <TableCell>{program.studiekode}</TableCell>
                    <TableCell className="text-right">
                      {program.snitt > 0 ? program.snitt : 'Ikke oppgitt'}
                    </TableCell>
                    <TableCell className="text-right">{program.sokereMott}</TableCell>
                    <TableCell className="text-right">{program.planlagteStudieplasser}</TableCell>
                    <TableCell className="text-right">
                      {program.planlagteStudieplasser > 0 ? (program.sokereKvalifisert / program.planlagteStudieplasser).toFixed(1) : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UniversityStatistics;
