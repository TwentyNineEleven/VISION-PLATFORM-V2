-- ============================================================================
-- COMMUNITY COMPASS DATABASE MIGRATIONS
-- ============================================================================
-- Run this SQL in Supabase SQL Editor to create all Community Compass tables
-- Dashboard: https://supabase.com/dashboard/project/qhibeqcsixitokxllhom/sql/new
-- ============================================================================

-- Create community_assessments table
CREATE TABLE IF NOT EXISTS public.community_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL, -- Assumes organization_id comes from auth.users or similar
    title TEXT NOT NULL,
    target_population TEXT NOT NULL,
    geographic_area TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'completed')),
    current_screen INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.community_assessments ENABLE ROW LEVEL SECURITY;

-- Create policy for organization isolation (placeholder, adjust based on actual auth schema)
-- Assuming organization_id is in the JWT metadata or similar
-- For now, we'll allow authenticated users to see their own org's data
-- This requires a way to get org_id from the user.
-- If not available, we might need a simpler policy for now or assume user_id owns it.

-- Let's add user_id for direct ownership if orgs aren't fully implemented yet
ALTER TABLE public.community_assessments ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

CREATE POLICY "Users can view their own assessments"
    ON public.community_assessments
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own assessments"
    ON public.community_assessments
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assessments"
    ON public.community_assessments
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_community_assessments_updated_at
    BEFORE UPDATE ON public.community_assessments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Create statement_chips table
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.statement_chips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES public.community_assessments(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    question_category TEXT NOT NULL, -- 'experiences', 'barriers', 'urgency', 'aspirations', 'strengths'
    is_selected BOOLEAN NOT NULL DEFAULT false,
    is_ai_generated BOOLEAN NOT NULL DEFAULT true,
    confidence NUMERIC,
    source_citation TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.statement_chips ENABLE ROW LEVEL SECURITY;

-- Policies
-- View chips
CREATE POLICY "Users can view chips for their assessments"
    ON public.statement_chips
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.community_assessments
            WHERE id = statement_chips.assessment_id
            AND (auth.uid() = user_id)
        )
    );

-- Insert chips (for custom chips or AI generation if client-side triggered, though AI usually server-side)
CREATE POLICY "Users can insert chips for their assessments"
    ON public.statement_chips
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.community_assessments
            WHERE id = statement_chips.assessment_id
            AND (auth.uid() = user_id)
        )
    );

-- Update chips (selection)
CREATE POLICY "Users can update chips for their assessments"
    ON public.statement_chips
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.community_assessments
            WHERE id = statement_chips.assessment_id
            AND (auth.uid() = user_id)
        )
    );

-- Delete chips
CREATE POLICY "Users can delete chips for their assessments"
    ON public.statement_chips
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.community_assessments
            WHERE id = statement_chips.assessment_id
            AND (auth.uid() = user_id)
        )
    );

-- ============================================================================
-- Create community_needs table
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.community_needs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES public.community_assessments(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL, -- 'service', 'resource', 'policy', 'infrastructure', 'support'
    urgency_level TEXT NOT NULL CHECK (urgency_level IN ('critical', 'high', 'medium', 'low')),
    impact_level TEXT NOT NULL CHECK (impact_level IN ('critical', 'high', 'medium', 'low')),
    evidence_level TEXT NOT NULL CHECK (evidence_level IN ('strong', 'moderate', 'limited', 'anecdotal')),
    is_ai_suggested BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.community_needs ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view needs for their assessments"
    ON public.community_needs
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.community_assessments
            WHERE id = community_needs.assessment_id
            AND (auth.uid() = user_id)
        )
    );

CREATE POLICY "Users can insert needs for their assessments"
    ON public.community_needs
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.community_assessments
            WHERE id = community_needs.assessment_id
            AND (auth.uid() = user_id)
        )
    );

CREATE POLICY "Users can update needs for their assessments"
    ON public.community_needs
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.community_assessments
            WHERE id = community_needs.assessment_id
            AND (auth.uid() = user_id)
        )
    );

CREATE POLICY "Users can delete needs for their assessments"
    ON public.community_needs
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.community_assessments
            WHERE id = community_needs.assessment_id
            AND (auth.uid() = user_id)
        )
    );

-- Create updated_at trigger
CREATE TRIGGER update_community_needs_updated_at
    BEFORE UPDATE ON public.community_needs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Add focus statement columns to community_assessments
-- ============================================================================
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

-- ============================================================================
-- DONE! After running this SQL:
-- 1. Verify tables exist in Supabase Table Editor
-- 2. Run: npx supabase gen types typescript --project-id qhibeqcsixitokxllhom > apps/shell/src/types/supabase.ts
-- 3. Commit the updated types file
-- 4. Community Compass will be fully functional!
-- ============================================================================
