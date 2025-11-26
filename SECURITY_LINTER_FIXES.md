# Security Linter Fixes

This document summarizes the security issues identified by the Supabase database linter and the fixes applied.

## Issues Fixed

### 1. Security Definer Views (ERROR level)

**Issue:** Two views (`v_table_sizes` and `v_rls_policy_summary`) were defined with `SECURITY DEFINER`, which can bypass Row Level Security policies.

**Fix:** 
- Recreated both views without `SECURITY DEFINER`
- These are utility views for monitoring, not security-sensitive operations
- Granted `SELECT` access to authenticated users

**Migration:** `20240104000001_fix_security_linter_issues.sql`

### 2. Function Search Path Mutable (WARN level)

**Issue:** 20+ functions were missing `SET search_path`, which can lead to search_path injection attacks.

**Functions Fixed:**
- `update_updated_at_column`
- `is_organization_member`
- `get_user_org_role`
- `user_has_org_permission`
- `generate_invite_token`
- `expire_old_invites`
- `is_organization_owner`
- `get_user_organizations`
- `validate_invite_token`
- `create_owner_membership`
- `log_organization_update`
- `log_member_change`
- `log_invite_event`
- `has_organization_role`
- `can_view_document`
- `can_edit_document`
- `can_delete_document`
- `update_folder_path`
- `manage_document_versions`
- `log_document_activity`

**Fix:** Added `SET search_path = public` to all functions to prevent search_path injection attacks.

**Migration:** `20240104000001_fix_security_linter_issues.sql`

### 3. Leaked Password Protection (WARN level)

**Issue:** Leaked password protection is disabled in Supabase Auth settings.

**Fix:** This is a **Supabase Dashboard configuration**, not a code issue. To enable:

1. Go to Supabase Dashboard → Authentication → Settings
2. Enable "Leaked Password Protection"
3. This feature checks passwords against HaveIBeenPwned.org database

**Note:** This cannot be fixed via migration - it requires manual configuration in the Supabase dashboard.

## Migration Details

The migration file `supabase/migrations/20240104000001_fix_security_linter_issues.sql` contains:

1. **View Fixes:**
   - Drops and recreates `v_table_sizes` without SECURITY DEFINER
   - Drops and recreates `v_rls_policy_summary` without SECURITY DEFINER
   - Grants appropriate permissions

2. **Function Fixes:**
   - All functions updated with `SET search_path = public`
   - Functions maintain their existing `SECURITY DEFINER` where needed for RLS bypass
   - All function signatures and logic remain unchanged

## Verification

After applying the migration, run the Supabase database linter again to verify:

```bash
# In Supabase Dashboard
# Go to Database → Linter
# All security warnings should be resolved
```

## Security Impact

- ✅ **Improved:** Functions are now protected against search_path injection
- ✅ **Improved:** Views no longer bypass RLS unintentionally
- ⚠️ **Manual Action Required:** Enable leaked password protection in dashboard

## Related Documentation

- [Supabase Database Linter](https://supabase.com/docs/guides/database/database-linter)
- [Function Security](https://supabase.com/docs/guides/database/database-linter?lint=0011_function_search_path_mutable)
- [View Security](https://supabase.com/docs/guides/database/database-linter?lint=0010_security_definer_view)
- [Password Security](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection)

