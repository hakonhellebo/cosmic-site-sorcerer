import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import Layout from '@/components/Layout';
import { Progress } from "@/components/ui/progress";
import { Form } from "@/components/ui/form";
import HighSchoolQuestionnaire from '@/components/HighSchoolQuestionnaire';

const HighSchoolQuestionnairePage = () => {
  const navigate = useNavigate();
  const [formProgress, setFormProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 6;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      highSchool: {
        // Page 1 - Introduction and background
        grade: '',
        studyDirection: '',
        averageGrade: '',
        favoriteCourses: {},
        difficultCourses: {},
        educationPriorities: {},
        // Page 2 - Interests and skills
        interests: {},
        workTasks: {},
        workEnvironment: '',
        workPreference: '',
        goodSkills: {},
        improveSkills: {},
        // Page 3 - School subjects and learning preferences
        bestSubjects: {},
        bestSubjectsOther: '', // New field for "other" best subjects
        challengingSubjects: {},
        challengingSubjectsOther: '', // New field for "other" challenging subjects
        learningStyle: {},
        digitalTools: {},
        technologyComfort: '',
        schoolChallenges: {},
        // Page 4 - Work readiness and school habits
        workIndependently: '',
        preparedness: '',
        collaboration: '',
        aiUsage: '',
        missingSkills: {},
        studyTime: '',
        workExperience: '',
        workExperienceValue: '',
        // Page 5 - Industries and future roles
        interestingIndustries: {},
        desiredRoles: {},
        salaryImportance: '',
        socialImpactImportance: '',
        workEnvironmentPreferences: {},
        futureWorkVision: '',
        // Page 6 - Career planning and motivation
        workLocation: '',
        jobChallenges: {},
        careerSupportNeeds: {},
        educationMotivation: '',
        aiJobMarketImpact: '',
        industryMentorInterest: ''
      }
    }
  });

  const onSubmit = (data) => {
    console.log('High School Questionnaire Data:', data);
    setIsSubmitting(true);

    const isFavoriteCoursesValid = Object.values(data.highSchool.favoriteCourses || {}).filter(Boolean).length > 0;
    const isDifficultCoursesValid = Object.values(data.highSchool.difficultCourses || {}).filter(Boolean).length > 0;
    const isEducationPrioritiesValid = Object.values(data.highSchool.educationPriorities || {}).filter(Boolean).length > 0;
    const isInterestsValid = Object.values(data.highSchool.interests || {}).filter(Boolean).length > 0;
    const isWorkTasksValid = Object.values(data.highSchool.workTasks || {}).filter(Boolean).length > 0;
    const isGoodSkillsValid = Object.values(data.highSchool.goodSkills || {}).filter(Boolean).length > 0;
    const isImproveSkillsValid = Object.values(data.highSchool.improveSkills || {}).filter(Boolean).length > 0;
    
    const isBestSubjectsValid = Object.values(data.highSchool.bestSubjects || {}).filter(Boolean).length > 0;
    const isChallengingSubjectsValid = Object.values(data.highSchool.challengingSubjects || {}).filter(Boolean).length > 0;
    const isLearningStyleValid = Object.values(data.highSchool.learningStyle || {}).filter(Boolean).length > 0;
    const isDigitalToolsValid = Object.values(data.highSchool.digitalTools || {}).filter(Boolean).length > 0;
    const isSchoolChallengesValid = Object.values(data.highSchool.schoolChallenges || {}).filter(Boolean).length > 0;
    const isMissingSkillsValid = Object.values(data.highSchool.missingSkills || {}).filter(Boolean).length > 0;
    
    const isInterestingIndustriesValid = Object.values(data.highSchool.interestingIndustries || {}).filter(Boolean).length > 0;
    const isDesiredRolesValid = Object.values(data.highSchool.desiredRoles || {}).filter(Boolean).length > 0;
    const isWorkEnvironmentPreferencesValid = Object.values(data.highSchool.workEnvironmentPreferences || {}).filter(Boolean).length > 0;
    const isJobChallengesValid = Object.values(data.highSchool.jobChallenges || {}).filter(Boolean).length > 0;
    const isCareerSupportNeedsValid = Object.values(data.highSchool.careerSupportNeeds || {}).filter(Boolean).length > 0;
    
    if (!isFavoriteCoursesValid || !isDifficultCoursesValid || !isEducationPrioritiesValid || 
        !isInterestsValid || !isWorkTasksValid || !isGoodSkillsValid || !isImproveSkillsValid ||
        !isBestSubjectsValid || !isChallengingSubjectsValid || !isLearningStyleValid || 
        !isDigitalToolsValid || !isSchoolChallengesValid || !isMissingSkillsValid ||
        !isInterestingIndustriesValid || !isDesiredRolesValid || !isWorkEnvironmentPreferencesValid ||
        !isJobChallengesValid || !isCareerSupportNeedsValid) {
      
      if (!isFavoriteCoursesValid) {
        form.setError('highSchool.favoriteCourses', {
          type: 'manual',
          message: 'Velg minst ett fag du liker best'
        });
      }
      
      if (!isDifficultCoursesValid) {
        form.setError('highSchool.difficultCourses', {
          type: 'manual',
          message: 'Velg minst ett fag du synes er vanskelig'
        });
      }
      
      if (!isEducationPrioritiesValid) {
        form.setError('highSchool.educationPriorities', {
          type: 'manual',
          message: 'Velg minst én prioritet for utdanningen din'
        });
      }
      
      if (!isInterestsValid) {
        form.setError('highSchool.interests', {
          type: 'manual',
          message: 'Velg minst én interesse'
        });
      }
      
      if (!isWorkTasksValid) {
        form.setError('highSchool.workTasks', {
          type: 'manual',
          message: 'Velg minst én arbeidsoppgave'
        });
      }
      
      if (!isGoodSkillsValid) {
        form.setError('highSchool.goodSkills', {
          type: 'manual',
          message: 'Velg minst én ferdighet du er god på'
        });
      }
      
      if (!isImproveSkillsValid) {
        form.setError('highSchool.improveSkills', {
          type: 'manual',
          message: 'Velg minst én ferdighet du vil bli bedre på'
        });
      }
      
      if (!isBestSubjectsValid) {
        form.setError('highSchool.bestSubjects', {
          type: 'manual',
          message: 'Velg minst ett fag du liker best på skolen'
        });
      }
      
      if (!isChallengingSubjectsValid) {
        form.setError('highSchool.challengingSubjects', {
          type: 'manual',
          message: 'Velg minst ett fag du synes er utfordrende'
        });
      }
      
      if (!isLearningStyleValid) {
        form.setError('highSchool.learningStyle', {
          type: 'manual',
          message: 'Velg minst én måte du lærer best på'
        });
      }
      
      if (!isDigitalToolsValid) {
        form.setError('highSchool.digitalTools', {
          type: 'manual',
          message: 'Velg minst ett digitalt verktøy du bruker'
        });
      }
      
      if (!isSchoolChallengesValid) {
        form.setError('highSchool.schoolChallenges', {
          type: 'manual',
          message: 'Velg minst én utfordring med skolearbeidet'
        });
      }
      
      if (!isMissingSkillsValid) {
        form.setError('highSchool.missingSkills', {
          type: 'manual',
          message: 'Velg minst én ferdighet du føler du mangler'
        });
      }
      
      if (!isInterestingIndustriesValid) {
        form.setError('highSchool.interestingIndustries', {
          type: 'manual',
          message: 'Velg minst én bransje som virker spennende'
        });
      }
      
      if (!isDesiredRolesValid) {
        form.setError('highSchool.desiredRoles', {
          type: 'manual',
          message: 'Velg minst én jobberolle du kunne tenke deg'
        });
      }
      
      if (!isWorkEnvironmentPreferencesValid) {
        form.setError('highSchool.workEnvironmentPreferences', {
          type: 'manual',
          message: 'Velg minst én faktor som er viktig for deg i et arbeidsmiljø'
        });
      }
      
      if (!isJobChallengesValid) {
        form.setError('highSchool.jobChallenges', {
          type: 'manual',
          message: 'Velg minst én utfordring med å finne jobb'
        });
      }
      
      if (!isCareerSupportNeedsValid) {
        form.setError('highSchool.careerSupportNeeds', {
          type: 'manual',
          message: 'Velg minst én faktor som ville gjort det enklere å velge karriere'
        });
      }
      
      toast.error("Du må fylle ut alle nødvendige felt", {
        description: "Kontroller at du har valgt minst ett alternativ der det kreves"
      });
      
      return;
    }
    
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const combinedData = {
      ...userData,
      questionnaire: { highSchool: data.highSchool }
    };
    
    localStorage.setItem('userFullData', JSON.stringify(combinedData));
    
    toast.success("Spørreskjema fullført!", {
      description: "Takk for dine svar. Vi har laget en personlig karriereprofil til deg."
    });
    
    navigate('/results');
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo(0, 0);
    } else {
      form.handleSubmit(onSubmit)();
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo(0, 0);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-3xl font-bold">Spørreskjema for videregåendeelever</h1>
              <span className="text-sm font-medium">{currentPage} av {totalPages}</span>
            </div>
            <p className="text-muted-foreground mb-4">
              Hjelp oss å forstå din bakgrunn, interesser og mål slik at vi kan gi deg bedre veiledning.
            </p>
            <Progress value={formProgress} className="h-2" />
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <HighSchoolQuestionnaire 
                  form={form} 
                  setFormProgress={setFormProgress} 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onNextPage={nextPage}
                  onPrevPage={prevPage}
                />
              </form>
            </Form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HighSchoolQuestionnairePage;
