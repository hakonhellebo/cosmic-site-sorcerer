
import React from 'react';
import { ArrowLeft, ExternalLink, Users, MapPin, BookOpen, Award, Briefcase, FlaskConical, Heart, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const UniversityUiO = () => {
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
              <h1 className="text-4xl font-bold mb-2">Universitetet i Oslo (UiO)</h1>
              <p className="text-xl text-muted-foreground">Norges eldste og mest anerkjente universitet</p>
            </div>
            <Badge variant="secondary" className="w-fit">
              Grunnlagt 1811
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
              Universitetet i Oslo (UiO) er Norges eldste og et av de mest anerkjente universitetene i landet, grunnlagt i 1811. 
              UiO ligger midt i Oslo – hovedstaden, og gir studentene unike muligheter både faglig, sosialt og karrieremessig. 
              Universitetet har et stort og bredt fagtilbud, ledende forskningsmiljøer og et levende studentmiljø.
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
              <p className="text-2xl font-bold">28 000+</p>
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
              <p className="text-lg">Blindern, sentrum, Gaustad og Tøyen</p>
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
              <p className="text-2xl font-bold">200+</p>
              <p className="text-sm text-muted-foreground">Bachelor, master, profesjon, årsstudier, ph.d.</p>
            </CardContent>
          </Card>
        </div>

        {/* Fagområder */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Fagområder</CardTitle>
            <CardDescription>UiO har Norges bredeste spekter av studier innen:</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="space-y-2">
                <li>• Humaniora (historie, språk, filosofi, arkeologi m.m.)</li>
                <li>• Samfunnsvitenskap (psykologi, statsvitenskap, sosiologi, pedagogikk, samfunnsøkonomi)</li>
                <li>• Jus og rettsvitenskap (landets eldste og største jusfakultet)</li>
                <li>• Realfag og teknologi (matematikk, informatikk, fysikk, biologi m.m.)</li>
              </ul>
              <ul className="space-y-2">
                <li>• Medisin og odontologi (medisinstudiet, tannlege, ernæring)</li>
                <li>• Teologi og religion</li>
                <li>• Utdanningsvitenskap og lærerutdanning</li>
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
                <p>UiO er internasjonalt ledende innen flere fag, særlig medisin, rettsvitenskap og humaniora.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Stort fagmiljø og bredde</h4>
                <p>Egner seg for alle, fra tradisjonelle akademiske studier til innovative og tverrfaglige programmer.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Bycampus i Oslo</h4>
                <p>Gir tilgang til Norges beste jobb- og praksismuligheter, næringsliv, offentlig sektor og kulturtilbud.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Jus, psykologi, medisin</h4>
                <p>Svært ettertraktede studier, kjent for høy kvalitet.</p>
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
                <li>• Enkelte programmer (f.eks. medisin, psykologi, jus, realfag) har svært høye karakterkrav eller spesifikke opptakskrav</li>
                <li>• Profesjonsstudier har ofte opptak via egne kvoter</li>
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
                <li>• Utdanning fra UiO er anerkjent både nasjonalt og internasjonalt</li>
                <li>• Solid grunnlag for jobb i næringsliv, offentlig sektor, forskning, helse og skole</li>
                <li>• Eget karrieresenter og mange koblinger mot arbeidslivet i Oslo-regionen</li>
                <li>• Mange UiO-alumni har ledende roller i norsk samfunnsliv</li>
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
                <li>• Satsing på forskning innen helse, klima, digitalisering, samfunn og demokrati</li>
                <li>• Sterkt fokus på tverrfaglighet og internasjonalt samarbeid</li>
                <li>• Store forskningsprosjekter og flere Sentre for fremragende forskning (SFF)</li>
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
                <li>• Over 250 studentforeninger og organisasjoner</li>
                <li>• Alt fra idrett og musikk til faglige og politiske lag</li>
                <li>• Blindern og sentrum er pulserende studentmiljøer</li>
                <li>• Studentersamfunnet som møteplass</li>
                <li>• Mange arrangementer, festivaler og aktiviteter året rundt</li>
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
              <li>• Passer for deg som vil studere midt i hovedstaden, med tilgang til byliv, arbeidsmarked og et stort sosialt nettverk</li>
              <li>• Har du interesse for akademia, forskning eller vil ta en profesjonsutdanning, finner du alt på UiO</li>
              <li>• Universitetet tilbyr stor valgfrihet, mulighet for utveksling og mange spesialiseringsretninger</li>
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
                <a href="https://www.uio.no/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  uio.no
                </a>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href="https://www.uio.no/studier/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Studier ved UiO
                </a>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href="https://www.uio.no/studier/studentlivet/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Studentlivet ved UiO
                </a>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href="https://www.uio.no/studier/opptak/" target="_blank" rel="noopener noreferrer">
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

export default UniversityUiO;
