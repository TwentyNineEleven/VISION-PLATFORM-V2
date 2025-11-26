# Organization Onboarding

**Purpose:** Initial organization setup flow for new users that creates their organization profile and enables platform access
**Last Updated:** 2025-01-13
**Owner:** VISION Platform Team
**Status:** Ready for Implementation

---

## Overview

The Organization Onboarding feature solves a critical issue where new users encounter an infinite loading spinner after login because the `/onboarding` route doesn't exist. This feature creates a seamless first-time user experience by guiding users through creating their organization profile, which is required to access the VISION Platform.

The onboarding flow is triggered automatically when an authenticated user has no organization membership. Users complete a simple form with minimal required fields (organization name and contact email), and are then redirected to the dashboard where they can access all enabled platform applications.

This feature integrates tightly with the authentication system (AuthProvider) and organization management (OrganizationProvider) to ensure users cannot access platform features until they've completed onboarding, while preventing infinite redirect loops.

---

## Key Capabilities

- **Automatic Onboarding Detection** - Middleware and OrganizationProvider automatically detect users without organizations and redirect them to `/onboarding`
- **Minimal Required Fields** - Only organization name and primary contact email are required, reducing friction and increasing completion rates
- **Progressive Disclosure** - Optional fields (address, sector, budget range) are organized in collapsible sections for users who want to provide more detail
- **Auto-Slug Generation** - Database triggers automatically generate unique organization slugs from the organization name
- **Default App Access** - New organizations are automatically granted access to core platform apps (CapacityIQ, FundingFramer, Program Builder, Logic Model)

---

## User Stories

### Primary User Story
**As a new VISION Platform user**, I want to quickly set up my organization profile so that I can start using the platform applications without delays or confusion.

**Acceptance Criteria:**
- User is automatically redirected to `/onboarding` after first login
- User can complete onboarding with just 2 required fields (name, email)
- User can optionally provide additional details (address, sector, budget)
- User receives clear validation feedback for any errors
- User is redirected to dashboard upon successful completion
- User's organization appears in the organization switcher
- User can access all enabled platform apps

### Secondary User Story
**As an organization admin**, I want to update my organization's information so that our profile remains accurate and complete.

**Acceptance Criteria:**
- User can navigate to Settings > Organization
- User sees current organization data pre-filled in the form
- User can update any organization field
- User receives confirmation when changes are saved
- Changes are reflected immediately in the dashboard

### Edge Case Story
**As a user who has already completed onboarding**, I want to be prevented from accessing the onboarding page again so that I don't accidentally create duplicate organizations.

**Acceptance Criteria:**
- Users with existing organizations are redirected to `/dashboard` if they visit `/onboarding`
- API prevents creating multiple organizations for the same user (returns 409 Conflict)
- Organization membership status is correctly tracked in the database

---

## Technical Overview

### Components

**Core Components:**
- `OrganizationForm` - Reusable form component with validation (used in both onboarding and settings)
- `OnboardingPage` - Main onboarding page with Stepper UI and success state
- `OrganizationSettingsPage` - Settings page for editing organization details

**Provider Integration:**
- `AuthProvider` - Provides current user session and authentication state
- `OrganizationProvider` - Manages organization list, active organization, and triggers onboarding redirect

**UI Components (Mantine):**
- `Container`, `Paper`, `Stack`, `Group` - Layout
- `Title`, `Text` - Typography
- `TextInput`, `Select`, `Textarea` - Form inputs
- `Button` - Form submission
- `Stepper` - Multi-step wizard UI
- `Alert` - Error messages
- `Loader` - Loading states

### API Endpoints

**POST /api/organizations**
- Creates new organization with provided data
- Creates organization_members record with 'owner' role
- Updates user profile to mark onboarding complete
- Returns created organization data
- Status Codes: 201 (success), 400 (validation error), 401 (unauthorized), 409 (conflict), 500 (server error)

