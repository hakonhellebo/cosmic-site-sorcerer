import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Progress } from '@/components/ui/progress';
import NavigationButtons from './NavigationButtons';
import QuestionRenderer from './QuestionRenderer';
import { useSurveyQuestions, SurveyId, SurveyQuestion } from '@/hooks/useSurveyQuestions';
import { getRecommendations } from '@/services/edpathApi';
import { EdPathUserType, EdPathApiResponse } from '@/services/edpathApi.types';
import { Skeleton } from '@/components/ui/skeleton';

interface DynamicQuestionnaireProps {
  surveyId: SurveyId;
  title: string;
  subtitle: string;
  resultsPath: string;
  apiUserType: EdPathUserType;
  onSaveToSupabase: (answers: Record<string, any>) => Promise<{ error: any }>;
}

const DynamicQuestionnaire: React.FC<DynamicQuestionnaireProps> = ({
  surveyId,
  title,
  subtitle,
  resultsPath,
  apiUserType,
  onSaveToSupabase,
}) => {
  const navigate = useNavigate();
  const { pages, totalPages, isLoading, error } = useSurveyQuestions(surveyId);
  const [currentPage, setCurrentPage] = useState(1);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const progress = totalPages > 0 ? (currentPage / totalPages) * 100 : 0;
  const page = pages[currentPage - 1];

  const handleChange = useCallback((questionId: string, value: string | string[] | number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    // Clear error for this question
    setValidationErrors((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
  }, []);

  const isQuestionVisible = (question: SurveyQuestion): boolean => {
    if (!question.depends_on_question_id) return true;
    const parentValue = answers[question.depends_on_question_id];
    const requiredValue = question.depends_on_option_value;
    if (!requiredValue) return true;
    if (Array.isArray(parentValue)) return parentValue.includes(requiredValue);
    return parentValue === requiredValue;
  };

  const validatePage = (): boolean => {
    if (!page) return true;
    const errors: Record<string, string> = {};
    for (const q of page.questions) {
      if (!isQuestionVisible(q)) continue;
      if (!q.required) continue;
      const val = answers[q.question_id];
      if (val === undefined || val === null || val === '') {
        errors[q.question_id] = 'Dette feltet er påkrevd.';
      } else if (Array.isArray(val) && val.length === 0) {
        errors[q.question_id] = 'Velg minst ett alternativ.';
      } else if (Array.isArray(val) && q.min_select && val.length < q.min_select) {
        errors[q.question_id] = `Velg minst ${q.min_select} alternativer.`;
      }
    }
    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) {
      toast.error('Vennligst fullfør alle påkrevde felt');
    }
    return Object.keys(errors).length === 0;
  };

  const handleNext = async () => {
    if (!validatePage()) return;

    if (currentPage < totalPages) {
      setCurrentPage((p) => p + 1);
      window.scrollTo(0, 0);
    } else {
      // Submit
      await handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((p) => p - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Save answers to Supabase
      const { error: saveError } = await onSaveToSupabase(answers);
      if (saveError) {
        console.warn('Could not save to Supabase:', saveError);
      }

      // Store answers in localStorage for results page
      localStorage.setItem('surveyAnswers', JSON.stringify(answers));
      localStorage.setItem('surveyType', surveyId);

      // If coming from a class join link, update the class survey response
      const classGroupId = localStorage.getItem('classGroupId');
      if (classGroupId) {
        try {
          const { supabase } = await import('@/integrations/supabase/client');
          const { data: { user } } = await supabase.auth.getUser();
          // Try to update existing started response or insert new one
          await supabase.from('class_survey_responses').insert({
            class_group_id: classGroupId,
            survey_type: surveyId,
            user_id: user?.id || null,
            responses: answers,
            completion_status: 'completed',
            started_at: new Date(Date.now() - 10 * 60000).toISOString(), // approximate
            completed_at: new Date().toISOString(),
          });
        } catch (classErr) {
          console.warn('Could not save class response:', classErr);
        }
      }

      // Call EdPath API for recommendations
      try {
        const recommendations = await getRecommendations(answers, apiUserType);
        localStorage.setItem('edpathResults', JSON.stringify(recommendations));

        // Save API results to Supabase for persistence
        try {
          const { supabase: sb } = await import('@/integrations/supabase/client');
          const { data: { user } } = await sb.auth.getUser();
          if (user) {
            const tableMap: Record<string, string> = {
              elev: 'high_school_responses',
              student: 'university_responses',
              worker: 'worker_responses',
              arbeidstaker: 'worker_responses',
            };
            const table = tableMap[apiUserType];
            if (table) {
              // Use rpc or raw fetch to update api_results (column not yet in generated types)
              const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zcfclojzyqezuuwxzrzq.supabase.co';
              const { data: session } = await sb.auth.getSession();
              const token = session?.session?.access_token;
              if (token) {
                // Find latest response id
                const res = await fetch(
                  `${supabaseUrl}/rest/v1/${table}?user_id=eq.${user.id}&order=created_at.desc&limit=1&select=id`,
                  { headers: { 'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '', 'Authorization': `Bearer ${token}` } }
                );
                const rows = await res.json();
                if (rows?.[0]?.id) {
                  await fetch(
                    `${supabaseUrl}/rest/v1/${table}?id=eq.${rows[0].id}`,
                    {
                      method: 'PATCH',
                      headers: {
                        'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '',
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=minimal',
                      },
                      body: JSON.stringify({ api_results: recommendations }),
                    }
                  );
                }
              }
            }
          }
        } catch (persistErr) {
          console.warn('Could not persist API results to Supabase:', persistErr);
        }
      } catch (apiError) {
        console.error('EdPath API error:', apiError);
        toast.warning('Kunne ikke hente anbefalinger fra API', {
          description: 'Resultatene vises basert på lokale beregninger.',
        });
      }

      toast.success('Spørreskjema fullført!', {
        description: 'Takk for dine svar. Du vil nå bli sendt til resultatsiden.',
      });

      setTimeout(() => navigate(resultsPath), 1000);
    } catch (err) {
      console.error('Submit error:', err);
      toast.error('Noe gikk galt', {
        description: 'Vi kunne ikke lagre svarene dine. Vennligst prøv igjen.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 pt-24 pb-12">
          <div className="max-w-3xl mx-auto space-y-4">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-2 w-full" />
            <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 pt-24 pb-12">
          <div className="max-w-3xl mx-auto">
            <div className="bg-destructive/10 text-destructive p-4 rounded-md">
              Kunne ikke laste spørsmålene. Vennligst prøv igjen senere.
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-3xl font-bold">{title}</h1>
              <span className="text-sm font-medium">
                {currentPage} av {totalPages}
              </span>
            </div>
            <p className="text-muted-foreground mb-4">{subtitle}</p>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            {page && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">{page.page_label}</h2>

                {page.questions
                  .filter(isQuestionVisible)
                  .map((q) => (
                    <QuestionRenderer
                      key={q.question_id}
                      question={q}
                      value={answers[q.question_id]}
                      onChange={handleChange}
                      error={validationErrors[q.question_id]}
                    />
                  ))}

                <NavigationButtons
                  page={currentPage}
                  onPrevious={handlePrevious}
                  onSubmit={handleNext}
                  isSubmitting={isSubmitting}
                  isLastPage={currentPage === totalPages}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DynamicQuestionnaire;
