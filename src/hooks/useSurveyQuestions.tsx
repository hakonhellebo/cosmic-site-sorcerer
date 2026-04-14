import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type SurveyId = 'elev' | 'student' | 'worker';

export interface SurveyOption {
  option_value: string;
  option_label: string | null;
  option_order: number | null;
  is_exclusive: boolean | null;
  is_open_text: boolean | null;
  depends_on_question_id: string | null;
  depends_on_option_value: string | null;
}

export interface SurveyQuestion {
  question_id: string;
  legacy_id: string | null;
  page_id: string | null;
  page_label: string | null;
  page_order: number | null;
  question_order: number | null;
  text: string | null;
  help_text: string | null;
  type: 'text' | 'single_select' | 'multi_select' | 'multi_select_search' | 'scale_1_5' | 'number';
  required: boolean | null;
  max_select: number | null;
  min_select: number | null;
  min_value: number | null;
  max_value: number | null;
  placeholder: string | null;
  depends_on_question_id: string | null;
  depends_on_option_value: string | null;
  survey_options: SurveyOption[];
}

export interface SurveySection {
  page_id: string;
  section_label: string | null;
  section_order: number | null;
}

export interface SurveyPage {
  page_id: string;
  page_label: string;
  page_order: number;
  questions: SurveyQuestion[];
}

export const useSurveyQuestions = (surveyId: SurveyId) => {
  const questionsQuery = useQuery({
    queryKey: ['survey-questions', surveyId],
    queryFn: async () => {
      // Fetch questions
      const { data: questions, error: qError } = await supabase
        .from('survey_questions')
        .select(`
          question_id,
          legacy_id,
          page_id,
          page_label,
          page_order,
          question_order,
          text,
          help_text,
          type,
          required,
          max_select,
          min_select,
          min_value,
          max_value,
          placeholder,
          depends_on_question_id,
          depends_on_option_value
        `)
        .eq('survey_id', surveyId)
        .order('page_order', { ascending: true })
        .order('question_order', { ascending: true });

      if (qError) throw qError;

      // Fetch options separately
      const { data: options, error: oError } = await supabase
        .from('survey_options')
        .select(`
          question_id,
          option_value,
          option_label,
          option_order,
          is_exclusive,
          is_open_text,
          depends_on_question_id,
          depends_on_option_value
        `)
        .eq('survey_id', surveyId)
        .order('option_order', { ascending: true });

      if (oError) throw oError;

      // Group options by question_id
      const optionsByQuestion = new Map<string, SurveyOption[]>();
      for (const opt of (options || [])) {
        const qid = opt.question_id;
        if (!optionsByQuestion.has(qid)) {
          optionsByQuestion.set(qid, []);
        }
        optionsByQuestion.get(qid)!.push(opt);
      }

      // Merge options into questions
      return (questions || []).map((q) => ({
        ...q,
        survey_options: optionsByQuestion.get(q.question_id) || [],
      })) as SurveyQuestion[];
    },
    staleTime: 1000 * 60 * 30,
  });

  const sectionsQuery = useQuery({
    queryKey: ['survey-sections', surveyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('survey_sections')
        .select('page_id, section_label, section_order')
        .eq('survey_id', surveyId)
        .order('section_order', { ascending: true });

      if (error) throw error;
      return data as SurveySection[];
    },
    staleTime: 1000 * 60 * 30,
  });

  // Group questions into pages
  const pages: SurveyPage[] = [];
  if (questionsQuery.data) {
    const pageMap = new Map<string, SurveyPage>();
    for (const q of questionsQuery.data) {
      const pid = q.page_id || 'default';
      if (!pageMap.has(pid)) {
        pageMap.set(pid, {
          page_id: pid,
          page_label: q.page_label || pid,
          page_order: q.page_order || 0,
          questions: [],
        });
      }
      pageMap.get(pid)!.questions.push(q);
    }
    pages.push(...Array.from(pageMap.values()).sort((a, b) => a.page_order - b.page_order));
  }

  return {
    questions: questionsQuery.data || [],
    sections: sectionsQuery.data || [],
    pages,
    totalPages: pages.length,
    isLoading: questionsQuery.isLoading || sectionsQuery.isLoading,
    error: questionsQuery.error || sectionsQuery.error,
  };
};
