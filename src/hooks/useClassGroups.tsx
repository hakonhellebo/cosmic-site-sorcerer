import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface School {
  id: string;
  name: string;
  address?: string;
  contact_email?: string;
  created_by?: string;
  created_at: string;
}

export interface ClassGroup {
  id: string;
  school_id: string;
  name: string;
  grade_level?: string;
  program_area?: string;
  join_code: string;
  created_by?: string;
  created_at: string;
  schools?: School;
}

export interface ClassStats {
  total: number;
  completed: number;
  completionRate: number;
  avgTimeMinutes: number;
}

export function useSchools() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSchools = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .eq('created_by', user.id)
      .order('created_at', { ascending: false });
    if (!error && data) setSchools(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchSchools(); }, [fetchSchools]);

  const createSchool = async (name: string, address?: string, contactEmail?: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast.error('Du må være logget inn'); return null; }
    const { data, error } = await supabase
      .from('schools')
      .insert({ name, address, contact_email: contactEmail, created_by: user.id })
      .select()
      .single();
    if (error) { toast.error('Kunne ikke opprette skole'); return null; }
    setSchools(prev => [data, ...prev]);
    return data;
  };

  return { schools, loading, createSchool, refetch: fetchSchools };
}

export function useClassGroups(schoolId?: string) {
  const [classGroups, setClassGroups] = useState<ClassGroup[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClassGroups = useCallback(async () => {
    if (!schoolId) { setLoading(false); return; }
    const { data, error } = await supabase
      .from('class_groups')
      .select('*')
      .eq('school_id', schoolId)
      .order('created_at', { ascending: false });
    if (!error && data) setClassGroups(data);
    setLoading(false);
  }, [schoolId]);

  useEffect(() => { fetchClassGroups(); }, [fetchClassGroups]);

  const createClassGroup = async (name: string, gradeLevel?: string, programArea?: string) => {
    if (!schoolId) return null;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast.error('Du må være logget inn'); return null; }
    const { data, error } = await supabase
      .from('class_groups')
      .insert({ school_id: schoolId, name, grade_level: gradeLevel, program_area: programArea, created_by: user.id })
      .select()
      .single();
    if (error) { toast.error('Kunne ikke opprette klasse'); return null; }
    setClassGroups(prev => [data, ...prev]);
    return data;
  };

  return { classGroups, loading, createClassGroup, refetch: fetchClassGroups };
}

export function useClassStats(classGroupId?: string) {
  const [stats, setStats] = useState<ClassStats>({ total: 0, completed: 0, completionRate: 0, avgTimeMinutes: 0 });
  const [responses, setResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    if (!classGroupId) { setLoading(false); return; }
    const { data, error } = await supabase
      .from('class_survey_responses')
      .select('*')
      .eq('class_group_id', classGroupId);
    if (error) { setLoading(false); return; }
    const all = data || [];
    setResponses(all);
    const completed = all.filter(r => r.completion_status === 'completed');
    const times = completed
      .filter(r => r.started_at && r.completed_at)
      .map(r => (new Date(r.completed_at!).getTime() - new Date(r.started_at).getTime()) / 60000);
    const avgTime = times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0;
    setStats({
      total: all.length,
      completed: completed.length,
      completionRate: all.length > 0 ? Math.round((completed.length / all.length) * 100) : 0,
      avgTimeMinutes: Math.round(avgTime),
    });
    setLoading(false);
  }, [classGroupId]);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  return { stats, responses, loading, refetch: fetchStats };
}
