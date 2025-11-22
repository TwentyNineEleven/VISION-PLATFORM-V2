# API Design Patterns - VISION Platform

**Document Version:** 1.0
**Date:** November 12, 2025
**Author:** Claude Code (API Architect)
**Status:** ✅ Complete

---

## Executive Summary

This document defines API design patterns, standards, and best practices for the VISION Platform. All applications must follow these patterns to ensure consistency, security, and maintainability across the 32+ app ecosystem.

**API Strategy:** RESTful APIs with Next.js API Routes + Supabase Edge Functions

---

## 1. API Architecture Overview

### 1.1 Three-Layer API Strategy

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Next.js Frontend (Browser)                      │   │
│  │  - TanStack Query for data fetching             │   │
│  │  - Supabase Client SDK                          │   │
│  └────────────────┬─────────────────────────────────┘   │
└───────────────────┼─────────────────────────────────────┘
                    │
┌───────────────────┼─────────────────────────────────────┐
│              BFF LAYER (Backend for Frontend)           │
│  ┌────────────────▼─────────────────────────────────┐   │
│  │  Next.js API Routes (/api/*)                     │   │
│  │  - Request validation                            │   │
│  │  - Business logic orchestration                  │   │
│  │  - Response formatting                           │   │
│  └────────────────┬─────────────────────────────────┘   │
└───────────────────┼─────────────────────────────────────┘
                    │
┌───────────────────┼─────────────────────────────────────┐
│               DATA & SERVICES LAYER                      │
│  ┌────────────────▼─────────────────────────────────┐   │
│  │  Supabase API                                     │   │
│  │  - PostgreSQL with RLS                           │   │
│  │  - Real-time subscriptions                       │   │
│  │  - Storage API                                   │   │
│  │  - Edge Functions (AI, complex logic)           │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 1.2 When to Use Each Layer

**Direct Supabase Client (Preferred):**
- Simple CRUD operations
- Real-time subscriptions
- File uploads/downloads
- Row-Level Security handles authorization

**Next.js API Routes (BFF):**
- Complex business logic
- Multi-step operations
- Third-party API integration
- Custom authorization logic
- Response transformation

**Supabase Edge Functions:**
- AI operations (Claude API calls)
- Webhooks processing
- Background jobs
- Heavy computation
- External service integration

---

## 2. RESTful API Standards

### 2.1 URL Structure

```
Base URL: https://visionimpacthub.com/api

Pattern: /api/v1/{resource}/{id}/{sub-resource}

Examples:
GET    /api/v1/organizations/123
GET    /api/v1/organizations/123/users
POST   /api/v1/documents
PUT    /api/v1/documents/456
DELETE /api/v1/documents/456
GET    /api/v1/grants?status=draft&sort=-created_at
```

### 2.2 HTTP Methods

| Method | Purpose | Idempotent | Safe |
|--------|---------|------------|------|
| GET | Retrieve resource(s) | ✅ | ✅ |
| POST | Create new resource | ❌ | ❌ |
| PUT | Update entire resource | ✅ | ❌ |
| PATCH | Update partial resource | ❌ | ❌ |
| DELETE | Remove resource | ✅ | ❌ |

### 2.3 Status Codes

```typescript
// Success responses
200 OK              // Successful GET, PUT, PATCH, DELETE
201 Created         // Successful POST
204 No Content      // Successful DELETE with no response body

// Client error responses
400 Bad Request     // Invalid request data
401 Unauthorized    // Missing or invalid authentication
403 Forbidden       // Insufficient permissions
404 Not Found       // Resource doesn't exist
409 Conflict        // Resource conflict (duplicate, etc.)
422 Unprocessable   // Validation errors
429 Too Many Requests // Rate limit exceeded

// Server error responses
500 Internal Error  // Unexpected server error
502 Bad Gateway     // External service error
503 Service Unavailable // Temporary outage
```

---

## 3. Request/Response Patterns

### 3.1 Standard Response Format

```typescript
// Success response
interface SuccessResponse<T> {
  success: true;
  data: T;
  meta?: {
    pagination?: PaginationMeta;
    timestamp: string;
    request_id: string;
  };
}

// Error response
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>; // Validation errors
    timestamp: string;
    request_id: string;
    documentation_url?: string;
  };
}

// Example success
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Annual Report 2024",
    "created_at": "2025-01-15T10:30:00Z"
  },
  "meta": {
    "timestamp": "2025-01-15T10:30:01.234Z",
    "request_id": "req_abc123"
  }
}

// Example error
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": {
      "email": ["Invalid email format"],
      "amount": ["Must be greater than 0"]
    },
    "timestamp": "2025-01-15T10:30:01.234Z",
    "request_id": "req_abc123",
    "documentation_url": "https://docs.visionimpacthub.com/errors/validation"
  }
}
```

### 3.2 Pagination

```typescript
// Query parameters
?page=2&per_page=20&sort=-created_at&filter[status]=active

// Response
{
  "success": true,
  "data": [/* array of items */],
  "meta": {
    "pagination": {
      "page": 2,
      "per_page": 20,
      "total_pages": 10,
      "total_count": 200,
      "has_next": true,
      "has_previous": true,
      "next_page": 3,
      "previous_page": 1
    },
    "timestamp": "2025-01-15T10:30:01.234Z"
  }
}
```

### 3.3 Filtering & Sorting

```typescript
// Filtering
GET /api/v1/grants?filter[status]=draft&filter[amount_gte]=10000

