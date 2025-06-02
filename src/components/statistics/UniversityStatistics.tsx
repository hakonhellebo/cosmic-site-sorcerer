
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
import { Info, ExternalLink, TrendingUp, GraduationCap, Building, ChevronDown, Filter } from "lucide-react";
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

// Custom university order as specified
const UNIVERSITY_ORDER = [
  "Norges teknisk-naturvitenskapelige universitet",
  "Universitetet i Oslo",
  "Universitetet i Bergen",
  "Norges Handelshøyskole",
  "OsloMet - storbyuniversitetet",
  "UiT Norges arktiske universitet",
  "Universitetet i Innlandet",
  "Høgskulen på Vestlandet",
  "Universitetet i Sørøst-Norge",
  "Universitetet i Stavanger",
  "Universitetet i Agder",
  "Norges miljø- og biovitenskapelige universitet",
  "NLA Høgskolen",
  "Nord universitet",
  "Høgskolen i Østfold",
  "Høgskolen i Molde, Vitenskaplig høgskole i logistikk",
  "VID vitenskapelige høgskole",
  "Norges idrettshøgskole",
  "Høgskulen i Volda",
  "Politihøgskolen",
  "Arkitektur- og designhøgskolen i Oslo",
  "Ansgar høyskole",
  "MF vitenskapelig høyskole",
  "Fjellhaug Internasjonale Høgskole"
];

