
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Form } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import WorkerQuestionnaire from '@/components/WorkerQuestionnaire';

type QuestionnaireFormData = {
  worker: {
    educationLevel: 'videregaende' | 'fagskole' | 'bachelor' | 'master' | 'phd' | 'ingen';
    studyField: Record<string, boolean>;
    otherField: string;
    preparedness: 'very-well' | 'well' | 'somewhat' | 'not-at-all';
    usedSkills: Record<string, boolean>;
    currentJob: string;
    firstJobMethod: 'internship' | 'nettverk' | 'jobbportal' | 'headhunting' | 'rekrutterer' | 'annet';
    otherMethod: string;
    timeToJob: 'right-after' | 'within-1' | 'within-2' | 'within-5' | 'not-yet';
    startingSalary: string;
    // Career development fields
    yearsWorking: '0-2' | '3-5' | '6-10' | '11-20' | 'over-20';
    industryChange: 'once' | 'multiple' | 'never';
    jobChanges: 'never' | '1-2' | '3-5' | 'more-than-5';
    jobChangeReason: 'higher-salary' | 'better-environment' | 'career-development' | 'lack-challenges' | 'conflict' | 'other';
    jobChangeReasonOther: string;
    leadershipRole: 'yes' | 'no';
    careerSatisfaction: 'very-satisfied' | 'satisfied' | 'somewhat-satisfied' | 'dissatisfied';
    keySkill: 'technical' | 'network' | 'communication' | 'leadership' | 'creativity' | 'problem-solving';
    furtherEducation: 'yes' | 'no';
    educationChange: string;
    rightIndustry: 'yes' | 'no' | 'unsure';
    // New job satisfaction and future fields
    jobSatisfaction: 'very-satisfied' | 'somewhat-satisfied' | 'slightly-satisfied' | 'dissatisfied';
    jobImportance: Record<string, boolean>;
    nextCareerGoal: string;
    meaningfulWork: 'very-important' | 'somewhat-important' | 'slightly-important' | 'not-important';
    careerAdvice: string;
    jobChangeOpenness: 'very-open' | 'somewhat-open' | 'not-open';
    aiCareerAdvice: 'yes' | 'maybe' | 'no';
  };
};

const WorkerQuestionnairePage: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const totalPages = 3;
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
      worker: {
        educationLevel: 'bachelor',
        studyField: {},
        otherField: '',
        preparedness: 'well',
        usedSkills: {},
        currentJob: '',
        firstJobMethod: 'nettverk',
        otherMethod: '',
        timeToJob: 'right-after',
        startingSalary: '',
        // Default values for existing fields
        yearsWorking: '3-5',
        industryChange: 'never',
        jobChanges: '1-2',
        jobChangeReason: 'career-development',
        jobChangeReasonOther: '',
        leadershipRole: 'no',
        careerSatisfaction: 'satisfied',
        keySkill: 'problem-solving',
        furtherEducation: 'no',
        educationChange: '',
        rightIndustry: 'yes',
        // Default values for new fields
        jobSatisfaction: 'somewhat-satisfied',
        jobImportance: {},
        nextCareerGoal: '',
        meaningfulWork: 'somewhat-important',
        careerAdvice: '',
        jobChangeOpenness: 'somewhat-open',
        aiCareerAdvice: 'maybe',
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
      
      // Give a small delay to ensure toast is shown and data is saved
      setTimeout(() => {
        // Navigate to front page
        window.location.href = '/';
      }, 300);
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
            {page === 1 && "Bakgrunn og utdanning"}
            {page === 2 && "Arbeidserfaring"}
            {page === 3 && "Karrierevei og erfaring"}
          </h2>
          <p className="text-muted-foreground mb-6">
            {page === 1 && "Fortell oss om din utdanningsbakgrunn"}
            {page === 2 && "Fortell oss om din arbeidserfaring"}
            {page === 3 && "Fortell oss om din karriereutvikling"}
          </p>
          
          <WorkerQuestionnaire 
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
              <h1 className="text-2xl font-bold">Spørreskjema for yrkesaktive</h1>
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

export default WorkerQuestionnairePage;
