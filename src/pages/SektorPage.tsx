import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ArrowLeft, Briefcase, Building2, GraduationCap, ChevronRight,
  MapPin, Search, Users, TrendingUp,
} from "lucide-react";
import { supabase } from '@/lib/supabase';

// ─── Konstanter ──────────────────────────────────────────
const SEKTORER: Record<string, string> = {
  'administrasjon-og-ledelse':              'Administrasjon og ledelse',
  'helse-og-omsorg':                        'Helse og omsorg',
  'humaniora-og-sprak':                     'Humaniora og språk',
  'ingenior-og-teknisk':                    'Ingeniør og teknisk',
  'it-og-teknologi':                        'IT og teknologi',
  'jus-og-rettsvesen':                      'Jus og rettsvesen',
  'kunst-og-kultur':                        'Kunst og kultur',
  'design-markedsforing-og-kommunikasjon':  'Design, markedsføring og kommunikasjon',
  'miljo-natur-og-forskning':               'Miljø, natur og forskning',
  'okonomi-og-finans':                      'Økonomi og finans',
  'psykologi-og-radgivning':                'Psykologi og rådgivning',
  'religion-og-livssyn':                    'Religion og livssyn',
  'samfunnsfag-og-politikk':                'Samfunnsfag og politikk',
  'sikkerhet-og-beredskap':                 'Sikkerhet og beredskap',
  'sport-og-kroppsoving':                   'Sport og kroppsøving',
  'transport-og-logistikk':                 'Transport og logistikk',
  'undervisning-og-pedagogikk':             'Undervisning og pedagogikk',
};

const SEKTOR_EMOJI: Record<string, string> = {
  'Administrasjon og ledelse':               '🏢',
  'Helse og omsorg':                         '🏥',
  'Humaniora og språk':                      '📚',
  'Ingeniør og teknisk':                     '⚙️',
  'IT og teknologi':                         '💻',
  'Jus og rettsvesen':                       '⚖️',
  'Kunst og kultur':                         '🎨',
  'Design, markedsføring og kommunikasjon':  '📣',
  'Miljø, natur og forskning':               '🌿',
  'Økonomi og finans':                       '💰',
  'Psykologi og rådgivning':                 '🧠',
  'Religion og livssyn':                     '🕊️',
  'Samfunnsfag og politikk':                 '🏛️',
  'Sikkerhet og beredskap':                  '🛡️',
  'Sport og kroppsøving':                    '⚽',
  'Transport og logistikk':                  '🚛',
  'Undervisning og pedagogikk':              '🎓',
};

// ─── Typer ───────────────────────────────────────────────
interface Yrke {
  uno_id: string;
  tittel: string;
  under_sektor?: string;
  ledighetsrate?: number;
  antall_sysselsatte?: number;
}

interface Bedrift {
  Selskap: string;
  sub_sektor?: string;
  Lokasjon?: string;
  Ansatte?: string;
  antall_ansatte_tall?: number;
}

interface Studie {
  studie_navn: string;
  antall_inst?: number;
  under_sektor?: string;
  opptakspoeng?: number;
  studieplasser?: number;
  sokere_mott?: number;
  sokere_kvalifisert?: number;
  institusjoner?: string;
}

const fmt = (n?: number | null) =>
  n != null ? n.toLocaleString('nb-NO') : null;

