import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, Search, ChevronRight } from "lucide-react";
import { supabase } from '@/lib/supabase';

type Nivaa = 'bachelor' | 'master' | 'årsstudium' | 'phd';

interface StudieRow {
  studie_navn: string;
  laerestednavn: string;
  studiested?: string;
  studiekode?: string;
  kortnavn_slug?: string;
  opptakspoeng?: number;
  studieplasser?: number;
  sokere_moett?: number;
  sokere_kvalifisert?: number;
  kanonisk_navn?: string;
  nivaa?: Nivaa | null;
}

interface Kortnavn {
  slug: string;
  tittel: string;
  sektor?: string;
  under_sektor?: string;
  antall_inst: number;
  antall_studier: number;
  opptakspoeng?: number;
  studieplasser?: number;
  sokere_mott?: number;
  sokere_kvalifisert?: number;
  institusjoner: string[];
  nivaaer: Nivaa[];
}

const erHkdirKode = (k?: string) => !!k && !/^\d+\s*\d+$/.test(k);

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

const klassifiserNivaa = (studieNavn?: string, kanoniskNavn?: string): Nivaa | null => {
  const s = (studieNavn || '').toLowerCase();
  const k = (kanoniskNavn || '').toLowerCase();
  const combo = `${s} | ${k}`;
  if (combo.includes('videreutdanning')) return null;
  if (/\bph\.?d\b/.test(combo) || combo.includes('doktorgrad')) return 'phd';
  if (/\bmaster\b/.test(combo) || combo.includes('siv.ing') || combo.includes('sivilingeniør') || /\bcand\./.test(combo) || combo.includes('høyere nivå')) return 'master';
  if (/\b(bachelor|bachelorprogram)\b/.test(combo)) return 'bachelor';
  if (/\b(årsstudium|årsenhet|ettårig)\b/.test(combo) || combo.includes('lavere nivå')) return 'årsstudium';
  return null;
};

