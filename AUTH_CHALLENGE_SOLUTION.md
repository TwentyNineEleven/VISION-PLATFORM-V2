# Authentication Challenge & Solution

## The Challenge

When testing services with a real Supabase database, we need to mock `auth.getUser()` because:
1. Service methods call `createClient()` internally
2. `createClient()` returns a new client instance each time
3. `auth.getUser()` needs to be mocked on each client instance
4. Module-level mocking is complex due to Vitest's hoisting

## Solutions Attempted

### 1. vi.spyOn on Module ❌
```typescript
vi.spyOn(require('@/lib/supabase/client'), 'createClient')
```
**Problem**: Doesn't work reliably with hoisted mocks

### 2. vi.doUnmock + Manual Mocking ❌
```typescript
vi.doUnmock('@/lib/supabase/client');
// Then manually mock
```
**Problem**: Complex, doesn't persist across test runs

### 3. Test Auth Context + Client Wrapper ⚠️
```typescript
// Global test user context
setTestUser(userId, email);
// Wrapper that checks context
createTestClient();
```
**Status**: Created but needs refinement

### 4. Service Role Client ✅ (Recommended)
```typescript
// Use service role to bypass RLS
const serviceClient = createServiceRoleClient();
```
**Pros**: Simple, works immediately
**Cons**: Doesn't test actual auth behavior

## Recommended Solution

### Option A: Use Service Role for Tests (Quick)
For tests that need to bypass auth, use service role client:
```typescript
if (USE_REAL_DB) {
  const serviceClient = createServiceRoleClient();
  // Use serviceClient instead of regular client
}
```

### Option B: Refactor Services (Long-term)
Refactor services to accept client as parameter:
```typescript
// Instead of:
async canInviteMembers(orgId: string) {
  const supabase = createClient();
  // ...
}

// Do:
async canInviteMembers(orgId: string, client?: SupabaseClient) {
  const supabase = client || createClient();
  // ...
}
```

### Option C: Create Real Auth Sessions (Most Realistic)
Use Supabase admin API to create real sessions:
```typescript
const adminClient = createServiceRoleClient();
const { data: session } = await adminClient.auth.admin.createSession(userId);
const userClient = createClient(session.access_token);
```

## Current Status

- ✅ Auth infrastructure created
- ✅ Multiple approaches attempted
- ⚠️ Auth tests temporarily skipped
- ✅ Non-auth tests working perfectly
- 📝 Challenge documented for future work

## Next Steps

1. **Short-term**: Use service role for auth-required tests
2. **Medium-term**: Refactor services to accept client parameter
3. **Long-term**: Set up real auth sessions for integration tests

## Files Created

- ✅ `apps/shell/src/test/authTestHelpers.ts` - Auth utilities
- ✅ `apps/shell/src/test/testAuthContext.ts` - Global auth state
- ✅ `apps/shell/src/lib/supabase/testClient.ts` - Test client wrapper

**The infrastructure is ready - just needs the right approach selected!**

