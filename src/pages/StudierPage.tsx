import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, Search, ChevronRight } from "lucide-react";
import { supabase } from '@/lib/supabase';

interface Studie {
  studie_navn: string;
  sektor?: string;
  under_sektor?: string;
  antall_inst?: number;
  opptakspoeng?: number;
  studieplasser?: number;
  sokere_mott?: number;
  sokere_kvalifisert?: number;
  institusjoner?: string;
}

const StudierPage = () => {
  const navigate = useNavigate();
  const [studier, setStudier] = useState<Studie[]>([]);
  const [loading, setLoading] = useState(true);
  const [sok, setSok] = useState('');
  const [filtBransje, setFiltBransje] = useState('alle');
  const [filtUnder, setFiltUnder] = useState('alle');
  const [filtInst, setFiltInst] = useState('alle');
  const [sort, setSort] = useState<'karakter'|'popularitet'|'konkurranse'|'navn'>('karakter');

  useEffect(() => {
    const hent = async () => {
      const alle: Studie[] = [];
      let offset = 0;
      while (true) {
        const { data } = await supabase
          .from('studier')
          .select('studie_navn, sektor, under_sektor, antall_inst, opptakspoeng, studieplasser, sokere_mott, sokere_kvalifisert, institusjoner')
          .range(offset, offset + 999);
        if (!data || data.length === 0) break;
        alle.push(...data);
        if (data.length < 1000) break;
        offset += 1000;
      }
      setStudier(alle);
      setLoading(false);
    };
    hent();
  }, []);

  const bransjer = useMemo(() =>
    Array.from(new Set(studier.map(s => s.sektor).filter(Boolean))).sort() as string[]
  , [studier]);

  const underBransjer = useMemo(() =>
    Array.from(new Set(
      studier
        .filter(s => filtBransje === 'alle' || s.sektor === filtBransje)
        .map(s => s.under_sektor).filter(Boolean)
    )).sort() as string[]
  , [studier, filtBransje]);

  const institusjoner = useMemo(() =>
    Array.from(new Set(
      studier.flatMap(s => (s.institusjoner || '').split(',').map(i => i.trim()).filter(Boolean))
    )).sort()
  , [studier]);

  const konk = (s: Studie) =>
    s.sokere_kvalifisert && s.studieplasser ? s.sokere_kvalifisert / s.studieplasser : 0;

  const filt = useMemo(() => {
    let f = studier;
    if (sok) f = f.filter(s => s.studie_navn.toLowerCase().includes(sok.toLowerCase()));
    if (filtBransje !== 'alle') f = f.filter(s => s.sektor === filtBransje);
    if (filtUnder !== 'alle') f = f.filter(s => s.under_sektor === filtUnder);
    if (filtInst !== 'alle') f = f.filter(s => (s.institusjoner || '').includes(filtInst));
    return [...f].sort((a, b) => {
      if (sort === 'karakter')    return (b.opptakspoeng || 0) - (a.opptakspoeng || 0);
      if (sort === 'popularitet') return (b.sokere_mott || 0) - (a.sokere_mott || 0);
      if (sort === 'konkurranse') return konk(b) - konk(a);
      return a.studie_navn.localeCompare(b.studie_navn, 'nb');
    });
  }, [studier, sok, filtBransje, filtUnder, filtInst, sort]);

  return (
    <Layout>
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8 pt-24 max-w-6xl">

          <div className="rounded-2xl bg-gradient-to-br from-violet-500/10 via-background to-primary/5 border border-violet-400/20 p-8 mb-8">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-xl bg-violet-500/10 border border-violet-400/20 flex items-center justify-center flex-shrink-0">
                <GraduationCap className="h-8 w-8 text-violet-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-1">Alle studier</h1>
                <p className="text-muted-foreground">{studier.length} studieprogrammer med poenggrense, konkurranse og jobbmuligheter</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
              <Input placeholder="Søk etter studie…" className="pl-9" value={sok} onChange={e => setSok(e.target.value)} />
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
            <Select value={filtInst} onValueChange={setFiltInst}>
              <SelectTrigger><SelectValue placeholder="Alle universiteter" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="alle">Alle universiteter</SelectItem>
                {institusjoner.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={sort} onValueChange={v => setSort(v as any)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="karakter">Sortér: Karaktersnitt</SelectItem>
                <SelectItem value="popularitet">Sortér: Popularitet</SelectItem>
                <SelectItem value="konkurranse">Sortér: Konkurranse</SelectItem>
                <SelectItem value="navn">Sortér: Navn</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <p className="text-xs text-muted-foreground mb-4">Viser {filt.length} av {studier.length}</p>

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filt.slice(0, 300).map(s => {
                const ratio = konk(s);
                let niv = '', kl = '';
                if (ratio > 0) {
                  if (ratio > 15)      { niv = 'Veldig høy'; kl = 'bg-red-100 text-red-800'; }
                  else if (ratio > 10) { niv = 'Høy'; kl = 'bg-orange-100 text-orange-800'; }
                  else if (ratio > 5)  { niv = 'Moderat'; kl = 'bg-yellow-100 text-yellow-800'; }
                  else                 { niv = 'Lav'; kl = 'bg-green-100 text-green-800'; }
                }
                return (
                  <button
                    key={s.studie_navn}
                    onClick={() => navigate(`/studie/${encodeURIComponent(s.studie_navn)}`)}
                    className="text-left rounded-xl border bg-card hover:bg-violet-500/5 hover:border-violet-400/50 transition-all p-4 group"
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
                            {niv && <span className={`px-1.5 py-0.5 rounded ${kl}`}>{niv}</span>}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-violet-600 flex-shrink-0 mt-1 transition-colors" />
                    </div>
                  </button>
                );
              })}
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

export default StudierPage;
