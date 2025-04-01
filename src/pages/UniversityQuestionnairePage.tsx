import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UniversityQuestionnaire from '@/components/UniversityQuestionnaire';
import Layout from '@/components/Layout';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Form } from '@/components/ui/form';
import { Progress } from "@/components/ui/progress";

const UniversityQuestionnairePage: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [page, setPage] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formProgress, setFormProgress] = useState<number>(0);
  const totalPages = 8; // Updated to 8 pages
  
  const form = useForm({
    defaultValues: {
      university: {
        // Page 1 - Personal Information
        studyField: "",
        institution: "",
        otherInstitution: "",
        level: "",
        changedField: "",
        certaintylevel: "",
        
        // Page 2 - Skills and Competencies
        interests: {},
        strengths: {},
        weaknesses: {},
        learningStyle: {},
        collaboration: "",
        aiUsage: "",
        internship: "",
        internshipValue: "",
        
        // Page 3 - Motivation and Ambitions
        studyReason: "",
        salaryImportance: "",
        impactImportance: "",
        jobPriorities: {},
        jobChallenges: {},
        internationalImportance: "",
        entrepreneurship: "",
        
        // Page 4 - Career Expectations
        futureRole: "",
        futureEmployerFactors: {},
        preferredCompanyType: "",
        technologyImportance: "",
        workLifeBalance: "",
        remoteWorkImportance: "",
        travelImportance: "",
        satisfactionFactors: {},
        employerValuesImportance: "",
        
        // Page 5 - Preferences and Work Style
        peopleTech: "",
        projectPreference: "",
        uncertaintyReaction: "",
        careerPathImportance: "",
        dreamJob: "",
        preferredWorkEnvironment: "",
        
        // Page 6 - Reflection and Transition
        studyChoiceReason: "",
        studyChoiceReasonOther: "",
        postStudyPlan: "",
        industryContact: "",
        studyMissing: {},
        setbackReaction: "",
        successMeaning: "",
        successMeaningOther: "",
        
        // Page 7 - Grades and Work Experience
        highSchoolGrades: "",
        currentGrades: "",
        bestSubjects: {},
        hadJob: "",
        jobCount: "",
        jobTypes: {},
        industries: {},
        companies: "",
        jobTitles: "",
        jobLearning: {},
        jobLearningOther: ""
      }
    }
  });
  
  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    
    // Update progress whenever page changes
    setFormProgress((page / totalPages) * 100);
  }, [page]);

  const handleNextPage = () => {
    setPage(current => Math.min(current + 1, totalPages)); 
    window.scrollTo(0, 0);
  };

  const handlePreviousPage = () => {
    setPage(current => Math.max(current - 1, 1));
    window.scrollTo(0, 0);
  };

  const handleSubmitQuestionnaire = async () => {
    try {
      setIsSubmitting(true);
      
      // Get the form data
      const formData = form.getValues();
      
      // Create user data object
      const userData = {
        firstName: currentUser?.firstName || "Anonymous",
        lastName: currentUser?.lastName || "User",
        email: currentUser?.email || "",
        questionnaire: {
          university: formData.university,
        }
      };

      // Save the full user data including questionnaire responses
      localStorage.setItem('userFullData', JSON.stringify(userData));
      
      // If user is logged in, save this data to their profile
      if (currentUser) {
        localStorage.setItem(`userFullData_${currentUser.id}`, JSON.stringify(userData));
      }
      
      toast.success("Spørreskjema fullført!", {
        description: "Takk for dine svar. Du vil nå bli sendt til resultatsiden."
      });
      
      // Navigate to results
      setTimeout(() => {
        navigate('/results/university');
      }, 1000);
      
    } catch (error) {
      console.error("Error submitting questionnaire:", error);
      toast.error("Noe gikk galt", {
        description: "Vi kunne ikke lagre svarene dine. Vennligst prøv igjen."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-3xl font-bold">Spørreskjema for studenter</h1>
              <span className="text-sm font-medium">{page} av {totalPages}</span>
            </div>
            <p className="text-muted-foreground mb-4">
              Hjelp oss å forstå din bakgrunn, interesser og mål slik at vi kan gi deg bedre veiledning.
            </p>
            <Progress value={formProgress} className="h-2" />
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <Form {...form}>
              <form>
                <UniversityQuestionnaire 
                  form={form}
                  page={page}
                  onPrevious={handlePreviousPage}
                  onSubmit={page === totalPages ? handleSubmitQuestionnaire : handleNextPage}
                  isSubmitting={isSubmitting}
                />
              </form>
            </Form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UniversityQuestionnairePage;
