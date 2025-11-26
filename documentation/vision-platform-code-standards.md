# VISION Platform Code & Styling Standards

## 1) Folder & Module Layout
- **Apps**: Place every product surface in `apps/shell/src/app/apps/{appName}` (or feature root like `/visionflow`, `/funder` while migrating). Each app gets `layout.tsx`, `page.tsx`, `routes/` for subpages, and `components/`, `hooks/`, `services/`, `types/`, `tests/` folders.
- **Shared UI**: Reusable Glow components live in `apps/shell/src/components/ui` and theme tokens in `apps/shell/src/design-system/theme`. Never copy components per app; create shared variants instead.
- **Data/Domain**: Shared domain utilities belong in `apps/shell/src/lib` (formatting, constants) and `apps/shell/src/services` (Supabase/API clients). Keep tenant-aware logic in `apps/shell/src/contexts`.

## 2) Naming & File Conventions
- Components: `PascalCase.tsx`; hooks: `useSomething.ts`; utilities/constants: `camelCase.ts`; schemas/types: `*.schema.ts`, `*.types.ts`.
- Route folders should be **kebab-case** and mirror nav labels. Co-locate page-level components under the route folder.
- Export named components/hooks; avoid default exports except for Next.js route components. Keep nav IDs synchronized with `nav-config.ts` and `APP_CATALOG_DATA` entries when adding new apps.

## 3) React/Next Patterns
- **Server-first data**: Use server components or server actions to fetch data; limit client components to interactive sections. Keep Supabase/service calls server-side where possible.
- **AppShell invariant**: All authenticated routes render inside `AppShell`. New routes must not bypass the shell; enforce via route-level middleware or a shared `withShellPage` wrapper and avoid adding authenticated paths to `PUBLIC_ROUTES` (`AppShell.tsx`).
- **Async data**: Prefer React Query (or SWR) with typed fetchers. Always provide `loading`, `error`, and `empty` states. Never `console.log` errors; surface user-friendly toasts and log to Sentry.
- **Forms**: Use `react-hook-form` + Zod schemas for validation. Keep submit handlers async with try/catch and optimistic updates via query cache.
- **State**: Use local state sparingly; shared state goes through context or React Query cache. Avoid mutating exported configs (e.g., nav items) directly.
- **Navigation data**: Derive badge counts with `buildNavConfig` in `nav-config.ts` and pass `navItems` into `GlowSideNav`/`GlowMobileNavDrawer`; do not mutate `navConfig` in place. The base config is frozen—add tests when extending nav to prove new badges/labels come from derived copies, not shared references.

## 4) Styling & Glow/2911 Rules
- Use design tokens from `design-system/theme` (colors, spacing, typography, radius, shadows). Do **not** hard-code hex codes (e.g., `#F8FAFC`); map tokens into Tailwind via CSS variables or helper classes.
- Spacing scale: 4/8/12/16/20/24/32/40. Typography hierarchy should follow Glow defaults (display/heading/title/body/label).
- Components must use AppShell rhythm: header (sticky), content padding (`px-6 md:px-8`, `py-6`), and max-width containers where appropriate. Prefer semantic background variables (`bg-background`, `text-foreground`) over literal `bg-[#F8FAFC]` used today.
- Prefer Glow primitives (`GlowCard`, `GlowButton`, `GlowBadge`) or wrappers to ensure consistent elevation, focus, and accessibility states.

## 5) Data & Multi-Tenancy
- All data requests must include `activeOrganization` and `user` context; reject operations when the org is missing.
- Encapsulate Supabase access in `services/{feature}Service.ts` with typed return values and centralized error handling.
- Use role/permission helpers from `OrganizationContext` (or a dedicated `usePermissions` hook) to gate UI and actions. Protect server actions/APIs with the same rules.
- Organization membership changes must go through `organizationService` helpers (`addMember`, `removeMember`, `updateMemberRole`, `isOwner`, `isAdmin`) which normalize lower-case role strings and accept explicit `userId` parameters for admin workflows and testing.

## 6) Error, Loading, and Empty States
- Provide standard components: `<LoadingState />`, `<ErrorState />`, `<EmptyState />` with consistent copy and CTAs.
- Wrap feature sections in error boundaries when calling async hooks; prefer suspense + skeletons for list/detail pages.
- Always log unexpected errors to Sentry and show user-facing feedback via `sonner` toasts.

## 7) Testing & Quality Gates
- Required commands before merging: `pnpm lint`, `pnpm type-check`, `pnpm test:run` (or relevant scope), `pnpm validate:colors`. Document skipped checks with reasons. Add focused unit tests for navigation derivations (`nav-config`) whenever badges, routes, or IDs change to ensure immutability.
- Keep TypeScript strict (no `any`); enable `noImplicitAny`, `strictNullChecks`. Avoid `// @ts-ignore` except with linked issue references.
- ESLint: no unused variables/imports; prefer `useCallback`/`useMemo` for expensive operations in client components; forbid `console.log` in production code.

## 8) Documentation
- Each app folder must include a `README.md` describing routes, data sources, permissions, and known gaps.
- Update `nav-config.ts` and app catalog when adding routes; keep labels consistent with page titles and breadcrumbs.
- Record design token usage decisions in `design-system/` docs when adding new semantic tokens.
