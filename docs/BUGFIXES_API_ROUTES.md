# API Route Fixes Documentation

This document details the bugs found and fixed in the API routes, including root causes, solutions, and best practices.

## Table of Contents

- [Overview](#overview)
- [Fixes Summary](#fixes-summary)
- [Detailed Fixes](#detailed-fixes)
  - [Assessments Route (405/500 Errors)](#1-assessments-route-405500-errors)
  - [Workflows Route (500 Errors)](#2-workflows-route-500-errors)
  - [Plans Route (500 Errors)](#3-plans-route-500-errors)
  - [AI Routes (500 Errors)](#4-ai-routes-500-errors)
  - [Folders Route (Failed to Load)](#5-folders-route-failed-to-load)
- [Best Practices](#best-practices)
- [Common Pitfalls](#common-pitfalls)

---

## Overview

Multiple API routes were experiencing errors (405, 500) due to:
1. Incorrect request type usage (`Request` vs `NextRequest`)
2. Complex/unsupported Supabase query syntax
3. Client-side services being used in server-side routes
4. Insufficient error handling and logging

---

## Fixes Summary

| Route | Error Type | Root Cause | Status |
|-------|-----------|------------|--------|
| `/api/assessments` | 405 Method Not Allowed | Using `Request` instead of `NextRequest` | ✅ Fixed |
| `/api/v1/apps/visionflow/workflows` | 500 Internal Server Error | Invalid Supabase `.or()` query syntax | ✅ Fixed |
| `/api/v1/apps/visionflow/plans` | 500 Internal Server Error | Complex nested query syntax | ✅ Fixed |
| `/api/ai/generate-chips` | 500 Internal Server Error | Missing error details | ✅ Enhanced |
| `/api/ai/generate-empathy-chips` | 500 Internal Server Error | Missing error details | ✅ Enhanced |
| `/api/v1/folders` | Failed to Load | Client-side service in server route | ✅ Fixed |

---

## Detailed Fixes

### 1. Assessments Route (405/500 Errors)

**File:** `apps/shell/src/app/api/assessments/route.ts`

**Problem:**
- Route handlers used `Request` type instead of `NextRequest`
- Next.js App Router requires `NextRequest` for proper request handling
- Resulted in 405 (Method Not Allowed) errors

**Solution:**
```typescript
// Before
export async function POST(request: Request) {
export async function GET(request: Request) {

// After
export async function POST(request: NextRequest) {
export async function GET(request: NextRequest) {
```

**Changes:**
- Changed `Request` to `NextRequest` in both POST and GET handlers
- Added `NextRequest` import from `next/server`
- Enhanced error logging with detailed error messages

**Key Takeaway:**
Always use `NextRequest` (not `Request`) in Next.js App Router API routes for proper type safety and functionality.

---

### 2. Workflows Route (500 Errors)

**File:** `apps/shell/src/app/api/v1/apps/visionflow/workflows/route.ts`

**Problem:**
- Complex nested Supabase query syntax using `.or()` with nested `and()` conditions
- Syntax like `and(is_public.eq.false,organization_id.eq.X)` not supported by PostgREST
- Caused database query failures leading to 500 errors

**Solution:**
```typescript
// Before - Complex nested syntax (unsupported)
query = query.or(
  `and(is_public.eq.false,organization_id.eq.${organizationId}),and(is_public.eq.false,created_by.eq.${user.id})`
);

// After - Simplified with JavaScript filtering
if (isPublic === 'false') {
  // Fetch private workflows first
  const privateQuery = supabase
    .from('workflows')
    .select(...)
    .eq('is_public', false)
    .is('deleted_at', null);
    
  const result = await privateQuery;
  
  // Filter by ownership in JavaScript (more reliable)
  workflows = (result.data || []).filter(
    (w: any) => w.organization_id === organizationId || w.created_by === user.id
  );
}
```

**Changes:**
- Simplified query logic to avoid unsupported nested conditions
- Used JavaScript filtering for complex logical operations
- Split queries by use case (public, private, all)
- Added comprehensive error logging

**Key Takeaways:**
- Supabase/PostgREST has limitations with nested logical operators
- Complex filtering is better done in JavaScript after fetching
- Simpler queries are more reliable and easier to debug

---

### 3. Plans Route (500 Errors)

**File:** `apps/shell/src/app/api/v1/apps/visionflow/plans/route.ts`

**Problem:**
- Similar issue with complex nested query syntax
- Nested `and()` within `.or()` not properly supported

**Solution:**
```typescript
// Before - Complex nested syntax
query = query.or(`owner_user_id.eq.${user.id},and(visibility.eq.ORG,owner_org_id.eq.${organizationId})`);

// After - Simplified syntax
query = query.or(`owner_user_id.eq.${user.id},owner_org_id.eq.${organizationId}`);
```

**Changes:**
- Simplified the `.or()` filter to use basic conditions
- Rely on RLS policies for additional security filtering
- Added detailed error logging

**Key Takeaway:**
Keep Supabase queries simple and use RLS (Row Level Security) policies for complex access control logic.

---

### 4. AI Routes (500 Errors)

**Files:**
- `apps/shell/src/app/api/ai/generate-chips/route.ts`
- `apps/shell/src/app/api/ai/generate-empathy-chips/route.ts`

**Problem:**
- Generic error messages made debugging difficult
- No detailed error information returned to help identify issues

**Solution:**
```typescript
// Before
if (!response.ok) {
  return NextResponse.json({ error: 'AI service error' }, { status: 502 });
}

// After
if (!response.ok) {
  const errorText = await response.text();
  console.error('AI API error:', errorText);
  console.error('AI API response status:', response.status);
  return NextResponse.json(
    { 
      error: 'AI service error',
      details: errorText || 'Unknown error from AI service'
    },
    { status: 502 }
  );
}
```

**Changes:**
- Added detailed error logging with response text and status
- Return more informative error messages
- Log errors to console for debugging

**Key Takeaway:**
Always include detailed error information in responses and logs for easier debugging.

---

### 5. Folders Route (Failed to Load)

**File:** `apps/shell/src/app/api/v1/folders/route.ts`

**Problem:**
- Route was importing `folderService` which is a client-side service (`'use client'`)
- Client-side services use `createClient()` from `@/lib/supabase/client`
- API routes run on server and need `createServerSupabaseClient()`
- This caused runtime errors when the route tried to use client-side code

**Solution:**
```typescript
// Before - Importing client-side service
import { folderService } from '@/services/folderService';

// Inside handler
folders = await folderService.getFolderTree(organizationId);

// After - Server-side implementation
import { createServerSupabaseClient } from '@/lib/supabase/server';

// Helper functions for server-side use
function dbToFolder(dbFolder: any) { ... }
function buildFolderTree(folders: any[]): any[] { ... }

// Inside handler
const supabase = await createServerSupabaseClient();
const { data, error } = await supabase
  .from('folders')
  .select('*')
  .eq('organization_id', organizationId)
  .is('deleted_at', null);

let folders = (data || []).map(dbToFolder);
if (tree) {
  folders = buildFolderTree(folders);
}
```

**Changes:**
- Removed client-side service dependency
- Implemented server-side helper functions
- Used `createServerSupabaseClient()` for database operations
- Added proper folder name validation (duplicate check)
- Added path and depth calculation for nested folders

**Key Takeaways:**
- **Never import client-side services (`'use client'`) in server-side API routes**
- Always use `createServerSupabaseClient()` in API routes
- Use `createClient()` only in client components
- If sharing logic, extract pure functions that can be used on both client and server

---

## Best Practices

### 1. Request Types in Next.js API Routes

✅ **DO:**
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Handler code
}
```

❌ **DON'T:**
```typescript
export async function GET(request: Request) {
  // This won't work properly in Next.js App Router
}
```

### 2. Supabase Client Usage

✅ **DO (Server-side API Routes):**
```typescript
import { createServerSupabaseClient } from '@/lib/supabase/server';

const supabase = await createServerSupabaseClient();
```

✅ **DO (Client Components):**
```typescript
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();
```

❌ **DON'T:**
- Mix client and server Supabase clients
- Import client-side services in API routes
- Use `'use client'` directives in API route files

### 3. Supabase Query Complexity

✅ **DO:**
```typescript
// Simple, direct queries
const { data } = await supabase
  .from('table')
  .select('*')
  .eq('column', value)
  .order('created_at', { ascending: false });

// Filter complex logic in JavaScript
const filtered = data.filter(item => 
  item.field1 === value1 && (item.field2 === value2 || item.field3 === value3)
);
```

❌ **DON'T:**
```typescript
// Complex nested logical operators
query.or(`and(field1.eq.X,field2.eq.Y),and(field1.eq.Z,field3.eq.W)`);
```

### 4. Error Handling

✅ **DO:**
```typescript
try {
  const { data, error } = await supabase.from('table').select('*');
  
  if (error) {
    console.error('Error details:', JSON.stringify(error, null, 2));
    return NextResponse.json(
      { 
        error: 'Failed to fetch data',
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
  
  return NextResponse.json({ data });
} catch (error) {
  console.error('Unexpected error:', error);
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}
```

❌ **DON'T:**
```typescript
// Generic error messages
if (error) {
  return NextResponse.json({ error: 'Error' }, { status: 500 });
}
```

### 5. Service Layer Separation

When sharing logic between client and server:

✅ **DO:**
- Extract pure utility functions (no Supabase client)
- Create separate server-side and client-side implementations
- Use dependency injection for Supabase client

❌ **DON'T:**
- Import client-side services in API routes
- Mix `'use client'` and server-side code

---

## Common Pitfalls

### 1. Client vs Server Code Mixing

**Problem:** Importing client-side services in API routes
```typescript
// ❌ This won't work
import { clientService } from '@/services/clientService'; // has 'use client'

export async function GET() {
  const data = await clientService.getData(); // ERROR!
}
```

**Solution:** Create server-side implementations
```typescript
// ✅ Create server-side version
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from('table').select('*');
  // ...
}
```

### 2. Complex Supabase Queries

**Problem:** Trying to use complex nested logical operators
```typescript
// ❌ This syntax may not be supported
query.or(`and(field1.eq.X,field2.eq.Y),and(field3.eq.Z)`);
```

**Solution:** Simplify and use JavaScript filtering
```typescript
// ✅ Fetch first, filter in JavaScript
const { data } = await query;
const filtered = data.filter(item => 
  (item.field1 === X && item.field2 === Y) || item.field3 === Z
);
```

### 3. Request Type Confusion

**Problem:** Using `Request` instead of `NextRequest`
```typescript
// ❌ Wrong type
export async function GET(request: Request) { }
```

**Solution:** Always use `NextRequest`
```typescript
// ✅ Correct type
import { NextRequest } from 'next/server';
export async function GET(request: NextRequest) { }
```

---

## Testing Recommendations

1. **Test API routes directly** using tools like Postman, curl, or REST Client
2. **Check server logs** for detailed error messages
3. **Verify authentication** is working correctly
4. **Test edge cases** like missing parameters, invalid IDs, etc.
5. **Monitor error responses** to ensure they provide helpful information

---

## Related Files

- `apps/shell/src/app/api/assessments/route.ts`
- `apps/shell/src/app/api/v1/apps/visionflow/workflows/route.ts`
- `apps/shell/src/app/api/v1/apps/visionflow/plans/route.ts`
- `apps/shell/src/app/api/ai/generate-chips/route.ts`
- `apps/shell/src/app/api/ai/generate-empathy-chips/route.ts`
- `apps/shell/src/app/api/v1/folders/route.ts`
- `apps/shell/src/lib/supabase/server.ts`
- `apps/shell/src/lib/supabase/client.ts`

---

## Additional Resources

- [Next.js API Routes Documentation](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [PostgREST Query Syntax](https://postgrest.org/en/stable/api.html#operators)

---

*Last updated: January 2025*


