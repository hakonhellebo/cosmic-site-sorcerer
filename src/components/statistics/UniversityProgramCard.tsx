
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, TrendingUp, Users, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const UniversityProgramCard = ({ program, rank }) => {
  const navigate = useNavigate();
  
  // Calculate competition level
  const competitionRatio = program.sokereKvalifisert / program.planlagteStudieplasser;
  
  let competitionLevel = "Lav";
  let competitionColor = "bg-green-100 text-green-800";
  
  if (competitionRatio > 20) {
    competitionLevel = "Ekstremt høy";
    competitionColor = "bg-red-100 text-red-800";
  } else if (competitionRatio > 15) {
    competitionLevel = "Veldig høy";
    competitionColor = "bg-red-100 text-red-800";
  } else if (competitionRatio > 10) {
    competitionLevel = "Høy";
    competitionColor = "bg-orange-100 text-orange-800";
  } else if (competitionRatio > 5) {
    competitionLevel = "Moderat";
    competitionColor = "bg-yellow-100 text-yellow-800";
  }
  
  // Generate a fake URL based on program name
  const generateProgramUrl = (programName) => {
    const baseUrl = program.universitet.toLowerCase().includes('ntnu') 
      ? 'https://www.ntnu.no/studier/' 
      : program.universitet.toLowerCase().includes('oslo')
      ? 'https://www.uio.no/studier/'
      : program.universitet.toLowerCase().includes('handelshøyskole')
      ? 'https://www.nhh.no/studier/'
      : program.universitet.toLowerCase().includes('bergen')
      ? 'https://www.uib.no/studier/'
      : 'https://www.samordnaopptak.no/';
      
    // Convert program name to URL friendly format
    const urlName = programName.toLowerCase()
      .replace(/[æø]/g, 'o')
      .replace(/[å]/g, 'a')
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
    
    return `${baseUrl}${urlName}`;
  };
  
  // Get program description based on the program name
  const getProgramDescription = () => {
    if (program.linje.toLowerCase().includes("medisin")) {
      return "Profesjonsstudiet i medisin gir deg kompetanse til å arbeide som lege. Du lærer om kroppens oppbygning og funksjon, sykdommer og behandling.";
    } else if (program.linje.toLowerCase().includes("økonom")) {
      return "Studiet gir deg en solid grunnforståelse innen økonomi og administrasjon, med fokus på ledelse, regnskap, finans og markedsføring.";
    } else if (program.linje.toLowerCase().includes("data") || program.linje.toLowerCase().includes("informatikk")) {
      return "Et studie med fokus på programmering, algoritmer, systemutvikling og digitale plattformer. Gir kompetanse innen moderne teknologiutvikling.";
    } else if (program.linje.toLowerCase().includes("psykologi")) {
      return "Studiet gir deg innsikt i menneskelig atferd, tanker og følelser, samt metoder for å behandle og forebygge psykiske lidelser.";
    } else if (program.linje.toLowerCase().includes("ingeniør")) {
      return "En praktisk rettet utdanning som kombinerer teori og praksis for å løse tekniske utfordringer innen ulike fagfelt.";
    } else {
      return "Dette studiet gir deg fagkompetanse og analytiske ferdigheter innen et spennende felt med gode jobbmuligheter.";
    }
  };
  
  const handleCardClick = () => {
    console.log("Card clicked for program:", program);
    // Navigate to the detailed education page using proper encoding
    const universityEncoded = encodeURIComponent(program.universitet);
    const studiekodeEncoded = encodeURIComponent(program.studiekode);
    console.log("Navigating to:", `/utdanning/${universityEncoded}/${studiekodeEncoded}`);
    navigate(`/utdanning/${universityEncoded}/${studiekodeEncoded}`, {
      state: {
        program: program,
        university: program.universitet
      }
    });
  };
  
  return (
    <Card 
      className={`border-l-4 transition-all hover:shadow-md cursor-pointer ${rank === 1 ? 'border-l-primary' : ''}`}
      onClick={handleCardClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="mr-1">#{rank}</Badge>
              <CardTitle className="text-xl">{program.linje}</CardTitle>
            </div>
            <CardDescription className="mt-1">Studiekode: {program.studiekode}</CardDescription>
          </div>
          {program.snitt > 0 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary flex items-center gap-1">
                    <GraduationCap className="h-4 w-4" />
                    <span>{program.snitt}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Karaktersnitt for opptak</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground mb-4">{getProgramDescription()}</p>
        
        <div className="grid grid-cols-3 gap-4 py-2">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Studieplasser</span>
            <span className="font-medium">{program.planlagteStudieplasser}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Søkere møtt</span>
            <span className="font-medium">{program.sokereMott}</span>
          </div>
          <div className="flex flex-col">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <span className="text-sm text-muted-foreground">Konkurransenivå</span>
                    <div className={`text-xs px-2 py-0.5 rounded-full w-fit ${competitionColor}`}>
                      {competitionLevel}
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Basert på antall kvalifiserte søkere per studieplass</p>
                  <p className="font-medium">{competitionRatio.toFixed(1)} søkere per plass</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1 ml-auto" 
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click when clicking external link
            window.open(generateProgramUrl(program.linje), '_blank');
          }}
        >
          <span>Ekstern lenke</span>
          <ExternalLink className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UniversityProgramCard;
