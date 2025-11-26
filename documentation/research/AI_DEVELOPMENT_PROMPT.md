# AI Development Agent Prompt - VISION Platform

**Agent Role:** Full-Stack Development Agent
**Project:** VISION Platform - "Microsoft 365 for Nonprofits"
**Current Phase:** Week 1 - Foundation Setup
**Status:** Ready to Begin Implementation

---

## 🎯 Your Mission

You are an expert full-stack development agent tasked with building the VISION Platform - a unified, AI-powered SaaS platform for nonprofit organizations. You will work through a comprehensive 16-week implementation plan, starting with Week 1: Foundation Infrastructure.

---

## 📋 Essential Context

### Project Overview

**What You're Building:**
A multi-tenant SaaS platform that provides 32+ integrated nonprofit applications (grant management, capacity assessment, document management, CRM, etc.) - the "Microsoft 365 for Nonprofits."

**Technology Stack:**
- **Frontend:** Next.js 14+ (App Router), React 18, TypeScript 5+, Mantine UI
- **Backend:** Supabase (PostgreSQL 15+ with RLS), Supabase Auth, Edge Functions
- **AI:** Claude 3.5 Sonnet API (primary), OpenAI embeddings
- **Infrastructure:** Vercel (frontend), Supabase (backend), pnpm workspaces monorepo
- **Package Manager:** pnpm 8.15+
- **Node Version:** 20 LTS

**Key Architecture Decisions:**
- Multi-tenant with shared database + Row-Level Security (RLS)
- Monorepo with shared packages (@vision/ui, @vision/auth, @vision/database, @vision/ai-functions)
- Server Components by default, Client Components only when needed
- Event-driven cross-app communication

---

## 📚 Required Reading (CRITICAL - Read Before Starting)

### Must Read First (30 minutes):

1. **[START_HERE.md](START_HERE.md)** - Navigation and quick start
2. **[CONSOLIDATED_DEVELOPMENT_PLAN.md](CONSOLIDATED_DEVELOPMENT_PLAN.md)** - Master plan, read Week 1 section carefully
3. **[docs/features/best-practices/development-standards.md](docs/features/best-practices/development-standards.md)** - MANDATORY coding standards

### Reference During Development:

4. **[docs/features/architecture/platform-architecture.md](docs/features/architecture/platform-architecture.md)** - System architecture
5. **[docs/features/architecture/database-schema.md](docs/features/architecture/database-schema.md)** - Database design
6. **[docs/features/best-practices/security-guidelines.md](docs/features/best-practices/security-guidelines.md)** - Security requirements
7. **[docs/features/implementation/component-extraction-guide.md](docs/features/implementation/component-extraction-guide.md)** - Component migration guide

---

## 🚀 Week 1 Implementation Tasks

### Current Objective: Monorepo Setup & Shared Packages

You are starting **Week 1, Day 1** of the 16-week implementation plan.

### Day 1-2: Monorepo Structure & Configuration

**Goal:** Initialize monorepo with pnpm workspaces and Turborepo

**Tasks:**

1. **Initialize Monorepo Structure**
   ```bash
   # Create directory structure
   mkdir -p packages/{ui,database,auth,ai-functions,config}
   mkdir -p apps/{platform-shell,capacity-assessment}

   # Initialize root package.json
   pnpm init
   ```

2. **Create `pnpm-workspace.yaml`**
   ```yaml
   packages:
     - 'packages/*'
     - 'apps/*'
   ```

3. **Set up Turborepo Configuration** (`turbo.json`)
   ```json
   {
     "$schema": "https://turbo.build/schema.json",
     "pipeline": {
       "build": {
         "dependsOn": ["^build"],
         "outputs": [".next/**", "dist/**"]
       },
       "test": {
         "dependsOn": ["^build"],
         "cache": false
       },
       "lint": {},
       "dev": {
         "cache": false,
         "persistent": true
       },
       "type-check": {
         "dependsOn": ["^build"]
       }
     }
   }
   ```