// Sorting (- prefix for descending)
GET /api/v1/documents?sort=-created_at,title

// Field selection
GET /api/v1/organizations?fields=id,name,plan_tier

// Search
GET /api/v1/documents?search=annual+report

// Complex queries
GET /api/v1/grants?filter[status]=submitted&filter[deadline_gte]=2025-01-01&sort=-requested_amount&page=1&per_page=20
```

---

## 4. Next.js API Route Implementation

### 4.1 Standard API Route Pattern

```typescript
// apps/web/src/app/api/v1/documents/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@vision/database';
import { z } from 'zod';

// Request validation schema
const createDocumentSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  category: z.enum(['assessment', 'grant', 'report', 'policy', 'financial']),
  file: z.string().uuid(), // File ID from upload
});

// GET /api/v1/documents
export async function GET(request: NextRequest) {
  try {
    // 1. Create authenticated Supabase client
    const supabase = createServerClient();

    // 2. Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
            timestamp: new Date().toISOString(),
          }
        },
        { status: 401 }
      );
    }

    // 3. Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('per_page') || '20');
    const category = searchParams.get('filter[category]');

    // 4. Build query (RLS automatically filters by organization)
    let query = supabase
      .from('documents')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    // Apply pagination
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;
    query = query.range(from, to);

    // 5. Execute query
    const { data: documents, error, count } = await query;

    if (error) {
      throw error;
    }

    // 6. Return formatted response
    return NextResponse.json({
      success: true,
      data: documents,
      meta: {
        pagination: {
          page,
          per_page: perPage,
          total_count: count || 0,
          total_pages: Math.ceil((count || 0) / perPage),
          has_next: page * perPage < (count || 0),
          has_previous: page > 1,
        },
        timestamp: new Date().toISOString(),
      }
    });

  } catch (error) {
    console.error('Error fetching documents:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch documents',
          timestamp: new Date().toISOString(),
        }
      },
      { status: 500 }
    );
  }
}

// POST /api/v1/documents
export async function POST(request: NextRequest) {
  try {
    // 1. Authentication
    const supabase = createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
            timestamp: new Date().toISOString(),
          }
        },
        { status: 401 }
      );
    }

    // 2. Parse and validate request body
    const body = await request.json();
    const validation = createDocumentSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request data',
            details: validation.error.flatten().fieldErrors,
            timestamp: new Date().toISOString(),
          }
        },
        { status: 422 }
      );
    }

    // 3. Get user profile for organization_id
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('organization_id')
      .eq('user_id', user.id)
      .single();

    if (!profile) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'User profile not found',
            timestamp: new Date().toISOString(),
          }
        },
        { status: 403 }
      );
    }

    // 4. Create document
    const { data: document, error } = await supabase
      .from('documents')
      .insert({
        ...validation.data,
        organization_id: profile.organization_id,
        uploaded_by: user.id,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // 5. Publish event for cross-app integration
    await supabase.from('platform_events').insert({
      organization_id: profile.organization_id,
      source_app: 'platform',
      event_type: 'document_created',
      payload: {
        document_id: document.id,
        category: document.category,
      }
    });

    // 6. Return success response
    return NextResponse.json(
      {
        success: true,
        data: document,
        meta: {
          timestamp: new Date().toISOString(),
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating document:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to create document',
          timestamp: new Date().toISOString(),
        }
      },
      { status: 500 }
    );
  }
}
```

### 4.2 Dynamic Route Pattern

```typescript
// apps/web/src/app/api/v1/documents/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

