
import React from 'react';
import { Building, MapPin, Users, ExternalLink } from "lucide-react";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { Button } from "@/components/ui/button";

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

interface CompanyListProps {
  companies: Company[];
  onCompanyClick: (company: Company) => void;
  loading: boolean;
}

const CompanyList: React.FC<CompanyListProps> = ({
  companies,
  onCompanyClick,
  loading
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Filtrerer bedrifter...</span>
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div className="text-center py-12">
        <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Ingen bedrifter funnet med de valgte filtrene</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {companies.map((company, index) => (
        <div
          key={index}
          className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="flex justify-between items-start">
            <div 
              className="flex-1 cursor-pointer"
              onClick={() => onCompanyClick(company)}
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
              <Button variant="ghost" size="sm" onClick={() => onCompanyClick(company)}>
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CompanyList;
