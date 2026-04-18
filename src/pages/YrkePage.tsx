import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, Briefcase, Users, TrendingUp, GraduationCap,
  Building2, MapPin, ChevronRight, Sparkles, BarChart3,
  BookOpen, ArrowUpRight, AlertCircle,
} from "lucide-react";
import { supabase } from '@/lib/supabase';
import FeedbackButton from '@/components/FeedbackButton';
import YrkeSalaryChart from '@/components/YrkeSalaryChart';

// ─── Typer ───────────────────────────────────────────────
interface Yrke {
  uno_id: string;
  tittel: string;
  beskrivelse?: string;
  sektor?: string;
  under_sektor?: string;
  antall_sysselsatte?: number;
  ledighetsrate?: number;
  gjennomsnitt_lonn?: number;
  lonn_menn?: number;
  lonn_kvinner?: number;
  er_utvidet?: boolean;
  ai_generert?: boolean;
  linked_uno_id?: string;
}

interface YrkeBedrift {
  bedrift: string;
  stillinger: number;
  kommune?: string;
  fylke?: string;
  rang?: number;
}

interface YrkeUtdanning {
  utdanning: string;
  prosent: number;
  rang?: number;
}

interface YrkeNus {
  nus_kode: string;
  nus_navn?: string;
  fagfelt_navn?: string;
  nivaa_navn?: string;
}

interface YrkeStudie {
  studie_navn: string;
  rang?: number;
  institusjoner?: string;
  antall_inst?: number;
  opptakspoeng?: number;
  studiekoder?: string;
  studieplasser?: number;
  sokere_mott?: number;
  sokere_kvalifisert?: number;
  beskrivelse?: string;
}

// ─── Helpers ─────────────────────────────────────────────
const fmt = (n?: number | null) =>
  n != null ? n.toLocaleString('nb-NO') : null;

const sektorSlug = (sektor: string) =>
  encodeURIComponent(sektor.toLowerCase().replace(/\s+/g, '-').replace(/[æ]/g, 'ae').replace(/[ø]/g, 'o').replace(/[å]/g, 'a'));

const StatCard = ({
  icon: Icon, label, value, sub, color = '',
}: {
  icon: any; label: string; value: React.ReactNode; sub?: string; color?: string;
}) => (
  <Card>
    <CardContent className="pt-5">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <div className={`text-2xl font-bold ${color}`}>{value ?? '—'}</div>
      {sub && <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>}
    </CardContent>
  </Card>
);

