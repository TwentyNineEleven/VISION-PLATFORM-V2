-- ============================================================================
-- Check Security Definer Views Status
-- ============================================================================
-- Run this script to check the current state of the security definer views
-- ============================================================================

-- Check if views exist
SELECT 
  viewname,
  viewowner,
  CASE 
    WHEN viewowner = 'postgres' THEN 'WARNING: Owned by superuser (may trigger linter)'
    ELSE 'OK: Owned by regular user'
  END AS ownership_status
FROM pg_views
WHERE schemaname = 'public'
AND viewname IN ('v_table_sizes', 'v_rls_policy_summary')
ORDER BY viewname;

-- Check view definitions
SELECT 
  viewname,
  LEFT(pg_get_viewdef((schemaname||'.'||viewname)::regclass, true), 100) AS definition_preview
FROM pg_views
WHERE schemaname = 'public'
AND viewname IN ('v_table_sizes', 'v_rls_policy_summary')
ORDER BY viewname;

-- Call fix function and show result
SELECT 'fix_security_definer_views() executed' AS status;
SELECT fix_security_definer_views();

-- Verify after fix
SELECT 
  viewname,
  viewowner,
  'Fixed' AS status
FROM pg_views
WHERE schemaname = 'public'
AND viewname IN ('v_table_sizes', 'v_rls_policy_summary')
ORDER BY viewname;

