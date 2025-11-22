# Documentation Templates

**Purpose:** Standard templates for creating consistent documentation across VISION Platform
**Last Updated:** November 13, 2025

---

## 📋 Template Index

1. [Feature README Template](#feature-readme-template)
2. [Feature REQUIREMENTS Template](#feature-requirements-template)
3. [Feature IMPLEMENTATION Template](#feature-implementation-template)
4. [API Route Documentation Template](#api-route-documentation-template)
5. [Component Documentation Template](#component-documentation-template)
6. [Database Schema Template](#database-schema-template)
7. [Testing Documentation Template](#testing-documentation-template)

---

## Feature README Template

**File:** `{feature-name}/README.md`

```markdown
# {Feature Name}

**Purpose:** [One sentence describing what this feature does]
**Last Updated:** YYYY-MM-DD
**Owner:** [Team/Person]
**Status:** Draft | In Progress | Complete | Deprecated

---

## Overview

[2-3 paragraphs explaining:
- What this feature is
- Why it exists
- How it fits into the platform]

---

## Key Capabilities

- **Capability 1:** Brief description
- **Capability 2:** Brief description
- **Capability 3:** Brief description

---

## User Stories

**As a [user type], I want to [action] so that [benefit].**

Example user stories:
1. As a nonprofit user, I want to receive notifications when proposals are created so that I stay informed
2. As an admin, I want to manage team permissions so that I can control access

---

## Technical Overview

### Components
- Component 1 - Description
- Component 2 - Description

### API Endpoints
- `GET /api/{resource}` - Description
- `POST /api/{resource}` - Description

### Database Tables
- `table_name` - Description

---

## Architecture Diagram

```
[Include ASCII diagram or link to image]

┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│  API Route  │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│  Database   │
└─────────────┘
```

---

## Dependencies

**Required:**
- Dependency 1 - Why needed
- Dependency 2 - Why needed

**Optional:**
- Optional dependency - What it enables

---

## Security Considerations

- Security concern 1 and how it's addressed
- Security concern 2 and how it's addressed

---

## Performance Considerations

- Performance target 1
- Performance target 2
- Optimization strategy

---

## Related Documentation

- [REQUIREMENTS.md](REQUIREMENTS.md) - Detailed requirements
- [IMPLEMENTATION.md](IMPLEMENTATION.md) - Implementation guide
- [Related Feature 1](../related-feature/README.md)
- [Related Feature 2](../related-feature-2/README.md)

---

## Quick Links

- **Codebase:** `apps/{app-name}/src/...` or `packages/{package}/src/...`
- **API Routes:** `apps/platform-shell/src/app/api/{resource}/`
- **Components:** `packages/ui/src/components/{feature}/`
- **Tests:** `{location}/__tests__/`

---

**Next Steps:**
1. Read [REQUIREMENTS.md](REQUIREMENTS.md) for detailed specifications
2. Review [IMPLEMENTATION.md](IMPLEMENTATION.md) for building this feature
3. Check related features for integration points
```

---

## Feature REQUIREMENTS Template

**File:** `{feature-name}/REQUIREMENTS.md`

```markdown
# {Feature Name} - Requirements

**Purpose:** Complete specification of what needs to be built
**Last Updated:** YYYY-MM-DD
**Owner:** [Team/Person]
**Status:** Draft | Active | Implemented

---

## Executive Summary

[1-2 paragraphs summarizing:
- What this feature does
- Why it's needed
- Key success metrics]

---

## User Requirements

### Primary Users
- **User Type 1:** Description and needs
- **User Type 2:** Description and needs

### User Stories

**Epic:** [Epic name]

**User Stories:**
1. **As a [user]**, I want to [action] so that [benefit]
   - **Acceptance Criteria:**
     - [ ] Criterion 1
     - [ ] Criterion 2
     - [ ] Criterion 3

2. **As a [user]**, I want to [action] so that [benefit]
   - **Acceptance Criteria:**
     - [ ] Criterion 1
     - [ ] Criterion 2

---

## Functional Requirements

### Core Features

#### Feature 1: {Name}
**Description:** What it does

**Requirements:**
- [ ] REQ-F1.1: Specific requirement
- [ ] REQ-F1.2: Specific requirement
- [ ] REQ-F1.3: Specific requirement

**Business Rules:**
- Rule 1
- Rule 2

#### Feature 2: {Name}
**Description:** What it does

**Requirements:**
- [ ] REQ-F2.1: Specific requirement
- [ ] REQ-F2.2: Specific requirement

---

## Technical Requirements

### Frontend Requirements

**UI Components:**
- [ ] Component 1 with variants (primary, secondary, etc.)
- [ ] Component 2 with states (loading, error, success)
- [ ] Component 3

**State Management:**
- [ ] Global state: List what needs to be in global state
- [ ] Local state: What stays local
- [ ] Server state: What comes from API

**Routing:**
- [ ] `/route-1` - Description
- [ ] `/route-2` - Description

### Backend Requirements

**API Endpoints:**

**1. GET /api/{resource}**
- **Purpose:** Fetch resources
- **Auth Required:** Yes/No
- **Query Params:**
  - `param1` (optional): Description
  - `param2` (required): Description
- **Response:**
  ```typescript
  {
    success: boolean;
    data: Resource[];
    pagination?: {
      page: number;
      total: number;
    };
  }
  ```
- **Error Codes:**
  - 401: Unauthorized
  - 404: Not found
  - 500: Server error

**2. POST /api/{resource}**
- **Purpose:** Create resource
- **Auth Required:** Yes/No
- **Request Body:**
  ```typescript
  {
    field1: string;
    field2: number;
  }
  ```
- **Response:** [Response structure]
- **Validation:** Zod schema

### Database Requirements

**Tables:**

**1. `table_name`**
```sql
CREATE TABLE table_name (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  field1 TEXT NOT NULL,
  field2 INTEGER,
  organization_id UUID NOT NULL REFERENCES organizations(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Indexes:**
- `idx_table_org` on `organization_id`
- `idx_table_created` on `created_at DESC`

**RLS Policies:**
```sql
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own org data"
ON table_name FOR SELECT
USING (organization_id = auth.organization_id());
```

---

## Non-Functional Requirements

### Performance
- [ ] Page load time < 2 seconds
- [ ] API response time < 500ms
- [ ] Database query time < 100ms
- [ ] Support 1000 concurrent users

### Security
- [ ] Authentication required on all protected routes
- [ ] Input validation with Zod
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (sanitize outputs)
- [ ] CSRF protection
- [ ] RLS policies enforce multi-tenant isolation

### Accessibility
- [ ] WCAG 2.1 AA compliance
- [ ] Keyboard navigation
- [ ] Screen reader support
- [ ] Color contrast ≥ 4.5:1
- [ ] ARIA labels on interactive elements

### Responsive Design
- [ ] Mobile (375px - 767px)
- [ ] Tablet (768px - 1023px)
- [ ] Desktop (1024px+)

### Testing
- [ ] Unit tests (80%+ coverage)
- [ ] Integration tests (critical paths)
- [ ] E2E tests (user workflows)
- [ ] RLS policy tests

---

## Data Requirements

### Data Model

**Entity:** ResourceName
```typescript
interface Resource {
  id: string;
  name: string;
  description: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Data Validation

**Validation Schema:**
```typescript
import { z } from 'zod';

const resourceSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
});
```

### Data Migration
- [ ] Existing data migration plan (if applicable)
- [ ] Data backup strategy
- [ ] Rollback procedure

---

## Integration Requirements

### Internal Integrations
- **Feature A:** How it integrates
- **Feature B:** What data is shared

### External Integrations
- **Service A:** Purpose and integration points
- **Service B:** Purpose and integration points

### Event Bus Integration

**Events Published:**
- `resource.created` - When resource is created
  ```typescript
  {
    resource_id: string;
    resource_name: string;
    organization_id: string;
  }
  ```

**Events Subscribed:**
- `other.event` - What happens when received

---

## Success Metrics

### KPIs
- Metric 1: Target value
- Metric 2: Target value
- Metric 3: Target value

### User Adoption
- [ ] X% of users use feature within 7 days
- [ ] X% of users return weekly
- [ ] NPS score ≥ 50

### Technical Metrics
- [ ] API success rate ≥ 99.9%
- [ ] Error rate < 0.1%
- [ ] P95 response time < 1s

---

## Dependencies

### Before This Feature
Must have:
- Dependency 1
- Dependency 2

### Blocks These Features
This feature enables:
- Future Feature 1
- Future Feature 2

---

## Assumptions & Constraints

### Assumptions
- Assumption 1
- Assumption 2

### Constraints
- Constraint 1
- Constraint 2

### Risks
- Risk 1 and mitigation
- Risk 2 and mitigation

---

## Out of Scope

Explicitly not included in this feature:
- Item 1
- Item 2
- Item 3

---

## Open Questions

- [ ] Question 1?
- [ ] Question 2?

---

## Approval

- [ ] Product Manager: [Name]
- [ ] Tech Lead: [Name]
- [ ] Security Review: [Name]
- [ ] UX Review: [Name]

---

## Related Documentation

- [README.md](README.md) - Feature overview
- [IMPLEMENTATION.md](IMPLEMENTATION.md) - How to build this
- [../related-feature/REQUIREMENTS.md](../related-feature/REQUIREMENTS.md)

---

**Next Steps:**
1. Review and approve requirements
2. Estimate implementation effort
3. Create implementation plan
4. Begin development following [IMPLEMENTATION.md](IMPLEMENTATION.md)
```

---

## Feature IMPLEMENTATION Template

**File:** `{feature-name}/IMPLEMENTATION.md`

```markdown
# {Feature Name} - Implementation Guide

**Purpose:** Step-by-step guide to building this feature
**Last Updated:** YYYY-MM-DD
**Owner:** [Team/Person]
**Status:** Draft | In Progress | Complete

---

## Prerequisites

**Before starting, ensure you have:**
- [ ] Read [README.md](README.md) - Feature overview
- [ ] Read [REQUIREMENTS.md](REQUIREMENTS.md) - Complete requirements
- [ ] Development environment set up
- [ ] All dependencies installed
- [ ] Database migrations applied
- [ ] Related features completed (if any)

---

## Implementation Overview

**Estimated Time:** X days/weeks

**Implementation Order:**
1. Database schema (Day 1)
2. API routes (Day 2)
3. Frontend components (Day 3-4)
4. Integration & testing (Day 5)

---

## Step 1: Database Schema

### Create Migration

**File:** `supabase/migrations/YYYYMMDD_{feature_name}.sql`

```sql
-- Feature: {Feature Name}
-- Description: [Brief description]

-- Create table
CREATE TABLE IF NOT EXISTS public.{table_name} (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  field1 TEXT NOT NULL,
  field2 INTEGER,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_{table}_org ON {table_name}(organization_id);
CREATE INDEX idx_{table}_created ON {table_name}(created_at DESC);

-- Enable RLS
ALTER TABLE public.{table_name} ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users see own org data"
ON public.{table_name} FOR SELECT
USING (
  organization_id IN (
    SELECT organization_id
    FROM organization_members
    WHERE user_id = auth.uid() AND status = 'active'
  )
);

CREATE POLICY "Users can insert own org data"
ON public.{table_name} FOR INSERT
WITH CHECK (
  organization_id IN (
    SELECT organization_id
    FROM organization_members
    WHERE user_id = auth.uid() AND status = 'active'
  )
);

-- Triggers
CREATE TRIGGER update_{table}_updated_at
  BEFORE UPDATE ON public.{table_name}
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### Apply Migration

```bash
# Apply migration
pnpm supabase db reset

# Generate TypeScript types
pnpm db:types

# Verify migration
psql -h localhost -p 54322 -U postgres -d postgres -c "\d public.{table_name}"
```

### Test RLS Policies

```sql
-- Test: User can only see own org data
BEGIN;
  SET LOCAL ROLE authenticated;
  SET LOCAL request.jwt.claims = '{"sub": "user-1", "org_id": "org-1"}';

  SELECT * FROM {table_name} WHERE organization_id = 'org-2';
  -- Should return 0 rows
ROLLBACK;
```

**Deliverable:** ✅ Migration applied, types generated, RLS tested

---

## Step 2: API Routes

### Create API Route

**File:** `apps/platform-shell/src/app/api/{resource}/route.ts`

```typescript
import { createServerClient } from '@vision/database';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema
const createResourceSchema = z.object({
  field1: z.string().min(2).max(100),
  field2: z.number().int().positive().optional(),
});

// GET - List resources
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();

    // 1. Authenticate
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Get organization
    const orgId = request.headers.get('x-organization-id');
    if (!orgId) {
      return NextResponse.json({ error: 'Organization required' }, { status: 400 });
    }

    // 3. Parse query params
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '20', 10);

    // 4. Query database (RLS handles filtering)
    const { data, error, count } = await supabase
      .from('{table_name}')
      .select('*', { count: 'exact' })
      .eq('organization_id', orgId)
      .order('created_at', { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (error) {
      console.error('Query error:', error);
      return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }

    // 5. Return response
    return NextResponse.json({
      data: data || [],
      pagination: {
        page,
        pageSize,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize),
      },
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create resource
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();

    // 1. Authenticate
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Get organization
    const orgId = request.headers.get('x-organization-id');
    if (!orgId) {
      return NextResponse.json({ error: 'Organization required' }, { status: 400 });
    }

    // 3. Validate request body
    const body = await request.json();
    const validation = createResourceSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.format() },
        { status: 400 }
      );
    }

    // 4. Insert into database
    const { data, error } = await supabase
      .from('{table_name}')
      .insert({
        ...validation.data,
        organization_id: orgId,
      })
      .select()
      .single();

    if (error) {
      console.error('Insert error:', error);
      return NextResponse.json({ error: 'Failed to create resource' }, { status: 500 });
    }

    // 5. Publish event (optional)
    const { getEventBus } = await import('@vision/events');
    const eventBus = getEventBus();
    await eventBus.publish('resource.created', 'app-name', {
      resource_id: data.id,
      resource_name: data.field1,
      organization_id: orgId,
    });

    // 6. Return response
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

### Test API Routes

```bash
# Test GET endpoint
curl -X GET http://localhost:3000/api/{resource} \
  -H "x-organization-id: org-123"

# Test POST endpoint
curl -X POST http://localhost:3000/api/{resource} \
  -H "Content-Type: application/json" \
  -H "x-organization-id: org-123" \
  -d '{"field1":"test","field2":123}'
```

**Deliverable:** ✅ API routes created and tested

---

## Step 3: Frontend Components

### Create Main Component

**File:** `apps/platform-shell/src/app/{route}/page.tsx`

```typescript
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container, Stack, Title, Text, Button, Loader, Center
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useOrganization } from '@/providers';
import { DESIGN_TOKENS } from '@vision/ui';

interface Resource {
  id: string;
  field1: string;
  field2: number;
  organization_id: string;
  created_at: string;
  updated_at: string;
}

export default function ResourcePage() {
  const router = useRouter();
  const { activeOrganization } = useOrganization();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch resources
  const fetchResources = useCallback(async () => {
    if (!activeOrganization?.id) return;

    setLoading(true);
    try {
      const response = await fetch('/api/{resource}', {
        headers: {
          'x-organization-id': activeOrganization.id,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch');

      const data = await response.json();
      setResources(data.data || []);
    } catch (error) {
      console.error('Fetch error:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to load data',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  }, [activeOrganization?.id]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  if (loading) {
    return (
      <Center mih={400}>
        <Loader size="lg" />
      </Center>
    );
  }

  return (
    <Container size={DESIGN_TOKENS.layout.maxWidth.xl} py={DESIGN_TOKENS.spacing.section}>
      <Stack gap="xl">
        <div>
          <Title order={1} size={DESIGN_TOKENS.typography.pageTitle.size}>
            Resource Page
          </Title>
          <Text c="dimmed" mt="xs">
            Feature description
          </Text>
        </div>

        {/* Add your UI components here */}
      </Stack>
    </Container>
  );
}
```

### Create Subcomponents

**File:** `apps/platform-shell/src/components/{feature}/ComponentName.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Button, TextInput, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { z } from 'zod';
import { DESIGN_TOKENS } from '@vision/ui';

const formSchema = z.object({
  field1: z.string().min(2, 'Required'),
});

interface ComponentProps {
  onSubmit: (data: any) => Promise<void>;
}

export function ComponentName({ onSubmit }: ComponentProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      field1: '',
    },
    validate: zodResolver(formSchema),
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    try {
      await onSubmit(values);
      form.reset();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="md">
        <TextInput
          label="Field 1"
          placeholder="Enter value"
          required
          size={DESIGN_TOKENS.forms.defaultSize}
          {...form.getInputProps('field1')}
        />

        <Button
          type="submit"
          loading={loading}
          size="md"
        >
          Submit
        </Button>
      </Stack>
    </form>
  );
}
```

**Deliverable:** ✅ Frontend components created

---

## Step 4: Integration & Testing

### Unit Tests

**File:** `apps/platform-shell/src/components/{feature}/ComponentName.test.tsx`

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  it('renders correctly', () => {
    const mockOnSubmit = vi.fn();
    render(<ComponentName onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText('Field 1')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    const mockOnSubmit = vi.fn();
    render(<ComponentName onSubmit={mockOnSubmit} />);

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  it('calls onSubmit with valid data', async () => {
    const mockOnSubmit = vi.fn();
    render(<ComponentName onSubmit={mockOnSubmit} />);

    fireEvent.change(screen.getByLabelText('Field 1'), {
      target: { value: 'test value' },
    });
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({ field1: 'test value' });
    });
  });
});
```

### Integration Tests

**File:** `apps/platform-shell/tests/e2e/{feature}.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test('user can create resource', async ({ page }) => {
  // Login
  await page.goto('/login');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'password');
  await page.click('button[type="submit"]');

  // Navigate to feature
  await page.goto('/{route}');

  // Fill form
  await page.fill('[name="field1"]', 'Test Resource');
  await page.click('text=Submit');

  // Verify success
  await expect(page.locator('text=Resource created')).toBeVisible();
});
```

### Run Tests

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Coverage
pnpm test:coverage
```

**Deliverable:** ✅ Tests written and passing

---

## Step 5: Event Bus Integration (Optional)

### Publish Events

```typescript
// In API route or component
import { getEventBus } from '@vision/events';

const eventBus = getEventBus();
await eventBus.publish('resource.created', 'app-name', {
  resource_id: data.id,
  resource_name: data.name,
  organization_id: orgId,
});
```

### Subscribe to Events

```typescript
// In component
import { useEffect } from 'react';
import { getEventBus } from '@vision/events';
import { notifications } from '@mantine/notifications';

useEffect(() => {
  const eventBus = getEventBus();

  const unsubscribe = eventBus.subscribe('resource.created', (event) => {
    notifications.show({
      title: 'Resource Created',
      message: event.data.resource_name,
      color: 'green',
    });
  });

  return () => unsubscribe();
}, []);
```

**Deliverable:** ✅ Event integration complete

---

## Step 6: Documentation

### Update Documentation

- [ ] Update [README.md](README.md) with any changes
- [ ] Update [REQUIREMENTS.md](REQUIREMENTS.md) if requirements changed
- [ ] Document any API changes
- [ ] Add inline code comments for complex logic
- [ ] Update related feature docs

**Deliverable:** ✅ Documentation updated

---

## Deployment Checklist

**Before deploying to production:**

- [ ] All tests pass
- [ ] Code review complete
- [ ] RLS policies tested
- [ ] Multi-tenant isolation verified
- [ ] API routes have error handling
- [ ] Input validation in place
- [ ] Accessibility tested (WCAG 2.1 AA)
- [ ] Responsive design tested (mobile, tablet, desktop)
- [ ] Performance tested (load times, query times)
- [ ] Migration backed up
- [ ] Rollback plan documented
- [ ] Monitoring/logging configured
- [ ] Documentation complete

---

## Troubleshooting

### Common Issues

**Issue 1: RLS policies blocking queries**
- **Symptom:** Queries return empty results
- **Solution:** Check organization_id matches, verify RLS policies
- **Test:**
  ```sql
  SELECT * FROM {table} WHERE organization_id = 'test-org-id';
  ```

**Issue 2: TypeScript type errors**
- **Symptom:** Type errors after migration
- **Solution:** Regenerate types with `pnpm db:types`

**Issue 3: API route returning 401**
- **Symptom:** Authentication failing
- **Solution:** Check middleware configuration, verify session

---

## Related Documentation

- [README.md](README.md) - Feature overview
- [REQUIREMENTS.md](REQUIREMENTS.md) - Complete requirements
- [../../general/CODE_STANDARDS.md](../../general/CODE_STANDARDS.md) - Coding standards
- [../../general/TESTING.md](../../general/TESTING.md) - Testing strategy

---

**Completion Criteria:**

✅ Database migration applied
✅ API routes created and tested
✅ Frontend components built
✅ Unit tests passing (80%+ coverage)
✅ Integration tests passing
✅ RLS policies verified
✅ Multi-tenant isolation tested
✅ Documentation updated
✅ Code reviewed
✅ Deployed to production

---

**Implementation complete!** 🎉
```

---

## Additional Templates

### API Route Documentation Template
### Component Documentation Template
### Database Schema Template
### Testing Documentation Template

[Continue with additional templates as needed...]

---

**Use these templates to create consistent, comprehensive documentation across the VISION Platform.**
