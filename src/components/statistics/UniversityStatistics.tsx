
import React, { useState } from 'react';
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
import UniversityProgramCard from './UniversityProgramCard';

const UniversityStatistics = () => {
  const [selectedUniversity, setSelectedUniversity] = useState("nhh");
  const [sortBy, setSortBy] = useState("snitt");
  
  const universities = [
    { id: 'nhh', name: 'Norges Handelshøyskole' },
    { id: 'ntnu', name: 'Norges teknisk-naturvitenskapelige universitet' },
    { id: 'uio', name: 'Universitetet i Oslo' },
    { id: 'uib', name: 'Universitetet i Bergen' },
    { id: 'oslomet', name: 'OsloMet - storbyuniversitetet' }
  ];
  
  const currentUniversityData = universityData[selectedUniversity] || [];
  
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
                  <SelectItem key={uni.id} value={uni.id}>{uni.name}</SelectItem>
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
          </CardTitle>
          <CardDescription>
            De 5 mest {sortBy === 'snitt' ? 'krevende' : sortBy === 'popularity' ? 'populære' : 'konkurranseutsatte'} 
            utdanningene basert på data fra 2024
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {topPrograms.length > 0 ? (
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
                Vi har dessverre ikke statistikk for dette universitetet ennå.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Komplett liste over studielinjer</CardTitle>
          <CardDescription>Alle tilgjengelige studielinjer ved {universities.find(u => u.id === selectedUniversity)?.name}</CardDescription>
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
                      {(program.sokereKvalifisert / program.planlagteStudieplasser).toFixed(1)}
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
