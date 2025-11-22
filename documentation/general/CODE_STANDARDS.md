# VISION Platform - Code Standards
## Mandatory Standards for All Code

**Last Updated:** 2025-11-11
**Status:** MANDATORY - All code MUST comply
**Enforcement:** Pre-commit hooks, CI/CD checks, code review

---

## 🎯 Core Principles

1. **TypeScript Strict Mode** - NO exceptions, NO `any` types
2. **Functional Components Only** - NO class components
3. **Clear Over Clever** - Readable code beats clever code
4. **Test Everything** - 85%+ coverage on critical paths
5. **Security First** - RLS policies, input validation, auth checks

---

## 📝 TypeScript Standards

### Strict Mode Configuration (MANDATORY)

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### Type Rules

```typescript
// ✅ GOOD: Explicit types
interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  createdAt: Date;
}

function getUser(id: string): Promise<UserProfile> {
  return fetchUser(id);
}

// ❌ BAD: Using 'any'
function getUser(id: any): any {
  return fetchUser(id);
}

// ✅ GOOD: Type inference where obvious
const count = 0; // Type inferred as number
const users = ['Alice', 'Bob']; // Type inferred as string[]

// ❌ BAD: Over-explicit where unnecessary
const count: number = 0;
const users: string[] = ['Alice', 'Bob'];

// ✅ GOOD: Unknown for truly unknown types
function parseJSON(json: string): unknown {
  return JSON.parse(json);
}

// ❌ BAD: Any for unknown types
function parseJSON(json: string): any {
  return JSON.parse(json);
}
```

### Interface vs Type

```typescript
// ✅ GOOD: Use interface for objects
interface User {
  id: string;
  name: string;
}

// ✅ GOOD: Use type for unions, primitives, utilities
type Status = 'draft' | 'published' | 'archived';
type ID = string | number;
type Nullable<T> = T | null;

// ❌ BAD: Using type for simple objects (use interface)
type User = {
  id: string;
  name: string;
};
```

---

## ⚛️ React Standards

### Component Structure (MANDATORY)

```typescript
import { useState, useEffect } from 'react';
import { Box, Title, Text, Button } from '@mantine/core';
import { useAssessment } from '@/hooks/useAssessment';
import { formatDate } from '@/utils/date';
import type { Assessment } from '@/types/assessment';

/**
 * AssessmentCard displays a summary card for an assessment.
 *
 * @param assessment - The assessment data to display
 * @param onEdit - Callback when edit button is clicked
 * @param compact - Whether to show compact version
 *
 * @example
 * ```tsx
 * <AssessmentCard
 *   assessment={assessment}
 *   onEdit={(id) => navigate(`/assessments/${id}/edit`)}
 *   compact={false}
 * />
 * ```
 */
interface AssessmentCardProps {
  assessment: Assessment;
  onEdit?: (id: string) => void;
  compact?: boolean;
}

export function AssessmentCard({
  assessment,
  onEdit,
  compact = false,
}: AssessmentCardProps) {
  // 1. Hooks (in order: useState, useEffect, custom hooks)
  const [isHovered, setIsHovered] = useState(false);
  const { updateAssessment, isUpdating } = useAssessment(assessment.id);

  // 2. Derived state (computed values)
  const formattedDate = formatDate(assessment.createdAt);
  const isComplete = assessment.status === 'completed';
  const canEdit = onEdit !== undefined && !isUpdating;

  // 3. Effects
  useEffect(() => {
    // Track card view for analytics
    if (assessment.id) {
      analytics.trackCardView(assessment.id);
    }
  }, [assessment.id]);

  // 4. Event handlers (clear function names)
  const handleEdit = () => {
    if (canEdit) {
      onEdit(assessment.id);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // 5. Early returns / conditional rendering
  if (compact) {
    return <CompactCard assessment={assessment} />;
  }

  if (!assessment) {
    return null;
  }

  // 6. Main render
  return (
    <Card
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ opacity: isHovered ? 1 : 0.95 }}
    >
      <Title order={3}>{assessment.name}</Title>
      <Text c="dimmed">{formattedDate}</Text>
      {isComplete && <Badge color="green">Complete</Badge>}
      {isHovered && canEdit && (
        <Button onClick={handleEdit} loading={isUpdating}>
          Edit
        </Button>
      )}
    </Card>
  );
}
```

