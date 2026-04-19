import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, GraduationCap, Building2, ChevronRight } from "lucide-react";
import { supabase } from '@/lib/supabase';

interface Kortnavn {
  slug: string;
  tittel: string;
  sektor?: string;
  under_sektor?: string;
  beskrivelse_ai?: any;
}

interface StudieRow {
  id: number;
  studie_navn: string;
  laerestednavn: string;
  studiested?: string;
  studiekode?: string;
  opptakspoeng?: number;
  studieplasser?: number;
  sokere_moett?: number;
  sokere_kvalifisert?: number;
  kanonisk_navn?: string;
}

const fmt = (n?: number | null) => n != null ? n.toLocaleString('nb-NO') : null;

const erHkdirKode = (k?: string) => !!k && !/^\d+\s*\d+$/.test(k);

const normLaerested = (s?: string) =>
  (s || '').toLowerCase().split(',')[0].replace(/\s+/g, ' ').trim();

const normStudieNavn = (s: string) => {
  let n = s.toLowerCase();
  n = n.replace(/,?\s*\(?h(ø|o)st\)?\s*$/, '');
  n = n.replace(/,?\s*\(?v(å|a)r\)?\s*$/, '');
  n = n.replace(/,?\s*(bachelor(program|studium)?|master(program|studium)?|årsstudium|årsenhet|ettårig|treårig|femårig|profesjonsstudium|phd|doktorgrad|ph\.?d\.?)\b.*$/, '');
  n = n.replace(/^bachelor(program|studium)?\s*(i\s+)?/, '');
  n = n.replace(/^master(program|studium)?\s*(i\s+)?/, '');
  n = n.replace(/^årsstudium\s*(i\s+)?/, '');
  n = n.replace(/[^a-zæøå0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  return n;
};

const klassifiserNivaa = (studieNavn?: string, kanoniskNavn?: string): string => {
  const s = (studieNavn || '').toLowerCase();
  const k = (kanoniskNavn || '').toLowerCase();
  const c = `${s} | ${k}`;
  if (/\bph\.?d\b/.test(c) || c.includes('doktorgrad')) return 'phd';
  if (/\bmaster\b/.test(c) || c.includes('siv.ing') || c.includes('sivilingeniør') || /\bcand\./.test(c) || c.includes('høyere nivå')) return 'master';
  if (/\b(bachelor|bachelorprogram)\b/.test(c)) return 'bachelor';
  if (/\b(årsstudium|årsenhet|ettårig)\b/.test(c) || c.includes('lavere nivå')) return 'årsstudium';
  return 'annet';
};

const KortnavnPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [kn, setKn] = useState<Kortnavn | null>(null);
  const [studier, setStudier] = useState<StudieRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const hent = async () => {
      setLoading(true);
      const { data: kData } = await supabase
        .from('studier_kortnavn').select('*').eq('slug', slug).limit(1);
      if (!kData?.length) { setLoading(false); return; }
      setKn(kData[0]);

      const { data: sData } = await supabase
        .from('studier_v2')
        .select('id, studie_navn, laerestednavn, studiested, studiekode, opptakspoeng, studieplasser, sokere_moett, sokere_kvalifisert, kanonisk_navn')
        .eq('kortnavn_slug', slug);
      // Skjul videreutdanninger — ikke relevant som grunnstudium.
      const filtered = (sData || []).filter(
        s => !(s.kanonisk_navn || '').toLowerCase().startsWith('videreutdanning')
      );
      // Dedup: gruppér per (lærested normalisert + nivå + studie_navn normalisert).
      // Hvis en gruppe har Samordna-rader (numerisk kode + full stats), skjul HKDIR-raden(e).
      // Hvis bare HKDIR finnes, behold alle. Samordna-rader beholdes alltid (høst/vår er ulike opptak).
      const bucket = new Map<string, StudieRow[]>();
      for (const s of filtered) {
        const key = `${normLaerested(s.laerestednavn)}|${klassifiserNivaa(s.studie_navn, s.kanonisk_navn)}|${normStudieNavn(s.studie_navn)}`;
        const arr = bucket.get(key) || [];
        arr.push(s);
        bucket.set(key, arr);
      }
      const dedupped: StudieRow[] = [];
      for (const arr of bucket.values()) {
        const samordna = arr.filter(s => !erHkdirKode(s.studiekode));
        dedupped.push(...(samordna.length > 0 ? samordna : arr));
      }
      setStudier(dedupped);
      setLoading(false);
    };
    hent();
  }, [slug]);

  const b = kn?.beskrivelse_ai as any;

  return (
    <Layout>
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8 pt-24 max-w-5xl">

          <button
            onClick={() => navigate('/studier')}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Tilbake til alle studier
          </button>

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto" />
            </div>
          ) : !kn ? (
            <p>Fant ikke studie.</p>
          ) : (
            <>
              <div className="rounded-2xl bg-gradient-to-br from-violet-500/10 via-background to-primary/5 border border-violet-400/20 p-8 mb-6">
                <div className="flex items-start gap-5">
                  <div className="w-16 h-16 rounded-xl bg-violet-500/10 border border-violet-400/20 flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="h-8 w-8 text-violet-600" />
                  </div>
                  <div className="min-w-0">
                    <h1 className="text-3xl font-bold mb-2">{kn.tittel}</h1>
                    {b?.tagline && <p className="text-muted-foreground mb-3">{b.tagline}</p>}
                    <div className="flex flex-wrap gap-2">
                      {kn.sektor && <Badge variant="secondary">{kn.sektor}</Badge>}
                      {kn.under_sektor && kn.under_sektor !== kn.sektor && (
                        <Badge variant="outline">{kn.under_sektor}</Badge>
                      )}
                      <Badge variant="outline">{studier.length} studier</Badge>
                    </div>
                  </div>
                </div>
              </div>

              {b && (
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  {b.hva_lærer_du && (
                    <div className="rounded-xl border bg-card p-5">
                      <h2 className="font-semibold mb-2">Hva lærer du?</h2>
                      <p className="text-sm text-muted-foreground leading-relaxed">{b.hva_lærer_du}</p>
                    </div>
                  )}
                  {b.studiehverdag && (
                    <div className="rounded-xl border bg-card p-5">
                      <h2 className="font-semibold mb-2">Studiehverdag</h2>
                      <p className="text-sm text-muted-foreground leading-relaxed">{b.studiehverdag}</p>
                    </div>
                  )}
                  {b.typiske_fag?.length > 0 && (
                    <div className="rounded-xl border bg-card p-5 md:col-span-2">
                      <h2 className="font-semibold mb-3">Typiske fag</h2>
                      <ul className="grid md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                        {b.typiske_fag.map((f: any, i: number) => (
                          <li key={i}>
                            <span className="font-medium">{f.fag}</span>
                            <span className="text-muted-foreground"> — {f.om}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {b.hva_kan_du_bli?.length > 0 && (
                    <div className="rounded-xl border bg-card p-5">
                      <h2 className="font-semibold mb-3">Hva kan du bli?</h2>
                      <ul className="space-y-2 text-sm">
                        {b.hva_kan_du_bli.map((y: any, i: number) => (
                          <li key={i}>
                            <span className="font-medium">{y.yrke}</span>
                            <span className="text-muted-foreground"> — {y.forklaring}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {b.hvor_kan_du_jobbe && (
                    <div className="rounded-xl border bg-card p-5">
                      <h2 className="font-semibold mb-2">Hvor kan du jobbe?</h2>
                      <p className="text-sm text-muted-foreground leading-relaxed">{b.hvor_kan_du_jobbe}</p>
                    </div>
                  )}
                  {b.passer_for_deg?.length > 0 && (
                    <div className="rounded-xl border bg-card p-5 md:col-span-2">
                      <h2 className="font-semibold mb-3">Passer for deg som</h2>
                      <ul className="grid md:grid-cols-2 gap-x-6 gap-y-1 text-sm text-muted-foreground">
                        {b.passer_for_deg.map((p: string, i: number) => (
                          <li key={i}>• {p}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center gap-2 mb-3">
                <Building2 className="h-5 w-5 text-violet-600" />
                <h2 className="text-xl font-bold">Studier på {kn.tittel} ({studier.length})</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                {studier
                  .slice()
                  .sort((a, b) => (b.opptakspoeng || 0) - (a.opptakspoeng || 0))
                  .map(s => {
                    const ratio = s.sokere_kvalifisert && s.studieplasser
                      ? s.sokere_kvalifisert / s.studieplasser : 0;
                    let niv = '', kl = '';
                    if (ratio > 15)      { niv = 'Veldig høy'; kl = 'bg-red-100 text-red-800'; }
                    else if (ratio > 10) { niv = 'Høy'; kl = 'bg-orange-100 text-orange-800'; }
                    else if (ratio > 5)  { niv = 'Moderat'; kl = 'bg-yellow-100 text-yellow-800'; }
                    else if (ratio > 0)  { niv = 'Lav'; kl = 'bg-green-100 text-green-800'; }
                    const url = `/studie/${encodeURIComponent(s.studie_navn)}/${encodeURIComponent(s.laerestednavn)}${s.studiekode ? `?kode=${encodeURIComponent(s.studiekode)}` : ''}`;
                    return (
                      <button
                        key={s.id}
                        onClick={() => navigate(url)}
                        className="text-left rounded-xl border bg-card hover:bg-violet-500/5 hover:border-violet-400/50 transition-all p-4 group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-sm mb-1 truncate">{s.studie_navn}</div>
                            <div className="text-xs text-muted-foreground mb-1">{s.laerestednavn}{s.studiested && ` · ${s.studiested}`}</div>
                            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                              {s.opptakspoeng != null && s.opptakspoeng > 0 && <span>{s.opptakspoeng} poeng</span>}
                              {s.studieplasser != null && s.studieplasser > 0 && <span>· {fmt(s.studieplasser)} plasser</span>}
                              {niv && <span className={`px-1.5 py-0.5 rounded ${kl}`}>{niv}</span>}
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-violet-600 flex-shrink-0 mt-1 transition-colors" />
                        </div>
                      </button>
                    );
                  })}
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default KortnavnPage;
