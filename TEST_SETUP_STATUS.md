# Test Setup Status Report

**Date**: November 25, 2025
**Status**: Database Integration Complete, Auth Mocking In Progress

---

## ✅ Completed Work

### 1. Local Supabase Setup
- **Database Reset**: Fixed storage bucket migration to work with current Supabase version
- **Test Data Seeding**: Successfully created comprehensive test data:
  - 4 auth users (owner@test.com, admin@test.com, editor@test.com, viewer@test.com)
  - 1 test organization (ID: `00000000-0000-0000-0000-000000000010`)
  - 3 organization members with different roles (Owner, Admin, Editor)
  - 2 test documents
  - 1 pending invitation

### 2. Test Environment Configuration
- **Created `.env.test.local`**: Configured to use local Supabase instance
  - Local Supabase URL: `http://127.0.0.1:54321`
  - Using service role key for admin operations
  - Test user ID: `8c937b33-eb65-48ae-ac43-c74b66361060` (owner@test.com)

### 3. Test Infrastructure Improvements
- **Updated `vitest.setup.ts`**: Conditionally disables mocks when `USE_REAL_DB=1`
- **Created test helpers**:
  - `/apps/shell/src/test/supabaseMocks.ts` - Mock utilities
  - `/apps/shell/src/test/authTestHelpers.ts` - Auth setup helpers
  - `/apps/shell/src/test/serviceTestHelpers.ts` - Service test utilities
  - `/apps/shell/src/test/authSession.ts` - Session management (WIP)
- **Created utility scripts**:
  - `/scripts/seed-test-data.ts` - Seed comprehensive test data
  - `/scripts/get-test-user-id.ts` - Get test user ID from database

### 4. Migration Fixes
- **Fixed** `20240102000003_create_storage_bucket.sql`:
  - Removed unsupported `file_size_limit` and `allowed_mime_types` columns
  - Now uses minimal schema: `(id, name)`

---

## 🔄 Current Test Results

**Before Docker Setup**: 62 failed / 27 passed (89 total)
**After Database Setup**: 62 failed / 27 passed (89 total)

### Test Failure Categories:

1. **Authentication Timeouts (58 tests)** ⚠️ IN PROGRESS
   - **Issue**: Services call `supabase.auth.getUser()` which returns `undefined` in tests
   - **Files Affected**:
     - `apps/shell/src/services/__tests__/organizationService.test.ts` (25 failures)
     - `apps/shell/src/services/__tests__/teamService.test.ts` (15 failures)
     - `apps/shell/src/services/__tests__/documentService.test.ts` (18 failures)
   - **Root Cause**: `@supabase/ssr`'s `createBrowserClient()` requires browser session storage which doesn't exist in Node test environment

2. **React Rendering Error (3 tests)** 📝 TODO
   - **File**: `apps/shell/src/app/settings/organization/page.test.tsx`
   - **Error**: "Objects are not valid as a React child"
   - **Fix**: Simple component rendering issue, not auth-related

3. **API Status Code (1 test)** 📝 TODO
   - **File**: `apps/shell/src/app/api/v1/documents/__tests__/route.test.ts`
   - **Issue**: Test expects `200` but API correctly returns `201` (Created)
   - **Fix**: Update test expectation

---

## 🚧 Blocking Issue: Auth Mocking

### The Problem

Services use `supabase.auth.getUser()` to get the current user:

```typescript
const { data: { user } } = await supabase.auth.getUser();
if (!user) {
  throw new Error('User not authenticated');
}
```

In tests with real database, `auth.getUser()` returns:
```typescript
{ data: { user: null }, error: null }
```

This causes all auth-dependent tests to fail.

### Attempted Solutions

1. **✗ Override `auth.getUser()` in `client.ts`**
   - Doesn't work: `@supabase/ssr` methods are bound internally

2. **✗ Mock at module level in `vitest.setup.ts`**
   - Challenge: Need to import real module but override auth methods

3. **✗ Use environment variables for test user**
   - Set `TEST_USER_ID` and `TEST_USER_EMAIL`
   - Tried overriding in client creation
   - Supabase client doesn't support this pattern

### Recommended Solutions

