# GitHub Secrets Setup Guide

This guide walks you through configuring GitHub secrets for the CI/CD pipeline.

## Overview

GitHub secrets are encrypted environment variables used in workflows. You'll configure these in your repository settings.

## Accessing GitHub Secrets

1. Go to your repository on GitHub
2. Click **Settings** (top right)
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**

## Required Secrets - Ready to Configure

These secrets can be configured now without Vercel setup:

### 1. Supabase Access Token

**Secret Name**: `SUPABASE_ACCESS_TOKEN`

**Purpose**: Allows the CI/CD pipeline to run database migrations

**How to Get**:
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click your profile icon (top right) → **Access Tokens**
3. Click **Generate New Token**
4. Name it: `GitHub Actions - VISION Platform`
5. Copy the token (you won't see it again!)
6. Add as GitHub secret

**Value Format**: `sbp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

---

### 2. Staging Database URL

**Secret Name**: `STAGING_DATABASE_URL`

**Purpose**: Connection string for your staging database (for migrations)

**How to Get**:
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your **staging project** (or create one if needed)
3. Go to **Settings** → **Database**
4. Under **Connection string**, select **URI**
5. Copy the connection string
6. Replace `[YOUR-PASSWORD]` with your actual database password
7. Add as GitHub secret

**Value Format**: `postgresql://postgres:[YOUR-PASSWORD]@db.[project-ref].supabase.co:5432/postgres`

**Important**: Use the **direct connection** string, not the pooler

---

### 3. Production Database URL

**Secret Name**: `PRODUCTION_DATABASE_URL`

**Purpose**: Connection string for your production database (for migrations)

**How to Get**:
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your **production project**
3. Go to **Settings** → **Database**
4. Under **Connection string**, select **URI**
5. Copy the connection string
6. Replace `[YOUR-PASSWORD]` with your actual database password
7. Add as GitHub secret

**Value Format**: `postgresql://postgres:[YOUR-PASSWORD]@db.[project-ref].supabase.co:5432/postgres`

**Important**: Use the **direct connection** string, not the pooler

---

### 4. Codecov Token (Optional but Recommended)

**Secret Name**: `CODECOV_TOKEN`

**Purpose**: Upload code coverage reports to Codecov

**How to Get**:
1. Go to [Codecov.io](https://codecov.io)
2. Sign in with GitHub
3. Add your repository (`TwentyNineEleven/VISION-PLATFORM-V2`)
4. Go to **Settings** → **General**
5. Copy the **Repository Upload Token**
6. Add as GitHub secret

**Value Format**: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

**Note**: If you skip this, CI will still work but coverage reports won't be uploaded

---

## Secrets to Configure Later (Require Vercel)

These secrets require Vercel project setup and should be configured when you're ready to deploy:

### Vercel Token
- **Secret Name**: `VERCEL_TOKEN`
- **How to Get**: [Vercel Account Settings](https://vercel.com/account/tokens) → Create Token
- **Required for**: Staging and production deployments

### Vercel Organization ID
- **Secret Name**: `VERCEL_ORG_ID`
- **How to Get**: Run `vercel link` in project or check `.vercel/project.json`
- **Required for**: Staging and production deployments

### Vercel Project ID
- **Secret Name**: `VERCEL_PROJECT_ID`
- **How to Get**: Run `vercel link` in project or check `.vercel/project.json`
- **Required for**: Staging and production deployments

---

## Optional Secrets

### Sentry Auth Token
- **Secret Name**: `SENTRY_AUTH_TOKEN`
- **Purpose**: Upload source maps to Sentry for better error tracking
- **How to Get**: [Sentry Settings](https://sentry.io/settings/account/api/auth-tokens/) → Create Auth Token
- **Required for**: Source map uploads during build

---

## Verification

After adding secrets, verify they're configured correctly:

1. Go to repository **Settings** → **Secrets and variables** → **Actions**
2. You should see these secrets listed:
   - `SUPABASE_ACCESS_TOKEN` ✓
   - `STAGING_DATABASE_URL` ✓
   - `PRODUCTION_DATABASE_URL` ✓
   - `CODECOV_TOKEN` ✓ (optional)

**Note**: You won't be able to view secret values after creation (for security). You can only update or delete them.

---

## Testing the Configuration

### Test CI Workflow (No Vercel Required)

The CI workflow will work with just the Codecov token:

```bash
# Create a test branch
git checkout -b test/ci-workflow

# Make a small change
echo "# CI Test" >> README.md

# Commit and push
git add README.md
git commit -m "test: verify CI workflow"
git push origin test/ci-workflow

# Create a PR on GitHub
# CI workflow should run automatically
```

**Expected Results**:
- ✅ Lint and type-check passes
- ✅ Unit tests pass with coverage upload (if Codecov token configured)
- ✅ E2E tests pass
- ✅ Build succeeds
- ✅ Status check passes

### Test Database Migrations (Optional)

You can test the migration script locally before CI runs it:

```bash
# Set environment variables
export STAGING_DATABASE_URL="postgresql://postgres:password@..."
export SUPABASE_ACCESS_TOKEN="sbp_..."

# Run migration script
npx tsx scripts/run-migrations.ts staging
```

**Expected Output**:
```
📦 VISION Platform - Database Migration Runner
Environment: staging
──────────────────────────────────────────────────
🔍 Verifying database connection for staging...
✅ Database connection verified
🔄 Running database migrations for staging...
✅ Migrations completed successfully
──────────────────────────────────────────────────
```

---

## Troubleshooting

### Secret Not Found Error

**Problem**: Workflow fails with `Error: Secret X not found`

**Solution**:
1. Verify secret name matches exactly (case-sensitive)
2. Check secret is added to correct repository
3. Ensure workflow has permission to access secrets

### Database Connection Failed

**Problem**: Migration fails with connection error

**Solution**:
1. Verify database URL format is correct
2. Check database password is correct
3. Ensure using direct connection (not pooler)
4. Verify database is accessible from GitHub Actions IPs
5. Check Supabase project is not paused

### Codecov Upload Failed

**Problem**: Coverage upload fails or returns 401

**Solution**:
1. Verify Codecov token is correct
2. Check repository is added to Codecov
3. Ensure token has upload permissions
4. If using Codecov free tier, verify repo is public

---

## Security Best Practices

1. **Never commit secrets** to the repository
2. **Rotate tokens regularly** (every 90 days recommended)
3. **Use minimal permissions** (read-only where possible)
4. **Audit secret usage** regularly
5. **Remove unused secrets** promptly
6. **Use environment-specific secrets** (separate staging/production)

---

## What Works Without Vercel

With just the Supabase and Codecov secrets configured, these workflows will function:

✅ **CI Workflow** (`.github/workflows/ci.yml`)
- Runs on every push/PR
- Executes all tests
- Uploads coverage to Codecov
- Verifies build succeeds

❌ **Staging Deployment** (requires Vercel secrets)
❌ **Production Deployment** (requires Vercel secrets)

---

## Next Steps

1. **Configure Supabase Secrets** (follow steps above)
2. **Configure Codecov Token** (optional but recommended)
3. **Test CI Workflow** by pushing a test commit
4. **Setup Vercel** when ready to enable deployments
5. **Configure Vercel Secrets** to enable staging/production deployments

---

## Getting Help

If you encounter issues:
1. Check this guide first
2. Review workflow logs in GitHub Actions
3. Check [GitHub Actions Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
4. Check [Supabase CLI Documentation](https://supabase.com/docs/reference/cli)
5. Check [Codecov Documentation](https://docs.codecov.com)

---

**Last Updated**: January 2025
**Applies to**: VISION Platform V2 - Phase 1.4
