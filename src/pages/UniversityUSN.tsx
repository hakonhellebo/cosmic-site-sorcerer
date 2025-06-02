
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Briefcase, FlaskConical, Heart, GraduationCap } from 'lucide-react';
import UniversityHeader from '@/components/university/UniversityHeader';
import KeyStatsGrid from '@/components/university/KeyStatsGrid';
import ExternalLinksCard from '@/components/university/ExternalLinksCard';

const UniversityUSN = () => {
  const externalLinks = [
    { url: "https://www.usn.no/", label: "usn.no" },
    { url: "https://www.usn.no/studier", label: "Studier ved USN" },
    { url: "https://www.usn.no/student", label: "Studentliv på USN" },
    { url: "https://www.usn.no/studier/opptak/", label: "Opptak og søknad" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <UniversityHeader 
          title="Universitetet i Sørøst-Norge"
          subtitle="Nytt desentralisert universitet med praksisnære utdanninger og tett kontakt til arbeidslivet"
          badge="Praksisnær & Desentralisert"
        />

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
              Universitetet i Sørøst-Norge (USN) er et av landets nyeste og mest desentraliserte 
              universiteter, med hele åtte campus fordelt over Vestfold, Telemark, Buskerud og Viken. 
              USN satser på arbeidslivsrettede, praksisnære utdanninger, forskning på lokale og 
              globale utfordringer – og tett kontakt mellom studenter, fagmiljø og regionens næringsliv. 
              USN er særlig kjent for teknologi, lærerutdanning, helse, maritime fag og innovasjon.
            </p>
          </CardContent>
        </Card>

        <KeyStatsGrid 
          studentCount="18 000"
          campuses="Bø, Drammen, Kongsberg, Notodden, Porsgrunn, Rauland, Ringerike, Vestfold"
          programs="300+ utdanningstilbud"
        />

        {/* Fagområder */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Fagområder</CardTitle>
            <CardDescription>USN tilbyr et bredt spekter av utdanninger, blant annet:</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="space-y-2">
                <li>• Teknologi og ingeniørfag (maritimt, maskin, elektro, bygg, data, fornybar energi, automasjon)</li>
                <li>• Lærer- og barnehagelærerutdanning</li>
                <li>• Helse- og sosialfag (sykepleie, vernepleie, radiografi, optometri, tannpleie, paramedisin)</li>
                <li>• Økonomi, ledelse, innovasjon og entreprenørskap</li>
              </ul>
              <ul className="space-y-2">
                <li>• Idrett, friluftsliv og folkehelse</li>
                <li>• Humaniora og samfunnsvitenskap</li>
                <li>• Kunst, design og tradisjonskunst</li>
                <li>• Maritime fag (Norges fremste på nautikk og maritime studier)</li>
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
                <h4 className="font-semibold mb-2">Desentralisert modell</h4>
                <p>Åtte ulike campuser gir deg mange valgmuligheter og korte avstander til studier i regionen.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Praksisnære og arbeidslivsrettede studier</h4>
                <p>Svært tett kontakt med næringsliv, offentlig sektor og arbeidsmarkedet – mye praksis og samarbeid i alle studier.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Teknologisatsing</h4>
                <p>Særlig sterk på ingeniørfag, IKT, maritim teknologi, fornybar energi og innovasjon.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Lærer- og helseutdanning</h4>
                <p>Store og populære profesjonsstudier med mye praksis og moderne fasiliteter.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Mangfold og fleksibilitet</h4>
                <p>Mange deltids- og nettbaserte studier, tilrettelagt for både unge og voksne.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Bærekraft og regional utvikling</h4>
                <p>Viktig samfunnsaktør i regionen, med stor satsing på bærekraft og grønn omstilling.</p>
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
                <li>• Teknologi, maritime og enkelte helsefag har spesifikke fagkrav (matematikk, fysikk, kjemi)</li>
                <li>• Varierende poenggrenser og krav – særlig for helse, lærer og ingeniør</li>
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
                <li>• Svært gode jobbmuligheter, spesielt innen ingeniørfag, helse, undervisning og maritime næringer</li>
                <li>• Gode praksisordninger og samarbeid med bedrifter og offentlige aktører</li>
                <li>• Eget karrieresenter og mange muligheter for praksis, internship og nettverksbygging</li>
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
                <li>• Forsker på både lokale og globale utfordringer – fra bærekraft til helse og pedagogikk</li>
                <li>• Deltar i nasjonale og internasjonale forskningsprosjekter og næringslivssamarbeid</li>
                <li>• Flere forskningssentre innen teknologi, helse og utdanning</li>
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
                <li>• Mangfoldig studentmiljø på alle campus, med mange foreninger, idrett, kultur og arrangementer</li>
                <li>• Gode studenthus, treningssentre og møteplasser</li>
                <li>• Nært samarbeid med lokalmiljø og mange muligheter for friluftsliv og studentengasjement</li>
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
              <li>• Passer for deg som vil studere nær hjemstedet, ønsker mye praksis, og vil ha gode jobbmuligheter lokalt og nasjonalt</li>
              <li>• Perfekt for deg som er interessert i teknologi, helse, undervisning, maritim næring, entreprenørskap eller regional utvikling</li>
              <li>• Godt valg om du ønsker fleksible studier og personlig oppfølging</li>
            </ul>
          </CardContent>
        </Card>

        <ExternalLinksCard links={externalLinks} />
      </div>
    </div>
  );
};

export default UniversityUSN;
