
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
import { Info, ExternalLink, TrendingUp, GraduationCap, Building, ChevronDown } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from '@/lib/supabase';
import UniversityProgramCard from './UniversityProgramCard';

const UniversityStatistics = () => {
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [sortBy, setSortBy] = useState("snitt");
  const [allStudentData, setAllStudentData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [universities, setUniversities] = useState<string[]>([]);
  const [availablePrograms, setAvailablePrograms] = useState<string[]>([]);
  
  // Fetch all data from Student_data when component mounts
  useEffect(() => {
    const fetchStudentData = async () => {
      setLoading(true);
      console.log("Fetching all data from Student_data...");
      
      try {
        const { data, error } = await supabase
          .from('Student_data')
          .select('*');
        
        if (data && !error) {
          console.log("Raw Student_data:", data.slice(0, 5));
          console.log("Number of records:", data.length);
          
          setAllStudentData(data);
          
          // Extract unique universities from column A (Lærestednavn)
          const uniqueUniversities = [...new Set(data.map(item => item.Lærestednavn).filter(Boolean))].sort();
          setUniversities(uniqueUniversities);
          console.log("Found universities:", uniqueUniversities);
          
          // Set first university as default
          if (uniqueUniversities.length > 0 && !selectedUniversity) {
            setSelectedUniversity(uniqueUniversities[0]);
          }
        } else {
          console.error("Error fetching Student_data:", error);
        }
      } catch (err) {
        console.error("Error:", err);
      }
      setLoading(false);
    };

    fetchStudentData();
  }, []);
  
  // Update available programs when university changes
  useEffect(() => {
    if (allStudentData.length > 0 && selectedUniversity) {
      // Filter data for selected university and get unique study programs from column C (Studienavn)
      const universityData = allStudentData.filter(item => 
        item.Lærestednavn === selectedUniversity
      );
      
      const programs = [...new Set(universityData.map(item => 
        item.Studienavn
      ).filter(Boolean))].sort();
      
      setAvailablePrograms(programs);
      console.log(`Found ${programs.length} programs for ${selectedUniversity}:`, programs);
    }
  }, [selectedUniversity, allStudentData]);
  
  // Process data for display
  const getProcessedData = () => {
    if (!selectedUniversity || allStudentData.length === 0) return [];
    
    // Filter data for selected university
    const universityData = allStudentData.filter(item => 
      item.Lærestednavn === selectedUniversity
    );
    
    // Group by study program and aggregate the measures
    const programMap = new Map();
    
    universityData.forEach(row => {
      const studienavn = row.Studienavn;
      const studiested = row.Studiested;
      const measureName = row['Measure Names'];
      const measureValue = row['Measure Values'];
      
      if (!studienavn || !measureName || !measureValue) return;
      
      const key = `${studienavn}-${studiested}`;
      
      if (!programMap.has(key)) {
        programMap.set(key, {
          linje: studienavn,
          studiekode: row.Studiekode || 'N/A',
          studiested: studiested,
          universitet: selectedUniversity,
          measures: {}
        });
      }
      
      const program = programMap.get(key);
      program.measures[measureName] = parseFloat(measureValue) || 0;
    });
    
    // Convert to array and add computed fields
    const processedData = Array.from(programMap.values()).map(program => ({
      ...program,
      snitt: program.measures['Snitt'] || 0,
      planlagteStudieplasser: program.measures['Planlagte studieplasser'] || 0,
      sokereMott: program.measures['Søkere møtt'] || 0,
      sokereTilbud: program.measures['Søkere tilbud'] || 0,
      sokereTilbudJaSvar: program.measures['Søkere tilbud ja-svar'] || 0,
      sokereKvalifisert: program.measures['Søkere kvalifisert'] || 0,
      sokere: program.measures['Søkere'] || 0,
      sokereMottPerStudieplass: program.measures['Søkere per plass'] || 0
    }));
    
    return processedData;
  };
  
  const currentData = getProcessedData();
  
  const sortedPrograms = [...currentData].sort((a, b) => {
    if (sortBy === "snitt") {
      const aVal = a.snitt === 0 ? -Infinity : a.snitt;
      const bVal = b.snitt === 0 ? -Infinity : b.snitt;
      return bVal - aVal;
    } else if (sortBy === "popularity") {
      return b.sokereMott - a.sokereMott;
    } else if (sortBy === "competition") {
      const aRatio = a.planlagteStudieplasser > 0 ? a.sokereKvalifisert / a.planlagteStudieplasser : 0;
      const bRatio = b.planlagteStudieplasser > 0 ? b.sokereKvalifisert / b.planlagteStudieplasser : 0;
      return bRatio - aRatio;
    }
    return 0;
  });
  
  const topPrograms = sortedPrograms.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Data source indicator */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-green-800 text-sm">
          ✅ Viser data hentet fra Student_data tabell
        </p>
        <p className="text-green-700 text-xs mt-1">
          Totalt {allStudentData.length} poster hentet fra databasen
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Velg universitet
            </CardTitle>
            <CardDescription>Se studielinjer ved utvalgte universiteter</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedUniversity} onValueChange={setSelectedUniversity}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Velg et universitet" />
              </SelectTrigger>
              <SelectContent>
                {universities.map((uni) => (
                  <SelectItem key={uni} value={uni}>
                    {uni}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Studielinjer
            </CardTitle>
            <CardDescription>Se alle tilgjengelige studielinjer</CardDescription>
          </CardHeader>
          <CardContent>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span>Se studielinjer ({availablePrograms.length})</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 max-h-96 overflow-y-auto bg-white border shadow-lg z-50">
                <DropdownMenuLabel className="sticky top-0 bg-white">
                  Studielinjer ved {selectedUniversity}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {availablePrograms.length > 0 ? (
                  availablePrograms.map((program, index) => (
                    <DropdownMenuItem key={index} className="py-2 px-3">
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{program}</span>
                      </div>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem disabled>
                    {loading ? "Henter studielinjer..." : "Ingen studielinjer tilgjengelig"}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
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
            Studielinjer ved {selectedUniversity || 'universitet'}
            <Badge variant="secondary" className="ml-2">Student_data</Badge>
          </CardTitle>
          <CardDescription>
            Viser {currentData.length} studielinjer hentet fra Student_data
            {loading && ' (Henter data...)'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
              <p>Henter data fra Student_data...</p>
            </div>
          ) : topPrograms.length > 0 ? (
            topPrograms.map((program, index) => (
              <UniversityProgramCard 
                key={`${program.studiekode}-${program.studiested}`} 
                program={program} 
                rank={index + 1} 
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Info className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Ingen data tilgjengelig</h3>
              <p className="text-muted-foreground">
                {selectedUniversity ? 
                  `Vi fant ingen studielinjer for ${selectedUniversity} i Student_data tabellen.` :
                  'Velg et universitet for å se tilgjengelige studielinjer.'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Komplett liste over studielinjer</CardTitle>
          <CardDescription>Alle tilgjengelige studielinjer ved {selectedUniversity} fra Student_data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Linje</TableHead>
                  <TableHead>Studiekode</TableHead>
                  <TableHead>Studiested</TableHead>
                  <TableHead className="text-right">Snitt</TableHead>
                  <TableHead className="text-right">Søkere møtt</TableHead>
                  <TableHead className="text-right">Studieplasser</TableHead>
                  <TableHead className="text-right">Søkere per plass</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedPrograms.map((program, index) => (
                  <TableRow key={`${program.studiekode}-${program.studiested}-${index}`}>
                    <TableCell className="font-medium">{program.linje}</TableCell>
                    <TableCell>{program.studiekode}</TableCell>
                    <TableCell>{program.studiested}</TableCell>
                    <TableCell className="text-right">
                      {program.snitt > 0 ? program.snitt.toFixed(1) : 'Ikke oppgitt'}
                    </TableCell>
                    <TableCell className="text-right">{program.sokereMott}</TableCell>
                    <TableCell className="text-right">{program.planlagteStudieplasser}</TableCell>
                    <TableCell className="text-right">
                      {program.sokereMottPerStudieplass > 0 ? program.sokereMottPerStudieplass.toFixed(1) : 'N/A'}
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
