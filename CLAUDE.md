# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**VISION Platform V2** is an enterprise SaaS platform built with Next.js 15 (App Router), React 19, TypeScript 5.6, and Tailwind CSS 3.4. The platform provides 20+ integrated applications for nonprofits including document management, organization/team management, dashboards, and specialized modules like Ops360, MetricMap, and Community Compass.

**Key Features:**
- Multi-tenant architecture with Supabase PostgreSQL + Row-Level Security (RLS)
- Glow UI design system with 2911 Bold Color System
- Unified AppShell layout (no page-specific headers/sidebars)
- Real-time collaboration and document management
- Organization switching and team management
- Role-based access control (Owner, Admin, Member)

## Technology Stack

- **Frontend**: React 19, Next.js 15 (App Router), TypeScript 5.6
- **Styling**: Tailwind CSS 3.4, Glow UI patterns, class-variance-authority
- **Backend**: Supabase (PostgreSQL, Auth, Storage, RLS)
- **State**: React Context (AuthContext, OrganizationContext)
- **Forms**: React Hook Form + Zod validation
- **UI Components**: Radix UI primitives, Lucide icons
- **Monorepo**: Turborepo + pnpm workspace
- **Testing**: Vitest (unit/integration), Playwright (E2E - planned)
- **Package Manager**: pnpm 10.18.1+
- **Node Version**: 20.0.0+

---

# 📋 Universal Plan-Mode Template for VISION Platform (Granular & Safe)

This guide defines how Claude's "plan mode" should operate **for any plan you request** in the VISION Platform project. It ensures tasks are broken down into sufficiently granular steps to avoid breaking existing functionality, align with the **PRD**, **Complete App Catalog**, **Bold Color System**, and **AppShell** architecture, and deliver robust AI-driven test coverage.

---

## 🧠 1. System Context & Constraints

1. **Project Name:** VISION Platform
2. **Tech Stack:** Next.js 15 + React 19 + TypeScript 5.6, Tailwind 3.4, Supabase (Postgres + Auth + Storage), pnpm, Turbo monorepo, Vitest, Playwright.
3. **Design System:** Glow UI patterns (standard spacing, cards, inputs, modals) and the **2911 Bold Color System** (blue, green, orange, purple, red).
4. **Architecture:** All pages live within the **AppShell** (Top Header, Collapsible Side Nav, Main Content Area) — no page-specific sidebars or headers.
5. **Modules:** Core Shell + 20 applications (Ops360, MetricMap, Community Compass, etc.) as detailed in the PRD and Complete App Catalog.
6. **Security:** Strict RLS policies, rate limiting, CSRF protection, CSP headers, input validation and secure headers.
7. **Non-Negotiable:** All prompts and outputs are **Markdown**; all designs follow Glow UI + 2911; tasks must not guess unspecified details.

---

## 🎯 2. North Star Goal for Every Plan

**Deliver a detailed, step-by-step development plan** for the requested feature or module that:

- Adheres to the existing architecture and design constraints.
- Integrates with existing services (Supabase, Sentry, PostHog, Resend).
- Includes granular tasks that can be executed independently without breaking current functionality.
- Provides a comprehensive testing strategy (unit, integration, E2E) using AI to automate test generation and execution.
- References the relevant sections of the PRD, App Catalog and Remaining Features Specification.

---

## 📥 3. Input/Output Specification

| **Section** | **Content** |
|---|---|
| **Input** | User request for a specific plan (e.g., build Ops360, implement notifications). |
| **Output** | A detailed plan document (Markdown) that includes tasks, dependencies, estimates, test plan and success criteria. |

---

## 🔧 4. Plan Generation Steps

Claude should follow these steps **for every new plan**:

### Step 1: Parse Requirements

1. **Identify scope** from the user's request.
2. **Map features** to corresponding sections in the PRD, App Catalog and specification (e.g., Ops360 features).
3. **List all functional and non-functional requirements** (security, UX, performance).
4. **Clarify** any missing information before proceeding, per the "never guess" rule.

### Step 2: Define Modules & Components

