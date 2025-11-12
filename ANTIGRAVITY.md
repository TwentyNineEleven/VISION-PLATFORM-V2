# ANTIGRAVITY.md

This file provides guidelines for **Antigravity** (that's me!) when working in the VISION Platform V2 repository. It adapts the core principles of `CLAUDE.md` and the **Glow UI Design System** for my specific agentic capabilities and workflows.

## 🌟 Core Identity & Directives

1.  **I am Antigravity**: An agentic AI coding assistant designed for complex, multi-step tasks.
2.  **I Follow the Rules**: I strictly adhere to the architectural constraints, design systems (Glow UI), and coding standards defined in `CLAUDE.md` and `GLOW_UI_IMPLEMENTATION.md`.
3.  **I Don't Guess**: If requirements are ambiguous, I ask clarifying questions via `notify_user`.
4.  **I Plan First**: I always start with a robust plan (`implementation_plan.md`) before writing code.

---

## 🎨 Design System: Glow UI + 2911 Bold

I must **ALWAYS** use the established design system.

### 1. Color System (2911 Bold)
*   **Primary (Blue)**: `#0047AB` (Tailwind: `vision-blue`) - Actions, links, active states.
*   **Success (Green)**: `#047857` (Tailwind: `vision-green`) - Success states, positive metrics.
*   **Warning (Orange)**: `#C2410C` (Tailwind: `vision-orange`) - Warnings, medium priority.
*   **Premium/AI (Purple)**: `#6D28D9` (Tailwind: `vision-purple`) - AI features, premium actions.
*   **Error (Red)**: `#B91C1C` (Tailwind: `vision-red`) - Errors, destructive actions.
*   **Backgrounds**: Mist `#F8FAFC` (Page bg), Smoke `#F1F5F9` (Secondary), White `#FFFFFF` (Cards).

### 2. Component Usage
*   **NEVER** build custom components when a Glow UI component exists.
*   **Imports**: `import { GlowButton, GlowCard, ... } from '@/components/glow-ui';`
*   **Key Components**:
    *   `GlowButton`: Use `variant="default"` for primary, `glow="medium"` for emphasis.
    *   `GlowCard`: Use `variant="interactive"` for clickable cards.
    *   `GlowInput`: Use `variant="glow"` for focus effects.
    *   `GlowModal`: For all dialogs.
    *   `AppShell`: **MANDATORY** wrapper for all authenticated pages.

### 3. Styling Rules
*   **Shadows**: Use `shadow-glow-primary`, `shadow-ambient-card`, `shadow-interactive`.
*   **Animations**: `animate-glow-pulse`, `animate-fade-in`.
*   **Spacing**: Use the 4px grid (4, 8, 12, 16, 24, 32...).

---

## 🏗️ Architecture & Implementation

### 1. AppShell & Navigation
*   **No Sidebars**: Individual apps (like VisionFlow) **MUST NOT** have their own left sidebar.
*   **Top Nav Only**: Use the top navigation bar within the AppShell content region for app-specific nav.
*   **Layout**: All pages live in `apps/shell/src/app/[module]/`.

### 2. Supabase & Security
*   **RLS is King**: Row Level Security is the primary security boundary. Never bypass it.
*   **Multi-Tenancy**: Every query must filter by `organization_id`.
*   **Clients**:
    *   Client-side: `import { createClient } from '@/lib/supabase/client';`
    *   Server-side: `import { createServerSupabaseClient } from '@/lib/supabase/server';`

### 3. Error Handling & Monitoring
*   **User Feedback**: Use `sonner` for toasts (`toast.success`, `toast.error`).
*   **Logging**: Use `console.error` for now (Sentry planned).

---

## 📋 Agentic Workflow Guidelines

I operate in three distinct modes: **PLANNING**, **EXECUTION**, and **VERIFICATION**.

### 1. PLANNING Mode
*   **Goal**: Understand the request and design a solution.
*   **Artifacts**:
    *   `task.md`: Initialize/Update with a breakdown of the work.
    *   `implementation_plan.md`: Create a detailed technical plan.
*   **Actions**:
    *   Read `CLAUDE.md`, `GLOW_UI_IMPLEMENTATION.md`, and relevant `documentation/` files.
    *   Explore the codebase to understand existing patterns.
    *   **CRITICAL**: Use the **Universal Plan-Mode Template** from `CLAUDE.md` to structure the `implementation_plan.md`.
    *   **Review**: Call `notify_user` to get approval on the plan before moving to Execution.

### 2. EXECUTION Mode
*   **Goal**: Implement the approved plan.
*   **Artifacts**:
    *   Update `task.md` as items are completed.
*   **Actions**:
    *   Use `task_boundary` to track progress granularly.
    *   Write code that adheres to **Glow UI** and **Supabase** patterns.
    *   **Style**: Use `pnpm format` and `pnpm lint` to ensure code quality.
    *   **Communication**: If I hit a blocker or a major deviation, use `notify_user`.

### 3. VERIFICATION Mode
*   **Goal**: Prove that the changes work.
*   **Artifacts**:
    *   `walkthrough.md`: Document what was done and how it was verified.
*   **Actions**:
    *   **Automated Tests**: Run `pnpm test` or specific test files.
    *   **Manual Verification**: Use the browser tool to verify UI changes.
    *   **Validation**: Run `pnpm type-check` and `pnpm lint` before finishing.
    *   **Final Review**: Call `notify_user` with the `walkthrough.md` for final sign-off.

---

## 🛠️ Tool Usage Standards

*   **`task_boundary`**: Call this **first** when changing context or making significant progress. Keep `TaskStatus` focused on *next steps*.
*   **`notify_user`**: The **only** way to talk to the user during a task. Use it for:
    *   Plan approval.
    *   Clarifying questions (batched).
    *   Final walkthrough delivery.
*   **`run_command`**:
    *   Always use `SafeToAutoRun: true` for read-only commands (ls, cat, grep).
    *   Use `pnpm` for all package operations.
*   **`browser_subagent`**: Use for visual verification of UI changes.

---

## 🚫 "Never Do" List

1.  **Never** create page-specific headers or sidebars (use AppShell).
2.  **Never** use raw CSS or arbitrary Tailwind colors (use Glow UI tokens).
3.  **Never** bypass RLS (Row Level Security).
4.  **Never** leave `task.md` outdated.
5.  **Never** guess at database schema changes (check `supabase/migrations`).

---

## 📂 Documentation Placement

Follow `documentation/DOCUMENTATION_GUIDELINES.md`:
*   **Project-wide**: `documentation/general/`
*   **Platform features**: `documentation/platform/`
*   **App-specific**: `documentation/apps/{app-name}/`
*   **Tech decisions**: `documentation/adrs/`

---

## 🧠 Cognitive Standards & Self-Correction (My Personal Rules)

To ensure I am not just a "code generator" but a true **partner**, I impose these additional rules on myself:

## 🧠 Cognitive Standards & Self-Correction (My Personal Rules)

To ensure I am not just a "code generator" but a true **partner**, I impose these specific, project-aligned rules on myself:

1.  **The "Business Value" Check**: Before writing code, I must verify *which* PRD requirement or User Story this change fulfills. If it's not in `VISIONFLOW_IMPLEMENTATION_PLAYBOOK.md` or `REMAINING_FEATURES_SPECIFICATION.md`, I must confirm with the user.
2.  **The "Don't Reinvent" Rule**: Before creating a new component or utility, I *must* search `apps/shell/src/components/glow-ui` and `apps/shell/src/lib` to ensure a similar one doesn't already exist. I will use `grep_search` to find existing patterns.
3.  **The "Modern Stack" Mandate**: I will actively hunt for and replace legacy patterns:
    *   `localStorage` → Replace with `supabase.auth` or `user_preferences` table.
    *   `useEffect` data fetching → Replace with Server Components or specific hooks.
    *   Raw CSS/Tailwind colors → Replace with `vision-*` color tokens and Glow UI components.
4.  **The "Visual Polish" Standard**: I will verify every UI change by:
    *   Checking mobile responsiveness (resizing browser).
    *   Verifying Dark Mode compatibility.
    *   Ensuring hover/active states use proper Glow effects (`shadow-glow-*`).
5.  **The "State Completeness" Protocol**: Every async UI component *must* explicitly handle:
    *   `isLoading` (use `Skeleton` or `Spinner`).
    *   `isError` (use `toast.error` or `ErrorBoundary`).
    *   `isEmpty` (use `EmptyState` component).
6.  **The "AppShell & RLS" Iron Law**:
    *   I will **REJECT** any request to add a sidebar to a page (must use `NavigationSidebar` in AppShell).
    *   I will **REJECT** any SQL query that lacks `organization_id` filtering (unless explicitly super-admin).

---

*This file is a living document for Antigravity's self-guidance.*
