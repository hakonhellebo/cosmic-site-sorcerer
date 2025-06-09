
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Building, MapPin, Users, DollarSign, Globe, Briefcase, ExternalLink } from "lucide-react";

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
  const location = useLocation();
  const navigate = useNavigate();
  const [company, setCompany] = useState<Company | null>(null);
  const [sourceCareer, setSourceCareer] = useState<SourceCareer | null>(null);

  useEffect(() => {
    // Get company data from navigation state
    if (location.state?.company) {
      setCompany(location.state.company);
    }
    if (location.state?.sourceCareer) {
      setSourceCareer(location.state.sourceCareer);
    }
  }, [location.state]);

  const handleBackToCareer = () => {
    if (sourceCareer) {
      // Navigate back to statistics page with the specific career selected
      navigate('/statistikk', { 
        state: { 
          selectedCareer: sourceCareer.Yrkesnavn 
        } 
      });
    } else {
      navigate('/statistikk');
    }
  };

  if (!company) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Bedrift ikke funnet</h1>
            <p className="text-gray-600 mb-4">Vi kunne ikke finne informasjon om denne bedriften.</p>
            <Button onClick={() => navigate('/statistikk')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Tilbake til statistikk
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{company.Selskap}</h1>
              {company.Hovedbransje && (
                <Badge variant="secondary" className="mb-4">
                  {company.Hovedbransje}
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex gap-2 mt-4">
            {sourceCareer ? (
              <Button 
                variant="ghost" 
                onClick={handleBackToCareer}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Tilbake til {sourceCareer.Yrkesnavn}
              </Button>
            ) : (
              <Button 
                variant="ghost" 
                onClick={() => navigate('/statistikk')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Tilbake til statistikk
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main company info */}
          <div className="lg:col-span-2 space-y-6">
            {company.Beskrivelse && (
              <Card>
                <CardHeader>
                  <CardTitle>Om bedriften</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{company.Beskrivelse}</p>
                </CardContent>
              </Card>
            )}

            {/* External links */}
            {(company.Linker || company.Karriereportal) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ExternalLink className="h-5 w-5" />
                    Lenker
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {company.Linker && (
                    <div>
                      <h4 className="font-medium mb-2">Hjemmeside</h4>
                      <a 
                        href={company.Linker.startsWith('http') ? company.Linker : `https://${company.Linker}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <Globe className="h-4 w-4" />
                        {company.Linker}
                      </a>
                    </div>
                  )}
                  {company.Karriereportal && (
                    <div>
                      <h4 className="font-medium mb-2">Karriereportal</h4>
                      <a 
                        href={company.Karriereportal.startsWith('http') ? company.Karriereportal : `https://${company.Karriereportal}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <Briefcase className="h-4 w-4" />
                        {company.Karriereportal}
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Company stats sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Bedriftsinformasjon
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {company.Lokasjon && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Lokasjon</p>
                      <p className="text-gray-600">{company.Lokasjon}</p>
                    </div>
                  </div>
                )}

                {company.Geografi && company.Geografi !== company.Lokasjon && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Geografi</p>
                      <p className="text-gray-600">{company.Geografi}</p>
                    </div>
                  </div>
                )}

                {company.Ansatte && (
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Antall ansatte</p>
                      <p className="text-gray-600">{company.Ansatte}</p>
                    </div>
                  </div>
                )}

                {company['Driftsinntekter (MNOK)'] && (
                  <div className="flex items-start gap-3">
                    <DollarSign className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Driftsinntekter</p>
                      <p className="text-gray-600">{company['Driftsinntekter (MNOK)']} MNOK</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Future: Career opportunities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Karrieremuligheter
                </CardTitle>
                <CardDescription>
                  Informasjon om stillinger og utdanningskrav
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 text-sm">
                  Denne funksjonen kommer snart. Her vil du kunne se:
                </p>
                <ul className="text-gray-500 text-sm mt-2 space-y-1">
                  <li>• Tidligere stillingsannonser</li>
                  <li>• Populære utdanninger</li>
                  <li>• Karriereutviklingsmuligheter</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CompanyProfilePage;
