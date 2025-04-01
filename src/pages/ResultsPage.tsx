
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import NoResultsView from '@/components/results/NoResultsView';
import TestDataNotice from '@/components/results/TestDataNotice';
import ResultsGenerator from '@/components/results/ResultsGenerator';

const ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [userType, setUserType] = useState<'highSchool' | 'university' | 'worker' | undefined>(undefined);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setCurrentUser(user);
      
      // Try to load user-specific data first
      const userSpecificData = localStorage.getItem(`userFullData_${user.id}`);
      
      if (userSpecificData) {
        const parsedData = JSON.parse(userSpecificData);
        setUserData(parsedData);
        localStorage.setItem('userFullData', userSpecificData);
        
        // Determine user type based on questionnaire data
        if (parsedData.questionnaire) {
          if (parsedData.questionnaire.highSchool) {
            setUserType('highSchool');
          } else if (parsedData.questionnaire.university) {
            setUserType('university');
          } else if (parsedData.questionnaire.worker) {
            setUserType('worker');
          }
        }
        
        return;
      }
    }
    
    // Fall back to general userFullData if no user-specific data found
    const savedFullData = localStorage.getItem('userFullData');
    
    if (savedFullData) {
      const parsedData = JSON.parse(savedFullData);
      setUserData(parsedData);
      
      // If user is logged in, save this data to their profile
      if (currentUser) {
        localStorage.setItem(`userFullData_${currentUser.id}`, savedFullData);
      }
      
      // Determine user type based on questionnaire data
      if (parsedData.questionnaire) {
        if (parsedData.questionnaire.highSchool) {
          setUserType('highSchool');
        } else if (parsedData.questionnaire.university) {
          setUserType('university');
        } else if (parsedData.questionnaire.worker) {
          setUserType('worker');
        }
      }
    } else {
      toast.warning("Ingen resultater funnet", {
        description: "Tips: Du kan laste inn testdata fra hovedsiden"
      });
    }
  }, [navigate, currentUser]);
  
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
  
  // Get a display title based on user type
  const getTitleByUserType = () => {
    switch(userType) {
      case 'highSchool':
        return 'Din vidergående profil';
      case 'university':
        return 'Din studieprofil';
      case 'worker':
        return 'Din karriereprofil';
      default:
        return 'Dine resultater';
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">{getTitleByUserType()}</h1>
          <p className="text-sm text-muted-foreground">{fullName}</p>
        </div>
        
        <Separator className="mb-8" />
        
        <ResultsGenerator userData={userData} userType={userType} />
        
        <TestDataNotice isTestData={isTestData} userType={userType} />
      </div>
    </Layout>
  );
};

export default ResultsPage;
