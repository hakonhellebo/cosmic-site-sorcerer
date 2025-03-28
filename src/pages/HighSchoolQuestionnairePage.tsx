
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import Layout from '@/components/Layout';
import HighSchoolQuestionnaire from '@/components/HighSchoolQuestionnaire';
import { Progress } from "@/components/ui/progress";
import { Form } from "@/components/ui/form";

const HighSchoolQuestionnairePage = () => {
  const navigate = useNavigate();
  const [formProgress, setFormProgress] = useState(0);
  
  const form = useForm({
    defaultValues: {
      highSchool: {
        grade: '',
        studyDirection: '',
        averageGrade: '',
        favoriteCourses: {},
        difficultCourses: {},
        educationPriorities: {},
        interests: {},
        workEnvironment: '',
        workPreference: '',
      }
    }
  });

  const onSubmit = (data) => {
    console.log('High School Questionnaire Data:', data);
    
    // Validate that selections are made where required
    const isFavoriteCoursesValid = Object.values(data.highSchool.favoriteCourses || {}).filter(Boolean).length > 0;
    const isDifficultCoursesValid = Object.values(data.highSchool.difficultCourses || {}).filter(Boolean).length > 0;
    const isEducationPrioritiesValid = Object.values(data.highSchool.educationPriorities || {}).filter(Boolean).length > 0;
    
    if (!isFavoriteCoursesValid || !isDifficultCoursesValid || !isEducationPrioritiesValid) {
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
      
      toast.error("Du må fylle ut alle nødvendige felt", {
        description: "Kontroller at du har valgt minst ett alternativ der det kreves"
      });
      
      return;
    }
    
    // Save questionnaire data in localStorage
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    localStorage.setItem('userData', JSON.stringify({
      ...userData,
      highSchool: data.highSchool
    }));
    
    toast.success("Spørreskjema fullført!", {
      description: "Takk for dine svar."
    });
    
    // Navigate to index page instead of dashboard
    navigate('/');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Spørreskjema for videregåendeelever</h1>
            <p className="text-muted-foreground mb-4">
              Hjelp oss å forstå din bakgrunn, interesser og mål slik at vi kan gi deg bedre veiledning.
            </p>
            <Progress value={formProgress} className="h-2" />
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <HighSchoolQuestionnaire form={form} setFormProgress={setFormProgress} />
                {/* Submission button is inside the questionnaire component */}
              </form>
            </Form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HighSchoolQuestionnairePage;
