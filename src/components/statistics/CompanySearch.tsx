
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Building, Search, Users, DollarSign, MapPin, ExternalLink, Loader2 } from 'lucide-react';

interface Company {
  Selskap: string;
  Hovedbransje: string;
  Beskrivelse: string;
  Lokasjon: string;
  Ansatte: string;
  'Driftsinntekter (MNOK)': string;
  Geografi: string;
  Linker: string;
  Karriereportal: string;
}

interface PreloadedData {
  companies: Company[];
  loading: boolean;
}

interface CompanySearchProps {
  preloadedData?: PreloadedData;
}

type SortField = 'name' | 'employees' | 'revenue';
type SortDirection = 'asc' | 'desc';

const CompanySearch: React.FC<CompanySearchProps> = ({ preloadedData }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [sortField, setSortField] = useState<SortField>('employees');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);

  // Use preloaded data if available
  const companies = preloadedData?.companies || [];
  const dataLoading = preloadedData?.loading || false;

  // Extract unique industries from preloaded data
  const industries = [...new Set(
    companies
      .map(company => company.Hovedbransje)
      .filter(Boolean)
      .sort()
  )];

  // Helper function to parse employee count for sorting
  const parseEmployeeCount = (employeeStr: string): number => {
    if (!employeeStr) return 0;
    
    const cleanStr = employeeStr.replace(/[^\d-]/g, '');
    if (cleanStr.includes('-')) {
      const [min, max] = cleanStr.split('-').map(Number);
      return Math.floor((min + max) / 2);
    }
    
    const num = parseInt(cleanStr);
    return isNaN(num) ? 0 : num;
  };

  // Helper function to parse revenue for sorting
  const parseRevenue = (revenueStr: string): number => {
    if (!revenueStr) return 0;
    const cleanStr = revenueStr.replace(/[^\d,.]/g, '').replace(',', '.');
    const num = parseFloat(cleanStr);
    return isNaN(num) ? 0 : num;
  };

  // Sort companies based on selected criteria
  const sortCompanies = (companiesToSort: Company[]): Company[] => {
    return [...companiesToSort].sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'name':
          comparison = (a.Selskap || '').localeCompare(b.Selskap || '');
          break;
        case 'employees':
          comparison = parseEmployeeCount(a.Ansatte) - parseEmployeeCount(b.Ansatte);
          break;
        case 'revenue':
          comparison = parseRevenue(a['Driftsinntekter (MNOK)']) - parseRevenue(b['Driftsinntekter (MNOK)']);
          break;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  };

  // Filter and sort companies
  const filterAndSortCompanies = () => {
    setLoading(true);
    
    let filtered = companies;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(company => 
        company.Selskap?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.Hovedbransje?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.Beskrivelse?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply industry filter
    if (selectedIndustry !== 'all') {
      filtered = filtered.filter(company => company.Hovedbransje === selectedIndustry);
    }
    
    // Apply sorting
    filtered = sortCompanies(filtered);
    
    setFilteredCompanies(filtered);
    setLoading(false);
  };

  // Filter and sort when dependencies change
  useEffect(() => {
    if (companies.length > 0) {
      filterAndSortCompanies();
    }
  }, [companies, searchTerm, selectedIndustry, sortField, sortDirection]);

  // Initial sort when companies data loads - this will automatically sort by employees desc
  useEffect(() => {
    if (companies.length > 0) {
      filterAndSortCompanies();
    }
  }, [companies]);

  const handleSearch = () => {
    filterAndSortCompanies();
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedIndustry('all');
    setSortField('employees');
    setSortDirection('desc');
  };

  const handleCompanyClick = (company: Company) => {
    const companySlug = company.Selskap.toLowerCase()
      .replace(/[æåø]/g, (match) => ({ 'æ': 'ae', 'å': 'aa', 'ø': 'o' }[match] || match))
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    navigate(`/bedrift/${companySlug}`, { state: { company } });
  };

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Laster bedrifter...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Data source indicator */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-green-800 text-sm">
          ✅ Viser data hentet fra Bedrifter tabell (forhåndsinnlastet)
        </p>
        <p className="text-green-700 text-xs mt-1">
          Totalt {companies.length} bedrifter hentet fra databasen
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Bedriftssøk
          </CardTitle>
          <CardDescription>
            Søk gjennom {companies.length} norske bedrifter
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Søkeord</label>
              <Input
                placeholder="Søk bedrift, bransje..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Bransje</label>
              <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                <SelectTrigger>
                  <SelectValue placeholder="Velg bransje" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle bransjer</SelectItem>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sorter etter</label>
              <Select value={sortField} onValueChange={(value) => setSortField(value as SortField)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Navn</SelectItem>
                  <SelectItem value="employees">Antall ansatte</SelectItem>
                  <SelectItem value="revenue">Omsetning</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Retning</label>
              <Select value={sortDirection} onValueChange={(value) => setSortDirection(value as SortDirection)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Stigende</SelectItem>
                  <SelectItem value="desc">Synkende</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-4">
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              Søk
            </Button>
            <Button variant="outline" onClick={handleReset}>
              Nullstill
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            Viser {filteredCompanies.length} av {companies.length} bedrifter
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="grid gap-4">
        {filteredCompanies.map((company, index) => (
          <Card 
            key={index} 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleCompanyClick(company)}
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-blue-600 hover:text-blue-800">
                    {company.Selskap}
                  </h3>
                  <Badge variant="secondary" className="mb-2">
                    {company.Hovedbransje}
                  </Badge>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <div className="flex items-center gap-1 mb-1">
                    <MapPin className="h-3 w-3" />
                    {company.Lokasjon}
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {company.Beskrivelse}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">
                    <span className="font-medium">Ansatte:</span> {company.Ansatte || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="text-sm">
                    <span className="font-medium">Omsetning:</span> {company['Driftsinntekter (MNOK)'] || 'N/A'} MNOK
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-purple-600" />
                  <span className="text-sm">
                    <span className="font-medium">Geografi:</span> {company.Geografi || 'N/A'}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                {company.Linker && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    asChild
                    onClick={(e) => e.stopPropagation()}
                  >
                    <a href={company.Linker} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Nettside
                    </a>
                  </Button>
                )}
                {company.Karriereportal && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    asChild
                    onClick={(e) => e.stopPropagation()}
                  >
                    <a href={company.Karriereportal} target="_blank" rel="noopener noreferrer">
                      <Users className="h-3 w-3 mr-1" />
                      Karriere
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCompanies.length === 0 && !loading && !dataLoading && (
        <Card>
          <CardContent className="text-center py-8">
            <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Ingen bedrifter funnet med de valgte kriteriene.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CompanySearch;
