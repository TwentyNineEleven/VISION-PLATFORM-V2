# Quick Secrets Setup - Start Here

Set up these secrets now to enable CI/CD features without Vercel.

## 🚀 Priority 1: Enable CI Workflow

Configure these to enable automated testing on every commit:

### 1. Codecov Token (Optional - for coverage reports)
```
Name: CODECOV_TOKEN
Get it: https://codecov.io → Sign in with GitHub → Add repository
Value: Your upload token from repository settings
```

### 2. Supabase Environment Variables (Optional - for build)
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://your-project.supabase.co

Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: Your anon key from Supabase project settings
```

**What this enables**: ✅ Full CI workflow with test coverage tracking

---

## 📦 Priority 2: Enable Database Migrations

Configure these to enable automated database migrations:

### 3. Supabase Access Token
```
Name: SUPABASE_ACCESS_TOKEN
Get it: https://supabase.com/dashboard → Profile → Access Tokens → Generate
Value: sbp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 4. Database URLs
```
Name: STAGING_DATABASE_URL
Get it: Supabase Project → Settings → Database → Connection String (URI)
Value: postgresql://postgres:[PASSWORD]@db.[ref].supabase.co:5432/postgres

Name: PRODUCTION_DATABASE_URL
Get it: Same as above, but from production project
Value: postgresql://postgres:[PASSWORD]@db.[ref].supabase.co:5432/postgres
```

**What this enables**: ✅ Automated database migrations in CI/CD

---

## 🎯 What Works Without Vercel

With the above secrets configured:

✅ **CI Workflow** runs on every commit:
- Linting and type checking
- Unit and integration tests
- E2E tests (Playwright)
- Build verification
- Coverage reports to Codecov

✅ **Database Migrations** can run automatically

❌ **Deployments** require Vercel setup (configure later):
- Staging deployment workflow
- Production deployment workflow

---

## 🔧 How to Add Secrets

1. Go to: `https://github.com/TwentyNineEleven/VISION-PLATFORM-V2/settings/secrets/actions`
2. Click **New repository secret**
3. Enter **Name** and **Value**
4. Click **Add secret**
5. Repeat for each secret

---

## ✅ Testing

After adding secrets, test the CI workflow:

```bash
git checkout -b test/ci
echo "# Test CI" >> README.md
git add README.md
git commit -m "test: verify CI workflow"
git push origin test/ci
```

Then create a PR on GitHub and watch the CI workflow run!

---

## 📋 Setup Checklist

- [ ] Add `CODECOV_TOKEN` (optional but recommended)
- [ ] Add `NEXT_PUBLIC_SUPABASE_URL` (optional, for builds)
- [ ] Add `NEXT_PUBLIC_SUPABASE_ANON_KEY` (optional, for builds)
- [ ] Add `SUPABASE_ACCESS_TOKEN` (for migrations)
- [ ] Add `STAGING_DATABASE_URL` (for migrations)
- [ ] Add `PRODUCTION_DATABASE_URL` (for migrations)
- [ ] Test CI workflow by pushing a commit
- [ ] Verify coverage report appears in Codecov

---

## 🚫 Skip These For Now

These require Vercel project setup (configure when ready):
- ⏭️ `VERCEL_TOKEN`
- ⏭️ `VERCEL_ORG_ID`
- ⏭️ `VERCEL_PROJECT_ID`

---

## 📖 Full Documentation

See [SECRETS_SETUP.md](./SECRETS_SETUP.md) for detailed instructions and troubleshooting.
