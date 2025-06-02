
import React from 'react';
import { ArrowLeft, ExternalLink, Users, MapPin, BookOpen, Award, Briefcase, FlaskConical, Heart, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const UniversityUiT = () => {
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
              <h1 className="text-4xl font-bold mb-2">UiT Norges arktiske universitet</h1>
              <p className="text-xl text-muted-foreground">Verdens nordligste universitet</p>
            </div>
            <Badge variant="secondary" className="w-fit">
              Arktisk forskning & utdanning
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
              UiT er verdens nordligste universitet og et av Norges største, med hovedcampus i Tromsø og 
              studiesteder over hele Nord-Norge (Alta, Harstad, Narvik, Bodø, Mo i Rana, Kirkenes, Longyearbyen). 
              UiT er kjent for forskning og utdanning tilpasset nordlige og arktiske forhold, men tilbyr også 
              et bredt spekter av nasjonale og internasjonale studier i et unikt, mangfoldig miljø.
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
                Campus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">Hovedcampus i Tromsø, studiesteder i hele Nord-Norge</p>
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
              <p className="text-lg">170+ bachelor, master, profesjon, årsstudier, PhD</p>
            </CardContent>
          </Card>
        </div>

        {/* Fagområder */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Fagområder</CardTitle>
            <CardDescription>UiT tilbyr et bredt utvalg utdanninger, blant annet:</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="space-y-2">
                <li>• Helsefag og medisin (lege, sykepleie, tannlege, farmasi, psykologi)</li>
                <li>• Biologi, miljø, arktiske og marine studier</li>
                <li>• Lærerutdanning og pedagogikk</li>
                <li>• Samfunnsvitenskap, jus og statsvitenskap</li>
              </ul>
              <ul className="space-y-2">
                <li>• Humaniora (språk, historie, kultur, kunst)</li>
                <li>• Teknologi og ingeniørfag (IT, data, automasjon, energi)</li>
                <li>• Fiskeri, havbruk og ressursforvaltning</li>
                <li>• Reindrift, urfolksstudier og samiske fag</li>
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
                <h4 className="font-semibold mb-2">Arktisk profil</h4>
                <p>Forskning og utdanning knyttet til klima, miljø, ressursforvaltning og nordområdene.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Internasjonalt miljø</h4>
                <p>Mange internasjonale studenter, forskere og utvekslingsmuligheter.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Sterke fagmiljøer</h4>
                <p>Helsefag (særlig medisin, odontologi og farmasi), biovitenskap, marine fag og samfunnsfag.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Studiemangfold</h4>
                <p>Alt fra tradisjonelle universitetsfag til samiske og urfolksstudier, fiskeri, klima og polarforskning.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Unik lokasjon</h4>
                <p>Nordlys, arktisk natur, midnattssol – og nært samarbeid med næringsliv, offentlig sektor og internasjonale institusjoner.</p>
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
                <li>• Profesjonsstudier (medisin, tannlege, psykologi, ingeniør) har spesifikke fagkrav og høye opptakspoeng</li>
                <li>• Noen fag har opptaksprøver eller særskilte krav</li>
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
                <li>• UiT gir gode jobbmuligheter, spesielt innen helse, forskning, offentlig sektor, biologi, fiskeri/havbruk og klima/miljø</li>
                <li>• Praksis, feltarbeid og samarbeid med arbeidslivet står sentralt i mange studier</li>
                <li>• Universitetet har egne karrieresentre og veiledning for studenter</li>
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
                <li>• UiT er internasjonalt ledende innen arktisk, klima, helse og marine fag</li>
                <li>• Deltar i nasjonale og globale forskningsprosjekter, særlig knyttet til klima, urfolk, teknologi og ressursforvaltning</li>
                <li>• Samarbeider tett med både næringsliv, forskningsinstitutter og internasjonale partnere</li>
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
                <li>• Aktivt studentmiljø, spesielt i Tromsø med studentforeninger, idrettslag, kultur, revy og festivaler</li>
                <li>• Unikt sosialt miljø med naturen rett utenfor døra – nordlys, ski, hav og fjell</li>
                <li>• Studenthus, kafeer, treningssentre og mange arrangementer</li>
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
              <li>• Perfekt for deg som vil studere i spektakulær natur, i et internasjonalt og inkluderende miljø</li>
              <li>• Gode muligheter for deg som ønsker å jobbe med helse, klima, urfolk, teknologi eller arktiske spørsmål</li>
              <li>• Passer for deg som er nysgjerrig på nordområdene, polarforskning og ønsker praksisnære studier</li>
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
                <a href="https://www.uit.no/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  uit.no
                </a>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href="https://uit.no/utdanning" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Studier ved UiT
                </a>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href="https://uit.no/utdanning/studentlivet" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Studentliv i Tromsø og Nord-Norge
                </a>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href="https://uit.no/utdanning/opptak" target="_blank" rel="noopener noreferrer">
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

export default UniversityUiT;
