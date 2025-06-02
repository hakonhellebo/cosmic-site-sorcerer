import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Info, ExternalLink, TrendingUp, GraduationCap, Search } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
  "Høgskulen i Østfold",
  "Høgskulen i Molde, Vitenskaplig høgskole i logistikk",
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
  const navigate = useNavigate();
  const [selectedUniversity, setSelectedUniversity] = useState("alle");
  const [programSearchTerm, setProgramSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("snitt");
  const [allStudentData, setAllStudentData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [universities, setUniversities] = useState<string[]>([]);
  
  useEffect(() => {
    const fetchStudentData = async () => {
      setLoading(true);
      console.log("Fetching ALL data from Student_data...");
      
      try {
        // First, get the total count
        const { count, error: countError } = await supabase
          .from('Student_data')
          .select('*', { count: 'exact', head: true });
        
        if (countError) {
          console.error("Error getting count:", countError);
        } else {
          console.log("Total records in Student_data:", count);
        }
        
        // Fetch all data in larger batches with better logic
        let allData: any[] = [];
        let from = 0;
        const batchSize = 1000; // Keep reasonable batch size to avoid timeouts
        let hasMore = true;
        let attemptCount = 0;
        const maxAttempts = Math.ceil((count || 15000) / batchSize) + 5; // Dynamic max attempts based on count
        
        while (hasMore && attemptCount < maxAttempts) {
          attemptCount++;
          console.log(`Fetching batch ${attemptCount}: records ${from} to ${from + batchSize - 1}`);
          
          const { data: batchData, error } = await supabase
            .from('Student_data')
            .select('*')
            .range(from, from + batchSize - 1)
            .order('Lærestednavn', { ascending: true });
          
          if (error) {
            console.error("Supabase error:", error);
            break;
          }
          
          if (batchData && batchData.length > 0) {
            allData = [...allData, ...batchData];
            console.log(`Batch ${attemptCount}: Added ${batchData.length} records. Total so far: ${allData.length}`);
            
            // Move to next batch
            from += batchSize;
            
            // If we got fewer records than the batch size, we're done
            if (batchData.length < batchSize) {
              console.log("Reached end of data - batch returned fewer records than requested");
              hasMore = false;
            }
          } else {
            console.log("No more data returned");
            hasMore = false;
          }
          
          // Safety check against infinite loop and to ensure we got all data
          if (count && allData.length >= count) {
            console.log("Reached total count, stopping");
            hasMore = false;
          }
          
          // Add a small delay to avoid overwhelming the API
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        console.log("Final data count:", allData.length);
        console.log("Expected count:", count);
        console.log("Sample data:", allData.slice(0, 3));
        
        if (count && allData.length < count) {
          console.warn(`Warning: Only fetched ${allData.length} out of ${count} records`);
        }
        
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
  
  // Process data for display
  const getProcessedData = () => {
    if (allStudentData.length === 0) return [];
    
    // Filter data for selected university
    const universityData = selectedUniversity === "alle" 
      ? allStudentData 
      : allStudentData.filter(item => item.Lærestednavn === selectedUniversity);
    
    // Filter by search term if provided
    const filteredData = programSearchTerm.trim() === ""
      ? universityData 
      : universityData.filter(item => 
          item.Studienavn?.toLowerCase().includes(programSearchTerm.toLowerCase())
        );
    
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
      const bRatio = b.planlagteStudieplasser > 0 ? b.sokereKvalifisert / a.planlagteStudieplasser : 0;
      return bRatio - aRatio;
    }
    return 0;
  });
  
  const topPrograms = sortedPrograms.slice(0, 5);

  // Helper function to generate a safe URL slug from university name
  const generateUniversitySlug = (universityName: string) => {
    return universityName
      .toLowerCase()
      .replace(/[æøå]/g, (char) => {
        switch (char) {
          case 'æ': return 'ae';
          case 'ø': return 'o';
          case 'å': return 'a';
          default: return char;
        }
      })
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleProgramClick = (program: any) => {
    // Create a proper URL for the education details page using encoded values
    const universityEncoded = encodeURIComponent(program.universitet);
    const studiekodeEncoded = encodeURIComponent(program.studiekode);
    navigate(`/utdanning/${universityEncoded}/${studiekodeEncoded}`);
  };

  const handleNTNUClick = () => {
    navigate('/university/ntnu');
  };

  const handleUiOClick = () => {
    navigate('/university/uio');
  };

  const handleUiBClick = () => {
    navigate('/university/uib');
  };

  const handleNHHClick = () => {
    navigate('/university/nhh');
  };

  const handleOsloMetClick = () => {
    navigate('/university/oslomet');
  };

  const handleUiSClick = () => {
    navigate('/university/uis');
  };

  const handleUiTClick = () => {
    navigate('/university/uit');
  };

  const handleNMBUClick = () => {
    navigate('/university/nmbu');
  };

  const handleUiAClick = () => {
    navigate('/university/uia');
  };

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
                <SelectItem value="alle">Alle universiteter</SelectItem>
                {universities.map((uni) => (
                  <SelectItem key={uni} value={uni}>
                    {uni}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* NTNU Button */}
            {selectedUniversity === "Norges teknisk-naturvitenskapelige universitet" && (
              <div className="mt-3">
                <Button 
                  onClick={handleNTNUClick}
                  variant="outline" 
                  className="w-full flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Les mer om NTNU her
                </Button>
              </div>
            )}

            {/* UiO Button */}
            {selectedUniversity === "Universitetet i Oslo" && (
              <div className="mt-3">
                <Button 
                  onClick={handleUiOClick}
                  variant="outline" 
                  className="w-full flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Les mer om UiO her
                </Button>
              </div>
            )}

            {/* UiB Button */}
            {selectedUniversity === "Universitetet i Bergen" && (
              <div className="mt-3">
                <Button 
                  onClick={handleUiBClick}
                  variant="outline" 
                  className="w-full flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Les mer om UiB her
                </Button>
              </div>
            )}

            {/* NHH Button */}
            {selectedUniversity === "Norges Handelshøyskole" && (
              <div className="mt-3">
                <Button 
                  onClick={handleNHHClick}
                  variant="outline" 
                  className="w-full flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Les mer om NHH her
                </Button>
              </div>
            )}

            {/* OsloMet Button */}
            {selectedUniversity === "OsloMet - storbyuniversitetet" && (
              <div className="mt-3">
                <Button 
                  onClick={handleOsloMetClick}
                  variant="outline" 
                  className="w-full flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Les mer om OsloMet her
                </Button>
              </div>
            )}

            {/* UiS Button */}
            {selectedUniversity === "Universitetet i Stavanger" && (
              <div className="mt-3">
                <Button 
                  onClick={handleUiSClick}
                  variant="outline" 
                  className="w-full flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Les mer om UiS her
                </Button>
              </div>
            )}

            {/* UiT Button */}
            {selectedUniversity === "UiT Norges arktiske universitet" && (
              <div className="mt-3">
                <Button 
                  onClick={handleUiTClick}
                  variant="outline" 
                  className="w-full flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Les mer om UiT her
                </Button>
              </div>
            )}

            {/* NMBU Button */}
            {selectedUniversity === "Norges miljø- og biovitenskapelige universitet" && (
              <div className="mt-3">
                <Button 
                  onClick={handleNMBUClick}
                  variant="outline" 
                  className="w-full flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Les mer om NMBU her
                </Button>
              </div>
            )}

            {/* UiA Button */}
            {selectedUniversity === "Universitetet i Agder" && (
              <div className="mt-3">
                <Button 
                  onClick={handleUiAClick}
                  variant="outline" 
                  className="w-full flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Les mer om UiA her
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Søk på studielinje
            </CardTitle>
            <CardDescription>Søk etter studielinjer (f.eks. "psykologi", "økonomi")</CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Søk etter studielinjer..."
              value={programSearchTerm}
              onChange={(e) => setProgramSearchTerm(e.target.value)}
              className="w-full"
            />
            {programSearchTerm && (
              <p className="text-sm text-muted-foreground mt-2">
                Viser {currentData.length} studielinjer som inneholder "{programSearchTerm}"
              </p>
            )}
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
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">
                Studielinjer ved {selectedUniversity === "alle" ? "alle universiteter" : selectedUniversity}
                <Badge variant="secondary" className="ml-2">Student_data</Badge>
              </CardTitle>
              <CardDescription>
                Viser {currentData.length} studielinjer hentet fra Student_data
                {programSearchTerm && ` (søkeord: "${programSearchTerm}")`}
                {loading && ' (Henter data...)'}
              </CardDescription>
            </div>
            
            {/* University buttons in header */}
            {selectedUniversity === "Norges teknisk-naturvitenskapelige universitet" && (
              <Button 
                onClick={handleNTNUClick}
                variant="outline" 
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Les mer om NTNU her
              </Button>
            )}

            {selectedUniversity === "Universitetet i Oslo" && (
              <Button 
                onClick={handleUiOClick}
                variant="outline" 
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Les mer om UiO her
              </Button>
            )}

            {selectedUniversity === "Universitetet i Bergen" && (
              <Button 
                onClick={handleUiBClick}
                variant="outline" 
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Les mer om UiB her
              </Button>
            )}

            {selectedUniversity === "Norges Handelshøyskole" && (
              <Button 
                onClick={handleNHHClick}
                variant="outline" 
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Les mer om NHH her
              </Button>
            )}

            {selectedUniversity === "OsloMet - storbyuniversitetet" && (
              <Button 
                onClick={handleOsloMetClick}
                variant="outline" 
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Les mer om OsloMet her
              </Button>
            )}

            {selectedUniversity === "Universitetet i Stavanger" && (
              <Button 
                onClick={handleUiSClick}
                variant="outline" 
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Les mer om UiS her
              </Button>
            )}

            {selectedUniversity === "UiT Norges arktiske universitet" && (
              <Button 
                onClick={handleUiTClick}
                variant="outline" 
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Les mer om UiT her
              </Button>
            )}

            {selectedUniversity === "Norges miljø- og biovitenskapelige universitet" && (
              <Button 
                onClick={handleNMBUClick}
                variant="outline" 
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Les mer om NMBU her
              </Button>
            )}

            {selectedUniversity === "Universitetet i Agder" && (
              <Button 
                onClick={handleUiAClick}
                variant="outline" 
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Les mer om UiA her
              </Button>
            )}
          </div>
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
                {programSearchTerm ? 
                  `Vi fant ingen studielinjer som inneholder "${programSearchTerm}".` :
                  selectedUniversity === "alle" ? 
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
            {programSearchTerm && ` (søkeord: "${programSearchTerm}")`}
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
                    onClick={() => handleProgramClick(program)}
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