1. **Determine database entities**, tables and relationships (e.g., `ops360_projects`, `ops360_tasks`).
2. **Identify API endpoints** needed for CRUD operations.
3. **Specify services and contexts** required in the front-end.
4. **List pages and components** to create, mapping them to Glow UI patterns (e.g., ProjectList, KanbanBoard).
5. **Establish dependencies** (e.g., finish authentication before building protected routes).

### Step 3: Break Down Tasks

1. **Database & Migrations**
   - Create migration files with table definitions, indexes and RLS policies.
   - Generate TypeScript interfaces and Supabase types.
2. **API Layer**
   - Implement endpoints in `src/app/api/v1/...` with request validation, error handling and rate limiting.
   - Write integration tests verifying correct responses and RLS enforcement.
3. **Service Layer**
   - Write service functions in `src/services/` for business logic (e.g., `createProject`, `assignTask`).
   - Include unit tests for each function.
4. **Frontend**
   - Create pages under `src/app/[module]/` using the AppShell layout.
   - Build components using Glow UI (cards, forms, modals) and apply 2911 colors.
   - Handle loading states, error states and edge cases.
5. **State & Context**
   - Implement React contexts for managing module state (e.g., ProjectsContext).
   - Integrate with the existing OrganizationContext and Notification system.
6. **Real-time & Side Effects**
   - If applicable, subscribe to Supabase Realtime channels for live updates.
   - Send analytics events via PostHog and emails via Resend.

### Step 4: Testing Plan

1. **Unit Tests** – Target ≥80% coverage. Use Vitest with clear `describe/it` blocks for each service and utility.
2. **Integration Tests** – Test API routes with mock requests; verify status codes and JSON schema.
3. **E2E Tests** – Use Playwright to simulate user flows (e.g., create project → add tasks → upload file).
4. **AI-Generated Tests** – For each requirement, Claude should propose a test case skeleton. When executed, Claude can generate the actual test code.
5. **Continuous Testing** – Add tests to the CI pipeline and monitor coverage via Codecov.

### Step 5: Documentation & Success Criteria

1. **Success Definition** – State what "done" means: working feature with all tests passing, deployed to staging, meets PRD acceptance criteria.
2. **Documentation** – Provide inline comments, README updates and API documentation.
3. **Deployment Readiness** – Verify environment variables, migrations and analytics integrations are configured.

---

## ✅ 5. Final Command for Claude

At the end of each plan, instruct Claude to output the full implementation or test scaffold as needed.

---

## Development Commands

```bash
# Install dependencies
pnpm install

# Start development server (http://localhost:3001)
pnpm dev

# Build for production
pnpm build

# Type checking
pnpm type-check

# Linting
pnpm lint

# Format code
pnpm format

# Run tests
pnpm test

# Validate color system compliance
pnpm validate:colors

# Validate component structure
pnpm validate:components

# Storybook (component library)
pnpm storybook

# Clean build artifacts and dependencies
pnpm clean
```

### Workspace-Specific Commands

```bash
# Run commands in the shell app only
pnpm --filter @vision/shell dev
pnpm --filter @vision/shell build
pnpm --filter @vision/shell type-check

# Single test file
pnpm test path/to/file.test.ts

# Watch mode for tests
pnpm test --watch
```

### Supabase Commands

```bash
# Login to Supabase
npx supabase login

# Start local Supabase (Docker required)
npx supabase start

# Stop local Supabase
npx supabase stop

# Generate TypeScript types from database schema
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > apps/shell/src/types/supabase.ts

# Run migrations
npx supabase db push

# Create new migration
npx supabase migration new migration_name

# Reset database (CAUTION: destroys all data)
npx supabase db reset
```

### Utility Scripts

```bash
# Seed organizations (development)
npx tsx scripts/seed-organizations.ts

# Verify user setup
npx tsx scripts/verify-user.ts

# Test RLS policies
npx tsx scripts/test-rls.ts
```

## Architecture

### Monorepo Structure