### Naming Conventions (STRICT)

```typescript
// ✅ Components: PascalCase
export function UserProfile() {}
export function AssessmentList() {}
export function GrantProposalEditor() {}

// ✅ Hooks: camelCase, starts with "use"
export function useAuth() {}
export function useAssessmentScores() {}
export function useOrganizationMembers() {}

// ✅ Utilities: camelCase
export function formatDate() {}
export function calculatePercentage() {}
export function validateEmail() {}

// ✅ Constants: UPPER_SNAKE_CASE
export const API_BASE_URL = 'https://api.example.com';
export const MAX_UPLOAD_SIZE = 10_000_000;
export const DEFAULT_PAGE_SIZE = 20;

// ✅ Types/Interfaces: PascalCase
export interface AssessmentData {}
export type UserRole = 'owner' | 'admin' | 'member' | 'viewer';

// ✅ Files: Match component name or kebab-case
// Components: UserProfile.tsx
// Hooks: use-assessment.ts or useAssessment.ts
// Utils: date-utils.ts or dateUtils.ts
```

### Functional Components Only

```typescript
// ✅ GOOD: Functional component
export function UserProfile({ userId }: { userId: string }) {
  const { user, isLoading } = useUser(userId);

  if (isLoading) return <Skeleton />;
  if (!user) return <NotFound />;

  return <div>{user.name}</div>;
}

// ❌ BAD: Class component (NEVER USE)
export class UserProfile extends React.Component {
  render() {
    return <div>{this.props.user.name}</div>;
  }
}
```

### Custom Hooks Pattern

```typescript
/**
 * useAssessment - Manages assessment data and mutations
 *
 * @param assessmentId - ID of assessment to load
 * @returns Assessment data, loading state, and mutation functions
 */
export function useAssessment(assessmentId: string) {
  const queryClient = useQueryClient();

  // Query for data
  const {
    data: assessment,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['assessments', assessmentId],
    queryFn: () => getAssessment(assessmentId),
    enabled: !!assessmentId,
  });

  // Mutation for updates
  const { mutate: updateAssessment, isPending: isUpdating } = useMutation({
    mutationFn: (data: Partial<Assessment>) =>
      updateAssessmentData(assessmentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessments', assessmentId] });
    },
  });

  // Mutation for deletion
  const { mutate: deleteAssessment, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteAssessmentData(assessmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
    },
  });

  return {
    assessment,
    isLoading,
    error,
    updateAssessment,
    isUpdating,
    deleteAssessment,
    isDeleting,
  };
}
```

---

## 🗄️ Database Standards

### SQL Naming Conventions

```sql
-- ✅ Tables: snake_case, plural
CREATE TABLE organizations (...);
CREATE TABLE grant_proposals (...);
CREATE TABLE assessment_responses (...);

-- ✅ Columns: snake_case
CREATE TABLE users (
  id UUID,
  display_name TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);

-- ✅ Indexes: idx_table_column
CREATE INDEX idx_organizations_slug ON organizations(slug);
CREATE INDEX idx_grants_organization_id ON grants(organization_id);

-- ✅ Functions: snake_case
CREATE FUNCTION update_updated_at_column() ...;
CREATE FUNCTION calculate_assessment_score() ...;

-- ✅ Policies: descriptive with quotes
CREATE POLICY "Users can view own org data" ON grants ...;
CREATE POLICY "Admins can update all data" ON grants ...;
```

### Table Pattern (MANDATORY)

