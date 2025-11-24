-- ============================================================================
-- Execute Fix Function for Security Definer Views
-- ============================================================================
-- This migration calls the fix function to ensure views are properly recreated
-- ============================================================================

-- Call the fix function
SELECT fix_security_definer_views();

-- Verify the views exist and are correct
DO $$
DECLARE
  view_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO view_count
  FROM pg_views
  WHERE schemaname = 'public'
  AND viewname IN ('v_table_sizes', 'v_rls_policy_summary');
  
  IF view_count = 2 THEN
    RAISE NOTICE 'Both views exist after fix';
  ELSE
    RAISE WARNING 'Expected 2 views, found %', view_count;
  END IF;
END $$;

