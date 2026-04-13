import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, ArrowRight } from 'lucide-react';

const SurveyJoinPage: React.FC = () => {
  const { joinCode } = useParams<{ joinCode: string }>();
  const navigate = useNavigate();
  const [classGroup, setClassGroup] = useState<any>(null);
  const [school, setSchool] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const lookupClass = async () => {
      if (!joinCode) { setError('Ugyldig kode'); setLoading(false); return; }
      
      const { data: cg, error: cgError } = await supabase
        .from('class_groups')
        .select('*')
        .eq('join_code', joinCode)
        .single();

      if (cgError || !cg) {
        setError('Fant ingen klasse med denne koden. Sjekk at koden er riktig.');
        setLoading(false);
        return;
      }

      setClassGroup(cg);

      const { data: schoolData } = await supabase
        .from('schools')
        .select('*')
        .eq('id', cg.school_id)
        .single();

      if (schoolData) setSchool(schoolData);
      setLoading(false);
    };

    lookupClass();
  }, [joinCode]);

  const startSurvey = () => {
    // Store class group info in localStorage so the questionnaire can link responses
    localStorage.setItem('classGroupId', classGroup.id);
    localStorage.setItem('classJoinCode', joinCode || '');
    
    // Create a started response record
    createStartedResponse().then(() => {
      navigate('/high-school-questionnaire');
    });
  };

  const createStartedResponse = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from('class_survey_responses').insert({
        class_group_id: classGroup.id,
        survey_type: 'elev',
        user_id: user?.id || null,
        completion_status: 'started',
        started_at: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Could not create started response:', e);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-slate-50 pt-24 pb-16 flex items-center justify-center">
          <div className="space-y-4 w-full max-w-md">
            <Skeleton className="h-8 w-2/3 mx-auto" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-slate-50 pt-24 pb-16 flex items-center justify-center">
          <Card className="max-w-md w-full">
            <CardContent className="pt-8 pb-8 text-center">
              <p className="text-lg text-slate-600 mb-4">{error}</p>
              <Button variant="outline" onClick={() => navigate('/')}>
                Gå til forsiden
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 pt-24 pb-16 flex items-center justify-center">
        <Card className="max-w-lg w-full mx-4 shadow-lg border-0">
          <CardContent className="pt-10 pb-10 text-center">
            <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-8 w-8 text-teal-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Velkommen til EdPath</h1>
            {school && (
              <p className="text-lg text-teal-600 font-medium mb-1">{school.name}</p>
            )}
            <p className="text-slate-500 mb-1">{classGroup.name}</p>
            <div className="flex gap-2 justify-center text-sm text-slate-400 mb-8">
              {classGroup.grade_level && <span>{classGroup.grade_level}</span>}
              {classGroup.program_area && <span>• {classGroup.program_area}</span>}
            </div>
            
            <p className="text-slate-600 mb-8 max-w-sm mx-auto">
              Du er invitert til å ta EdPath sin karriereveiledning. Svarene dine er anonyme og hjelper både deg og rådgiveren din.
            </p>

            <Button 
              onClick={startSurvey} 
              size="lg" 
              className="gap-2 bg-teal-600 hover:bg-teal-700 text-lg px-8"
            >
              Start spørreundersøkelsen <ArrowRight className="h-5 w-5" />
            </Button>

            <p className="text-xs text-slate-400 mt-6">
              Undersøkelsen tar ca. 8–12 minutter. Svarene dine er anonyme.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SurveyJoinPage;
