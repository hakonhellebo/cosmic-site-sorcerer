
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, GraduationCap, Users, TrendingUp, Building } from "lucide-react";
import { universityData } from '@/data/universityStatistics';

const EducationDetailsPage = () => {
  const { universityId, studiekode } = useParams();
  const navigate = useNavigate();
  
  // Find the specific program
  const universityPrograms = universityData[universityId || ''] || [];
  const program = universityPrograms.find(p => p.studiekode === studiekode);
  
  if (!program) {
    return (
      <Layout>
        <div className="container mx-auto py-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Utdanning ikke funnet</h1>
            <p className="text-muted-foreground mb-6">Beklager, vi kunne ikke finne informasjon om denne utdanningen.</p>
            <Button onClick={() => navigate('/statistikk')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Tilbake til statistikk
            </Button>
          </div>
        </div>
      </Layout>
    );
  }
  
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
  
  const getUniversityName = (id: string) => {
    const universities = {
      'nhh': 'Norges Handelshøyskole',
      'ntnu': 'Norges teknisk-naturvitenskapelige universitet',
      'uio': 'Universitetet i Oslo',
      'uib': 'Universitetet i Bergen',
      'oslomet': 'OsloMet - storbyuniversitetet'
    };
    return universities[id] || 'Ukjent universitet';
  };

  return (
    <Layout>
      <div className="container mx-auto py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/statistikk')}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Tilbake til statistikk
          </Button>
          
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">{program.linje}</h1>
              <p className="text-xl text-muted-foreground mb-2">{getUniversityName(universityId || '')}</p>
              <Badge variant="outline" className="text-sm">Studiekode: {program.studiekode}</Badge>
            </div>
            
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Karaktersnitt
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {program.snitt > 0 ? program.snitt : 'Ikke oppgitt'}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Studieplasser
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{program.planlagteStudieplasser}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Søkere møtt
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{program.sokereMott}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Konkurransenivå</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-sm px-3 py-1 rounded-full w-fit ${competitionColor}`}>
                    {competitionLevel}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {competitionRatio.toFixed(1)} søkere per plass
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Detailed Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Detaljerte søkerstatistikker</CardTitle>
                <CardDescription>Oversikt over søkertall og opptaksstatistikk for 2024</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Totalt antall søkere:</span>
                      <span className="font-medium">{program.sokere}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Kvalifiserte søkere:</span>
                      <span className="font-medium">{program.sokereKvalifisert}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Søkere som fikk tilbud:</span>
                      <span className="font-medium">{program.sokereTilbud}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Søkere som takket ja:</span>
                      <span className="font-medium">{program.sokereTilbudJaSvar}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Søkere som møtte:</span>
                      <span className="font-medium">{program.sokereMott}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Søkere per studieplass:</span>
                      <span className="font-medium">{(program.sokereKvalifisert / program.planlagteStudieplasser).toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* About the Program */}
            <Card>
              <CardHeader>
                <CardTitle>Om studiet</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {program.beskrivelse || "Dette studiet gir deg fagkompetanse og analytiske ferdigheter innen et spennende felt med gode jobbmuligheter."}
                </p>
                <Button variant="outline" asChild>
                  <a href={program.link || '#'} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Les mer på universitetets nettsider
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EducationDetailsPage;