```
VISION-PLATFORM-V2/
├── apps/
│   └── shell/                    # Main Next.js application
│       ├── src/
│       │   ├── app/             # Next.js App Router pages & API routes
│       │   ├── components/      # React components
│       │   ├── services/        # Business logic & data access
│       │   ├── contexts/        # React Context providers
│       │   ├── hooks/           # Custom React hooks
│       │   ├── lib/             # Utilities & configurations
│       │   ├── types/           # TypeScript types & interfaces
│       │   └── styles/          # Global styles
│       ├── public/              # Static assets
│       ├── next.config.ts       # Next.js configuration
│       └── tailwind.config.ts   # Tailwind + Glow UI tokens
├── packages/                     # Shared packages (future)
│   ├── ui/                      # Shared UI components
│   └── config/                  # Shared configs
├── supabase/
│   ├── migrations/              # SQL migration files
│   └── functions/               # Edge functions (planned)
├── scripts/                     # Utility scripts
└── turbo.json                   # Turborepo configuration
```

### AppShell Layout Architecture

**Critical**: ALL authenticated pages render within the AppShell component. Never create page-specific headers or sidebars.

**AppShell Components** ([apps/shell/src/components/layout/AppShell.tsx](apps/shell/src/components/layout/AppShell.tsx)):
- `GlowTopHeader` - Fixed top navigation with user menu, notifications, app launcher
- `GlowSideNav` - Collapsible left sidebar with main navigation (280px expanded, 80px collapsed)
- `GlowMobileNavDrawer` - Mobile hamburger menu
- Main content area - Scrollable region with `bg-[#F8FAFC]` (Mist)

**Layout Behavior**:
- Desktop: Side nav visible, toggleable collapse
- Mobile: Side nav hidden, accessible via hamburger menu
- Public routes (/, /signin, /signup, /forgot-password, /reset-password, /unauthorized, /demo) render without AppShell

### Supabase Integration

**Client-Side** ([apps/shell/src/lib/supabase/client.ts](apps/shell/src/lib/supabase/client.ts)):
```typescript
import { createClient } from '@/lib/supabase/client';
const supabase = createClient();
```

**Server-Side** ([apps/shell/src/lib/supabase/server.ts](apps/shell/src/lib/supabase/server.ts)):
```typescript
import { createServerSupabaseClient } from '@/lib/supabase/server';
const supabase = await createServerSupabaseClient();
```

**Type Safety**: All database operations use generated types from [apps/shell/src/types/supabase.ts](apps/shell/src/types/supabase.ts). Regenerate after schema changes:
```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > apps/shell/src/types/supabase.ts
```

**RLS (Row-Level Security)**:
- All tables enforce multi-tenant isolation via `organization_id`
- Users see only data from organizations they belong to
- Special roles (Owner, Admin) have elevated permissions
- Test RLS with: `npx tsx scripts/test-rls.ts`

### Service Layer Pattern

Business logic lives in [apps/shell/src/services/](apps/shell/src/services/) directory:
- `organizationService.ts` - Organization CRUD, membership, active org switching
- `profileService.ts` - User profile management
- `teamService.ts` - Team member management, invitations
- `documentService.ts` - Document management, versioning
- `folderService.ts` - Folder hierarchy
- `notificationService.ts` - Notifications

**Service Pattern**:
```typescript
export const exampleService = {
  async getData(id: string): Promise<DataType> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('table_name')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },
};
```

### API Routes Architecture

API routes in [apps/shell/src/app/api/v1/](apps/shell/src/app/api/v1/):
- Use server-side Supabase client: `await createServerSupabaseClient()`
- Check authentication first: `await supabase.auth.getUser()`
- Verify permissions: Check user's role in organization
- Return JSON with appropriate status codes
- Handle params asynchronously: `const { id } = await params`

**Example API Route Pattern**:
```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createServerSupabaseClient();
  const { id } = await params;

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check permissions, fetch data, return response
}
```

## Design System

### 2911 Bold Color System

Primary palette (use these for all UI elements):
- **Blue** `#0047AB` - Bold Royal Blue (primary actions, links)
- **Green** `#047857` - Vivid Forest Green (success states)
- **Orange** `#C2410C` - Vivid Tangerine (warnings, accents)
- **Purple** `#6D28D9` - Rich Purple (premium features)
- **Red** `#B91C1C` - Electric Scarlet (errors, destructive actions)
- **Gray** `#64748B` - Steel Gray (text, borders)

