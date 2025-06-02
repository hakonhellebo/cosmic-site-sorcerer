
import React from 'react';
import { ArrowLeft, ExternalLink, Users, MapPin, BookOpen, Award, Briefcase, FlaskConical, Heart, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const UniversityUiB = () => {
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
              <h1 className="text-4xl font-bold mb-2">Universitetet i Bergen (UiB)</h1>
              <p className="text-xl text-muted-foreground">Internasjonalt forskningsuniversitet i hjertet av Bergen</p>
            </div>
            <Badge variant="secondary" className="w-fit">
              Byuniversitet
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
              Universitetet i Bergen (UiB) er et internasjonalt forskningsuniversitet, kjent for sitt åpne, urbane campus 
              midt i hjertet av Bergen – Norges nest største by. UiB har lange tradisjoner, høy faglig kvalitet og et sterkt 
              studentmiljø tett på både byliv, hav og fjell.
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
              <p className="text-2xl font-bold">20 000+</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Hovedcampus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">Bergen sentrum, Marineholmen, Haukeland</p>
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
              <p className="text-2xl font-bold">190+</p>
              <p className="text-sm text-muted-foreground">Bachelor, master, profesjon, ph.d.</p>
            </CardContent>
          </Card>
        </div>

        {/* Fagområder */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Fagområder</CardTitle>
            <CardDescription>UiB tilbyr et bredt utvalg av studier innen:</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="space-y-2">
                <li>• Humaniora (historie, språk, filosofi, kulturvitenskap m.m.)</li>
                <li>• Samfunnsvitenskap (psykologi, sosiologi, geografi, informasjonsvitenskap)</li>
                <li>• Jus og rettsvitenskap (et av Norges største jusfakultet)</li>
                <li>• Matematikk og naturvitenskap (biologi, geofag, informatikk, kjemi, fysikk)</li>
              </ul>
              <ul className="space-y-2">
                <li>• Medisin, odontologi og helse (medisinstudiet, tannlege, ernæring, farmasi)</li>
                <li>• Kunst, musikk og design (KMD)</li>
                <li>• Global og utviklingsstudier</li>
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
                <h4 className="font-semibold mb-2">Sterke forskningsmiljøer</h4>
                <p>Særlig innen marin- og klimaforskning, helsefag og samfunnsfag.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Byuniversitet</h4>
                <p>Urban campus i Bergen sentrum gir nærhet til arbeidsliv, forskningsmiljø og kulturliv.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Internasjonal profil</h4>
                <p>Mange internasjonale studenter og forskere, og sterke utvekslingsmuligheter.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Hav, klima og bærekraft</h4>
                <p>UiB har ledende satsinger innen havforskning, klimavitenskap og global helse.</p>
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
                <li>• Generell studiekompetanse for de fleste bachelorprogram</li>
                <li>• Enkelte profesjonsstudier (medisin, odontologi, jus, psykologi) har høye karakterkrav og særskilte opptakskrav</li>
                <li>• Noen kreative eller praktiske fag krever opptaksprøver (musikk, design)</li>
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
                <li>• Utdanning fra UiB gir gode jobbmuligheter nasjonalt og internasjonalt</li>
                <li>• Tett samarbeid med næringslivet, offentlig sektor og forskningsmiljøer, spesielt i Vestland-regionen</li>
                <li>• UiB tilbyr karriereveiledning, praksisplasser og støtte til studentgründere</li>
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
                <li>• UiB er blant Norges ledende universiteter på forskning innen hav, klima, helse og samfunn</li>
                <li>• Flere Sentre for fremragende forskning (SFF) og samarbeid med Havforskningsinstituttet og Haukeland universitetssjukehus</li>
                <li>• Sterkt engasjement for bærekraft og internasjonale forskningsprosjekter</li>
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
                <li>• Studentbyen Bergen har et svært aktivt og inkluderende studentmiljø</li>
                <li>• Over 100 studentforeninger innen fag, idrett, kultur, frivillighet og politikk</li>
                <li>• Store studentarrangementer som UKEN-festivalen, studentradio, revyer og kulturhus (Kvarteret)</li>
                <li>• Unik blanding av byliv, kafeer, konserter – og kort vei til natur, fjord og fjell</li>
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
              <li>• Perfekt for deg som vil studere i en levende by med både urbane og naturopplevelser</li>
              <li>• Godt valg for deg som er opptatt av klima, hav, samfunn og innovasjon</li>
              <li>• Mange muligheter for utveksling, tverrfaglighet og praksis under studiene</li>
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
                <a href="https://www.uib.no/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  uib.no
                </a>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href="https://www.uib.no/utdanning" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Studier ved UiB
                </a>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href="https://www.uib.no/student" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Studentlivet i Bergen
                </a>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href="https://www.uib.no/utdanning/75541/opptak" target="_blank" rel="noopener noreferrer">
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

export default UniversityUiB;
