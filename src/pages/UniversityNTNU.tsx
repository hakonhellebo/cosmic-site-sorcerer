
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, MapPin, Users, Star, ExternalLink, Building, BookOpen, TrendingUp, Award, BarChart } from "lucide-react";
import { getUniversityData } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

const UniversityNTNU = () => {
  const [ntnuPrograms, setNtnuPrograms] = useState<any[]>([]);
  const [ntnuStats, setNtnuStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNTNUData();
    fetchNTNUStatistics();
  }, []);

  const fetchNTNUData = async () => {
    try {
      setLoading(true);
      const { data, error } = await getUniversityData();
      
      if (data && !error) {
        // Filter for NTNU programs using the new Student_data structure
        const ntnuData = data.filter(item => 
          item.Institusjonsnavn === 'Norges teknisk-naturvitenskapelige universitet' ||
          item.Institusjonsnavn?.toLowerCase().includes('ntnu') ||
          item.Institusjonsnavn?.toLowerCase().includes('teknisk-naturvitenskapelige')
        );
        
        // Transform to expected format
        const programsList = ntnuData.map((item, index) => ({
          name: item.Studnavn || `Studie ${index + 1}`,
          code: item.Studiumkode || item.Studiekode || `CODE${index + 1}`,
          level: item.Nivånavn || 'Bachelor',
          department: item.Avdelingsnavn || item['Utdanningsområde- og type'] || 'Ukjent avdeling',
          count: 1
        })).slice(0, 12); // Show top 12 programs
        
        setNtnuPrograms(programsList);
        console.log(`Found ${programsList.length} NTNU programs from Student_data`);
      }
    } catch (error) {
      console.error('Error fetching NTNU data from Student_data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNTNUStatistics = async () => {
    try {
      setStatsLoading(true);
      const { data, error } = await supabase
        .from('universitet_statistikk')
        .select('*')
        .eq('Skole', 'Norges teknisk-naturvitenskapelige universitet')
        .order('Kategori', { ascending: true });
      
      if (data && !error) {
        setNtnuStats(data);
        console.log(`Found ${data.length} NTNU statistics entries`);
      } else {
        console.error('Error fetching NTNU statistics:', error);
      }
    } catch (error) {
      console.error('Error fetching NTNU statistics:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleProgramClick = (program: any) => {
    // Navigate to education details page
    navigate(`/utdanning/ntnu/${program.code}`, { 
      state: { 
        program,
        university: 'NTNU' 
      } 
    });
  };

  const getLatestValue = (stat: any) => {
    const years = ['2024', '2023', '2022', '2021', '2020', '2019'];
    for (const year of years) {
      if (stat[year] && stat[year] !== '-' && stat[year].trim() !== '') {
        return { value: stat[year], year };
      }
    }
    return { value: 'N/A', year: '' };
  };

  const formatStatValue = (value: string) => {
    if (!value || value === '-' || value === 'N/A') return 'N/A';
    
    // If it's a number, format it nicely
    const num = parseFloat(value.replace(/,/g, ''));
    if (!isNaN(num)) {
      if (num >= 1000) {
        return num.toLocaleString('no-NO');
      }
      return value;
    }
    return value;
  };

  const groupStatsByCategory = (stats: any[]) => {
    const grouped: { [key: string]: any[] } = {};
    stats.forEach(stat => {
      if (!grouped[stat.Kategori]) {
        grouped[stat.Kategori] = [];
      }
      grouped[stat.Kategori].push(stat);
    });
    return grouped;
  };

  const getKeyStats = (stats: any[]) => {
    const keyIndicators = [
      'Studenter totalt',
      'Kandidater på ett- og toårige mastergrader',
      'Prosent med karakterene A og B',
      'Publiseringspoeng',
      'Førstevalgsøkere totalt'
    ];
    
    return stats.filter(stat => keyIndicators.includes(stat.Indikator));
  };

  const groupedStats = groupStatsByCategory(ntnuStats);
  const keyStats = getKeyStats(ntnuStats);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Hero Section */}
        <div className="relative mb-12">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl p-8 mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <GraduationCap className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">NTNU</h1>
                <p className="text-xl opacity-90">Norges teknisk-naturvitenskapelige universitet</p>
              </div>
            </div>
            <p className="text-lg opacity-90 max-w-3xl">
              NTNU er Norges andre største universitet og et av Europas fremste teknologiuniversiteter. 
              Med campus i Trondheim, Gjøvik og Ålesund tilbyr NTNU utdanning og forskning av høy kvalitet 
              innen teknologi, naturvitenskap, samfunnsvitenskap og kunstfag.
            </p>
          </div>
        </div>

        {/* Quick Facts */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">40,000+</p>
                  <p className="text-sm text-muted-foreground">Studenter</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <BookOpen className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">300+</p>
                  <p className="text-sm text-muted-foreground">Studieprogram</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Building className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">9</p>
                  <p className="text-sm text-muted-foreground">Fakulteter</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <MapPin className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-sm text-muted-foreground">Campus</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* About Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Om NTNU
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-3">Historie og tradisjon</h3>
                <p className="text-muted-foreground mb-4">
                  NTNU ble etablert i 1996 gjennom en fusjon av Norges tekniske høgskole (NTH), 
                  Universitetet i Trondheim (UNIT) og andre institusjoner. Universitetet har 
                  røtter tilbake til 1760-tallet og er kjent for sin sterke teknologiske tradisjon.
                </p>
                
                <h3 className="text-lg font-semibold mb-3">Forskning og innovasjon</h3>
                <p className="text-muted-foreground">
                  NTNU er ledende innen teknologisk forskning og innovasjon i Norge. 
                  Universitetet samarbeider tett med næringslivet og bidrar til teknologisk 
                  utvikling og samfunnsnytte gjennom forskning og utdanning.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Campus og lokalisering</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="font-medium">Trondheim (Hovedcampus)</p>
                      <p className="text-sm text-muted-foreground">Gløshaugen og Dragvoll</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="font-medium">Gjøvik</p>
                      <p className="text-sm text-muted-foreground">Teknologi og samfunnsvitenskap</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-purple-600" />
                    <div>
                      <p className="font-medium">Ålesund</p>
                      <p className="text-sm text-muted-foreground">Marin teknologi og ingeniørfag</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Study Programs */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Populære studieprogram ved NTNU
            </CardTitle>
            <CardDescription>
              {loading ? 'Henter studieprogram...' : `Viser ${ntnuPrograms.length} studieprogram (fra Student_data)`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2">Henter studieprogram fra Student_data...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ntnuPrograms.map((program, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleProgramClick(program)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {program.level || 'Bachelor'}
                      </Badge>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                      {program.name}
                    </h3>
                    {program.department && (
                      <p className="text-xs text-muted-foreground mb-2">
                        {program.department}
                      </p>
                    )}
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>Kode: {program.code}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {!loading && ntnuPrograms.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Ingen NTNU studieprogram funnet i Student_data</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Key Statistics from Database */}
        {!statsLoading && keyStats.length > 0 && (
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                Nøkkeltall for NTNU
              </CardTitle>
              <CardDescription>
                Nyeste tilgjengelige data fra universitetsstatistikk
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {keyStats.map((stat, index) => {
                  const latest = getLatestValue(stat);
                  return (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm text-muted-foreground">{stat.Indikator}</h4>
                        {latest.year && (
                          <Badge variant="outline" className="text-xs">{latest.year}</Badge>
                        )}
                      </div>
                      <p className="text-2xl font-bold text-primary">
                        {formatStatValue(latest.value)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{stat.Kategori}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Detailed Statistics */}
        {!statsLoading && Object.keys(groupedStats).length > 0 && (
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Detaljert statistikk
              </CardTitle>
              <CardDescription>
                Komplett oversikt over NTNU sine nøkkeltall fordelt på kategorier
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={Object.keys(groupedStats)[0]} className="w-full">
                <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
                  {Object.keys(groupedStats).map((category) => (
                    <TabsTrigger 
                      key={category} 
                      value={category}
                      className="text-xs"
                    >
                      {category.replace('og', '&')}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {Object.entries(groupedStats).map(([category, stats]) => (
                  <TabsContent key={category} value={category} className="space-y-4">
                    <div className="grid gap-4">
                      {stats.map((stat, index) => {
                        const latest = getLatestValue(stat);
                        return (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-3">
                              <h4 className="font-medium">{stat.Indikator}</h4>
                              {latest.year && (
                                <Badge variant="outline">{latest.year}</Badge>
                              )}
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-sm">
                              {['2019', '2020', '2021', '2022', '2023', '2024'].map(year => (
                                <div key={year} className="text-center">
                                  <div className="text-muted-foreground text-xs">{year}</div>
                                  <div className={`font-medium ${year === latest.year ? 'text-primary' : ''}`}>
                                    {formatStatValue(stat[year] || '-')}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Contact and Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Kontaktinformasjon</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Adresse</p>
                  <p className="text-sm text-muted-foreground">Høgskoleringen 1, 7491 Trondheim</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Nettside</p>
                  <a href="https://www.ntnu.no" target="_blank" rel="noopener noreferrer" 
                     className="text-sm text-blue-600 hover:underline">
                    www.ntnu.no
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Nyttige lenker</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href="https://www.ntnu.no/studier" target="_blank" rel="noopener noreferrer">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Alle studieprogram
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href="https://www.ntnu.no/opptak" target="_blank" rel="noopener noreferrer">
                  <Users className="h-4 w-4 mr-2" />
                  Opptak og søknad
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href="https://www.ntnu.no/studentliv" target="_blank" rel="noopener noreferrer">
                  <Star className="h-4 w-4 mr-2" />
                  Studentliv
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default UniversityNTNU;
