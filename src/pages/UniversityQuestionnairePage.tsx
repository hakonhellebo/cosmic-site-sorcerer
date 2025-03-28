
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import UniversityQuestionnaire from '@/components/UniversityQuestionnaire';

type QuestionnaireFormData = {
  university: {
    studyField: string;
    institution: string;
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
  
  useEffect(() => {
    // Hent brukerdata fra localStorage
    const savedUserData = localStorage.getItem('userData');
    if (savedUserData) {
      setUserData(JSON.parse(savedUserData));
    } else {
      // Hvis ingen data finnes, send tilbake til registrering
      toast.error("Ingen brukerdata funnet", {
        description: "Vennligst registrer deg først"
      });
      navigate('/registrer');
    }
  }, [navigate]);

  const form = useForm<QuestionnaireFormData>({
    defaultValues: {
      university: {
        studyField: '',
        institution: '',
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

  const onSubmit = (data: QuestionnaireFormData) => {
    console.log(data);
    
    // Kombinere brukerdata med spørreskjemasvar
    const combinedData = {
      ...userData,
      questionnaire: data
    };
    
    // Lagre resultatene i localStorage
    localStorage.setItem('userFullData', JSON.stringify(combinedData));
    
    toast.success("Spørreskjema fullført!", {
      description: "Takk for dine svar. Vi har laget en personlig karriereprofil til deg."
    });
    
    // Navigere til dashbordet
    navigate('/dashboard');
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

  const renderPageContent = () => {
    switch(page) {
      case 1:
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Personlige opplysninger</h2>
              <p className="text-muted-foreground mb-6">Fortell oss om din utdanning</p>
              <UniversityQuestionnaire form={form} onSubmit={form.handleSubmit(nextPage)} />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Kompetanser og ferdigheter</h2>
              <p className="text-muted-foreground mb-6">Fortell oss om dine styrker og interesser</p>
              {/* Dette vil vise andre delen av spørreskjemaet */}
            </div>
            <div className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={prevPage}
                className="rounded-full"
              >
                Tilbake
              </Button>
              <Button 
                type="button" 
                onClick={nextPage}
                className="rounded-full"
              >
                Neste
              </Button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Motivasjon og ambisjoner</h2>
              <p className="text-muted-foreground mb-6">Fortell oss om hva som driver deg</p>
              {/* Dette vil vise tredje delen av spørreskjemaet */}
            </div>
            <div className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={prevPage}
                className="rounded-full"
              >
                Tilbake
              </Button>
              <Button 
                type="button" 
                onClick={nextPage}
                className="rounded-full"
              >
                Neste
              </Button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Karriereforventninger</h2>
              <p className="text-muted-foreground mb-6">Fortell oss om dine mål og forventninger</p>
              {/* Dette vil vise fjerde delen av spørreskjemaet */}
            </div>
            <div className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={prevPage}
                className="rounded-full"
              >
                Tilbake
              </Button>
              <Button 
                type="submit" 
                onClick={form.handleSubmit(onSubmit)}
                className="rounded-full"
              >
                Fullfør
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
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
