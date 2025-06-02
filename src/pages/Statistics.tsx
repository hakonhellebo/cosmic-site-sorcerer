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
import { getUniversityData } from '@/lib/supabase';

const Statistics = () => {
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
                  Test av offentlig tilgang til universitetsdata
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Tester ny offentlig tilgang til universitetsdata med API-key.
                  </p>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">API Status:</h4>
                    <p className="text-sm text-green-600">✅ Universitetsdata er nå offentlig tilgjengelig</p>
                    <p className="text-sm text-gray-600">API-key: ...eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjZmNsb2p6eXFlenV1d3h6cnpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1MTYzODMsImV4cCI6MjA1OTA5MjM4M30.EvRcjK9lCiuuV7FBLE4M7g9mifFsUQg7nIMefi9VJaQ.slice(-10)}</p>
                  </div>
                  
                  <Button 
                    onClick={async () => {
                      try {
                        console.log("Testing public university data access...");
                        const { data, error } = await getUniversityData();
                        console.log("University data test result:", { 
                          dataLength: data?.length, 
                          error: error?.message,
                          firstRow: data?.[0] 
                        });
                        
                        if (data && data.length > 0) {
                          alert(`✅ Suksess! Hentet ${data.length} rader fra universitetsdata`);
                        } else if (error) {
                          alert(`❌ Feil: ${error.message}`);
                        } else {
                          alert(`⚠️ Ingen data funnet`);
                        }
                      } catch (err) {
                        console.error("Test error:", err);
                        alert(`❌ Test feilet: ${err.message}`);
                      }
                    }}
                    className="w-full"
                  >
                    Test Universitetsdata API
                  </Button>
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
