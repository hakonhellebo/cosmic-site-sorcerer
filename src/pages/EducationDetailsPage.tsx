import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, GraduationCap, Users, TrendingUp, Building, Briefcase } from "lucide-react";
import { supabase } from '@/lib/supabase';
import RelatedCompanies from '@/components/statistics/career/RelatedCompanies';
import { preloadStatisticsData } from './Statistics';

const EducationDetailsPage = () => {
  const { universityId, studiekode } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [program, setProgram] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [globalData, setGlobalData] = useState({
    companies: [],
    careers: []
  });

  useEffect(() => {
    const fetchProgramData = async () => {
      setLoading(true);
      console.log("Fetching program data for:", { universityId, studiekode });
      
      try {
        // Decode the university name from URL
        const decodedUniversityName = decodeURIComponent(universityId || '');
        const decodedStudiekode = decodeURIComponent(studiekode || '').replace(/-/g, ' ');
        
        console.log("Decoded params:", { decodedUniversityName, decodedStudiekode });
        
        // Fetch data from Student_data_ny table to get sector information
        const { data, error } = await supabase
          .from('Student_data_ny')
          .select('*')
          .ilike('Lærestednavn', `%${decodedUniversityName}%`)
          .eq('Studiekode', decodedStudiekode);
        
        if (error) {
          console.error("Error fetching program data:", error);
          return;
        }
        
        console.log("Found data:", data);
        
        if (data && data.length > 0) {
          // Process the data to get all measures for this program
          const programData = data.reduce((acc, row) => {
            const measureName = row['Measure Names'];
            const measureValue = row['Measure Values'];
            
            if (!acc.basic) {
              acc.basic = {
                linje: row.Studienavn,
                studiekode: row.Studiekode,
                universitet: row.Lærestednavn,
                studiested: row.Studiested,
                utdanningsomrade: row['Utdanningsområde- og type'],
                Sektor: row.Sektor,
                undersektor: row.undersektor
              };
            }
            
            if (measureName && measureValue) {
              acc.measures[measureName] = parseFloat(measureValue) || 0;
            }
            
            return acc;
          }, { basic: null, measures: {} });
          
          // Convert to expected format
          const processedProgram = {
            ...programData.basic,
            snitt: programData.measures['Snitt'] || 0,
            planlagteStudieplasser: programData.measures['Planlagte studieplasser'] || 0,
            sokereMott: programData.measures['Søkere møtt'] || 0,
            sokereTilbud: programData.measures['Søkere tilbud'] || 0,
            sokereTilbudJaSvar: programData.measures['Søkere tilbud ja-svar'] || 0,
            sokereKvalifisert: programData.measures['Søkere kvalifisert'] || 0,
            sokere: programData.measures['Søkere'] || 0,
            sokereMottPerStudieplass: programData.measures['Søkere per plass'] || 0
          };
          
          setProgram(processedProgram);
          console.log("Processed program with sector info:", processedProgram);
        }
      } catch (err) {
        console.error("Error:", err);
      }
      setLoading(false);
    };

    if (universityId && studiekode) {
      fetchProgramData();
    }
  }, [universityId, studiekode]);
  
  useEffect(() => {
    // Load global data for related content
    const loadGlobalData = async () => {
      console.log("Loading global data for related content...");
      
      // Get careers from Yrker_database
      const { data: careersData, error: careersError } = await supabase
        .from('Yrker_database')
        .select('*')
        .order('Yrkesnavn', { ascending: true });
      
      // Get companies from Bedrifter_ny  
      const { data: companiesData, error: companiesError } = await supabase
        .from('Bedrifter_ny')
        .select('*')
        .order('Selskap', { ascending: true });

      if (!careersError && !companiesError) {
        console.log("Global data loaded:", {
          careers: careersData?.length || 0,
          companies: companiesData?.length || 0
        });
        setGlobalData({
          companies: companiesData || [],
          careers: careersData || []
        });
      } else {
        console.error("Error loading global data:", { careersError, companiesError });
      }
    };

    loadGlobalData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Henter utdanningsdata...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!program) {
    return (
      <Layout>
        <div className="container mx-auto py-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Utdanning ikke funnet</h1>
            <p className="text-muted-foreground mb-6">Beklager, vi kunne ikke finne informasjon om denne utdanningen.</p>
            <Button onClick={() => navigate('/statistikk')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Tilbake til statistikk
            </Button>
          </div>
        </div>
      </Layout>
    );
  }
  
  const competitionRatio = program.sokereKvalifisert / program.planlagteStudieplasser;
  
  let competitionLevel = "Lav";
  let competitionColor = "bg-green-100 text-green-800";
  
  if (competitionRatio > 20) {
    competitionLevel = "Ekstremt høy";
    competitionColor = "bg-red-100 text-red-800";
  } else if (competitionRatio > 15) {
    competitionLevel = "Veldig høy";
    competitionColor = "bg-red-100 text-red-800";
  } else if (competitionRatio > 10) {
    competitionLevel = "Høy";
    competitionColor = "bg-orange-100 text-orange-800";
  } else if (competitionRatio > 5) {
    competitionLevel = "Moderat";
    competitionColor = "bg-yellow-100 text-yellow-800";
  }

  // Determine sector from program data - now we have this from Student_data_ny
  const programSector = program?.Sektor || program?.undersektor;
  console.log("Program sector for related content:", programSector);

  // Filter careers and companies by sector
  const relatedCareers = globalData.careers.filter(career => 
    career.Sektor?.toLowerCase().includes(programSector?.toLowerCase()) ||
    career['Spesifikk sektor']?.toLowerCase().includes(programSector?.toLowerCase())
  );

  const relatedCompanies = globalData.companies.filter(company => 
    company.Sektor?.toLowerCase().includes(programSector?.toLowerCase()) ||
    company.sub_sektor?.toLowerCase().includes(programSector?.toLowerCase())
  );

  console.log("Related content found:", {
    sector: programSector,
    careers: relatedCareers.length,
    companies: relatedCompanies.length
  });

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
              <h1 className="text-4xl font-bold mb-4">{program.linje}</h1>
              <p className="text-xl text-muted-foreground mb-2">{program.universitet}</p>
              <div className="flex gap-2 justify-center">
                <Badge variant="outline" className="text-sm">Studiekode: {program.studiekode}</Badge>
                <Badge variant="outline" className="text-sm">Studiested: {program.studiested}</Badge>
              </div>
            </div>
            
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Karaktersnitt
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {program.snitt > 0 ? program.snitt.toFixed(1) : 'Ikke oppgitt'}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Studieplasser
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{program.planlagteStudieplasser}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Søkere møtt
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{program.sokereMott}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Konkurransenivå</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-sm px-3 py-1 rounded-full w-fit ${competitionColor}`}>
                    {competitionLevel}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {competitionRatio.toFixed(1)} søkere per plass
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Detailed Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Detaljerte søkerstatistikker</CardTitle>
                <CardDescription>Oversikt over søkertall og opptaksstatistikk for 2024</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Totalt antall søkere:</span>
                      <span className="font-medium">{program.sokere}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Kvalifiserte søkere:</span>
                      <span className="font-medium">{program.sokereKvalifisert}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Søkere som fikk tilbud:</span>
                      <span className="font-medium">{program.sokereTilbud}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Søkere som takket ja:</span>
                      <span className="font-medium">{program.sokereTilbudJaSvar}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Søkere som møtte:</span>
                      <span className="font-medium">{program.sokereMott}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Søkere per studieplass:</span>
                      <span className="font-medium">{(program.sokereKvalifisert / program.planlagteStudieplasser).toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* About the Program */}
            <Card>
              <CardHeader>
                <CardTitle>Om studiet</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Dette studiet tilhører kategorien "{program.utdanningsomrade}" og gir deg fagkompetanse og analytiske ferdigheter innen et spennende felt med gode jobbmuligheter.
                </p>
                <Button variant="outline" asChild>
                  <a href={`https://www.samordnaopptak.no`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Les mer på Samordna opptak
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Careers Section */}
        {programSector && relatedCareers.length > 0 && (
          <div className="max-w-6xl mx-auto mt-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Relevante karrierer
                  <Badge variant="secondary" className="ml-2">
                    {relatedCareers.length} yrker
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Yrker som passer til denne utdanningens sektor: {programSector}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {relatedCareers.slice(0, 6).map((career, index) => (
                    <Card 
                      key={index} 
                      className="border-l-4 border-l-primary/20 hover:border-l-primary transition-colors cursor-pointer hover:shadow-md"
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-semibold text-lg line-clamp-2">{career.Yrkesnavn}</h4>
                            <Badge variant="outline" className="mt-1 text-xs">
                              {career['Spesifikk sektor'] || career.Sektor}
                            </Badge>
                          </div>
                          
                          {career['Kort beskrivelse'] && (
                            <p className="text-sm text-muted-foreground line-clamp-3">
                              {career['Kort beskrivelse']}
                            </p>
                          )}
                          
                          {career['Nøkkelkompetanser'] && (
                            <div className="text-xs text-muted-foreground">
                              <span className="font-medium">Nøkkelkompetanser: </span>
                              <span>{career['Nøkkelkompetanser'].slice(0, 100)}...</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Related Companies Section */}
        {programSector && relatedCompanies.length > 0 && (
          <div className="max-w-6xl mx-auto mt-8">
            <RelatedCompanies
              sector={programSector}
              companies={relatedCompanies}
            />
          </div>
        )}

        {/* Debug info */}
        {programSector && (
          <div className="max-w-6xl mx-auto mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Debug informasjon</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Sektor: {programSector} | Karrierer funnet: {relatedCareers.length} | Bedrifter funnet: {relatedCompanies.length}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EducationDetailsPage;
