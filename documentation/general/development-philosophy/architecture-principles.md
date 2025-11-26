# Architecture Principles

**Core architectural decisions and patterns that guide CapacityIQ development.**

---

## Guiding Principles

### 1. Separation of Concerns
**Principle:** Each module should have a single, well-defined responsibility.

**Application:**
- **Components:** Pure UI presentation
- **Hooks:** Reusable stateful logic
- **Services:** Business logic and API calls
- **Context:** Global state management
- **Utils:** Pure helper functions

**Example:**
```typescript
// ❌ BAD: Component doing too much
function AssessmentPage() {
  const [data, setData] = useState();
  useEffect(() => {
    fetch('/api/assessment').then(r => r.json()).then(setData);
  }, []);
  // ... complex business logic
}

// ✅ GOOD: Separated concerns
function AssessmentPage() {
  const { data, isLoading } = useAssessment(); // Hook handles data
  const { calculate} = useAssessmentScoring(); // Service handles logic
  
  if (isLoading) return <Skeleton />;
  return <AssessmentView data={data} />;
}
```

---

### 2. Composition Over Inheritance
**Principle:** Build complex functionality by combining simple pieces.

**Application:**
- Use React composition patterns
- Favor hooks over HOCs
- Small, focused components
- Reusable utility functions

**Example:**
```typescript
// ✅ GOOD: Composition with hooks
function AssessmentDashboard() {
  const { assessment } = useAssessment();
  const { scores } = useAssessmentScores(assessment.id);
  const { plan } = useDevelopmentPlan(assessment.id);
  
  return (
    <>
      <ScoreCard scores={scores} />
      <PlanSummary plan={plan} />
    </>
  );
}
```

---

### 3. Progressive Enhancement
**Principle:** Start with core functionality, add enhancements layer by layer.

**Application:**
```typescript
// Base functionality
function AssessmentList({ assessments }) {
  return <div>{assessments.map(a => <Card key={a.id} {...a} />)}</div>;
}

// Enhanced with loading states
function AssessmentList({ assessments, isLoading }) {
  if (isLoading) return <Skeleton count={3} />;
  return <div>{assessments.map(a => <Card key={a.id} {...a} />)}</div>;
}

// Enhanced with error handling
function AssessmentList({ assessments, isLoading, error }) {
  if (error) return <ErrorState error={error} />;
  if (isLoading) return <Skeleton count={3} />;
  if (assessments.length === 0) return <EmptyState />;
  return <div>{assessments.map(a => <Card key={a.id} {...a} />)}</div>;
}
```

---

### 4. Fail Fast & Explicit
**Principle:** Detect errors early, make failures obvious.

**Application:**
```typescript
// Environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
if (!supabaseUrl) {
  throw new Error('VITE_SUPABASE_URL is required');
}

// Type guards
function assertNonNull<T>(value: T | null | undefined): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error('Unexpected null or undefined');
  }
}

// Zod validation
const assessmentSchema = z.object({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
  answers: z.record(z.unknown()),
});

const validated = assessmentSchema.parse(data); // Throws on invalid data
```

---

### 5. Security by Default
**Principle:** Security is not optional, it's built-in.

**Application:**
- **Row-Level Security (RLS)** on every table
- **JWT authentication** required for API calls
- **Validation** at every boundary
- **Audit logging** for sensitive operations
- **Principle of least privilege** everywhere

**Example RLS Policy:**
```sql
-- Users can only see their own organization's assessments
CREATE POLICY "Users can view own org assessments"
  ON assessments FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );
```

---

### 6. Performance by Design
**Principle:** Performance is a feature, not an afterthought.

**Application:**
- **Code splitting** by route
- **Lazy loading** for heavy components
- **React Query caching** for API data
- **Memoization** for expensive calculations
- **Database indexes** on foreign keys
- **Materialized views** for analytics

**Example:**
```typescript
// Lazy loading routes
const AssessmentPage = lazy(() => 
  import('./pages/assessment/AssessmentPage')
);

// Memoized calculations
const domainAverages = useMemo(() => 
  calculateDomainAverages(scores), 
  [scores]
);

// React Query caching
const { data } = useQuery({
  queryKey: ['assessment', id],
  queryFn: () => fetchAssessment(id),
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

---

### 7. Accessibility First
**Principle:** Accessible UI is not extra work, it's the only way.

**Application:**
- **Semantic HTML** everywhere
- **ARIA labels** on interactive elements
- **Keyboard navigation** fully supported
- **Focus management** in modals and menus
- **Color contrast** WCAG AA minimum
- **Screen reader testing** before release

**Example:**
```typescript
// ✅ GOOD: Accessible button
<button
  aria-label="Delete assessment"
  onClick={handleDelete}
>
  <TrashIcon aria-hidden="true" />
</button>

