# Testing with Real Local Supabase Instance

This guide explains how to run tests against a real local Supabase instance instead of mocks.

## Benefits

- ✅ Eliminates all mock-related failures
- ✅ Tests against real database behavior
- ✅ More reliable and realistic tests
- ✅ Easier to debug (can inspect database directly)

## Setup

### 1. Start Local Supabase

```bash
npx supabase start
```

This will start:
- PostgreSQL database (port 54322)
- Supabase API (port 54321)
- Supabase Studio (port 54323)
- Storage API (port 54324)

### 2. Get Local Credentials

```bash
npx supabase status
```

Copy the `API URL` and `anon key` from the output.

### 3. Set Environment Variables

Create a `.env.test` file or update `vitest.setup.real-db.ts` with the credentials:

```bash
VITEST_SUPABASE_URL=http://localhost:54321
VITEST_SUPABASE_ANON_KEY=<your-anon-key>
VITEST_SUPABASE_SERVICE_KEY=<your-service-key>
```

### 4. Seed Test Data

```bash
pnpm tsx scripts/setup-test-db.ts
```

### 5. Run Tests

Update `vitest.config.ts` to use the real DB setup:

```typescript
setupFiles: ['./vitest.setup.real-db.ts'], // instead of vitest.setup.ts
```

Then run tests:

```bash
pnpm test:run
```

## Switching Back to Mocks

To use mocks again, just change the setup file back:

```typescript
setupFiles: ['./vitest.setup.ts'], // back to mocks
```

## Test Fixtures

Create test-specific data in `scripts/test-fixtures.ts` and load them before each test suite.

## Cleanup

After tests, you can reset the database:

```bash
npx supabase db reset
```

Or stop Supabase:

```bash
npx supabase stop
```

