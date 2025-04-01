
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import NoResultsView from '@/components/results/NoResultsView';
import TestDataNotice from '@/components/results/TestDataNotice';
import { UniversityResultsView } from '@/components/results/UniversityResultsView';

const UniversityResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  
  useEffect(() => {
    // Get the full user data including questionnaire answers
    const savedFullData = localStorage.getItem('userFullData');
    
    if (savedFullData) {
      const parsedData = JSON.parse(savedFullData);
      setUserData(parsedData);
      
      // If the data doesn't have university questionnaire data, show a toast
      if (!parsedData.questionnaire?.university) {
        toast.warning("Ingen studentdata funnet", {
          description: "Du kan laste inn testdata for studenter fra hovedsiden"
        });
      }
    } else {
      toast.warning("Ingen resultater funnet", {
        description: "Tips: Du kan laste inn testdata fra hovedsiden"
      });
    }
  }, [navigate]);
  
  if (!userData) {
    return (
      <Layout>
        <NoResultsView />
      </Layout>
    );
  }

  // Extract user's name from user data
  const { firstName, lastName } = userData || {};
  const fullName = firstName && lastName ? `${firstName} ${lastName}` : "Anonym bruker";
  const isTestData = firstName === "Test";
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">Din studieprofil</h1>
          <p className="text-sm text-muted-foreground">{fullName}</p>
        </div>
        
        <Separator className="mb-8" />
        
        <UniversityResultsView userData={userData} />
        
        <TestDataNotice isTestData={isTestData} userType="university" />
      </div>
    </Layout>
  );
};

export default UniversityResultsPage;
