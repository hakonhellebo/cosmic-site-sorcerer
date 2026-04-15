
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, ExternalLink, Building2, Users, TrendingUp, MapPin,
  GraduationCap, Briefcase, BarChart3, Calendar, Hash, Sparkles,
} from "lucide-react";
import { supabase } from '@/lib/supabase';
import RelatedCareers from '@/components/statistics/career/RelatedCareers';
import RelatedEducationsForCompany from '@/components/statistics/career/RelatedEducationsForCompany';

interface Company {
  Selskap: string;
  Sektor: string;
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
  Linker?: string;
  Karriereportal?: string;
  organisasjonsnummer?: string;
  stiftelsesaar?: number;
  nace_kode?: string;
  nace_beskrivelse?: string;
  ansetter_til_yrker?: string;
  ansetter_fra_studier?: string;
  noekkelord?: string;
}

const CompanyProfilePage = () => {
  const { companySlug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  const sourceCareer = location.state?.sourceCareer;

  const handleBackNavigation = () => {
    if (sourceCareer) {
      const careerSlug = sourceCareer.Yrkesnavn.toLowerCase().replace(/[^a-z0-9]/g, '-');
      navigate(`/karriere/${careerSlug}`, { state: { career: sourceCareer } });
    } else {
      navigate('/statistikk');
    }
  };

  useEffect(() => {
    const fetchCompanyData = async () => {
      setLoading(true);
      if (location.state?.company) {
        setCompany(location.state.company);
        setLoading(false);
        return;
      }
      if (companySlug) {
        try {
          const decodedCompanyName = decodeURIComponent(companySlug).replace(/-/g, ' ');
          const { data, error } = await supabase
            .from('Bedrifter_ny')
            .select('*')
            .ilike('Selskap', `%${decodedCompanyName}%`);
          if (!error && data && data.length > 0) {
            setCompany(data[0] as Company);
          }
        } catch (err) {
          console.error("Error:", err);
        }
      }
      setLoading(false);
    };
    fetchCompanyData();
  }, [companySlug, location.state]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
            <p>Henter bedriftsinformasjon…</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!company) {
    return (
      <Layout>
        <div className="container mx-auto py-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Bedrift ikke funnet</h1>
            <p className="text-muted-foreground mb-6">Beklager, vi kunne ikke finne informasjon om denne bedriften.</p>
            <Button onClick={handleBackNavigation}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {sourceCareer ? `Tilbake til ${sourceCareer.Yrkesnavn}` : 'Tilbake til statistikk'}
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // Derived helpers
  const beskrivelse = company.ai_beskrivelse || company.Beskrivelse;
  const ansatteVis  = company.antall_ansatte_tall
    ? company.antall_ansatte_tall.toLocaleString('nb-NO')
    : company.Ansatte;
  const omsetning   = company['Driftsinntekter (MNOK)'];
  const yrkerListe  = company.ansetter_til_yrker
    ? company.ansetter_til_yrker.split(',').map(s => s.trim()).filter(Boolean)
    : [];
  const studierListe = company.ansetter_fra_studier
    ? company.ansetter_fra_studier.split(',').map(s => s.trim()).filter(Boolean)
    : [];
  const nøkkelordListe = company.noekkelord
    ? company.noekkelord.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  const driftsresultatFarge = company.driftsresultat_mnok !== undefined && company.driftsresultat_mnok !== null
    ? company.driftsresultat_mnok >= 0
      ? 'text-green-600'
      : 'text-red-500'
    : 'text-foreground';

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-4xl mx-auto">

          <Button variant="ghost" onClick={handleBackNavigation} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {sourceCareer ? `Tilbake til ${sourceCareer.Yrkesnavn}` : 'Tilbake til statistikk'}
          </Button>

          <div className="space-y-8">

            {/* ── Header ── */}
            <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-background to-violet-500/10 border border-primary/20 p-8">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold leading-tight">{company.Selskap}</h1>
                      {company.organisasjonsnummer && (
                        <p className="text-xs text-muted-foreground mt-0.5">Org.nr. {company.organisasjonsnummer}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge className="bg-primary/15 text-primary border-primary/30 hover:bg-primary/20">
                      {company.Sektor || company.Hovedbransje}
                    </Badge>
                    {company.sub_sektor && (
                      <Badge variant="secondary">{company.sub_sektor}</Badge>
                    )}
                    {company.nace_beskrivelse && (
                      <Badge variant="outline" className="text-xs font-normal">
                        {company.nace_kode} · {company.nace_beskrivelse}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 text-sm text-muted-foreground flex-shrink-0">
                  {company.Lokasjon && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      {company.Lokasjon}
                    </div>
                  )}
                  {company.stiftelsesaar && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      Etablert {company.stiftelsesaar}
                    </div>
                  )}
                </div>
              </div>

              {/* Beskrivelse */}
              {beskrivelse && (
                <div className="mt-6 pt-6 border-t border-primary/15">
                  {company.ai_beskrivelse && (
                    <div className="flex items-center gap-1.5 mb-2">
                      <Sparkles className="h-3.5 w-3.5 text-violet-500" />
                      <span className="text-xs text-violet-600 font-medium">AI-generert beskrivelse</span>
                    </div>
                  )}
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {beskrivelse}
                  </p>
                </div>
              )}
            </div>

            {/* ── Nøkkeltall ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-5">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Users className="h-4 w-4" />
                    Ansatte
                  </div>
                  <div className="text-2xl font-bold">{ansatteVis || '—'}</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-5">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <TrendingUp className="h-4 w-4" />
                    Driftsinntekter
                  </div>
                  <div className="text-2xl font-bold">
                    {omsetning ? `${omsetning} MNOK` : '—'}
                  </div>
                  {company.regnskapsaar && (
                    <div className="text-xs text-muted-foreground mt-0.5">Årsregnskap {company.regnskapsaar}</div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-5">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <BarChart3 className="h-4 w-4" />
                    Driftsresultat
                  </div>
                  <div className={`text-2xl font-bold ${driftsresultatFarge}`}>
                    {company.driftsresultat_mnok !== undefined && company.driftsresultat_mnok !== null
                      ? `${company.driftsresultat_mnok > 0 ? '+' : ''}${company.driftsresultat_mnok} MNOK`
                      : '—'}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-5">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <MapPin className="h-4 w-4" />
                    Geografi
                  </div>
                  <div className="text-lg font-bold">{company.Geografi || company.Lokasjon || '—'}</div>
                </CardContent>
              </Card>
            </div>

            {/* ── Hvem ansetter de? ── */}
            {(yrkerListe.length > 0 || studierListe.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {yrkerListe.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-primary" />
                        Typiske stillinger
                      </CardTitle>
                      <CardDescription>Yrker denne bedriften rekrutterer til</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {yrkerListe.map((y) => (
                          <Badge key={y} variant="outline" className="text-sm py-1 px-3 bg-primary/5">
                            {y}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {studierListe.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-violet-600" />
                        Relevante utdanninger
                      </CardTitle>
                      <CardDescription>Studier som er etterspurt hos denne bedriften</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {studierListe.map((s) => (
                          <Badge key={s} variant="outline" className="text-sm py-1 px-3 bg-violet-500/5">
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* ── Nøkkelord ── */}
            {nøkkelordListe.length > 0 && (
              <div className="flex items-start gap-3">
                <Hash className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex flex-wrap gap-1.5">
                  {nøkkelordListe.map((k) => (
                    <span key={k} className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* ── Lenker ── */}
            {(company.Linker || company.Karriereportal) && (
              <Card>
                <CardHeader>
                  <CardTitle>Lenker</CardTitle>
                  <CardDescription>Utforsk bedriftens nettsider og karrieremuligheter</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-3 flex-wrap">
                    {company.Linker && (
                      <Button variant="outline" asChild>
                        <a href={company.Linker} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Nettside
                        </a>
                      </Button>
                    )}
                    {company.Karriereportal && (
                      <Button asChild>
                        <a href={company.Karriereportal} target="_blank" rel="noopener noreferrer">
                          <Users className="mr-2 h-4 w-4" />
                          Karriereportal
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

          </div>
        </div>

        {/* ── Relatert innhold ── */}
        <div className="max-w-6xl mx-auto mt-12 space-y-8">
          {(company.Sektor || company.sub_sektor) && (
            <RelatedCareers
              sector={company.Sektor || company.Hovedbransje || ''}
              subSector={company.sub_sektor}
              sourceCompany={company}
            />
          )}
          {(company.Sektor || company.sub_sektor) && (
            <RelatedEducationsForCompany
              sector={company.Sektor || company.Hovedbransje || ''}
              subSector={company.sub_sektor}
              sourceCompany={company}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CompanyProfilePage;
