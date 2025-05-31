
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Loader2, Search, DollarSign, ChevronDown, Check } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { cn } from "@/lib/utils";

interface SalaryResult {
  Yrke: string;
  Kjonn: string;
  Tid: number;
  Sektor: string;
  value: number;
}

interface YrkeOption {
  value: string;
  label: string;
}

// Use the correct EdPath backend URL
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

  // Test API connection
  const testApiConnection = async () => {
    try {
      console.log('Testing EdPath backend API connection...');
      setApiStatus('Tester tilkobling til EdPath backend...');
      
      // First test the base URL
      const baseResponse = await fetch(`${API_BASE_URL}/`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      console.log('EdPath backend response status:', baseResponse.status);
      setApiStatus(`EdPath backend tilgjengelig (${baseResponse.status})`);
      
      // Then test the /lonn endpoint
      await fetchYrkeOptions();
      
    } catch (err) {
      console.error('EdPath backend connection failed:', err);
      setApiStatus(`EdPath backend utilgjengelig: ${err instanceof Error ? err.message : 'Ukjent feil'}`);
      
      // Fallback: Use mock data for testing
      console.log('Using mock data as fallback...');
      const mockYrker = [
        'Sykepleier',
        'Ingeniør',
        'Lærer',
        'Advokat',
        'Lege',
        'Regnskapsfører',
        'IT-konsulent',
        'Prosjektleder'
      ];
      
      const mockOptions = mockYrker.map(yrke => ({
        value: yrke,
        label: yrke
      }));
      
      setYrkeOptions(mockOptions);
      setApiStatus('Bruker testdata (EdPath backend utilgjengelig)');
    }
  };

  // Fetch unique occupations from the API
  const fetchYrkeOptions = async () => {
    setLoadingYrker(true);
    setError(null);
    try {
      console.log('Fetching yrker from EdPath backend...');
      
      const response = await fetch(`${API_BASE_URL}/lonn/`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      console.log('EdPath backend response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        throw new Error(`EdPath backend API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Fetched salary data from EdPath backend:', data);
      console.log('Number of records:', data.length);
      
      if (!Array.isArray(data)) {
        throw new Error('EdPath backend returnerte ikke en array');
      }
      
      // Extract unique occupations from the data
      const uniqueYrker = [...new Set(data.map((item: any) => item.Yrke))].filter(Boolean);
      const yrkeOptions = uniqueYrker.map((yrke: string) => ({
        value: yrke,
        label: yrke
      }));
      
      console.log('Unique occupations found:', uniqueYrker.length);
      console.log('First 5 occupations:', uniqueYrker.slice(0, 5));
      
      setYrkeOptions(yrkeOptions);
      setApiStatus(`${yrkeOptions.length} yrker lastet fra EdPath backend`);
    } catch (err) {
      console.error('Error fetching occupations from EdPath backend:', err);
      const errorMessage = err instanceof Error ? err.message : 'Ukjent feil';
      setError('Kunne ikke laste yrker: ' + errorMessage);
      setApiStatus(`Feil: ${errorMessage}`);
      throw err; // Re-throw to be caught by testApiConnection
    } finally {
      setLoadingYrker(false);
    }
  };

  // Load occupations when component mounts
  useEffect(() => {
    testApiConnection();
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
      
      console.log('Fetching salary data from EdPath backend:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`EdPath backend API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Salary data received from EdPath backend:', data);
      
      // If data is an array, take the first result
      const firstResult = Array.isArray(data) ? data[0] : data;
      setResult(firstResult);
    } catch (err) {
      console.error('Error fetching salary data from EdPath backend:', err);
      setError(err instanceof Error ? err.message : 'Ukjent feil oppstod');
    } finally {
      setLoading(false);
    }
  };

  const hasFilters = yrke || kjonn || tid || sektor;

  return (
    <div className="space-y-6">
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
              {loadingYrker && (
                <p className="text-xs text-muted-foreground">Laster yrker fra backend...</p>
              )}
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
    </div>
  );
};

export default SalarySearch;
