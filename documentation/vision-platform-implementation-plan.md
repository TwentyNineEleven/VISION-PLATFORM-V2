# VISION Platform Implementation & Enforcement Plan

Use this plan to turn the architecture findings and standards into delivered, testable changes. Each workstream has clear deliverables, sequencing, and enforcement steps so every app stays aligned with AppShell, Glow/2911 tokens, and multi-tenant rules.

## 1) Objectives
- Eliminate layout, navigation, and theming drift by enforcing AppShell + tokenized styling everywhere.
- Replace mock/imperative data paths with typed server-first services and shared loading/error/empty UX.
- Codify navigation/catalog registration so new apps plug into the shell without bespoke plumbing.
- Add CI/QA gates that block merges when standards, permissions, or design tokens are violated.

## Progress Updates
- Navigation badges now derive from immutable `buildNavConfig` output and are passed into navigation components to avoid global mutation and ensure reactivity.
- AppShell background/text styling now uses semantic tokens (`bg-background`, `text-foreground`) instead of hex values, aligning with Glow/2911 rules.
- Navigation configuration is frozen at the base layer and covered by unit tests to prevent accidental mutation when badges/routes change.
- Organization service now includes explicit membership management helpers (add/update/remove/isOwner/isAdmin) with lower-case role normalization, bringing tests for member/role paths back to green.
- Dashboard KPI tiles, stat groups, widgets, and catalog teasers now source accent/tint colors from `visionSemantic` or phase token helpers instead of inline hex strings, continuing the Bold Color System migration.
- Auth surfaces and app catalog cards now rely on Bold token classes (phase badge/button/status chip helpers) instead of inline hex colors, keeping sign-in backgrounds and catalog accents aligned with Glow/2911.

## 2) Workstreams, Deliverables, and Owners

### A) Navigation & AppShell Enforcement
- Deliverables: immutable nav config derived from data hooks; shell guard (middleware or HOC) that blocks authenticated routes outside AppShell; nav/catalog IDs kept in sync (`nav-config.ts`, `app-catalog-data.ts`).
- Steps:
  1. Introduce `withShellPage` (or middleware) to wrap all authenticated routes; remove accidental `PUBLIC_ROUTES` expansions.
  2. Refactor badge/favorite counts to React Query state with cache keys per feature instead of mutating `navConfig` objects.
  3. Add lint check or unit test that ensures every `apps/shell/src/app/(auth|apps|dashboard|funder|visionflow|admin|notifications|files)` route imports the shell wrapper.
- Success criteria: no direct mutations of nav config; badges update reactively; unauthorized shell bypass returns 302/401; nav/catalog share the same IDs and paths.

### B) Design System & Token Adoption
- Deliverables: Tailwind/SCSS mapping from `design-system/theme/tokens.ts` to CSS variables; removal of raw hex colors from layout/pages; shared spacing/typography helpers.
- Steps:
  1. Create `styles/tokens.css` that exports semantic variables (background, surface, border, accent) sourced from Glow/2911 tokens.
  2. Replace hard-coded colors in `AppShell`, dashboard, and funder pages with token utilities; add eslint rule or stylelint custom rule banning raw hex in `apps/shell/src`.
  3. Add Storybook stories showing approved cards/buttons/badges with tokenized colors and spacing scale (4/8/12/16/20/24/32/40).
- Success criteria: zero `#` color literals in shell/app routes; AppShell backgrounds come from semantic tokens; design QA can trace every color to `tokens.ts`.

### C) Data Layer & Multi-Tenancy
- Deliverables: shared service layer (`apps/shell/src/services`) with typed Supabase/server actions; React Query hooks in `apps/shell/src/app/apps/{app}/hooks`; standardized `{ data, error }` responses; permissions enforced per request.
- Steps:
  1. Stand up `apiClient` wrappers for Supabase/server actions with organization scoping and Sentry logging.
  2. Convert dashboard/funder mock data to server-side fetchers; expose hooks (`useDashboardMetrics`, `useFunderProjects`) using consistent cache keys.
  3. Add `usePermissions` helper derived from `OrganizationContext` and gate list/detail mutations; redirect unauthorized users.