4. **Create Shared TypeScript Config** (`packages/config/tsconfig.base.json`)
   ```json
   {
     "compilerOptions": {
       "target": "ES2020",
       "lib": ["ES2020", "DOM", "DOM.Iterable"],
       "jsx": "react-jsx",
       "module": "ESNext",
       "moduleResolution": "bundler",
       "resolveJsonModule": true,
       "allowJs": true,
       "strict": true,
       "esModuleInterop": true,
       "skipLibCheck": true,
       "forceConsistentCasingInFileNames": true,
       "noEmit": true,
       "incremental": true,
       "isolatedModules": true,
       "allowSyntheticDefaultImports": true
     }
   }
   ```

5. **Create Shared ESLint Config** (`packages/config/eslint-config.js`)
   - TypeScript rules
   - React rules
   - Next.js rules
   - Accessibility rules

6. **Create Shared Prettier Config** (`packages/config/.prettierrc`)
   ```json
   {
     "semi": true,
     "trailingComma": "es5",
     "singleQuote": true,
     "printWidth": 100,
     "tabWidth": 2,
     "useTabs": false
   }
   ```

**Deliverables:**
- [ ] Monorepo structure created
- [ ] pnpm-workspace.yaml configured
- [ ] Turborepo pipeline set up
- [ ] Shared configs created (TypeScript, ESLint, Prettier)
- [ ] `pnpm install` runs without errors
- [ ] `pnpm lint` passes
- [ ] `pnpm type-check` passes

### Day 3-4: Extract @vision/ui Package

**Goal:** Extract and migrate 20+ UI components from CapacityIQ

**Reference:** [component-extraction-guide.md](docs/features/implementation/component-extraction-guide.md)

**Tasks:**

1. **Create UI Package Structure**
   ```
   packages/ui/
   ├── src/
   │   ├── components/     # Button, Card, Badge, Alert, Modal, etc.
   │   ├── forms/          # Input, Select, Textarea, etc.
   │   ├── layouts/        # AppShell, Header, Footer, Sidebar
   │   ├── navigation/     # Navigation, Breadcrumbs
   │   ├── theme/          # Mantine theme configuration
   │   ├── utils/          # UI utilities
   │   └── index.ts        # Main export
   ├── package.json
   ├── tsconfig.json
   └── vitest.config.ts
   ```

2. **Extract Priority 1 Components** (from CapacityIQ):

   **Layout Components:**
   - [ ] AppShell - Main application shell
   - [ ] Navigation - Primary navigation with permissions
   - [ ] Header - User menu, notifications
   - [ ] Footer - Links, copyright
   - [ ] Sidebar - Collapsible sidebar

   **UI Primitives:**
   - [ ] Button - Primary, secondary, ghost variants
   - [ ] Card - Container with shadow
   - [ ] Badge - Status indicators
   - [ ] Alert - Success, error, warning, info
   - [ ] Modal - Dialog overlay
   - [ ] Tooltip - Hover help text
   - [ ] Spinner - Loading indicator
   - [ ] Skeleton - Content placeholder

   **Data Display:**
   - [ ] Table - Data table with sorting
   - [ ] List - List with items
   - [ ] EmptyState - No data placeholder

3. **Create Mantine Theme Configuration**

   File: `packages/ui/src/theme/mantine-theme.ts`

   Extract design tokens from CapacityIQ:
   - Brand colors (blue palette)
   - Typography (Inter font)
   - Spacing scale
   - Border radius
   - Shadows
   - Component defaults

   Example:
   ```typescript
   export const visionTheme: MantineThemeOverride = {
     primaryColor: 'blue',
     colors: {
       blue: [
         '#E7F5FF',
         '#D0EBFF',
         '#A5D8FF',
         '#74C0FC',
         '#4DABF7',
         '#339AF0', // Primary
         '#228BE6',
         '#1C7ED6',
         '#1971C2',
         '#1864AB',
       ],
     },
     fontFamily: 'Inter, sans-serif',
     // ... more configuration
   };
   ```

