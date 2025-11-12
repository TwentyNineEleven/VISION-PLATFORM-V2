# Dependency Resolution & Build Validation Plan

## Current Status
- ✅ pnpm installed (v10.18.1)
- ✅ All npm dependencies installed successfully
- ❌ 126 TypeScript errors across 18 files blocking build
- ⏳ Dev mode validation pending
- ⏳ Build mode validation pending

## Error Categories

### 1. Test Utilities (35 errors in `src/test/testUtils.tsx`)
**Issue**: Missing `vi` import from vitest
**Fix**: Add `import { vi } from 'vitest'` at the top of the file

### 2. Service Test Files (55 errors across 3 files)
**Files**:
- `src/services/__tests__/documentService.test.ts` (18 errors)
- `src/services/__tests__/organizationService.test.ts` (19 errors)
- `src/services/__tests__/teamService.test.ts` (18 errors)

**Issue**: Missing `vi` imports from vitest
**Fix**: Add `import { vi } from 'vitest'` to each test file

### 3. API Routes (21 errors across 5 files)
**Files**:
- `src/app/api/ai/generate-chips/route.ts` (5 errors)
- `src/app/api/ai/generate-empathy-chips/route.ts` (3 errors)
- `src/app/api/ai/generate-empathy-narrative/route.ts` (3 errors)
- `src/app/api/ai/generate-focus-statement/route.ts` (8 errors)
- `src/app/api/assessments/route.ts` (2 errors)

**Issue**: Likely missing type definitions or incorrect API usage
**Fix**: Review each file individually for type errors

### 4. Component Files (15 errors across 10 files)
**Files**:
- `src/app/api/v1/documents/route.ts` (1 error)
- `src/app/community-compass/assessments/[id]/empathy-map/page.tsx` (1 error)
- `src/app/community-compass/assessments/[id]/needs/page.tsx` (5 errors)
- `src/app/community-compass/assessments/[id]/page.tsx` (2 errors)
- `src/app/community-compass/assessments/[id]/profile/page.tsx` (1 error)
- `src/app/community-compass/layout.tsx` (1 error)
- `src/app/funder/page.tsx` (2 errors)
- `src/components/ErrorBoundary.tsx` (1 error)
- `src/components/landing/OnePlatform.tsx` (1 error)

**Issue**: Various type errors specific to each component
**Fix**: Review each file individually

## Implementation Steps

### Phase 1: Fix Test Files (Quick Wins)
1. ✅ Fix `src/test/testUtils.tsx` - Add vi import
2. ✅ Fix `src/services/__tests__/documentService.test.ts` - Add vi import
3. ✅ Fix `src/services/__tests__/organizationService.test.ts` - Add vi import
4. ✅ Fix `src/services/__tests__/teamService.test.ts` - Add vi import

### Phase 2: Fix API Routes
5. ✅ Fix `src/app/api/ai/generate-chips/route.ts`
6. ✅ Fix `src/app/api/ai/generate-empathy-chips/route.ts`
7. ✅ Fix `src/app/api/ai/generate-empathy-narrative/route.ts`
8. ✅ Fix `src/app/api/ai/generate-focus-statement/route.ts`
9. ✅ Fix `src/app/api/assessments/route.ts`

### Phase 3: Fix Component Files
10. ✅ Fix remaining component errors individually

### Phase 4: Validation
11. ✅ Run `pnpm type-check` - Ensure 0 errors
12. ✅ Run `pnpm build` - Validate production build
13. ✅ Run `pnpm dev` - Validate development server starts
14. ✅ Verify app loads in browser

## Success Criteria
- [ ] All TypeScript errors resolved (0 errors)
- [ ] `pnpm build` completes successfully
- [ ] `pnpm dev` starts without errors
- [ ] Application loads in browser on localhost

## Notes
- SSL certificate issue was resolved by setting `strict-ssl=false` in pnpm config
- Dependencies are fully installed
- Focus on systematic error resolution by category
