import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Loader2, TrendingUp, ChevronDown, Check } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { cn } from "@/lib/utils";

interface YrkeOption {
  value: string;
  label: string;
}

interface TrendData {
  year: number;
  salary: number;
}

const API_BASE_URL = 'https://edpath-backend-production.up.railway.app';

interface SalaryTrendChartProps {
  yrkeOptions: YrkeOption[];
}

const SalaryTrendChart: React.FC<SalaryTrendChartProps> = ({ yrkeOptions }) => {
  const [yrke, setYrke] = useState('');
  const [kjonn, setKjonn] = useState('');
  const [sektor, setSektor] = useState('');
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [yrkeDropdownOpen, setYrkeDropdownOpen] = useState(false);

  const years = Array.from({ length: 7 }, (_, i) => 2018 + i); // 2018-2024

  const genderOptions = [
    { value: 'Menn', label: 'Menn' },
    { value: 'Kvinner', label: 'Kvinner' },
    { value: 'Begge kjønn', label: 'Begge kjønn' }
  ];

  const sectorOptions = [
    { value: 'Sum alle sektorer', label: 'Sum alle sektorer' },
    { value: 'Privat sektor og offentlige eide foretak', label: 'Privat sektor og offentlige eide foretak' },
    { value: 'Statsforvaltningen', label: 'Statsforvaltningen' },
    { value: 'Kommune og fylkeskommune', label: 'Kommune og fylkeskommune' }
  ];

  const fetchSalaryTrend = async () => {
    if (!yrke) {
      setError('Velg et yrke for å se lønnsutvikling');
      return;
    }

    setLoading(true);
    setError(null);
    setTrendData([]);

    try {
      console.log('Fetching salary trend for:', { yrke, kjonn, sektor });
      
      // Try multiple endpoints like in SalarySearch
      const baseEndpoints = [
        `${API_BASE_URL}/lonn/`,
        `${API_BASE_URL}/lonn`,
        `${API_BASE_URL}/api/lonn/`,
        `${API_BASE_URL}/api/lonn`
      ];
      
      const promises = years.map(async (year) => {
        const params = new URLSearchParams();
        params.append('yrke', yrke);
        if (kjonn) params.append('kjonn', kjonn);
        params.append('tid', year.toString());
        if (sektor) params.append('sektor', sektor);

        // Try each endpoint until one works
        for (const baseUrl of baseEndpoints) {
          try {
            const url = `${baseUrl}?${params.toString()}`;
            console.log(`Fetching data for year ${year}:`, url);
            
            const response = await fetch(url, {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
            });
            
            if (!response.ok) {
              console.warn(`Failed to fetch data for ${year} from ${baseUrl}: ${response.status}`);
              continue;
            }
            
            const data = await response.json();
            console.log(`Data for year ${year}:`, data);
            
            if (data && typeof data === 'object' && data.value !== undefined) {
              return {
                year: year,
                salary: data.value
              };
            }
            
            // Handle different response formats
            if (Array.isArray(data) && data.length > 0 && data[0].value !== undefined) {
              return {
                year: year,
                salary: data[0].value
              };
            }
            
          } catch (err) {
            console.warn(`Error fetching from ${baseUrl} for year ${year}:`, err);
            continue;
          }
        }
        
        console.warn(`No working endpoint found for year ${year}`);
        return null;
      });

      const results = await Promise.all(promises);
      const validResults = results.filter((result): result is TrendData => result !== null);
      
      console.log('Valid trend results:', validResults);
      
      if (validResults.length === 0) {
        setError('Ingen data funnet for de valgte kriteriene. API-en kan være utilgjengelig.');
      } else {
        validResults.sort((a, b) => a.year - b.year);
        setTrendData(validResults);
      }
      
    } catch (err) {
      console.error('Error fetching salary trend:', err);
      const errorMessage = err instanceof Error ? err.message : 'Ukjent feil';
      setError(`Feil ved henting av data: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const chartConfig = {
    salary: {
      label: "Lønn",
      color: "#3b82f6", // Blue color
    },
  };

  const hasFilters = yrke;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Lønnsutvikling over tid
          </CardTitle>
          <CardDescription>
            Se hvordan lønnen har utviklet seg fra 2018 til 2024
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Yrke *</label>
              <Popover open={yrkeDropdownOpen} onOpenChange={setYrkeDropdownOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={yrkeDropdownOpen}
                    className="w-full justify-between"
                  >
                    {yrke ? yrke : "Velg yrke..."}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 bg-white border shadow-lg z-50" style={{ width: 'var(--radix-popover-trigger-width)' }}>
                  <Command>
                    <CommandInput placeholder="Søk etter yrke..." />
                    <CommandList>
                      <CommandEmpty>Ingen yrker funnet.</CommandEmpty>
                      <CommandGroup>
                        {yrkeOptions.map((option) => (
                          <CommandItem
                            key={option.value}
                            onSelect={() => {
                              setYrke(option.value);
                              setYrkeDropdownOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                yrke === option.value ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {option.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Kjønn</label>
              <Select value={kjonn} onValueChange={setKjonn}>
                <SelectTrigger>
                  <SelectValue placeholder="Velg kjønn" />
                </SelectTrigger>
                <SelectContent>
                  {genderOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sektor</label>
              <Select value={sektor} onValueChange={setSektor}>
                <SelectTrigger>
                  <SelectValue placeholder="Velg sektor" />
                </SelectTrigger>
                <SelectContent>
                  {sectorOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button 
              onClick={fetchSalaryTrend} 
              disabled={loading || !hasFilters}
              className="flex items-center gap-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <TrendingUp className="h-4 w-4" />
              )}
              Vis lønnsutvikling
            </Button>
            
            {hasFilters && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setYrke('');
                  setKjonn('');
                  setSektor('');
                  setTrendData([]);
                  setError(null);
                }}
              >
                Nullstill
              </Button>
            )}
          </div>

          {!hasFilters && (
            <p className="text-sm text-muted-foreground">
              Velg minst et yrke for å se lønnsutvikling over tid.
            </p>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {trendData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Lønnsutvikling: {yrke}</CardTitle>
            <CardDescription>
              {kjonn && `${kjonn} • `}
              {sektor && `${sektor} • `}
              2018-2024
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={trendData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="year" 
                    type="number"
                    scale="linear"
                    domain={['dataMin', 'dataMax']}
                  />
                  <YAxis 
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    formatter={(value: number) => [`${value.toLocaleString('nb-NO')} kr`, 'Månedslønn']}
                    labelFormatter={(year) => `År ${year}`}
                  />
                  <Bar 
                    dataKey="salary" 
                    fill="var(--color-salary)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
            
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {trendData.length > 1 && (
                <>
                  <div>
                    <span className="text-muted-foreground">Start månedslønn ({trendData[0].year}):</span>
                    <p className="font-semibold">{trendData[0].salary.toLocaleString('nb-NO')} kr</p>
                    <span className="text-xs text-muted-foreground">Årslønn: {(trendData[0].salary * 12).toLocaleString('nb-NO')} kr</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Siste månedslønn ({trendData[trendData.length - 1].year}):</span>
                    <p className="font-semibold">{trendData[trendData.length - 1].salary.toLocaleString('nb-NO')} kr</p>
                    <span className="text-xs text-muted-foreground">Årslønn: {(trendData[trendData.length - 1].salary * 12).toLocaleString('nb-NO')} kr</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Total økning (måned):</span>
                    <p className="font-semibold text-green-600">
                      +{(trendData[trendData.length - 1].salary - trendData[0].salary).toLocaleString('nb-NO')} kr
                    </p>
                    <span className="text-xs text-muted-foreground">
                      Årlig: +{((trendData[trendData.length - 1].salary - trendData[0].salary) * 12).toLocaleString('nb-NO')} kr
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Økning %:</span>
                    <p className="font-semibold text-green-600">
                      +{(((trendData[trendData.length - 1].salary - trendData[0].salary) / trendData[0].salary) * 100).toFixed(1)}%
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SalaryTrendChart;