4. **Set Up Storybook**
   ```bash
   cd packages/ui
   pnpm dlx storybook@latest init
   ```

   Create stories for each component:
   - Primary/Secondary/Ghost variants
   - Disabled states
   - Loading states
   - Different sizes
   - Accessibility examples

5. **Write Tests for Each Component**

   Use Vitest + Testing Library:
   ```typescript
   // Example: Button.test.tsx
   import { describe, it, expect, vi } from 'vitest';
   import { render, screen, fireEvent } from '@testing-library/react';
   import { Button } from './Button';

   describe('Button', () => {
     it('renders children correctly', () => {
       render(<Button>Click Me</Button>);
       expect(screen.getByText('Click Me')).toBeInTheDocument();
     });

     it('calls onClick when clicked', () => {
       const handleClick = vi.fn();
       render(<Button onClick={handleClick}>Click</Button>);
       fireEvent.click(screen.getByText('Click'));
       expect(handleClick).toHaveBeenCalledTimes(1);
     });

     it('applies correct variant styles', () => {
       const { rerender } = render(<Button variant="primary">Primary</Button>);
       expect(screen.getByRole('button')).toHaveClass('mantine-Button-filled');
     });
   });
   ```

**Deliverables:**
- [ ] @vision/ui package created with 20+ components
- [ ] Mantine theme configured
- [ ] Storybook running at localhost:6006
- [ ] All components tested (80%+ coverage)
- [ ] Package builds successfully (`pnpm build`)
- [ ] Package exports working (`pnpm test`)

### Day 5: Extract @vision/auth and @vision/database Packages

**Goal:** Create shared authentication and database packages

**Tasks:**

1. **Create @vision/auth Package**

   Structure:
   ```
   packages/auth/
   ├── src/
   │   ├── hooks/
   │   │   ├── useAuth.ts       # Auth state hook
   │   │   └── useUser.ts       # User data hook
   │   ├── context/
   │   │   └── AuthContext.tsx  # Auth provider
   │   ├── utils/
   │   │   ├── session.ts       # Session management
   │   │   └── permissions.ts   # RBAC utilities
   │   └── index.ts
   ├── package.json
   └── tsconfig.json
   ```

   **Key Files:**

   `hooks/useAuth.ts`:
   ```typescript
   import { useContext, useEffect, useState } from 'react';
   import { User } from '@supabase/supabase-js';
   import { createClient } from '@vision/database';

   export function useAuth() {
     const [user, setUser] = useState<User | null>(null);
     const [loading, setLoading] = useState(true);
     const supabase = createClient();

     useEffect(() => {
       // Get initial session
       supabase.auth.getSession().then(({ data: { session } }) => {
         setUser(session?.user ?? null);
         setLoading(false);
       });

       // Listen for auth changes
       const { data: { subscription } } = supabase.auth.onAuthStateChange(
         (_event, session) => {
           setUser(session?.user ?? null);
         }
       );

       return () => subscription.unsubscribe();
     }, []);

     const signOut = async () => {
       await supabase.auth.signOut();
     };

     return { user, loading, signOut };
   }
   ```

   `context/AuthContext.tsx`:
   ```typescript
   import { createContext, useContext, ReactNode } from 'react';
   import { User } from '@supabase/supabase-js';
   import { useAuth } from '../hooks/useAuth';

   interface AuthContextType {
     user: User | null;
     loading: boolean;
     signOut: () => Promise<void>;
   }

   const AuthContext = createContext<AuthContextType | undefined>(undefined);

   export function AuthProvider({ children }: { children: ReactNode }) {
     const auth = useAuth();

     return (
       <AuthContext.Provider value={auth}>
         {children}
       </AuthContext.Provider>
     );
   }

   export function useAuthContext() {
     const context = useContext(AuthContext);
     if (!context) {
       throw new Error('useAuthContext must be used within AuthProvider');
     }
     return context;
   }
   ```

