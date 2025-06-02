
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BarChart, Users, Briefcase, Building, DollarSign, TestTube } from 'lucide-react';
import CareerStatistics from '@/components/statistics/CareerStatistics';
import UniversityStatistics from '@/components/statistics/UniversityStatistics';
import CompanyStatistics from '@/components/statistics/CompanyStatistics';
import SalarySearch from '@/components/statistics/SalarySearch';
import SalaryTrendChart from '@/components/statistics/SalaryTrendChart';
import { supabaseAnonKey, supabase } from '@/lib/supabase';
import { useCompanyData } from '@/hooks/useCompanyData';
import { useUniversityData } from '@/components/statistics/university/hooks/useUniversityData';

const Statistics = () => {
  const [universities, setUniversities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [yrkeOptions, setYrkeOptions] = useState<{value: string, label: string}[]>([]);

  // Use existing hooks to preload data
  const { companies, loading: companiesLoading } = useCompanyData();
  const { allStudentData, loading: universityLoading, universities: universityList } = useUniversityData();

  // Fetch salary/career data for trend chart
  const fetchYrkeOptions = async () => {
    try {
      console.log("Fetching yrke options for salary trends...");
      
      const { data, error } = await supabase
        .from('Clean_11418')
        .select('Yrke')
        .not('Yrke', 'is', null)
        .order('Yrke', { ascending: true });
      
      if (data && !error) {
        // Get unique job titles
        const uniqueYrker = [...new Set(data.map(item => item.Yrke))];
        const options = uniqueYrker.map(yrke => ({
          value: yrke,
          label: yrke
        }));
        setYrkeOptions(options);
        console.log(`Found ${options.length} unique job titles for salary trends`);
      } else {
        console.error("Error fetching yrke options:", error);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  // Load all data when component mounts
  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      console.log("Loading all statistics data...");
      
      // Fetch salary data
      await fetchYrkeOptions();
      
      // Set total records from university data
      setTotalRecords(allStudentData.length);
      
      setLoading(false);
      console.log("All statistics data loaded");
    };

    loadAllData();
  }, [allStudentData.length]);

  // Overall loading state
  const isLoading = loading || companiesLoading || universityLoading;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Statistikk og Data</h1>
          <p className="text-muted-foreground">
            Utforsk statistikk om karrierer, universiteter, bedrifter og lønninger
          </p>
          {isLoading && (
            <div className="mt-4 flex items-center gap-2 text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
              <span className="text-sm">Laster data...</span>
            </div>
          )}
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
            <div className="space-y-6">
              <CareerStatistics />
              
              {yrkeOptions.length > 0 && (
                <SalaryTrendChart yrkeOptions={yrkeOptions} />
              )}
            </div>
          </TabsContent>

          <TabsContent value="universities">
            <UniversityStatistics />
          </TabsContent>

          <TabsContent value="companies">
            <CompanyStatistics />
          </TabsContent>

          <TabsContent value="salary">
            <div className="space-y-6">
              <SalarySearch />
              
              {yrkeOptions.length > 0 && (
                <SalaryTrendChart yrkeOptions={yrkeOptions} />
              )}
            </div>
          </TabsContent>

          <TabsContent value="test">
            <Card>
              <CardHeader>
                <CardTitle>Test-fane - Forhåndsinnlastet data</CardTitle>
                <CardDescription>
                  Viser status for all forhåndsinnlastet data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Data Status:</h4>
                    <div className="space-y-2 text-sm">
                      <p className={`${allStudentData.length > 0 ? 'text-green-600' : 'text-yellow-600'}`}>
                        ✅ Universitetsdata: {allStudentData.length} poster
                      </p>
                      <p className={`${companies.length > 0 ? 'text-green-600' : 'text-yellow-600'}`}>
                        ✅ Bedriftsdata: {companies.length} poster
                      </p>
                      <p className={`${yrkeOptions.length > 0 ? 'text-green-600' : 'text-yellow-600'}`}>
                        ✅ Lønnsdata: {yrkeOptions.length} yrker
                      </p>
                      <p className="text-gray-600">
                        API-key: ...{supabaseAnonKey.slice(-10)}
                      </p>
                    </div>
                  </div>

                  {universityList.length > 0 && (
                    <div className="border-t pt-6">
                      <h4 className="text-lg font-medium mb-4">
                        Universiteter ({universityList.length})
                      </h4>
                      <div className="grid gap-2 max-h-48 overflow-y-auto">
                        {universityList.slice(0, 10).map((uni, index) => (
                          <div key={index} className="text-sm p-2 bg-white border rounded">
                            {uni}
                          </div>
                        ))}
                        {universityList.length > 10 && (
                          <p className="text-xs text-gray-500">... og {universityList.length - 10} flere</p>
                        )}
                      </div>
                    </div>
                  )}
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
