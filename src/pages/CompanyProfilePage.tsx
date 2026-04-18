import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, ExternalLink, Building2, Users, TrendingUp, MapPin,
  GraduationCap, Briefcase, BarChart3, Calendar, Sparkles, Globe,
  ChevronRight, ArrowUpRight, BookOpen,
} from "lucide-react";
import { supabase } from '@/lib/supabase';
import FeedbackButton from '@/components/FeedbackButton';

// ─── Typer ───────────────────────────────────────────────
interface Company {
  Selskap: string;
  Sektor?: string;
  Hovedbransje?: string;
  sub_sektor?: string;
  Beskrivelse?: string;
  ai_beskrivelse?: string;
  Lokasjon?: string;
  Geografi?: string;
  Ansatte?: string;
  antall_ansatte_tall?: number;
  'Driftsinntekter (MNOK)'?: string;
  driftsresultat_mnok?: number;
  regnskapsaar?: number;
  // Brreg-data (rå tall, kroner)
  driftsinntekter?: number;
  driftsresultat?: number;
  aarsresultat?: number;
  sum_eiendeler?: number;
  sum_egenkapital?: number;
  sum_gjeld?: number;
  valuta?: string;
  brreg_oppdatert?: string;
  Linker?: string;
  Karriereportal?: string;
  organisasjonsnummer?: string;
  stiftelsesaar?: number;
  nace_kode?: string;
  nace_beskrivelse?: string;
  ansetter_til_yrker?: string;
  ansetter_fra_studier?: string;
}

interface YrkeRad {
  uno_id: string;
  tittel: string;
  stillinger: number;
  prosent?: number;
  beskrivelse?: string;
}

interface LignendeCompany {
  Selskap: string;
  Sektor?: string;
  sub_sektor?: string;
  Lokasjon?: string;
}

// ─── Helpers ─────────────────────────────────────────────
const fmt = (n?: number | null) =>
  n != null ? n.toLocaleString('nb-NO') : null;