**PATCH /api/organizations/[id]**
- Updates existing organization data
- Verifies user has owner/admin role
- Validates partial updates with Zod schema
- Returns updated organization data
- Status Codes: 200 (success), 400 (validation error), 401 (unauthorized), 403 (forbidden), 404 (not found), 500 (server error)

### Database Tables

**organizations**
- Primary table storing organization profiles
- Key fields: id, name, slug (unique), contact info, address, sector, budget_range, employee_count
- Subscription fields: subscription_tier, subscription_status, enabled_apps (array)
- Audit fields: created_at, updated_at
- RLS enabled: Users can only see organizations they're members of

**organization_members**
- Junction table linking users to organizations
- Key fields: id, organization_id, user_id, role, status
- Roles: owner, admin, member, viewer
- Status: active, invited, suspended
- Unique constraint: (organization_id, user_id)
- RLS enabled: Users can only see memberships for their organizations

**profiles**
- User profile table with onboarding tracking
- Key fields: id (references auth.users), display_name, onboarding_completed, onboarding_completed_at
- Updated when onboarding is completed
- RLS enabled: Users can only see/edit their own profile

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        New User Flow                             │
└─────────────────────────────────────────────────────────────────┘

1. User Sign-up/Login
   │
   ↓
2. AuthProvider (checks authentication)
   │
   ↓
3. OrganizationProvider (checks organization membership)
   │
   ├─ NO organizations → Redirect to /onboarding
   │   │
   │   ↓
   │   4. OnboardingPage (Stepper UI)
   │   │
   │   ↓
   │   5. OrganizationForm (React Hook Form + Zod validation)
   │   │
   │   ↓
   │   6. POST /api/organizations
   │      │
   │      ├─ Create organization record
   │      ├─ Create organization_members record (owner role)
   │      ├─ Update profiles.onboarding_completed = true
   │      │
   │      ↓
   │   7. Success → Redirect to /dashboard
   │   │
   │   ↓
   │   8. OrganizationProvider refreshes
   │   │
   │   ↓
   │   9. Dashboard shows organization + apps
   │
   └─ HAS organizations → Show dashboard


┌─────────────────────────────────────────────────────────────────┐
│                     Organization Edit Flow                       │
└─────────────────────────────────────────────────────────────────┘

1. User navigates to Settings > Organization
   │
   ↓
2. OrganizationSettingsPage (fetch current org data)
   │
   ↓
3. OrganizationForm (pre-filled with current data)
   │
   ↓
4. PATCH /api/organizations/[id]
   │
   ├─ Verify user is owner/admin
   ├─ Validate updates with Zod schema
   ├─ Update organization record
   │
   ↓
5. Success notification + refresh


┌─────────────────────────────────────────────────────────────────┐
│                   Data Flow & Security                           │
└─────────────────────────────────────────────────────────────────┘

Client (Browser)
   │
   ├─ Authentication: Supabase Auth (session cookies)
   ├─ Form Validation: Zod schema (client-side)
   │
   ↓
API Route (Next.js)
   │
   ├─ Auth Check: supabase.auth.getUser()
   ├─ Validation: Zod schema (server-side)
   ├─ Business Logic: Organization creation/update
   │
   ↓
Database (Supabase/PostgreSQL)
   │
   ├─ RLS Policies: Enforce multi-tenant isolation
   ├─ Triggers: Auto-generate unique slugs
   ├─ Constraints: Validate data integrity
   │
   ↓
Response
   │
   └─ Success: Return organization data
   └─ Error: Return user-friendly error message