// ─── Hoved-komponent ─────────────────────────────────────
const YrkePage = () => {
  const { unoId }  = useParams<{ unoId: string }>();
  const navigate   = useNavigate();

  const [yrke,      setYrke]      = useState<Yrke | null>(null);
  const [bedrifter, setBedrifter] = useState<YrkeBedrift[]>([]);
  const [utdanning, setUtdanning] = useState<YrkeUtdanning[]>([]);
  const [nus,       setNus]       = useState<YrkeNus[]>([]);
  const [lignende,  setLignende]  = useState<Yrke[]>([]);
  const [linkedTittel, setLinkedTittel] = useState<string | undefined>();
  const [studier,   setStudier]   = useState<YrkeStudie[]>([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    if (!unoId) return;

    const hent = async () => {
      setLoading(true);

      // 1. Hent yrke
      const { data: yrkeData } = await supabase
        .from('yrker')
        .select('*')
        .eq('uno_id', unoId)
        .single();

      if (!yrkeData) { setLoading(false); return; }
      setYrke(yrkeData);

      // Bruk linked_uno_id for støttedata hvis er_utvidet
      const dataId = yrkeData.linked_uno_id || unoId;

      // Hent forelder-tittel for salary-chart fallback
      if (yrkeData.linked_uno_id) {
        const { data: par } = await supabase
          .from('yrker')
          .select('tittel')
          .eq('uno_id', yrkeData.linked_uno_id)
          .maybeSingle();
        if (par?.tittel) setLinkedTittel(par.tittel);
      }

      // 2. Bedrifter + utdanning + NUS + studier — parallelt
      const [bedRes, utdRes, nusRes, studRes] = await Promise.all([
        supabase
          .from('yrke_bedrifter')
          .select('bedrift, stillinger, kommune, fylke, rang')
          .eq('uno_id', dataId)
          .order('rang', { ascending: true })
          .limit(8),

        supabase
          .from('yrke_utdanning')
          .select('utdanning, prosent, rang')
          .eq('uno_id', dataId)
          .order('rang', { ascending: true })
          .limit(8),

        supabase
          .from('yrke_nus_map')
          .select('nus_kode, nus_navn, fagfelt_navn, nivaa_navn')
          .eq('uno_id', dataId)
          .not('nus_navn', 'is', null)
          .limit(10),

        supabase
          .from('yrke_studier')
          .select('studie_navn, rang')
          .eq('uno_id', dataId)
          .order('rang', { ascending: true })
          .limit(8),
      ]);

      setBedrifter(bedRes.data || []);
      setUtdanning(utdRes.data || []);
      setNus(nusRes.data || []);

      // Berik studier-listen med aggregerte tall fra studier_v2
      const studieNavn = (studRes.data || []).map(s => s.studie_navn);
      if (studieNavn.length > 0) {
        const { data: rå } = await supabase
          .from('studier_v2')
          .select('studie_navn, opptakspoeng, studieplasser, sokere_moett, sokere_kvalifisert, laerestednavn, studiekode')
          .in('studie_navn', studieNavn);
        // Aggreger per studie_navn
        const aggMap = new Map<string, any>();
        for (const r of rå || []) {
          let a = aggMap.get(r.studie_navn);
          if (!a) {
            a = { studie_navn: r.studie_navn, studieplasser: 0, sokere_mott: 0, sokere_kvalifisert: 0,
                  _poenger: [], _institusjoner: new Set<string>(), _koder: new Set<string>() };
            aggMap.set(r.studie_navn, a);
          }
          if (r.laerestednavn) a._institusjoner.add(r.laerestednavn);
          if (r.studiekode)    a._koder.add(r.studiekode);
          if (r.opptakspoeng && r.opptakspoeng > 0) a._poenger.push(r.opptakspoeng);
          a.studieplasser += (r.studieplasser || 0);
          a.sokere_mott += (r.sokere_moett || 0);
          a.sokere_kvalifisert += (r.sokere_kvalifisert || 0);
        }
        const infoMap = new Map<string, any>();
        aggMap.forEach((a, navn) => infoMap.set(navn, {
          institusjoner: Array.from(a._institusjoner).join(','),
          antall_inst: a._institusjoner.size,
          opptakspoeng: a._poenger.length ? Math.round((a._poenger.reduce((s: number, p: number) => s + p, 0) / a._poenger.length) * 10) / 10 : undefined,
          studieplasser: a.studieplasser || undefined,
          sokere_mott: a.sokere_mott || undefined,
          sokere_kvalifisert: a.sokere_kvalifisert || undefined,
          studiekoder: Array.from(a._koder).join(','),
        }));
        setStudier((studRes.data || []).map(s => ({ ...s, ...(infoMap.get(s.studie_navn) || {}) })));
      } else {
        setStudier([]);
      }

      // 3. Lignende yrker i samme under_sektor (faller tilbake til sektor om ingen under_sektor)
      if (yrkeData.sektor) {
        let query = supabase
          .from('yrker')
          .select('uno_id, tittel, sektor, under_sektor, ledighetsrate, antall_sysselsatte, gjennomsnitt_lonn, lonn_menn, lonn_kvinner')
          .neq('uno_id', unoId)
          .limit(6);

        if (yrkeData.under_sektor) {
          query = query.eq('under_sektor', yrkeData.under_sektor);
        } else {
          query = query.eq('sektor', yrkeData.sektor);
        }

        const { data: ligData } = await query;
        setLignende(ligData || []);
      }

      setLoading(false);
    };

    hent();
  }, [unoId]);

  // ── Guards ────────────────────────────────────────────
  if (loading) return (
    <Layout>
      <div className="container mx-auto py-20 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Henter yrkesdata…</p>
      </div>
    </Layout>
  );

  if (!yrke) return (
    <Layout>
      <div className="container mx-auto py-20 text-center max-w-lg">
        <h1 className="text-3xl font-bold mb-4">Yrke ikke funnet</h1>
        <Button onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Tilbake
        </Button>
      </div>
    </Layout>
  );

  // ── Derived ───────────────────────────────────────────
  // For utvidede yrker er lønn/ledighet arvet fra forelder → marker som estimat
  const erEstimert = !!yrke.er_utvidet;

  // Beregn range fra lignende yrker (min-max) for ærlig visning
  const computeRange = (getter: (l: Yrke) => number | undefined) => {
    const vals = lignende.map(getter).filter((v): v is number => v != null && v > 0);
    if (!vals.length) return null;
    return { min: Math.min(...vals), max: Math.max(...vals), avg: vals.reduce((a, b) => a + b, 0) / vals.length };
  };

  const lonnRange = computeRange(l => l.gjennomsnitt_lonn);
  const ledRange  = computeRange(l => l.ledighetsrate);

  // Lønn-visning
  const lonnVisning = !erEstimert && yrke.gjennomsnitt_lonn != null
    ? { tekst: `${fmt(yrke.gjennomsnitt_lonn)} kr`, sub: 'månedlig heltid, 2024', estimat: false }
    : lonnRange
    ? { tekst: lonnRange.min === lonnRange.max
          ? `ca. ${fmt(Math.round(lonnRange.avg))} kr`
          : `${fmt(Math.round(lonnRange.min))}–${fmt(Math.round(lonnRange.max))} kr`,
        sub: 'lønn i lignende yrker', estimat: true }
    : yrke.gjennomsnitt_lonn != null
    ? { tekst: `ca. ${fmt(yrke.gjennomsnitt_lonn)} kr`, sub: 'anslag', estimat: true }
    : null;

  // Ledighet-visning
  const ledVisning = !erEstimert && yrke.ledighetsrate != null
    ? { tekst: `${(Number(yrke.ledighetsrate) * 100).toFixed(1)}%`, sub: 'andel arbeidsledige', estimat: false, verdi: yrke.ledighetsrate }
    : ledRange
    ? { tekst: ledRange.min === ledRange.max
          ? `ca. ${(ledRange.avg * 100).toFixed(1)}%`
          : `${(ledRange.min * 100).toFixed(1)}–${(ledRange.max * 100).toFixed(1)}%`,
        sub: 'arbeidsledighet i lignende yrker', estimat: true, verdi: ledRange.avg }
    : yrke.ledighetsrate != null
    ? { tekst: `ca. ${(Number(yrke.ledighetsrate) * 100).toFixed(1)}%`, sub: 'anslag', estimat: true, verdi: yrke.ledighetsrate }
    : null;

  const ledFarge = ledVisning?.verdi != null
    ? ledVisning.verdi < 0.03 ? 'text-green-600'
    : ledVisning.verdi < 0.06 ? 'text-yellow-600'
    : 'text-red-500'
    : '';

  // Dedup NUS på fagfelt_navn
  const uniqFagfelt = Array.from(
    new Map(nus.filter(n => n.fagfelt_navn).map(n => [n.fagfelt_navn, n])).values()
  );

  return (
    <Layout>
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8 pt-24 max-w-5xl">

          <div className="flex items-center justify-between mb-6 -ml-2">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Tilbake
            </Button>
            {yrke && <FeedbackButton type="yrke" entityId={yrke.uno_id} entityLabel={yrke.tittel} />}
          </div>

          {/* ── 1. HERO ──────────────────────────────────── */}
          <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-background to-violet-500/5 border border-primary/20 p-8 mb-8">
            <div className="flex items-start gap-6 flex-wrap">

              <div className="w-16 h-16 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                <Briefcase className="h-8 w-8 text-primary" />
              </div>

              <div className="flex-1 min-w-0">
                <h1 className="text-3xl font-bold mb-2">{yrke.tittel}</h1>

                <div className="flex flex-wrap gap-2">
                  {yrke.sektor && (
                    <button
                      onClick={() => navigate(`/sektor/${sektorSlug(yrke.sektor!)}`)}
                      className="flex items-center gap-1"
                    >
                      <Badge className="bg-primary/15 text-primary border-primary/30 hover:bg-primary/25 cursor-pointer transition-colors">
                        {yrke.sektor}
                      </Badge>
                    </button>
                  )}
                  {yrke.under_sektor && <Badge variant="secondary">{yrke.under_sektor}</Badge>}
                  {yrke.er_utvidet && (
                    <Badge variant="outline" className="text-violet-600 border-violet-300">
                      Utvidet
                    </Badge>
                  )}
                  {yrke.ai_generert && (
                    <span className="flex items-center gap-1 text-xs text-violet-600 ml-1">
                      <Sparkles className="h-3 w-3" />AI-beskrivelse
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── 2. BESKRIVELSE ───────────────────────────── */}
          {yrke.beskrivelse && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Om yrket</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {yrke.beskrivelse}
              </p>
            </div>
          )}

          {/* ── 3. NØKKELTALL ────────────────────────────── */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Nøkkeltall</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                icon={Users}
                label="Sysselsatte"
                value={yrke.antall_sysselsatte ? fmt(yrke.antall_sysselsatte) : '—'}
                sub="i Norge"
              />
              <StatCard
                icon={AlertCircle}
                label="Ledighetsrate"
                value={ledVisning?.tekst ?? '—'}
                color={ledFarge}
                sub={ledVisning?.sub}
              />
              <StatCard
                icon={TrendingUp}
                label="Gj.snitt lønn"
                value={lonnVisning?.tekst ?? '—'}
                sub={lonnVisning?.sub}
              />
              <StatCard
                icon={BarChart3}
                label="Lønnsgap"
                value={
                  !erEstimert && yrke.lonn_menn && yrke.lonn_kvinner
                    ? `${fmt(yrke.lonn_menn)} / ${fmt(yrke.lonn_kvinner)}`
                    : '—'
                }
                sub={!erEstimert && yrke.lonn_menn && yrke.lonn_kvinner ? 'menn / kvinner kr/mnd' : undefined}
              />
            </div>
            {erEstimert && lignende.length > 0 && (
              <div className="text-xs text-muted-foreground mt-3">
                <span className="italic">Dette er et spesialisert yrke uten egen SSB-statistikk. Tallene over er basert på disse lignende yrkene:</span>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {lignende
                    .filter(l => l.gjennomsnitt_lonn || l.ledighetsrate != null)
                    .map(l => (
                      <button
                        key={l.uno_id}
                        onClick={() => navigate(`/yrke/${l.uno_id}`)}
                        className="px-2 py-0.5 rounded border bg-card hover:bg-primary/5 hover:border-primary/30 transition-colors"
                      >
                        {l.tittel}
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* ── 3b. LØNNSUTVIKLING ───────────────────────── */}
          <YrkeSalaryChart yrkeTittel={yrke.tittel} linkedTittel={linkedTittel} />

          {/* ── 4. UTDANNING ─────────────────────────────── */}
          {utdanning.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-1">Vanligste utdanningsbakgrunner</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Andel av de sysselsatte med denne utdanningen
              </p>
              <div className="space-y-3">
                {utdanning.map((u) => (
                  <div key={u.utdanning} className="flex items-center gap-4">
                    <div className="w-8 text-right flex-shrink-0">
                      <span className="text-sm font-semibold text-primary">
                        {u.prosent != null ? `${Math.round(u.prosent)}%` : '—'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium mb-1 truncate">{u.utdanning}</div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary/60 rounded-full"
                          style={{ width: `${Math.min(u.prosent || 0, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── 5. NUS / STUDIERETNINGER ─────────────────── */}
          {uniqFagfelt.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Relevante studieretninger (NUS)</h2>
              <div className="flex flex-wrap gap-2">
                {uniqFagfelt.map((n) => (
                  <span
                    key={n.fagfelt_navn}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg border bg-card text-sm font-medium"
                  >
                    <BookOpen className="h-3.5 w-3.5 text-violet-600" />
                    {n.fagfelt_navn}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ── 5b. RELEVANTE STUDIER ───────────────────── */}
          {studier.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-1">Relevante studier</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Studier som kan lede til dette yrket — rangert etter hvor vanlig utdanningen er blant sysselsatte
              </p>
              <div className="space-y-4">
                {studier.map((s, idx) => {
                  const rank = idx + 1;
                  const ratio = s.sokere_kvalifisert && s.studieplasser
                    ? s.sokere_kvalifisert / s.studieplasser
                    : null;
                  let niv = "Lav", fargekl = "bg-green-100 text-green-800";
                  if (ratio != null) {
                    if (ratio > 20)      { niv = "Ekstremt høy"; fargekl = "bg-red-100 text-red-800"; }
                    else if (ratio > 15) { niv = "Veldig høy";   fargekl = "bg-red-100 text-red-800"; }
                    else if (ratio > 10) { niv = "Høy";          fargekl = "bg-orange-100 text-orange-800"; }
                    else if (ratio > 5)  { niv = "Moderat";      fargekl = "bg-yellow-100 text-yellow-800"; }
                  }
                  const førstekode = s.studiekoder?.split(',')[0]?.trim();

                  return (
                    <Card
                      key={s.studie_navn}
                      onClick={() => navigate(`/studie/${encodeURIComponent(s.studie_navn)}`)}
                      className={`border-l-4 transition-all hover:shadow-md cursor-pointer ${rank === 1 ? 'border-l-primary' : 'border-l-transparent'}`}
                    >
                      <CardContent className="pt-5 pb-4">
                        <div className="flex justify-between items-start gap-3 mb-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline">#{rank}</Badge>
                              <h3 className="text-lg font-semibold leading-tight">{s.studie_navn}</h3>
                            </div>
                            {førstekode && (
                              <p className="text-sm text-muted-foreground">Studiekode: {førstekode}</p>
                            )}
                          </div>
                          {s.opptakspoeng != null && s.opptakspoeng > 0 && (
                            <div className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary flex items-center gap-1 flex-shrink-0">
                              <GraduationCap className="h-4 w-4" />
                              <span>{s.opptakspoeng}</span>
                            </div>
                          )}
                        </div>

                        {s.beskrivelse && (
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{s.beskrivelse}</p>
                        )}

                        <div className="grid grid-cols-3 gap-4 py-2">
                          <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground">Studieplasser</span>
                            <span className="font-medium">{s.studieplasser ?? '—'}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground">Søkere møtt</span>
                            <span className="font-medium">{s.sokere_mott ?? '—'}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground">Konkurransenivå</span>
                            {ratio != null ? (
                              <div className={`text-xs px-2 py-0.5 rounded-full w-fit ${fargekl}`}>{niv}</div>
                            ) : (
                              <span className="text-sm text-muted-foreground">—</span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <div className="text-xs text-muted-foreground">
                            {s.antall_inst ? `${s.antall_inst} ${s.antall_inst === 1 ? 'institusjon' : 'institusjoner'}` : ''}
                          </div>
                          <div className="text-xs text-primary flex items-center gap-1">
                            Se detaljer <ChevronRight className="h-3.5 w-3.5" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── 6. TOP BEDRIFTER ─────────────────────────── */}
          {bedrifter.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-1">Topp arbeidsgivere</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Bedrifter med flest stillinger i dette yrket
              </p>
              <div className="grid md:grid-cols-2 gap-3">
                {bedrifter.map((b) => (
                  <button
                    key={b.bedrift}
                    onClick={() => navigate(
                      `/bedrift/${encodeURIComponent(b.bedrift.toLowerCase().replace(/\s+/g, '-'))}`,
                      { state: { company: { Selskap: b.bedrift } } }
                    )}
                    className="text-left rounded-xl border bg-card hover:bg-primary/5 hover:border-primary/30 transition-all p-4 group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Building2 className="h-4 w-4 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-sm truncate">{b.bedrift}</div>
                          {(b.kommune || b.fylke) && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                              <MapPin className="h-3 w-3 flex-shrink-0" />
                              {b.kommune || b.fylke}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-muted-foreground">
                          {fmt(b.stillinger)} stillinger
                        </span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── 7. LIGNENDE YRKER ────────────────────────── */}
          {lignende.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Andre yrker i {yrke.under_sektor || yrke.sektor}</h2>
                {yrke.sektor && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/sektor/${sektorSlug(yrke.sektor!)}`)}
                    className="text-primary"
                  >
                    Se alle <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {lignende.map((l) => (
                  <button
                    key={l.uno_id}
                    onClick={() => navigate(`/yrke/${l.uno_id}`)}
                    className="text-left rounded-xl border bg-card hover:bg-primary/5 hover:border-primary/30 transition-all p-4 group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-medium text-sm leading-tight mb-1 line-clamp-2">
                          {l.tittel}
                        </div>
                        {l.ledighetsrate != null && (
                          <div className="text-xs text-muted-foreground">
                            Ledighet: {(Number(l.ledighetsrate) * 100).toFixed(1)}%
                          </div>
                        )}
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary flex-shrink-0 mt-0.5 transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
};

export default YrkePage;