const UniversityStatistics = () => {
  const [selectedUniversity, setSelectedUniversity] = useState("alle");
  const [selectedProgram, setSelectedProgram] = useState("alle");
  const [sortBy, setSortBy] = useState("snitt");
  const [allStudentData, setAllStudentData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [universities, setUniversities] = useState<string[]>([]);
  const [availablePrograms, setAvailablePrograms] = useState<string[]>([]);
  
  // Fetch all data from Student_data when component mounts
  useEffect(() => {
    const fetchStudentData = async () => {
      setLoading(true);
      console.log("Fetching ALL data from Student_data...");
      
      try {
        // Fetch all data in batches to avoid limits
        let allData: any[] = [];
        let from = 0;
        const batchSize = 1000;
        let hasMore = true;
        
        while (hasMore) {
          console.log(`Fetching batch starting from ${from} with size ${batchSize}`);
          
          const { data: batchData, error } = await supabase
            .from('Student_data')
            .select('*')
            .range(from, from + batchSize - 1);
          
          if (error) {
            console.error("Supabase error:", error);
            break;
          }
          
          if (batchData && batchData.length > 0) {
            allData = [...allData, ...batchData];
            console.log(`Added ${batchData.length} records. Total so far: ${allData.length}`);
            
            if (batchData.length < batchSize) {
              hasMore = false;
            } else {
              from += batchSize;
            }
          } else {
            hasMore = false;
          }
        }
        
        console.log("Final data count:", allData.length);
        console.log("Sample data:", allData.slice(0, 5));
        
        setAllStudentData(allData);
        
        // Extract unique universities and sort according to custom order
        const uniqueUniversitiesSet = new Set(
          allData.map(item => item.Lærestednavn).filter(Boolean)
        );
        
        // Sort universities according to the custom order, then alphabetically for any not in the list
        const sortedUniversities = Array.from(uniqueUniversitiesSet).sort((a, b) => {
          const indexA = UNIVERSITY_ORDER.indexOf(a);
          const indexB = UNIVERSITY_ORDER.indexOf(b);
          
          if (indexA !== -1 && indexB !== -1) {
            return indexA - indexB;
          } else if (indexA !== -1) {
            return -1;
          } else if (indexB !== -1) {
            return 1;
          } else {
            return a.localeCompare(b);
          }
        });
        
        setUniversities(sortedUniversities);
        console.log("Found universities (in custom order):", sortedUniversities);
        
      } catch (err) {
        console.error("Error:", err);
      }
      setLoading(false);
    };

    fetchStudentData();
  }, []);
  
  // Update available programs when university changes
  useEffect(() => {
    if (allStudentData.length > 0) {
      // Filter data for selected university and get unique study programs from column C (Studienavn)
      const universityData = selectedUniversity === "alle" 
        ? allStudentData 
        : allStudentData.filter(item => item.Lærestednavn === selectedUniversity);
      
      const programs = [...new Set(universityData.map(item => 
        item.Studienavn
      ).filter(Boolean))].sort();
      
      setAvailablePrograms(programs);
      console.log(`Found ${programs.length} programs for ${selectedUniversity}:`, programs);
    }
  }, [selectedUniversity, allStudentData]);
  
  // Process data for display
  const getProcessedData = () => {
    if (allStudentData.length === 0) return [];
    
    // Filter data for selected university
    const universityData = selectedUniversity === "alle" 
      ? allStudentData 
      : allStudentData.filter(item => item.Lærestednavn === selectedUniversity);
    
    // Filter by selected program if not "alle"
    const filteredData = selectedProgram === "alle" 
      ? universityData 
      : universityData.filter(item => item.Studienavn === selectedProgram);
    
    // Group by study program and aggregate the measures
    const programMap = new Map();
    
    filteredData.forEach(row => {
      const studienavn = row.Studienavn;
      const studiested = row.Studiested;
      const laerestednavn = row.Lærestednavn;
      const measureName = row['Measure Names'];
      const measureValue = row['Measure Values'];
      
      if (!studienavn || !measureName || !measureValue) return;
      
      const key = `${studienavn}-${studiested}-${laerestednavn}`;
      
      if (!programMap.has(key)) {
        programMap.set(key, {
          linje: studienavn,
          studiekode: row.Studiekode || 'N/A',
          studiested: studiested,
          universitet: laerestednavn,
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                <SelectItem value="alle">Alle universiteter</SelectItem>
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
              <Filter className="h-5 w-5" />
              Filtrer studielinjer
            </CardTitle>
            <CardDescription>Filtrer på spesifikke studielinjer</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedProgram} onValueChange={setSelectedProgram}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Velg studielinje" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alle">Alle studielinjer</SelectItem>
                {availablePrograms.map((program) => (
                  <SelectItem key={program} value={program}>
                    {program}
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
                  Studielinjer ved {selectedUniversity === "alle" ? "alle universiteter" : selectedUniversity}
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
            Studielinjer ved {selectedUniversity === "alle" ? "alle universiteter" : selectedUniversity}
            <Badge variant="secondary" className="ml-2">Student_data</Badge>
          </CardTitle>
          <CardDescription>
            Viser {currentData.length} studielinjer hentet fra Student_data
            {selectedProgram !== "alle" && ` (filtrert på: ${selectedProgram})`}
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
                key={`${program.studiekode}-${program.studiested}-${program.universitet}`} 
                program={program} 
                rank={index + 1} 
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Info className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Ingen data tilgjengelig</h3>
              <p className="text-muted-foreground">
                {selectedUniversity === "alle" ? 
                  'Vi fant ingen studielinjer i Student_data tabellen.' :
                  `Vi fant ingen studielinjer for ${selectedUniversity} i Student_data tabellen.`
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Komplett liste over studielinjer</CardTitle>
          <CardDescription>
            Alle tilgjengelige studielinjer ved {selectedUniversity === "alle" ? "alle universiteter" : selectedUniversity} fra Student_data
            {selectedProgram !== "alle" && ` (filtrert på: ${selectedProgram})`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Linje</TableHead>
                  <TableHead>Studiekode</TableHead>
                  <TableHead>Universitet</TableHead>
                  <TableHead>Studiested</TableHead>
                  <TableHead className="text-right">Snitt</TableHead>
                  <TableHead className="text-right">Søkere møtt</TableHead>
                  <TableHead className="text-right">Studieplasser</TableHead>
                  <TableHead className="text-right">Søkere per plass</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedPrograms.map((program, index) => (
                  <TableRow 
                    key={`${program.studiekode}-${program.studiested}-${program.universitet}-${index}`}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => {
                      // Open in new tab - generate a mock URL for the study program
                      const url = `/utdanning/${encodeURIComponent(program.universitet)}/${encodeURIComponent(program.studiekode)}`;
                      window.open(url, '_blank');
                    }}
                  >
                    <TableCell className="font-medium">{program.linje}</TableCell>
                    <TableCell>{program.studiekode}</TableCell>
                    <TableCell>{program.universitet}</TableCell>
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
