
-- Add api_results column to all three response tables
ALTER TABLE public.high_school_responses ADD COLUMN IF NOT EXISTS api_results jsonb;
ALTER TABLE public.university_responses ADD COLUMN IF NOT EXISTS api_results jsonb;
ALTER TABLE public.worker_responses ADD COLUMN IF NOT EXISTS api_results jsonb;
