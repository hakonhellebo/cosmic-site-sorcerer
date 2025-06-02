
import React from 'react';
import { ArrowLeft, ExternalLink, Users, MapPin, BookOpen, Award, Briefcase, FlaskConical, Heart, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const UniversityHiVolda = () => {
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
              <h1 className="text-4xl font-bold mb-2">Høgskulen i Volda</h1>
              <p className="text-xl text-muted-foreground">Tradisjonsrik høgskole med sterk profil innen medier, læring og kreative fag</p>
            </div>
            <Badge variant="secondary" className="w-fit">
              Media & Kreativitet
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
              Høgskulen i Volda (HVO) er en tradisjonsrik og oversiktlig høgskole på Sunnmøre, 
              med campus midt i vakre Volda. HVO er særlig kjent for utdanninger innen medier, 
              journalistikk, lærerutdanning og kreative fag, og tilbyr et unikt studentmiljø med 
              kort vei mellom folk, fjord og fjell. Høgskolen kombinerer personlig oppfølging med 
              sterke fagmiljøer og tette bånd til arbeidslivet i regionen.
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
              <p className="text-2xl font-bold">4 500</p>
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
              <p className="text-lg">Volda sentrum (moderne fasiliteter)</p>
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
              <p className="text-lg">Ca. 60 utdanningstilbud</p>
            </CardContent>
          </Card>
        </div>

        {/* Fagområder */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Fagområder</CardTitle>
            <CardDescription>HVO tilbyr utdanninger innen blant annet:</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="space-y-2">
                <li>• Mediefag og journalistikk (bl.a. Norges eldste journalistutdanning)</li>
                <li>• Lærer- og barnehagelærerutdanning</li>
                <li>• Kreative og estetiske fag (animasjon, film, kultur, drama, kunst og musikk)</li>
              </ul>
              <ul className="space-y-2">
                <li>• Samfunnsfag og humaniora (historie, statsvitenskap, språk, sosialt arbeid)</li>
                <li>• Idrett og friluftsliv</li>
                <li>• Pedagogikk og spesialpedagogikk</li>
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
                <h4 className="font-semibold mb-2">Mediefag og journalistikk</h4>
                <p>HVO har noen av landets beste og eldste utdanninger på dette feltet, med stor vekt på praksis og nyskaping.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Kreative utdanninger</h4>
                <p>Film, animasjon og kulturfag – tett koblet til både lokalt og nasjonalt kulturliv.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Lærerutdanning</h4>
                <p>Lang tradisjon som lærerutdanningsinstitusjon, populært blant lærerstudenter fra hele landet.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Oversiktlig og personlig miljø</h4>
                <p>Små fagmiljøer, tett kontakt mellom studenter og faglærere, og et inkluderende, trygt studentliv.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Nærhet til naturen</h4>
                <p>Studenter får unik tilgang til fjell, sjø, ski og friluftsliv året rundt.</p>
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
                <li>• Enkelte kreative fag har opptaksprøver</li>
                <li>• Lærer- og barnehagelærerutdanning har nasjonale krav til fag og karakterer</li>
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
                <li>• Gode muligheter innen skole, media, kultur, offentlig forvaltning, journalistikk og kreative næringer</li>
                <li>• Tette bånd til regionale og nasjonale arbeidsmiljøer</li>
                <li>• Eget karrieresenter og rådgivning</li>
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
                <li>• Sterk forskning innen medier, kultur, pedagogikk og samfunnsfag</li>
                <li>• Deltar i nasjonale og internasjonale prosjekter</li>
                <li>• Tett samarbeid med næringsliv og offentlig sektor på Vestlandet</li>
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
                <li>• Aktivt og sosialt studentmiljø med mange foreninger, klubber og arrangementer</li>
                <li>• Eget studenthus ("Rokken") med konserter, kafé, quiz og arrangementer</li>
                <li>• Kort vei fra campus til både fjord, fjell og sentrum – perfekt for idrett og friluftsliv</li>
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
              <li>• Perfekt for deg som vil ha en praksisnær utdanning i et tett og inkluderende miljø</li>
              <li>• Gode muligheter for deg som vil kombinere faglig utvikling med kreativ utfoldelse og et aktivt friluftsliv</li>
              <li>• Passer både for deg som ønsker lærer, mediefag, kultur eller samfunnsvitenskap</li>
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
                <a href="https://www.hivolda.no/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  hivolda.no
                </a>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href="https://www.hivolda.no/studier" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Studier ved HVO
                </a>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href="https://www.hivolda.no/student" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Studentliv i Volda
                </a>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href="https://www.hivolda.no/studier/opptak" target="_blank" rel="noopener noreferrer">
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

export default UniversityHiVolda;
