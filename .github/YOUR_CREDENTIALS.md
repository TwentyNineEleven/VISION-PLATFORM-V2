# Your VISION Platform Credentials & Configuration

## 📦 Supabase Configuration

### Your Supabase Project
**Project Reference**: `qhibeqcsixitokxllhom`
**Project URL**: https://qhibeqcsixitokxllhom.supabase.co

### API Keys

#### Public (Anon) Key
Used in frontend code - safe to expose in browser:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoaWJlcWNzaXhpdG9reGxsaG9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNTY5NjAsImV4cCI6MjA3ODYzMjk2MH0.QEdch8efJ7MWHbO_wdSEjaIptnTMh6R7OgZpr-jIoPQ
```

#### Service Role Key (Secret)
**⚠️ KEEP SECRET** - Has full database access, never expose in frontend:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoaWJlcWNzaXhpdG9reGxsaG9tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzA1Njk2MCwiZXhwIjoyMDc4NjMyOTYwfQ.61mSTmNx_V-D3XLaolEhTObTvIR-JIS9uE-kxRHKW-s
```

---

## 🔑 How to Find More Supabase Credentials

### 1. Access Token (for CI/CD migrations)
1. Go to: https://supabase.com/dashboard
2. Click your profile icon (top right)
3. Click **Access Tokens**
4. Click **Generate New Token**
5. Name it: "GitHub Actions - VISION Platform"
6. Copy the token (starts with `sbp_`)

**Use for**: `SUPABASE_ACCESS_TOKEN` GitHub secret

### 2. Database Connection String
1. Go to: https://supabase.com/dashboard/project/qhibeqcsixitokxllhom
2. Click **Settings** (left sidebar)
3. Click **Database**
4. Scroll to **Connection string**
5. Select **URI** tab
6. Copy the connection string
7. Replace `[YOUR-PASSWORD]` with your database password

**Format**:
```
postgresql://postgres:[YOUR-PASSWORD]@db.qhibeqcsixitokxllhom.supabase.co:5432/postgres
```

**Use for**:
- `STAGING_DATABASE_URL` (if using same project for staging)
- `PRODUCTION_DATABASE_URL` (create separate production project recommended)

**⚠️ Important**: Use the **direct connection** (not pooler) for migrations

### 3. Database Password
If you forgot your database password:
1. Go to: https://supabase.com/dashboard/project/qhibeqcsixitokxllhom/settings/database
2. Scroll to **Database password**
3. Click **Reset database password** if needed
4. **⚠️ Warning**: This will invalidate all existing connections

---

## 🎯 GitHub Secrets Configuration

Here's what to add to GitHub repository secrets:

### Required for CI/CD

#### 1. CODECOV_TOKEN
**Value**: `f595c397-5568-4c77-bee2-a3d0bc275604`
**Status**: ✅ You have this

#### 2. NEXT_PUBLIC_SUPABASE_URL
**Value**: `https://qhibeqcsixitokxllhom.supabase.co`
**Status**: ✅ You have this

#### 3. NEXT_PUBLIC_SUPABASE_ANON_KEY
**Value**: Your anon key (shown above)
**Status**: ✅ You have this

#### 4. SUPABASE_ACCESS_TOKEN
**Value**: Generate from Supabase Dashboard (see instructions above)
**Status**: ⏳ Need to generate

#### 5. STAGING_DATABASE_URL
**Value**: Your database connection string with password
**Status**: ⏳ Need to get password and format

#### 6. PRODUCTION_DATABASE_URL
**Value**: Production database connection string
**Status**: ⏳ Recommended to create separate production project

---

## 📋 Quick Setup Checklist

### Step 1: Add Codecov Token ✅
- [x] You have the token: `f595c397-5568-4c77-bee2-a3d0bc275604`
- [ ] Add to GitHub: https://github.com/TwentyNineEleven/VISION-PLATFORM-V2/settings/secrets/actions/new
  - Name: `CODECOV_TOKEN`
  - Value: `f595c397-5568-4c77-bee2-a3d0bc275604`

### Step 2: Add Supabase Public Credentials
- [x] You have the URL and anon key
- [ ] Add `NEXT_PUBLIC_SUPABASE_URL` to GitHub secrets
- [ ] Add `NEXT_PUBLIC_SUPABASE_ANON_KEY` to GitHub secrets

