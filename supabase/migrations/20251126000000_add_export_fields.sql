-- Add export-related fields to community_assessments
ALTER TABLE public.community_assessments
ADD COLUMN IF NOT EXISTS empathy_narrative TEXT,
ADD COLUMN IF NOT EXISTS personas JSONB DEFAULT '[]'::jsonb;
