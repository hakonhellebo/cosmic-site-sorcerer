import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Search, DollarSign, ChevronDown, Check, TrendingUp, Calendar, X, BarChart3, TableIcon, Plus } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { cn } from "@/lib/utils";
import SalaryTrendChart from './SalaryTrendChart';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

// Use the correct EdPath backend URL (without /lonn/ at the end)
const API_BASE_URL = 'https://edpath-backend-production.up.railway.app';

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

interface ComparisonData {
  year: number;
  [key: string]: number; // Dynamic keys for different occupations
}

const SalarySearch = () => {
  const [selectedYrker, setSelectedYrker] = useState<string[]>([]);
  const [kjonn, setKjonn] = useState('');
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [sektor, setSektor] = useState('');
  const [results, setResults] = useState<SalaryResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [yrkeOptions, setYrkeOptions] = useState<YrkeOption[]>([]);
  const [loadingYrker, setLoadingYrker] = useState(false);
  const [yrkeDropdownOpen, setYrkeDropdownOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState<string>('Tester tilkobling...');
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');

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

  // Color palette for different occupations
  const colors = [
    'hsl(220, 70%, 50%)', // Blue
    'hsl(142, 76%, 36%)', // Green
    'hsl(0, 84%, 60%)',   // Red
    'hsl(262, 83%, 58%)', // Purple
    'hsl(32, 95%, 44%)',  // Orange
    'hsl(186, 100%, 47%)', // Cyan
    'hsl(45, 93%, 47%)',  // Yellow
    'hsl(340, 82%, 52%)', // Pink
  ];

  // Load occupations from API with improved error handling
  const loadYrkeOptions = async () => {
    try {
      setLoadingYrker(true);
      setApiStatus('Henter yrker fra API...');
      
      console.log('Attempting to connect to API:', `${API_BASE_URL}/lonn/`);
      
      // Try multiple API endpoints to find working one
      const endpoints = [
        `${API_BASE_URL}/lonn/`,
        `${API_BASE_URL}/lonn`,
        `${API_BASE_URL}/api/lonn/`,
        `${API_BASE_URL}/api/lonn`
      ];
      
      let response;
      let workingEndpoint = '';
      
      for (const endpoint of endpoints) {
        try {
          console.log(`Trying endpoint: ${endpoint}`);
          response = await fetch(endpoint, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          });
          
          if (response.ok) {
            workingEndpoint = endpoint;
            console.log(`Working endpoint found: ${endpoint}`);
            break;
          }
        } catch (err) {
          console.log(`Endpoint ${endpoint} failed:`, err);
          continue;
        }
      }
      
      if (!response || !response.ok) {
        throw new Error(`Alle API-endepunkter feilet. Siste status: ${response?.status || 'Ingen respons'}`);
      }
      
      const data = await response.json();
      console.log('API response data:', data);
      console.log('Data type:', typeof data, 'Is array:', Array.isArray(data));
      
      if (!data) {
        throw new Error('API returnerte tom respons');
      }
      
      let uniqueYrker = [];
      
      if (Array.isArray(data)) {
        uniqueYrker = [...new Set(data.map((item: any) => item.Yrke).filter(Boolean))];
      } else if (data.results && Array.isArray(data.results)) {
        uniqueYrker = [...new Set(data.results.map((item: any) => item.Yrke).filter(Boolean))];
      } else if (data.data && Array.isArray(data.data)) {
        uniqueYrker = [...new Set(data.data.map((item: any) => item.Yrke).filter(Boolean))];
      } else {
        // Fallback: create some test options
        console.warn('Unexpected data format, using fallback options');
        uniqueYrker = [
          'Sykepleiere',
          'Leger',
          'Lærere',
          'Ingeniører',
          'IT-konsulenter',
          'Økonomer',
          'Advokater',
          'Arkitekter'
        ];
      }
      
      console.log('Unique occupations found:', uniqueYrker.length);
      
      if (uniqueYrker.length === 0) {
        throw new Error('Ingen yrker funnet i API-data');
      }
      
      const options = uniqueYrker.map(yrke => ({
        value: yrke as string,
        label: yrke as string
      }));
      
      setYrkeOptions(options);
      setApiStatus(`✅ API tilkoblet - ${options.length} yrker lastet (${workingEndpoint})`);
      
    } catch (err) {
      console.error('Error loading yrker:', err);
      const errorMessage = err instanceof Error ? err.message : 'Ukjent feil';
      setApiStatus(`❌ API feil: ${errorMessage}`);
      
      // Set fallback options so users can still test
      const fallbackOptions = [
        'Sykepleiere',
        'Leger',
        'Lærere',
        'Ingeniører',
        'IT-konsulenter',
        'Økonomer',
        'Advokater',
        'Arkitekter'
      ].map(yrke => ({ value: yrke, label: yrke }));
      
      setYrkeOptions(fallbackOptions);
      setError(`API-tilkobling feilet. Bruker test-data. Feil: ${errorMessage}`);
    } finally {
      setLoadingYrker(false);
    }
  };

  // Load occupations when component mounts
  useEffect(() => {
    loadYrkeOptions();
  }, []);

  const handleYrkeAdd = (yrke: string) => {
    if (!selectedYrker.includes(yrke) && selectedYrker.length < 8) {
      setSelectedYrker([...selectedYrker, yrke]);
    }
    setYrkeDropdownOpen(false);
  };

  const handleYrkeRemove = (yrke: string) => {
    setSelectedYrker(selectedYrker.filter(y => y !== yrke));
  };

  const handleYearToggle = (year: string) => {
    setSelectedYears(prev => 
      prev.includes(year) 
        ? prev.filter(y => y !== year)
        : [...prev, year]
    );
  };

  const handleSelectAllYears = () => {
    if (selectedYears.length === years.length) {
      // If all years are selected, deselect all
      setSelectedYears([]);
    } else {
      // Select all years
      setSelectedYears(years.map(year => year.toString()));
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      console.log('Starting search with filters:', { selectedYrker, kjonn, selectedYears, sektor });
      
      const allResults: SalaryResult[] = [];

      // Search for each selected occupation
      for (const yrke of selectedYrker) {
        const params = new URLSearchParams();
        params.append('yrke', yrke);
        if (kjonn) params.append('kjonn', kjonn);
        if (sektor) params.append('sektor', sektor);
        
        // Add multiple years
        selectedYears.forEach(year => {
          params.append('tid', year);
        });

        const url = `${API_BASE_URL}/lonn/?${params.toString()}`;
        console.log('Search URL for', yrke, ':', url);
        
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
        console.log('Search response for', yrke, ':', data);
        
        // Handle array response (multiple years)
        if (Array.isArray(data) && data.length > 0) {
          const mappedResults = data.map(item => ({
            Yrke: yrke,
            Kjonn: kjonn || 'Ikke spesifisert', 
            Tid: item.Tid,
            Sektor: sektor || 'Ikke spesifisert',
            value: item.value
          }));
          allResults.push(...mappedResults);
        }
      }

      if (allResults.length > 0) {
        // Sort by year for better visualization
        allResults.sort((a, b) => a.Tid - b.Tid);
        setResults(allResults);
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

  const hasFilters = selectedYrker.length > 0 || kjonn || selectedYears.length > 0 || sektor;

  // Prepare chart data for comparison visualization
  const prepareComparisonData = (): ComparisonData[] => {
    const dataByYear: { [year: number]: ComparisonData } = {};
    
    results.forEach(result => {
      if (!dataByYear[result.Tid]) {
        dataByYear[result.Tid] = { year: result.Tid };
      }
      dataByYear[result.Tid][result.Yrke] = result.value;
    });
    
    return Object.values(dataByYear).sort((a, b) => a.year - b.year);
  };

  const comparisonData = prepareComparisonData();
  const uniqueOccupations = [...new Set(results.map(r => r.Yrke))];

  const chartConfig = uniqueOccupations.reduce((config, occupation, index) => {
    config[occupation] = {
      label: occupation,
      color: colors[index % colors.length],
    };
    return config;
  }, {} as any);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="single" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="single" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Lønnssøk & Sammenligning
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
                Lønnssøk & Sammenligning
              </CardTitle>
              <CardDescription>
                Søk og sammenlign lønnsdata mellom forskjellige yrker, kjønn, år og sektorer. Velg flere yrker for å sammenligne.
              </CardDescription>
              <div className="text-sm text-muted-foreground">
                API Status: {apiStatus}
              </div>
              {loadingYrker && (
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Laster yrker...
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Yrker (velg opptil 8 for sammenligning)</label>
                  <div className="space-y-2">
                    <Popover open={yrkeDropdownOpen} onOpenChange={setYrkeDropdownOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={yrkeDropdownOpen}
                          className="w-full justify-between"
                          disabled={loadingYrker || selectedYrker.length >= 8}
                        >
                          <div className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            {selectedYrker.length === 0 ? "Legg til yrke..." : `Legg til yrke (${selectedYrker.length}/8)`}
                          </div>
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
                              {yrkeOptions
                                .filter(option => !selectedYrker.includes(option.value))
                                .map((option) => (
                                <CommandItem
                                  key={option.value}
                                  onSelect={() => handleYrkeAdd(option.value)}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4 opacity-0"
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
                    
                    {selectedYrker.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {selectedYrker.map((yrke, index) => (
                          <Badge 
                            key={yrke} 
                            variant="secondary" 
                            className="flex items-center gap-1"
                            style={{ 
                              backgroundColor: `${colors[index % colors.length]}20`,
                              borderColor: colors[index % colors.length],
                              color: colors[index % colors.length]
                            }}
                          >
                            {yrke}
                            <X 
                              className="h-3 w-3 cursor-pointer hover:opacity-70" 
                              onClick={() => handleYrkeRemove(yrke)}
                            />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {selectedYears.length === 0 
                            ? "Velg år..." 
                            : `${selectedYears.length} år valgt`
                          }
                        </div>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-white border shadow-lg z-50">
                      <DropdownMenuLabel>Velg år</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuCheckboxItem
                        checked={selectedYears.length === years.length}
                        onCheckedChange={handleSelectAllYears}
                        className="font-medium"
                      >
                        {selectedYears.length === years.length ? "Fjern alle år" : "Velg alle år"}
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuSeparator />
                      {years.map((year) => (
                        <DropdownMenuCheckboxItem
                          key={year}
                          checked={selectedYears.includes(year.toString())}
                          onCheckedChange={() => handleYearToggle(year.toString())}
                        >
                          {year}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {selectedYears.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedYears.map(year => (
                        <Badge key={year} variant="secondary" className="text-xs">
                          {year}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
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
                  disabled={loading || !hasFilters || selectedYears.length === 0 || selectedYrker.length === 0}
                  className="flex items-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                  Søk og sammenlign
                </Button>
                
                {hasFilters && (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSelectedYrker([]);
                      setKjonn('');
                      setSelectedYears([]);
                      setSektor('');
                      setResults([]);
                      setError(null);
                    }}
                  >
                    Nullstill
                  </Button>
                )}
              </div>

              {!hasFilters && (
                <p className="text-sm text-muted-foreground">
                  Velg minst ett yrke og ett år for å søke etter lønnsdata.
                </p>
              )}

              {selectedYears.length === 0 && hasFilters && (
                <p className="text-sm text-orange-600">
                  Velg minst ett år for å kunne søke.
                </p>
              )}

              {selectedYrker.length === 0 && hasFilters && (
                <p className="text-sm text-orange-600">
                  Velg minst ett yrke for å kunne søke.
                </p>
              )}

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {results.length > 0 && (
            <>
              {/* View mode toggle */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Sammenligning av lønn
                      </CardTitle>
                      <CardDescription>
                        {selectedYrker.length > 1 ? `Sammenligning av ${selectedYrker.length} yrker` : selectedYrker[0]}
                        {kjonn && ` - ${kjonn}`}
                        {sektor && ` - ${sektor}`}
                      </CardDescription>
                    </div>
                    <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as 'chart' | 'table')}>
                      <ToggleGroupItem value="chart" aria-label="Graf visning">
                        <BarChart3 className="h-4 w-4" />
                      </ToggleGroupItem>
                      <ToggleGroupItem value="table" aria-label="Tabell visning">
                        <TableIcon className="h-4 w-4" />
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                </CardHeader>
                <CardContent>
                  {viewMode === 'chart' && comparisonData.length > 0 && (
                    <ChartContainer config={chartConfig}>
                      <ResponsiveContainer width="100%" height={400}>
                        <LineChart
                          data={comparisonData}
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
                            formatter={(value: number, name: string) => [`${value.toLocaleString('nb-NO')} kr`, name]}
                            labelFormatter={(year) => `År ${year}`}
                          />
                          {uniqueOccupations.map((occupation, index) => (
                            <Line 
                              key={occupation}
                              type="monotone" 
                              dataKey={occupation} 
                              stroke={colors[index % colors.length]} 
                              strokeWidth={3}
                              dot={{ fill: colors[index % colors.length], stroke: colors[index % colors.length], strokeWidth: 2, r: 6 }}
                              activeDot={{ r: 8, fill: colors[index % colors.length], stroke: 'white', strokeWidth: 2 }}
                              connectNulls={false}
                            />
                          ))}
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  )}

                  {viewMode === 'table' && (
                    <div className="space-y-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>År</TableHead>
                            {uniqueOccupations.map(occupation => (
                              <TableHead key={occupation}>{occupation}</TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {comparisonData.map((yearData) => (
                            <TableRow key={yearData.year}>
                              <TableCell className="font-medium">{yearData.year}</TableCell>
                              {uniqueOccupations.map(occupation => (
                                <TableCell key={occupation}>
                                  {yearData[occupation] ? `${yearData[occupation].toLocaleString('nb-NO')} kr` : 'N/A'}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                  
                  {/* Legend */}
                  <div className="mt-6 flex flex-wrap gap-4">
                    {uniqueOccupations.map((occupation, index) => (
                      <div key={occupation} className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: colors[index % colors.length] }}
                        ></div>
                        <span className="text-sm">{occupation}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
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
