# Performance Optimization Guide

**Version:** 1.0
**Last Updated:** November 12, 2025
**Owner:** Platform Engineering Team

---

## 📊 Performance Targets

### Core Web Vitals Targets

| Metric | Target | Maximum | Measurement |
|--------|--------|---------|-------------|
| **LCP** (Largest Contentful Paint) | < 1.5s | < 2.5s | Time to render largest content element |
| **FID** (First Input Delay) | < 50ms | < 100ms | Time to first user interaction response |
| **CLS** (Cumulative Layout Shift) | < 0.05 | < 0.1 | Visual stability score |
| **TTFB** (Time to First Byte) | < 400ms | < 800ms | Server response time |
| **FCP** (First Contentful Paint) | < 1.0s | < 1.8s | Time to first visible content |
| **TTI** (Time to Interactive) | < 2.5s | < 3.8s | Time until page fully interactive |

### Application-Specific Targets

| Operation | Target | Maximum | Notes |
|-----------|--------|---------|-------|
| Page navigation | < 500ms | < 1000ms | Client-side navigation |
| Database query | < 100ms | < 300ms | 95th percentile |
| API response | < 200ms | < 500ms | 95th percentile |
| AI content generation | < 3s | < 8s | Claude API latency |
| Document upload | < 2s | < 5s | Per 10MB file |
| Real-time updates | < 100ms | < 500ms | WebSocket latency |

---

## 🎯 Frontend Performance Optimization

### 1. Next.js App Router Optimization

#### Server Components (Default)

```typescript
// ✅ GOOD: Server Component for static content
export default async function GrantsListPage() {
  // Fetches data on server, NO client-side JS sent
  const grants = await getGrants();

  return (
    <div>
      <h1>Grants</h1>
      <GrantsList grants={grants} />
    </div>
  );
}
```

#### Client Components (Only When Needed)

```typescript
// ✅ GOOD: Client Component only for interactive parts
'use client';

import { useState } from 'react';
import { Button } from '@vision/ui';

export function GrantFilterPanel() {
  const [filters, setFilters] = useState({});

  // Interactive client-side logic
  return (
    <div>
      <Button onClick={() => setFilters({...})}>
        Apply Filters
      </Button>
    </div>
  );
}
```

#### Strategic Component Splitting

```typescript
// ✅ GOOD: Split interactive parts into separate Client Components
export default async function GrantDetailPage({ params }: { params: { id: string } }) {
  // Server Component - No JS sent to client
  const grant = await getGrant(params.id);

  return (
    <div>
      {/* Server-rendered static content */}
      <GrantHeader grant={grant} />
      <GrantDescription grant={grant} />

      {/* Client Component ONLY for interactive features */}
      <GrantActionButtons grantId={grant.id} />
    </div>
  );
}
```

### 2. Code Splitting & Lazy Loading

#### Dynamic Imports for Large Components

```typescript
// ✅ GOOD: Lazy load heavy components
import dynamic from 'next/dynamic';

// Load editor only when needed (saves 500KB initial bundle)
const GrantProposalEditor = dynamic(
  () => import('@/components/grants/GrantProposalEditor'),
  {
    loading: () => <EditorSkeleton />,
    ssr: false, // Don't render on server if not needed
  }
);

export function GrantEditPage() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div>
      <Button onClick={() => setIsEditing(true)}>Edit</Button>
      {isEditing && <GrantProposalEditor />}
    </div>
  );
}
```

#### Route-Based Code Splitting

```typescript
// Next.js automatically splits by route
// app/grants/page.tsx       → grants.js
// app/assessments/page.tsx  → assessments.js
// app/documents/page.tsx    → documents.js

// Each route bundle loads ONLY when accessed
```

#### Component-Level Code Splitting

```typescript
// ✅ GOOD: Split large dependency imports
const Chart = dynamic(() => import('recharts').then(mod => mod.LineChart), {
  loading: () => <ChartSkeleton />,
});

const RichTextEditor = dynamic(() => import('@tiptap/react'), {
  loading: () => <EditorSkeleton />,
  ssr: false,
});
```

### 3. Image Optimization

#### Next.js Image Component

```typescript
import Image from 'next/image';

// ✅ GOOD: Automatic optimization with Next.js Image
export function OrganizationLogo({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={200}
      height={100}
      priority={false}  // Set true only for above-the-fold images
      quality={85}      // Balance quality vs. size (default: 75)
      placeholder="blur" // Show blur while loading
      blurDataURL={`data:image/svg+xml;base64,...`}
      sizes="(max-width: 768px) 100vw, 200px"
    />
  );
}
```

