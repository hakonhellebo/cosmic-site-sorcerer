
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Search, BarChart3, ChevronDown, Check, X, Plus } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { cn } from "@/lib/utils";
import { supabase } from '@/lib/supabase';

interface Clean11418Result {
  Tid: number;
  value: number;
  Yrke: string;
  MaaleMetode: string;
  Sektor: string;
  Kjonn: string;
  AvtaltVanlig: string;
  ContentsCode: string;
}

interface YrkeOption {
  value: string;
  label: string;
}

const Clean11418Search = () => {
  const [selectedYrker, setSelectedYrker] = useState<string[]>([]);
  const [kjonn, setKjonn] = useState('');
  const [sektor, setSektor] = useState('');
  const [contentsCode, setContentsCode] = useState('');
  const [results, setResults] = useState<Clean11418Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [yrkeOptions, setYrkeOptions] = useState<YrkeOption[]>([]);
  const [loadingYrker, setLoadingYrker] = useState(false);
  const [yrkeDropdownOpen, setYrkeDropdownOpen] = useState(false);

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

  const contentsCodeOptions = [
    { value: 'Månedslønn (kr)', label: 'Månedslønn' },
    { value: 'Bonus (kr)', label: 'Bonus' },
    { value: 'Overtidstillegg (kr)', label: 'Overtid' },
    { value: 'Alderstillegg (kr)', label: 'Alder' }
  ];

  // Load occupations from database
  const loadYrkeOptions = async () => {
    try {
      setLoadingYrker(true);
      console.log('Loading yrker from Clean_11418...');
      
      const { data, error } = await supabase
        .from('Clean_11418')
        .select('Yrke')
        .eq('Tid', 2024)
        .eq('MaaleMetode', 'Gjennomsnitt')
        .eq('AvtaltVanlig', 'Heltidsansatte')
        .not('Yrke', 'is', null);
      
      if (error) {
        console.error('Error loading yrker:', error);
        setError(`Feil ved lasting av yrker: ${error.message}`);
        return;
      }
      
      const uniqueYrker = [...new Set(data.map(item => item.Yrke))].filter(Boolean);
      console.log(`Found ${uniqueYrker.length} unique yrker`);
      
      const options = uniqueYrker.map(yrke => ({
        value: yrke,
        label: yrke
      }));
      
      setYrkeOptions(options);
      
    } catch (err) {
      console.error('Error loading yrker:', err);
      const errorMessage = err instanceof Error ? err.message : 'Ukjent feil';
      setError(`Feil ved lasting av yrker: ${errorMessage}`);
    } finally {
      setLoadingYrker(false);
    }
  };

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

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      console.log('Starting search with filters:', { selectedYrker, kjonn, sektor, contentsCode, avtaltVanlig: 'Heltidsansatte' });
      
      let query = supabase
        .from('Clean_11418')
        .select('*')
        .eq('Tid', 2024)
        .eq('MaaleMetode', 'Gjennomsnitt')
        .eq('AvtaltVanlig', 'Heltidsansatte');

      if (contentsCode) {
        query = query.eq('ContentsCode', contentsCode);
      }

      if (selectedYrker.length > 0) {
        query = query.in('Yrke', selectedYrker);
      }

      if (kjonn) {
        query = query.eq('Kjonn', kjonn);
      }

      if (sektor) {
        query = query.eq('Sektor', sektor);
      }

      const { data, error } = await query.order('value', { ascending: false });
      
      if (error) {
        throw new Error(`Database feil: ${error.message}`);
      }
      
      console.log('Search response:', data);
      
      if (data && data.length > 0) {
        setResults(data);
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

  const hasFilters = selectedYrker.length > 0 || kjonn || sektor || contentsCode;

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

  const getContentsCodeLabel = (code: string) => {
    const option = contentsCodeOptions.find(opt => opt.value === code);
    return option ? option.label : code;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Clean_11418 Datasett - Lønnsinformasjon 2024 (Heltidsansatte)
          </CardTitle>
          <CardDescription>
            Søk og sammenlign lønnsinformasjon mellom forskjellige yrker for heltidsansatte. Data filtrert for 2024, Gjennomsnitt, og Heltidsansatte.
          </CardDescription>
          {loadingYrker && (
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              Laster yrker...
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2 md:col-span-3">
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
              <label className="text-sm font-medium">Lønnstype</label>
              <Select value={contentsCode} onValueChange={setContentsCode}>
                <SelectTrigger>
                  <SelectValue placeholder="Velg lønnstype" />
                </SelectTrigger>
                <SelectContent>
                  {contentsCodeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              onClick={handleSearch} 
              disabled={loading || !hasFilters}
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
                  setSektor('');
                  setContentsCode('');
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
              Velg minst ett filter for å søke etter data.
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Søkeresultater ({results.length} resultater)
            </CardTitle>
            <CardDescription>
              Lønnsinformasjon for heltidsansatte i 2024 - sortert etter høyeste verdi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Yrke</TableHead>
                    <TableHead>Beløp (kr)</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Kjønn</TableHead>
                    <TableHead>Sektor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((result, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{result.Yrke}</TableCell>
                      <TableCell className="font-mono">
                        {result.value ? `${result.value.toLocaleString('nb-NO')} kr` : 'N/A'}
                      </TableCell>
                      <TableCell>{getContentsCodeLabel(result.ContentsCode)}</TableCell>
                      <TableCell>{result.Kjonn}</TableCell>
                      <TableCell className="text-sm">{result.Sektor}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Clean11418Search;