2. **Create @vision/database Package**

   Structure:
   ```
   packages/database/
   ├── src/
   │   ├── client.ts            # Supabase client factory
   │   ├── hooks/
   │   │   ├── useGrants.ts     # Grant queries
   │   │   ├── useDocuments.ts  # Document queries
   │   │   └── useOrganization.ts
   │   ├── types/
   │   │   └── database.ts      # Generated types
   │   └── index.ts
   ├── package.json
   └── tsconfig.json
   ```

   **Key Files:**

   `client.ts`:
   ```typescript
   import { createClient as createSupabaseClient } from '@supabase/supabase-js';
   import type { Database } from './types/database';

   export function createClient() {
     return createSupabaseClient<Database>(
       process.env.NEXT_PUBLIC_SUPABASE_URL!,
       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
     );
   }

   export function createServerClient() {
     return createSupabaseClient<Database>(
       process.env.NEXT_PUBLIC_SUPABASE_URL!,
       process.env.SUPABASE_SERVICE_ROLE_KEY!
     );
   }
   ```

   `hooks/useGrants.ts`:
   ```typescript
   import { useQuery } from '@tanstack/react-query';
   import { createClient } from '../client';

   export function useGrants(organizationId: string) {
     return useQuery({
       queryKey: ['grants', organizationId],
       queryFn: async () => {
         const supabase = createClient();
         const { data, error } = await supabase
           .from('grants')
           .select('*')
           .eq('organization_id', organizationId)
           .order('created_at', { ascending: false });

         if (error) throw error;
         return data;
       },
     });
   }
   ```

**Deliverables:**
- [ ] @vision/auth package with useAuth hook
- [ ] @vision/database package with Supabase client
- [ ] React Query hooks for common queries
- [ ] TypeScript types generated
- [ ] Both packages build successfully
- [ ] Tests passing

---

## 🔐 Mandatory Development Standards

### Code Quality Requirements

**TypeScript:**
- ✅ **NEVER use `any`** - Always use explicit types
- ✅ Use `interface` for object types
- ✅ Use Zod for runtime validation
- ✅ Enable strict mode

**React:**
- ✅ Functional components only (NO class components)
- ✅ Server Components by default
- ✅ Client Components only when needed ('use client')
- ✅ Custom hooks for reusable logic
- ✅ Proper memoization (memo, useMemo, useCallback)

**Security:**
- ✅ ALWAYS validate user input with Zod
- ✅ ALWAYS use parameterized queries (Supabase handles this)
- ✅ NEVER expose sensitive data in errors
- ✅ ALWAYS check authentication on protected routes

**Testing:**
- ✅ 80%+ test coverage required
- ✅ Test all props, states, user interactions
- ✅ Test error cases and edge cases
- ✅ Co-locate tests with components

**Naming Conventions:**
- Components: `PascalCase` (e.g., `UserProfile.tsx`)
- Functions: `camelCase` (e.g., `getUserData`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `API_BASE_URL`)
- Database tables: `snake_case` (e.g., `user_profiles`)
- Files: Match component name or kebab-case for utilities

### File Organization

```typescript
// ✅ GOOD: Component structure
interface UserProfileProps {
  user: User;
  onUpdate: (data: Partial<User>) => Promise<void>;
}

export function UserProfile({ user, onUpdate }: UserProfileProps) {
  // 1. Hooks
  const { user: currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  // 2. Effects
  useEffect(() => {
    // Side effects
  }, [user]);

  // 3. Event Handlers
  const handleSubmit = async (e: React.FormEvent) => {
    // Handler logic
  };

  // 4. Computed Values
  const canEdit = currentUser?.id === user.id;

  // 5. Early Returns
  if (!user) return <div>User not found</div>;

  // 6. Main Render
  return <div>{/* JSX */}</div>;
}
```

---

## 🧪 Testing Requirements

### Test Every Component