```sql
CREATE TABLE table_name (
  -- Primary Key (REQUIRED)
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Multi-tenancy (REQUIRED for all non-system tables)
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,

  -- Audit fields (REQUIRED)
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),

  -- Table-specific fields
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL CHECK (status IN ('draft', 'active', 'archived')),

  -- Constraints
  CONSTRAINT valid_name CHECK (char_length(name) >= 1 AND char_length(name) <= 255)
);

-- Indexes (ALWAYS index foreign keys)
CREATE INDEX idx_table_name_organization_id ON table_name(organization_id);
CREATE INDEX idx_table_name_created_by ON table_name(created_by);
CREATE INDEX idx_table_name_status ON table_name(status);

-- Auto-update updated_at (REQUIRED)
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON table_name
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row-Level Security (REQUIRED)
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

-- RLS Policies (REQUIRED)
CREATE POLICY "Users can view own org data"
  ON table_name FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own org data"
  ON table_name FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin', 'member')
    )
  );

CREATE POLICY "Users can update own org data"
  ON table_name FOR UPDATE
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin', 'member')
    )
  );

CREATE POLICY "Admins can delete org data"
  ON table_name FOR DELETE
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin')
    )
  );
```

---

## 🔒 Security Standards (NON-NEGOTIABLE)

### Input Validation (MANDATORY)

```typescript
import { z } from 'zod';

// ✅ GOOD: Validate all user input with Zod
const createGrantSchema = z.object({
  title: z.string().min(3).max(200),
  funder_name: z.string().min(2).max(100),
  amount: z.number().positive().max(10_000_000),
  deadline: z.date().min(new Date()),
  description: z.string().max(5000).optional(),
});

export async function createGrant(input: unknown) {
  // Validate input
  const result = createGrantSchema.safeParse(input);

  if (!result.success) {
    return {
      error: 'Invalid input',
      details: result.error.format(),
    };
  }

  // Proceed with validated data
  const grant = await db.grants.create(result.data);
  return { success: true, data: grant };
}

// ❌ BAD: No validation
export async function createGrant(input: any) {
  const grant = await db.grants.create(input); // Dangerous!
  return grant;
}
```

### Authentication Checks (MANDATORY)

```typescript
// ✅ GOOD: Always check authentication
export async function getAssessment(id: string) {
  const supabase = createServerClient();

  // Check authentication
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('Unauthorized');
  }

  // Query with RLS enforcement
  const { data, error } = await supabase
    .from('assessments')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

// ❌ BAD: No auth check
export async function getAssessment(id: string) {
  const { data } = await supabase.from('assessments').select('*').eq('id', id).single();
  return data;
}
```

### SQL Injection Prevention

```typescript
// ✅ GOOD: Parameterized queries (Supabase does this automatically)
const { data } = await supabase
  .from('grants')
  .select('*')
  .eq('organization_id', orgId)
  .eq('status', status);

// ❌ BAD: String concatenation (NEVER DO THIS)
const query = `SELECT * FROM grants WHERE org_id = '${orgId}'`; // SQL injection risk!
```

### Error Handling (MANDATORY)

```typescript
// ✅ GOOD: Safe error messages
try {
  const result = await processData(input);
  return { success: true, data: result };
} catch (error) {
  // Log full error internally
  logger.error('Data processing failed', {
    error,
    userId: user.id,
    timestamp: new Date(),
  });

  // Return safe message to user
  return {
    success: false,
    error: 'Unable to process your request. Please try again.',
  };
}

// ❌ BAD: Exposing internal errors
try {
  const result = await processData(input);
  return result;
} catch (error) {
  return { error: error.message }; // May expose sensitive info!
}
```

---

## 🧪 Testing Standards

### Test Coverage Requirements

- **Critical paths:** 95%+ coverage
- **Business logic:** 90%+ coverage
- **UI components:** 80%+ coverage
- **Utilities:** 100% coverage

### Test File Organization

```
src/
├── components/
│   ├── AssessmentCard.tsx
│   └── AssessmentCard.test.tsx     # Co-located test
├── hooks/
│   ├── useAssessment.ts
│   └── useAssessment.test.ts       # Co-located test
└── utils/
    ├── date.ts
    └── date.test.ts                # Co-located test
```

