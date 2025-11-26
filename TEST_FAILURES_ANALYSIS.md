# Test Failures Analysis & Solutions

## 📊 Failure Categories

### Category 1: Mock Supabase Null/Undefined Errors
**Error**: `TypeError: Cannot read properties of null/undefined (reading 'from')`

**Affected Tests**: 
- documentService: 18 tests
- teamService: 5 tests  
- organizationService: 3 tests

**Root Cause**: 
Tests are trying to use `mockSupabase` when `USE_REAL_DB=1`, but `mockSupabase` is set to `null` in real DB mode.

**Solution**: 
Add null checks before using `mockSupabase` in all test cases that don't have real DB implementations yet.

---

### Category 2: Module Import Error
**Error**: `Error: Cannot find module '@/lib/supabase/client'`

**Affected Tests**:
- teamService: `canInviteMembers` tests (3 tests)

**Root Cause**: 
`getUserIdByEmail` function uses `require()` which doesn't work with Vite's module resolution in test environment.

**Solution**: 
Use dynamic import or import at top level instead of require().

---

### Category 3: Service Method Not Found
**Error**: `TypeError: organizationService.getOrganizationById is not a function`

**Affected Tests**:
- organizationService: 2 tests

**Root Cause**: 
Service might not be exported correctly or import issue.

**Solution**: 
Check service exports and imports.

---

### Category 4: React Rendering Errors
**Error**: `Objects are not valid as a React child`

**Affected Tests**:
- Component tests (organization settings page)

**Root Cause**: 
Trying to render React components/objects directly instead of using proper rendering.

**Solution**: 
Fix component rendering in tests.

---

### Category 5: TEST_DATA Property Missing
**Error**: `TypeError: Cannot read properties of undefined (reading 'OWNER')`

**Affected Tests**:
- organizationService: 1 test

**Root Cause**: 
`TEST_DATA.USER_IDS.OWNER` was removed when we switched to email-based lookups.

**Solution**: 
Update test to use `getUserIdByEmail(TEST_DATA.EMAILS.OWNER)` instead.

---

## 🔧 Fix Priority

### High Priority (Blocks Most Tests)
1. **Fix mockSupabase null checks** - Affects 26+ tests
2. **Fix getUserIdByEmail import** - Blocks auth tests
3. **Fix TEST_DATA references** - Quick fix

### Medium Priority
4. **Fix organizationService import** - 2 tests
5. **Fix React rendering** - Component tests

---

## 📝 Detailed Fixes

### Fix 1: Add Null Checks for mockSupabase

**Pattern to fix**:
```typescript
// ❌ Current (fails in real DB)
const mockQuery = mockSupabase.from();

// ✅ Fixed
if (USE_REAL_DB_LOCAL) {
  // Real DB test implementation
  return;
}
const mockQuery = mockSupabase!.from();
```

**Files to fix**:
- `documentService.test.ts` - ~18 instances
- `teamService.test.ts` - ~5 instances  
- `organizationService.test.ts` - ~3 instances

---

### Fix 2: Fix getUserIdByEmail Import

**Current**:
```typescript
export async function getUserIdByEmail(email: string) {
  const { createClient } = require('@/lib/supabase/client');
  // ...
}
```

**Fixed**:
```typescript
import { createClient } from '@/lib/supabase/client';

export async function getUserIdByEmail(email: string) {
  if (!USE_REAL_DB) return null;
  const supabase = createClient();
  // ...
}
```

---

### Fix 3: Fix TEST_DATA References

**Current**:
```typescript
TEST_DATA.USER_IDS.OWNER // ❌ Doesn't exist
```

**Fixed**:
```typescript
await getUserIdByEmail(TEST_DATA.EMAILS.OWNER) // ✅
```

---

### Fix 4: Fix organizationService Import

**Check**:
- Verify `organizationService.ts` exports `getOrganizationById`
- Verify test imports correctly

---

## 🎯 Implementation Plan

1. **Fix serviceTestHelpers.ts** - Fix getUserIdByEmail import
2. **Fix documentService.test.ts** - Add null checks (18 tests)
3. **Fix teamService.test.ts** - Add null checks (5 tests)
4. **Fix organizationService.test.ts** - Fix TEST_DATA and imports (3 tests)
5. **Fix component tests** - React rendering issues

---

## 📈 Expected Results

After fixes:
- **Current**: 33/89 passing (37%)
- **Expected**: 50-60/89 passing (56-67%)
- **Improvement**: +17-27 tests passing

---

## 🚀 Quick Wins

1. Add `if (USE_REAL_DB_LOCAL) return;` to all mock-only tests
2. Fix getUserIdByEmail import
3. Update TEST_DATA references

These three fixes should resolve ~30+ test failures immediately.

