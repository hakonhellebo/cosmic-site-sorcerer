import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Search, DollarSign, ChevronDown, Check, TrendingUp } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { cn } from "@/lib/utils";
import SalaryTrendChart from './SalaryTrendChart';

// Use the correct EdPath backend URL (without /lonn/ at the end)
const API_BASE_URL = 'https://edpath-backend-production.up.railway.app';

const SalarySearch = () => {
  const [yrke, setYrke] = useState('');
  const [kjonn, setKjonn] = useState('');
  const [tid, setTid] = useState('');
  const [sektor, setSektor] = useState('');
  const [result, setResult] = useState<SalaryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [yrkeOptions, setYrkeOptions] = useState<YrkeOption[]>([]);
  const [loadingYrker, setLoadingYrker] = useState(false);
  const [yrkeDropdownOpen, setYrkeDropdownOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState<string>('Tester tilkobling...');

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

  // Load occupations from API
  const loadYrkeOptions = async () => {
    try {
      setLoadingYrker(true);
      setApiStatus('Henter yrker fra API...');
      
      const response = await fetch(`${API_BASE_URL}/lonn/`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`API feil: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('API response:', data);
      
      // Extract unique occupations from the data
      const uniqueYrker = [...new Set(data.map((item: any) => item.Yrke))];
      const options = uniqueYrker.map(yrke => ({
        value: yrke as string,
        label: yrke as string
      }));
      
      setYrkeOptions(options);
      setApiStatus(`✅ API tilkoblet - ${options.length} yrker lastet`);
      
    } catch (err) {
      console.error('Error loading yrker:', err);
      const errorMessage = err instanceof Error ? err.message : 'Ukjent feil';
      setApiStatus(`❌ API feil: ${errorMessage}`);
      setError(`Kunne ikke laste yrker: ${errorMessage}`);
    } finally {
      setLoadingYrker(false);
    }
  };

  // Load occupations when component mounts
  useEffect(() => {
    loadYrkeOptions();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('Starting search with filters:', { yrke, kjonn, tid, sektor });
      
      // Build query parameters
      const params = new URLSearchParams();
      if (yrke) params.append('yrke', yrke);
      if (kjonn) params.append('kjonn', kjonn);
      if (tid) params.append('tid', tid);
      if (sektor) params.append('sektor', sektor);

      const url = `${API_BASE_URL}/lonn/?${params.toString()}`;
      console.log('Search URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`API feil: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Search response:', data);
      
      // Check if data is a valid object with required fields
      if (data && typeof data === 'object' && data.Yrke && data.value !== undefined) {
        setResult(data);
      } else {
        setError('Ingen resultater funnet for de valgte kriteriene');
      }
      
    } catch (err) {
      console.error('Search error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Ukjent feil';
      setError(`Søk feilet: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const hasFilters = yrke || kjonn || tid || sektor;

  return (
    <div className="space-y-6">
      <Tabs defaultValue="single" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="single" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Enkelt søk
          </TabsTrigger>
          <TabsTrigger value="trend" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Lønnsutvikling
          </TabsTrigger>
        </TabsList>

        <TabsContent value="single">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Lønnssøk
              </CardTitle>
              <CardDescription>
                Søk etter lønnsdata basert på yrke, kjønn, år og sektor
              </CardDescription>
              <div className="text-sm text-muted-foreground">
                API Status: {apiStatus}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Yrke</label>
                  <Popover open={yrkeDropdownOpen} onOpenChange={setYrkeDropdownOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={yrkeDropdownOpen}
                        className="w-full justify-between"
                        disabled={loadingYrker}
                      >
                        {yrke ? yrke : "Velg yrke..."}
                        {loadingYrker ? (
                          <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                        ) : (
                          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        )}
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
                  {yrkeOptions.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {yrkeOptions.length} yrker tilgjengelig
                    </p>
                  )}
                  {error && (
                    <p className="text-xs text-red-600">
                      {error}
                    </p>
                  )}
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
                  <label className="text-sm font-medium">År</label>
                  <Select value={tid} onValueChange={setTid}>
                    <SelectTrigger>
                      <SelectValue placeholder="Velg år" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
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
                  onClick={handleSearch} 
                  disabled={loading || !hasFilters}
                  className="flex items-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                  Søk
                </Button>
                
                {hasFilters && (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setYrke('');
                      setKjonn('');
                      setTid('');
                      setSektor('');
                      setResult(null);
                      setError(null);
                    }}
                  >
                    Nullstill
                  </Button>
                )}
              </div>

              {!hasFilters && (
                <p className="text-sm text-muted-foreground">
                  Fyll ut minst ett filter for å søke etter lønnsdata.
                </p>
              )}
            </CardContent>
          </Card>

          {result && (
            <Card>
              <CardHeader>
                <CardTitle>Søkeresultat</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <span className="text-sm text-muted-foreground">Yrke:</span>
                      <p className="font-medium">{result.Yrke}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Kjønn:</span>
                      <p className="font-medium">{result.Kjonn}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">År:</span>
                      <p className="font-medium">{result.Tid}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Sektor:</span>
                      <p className="font-medium">{result.Sektor}</p>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="text-center">
                      <span className="text-sm text-muted-foreground">Lønn:</span>
                      <div className="text-3xl font-bold text-green-600">
                        {result.value ? result.value.toLocaleString('nb-NO') : 'N/A'} kr
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="trend">
          <SalaryTrendChart yrkeOptions={yrkeOptions} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalarySearch;