#### Image Loading Strategies

```typescript
// ✅ Priority images (above the fold)
<Image src={heroImage} alt="Hero" priority />

// ✅ Lazy load images (below the fold)
<Image src={thumbnail} alt="Thumbnail" loading="lazy" />

// ✅ Responsive images with sizes
<Image
  src={banner}
  alt="Banner"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  fill
/>
```

#### Supabase Storage Image Optimization

```typescript
// ✅ GOOD: Use Supabase image transformation
export function getOptimizedImageUrl(path: string, width: number, height: number) {
  const { data } = supabase.storage
    .from('documents')
    .getPublicUrl(path, {
      transform: {
        width,
        height,
        resize: 'cover',
        quality: 85,
        format: 'webp', // Modern format
      }
    });

  return data.publicUrl;
}
```

### 4. Font Optimization

#### Next.js Font Optimization

```typescript
// app/layout.tsx
import { Inter, Roboto_Mono } from 'next/font/google';

// ✅ GOOD: Self-hosted fonts with automatic optimization
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',       // Prevent invisible text during load
  variable: '--font-inter',
  preload: true,         // Preload in <head>
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
  preload: false,        // Only preload critical fonts
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
```

### 5. React Performance Patterns

#### Memoization Strategy

```typescript
import { memo, useMemo, useCallback } from 'react';

// ✅ GOOD: Memoize expensive computations
function AssessmentResults({ assessmentId }: { assessmentId: string }) {
  const { data: assessment } = useQuery(['assessment', assessmentId]);

  // Memoize expensive calculation
  const performanceScore = useMemo(() => {
    if (!assessment?.responses) return 0;

    // Expensive computation only runs when responses change
    return calculateComplexScore(assessment.responses);
  }, [assessment?.responses]);

  // Memoize callback to prevent re-renders
  const handleExport = useCallback(async () => {
    await exportAssessment(assessmentId, performanceScore);
  }, [assessmentId, performanceScore]);

  return (
    <div>
      <h2>Score: {performanceScore}</h2>
      <Button onClick={handleExport}>Export</Button>
    </div>
  );
}
```

#### Component Memoization

```typescript
// ✅ GOOD: Memo wrapper for expensive components
export const GrantCard = memo(function GrantCard({ grant }: { grant: Grant }) {
  return (
    <Card>
      <h3>{grant.title}</h3>
      <p>{grant.description}</p>
      <GrantStatusBadge status={grant.status} />
    </Card>
  );
}, (prevProps, nextProps) => {
  // Custom comparison - only re-render if grant data changes
  return prevProps.grant.id === nextProps.grant.id &&
         prevProps.grant.updated_at === nextProps.grant.updated_at;
});
```

#### Virtualization for Long Lists

```typescript
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

// ✅ GOOD: Virtualize long lists (1000+ items)
export function DocumentsList({ documents }: { documents: Document[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: documents.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80, // Estimated row height
    overscan: 5,            // Render 5 extra rows for smooth scrolling
  });

  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const document = documents[virtualRow.index];
          return (
            <div
              key={document.id}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <DocumentCard document={document} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

### 6. Bundle Size Optimization

#### Analyze Bundle Size

```bash
# Generate bundle analysis
ANALYZE=true pnpm build

# Check bundle sizes
pnpm next build --experimental-build-mode compile
```

#### Tree Shaking with Named Imports

```typescript
// ❌ BAD: Imports entire library
import _ from 'lodash';
const result = _.debounce(fn, 300);

// ✅ GOOD: Import only what you need
import debounce from 'lodash/debounce';
const result = debounce(fn, 300);

// ❌ BAD: Imports all icons
import * as Icons from 'lucide-react';

// ✅ GOOD: Import specific icons
import { FileText, Download, Share } from 'lucide-react';
```

#### Remove Unused Dependencies

```bash
# Find unused dependencies
pnpm dlx depcheck

# Remove unused packages
pnpm remove unused-package
```

---

## 🗄️ Database Performance Optimization

### 1. Query Optimization

#### Efficient Supabase Queries

```typescript
// ❌ BAD: Over-fetching data
const { data } = await supabase
  .from('grants')
  .select('*');  // Fetches all columns

// ✅ GOOD: Select only needed columns
const { data } = await supabase
  .from('grants')
  .select('id, title, status, deadline, amount_requested')
  .eq('organization_id', orgId)
  .order('created_at', { ascending: false })
  .limit(20);

// ✅ EXCELLENT: Use views for complex queries
const { data } = await supabase
  .from('grants_with_funding_view')  // Pre-computed view
  .select('*')
  .eq('organization_id', orgId);
