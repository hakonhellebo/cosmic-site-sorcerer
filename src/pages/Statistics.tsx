import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BarChart, Users, Briefcase, Building, DollarSign, TestTube } from 'lucide-react';
import CareerStatistics from '@/components/statistics/CareerStatistics';
import UniversityStatistics from '@/components/statistics/UniversityStatistics';
import CompanyStatistics from '@/components/statistics/CompanyStatistics';
import SalarySearch from '@/components/statistics/SalarySearch';
import { getUniversityData, supabaseAnonKey, supabase } from '@/lib/supabase';

const Statistics = () => {
  const [universities, setUniversities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [filterYear, setFilterYear] = useState('2024');
  const [filterLevel, setFilterLevel] = useState('Bachelor, 3-årig');

  const fetchUniversities = async () => {
    setLoading(true);
    try {
      console.log("Fetching universities with filters:", { year: filterYear, level: filterLevel });
      
      // Use a modified query that filters by year and level
      let query = supabase
        .from('Universitetsdata')
        .select('*', { count: 'exact' })
        .order('Institusjonsnavn', { ascending: true });
      
      // Apply filters
      if (filterYear) {
        query = query.eq('Årstall', filterYear);
      }
      
      // Filter by qualification level if specified
      if (filterLevel) {
        query = query.ilike('Kvalifikasjonsnavn', `%${filterLevel}%`);
      }
      
      console.log("Executing filtered query...");
      const { data, error, count } = await query;
      
      if (data && !error) {
        console.log(`Filtered data: ${data.length} records found (total available: ${count})`);
        setTotalRecords(count || data.length);
        
        // Group by institution to get unique universities
        const uniqueUniversities = data.reduce((acc, item) => {
          const key = `${item.Institusjonskode}-${item.Institusjonsnavn}`;
          if (!acc[key]) {
            acc[key] = {
              kode: item.Institusjonskode,
              navn: item.Institusjonsnavn,
              antallProgrammer: 0,
              programmer: []
            };
          }
          acc[key].antallProgrammer++;
          if (item.Studnavn && !acc[key].programmer.includes(item.Studnavn)) {
            acc[key].programmer.push(item.Studnavn);
          }
          return acc;
        }, {});
        
        const universitiesList = Object.values(uniqueUniversities);
        setUniversities(universitiesList);
        console.log(`Found ${universitiesList.length} unique universities from ${data.length} filtered records`);
      } else {
        console.error("Error fetching filtered universities:", error);
        alert(`❌ Feil: ${error?.message || 'Ukjent feil'}`);
      }
    } catch (err) {
      console.error("Fetch universities error:", err);
      alert(`❌ Feil: ${err.message}`);
    }
    setLoading(false);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Statistikk og Data</h1>
          <p className="text-muted-foreground">
            Utforsk statistikk om karrierer, universiteter, bedrifter og lønninger
          </p>
        </div>

        <Tabs defaultValue="careers" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="careers" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Karrierer
            </TabsTrigger>
            <TabsTrigger value="universities" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Universiteter
            </TabsTrigger>
            <TabsTrigger value="companies" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Bedrifter
            </TabsTrigger>
            <TabsTrigger value="salary" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Lønn
            </TabsTrigger>
            <TabsTrigger value="test" className="flex items-center gap-2">
              <TestTube className="h-4 w-4" />
              Test
            </TabsTrigger>
          </TabsList>

          <TabsContent value="careers">
            <CareerStatistics />
          </TabsContent>

          <TabsContent value="universities">
            <UniversityStatistics />
          </TabsContent>

          <TabsContent value="companies">
            <CompanyStatistics />
          </TabsContent>

          <TabsContent value="salary">
            <SalarySearch />
          </TabsContent>

          <TabsContent value="test">
            <Card>
              <CardHeader>
                <CardTitle>Test-fane - Universitetsdata API</CardTitle>
                <CardDescription>
                  Test av filtrert tilgang til universitetsdata
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <p className="text-muted-foreground mb-4">
                      Tester filtrert tilgang til universitetsdata for raskere resultater.
                    </p>
                    
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <h4 className="font-medium mb-2">API Status:</h4>
                      <p className="text-sm text-green-600">✅ Universitetsdata er tilgjengelig</p>
                      <p className="text-sm text-gray-600">API-key: ...{supabaseAnonKey.slice(-10)}</p>
                      {totalRecords > 0 && (
                        <p className="text-sm text-blue-600">📊 {totalRecords} filtrerte dataposter</p>
                      )}
                    </div>
                    
                    {/* Filter controls */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">År:</label>
                        <select 
                          value={filterYear} 
                          onChange={(e) => setFilterYear(e.target.value)}
                          className="w-full p-2 border rounded-lg"
                        >
                          <option value="2024">2024</option>
                          <option value="2023">2023</option>
                          <option value="">Alle år</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Kvalifikasjonsnivå:</label>
                        <select 
                          value={filterLevel} 
                          onChange={(e) => setFilterLevel(e.target.value)}
                          className="w-full p-2 border rounded-lg"
                        >
                          <option value="Bachelor, 3-årig">Bachelor, 3-årig</option>
                          <option value="Master, 2-årig">Master, 2-årig</option>
                          <option value="">Alle nivåer</option>
                        </select>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={fetchUniversities}
                      disabled={loading}
                      className="w-full mb-4"
                    >
                      {loading ? "Henter filtrerte data..." : "Hent filtrerte universiteter"}
                    </Button>
                  </div>

                  <div className="border-t pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-lg font-medium">
                        Universiteter og høyskoler 
                        {filterYear && ` (${filterYear})`}
                        {filterLevel && ` - ${filterLevel}`}
                      </h4>
                    </div>
                    
                    {totalRecords > 0 && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                        <p className="text-blue-800 text-sm">
                          📊 Hentet {totalRecords} dataposter med filtre
                        </p>
                        <p className="text-blue-700 text-xs mt-1">
                          Viser {universities.length} unike universiteter/høyskoler
                        </p>
                      </div>
                    )}
                    
                    {universities.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">
                          Fant {universities.length} universiteter/høyskoler med gitte filtre
                        </p>
                        <div className="grid gap-3 max-h-96 overflow-y-auto">
                          {universities.map((uni, index) => (
                            <div key={index} className="border rounded-lg p-3 bg-white">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h5 className="font-medium text-sm">{uni.navn}</h5>
                                  <p className="text-xs text-gray-500">Kode: {uni.kode}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs text-gray-600">{uni.antallProgrammer} programmer</p>
                                </div>
                              </div>
                              {uni.programmer.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-xs text-gray-500">
                                    Eksempler: {uni.programmer.slice(0, 2).join(", ")}
                                    {uni.programmer.length > 2 && " ..."}
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {universities.length === 0 && !loading && (
                      <p className="text-sm text-muted-foreground">
                        Klikk "Hent filtrerte universiteter" for å se tilgjengelige institusjoner
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Statistics;
