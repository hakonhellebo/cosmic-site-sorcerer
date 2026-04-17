import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, GraduationCap, Building2, TrendingUp, Users,
  Briefcase, MapPin, ChevronRight, Sparkles, BookOpen,
} from "lucide-react";
import { supabase } from '@/lib/supabase';

// ─── Typer ───────────────────────────────────────────────
interface Studie {
  studie_navn: string;
  sektor?: string;
  under_sektor?: string;
  institusjoner?: string;
  antall_inst?: number;
  nus_koder?: string;
  opptakspoeng?: number;
  beskrivelse?: string;
  ai_generert?: boolean;
}

interface LinketYrke {
  uno_id: string;
  tittel: string;
  sektor?: string;
  under_sektor?: string;
  ledighetsrate?: number;
  gjennomsnitt_lonn?: number;
}

interface RelatertStudie {
  studie_navn: string;
  antall_inst?: number;
  opptakspoeng?: number;
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
const StudiePage = () => {
  const { navn } = useParams<{ navn: string }>();
  const navigate = useNavigate();

  const [studie, setStudie] = useState<Studie | null>(null);
  const [yrker, setYrker] = useState<LinketYrke[]>([]);
  const [relaterte, setRelaterte] = useState<RelatertStudie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navn) return;
    const decoded = decodeURIComponent(navn);

    const hent = async () => {
      setLoading(true);

      // 1. Hent studie
      const { data: s } = await supabase
        .from('studier')
        .select('*')
        .eq('studie_navn', decoded)
        .maybeSingle();

      if (!s) { setLoading(false); return; }
      setStudie(s);

      // 2. Hent yrker som linker til dette studiet
      const { data: ysData } = await supabase
        .from('yrke_studier')
        .select('uno_id, rang')
        .eq('studie_navn', decoded)
        .order('rang', { ascending: true })
        .limit(20);

      if (ysData && ysData.length > 0) {
        const unoIds = ysData.map(y => y.uno_id);
        const { data: yrkeInfo } = await supabase
          .from('yrker')
          .select('uno_id, tittel, sektor, under_sektor, ledighetsrate, gjennomsnitt_lonn')
          .in('uno_id', unoIds);
        const info = new Map((yrkeInfo || []).map(y => [y.uno_id, y]));
        const ordnet = ysData
          .map(y => info.get(y.uno_id))
          .filter((y): y is LinketYrke => !!y);
        setYrker(ordnet.slice(0, 12));
      }

      // 3. Relaterte studier i samme under_sektor
      if (s.under_sektor) {
        const { data: rel } = await supabase
          .from('studier')
          .select('studie_navn, antall_inst, opptakspoeng')
          .eq('under_sektor', s.under_sektor)
          .neq('studie_navn', decoded)
          .limit(8);
        setRelaterte(rel || []);
      }

      setLoading(false);
    };