```

#### Pagination for Large Datasets

```typescript
// ✅ GOOD: Cursor-based pagination
export async function getGrantsPaginated(
  orgId: string,
  cursor?: string,
  limit: number = 20
) {
  let query = supabase
    .from('grants')
    .select('id, title, status, created_at')
    .eq('organization_id', orgId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (cursor) {
    query = query.lt('created_at', cursor);
  }

  const { data, error } = await query;

  return {
    data,
    nextCursor: data?.[data.length - 1]?.created_at,
  };
}
```

#### Optimistic UI Updates

```typescript
// ✅ GOOD: Update UI immediately, sync in background
const updateGrantStatus = useMutation({
  mutationFn: async ({ grantId, status }: { grantId: string; status: string }) => {
    return await supabase
      .from('grants')
      .update({ status })
      .eq('id', grantId);
  },
  onMutate: async ({ grantId, status }) => {
    // Cancel ongoing queries
    await queryClient.cancelQueries(['grants']);

    // Snapshot current state
    const previousGrants = queryClient.getQueryData(['grants']);

    // Optimistically update UI
    queryClient.setQueryData(['grants'], (old: Grant[]) =>
      old.map(g => g.id === grantId ? { ...g, status } : g)
    );

    return { previousGrants };
  },
  onError: (err, variables, context) => {
    // Rollback on error
    queryClient.setQueryData(['grants'], context?.previousGrants);
  },
  onSettled: () => {
    // Refetch to sync with server
    queryClient.invalidateQueries(['grants']);
  },
});
```

### 2. Database Indexing

#### Essential Indexes

```sql
-- ✅ Organization isolation (most frequent query)
CREATE INDEX idx_grants_org_id ON grants(organization_id);
CREATE INDEX idx_documents_org_id ON documents(organization_id);
CREATE INDEX idx_assessments_org_id ON assessments(organization_id);

-- ✅ Common filter columns
CREATE INDEX idx_grants_status ON grants(status) WHERE status IS NOT NULL;
CREATE INDEX idx_grants_deadline ON grants(deadline) WHERE deadline IS NOT NULL;
CREATE INDEX idx_documents_created_at ON documents(created_at DESC);

-- ✅ Composite indexes for frequent query patterns
CREATE INDEX idx_grants_org_status ON grants(organization_id, status);
CREATE INDEX idx_documents_org_type ON documents(organization_id, document_type);

-- ✅ Full-text search
CREATE INDEX idx_grants_fts ON grants USING gin(to_tsvector('english', title || ' ' || description));
CREATE INDEX idx_documents_fts ON documents USING gin(to_tsvector('english', title || ' ' || content));
```

#### Index Monitoring

```sql
-- Check index usage
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan ASC;

-- Identify missing indexes
SELECT
  schemaname,
  tablename,
  seq_scan,
  seq_tup_read,
  idx_scan,
  idx_tup_fetch,
  seq_tup_read / seq_scan AS avg_seq_read
FROM pg_stat_user_tables
WHERE schemaname = 'public'
  AND seq_scan > 0
ORDER BY seq_tup_read DESC;
```

### 3. Connection Pooling

#### Supabase Pooler Configuration

```typescript
// ✅ GOOD: Use Supabase connection pooler for serverless
import { createClient } from '@supabase/supabase-js';

// Transaction mode for short-lived connections
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    db: {
      schema: 'public',
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// For long-running operations, use session pooling
// Configure in Supabase dashboard: Database → Connection Pooling
```

### 4. Caching Strategy

#### React Query Caching

```typescript
// ✅ GOOD: Configure cache times based on data volatility
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Rarely changing data (organization settings)
      staleTime: 5 * 60 * 1000,      // 5 minutes
      cacheTime: 10 * 60 * 1000,     // 10 minutes

      // Frequently changing data (grant status)
      // staleTime: 30 * 1000,        // 30 seconds
      // cacheTime: 5 * 60 * 1000,    // 5 minutes

      refetchOnWindowFocus: false,   // Disable auto-refetch
      retry: 1,                       // Retry failed queries once
    },
  },
});

// App-specific configurations
export function useGrants(orgId: string) {
  return useQuery({
    queryKey: ['grants', orgId],
    queryFn: () => getGrants(orgId),
    staleTime: 30 * 1000,            // Fresh for 30 seconds
    cacheTime: 5 * 60 * 1000,        // Keep in cache for 5 minutes
  });
}

