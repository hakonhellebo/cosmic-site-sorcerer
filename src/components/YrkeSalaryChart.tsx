import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, TrendingUp } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { supabase } from '@/lib/supabase';

interface YrkeSalaryChartProps {
  yrkeTittel: string;
  linkedTittel?: string;  // fra linked_uno_id dersom eget yrke ikke har data
}

interface ÅrData { year: number; [jobKey: string]: number; }

const ÅR = [2018, 2019, 2020, 2021, 2022, 2023, 2024];
const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

const YrkeSalaryChart: React.FC<YrkeSalaryChartProps> = ({ yrkeTittel, linkedTittel }) => {
  const [data, setData] = useState<ÅrData[]>([]);
  const [ssbJobs, setSsbJobs] = useState<string[]>([]);
  const [kilde, setKilde] = useState<string>(''); // Yrket vi brukte for oppslag
  const [kjonn, setKjonn] = useState<'all'|'Menn'|'Kvinner'|'Begge kjønn'>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const hent = async () => {
      setLoading(true);
      setError(null);
      setData([]);

      // Finn SSB-mapping — prøv yrkets tittel, så linkedTittel
      let mapping: any = null;
      let kildeYrke = yrkeTittel;

      const { data: m1 } = await supabase.from('ssb_til_yrker')
        .select('*').eq('Connections-yrke', yrkeTittel).maybeSingle();

      if (m1) mapping = m1;
      else if (linkedTittel) {
        const { data: m2 } = await supabase.from('ssb_til_yrker')
          .select('*').eq('Connections-yrke', linkedTittel).maybeSingle();
        if (m2) { mapping = m2; kildeYrke = linkedTittel; }
      }

      if (!mapping) {
        setError("Ingen lønnsdata tilgjengelig for dette yrket");
        setLoading(false);
        return;
      }

      setKilde(kildeYrke);
      const jobs = [mapping['SSB-yrke_1'], mapping['SSB-yrke_2'], mapping['SSB-yrke_3']]
        .filter(j => j && j.toLowerCase() !== 'na');
      setSsbJobs(jobs);

      // Hent lønn for alle år parallelt
      const promises = ÅR.map(async (år) => {
        let q = supabase.from('Clean_11418')
          .select('value, Yrke')
          .in('Yrke', jobs)
          .eq('Tid', år)
          .eq('MaaleMetode', 'Median')
          .eq('ContentsCode', 'Månedslønn (kr)')
          .not('value', 'is', null);
        if (kjonn !== 'all') q = q.eq('Kjonn', kjonn);
        else q = q.eq('Kjonn', 'Begge kjønn');

        const { data: rader } = await q;
        if (!rader?.length) return null;

        const yearData: ÅrData = { year: år };
        for (const job of jobs) {
          const jobRader = rader.filter(r => r.Yrke === job);
          if (jobRader.length) {
            const snitt = jobRader.reduce((s, r) => s + (r.value || 0), 0) / jobRader.length;
            yearData[job] = Math.round(snitt * 12);
          }
        }
        return yearData;
      });

      const results = (await Promise.all(promises)).filter(Boolean) as ÅrData[];
      if (!results.length) setError("Ingen lønnsdata funnet");
      else setData(results.sort((a, b) => a.year - b.year));
      setLoading(false);
    };
    hent();
  }, [yrkeTittel, linkedTittel, kjonn]);

  const dataKeys = data.length ? Object.keys(data[0]).filter(k => k !== 'year') : [];

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-4 w-4" />
              Lønnsutvikling 2018–2024
            </CardTitle>
            <CardDescription>
              {kilde && kilde !== yrkeTittel
                ? `Basert på ${kilde} (lignende yrke) — median årslønn`
                : 'Median årslønn basert på SSB-data'}
            </CardDescription>
          </div>
          <Select value={kjonn} onValueChange={v => setKjonn(v as any)}>
            <SelectTrigger className="w-[140px] h-8 text-xs">
              <SelectValue placeholder="Kjønn" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Begge kjønn</SelectItem>
              <SelectItem value="Menn">Menn</SelectItem>
              <SelectItem value="Kvinner">Kvinner</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-4 w-4 animate-spin mr-2" /><span className="text-sm">Henter…</span>
          </div>
        )}
        {error && !loading && (
          <p className="text-sm text-muted-foreground py-4 text-center">{error}</p>
        )}
        {data.length > 0 && (
          <>
            <ChartContainer config={{}} className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={data} margin={{ top: 8, right: 8, left: 4, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" tick={{ fontSize: 10 }} />
                  <YAxis tickFormatter={v => `${(v/1000).toFixed(0)}k`} width={42} tick={{ fontSize: 10 }} />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    formatter={(v: number, n: string) => [`${v.toLocaleString('nb-NO')} kr`, n]}
                    labelFormatter={(y) => `År ${y}`}
                  />
                  {dataKeys.map((k, i) => (
                    <Line key={k} type="monotone" dataKey={k} stroke={COLORS[i % COLORS.length]} strokeWidth={2} dot={{ r: 3 }} />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="mt-3 space-y-1">
              {dataKeys.map((k, i) => {
                const vals = data.map(d => d[k] as number).filter(v => v);
                if (vals.length < 2) return null;
                const økning = vals[vals.length-1] - vals[0];
                const pct = (økning / vals[0]) * 100;
                return (
                  <div key={k} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      {k}
                    </span>
                    <span className="text-muted-foreground">
                      <span className="font-medium text-foreground">{vals[vals.length-1].toLocaleString('nb-NO')} kr</span>
                      <span className={økning >= 0 ? 'text-green-600' : 'text-red-600'}> · +{pct.toFixed(1)}%</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default YrkeSalaryChart;
