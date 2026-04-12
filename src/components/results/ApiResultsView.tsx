import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import {
  BookOpen, Briefcase, Building2, TrendingUp, Lightbulb,
  Check, User, ArrowRight, Sparkles, Target, Compass,
} from 'lucide-react';
import type { EdPathApiResponse, EdPathUserType } from '@/services/edpathApi.types';

interface ApiResultsViewProps {
  results: EdPathApiResponse;
  userType: EdPathUserType;
}

/* ─── colour palette ─── */
const COLORS = [
  'hsl(var(--primary))',
  'hsl(262 83% 58%)',
  'hsl(24 95% 53%)',
  'hsl(142 71% 45%)',
  'hsl(199 89% 48%)',
  'hsl(340 82% 52%)',
  'hsl(45 93% 47%)',
  'hsl(215 76% 56%)',
];

/* ─── helpers: slug creators ─── */
const toCareerSlug = (name: string) =>
  encodeURIComponent(name.toLowerCase().replace(/\s+/g, '-'));
const toCompanySlug = (name: string) =>
  encodeURIComponent(name.toLowerCase().replace(/\s+/g, '-'));

/* ─── narrative templates ─── */
const userTypeLabels: Record<EdPathUserType, string> = {
  elev: 'elev',
  student: 'student',
  arbeidstaker: 'arbeidstaker',
};

const buildProfileSummary = (
  dims: { navn: string; score: number }[],
  userType: EdPathUserType,
): string => {
  if (dims.length === 0)
    return 'Vi har analysert svarene dine, men klarte ikke å beregne tydelige dimensjoner. Prøv gjerne spørreskjemaet på nytt med mer detaljerte svar.';

  const top = dims.slice(0, 3).map((d) => d.navn);
  const label = userTypeLabels[userType];

  if (top.length === 1)
    return `Basert på svarene dine viser du en tydelig styrke innen ${top[0]}. Som ${label} har du en profil som passer godt i miljøer der denne egenskapen verdsettes høyt.`;

  if (top.length === 2)
    return `Profilen din som ${label} preges av ${top[0]} og ${top[1]}. Du ser ut til å trives i roller som kombinerer disse styrkene — noe som åpner for spennende muligheter på tvers av flere bransjer.`;

  return `Du viser en sterk kombinasjon av ${top[0]}, ${top[1]} og ${top[2]}. Denne profilen som ${label} tyder på at du trives med utfordringer som krever flere kompetanser samtidig — og det betyr at du har mange interessante veier å velge mellom.`;
};

const buildSectorExplanation = (sektor: string): string => {
  const explanations: Record<string, string> = {
    'IT og teknologi':
      'Denne sektoren passer deg som liker analytiske utfordringer, problemløsning og å jobbe med komplekse systemer. Her kan du utvikle teknologiske løsninger som gjør en forskjell.',
    'Undervisning og pedagogikk':
      'Utdanningssektoren er for deg som brenner for å formidle kunnskap og hjelpe andre å vokse. Her kombinerer du faglig dybde med mellommenneskelige ferdigheter.',
    'Helse og omsorg':
      'Helsesektoren trenger folk med empati, analytisk sans og ønske om å hjelpe andre. Dine svar tyder på at du kan trives i et miljø der arbeidet har direkte betydning for folks liv.',
    'Økonomi og finans':
      'Økonomi og finans passer deg som liker tall, analyse og strategisk tenkning. Her jobber du med å forstå markeder, optimalisere ressurser og ta viktige beslutninger.',
    'Ingeniør og teknisk':
      'Ingeniørfag kombinerer teori med praktisk problemløsning. Denne sektoren er for deg som ønsker å designe, bygge og forbedre systemer og infrastruktur.',
    'Psykologi og rådgivning':
      'Denne sektoren passer deg som er interessert i mennesker, atferd og mentale prosesser. Her kan du bruke analytiske og mellommenneskelige ferdigheter til å støtte andre.',
    'Administrasjon og ledelse':
      'Administrasjon og ledelse handler om å koordinere, organisere og drive organisasjoner fremover. Dine styrker innen struktur og kommunikasjon passer godt her.',
    'Design, markedsføring og kommun':
      'Kreative sektorer kombinerer estetikk med strategi. Her bruker du kreativitet og kommunikasjon til å forme budskap, produkter og opplevelser.',
    'Samfunnsfag og politikk':
      'Denne sektoren passer deg som er opptatt av samfunnsstrukturer, politikk og å forstå hvordan verden henger sammen. Analytisk tenkning og engasjement er nøkkelegenskaper her.',
  };

  return (
    explanations[sektor] ??
    `Denne sektoren matcher profilen din basert på svarene du ga om interesser, styrker og arbeidspreferanser. Her finnes roller som kan utnytte dine sterke sider.`
  );
};