// ✅ GOOD: Accessible form
<label htmlFor="email">Email</label>
<input
  id="email"
  type="email"
  aria-describedby="email-error"
  aria-invalid={!!errors.email}
/>
{errors.email && (
  <div id="email-error" role="alert">
    {errors.email}
  </div>
)}
```

---

### 8. Convention Over Configuration
**Principle:** Sensible defaults reduce cognitive load.

**Application:**
- **File naming:** `ComponentName.tsx`, `useHookName.ts`
- **Folder structure:** Group by feature, not type
- **API routes:** RESTful conventions
- **Database naming:** `snake_case` for tables, `camelCase` in TypeScript

**Example:**
```
src/
├── features/
│   └── assessment/
│       ├── components/
│       │   ├── AssessmentCard.tsx
│       │   └── AssessmentList.tsx
│       ├── hooks/
│       │   ├── useAssessment.ts
│       │   └── useAssessmentScores.ts
│       ├── services/
│       │   └── assessmentService.ts
│       └── types.ts
```

---

### 9. Observable Systems
**Principle:** You can't fix what you can't see.

**Application:**
- **Error tracking** with Sentry
- **Performance monitoring** with Web Vitals
- **Audit logging** for data changes
- **Edge function logs** via Supabase
- **Usage analytics** with React GA4

**Example:**
```typescript
// Error boundaries
<Sentry.ErrorBoundary fallback={ErrorFallback}>
  <App />
</Sentry.ErrorBoundary>

// Audit logging
await supabase.from('audit_logs').insert({
  user_id: userId,
  action: 'assessment_deleted',
  resource_type: 'assessment',
  resource_id: assessmentId,
  metadata: { reason: deleteReason },
});
```

---

### 10. Testability Built-In
**Principle:** If it's hard to test, it's poorly designed.

**Application:**
- **Pure functions** wherever possible
- **Dependency injection** for services
- **Mocking boundaries** at API layer
- **Test data factories** for consistent fixtures

**Example:**
```typescript
// ✅ GOOD: Testable pure function
export function calculateDomainScore(
  answers: Record<string, number>,
  questionIds: string[]
): number {
  const values = questionIds
    .map(id => answers[id])
    .filter(v => v !== undefined);
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

// ✅ GOOD: Testable component with injected dependencies
export function AssessmentCard({ 
  assessment,
  onDelete = deleteAssessment // Dependency injection
}) {
  return (
    <Card>
      <Button onClick={() => onDelete(assessment.id)}>Delete</Button>
    </Card>
  );
}
```

---

## Architectural Patterns

### Frontend Architecture

```
┌─────────────────────────────────────────┐
│         Pages / Routes                   │
│  (Lazy loaded, route-level components)  │
└─────────────┬───────────────────────────┘
              │
┌─────────────▼───────────────────────────┐
│       Feature Modules                    │
│  (Domain-specific components & logic)    │
└─────────────┬───────────────────────────┘
              │
┌─────────────▼───────────────────────────┐
│     Custom Hooks (useXxx)                │
│  (Stateful logic, API calls via Query)   │
└─────────────┬───────────────────────────┘
              │
┌─────────────▼───────────────────────────┐
│         Services Layer                   │
│  (Business logic, Edge Function calls)   │
└─────────────┬───────────────────────────┘
              │
┌─────────────▼───────────────────────────┐
│      Supabase Client                     │
│  (Database queries, Auth, Storage)       │
└──────────────────────────────────────────┘
```

### Data Flow Pattern

```
User Action → Component → Hook → Service → Supabase → PostgreSQL
                  ↓         ↓        ↓         ↓
                Error  →  React   →  React  → Sentry
                         Query      Query
```

### State Management Strategy

```
┌────────────────────────────────────┐
│     Component Local State          │
│  (useState, useReducer for UI)     │
└────────────────────────────────────┘
              ↓
┌────────────────────────────────────┐
│     Server State (React Query)     │
│  (API data, caching, refetching)   │
└────────────────────────────────────┘
              ↓
┌────────────────────────────────────┐
│     Context (Global State)         │
│  (Auth, Org, Theme - read rarely)  │
└────────────────────────────────────┘
```

**Decision Rules:**
- **Component state:** UI-only (modals, forms, toggles)
- **React Query:** API data (assessments, scores, plans)
- **Context:** Global config (auth user, current org, theme)
- **Never mix:** Don't put server data in Context

---

### Backend Architecture

```
┌────────────────────────────────────┐
│      Frontend (React/Vite)         │
└───────────┬────────────────────────┘
            │
┌───────────▼────────────────────────┐
│   Supabase (PostgREST API)         │
│   • Auto-generated REST endpoints  │
│   • Row-Level Security enforced    │
└───────────┬────────────────────────┘
            │
┌───────────▼────────────────────────┐
│   PostgreSQL Database              │
│   • Tables with RLS policies       │
│   • Foreign keys & constraints     │
│   • Triggers & functions           │
└───────────┬────────────────────────┘
            │
┌───────────▼────────────────────────┐
│   Edge Functions (Deno)            │
│   • AI processing (Claude API)     │
│   • Complex calculations           │
│   • External integrations          │
└────────────────────────────────────┘
```

---

## Multi-Tenancy Pattern

**Principle:** Every resource belongs to an organization.

**Implementation:**
```sql
-- Every table has organization_id
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ...
);

