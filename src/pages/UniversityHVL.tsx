
import React from 'react';
import { ArrowLeft, ExternalLink, Users, MapPin, BookOpen, Award, Briefcase, FlaskConical, Heart, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const UniversityHVL = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/statistikk')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Tilbake til statistikk
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Høgskulen på Vestlandet</h1>
              <p className="text-xl text-muted-foreground">Profesjonsrettet utdanning med sterk tilknytning til Vestlandet</p>
            </div>
            <Badge variant="secondary" className="w-fit">
              Profesjon & Praksis
            </Badge>
          </div>
        </div>

        {/* Kort intro */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Kort intro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">
              Høgskulen på Vestlandet (HVL) er en av Norges største høgskoler, med campus i fem 
              vestlandsbyer: Bergen, Førde, Haugesund, Sogndal og Stord. HVL har en tydelig 
              profesjonsrettet profil og utdanner kandidater til samfunnskritiske yrker – alt fra 
              ingeniører og lærere til sykepleiere, barnehagelærere, økonomer og samfunnsvitere. 
              HVL er kjent for tett samarbeid med arbeidslivet på Vestlandet og et inkluderende studentmiljø.
            </p>
          </CardContent>
        </Card>

        {/* Nøkkeltall */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Antall studenter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">17 000</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Campuser
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">Bergen, Førde, Haugesund, Sogndal, Stord</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Studieprogram
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">Over 100 bachelor-, master- og videreutdanningstilbud</p>
            </CardContent>
          </Card>
        </div>

        {/* Fagområder */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Fagområder</CardTitle>
            <CardDescription>HVL tilbyr et bredt spekter av utdanninger, blant annet:</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="space-y-2">
                <li>• Helse- og sosialfag (sykepleie, vernepleie, sosialt arbeid, radiografi, fysioterapi)</li>
                <li>• Lærer- og barnehagelærerutdanning, pedagogikk</li>
                <li>• Ingeniør- og teknologifag (data, elektro, bygg, energi, nautikk, maskin)</li>
                <li>• Økonomi, administrasjon og ledelse</li>
              </ul>
              <ul className="space-y-2">
                <li>• Idrett, friluftsliv og folkehelse</li>
                <li>• Samfunnsvitenskap og humaniora</li>
                <li>• Kunst og musikk (bl.a. musikkpedagogikk)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Særlig kjent for */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Særlig kjent for
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Sterk profesjonsprofil</h4>
                <p>Praksisnære utdanninger med tett kontakt til arbeidslivet, spesielt innen helse, teknologi, pedagogikk og samfunnsfag.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Regionforankring</h4>
                <p>Godt samarbeid med næringsliv, helseforetak, kommuner og organisasjoner på Vestlandet.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Fleksible studietilbud</h4>
                <p>Mange studier kan tas som deltids-, nett- eller samlingsbasert.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Bærekraft og innovasjon</h4>
                <p>Fokus på bærekraftige samfunn, fornybar energi og digitalisering.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Godt studentmiljø</h4>
                <p>Aktivt, mangfoldig og inkluderende studentmiljø på alle campuser.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Opptakskrav og Karrieremuligheter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Opptakskrav</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>• De fleste bachelorprogram krever generell studiekompetanse</li>
                <li>• Helse- og ingeniørstudier har spesifikke fagkrav og poenggrenser</li>
                <li>• Enkelte kreative og idrettsrelaterte fag har opptaksprøver eller særkrav</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Karrieremuligheter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>• Gode jobbmuligheter, særlig i helsevesen, skole, teknologi og offentlig sektor</li>
                <li>• Mye praksis og relevante prosjekter gir erfaring og nettverk mot arbeidslivet</li>
                <li>• HVL har eget karrieresenter og veiledning</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Forskning og Studentliv */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FlaskConical className="h-5 w-5" />
                Forskning og innovasjon
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>• Sterke forskningsmiljøer innen helse, teknologi, utdanning, idrett og samfunnsvitenskap</li>
                <li>• Nasjonale og internasjonale forskningsprosjekter, særlig innen klima, energi, helse og pedagogikk</li>
                <li>• Satsing på digitalisering, velferdsteknologi og bærekraft</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Studentliv
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>• Mange studentorganisasjoner, idrettslag, faglige og sosiale foreninger på hver campus</li>
                <li>• Gode møteplasser, egne studenthus og mange arrangementer gjennom året</li>
                <li>• Unik vestlandsnatur rett utenfor døren – perfekte omgivelser for idrett, friluftsliv og aktiviteter</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Noe for deg? */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Noe for deg?</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>• Passer for deg som vil ta en praksisnær utdanning med tett kontakt til arbeidslivet</li>
              <li>• Gode muligheter for deg som vil bo på Vestlandet, kombinere studier med friluftsliv, og ha flere campusmuligheter</li>
              <li>• Aktuelt hvis du vil inn i helse, undervisning, teknologi eller idrett</li>
            </ul>
          </CardContent>
        </Card>

        {/* Les mer */}
        <Card>
          <CardHeader>
            <CardTitle>Les mer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="w-full" asChild>
                <a href="https://www.hvl.no/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  hvl.no
                </a>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href="https://www.hvl.no/studier/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Studier ved HVL
                </a>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href="https://www.hvl.no/student/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Studentliv på HVL
                </a>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href="https://www.hvl.no/studier/opptak/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Opptak og søknad
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UniversityHVL;
