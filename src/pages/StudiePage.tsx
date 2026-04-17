import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, GraduationCap, Building2, TrendingUp,
  Briefcase, MapPin, ChevronRight, Sparkles, ExternalLink,
} from "lucide-react";
import { supabase } from '@/lib/supabase';

interface Studie {
  studie_navn: string;
  sektor?: string;
  under_sektor?: string;
  institusjoner?: string;
  antall_inst?: number;
  nus_koder?: string;
  opptakspoeng?: number;
  studiekoder?: string;
  studieplasser?: number;
  sokere_mott?: number;
  sokere_kvalifisert?: number;
  beskrivelse?: string;
  ai_generert?: boolean;
}

interface LinketYrke {
  uno_id: string;
  tittel: string;
  sektor?: string;
  ledighetsrate?: number;
  gjennomsnitt_lonn?: number;
}

interface SektorAndel {
  sektor: string;
  antall: number;
  prosent: number;
}

interface RelatertStudie {
  studie_navn: string;
  antall_inst?: number;
  opptakspoeng?: number;
}

interface StudieInst {
  institusjon: string;
  studiested?: string;
  studiekode?: string;
  opptakspoeng?: number;
  studieplasser?: number;
  sokere_mott?: number;
  sokere_kvalifisert?: number;
}

const fmt = (n?: number | null) => n != null ? n.toLocaleString('nb-NO') : null;
const sektorSlug = (sektor: string) =>
  encodeURIComponent(sektor.toLowerCase().replace(/\s+/g, '-').replace(/[æ]/g, 'ae').replace(/[ø]/g, 'o').replace(/[å]/g, 'a'));

