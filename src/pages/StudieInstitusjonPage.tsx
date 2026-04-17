import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, GraduationCap, Building2, ExternalLink, MapPin,
} from "lucide-react";
import { supabase } from '@/lib/supabase';

interface InstData {
  studie_navn: string;
  institusjon: string;
  studiested?: string;
  studiekode?: string;
  årstall?: number;
  opptakspoeng?: number;
  studieplasser?: number;
  sokere_mott?: number;
  sokere_kvalifisert?: number;
  sokere_tilbud?: number;
  sokere_akseptert?: number;
  sokere_totalt?: number;
}

const fmt = (n?: number | null) => n != null ? n.toLocaleString('nb-NO') : null;

const StudieInstitusjonPage = () => {
  const { navn, institusjon } = useParams<{ navn: string; institusjon: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [data, setData] = useState<InstData | null>(null);
  const [studieSektor, setStudieSektor] = useState<{sektor?: string; under_sektor?: string; beskrivelse?: string} | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navn || !institusjon) return;
    const decNavn = decodeURIComponent(navn);
    const decInst = decodeURIComponent(institusjon);
    const kode = searchParams.get('kode');

    const hent = async () => {
      setLoading(true);
      let q = supabase
        .from('studie_institusjoner')
        .select('*')
        .eq('studie_navn', decNavn)
        .eq('institusjon', decInst);
      if (kode) q = q.eq('studiekode', kode);
      const { data: d } = await q.limit(1).maybeSingle();
      setData(d);

      const { data: s } = await supabase
        .from('studier')
        .select('sektor, under_sektor, beskrivelse')
        .eq('studie_navn', decNavn)
        .maybeSingle();
      setStudieSektor(s);
      setLoading(false);
    };
    hent();
  }, [navn, institusjon, searchParams]);

  if (loading) return (
    <Layout>
      <div className="container mx-auto py-20 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto mb-4" />
        <p className="text-muted-foreground">Henter data…</p>
      </div>
    </Layout>
  );

  if (!data) return (
    <Layout>
      <div className="container mx-auto py-20 text-center max-w-lg">
        <h1 className="text-3xl font-bold mb-4">Ingen data funnet</h1>
        <Button onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Tilbake
        </Button>
      </div>
    </Layout>
  );

  const ratio = data.sokere_kvalifisert && data.studieplasser
    ? data.sokere_kvalifisert / data.studieplasser : null;
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
        <div className="container mx-auto px-4 py-8 pt-24 max-w-4xl">

          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 -ml-2">
            <ArrowLeft className="mr-2 h-4 w-4" /> Tilbake
          </Button>

          {/* ── HERO ──────────────────────────────────── */}
          <Card className="border-l-4 border-l-primary mb-6">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start gap-4">
                <div className="min-w-0 flex-1">
                  <h1 className="text-3xl font-bold mb-1">{data.studie_navn}</h1>
                  <p className="text-muted-foreground flex items-center gap-2 mb-3">
                    <Building2 className="h-4 w-4" />{data.institusjon}
                  </p>
                  <div className="flex flex-wrap gap-3 text-sm">
                    {data.studiekode && (
                      <span className="text-muted-foreground">
                        Studiekode: <span className="font-medium text-foreground">{data.studiekode}</span>
                      </span>
                    )}
                    {data.studiested && (
                      <span className="text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />{data.studiested}
                      </span>
                    )}
                    {studieSektor?.sektor && (
                      <Badge className="bg-primary/15 text-primary border-primary/30">{studieSektor.sektor}</Badge>
                    )}
                    {studieSektor?.under_sektor && (
                      <Badge variant="secondary">{studieSektor.under_sektor}</Badge>
                    )}
                  </div>
                </div>
                {data.opptakspoeng != null && data.opptakspoeng > 0 && (
                  <div className="rounded-full bg-primary/10 px-4 py-2 font-semibold text-primary flex items-center gap-2 flex-shrink-0">
                    <GraduationCap className="h-5 w-5" />
                    <span className="text-lg">{data.opptakspoeng}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Karaktersnitt</div>
                  <div className="font-semibold text-lg">{data.opptakspoeng ?? '—'}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Studieplasser</div>
                  <div className="font-semibold text-lg">{data.studieplasser ?? '—'}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Søkere møtt</div>
                  <div className="font-semibold text-lg">{data.sokere_mott ?? '—'}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Konkurransenivå</div>
                  {ratio != null ? (
                    <div className={`text-xs px-2 py-0.5 rounded-full w-fit ${fargekl} font-medium`}>{niv}</div>
                  ) : <span className="text-muted-foreground">—</span>}
                  {ratio != null && (
                    <div className="text-xs text-muted-foreground mt-0.5">{ratio.toFixed(1)} søkere/plass</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ── DETALJERTE SØKERSTATISTIKKER ──────────── */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Detaljerte søkerstatistikker</CardTitle>
              <CardDescription>
                {data.årstall ? `Data for ${data.årstall}` : 'Oversikt over søkertall og opptaksstatistikk'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.sokere_kvalifisert != null && (
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Kvalifiserte søkere:</span>
                    <span className="font-medium">{fmt(data.sokere_kvalifisert)}</span>
                  </div>
                )}
                {data.sokere_tilbud != null && (
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Søkere som fikk tilbud:</span>
                    <span className="font-medium">{fmt(data.sokere_tilbud)}</span>
                  </div>
                )}
                {data.sokere_akseptert != null && (
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Søkere som takket ja:</span>
                    <span className="font-medium">{fmt(data.sokere_akseptert)}</span>
                  </div>
                )}
                {data.sokere_mott != null && (
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Søkere som møtte:</span>
                    <span className="font-medium">{fmt(data.sokere_mott)}</span>
                  </div>
                )}
                {data.studieplasser != null && (
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Studieplasser:</span>
                    <span className="font-medium">{fmt(data.studieplasser)}</span>
                  </div>
                )}
                {ratio != null && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Søkere per studieplass:</span>
                    <span className="font-medium">{ratio.toFixed(1)}</span>
                  </div>
                )}
              </div>
              <Button variant="outline" size="sm" className="mt-4" asChild>
                <a
                  href={`https://www.samordnaopptak.no/info/soeking/soeke-studier/finn-studier/?search=${encodeURIComponent(data.studie_navn)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Les mer på Samordna opptak
                </a>
              </Button>
            </CardContent>
          </Card>

          {studieSektor?.beskrivelse && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Om studiet</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {studieSektor.beskrivelse}
                </p>
              </CardContent>
            </Card>
          )}

          <Button
            variant="ghost"
            onClick={() => navigate(`/studie/${encodeURIComponent(data.studie_navn)}`)}
            className="w-full"
          >
            Se alle læresteder for {data.studie_navn}
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default StudieInstitusjonPage;
