import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import Layout from '@/components/Layout';
import { Progress } from "@/components/ui/progress";
import { Form } from "@/components/ui/form";
import HighSchoolQuestionnaire from '@/components/HighSchoolQuestionnaire';
import { saveHighSchoolQuestionnaire } from '@/lib/supabase';

const HighSchoolQuestionnairePage = () => {
  const navigate = useNavigate();
  const [formProgress, setFormProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 6;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    const savedUserData = localStorage.getItem('userData');
    if (savedUserData) {
      setUserData(JSON.parse(savedUserData));
    }
  }, []);

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
        bestSubjectsOther: '',
        challengingSubjects: {},
        challengingSubjectsOther: '',
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
    },
    mode: 'onChange'
  });

  const onSubmit = async (data) => {
    console.log('High School Questionnaire Data:', data);
    setIsSubmitting(true);

    try {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      
      const { error } = await saveHighSchoolQuestionnaire(userData, data.highSchool);
      
      if (error) {
        toast.success("Spørreskjema fullført!", {
          description: "Takk for dine svar. Vi har laget en personlig karriereprofil til deg. (Merk: Svarene ble lagret lokalt, men ikke i databasen.)"
        });
      } else {
        toast.success("Spørreskjema fullført!", {
          description: "Takk for dine svar. Vi har laget en personlig karriereprofil til deg."
        });
      }
      
      navigate('/results/high-school');
    } catch (error) {
      console.error("Error saving form data:", error);
      toast.error("Det oppstod en feil", {
        description: "Kunne ikke lagre alle svarene dine, men vi viser deg resultatene basert på det vi har."
      });
      
      setTimeout(() => navigate('/results/high-school'), 1500);
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateCheckboxGroup = (fieldName, maxAllowed, requiredMessage) => {
    const values = form.getValues(fieldName);
    
    if (values && typeof values === 'object') {
      const selectedCount = Object.values(values).filter(Boolean).length;
      
      if (selectedCount === 0 && requiredMessage) {
        return requiredMessage;
      }
      
      if (selectedCount > maxAllowed) {
        return `Vennligst velg maksimalt ${maxAllowed} alternativer`;
      }
    }
    
    return true;
  };

  const validateCurrentPage = () => {
    let errors: string[] = [];
    
    setValidationErrors([]);
    
    if (currentPage === 1) {
      if (!form.getValues('highSchool.grade')) {
        errors.push("Spørsmål 1: Vennligst velg hvilket trinn du går på.");
      }
      
      if (form.getValues('highSchool.grade') !== "10th-grade" && !form.getValues('highSchool.studyDirection')) {
        errors.push("Spørsmål 2: Vennligst velg studieretning.");
      }
      
      if (!form.getValues('highSchool.averageGrade')) {
        errors.push("Spørsmål 3: Vennligst oppgi karaktergjennomsnitt.");
      }
      
      const favoriteCoursesValid = validateCheckboxGroup('highSchool.favoriteCourses', 3, "Spørsmål 4: Vennligst velg minst ett fag du liker best.");
      if (favoriteCoursesValid !== true) errors.push(favoriteCoursesValid);
      
      const difficultCoursesValid = validateCheckboxGroup('highSchool.difficultCourses', 3, "Spørsmål 5: Vennligst velg minst ett fag du synes er vanskeligst.");
      if (difficultCoursesValid !== true) errors.push(difficultCoursesValid);
      
      const educationPrioritiesValid = validateCheckboxGroup('highSchool.educationPriorities', 2, "Spørsmål 6: Vennligst velg minst én prioritet for utdanning.");
      if (educationPrioritiesValid !== true) errors.push(educationPrioritiesValid);
    }
    
    else if (currentPage === 2) {
      const interestsValid = validateCheckboxGroup('highSchool.interests', 3, "Spørsmål 7: Vennligst velg minst én interesse.");
      if (interestsValid !== true) errors.push(interestsValid);
      
      const workTasksValid = validateCheckboxGroup('highSchool.workTasks', 3, "Spørsmål 8: Vennligst velg minst én type arbeidsoppgave.");
      if (workTasksValid !== true) errors.push(workTasksValid);
      
      if (!form.getValues('highSchool.workEnvironment')) {
        errors.push("Spørsmål 9: Vennligst velg hvilken type miljø du trives i.");
      }
      
      if (!form.getValues('highSchool.workPreference')) {
        errors.push("Spørsmål 10: Vennligst velg om du liker å jobbe alene eller i team.");
      }
      
      const goodSkillsValid = validateCheckboxGroup('highSchool.goodSkills', 3, "Spørsmål 11: Vennligst velg minst én ferdighet du er god på.");
      if (goodSkillsValid !== true) errors.push(goodSkillsValid);
      
      const improveSkillsValid = validateCheckboxGroup('highSchool.improveSkills', 3, "Spørsmål 12: Vennligst velg minst én ferdighet du ønsker å bli bedre på.");
      if (improveSkillsValid !== true) errors.push(improveSkillsValid);
    }
    
    else if (currentPage === 3) {
      const learningStyleValid = validateCheckboxGroup('highSchool.learningStyle', 2, "Spørsmål 13: Vennligst velg minst én læringsstil.");
      if (learningStyleValid !== true) errors.push(learningStyleValid);
      
      const digitalToolsValid = validateCheckboxGroup('highSchool.digitalTools', 2, "Spørsmål 14: Vennligst velg minst ett digitalt verktøy.");
      if (digitalToolsValid !== true) errors.push(digitalToolsValid);
      
      if (!form.getValues('highSchool.technologyComfort')) {
        errors.push("Spørsmål 15: Vennligst velg hvor komfortabel du er med teknologi.");
      }
      
      const schoolChallengesValid = validateCheckboxGroup('highSchool.schoolChallenges', 2, "Spørsmål 16: Vennligst velg minst én utfordring med skolearbeidet.");
      if (schoolChallengesValid !== true) errors.push(schoolChallengesValid);
    }
    
    else if (currentPage === 4) {
      if (!form.getValues('highSchool.workIndependently')) {
        errors.push("Spørsmål 17: Vennligst vurder din evne til å jobbe selvstendig.");
      }
      
      if (!form.getValues('highSchool.preparedness')) {
        errors.push("Spørsmål 18: Vennligst vurder hvor godt forberedt du føler deg.");
      }
      
      if (!form.getValues('highSchool.collaboration')) {
        errors.push("Spørsmål 19: Vennligst velg hvor ofte du samarbeider med andre.");
      }
      
      if (!form.getValues('highSchool.aiUsage')) {
        errors.push("Spørsmål 20: Vennligst velg hvor ofte du bruker AI.");
      }
      
      const missingSkillsValid = validateCheckboxGroup('highSchool.missingSkills', 2, "Spørsmål 21: Vennligst velg minst én ferdighet du mangler.");
      if (missingSkillsValid !== true) errors.push(missingSkillsValid);
      
      if (!form.getValues('highSchool.studyTime')) {
        errors.push("Spørsmål 22: Vennligst oppgi hvor mye tid du bruker på skolearbeid.");
      }
      
      if (!form.getValues('highSchool.workExperience')) {
        errors.push("Spørsmål 23: Vennligst oppgi om du har hatt arbeidserfaring.");
      }
    }
    
    else if (currentPage === 5) {
      const industriesValid = validateCheckboxGroup('highSchool.interestingIndustries', 3, "Vennligst velg minst én interessant bransje.");
      if (industriesValid !== true) errors.push(industriesValid);
      
      const rolesValid = validateCheckboxGroup('highSchool.desiredRoles', 2, "Vennligst velg minst én ønsket rolle.");
      if (rolesValid !== true) errors.push(rolesValid);
      
      if (!form.getValues('highSchool.salaryImportance')) {
        errors.push("Vennligst velg hvor viktig lønn er for deg.");
      }
      
      if (!form.getValues('highSchool.socialImpactImportance')) {
        errors.push("Vennligst velg hvor viktig sosial påvirkning er for deg.");
      }
      
      const preferencesValid = validateCheckboxGroup('highSchool.workEnvironmentPreferences', 2, "Vennligst velg minst én preferanse for arbeidsmiljø.");
      if (preferencesValid !== true) errors.push(preferencesValid);
    }
    
    else if (currentPage === 6) {
      if (!form.getValues('highSchool.workLocation')) {
        errors.push("Vennligst velg hvor du ønsker å jobbe.");
      }
      
      const challengesValid = validateCheckboxGroup('highSchool.jobChallenges', 2, "Vennligst velg minst én utfordring med jobb.");
      if (challengesValid !== true) errors.push(challengesValid);
      
      const supportNeedsValid = validateCheckboxGroup('highSchool.careerSupportNeeds', 2, "Vennligst velg minst én type støtte du trenger.");
      if (supportNeedsValid !== true) errors.push(supportNeedsValid);
      
      if (!form.getValues('highSchool.educationMotivation')) {
        errors.push("Vennligst velg din motivasjon for utdanning.");
      }
      
      if (!form.getValues('highSchool.aiJobMarketImpact')) {
        errors.push("Vennligst velg hvordan AI påvirker jobbmarkedet.");
      }
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      if (validateCurrentPage()) {
        setCurrentPage(currentPage + 1);
        window.scrollTo(0, 0);
      } else {
        toast.error("Vennligst fullfør alle påkrevde felt", { 
          description: validationErrors.length > 0 ? validationErrors[0] : "Sjekk at du har svart riktig på alle spørsmålene." 
        });
      }
    } else {
      if (validateCurrentPage()) {
        form.handleSubmit(onSubmit)();
      } else {
        toast.error("Vennligst fullfør alle påkrevde felt", { 
          description: validationErrors.length > 0 ? validationErrors[0] : "Sjekk at du har svart riktig på alle spørsmålene." 
        });
      }
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
                  validationErrors={validationErrors}
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
