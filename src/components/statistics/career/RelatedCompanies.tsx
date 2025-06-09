
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, MapPin, Users, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

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
}

const RelatedCompanies: React.FC<RelatedCompaniesProps> = ({ sector, companies }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const companiesPerPage = 6;

  useEffect(() => {
    // Filter companies by matching sector or sub_sektor
    const relevant = companies.filter(company => 
      company.Sektor?.toLowerCase() === sector?.toLowerCase() ||
      company.sub_sektor?.toLowerCase() === sector?.toLowerCase()
    );
    
    // Shuffle and limit to show variety
    const shuffled = relevant.sort(() => 0.5 - Math.random());
    setFilteredCompanies(shuffled.slice(0, 24)); // Limit to 24 for performance
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
        
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={prevPage}
              disabled={totalPages <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              {currentPage + 1} av {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={nextPage}
              disabled={totalPages <= 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentCompanies.map((company, index) => (
            <Card key={`${company.Selskap}-${index}`} className="border-l-4 border-l-primary/20 hover:border-l-primary transition-colors">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-lg line-clamp-1">{company.Selskap}</h4>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {company.sub_sektor || company.Sektor}
                    </Badge>
                  </div>
                  
                  {company.Beskrivelse && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {company.Beskrivelse}
                    </p>
                  )}
                  
                  <div className="space-y-2">
                    {company.Lokasjon && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{company.Lokasjon}</span>
                      </div>
                    )}
                    
                    {company.Ansatte && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Users className="h-3 w-3" />
                        <span>{company.Ansatte} ansatte</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    {company.Karriereportal && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs flex-1"
                        onClick={() => window.open(company.Karriereportal, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Karriere
                      </Button>
                    )}
                    
                    {company.Linker && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs flex-1"
                        onClick={() => window.open(company.Linker, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Nettside
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
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
