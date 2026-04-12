
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import NoResultsView from '@/components/results/NoResultsView';
import ApiResultsView from '@/components/results/ApiResultsView';
import type { EdPathApiResponse } from '@/services/edpathApi.types';

const HighSchoolResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const [apiResults, setApiResults] = useState<EdPathApiResponse | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    // Try to load API results from the new dynamic questionnaire flow
    const edpathResults = localStorage.getItem('edpathResults');
    const surveyAnswers = localStorage.getItem('surveyAnswers');
    const surveyType = localStorage.getItem('surveyType');

    if (edpathResults && (surveyType === 'elev' || surveyType === null)) {
      try {
        const parsed = JSON.parse(edpathResults) as EdPathApiResponse;
        const hasContent = (parsed.dimensjoner?.length > 0) || 
                          (parsed.yrker?.length > 0) || 
                          (parsed.studier?.length > 0);
        if (hasContent) {
          setApiResults(parsed);
          setAnswers(surveyAnswers ? JSON.parse(surveyAnswers) : {});
          setHasData(true);
          return;
        }
      } catch (e) {
        console.error('Failed to parse edpathResults:', e);
      }
    }

    // No valid data found
    toast.warning("Ingen resultater funnet", {
      description: "Vennligst fullfør spørreskjemaet først."
    });
  }, [navigate]);

  if (!hasData || !apiResults) {
    return (
      <Layout>
        <NoResultsView />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">Din videregående profil</h1>
        </div>
        <Separator className="mb-8" />
        <ApiResultsView results={apiResults} userType="elev" />
      </div>
    </Layout>
  );
};

export default HighSchoolResultsPage;