// ─── YrkeKort ────────────────────────────────────────────
const YrkeKort = ({ y, onClick }: { y: Yrke; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="w-full text-left rounded-xl border bg-card hover:bg-primary/5 hover:border-primary/30 transition-all p-4 group"
  >
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0">
        <div className="font-medium text-sm leading-tight mb-1">{y.tittel}</div>
        <div className="flex gap-3 text-xs text-muted-foreground">
          {y.antall_sysselsatte != null && (
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />{fmt(y.antall_sysselsatte)} sysselsatte
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
);

// ─── Hoved-komponent ─────────────────────────────────────
const SektorPage = () => {
  const { slug }  = useParams<{ slug: string }>();
  const navigate  = useNavigate();

  const [yrker,     setYrker]     = useState<Yrke[]>([]);
  const [bedrifter, setBedrifter] = useState<Bedrift[]>([]);
  const [studier,   setStudier]   = useState<Studie[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [sokYrke,   setSokYrke]   = useState('');
  const [aktiv,     setAktiv]     = useState<'yrker' | 'bedrifter' | 'studier'>('yrker');

  // Filter/sort state for studier-tab
  const [filtUnder,   setFiltUnder]   = useState<string>('alle');
  const [filtInst,    setFiltInst]    = useState<string>('alle');
  const [sortStudier, setSortStudier] = useState<'karakter' | 'popularitet' | 'konkurranse' | 'navn'>('karakter');

  const sektorNavn = slug ? (SEKTORER[slug] ?? decodeURIComponent(slug)) : '';
  const emoji      = SEKTOR_EMOJI[sektorNavn] ?? '📂';

  useEffect(() => {
    if (!sektorNavn) return;
    const hent = async () => {
      setLoading(true);
      const [yrkeRes, bedriftRes, studieRes] = await Promise.all([
        supabase
          .from('yrker')
          .select('uno_id, tittel, under_sektor, ledighetsrate, antall_sysselsatte')
          .eq('sektor', sektorNavn)
          .order('under_sektor', { ascending: true, nullsFirst: false })
          .order('tittel',       { ascending: true }),

        supabase
          .from('Bedrifter_ny')
          .select('Selskap, sub_sektor, Lokasjon, Ansatte, antall_ansatte_tall')
          .eq('Sektor', sektorNavn)
          .order('sub_sektor',          { ascending: true, nullsFirst: false })
          .order('antall_ansatte_tall', { ascending: false, nullsFirst: false })
          .limit(200),

        supabase
          .from('studier')
          .select('studie_navn, antall_inst, under_sektor, opptakspoeng, studieplasser, sokere_mott, sokere_kvalifisert, institusjoner')
          .eq('sektor', sektorNavn)
          .limit(500),
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

  // Grupper yrker etter under_sektor
  const filtrert = sokYrke
    ? yrker.filter(y => y.tittel.toLowerCase().includes(sokYrke.toLowerCase()))
    : yrker;

  const grupper: Record<string, Yrke[]> = {};
  for (const y of filtrert) {
    const kat = y.under_sektor || 'Andre';
    if (!grupper[kat]) grupper[kat] = [];
    grupper[kat].push(y);
  }
  const sorterteGrupper = Object.entries(grupper).sort(([a], [b]) =>
    a === 'Andre' ? 1 : b === 'Andre' ? -1 : a.localeCompare(b, 'nb')
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
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  aktiv === tab
                    ? 'bg-background shadow text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab === 'yrker'    && `Yrker (${yrker.length})`}
                {tab === 'bedrifter'&& `Bedrifter (${bedrifter.length})`}
                {tab === 'studier'  && `Studier (${studier.length})`}
              </button>
            ))}
          </div>

          {/* ── YRKER — gruppert etter under_sektor ──────── */}
          {aktiv === 'yrker' && (
            <div>
              {yrker.length > 8 && (
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Søk etter yrke…"
                    className="pl-9"
                    value={sokYrke}
                    onChange={(e) => setSokYrke(e.target.value)}
                  />
                </div>
              )}

              {filtrert.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">
                  Ingen yrker matcher «{sokYrke}»
                </p>
              ) : (
                <div className="space-y-8">
                  {sorterteGrupper.map(([underSektor, liste]) => (
                    <div key={underSektor}>
                      {/* Underkategori-overskrift */}
                      <div className="flex items-center gap-3 mb-3">
                        <h2 className="text-base font-semibold">{underSektor}</h2>
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                          {liste.length}
                        </span>
                        <div className="flex-1 h-px bg-border" />
                      </div>

                      <div className="grid md:grid-cols-2 gap-2">
                        {liste.map((y) => (
                          <YrkeKort
                            key={y.uno_id}
                            y={y}
                            onClick={() => navigate(`/yrke/${y.uno_id}`)}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── BEDRIFTER ────────────────────────────────── */}
          {aktiv === 'bedrifter' && (() => {
            const grupper: Record<string, typeof bedrifter> = {};
            for (const b of bedrifter) {
              const k = b.sub_sektor || 'Andre';
              (grupper[k] = grupper[k] || []).push(b);
            }
            const sortert = Object.entries(grupper).sort(([a], [b]) =>
              a === 'Andre' ? 1 : b === 'Andre' ? -1 : a.localeCompare(b, 'nb')
            );
            return (
              <div className="space-y-6">
                {sortert.map(([kat, liste]) => (
                  <div key={kat}>
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{kat}</h3>
                      <span className="text-xs text-muted-foreground">({liste.length})</span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      {liste.map((b) => (
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
                    </div>
                  </div>
                ))}
                {bedrifter.length === 0 && (
                  <p className="text-center text-muted-foreground py-12">
                    Ingen bedrifter funnet i denne sektoren
                  </p>
                )}
              </div>
            );
          })()}

          {/* ── STUDIER ──────────────────────────────────── */}
          {aktiv === 'studier' && (() => {
            // Hent unike under-sektorer og institusjoner for filter
            const alleUnder = Array.from(new Set(studier.map(s => s.under_sektor).filter(Boolean))).sort() as string[];
            const alleInst = Array.from(new Set(
              studier.flatMap(s => (s.institusjoner || '').split(',').map(i => i.trim()).filter(Boolean))
            )).sort();

            // Filtrer
            let filt = studier;
            if (filtUnder !== 'alle') filt = filt.filter(s => s.under_sektor === filtUnder);
            if (filtInst !== 'alle')  filt = filt.filter(s => (s.institusjoner || '').includes(filtInst));

            // Sorter
            const konk = (s: Studie) =>
              s.sokere_kvalifisert && s.studieplasser ? s.sokere_kvalifisert / s.studieplasser : 0;
            filt = [...filt].sort((a, b) => {
              if (sortStudier === 'karakter')    return (b.opptakspoeng || 0) - (a.opptakspoeng || 0);
              if (sortStudier === 'popularitet') return (b.sokere_mott || 0)  - (a.sokere_mott || 0);
              if (sortStudier === 'konkurranse') return konk(b) - konk(a);
              return a.studie_navn.localeCompare(b.studie_navn, 'nb');
            });

            return (
              <div>
                {/* Filter/sort-kontroller */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Sub-sektor</label>
                    <Select value={filtUnder} onValueChange={setFiltUnder}>
                      <SelectTrigger><SelectValue placeholder="Alle sub-sektorer" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="alle">Alle sub-sektorer</SelectItem>
                        {alleUnder.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Universitet</label>
                    <Select value={filtInst} onValueChange={setFiltInst}>
                      <SelectTrigger><SelectValue placeholder="Alle universiteter" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="alle">Alle universiteter</SelectItem>
                        {alleInst.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Sorter etter</label>
                    <Select value={sortStudier} onValueChange={v => setSortStudier(v as any)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="karakter">Karaktersnitt</SelectItem>
                        <SelectItem value="popularitet">Popularitet (møtt)</SelectItem>
                        <SelectItem value="konkurranse">Konkurransenivå</SelectItem>
                        <SelectItem value="navn">Navn (A–Å)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mb-4">Viser {filt.length} av {studier.length} studier</p>

                <div className="grid md:grid-cols-2 gap-3">
                  {filt.map((s) => {
                    const ratio = konk(s);
                    let niv = '', fargekl = '';
                    if (ratio > 0) {
                      if (ratio > 20)      { niv = 'Ekstremt høy'; fargekl = 'bg-red-100 text-red-800'; }
                      else if (ratio > 15) { niv = 'Veldig høy';   fargekl = 'bg-red-100 text-red-800'; }
                      else if (ratio > 10) { niv = 'Høy';          fargekl = 'bg-orange-100 text-orange-800'; }
                      else if (ratio > 5)  { niv = 'Moderat';      fargekl = 'bg-yellow-100 text-yellow-800'; }
                      else                 { niv = 'Lav';          fargekl = 'bg-green-100 text-green-800'; }
                    }
                    return (
                      <button
                        key={s.studie_navn}
                        onClick={() => navigate(`/studie/${encodeURIComponent(s.studie_navn)}`)}
                        className="text-left rounded-xl border bg-card hover:bg-violet-500/5 hover:border-violet-500/30 transition-all p-4 group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                              <GraduationCap className="h-4 w-4 text-violet-600" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-medium text-sm truncate">{s.studie_navn}</div>
                              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-0.5">
                                {s.antall_inst != null && <span>{s.antall_inst} læresteder</span>}
                                {s.opptakspoeng != null && s.opptakspoeng > 0 && <span>· {s.opptakspoeng} poeng</span>}
                                {niv && <span className={`px-1.5 py-0.5 rounded ${fargekl}`}>{niv}</span>}
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-violet-600 flex-shrink-0 mt-1 transition-colors" />
                        </div>
                      </button>
                    );
                  })}
                </div>
                {filt.length === 0 && (
                  <p className="text-center text-muted-foreground py-12">
                    Ingen studier matcher filtrene
                  </p>
                )}
              </div>
            );
          })()}

        </div>
      </div>
    </Layout>
  );
};

export default SektorPage;
