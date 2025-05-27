
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UniversityStatistics from '@/components/statistics/UniversityStatistics';
import CompanyStatistics from '@/components/statistics/CompanyStatistics';
import CareerStatistics from '@/components/statistics/CareerStatistics';
import ResponsesTable from '@/components/statistics/ResponsesTable';
import { getAllResponses, getCurrentUser } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShieldAlert } from "lucide-react";

const Statistics = () => {
  const [activeTab, setActiveTab] = useState("universiteter");
  const [highSchoolResponses, setHighSchoolResponses] = useState<any[]>([]);
  const [universityResponses, setUniversityResponses] = useState<any[]>([]);
  const [workerResponses, setWorkerResponses] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState({
    highSchool: true,
    university: true,
    worker: true,
    admin: true
  });
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        setIsLoading(prev => ({ ...prev, admin: true }));
        const user = await getCurrentUser();
        
        // Check if user is admin (currently only one admin email)
        const isUserAdmin = user?.email === 'hhhellebo@gmail.com';
        setIsAdmin(isUserAdmin);
        
        setIsLoading(prev => ({ ...prev, admin: false }));
        
        // If admin, fetch responses
        if (isUserAdmin) {
          fetchResponses();
        }
      } catch (error) {
        console.error("Failed to check admin status:", error);
        setIsLoading(prev => ({ ...prev, admin: false }));
      }
    };
    
    checkAdminStatus();
  }, []);
  
  const fetchResponses = async () => {
    try {
      // Fetch high school responses
      setIsLoading(prev => ({ ...prev, highSchool: true }));
      const { data: highSchoolData, error: highSchoolError } = await getAllResponses('high_school_responses');
      if (highSchoolError) throw highSchoolError;
      setHighSchoolResponses(highSchoolData || []);
      setIsLoading(prev => ({ ...prev, highSchool: false }));
      
      // Fetch university responses
      setIsLoading(prev => ({ ...prev, university: true }));
      const { data: universityData, error: universityError } = await getAllResponses('university_responses');
      if (universityError) throw universityError;
      setUniversityResponses(universityData || []);
      setIsLoading(prev => ({ ...prev, university: false }));
      
      // Fetch worker responses
      setIsLoading(prev => ({ ...prev, worker: true }));
      const { data: workerData, error: workerError } = await getAllResponses('worker_responses');
      if (workerError) throw workerError;
      setWorkerResponses(workerData || []);
      setIsLoading(prev => ({ ...prev, worker: false }));
      
    } catch (error) {
      console.error("Failed to fetch responses:", error);
      toast.error("Kunne ikke hente svardata", {
        description: "Det oppstod en feil ved henting av data fra databasen."
      });
      setIsLoading({
        highSchool: false,
        university: false,
        worker: false,
        admin: false
      });
    }
  };
  
  const renderAdminContent = () => {
    if (isLoading.admin) {
      return (
        <div className="flex justify-center items-center h-40">
          <p>Sjekker tilgangsrettigheter...</p>
        </div>
      );
    }
    
    if (!isAdmin) {
      return (
        <Alert variant="destructive" className="my-8">
          <ShieldAlert className="h-4 w-4" />
          <AlertDescription>
            Du har ikke tilgang til å se svarene på undersøkelsene. 
            Kun administratorer har tilgang til denne seksjonen.
          </AlertDescription>
        </Alert>
      );
    }
    
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Svar på undersøkelser</h2>
          <Button onClick={fetchResponses}>Oppdater data</Button>
        </div>
        
        <div className="space-y-8">
          <ResponsesTable 
            title="Videregående elever" 
            responses={highSchoolResponses} 
            isLoading={isLoading.highSchool} 
          />
          
          <ResponsesTable 
            title="Universitetsstudenter" 
            responses={universityResponses} 
            isLoading={isLoading.university} 
          />
          
          <ResponsesTable 
            title="Yrkesaktive" 
            responses={workerResponses} 
            isLoading={isLoading.worker} 
          />
        </div>
      </div>
    );
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-20 px-4">
        <div className="max-w-5xl mx-auto mt-10 mb-8">
          <h1 className="text-4xl font-bold mb-6">Statistikk</h1>
          <p className="text-lg mb-8 text-muted-foreground">
            Her finner du oppdatert statistikk for utdanningsmuligheter, karriereveier og svar på spørreundersøkelser.
          </p>

          <Tabs defaultValue="universiteter" className="w-full" onValueChange={(value) => setActiveTab(value)}>
            <TabsList className={`grid w-full ${isAdmin ? 'grid-cols-4' : 'grid-cols-3'}`}>
              <TabsTrigger value="universiteter">Universiteter</TabsTrigger>
              <TabsTrigger value="yrker">Yrker</TabsTrigger>
              <TabsTrigger value="bedrifter">Bedrifter</TabsTrigger>
              {isAdmin && <TabsTrigger value="svar">Svar</TabsTrigger>}
            </TabsList>
            
            <TabsContent value="universiteter" className="mt-6">
              <UniversityStatistics />
            </TabsContent>
            
            <TabsContent value="yrker" className="mt-6">
              <CareerStatistics />
            </TabsContent>
            
            <TabsContent value="bedrifter" className="mt-6">
              <CompanyStatistics />
            </TabsContent>
            
            {isAdmin && (
              <TabsContent value="svar" className="mt-6">
                {renderAdminContent()}
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Statistics;
