
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Building, MapPin, Users, ExternalLink } from "lucide-react";
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

const CompanySearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
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
          setFilteredCompanies(data || []);
        }
      } catch (err) {
        console.error("Error:", err);
      }
      
      setInitialLoading(false);
    };

    fetchCompanies();
  }, []);

  // Filter companies based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredCompanies(companies);
      return;
    }

    setLoading(true);
    const filtered = companies.filter(company => 
      company.Selskap?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.Hovedbransje?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.Beskrivelse?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredCompanies(filtered);
    setLoading(false);
  }, [searchTerm, companies]);

  const handleCompanyClick = (company: Company) => {
    // Navigate to company profile page with company name as URL parameter
    const companySlug = company.Selskap?.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    navigate(`/bedrift/${companySlug}`, { state: { company } });
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
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Søk på firmanavn, bransje eller beskrivelse..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Søkeresultater
            {searchTerm && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({filteredCompanies.length} av {companies.length} bedrifter)
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
                  onClick={() => handleCompanyClick(company)}
                  className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
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
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm ? `Ingen bedrifter funnet for "${searchTerm}"` : 'Ingen bedrifter tilgjengelig'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanySearch;
