
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Users, Briefcase, Building, DollarSign, TestTube } from 'lucide-react';
import CareerStatistics from '@/components/statistics/CareerStatistics';
import UniversityStatistics from '@/components/statistics/UniversityStatistics';
import CompanyStatistics from '@/components/statistics/CompanyStatistics';
import SalarySearch from '@/components/statistics/SalarySearch';
import { supabaseAnonKey, supabase } from '@/lib/supabase';

const Statistics = () => {
  const [universities, setUniversities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [availableYears, setAvailableYears] = useState<string[]>(['2025']); // Default to 2025
  const [availableLevels, setAvailableLevels] = useState<string[]>(['Bachelor\\, 3-årig']); // Default value
  const [selectedYear, setSelectedYear] = useState<string>('2025');
  const [selectedLevel, setSelectedLevel] = useState<string>('Bachelor\\, 3-årig');

  // Fetch available filter options from Student_data
  const fetchFilterOptions = async () => {
    console.log("Fetching available filter options from Student_data...");
    
    try {
      const { data, error } = await supabase
        .from('Student_data')
        .select('Lærestednavn, "Utdanningsområde- og type"')
        .limit(1000);
      
      if (data && !error) {
        console.log("Raw Student_data sample:", data.slice(0, 5));
        
        // For now, use default values since new structure might not have explicit year/level columns
        setAvailableYears(['2025']);
        setAvailableLevels(['Bachelor\\, 3-årig']);
        
        console.log("Using default filter options for Student_data");
      } else {
        console.error("Error fetching filter options:", error);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  // Fetch filtered universities from Student_data
  const fetchFilteredUniversities = async () => {
    setLoading(true);
    try {
      console.log("Fetching universities from Student_data...");
      
      const { data, error } = await supabase
        .from('Student_data')
        .select('*', { count: 'exact' })
        .order('Lærestednavn', { ascending: true });
      
      if (data && !error) {
        console.log(`Query result: ${data.length} records found from Student_data`);
        setTotalRecords(data.length);
        
        // Group by institution to get unique universities
        const uniqueUniversities = data.reduce((acc, item) => {
          const key = `${item.Lærestednavn}`;
          if (!acc[key]) {
            acc[key] = {
              kode: item.Studiekode?.split(' ')[0] || '',
              navn: item.Lærestednavn,
              antallProgrammer: 0,
              programmer: []
            };
          }
          acc[key].antallProgrammer++;
          if (item.Studienavn && !acc[key].programmer.includes(item.Studienavn)) {
            acc[key].programmer.push(item.Studienavn);
          }
          return acc;
        }, {});
        
        const universitiesList = Object.values(uniqueUniversities);
        setUniversities(universitiesList);
        console.log(`Found ${universitiesList.length} unique universities from ${data.length} Student_data records`);
      } else {
        console.error("Error fetching universities:", error);
        alert(`❌ Feil: ${error?.message || 'Ukjent feil'}`);
      }
    } catch (err) {
      console.error("Fetch universities error:", err);
      alert(`❌ Feil: ${err.message}`);
    }
    setLoading(false);
  };

  // Load filter options on component mount
  useEffect(() => {
    fetchFilterOptions();
  }, []);

  // Auto-fetch data when component mounts with default filters
  useEffect(() => {
    if (availableYears.length > 0 && availableLevels.length > 0) {
      fetchFilteredUniversities();
    }
  }, [availableYears, availableLevels]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 pt-24">
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
                <CardTitle>Test-fane - Student_data (ny datakilde)</CardTitle>
                <CardDescription>
                  Viser universitetsdata hentet fra ny Student_data tabell
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <h4 className="font-medium mb-2">API Status:</h4>
                      <p className="text-sm text-green-600">✅ Student_data er tilgjengelig</p>
                      <p className="text-sm text-gray-600">API-key: ...{supabaseAnonKey.slice(-10)}</p>
                      <p className="text-sm text-blue-600">📊 Datakilde: Student_data tabell</p>
                      {totalRecords > 0 && (
                        <p className="text-sm text-blue-600">📊 {totalRecords} dataposter fra Student_data</p>
                      )}
                    </div>

                    <Button 
                      onClick={fetchFilteredUniversities}
                      disabled={loading}
                      className="w-full mb-4"
                    >
                      {loading ? "Henter data..." : "Hent universitetsdata fra Student_data"}
                    </Button>
                  </div>

                  <div className="border-t pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-lg font-medium">
                        Universiteter og høyskoler (Student_data)
                      </h4>
                    </div>
                    
                    {totalRecords > 0 && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                        <p className="text-blue-800 text-sm">
                          📊 Hentet {totalRecords} dataposter fra Student_data tabell
                        </p>
                        <p className="text-blue-700 text-xs mt-1">
                          Viser {universities.length} unike universiteter/høyskoler
                        </p>
                      </div>
                    )}
                    
                    {universities.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">
                          Fant {universities.length} universiteter/høyskoler
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
                        Klikk knappen over for å hente data fra Student_data.
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
