# VISION Platform App Template

Use this template when adding a new app (e.g., CapacityIQ, FundFlo, Community Compass). Co-locate all routes and assets to keep the platform plug-and-play.

## 1) Directory Skeleton
```
apps/shell/src/app/apps/{appName}/
├── layout.tsx             # Wraps app views with AppShell + app-level providers
├── page.tsx               # Default landing page
├── routes/                # Nested routes (list/detail/wizards)
│   ├── list/page.tsx
│   ├── [id]/page.tsx
│   └── ...
├── components/            # App-specific UI pieces
│   ├── AppHeader.tsx
│   ├── SummaryCards.tsx
│   └── tables/
├── hooks/                 # Data + state hooks (React Query)
│   ├── use{App}List.ts
│   └── use{App}Detail.ts
├── services/              # API clients / server actions for the app
│   └── {app}Service.ts
├── schemas/               # Zod schemas for forms/DTOs
├── types/                 # Domain types
├── tests/                 # Vitest/RTL specs + e2e fixtures
└── README.md              # Routes, data sources, permissions
```

## 2) Layout & Registration Steps
1. **Route**: Create the folder under `apps/shell/src/app/apps/{appName}` with `page.tsx` and optional nested `routes/`.
2. **AppShell**: Pages should be server components by default; wrap client sections only where interactive. The route inherits global `AppShell` from root layout—no custom headers/sidebars.
3. **Navigation**: Add the app to `apps/shell/src/lib/nav-config.ts` (sidebar IDs/labels) and `apps/shell/src/lib/app-catalog-data.ts` (launcher/cards) with consistent IDs. Include `launchPath` pointing to the new route and ensure titles match page headings.
4. **Permissions**: Import `useOrganization`/`usePermissions` and gate UI/actions based on role. Redirect unauthorized users to `/unauthorized`.
5. **Theming**: Use Glow/2911 tokens via shared components; avoid hard-coded colors. Prefer `<GlowCard>` wrappers for sections.
6. **Data fetching**: Create typed fetchers in `services/{app}Service.ts` and expose hooks using React Query; include `activeOrganization` and `user` in every request. Prefer server actions where possible to keep Supabase calls off the client.
7. **States**: Standardize with `<LoadingState />`, `<ErrorState />`, `<EmptyState />` components imported from shared UI.

## 3) Page Patterns
- **Dashboard**: Hero + stat cards + activity/insights grid. Use shared stat card component and align padding with shell rhythm (`px-6 md:px-8`, `py-6`).
- **List/Filter**: Table/list page with search, filters, pagination; persist params to URL via query hooks.
- **Detail**: Summary header + tabbed content; fetch detail server-side and stream child components; surface loading/error/empty states for each tab.
- **Wizard/Form**: `react-hook-form` + Zod; show review/confirmation step; sync to query cache after submit.

## 4) Data & API Contracts
- Define `types/` for DTOs and domain models; align with Supabase tables.
- All service methods return `{ data, error }` objects or throw typed errors captured by hooks.
- Cache keys: `['app', appName, 'list']`, `['app', appName, id]`, etc., to keep namespaces distinct.
- Include optimistic updates and invalidate related caches after mutations.

## 5) Testing Checklist
- Unit/RTL: render primary page states (loading/error/empty/success).
- Contract tests: validate Zod schemas and service fetchers.
- Accessibility: ensure landmarks, focus order, and ARIA labels on nav, buttons, and dialogs.
- E2E: add Playwright spec to cover primary happy path (create/edit/view) and permission denial.

## 6) Documentation Block
Add a short `README.md` inside the app folder including:
- Purpose and primary personas
- Routes and nav IDs
- Data sources/services used
- Permission rules and feature flags
- Outstanding TODOs/mocks
