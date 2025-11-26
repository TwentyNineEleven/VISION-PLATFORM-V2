# 🔍 VISION Platform - User Journey Analysis & Fix

**Date:** November 12, 2025
**Issue:** Cannot get past login - user journey broken
**Root Cause:** DEMO MODE enabled in providers

---

## 🚨 PROBLEMS FOUND

### 1. ✅ AuthProvider - FIXED
**Location:** `apps/platform-shell/src/providers/AuthProvider.tsx`
**Issue:** Was in DEMO MODE (authentication disabled)
**Status:** ✅ FIXED - Real authentication now enabled

### 2. ❌ OrganizationProvider - NEEDS FIX
**Location:** `apps/platform-shell/src/providers/OrganizationProvider.tsx`
**Issue:** Still in DEMO MODE (lines 110-124)
**Impact:**
- Organization fetching disabled
- Users can't create/select organizations
- Can't proceed past login
- Onboarding flow broken

---

## 📋 COMPLETE USER JOURNEY (Intended)

### Happy Path - New User

```
1. Visit http://localhost:3000
   ↓
2. Redirect to /login (not authenticated)
   ↓
3. Click "Create Account" tab
   ↓
4. Enter: Name, Email, Password
   ↓
5. Submit → Account created
   ↓
6. Verify email (Supabase local)
   ↓
7. Sign in with email/password
   ↓
8. AUTH SUCCESS → Redirect to /dashboard
   ↓
9. OrganizationProvider checks for orgs
   ↓
10. NO ORGANIZATIONS FOUND
    ↓
11. Auto-redirect to /onboarding
    ↓
12. Onboarding: "Create Your Organization"
    ↓
13. Enter organization name
    ↓
14. Click "Create Organization"
    ↓
15. Creates:
    - Organization record
    - organization_members record (user as owner)
    ↓
16. Redirect to /dashboard
    ↓
17. Dashboard shows app launcher:
    - CapacityIQ (enabled)
    - FundingFramer (enabled)
    - CRM Lite (coming soon)
    ↓
18. User clicks app → Navigate to app
```

### Happy Path - Returning User

```
1. Visit http://localhost:3000
   ↓
2. Redirect to /login
   ↓
3. Sign in with email/password
   ↓
4. AUTH SUCCESS → Redirect to /dashboard
   ↓
5. OrganizationProvider fetches user's orgs
   ↓
6. ORGANIZATIONS FOUND
   ↓
7. Set active organization (last used or first)
   ↓
8. Dashboard renders with:
    - Active organization shown
    - App launcher displayed
    - User menu available
    ↓
9. User can:
    - Switch organizations (if multiple)
    - Access apps
    - Manage settings
```

---

## 🐛 CURRENT BROKEN FLOW

### What Happens Now:

```
1. Visit http://localhost:3000
   ↓
2. Redirect to /login ✅ WORKS
   ↓
3. Sign in with credentials ✅ WORKS
   ↓
4. AUTH SUCCESS → Redirect to /dashboard ✅ WORKS
   ↓
5. OrganizationProvider runs... ❌ BROKEN
   ├─ DEMO MODE is active
   ├─ Sets organizations = []
   ├─ Sets activeOrganization = null
   ├─ Does NOT fetch real organizations
   └─ Does NOT redirect to onboarding
   ↓
6. Dashboard tries to render ❌ PARTIALLY BROKEN
   ├─ No active organization
   ├─ Organization switcher shows "Select Organization"
   ├─ Apps may not work without org context
   └─ User is stuck - can see UI but can't use platform
```

---

## 🔧 FIX REQUIRED

### Fix OrganizationProvider

**File:** `apps/platform-shell/src/providers/OrganizationProvider.tsx`

**Change lines 110-124 from:**
```typescript
useEffect(() => {
  // DEMO MODE: Disable organization fetching for design preview
  setOrganizations([]);
  setActiveOrganization(null);
  setIsLoading(false);

  /*
  if (isAuthenticated && user) {
    fetchOrganizations();
  } else {
    setOrganizations([]);
    setActiveOrganization(null);
    setIsLoading(false);
  }
  */
}, [isAuthenticated, user]);
```

**To:**
```typescript
useEffect(() => {
  if (isAuthenticated && user) {
    fetchOrganizations();
  } else {
    setOrganizations([]);
    setActiveOrganization(null);
    setIsLoading(false);
  }
}, [isAuthenticated, user]);
```

---

## 🎯 EXPECTED BEHAVIOR AFTER FIX

### Scenario 1: New User (First Login)

1. ✅ Sign in successfully
2. ✅ Redirect to /dashboard
3. ✅ OrganizationProvider fetches organizations
4. ✅ Finds 0 organizations
5. ✅ Auto-redirects to /onboarding
6. ✅ User creates organization
7. ✅ Redirects back to /dashboard
8. ✅ Dashboard shows apps with active org
9. ✅ User can access apps

### Scenario 2: Existing User (Has Organization)

1. ✅ Sign in successfully
2. ✅ Redirect to /dashboard
3. ✅ OrganizationProvider fetches organizations
4. ✅ Finds 1+ organizations
5. ✅ Sets active organization (last used or first)
6. ✅ Dashboard renders with organization context
7. ✅ User can:
   - Switch organizations (if multiple)
   - Access apps
   - Manage team
   - Adjust settings

---

## 📊 COMPLETE PAGE STRUCTURE

### Authentication Pages
- `/` → Redirects to `/dashboard`
- `/login` → Sign in / Create account
- `/signup` → Standalone signup (optional)