export function useOrganizationSettings(orgId: string) {
  return useQuery({
    queryKey: ['organization', orgId, 'settings'],
    queryFn: () => getOrganizationSettings(orgId),
    staleTime: 10 * 60 * 1000,       // Fresh for 10 minutes
    cacheTime: 30 * 60 * 1000,       // Keep in cache for 30 minutes
  });
}
```

#### Database-Level Caching

```sql
-- ✅ GOOD: Materialized views for expensive queries
CREATE MATERIALIZED VIEW grants_summary_by_org AS
SELECT
  organization_id,
  COUNT(*) as total_grants,
  SUM(amount_requested) as total_requested,
  SUM(CASE WHEN status = 'awarded' THEN amount_awarded ELSE 0 END) as total_awarded,
  AVG(CASE WHEN status = 'awarded' THEN 1.0 ELSE 0.0 END) as success_rate
FROM grants
GROUP BY organization_id;

-- Refresh periodically (via cron or Edge Function)
REFRESH MATERIALIZED VIEW CONCURRENTLY grants_summary_by_org;

-- Create index on materialized view
CREATE UNIQUE INDEX idx_grants_summary_org ON grants_summary_by_org(organization_id);
```

---

## 🤖 AI Performance Optimization

### 1. Claude API Optimization

#### Prompt Caching

```typescript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ✅ GOOD: Use prompt caching for repeated context
export async function generateGrantProposal(
  organizationContext: string,
  grantOpportunity: string,
  userPrompt: string
) {
  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4096,
    system: [
      {
        type: 'text',
        text: organizationContext,  // Cached - 90% cost reduction
        cache_control: { type: 'ephemeral' },
      },
      {
        type: 'text',
        text: grantOpportunity,     // Cached - 90% cost reduction
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [
      {
        role: 'user',
        content: userPrompt,         // Not cached - changes every request
      },
    ],
  });

  return response.content[0].text;
}

// Cost savings:
// Without caching: 100K input tokens × $3/MTok = $0.30
// With caching: 10K new tokens × $3/MTok + 90K cached × $0.30/MTok = $0.03 + $0.027 = $0.057
// Savings: 81% reduction
```

#### Streaming Responses

```typescript
// ✅ GOOD: Stream responses for better UX
export async function* streamGrantProposal(prompt: string) {
  const stream = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4096,
    stream: true,
    messages: [{ role: 'user', content: prompt }],
  });

  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      yield event.delta.text;
    }
  }
}

// Usage in API route
export async function POST(request: Request) {
  const { prompt } = await request.json();

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of streamGrantProposal(prompt)) {
        controller.enqueue(encoder.encode(chunk));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
```

#### Batch Processing

```typescript
// ✅ GOOD: Batch multiple AI requests
export async function analyzeMultipleGrants(grants: Grant[]) {
  // Process in parallel with rate limiting
  const analysisPromises = grants.map(async (grant, index) => {
    // Stagger requests to avoid rate limits (50 requests/minute)
    await new Promise(resolve => setTimeout(resolve, index * 1200));

    return await analyzeGrant(grant);
  });

  return await Promise.all(analysisPromises);
}
```

### 2. Semantic Search Optimization

#### Vector Index Configuration

```sql
-- ✅ GOOD: Optimize pgvector for similarity search
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE document_embeddings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid REFERENCES documents(id) ON DELETE CASCADE,
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  chunk_index int NOT NULL,
  content text NOT NULL,
  embedding vector(1536) NOT NULL,  -- OpenAI ada-002 dimensions
  created_at timestamptz DEFAULT now()
);

-- Index for fast similarity search
CREATE INDEX idx_document_embeddings_vector
ON document_embeddings
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Composite index for organization isolation
CREATE INDEX idx_document_embeddings_org
ON document_embeddings(organization_id);

-- Enable RLS
ALTER TABLE document_embeddings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Organization isolation" ON document_embeddings
  FOR ALL USING (organization_id = (auth.jwt() ->> 'organization_id')::uuid);
```

#### Efficient Similarity Search

```typescript
// ✅ GOOD: Optimized vector search with filtering
export async function searchDocuments(
  query: string,
  orgId: string,
  limit: number = 10
) {
  // 1. Generate embedding for query (cache this if same query repeated)
  const embedding = await getEmbedding(query);

  // 2. Search with pre-filtering by organization
  const { data, error } = await supabase.rpc('search_documents', {
    query_embedding: embedding,
    match_threshold: 0.78,
    match_count: limit,
    filter_org_id: orgId,
  });

  return data;
}

