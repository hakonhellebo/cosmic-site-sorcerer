
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import NoResultsView from '@/components/results/NoResultsView';
import TestDataNotice from '@/components/results/TestDataNotice';
import { WorkerResultsView } from '@/components/results/WorkerResultsView';

const WorkerResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    console.log("WorkerResultsPage: Loading user data");
    setIsLoading(true);
    
    // Check if user is logged in
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      
      // Try to load user-specific data first
      const userSpecificData = localStorage.getItem(`userFullData_${user.id}`);
      
      if (userSpecificData) {
        const parsedData = JSON.parse(userSpecificData);
        if (parsedData.questionnaire?.worker) {
          setUserData(parsedData);
          setIsLoading(false);
          return;
        }
      }
    }
    
    // Fall back to general userFullData if no user-specific data found
    const savedFullData = localStorage.getItem('userFullData');
    
    if (savedFullData) {
      const parsedData = JSON.parse(savedFullData);
      console.log("Loading general worker data:", parsedData);
      setUserData(parsedData);
      
      // Save the user type for navigation purposes
      localStorage.setItem('userType', 'worker');
      
      // If the data doesn't have worker questionnaire data, show a toast
      if (!parsedData.questionnaire?.worker) {
        toast.warning("Ingen arbeidstakerdata funnet", {
          description: "Du kan laste inn testdata for arbeidstakere fra hovedsiden"
        });
      }
    } else {
      toast.warning("Ingen resultater funnet", {
        description: "Tips: Du kan laste inn testdata fra hovedsiden"
      });
    }
    
    setIsLoading(false);
  }, [navigate]);
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 md:py-16 flex justify-center items-center">
          <p>Laster inn data...</p>
        </div>
      </Layout>
    );
  }
  
  if (!userData || !userData.questionnaire?.worker) {
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
          <h1 className="text-3xl md:text-4xl font-bold">Din karriereprofil</h1>
          <p className="text-sm text-muted-foreground">{fullName}</p>
        </div>
        
        <Separator className="mb-8" />
        
        <WorkerResultsView userData={userData} />
        
        <TestDataNotice isTestData={isTestData} userType="worker" />
      </div>
    </Layout>
  );
};

export default WorkerResultsPage;
