
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
import Clean11418Search from '@/components/statistics/Clean11418Search';
import { supabaseAnonKey, supabase } from '@/lib/supabase';

// Create a global state for statistics data
let globalStatisticsData: {
  universities: string[];
  companies: any[];
  allStudentData: any[];
  yrkeOptions: {value: string, label: string}[];
} | null = null;

let isLoadingGlobalData = false;
let loadingPromise: Promise<void> | null = null;

// Function to load all statistics data globally
const loadGlobalStatisticsData = async () => {
  if (globalStatisticsData || isLoadingGlobalData) {
    return loadingPromise;
  }

  isLoadingGlobalData = true;
  
  loadingPromise = (async () => {
    console.log("Loading ALL statistics data globally using NEW tables...");
    
    try {
      // Load university data from Student_data_ny (NEW TABLE)
      console.log("Fetching ALL data from Student_data_ny...");
      const { count } = await supabase
        .from('Student_data_ny')
        .select('*', { count: 'exact', head: true });
      
      console.log(`Total records in Student_data_ny: ${count}`);
      
      let allStudentData: any[] = [];
      let from = 0;
      const batchSize = 1000;
      let hasMore = true;
      let batchNum = 1;
      
      while (hasMore && allStudentData.length < (count || 0)) {
        console.log(`Fetching batch ${batchNum}: records ${from} to ${from + batchSize - 1}`);
        
        const { data: batchData, error } = await supabase
          .from('Student_data_ny')
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

      // Load company data from Bedrifter_ny (NEW TABLE)
      console.log("Fetching companies data from Bedrifter_ny...");
      const { data: companiesData, error: companiesError } = await supabase
        .from('Bedrifter_ny')
        .select('*')
        .order('Selskap', { ascending: true });
      
      if (companiesError) {
        console.error("Error fetching companies:", companiesError);
      } else {
        console.log(`Fetched ${companiesData?.length || 0} companies from Bedrifter_ny`);
      }

      // Load salary/career data
      console.log("Fetching yrke options for salary trends...");
      const { data: yrkeData, error: yrkeError } = await supabase
        .from('Clean_11418')
        .select('Yrke')
        .not('Yrke', 'is', null)
        .limit(1000)
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

      // Set global data
      globalStatisticsData = {
        universities: orderedUniversities,
        companies: companiesData || [],
        allStudentData: allStudentData,
        yrkeOptions: yrkeOptions
      };

      console.log("Global statistics data loaded successfully using NEW tables!");
      
    } catch (error) {
      console.error("Error loading global statistics data:", error);
    } finally {
      isLoadingGlobalData = false;
    }
  })();

  return loadingPromise;
};

const Statistics = () => {
  const [allData, setAllData] = useState({
    universities: [],
    companies: [],
    allStudentData: [],
    yrkeOptions: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeData = async () => {
      // Start loading global data if not already loaded
      await loadGlobalStatisticsData();
      
      // Use the global data
      if (globalStatisticsData) {
        setAllData(globalStatisticsData);
      }
      
      setLoading(false);
    };

    initializeData();
  }, []);

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
              <span className="text-sm">Laster all data fra nye tabeller...</span>
            </div>
          )}
        </div>

        <Tabs defaultValue="careers" className="space-y-6">
          <TabsList className="flex w-full overflow-x-auto gap-1 p-1">
            <TabsTrigger value="careers" className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm whitespace-nowrap flex-shrink-0">
              <Briefcase className="h-4 w-4" />
              <span className="hidden sm:inline">Karrierer</span>
            </TabsTrigger>
            <TabsTrigger value="universities" className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm whitespace-nowrap flex-shrink-0">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Universiteter</span>
            </TabsTrigger>
            <TabsTrigger value="companies" className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm whitespace-nowrap flex-shrink-0">
              <Building className="h-4 w-4" />
              <span className="hidden sm:inline">Bedrifter</span>
            </TabsTrigger>
            <TabsTrigger value="salary" className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm whitespace-nowrap flex-shrink-0">
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">Lønn</span>
            </TabsTrigger>
            <TabsTrigger value="test" className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm whitespace-nowrap flex-shrink-0">
              <TestTube className="h-4 w-4" />
              <span className="hidden sm:inline">Test</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="careers">
            <div className="space-y-6">
              <CareerStatistics 
                preloadedData={{
                  companies: allData.companies,
                  allStudentData: allData.allStudentData
                }}
              />
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
            <div className="space-y-6">
              <Clean11418Search />
              
              <Card>
                <CardHeader>
                  <CardTitle>Test-fane - Clean_11418 datasett</CardTitle>
                  <CardDescription>
                    Søk og utforsk bonuslønn data fra Clean_11418 datasettet
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Data Status (NYE TABELLER):</h4>
                      <div className="space-y-2 text-sm">
                        <p className={`${allData.allStudentData.length > 0 ? 'text-green-600' : 'text-yellow-600'}`}>
                          ✅ Universitetsdata (Student_data_ny): {allData.allStudentData.length} poster
                        </p>
                        <p className={`${allData.companies.length > 0 ? 'text-green-600' : 'text-yellow-600'}`}>
                          ✅ Bedriftsdata (Bedrifter_ny): {allData.companies.length} poster
                        </p>
                        <p className={`${allData.yrkeOptions.length > 0 ? 'text-green-600' : 'text-yellow-600'}`}>
                          ✅ Lønnsdata: {allData.yrkeOptions.length} yrker
                        </p>
                        <p className="text-blue-600">
                          ✅ Clean_11418: Bonuslønn datasett tilgjengelig
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
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

// Export function to preload data from other components
export const preloadStatisticsData = loadGlobalStatisticsData;

export default Statistics;
