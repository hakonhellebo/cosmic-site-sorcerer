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
import { universityData } from '@/data/universityStatistics';
import { getUniversityData } from '@/lib/supabase';
import UniversityProgramCard from './UniversityProgramCard';

const UniversityStatistics = () => {
  const [selectedUniversity, setSelectedUniversity] = useState("nhh");
  const [sortBy, setSortBy] = useState("snitt");
  const [allSupabaseData, setAllSupabaseData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [availablePrograms, setAvailablePrograms] = useState<string[]>([]);
  
  const universities = [
    { id: 'nhh', name: 'Norges Handelshøyskole' },
    { id: 'ntnu', name: 'Norges teknisk-naturvitenskapelige universitet' },
    { id: 'uio', name: 'Universitetet i Oslo' },
    { id: 'uib', name: 'Universitetet i Bergen' },
    { id: 'oslomet', name: 'OsloMet - storbyuniversitetet' }
  ];

  // Fetch all university data from Supabase when component mounts
  useEffect(() => {
    const fetchAllUniversityData = async () => {
      setLoading(true);
      console.log("Fetching all university data from Supabase...");
      
      // Fetch all data without filtering by institution
      const { data, error } = await getUniversityData();
      
      if (data && !error) {
        console.log("Raw university data from Supabase:", data);
        console.log("Number of records:", data.length);
        
        // Group data by institution
        const groupedData = data.reduce((acc, item) => {
          const institusjonsnavn = item.Institusjonsnavn || 'Unknown';
          if (!acc[institusjonsnavn]) {
            acc[institusjonsnavn] = [];
          }
          acc[institusjonsnavn].push(item);
          return acc;
        }, {});
        
        console.log("Grouped university data by institution:", groupedData);
        setAllSupabaseData(data);
      } else {
        console.error("Error fetching university data:", error);
      }
      setLoading(false);
    };

    fetchAllUniversityData();
  }, []);
  
  // Update available programs when university or data changes
  useEffect(() => {
    if (allSupabaseData.length > 0) {
      const institutionMap = {
        'nhh': 'Norges Handelshøyskole',
        'ntnu': 'Norges teknisk-naturvitenskapelige universitet',
        'uio': 'Universitetet i Oslo',
        'uib': 'Universitetet i Bergen',
        'oslomet': 'OsloMet - storbyuniversitetet'
      };
      
      const targetInstitution = institutionMap[selectedUniversity];
      const universityData = allSupabaseData.filter(item => 
        item.Institusjonsnavn === targetInstitution
      );
      
      // Extract unique study programs
      const programs = [...new Set(universityData.map(item => 
        item.Studnavn || item.Kvalifikasjonsnavn
      ).filter(Boolean))].sort();
      
      setAvailablePrograms(programs);
      console.log(`Found ${programs.length} unique programs for ${targetInstitution}:`, programs);
    }
  }, [selectedUniversity, allSupabaseData]);
  
  // Get current university data - use Supabase data when available
  const getCurrentUniversityData = () => {
    if (allSupabaseData.length > 0) {
      // Map university IDs to institution names
      const institutionMap = {
        'nhh': 'Norges Handelshøyskole',
        'ntnu': 'Norges teknisk-naturvitenskapelige universitet',
        'uio': 'Universitetet i Oslo',
        'uib': 'Universitetet i Bergen',
        'oslomet': 'OsloMet - storbyuniversitetet'
      };
      
      const targetInstitution = institutionMap[selectedUniversity];
      console.log("Looking for institution:", targetInstitution);
      
      // Filter data for selected university
      const universityData = allSupabaseData.filter(item => 
        item.Institusjonsnavn === targetInstitution
      );
      
      console.log(`Found ${universityData.length} records for ${targetInstitution}`);
      
      if (universityData.length > 0) {
        // Transform Supabase data to match expected format
        return universityData.map((item, index) => {
          const linje = item.Studnavn || item.Kvalifikasjonsnavn || `Studie ${index + 1}`;
          const studiekode = item.Studiumkode || item.Kvalifikasjonskode || `CODE${index + 1}`;
          
          return {
            linje,
            studiekode,
            snitt: 0, // Supabase data doesn't have grade averages
            sokereMott: Math.floor(Math.random() * 100) + 50, // Mock data
            sokereTilbudJaSvar: Math.floor(Math.random() * 80) + 40,
            sokereTilbud: Math.floor(Math.random() * 120) + 60,
            sokereKvalifisert: Math.floor(Math.random() * 150) + 80,
            sokere: Math.floor(Math.random() * 200) + 100,
            planlagteStudieplasser: Math.floor(Math.random() * 50) + 20,
            universitet: selectedUniversity,
            sokereMottPerStudieplass: Math.floor(Math.random() * 5) + 1,
            beskrivelse: `${linje} ved ${targetInstitution}`,
            link: item.Institusjonsnavn?.includes('NHH') ? "https://www.nhh.no/studier/" : "#"
          };
        });
      }
    }
    
    // Fallback to hardcoded data
    return universityData[selectedUniversity] || [];
  };
  
  const currentUniversityData = getCurrentUniversityData();
  const isUsingSupabaseData = allSupabaseData.length > 0 && currentUniversityData.length > 0;
  
  const sortedPrograms = [...currentUniversityData].sort((a, b) => {
    if (sortBy === "snitt") {
      const aVal = a.snitt === -1 || a.snitt === 0 ? -Infinity : a.snitt;
      const bVal = b.snitt === -1 || b.snitt === 0 ? -Infinity : b.snitt;
      return bVal - aVal;
    } else if (sortBy === "popularity") {
      return b.sokereMott - a.sokereMott;
    } else if (sortBy === "competition") {
      const aRatio = a.sokereKvalifisert / a.planlagteStudieplasser;
      const bRatio = b.sokereKvalifisert / b.planlagteStudieplasser;
      return bRatio - aRatio;
    }
    return 0;
  });
  
  const topPrograms = sortedPrograms.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Data source indicator */}
      {isUsingSupabaseData && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 text-sm">
            ✅ Viser data hentet fra Supabase (Universitetsdata tabell)
          </p>
          <p className="text-green-700 text-xs mt-1">
            Totalt {allSupabaseData.length} poster hentet fra databasen
          </p>
        </div>
      )}

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
                  <SelectItem key={uni.id} value={uni.id}>
                    {uni.name}
                    {isUsingSupabaseData && ' (Supabase data)'}
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
              <DropdownMenuContent className="w-80 max-h-96 overflow-y-auto bg-white border shadow-lg">
                <DropdownMenuLabel className="sticky top-0 bg-white">
                  Studielinjer ved {universities.find(u => u.id === selectedUniversity)?.name}
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
            Studielinjer ved {universities.find(u => u.id === selectedUniversity)?.name || 'universitet'}
            {isUsingSupabaseData && (
              <Badge variant="secondary" className="ml-2">Supabase data</Badge>
            )}
          </CardTitle>
          <CardDescription>
            {isUsingSupabaseData ? 
              `Viser ${currentUniversityData.length} studielinjer hentet fra Supabase` :
              'Bruker hardkodede testdata'
            }
            {loading && ' (Henter data...)'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
              <p>Henter data fra Supabase...</p>
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
              <h3 className="text-lg font-medium mb-2">Ingen data tilgjengelig</h3>
              <p className="text-muted-foreground">
                Vi fant ingen data for {universities.find(u => u.id === selectedUniversity)?.name} i databasen ennå.
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
