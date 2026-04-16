import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft, Briefcase, Building2, GraduationCap, ChevronRight,
  MapPin, Search, Users, TrendingUp,
} from "lucide-react";
import { supabase } from '@/lib/supabase';

// ─── Konstanter ──────────────────────────────────────────
const SEKTORER: Record<string, string> = {
  'administrasjon-og-ledelse':           'Administrasjon og ledelse',
  'helse-og-omsorg':                     'Helse og omsorg',
  'humaniora-og-sprak':                  'Humaniora og språk',
  'ingenior-og-teknisk':                 'Ingeniør og teknisk',
  'it-og-teknologi':                     'IT og teknologi',
  'jus-og-rettsvesen':                   'Jus og rettsvesen',
  'kunst-og-kultur':                     'Kunst og kultur',
  'design-markedsforing-og-kommunikasjon': 'Design, markedsføring og kommunikasjon',
  'miljo-natur-og-forskning':            'Miljø, natur og forskning',
  'okonomi-og-finans':                   'Økonomi og finans',
  'psykologi-og-radgivning':             'Psykologi og rådgivning',
  'religion-og-livssyn':                 'Religion og livssyn',
  'samfunnsfag-og-politikk':             'Samfunnsfag og politikk',
  'sikkerhet-og-beredskap':              'Sikkerhet og beredskap',
  'sport-og-kroppsoving':                'Sport og kroppsøving',
  'transport-og-logistikk':              'Transport og logistikk',
  'undervisning-og-pedagogikk':          'Undervisning og pedagogikk',
};

// Emoji per sektor
const SEKTOR_EMOJI: Record<string, string> = {
  'Administrasjon og ledelse':                '🏢',
  'Helse og omsorg':                          '🏥',
  'Humaniora og språk':                       '📚',
  'Ingeniør og teknisk':                      '⚙️',
  'IT og teknologi':                          '💻',
  'Jus og rettsvesen':                        '⚖️',
  'Kunst og kultur':                          '🎨',
  'Design, markedsføring og kommunikasjon':   '📣',
  'Miljø, natur og forskning':                '🌿',
  'Økonomi og finans':                        '💰',
  'Psykologi og rådgivning':                  '🧠',
  'Religion og livssyn':                      '🕊️',
  'Samfunnsfag og politikk':                  '🏛️',
  'Sikkerhet og beredskap':                   '🛡️',
  'Sport og kroppsøving':                     '⚽',
  'Transport og logistikk':                   '🚛',
  'Undervisning og pedagogikk':               '🎓',
};

// ─── Typer ───────────────────────────────────────────────
interface Yrke {
  uno_id: string;
  tittel: string;
  ledighetsrate?: number;
  antall_sysselsatte?: number;
  beskrivelse?: string;
}

interface Bedrift {
  Selskap: string;
  Sektor?: string;
  sub_sektor?: string;
  Lokasjon?: string;
  Ansatte?: string;
  antall_ansatte_tall?: number;
}

interface Studie {
  studie_navn: string;
  sektor?: string;
  antall_inst?: number;
}

const fmt = (n?: number | null) =>
  n != null ? n.toLocaleString('nb-NO') : null;

