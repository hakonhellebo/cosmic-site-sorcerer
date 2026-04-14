import React, { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import {
  BookOpen, Briefcase, Building2, Lightbulb,
  User, ArrowRight, Sparkles, Target, Compass,
  Heart, Brain, GraduationCap, MapPin, Star, Zap,
  Award, TrendingUp,
} from 'lucide-react';
import CareerJourney from './CareerJourney';
import type { EdPathApiResponse, EdPathUserType } from '@/services/edpathApi.types';

interface ApiResultsViewProps {
  results: EdPathApiResponse;
  userType: EdPathUserType;
  answers?: Record<string, any>;
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

/* ─── slug helpers ─── */
const toCareerSlug = (name: string) =>
  encodeURIComponent(name.toLowerCase().replace(/\s+/g, '-'));
const toCompanySlug = (name: string) =>
  encodeURIComponent(name.toLowerCase().replace(/\s+/g, '-'));

/* ─── user type labels ─── */
const userTypeLabels: Record<EdPathUserType, string> = {
  elev: 'elev i videregående',
  student: 'student',
  arbeidstaker: 'arbeidstaker',
};

const userTypeGreetings: Record<EdPathUserType, string> = {
  elev: 'Hei! Her er din personlige karriereprofil',
  student: 'Hei! Her er din personlige studieprofil',
  arbeidstaker: 'Hei! Her er din personlige karriereprofil',
};

/* ─── dimension descriptions ─── */
const dimensionDescriptions: Record<string, string> = {
  'Strukturert': 'Du trives i miljøer der planlegging, organisering og klare systemer er viktig. Du liker å ha oversikt og jobbe metodisk mot mål.',
  'Analytisk': 'Du er god til å bryte ned problemer, se mønstre og tenke logisk. Du foretrekker å basere beslutninger på data og fakta.',
  'Kreativ': 'Du liker å tenke utenfor boksen, finne nye løsninger og uttrykke deg. Kreative miljøer gir deg energi og motivasjon.',
  'Sosial': 'Du er god med mennesker og trives i samarbeid. Du liker å kommunisere, hjelpe andre og bygge relasjoner.',
  'Praktisk': 'Du foretrekker å lære gjennom å gjøre, ikke bare lese. Du liker konkrete oppgaver der du kan se resultatene av arbeidet ditt.',
  'Teknologisk': 'Du er nysgjerrig på teknologi og liker å forstå hvordan ting fungerer. Digitale verktøy og systemer er naturlig for deg.',
  'Ledelse': 'Du tar gjerne ansvar, organiserer andre og driver prosjekter fremover. Du er komfortabel med å ta beslutninger.',
  'Innovativ': 'Du tenker fremover og liker å utvikle nye ideer. Du ser muligheter der andre ser utfordringer.',
  'Kommunikativ': 'Du er flink til å uttrykke deg, både skriftlig og muntlig. Du liker å formidle, presentere og overbevise.',
  'Fleksibel': 'Du tilpasser deg lett nye situasjoner og trives med variasjon. Du er åpen for endring og nye utfordringer.',
};

const getDimensionDescription = (name: string): string => {
  return dimensionDescriptions[name] ??
    `Du viser styrke innen ${name.toLowerCase()}. Dette er en egenskap som verdsettes i mange ulike roller og bransjer.`;
};

/* ─── narrative builders ─── */
const buildWhoYouAre = (
  dims: { navn: string; score: number }[],
  userType: EdPathUserType,
): string => {
  if (dims.length === 0) return '';
  const top = dims.slice(0, 3).map(d => d.navn.toLowerCase());
  const label = userTypeLabels[userType];

  const parts: string[] = [];

  // Work style
  if (top.includes('strukturert') || top.includes('analytisk')) {
    parts.push('Du jobber best når du har tydelige mål og struktur. Du liker å planlegge og jobbe systematisk, og du setter pris på logikk og oversikt.');
  } else if (top.includes('kreativ') || top.includes('innovativ')) {
    parts.push('Du jobber best når du har frihet til å tenke kreativt og utforske nye ideer. Rutinearbeid kan kjenne seg begrensende — du trenger rom til å eksperimentere.');
  } else if (top.includes('sosial') || top.includes('kommunikativ')) {
    parts.push('Du jobber best i team og i roller der du kan samarbeide med andre. Kommunikasjon og relasjoner er viktig for deg.');
  } else {
    parts.push(`Som ${label} viser du en sammensatt profil med styrker som kan brukes i mange ulike sammenhenger.`);
  }

  // Learning style
  if (top.includes('praktisk')) {
    parts.push('Du lærer best gjennom praktisk erfaring — prosjekter, case-studier og hands-on arbeid gir deg mer enn forelesninger.');
  } else if (top.includes('analytisk') || top.includes('teknologisk')) {
    parts.push('Du lærer best gjennom å forstå systemene bak ting. Du liker å grave dypt i et tema og bygge forståelse steg for steg.');
  } else {
    parts.push('Du lærer på din egen måte og har evnen til å tilpasse deg ulike læringsmiljøer.');
  }

  // Motivation
  if (top.includes('ledelse') || top.includes('innovativ')) {
    parts.push('Du motiveres av å skape noe, ta ansvar og se resultater av arbeidet ditt. Du vil gjerne gjøre en forskjell.');
  } else if (top.includes('sosial')) {
    parts.push('Du motiveres av å jobbe med mennesker og bidra til at andre lykkes. Meningsfylt arbeid er viktigere enn høy lønn for deg.');
  } else {
    parts.push('Du motiveres av faglig utvikling og mestring. Å bli bedre i det du gjør er en viktig drivkraft.');
  }

  return parts.join(' ');
};

const buildSectorExplanation = (sektor: string): string => {
  const explanations: Record<string, string> = {
    'IT og teknologi': 'Denne sektoren passer deg som liker analytiske utfordringer, problemløsning og å jobbe med komplekse systemer. Her kan du utvikle teknologiske løsninger som gjør en forskjell.',
    'Undervisning og pedagogikk': 'Utdanningssektoren er for deg som brenner for å formidle kunnskap og hjelpe andre å vokse. Her kombinerer du faglig dybde med mellommenneskelige ferdigheter.',
    'Helse og omsorg': 'Helsesektoren trenger folk med empati, analytisk sans og ønske om å hjelpe andre. Dine svar tyder på at du kan trives i et miljø der arbeidet har direkte betydning for folks liv.',
    'Økonomi og finans': 'Økonomi og finans passer deg som liker tall, analyse og strategisk tenkning. Her jobber du med å forstå markeder, optimalisere ressurser og ta viktige beslutninger.',
    'Ingeniør og teknisk': 'Ingeniørfag kombinerer teori med praktisk problemløsning. Denne sektoren er for deg som ønsker å designe, bygge og forbedre systemer og infrastruktur.',
    'Psykologi og rådgivning': 'Denne sektoren passer deg som er interessert i mennesker, atferd og mentale prosesser. Her kan du bruke analytiske og mellommenneskelige ferdigheter til å støtte andre.',
    'Administrasjon og ledelse': 'Administrasjon og ledelse handler om å koordinere, organisere og drive organisasjoner fremover. Dine styrker innen struktur og kommunikasjon passer godt her.',
    'Design, markedsføring og kommun': 'Kreative sektorer kombinerer estetikk med strategi. Her bruker du kreativitet og kommunikasjon til å forme budskap, produkter og opplevelser.',
    'Samfunnsfag og politikk': 'Denne sektoren passer deg som er opptatt av samfunnsstrukturer, politikk og å forstå hvordan verden henger sammen. Analytisk tenkning og engasjement er nøkkelegenskaper her.',
  };
  return explanations[sektor] ?? `Denne sektoren matcher profilen din basert på svarene du ga om interesser, styrker og arbeidspreferanser. Her finnes roller som kan utnytte dine sterke sider.`;
};

const buildCareerExplanation = (yrke: string, sektor: string): string => {
  return `Som ${yrke.toLowerCase()} jobber du typisk innen ${sektor.toLowerCase()}. Denne rollen krever mange av egenskapene du scoret høyt på — og profiler som din finner seg ofte godt til rette her.`;
};

const buildStudyExplanation = (studie: string, sektor: string): string => {
  return `${studie} gir deg kompetanse som er etterspurt innen ${sektor.toLowerCase()}. Studiet kombinerer teori og praksis på en måte som matcher styrkeområdene i profilen din.`;
};

const buildCompanyExplanation = (bedrift: string, sektor: string): string => {
  return `${bedrift} opererer innen ${sektor.toLowerCase()} og er en arbeidsgiver der profiler som din ofte finner relevante muligheter. Utforsk bedriften for å se hvilke karriereveier de tilbyr.`;
};

/* ─── match-score bar ─── */
const MatchScoreBar: React.FC<{ score?: number; boost?: boolean }> = ({ score, boost }) => {
  if (score === undefined || score === null) return null;
  const pct = Math.round(score);
  const color =
    pct >= 80 ? 'bg-green-500' :
    pct >= 60 ? 'bg-primary' :
    pct >= 40 ? 'bg-yellow-500' : 'bg-muted-foreground';
  return (
    <div className="mt-2 space-y-0.5">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Match</span>
        <span className="font-medium">{pct}%{boost ? ' ⭐' : ''}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-muted">
        <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

/* ─── component ─── */
const ApiResultsView: React.FC<ApiResultsViewProps> = ({ results, userType, answers = {} }) => {
  const navigate = useNavigate();
  const { dimensjoner = [], topp_sektorer = [], yrker = [], studier = [], bedrifter = [], profil, preferanser } = results;

  // Try to get answers from localStorage if not passed as prop
  const surveyAnswers = useMemo(() => {
    if (Object.keys(answers).length > 0) return answers;
    try {
      const stored = localStorage.getItem('surveyAnswers');
      return stored ? JSON.parse(stored) : {};
    } catch { return {}; }
  }, [answers]);

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

  const topDims = dimensjoner.slice(0, 3);

  return (
    <div className="space-y-8">

      {/* ══════════════════════════════════════════════
          1. PERSONAL PROFILE HEADER
         ══════════════════════════════════════════════ */}
      <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <div className="absolute top-0 left-0 h-full w-1.5 bg-primary" />
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl md:text-3xl">
                {userTypeGreetings[userType]}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Basert på svarene dine har vi laget en personlig profil som forklarer hvem du er, hva du er god på, og hvilke veier som kan passe deg.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-background/60 border">
              <GraduationCap className="h-5 w-5 text-primary flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Brukertype</p>
                <p className="font-medium text-sm capitalize">{userTypeLabels[userType]}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-background/60 border">
              <Star className="h-5 w-5 text-primary flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Toppstyrke</p>
                <p className="font-medium text-sm">{topDims[0]?.navn ?? '–'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-background/60 border">
              <Target className="h-5 w-5 text-primary flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Toppsektor</p>
                <p className="font-medium text-sm">{topp_sektorer[0]?.sektor ?? '–'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-background/60 border">
              <Zap className="h-5 w-5 text-primary flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Antall dimensjoner</p>
                <p className="font-medium text-sm">{dimensjoner.length} analysert</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ══════════════════════════════════════════════
          2. WHO YOU ARE  (profil from API if available)
         ══════════════════════════════════════════════ */}
      {(profil || hasDimensions) && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              <CardTitle>Hvem du er</CardTitle>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Basert på svarene dine har vi satt sammen en beskrivelse av hvordan du jobber, lærer og hva som motiverer deg.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-base leading-relaxed text-foreground/90">
              {profil?.profil_sammendrag || buildWhoYouAre(dimensjoner, userType)}
            </p>

            {/* Profil detail cards */}
            {profil && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                {profil.laringsstil && (
                  <div className="p-3 rounded-lg bg-muted/30 border">
                    <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">Læringsstil</p>
                    <p className="text-sm">{profil.laringsstil}</p>
                  </div>
                )}
                {profil.arbeidsstil && (
                  <div className="p-3 rounded-lg bg-muted/30 border">
                    <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">Arbeidsstil</p>
                    <p className="text-sm">{profil.arbeidsstil}</p>
                  </div>
                )}
                {profil.motivasjonsstil && (
                  <div className="p-3 rounded-lg bg-muted/30 border">
                    <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">Motivasjon</p>
                    <p className="text-sm">{profil.motivasjonsstil}</p>
                  </div>
                )}
                {profil.karriere_orientering && (
                  <div className="p-3 rounded-lg bg-muted/30 border">
                    <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">Karriereorientering</p>
                    <p className="text-sm">{profil.karriere_orientering}</p>
                  </div>
                )}
              </div>
            )}

            {/* Styrker from profil */}
            {profil?.styrker && profil.styrker.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Dine styrker</p>
                <div className="flex flex-wrap gap-2">
                  {profil.styrker.map((s, i) => (
                    <Badge key={i} variant="secondary" className="text-sm py-1 px-3">
                      <Award className="h-3 w-3 mr-1" />
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Quick dimension badges (fallback when no profil) */}
            {!profil && (
              <div className="flex flex-wrap gap-2 mt-4">
                {topDims.map((dim, i) => (
                  <Badge key={i} variant="secondary" className="text-sm py-1 px-3">
                    <Sparkles className="h-3 w-3 mr-1" />
                    {dim.navn}
                  </Badge>
                ))}
              </div>
            )}

            {/* Preference signals */}
            {preferanser && (
              <div className="mt-2 pt-3 border-t space-y-2">
                {preferanser.bransje_interesse.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Bransjer du er interessert i:</p>
                    <div className="flex flex-wrap gap-1">
                      {preferanser.bransje_interesse.slice(0, 6).map((b, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{b}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ══════════════════════════════════════════════
          CAREER JOURNEY — visual pathway highlight
         ══════════════════════════════════════════════ */}
      {(hasStudier || hasYrker || hasBedrifter) && (
        <CareerJourney studier={studier} yrker={yrker} bedrifter={bedrifter} />
      )}

      {/* ══════════════════════════════════════════════
          3. YOUR CORE STRENGTHS
         ══════════════════════════════════════════════ */}
      {hasDimensions && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              <CardTitle>Dine styrker</CardTitle>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Hver dimensjon sier noe om styrkene dine. Her er hva de betyr for deg.
            </p>
          </CardHeader>
          <CardContent className="space-y-0">
            {/* Chart */}
            <div className="h-[280px] mb-6">
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
                  <YAxis type="category" dataKey="navn" width={130} tick={{ fontSize: 13 }} />
                  <Tooltip formatter={(v: number) => [`${v} poeng`, 'Score']} />
                  <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                    {dimensjoner.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Dimension explanations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dimensjoner.map((dim, i) => (
                <div key={i} className="p-4 rounded-lg border bg-muted/20">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="h-3 w-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: COLORS[i % COLORS.length] }}
                    />
                    <h4 className="font-semibold">{dim.navn}</h4>
                    <Badge variant="outline" className="ml-auto text-xs">{dim.score} poeng</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {getDimensionDescription(dim.navn)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ══════════════════════════════════════════════
          4. WHY THESE SECTORS FIT
         ══════════════════════════════════════════════ */}
      {hasSektorer && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <CardTitle>Sektorer som passer deg</CardTitle>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Basert på styrkene dine har vi identifisert sektorer der du sannsynligvis vil trives og gjøre det bra.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {topp_sektorer.map((sektor, i) => (
              <div key={i} className="p-5 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors">
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

      {/* ══════════════════════════════════════════════
          5. STUDY PROGRAMMES THAT MATCH
         ══════════════════════════════════════════════ */}
      {hasStudier && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <CardTitle>Studier som matcher deg</CardTitle>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Disse studieprogrammene gir deg kompetansen du trenger for å lykkes i sektorene som passer profilen din. Klikk for å utforske detaljene.
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
                      {studie.preferanse_boost && (
                        <span className="ml-1.5 text-xs text-yellow-500">⭐ Ditt valg</span>
                      )}
                    </h4>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  {studie.lærested && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                      <MapPin className="h-3 w-3" />
                      {studie.lærested}
                    </div>
                  )}
                  <Badge variant="outline" className="mb-2">{studie.sektor}</Badge>

                  {/* Match score bar */}
                  <MatchScoreBar score={studie.match_score} boost={studie.preferanse_boost} />

                  {/* Match reasons */}
                  {studie.match_reasons && studie.match_reasons.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {studie.match_reasons.slice(0, 3).map((r, j) => (
                        <Badge key={j} variant="secondary" className="text-xs">
                          <TrendingUp className="h-2.5 w-2.5 mr-1" />
                          {r}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <p className="text-sm leading-relaxed text-muted-foreground mt-2">
                    {buildStudyExplanation(studie.navn, studie.sektor)}
                  </p>

                  {/* Show related positions if available */}
                  {studie.stillinger && studie.stillinger.length > 0 && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs text-muted-foreground mb-1">Mulige stillinger:</p>
                      <div className="flex flex-wrap gap-1">
                        {studie.stillinger.slice(0, 3).map((s, j) => (
                          <Badge key={j} variant="secondary" className="text-xs">{s}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ══════════════════════════════════════════════
          6. CAREERS YOU COULD EXPLORE
         ══════════════════════════════════════════════ */}
      {hasYrker && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              <CardTitle>Karriereveier du kan utforske</CardTitle>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Disse yrkene matcher profilen din. Klikk på et yrke for å utforske det i detalj — se beskrivelse, kompetansekrav og relaterte muligheter.
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
                      {yrke.preferanse_boost && (
                        <span className="ml-1.5 text-xs text-yellow-500">⭐ Ditt valg</span>
                      )}
                    </h4>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    <Badge variant="outline">{yrke.sektor}</Badge>
                    {yrke.underkategori && (
                      <Badge variant="outline">{yrke.underkategori}</Badge>
                    )}
                  </div>

                  {/* Match score bar */}
                  <MatchScoreBar score={yrke.match_score} boost={yrke.preferanse_boost} />

                  {/* Match reasons */}
                  {yrke.match_reasons && yrke.match_reasons.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {yrke.match_reasons.slice(0, 3).map((r, j) => (
                        <Badge key={j} variant="secondary" className="text-xs">
                          <TrendingUp className="h-2.5 w-2.5 mr-1" />
                          {r}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <p className="text-sm leading-relaxed text-muted-foreground mt-2">
                    {buildCareerExplanation(yrke.navn, yrke.sektor)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ══════════════════════════════════════════════
          7. COMPANIES YOU MAY FIND INTERESTING
         ══════════════════════════════════════════════ */}
      {hasBedrifter && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <CardTitle>Bedrifter som kan passe deg</CardTitle>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Disse bedriftene opererer i sektorer som matcher profilen din. Klikk for å lese mer og se karrieremuligheter.
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
                      {bedrift.preferanse_boost && (
                        <span className="ml-1.5 text-xs text-yellow-500">⭐</span>
                      )}
                    </h4>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    <Badge variant="outline" className="text-xs">{bedrift.sektor}</Badge>
                    {bedrift.underkategori && (
                      <Badge variant="outline" className="text-xs">{bedrift.underkategori}</Badge>
                    )}
                  </div>

                  {/* Match score bar */}
                  <MatchScoreBar score={bedrift.match_score} boost={bedrift.preferanse_boost} />

                  {/* Match reasons */}
                  {bedrift.match_reasons && bedrift.match_reasons.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {bedrift.match_reasons.slice(0, 2).map((r, j) => (
                        <Badge key={j} variant="secondary" className="text-xs">
                          <TrendingUp className="h-2.5 w-2.5 mr-1" />
                          {r}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <p className="text-xs leading-relaxed text-muted-foreground mt-2">
                    {buildCompanyExplanation(bedrift.navn, bedrift.sektor)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ══════════════════════════════════════════════
          8. HOW YOUR ANSWERS INFLUENCED THIS
         ══════════════════════════════════════════════ */}
      <Card className="bg-muted/20 border-dashed">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-primary" />
            <CardTitle>Slik ble profilen din satt sammen</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground mb-4">
            Svarene du ga om interesser, styrker og arbeidspreferanser ble analysert og koblet mot ulike karrieredimensjoner. Hver dimensjon representerer en egenskap eller et interesseområde — og scorene viser hvor sterkt du trekker i hver retning.
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground mb-4">
            Dimensjonene ble deretter matchet mot sektorer der lignende profiler typisk trives og lykkes. Innenfor disse sektorene fant vi studier, yrker og bedrifter som er relevante for deg.
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Resultatet er ikke et fasitsvar — det er et utgangspunkt for å forstå deg selv bedre og utforske mulighetene som passer deg best.
          </p>
        </CardContent>
      </Card>

      {/* ══════════════════════════════════════════════
          9. NEXT STEPS
         ══════════════════════════════════════════════ */}
      <Card className="border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            <CardTitle>Neste steg for deg</CardTitle>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Her er konkrete ting du kan gjøre for å utforske mulighetene videre.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { icon: '💬', text: 'Snakk med en rådgiver — vis dem denne profilen og diskuter mulighetene' },
              { icon: '🎓', text: 'Utforsk studiene over — klikk deg inn og les mer om opptakskrav og innhold' },
              { icon: '🏢', text: 'Besøk bedriftene som interesserer deg — se om de har trainee-programmer eller praksis' },
              { icon: '👥', text: 'Snakk med folk som jobber i yrkene — spør hva de liker og hva som er utfordrende' },
              { icon: '📊', text: 'Utforsk statistikksiden vår for å sammenligne studier, lønn og jobbmuligheter' },
              { icon: '🔄', text: 'Ta spørreskjemaet på nytt senere — profilen din utvikler seg over tid' },
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/20 border">
                <span className="text-lg flex-shrink-0">{step.icon}</span>
                <span className="text-sm text-foreground/90">{step.text}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiResultsView;