### Step 3: Generate Supabase Access Token
- [ ] Go to: https://supabase.com/dashboard/account/tokens
- [ ] Generate new token for "GitHub Actions"
- [ ] Add as `SUPABASE_ACCESS_TOKEN` GitHub secret

### Step 4: Get Database Connection String
- [ ] Go to: https://supabase.com/dashboard/project/qhibeqcsixitokxllhom/settings/database
- [ ] Copy connection string (URI format)
- [ ] Note your database password
- [ ] Format: `postgresql://postgres:[PASSWORD]@db.qhibeqcsixitokxllhom.supabase.co:5432/postgres`
- [ ] Add as `STAGING_DATABASE_URL` GitHub secret

### Step 5: Production Setup (Optional - Do Later)
- [ ] Create separate Supabase project for production
- [ ] Get production database URL
- [ ] Add as `PRODUCTION_DATABASE_URL` GitHub secret

---

## 🚀 Quick Add All Secrets

Go to: https://github.com/TwentyNineEleven/VISION-PLATFORM-V2/settings/secrets/actions

Add these secrets one by one:

### 1. CODECOV_TOKEN
```
f595c397-5568-4c77-bee2-a3d0bc275604
```

### 2. NEXT_PUBLIC_SUPABASE_URL
```
https://qhibeqcsixitokxllhom.supabase.co
```

### 3. NEXT_PUBLIC_SUPABASE_ANON_KEY
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoaWJlcWNzaXhpdG9reGxsaG9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNTY5NjAsImV4cCI6MjA3ODYzMjk2MH0.QEdch8efJ7MWHbO_wdSEjaIptnTMh6R7OgZpr-jIoPQ
```

### 4. SUPABASE_ACCESS_TOKEN
**⏳ Generate this**: https://supabase.com/dashboard/account/tokens

### 5. STAGING_DATABASE_URL (if you have database password)
**Format**:
```
postgresql://postgres:[YOUR-PASSWORD]@db.qhibeqcsixitokxllhom.supabase.co:5432/postgres
```

---

## 🔐 Other Configuration Values

### Application URL
**Local**: `http://localhost:3001` (your dev server)
**Staging**: `https://staging.visionplatform.io` (once deployed)
**Production**: `https://app.visionplatform.io` (once deployed)

### Sentry (Error Tracking)
**Status**: ⏳ Not configured yet
To setup:
1. Create account at: https://sentry.io
2. Create new project for "Next.js"
3. Get DSN from project settings
4. Add to `.env.local` and GitHub secrets

### PostHog (Analytics)
**Status**: ⏳ Phase 1.5 - Not configured yet
To setup:
1. Create account at: https://posthog.com
2. Get project API key
3. Add to `.env.local` and GitHub secrets

### Resend (Email)
**Status**: ⏳ Phase 2 - Not configured yet
To setup:
1. Create account at: https://resend.com
2. Get API key
3. Add to `.env.local` and GitHub secrets

---

## 📖 Where to Find What

| What You Need | Where to Find It |
|---------------|------------------|
| Supabase URL | Already in your .env.local ✅ |
| Supabase Anon Key | Already in your .env.local ✅ |
| Supabase Service Role | Already in your .env.local ✅ |
| Supabase Access Token | Generate at: https://supabase.com/dashboard/account/tokens |
| Database Password | Check your Supabase dashboard or reset it |
| Database Connection String | Supabase Project → Settings → Database → Connection String |
| Codecov Token | You already have it ✅ |

---

## ⚠️ Security Notes

1. **Never commit** `.env.local` to git (it's in .gitignore)
2. **Service Role Key** = Full database access - keep secret!
3. **Anon Key** = Safe to use in frontend (RLS protects data)
4. **Database Password** = Treat like a master password
5. **Access Token** = Can manage your Supabase projects

---

## 🆘 Need Help?

**Forgot Database Password?**
- Reset at: https://supabase.com/dashboard/project/qhibeqcsixitokxllhom/settings/database
- ⚠️ This disconnects all existing connections

**Can't Find Access Token?**
- Generate new one at: https://supabase.com/dashboard/account/tokens
- Name it clearly: "GitHub Actions - VISION Platform"

**Lost Supabase Project?**
- All your projects: https://supabase.com/dashboard/projects
- Your project: https://supabase.com/dashboard/project/qhibeqcsixitokxllhom

---

**Quick Start**: Add the three secrets you have (Codecov, Supabase URL, Supabase Anon Key) to GitHub now, then generate the Access Token when you're ready to enable migrations.