```

---

## Dependencies

### Required Packages
All dependencies are already installed in the VISION Platform:

- `@mantine/core@^8.3.0` - Complete UI component library with theming
- `@mantine/hooks@^8.3.0` - Utility hooks for forms and state management
- `@mantine/notifications@^8.3.0` - Toast notification system
- `@supabase/ssr@^0.5.0` - Supabase server-side rendering utilities
- `@supabase/supabase-js@^2.45.0` - Supabase JavaScript client
- `react-hook-form@^7.51.0` - Form state management and validation
- `zod@^3.22.0` - TypeScript-first schema validation
- `@hookform/resolvers@^3.3.0` - Integrates Zod with React Hook Form

### Required Database Tables
All tables already exist in the database schema:

- `organizations` - Defined in `/supabase/migrations/20251111000001_platform_foundation.sql:38-129`
- `organization_members` - Defined in `/supabase/migrations/20251111000001_platform_foundation.sql:180-224`
- `profiles` - Defined in `/supabase/migrations/20251111000001_platform_foundation.sql:135-178`

### Required Infrastructure
All infrastructure is configured:

- Supabase project (running locally and in production)
- Next.js 14+ with App Router
- Environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Middleware configured to protect `/onboarding` route

---

## Security Considerations

### Authentication & Authorization
- **Protected Route:** `/onboarding` requires authentication (enforced by middleware)
- **Session Validation:** Every API request validates the user session with `supabase.auth.getUser()`
- **Role Verification:** Organization updates verify user has owner/admin role
- **Duplicate Prevention:** API prevents users from creating multiple organizations (409 Conflict)

### Input Validation
- **Client-Side:** React Hook Form + Zod validates inputs before submission
- **Server-Side:** API routes re-validate with Zod schemas (defense in depth)
- **SQL Injection Prevention:** Supabase parameterized queries (no raw SQL)
- **XSS Prevention:** React automatically escapes outputs; Mantine components are safe

### Data Isolation
- **Row-Level Security (RLS):** Enabled on all organization tables
- **RLS Policies:** Users can only see/edit organizations they're members of
- **Organization ID Filtering:** All queries filter by organization membership
- **Multi-Tenant Testing:** Integration tests verify no cross-org data leakage

### Error Handling
- **No Internal Error Exposure:** API returns generic error messages to clients
- **Server-Side Logging:** Detailed errors logged to console for debugging
- **Graceful Degradation:** Form shows user-friendly errors; doesn't crash
- **Rollback Logic:** If membership creation fails, organization record is deleted

---

## Performance Considerations

### Form Performance
- **Uncontrolled Inputs:** Uses React Hook Form's uncontrolled mode for better performance
- **Minimal Re-renders:** Only validates on blur, not on every keystroke
- **Lazy Validation:** Optional fields only validated when user provides data
- **Memoization:** Expensive computations memoized with useMemo

### Database Performance
- **Indexed Columns:** organization_id, slug, user_id are indexed
- **Efficient Queries:** Use `.single()` for single-record queries, `.limit(1)` for existence checks
- **No N+1 Queries:** Organization + membership created in sequence, not loops
- **RLS Helper Functions:** Use functions to avoid RLS policy recursion

### Page Load Performance
- **Server Components:** Onboarding page uses Server Components where possible
- **Code Splitting:** Heavy components lazy-loaded with Next.js dynamic imports
- **Optimistic UI:** Form shows loading states immediately, doesn't block user
- **Bundle Size:** Mantine tree-shaking reduces bundle size; no unnecessary imports

### Target Metrics
- **Page Load:** < 2 seconds (First Contentful Paint)
- **API Response:** < 500ms (organization creation)
- **Form Validation:** < 100ms (instant feedback on blur)
- **Time to Interactive:** < 3 seconds (ready for user input)

---

## Related Documentation

### Feature Documentation
- [REQUIREMENTS.md](./REQUIREMENTS.md) - Complete requirements specification
- [IMPLEMENTATION.md](./IMPLEMENTATION.md) - Step-by-step implementation guide

### Platform Documentation
- [Platform Shell Requirements](../platform-shell/REQUIREMENTS.md) - Platform layer overview
- [Authentication Feature](../authentication/README.md) - Authentication system
- [Event System](../event-system/README.md) - Cross-app event bus

### General Documentation
- [Code Standards](/documentation/general/CODE_STANDARDS.md) - Coding conventions
- [Testing Strategy](/documentation/general/TESTING.md) - Testing requirements
- [Security Guidelines](/documentation/general/SECURITY.md) - Security best practices

### Research & References
- [Onboarding Best Practices](/docs/features/onboarding/research/BEST_PRACTICES.md) - Research findings
- [Code References](/docs/features/onboarding/references/CODE_REFERENCES.md) - Existing patterns
- [Implementation Plan](/docs/features/onboarding/implementation/IMPLEMENTATION_PLAN.md) - Detailed task breakdown

### External References
- [Next.js 14 App Router](https://nextjs.org/docs/app) - Framework documentation
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers/nextjs) - Auth integration
- [React Hook Form](https://react-hook-form.com/) - Form library
- [Zod](https://zod.dev/) - Schema validation
- [Mantine UI](https://mantine.dev/) - Component library

---

## Quick Links

### Codebase Locations

**Files to Create:**
- **Types:** `/apps/platform-shell/src/types/organization.ts`
- **Validators:** `/apps/platform-shell/src/lib/validators/organization.ts`
- **Form Component:** `/apps/platform-shell/src/components/onboarding/OrganizationForm.tsx`
- **Onboarding Page:** `/apps/platform-shell/src/app/onboarding/page.tsx`
- **Settings Page:** `/apps/platform-shell/src/app/dashboard/settings/organization/page.tsx`
- **API - POST:** `/apps/platform-shell/src/app/api/organizations/route.ts`
- **API - PATCH:** `/apps/platform-shell/src/app/api/organizations/[id]/route.ts`

**Existing Files to Reference:**
- **Auth Provider:** `/apps/platform-shell/src/providers/AuthProvider.tsx`
- **Org Provider:** `/apps/platform-shell/src/providers/OrganizationProvider.tsx`
- **Middleware:** `/apps/platform-shell/src/middleware.ts`
- **Login Page:** `/apps/platform-shell/src/app/(auth)/login/page.tsx`
- **Dashboard:** `/apps/platform-shell/src/app/dashboard/page.tsx`
- **Database Schema:** `/supabase/migrations/20251111000001_platform_foundation.sql`

**CapacityIQ Reference (Patterns):**
- **Org Form:** `/Users/fordaaro/Documents/apps/CapacityIQ/capacityiq-vsp/capacityiq/src/components/org/OrgForm.tsx`
- **Validation:** `/Users/fordaaro/Documents/apps/CapacityIQ/capacityiq-vsp/capacityiq/src/lib/validators/orgSchemas.ts`

---

## Next Steps

### For Developers
1. Read [REQUIREMENTS.md](./REQUIREMENTS.md) for complete specifications
2. Review [IMPLEMENTATION.md](./IMPLEMENTATION.md) for step-by-step guide
3. Understand existing code patterns in Code References
4. Complete Phase 0: Codebase Assessment before coding
5. Implement 7 tasks following the implementation guide
6. Test thoroughly with all 8 test cases
7. Deploy and monitor completion rates

### For Product Managers
1. Review user stories and acceptance criteria
2. Validate minimal required fields meet user needs
3. Plan future enhancements (logo upload, team invites, etc.)
4. Define success metrics and monitoring
5. Prepare user documentation and onboarding video

### For QA Engineers
1. Review testing plan in IMPLEMENTATION.md
2. Set up test accounts and test organizations
3. Execute manual QA checklist
4. Test mobile responsiveness and accessibility
5. Verify RLS policies with multi-user scenarios
6. Document any issues found

---

**Status:** ✅ Ready for Implementation
**Estimated Effort:** 6-8 hours of focused development
**Priority:** Critical (blocks new user access to platform)
**Target Completion:** Week of 2025-01-13
