
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, ExternalLink } from "lucide-react";

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

interface CompanyCardProps {
  company: Company;
  sourceCareer?: {
    Yrkesnavn: string;
    Sektor: string;
    'Spesifikk sektor': string;
  };
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company, sourceCareer }) => {
  const navigate = useNavigate();

  const handleCompanyClick = (company: Company) => {
    const companySlug = company.Selskap.toLowerCase().replace(/[^a-z0-9]/g, '-');
    navigate(`/bedrift/${companySlug}`, { 
      state: { 
        company,
        sourceCareer: sourceCareer
      } 
    });
  };

  return (
    <Card 
      className="border-l-4 border-l-primary/20 hover:border-l-primary transition-colors cursor-pointer hover:shadow-md"
      onClick={() => handleCompanyClick(company)}
    >
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
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(company.Karriereportal, '_blank');
                }}
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
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(company.Linker, '_blank');
                }}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Nettside
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyCard;