// GET /api/v1/documents/:id
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    // RLS automatically ensures user can only access their org's documents
    const { data: document, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: { code: 'NOT_FOUND', message: 'Document not found' } },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      data: document,
      meta: { timestamp: new Date().toISOString() }
    });

  } catch (error) {
    console.error('Error fetching document:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch document' } },
      { status: 500 }
    );
  }
}

// PUT /api/v1/documents/:id
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Similar pattern to POST with update logic
}

// DELETE /api/v1/documents/:id
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Soft delete implementation
}
```

---

## 5. Supabase Edge Functions

### 5.1 AI Generation Function

```typescript
// supabase/functions/generate-grant-proposal/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Anthropic from 'https://esm.sh/@anthropic-ai/sdk';

interface RequestBody {
  grant_id: string;
  funder_requirements?: string;
}

serve(async (req: Request) => {
  try {
    // 1. CORS handling
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders });
    }

    // 2. Authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: { code: 'UNAUTHORIZED', message: 'Missing authorization' } }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid token' } }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 3. Parse request
    const { grant_id, funder_requirements }: RequestBody = await req.json();

    // 4. Fetch grant data (RLS automatically filters)
    const { data: grant, error: grantError } = await supabase
      .from('grants')
      .select(`
        *,
        organization:organizations(*),
        linked_assessment:assessments(*)
      `)
      .eq('id', grant_id)
      .single();

    if (grantError || !grant) {
      return new Response(
        JSON.stringify({ success: false, error: { code: 'NOT_FOUND', message: 'Grant not found' } }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 5. Build AI context
    const context = {
      organization: grant.organization,
      assessment: grant.linked_assessment,
      grant_details: {
        funder: grant.funder_name,
        amount: grant.requested_amount,
        requirements: funder_requirements,
      }
    };

    // 6. Call Claude API
    const anthropic = new Anthropic({
      apiKey: Deno.env.get('ANTHROPIC_API_KEY')!
    });

    const startTime = Date.now();

    const completion = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      system: `You are an expert grant writer for nonprofit organizations. Generate compelling, well-structured grant proposals based on the organization's data and funder requirements.`,
      messages: [{
        role: 'user',
        content: `Generate a grant proposal for:

Organization: ${grant.organization.name}
Mission: ${grant.organization.mission_statement}

Funder: ${grant.funder_name}
Requested Amount: $${grant.requested_amount}
Requirements: ${funder_requirements}

Organizational Strengths (from assessment):
${grant.linked_assessment?.strengths?.join('\n- ') || 'N/A'}

Please generate a complete, compelling grant proposal.`
      }]
    });

    const latency = Date.now() - startTime;

    // 7. Calculate costs
    const inputCost = (completion.usage.input_tokens / 1_000_000) * 3; // $3 per 1M tokens
    const outputCost = (completion.usage.output_tokens / 1_000_000) * 15; // $15 per 1M tokens
    const totalCost = inputCost + outputCost;

    // 8. Track AI usage
    await supabase.from('ai_requests').insert({
      organization_id: grant.organization.id,
      user_id: user.id,
      app_id: 'funding-framer',
      feature: 'grant_generation',
      model: 'claude-3-5-sonnet',
      provider: 'anthropic',
      input_tokens: completion.usage.input_tokens,
      output_tokens: completion.usage.output_tokens,
      total_tokens: completion.usage.input_tokens + completion.usage.output_tokens,
      input_cost_usd: inputCost,
      output_cost_usd: outputCost,
      total_cost_usd: totalCost,
      latency_ms: latency,
    });

    // 9. Save generated content
    const proposalText = completion.content[0].type === 'text'
      ? completion.content[0].text
      : '';

    await supabase
      .from('grants')
      .update({
        proposal_text: proposalText,
        ai_generated_sections: { proposal: true },
        last_ai_edit_at: new Date().toISOString(),
      })
      .eq('id', grant_id);

    // 10. Return response
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          proposal: proposalText,
          usage: completion.usage,
          cost_usd: totalCost,
          latency_ms: latency,
        },
        meta: { timestamp: new Date().toISOString() }
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating proposal:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message || 'Failed to generate proposal',
          timestamp: new Date().toISOString()
        }
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
```

---

## 6. Client-Side Integration

### 6.1 TanStack Query Hooks

```typescript
// packages/database/src/hooks/useDocuments.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../client';
import type { Document } from '../types';

