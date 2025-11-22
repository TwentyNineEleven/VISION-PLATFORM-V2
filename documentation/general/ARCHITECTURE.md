# System Architecture
# VISION Platform V2

**Last Updated:** 2025-11-19
**Version:** 2.0 - Clean Architecture Guide

---

## Overview

VISION Platform is a multi-tenant SaaS platform architected as a monorepo containing multiple specialized applications that share common infrastructure, data, and AI capabilities. Think of it as "Microsoft 365 for Nonprofits" - a unified suite where each app serves a specific purpose while seamlessly integrating with others.

**Core Architectural Principles:**
1. **Multi-Tenant by Design:** Complete data isolation between organizations
2. **Shared Infrastructure:** All apps use common authentication, database, AI, and document services
3. **Cross-App Integration:** Data flows between apps seamlessly
4. **AI-Native:** Intelligent assistance embedded throughout
5. **Security First:** Row Level Security, audit logging, encryption by default

---

## High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          VISION Platform                             │
│                       (Vercel Deployment)                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  │
│  │  Platform Shell  │  │   Application   │  │   Application    │  │
│  │  (App Launcher)  │  │      #1          │  │      #2          │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘  │
│                                                                       │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  │
│  │   Application    │  │   Application    │  │   Application    │  │
│  │      #3          │  │      #4          │  │      #5          │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘  │
│                                                                       │
│  ├─────────────────────  Shared Packages  ─────────────────────────┤
│                                                                       │
│  ┌──────────┐  ┌───────────┐  ┌────────────┐  ┌──────────────┐    │
│  │    UI    │  │  Database │  │  Documents │  │ AI Functions │    │
│  │ Components│  │  Client   │  │ Management │  │   (Claude)   │    │
│  └──────────┘  └───────────┘  └────────────┘  └──────────────┘    │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        Supabase Backend                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌───────────────────────────────────────────────────────────┐     │
│  │              PostgreSQL Database (Multi-Tenant)            │     │
│  │  - Row Level Security (RLS) for data isolation            │     │
│  │  - pg_vector for AI embeddings                            │     │
│  │  - Full-text search                                        │     │
│  └───────────────────────────────────────────────────────────┘     │
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐     │
│  │ Supabase Auth│  │ Storage      │  │ Edge Functions       │     │
│  │ (JWT + RLS)  │  │ (Documents)  │  │ (AI Integration)     │     │
│  └──────────────┘  └──────────────┘  └──────────────────────┘     │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │              Realtime (WebSocket Subscriptions)             │    │
│  │  - Live data updates                                         │    │
│  │  - Collaborative editing                                     │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      External Services                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │ Claude API   │  │ OpenAI API   │  │ Ollama (Local)│             │
│  │ (Primary AI) │  │ (Embeddings) │  │ (Fallback)    │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │ Sentry       │  │ PostHog      │  │ Resend (Email)│             │
│  │ (Errors)     │  │ (Analytics)  │  │               │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Frontend Architecture

### Monorepo Structure

```
vision-platform/
├── apps/                          # Individual Next.js applications
│   ├── platform-shell/            # Main launcher and shared layout
│   └── [application-directories]  # Individual app implementations
│
├── packages/                      # Shared packages
│   ├── ui/                        # Component library
│   ├── database/                  # Supabase client + hooks
│   ├── documents/                 # Document management
│   ├── ai-functions/              # AI utilities
│   ├── auth/                      # Authentication
│   ├── utils/                     # Shared utilities
│   └── config/                    # Shared configs (ESLint, TS, etc.)
│
├── supabase/                      # Backend
│   ├── functions/                 # Edge Functions
│   ├── migrations/                # Database migrations
│   └── seed/                      # Seed data
│
├── documentation/                 # Documentation
├── .claude/                       # Claude Code configuration
├── .github/                       # CI/CD workflows
└── scripts/                       # Build and deployment scripts
```

### Next.js App Router Pattern

Each app in `apps/` is a standalone Next.js 14 application using App Router:

```typescript
// Example: apps/[app-name]/src/app/layout.tsx
import { PlatformLayout } from '@vision/ui/layouts'
import { SupabaseProvider } from '@vision/database'

export default function AppLayout({
  children
}: {
  children: React.Node
}) {
  return (
    <SupabaseProvider>
      <PlatformLayout appName="[App Name]">
        {children}
      </PlatformLayout>
    </SupabaseProvider>
  )
}
```

### State Management Strategy

- **Global State:** Zustand stores in shared packages
- **Server State:** TanStack Query for data fetching
- **Local State:** React useState for component-level state
- **Form State:** React Hook Form
- **Real-Time State:** Supabase Realtime subscriptions

