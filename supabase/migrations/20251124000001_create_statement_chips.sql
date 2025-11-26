-- Create statement_chips table
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