export function useDocuments(filters?: { category?: string }) {
  return useQuery({
    queryKey: ['documents', filters],
    queryFn: async () => {
      let query = supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.category) {
        query = query.eq('category', filters.category);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data as Document[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (document: Partial<Document>) => {
      const { data, error } = await supabase
        .from('documents')
        .insert(document)
        .select()
        .single();

      if (error) throw error;

      return data as Document;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}

export function useUpdateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Document> }) => {
      const { data, error } = await supabase
        .from('documents')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return data as Document;
    },
    onMutate: async ({ id, updates }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['documents'] });

      // Snapshot previous value
      const previousDocuments = queryClient.getQueryData(['documents']);

      // Optimistically update
      queryClient.setQueryData(['documents'], (old: Document[] = []) =>
        old.map(doc => doc.id === id ? { ...doc, ...updates } : doc)
      );

      return { previousDocuments };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousDocuments) {
        queryClient.setQueryData(['documents'], context.previousDocuments);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}
```

### 6.2 API Route Client

```typescript
// packages/database/src/api/documents.ts
import type { Document, PaginatedResponse } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'API request failed');
  }

  return data.data;
}

export const documentsAPI = {
  list: (params?: { category?: string; page?: number }) =>
    fetchAPI<PaginatedResponse<Document>>(`/documents?${new URLSearchParams(params)}`),

  get: (id: string) =>
    fetchAPI<Document>(`/documents/${id}`),

  create: (document: Partial<Document>) =>
    fetchAPI<Document>('/documents', {
      method: 'POST',
      body: JSON.stringify(document),
    }),

  update: (id: string, updates: Partial<Document>) =>
    fetchAPI<Document>(`/documents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  delete: (id: string) =>
    fetchAPI<void>(`/documents/${id}`, {
      method: 'DELETE',
    }),
};
```

---

## 7. Error Handling Standards

### 7.1 Error Codes

```typescript
export const ERROR_CODES = {
  // Authentication errors (401)
  UNAUTHORIZED: 'Authentication required',
  INVALID_TOKEN: 'Invalid or expired token',
  SESSION_EXPIRED: 'Session has expired',

  // Authorization errors (403)
  FORBIDDEN: 'Insufficient permissions',
  RESOURCE_FORBIDDEN: 'Access to this resource is forbidden',

  // Validation errors (422)
  VALIDATION_ERROR: 'Invalid request data',
  MISSING_REQUIRED_FIELD: 'Required field is missing',
  INVALID_FORMAT: 'Invalid data format',

  // Resource errors (404)
  NOT_FOUND: 'Resource not found',
  ORGANIZATION_NOT_FOUND: 'Organization not found',
  USER_NOT_FOUND: 'User not found',

  // Conflict errors (409)
  DUPLICATE_RESOURCE: 'Resource already exists',
  CONFLICT: 'Resource conflict',

  // Rate limiting (429)
  RATE_LIMIT_EXCEEDED: 'Too many requests',

  // Server errors (500+)
  INTERNAL_ERROR: 'Internal server error',
  DATABASE_ERROR: 'Database error',
  EXTERNAL_SERVICE_ERROR: 'External service error',
} as const;
```

### 7.2 Error Handling Middleware

```typescript
// packages/database/src/middleware/errorHandler.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function errorHandler(handler: Function) {
  return async (request: NextRequest, context?: any) => {
    try {
      return await handler(request, context);
    } catch (error) {
      console.error('API Error:', error);

      // Known Supabase errors
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'NOT_FOUND',
              message: 'Resource not found',
              timestamp: new Date().toISOString(),
            }
          },
          { status: 404 }
        );
      }

      if (error.code === '23505') {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'DUPLICATE_RESOURCE',
              message: 'Resource already exists',
              timestamp: new Date().toISOString(),
            }
          },
          { status: 409 }
        );
      }

      // Default error response
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'An unexpected error occurred',
            timestamp: new Date().toISOString(),
          }
        },
        { status: 500 }
      );
    }
  };
}
```

---

## 8. Rate Limiting

### 8.1 Rate Limit Configuration

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests per minute
  analytics: true,
});

