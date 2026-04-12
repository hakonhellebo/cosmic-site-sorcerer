import React from 'react';
import DynamicQuestionnaire from '@/components/questionnaire/DynamicQuestionnaire';
import { saveUniversityQuestionnaire } from '@/lib/supabase';

const UniversityQuestionnairePage: React.FC = () => {
  const handleSave = async (answers: Record<string, any>) => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    return saveUniversityQuestionnaire(userData, answers);
  };

  return (
    <DynamicQuestionnaire
      surveyId="student"
      title="Spørreskjema for studenter"
      subtitle="Hjelp oss å forstå din bakgrunn, interesser og mål slik at vi kan gi deg bedre veiledning."
      resultsPath="/results/university"
      apiUserType="student"
      onSaveToSupabase={handleSave}
    />
  );
};

export default UniversityQuestionnairePage;