-- RLS enforces organization isolation
CREATE POLICY "Users can only access own org data"
  ON assessments FOR ALL
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );
```

**Benefits:**
- Data isolation guaranteed by database
- No backend authorization code needed
- Performance optimized with indexes
- Audit trail built-in

---

## API Design Patterns

### Edge Functions Pattern

```typescript
// Standard edge function structure
Deno.serve(async (req: Request) => {
  // 1. CORS handling
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 2. Authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('Missing auth');

    // 3. Parse & validate input
    const body = await req.json();
    const validated = inputSchema.parse(body);

    // 4. Business logic
    const result = await processRequest(validated);

    // 5. Return response
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    // 6. Error handling
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});
```

---

## Error Handling Strategy

### Frontend Errors

```typescript
// 1. Error boundaries for UI crashes
<ErrorBoundary fallback={<ErrorPage />}>
  <App />
</ErrorBoundary>

// 2. React Query for API errors
const { data, error, isError } = useQuery({
  queryKey: ['assessment', id],
  queryFn: fetchAssessment,
  retry: 2,
});

if (isError) return <ErrorMessage error={error} />;

// 3. Form validation errors
const { errors } = useForm({ resolver: zodResolver(schema) });

// 4. Toast notifications for user actions
notifications.show({
  title: 'Error',
  message: 'Failed to save assessment',
  color: 'red',
});
```

### Backend Errors

```typescript
// 1. Typed errors
class AssessmentNotFoundError extends Error {
  statusCode = 404;
}

// 2. Error logging
console.error('[scoreAssessment] Error:', {
  error: error.message,
  assessmentId,
  userId,
  timestamp: new Date().toISOString(),
});

// 3. User-friendly responses
return new Response(
  JSON.stringify({
    error: 'Assessment not found',
    code: 'ASSESSMENT_NOT_FOUND',
  }),
  { status: 404 }
);
```

---

## Performance Patterns

### Code Splitting

```typescript
// Route-level splitting
const AssessmentPage = lazy(() => import('./pages/AssessmentPage'));

// Component-level splitting (for heavy components)
const ChartComponent = lazy(() => import('./components/Charts'));

// Vendor chunk splitting (vite.config.ts)
manualChunks: {
  'react-vendor': ['react', 'react-dom'],
  'ui-vendor': ['@mantine/core', '@mantine/hooks'],
  'data-vendor': ['@tanstack/react-query'],
}
```

### Caching Strategy

```typescript
// React Query cache
queryClient.setDefaultOptions({
  queries: {
    staleTime: 5 * 60 * 1000, // 5 min (how long data is "fresh")
    cacheTime: 10 * 60 * 1000, // 10 min (how long to keep in cache)
  },
});

// Browser cache (Vercel headers)
headers: [
  {
    source: '/assets/(.*)',
    headers: [
      { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
    ]
  }
]
```

---

## Database Design Patterns

### Naming Conventions
- **Tables:** `snake_case`, plural (e.g., `assessments`, `organization_members`)
- **Columns:** `snake_case` (e.g., `created_at`, `organization_id`)
- **Indexes:** `idx_table_column` (e.g., `idx_assessments_organization_id`)
- **Policies:** Descriptive names (e.g., `"Users can view own org assessments"`)

### Foreign Keys
```sql
-- Always use foreign keys with appropriate actions
organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE

-- Always index foreign keys
CREATE INDEX idx_assessments_organization_id ON assessments(organization_id);
```

### Timestamps
```sql
-- Every table has these
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()

-- Trigger to auto-update updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON assessments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## Security Patterns

### RLS Policy Template
```sql
-- Read access: Users in the organization
CREATE POLICY "org_read_policy"
  ON table_name FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

-- Write access: Owners and admins only
CREATE POLICY "org_write_policy"
  ON table_name FOR ALL
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members 
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );
```

### Input Validation
```typescript
// Always validate at boundaries
const createAssessmentSchema = z.object({
  organizationId: z.string().uuid(),
  name: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
});

// Validate before database insert
const validated = createAssessmentSchema.parse(input);
await supabase.from('assessments').insert(validated);
```

---

## Summary

These architectural principles ensure:

✅ **Maintainability** - Clear separation of concerns  
✅ **Scalability** - Performance and caching built-in  
✅ **Security** - RLS and validation everywhere  
✅ **Quality** - Testable, observable, accessible  
✅ **Developer Experience** - Conventions reduce cognitive load  

---

**Last Updated:** November 11, 2025

