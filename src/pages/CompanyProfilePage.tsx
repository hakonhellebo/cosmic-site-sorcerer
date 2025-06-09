import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, Building, Users, DollarSign, MapPin } from "lucide-react";
import { supabase } from '@/lib/supabase';
import RelatedCareers from '@/components/statistics/career/RelatedCareers';
import RelatedEducationsForCompany from '@/components/statistics/career/RelatedEducationsForCompany';

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

interface SourceCareer {
  Yrkesnavn: string;
  Sektor: string;
  'Spesifikk sektor': string;
}

const CompanyProfilePage = () => {
  const { companySlug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyData = async () => {
      setLoading(true);
      
      // Check if company data was passed via location state
      if (location.state?.company) {
        setCompany(location.state.company);
        setLoading(false);
        return;
      }

      // Otherwise, try to fetch from database using slug
      if (companySlug) {
        console.log("Fetching company data for slug:", companySlug);
        
        try {
          // Decode the company name from URL
          const decodedCompanyName = decodeURIComponent(companySlug).replace(/-/g, ' ');
          
          // Try to fetch from Bedrifter_ny table first
          const { data, error } = await supabase
            .from('Bedrifter_ny')
            .select('*')
            .ilike('Selskap', `%${decodedCompanyName}%`);
          
          if (error) {
            console.error("Error fetching company data:", error);
          } else if (data && data.length > 0) {
            console.log("Found company:", data[0]);
            setCompany(data[0]);
          } else {
            console.log("No company found with slug:", companySlug);
          }
        } catch (err) {
          console.error("Error:", err);
        }
      }
      
      setLoading(false);
    };

    fetchCompanyData();
  }, [companySlug, location.state]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Henter bedriftsinformasjon...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!company) {
    return (
      <Layout>
        <div className="container mx-auto py-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Bedrift ikke funnet</h1>
            <p className="text-muted-foreground mb-6">Beklager, vi kunne ikke finne informasjon om denne bedriften.</p>
            <Button onClick={() => navigate('/statistikk')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Tilbake til statistikk
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/statistikk')}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Tilbake til statistikk
          </Button>
          
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">{company.Selskap}</h1>
              <div className="flex gap-2 justify-center mb-4">
                <Badge variant="outline" className="text-sm">{company.Sektor || company.Hovedbransje}</Badge>
                {company.sub_sektor && (
                  <Badge variant="secondary" className="text-sm">{company.sub_sektor}</Badge>
                )}
              </div>
              {company.Beskrivelse && (
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  {company.Beskrivelse}
                </p>
              )}
            </div>
            
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Ansatte
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {company.Ansatte || 'Ikke oppgitt'}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Omsetning
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {company['Driftsinntekter (MNOK)'] ? `${company['Driftsinntekter (MNOK)']} MNOK` : 'Ikke oppgitt'}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Lokasjon
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {company.Lokasjon || 'Ikke oppgitt'}
                  </div>
                  {company.Geografi && (
                    <div className="text-sm text-muted-foreground mt-1">
                      {company.Geografi}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Links */}
            <Card>
              <CardHeader>
                <CardTitle>Lenker</CardTitle>
                <CardDescription>Utforsk bedriftens nettsider og karrieremuligheter</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  {company.Linker && (
                    <Button variant="outline" asChild>
                      <a href={company.Linker} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Nettside
                      </a>
                    </Button>
                  )}
                  {company.Karriereportal && (
                    <Button asChild>
                      <a href={company.Karriereportal} target="_blank" rel="noopener noreferrer">
                        <Users className="mr-2 h-4 w-4" />
                        Karriereportal
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Related Content */}
        <div className="max-w-6xl mx-auto mt-12 space-y-8">
          {/* Related Careers Section */}
          {(company.Sektor || company.sub_sektor) && (
            <RelatedCareers
              sector={company.Sektor || company.Hovedbransje}
              subSector={company.sub_sektor}
              sourceCompany={company}
            />
          )}

          {/* Related Educations Section */}
          {(company.Sektor || company.sub_sektor) && (
            <RelatedEducationsForCompany
              sector={company.Sektor || company.Hovedbransje}
              subSector={company.sub_sektor}
              sourceCompany={company}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CompanyProfilePage;
