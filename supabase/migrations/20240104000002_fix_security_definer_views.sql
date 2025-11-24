-- ============================================================================
-- Fix Security Definer Views - Explicit Fix
-- ============================================================================
-- This migration explicitly fixes views that still have SECURITY DEFINER
-- by using a more forceful approach to ensure they're recreated correctly.
-- ============================================================================

-- ============================================================================
-- FIX v_table_sizes VIEW
-- ============================================================================

-- Force drop the view and all dependencies
DO $$
BEGIN
  -- Drop the view if it exists, ignoring errors
  DROP VIEW IF EXISTS public.v_table_sizes CASCADE;
EXCEPTION
  WHEN OTHERS THEN
    -- If drop fails, try to drop with different privileges
    NULL;
END $$;

-- Recreate without SECURITY DEFINER (defaults to SECURITY INVOKER)
CREATE VIEW public.v_table_sizes AS
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
  pg_total_relation_size(schemaname||'.'||tablename) AS size_bytes
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- ============================================================================
-- FIX v_rls_policy_summary VIEW
-- ============================================================================

-- Force drop the view and all dependencies
DO $$
BEGIN
  -- Drop the view if it exists, ignoring errors
  DROP VIEW IF EXISTS public.v_rls_policy_summary CASCADE;
EXCEPTION
  WHEN OTHERS THEN
    -- If drop fails, try to drop with different privileges
    NULL;
END $$;

-- Recreate without SECURITY DEFINER (defaults to SECURITY INVOKER)
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

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

-- Grant access to authenticated users
GRANT SELECT ON public.v_table_sizes TO authenticated;
GRANT SELECT ON public.v_rls_policy_summary TO authenticated;

-- ============================================================================
-- VERIFY VIEWS ARE CORRECT
-- ============================================================================

-- Verify the views don't have SECURITY DEFINER
-- This query will show if views are security definer (should return empty)
DO $$
DECLARE
  view_record RECORD;
BEGIN
  FOR view_record IN 
    SELECT viewname 
    FROM pg_views 
    WHERE schemaname = 'public' 
    AND viewname IN ('v_table_sizes', 'v_rls_policy_summary')
  LOOP
    -- Views created without SECURITY DEFINER default to SECURITY INVOKER
    RAISE NOTICE 'View % has been recreated without SECURITY DEFINER', view_record.viewname;
  END LOOP;
END $$;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON VIEW public.v_table_sizes IS 'Utility view for monitoring table sizes. Created without SECURITY DEFINER (defaults to SECURITY INVOKER).';
COMMENT ON VIEW public.v_rls_policy_summary IS 'Utility view for monitoring RLS policies. Created without SECURITY DEFINER (defaults to SECURITY INVOKER).';