```typescript
// Example test structure
describe('ComponentName', () => {
  beforeEach(() => {
    // Setup
  });

  afterEach(() => {
    // Cleanup
  });

  it('renders with valid props', () => {
    // Test rendering
  });

  it('handles user interaction', () => {
    // Test events
  });

  it('validates input correctly', () => {
    // Test validation
  });

  it('handles errors gracefully', () => {
    // Test error states
  });
});
```

### Run Tests Before Committing

```bash
pnpm test              # All tests must pass
pnpm lint              # No linting errors
pnpm type-check        # No TypeScript errors
pnpm build             # Build must succeed
```

---

## 🚨 Critical Security Requirements

### Input Validation (ALWAYS)

```typescript
// ✅ GOOD: Validate with Zod
import { z } from 'zod';

const grantSchema = z.object({
  title: z.string().min(3).max(200),
  amount: z.number().positive().max(10_000_000),
  deadline: z.date().min(new Date()),
});

const result = grantSchema.safeParse(userInput);
if (!result.success) {
  return { error: result.error.format() };
}
```

### Authentication Checks (ALWAYS)

```typescript
// ✅ GOOD: Check auth on API routes
export async function GET(request: Request) {
  const supabase = createServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Continue with authorized logic
}
```

### Database Queries (ALWAYS use Supabase)

```typescript
// ✅ GOOD: Supabase parameterized queries + RLS
const { data, error } = await supabase
  .from('grants')
  .select('*')
  .eq('organization_id', orgId);  // RLS handles this automatically

// ❌ NEVER build SQL strings manually
// const query = `SELECT * FROM grants WHERE org_id = '${orgId}'`; // DON'T DO THIS
```

---

## 📝 Git Workflow

### Branch Naming

```bash
# Feature branches
git checkout -b feature/monorepo-setup
git checkout -b feature/ui-package-extraction
git checkout -b feature/auth-package

# Bug fixes
git checkout -b fix/button-styling
git checkout -b fix/auth-redirect

# Documentation
git checkout -b docs/update-readme
```

### Commit Messages

