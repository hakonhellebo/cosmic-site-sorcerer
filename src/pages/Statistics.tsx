
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UniversityStatistics from '@/components/statistics/UniversityStatistics';
import CompanyStatistics from '@/components/statistics/CompanyStatistics';

const Statistics = () => {
  const [activeTab, setActiveTab] = useState("universiteter");
  
  return (
    <Layout>
      <div className="container mx-auto py-20 px-4">
        <div className="max-w-5xl mx-auto mt-10 mb-8">
          <h1 className="text-4xl font-bold mb-6">Statistikk</h1>
          <p className="text-lg mb-8 text-muted-foreground">
            Her finner du oppdatert statistikk for utdanningsmuligheter og karriereveier.
            Denne informasjonen kan hjelpe deg å ta informerte valg om din fremtid.
          </p>

          <Tabs defaultValue="universiteter" className="w-full" onValueChange={(value) => setActiveTab(value)}>
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="universiteter">Universiteter</TabsTrigger>
              <TabsTrigger value="bedrifter">Bedrifter</TabsTrigger>
            </TabsList>
            <TabsContent value="universiteter" className="mt-6">
              <UniversityStatistics />
            </TabsContent>
            <TabsContent value="bedrifter" className="mt-6">
              <CompanyStatistics />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Statistics;