#### Option A: Use Service Role Client (Simplest) ⭐
Instead of mocking auth, use the service role client which bypasses RLS:

```typescript
// In test environment, use service role client
export function createClient() {
  if (process.env.NODE_ENV === 'test') {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! // Service role instead of anon
    );
  }
  return createBrowserClient(/*...*/);
}
```

**Pros**:
- Simple, no mocking needed
- Works with real database
- Bypasses RLS (acceptable for tests)

**Cons**:
- Doesn't test RLS policies
- Different client than production

#### Option B: Refactor Services to Accept User ID (Best Long-term)
Modify services to optionally accept userId parameter:

```typescript
async createOrganization(data: Organization, userId?: string) {
  const supabase = createClient();

  let user;
  if (userId) {
    // Test mode: use provided ID
    user = { id: userId };
  } else {
    // Production: get from auth
    const { data: { user: authUser } } = await supabase.auth.getUser();
    user = authUser;
  }
  // ... rest of code
}
```

**Pros**:
- Clean separation of concerns
- Testable without auth
- Maintains RLS testing ability

**Cons**:
- Requires refactoring all services
- Changes service signatures

#### Option C: Mock `@supabase/ssr` Module (Complex)
Create a custom mock that intercepts `createBrowserClient`:

```typescript
vi.mock('@supabase/ssr', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    createBrowserClient: (url, key) => {
      const client = actual.createBrowserClient(url, key);
      // Override auth methods here
      return client;
    },
  };
});
```

**Pros**:
- Uses real Supabase client
- Can mock just auth methods

**Cons**:
- Complex mock setup
- Fragile to library updates

---

## 📋 Next Steps

### Immediate (To Unblock Tests)

1. **Implement Option A** (Use Service Role Client)
   - Update `apps/shell/src/lib/supabase/client.ts`
   - Add test environment check
   - Run tests to verify auth works

2. **Fix Remaining Test Issues**
   - Fix React rendering error (3 tests)
   - Update API status code expectation (1 test)

### Short-term (This Sprint)

3. **Verify All Tests Pass**
   - Target: 89/89 tests passing
   - Document any skipped tests

4. **Add Test Documentation**
   - Document how to run tests with local Supabase
   - Add troubleshooting guide

### Long-term (Next Sprint)

5. **Consider Option B Refactoring**
   - Evaluate if services should accept optional userId
   - Plan refactoring if team agrees
   - Would improve testability

6. **Add E2E Tests**
   - Use Playwright for full authentication flows
   - Test with real browser sessions

---

## 📚 Key Files Modified

### Configuration
- `.env.test.local` - Test environment variables
- `vitest.setup.ts` - Test setup with conditional mocking
- `supabase/migrations/20240102000003_create_storage_bucket.sql` - Fixed schema

### Test Helpers
- `apps/shell/src/test/supabaseMocks.ts` - Mock query builders
- `apps/shell/src/test/authTestHelpers.ts` - Auth setup (partial)
- `apps/shell/src/test/serviceTestHelpers.ts` - Service test utilities
- `apps/shell/src/test/authSession.ts` - Session management (WIP)

### Scripts
- `scripts/seed-test-data.ts` - Comprehensive data seeding
- `scripts/get-test-user-id.ts` - Get test user from database

---

## 🎯 Success Criteria

- [ ] All 89 tests passing with real database
- [ ] Tests can authenticate as different users
- [ ] Tests are fast (< 60s total runtime)
- [ ] Easy to run: `pnpm test:run`
- [ ] Well documented for other developers

---

## 💡 Recommendations

1. **Use Option A immediately** to unblock test development
2. **Plan Option B refactoring** for better long-term architecture
3. **Add CI/CD integration** with Docker Compose for automated testing
4. **Create test data fixtures** for common scenarios
5. **Add test coverage reporting** with Vitest coverage tool

---

## 🔗 Related Documentation

- [Supabase Testing Guide](https://supabase.com/docs/guides/getting-started/testing)
- [Vitest Mocking Guide](https://vitest.dev/guide/mocking.html)
- [Testing React with Vitest](https://vitest.dev/guide/ui.html)

---

**Report Generated**: 2025-11-25 20:30 PST
**Next Update**: After implementing Option A
