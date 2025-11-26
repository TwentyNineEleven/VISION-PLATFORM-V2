# Community Compass Migration Guide

## Overview
This guide helps you apply the Community Compass database migrations to your Supabase instance.

## Migration Files
The following migrations need to be applied in order:
1. `20251124000000_create_community_assessments.sql` - Creates assessments table
2. `20251124000001_create_statement_chips.sql` - Creates statement chips table
3. `20251124000002_create_community_needs.sql` - Creates community needs table
4. `20251124000003_add_focus_statements.sql` - Adds focus statement columns

## Option 1: Supabase Dashboard (Recommended)

1. Go to https://supabase.com/dashboard/project/qhibeqcsixitokxllhom
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the contents of each migration file in order
5. Click **Run** for each migration
6. Verify success in the **Table Editor**

## Option 2: Supabase CLI

```bash
# Login to Supabase
npx supabase login

# Link to your project
npx supabase link --project-ref qhibeqcsixitokxllhom

# Push migrations
npx supabase db push
```

## After Migration

Once migrations are applied, regenerate TypeScript types:

```bash
npx supabase gen types typescript --project-id qhibeqcsixitokxllhom > apps/shell/src/types/supabase.ts
```

## Verification

Run this SQL query in the Supabase SQL Editor to verify tables exist:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name LIKE 'community_%'
OR table_name LIKE 'statement_%';
```

You should see:
- `community_assessments`
- `community_needs`
- `statement_chips`
