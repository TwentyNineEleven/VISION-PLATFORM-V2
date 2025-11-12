-- Add focus statement columns to community_assessments
ALTER TABLE public.community_assessments
ADD COLUMN IF NOT EXISTS focus_statement TEXT,
ADD COLUMN IF NOT EXISTS focus_statement_feedback JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS focus_statement_version INTEGER DEFAULT 0;

-- Add custom chip tracking
ALTER TABLE public.statement_chips
ADD COLUMN IF NOT EXISTS is_custom BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_edited BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS original_text TEXT;

COMMENT ON COLUMN public.community_assessments.focus_statement IS 'AI-generated focus statement based on selected chips';
COMMENT ON COLUMN public.community_assessments.focus_statement_feedback IS 'Array of feedback iterations with user input and AI responses';
COMMENT ON COLUMN public.community_assessments.focus_statement_version IS 'Current version number of focus statement';
COMMENT ON COLUMN public.statement_chips.is_custom IS 'True if chip was created by user, not AI';
COMMENT ON COLUMN public.statement_chips.is_edited IS 'True if chip text was modified from original';
COMMENT ON COLUMN public.statement_chips.original_text IS 'Original AI-generated text before user edits';
