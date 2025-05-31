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
const API_BASE_URL = 'https://edpath-backend-production.up.railway.app/lonn/';

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

  // Test API connection with detailed logging
  const testApiConnection = async () => {
    try {
      console.log('=== DEBUGGING API CONNECTION ===');
      console.log('API Base URL:', API_BASE_URL);
      console.log('Full URL being fetched:', `${API_BASE_URL}/lonn/`);
      console.log('Current domain:', window.location.origin);
      console.log('User agent:', navigator.userAgent);
      
      setApiStatus('Tester tilkobling til EdPath backend...');
      
      // Check if we can reach the base URL first
      console.log('Testing base URL connectivity...');
      
      const testUrl = `${API_BASE_URL}/lonn/`;
      console.log('Making fetch request to:', testUrl);
      
      const response = await fetch(testUrl, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Response received:');
      console.log('- Status:', response.status);
      console.log('- Status Text:', response.statusText);
      console.log('- OK:', response.ok);
      console.log('- Type:', response.type);
      console.log('- URL:', response.url);
      console.log('- Headers:');
      
      response.headers.forEach((value, key) => {
        console.log(`  ${key}: ${value}`);
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      console.log('Parsing JSON response...');
      const data = await response.json();
      console.log('Parsed data type:', typeof data);
      console.log('Is array:', Array.isArray(data));
      console.log('Data length:', data?.length);
      console.log('First few items:', data?.slice(0, 3));
      
      if (!Array.isArray(data)) {
        throw new Error('API returnerte ikke en array med data');
      }
      
      // Extract unique occupations from the data
      const uniqueYrker = [...new Set(data.map((item: any) => item.Yrke))].filter(Boolean);
      const yrkeOptions = uniqueYrker.map((yrke: string) => ({
        value: yrke,
        label: yrke
      }));
      
      console.log('Unique occupations found:', uniqueYrker.length);
      console.log('Sample occupations:', uniqueYrker.slice(0, 5));
      
      setYrkeOptions(yrkeOptions);
      setApiStatus(`✅ API tilkoblet - ${yrkeOptions.length} yrker lastet`);
      console.log('=== API CONNECTION SUCCESS ===');
      
    } catch (err) {
      console.log('=== API CONNECTION FAILED ===');
      console.error('Full error object:', err);
      console.error('Error name:', err?.name);
      console.error('Error message:', err?.message);
      console.error('Error stack:', err?.stack);
      
      if (err instanceof TypeError && err.message.includes('fetch')) {
        console.error('This is likely a network connectivity issue');
      }
      
      const errorMessage = err instanceof Error ? err.message : 'Ukjent feil';
      setApiStatus(`❌ API feil: ${errorMessage}`);
      
      // Use fallback data for testing
      console.log('Using fallback test data...');
      const mockYrker = [
        'Sykepleier',
        'Ingeniør',
        'Lærer',
        'Advokat',
        'Lege',
        'Regnskapsfører',
        'IT-konsulent',
        'Prosjektleder',
        'Elektriker',
        'Rørlegger'
      ];
      
      const mockOptions = mockYrker.map(yrke => ({
        value: yrke,
        label: yrke
      }));
      
      setYrkeOptions(mockOptions);
      setError(`API utilgjengelig: ${errorMessage}. Bruker testdata.`);
      console.log('=== FALLBACK DATA LOADED ===');
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
      console.log('=== STARTING SEARCH ===');
      console.log('Search filters:', { yrke, kjonn, tid, sektor });
      
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
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Search response status:', response.status);
      console.log('Search response ok:', response.ok);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Search result data:', data);
      
      // If data is an array, take the first result
      const firstResult = Array.isArray(data) ? data[0] : data;
      
      if (!firstResult || firstResult.value === null) {
        setError('Ingen data funnet for de valgte kriteriene');
        return;
      }
      
      setResult(firstResult);
      console.log('=== SEARCH SUCCESS ===');
    } catch (err) {
      console.log('=== SEARCH FAILED ===');
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
    </div>
  );
};

export default SalarySearch;