**Example Store Structure:**

```typescript
// packages/auth/src/stores/auth-store.ts
import { create } from 'zustand'

interface AuthState {
  user: User | null
  organization: Organization | null
  setUser: (user: User | null) => void
  setOrganization: (org: Organization | null) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  organization: null,
  setUser: (user) => set({ user }),
  setOrganization: (organization) => set({ organization }),
}))
```

### Component Library Architecture

```
packages/ui/
├── src/
│   ├── components/
│   │   ├── forms/            # Form components (Input, Select, etc.)
│   │   ├── layouts/          # Layout components
│   │   ├── data-display/     # Tables, Charts, Cards
│   │   ├── navigation/       # Nav, Breadcrumbs, Tabs
│   │   ├── feedback/         # Alerts, Modals, Toast
│   │   └── nonprofit-specific/ # Nonprofit UI patterns
│   ├── styles/               # Global styles, themes
│   ├── hooks/                # Shared React hooks
│   └── utils/                # UI utilities
```

---

## Backend Architecture

### Multi-Tenancy Model

**Approach:** Shared schema with `org_id` column

**Why not separate schemas per tenant?**
- Easier maintenance (single schema)
- Simpler deployments
- Cost-effective
- Sufficient for target scale

**Data Isolation:** Row Level Security (RLS)

**Example RLS Policy:**

```sql
-- Ensure users only see their organization's data
CREATE POLICY "Users can only see their organization's data"
ON [table_name]
FOR SELECT
USING (org_id = auth.organization_id());

-- Function to get current user's organization
CREATE FUNCTION auth.organization_id()
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT org_id FROM user_organizations
  WHERE user_id = auth.uid()
  LIMIT 1;
$$;
```

### Database Schema (High-Level Pattern)

**Core Multi-Tenant Tables:**

```sql
-- Multi-tenancy foundation
organizations (id, name, settings, created_at)
users (id, email, created_at)
user_organizations (user_id, org_id, role)

-- Shared infrastructure
documents (id, org_id, name, content, embeddings)
ai_usage (id, org_id, model, tokens, cost)

-- Application tables follow pattern:
-- [app_name]_[entity] (id, org_id, ..., created_at, updated_at)
```

**Key Principles:**
- Every tenant-specific table MUST have `org_id`
- All RLS policies MUST filter by `org_id`
- Foreign keys enforce referential integrity
- Strategic indexes on `org_id` + query columns

### Edge Functions Architecture

**Location:** `supabase/functions/`

**Key Functions Pattern:**

