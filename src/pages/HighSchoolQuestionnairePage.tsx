import React from 'react';
import DynamicQuestionnaire from '@/components/questionnaire/DynamicQuestionnaire';
import { saveHighSchoolQuestionnaire } from '@/lib/supabase';

const HighSchoolQuestionnairePage: React.FC = () => {
  const handleSave = async (answers: Record<string, any>) => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    return saveHighSchoolQuestionnaire(userData, answers);
  };

  return (
    <DynamicQuestionnaire
      surveyId="elev"
      title="Spørreskjema for videregåendeelever"
      subtitle="Hjelp oss å forstå din bakgrunn, interesser og mål slik at vi kan gi deg bedre veiledning."
      resultsPath="/results/high-school"
      apiUserType="elev"
      onSaveToSupabase={handleSave}
    />
  );
};

export default HighSchoolQuestionnairePage;
