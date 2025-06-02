
import React from 'react';
import { ArrowLeft, ExternalLink, Users, MapPin, BookOpen, Award, Briefcase, FlaskConical, Heart, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const UniversityNMBU = () => {
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
              <h1 className="text-4xl font-bold mb-2">Norges miljø- og biovitenskapelige universitet</h1>
              <p className="text-xl text-muted-foreground">Universitetet for bærekraft, natur og fremtiden</p>
            </div>
            <Badge variant="secondary" className="w-fit">
              Miljø & Bærekraft
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
              NMBU er universitetet for bærekraft, natur, teknologi, mat og miljø – og har unik kompetanse på 
              temaer som klima, bærekraftig utvikling, landbruk og biovitenskap. NMBU ligger på Ås, 30 minutter 
              sør for Oslo, og har en campus med landlig sjarm, moderne fasiliteter og sterkt sosialt studentmiljø. 
              Her studerer du tett på naturen, med fremtidsrettede utdanninger som kombinerer teori, praksis og 
              tverrfaglig samarbeid.
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
              <p className="text-2xl font-bold">6 000</p>
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
              <p className="text-lg">Ås, Viken (30 min sør for Oslo)</p>
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
              <p className="text-lg">65 studieprogram (bachelor, master, årsstudier, PhD)</p>
            </CardContent>
          </Card>
        </div>

        {/* Fagområder */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Fagområder</CardTitle>
            <CardDescription>NMBU tilbyr utdanning innen:</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="space-y-2">
                <li>• Biovitenskap (biologi, bioteknologi, mikrobiologi, genetikk)</li>
                <li>• Veterinærmedisin og dyrehelse (eneste veterinærutdanning i Norge)</li>
                <li>• Landbruk og matvitenskap (landbruk, matproduksjon, husdyr, plantevitenskap)</li>
                <li>• Miljø- og naturforvaltning (økologi, naturressurser, fornybar energi, klima)</li>
              </ul>
              <ul className="space-y-2">
                <li>• Realfag og teknologi (kjemi, fysikk, matematikk, data, bygg og vann)</li>
                <li>• Landskapsarkitektur, planlegging og byutvikling</li>
                <li>• Økonomi, samfunnsfag og bærekraft</li>
                <li>• Internasjonale relasjoner og bærekraftig utvikling</li>
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
                <h4 className="font-semibold mb-2">Bærekraft og miljø</h4>
                <p>NMBU er ledende på utdanning og forskning knyttet til grønn omstilling, klima, natur og bærekraftig matproduksjon.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Veterinærutdanning</h4>
                <p>Norges eneste universitet med veterinærmedisin, nå i topp moderne bygg.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Tverrfaglig samarbeid</h4>
                <p>Unik miks av biologi, samfunnsfag, teknologi og realfag – mange studier kombinerer flere fagfelt.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Nært studiemiljø</h4>
                <p>Lite, inkluderende campus der det er lett å bli kjent, og studentene samarbeider tett på tvers av studieretninger.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Internasjonalt</h4>
                <p>Mange internasjonale studenter og forskningsprosjekter, og gode muligheter for utveksling.</p>
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
                <li>• Veterinær, realfag og teknologi har tilleggskrav (spesifikke realfag)</li>
                <li>• Varierende poenggrenser og opptak, særlig for veterinærmedisin (svært høyt)</li>
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
                <li>• Karrierer innen miljø, klima, offentlig forvaltning, næringsmiddelindustri, forskning, veterinær</li>
                <li>• Sterkt arbeidslivsfokus, praksis og tett samarbeid med både næringsliv og offentlig sektor</li>
                <li>• Mange jobber med bærekraft, samfunnsplanlegging, dyrehelse, bioteknologi og mat</li>
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
                <li>• Tungt involvert i forskning på klima, miljø, bærekraftig matproduksjon, bioteknologi</li>
                <li>• Samarbeider tett med forskningsinstitutter på Campus Ås, samt næringsliv og myndigheter</li>
                <li>• Store satsinger på klimaomstilling, fornybar energi og naturforvaltning</li>
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
                <li>• Over 60 studentforeninger, fra idrett og friluftsliv til mat, miljø, kultur og politikk</li>
                <li>• "Ås-miljøet" er kjent for inkluderende fester, tradisjoner og samarbeid</li>
                <li>• UKA på Ås, studentrevyer, bondebryllup og mange arrangementer året rundt</li>
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
              <li>• Passer perfekt for deg som er opptatt av miljø, natur, dyr, mat eller teknologi</li>
              <li>• Vil ha en utdanning som betyr noe for fremtiden</li>
              <li>• Trives du med tverrfaglighet, praktiske prosjekter og tett samarbeid med både folk og natur</li>
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
                <a href="https://www.nmbu.no/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  nmbu.no
                </a>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href="https://www.nmbu.no/studier" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Studier ved NMBU
                </a>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href="https://www.nmbu.no/student" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Studentlivet på Ås
                </a>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href="https://www.nmbu.no/studier/opptak" target="_blank" rel="noopener noreferrer">
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

export default UniversityNMBU;