- Success criteria: no direct Supabase calls in client components; every fetch includes `activeOrganization`; hooks expose loading/error/empty states; permissions enforced consistently.

### D) Page Templates & UX Consistency
- Deliverables: shared `<LoadingState />`, `<ErrorState />`, `<EmptyState />`, stat cards, tables, and form wrappers; page scaffolds for dashboard/list/detail/wizard patterns.
- Steps:
  1. Publish shared components under `apps/shell/src/components/ui` and swap dashboard/funder pages to use them.
  2. Add route-level README templates describing routes, data sources, permissions, and mocks; require completion for new apps.
  3. Introduce breadcrumbs/title helper to align page titles with nav labels and catalog entries.
- Success criteria: all pages render standardized states; headings/breadcrumbs match nav labels; padding rhythm (`px-6 md:px-8`, `py-6`) is consistent across routes.

### E) Testing, Tooling, and CI Gates
- Deliverables: CI pipeline that runs `pnpm lint`, `pnpm type-check`, `pnpm test:run`, design token lint, and snapshot/style checks; optional contract tests for server actions.
- Steps:
  1. Add `pnpm lint:tokens` (stylelint/eslint rule) and wire into CI.
  2. Add minimal Vitest/RTL coverage for shell guard, nav badge derivation, and shared state components.
  3. Define e2e happy paths (Playwright) for: login → AppShell render → dashboard load; nav badge change on new notification; unauthorized access redirect.
- Success criteria: pipelines fail on token misuse or shell bypass; coverage includes shell/nav/utilities; e2e proves AppShell + nav + permissions paths.

### F) Documentation & Governance
- Deliverables: living standards (`vision-platform-code-standards.md`, `...-app-template.md`, `...-ai-agent-workflows.md`) referenced from `documentation/README.md`; change log for deviations.
- Steps:
  1. Link standards and this plan from `documentation/README.md` so new contributors find them first.
  2. Add PR checklist requiring: AppShell compliance, nav/catalog updates, token usage, permissions, tests run, docs updated.
  3. Establish review rotation to audit routes for shell/layout/token drift monthly and log follow-ups in `PRIORITIZED_TODO.md`.
- Success criteria: every PR template includes standards checklist; docs kept up to date; quarterly audits show zero drift items.

## 3) Sequencing (Milestones)
- **Milestone 1 (foundation)**: Ship shell guard + immutable nav state, token CSS variables, and lint rule banning hex colors; add PR checklist and CI integration.
- **Milestone 2 (data & UX)**: Migrate dashboard/funder to server fetchers + React Query hooks with loading/error/empty states; publish shared Loading/Error/Empty components; enforce permissions via `usePermissions`.
- **Milestone 3 (templates & coverage)**: Roll out page templates to remaining apps; add Storybook token showcases; extend Playwright e2e for key journeys.
- **Milestone 4 (audit & hardening)**: Run design/permission audits; remove remaining mocks; refine cache invalidation and Sentry logging; document deviations and waivers.

## 4) Enforcement Mechanisms
- CI gates (lint, type-check, tests, token lint, e2e smoke) block merges on violations.
- PR template checklist ties to standards; reviewers must confirm AppShell usage, nav/catalog sync, tokenized styles, permissions, and docs.
- Automated lint rules for: no raw hex colors, no nav config mutation, mandatory loading/error/empty exports in hooks, and no direct Supabase calls in client components.
- Monthly audit cadence with findings appended to `PRIORITIZED_TODO.md` and tracked to closure.

## 5) How to Execute New Work Under This Plan
- Start each app/feature by cloning the App Template directory structure.
- Register nav/catalog entries first, then build server-side data services with org scoping.
- Compose pages using shared components, token utilities, and AppShell; add loading/error/empty states before wiring data.
- Add/update docs and PR checklist items; run full QA commands before opening PR.

## 6) Progress Tracking
- Track completion per milestone in `PRIORITIZED_TODO.md` with checkboxes for each workstream deliverable.
- After each milestone, update this plan with completed items and next actions.
- Recent updates:
  - Hardened team service invite/count flows and mocks to stabilize Vitest coverage.
  - Added test-friendly organization settings behavior (Glow selects, validation, localStorage persistence) while keeping production APIs intact.
