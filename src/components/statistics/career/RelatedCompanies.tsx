
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building } from "lucide-react";
import CompanyCard from './CompanyCard';
import CompanyPagination from './CompanyPagination';
import { filterCompaniesBySector } from './utils/companyFilter';

interface Company {
  Selskap: string;
  Sektor: string;
  sub_sektor: string;
  Beskrivelse: string;
  Lokasjon: string;
  Ansatte: string;
  'Driftsinntekter (MNOK)': string;
  Geografi: string;
  Linker: string;
  Karriereportal: string;
}

interface RelatedCompaniesProps {
  sector: string;
  companies: Company[];
  sourceCareer?: {
    Yrkesnavn: string;
    Sektor: string;
    'Spesifikk sektor': string;
  };
}

const RelatedCompanies: React.FC<RelatedCompaniesProps> = ({ sector, companies, sourceCareer }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const companiesPerPage = 6;

  useEffect(() => {
    const filtered = filterCompaniesBySector(companies, sector);
    setFilteredCompanies(filtered);
  }, [sector, companies]);

  const totalPages = Math.ceil(filteredCompanies.length / companiesPerPage);
  const currentCompanies = filteredCompanies.slice(
    currentPage * companiesPerPage,
    (currentPage + 1) * companiesPerPage
  );

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  if (filteredCompanies.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Relevante bedrifter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Ingen bedrifter funnet for denne sektoren.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Relevante bedrifter
          <Badge variant="secondary" className="ml-2">
            {filteredCompanies.length} bedrifter
          </Badge>
        </CardTitle>
        
        <CompanyPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onNextPage={nextPage}
          onPrevPage={prevPage}
        />
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentCompanies.map((company, index) => (
            <CompanyCard 
              key={`${company.Selskap}-${index}`}
              company={company}
              sourceCareer={sourceCareer}
            />
          ))}
        </div>
        
        {filteredCompanies.length > companiesPerPage && (
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Viser {currentCompanies.length} av {filteredCompanies.length} bedrifter
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RelatedCompanies;
