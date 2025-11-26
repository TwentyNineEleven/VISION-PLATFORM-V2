# Deployment Guide

This guide covers the CI/CD pipeline setup and deployment process for the VISION Platform.

## Table of Contents

- [Overview](#overview)
- [GitHub Actions Workflows](#github-actions-workflows)
- [Required Secrets](#required-secrets)
- [Environment Variables](#environment-variables)
- [Deployment Process](#deployment-process)
- [Database Migrations](#database-migrations)
- [Rollback Process](#rollback-process)
- [Troubleshooting](#troubleshooting)

## Overview

The VISION Platform uses GitHub Actions for automated CI/CD with three main workflows:

1. **CI Workflow** - Runs on every push/PR to main/develop
2. **Staging Deployment** - Auto-deploys develop branch to staging
3. **Production Deployment** - Deploys tagged releases to production

## GitHub Actions Workflows

### CI Workflow (`.github/workflows/ci.yml`)

**Triggers**: Push/PR to `main` or `develop` branches

**Jobs**:
- `lint-and-typecheck` - ESLint and TypeScript type checking
- `unit-tests` - Vitest unit and integration tests with coverage
- `e2e-tests` - Playwright E2E tests across multiple browsers
- `build` - Production build verification
- `status-check` - Final status validation

**Features**:
- Parallel job execution for speed
- pnpm caching for faster installs
- Coverage upload to Codecov
- Artifact retention (30 days for reports, 7 days for builds)

### Staging Deployment (`.github/workflows/deploy-staging.yml`)

**Triggers**: Push to `develop` branch, manual workflow dispatch

**Process**:
1. Type check and lint
2. Run unit tests
3. Run database migrations on staging database
4. Deploy to Vercel staging environment
5. Health check verification

**URL**: `https://staging.visionplatform.io`

### Production Deployment (`.github/workflows/deploy-production.yml`)

**Triggers**: Git tag creation (`v*.*.*`), manual workflow dispatch

**Process**:
1. Full test suite (unit + E2E)
2. Backup current production deployment URL
3. Run database migrations on production database
4. Deploy to Vercel production
5. Health check verification
6. Automatic rollback on failure
7. Create GitHub release

**URL**: `https://app.visionplatform.io`

## Required Secrets

Configure these secrets in GitHub repository settings (`Settings > Secrets and variables > Actions`):

### Vercel Secrets

| Secret | Description | How to Get |
|--------|-------------|------------|
| `VERCEL_TOKEN` | Vercel API token | [Vercel Dashboard](https://vercel.com/account/tokens) > Create Token |
| `VERCEL_ORG_ID` | Vercel organization ID | Run `vercel link` or check `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | Vercel project ID | Run `vercel link` or check `.vercel/project.json` |

### Supabase Secrets

| Secret | Description | How to Get |
|--------|-------------|------------|
| `SUPABASE_ACCESS_TOKEN` | Supabase access token | [Supabase Dashboard](https://supabase.com/dashboard/account/tokens) > Create Token |
| `STAGING_DATABASE_URL` | Staging database connection string | Supabase Project > Settings > Database > Connection String |
| `PRODUCTION_DATABASE_URL` | Production database connection string | Supabase Project > Settings > Database > Connection String |

### Code Coverage

| Secret | Description | How to Get |
|--------|-------------|------------|
| `CODECOV_TOKEN` | Codecov upload token | [Codecov Dashboard](https://codecov.io) > Repository Settings |

### Additional Secrets (Optional)

| Secret | Description |
|--------|-------------|
| `SENTRY_AUTH_TOKEN` | Sentry authentication token for source map uploads |
| `GITHUB_TOKEN` | Auto-generated, used for release creation |

## Environment Variables

### Local Development (`.env.local`)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_APP_VERSION=2.0.0

# Sentry (optional)
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project

# Resend (optional)
RESEND_API_KEY=your-resend-api-key

# PostHog (optional)
NEXT_PUBLIC_POSTHOG_KEY=your-posthog-key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Logging
LOG_LEVEL=debug
NODE_ENV=development
```

### Vercel Environment Variables

Configure these in Vercel Dashboard for each environment:

#### Required for All Environments

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL`
- `NODE_ENV`

#### Staging-Specific

- `NEXT_PUBLIC_APP_URL=https://staging.visionplatform.io`
- `NODE_ENV=production`
- `LOG_LEVEL=info`

#### Production-Specific

- `NEXT_PUBLIC_APP_URL=https://app.visionplatform.io`
- `NODE_ENV=production`
- `LOG_LEVEL=warn`

## Deployment Process

### Deploying to Staging

1. **Automatic**: Push to `develop` branch
   ```bash
   git checkout develop
   git merge feature/your-feature
   git push origin develop
   ```

2. **Manual**: Trigger workflow from GitHub Actions tab
   - Go to Actions > Deploy to Staging
   - Click "Run workflow"
   - Select `develop` branch

### Deploying to Production

1. **Create a release tag**:
   ```bash
   git checkout main
   git tag -a v2.0.0 -m "Release version 2.0.0"
   git push origin v2.0.0
   ```

2. **Automatic deployment** will start via GitHub Actions

3. **Monitor deployment**:
   - Check GitHub Actions tab for workflow progress
   - Verify health check passes
   - Check Vercel dashboard for deployment status

4. **Verify deployment**:
   - Visit https://app.visionplatform.io
   - Check Sentry for any errors
   - Monitor PostHog for analytics

## Database Migrations

### Automatic Migration in CI/CD

Database migrations run automatically during deployment:

**Staging**: Migrations run before staging deployment
```bash
npx supabase db push --db-url $STAGING_DATABASE_URL
```

**Production**: Migrations run before production deployment
```bash
npx supabase db push --db-url $PRODUCTION_DATABASE_URL
```

### Manual Migration

If you need to run migrations manually:

```bash
# Staging
npx supabase db push --db-url "postgresql://..."

# Production (use with caution!)
npx supabase db push --db-url "postgresql://..."
```

### Creating New Migrations

```bash
# Create new migration file
npx supabase migration new your_migration_name

# Edit the generated file in supabase/migrations/
# Write your SQL migration

# Test locally
npx supabase db reset

# Commit and push
git add supabase/migrations/
git commit -m "feat: add migration for feature X"
git push
```

### Migration Best Practices

1. **Test migrations locally** before deploying
2. **Make migrations reversible** when possible
3. **Avoid destructive changes** without proper backups
4. **Use transactions** for complex migrations
5. **Document breaking changes** in migration files

## Rollback Process

### Automatic Rollback (Production)

Production deployments automatically roll back if health checks fail:

1. Previous deployment URL is backed up before new deployment
2. If health check fails, workflow automatically restores previous version
3. Check GitHub Actions logs for rollback confirmation

### Manual Rollback

If you need to manually roll back a deployment:

#### Via Vercel CLI

```bash
# List recent deployments
vercel ls

# Find the previous working deployment URL
# Set it as the production alias
vercel alias set <previous-deployment-url> app.visionplatform.io
```

#### Via Vercel Dashboard

1. Go to Vercel Dashboard
2. Select your project
3. Click "Deployments"
4. Find the previous working deployment
5. Click "..." menu > "Promote to Production"

#### Database Rollback

If a migration causes issues:

```bash
# Connect to database
psql "postgresql://..."

# Run rollback SQL manually
# (This is why reversible migrations are important!)
```

**Important**: Always test migrations in staging first!

## Troubleshooting

### Deployment Fails at Type Check

**Issue**: TypeScript errors prevent deployment

**Solution**:
```bash
# Run type check locally
pnpm type-check

# Fix all type errors
# Commit and push
```

### Deployment Fails at Tests

**Issue**: Unit or E2E tests failing

**Solution**:
```bash
# Run tests locally
pnpm test:run
pnpm test:e2e

# Fix failing tests
# Commit and push
```

### Health Check Fails

**Issue**: Deployment completes but health check returns 503

**Possible causes**:
1. Database connection issues
2. Environment variables not set correctly
3. Migration failed

**Solution**:
```bash
# Check Vercel logs
vercel logs

# Check database connectivity
# Verify environment variables in Vercel dashboard
# Check migration status
```

### Migration Fails

**Issue**: Database migration error during deployment

**Solution**:
```bash
# Check migration syntax
# Test migration locally first
npx supabase db reset

# If migration is invalid, create a new migration to fix it
npx supabase migration new fix_previous_migration

# Deploy the fix
```

### Vercel Build Timeout

**Issue**: Build exceeds 15-minute timeout

**Solution**:
1. Check for infinite loops in build scripts
2. Verify dependencies are cached correctly
3. Contact Vercel support for timeout increase (Pro/Enterprise plans)

### Secret Not Found

**Issue**: `Error: Secret X not found`

**Solution**:
1. Go to GitHub repository settings
2. Navigate to Secrets and variables > Actions
3. Verify secret exists with correct name (case-sensitive)
4. Re-run workflow

## Monitoring and Alerts

### Post-Deployment Checklist

After each production deployment:

- [ ] Visit https://app.visionplatform.io - verify site loads
- [ ] Check Sentry dashboard - verify no new errors
- [ ] Check PostHog dashboard - verify analytics working
- [ ] Test critical user flows (login, document upload, etc.)
- [ ] Monitor for 15-30 minutes after deployment

### Setting Up Alerts

**Sentry Alerts**:
1. Go to Sentry > Alerts
2. Create alert for error rate threshold
3. Configure Slack/email notifications

**Vercel Alerts**:
1. Go to Vercel Dashboard > Settings > Notifications
2. Enable deployment notifications
3. Configure Slack integration

**GitHub Actions Alerts**:
- Automatic email notifications for failed workflows
- Configure in GitHub Settings > Notifications

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Supabase CLI Documentation](https://supabase.com/docs/reference/cli)
- [Sentry Documentation](https://docs.sentry.io)

## Support

For deployment issues:
1. Check this documentation
2. Review GitHub Actions logs
3. Check Vercel deployment logs
4. Review Sentry error reports
5. Contact DevOps team (if applicable)
