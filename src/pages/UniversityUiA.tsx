
import React from 'react';
import { ArrowLeft, ExternalLink, Users, MapPin, BookOpen, Award, Briefcase, FlaskConical, Heart, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const UniversityUiA = () => {
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
              <h1 className="text-4xl font-bold mb-2">Universitetet i Agder</h1>
              <p className="text-xl text-muted-foreground">Ungt, innovativt og fremtidsrettet universitet på Sørlandet</p>
            </div>
            <Badge variant="secondary" className="w-fit">
              Innovasjon & Praksis
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
              Universitetet i Agder (UiA) er et ungt og innovativt universitet med moderne campus i 
              Kristiansand og Grimstad, sør i Norge. UiA er kjent for sitt åpne, inkluderende miljø, 
              fremtidsrettede studietilbud og sterke fokus på studentaktiv læring og samarbeid med 
              næringsliv og samfunn i Sørlandsregionen.
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
              <p className="text-2xl font-bold">13 000</p>
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
              <p className="text-lg">Kristiansand og Grimstad (moderne campus med gode fasiliteter)</p>
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
              <p className="text-lg">Over 200 studieprogram (bachelor, master, årsstudier, PhD)</p>
            </CardContent>
          </Card>
        </div>

        {/* Fagområder */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Fagområder</CardTitle>
            <CardDescription>UiA tilbyr et bredt utvalg utdanninger, blant annet:</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="space-y-2">
                <li>• Lærerutdanning og pedagogikk (barnehage, grunnskole, lektor)</li>
                <li>• Helse- og sosialfag (sykepleie, psykisk helse, vernepleie, barnevern)</li>
                <li>• Teknologi og ingeniørfag (IT, bygg, elektro, mekatronikk, fornybar energi)</li>
                <li>• Økonomi, ledelse og innovasjon</li>
              </ul>
              <ul className="space-y-2">
                <li>• Humaniora og samfunnsvitenskap (sosiologi, statsvitenskap, HR, kommunikasjon)</li>
                <li>• Kunstfag, musikk og idrett</li>
                <li>• Realfag og matematikk</li>
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
                <h4 className="font-semibold mb-2">Studentaktiv læring</h4>
                <p>Sterk satsing på innovative undervisningsformer, digitale verktøy og tett kontakt mellom studenter og fagmiljø.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Praksisnære studier</h4>
                <p>Tett samarbeid med lokalt næringsliv, offentlig sektor og kultur – mye praksis og relevante prosjekter.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Sterkt studentmiljø</h4>
                <p>Trygt, inkluderende og engasjerende, med mange studentforeninger og arrangementer.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Digitalisering og teknologi</h4>
                <p>UiA har ledende fagmiljø på IKT, mekatronikk og robotikk.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Internasjonal profil</h4>
                <p>Mange utvekslingsmuligheter og internasjonale studenter.</p>
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
                <li>• Teknologi, realfag og enkelte helse- og lærerutdanninger har spesifikke fagkrav</li>
                <li>• Varierende poenggrenser, spesielt for lærer, sykepleie og teknologi</li>
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
                <li>• Gode jobbmuligheter i både privat og offentlig sektor, spesielt på Sørlandet</li>
                <li>• Eget karrieresenter, praksisplasser, internship og entreprenørskapsmuligheter</li>
                <li>• Mange jobber innen teknologi, utdanning, helse, kultur og næringsliv</li>
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
                <li>• Sterke forskningsmiljøer på digitalisering, velferdsteknologi, IKT, helse og innovasjon</li>
                <li>• Tett samarbeid med næringsliv, offentlig sektor og internasjonale forskningsmiljøer</li>
                <li>• Flere nasjonale forskningssentre, bl.a. innen IKT og kunstig intelligens</li>
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
                <li>• Over 70 studentforeninger, fra idrett og kultur til faglige og sosiale nettverk</li>
                <li>• Studenthus på begge campus, mange arrangementer, festivaler og konserter</li>
                <li>• Nært samarbeid med Kristiansand og Grimstad om kultur, festivaler og studenttilbud</li>
                <li>• Sørlandet byr på strender, natur og et rikt kultur- og uteliv</li>
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
              <li>• Perfekt for deg som vil ha et trygt, innovativt og engasjerende studiemiljø med mye praksis</li>
              <li>• Tett kontakt med næringsliv og gode jobbmuligheter</li>
              <li>• Passer for deg som liker å være aktiv, ønsker praksis i studiet, og vil bo i en by med kort vei til både natur og kultur</li>
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
                <a href="https://www.uia.no/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  uia.no
                </a>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href="https://www.uia.no/studier" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Studier ved UiA
                </a>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href="https://www.uia.no/student" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Studentliv på UiA
                </a>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href="https://www.uia.no/studier/opptak" target="_blank" rel="noopener noreferrer">
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

export default UniversityUiA;
