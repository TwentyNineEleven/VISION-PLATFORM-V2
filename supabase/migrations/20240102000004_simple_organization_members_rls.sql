-- Fix infinite recursion with a simple policy
-- Drop ALL existing policies on organization_members
DROP POLICY IF EXISTS "Users can view members of their organizations" ON public.organization_members;
DROP POLICY IF EXISTS "Users can view their own memberships" ON public.organization_members;
DROP POLICY IF EXISTS "Users can view organization members" ON public.organization_members;

-- Create ONE simple policy: users can only see their own memberships
CREATE POLICY "Users view own memberships only"
  ON public.organization_members
  FOR SELECT
  USING (
    user_id = auth.uid()
    AND status = 'active'
    AND deleted_at IS NULL
  );