**Background Colors**:
- Mist: `#F8FAFC` (page background)
- Smoke: `#F1F5F9` (secondary background)
- White: `#FFFFFF` (cards, modals)

**Tailwind Usage**:
```tsx
<button className="bg-vision-blue-950 text-white hover:bg-vision-blue-700">
  Primary Button
</button>
<div className="text-vision-green-700 bg-vision-green-50">
  Success Message
</div>
```

### Glow UI Patterns

**Spacing Scale**: 4, 8, 12, 16, 20, 24, 32, 40 (use multiples of 4)

**Component Library** in [apps/shell/src/components/glow-ui/](apps/shell/src/components/glow-ui/):
- `GlowButton.tsx` - Primary/secondary/outline buttons with glow effects
- `GlowCard.tsx` - Cards with ambient shadow and hover effects
- `GlowInput.tsx` - Form inputs with Glow styling
- `GlowSelect.tsx` - Select dropdowns
- `GlowTabs.tsx` - Tab navigation
- `GlowModal.tsx` - Dialog/modal windows
- `GlowBadge.tsx` - Status badges
- `GlowSwitch.tsx` - Toggle switches

**Always use Glow components** instead of creating custom styled components.

### Shadow System

```tsx
// Glow effects (use for interactive elements)
className="shadow-glow-primary hover:shadow-glow-primary-lg"

// Ambient effects (use for cards)
className="shadow-ambient-card hover:shadow-ambient-card-hover"

// Interactive effects (use for buttons, clickable items)
className="shadow-interactive hover:shadow-interactive-hover"
```

## Database Schema

Key tables:
- `users` - User profiles (name, email, avatar)
- `user_preferences` - User settings, active_organization_id
- `organizations` - Organization details (name, type, EIN, brand colors)
- `organization_members` - Membership with roles (Owner/Admin/Member)
- `organization_invites` - Pending invitations
- `documents` - File metadata with version tracking
- `folders` - Folder hierarchy
- `document_activity` - Audit log for document actions
- `document_versions` - Version history

**All tables include**:
- `id` (UUID, primary key)
- `created_at` (timestamp)
- `updated_at` (timestamp)
- `deleted_at` (nullable timestamp for soft deletes)
- `organization_id` (FK, for RLS)

## Key Patterns & Best Practices

### Authentication Flow

1. User signs in via [/signin](apps/shell/src/app/signin/page.tsx)
2. Supabase Auth sets session cookie
3. AppShell loads user from `auth.getUser()` + `users` table
4. OrganizationContext loads active organization
5. All data queries filter by active organization

### Organization Switching

```typescript
import { useOrganization } from '@/contexts/OrganizationContext';

function MyComponent() {
  const { activeOrganization, setActiveOrganization, organizations } = useOrganization();

  // Switch organization
  await setActiveOrganization(newOrgId);
}
```

### Form Validation

Use React Hook Form + Zod:
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
});

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
});
```

### Error Handling

- Use `sonner` toast notifications for user-facing errors
- Log errors to console in development
- Future: Sentry integration for production error tracking

```typescript
import { toast } from 'sonner';

try {
  await someOperation();
  toast.success('Operation completed');
} catch (error) {
  toast.error('Operation failed');
  console.error(error);
}
```

### Loading States

Always show loading states for async operations:
```tsx
const [loading, setLoading] = useState(false);

<GlowButton loading={loading} onClick={handleSubmit}>
  Save Changes
</GlowButton>
```

### Type Safety

- Always use TypeScript types from `@/types/supabase`
- Create domain types in `@/types/` for app-specific models
- Use `satisfies` for configuration objects
- Enable strict mode in tsconfig.json

### File Naming

- Components: PascalCase (e.g., `UserProfile.tsx`)
- Services: camelCase (e.g., `organizationService.ts`)
- Utilities: camelCase (e.g., `formatDate.ts`)
- Types: camelCase (e.g., `organization.ts`)
- API routes: kebab-case folders, `route.ts` file

### Component Organization

```tsx
// 1. Imports (external, internal, types)
import React from 'react';
import { useRouter } from 'next/navigation';
import { GlowButton } from '@/components/glow-ui/GlowButton';
import type { Organization } from '@/types/organization';

