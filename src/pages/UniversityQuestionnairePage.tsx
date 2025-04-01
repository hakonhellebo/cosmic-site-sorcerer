
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UniversityQuestionnaire from '@/components/UniversityQuestionnaire';
import Layout from '@/components/Layout';

const UniversityQuestionnairePage: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const handleQuestionnaireComplete = (data: any) => {
    // Save the full user data including questionnaire responses
    localStorage.setItem('userFullData', JSON.stringify(data));
    
    // If user is logged in, save this data to their profile
    if (currentUser) {
      localStorage.setItem(`userFullData_${currentUser.id}`, JSON.stringify(data));
    }
    
    navigate('/results/university');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <UniversityQuestionnaire onComplete={handleQuestionnaireComplete} />
      </div>
    </Layout>
  );
};

export default UniversityQuestionnairePage;
