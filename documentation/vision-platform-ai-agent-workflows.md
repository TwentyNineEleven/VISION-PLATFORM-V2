# AI-Assisted Development Playbook (VISION Platform)

## 1) Principles for Working With AI on This Repo
- **Plan → Validate → Patch → Test**: Always ask agents to summarize scope, list affected files, and propose a patch plan before edits. Require a final diff review + test commands tied to the touched packages.
- **Constrain scope**: Provide the exact paths and entry points (e.g., `apps/shell/src/app/funder/page.tsx`, `apps/shell/src/lib/nav-config.ts`) to avoid repo-wide churn.
- **Prefer additive changes**: Ask for new modules or adapters instead of invasive rewrites unless explicitly approved.
- **Maintain AppShell invariant**: Remind agents that all authenticated pages must render inside `AppShell`; highlight `PUBLIC_ROUTES` for exceptions.
- **Surface tokens**: Tell agents to pull colors/spacing from `design-system/theme` and avoid raw hex values or inline styles.
- **Data safety**: Require Supabase or API calls to live in services/server actions; forbid secrets in client code and log errors to Sentry.

## 2) Prompt Templates
**Exploration**
- “Scan `apps/shell/src/app/{feature}` and summarize layout/data patterns; list violations of code standards.”

**Implementation**
- “Modify only `apps/shell/src/app/apps/capacityiq` and `apps/shell/src/lib/nav-config.ts`; keep AppShell usage; use Glow tokens; add loading/error states; update tests.”

**Refactor**
- “Convert dashboard data fetching to React Query. Create `services/dashboardService.ts` (server actions), hooks under `hooks/`, and update `page.tsx` to use suspense with shared Loading/Error components.”

**Review**
- “List risky patterns (missing null checks, direct Supabase calls in client components, mock data). Suggest fixes referencing files and lines.”

## 3) Workflow Checklist for Agents
1) Read applicable instructions (system + AGENTS + docs in touched paths).
2) Identify affected files and propose a short plan before editing.
3) Apply minimal patch; avoid mass formatting.
4) Run `pnpm lint`, `pnpm type-check`, and relevant tests; report command outputs.
5) Update documentation when adding routes/components (nav, catalog, README).
6) Provide final summary with citations to files/commands and note any limitations.

## 4) Repo Structuring Tips to Aid Agents
- Keep features self-contained under `apps/shell/src/app/apps/{appName}`; minimize cross-folder imports.
- Use clear naming and comments near public APIs (`services/`, `hooks/`) so agents can map responsibilities quickly.
- Centralize constants/config (nav, catalog, feature flags) to reduce duplicate edits.
- Add storybook/examples for new UI primitives to give agents visual references.

## 5) Safe-Refactor Guardrails
- No try/catch around imports; use functional error handling inside async operations.
- Require type-safe interfaces (`Tables<>`, domain types) instead of `any`.
- Ensure new data mutations include optimistic updates or cache invalidation where applicable.
- Keep AppShell padding/spacing consistent; avoid introducing bespoke headers/sidebars.

## 6) When to Escalate to Humans
- Schema migrations or RLS/policy changes
- Cross-cutting design token updates that impact multiple apps
- Authentication/session handling changes
- Major navigation IA changes