const StudiePage = () => {
  const { navn } = useParams<{ navn: string }>();
  const navigate = useNavigate();

  const [studie, setStudie] = useState<Studie | null>(null);
  const [yrker, setYrker] = useState<LinketYrke[]>([]);
  const [sektorFordeling, setSektorFordeling] = useState<SektorAndel[]>([]);
  const [relaterte, setRelaterte] = useState<RelatertStudie[]>([]);
  const [instListe, setInstListe] = useState<StudieInst[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navn) return;
    const decoded = decodeURIComponent(navn);
    const hent = async () => {
      setLoading(true);

      const { data: s } = await supabase
        .from('studier').select('*').eq('studie_navn', decoded).maybeSingle();
      if (!s) { setLoading(false); return; }
      setStudie(s);

      // Hent ALLE yrke_studier (for fordeling), men vis bare topp 12
      const { data: ysData } = await supabase
        .from('yrke_studier')
        .select('uno_id, rang')
        .eq('studie_navn', decoded)
        .order('rang', { ascending: true })
        .limit(100);

      if (ysData?.length) {
        const unoIds = ysData.map(y => y.uno_id);
        const { data: yrkeInfo } = await supabase
          .from('yrker')
          .select('uno_id, tittel, sektor, ledighetsrate, gjennomsnitt_lonn')
          .in('uno_id', unoIds);
        const info = new Map((yrkeInfo || []).map(y => [y.uno_id, y]));
        const alleYrker = ysData.map(y => info.get(y.uno_id)).filter((y): y is LinketYrke => !!y);
        setYrker(alleYrker.slice(0, 12));

        // Sektor-fordeling
        const teller: Record<string, number> = {};
        for (const y of alleYrker) {
          if (y.sektor) teller[y.sektor] = (teller[y.sektor] || 0) + 1;
        }
        const total = Object.values(teller).reduce((a, b) => a + b, 0);
        const fordeling = Object.entries(teller)
          .map(([sektor, antall]) => ({ sektor, antall, prosent: Math.round((antall / total) * 100) }))
          .sort((a, b) => b.antall - a.antall);
        setSektorFordeling(fordeling);
      }

      if (s.under_sektor) {
        const { data: rel } = await supabase
          .from('studier')
          .select('studie_navn, antall_inst, opptakspoeng')
          .eq('under_sektor', s.under_sektor)
          .neq('studie_navn', decoded)
          .limit(8);
        setRelaterte(rel || []);
      }

      // Per-lærested data
      const { data: instData } = await supabase
        .from('studie_institusjoner')
        .select('institusjon, studiested, studiekode, opptakspoeng, studieplasser, sokere_mott, sokere_kvalifisert')
        .eq('studie_navn', decoded)
        .order('opptakspoeng', { ascending: false, nullsFirst: false });
      setInstListe(instData || []);

      setLoading(false);
    };
    hent();
  }, [navn]);

  if (loading) return (
    <Layout>
      <div className="container mx-auto py-20 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto mb-4" />
        <p className="text-muted-foreground">Henter studiedata…</p>
      </div>
    </Layout>
  );

  if (!studie) return (
    <Layout>
      <div className="container mx-auto py-20 text-center max-w-lg">
        <h1 className="text-3xl font-bold mb-4">Studie ikke funnet</h1>
        <Button onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Tilbake
        </Button>
      </div>
    </Layout>
  );

  const institusjonsListe = studie.institusjoner
    ? studie.institusjoner.split(',').map(i => i.trim()).filter(Boolean) : [];
  const førstekode = studie.studiekoder?.split(',')[0]?.trim();

  const ratio = studie.sokere_kvalifisert && studie.studieplasser
    ? studie.sokere_kvalifisert / studie.studieplasser : null;
  let niv = "Lav", fargekl = "bg-green-100 text-green-800";
  if (ratio != null) {
    if (ratio > 20)      { niv = "Ekstremt høy"; fargekl = "bg-red-100 text-red-800"; }
    else if (ratio > 15) { niv = "Veldig høy";   fargekl = "bg-red-100 text-red-800"; }
    else if (ratio > 10) { niv = "Høy";          fargekl = "bg-orange-100 text-orange-800"; }
    else if (ratio > 5)  { niv = "Moderat";      fargekl = "bg-yellow-100 text-yellow-800"; }
  }

  return (
    <Layout>
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8 pt-24 max-w-5xl">

          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 -ml-2">
            <ArrowLeft className="mr-2 h-4 w-4" /> Tilbake
          </Button>

          {/* ── 1. HERO ──────────────────────────────────── */}
          <Card className="border-l-4 border-l-primary mb-6">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start gap-4">
                <div className="min-w-0 flex-1">
                  <h1 className="text-3xl font-bold mb-2">{studie.studie_navn}</h1>
                  {institusjonsListe.length > 0 && (
                    <p className="text-muted-foreground mb-3">{institusjonsListe.slice(0,3).join(', ')}{institusjonsListe.length > 3 ? ` og ${institusjonsListe.length - 3} til` : ''}</p>
                  )}
                  <div className="flex flex-wrap gap-3 text-sm">
                    {førstekode && <span className="text-muted-foreground">Studiekode: <span className="font-medium text-foreground">{førstekode}</span></span>}
                    {studie.sektor && (
                      <button onClick={() => navigate(`/sektor/${sektorSlug(studie.sektor!)}`)}>
                        <Badge className="bg-primary/15 text-primary border-primary/30 hover:bg-primary/25 cursor-pointer">
                          {studie.sektor}
                        </Badge>
                      </button>
                    )}
                    {studie.under_sektor && <Badge variant="secondary">{studie.under_sektor}</Badge>}
                  </div>
                </div>
                {studie.opptakspoeng != null && studie.opptakspoeng > 0 && (
                  <div className="rounded-full bg-primary/10 px-4 py-2 font-semibold text-primary flex items-center gap-2 flex-shrink-0">
                    <GraduationCap className="h-5 w-5" />
                    <span className="text-lg">{studie.opptakspoeng}</span>
                  </div>
                )}
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Karaktersnitt</div>
                  <div className="font-semibold text-lg">{studie.opptakspoeng ?? '—'}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Studieplasser</div>
                  <div className="font-semibold text-lg">{studie.studieplasser ?? '—'}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Søkere møtt</div>
                  <div className="font-semibold text-lg">{studie.sokere_mott ?? '—'}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Konkurransenivå</div>
                  {ratio != null ? (
                    <div className={`text-xs px-2 py-0.5 rounded-full w-fit ${fargekl} font-medium`}>{niv}</div>
                  ) : <span className="text-muted-foreground">—</span>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ── 2. DETALJERTE SØKERSTATISTIKKER ──────────── */}
          {(studie.sokere_kvalifisert || studie.sokere_mott || studie.studieplasser) && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Detaljerte søkerstatistikker</CardTitle>
                <CardDescription>Oversikt over søkertall og opptaksstatistikk</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {studie.sokere_kvalifisert != null && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Kvalifiserte søkere:</span>
                      <span className="font-medium">{fmt(studie.sokere_kvalifisert)}</span>
                    </div>
                  )}
                  {studie.studieplasser != null && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Studieplasser:</span>
                      <span className="font-medium">{fmt(studie.studieplasser)}</span>
                    </div>
                  )}
                  {studie.sokere_mott != null && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Søkere som møtte:</span>
                      <span className="font-medium">{fmt(studie.sokere_mott)}</span>
                    </div>
                  )}
                  {ratio != null && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Søkere per studieplass:</span>
                      <span className="font-medium">{ratio.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* ── 3. OM STUDIET ────────────────────────────── */}
          {studie.beskrivelse && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Om studiet
                  {studie.ai_generert && (
                    <span className="flex items-center gap-1 text-xs text-violet-600 font-normal">
                      <Sparkles className="h-3 w-3" />AI
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {studie.beskrivelse}
                </p>
                <Button variant="outline" size="sm" className="mt-4" asChild>
                  <a
                    href={`https://www.samordnaopptak.no/info/soeking/soeke-studier/finn-studier/?search=${encodeURIComponent(studie.studie_navn)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Les mer på Samordna opptak
                  </a>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* ── 4. LÆRESTED MED STATISTIKK ──────────────── */}
          {(instListe.length > 0 || institusjonsListe.length > 0) && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Lærested ({instListe.length || institusjonsListe.length})
                </CardTitle>
                <CardDescription>Klikk på et lærested for å se detaljert statistikk</CardDescription>
              </CardHeader>
              <CardContent>
                {instListe.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-3">
                    {instListe.map((inst, idx) => {
                      const ratio = inst.sokere_kvalifisert && inst.studieplasser
                        ? inst.sokere_kvalifisert / inst.studieplasser : null;
                      let niv = '', fargekl = '';
                      if (ratio != null) {
                        if (ratio > 20)      { niv = 'Ekstremt høy'; fargekl = 'bg-red-100 text-red-800'; }
                        else if (ratio > 15) { niv = 'Veldig høy';   fargekl = 'bg-red-100 text-red-800'; }
                        else if (ratio > 10) { niv = 'Høy';          fargekl = 'bg-orange-100 text-orange-800'; }
                        else if (ratio > 5)  { niv = 'Moderat';      fargekl = 'bg-yellow-100 text-yellow-800'; }
                        else                 { niv = 'Lav';          fargekl = 'bg-green-100 text-green-800'; }
                      }
                      return (
                        <button
                          key={`${inst.institusjon}-${inst.studiekode}-${idx}`}
                          onClick={() => navigate(
                            `/studie/${encodeURIComponent(studie.studie_navn)}/${encodeURIComponent(inst.institusjon)}${inst.studiekode ? `?kode=${encodeURIComponent(inst.studiekode)}` : ''}`
                          )}
                          className="text-left rounded-xl border bg-card hover:bg-violet-500/5 hover:border-violet-400/50 transition-all p-4 group"
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="min-w-0 flex-1">
                              <div className="font-medium text-sm mb-0.5">{inst.institusjon}</div>
                              <div className="text-xs text-muted-foreground flex flex-wrap gap-x-2">
                                {inst.studiested && <span>{inst.studiested}</span>}
                                {inst.studiekode && <span>· Kode {inst.studiekode}</span>}
                              </div>
                            </div>
                            {inst.opptakspoeng != null && inst.opptakspoeng > 0 && (
                              <div className="rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary text-xs flex items-center gap-1 flex-shrink-0">
                                <GraduationCap className="h-3 w-3" />
                                {inst.opptakspoeng}
                              </div>
                            )}
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div>
                              <div className="text-muted-foreground">Plasser</div>
                              <div className="font-medium">{inst.studieplasser ?? '—'}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Møtt</div>
                              <div className="font-medium">{inst.sokere_mott ?? '—'}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Konkurranse</div>
                              {niv ? (
                                <div className={`text-[10px] px-1.5 py-0.5 rounded w-fit ${fargekl} font-medium`}>{niv}</div>
                              ) : '—'}
                            </div>
                          </div>
                          <div className="flex justify-end mt-2">
                            <span className="text-xs text-primary flex items-center gap-1">
                              Se detaljer <ChevronRight className="h-3 w-3" />
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {institusjonsListe.map((inst) => (
                      <span key={inst} className="flex items-center gap-1.5 px-3 py-2 rounded-lg border bg-card text-sm font-medium">
                        <MapPin className="h-3.5 w-3.5 text-violet-600" />
                        {inst}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* ── 4b. BRANSJEFORDELING ─────────────────────── */}
          {sektorFordeling.length > 1 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Hvor jobber folk med denne utdanningen?</CardTitle>
                <CardDescription>
                  {studie.studie_navn} gir jobbmuligheter i mange bransjer — ikke bare i{' '}
                  {studie.sektor && <span className="font-medium">{studie.sektor}</span>}.
                  Her er hvordan sysselsatte med denne utdanningen fordeler seg.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sektorFordeling.slice(0, 8).map((f) => (
                    <div key={f.sektor}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className={f.sektor === studie.sektor ? 'font-semibold text-primary' : ''}>
                          {f.sektor}
                        </span>
                        <span className="text-muted-foreground">{f.prosent}% ({f.antall})</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${f.sektor === studie.sektor ? 'bg-primary' : 'bg-violet-400/60'}`}
                          style={{ width: `${Math.max(f.prosent, 2)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* ── 5. YRKER STUDIET LEDER TIL ───────────────── */}
          {yrker.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Yrker du kan ende opp i
                </CardTitle>
                <CardDescription>De vanligste yrkene blant personer med denne utdanningen</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-3">
                  {yrker.map((y) => (
                    <button
                      key={y.uno_id}
                      onClick={() => navigate(`/yrke/${y.uno_id}`)}
                      className="text-left rounded-xl border bg-card hover:bg-primary/5 hover:border-primary/30 transition-all p-4 group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="font-medium text-sm leading-tight mb-1">{y.tittel}</div>
                          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                            {y.gjennomsnitt_lonn ? <span>{fmt(y.gjennomsnitt_lonn)} kr/mnd</span> : null}
                            {y.ledighetsrate != null ? <span>· Ledighet {(Number(y.ledighetsrate) * 100).toFixed(1)}%</span> : null}
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary flex-shrink-0 mt-0.5 transition-colors" />
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* ── 6. RELATERTE STUDIER ─────────────────────── */}
          {relaterte.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Relaterte studier i {studie.under_sektor}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {relaterte.map((r) => (
                    <button
                      key={r.studie_navn}
                      onClick={() => navigate(`/studie/${encodeURIComponent(r.studie_navn)}`)}
                      className="text-left rounded-xl border bg-card hover:bg-violet-500/5 hover:border-violet-400/50 transition-all p-4 group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="font-medium text-sm leading-tight mb-1 line-clamp-2">{r.studie_navn}</div>
                          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                            {r.antall_inst ? <span>{r.antall_inst} inst.</span> : null}
                            {r.opptakspoeng ? <span>· {r.opptakspoeng} poeng</span> : null}
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-violet-600 flex-shrink-0 mt-0.5 transition-colors" />
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </Layout>
  );
};

export default StudiePage;
