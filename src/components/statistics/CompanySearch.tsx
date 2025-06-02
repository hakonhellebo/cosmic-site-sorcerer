
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useCompanyData } from '@/hooks/useCompanyData';
import CompanySearchFilters from './company/CompanySearchFilters';
import CompanyList from './company/CompanyList';

interface Company {
  Selskap: string;
  Huvudbransje: string;
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
  const navigate = useNavigate();

  const {
    companies,
    filteredCompanies,
    industries,
    loading,
    initialLoading,
    filterAndSortCompanies
  } = useCompanyData();

  // Filter and sort companies when any filter changes
  useEffect(() => {
    filterAndSortCompanies(searchTerm, selectedIndustry, sortField, sortDirection);
  }, [searchTerm, selectedIndustry, sortField, sortDirection, companies]);

  const handleCompanyClick = (company: Company) => {
    // Navigate to company profile page with company name as URL parameter
    const companySlug = company.Selskap?.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    navigate(`/bedrift/${companySlug}`, { state: { company } });
  };

  const handleSortChange = (field: SortField) => {
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
        <CardContent>
          <CompanySearchFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedIndustry={selectedIndustry}
            setSelectedIndustry={setSelectedIndustry}
            industries={industries}
            sortField={sortField}
            sortDirection={sortDirection}
            onSortChange={handleSortChange}
            totalCompanies={companies.length}
          />
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
          ) : (
            <CompanyList
              companies={filteredCompanies}
              onCompanyClick={handleCompanyClick}
              loading={loading}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanySearch;