-- Database function for optimized search
CREATE OR REPLACE FUNCTION search_documents(
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  filter_org_id uuid
)
RETURNS TABLE (
  document_id uuid,
  content text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    de.document_id,
    de.content,
    1 - (de.embedding <=> query_embedding) AS similarity
  FROM document_embeddings de
  WHERE de.organization_id = filter_org_id
    AND 1 - (de.embedding <=> query_embedding) > match_threshold
  ORDER BY de.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
```

---

## 🚀 Deployment & Infrastructure Optimization

### 1. Vercel Configuration

#### Next.js Config Optimization

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable unused features
  swcMinify: true,
  poweredByHeader: false,

  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    domains: [
      process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://', '') || '',
    ],
  },

  // Compression
  compress: true,

  // Experimental features
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks', 'lucide-react'],
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },

  // Headers for caching
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|avif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

### 2. CDN & Caching Strategy

#### Edge Caching Configuration

```typescript
// app/api/grants/[id]/route.ts
export const runtime = 'edge';  // Run on edge for faster response
export const revalidate = 300;  // Cache for 5 minutes

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const grant = await getGrant(params.id);

  return NextResponse.json(grant, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  });
}
```

### 3. Monitoring & Observability

#### Performance Monitoring Setup

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

#### Custom Performance Tracking

```typescript
// lib/monitoring.ts
export function trackPerformance(metricName: string, value: number) {
  // Track to your analytics service
  if (typeof window !== 'undefined' && 'performance' in window) {
    performance.mark(metricName);

    // Send to analytics
    fetch('/api/analytics/performance', {
      method: 'POST',
      body: JSON.stringify({
        metric: metricName,
        value,
        timestamp: Date.now(),
      }),
    });
  }
}

// Usage
export function usePerformanceTracking(operationName: string) {
  const startTime = useRef(Date.now());

  useEffect(() => {
    return () => {
      const duration = Date.now() - startTime.current;
      trackPerformance(operationName, duration);
    };
  }, [operationName]);
}
```

---

## 📊 Performance Testing

### 1. Lighthouse CI

```yaml
# .github/workflows/lighthouse-ci.yml
name: Lighthouse CI
on: [pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install && npm run build
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            http://localhost:3000/
            http://localhost:3000/grants
            http://localhost:3000/documents
          uploadArtifacts: true
          temporaryPublicStorage: true
```

### 2. Load Testing

```typescript
// tests/load/grants-api.test.ts
import autocannon from 'autocannon';

describe('Grants API Load Test', () => {
  it('handles 100 concurrent requests', async () => {
    const result = await autocannon({
      url: 'http://localhost:3000/api/grants',
      connections: 100,
      duration: 30,
      headers: {
        'Authorization': `Bearer ${testToken}`,
      },
    });

    expect(result.errors).toBe(0);
    expect(result.latency.p95).toBeLessThan(500);
    expect(result.latency.p99).toBeLessThan(1000);
  });
});
```

---

## 🎯 Performance Checklist

### Pre-Deployment Checklist

- [ ] **Core Web Vitals**
  - [ ] LCP < 2.5s
  - [ ] FID < 100ms
  - [ ] CLS < 0.1
  - [ ] TTFB < 800ms

- [ ] **Code Optimization**
  - [ ] Server Components used by default
  - [ ] Client Components only when needed
  - [ ] Dynamic imports for large components
  - [ ] Images optimized with Next.js Image
  - [ ] Fonts optimized with next/font

- [ ] **Database Optimization**
  - [ ] Indexes on all frequently queried columns
  - [ ] RLS policies optimized
  - [ ] Connection pooling configured
  - [ ] Query performance tested (< 100ms p95)

- [ ] **Caching**
  - [ ] React Query cache times configured
  - [ ] API route caching headers set
  - [ ] Static assets cached at CDN
  - [ ] Claude API prompt caching enabled

- [ ] **Bundle Size**
  - [ ] Bundle analysis run
  - [ ] Tree shaking verified
  - [ ] Unused dependencies removed
  - [ ] Total JS < 300KB (gzipped)

- [ ] **Monitoring**
  - [ ] Vercel Analytics enabled
  - [ ] Speed Insights configured
  - [ ] Error tracking set up
  - [ ] Performance budgets defined

---

## 📚 Additional Resources

- [Next.js Performance Optimization](https://nextjs.org/docs/pages/building-your-application/optimizing)
- [Supabase Performance Tuning](https://supabase.com/docs/guides/platform/performance)
- [Claude API Prompt Caching](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching)
- [Web Vitals](https://web.dev/vitals/)
- [Vercel Speed Insights](https://vercel.com/docs/speed-insights)

---

**Remember:** Performance is a feature. Optimize early, measure continuously, and always keep the user experience at the forefront of your optimization efforts.
