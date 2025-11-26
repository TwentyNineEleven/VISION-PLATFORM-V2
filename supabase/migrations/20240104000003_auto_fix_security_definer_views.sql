-- ============================================================================
-- Auto-Fix Security Definer Views
-- ============================================================================
-- These views may be auto-created by Supabase's monitoring/linter tools.
-- This migration creates a function that can be called to fix them if they
-- get recreated with SECURITY DEFINER.
-- ============================================================================

-- ============================================================================
-- FUNCTION TO FIX SECURITY DEFINER VIEWS
-- ============================================================================

CREATE OR REPLACE FUNCTION fix_security_definer_views()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Fix v_table_sizes if it exists with SECURITY DEFINER
  IF EXISTS (
    SELECT 1 
    FROM pg_views 
    WHERE schemaname = 'public' 
    AND viewname = 'v_table_sizes'
  ) THEN
    -- Drop and recreate without SECURITY DEFINER
    DROP VIEW IF EXISTS public.v_table_sizes CASCADE;
    
    CREATE VIEW public.v_table_sizes AS
    SELECT 
      schemaname,
      tablename,
      pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
      pg_total_relation_size(schemaname||'.'||tablename) AS size_bytes
    FROM pg_tables
    WHERE schemaname = 'public'
    ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
    
    GRANT SELECT ON public.v_table_sizes TO authenticated;
  END IF;

  -- Fix v_rls_policy_summary if it exists with SECURITY DEFINER
  IF EXISTS (
    SELECT 1 
    FROM pg_views 
    WHERE schemaname = 'public' 
    AND viewname = 'v_rls_policy_summary'
  ) THEN
    -- Drop and recreate without SECURITY DEFINER
    DROP VIEW IF EXISTS public.v_rls_policy_summary CASCADE;
    
    CREATE VIEW public.v_rls_policy_summary AS
    SELECT 
      schemaname,
      tablename,
      policyname,
      permissive,
      roles,
      cmd,
      qual,
      with_check
    FROM pg_policies
    WHERE schemaname = 'public'
    ORDER BY tablename, policyname;
    
    GRANT SELECT ON public.v_rls_policy_summary TO authenticated;
  END IF;
END;
$$;

-- ============================================================================
-- IMMEDIATELY FIX THE VIEWS
-- ============================================================================

-- Call the function to fix any existing views
SELECT fix_security_definer_views();

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

-- Grant execute permission to authenticated users (for manual fixes if needed)
GRANT EXECUTE ON FUNCTION fix_security_definer_views() TO authenticated;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON FUNCTION fix_security_definer_views() IS 'Fixes security definer views by recreating them without SECURITY DEFINER. Call this function if Supabase recreates these views with SECURITY DEFINER.';

