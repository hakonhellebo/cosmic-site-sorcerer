import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Search, Users, MapPin, ChevronRight } from "lucide-react";
import { supabase } from '@/lib/supabase';

interface Bedrift {
  Selskap: string;
  Sektor?: string;
  sub_sektor?: string;
  Lokasjon?: string;
  Geografi?: string;
  Ansatte?: string;
  antall_ansatte_tall?: number;
  driftsresultat_mnok?: number;
  'Driftsinntekter (MNOK)'?: number;
}

const fmt = (n?: number | null) => n != null ? n.toLocaleString('nb-NO') : null;

const BedrifterPage = () => {
  const navigate = useNavigate();
  const [bedrifter, setBedrifter] = useState<Bedrift[]>([]);
  const [loading, setLoading] = useState(true);
  const [sok, setSok] = useState('');
  const [filtBransje, setFiltBransje] = useState('alle');
  const [filtUnder, setFiltUnder] = useState('alle');
  const [filtGeo, setFiltGeo] = useState('alle');
  const [sort, setSort] = useState<'ansatte'|'inntekter'|'navn'>('ansatte');

  useEffect(() => {
    const hent = async () => {
      const alle: Bedrift[] = [];
      let offset = 0;
      while (true) {
        const { data } = await supabase
          .from('Bedrifter_ny')
          .select('Selskap, Sektor, sub_sektor, Lokasjon, Geografi, Ansatte, antall_ansatte_tall, driftsresultat_mnok, "Driftsinntekter (MNOK)"')
          .range(offset, offset + 999);
        if (!data || data.length === 0) break;
        alle.push(...data);
        if (data.length < 1000) break;
        offset += 1000;
      }
      setBedrifter(alle);
      setLoading(false);
    };
    hent();
  }, []);

  const inntekt = (b: Bedrift) => b.driftsresultat_mnok ?? b['Driftsinntekter (MNOK)'] ?? 0;

  const bransjer = useMemo(() =>
    Array.from(new Set(bedrifter.map(b => b.Sektor).filter(Boolean))).sort() as string[]
  , [bedrifter]);

  const underBransjer = useMemo(() =>
    Array.from(new Set(
      bedrifter
        .filter(b => filtBransje === 'alle' || b.Sektor === filtBransje)
        .map(b => b.sub_sektor).filter(Boolean)
    )).sort() as string[]
  , [bedrifter, filtBransje]);

  const geografier = useMemo(() =>
    Array.from(new Set(
      bedrifter.map(b => b.Geografi || b.Lokasjon).filter(Boolean)
    )).sort() as string[]
  , [bedrifter]);

  const filt = useMemo(() => {
    let f = bedrifter;
    if (sok) f = f.filter(b => b.Selskap.toLowerCase().includes(sok.toLowerCase()));
    if (filtBransje !== 'alle') f = f.filter(b => b.Sektor === filtBransje);
    if (filtUnder !== 'alle') f = f.filter(b => b.sub_sektor === filtUnder);
    if (filtGeo !== 'alle') f = f.filter(b => (b.Geografi || b.Lokasjon) === filtGeo);
    return [...f].sort((a, b) => {
      if (sort === 'ansatte')   return (b.antall_ansatte_tall || 0) - (a.antall_ansatte_tall || 0);
      if (sort === 'inntekter') return inntekt(b) - inntekt(a);
      return a.Selskap.localeCompare(b.Selskap, 'nb');
    });
  }, [bedrifter, sok, filtBransje, filtUnder, filtGeo, sort]);

  return (
    <Layout>
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8 pt-24 max-w-6xl">

          <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-background to-violet-500/5 border border-primary/20 p-8 mb-8">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-1">Alle bedrifter</h1>
                <p className="text-muted-foreground">{bedrifter.length} norske arbeidsgivere med ansatte, inntekter og hvilke yrker de ansetter</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
              <Input placeholder="Søk etter bedrift…" className="pl-9" value={sok} onChange={e => setSok(e.target.value)} />
            </div>
            <Select value={filtBransje} onValueChange={v => { setFiltBransje(v); setFiltUnder('alle'); }}>
              <SelectTrigger><SelectValue placeholder="Alle bransjer" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="alle">Alle bransjer</SelectItem>
                {bransjer.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filtUnder} onValueChange={setFiltUnder} disabled={filtBransje === 'alle'}>
              <SelectTrigger><SelectValue placeholder="Alle underbransjer" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="alle">Alle underbransjer</SelectItem>
                {underBransjer.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filtGeo} onValueChange={setFiltGeo}>
              <SelectTrigger><SelectValue placeholder="Alle geografier" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="alle">Alle geografier</SelectItem>
                {geografier.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={sort} onValueChange={v => setSort(v as any)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ansatte">Sortér: Antall ansatte</SelectItem>
                <SelectItem value="inntekter">Sortér: Driftsinntekter</SelectItem>
                <SelectItem value="navn">Sortér: Navn</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <p className="text-xs text-muted-foreground mb-4">Viser {filt.length} av {bedrifter.length}</p>

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-3">
              {filt.slice(0, 300).map(b => (
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
                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-0.5">
                          {b.sub_sektor && <span>{b.sub_sektor}</span>}
                          {(b.Lokasjon || b.Geografi) && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 flex-shrink-0" />{b.Lokasjon || b.Geografi}
                            </span>
                          )}
                          {b.antall_ansatte_tall && (
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3 flex-shrink-0" />{fmt(b.antall_ansatte_tall)}
                            </span>
                          )}
                          {inntekt(b) > 0 && <span>· {fmt(inntekt(b))} MNOK</span>}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary flex-shrink-0 mt-1 transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          )}
          {filt.length > 300 && (
            <p className="text-center text-sm text-muted-foreground mt-6">
              Viser 300 av {filt.length} — bruk filter eller søk for å snevre inn
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BedrifterPage;
