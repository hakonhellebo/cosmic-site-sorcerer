
import React, { useState } from 'react';
import { toast } from "sonner";
import Layout from '@/components/Layout';
import EducationForm from '@/components/dashboard/EducationForm';
import CareerForm from '@/components/dashboard/CareerForm';
import SkillsForm from '@/components/dashboard/SkillsForm';
import ResultsView from '@/components/dashboard/ResultsView';
import DashboardView from '@/components/dashboard/DashboardView';
import { useUserProfile } from '@/hooks/useUserProfile';

type Step = 'education' | 'career' | 'skills' | 'results' | 'dashboard';

const Dashboard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>('education');
  const [progress, setProgress] = useState(33);
  
  const {
    userData,
    isProfileComplete,
    updateEducation,
    updateCareer,
    updateSkills,
    resetProfile,
    setUserData
  } = useUserProfile();

  // Set initial step based on profile completion
  React.useEffect(() => {
    if (isProfileComplete) {
      setCurrentStep('dashboard');
    }
  }, [isProfileComplete]);

  const handleEducationSubmit = async (data: any) => {
    await updateEducation(data);
    setCurrentStep('career');
    setProgress(66);
  };

  const handleCareerSubmit = async (data: any) => {
    const careerData = {
      ...data,
      interests: Array.isArray(data.interests) ? data.interests : [],
      salaryRange: userData.career.salaryRange,
    };
    await updateCareer(careerData);
    setCurrentStep('skills');
    setProgress(100);
  };

  const handleSkillsSubmit = async (data: any) => {
    await updateSkills(data);
    setCurrentStep('results');
  };

  const handleResetProfile = () => {
    resetProfile();
    setCurrentStep('education');
    setProgress(33);
  };

  const handleContinueToDashboard = () => {
    setCurrentStep('dashboard');
    toast.success("Velkommen til ditt personlige dashboard!");
  };

  // Dashboard view when profile is complete
  if (currentStep === 'dashboard' && isProfileComplete) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 md:py-24">
          <DashboardView userData={userData} onResetProfile={handleResetProfile} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-3xl">
          {/* Header with progress bar */}
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold">Velkommen til EdPath!</h1>
            <p className="mb-6 text-muted-foreground">
              Fortell oss litt mer om deg selv så vi kan gi deg skreddersydde karriereråd.
            </p>
            {currentStep !== 'results' && (
              <div className="mb-4">
                <div className="h-2 w-full rounded-full bg-secondary">
                  <div 
                    className="h-2 rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {currentStep === 'education' && "Steg 1 av 3: Fortell oss om din utdanning"}
                  {currentStep === 'career' && "Steg 2 av 3: Velg dine karriereinteresser"}
                  {currentStep === 'skills' && "Steg 3 av 3: Fullfør profilen"}
                </p>
              </div>
            )}
          </div>

          {/* Education Step */}
          {currentStep === 'education' && (
            <EducationForm 
              userData={userData}
              onSubmit={handleEducationSubmit}
            />
          )}

          {/* Career Interests Step */}
          {currentStep === 'career' && (
            <CareerForm 
              userData={userData}
              onSubmit={handleCareerSubmit}
              onBack={() => {
                setCurrentStep('education');
                setProgress(33);
              }}
              setUserData={setUserData}
            />
          )}

          {/* Skills Step */}
          {currentStep === 'skills' && (
            <SkillsForm 
              userData={userData}
              onSubmit={handleSkillsSubmit}
              onBack={() => {
                setCurrentStep('career');
                setProgress(66);
              }}
            />
          )}

          {/* Results Step */}
          {currentStep === 'results' && (
            <ResultsView onContinueToDashboard={handleContinueToDashboard} />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
