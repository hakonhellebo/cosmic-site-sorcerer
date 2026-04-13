import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * On mount, checks if the logged-in user has previous survey results in Supabase.
 * If localStorage is missing edpathResults, restores them from the database.
 */
export const useRestoreResults = () => {
  const [isRestoring, setIsRestoring] = useState(true);
  const [restoredType, setRestoredType] = useState<string | null>(null);

  useEffect(() => {
    const restore = async () => {
      try {
        // Skip if we already have results
        if (localStorage.getItem('edpathResults')) {
          setIsRestoring(false);
          return;
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setIsRestoring(false);
          return;
        }

        // Check each response table for the most recent result with api_results
        const tables = [
          { table: 'high_school_responses', surveyType: 'elev', userType: 'highSchool' },
          { table: 'university_responses', surveyType: 'student', userType: 'university' },
          { table: 'worker_responses', surveyType: 'worker', userType: 'worker' },
        ] as const;

        let latestResult: any = null;
        let latestDate = '';
        let latestSurveyType = '';
        let latestUserType = '';

        for (const { table, surveyType, userType } of tables) {
          const { data } = await supabase
            .from(table)
            .select('*')
            .eq('user_id', user.id)
            .not('api_results', 'is', null)
            .order('created_at', { ascending: false })
            .limit(1);

          if (data && data.length > 0 && data[0].created_at > latestDate) {
            latestResult = data[0];
            latestDate = data[0].created_at;
            latestSurveyType = surveyType;
            latestUserType = userType;
          }
        }

        if (latestResult?.api_results) {
          localStorage.setItem('edpathResults', JSON.stringify(latestResult.api_results));
          localStorage.setItem('surveyType', latestSurveyType);
          localStorage.setItem('surveyAnswers', JSON.stringify(latestResult.responses || {}));
          setRestoredType(latestUserType);
          console.log('Restored previous results from Supabase:', latestSurveyType);
        }
      } catch (err) {
        console.warn('Could not restore results:', err);
      } finally {
        setIsRestoring(false);
      }
    };

    restore();
  }, []);

  return { isRestoring, restoredType };
};
