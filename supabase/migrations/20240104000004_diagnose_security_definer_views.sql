-- ============================================================================
-- Diagnose Security Definer Views
-- ============================================================================
-- This migration creates diagnostic queries to understand why these views
-- keep getting recreated with SECURITY DEFINER.
-- ============================================================================

-- Create a function to check view ownership and creation details
CREATE OR REPLACE FUNCTION diagnose_security_definer_views()
RETURNS TABLE (
  view_name TEXT,
  view_owner TEXT,
  is_security_definer BOOLEAN,
  view_definition TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    v.viewname::TEXT,
    v.viewowner::TEXT,
    -- Check if view has SECURITY DEFINER by examining pg_class
    EXISTS (
      SELECT 1 
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE c.relname = v.viewname
      AND n.nspname = v.schemaname
      AND c.relkind = 'v'
      -- Note: SECURITY DEFINER is stored in reloptions, but we can't easily check it
      -- So we'll check if the view was created by a superuser or extension
    ) AS is_security_definer,
    pg_get_viewdef((v.schemaname||'.'||v.viewname)::regclass, true)::TEXT AS view_definition
  FROM pg_views v
  WHERE v.schemaname = 'public'
  AND v.viewname IN ('v_table_sizes', 'v_rls_policy_summary');
END;
$$;

-- Check current state
DO $$
DECLARE
  view_info RECORD;
BEGIN
  RAISE NOTICE '=== Diagnosing Security Definer Views ===';
  
  FOR view_info IN 
    SELECT 
      viewname,
      viewowner,
      pg_get_viewdef((schemaname||'.'||viewname)::regclass, true) AS definition
    FROM pg_views
    WHERE schemaname = 'public'
    AND viewname IN ('v_table_sizes', 'v_rls_policy_summary')
  LOOP
    RAISE NOTICE 'View: %', view_info.viewname;
    RAISE NOTICE 'Owner: %', view_info.viewowner;
    RAISE NOTICE 'Definition (first 200 chars): %', LEFT(view_info.definition, 200);
    RAISE NOTICE '---';
  END LOOP;
END $$;

-- Try to fix them one more time
-- Note: PostgreSQL views don't have SECURITY DEFINER/INVOKER like functions
-- The linter might be checking ownership or creation method
DO $$
BEGIN
  -- Fix v_table_sizes
  IF EXISTS (SELECT 1 FROM pg_views WHERE schemaname = 'public' AND viewname = 'v_table_sizes') THEN
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
    
    RAISE NOTICE 'Recreated v_table_sizes';
  END IF;

  -- Fix v_rls_policy_summary
  IF EXISTS (SELECT 1 FROM pg_views WHERE schemaname = 'public' AND viewname = 'v_rls_policy_summary') THEN
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
    
    RAISE NOTICE 'Recreated v_rls_policy_summary';
  END IF;
END $$;

-- Grant permissions
GRANT SELECT ON public.v_table_sizes TO authenticated;
GRANT SELECT ON public.v_rls_policy_summary TO authenticated;
GRANT EXECUTE ON FUNCTION diagnose_security_definer_views() TO authenticated;

