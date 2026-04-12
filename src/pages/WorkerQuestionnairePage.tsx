import React from 'react';
import DynamicQuestionnaire from '@/components/questionnaire/DynamicQuestionnaire';
import { saveWorkerQuestionnaire } from '@/lib/supabase';

const WorkerQuestionnairePage: React.FC = () => {
  const handleSave = async (answers: Record<string, any>) => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    return saveWorkerQuestionnaire(userData, answers);
  };

  return (
    <DynamicQuestionnaire
      surveyId="worker"
      title="Spørreskjema for yrkesaktive"
      subtitle="Hjelp oss å forstå din bakgrunn, erfaring og karrieremål."
      resultsPath="/results/worker"
      apiUserType="arbeidstaker"
      onSaveToSupabase={handleSave}
    />
  );
};

export default WorkerQuestionnairePage;
