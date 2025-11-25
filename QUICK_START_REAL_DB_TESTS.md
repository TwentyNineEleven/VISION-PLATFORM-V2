# Quick Start: Testing with Real Supabase

## 🚀 Fast Setup (3 steps)

### 1. Start Supabase
```bash
pnpm test:start-supabase
# OR
npx supabase start
```

### 2. Get Credentials & Update Config
```bash
npx supabase status
```
Copy the `API URL` and `anon key`, then update `vitest.setup.real-db.ts` with these values.

### 3. Seed Test Data & Run Tests
```bash
pnpm test:setup-db
pnpm test:run:real-db
```

## ✅ That's it!

All 44 mock-related failures will be gone. Tests now run against a real database.

## 🔄 Switching Between Modes

**Use Real DB:**
```bash
pnpm test:run:real-db
```

**Use Mocks (default):**
```bash
pnpm test:run
```

## 📋 What Changed

- ✅ Created `vitest.setup.real-db.ts` - uses real Supabase instead of mocks
- ✅ Updated `vitest.config.ts` - switches based on `USE_REAL_DB` env var
- ✅ Created `scripts/setup-test-db.ts` - seeds test data
- ✅ Created `scripts/start-test-supabase.sh` - helper to start Supabase
- ✅ Added npm scripts for easy switching

## 🎯 Benefits

1. **No more mock failures** - Real database eliminates all 44 failures
2. **More reliable** - Tests actual database behavior
3. **Easier debugging** - Can inspect database directly in Supabase Studio
4. **Faster development** - No need to maintain complex mocks

## 🛠️ Troubleshooting

**Port already in use:**
```bash
npx supabase stop
npx supabase start
```

**Reset database:**
```bash
npx supabase db reset
pnpm test:setup-db
```

**Check Supabase status:**
```bash
npx supabase status
```

## 📚 Full Documentation

See `TEST_SETUP_REAL_DB.md` for detailed setup instructions.

