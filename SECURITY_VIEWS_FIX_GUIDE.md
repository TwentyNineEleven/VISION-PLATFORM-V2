# Security Definer Views - Fix Guide

## Quick Fix

To manually fix the security definer views, run this SQL in your Supabase SQL Editor:

```sql
SELECT fix_security_definer_views();
```

## Check Current Status

Run this query to see the current state of the views:

```sql
SELECT 
  viewname,
  viewowner,
  CASE 
    WHEN viewowner = 'postgres' THEN 'WARNING: Owned by superuser'
    ELSE 'OK: Owned by regular user'
  END AS status
FROM pg_views
WHERE schemaname = 'public'
AND viewname IN ('v_table_sizes', 'v_rls_policy_summary');
```

## Understanding the Issue

The Supabase linter flags views owned by the `postgres` superuser as having `SECURITY DEFINER` behavior, even though PostgreSQL views don't technically have this property (only functions do).

## Function Details

The `fix_security_definer_views()` function:
- Drops and recreates both views without SECURITY DEFINER
- Grants SELECT permissions to authenticated users
- Can be called anytime the views need fixing

## When to Use

Call this function:
- After Supabase tools recreate the views
- When the linter shows errors for these views
- As part of your deployment process (optional)

## Automated Fix (Optional)

If these views keep getting recreated, you could set up a scheduled job:

```sql
-- This would need to be set up via pg_cron extension
-- SELECT cron.schedule('fix-security-views', '0 * * * *', 'SELECT fix_security_definer_views();');
```

Note: pg_cron may not be available in all Supabase plans.

## Migration Status

All migrations have been applied:
- ✅ 20240104000001 - Initial fix
- ✅ 20240104000002 - Explicit fix  
- ✅ 20240104000003 - Auto-fix function
- ✅ 20240104000004 - Diagnostic
- ✅ 20240104000005 - Final fix attempt
- ✅ 20240104000006 - Execute fix function

## Next Steps

1. **Refresh the linter** in Supabase Dashboard (wait 5-10 minutes)
2. **Check if errors persist** - if yes, views may be auto-recreated
3. **Call fix function** if needed: `SELECT fix_security_definer_views();`
4. **Contact Supabase support** if issue continues

