
-- Schools table
CREATE TABLE public.schools (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  contact_email TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view schools" ON public.schools FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create schools" ON public.schools FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Creators can update their schools" ON public.schools FOR UPDATE TO authenticated USING (auth.uid() = created_by);

-- Class groups table
CREATE TABLE public.class_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  grade_level TEXT,
  program_area TEXT,
  join_code TEXT NOT NULL UNIQUE DEFAULT substr(md5(random()::text), 1, 8),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.class_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view class groups" ON public.class_groups FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create class groups" ON public.class_groups FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Creators can update their class groups" ON public.class_groups FOR UPDATE TO authenticated USING (auth.uid() = created_by);
CREATE POLICY "Creators can delete their class groups" ON public.class_groups FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- Class survey responses table
CREATE TABLE public.class_survey_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  class_group_id UUID REFERENCES public.class_groups(id) ON DELETE CASCADE NOT NULL,
  respondent_id TEXT NOT NULL DEFAULT substr(md5(random()::text), 1, 12),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  survey_type TEXT NOT NULL,
  responses JSONB,
  scores JSONB,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  completion_status TEXT NOT NULL DEFAULT 'started' CHECK (completion_status IN ('started', 'completed', 'abandoned')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.class_survey_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own responses" ON public.class_survey_responses FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own responses" ON public.class_survey_responses FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own responses" ON public.class_survey_responses FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Allow anonymous inserts for students without accounts
CREATE POLICY "Anonymous can insert responses" ON public.class_survey_responses FOR INSERT TO anon WITH CHECK (user_id IS NULL);

-- Security definer function for teachers to view class responses (aggregated)
CREATE OR REPLACE FUNCTION public.is_class_creator(_user_id UUID, _class_group_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.class_groups
    WHERE id = _class_group_id AND created_by = _user_id
  )
$$;

CREATE POLICY "Class creators can view responses" ON public.class_survey_responses FOR SELECT TO authenticated
  USING (public.is_class_creator(auth.uid(), class_group_id));

-- Shared results table (opt-in individual sharing)
CREATE TABLE public.shared_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  response_id UUID REFERENCES public.class_survey_responses(id) ON DELETE CASCADE NOT NULL,
  class_group_id UUID REFERENCES public.class_groups(id) ON DELETE CASCADE NOT NULL,
  shared_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  shared_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  display_name TEXT,
  result_data JSONB
);

ALTER TABLE public.shared_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can share their own results" ON public.shared_results FOR INSERT TO authenticated WITH CHECK (auth.uid() = shared_by);
CREATE POLICY "Users can view their own shares" ON public.shared_results FOR SELECT TO authenticated USING (auth.uid() = shared_by);
CREATE POLICY "Users can delete their own shares" ON public.shared_results FOR DELETE TO authenticated USING (auth.uid() = shared_by);
CREATE POLICY "Class creators can view shared results" ON public.shared_results FOR SELECT TO authenticated
  USING (public.is_class_creator(auth.uid(), class_group_id));

-- Index for fast join code lookups
CREATE INDEX idx_class_groups_join_code ON public.class_groups(join_code);
CREATE INDEX idx_class_survey_responses_class_group ON public.class_survey_responses(class_group_id);
CREATE INDEX idx_class_survey_responses_completion ON public.class_survey_responses(class_group_id, completion_status);
