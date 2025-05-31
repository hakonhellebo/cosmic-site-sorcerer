
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Search, DollarSign } from "lucide-react";
import { Badge } from '@/components/ui/badge';

interface SalaryResult {
  Yrke: string;
  Kjonn: string;
  Tid: number;
  Sektor: string;
  value: number;
}

const SalarySearch = () => {
  const [yrke, setYrke] = useState('');
  const [kjonn, setKjonn] = useState('');
  const [tid, setTid] = useState('');
  const [sektor, setSektor] = useState('');
  const [result, setResult] = useState<SalaryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Build query parameters
      const params = new URLSearchParams();
      if (yrke) params.append('yrke', yrke);
      if (kjonn) params.append('kjonn', kjonn);
      if (tid) params.append('tid', tid);
      if (sektor) params.append('sektor', sektor);

      // Use localhost for development, replace with your actual API URL for production
      const baseUrl = process.env.NODE_ENV === 'development' 
        ? 'http://localhost:8005' 
        : 'https://[mitt-api-url]:8005';
      
      const url = `${baseUrl}/lonn/?${params.toString()}`;
      
      console.log('Fetching salary data from:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Salary data received:', data);
      
      setResult(data);
    } catch (err) {
      console.error('Error fetching salary data:', err);
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
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Yrke</label>
              <Input
                placeholder="F.eks. Sykepleier, Administrerende direktører"
                value={yrke}
                onChange={(e) => setYrke(e.target.value)}
              />
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

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="text-red-800">
              <h4 className="font-semibold mb-2">Feil ved søk:</h4>
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

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
                    {result.value.toLocaleString('nb-NO')} kr
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
