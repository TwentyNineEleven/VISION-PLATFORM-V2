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