export async function middleware(request: NextRequest) {
  // Skip rate limiting for certain paths
  if (request.nextUrl.pathname.startsWith('/_next')) {
    return NextResponse.next();
  }

  // Get user identifier (IP or user ID)
  const identifier = request.ip ?? 'anonymous';

  const { success, limit, reset, remaining } = await ratelimit.limit(identifier);

  const response = success
    ? NextResponse.next()
    : NextResponse.json(
        {
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many requests',
            timestamp: new Date().toISOString(),
          }
        },
        { status: 429 }
      );

  // Add rate limit headers
  response.headers.set('X-RateLimit-Limit', limit.toString());
  response.headers.set('X-RateLimit-Remaining', remaining.toString());
  response.headers.set('X-RateLimit-Reset', reset.toString());

  return response;
}
```

---

## 9. API Documentation

### 9.1 OpenAPI Specification

```yaml
openapi: 3.0.0
info:
  title: VISION Platform API
  version: 1.0.0
  description: API for the VISION Platform nonprofit management suite

servers:
  - url: https://visionimpacthub.com/api/v1
    description: Production server
  - url: http://localhost:3000/api/v1
    description: Development server

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:
    Document:
      type: object
      properties:
        id:
          type: string
          format: uuid
        title:
          type: string
        description:
          type: string
        category:
          type: string
          enum: [assessment, grant, report, policy, financial]
        created_at:
          type: string
          format: date-time

paths:
  /documents:
    get:
      summary: List documents
      security:
        - BearerAuth: []
      parameters:
        - name: category
          in: query
          schema:
            type: string
        - name: page
          in: query
          schema:
            type: integer
            default: 1
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/Document'
```

---

## 10. Testing Standards

### 10.1 API Route Tests

```typescript
// apps/web/src/app/api/v1/documents/route.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { GET, POST } from './route';

describe('Documents API', () => {
  beforeEach(() => {
    // Setup test database
    // Mock authentication
  });

  describe('GET /api/v1/documents', () => {
    it('returns 401 without authentication', async () => {
      const request = new Request('http://localhost/api/v1/documents');
      const response = await GET(request);

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('UNAUTHORIZED');
    });

    it('returns documents for authenticated user', async () => {
      // Mock authenticated request
      const request = new Request('http://localhost/api/v1/documents', {
        headers: { Authorization: 'Bearer valid-token' }
      });

      const response = await GET(request);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
    });

    it('filters documents by category', async () => {
      const request = new Request(
        'http://localhost/api/v1/documents?filter[category]=grant',
        { headers: { Authorization: 'Bearer valid-token' } }
      );

      const response = await GET(request);
      const data = await response.json();

      expect(data.data.every(doc => doc.category === 'grant')).toBe(true);
    });
  });

  describe('POST /api/v1/documents', () => {
    it('creates document with valid data', async () => {
      const body = {
        title: 'Test Document',
        category: 'report',
        file: 'file-uuid'
      };

      const request = new Request('http://localhost/api/v1/documents', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer valid-token',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const response = await POST(request);

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.title).toBe('Test Document');
    });

    it('returns 422 with invalid data', async () => {
      const body = { title: '' }; // Missing required fields

      const request = new Request('http://localhost/api/v1/documents', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer valid-token',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const response = await POST(request);

      expect(response.status).toBe(422);
      const data = await response.json();
      expect(data.error.code).toBe('VALIDATION_ERROR');
      expect(data.error.details).toBeDefined();
    });
  });
});
```

---

## Conclusion

This API design provides:

✅ **Consistency** across all 32+ applications
✅ **Security** with authentication and RLS
✅ **Performance** with caching and optimization
✅ **Developer Experience** with clear patterns and types
✅ **Scalability** from 100 to 10,000+ organizations

**Status:** ✅ API Design Standards Complete

**Next Step:** Implement development standards and best practices documentation

---

**Review Schedule:** Quarterly review for updates and improvements
**Last Updated:** November 12, 2025
