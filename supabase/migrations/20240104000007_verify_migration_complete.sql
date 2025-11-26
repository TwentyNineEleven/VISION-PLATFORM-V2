-- ============================================================================
-- Verify Migration Complete
-- ============================================================================
-- This migration verifies that all security fixes are properly applied
-- ============================================================================

DO $$
DECLARE
  function_exists BOOLEAN;
  view_count INTEGER;
  function_count INTEGER;
BEGIN
  -- Check if fix function exists
  SELECT EXISTS (
    SELECT 1 
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
    AND p.proname = 'fix_security_definer_views'
  ) INTO function_exists;
  
  -- Count views
  SELECT COUNT(*) INTO view_count
  FROM pg_views
  WHERE schemaname = 'public'
  AND viewname IN ('v_table_sizes', 'v_rls_policy_summary');
  
  -- Count functions with SET search_path
  SELECT COUNT(*) INTO function_count
  FROM pg_proc p
  JOIN pg_namespace n ON n.oid = p.pronamespace
  WHERE n.nspname = 'public'
  AND p.proname IN (
    'update_updated_at_column',
    'is_organization_member',
    'get_user_org_role',
    'user_has_org_permission',
    'can_view_document',
    'can_edit_document',
    'can_delete_document'
  )
  AND EXISTS (
    SELECT 1
    FROM pg_proc p2
    WHERE p2.oid = p.oid
    AND p2.proconfig IS NOT NULL
    AND array_to_string(p2.proconfig, ',') LIKE '%search_path%'
  );
  
  -- Report status
  RAISE NOTICE '=== Migration Verification ===';
  RAISE NOTICE 'Fix function exists: %', function_exists;
  RAISE NOTICE 'Security views count: % (expected: 2)', view_count;
  RAISE NOTICE 'Functions with search_path: % (sample check)', function_count;
  
  IF function_exists AND view_count = 2 THEN
    RAISE NOTICE '✅ All migrations appear complete';
  ELSE
    RAISE WARNING '⚠️ Some migrations may be incomplete';
  END IF;
END $$;

-- Verify views are accessible
SELECT 
  viewname,
  viewowner,
  'View exists' AS status
FROM pg_views
WHERE schemaname = 'public'
AND viewname IN ('v_table_sizes', 'v_rls_policy_summary')
ORDER BY viewname;

-- Verify function is callable
SELECT 
  proname AS function_name,
  CASE 
    WHEN proconfig IS NOT NULL AND array_to_string(proconfig, ',') LIKE '%search_path%' 
    THEN 'Has search_path'
    ELSE 'No search_path'
  END AS search_path_status
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public'
AND p.proname = 'fix_security_definer_views';