// ─── Hoved-komponent ─────────────────────────────────────
const SektorPage = () => {
  const { slug }   = useParams<{ slug: string }>();
  const navigate   = useNavigate();

  const [yrker,    setYrker]    = useState<Yrke[]>([]);
  const [bedrifter,setBedrifter]= useState<Bedrift[]>([]);
  const [studier,  setStudier]  = useState<Studie[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [sokYrke,  setSokYrke]  = useState('');
  const [aktiv,    setAktiv]    = useState<'yrker' | 'bedrifter' | 'studier'>('yrker');

  // Normaliser slug → sektor-navn
  const sektorNavn = slug ? (SEKTORER[slug] ?? decodeURIComponent(slug)) : '';
  const emoji = SEKTOR_EMOJI[sektorNavn] ?? '📂';

  useEffect(() => {
    if (!sektorNavn) return;

    const hent = async () => {
      setLoading(true);

      const [yrkeRes, bedriftRes, studieRes] = await Promise.all([
        supabase
          .from('yrker')
          .select('uno_id, tittel, ledighetsrate, antall_sysselsatte, beskrivelse')
          .eq('sektor', sektorNavn)
          .order('tittel', { ascending: true }),

        supabase
          .from('Bedrifter_ny')
          .select('Selskap, Sektor, sub_sektor, Lokasjon, Ansatte, antall_ansatte_tall')
          .eq('Sektor', sektorNavn)
          .order('antall_ansatte_tall', { ascending: false, nullsFirst: false })
          .limit(60),

        supabase
          .from('studier')
          .select('studie_navn, sektor, antall_inst')
          .eq('sektor', sektorNavn)
          .order('antall_inst', { ascending: false, nullsFirst: false })
          .limit(60),
      ]);

      setYrker(yrkeRes.data || []);
      setBedrifter(bedriftRes.data || []);
      setStudier(studieRes.data || []);
      setLoading(false);
    };

    hent();
  }, [sektorNavn]);

  if (loading) return (
    <Layout>
      <div className="container mx-auto py-20 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Henter sektordata…</p>
      </div>
    </Layout>
  );

  const filtrertYrker = yrker.filter(y =>
    y.tittel.toLowerCase().includes(sokYrke.toLowerCase())
  );

  return (
    <Layout>
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8 pt-24 max-w-5xl">

          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 -ml-2">
            <ArrowLeft className="mr-2 h-4 w-4" /> Tilbake
          </Button>

          {/* ── HERO ─────────────────────────────────────── */}
          <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-background to-violet-500/5 border border-primary/20 p-8 mb-8">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 text-3xl">
                {emoji}
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{sektorNavn}</h1>
                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4" />{yrker.length} yrker
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Building2 className="h-4 w-4" />{bedrifter.length} bedrifter
                  </span>
                  <span className="flex items-center gap-1.5">
                    <GraduationCap className="h-4 w-4" />{studier.length} studier
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── TABS ─────────────────────────────────────── */}
          <div className="flex gap-1 p-1 bg-muted rounded-xl mb-6 w-fit">
            {(['yrker', 'bedrifter', 'studier'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setAktiv(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                  aktiv === tab
                    ? 'bg-background shadow text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab === 'yrker' && `Yrker (${yrker.length})`}
                {tab === 'bedrifter' && `Bedrifter (${bedrifter.length})`}
                {tab === 'studier' && `Studier (${studier.length})`}
              </button>
            ))}
          </div>

          {/* ── YRKER ────────────────────────────────────── */}
          {aktiv === 'yrker' && (
            <div>
              {yrker.length > 8 && (
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Søk etter yrke…"
                    className="pl-9"
                    value={sokYrke}
                    onChange={(e) => setSokYrke(e.target.value)}
                  />
                </div>
              )}
              <div className="grid md:grid-cols-2 gap-3">
                {filtrertYrker.map((y) => (
                  <button
                    key={y.uno_id}
                    onClick={() => navigate(`/yrke/${y.uno_id}`)}
                    className="text-left rounded-xl border bg-card hover:bg-primary/5 hover:border-primary/30 transition-all p-4 group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-medium text-sm leading-tight mb-1 line-clamp-2">
                          {y.tittel}
                        </div>
                        <div className="flex gap-3 text-xs text-muted-foreground">
                          {y.antall_sysselsatte != null && (
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {fmt(y.antall_sysselsatte)} sysselsatte
                            </span>
                          )}
                          {y.ledighetsrate != null && (
                            <span className={`flex items-center gap-1 ${
                              Number(y.ledighetsrate) < 0.03 ? 'text-green-600' :
                              Number(y.ledighetsrate) < 0.06 ? 'text-yellow-600' : 'text-red-500'
                            }`}>
                              <TrendingUp className="h-3 w-3" />
                              {(Number(y.ledighetsrate) * 100).toFixed(1)}% ledighet
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary flex-shrink-0 mt-0.5 transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
              {filtrertYrker.length === 0 && (
                <p className="text-center text-muted-foreground py-12">
                  Ingen yrker matcher «{sokYrke}»
                </p>
              )}
            </div>
          )}

          {/* ── BEDRIFTER ────────────────────────────────── */}
          {aktiv === 'bedrifter' && (
            <div className="grid md:grid-cols-2 gap-3">
              {bedrifter.map((b) => (
                <button
                  key={b.Selskap}
                  onClick={() => navigate(
                    `/bedrift/${encodeURIComponent(b.Selskap.toLowerCase().replace(/\s+/g, '-'))}`,
                    { state: { company: b } }
                  )}
                  className="text-left rounded-xl border bg-card hover:bg-primary/5 hover:border-primary/30 transition-all p-4 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Building2 className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-sm truncate">{b.Selskap}</div>
                        <div className="flex gap-2 text-xs text-muted-foreground mt-0.5">
                          {b.sub_sektor && <span>{b.sub_sektor}</span>}
                          {b.Lokasjon && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 flex-shrink-0" />{b.Lokasjon}
                            </span>
                          )}
                          {(b.antall_ansatte_tall || b.Ansatte) && (
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3 flex-shrink-0" />
                              {b.antall_ansatte_tall ? fmt(b.antall_ansatte_tall) : b.Ansatte}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary flex-shrink-0 mt-1 transition-colors" />
                  </div>
                </button>
              ))}
              {bedrifter.length === 0 && (
                <p className="col-span-2 text-center text-muted-foreground py-12">
                  Ingen bedrifter funnet i denne sektoren
                </p>
              )}
            </div>
          )}

          {/* ── STUDIER ──────────────────────────────────── */}
          {aktiv === 'studier' && (
            <div className="grid md:grid-cols-2 gap-3">
              {studier.map((s) => (
                <button
                  key={s.studie_navn}
                  onClick={() => navigate(`/utdanning/${encodeURIComponent(s.studie_navn)}`)}
                  className="text-left rounded-xl border bg-card hover:bg-violet-500/5 hover:border-violet-500/30 transition-all p-4 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="h-4 w-4 text-violet-600" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-sm truncate">{s.studie_navn}</div>
                        {s.antall_inst != null && (
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {s.antall_inst} lærestedre
                          </div>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-violet-600 flex-shrink-0 mt-1 transition-colors" />
                  </div>
                </button>
              ))}
              {studier.length === 0 && (
                <p className="col-span-2 text-center text-muted-foreground py-12">
                  Ingen studier funnet i denne sektoren
                </p>
              )}
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
};

export default SektorPage;