    hent();
  }, [navn]);

  // ── Guards ────────────────────────────────────────────
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

  // ── Derived ───────────────────────────────────────────
  const institusjonsListe = studie.institusjoner
    ? studie.institusjoner.split(',').map(i => i.trim()).filter(Boolean)
    : [];

  return (
    <Layout>
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8 pt-24 max-w-5xl">

          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 -ml-2">
            <ArrowLeft className="mr-2 h-4 w-4" /> Tilbake
          </Button>

          {/* ── 1. HERO ──────────────────────────────────── */}
          <div className="rounded-2xl bg-gradient-to-br from-violet-500/10 via-background to-primary/5 border border-violet-400/20 p-8 mb-8">
            <div className="flex items-start gap-6 flex-wrap">
              <div className="w-16 h-16 rounded-xl bg-violet-500/10 border border-violet-400/20 flex items-center justify-center flex-shrink-0">
                <GraduationCap className="h-8 w-8 text-violet-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl font-bold mb-2">{studie.studie_navn}</h1>
                <div className="flex flex-wrap gap-2">
                  {studie.sektor && (
                    <button onClick={() => navigate(`/sektor/${sektorSlug(studie.sektor!)}`)}>
                      <Badge className="bg-primary/15 text-primary border-primary/30 hover:bg-primary/25 cursor-pointer">
                        {studie.sektor}
                      </Badge>
                    </button>
                  )}
                  {studie.under_sektor && <Badge variant="secondary">{studie.under_sektor}</Badge>}
                  {studie.ai_generert && (
                    <span className="flex items-center gap-1 text-xs text-violet-600 ml-1">
                      <Sparkles className="h-3 w-3" />AI-beskrivelse
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── 2. BESKRIVELSE ───────────────────────────── */}
          {studie.beskrivelse && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Om studiet</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {studie.beskrivelse}
              </p>
            </div>
          )}

          {/* ── 3. NØKKELTALL ────────────────────────────── */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Nøkkeltall</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <StatCard
                icon={Building2}
                label="Institusjoner"
                value={studie.antall_inst ?? '—'}
                sub={studie.antall_inst ? 'tilbyr studiet' : undefined}
              />
              <StatCard
                icon={TrendingUp}
                label="Opptakspoeng"
                value={studie.opptakspoeng != null ? fmt(studie.opptakspoeng) : '—'}
                sub={studie.opptakspoeng != null ? 'gjennomsnitt' : undefined}
              />
              <StatCard
                icon={Briefcase}
                label="Relevante yrker"
                value={yrker.length || '—'}
                sub={yrker.length ? 'kan lede til' : undefined}
              />
            </div>
          </div>

          {/* ── 4. INSTITUSJONER ─────────────────────────── */}
          {institusjonsListe.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-1">Lærested</h2>
              <p className="text-sm text-muted-foreground mb-4">
                {institusjonsListe.length} institusjon{institusjonsListe.length === 1 ? '' : 'er'} tilbyr dette studiet
              </p>
              <div className="flex flex-wrap gap-2">
                {institusjonsListe.map((inst) => (
                  <span
                    key={inst}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg border bg-card text-sm font-medium"
                  >
                    <MapPin className="h-3.5 w-3.5 text-violet-600" />
                    {inst}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ── 5. YRKER STUDIET LEDER TIL ───────────────── */}
          {yrker.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-1">Yrker du kan ende opp i</h2>
              <p className="text-sm text-muted-foreground mb-4">
                De vanligste yrkene blant personer med denne utdanningen
              </p>
              <div className="grid md:grid-cols-2 gap-3">
                {yrker.map((y) => (
                  <button
                    key={y.uno_id}
                    onClick={() => navigate(`/yrke/${y.uno_id}`)}
                    className="text-left rounded-xl border bg-card hover:bg-primary/5 hover:border-primary/30 transition-all p-4 group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Briefcase className="h-4 w-4 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-sm leading-tight mb-1">{y.tittel}</div>
                          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                            {y.gjennomsnitt_lonn ? (
                              <span>{fmt(y.gjennomsnitt_lonn)} kr/mnd</span>
                            ) : null}
                            {y.ledighetsrate != null ? (
                              <span>· Ledighet {(Number(y.ledighetsrate) * 100).toFixed(1)}%</span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary flex-shrink-0 mt-0.5 transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── 6. RELATERTE STUDIER ─────────────────────── */}
          {relaterte.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                Relaterte studier i {studie.under_sektor}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {relaterte.map((r) => (
                  <button
                    key={r.studie_navn}
                    onClick={() => navigate(`/studie/${encodeURIComponent(r.studie_navn)}`)}
                    className="text-left rounded-xl border bg-card hover:bg-violet-500/5 hover:border-violet-400/50 transition-all p-4 group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-medium text-sm leading-tight mb-1 line-clamp-2">
                          {r.studie_navn}
                        </div>
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
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
};

export default StudiePage;
