
-- Create gallery_submissions table for community-submitted quotes
CREATE TABLE public.gallery_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  editor_state JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gallery_submissions ENABLE ROW LEVEL SECURITY;

-- Anyone can view gallery submissions
CREATE POLICY "Anyone can view gallery submissions"
ON public.gallery_submissions
FOR SELECT
TO public
USING (true);

-- Authenticated users can submit their own quotes
CREATE POLICY "Users can submit their own quotes"
ON public.gallery_submissions
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);
