# Agent Task: Fix Test Failures in VISION Platform V2

## Objective

Fix 44 failing tests in the VISION Platform V2 test suite. The failures are due to mock configuration issues, NOT production code bugs. The test infrastructure is sound - we just need to adjust the mocks to match the actual service implementations.

## Context

**Current Test Status**:
- Total Tests: 141
- Passing: 97 ✅
- Failing: 44 ❌
- Failure Breakdown:
  - 20 failures in `teamService.test.ts`
  - 24 failures in `documentService.test.ts`
  - 3 failures in `settings/team/page.test.ts`

**Root Cause**: Supabase client mock configuration doesn't match actual query patterns used in services.

**Test Infrastructure**:
- Framework: Vitest with jsdom
- Mocking: Comprehensive setup in `vitest.setup.ts`
- Test Utilities: Helper functions in `apps/shell/src/test/testUtils.tsx`

## Files to Fix

### 1. Team Service Tests (20 failures)
**File**: `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src/services/__tests__/teamService.test.ts`

**Service Implementation**: `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src/services/teamService.ts`

**Example Failures**:
- `should fetch all team members for organization`
- `should exclude deleted members`
- `should send invitation to new member`
- `should fetch pending invitations`
- `should accept invitation and add member`
- `should cancel pending invitation`
- `should remove member from organization`
- `should update member role`
- `should return member role`
- `should return team statistics`
- `should send multiple invitations`

**Common Pattern**: Tests expect certain Supabase query chains but mocks return different structures.

### 2. Document Service Tests (24 failures)
**File**: `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src/services/__tests__/documentService.test.ts`

**Service Implementation**: `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src/services/documentService.ts`

**Example Failures**:
- `should upload document successfully`
- `should fetch document by ID`
- `should return null when document not found`
- `should search documents with filters`
- `should filter by folder`
- `should filter by date range`
- `should soft delete document`
- `should move document to folder`
- `should fetch document version history`
- `should add tag to document`
- `should remove tag from document`
- `should return document statistics`
- `should delete multiple documents`

**Common Pattern**: Supabase storage API and query API mocks need adjustment.

### 3. Settings Team Page Tests (3 failures)
**File**: `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src/app/settings/team/page.test.tsx`

**Component**: `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src/app/settings/team/page.tsx`

**Failures**:
- `uses GlowSelect for all role selectors`
- `marks GlowSelects with the correct test IDs`
- `does not render native select elements`

**Issue**: Component rendering issue with GlowSelect component - tests expect GlowSelect but something else is rendering.

## Approach

### Phase 1: Analyze Service Implementation Patterns

1. **Read actual service files** to understand:
   - What Supabase query chains are used
   - What methods are called (select, insert, update, delete, etc.)
   - What filters are applied (eq, in, gte, lte, etc.)
   - What responses are expected
   - Storage API usage patterns

2. **Identify mock gaps**:
   - Compare service queries to mock implementations
   - Note any methods not mocked
   - Note any incorrect return structures

### Phase 2: Update Mock Configuration

3. **Update `vitest.setup.ts`** (if needed):
   - File: `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/vitest.setup.ts`
   - Add missing Supabase methods to global mock
   - Ensure chainable methods return proper structure

4. **Update `testUtils.tsx`** (if needed):
   - File: `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src/test/testUtils.tsx`
   - Enhance `createMockSupabaseClient` function
   - Add storage API mocking
   - Add missing query methods

### Phase 3: Fix Individual Test Files

5. **Fix teamService.test.ts**:
   - Update mock setup in each test
   - Ensure mock responses match actual service expectations
   - Fix query chain mocking
   - Add missing filters (eq, in, is, etc.)

6. **Fix documentService.test.ts**:
   - Update mock setup for document queries
   - Add storage API mocking for file uploads
   - Fix document search filtering mocks
   - Fix version history mocking
   - Fix tag manipulation mocking

7. **Fix settings/team/page.test.tsx**:
   - Check if GlowSelect component is properly imported
   - Verify test selectors match component structure
   - May need to update component or test expectations

### Phase 4: Verify Fixes

8. **Run tests incrementally**:
   ```bash
   # Test specific file
   pnpm test apps/shell/src/services/__tests__/teamService.test.ts

   # Test all when ready
   pnpm test:run
   ```

