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
        favoriteCoursesOther: '',
        difficultCourses: {},
        difficultCoursesOther: '',
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

    // Lagre data først, uavhengig av valideringsresultater
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const combinedData = {
      ...userData,
      questionnaire: { highSchool: data.highSchool }
    };
    
    localStorage.setItem('userFullData', JSON.stringify(combinedData));
    
    toast.success("Spørreskjema fullført!", {
      description: "Takk for dine svar. Vi har laget en personlig karriereprofil til deg."
    });
    
    navigate('/results/high-school');
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
      <div className="container mx-auto px-4 pt-24 pb-12">
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
