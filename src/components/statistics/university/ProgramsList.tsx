
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Info } from 'lucide-react';
import UniversityProgramCard from '../UniversityProgramCard';

interface ProgramsListProps {
  programs: any[];
  selectedUniversity: string;
  programSearchTerm: string;
  loading: boolean;
  totalDataCount: number;
}

const ProgramsList: React.FC<ProgramsListProps> = ({
  programs,
  selectedUniversity,
  programSearchTerm,
  loading,
  totalDataCount
}) => {
  const navigate = useNavigate();

  const getUniversityButtonHandler = (university: string) => {
    const handlers: Record<string, () => void> = {
      "Norges teknisk-naturvitenskapelige universitet": () => navigate('/university/ntnu'),
      "Universitetet i Oslo": () => navigate('/university/uio'),
      "Universitetet i Bergen": () => navigate('/university/uib'),
      "Norges Handelshøyskole": () => navigate('/university/nhh'),
      "OsloMet - storbyuniversitetet": () => navigate('/university/oslomet'),
      "Universitetet i Stavanger": () => navigate('/university/uis'),
      "UiT Norges arktiske universitet": () => navigate('/university/uit'),
      "Norges miljø- og biovitenskapelige universitet": () => navigate('/university/nmbu'),
      "Universitetet i Agder": () => navigate('/university/uia'),
      "Høgskulen på Vestlandet": () => navigate('/university/hvl'),
      "Høgskulen i Volda": () => navigate('/university/hivolda'),
      "Universitetet i Sørøst-Norge": () => navigate('/university/usn'),
    };
    
    return handlers[university];
  };

  const getUniversityDisplayName = (university: string) => {
    const displayNames: Record<string, string> = {
      "Norges teknisk-naturvitenskapelige universitet": "NTNU",
      "Universitetet i Oslo": "UiO",
      "Universitetet i Bergen": "UiB",
      "Norges Handelshøyskole": "NHH",
      "OsloMet - storbyuniversitetet": "OsloMet",
      "Universitetet i Stavanger": "UiS",
      "UiT Norges arktiske universitet": "UiT",
      "Norges miljø- og biovitenskapelige universitet": "NMBU",
      "Universitetet i Agder": "UiA",
      "Høgskulen på Vestlandet": "HVL",
      "Høgskulen i Volda": "HiVolda",
      "Universitetet i Sørøst-Norge": "USN",
    };
    
    return displayNames[university] || university;
  };

  const handleProgramClick = (program: any) => {
    const universityEncoded = encodeURIComponent(program.universitet);
    const studiekodeEncoded = encodeURIComponent(program.studiekode);
    navigate(`/utdanning/${universityEncoded}/${studiekodeEncoded}`);
  };

  const buttonHandler = getUniversityButtonHandler(selectedUniversity);
  const displayName = getUniversityDisplayName(selectedUniversity);
  const topPrograms = programs.slice(0, 5);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">
                Studielinjer ved {selectedUniversity === "alle" ? "alle universiteter" : selectedUniversity}
                <Badge variant="secondary" className="ml-2">Student_data</Badge>
              </CardTitle>
              <CardDescription>
                Viser {programs.length} studielinjer hentet fra Student_data
                {programSearchTerm && ` (søkeord: "${programSearchTerm}")`}
                {loading && ' (Henter data...)'}
              </CardDescription>
            </div>
            
            {buttonHandler && (
              <Button 
                onClick={buttonHandler}
                variant="outline" 
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Les mer om {displayName} her
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
                {programs.map((program, index) => (
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
    </>
  );
};

export default ProgramsList;