9. **Ensure no regressions**:
   - All 97 currently passing tests must still pass
   - All 44 failing tests should now pass
   - Total: 141/141 passing

## Key Patterns to Watch For

### Supabase Query Chains

**Common Pattern**:
```typescript
// Service implementation
const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .eq('column', value)
  .is('deleted_at', null)
  .single();
```

**Mock Must Support**:
```typescript
const mockQuery = {
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  is: vi.fn().mockReturnThis(),
  single: vi.fn().mockResolvedValue({ data: mockData, error: null }),
};
```

### Storage API Pattern

**Service Implementation**:
```typescript
const { data, error } = await supabase.storage
  .from('bucket-name')
  .upload('path/to/file', file);
```

**Mock Must Support**:
```typescript
const mockStorage = {
  from: vi.fn(() => ({
    upload: vi.fn().mockResolvedValue({ data: { path: 'path' }, error: null }),
    download: vi.fn().mockResolvedValue({ data: blob, error: null }),
  })),
};
```

### Common Mock Issues

1. **Missing chainable methods**: Query chains break if any method doesn't `return this`
2. **Wrong return structure**: Supabase returns `{ data, error }` - mocks must match
3. **Missing filters**: Services may use `in()`, `gte()`, `lte()`, `ilike()`, etc.
4. **Storage API not mocked**: File upload/download operations need separate mocking
5. **RPC calls not mocked**: If services use `.rpc()`, it needs mocking

## Success Criteria

- [ ] All 20 teamService tests pass
- [ ] All 24 documentService tests pass
- [ ] All 3 settings team page tests pass
- [ ] All 97 previously passing tests still pass
- [ ] Total: 141/141 tests passing ✅
- [ ] No new warnings or errors
- [ ] Test coverage maintained or improved

## Testing Commands

```bash
# Run specific test file
pnpm test apps/shell/src/services/__tests__/teamService.test.ts

# Run all service tests
pnpm test apps/shell/src/services/__tests__

# Run all tests
pnpm test:run

# Watch mode for iterative fixing
pnpm test:watch

# Check coverage
pnpm test:coverage
```

## Expected Time

**Estimate**: 4-6 hours total
- 1-2 hours: Analyze service implementations
- 1-2 hours: Update mocks in vitest.setup.ts and testUtils.tsx
- 1-2 hours: Fix individual test files
- 1 hour: Verify and ensure no regressions

## Important Notes

1. **Don't change production code**: Only fix mocks and tests
2. **Maintain test intent**: Keep the same test assertions, just fix mocks
3. **Match actual behavior**: Mocks should reflect how Supabase actually works
4. **Test incrementally**: Fix one file at a time and verify
5. **Keep passing tests passing**: Don't break what works

## Files You'll Need to Read

### Service Implementations (to understand patterns)
- `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src/services/teamService.ts`
- `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src/services/documentService.ts`

### Test Infrastructure (to update mocks)
- `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/vitest.setup.ts`
- `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src/test/testUtils.tsx`

### Test Files (to fix)
- `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src/services/__tests__/teamService.test.ts`
- `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src/services/__tests__/documentService.test.ts`
- `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src/app/settings/team/page.test.tsx`

### Components (if needed)
- `/Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/apps/shell/src/app/settings/team/page.tsx`
- GlowSelect component (find with glob: `apps/shell/src/components/**/GlowSelect.tsx`)

## Deliverables

1. **Updated Test Files**: All 3 test files with passing tests
2. **Updated Test Infrastructure**: vitest.setup.ts and/or testUtils.tsx if needed
3. **Test Run Output**: Showing 141/141 passing
4. **Brief Summary**: What was changed and why

## Questions to Answer During Investigation

1. What Supabase methods do the services actually use?
2. What's the exact structure of responses services expect?
3. Are there storage API calls that need mocking?
4. Why is GlowSelect not rendering in component tests?
5. Are there any missing Supabase methods in the mock?

## Getting Started

1. Start by reading teamService.ts to understand its patterns
2. Compare to the mock in vitest.setup.ts
3. Note discrepancies
4. Update mocks to match
5. Run tests to verify
6. Repeat for documentService
7. Fix component test last

Good luck! The test infrastructure is solid - you just need to align the mocks with actual implementation patterns.
