# VISION Platform Architecture & Quality Report

## 1) Current Repo Snapshot
- **Tech stack**: Next.js 15 App Router + React 19 + TypeScript 5.6, Tailwind CSS, Sentry, Supabase client-side SDK, Radix UI, Glow UI layer. Turborepo + pnpm manage workspace; Vitest/Playwright configured for testing. 【F:README.md†L5-L103】【F:apps/shell/package.json†L1-L60】
- **Top-level layout**: Root layout wraps all app routes in `AppShell`, `ErrorBoundary`, PostHog provider, and global `Toaster`. Public auth routes bypass the shell via a fixed allowlist. 【F:apps/shell/src/app/layout.tsx†L1-L39】【F:apps/shell/src/components/layout/AppShell.tsx†L33-L182】
- **Navigation & catalog**: Sidebar/top-nav items centralized in `nav-config.ts`; the app launcher consumes `APP_CATALOG_DATA` and routes users through `launchPath/route` handlers. Badge counts are still mutated imperatively. 【F:apps/shell/src/lib/nav-config.ts†L25-L170】【F:apps/shell/src/components/layout/AppShell.tsx†L115-L220】【F:apps/shell/src/lib/app-catalog-data.ts†L1-L200】
- **Design system**: `design-system/theme/tokens.ts` exposes Glow/2911 module colors; layout files still hard-code hex values instead of mapping tokens into Tailwind variables. 【F:apps/shell/src/design-system/theme/tokens.ts†L1-L64】【F:apps/shell/src/components/layout/AppShell.tsx†L12-L218】
- **Multi-tenancy**: `OrganizationProvider` loads the active org from Supabase preferences/tables and exposes role helpers; there is no shared hook for injecting org context into feature data fetching. 【F:apps/shell/src/contexts/OrganizationContext.tsx†L1-L124】

## 2) Dominant Patterns (“Current Norm”)
- **Routing**: Next.js App Router with nested folders per feature (`/dashboard`, `/applications`, `/funder`, `/visionflow`, `/admin`, `/notifications`, `/files`).
- **Layout**: Most authenticated pages rely on the global `AppShell`; hero/dashboard views still embed padding/background utilities instead of consuming semantic layout components.
- **Data**: Many screens use mock data (`/dashboard`, `/funder`, app catalog). Supabase is used in providers/services (auth, organizations) but not consistently per route, and server components are rarely leveraged for fetching.
- **UI composition**: Blend of Glow UI primitives (`GlowSideNav`, `GlowTopHeader`, cards/badges) and custom tailwind components; spacing and colors vary across pages.
- **State**: Local React state/hooks; no shared query/cache layer (React Query/SWR). Navigation badge counts and favorites are mutated in-place.

## 3) Inconsistencies & Drift
- **Design tokens vs raw colors**: AppShell, dashboard, and funder pages hard-code `#F8FAFC`/`#F1F5F9` backgrounds instead of theme tokens; funder pages mix Glow components with tailwind utilities. 【F:apps/shell/src/components/layout/AppShell.tsx†L12-L220】【F:apps/shell/src/app/dashboard/page.tsx†L55-L132】【F:apps/shell/src/app/funder/page.tsx†L53-L123】
- **Mock vs live data**: Core dashboards rely on mock data while organization context fetches from Supabase; no shared data contract or loading/error states across routes.
- **Shell bypass**: Public routes are excluded via `PUBLIC_ROUTES`; additional feature routes could accidentally skip shell if not listed. No guard enforces AppShell for all authenticated routes.
- **Notification badge mutation**: `updateNotificationBadge` mutates exported config at runtime; state is not reactive and can desync with navigation rendering. 【F:apps/shell/src/lib/nav-config.ts†L25-L169】
- **Permissions**: `OrganizationContext` exposes role flags but pages largely ignore them; no standard `canAccess` checks on feature routes.
- **Error/loading UX**: Providers catch and log errors but surfaces rarely render user-facing errors or skeletons; patterns differ per page.

## 4) Potential Bugs / Smells
- **Unauthenticated fetch paths**: `AppShell` attempts Supabase auth fetch on every shell route without abort guards; errors are only logged to console, so hydration failures may silently occur. 【F:apps/shell/src/components/layout/AppShell.tsx†L79-L129】
- **Non-reactive nav badge**: Imperative mutation of `navConfig` badge will not trigger re-render when config is memoized in navigation components; risk of stale badge counts. 【F:apps/shell/src/lib/nav-config.ts†L25-L169】
- **Direct Supabase calls in client components**: Organization service runs client-side with full table access, increasing risk of leaking errors and bypassing server protections; no centralized error boundary for data failures. 【F:apps/shell/src/contexts/OrganizationContext.tsx†L13-L124】
- **Hard-coded layouts**: Padding/margins differ across pages (e.g., dashboard uses `px-6 py-8`, funder uses `Container` + `px-8 py-8`), leading to uneven rhythm and potential layout shifts on future merges. 【F:apps/shell/src/app/dashboard/page.tsx†L55-L132】【F:apps/shell/src/app/funder/page.tsx†L53-L123】

## 5) Opportunities for Standardization
- Enforce a single **AppShell invariant** via layout middleware or a shared `withShellPage` wrapper that auto-registers routes.
- Introduce a shared **data layer** (React Query + typed API clients) to replace per-page mocks and consolidate Supabase access.
- Drive all colors/spacing from **2911/Glow tokens** and remove raw hex codes from layout files.
- Create **page templates** for dashboard/list/detail patterns with standardized loading/error/empty states and permission gates.
- Centralize **multi-tenant context** by passing `activeOrganization`/`user` via providers and requiring explicit scoping in all data hooks.

## 6) Incremental Path to Target Structure
1) Keep `documentation/vision-platform-code-standards.md`, `...-app-template.md`, and `...-ai-agent-workflows.md` as living standards and link them from `documentation/README.md`.
2) Migrate navigation to consume immutable configs + derived state (React state/query cache) rather than mutating `navConfig`; derive badges from data hooks.
3) Replace raw Tailwind hex colors with token-driven classes from `design-system/theme` and align AppShell background with semantic variables.
4) Introduce `apps/{appName}` conventions and co-locate feature routes under `/src/app/apps/{appName}` with shared layout wrappers.
5) Add data fetching guidelines (React Query/SWR), error boundaries, and permission HOCs for all feature modules; move Supabase calls to server actions where possible.