// 2. Types/Interfaces
interface MyComponentProps {
  title: string;
}

// 3. Component
export function MyComponent({ title }: MyComponentProps) {
  // 4. Hooks
  const router = useRouter();
  const [state, setState] = useState();

  // 5. Effects
  useEffect(() => {}, []);

  // 6. Handlers
  const handleClick = () => {};

  // 7. Render
  return <div>{title}</div>;
}
```

## Common Tasks

### Adding a New Page

1. Create page in `apps/shell/src/app/new-page/page.tsx`
2. Add route to navigation in `apps/shell/src/lib/nav-config.ts`
3. Page automatically renders within AppShell (if authenticated)
4. Use Glow components for UI

### Adding a New API Route

1. Create `apps/shell/src/app/api/v1/resource/route.ts`
2. Implement GET/POST/PUT/DELETE handlers
3. Use server-side Supabase client
4. Check authentication & permissions
5. Return JSON responses

### Creating a New Service

1. Create `apps/shell/src/services/myService.ts`
2. Export object with methods
3. Use client-side Supabase client
4. Include error handling
5. Type all inputs/outputs

### Adding a Database Table

1. Create migration: `npx supabase migration new create_table_name`
2. Write SQL in `supabase/migrations/YYYYMMDDHHMMSS_create_table_name.sql`
3. Include RLS policies for multi-tenancy
4. Run migration: `npx supabase db push`
5. Regenerate types: `npx supabase gen types typescript...`

### Updating Component Styles

1. Use Tailwind utility classes first
2. Reference 2911 Bold Color System palette
3. Use Glow UI spacing scale (multiples of 4)
4. Add custom shadows if needed
5. Validate with: `pnpm validate:colors`

## Environment Variables

Required in `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
RESEND_API_KEY=your-resend-api-key (optional)
```

See [.env.example](.env.example) for full list.

## Testing

### Unit Tests (Vitest)

```bash
# Run all tests
pnpm test

# Run specific file
pnpm test apps/shell/src/app/dashboard/page.test.tsx

# Watch mode
pnpm test --watch
```

### Testing Strategy

- Test service layer methods
- Test utility functions
- Test component logic (not rendering)
- Mock Supabase calls
- Future: E2E tests with Playwright

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/feature-name

# Make changes and commit
git add .
git commit -m "feat: descriptive message"

# Push and create PR
git push origin feature/feature-name
```

**Commit Convention**: Use conventional commits (feat, fix, docs, style, refactor, test, chore)

## Troubleshooting

### "Module not found" errors
- Run `pnpm install` to ensure dependencies are installed
- Check path aliases in `tsconfig.json` (`@/` maps to `src/`)

### Supabase connection errors
- Verify `.env.local` has correct credentials
- Check if Supabase project is active
- Test connection with: `npx tsx scripts/verify-user.ts`

### Type errors after schema changes
- Regenerate Supabase types: `npx supabase gen types typescript...`
- Run `pnpm type-check` to verify

### RLS policy issues
- Check user membership in organization
- Verify `organization_id` in queries
- Test with: `npx tsx scripts/test-rls.ts`

### Build failures
- Clear cache: `pnpm clean && pnpm install`
- Check for TypeScript errors: `pnpm type-check`
- Check for linting errors: `pnpm lint`

## Documentation

- [README.md](README.md) - Project overview and quick start
- [SETUP_COMPLETE.md](SETUP_COMPLETE.md) - Setup guide and troubleshooting
- [Claude Documentation/](Claude%20Documentation/) - Component build guides
- [documentation/](documentation/) - Additional platform documentation

## Production Deployment

**Recommended**: Vercel (seamless Next.js integration)

```bash
# Build production bundle
pnpm build

# Test production build locally
cd apps/shell && pnpm start
```

**Environment Setup**:
1. Add environment variables in Vercel dashboard
2. Connect Supabase production instance
3. Run migrations on production database
4. Configure custom domain
5. Enable analytics and monitoring

---

**Current Status**: Phase 3 complete - Document management system, organization/team management, and dashboard implemented. Supabase backend fully integrated with RLS policies. Ready for additional application modules.