const buildCareerExplanation = (yrke: string, sektor: string): string => {
  return `Som ${yrke.toLowerCase()} jobber du typisk innen ${sektor.toLowerCase()}. Denne rollen matcher profilen din fordi den krever mange av de egenskapene du scoret høyt på. Utforsk rollen for å lære mer om hva den innebærer i praksis.`;
};

const buildStudyExplanation = (studie: string, sektor: string): string => {
  return `${studie} gir deg kompetanse som er etterspurt innen ${sektor.toLowerCase()}. Basert på profilen din kan dette studiet være et godt valg for å bygge en karriere som matcher dine styrker og interesser.`;
};

const buildCompanyExplanation = (bedrift: string, sektor: string): string => {
  return `${bedrift} opererer innen ${sektor.toLowerCase()} og er en arbeidsgiver der profiler som din ofte finner relevante muligheter. Utforsk bedriften for å se hvilke stillinger og karriereveier de tilbyr.`;
};

/* ─── component ─── */
const ApiResultsView: React.FC<ApiResultsViewProps> = ({ results, userType }) => {
  const navigate = useNavigate();
  const { dimensjoner = [], topp_sektorer = [], yrker = [], studier = [], bedrifter = [] } = results;

  const hasDimensions = dimensjoner.length > 0;
  const hasSektorer = topp_sektorer.length > 0;
  const hasYrker = yrker.length > 0;
  const hasStudier = studier.length > 0;
  const hasBedrifter = bedrifter.length > 0;

  const handleStudyClick = useCallback(async (studieName: string) => {
    try {
      const { data, error } = await supabase
        .from('Student_data_ny')
        .select('*')
        .ilike('Studienavn', `%${studieName}%`)
        .limit(1);

      if (error || !data || data.length === 0) {
        toast.info('Fant ikke studiet i databasen', {
          description: 'Prøv å søke etter det på statistikksiden.',
        });
        navigate('/statistikk', { state: { searchQuery: studieName } });
        return;
      }

      const match = data[0] as any;
      const universitySlug = encodeURIComponent(match['Lærestednavn'] || '');
      const studiekode = encodeURIComponent(match['Studiekode'] || '');
      navigate(`/utdanning/${universitySlug}/${studiekode}`);
    } catch {
      navigate('/statistikk', { state: { searchQuery: studieName } });
    }
  }, [navigate]);

  return (
    <div className="space-y-10">
      {/* ── 1. PROFILE SUMMARY ── */}
      <Card className="relative overflow-hidden border-primary/20">
        <div className="absolute top-0 left-0 h-full w-1.5 bg-primary" />
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <User className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Din personlige profil</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-base leading-relaxed text-foreground/90">
            {buildProfileSummary(dimensjoner, userType)}
          </p>

          {hasDimensions && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
              {dimensjoner.slice(0, 3).map((dim, i) => (
                <div
                  key={i}
                  className="p-4 rounded-lg border border-primary/20 bg-primary/5"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <h4 className="font-semibold">{dim.navn}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">Score: {dim.score} poeng</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── 2. DIMENSION CHART ── */}
      {hasDimensions && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <CardTitle>Dine dimensjoner i detalj</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Slik fordeler styrkene dine seg. Jo høyere score, desto sterkere
              match med roller som krever denne egenskapen.
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dimensjoner.map((d, i) => ({
                    navn: d.navn,
                    score: d.score,
                    fill: COLORS[i % COLORS.length],
                  }))}
                  layout="vertical"
                  margin={{ left: 10, right: 20 }}
                >
                  <XAxis type="number" />
                  <YAxis
                    type="category"
                    dataKey="navn"
                    width={130}
                    tick={{ fontSize: 13 }}
                  />
                  <Tooltip formatter={(v: number) => [`${v} poeng`, 'Score']} />
                  <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                    {dimensjoner.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── 3. WHY THESE SECTORS FIT ── */}
      {hasSektorer && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <CardTitle>Hvorfor disse sektorene passer deg</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Basert på profilen din har vi identifisert sektorer der du sannsynligvis
              vil trives og gjøre det bra.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {topp_sektorer.map((sektor, i) => (
              <div
                key={i}
                className="p-5 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-lg">{sektor.sektor}</h4>
                  <Badge variant="secondary">{sektor.score} poeng</Badge>
                </div>
                {sektor.underkategori && (
                  <Badge variant="outline" className="mb-2">{sektor.underkategori}</Badge>
                )}
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {buildSectorExplanation(sektor.sektor)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* ── 4. CAREER PATHS ── */}
      {hasYrker && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              <CardTitle>Mulige karriereveier</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Disse yrkene matcher profilen din. Klikk på et yrke for å utforske det
              i detalj — se beskrivelse, kompetansekrav og relaterte muligheter.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {yrker.map((yrke, i) => (
                <div
                  key={i}
                  onClick={() => navigate(`/karriere/${toCareerSlug(yrke.navn)}`)}
                  className="p-5 rounded-lg border cursor-pointer hover:shadow-md hover:border-primary/40 transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold group-hover:text-primary transition-colors">
                      {yrke.navn}
                    </h4>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <Badge variant="outline" className="mb-3">{yrke.sektor}</Badge>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {buildCareerExplanation(yrke.navn, yrke.sektor)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── 5. STUDY PROGRAMS ── */}
      {hasStudier && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <CardTitle>Studier som matcher deg</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Disse studieprogrammene gir deg kompetansen du trenger for å lykkes
              i sektorene som passer profilen din.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {studier.map((studie, i) => (
                <div
                  key={i}
                  onClick={() => handleStudyClick(studie.navn)}
                  className="p-5 rounded-lg border cursor-pointer hover:shadow-md hover:border-primary/40 transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold group-hover:text-primary transition-colors">
                      {studie.navn}
                    </h4>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  {studie.lærested && (
                    <p className="text-xs text-muted-foreground mb-2">{studie.lærested}</p>
                  )}
                  <Badge variant="outline" className="mb-3">{studie.sektor}</Badge>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {buildStudyExplanation(studie.navn, studie.sektor)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── 6. COMPANIES ── */}
      {hasBedrifter && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <CardTitle>Bedrifter du bør utforske</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Disse bedriftene opererer i sektorer som matcher profilen din. Klikk
              for å lese mer om bedriften og se relevante karrieremuligheter.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bedrifter.map((bedrift, i) => (
                <div
                  key={i}
                  onClick={() => navigate(`/bedrift/${toCompanySlug(bedrift.navn)}`)}
                  className="p-5 rounded-lg border cursor-pointer hover:shadow-md hover:border-primary/40 transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">
                      {bedrift.navn}
                    </h4>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <Badge variant="outline" className="mb-3">{bedrift.sektor}</Badge>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {buildCompanyExplanation(bedrift.navn, bedrift.sektor)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── 7. HOW YOUR ANSWERS INFLUENCED THIS ── */}
      <Card className="bg-muted/20 border-dashed">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-primary" />
            <CardTitle>Slik ble profilen din satt sammen</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground mb-4">
            Svarene du ga om interesser, styrker og arbeidspreferanser ble analysert
            og koblet mot ulike karrieredimensjoner. Disse dimensjonene ble deretter
            matchet mot sektorer, studier og yrker der lignende profiler typisk
            trives og lykkes.
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Anbefalingene er ikke endelige — de er et utgangspunkt for å utforske
            mulighetene som passer deg best. Jo mer du utforsker, desto bedre
            bilde får du av hva som kan være riktig for deg.
          </p>
        </CardContent>
      </Card>

      {/* ── 8. NEXT STEPS ── */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            <CardTitle>Neste steg – dette får du snart tilgang til</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            EdPath blir mer enn bare anbefalinger. Du vil snart kunne:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              'Se hva andre med lik profil har valgt – og hvor de fikk jobb',
              'Utforske bedrifter og stillinger som passer akkurat deg',
              'Få ferdige forslag til hva du kan skrive i en CV',
              'Få anbefalte kurs og ferdigheter som gjør deg mer attraktiv',
              'Snakke med vår AI-rådgiver og få veiledning døgnet rundt',
              'Bygge din egen profil som oppdateres etter hvert som du utvikler deg',
            ].map((text, i) => (
              <li key={i} className="flex items-start">
                <Check className="h-5 w-5 mr-2 mt-0.5 text-primary flex-shrink-0" />
                <span className="text-sm">{text}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiResultsView;
