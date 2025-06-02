
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

const Statistics = () => {
  const [loading, setLoading] = useState(true);
  const [allData, setAllData] = useState({
    universities: [],
    companies: [],
    allStudentData: [],
    yrkeOptions: []
  });

  // Load ALL data when component mounts
  useEffect(() => {
    const loadAllStatisticsData = async () => {
      setLoading(true);
      console.log("Loading ALL statistics data on page load...");
      
      try {
        // Load university data
        console.log("Fetching ALL data from Student_data...");
        const { count } = await supabase
          .from('Student_data')
          .select('*', { count: 'exact', head: true });
        
        console.log(`Total records in Student_data: ${count}`);
        
        let allStudentData: any[] = [];
        let from = 0;
        const batchSize = 1000;
        let hasMore = true;
        let batchNum = 1;
        
        while (hasMore && allStudentData.length < (count || 0)) {
          console.log(`Fetching batch ${batchNum}: records ${from} to ${from + batchSize - 1}`);
          
          const { data: batchData, error } = await supabase
            .from('Student_data')
            .select('*')
            .range(from, from + batchSize - 1)
            .order('Lærestednavn', { ascending: true });
          
          if (error) {
            console.error("Error fetching batch:", error);
            break;
          }
          
          if (batchData && batchData.length > 0) {
            allStudentData = [...allStudentData, ...batchData];
            console.log(`Batch ${batchNum}: Added ${batchData.length} records. Total so far: ${allStudentData.length}`);
            
            if (batchData.length < batchSize) {
              console.log("Reached end of data - batch returned fewer records than requested");
              hasMore = false;
            } else {
              from += batchSize;
              batchNum++;
            }
          } else {
            hasMore = false;
          }
        }
        
        console.log(`Final data count: ${allStudentData.length}`);
        console.log(`Expected count: ${count}`);
        console.log("Sample data:", allStudentData.slice(0, 3));
        
        // Extract universities list
        const uniqueUniversities = [...new Set(allStudentData.map(item => item.Lærestednavn))].filter(Boolean);
        const orderedUniversities = [
          "Norges teknisk-naturvitenskapelige universitet",
          "Universitetet i Oslo", 
          "Universitetet i Bergen",
          "Norges Handelshøyskole",
          "OsloMet - storbyuniversitetet",
          "UiT Norges arktiske universitet",
          "Universitetet i Innlandet",
          "Høgskulen på Vestlandet",
          "Universitetet i Sørøst-Norge",
          "Universitetet i Stavanger",
          "Universitetet i Agder",
          "Norges miljø- og biovitenskapelige universitet",
          ...uniqueUniversities.filter(uni => ![
            "Norges teknisk-naturvitenskapelige universitet",
            "Universitetet i Oslo", 
            "Universitetet i Bergen",
            "Norges Handelshøyskole",
            "OsloMet - storbyuniversitetet",
            "UiT Norges arktiske universitet",
            "Universitetet i Innlandet",
            "Høgskulen på Vestlandet",
            "Universitetet i Sørøst-Norge",
            "Universitetet i Stavanger",
            "Universitetet i Agder",
            "Norges miljø- og biovitenskapelige universitet"
          ].includes(uni))
        ];
        
        console.log("Found universities (in custom order):", orderedUniversities);

        // Load company data
        console.log("Fetching companies data...");
        const { data: companiesData, error: companiesError } = await supabase
          .from('Bedrifter')
          .select('*')
          .order('Selskap', { ascending: true });
        
        if (companiesError) {
          console.error("Error fetching companies:", companiesError);
        } else {
          console.log(`Fetched ${companiesData?.length || 0} companies`);
        }

        // Load salary/career data
        console.log("Fetching yrke options for salary trends...");
        const { data: yrkeData, error: yrkeError } = await supabase
          .from('Clean_11418')
          .select('Yrke')
          .not('Yrke', 'is', null)
          .order('Yrke', { ascending: true });
        
        let yrkeOptions: {value: string, label: string}[] = [];
        if (yrkeData && !yrkeError) {
          const uniqueYrker = [...new Set(yrkeData.map(item => item.Yrke))];
          yrkeOptions = uniqueYrker.map(yrke => ({
            value: yrke,
            label: yrke
          }));
          console.log(`Found ${yrkeOptions.length} unique job titles for salary trends`);
        } else {
          console.error("Error fetching yrke options:", yrkeError);
        }

        // Set all data at once
        setAllData({
          universities: orderedUniversities,
          companies: companiesData || [],
          allStudentData: allStudentData,
          yrkeOptions: yrkeOptions
        });

        console.log("All statistics data loaded successfully!");
        
      } catch (error) {
        console.error("Error loading statistics data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAllStatisticsData();
  }, []); // Only run once when component mounts

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Statistikk og Data</h1>
          <p className="text-muted-foreground">
            Utforsk statistikk om karrierer, universiteter, bedrifter og lønninger
          </p>
          {loading && (
            <div className="mt-4 flex items-center gap-2 text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
              <span className="text-sm">Laster all data...</span>
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
              
              {allData.yrkeOptions.length > 0 && (
                <SalaryTrendChart yrkeOptions={allData.yrkeOptions} />
              )}
            </div>
          </TabsContent>

          <TabsContent value="universities">
            <UniversityStatistics 
              preloadedData={{
                allStudentData: allData.allStudentData,
                universities: allData.universities,
                loading: loading
              }}
            />
          </TabsContent>

          <TabsContent value="companies">
            <CompanyStatistics 
              preloadedData={{
                companies: allData.companies,
                loading: loading
              }}
            />
          </TabsContent>

          <TabsContent value="salary">
            <div className="space-y-6">
              <SalarySearch />
              
              {allData.yrkeOptions.length > 0 && (
                <SalaryTrendChart yrkeOptions={allData.yrkeOptions} />
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
                      <p className={`${allData.allStudentData.length > 0 ? 'text-green-600' : 'text-yellow-600'}`}>
                        ✅ Universitetsdata: {allData.allStudentData.length} poster
                      </p>
                      <p className={`${allData.companies.length > 0 ? 'text-green-600' : 'text-yellow-600'}`}>
                        ✅ Bedriftsdata: {allData.companies.length} poster
                      </p>
                      <p className={`${allData.yrkeOptions.length > 0 ? 'text-green-600' : 'text-yellow-600'}`}>
                        ✅ Lønnsdata: {allData.yrkeOptions.length} yrker
                      </p>
                      <p className="text-gray-600">
                        API-key: ...{supabaseAnonKey.slice(-10)}
                      </p>
                    </div>
                  </div>

                  {allData.universities.length > 0 && (
                    <div className="border-t pt-6">
                      <h4 className="text-lg font-medium mb-4">
                        Universiteter ({allData.universities.length})
                      </h4>
                      <div className="grid gap-2 max-h-48 overflow-y-auto">
                        {allData.universities.slice(0, 10).map((uni, index) => (
                          <div key={index} className="text-sm p-2 bg-white border rounded">
                            {uni}
                          </div>
                        ))}
                        {allData.universities.length > 10 && (
                          <p className="text-xs text-gray-500">... og {allData.universities.length - 10} flere</p>
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
