
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { GraduationCap, ExternalLink } from 'lucide-react';

interface UniversitySelectorProps {
  selectedUniversity: string;
  onUniversityChange: (value: string) => void;
  universities: string[];
}

const UniversitySelector: React.FC<UniversitySelectorProps> = ({
  selectedUniversity,
  onUniversityChange,
  universities
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

  const buttonHandler = getUniversityButtonHandler(selectedUniversity);
  const displayName = getUniversityDisplayName(selectedUniversity);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          Velg universitet
        </CardTitle>
        <CardDescription>Se studielinjer ved utvalgte universiteter</CardDescription>
      </CardHeader>
      <CardContent>
        <Select value={selectedUniversity} onValueChange={onUniversityChange}>
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
        
        {buttonHandler && (
          <div className="mt-3">
            <Button 
              onClick={buttonHandler}
              variant="outline" 
              className="w-full flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Les mer om {displayName} her
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UniversitySelector;
