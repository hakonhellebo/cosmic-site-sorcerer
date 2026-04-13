
-- Allow users to update their own responses (needed to save api_results after survey)
CREATE POLICY "Users can update own high school responses"
ON public.high_school_responses
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own university responses"
ON public.university_responses
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own worker responses"
ON public.worker_responses
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);
