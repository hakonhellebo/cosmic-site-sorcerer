
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Building, MapPin, Users, ExternalLink, Filter, SortAsc, SortDesc } from "lucide-react";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

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

type SortField = 'name' | 'employees' | 'revenue';
type SortDirection = 'asc' | 'desc';

const CompanySearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('employees');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch all companies on component mount
  useEffect(() => {
    const fetchCompanies = async () => {
      setInitialLoading(true);
      console.log("Fetching companies from Supabase...");
      
      try {
        const { data, error } = await supabase
          .from('Bedrifter')
          .select('*')
          .order('Selskap', { ascending: true });
        
        if (error) {
          console.error("Error fetching companies:", error);
        } else {
          console.log(`Fetched ${data?.length || 0} companies`);
          setCompanies(data || []);
          
          // Extract unique industries
          const uniqueIndustries = [...new Set(
            (data || [])
              .map(company => company.Hovedbransje)
              .filter(Boolean)
              .sort()
          )];
          setIndustries(uniqueIndustries);
        }
      } catch (err) {
        console.error("Error:", err);
      }
      
      setInitialLoading(false);
    };

    fetchCompanies();
  }, []);

  // Helper function to parse employee count for sorting
  const parseEmployeeCount = (employeeStr: string): number => {
    if (!employeeStr) return 0;
    
    // Handle ranges like "1-10", "11-50", etc.
    const cleanStr = employeeStr.replace(/[^\d-]/g, '');
    if (cleanStr.includes('-')) {
      const [min, max] = cleanStr.split('-').map(Number);
      return Math.floor((min + max) / 2); // Use average for sorting
    }
    
    // Handle single numbers
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

  // Filter and sort companies based on search term, industry, and sort criteria
  useEffect(() => {
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
  }, [searchTerm, selectedIndustry, sortField, sortDirection, companies]);

  const handleCompanyClick = (company: Company) => {
    // Navigate to company profile page with company name as URL parameter
    const companySlug = company.Selskap?.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    navigate(`/bedrift/${companySlug}`, { state: { company } });
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Søk i bedrifter
          </CardTitle>
          <CardDescription>
            Søk blant {companies.length} bedrifter og finn informasjon om bransjer, ansatte og mer
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Søk på firmanavn, bransje eller beskrivelse..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">
                <Filter className="h-4 w-4 inline mr-1" />
                Filtrer på bransje
              </label>
              <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                <SelectTrigger>
                  <SelectValue placeholder="Velg bransje" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle bransjer</SelectItem>
                  {industries.map(industry => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Sorter etter</label>
              <div className="flex gap-2">
                <Button
                  variant={sortField === 'name' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleSort('name')}
                  className="flex-1"
                >
                  Navn
                  {sortField === 'name' && (
                    sortDirection === 'asc' ? <SortAsc className="h-4 w-4 ml-1" /> : <SortDesc className="h-4 w-4 ml-1" />
                  )}
                </Button>
                <Button
                  variant={sortField === 'employees' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleSort('employees')}
                  className="flex-1"
                >
                  Ansatte
                  {sortField === 'employees' && (
                    sortDirection === 'asc' ? <SortAsc className="h-4 w-4 ml-1" /> : <SortDesc className="h-4 w-4 ml-1" />
                  )}
                </Button>
                <Button
                  variant={sortField === 'revenue' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleSort('revenue')}
                  className="flex-1"
                >
                  Inntekt
                  {sortField === 'revenue' && (
                    sortDirection === 'asc' ? <SortAsc className="h-4 w-4 ml-1" /> : <SortDesc className="h-4 w-4 ml-1" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Søkeresultater
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({filteredCompanies.length} av {companies.length} bedrifter)
            </span>
            {selectedIndustry !== 'all' && (
              <span className="text-sm font-normal text-blue-600 ml-2">
                - {selectedIndustry}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {initialLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2">Henter bedrifter...</span>
            </div>
          ) : filteredCompanies.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredCompanies.map((company, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div 
                      className="flex-1 cursor-pointer"
                      onClick={() => handleCompanyClick(company)}
                    >
                      <h3 className="font-semibold text-lg">{company.Selskap}</h3>
                      {company.Hovedbransje && (
                        <p className="text-sm text-blue-600 mb-1">{company.Hovedbransje}</p>
                      )}
                      {company.Beskrivelse && (
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                          {company.Beskrivelse}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        {company.Lokasjon && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {company.Lokasjon}
                          </span>
                        )}
                        {company.Ansatte && (
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {company.Ansatte} ansatte
                          </span>
                        )}
                        {company['Driftsinntekter (MNOK)'] && (
                          <span className="text-green-600">
                            {company['Driftsinntekter (MNOK)']} MNOK
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <FavoriteButton
                        type="company"
                        id={company.Selskap}
                        name={company.Selskap}
                        data={{
                          industry: company.Hovedbransje,
                          location: company.Lokasjon,
                          employees: company.Ansatte,
                          revenue: company['Driftsinntekter (MNOK)']
                        }}
                      />
                      <Button variant="ghost" size="sm" onClick={() => handleCompanyClick(company)}>
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm || selectedIndustry !== 'all' 
                  ? `Ingen bedrifter funnet med de valgte filtrene` 
                  : 'Ingen bedrifter tilgjengelig'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanySearch;
