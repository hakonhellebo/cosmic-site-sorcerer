
import React from 'react';
import { ArrowLeft, ExternalLink, Users, MapPin, BookOpen, Award, Briefcase, FlaskConical, Heart, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const UniversityNHH = () => {
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
              <h1 className="text-4xl font-bold mb-2">Norges Handelshøyskole (NHH)</h1>
              <p className="text-xl text-muted-foreground">Norges ledende handelshøyskole i hjertet av Bergen</p>
            </div>
            <Badge variant="secondary" className="w-fit">
              Handelshøyskole
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
              Norges Handelshøyskole (NHH) er Norges ledende utdannings- og forskningsinstitusjon innen økonomi og 
              administrasjon. Skolen ligger flott til i Sandviken, Bergen, og er kjent for sitt sterke akademiske miljø, 
              tette bånd til næringslivet og internasjonale orientering. NHH er førstevalget for de som ønsker å studere 
              økonomi, ledelse og innovasjon på høyt nivå.
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
              <p className="text-2xl font-bold">3 500</p>
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
              <p className="text-lg">Sandviken, Bergen (nytt, moderne campus)</p>
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
              <p className="text-lg">Bachelor, master, PhD, etter- og videreutdanning</p>
            </CardContent>
          </Card>
        </div>

        {/* Fagområder */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Fagområder</CardTitle>
            <CardDescription>NHH tilbyr spesialiserte studier innen:</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="space-y-2">
                <li>• Økonomi og administrasjon (Bachelor og Master)</li>
                <li>• Regnskap, revisjon og finans</li>
                <li>• Strategi og ledelse</li>
              </ul>
              <ul className="space-y-2">
                <li>• Internasjonal business</li>
                <li>• Markedsføring og merkevarebygging</li>
                <li>• Dataanalyse, bærekraft og innovasjon</li>
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
                <h4 className="font-semibold mb-2">Svært attraktive studier</h4>
                <p>Høye opptakskrav og sterke kandidater fra hele landet.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Næringslivstilknytning</h4>
                <p>Tette koblinger til norsk og internasjonalt næringsliv. NHH-studenter får ofte internship og jobbtilbud allerede under studiene.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Utveksling</h4>
                <p>Stort internasjonalt utvekslingstilbud (mer enn 170 partneruniversiteter verden over).</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Sterkt studentmiljø</h4>
                <p>Aktivt studentliv med linjeforeninger, næringslivsdager og store arrangementer (UKEN, Symposiet).</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Forskning i verdensklasse</h4>
                <p>Ledende miljø innen økonomisk forskning og samfunnsanalyse.</p>
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
                <li>• <strong>Bachelor:</strong> Generell studiekompetanse + matematikk R1 (evt. S1+S2)</li>
                <li>• Svært høye karakterkrav på førstegangsvitnemål (ofte over 55 poeng)</li>
                <li>• <strong>Master:</strong> Bachelor i økonomi eller tilsvarende</li>
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
                <li>• NHH er kjent for å utdanne ledere, konsulenter, økonomer og analytikere til både næringsliv, bank, offentlig sektor og forskning</li>
                <li>• Mange tidligere NHH-studenter jobber i toppstillinger, både i Norge og internasjonalt</li>
                <li>• Skolen har eget karrieresenter, veiledning og mange praksis- og internship-muligheter</li>
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
                <li>• NHH har sterke forskningsmiljøer innen bærekraft, konkurransepolitikk, innovasjon og digital økonomi</li>
                <li>• Deltar i flere nasjonale og internasjonale forskningsprosjekter</li>
                <li>• Samarbeider tett med andre universiteter og bedrifter, samt CEMS-nettverket (global business schools)</li>
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
                <li>• NHH har et av Norges mest aktive studentmiljø, kjent for sterke tradisjoner og samhold</li>
                <li>• Studentforeningen NHHS organiserer alt fra idrett og konserter til næringslivsdager og festivaler</li>
                <li>• Nært og inkluderende miljø, lett å bli kjent med andre fra hele landet</li>
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
              <li>• Perfekt for deg som vil jobbe med økonomi, ledelse, markedsføring, finans, eller ønsker toppstilling i næringslivet</li>
              <li>• Liker utfordringer, har gode matematikkferdigheter og vil ha tette koblinger til arbeidslivet under studiene</li>
              <li>• Drømmer om internasjonal erfaring og solide jobbmuligheter etter endt utdanning</li>
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
                <a href="https://www.nhh.no/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  nhh.no
                </a>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href="https://www.nhh.no/studier/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Studier ved NHH
                </a>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href="https://www.nhh.no/studentlivet/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Studentliv på NHH
                </a>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href="https://www.nhh.no/studier/opptak/" target="_blank" rel="noopener noreferrer">
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

export default UniversityNHH;
