
import React from 'react';
import { ArrowLeft, ExternalLink, Users, MapPin, BookOpen, Award, Briefcase, FlaskConical, Heart, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const UniversityUiS = () => {
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
              <h1 className="text-4xl font-bold mb-2">Universitetet i Stavanger (UiS)</h1>
              <p className="text-xl text-muted-foreground">Moderne universitet i Norges energihovedstad</p>
            </div>
            <Badge variant="secondary" className="w-fit">
              Energi & Innovasjon
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
              Universitetet i Stavanger (UiS) ligger i Norges energihovedstad og region med høy innovasjonstakt. 
              UiS er kjent for sitt moderne campus, nærhet til næringsliv og et dynamisk studiemiljø. 
              Universitetet tilbyr et bredt spekter av studier med sterk vekt på teknologi, energi, helse og samfunn 
              – og gir deg tett kontakt med både arbeidsliv og forskning.
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
              <p className="text-2xl font-bold">12 500</p>
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
              <p className="text-lg">Ullandhaug, Stavanger (moderne universitetsområde)</p>
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
              <p className="text-lg">150+ bachelor, master, årsstudier, PhD, etter- og videreutdanning</p>
            </CardContent>
          </Card>
        </div>

        {/* Fagområder */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Fagområder</CardTitle>
            <CardDescription>UiS tilbyr utdanninger innen:</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="space-y-2">
                <li>• Ingeniør- og teknologi (petroleum, maskin, data, energi, automasjon, bygg)</li>
                <li>• Økonomi og administrasjon</li>
                <li>• Helse- og sosialfag (sykepleie, paramedisin, sosialt arbeid, barnevern)</li>
                <li>• Lærerutdanning og pedagogikk (barnehage, grunnskole, lektor)</li>
              </ul>
              <ul className="space-y-2">
                <li>• Kunst, kultur og musikk</li>
                <li>• Samfunnsvitenskap og humaniora</li>
                <li>• Matematikk og naturvitenskap</li>
                <li>• Hotell- og reiselivsledelse (verdensledende miljø)</li>
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
                <h4 className="font-semibold mb-2">Sterk næringslivskontakt</h4>
                <p>Spesielt tett samarbeid med olje- og energisektoren, men også reiseliv, IT, helse og offentlig sektor.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Innovasjon og entreprenørskap</h4>
                <p>UiS satser tungt på nyskaping, gründermiljø og studentbedrifter.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Fremtidsrettede fag</h4>
                <p>Satsing på bærekraft, digitalisering, teknologi og klima.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Internasjonal profil</h4>
                <p>Mange utvekslingsmuligheter, internasjonale masterprogrammer og studenter fra hele verden.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Studentbyen Stavanger</h4>
                <p>Kombinerer byliv, kyst, fjord og natur med kort vei til alt.</p>
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
                <li>• Enkelte teknologi- og realfagsstudier krever fordypning i matematikk/realfag</li>
                <li>• Varierende poenggrenser, spesielt for helse, ingeniør, hotell/reiseliv</li>
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
                <li>• UiS gir deg direkte inngang til energisektoren, teknologibransjen, reiseliv, utdanning og offentlig sektor</li>
                <li>• Svært gode praksismuligheter og ofte jobbtilbud før studiene er ferdig</li>
                <li>• Karriereveiledning, næringslivsdager og internshipmuligheter tilbys gjennom hele studieløpet</li>
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
                <li>• UiS har sterke forskningsmiljøer innen energi, teknologi, velferd, pedagogikk og samfunn</li>
                <li>• Deltar i nasjonale og internasjonale forskningsprosjekter og har flere sentre for fremragende forskning</li>
                <li>• Samarbeider tett med NORCE, IRIS og en rekke innovasjonsklynger i regionen</li>
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
                <li>• Over 70 studentorganisasjoner og foreninger – fra idrett og kultur til faglige og sosiale nettverk</li>
                <li>• Studentenes Hus og Tappetårnet er sentrale møteplasser</li>
                <li>• Byen byr på konserter, festivaler, restauranter, strender og fantastiske turområder (Preikestolen, Jæren)</li>
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
              <li>• Passer for deg som vil kombinere en fremtidsrettet utdanning med nærhet til næringsliv, teknologi og natur</li>
              <li>• Godt valg om du ønsker et internasjonalt miljø, entreprenørskapsmuligheter eller å jobbe innen energi, helse eller reiseliv</li>
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
                <a href="https://www.uis.no/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  uis.no
                </a>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href="https://www.uis.no/studier" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Studier ved UiS
                </a>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href="https://www.uis.no/student-i-stavanger" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Studentlivet i Stavanger
                </a>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href="https://www.uis.no/opptak" target="_blank" rel="noopener noreferrer">
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

export default UniversityUiS;