const StatCard = ({
  icon: Icon, label, value, sub, color = '',
}: {
  icon: any; label: string; value: string | null; sub?: string; color?: string;
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
const CompanyProfilePage = () => {
  const { companySlug } = useParams();
  const navigate        = useNavigate();
  const location        = useLocation();

  const [company,  setCompany]  = useState<Company | null>(null);
  const [yrker,    setYrker]    = useState<YrkeRad[]>([]);
  const [lignende, setLignende] = useState<LignendeCompany[]>([]);
  const [loading,  setLoading]  = useState(true);

  const sourceCareer = location.state?.sourceCareer;

  useEffect(() => {
    const hent = async () => {
      setLoading(true);

      // 1. Firmadata — alltid hent full rad fra DB (state kan mangle Brreg-felter)
      let firmadata: Company | null = null;
      const stateCompany: Company | null = location.state?.company ?? null;
      const sokeNavn = stateCompany?.Selskap
        || (companySlug ? decodeURIComponent(companySlug).replace(/-/g, ' ') : null);

      if (sokeNavn) {
        // Først: prøv eksakt match på Selskap
        const { data: exact } = await supabase
          .from('Bedrifter_ny').select('*')
          .eq('Selskap', sokeNavn)
          .limit(1);
        firmadata = exact?.[0] ?? null;

        // Fallback: ilike-søk
        if (!firmadata) {
          const { data } = await supabase
            .from('Bedrifter_ny').select('*')
            .ilike('Selskap', `%${sokeNavn}%`)
            .limit(1);
          firmadata = data?.[0] ?? null;
        }
      }
      // Siste fallback: bruk state direkte (sjelden)
      if (!firmadata && stateCompany) firmadata = stateCompany;
      setCompany(firmadata);

      if (firmadata) {
        const navn     = firmadata.Selskap;
        const sokeord  = navn.split(' ')[0]; // første ord — "DNB", "EQUINOR" osv.

        // 2. Yrker — hent alle treff på bedriftsnavn, grupper og summer
        const { data: yrkeRader } = await supabase
          .from('yrke_bedrifter')
          .select('uno_id, stillinger')
          .ilike('bedrift', `%${sokeord}%`)
          .order('stillinger', { ascending: false })
          .limit(200);

        if (yrkeRader && yrkeRader.length > 0) {
          // Summer per uno_id
          const sum: Record<string, number> = {};
          for (const r of yrkeRader) {
            sum[r.uno_id] = (sum[r.uno_id] || 0) + r.stillinger;
          }
          const sortert = Object.entries(sum)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10);
          const total = sortert.reduce((s, [, n]) => s + n, 0);

          // Hent navn og beskrivelse fra yrker-tabellen
          const unoIds = sortert.map(([id]) => id);
          const { data: yrkeDet } = await supabase
            .from('yrker')
            .select('uno_id, tittel, beskrivelse')
            .in('uno_id', unoIds);

          const detMap: Record<string, { tittel: string; beskrivelse?: string }> = {};
          for (const y of (yrkeDet || [])) detMap[y.uno_id] = y;

          setYrker(sortert.map(([uid, ant]) => ({
            uno_id:     uid,
            tittel:     detMap[uid]?.tittel || uid,
            beskrivelse:detMap[uid]?.beskrivelse,
            stillinger: ant,
            prosent:    total > 0 ? Math.round(ant / total * 100) : undefined,
          })));
        }

        // 3. Lignende bedrifter
        if (firmadata.Sektor) {
          const { data: lig } = await supabase
            .from('Bedrifter_ny')
            .select('Selskap, Sektor, sub_sektor, Lokasjon')
            .eq('Sektor', firmadata.Sektor)
            .neq('Selskap', navn)
            .limit(6);
          setLignende(lig || []);
        }
      }

      setLoading(false);
    };
    hent();
  }, [companySlug, location.state]);

  // ── Guards ────────────────────────────────────────────
  if (loading) return (
    <Layout>
      <div className="container mx-auto py-20 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Henter bedriftsinformasjon…</p>
      </div>
    </Layout>
  );

  if (!company) return (
    <Layout>
      <div className="container mx-auto py-20 text-center max-w-lg">
        <h1 className="text-3xl font-bold mb-4">Bedrift ikke funnet</h1>
        <Button onClick={() => navigate('/statistikk')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Tilbake
        </Button>
      </div>
    </Layout>
  );

  // ── Derived ───────────────────────────────────────────
  const beskrivelse    = company.ai_beskrivelse || company.Beskrivelse;
  const ansatte        = company.antall_ansatte_tall
    ? fmt(company.antall_ansatte_tall) : company.Ansatte;
  // Format beløp: store tall som mrd/mill, prioriter nye Brreg-tall
  const valuta = company.valuta || 'NOK';
  const formatBeloep = (n?: number | null): string | null => {
    if (n == null) return null;
    const abs = Math.abs(n);
    if (abs >= 1e9) return `${(n/1e9).toFixed(1)} mrd ${valuta}`;
    if (abs >= 1e6) return `${(n/1e6).toFixed(0)} mill ${valuta}`;
    return `${n.toLocaleString('nb-NO')} ${valuta}`;
  };
  // Fallback til gamle MNOK-tall hvis Brreg mangler
  const omsetningStr = company.driftsinntekter != null
    ? formatBeloep(company.driftsinntekter)
    : (company['Driftsinntekter (MNOK)'] ? `${company['Driftsinntekter (MNOK)']} MNOK` : null);
  const driftsresVal = company.driftsresultat ?? (company.driftsresultat_mnok != null ? company.driftsresultat_mnok * 1e6 : null);
  const driftsresStr = driftsresVal != null ? formatBeloep(driftsresVal) : null;
  const drFarge = driftsresVal != null
    ? driftsresVal >= 0 ? 'text-green-600' : 'text-red-500' : '';
  const aarsresultatStr = formatBeloep(company.aarsresultat);
  const egenkapitalStr = formatBeloep(company.sum_egenkapital);
  const studierListe   = (company.ansetter_fra_studier || '')
    .split(',').map(s => s.trim()).filter(Boolean);

  return (
    <Layout>
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8 pt-24 max-w-5xl">

          <div className="flex items-center justify-between mb-6 -ml-2">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {sourceCareer ? `Tilbake til ${sourceCareer.Yrkesnavn}` : 'Tilbake'}
            </Button>
            {company?.Selskap && (
              <FeedbackButton type="bedrift" entityId={company.Selskap} entityLabel={company.Selskap} />
            )}
          </div>

          {/* ── 1. HERO ──────────────────────────────────── */}
          <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-background to-violet-500/5 border border-primary/20 p-8 mb-8">
            <div className="flex items-start gap-6 flex-wrap">

              <div className="w-16 h-16 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                <Building2 className="h-8 w-8 text-primary" />
              </div>

              <div className="flex-1 min-w-0">
                <h1 className="text-3xl font-bold mb-1">{company.Selskap}</h1>

                {company.nace_beskrivelse && (
                  <p className="text-muted-foreground mb-4">
                    {company.nace_beskrivelse}
                    {company.Lokasjon ? ` · Hovedkontor i ${company.Lokasjon}` : ''}
                  </p>
                )}

                <div className="flex flex-wrap gap-2 mb-5">
                  {company.Sektor && (
                    <Badge className="bg-primary/15 text-primary border-primary/30">
                      {company.Sektor}
                    </Badge>
                  )}
                  {company.sub_sektor && <Badge variant="secondary">{company.sub_sektor}</Badge>}
                  {ansatte && (
                    <Badge variant="outline">
                      <Users className="h-3 w-3 mr-1" />{ansatte} ansatte
                    </Badge>
                  )}
                  {company.Lokasjon && (
                    <Badge variant="outline">
                      <MapPin className="h-3 w-3 mr-1" />{company.Lokasjon}
                    </Badge>
                  )}
                  {company.stiftelsesaar && (
                    <Badge variant="outline">
                      <Calendar className="h-3 w-3 mr-1" />Est. {company.stiftelsesaar}
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {company.Karriereportal && (
                    <Button asChild size="sm">
                      <a href={company.Karriereportal} target="_blank" rel="noopener noreferrer">
                        <Briefcase className="mr-2 h-4 w-4" />Se ledige stillinger
                      </a>
                    </Button>
                  )}
                  {company.Linker && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={company.Linker} target="_blank" rel="noopener noreferrer">
                        <Globe className="mr-2 h-4 w-4" />Besøk nettside
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── 2. OM SELSKAPET ──────────────────────────── */}
          {beskrivelse && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-xl font-semibold">Om selskapet</h2>
                {company.ai_beskrivelse && (
                  <span className="flex items-center gap-1 text-xs text-violet-600">
                    <Sparkles className="h-3 w-3" />AI-generert
                  </span>
                )}
              </div>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {beskrivelse}
              </p>
              {(company.Linker || company.organisasjonsnummer) && (
                <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
                  {company.organisasjonsnummer && (
                    <span>Org.nr. {company.organisasjonsnummer}</span>
                  )}
                  {company.Linker && (
                    <a href={company.Linker} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-primary transition-colors">
                      <ExternalLink className="h-3.5 w-3.5" />Nettside
                    </a>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── 3. NØKKELTALL ────────────────────────────── */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-1">Nøkkeltall</h2>
            {company.regnskapsaar && (
              <p className="text-xs text-muted-foreground mb-4">
                Regnskapstall fra Brønnøysundregistrene · {company.regnskapsaar}
              </p>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon={Users}      label="Ansatte"
                value={ansatte || null}
                sub={company.Geografi || company.Lokasjon || undefined} />
              <StatCard icon={TrendingUp} label="Driftsinntekter"
                value={omsetningStr} />
              <StatCard icon={BarChart3}  label="Driftsresultat"
                value={driftsresStr}
                color={drFarge} />
              <StatCard icon={BarChart3}  label="Årsresultat"
                value={aarsresultatStr}
                color={company.aarsresultat != null ? (company.aarsresultat >= 0 ? 'text-green-600' : 'text-red-500') : ''} />
            </div>
            {(company.sum_eiendeler || company.sum_egenkapital) && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                <StatCard icon={BarChart3}  label="Sum eiendeler"
                  value={formatBeloep(company.sum_eiendeler)} />
                <StatCard icon={BarChart3}  label="Egenkapital"
                  value={egenkapitalStr} />
                <StatCard icon={BarChart3}  label="Sum gjeld"
                  value={formatBeloep(company.sum_gjeld)} />
                <StatCard icon={MapPin}     label="Stiftet"
                  value={company.stiftelsesaar?.toString() || null} />
              </div>
            )}
          </div>

          {/* ── 4. YRKER I BEDRIFTEN ─────────────────────── */}
          {yrker.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-1">Hvilke yrker finnes i denne bedriften?</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Basert på faktiske stillingsdata fra Utdanning.no
              </p>
              <div className="space-y-2">
                {yrker.map((y) => (
                  <button
                    key={y.uno_id}
                    onClick={() => navigate(`/yrke/${y.uno_id}`)}
                    className="w-full text-left rounded-xl border bg-card hover:bg-primary/5 hover:border-primary/30 transition-all p-4 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 text-right flex-shrink-0">
                        <span className="text-lg font-bold text-primary">
                          {y.prosent != null ? `${y.prosent}%` : '—'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="font-medium">{y.tittel}</span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary/60 rounded-full transition-all"
                            style={{ width: `${Math.min(y.prosent || 0, 100)}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground flex-shrink-0">
                        {fmt(y.stillinger)} stillinger
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── 5. STUDIEBAKGRUNN ────────────────────────── */}
          {studierListe.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-1">Vanligste utdanningsbakgrunner</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Studier som er vanlige blant ansatte her
              </p>
              <div className="flex flex-wrap gap-2">
                {studierListe.map((s) => (
                  <button
                    key={s}
                    onClick={() => navigate(`/studie/${encodeURIComponent(s)}`)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg border bg-card hover:bg-violet-500/5 hover:border-violet-500/30 transition-all text-sm font-medium"
                  >
                    <BookOpen className="h-3.5 w-3.5 text-violet-600" />
                    {s}
                    <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── 6. HVORDAN FÅ JOBB HER ───────────────────── */}
          <div className="mb-8 rounded-2xl border bg-gradient-to-br from-violet-500/5 to-background p-6">
            <h2 className="text-xl font-semibold mb-5">Hvordan få jobb her</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  nivå: '🏫 VGS-elev',
                  steg: [
                    'Velg riktige programfag tidlig',
                    'Utforsk bransjen og typiske yrker',
                    'Se på relevante studier via EdPath',
                  ],
                },
                {
                  nivå: '🎓 Student',
                  steg: [
                    'Søk internship eller sommerjobb',
                    'Velg relevante fag og spesialiseringer',
                    'Delta på bedriftspresentasjoner',
                    'Bygg LinkedIn og CV',
                  ],
                },
                {
                  nivå: '💼 Jobbsøker',
                  steg: [
                    'Se hvilke roller de ansetter mest til',
                    'Match ferdighetene dine mot kravene',
                    'Fremhev relevant erfaring og kompetanse',
                    'Gå til karriereportalen',
                  ],
                },
              ].map(({ nivå, steg }) => (
                <div key={nivå}>
                  <div className="font-semibold mb-3">{nivå}</div>
                  <ul className="space-y-2">
                    {steg.map((s) => (
                      <li key={s} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-primary mt-0.5 flex-shrink-0">→</span>{s}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* ── 8. LIGNENDE BEDRIFTER ────────────────────── */}
          {lignende.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Andre selskaper som ligner</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {lignende.map((l) => (
                  <button
                    key={l.Selskap}
                    onClick={() => navigate(
                      `/bedrift/${encodeURIComponent(l.Selskap.toLowerCase().replace(/\s+/g, '-'))}`,
                      { state: { company: l } }
                    )}
                    className="text-left rounded-xl border bg-card hover:bg-primary/5 hover:border-primary/30 transition-all p-4 group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-medium text-sm leading-tight mb-1 truncate">
                          {l.Selskap}
                        </div>
                        {l.sub_sektor && (
                          <div className="text-xs text-muted-foreground truncate">{l.sub_sektor}</div>
                        )}
                        {l.Lokasjon && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <MapPin className="h-3 w-3 flex-shrink-0" />{l.Lokasjon}
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

export default CompanyProfilePage;