### Test Structure

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AssessmentCard } from './AssessmentCard';

describe('AssessmentCard', () => {
  const mockAssessment = {
    id: '123',
    name: 'Test Assessment',
    status: 'completed' as const,
    createdAt: new Date('2024-01-01'),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders assessment name', () => {
    render(<AssessmentCard assessment={mockAssessment} />);
    expect(screen.getByText('Test Assessment')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', async () => {
    const handleEdit = vi.fn();
    const user = userEvent.setup();

    render(<AssessmentCard assessment={mockAssessment} onEdit={handleEdit} />);

    const editButton = screen.getByRole('button', { name: /edit/i });
    await user.click(editButton);

    expect(handleEdit).toHaveBeenCalledWith('123');
  });

  it('shows compact version when compact prop is true', () => {
    const { container } = render(
      <AssessmentCard assessment={mockAssessment} compact={true} />
    );
    expect(container.firstChild).toHaveClass('compact');
  });
});
```

---

## 📐 File & Folder Organization

### Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/             # React components
│   ├── ui/                # Reusable UI components
│   ├── forms/             # Form components
│   ├── layouts/           # Layout components
│   └── features/          # Feature-specific components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
│   ├── supabase/         # Supabase client config
│   ├── claude/           # Claude API integration
│   └── utils/            # General utilities
├── types/                 # TypeScript type definitions
├── constants/             # Application constants
└── styles/               # Global styles
```

### Import Order

```typescript
// 1. React and framework imports
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// 2. External library imports
import { Box, Title, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';

// 3. Internal absolute imports (using alias)
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';

// 4. Relative imports
import { AssessmentCard } from './AssessmentCard';
import { formatDate } from '../utils/date';

// 5. Type imports (at the end)
import type { Assessment } from '@/types/assessment';
import type { User } from '@/types/user';
```

---

## ✅ Pre-Commit Checklist

Before committing code, ensure:

- [ ] TypeScript strict mode passes with zero errors
- [ ] ESLint passes with zero warnings
- [ ] Prettier has formatted all files
- [ ] All tests pass
- [ ] Test coverage meets minimum requirements (85%+)
- [ ] No `console.log` statements in production code
- [ ] No `any` types used
- [ ] All functions have TSDoc comments
- [ ] All database migrations include RLS policies
- [ ] All user inputs are validated with Zod
- [ ] All API endpoints check authentication

---

## 🚫 Common Anti-Patterns to Avoid

### ❌ Using `any`
```typescript
// BAD
function process(data: any): any { }

// GOOD
function process(data: AssessmentData): ProcessedResult { }
```

### ❌ Class Components
```typescript
// BAD
class MyComponent extends React.Component { }

// GOOD
function MyComponent() { }
```

### ❌ Inline Styles
```typescript
// BAD
<div style={{ color: 'red', fontSize: '16px' }}>Text</div>

// GOOD
<Text c="red" size="md">Text</Text>
```

### ❌ Large Components
```typescript
// BAD: 500+ line component

// GOOD: Extract to smaller components
function LargeFeature() {
  return (
    <>
      <FeatureHeader />
      <FeatureContent />
      <FeatureFooter />
    </>
  );
}
```

### ❌ Hard-coded Values
```typescript
// BAD
if (user.role === 'admin') { }

// GOOD
const ROLES = {
  ADMIN: 'admin',
  MEMBER: 'member',
} as const;

if (user.role === ROLES.ADMIN) { }
```

---

## 📚 Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Supabase Best Practices](https://supabase.com/docs/guides/database/best-practices)
- [Zod Documentation](https://zod.dev/)

---

**These standards are MANDATORY for all code in the VISION Platform. Code that doesn't meet these standards will not be merged.**

**Last Updated:** 2025-11-11
**Enforcement:** Pre-commit hooks, CI/CD, code review
