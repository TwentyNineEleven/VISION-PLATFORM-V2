# API Routes Quick Reference Guide

Quick reference for common patterns and gotchas when working with Next.js API routes in this project.

## Quick Checklist

Before submitting an API route, ensure:

- [ ] Uses `NextRequest` (not `Request`) for handler parameters
- [ ] Uses `createServerSupabaseClient()` (not `createClient()`)
- [ ] No imports of client-side services (`'use client'` files)
- [ ] Proper error handling with detailed messages
- [ ] Authentication checks included
- [ ] Query parameters validated
- [ ] Supabase queries are simple and direct

## Template for New API Routes

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * GET /api/v1/your-resource
 * Description of what this endpoint does
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    // 1. Authenticate
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 2. Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const param1 = searchParams.get('param1');

    // 3. Validate input
    if (!param1) {
      return NextResponse.json(
        { success: false, message: 'param1 is required' },
        { status: 400 }
      );
    }

    // 4. Query database (keep it simple!)
    const { data, error } = await supabase
      .from('your_table')
      .select('*')
      .eq('column', param1)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        {
          success: false,
          message: error.message || 'Failed to fetch data',
        },
        { status: 500 }
      );
    }

    // 5. Return response
    return NextResponse.json({
      success: true,
      data: data || [],
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/your-resource
 * Create a new resource
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    // 1. Authenticate
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 2. Parse and validate body
    const body = await request.json();
    const { field1, field2 } = body;

    if (!field1 || !field2) {
      return NextResponse.json(
        { success: false, message: 'field1 and field2 are required' },
        { status: 400 }
      );
    }

    // 3. Insert data
    const { data, error } = await supabase
      .from('your_table')
      .insert({
        field1,
        field2,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error('Insert error:', error);
      return NextResponse.json(
        {
          success: false,
          message: error.message || 'Failed to create resource',
        },
        { status: 500 }
      );
    }

    // 4. Return response
    return NextResponse.json({
      success: true,
      data,
      message: 'Resource created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
```

## Common Patterns

### Getting User's Organization

```typescript
// Get user's active organization from preferences
const { data: preferences } = await supabase
  .from('user_preferences')
  .select('active_organization_id')
  .eq('user_id', user.id)
  .single();

if (!preferences?.active_organization_id) {
  return NextResponse.json(
    { error: 'No active organization' },
    { status: 400 }
  );
}

const organizationId = preferences.active_organization_id;
```

### Filtering with OR Conditions

```typescript
// ✅ DO: Use simple .or() syntax
const { data } = await supabase
  .from('table')
  .select('*')
  .or(`field1.eq.value1,field2.eq.value2`);

// ✅ DO: For complex logic, fetch first then filter
const { data } = await supabase.from('table').select('*');
const filtered = data.filter(item => 
  (item.field1 === value1 && item.field2 === value2) ||
  item.field3 === value3
);

// ❌ DON'T: Use complex nested syntax
.or(`and(field1.eq.X,field2.eq.Y),and(field3.eq.Z)`); // May not work!
```

### Error Response Format

```typescript
// Standard error response format
return NextResponse.json(
  {
    success: false,
    message: 'Human-readable error message',
    details: 'Optional technical details for debugging',
  },
  { status: 400 } // Appropriate HTTP status code
);
```

### Success Response Format

```typescript
// Standard success response format
return NextResponse.json({
  success: true,
  data: yourData, // or [] for lists
  message: 'Optional success message',
});
```

## HTTP Status Codes

Use appropriate status codes:

- `200` - Success (GET, PUT, PATCH)
- `201` - Created (POST)
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (not authenticated)
- `403` - Forbidden (not authorized)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `500` - Internal Server Error
- `502` - Bad Gateway (external service error)

## Debugging Tips

1. **Check server logs** - All errors are logged to console
2. **Use detailed error messages** - Include actual error details in responses
3. **Test with curl/Postman** - Test API routes independently
4. **Verify authentication** - Make sure user is authenticated
5. **Check query syntax** - Ensure Supabase queries are valid

## Common Errors and Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| 405 Method Not Allowed | Using `Request` instead of `NextRequest` | Use `NextRequest` type |
| 500 Internal Server Error | Invalid Supabase query syntax | Simplify query or use JavaScript filtering |
| Import errors | Importing client-side service | Use server-side implementation |
| Authentication fails | Not checking auth | Always call `supabase.auth.getUser()` |

## File Organization

```
apps/shell/src/app/api/
├── v1/
│   ├── folders/
│   │   └── route.ts
│   └── apps/
│       └── visionflow/
│           ├── workflows/
│           │   └── route.ts
│           └── plans/
│               └── route.ts
├── assessments/
│   └── route.ts
└── ai/
    ├── generate-chips/
    │   └── route.ts
    └── generate-empathy-chips/
        └── route.ts
```

---

For detailed documentation, see [BUGFIXES_API_ROUTES.md](./BUGFIXES_API_ROUTES.md)