1. **ai-assistant/** - AI content generation
2. **document-analyzer/** - Document embeddings and search
3. **report-generator/** - Automated report generation
4. **[app]-processor/** - App-specific business logic

**Example Edge Function:**

```typescript
// supabase/functions/ai-assistant/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Anthropic from 'https://esm.sh/@anthropic-ai/sdk'

serve(async (req) => {
  const { prompt, context, org_id } = await req.json()

  // Initialize clients
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const anthropic = new Anthropic({
    apiKey: Deno.env.get('ANTHROPIC_API_KEY')!,
  })

  // Track usage
  const startTime = Date.now()

  // Call Claude API
  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
    system: context,
  })

  const tokens = message.usage.input_tokens + message.usage.output_tokens
  const cost = calculateCost(tokens, 'claude-3-5-sonnet')

  // Log usage
  await supabase.from('ai_usage').insert({
    org_id,
    model: 'claude-3-5-sonnet',
    tokens,
    cost,
    duration_ms: Date.now() - startTime,
  })

  return new Response(JSON.stringify({
    content: message.content[0].text,
    tokens,
    cost,
  }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
```

---

## Data Flow Architecture

### Example: Cross-App Data Flow

```
1. User opens Application A
   ↓
2. Selects "Generate Content"
   ↓
3. Application queries database for:
   - Organization profile
   - Related data from other apps (via shared views)
   - Previous documents
   ↓
4. Sends to AI Edge Function with context
   ↓
5. Claude API generates content
   ↓
6. AI Edge Function:
   - Tracks token usage and cost
   - Stores result in database
   - Creates document with embeddings
   ↓
7. User sees real-time generation
   ↓
8. User edits and refines
   ↓
9. Saves final content
   ↓
10. Available in centralized document library
```

### Real-Time Collaboration Flow

```
User A makes edit in document
   ↓
Frontend sends mutation to Supabase
   ↓
Database updates document row
   ↓
Supabase Realtime broadcasts change
   ↓
User B receives update via WebSocket
   ↓
User B's UI updates in real-time
```

---

## Cross-App Integration Architecture

### Shared Data Model

Apps don't directly access each other's tables. Instead, they use **shared views and integration tables.**

**Example Integration Pattern:**

```sql
-- Shared view for organization profile (used by all apps)
CREATE VIEW organization_profiles AS
SELECT
  o.id,
  o.name,
  o.mission,
  -- Aggregated data from various apps via lateral joins
  ...
FROM organizations o
-- Join with app-specific data as needed
```

**Integration Principles:**
- Use database views for cross-app data access
- Never direct table access between apps
- Event-driven updates for data synchronization
- Shared document library for common resources

---

## Security Architecture

### Authentication Flow

```
1. User visits platform → Redirected to login
   ↓
2. Enters credentials → Supabase Auth validates
   ↓
3. Supabase Auth generates JWT token
   ↓
4. Token stored in httpOnly cookie
   ↓
5. Every request includes JWT → RLS policies check org_id
   ↓
6. Database only returns data for user's organization
```

### Authorization Layers

1. **Network Layer:** HTTPS only, CORS configured
2. **Authentication Layer:** JWT validation
3. **Application Layer:** Role-based access control (RBAC)
4. **Database Layer:** Row Level Security (RLS)
5. **Audit Layer:** All actions logged

---

## AI Integration Architecture

### AI Request Flow

```typescript
// Frontend component
import { useAI } from '@vision/ai-functions'

function ContentGenerator() {
  const { generateContent, isLoading, cost } = useAI()

  const handleGenerate = async () => {
    const result = await generateContent({
      type: 'content-type',
      context: {
        // Context data
      },
      model: 'claude-3-5-sonnet',
    })

    setContent(result.content)
    showCostAlert(result.cost)
  }

  return (
    <div>
      <Button onClick={handleGenerate} disabled={isLoading}>
        Generate Content
      </Button>
      {cost && <CostDisplay cost={cost} />}
    </div>
  )
}
```

### AI Cost Management

```typescript
// AI usage limits pattern
const AI_LIMITS = {
  daily_tokens: 100_000,      // Per organization
  monthly_budget: 100,        // USD
  max_request_tokens: 10_000, // Single request
}

// Check before AI request
async function checkAIBudget(org_id: string, estimated_tokens: number) {
  const usage = await supabase
    .from('ai_usage')
    .select('tokens, cost')
    .eq('org_id', org_id)
    .gte('created_at', startOfDay(new Date()))
    .sum('tokens')

  if (usage.total + estimated_tokens > AI_LIMITS.daily_tokens) {
    throw new Error('Daily AI budget exceeded. Try again tomorrow or upgrade your plan.')
  }
}
```

---

## Performance Optimization Strategies

1. **Code Splitting:** Each app lazily loaded
2. **Server Components:** Reduce client-side JavaScript
3. **Database Indexing:** Strategic indexes on all foreign keys
4. **Caching:**
   - TanStack Query for data caching
   - Next.js built-in caching
   - CDN caching for static assets
5. **Image Optimization:** Next.js Image component
6. **Bundle Size:** Tree-shaking, dynamic imports

---

## Deployment Architecture

```
GitHub Repository (main branch)
   ↓
GitHub Actions CI/CD
   ↓
   ├─→ Run tests, linting, type-check
   ├─→ Run security scans
   ├─→ Build all apps (Turborepo)
   └─→ Deploy to Vercel
        ↓
Vercel Edge Network (Global CDN)
   ↓
Users worldwide access with low latency
```

---

## Scalability Considerations

### Initial Architecture: Small Scale
- Single Supabase instance
- Shared database
- Single region deployment
- Cost-effective for early growth

### Mid-Scale Growth
- Add database read replicas
- Implement Redis caching layer
- Multi-region edge functions
- Enhanced monitoring

### Large-Scale Operations
- Consider database sharding by organization
- Multi-region database
- Dedicated AI service tier
- Advanced CDN configuration

---

## Key Architectural Decisions

1. **Monorepo:** Enables code sharing, atomic changes
2. **Multi-Tenant Shared Schema:** Cost-effective, simpler than separate DBs
3. **Row Level Security:** Database-level isolation, security by default
4. **Edge Functions:** Serverless scaling, cost-effective
5. **Next.js App Router:** Modern patterns, excellent performance
6. **Claude API Primary:** Best for content generation
7. **Supabase over Firebase:** Open-source, cost-effective, powerful queries

---

**Last Updated:** 2025-11-19
**Version:** 2.0 - Clean Architecture Guide
**For:** VISION Platform V2 Fresh Build
