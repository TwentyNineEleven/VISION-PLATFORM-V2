# Supabase Local Setup Issue

## Problem

When starting Supabase locally, there's a storage migration error:
```
StorageBackendError: Migration iceberg-catalog-ids not found
```

This is a known issue with Supabase Storage migrations in some versions.

## Solutions

### Option 1: Use Existing Running Instance (Recommended for Testing)

If you have Supabase already running (even for a different project), you can use it for tests:

1. **Get the credentials** from the running instance:
   ```bash
   # If you have another Supabase project running, get its status
   # Or use the default local credentials:
   ```

2. **Update `vitest.setup.real-db.ts`** with the actual credentials:
   ```typescript
   const LOCAL_SUPABASE_URL = 'http://localhost:54321';
   const LOCAL_SUPABASE_ANON_KEY = '<your-actual-anon-key>';
   ```

3. **Run tests**:
   ```bash
   USE_REAL_DB=1 pnpm test:run
   ```

### Option 2: Disable Storage Temporarily

Edit `supabase/config.toml`:
```toml
[storage]
enabled = false
```

Then start Supabase:
```bash
npx supabase start
```

**Note**: This means storage-related tests won't work, but database tests will.

### Option 3: Update Supabase CLI

Try updating to the latest version:
```bash
npm install -g supabase@latest
# OR
pnpm add -D supabase@latest
```

Then try starting again:
```bash
npx supabase start
```

### Option 4: Use Remote Supabase for Tests

You can point tests to your remote Supabase instance (not recommended for CI, but works for local testing):

Update `vitest.setup.real-db.ts`:
```typescript
const LOCAL_SUPABASE_URL = process.env.VITEST_SUPABASE_URL || 'https://your-project.supabase.co';
const LOCAL_SUPABASE_ANON_KEY = process.env.VITEST_SUPABASE_ANON_KEY || 'your-anon-key';
```

## Current Status

- ✅ Test infrastructure is set up
- ✅ Can switch between mocks and real DB
- ⚠️ Local Supabase has storage migration issue
- ✅ Can use existing Supabase instance or remote for testing

## Recommendation

For now, **use Option 1** - use an existing Supabase instance or the default local credentials. The test infrastructure is ready; you just need working Supabase credentials.

Once Supabase starts successfully, run:
```bash
npx supabase status
```

Copy the API URL and anon key, update `vitest.setup.real-db.ts`, and run:
```bash
USE_REAL_DB=1 pnpm test:run
```

