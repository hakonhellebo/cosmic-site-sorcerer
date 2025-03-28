
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Form } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import UniversityQuestionnaire from '@/components/UniversityQuestionnaire';

type QuestionnaireFormData = {
  university: {
    studyField: string;
    institution: string;
    otherInstitution?: string;
    level: string;
    changedField: 'yes' | 'no';
    certaintylevel: 'very' | 'quite' | 'little' | 'not';
    interests: Record<string, boolean>;
    strengths: Record<string, boolean>;
    weaknesses: Record<string, boolean>;
    learningStyle: Record<string, boolean>;
    collaboration: 'daily' | 'weekly' | 'monthly' | 'rarely';
    aiUsage: 'daily' | 'weekly' | 'monthly' | 'rarely' | 'never';
    internship: 'yes' | 'no';
    internshipValue: 'very' | 'somewhat' | 'not-really' | 'not-at-all';
    studyReason: 'job-security' | 'earnings' | 'difference' | 'passion' | 'unsure';
    salaryImportance: 'very' | 'somewhat' | 'not-really' | 'not-at-all';
    impactImportance: 'very' | 'somewhat' | 'not-really' | 'not-at-all';
    jobPriorities: Record<string, boolean>;
    jobChallenges: Record<string, boolean>;
    internationalImportance: 'very' | 'somewhat' | 'not-really' | 'not-at-all';
    entrepreneurship: 'yes' | 'no' | 'maybe';
    futureRole: 'leadership' | 'specialist' | 'entrepreneur' | 'unsure';
    employerPriorities: Record<string, boolean>;
    preferredCompanyType: 'startup' | 'sme' | 'large' | 'public' | 'ngo' | 'unsure';
    techImportance: 'very' | 'somewhat' | 'not-really' | 'not-at-all';
    workLifeBalance: 'work-first' | 'balanced' | 'life-first';
    remoteWorkImportance: 'very' | 'somewhat' | 'not-really' | 'not-at-all';
    travelImportance: 'very' | 'somewhat' | 'not-really' | 'not-at-all';
    satisfactionFactors: Record<string, boolean>;
    valueImportance: 'very' | 'somewhat' | 'not-really' | 'not-at-all';
    workEnvironment: 'structured' | 'flexible' | 'social' | 'independent';
    motivationSource: 'people' | 'technology' | 'both' | 'neither';
    projectPreference: 'short' | 'long' | 'combination';
    uncertaintyResponse: 'enjoy' | 'handle' | 'challenging' | 'dislike';
    careerPathImportance: 'very' | 'somewhat' | 'not-really' | 'not-at-all';
    dreamJob: string;
  };
};

const UniversityQuestionnairePage: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const totalPages = 4;
  const progressValue = (page / totalPages) * 100;
  const [userData, setUserData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    // Retrieve user data from localStorage
    const savedUserData = localStorage.getItem('userData');
    if (savedUserData) {
      setUserData(JSON.parse(savedUserData));
    } else {
      // Only redirect if we don't have userData and we're not coming from dashboard
      if (!window.location.pathname.includes('dashboard')) {
        toast.error("Ingen brukerdata funnet", {
          description: "Vennligst registrer deg først"
        });
        navigate('/registrer');
      }
    }
  }, [navigate]);

  const form = useForm<QuestionnaireFormData>({
    defaultValues: {
      university: {
        studyField: '',
        institution: '',
        otherInstitution: '',
        level: '',
        changedField: 'no',
        certaintylevel: 'quite',
        interests: {},
        strengths: {},
        weaknesses: {},
        learningStyle: {},
        collaboration: 'weekly',
        aiUsage: 'never',
        internship: 'no',
        internshipValue: 'somewhat',
        studyReason: 'job-security',
        salaryImportance: 'somewhat',
        impactImportance: 'somewhat',
        jobPriorities: {},
        jobChallenges: {},
        internationalImportance: 'somewhat',
        entrepreneurship: 'maybe',
        futureRole: 'unsure',
        employerPriorities: {},
        preferredCompanyType: 'unsure',
        techImportance: 'somewhat',
        workLifeBalance: 'balanced',
        remoteWorkImportance: 'somewhat',
        travelImportance: 'somewhat',
        satisfactionFactors: {},
        valueImportance: 'somewhat',
        workEnvironment: 'flexible',
        motivationSource: 'both',
        projectPreference: 'combination',
        uncertaintyResponse: 'handle',
        careerPathImportance: 'somewhat',
        dreamJob: '',
      }
    },
  });

  const onSubmit = async (data: QuestionnaireFormData) => {
    console.log("Form submitted:", data);
    setIsSubmitting(true);
    
    try {
      // Combine user data with questionnaire answers
      const combinedData = {
        ...userData,
        questionnaire: data
      };
      
      // Save results to localStorage
      localStorage.setItem('userFullData', JSON.stringify(combinedData));
      
      toast.success("Spørreskjema fullført!", {
        description: "Takk for dine svar. Vi har laget en personlig karriereprofil til deg."
      });
      
      // Navigate to dashboard after a brief delay to ensure the user sees the confirmation
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      console.error("Error saving form data:", error);
      toast.error("Det oppstod en feil", {
        description: "Kunne ikke lagre svarene dine. Vennligst prøv igjen."
      });
      setIsSubmitting(false);
    }
  };

  const nextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleFormSubmission = () => {
    console.log("Current page:", page, "Total pages:", totalPages);
    if (page < totalPages) {
      nextPage();
    } else {
      // When on the last page, call the onSubmit function
      form.handleSubmit(onSubmit)();
    }
  };

  const renderPageContent = () => {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">
            {page === 1 && "Personlige opplysninger"}
            {page === 2 && "Kompetanser og ferdigheter"}
            {page === 3 && "Motivasjon og ambisjoner"}
            {page === 4 && "Karriereforventninger"}
          </h2>
          <p className="text-muted-foreground mb-6">
            {page === 1 && "Fortell oss om din utdanning"}
            {page === 2 && "Fortell oss om dine styrker og interesser"}
            {page === 3 && "Fortell oss om hva som driver deg"}
            {page === 4 && "Fortell oss om dine mål og forventninger"}
          </p>
          
          <UniversityQuestionnaire 
            form={form} 
            page={page}
            onPrevious={prevPage}
            onSubmit={handleFormSubmission}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-2xl font-bold">Spørreskjema for universitetsstudenter</h1>
              <span className="text-sm font-medium">{page} av {totalPages}</span>
            </div>
            <Progress value={progressValue} className="h-2" />
          </div>
          
          <Form {...form}>
            <form className="space-y-8">
              {renderPageContent()}
            </form>
          </Form>
        </div>
      </div>
    </Layout>
  );
};

export default UniversityQuestionnairePage;