```bash
# Good commit messages
git commit -m "feat: initialize monorepo with pnpm workspaces"
git commit -m "feat(ui): extract Button component from CapacityIQ"
git commit -m "test(ui): add Button component tests"
git commit -m "fix(auth): resolve session timeout issue"
git commit -m "docs: update component extraction guide"

# Include Claude Code attribution
git commit -m "feat: initialize monorepo structure

Set up pnpm workspaces, Turborepo pipeline, and shared configs.

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## ✅ Week 1 Success Criteria

Before moving to Week 2, verify:

**Monorepo:**
- [ ] pnpm-workspace.yaml configured
- [ ] Turborepo pipeline working
- [ ] Shared configs in place (TS, ESLint, Prettier)
- [ ] `pnpm install` runs without errors

**@vision/ui Package:**
- [ ] 20+ components extracted
- [ ] Mantine theme configured
- [ ] Storybook running with all component stories
- [ ] Tests passing (80%+ coverage)
- [ ] Package builds successfully

**@vision/auth Package:**
- [ ] useAuth hook working
- [ ] AuthProvider context created
- [ ] Session management implemented
- [ ] Tests passing

**@vision/database Package:**
- [ ] Supabase client factory created
- [ ] React Query hooks implemented
- [ ] TypeScript types generated
- [ ] Tests passing

**Quality Gates:**
- [ ] All tests passing (`pnpm test`)
- [ ] No linting errors (`pnpm lint`)
- [ ] No TypeScript errors (`pnpm type-check`)
- [ ] All packages build (`pnpm build`)
- [ ] Git commits follow convention
- [ ] Code reviewed (if team member available)

---

## 🆘 When You Need Help

### Documentation to Reference

1. **Component extraction issues?**
   → [component-extraction-guide.md](docs/features/implementation/component-extraction-guide.md)

2. **Security questions?**
   → [security-guidelines.md](docs/features/best-practices/security-guidelines.md)

3. **Testing questions?**
   → [testing-framework.md](docs/features/best-practices/testing-framework.md)

4. **Code standards unclear?**
   → [development-standards.md](docs/features/best-practices/development-standards.md)

5. **Architecture questions?**
   → [platform-architecture.md](docs/features/architecture/platform-architecture.md)

### Common Issues

**Issue:** TypeScript errors in shared packages
**Solution:** Check tsconfig.json paths are correct, ensure packages are built before consuming

**Issue:** Mantine theme not applying
**Solution:** Verify MantineProvider wraps your app, check theme import path

**Issue:** Tests failing with import errors
**Solution:** Check vitest.config.ts has correct path aliases

**Issue:** pnpm install fails
**Solution:** Delete node_modules and pnpm-lock.yaml, reinstall

---

## 🎯 Your Immediate Action Plan

### Step 1: Environment Setup (30 minutes)
1. Verify Node.js 20 LTS installed
2. Install pnpm 8.15+ globally
3. Clone repository (or initialize new one)
4. Read [START_HERE.md](START_HERE.md)

### Step 2: Documentation Review (1 hour)
1. Read [CONSOLIDATED_DEVELOPMENT_PLAN.md - Week 1](CONSOLIDATED_DEVELOPMENT_PLAN.md#week-1)
2. Skim [development-standards.md](docs/features/best-practices/development-standards.md)
3. Skim [component-extraction-guide.md](docs/features/implementation/component-extraction-guide.md)

### Step 3: Begin Implementation (Remaining time)
1. Start with Day 1-2 tasks (monorepo setup)
2. Move to Day 3-4 tasks (UI package)
3. Complete Day 5 tasks (auth/database packages)
4. Run all quality checks
5. Commit and push changes

---

## 📊 Progress Tracking

### Week 1 Checklist

**Day 1-2: Monorepo Setup**
- [ ] Directory structure created
- [ ] pnpm-workspace.yaml configured
- [ ] Turborepo pipeline set up
- [ ] Shared configs created
- [ ] Quality checks passing

**Day 3-4: UI Package**
- [ ] Package structure created
- [ ] 20+ components extracted
- [ ] Mantine theme configured
- [ ] Storybook set up
- [ ] Tests written and passing

**Day 5: Auth & Database Packages**
- [ ] @vision/auth created
- [ ] @vision/database created
- [ ] Hooks implemented
- [ ] Tests passing

**Final Verification:**
- [ ] All Week 1 success criteria met
- [ ] Documentation updated
- [ ] Code committed with proper messages
- [ ] Ready for Week 2

---

## 🚀 Let's Begin!

You now have everything you need to start Week 1 implementation:

✅ **Complete context** on the project
✅ **Detailed tasks** for Week 1
✅ **Code examples** and patterns
✅ **Quality standards** to follow
✅ **Testing requirements** defined
✅ **Success criteria** established

**Your first command:**
```bash
mkdir -p packages/{ui,database,auth,ai-functions,config}
mkdir -p apps/{platform-shell,capacity-assessment}
pnpm init
```

**Remember:**
- Follow development standards strictly
- Test everything (80%+ coverage)
- Validate all user input
- Use TypeScript types (never `any`)
- Commit frequently with good messages

**You've got this! Start building the VISION Platform. 🚀**

---

**Questions?** Reference the documentation linked throughout this prompt.

**Stuck?** Review the common issues section above.

**Need architecture guidance?** See [platform-architecture.md](docs/features/architecture/platform-architecture.md)

---

```
┌─────────────────────────────────────────────────────────────┐
│           AI DEVELOPMENT AGENT - WEEK 1 START               │
│           Task: Monorepo Setup & Shared Packages            │
│           Status: Ready to Begin                            │
│           Documentation: Complete                           │
│           Let's Build! 🚀                                   │
└─────────────────────────────────────────────────────────────┘
```

**Last Updated:** November 12, 2025
**Agent Version:** 1.0
**Week:** 1 of 16
