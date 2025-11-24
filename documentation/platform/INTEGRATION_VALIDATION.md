# Integration Validation Plan

## Purpose
Comprehensive verification guide to ensure platform-level and app-specific integrations (VisionFlow, auth, Supabase, observability) function together without regressions.

## Scope
- Platform shell services: authentication, navigation, global error handling
- VisionFlow app surfaces: task/plan APIs, Supabase data access, dashboard widgets
- Third-party services: Supabase PostgREST, Sentry, feature flags
- Cross-cutting concerns: authorization (RLS), analytics events, accessibility defaults

## Test Environments
- **Local**: pnpm dev with Supabase local stack
- **Preview**: deployed branch previews with seeded data
- **Staging**: mirrors production config with real integrations enabled

## Validation Strategy
1. **Contract validation**
   - Confirm Supabase types match migration schema (plans, projects, tasks, assignments).
   - Validate API response shapes for `/api/v1/apps/visionflow/*` endpoints.
2. **Authentication & authorization**
   - Verify session propagation across platform shell and VisionFlow routes.
   - Confirm RLS policies enforce organization scoping for plans, projects, and tasks.
3. **Data workflows**
   - Plan lifecycle: create → read list/detail → update → soft delete.
   - Task lifecycle: assignment add/update/remove, activity logging, dashboard summaries.
   - Project aggregation: plan-level project listing with nested milestones.
4. **UI integration**
   - Dashboard widgets render Supabase-derived data without type warnings.
   - Error boundaries recover with navigation back to dashboard.
5. **Resilience & observability**
   - Confirm API errors are logged via `handleApiError` with user and organization context.
   - Validate Sentry captures unhandled exceptions with breadcrumbs.
6. **Regression guardrails**
   - Run `pnpm type-check` for structural conformance.
   - Execute smoke tests for critical routes: `/dashboard`, `/funder`, `/apps/visionflow`.

## Entry/Exit Criteria
- **Entry**: migrations applied, seeds loaded, environment variables configured.
- **Exit**: all validation steps green, no TypeScript errors, and critical flows verified in staging.

## Reporting
- Track defects with reproduction steps and impacted integration layer (API/UI/RLS).
- Maintain a checklist per environment to prevent drift between local, preview, and staging.