const StudierPage = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Kortnavn[]>([]);
  const [rawStudier, setRawStudier] = useState<StudieRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [sok, setSok] = useState('');
  const [filtBransje, setFiltBransje] = useState('alle');
  const [filtUnder, setFiltUnder] = useState('alle');
  const [filtInst, setFiltInst] = useState('alle');
  const [filtNivaa, setFiltNivaa] = useState<'alle' | Nivaa>('alle');
  const [sort, setSort] = useState<'karakter'|'popularitet'|'konkurranse'|'navn'>('karakter');

  useEffect(() => {
    const hent = async () => {
      // 1) Alle kortnavn med sektor satt
      const kortnavn: any[] = [];
      {
        let offset = 0;
        while (true) {
          const { data } = await supabase
            .from('studier_kortnavn')
            .select('slug, tittel, sektor, under_sektor')
            .not('sektor', 'is', null)
            .range(offset, offset + 999);
          if (!data || data.length === 0) break;
          kortnavn.push(...data);
          if (data.length < 1000) break;
          offset += 1000;
        }
      }

      // 2) Alle studier_v2 m/ kortnavn_slug — aggregér stats per slug
      // Filtrer bort videreutdanninger (krever at du allerede er i yrket).
      const agg = new Map<string, any>();
      const raw: StudieRow[] = [];
      {
        let offset = 0;
        while (true) {
          const { data } = await supabase
            .from('studier_v2')
            .select('kortnavn_slug, studie_navn, laerestednavn, studiested, studiekode, opptakspoeng, studieplasser, sokere_moett, sokere_kvalifisert, kanonisk_navn')
            .not('kortnavn_slug', 'is', null)
            .range(offset, offset + 999);
          if (!data || data.length === 0) break;
          for (const r of data) {
            if ((r.kanonisk_navn || '').toLowerCase().startsWith('videreutdanning')) continue;
            const niv = klassifiserNivaa(r.studie_navn, r.kanonisk_navn);
            raw.push({ ...r, nivaa: niv });
            let a = agg.get(r.kortnavn_slug);
            if (!a) {
              a = { antall_studier: 0, _poenger: [], studieplasser: 0, sokere_mott: 0, sokere_kvalifisert: 0, _inst: new Set<string>(), _nivaa: new Set<Nivaa>() };
              agg.set(r.kortnavn_slug, a);
            }
            a.antall_studier += 1;
            if (r.laerestednavn) a._inst.add(r.laerestednavn);
            if (r.opptakspoeng && r.opptakspoeng > 0) a._poenger.push(r.opptakspoeng);
            a.studieplasser += (r.studieplasser || 0);
            a.sokere_mott += (r.sokere_moett || 0);
            a.sokere_kvalifisert += (r.sokere_kvalifisert || 0);
            if (niv) a._nivaa.add(niv);
          }
          if (data.length < 1000) break;
          offset += 1000;
        }
      }
      setRawStudier(raw);

      // 3) Kombinér — kun kortnavn som faktisk har studier
      const kombinert: Kortnavn[] = [];
      for (const k of kortnavn) {
        const a = agg.get(k.slug);
        if (!a || a.antall_studier === 0) continue;
        kombinert.push({
          slug:        k.slug,
          tittel:      k.tittel,
          sektor:      k.sektor,
          under_sektor: k.under_sektor,
          antall_inst:  a._inst.size,
          antall_studier: a.antall_studier,
          opptakspoeng: a._poenger.length
            ? Math.round((a._poenger.reduce((s: number, p: number) => s + p, 0) / a._poenger.length) * 10) / 10
            : undefined,
          studieplasser: a.studieplasser || undefined,
          sokere_mott:   a.sokere_mott || undefined,
          sokere_kvalifisert: a.sokere_kvalifisert || undefined,
          institusjoner: Array.from(a._inst) as string[],
          nivaaer: Array.from(a._nivaa) as Nivaa[],
        });
      }
      setRows(kombinert);
      setLoading(false);
    };
    hent();
  }, []);

  const bransjer = useMemo(() =>
    Array.from(new Set(rows.map(r => r.sektor).filter(Boolean))).sort() as string[]
  , [rows]);

  const underBransjer = useMemo(() =>
    Array.from(new Set(
      rows.filter(r => filtBransje === 'alle' || r.sektor === filtBransje).map(r => r.under_sektor).filter(Boolean)
    )).sort() as string[]
  , [rows, filtBransje]);

  const institusjoner = useMemo(() =>
    Array.from(new Set(rows.flatMap(r => r.institusjoner))).sort()
  , [rows]);

  const konk = (r: Kortnavn) =>
    r.sokere_kvalifisert && r.studieplasser ? r.sokere_kvalifisert / r.studieplasser : 0;

  const sektorBySlug = useMemo(() => {
    const m = new Map<string, { sektor?: string; under_sektor?: string }>();
    for (const r of rows) m.set(r.slug, { sektor: r.sektor, under_sektor: r.under_sektor });
    return m;
  }, [rows]);

  const visStudier = filtInst !== 'alle';

  const filtStudier = useMemo(() => {
    if (!visStudier) return [];
    let f = rawStudier.filter(s => s.laerestednavn === filtInst);
    if (sok) f = f.filter(s => s.studie_navn.toLowerCase().includes(sok.toLowerCase()));
    if (filtBransje !== 'alle') f = f.filter(s => sektorBySlug.get(s.kortnavn_slug || '')?.sektor === filtBransje);
    if (filtUnder !== 'alle') f = f.filter(s => sektorBySlug.get(s.kortnavn_slug || '')?.under_sektor === filtUnder);
    if (filtNivaa !== 'alle') f = f.filter(s => s.nivaa === filtNivaa);

    // Dedup: når samme (normalisert navn + lærested + nivå) har både Samordna og HKDIR,
    // velg Samordna-raden (den har poeng/søkerstats).
    const bucket = new Map<string, StudieRow>();
    for (const s of f) {
      const key = `${s.laerestednavn}|${s.nivaa || ''}|${normStudieNavn(s.studie_navn)}`;
      const current = bucket.get(key);
      if (!current) { bucket.set(key, s); continue; }
      const curHk = erHkdirKode(current.studiekode);
      const sHk = erHkdirKode(s.studiekode);
      if (curHk && !sHk) bucket.set(key, s);
      else if (!curHk && sHk) continue;
      else {
        const curScore = (current.opptakspoeng || 0) + (current.sokere_kvalifisert || 0);
        const sScore = (s.opptakspoeng || 0) + (s.sokere_kvalifisert || 0);
        if (sScore > curScore) bucket.set(key, s);
      }
    }
    f = Array.from(bucket.values());

    return [...f].sort((a, b) => {
      if (sort === 'karakter')    return (b.opptakspoeng || 0) - (a.opptakspoeng || 0);
      if (sort === 'popularitet') return (b.sokere_moett || 0) - (a.sokere_moett || 0);
      if (sort === 'konkurranse') {
        const ra = a.sokere_kvalifisert && a.studieplasser ? a.sokere_kvalifisert / a.studieplasser : 0;
        const rb = b.sokere_kvalifisert && b.studieplasser ? b.sokere_kvalifisert / b.studieplasser : 0;
        return rb - ra;
      }
      return a.studie_navn.localeCompare(b.studie_navn, 'nb');
    });
  }, [visStudier, rawStudier, filtInst, sok, filtBransje, filtUnder, filtNivaa, sort, sektorBySlug]);

  const filt = useMemo(() => {
    let f = rows;
    if (sok) f = f.filter(r => r.tittel.toLowerCase().includes(sok.toLowerCase()));
    if (filtBransje !== 'alle') f = f.filter(r => r.sektor === filtBransje);
    if (filtUnder !== 'alle') f = f.filter(r => r.under_sektor === filtUnder);
    if (filtInst !== 'alle') f = f.filter(r => r.institusjoner.includes(filtInst));
    if (filtNivaa !== 'alle') f = f.filter(r => r.nivaaer.includes(filtNivaa));
    return [...f].sort((a, b) => {
      if (sort === 'karakter')    return (b.opptakspoeng || 0) - (a.opptakspoeng || 0);
      if (sort === 'popularitet') return (b.sokere_mott || 0) - (a.sokere_mott || 0);
      if (sort === 'konkurranse') return konk(b) - konk(a);
      return a.tittel.localeCompare(b.tittel, 'nb');
    });
  }, [rows, sok, filtBransje, filtUnder, filtInst, filtNivaa, sort]);

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
                <p className="text-muted-foreground">{rows.length} studier med poenggrense, konkurranse og jobbmuligheter</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-6">
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
            <Select value={filtNivaa} onValueChange={v => setFiltNivaa(v as any)}>
              <SelectTrigger><SelectValue placeholder="Alle nivåer" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="alle">Alle nivåer</SelectItem>
                <SelectItem value="bachelor">Bachelor</SelectItem>
                <SelectItem value="master">Master</SelectItem>
                <SelectItem value="årsstudium">Årsstudium</SelectItem>
                <SelectItem value="phd">PhD / doktorgrad</SelectItem>
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

          <p className="text-xs text-muted-foreground mb-4">
            {visStudier
              ? `Viser ${filtStudier.length} studier ved ${filtInst}`
              : `Viser ${filt.length} av ${rows.length}`}
          </p>

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto" />
            </div>
          ) : visStudier ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filtStudier.slice(0, 300).map((s, idx) => {
                const ratio = s.sokere_kvalifisert && s.studieplasser ? s.sokere_kvalifisert / s.studieplasser : 0;
                let niv = '', kl = '';
                if (ratio > 0) {
                  if (ratio > 15)      { niv = 'Veldig høy'; kl = 'bg-red-100 text-red-800'; }
                  else if (ratio > 10) { niv = 'Høy'; kl = 'bg-orange-100 text-orange-800'; }
                  else if (ratio > 5)  { niv = 'Moderat'; kl = 'bg-yellow-100 text-yellow-800'; }
                  else                 { niv = 'Lav'; kl = 'bg-green-100 text-green-800'; }
                }
                const url = `/studie/${encodeURIComponent(s.studie_navn)}/${encodeURIComponent(s.laerestednavn)}${s.studiekode ? `?kode=${encodeURIComponent(s.studiekode)}` : ''}`;
                return (
                  <button
                    key={`${s.studie_navn}-${s.studiekode ?? idx}`}
                    onClick={() => navigate(url)}
                    className="text-left rounded-xl border bg-card hover:bg-violet-500/5 hover:border-violet-400/50 transition-all p-4 group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-sm mb-1 truncate">{s.studie_navn}</div>
                        <div className="text-xs text-muted-foreground mb-1 truncate">
                          {s.studiested || s.laerestednavn}
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                          {s.opptakspoeng != null && s.opptakspoeng > 0 && <span>{s.opptakspoeng} poeng</span>}
                          {s.studieplasser != null && s.studieplasser > 0 && <span>· {s.studieplasser} plasser</span>}
                          {niv && <span className={`px-1.5 py-0.5 rounded ${kl}`}>{niv}</span>}
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-violet-600 flex-shrink-0 mt-1 transition-colors" />
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filt.slice(0, 300).map(r => {
                const ratio = konk(r);
                let niv = '', kl = '';
                if (ratio > 0) {
                  if (ratio > 15)      { niv = 'Veldig høy'; kl = 'bg-red-100 text-red-800'; }
                  else if (ratio > 10) { niv = 'Høy'; kl = 'bg-orange-100 text-orange-800'; }
                  else if (ratio > 5)  { niv = 'Moderat'; kl = 'bg-yellow-100 text-yellow-800'; }
                  else                 { niv = 'Lav'; kl = 'bg-green-100 text-green-800'; }
                }
                return (
                  <button
                    key={r.slug}
                    onClick={() => navigate(`/studier/${r.slug}`)}
                    className="text-left rounded-xl border bg-card hover:bg-violet-500/5 hover:border-violet-400/50 transition-all p-4 group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                          <GraduationCap className="h-4 w-4 text-violet-600" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-sm truncate">{r.tittel}</div>
                          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-0.5">
                            <span>{r.antall_inst} læresteder</span>
                            {r.opptakspoeng != null && r.opptakspoeng > 0 && <span>· {r.opptakspoeng} poeng</span>}
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
          {!visStudier && filt.length > 300 && (
            <p className="text-center text-sm text-muted-foreground mt-6">
              Viser 300 av {filt.length} — bruk filter eller søk for å snevre inn
            </p>
          )}
          {visStudier && filtStudier.length > 300 && (
            <p className="text-center text-sm text-muted-foreground mt-6">
              Viser 300 av {filtStudier.length} — bruk filter eller søk for å snevre inn
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default StudierPage;
