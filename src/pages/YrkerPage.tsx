import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase, Search, Users, TrendingUp, ChevronRight } from "lucide-react";
import { supabase } from '@/lib/supabase';

interface Yrke {
  uno_id: string;
  tittel: string;
  sektor?: string;
  under_sektor?: string;
  ledighetsrate?: number;
  antall_sysselsatte?: number;
  gjennomsnitt_lonn?: number;
}

const fmt = (n?: number | null) => n != null ? n.toLocaleString('nb-NO') : null;

const YrkerPage = () => {
  const navigate = useNavigate();
  const [yrker, setYrker] = useState<Yrke[]>([]);
  const [loading, setLoading] = useState(true);
  const [sok, setSok] = useState('');
  const [filtBransje, setFiltBransje] = useState('alle');
  const [filtUnder, setFiltUnder] = useState('alle');
  const [sort, setSort] = useState<'navn'|'lonn'|'ledighet'|'sysselsatte'>('navn');

  useEffect(() => {
    const hent = async () => {
      const alle: Yrke[] = [];
      let offset = 0;
      while (true) {
        const { data } = await supabase
          .from('yrker')
          .select('uno_id, tittel, sektor, under_sektor, ledighetsrate, antall_sysselsatte, gjennomsnitt_lonn')
          .range(offset, offset + 999);
        if (!data || data.length === 0) break;
        alle.push(...data);
        if (data.length < 1000) break;
        offset += 1000;
      }
      setYrker(alle);
      setLoading(false);
    };
    hent();
  }, []);

  const bransjer = useMemo(() =>
    Array.from(new Set(yrker.map(y => y.sektor).filter(Boolean))).sort() as string[]
  , [yrker]);

  const underBransjer = useMemo(() =>
    Array.from(new Set(
      yrker
        .filter(y => filtBransje === 'alle' || y.sektor === filtBransje)
        .map(y => y.under_sektor).filter(Boolean)
    )).sort() as string[]
  , [yrker, filtBransje]);

  const filt = useMemo(() => {
    let f = yrker;
    if (sok) f = f.filter(y => y.tittel.toLowerCase().includes(sok.toLowerCase()));
    if (filtBransje !== 'alle') f = f.filter(y => y.sektor === filtBransje);
    if (filtUnder !== 'alle') f = f.filter(y => y.under_sektor === filtUnder);
    return [...f].sort((a, b) => {
      if (sort === 'lonn')        return (b.gjennomsnitt_lonn || 0) - (a.gjennomsnitt_lonn || 0);
      if (sort === 'ledighet')    return (b.ledighetsrate || 0) - (a.ledighetsrate || 0);
      if (sort === 'sysselsatte') return (b.antall_sysselsatte || 0) - (a.antall_sysselsatte || 0);
      return a.tittel.localeCompare(b.tittel, 'nb');
    });
  }, [yrker, sok, filtBransje, filtUnder, sort]);

  return (
    <Layout>
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8 pt-24 max-w-6xl">

          <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-background to-violet-500/5 border border-primary/20 p-8 mb-8">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                <Briefcase className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-1">Alle yrker</h1>
                <p className="text-muted-foreground">{yrker.length} yrker med lønn, ledighet og vanligste utdanningsbakgrunn</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
              <Input placeholder="Søk etter yrke…" className="pl-9" value={sok} onChange={e => setSok(e.target.value)} />
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
            <Select value={sort} onValueChange={v => setSort(v as any)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="navn">Sortér: Navn</SelectItem>
                <SelectItem value="lonn">Sortér: Lønn</SelectItem>
                <SelectItem value="ledighet">Sortér: Ledighet</SelectItem>
                <SelectItem value="sysselsatte">Sortér: Antall sysselsatte</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <p className="text-xs text-muted-foreground mb-4">Viser {filt.length} av {yrker.length}</p>

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filt.slice(0, 300).map(y => (
                <button
                  key={y.uno_id}
                  onClick={() => navigate(`/yrke/${y.uno_id}`)}
                  className="text-left rounded-xl border bg-card hover:bg-primary/5 hover:border-primary/30 transition-all p-4 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-medium text-sm leading-tight mb-1">{y.tittel}</div>
                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        {y.sektor && <span className="truncate">{y.sektor}</span>}
                        {y.gjennomsnitt_lonn ? <span>· {fmt(y.gjennomsnitt_lonn)} kr/mnd</span> : null}
                        {y.ledighetsrate != null && (
                          <span className={
                            Number(y.ledighetsrate) < 0.03 ? 'text-green-600' :
                            Number(y.ledighetsrate) < 0.06 ? 'text-yellow-600' : 'text-red-500'
                          }>· {(Number(y.ledighetsrate) * 100).toFixed(1)}%</span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary flex-shrink-0 mt-0.5 transition-colors" />
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

export default YrkerPage;