### Onboarding
- `/onboarding` → First-time setup (create organization)

### Main Dashboard
- `/dashboard` → App launcher (requires organization)
- `/dashboard/documents` → Document library
- `/dashboard/settings/organization` → Org settings
- `/dashboard/settings/team` → Team management
- `/dashboard/settings/profile` → User profile
- `/dashboard/settings/billing` → Billing (future)

### Role-Specific Dashboards
- `/dashboard/funder` → Funder dashboard
- `/dashboard/funder/cohorts` → Funder cohorts
- `/dashboard/funder/grantees` → Funder grantees
- `/dashboard/board` → Board member dashboard
- `/dashboard/volunteer` → Volunteer dashboard
- `/dashboard/contractor` → Contractor dashboard

### Apps
- `/apps/funding-framer` → Grant management app
  - `/apps/funding-framer/opportunities` → Grant opportunities
  - `/apps/funding-framer/proposals` → Grant proposals
  - `/apps/funding-framer/knowledge-base` → Organization info
  - `/apps/funding-framer/reports` → Reports
- `/apps/capacity-assessment` → CapacityIQ (future)
- `/apps/crm-lite` → CRM (future)

---

## 🔍 DATABASE REQUIREMENTS

### For Complete User Journey:

**Required Tables:**
1. ✅ `auth.users` - Supabase auth (built-in)
2. ✅ `organizations` - Organization records
3. ✅ `organization_members` - User-org relationships
4. ✅ `user_profiles` - Extended user info (optional)

**Onboarding Flow Needs:**
```sql
-- 1. Create organization
INSERT INTO organizations (name, slug, type)
VALUES ('My Nonprofit', 'my-nonprofit', 'nonprofit');

-- 2. Add user as owner
INSERT INTO organization_members (organization_id, user_id, role, status)
VALUES (org_id, user_id, 'owner', 'active');
```

**These tables exist:** ✅ Confirmed in migrations

---

## 🧪 TESTING CHECKLIST

### After Fixing OrganizationProvider:

**Test 1: New User Flow**
- [ ] Create new account at `/login`
- [ ] Sign in
- [ ] Should redirect to `/onboarding`
- [ ] Create organization
- [ ] Should redirect to `/dashboard`
- [ ] Should see active organization
- [ ] Apps should be accessible

**Test 2: Returning User Flow**
- [ ] Sign in with existing account
- [ ] Should redirect to `/dashboard` (NOT onboarding)
- [ ] Should see active organization
- [ ] Should be able to switch orgs (if multiple)
- [ ] Apps should work

**Test 3: Organization Switching**
- [ ] Create second organization
- [ ] Click organization switcher
- [ ] Should see both organizations
- [ ] Switch to second org
- [ ] Should persist on refresh

**Test 4: Settings Pages**
- [ ] Access `/dashboard/settings/organization`
- [ ] Access `/dashboard/settings/team`
- [ ] Access `/dashboard/settings/profile`
- [ ] All should work with active organization

---

## 💡 ADDITIONAL ISSUES TO CHECK

### 1. Dashboard Protection
**Check:** Does dashboard redirect unauthenticated users?
**Status:** ✅ Yes (lines 55-59 in dashboard/page.tsx)

### 2. Organization Required
**Check:** Do apps require active organization?
**Status:** ⚠️ Should verify - apps may fail without org context

### 3. Onboarding Skip
**Check:** Can users skip onboarding?
**Status:** ⚠️ Should prevent direct dashboard access without org

### 4. Email Verification
**Check:** Is email verification required?
**Status:** ⚠️ Supabase local may not send emails

---

## 🚀 IMMEDIATE ACTIONS

### 1. Fix OrganizationProvider (CRITICAL)
Enable real organization fetching by removing DEMO MODE

### 2. Test Complete Flow
- Create new test user
- Verify onboarding works
- Verify dashboard loads
- Verify apps are accessible

### 3. Add Guardrails
- Ensure dashboard requires organization
- Ensure apps check for active organization
- Add helpful error messages

### 4. Improve Onboarding
- Add skip option (for testing)
- Add organization type selection (nonprofit/funder)
- Add welcome tour

---

## 📁 KEY FILES

### Providers
1. `apps/platform-shell/src/providers/AuthProvider.tsx` - ✅ Fixed
2. `apps/platform-shell/src/providers/OrganizationProvider.tsx` - ❌ Needs fix

### Pages
3. `apps/platform-shell/src/app/(auth)/login/page.tsx` - ✅ Working
4. `apps/platform-shell/src/app/onboarding/page.tsx` - ⚠️ Needs testing
5. `apps/platform-shell/src/app/dashboard/page.tsx` - ⚠️ Needs org context

### Components
6. `apps/platform-shell/src/components/AppNavigation.tsx` - Check for org dependency
7. `packages/ui/src/components/Organization/OrganizationSwitcher.tsx` - ✅ Fixed

---

## 🎯 SUCCESS CRITERIA

After fixes, users should:
1. ✅ Be able to create account
2. ✅ Be able to sign in
3. ✅ Be redirected to onboarding (if new)
4. ✅ Be able to create organization
5. ✅ Land on dashboard with working apps
6. ✅ Be able to switch organizations
7. ✅ Be able to access all settings
8. ✅ Be able to use FundingFramer app
9. ✅ Have persistent session
10. ✅ Be able to sign out

---

## 🔧 FIX IMPLEMENTATION

See next message for the actual code fix to OrganizationProvider.

---

**Last Updated:** November 12, 2025
**Status:** Issue identified - Fix ready to apply
**Priority:** CRITICAL - Blocks all user access
