-- Create community_needs table
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
