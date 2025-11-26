# Claude Code Remote Access Guide

This guide explains how to provide Claude Code with secure remote access to the VISION Platform V2 project.

## 📋 Overview

The `.env.claude` file contains all necessary environment variables for Claude Code to work with your project remotely. This includes Supabase credentials, API keys, and configuration settings.

## 🔐 Security Best Practices

1. **NEVER commit `.env.claude` to Git** - Already added to `.gitignore`
2. **Share credentials through secure channels only** (encrypted messaging, password managers)
3. **Rotate keys regularly**, especially after sharing or if compromised
4. **Use separate credentials** for development vs production environments
5. **Monitor access logs** in your Supabase dashboard

## 🚀 Quick Start for Remote Sessions

### Option 1: Copy Environment Variables

When starting a remote Claude Code session, provide these essential variables:

```bash
# Core Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://qhibeqcsixitokxllhom.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoaWJlcWNzaXhpdG9reGxsaG9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNTY5NjAsImV4cCI6MjA3ODYzMjk2MH0.QEdch8efJ7MWHbO_wdSEjaIptnTMh6R7OgZpr-jIoPQ
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoaWJlcWNzaXhpdG9reGxsaG9tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzA1Njk2MCwiZXhwIjoyMDc4NjMyOTYwfQ.61mSTmNx_V-D3XLaolEhTObTvIR-JIS9uE-kxRHKW-s
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Option 2: Share Complete Configuration

For full functionality, share the entire `.env.claude` file contents through a secure channel.

## 📦 What's Included

### Required Variables (Minimum Setup)

These are essential for Claude Code to work with the project:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public API key for client-side operations
- `SUPABASE_SERVICE_ROLE_KEY` - Admin key for server-side operations (use with caution)
- `NEXT_PUBLIC_APP_URL` - Application base URL

### Optional Variables (Enhanced Features)

These enable additional functionality but aren't required for basic development:

- **Email (Resend)**: For sending invitations, password resets, notifications
- **Error Tracking (Sentry)**: For production error monitoring
- **Analytics (PostHog)**: For user behavior tracking
- **Rate Limiting (Upstash Redis)**: For API protection
- **Background Jobs (Inngest)**: For async processing
- **AI Processing (OpenAI)**: For AI-powered features
- **Payments (Stripe)**: For subscription management (Phase 6)

## 🛠️ Common Use Cases

### 1. Basic Development Work

**Minimum required:**
```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Use for:**
- Reading/writing code
- Running type checks
- Building components
- Local testing without database operations

### 2. Database Operations

**Required:**
```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_PROJECT_ID=qhibeqcsixitokxllhom
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Use for:**
- Creating/running migrations
- Testing RLS policies
- Seeding data
- Generating TypeScript types

### 3. Full Feature Development

**Required:** All variables in `.env.claude`

**Use for:**
- Email functionality testing
- Payment integration
- AI features
- Background job processing
- Production-like environment

## 🔍 Verification Steps

After providing environment variables to Claude Code, verify the setup:

### 1. Check Environment Variables
```bash
# Verify variables are loaded
node -e "console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)"
```

### 2. Test Supabase Connection
```bash
# Run verification script
npx tsx scripts/verify-user.ts
```

### 3. Test TypeScript Compilation
```bash
# Ensure types are generated and valid
pnpm type-check
```

### 4. Test Development Server
```bash
# Start dev server
pnpm dev
# Should start on http://localhost:3000
```

## 🚨 Troubleshooting

### Issue: "Cannot connect to Supabase"

**Solution:**
1. Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
2. Check `NEXT_PUBLIC_SUPABASE_ANON_KEY` is valid
3. Ensure Supabase project is active (not paused)
4. Check network connectivity

### Issue: "Unauthorized" errors

**Solution:**
1. Verify user has proper organization membership
2. Check RLS policies are configured correctly
3. Ensure `SUPABASE_SERVICE_ROLE_KEY` is provided for admin operations

### Issue: "Type errors" after schema changes

**Solution:**
```bash
# Regenerate TypeScript types
npx supabase gen types typescript --project-id qhibeqcsixitokxllhom > apps/shell/src/types/supabase.ts

# Run type check
pnpm type-check
```

### Issue: Missing environment variables

**Solution:**
1. Verify all required variables are set
2. Restart the development server
3. Check for typos in variable names

## 📊 Monitoring Access

### Supabase Dashboard
Monitor database activity in real-time:
1. Visit: https://supabase.com/dashboard/project/qhibeqcsixitokxllhom
2. Navigate to: Database → Logs
3. Monitor API requests, errors, and performance

### Rate Limiting
If using Upstash Redis, monitor API usage:
1. Check rate limit hits
2. Monitor request patterns
3. Adjust limits if needed

## 🔄 Key Rotation

If credentials are compromised or need rotation:

### Rotate Supabase Keys
1. Go to Supabase Dashboard → Settings → API
2. Click "Generate new anon key"
3. Update `.env.claude` and `.env.local`
4. Redeploy applications using the old key

### Rotate Service Role Key
1. Go to Supabase Dashboard → Settings → API
2. Generate new service role key
3. Update immediately - this bypasses RLS!
4. Test all admin operations

### Rotate API Keys (Resend, Stripe, etc.)
1. Generate new key in respective service dashboard
2. Update `.env.claude` and production environment
3. Monitor for failed requests during transition
4. Revoke old key after verification

## 📝 Development Workflow

### Starting a Remote Session

1. **Provide environment variables** to Claude Code
2. **Verify connection**: Run `pnpm dev`
3. **Check database access**: Run `npx tsx scripts/verify-user.ts`
4. **Begin development**: Claude Code can now access all project resources

### During Development

- Claude Code can read/write code
- Can run migrations and seed data
- Can test features locally
- Can generate TypeScript types
- Can verify RLS policies

### Ending a Session

1. **Review changes**: Check git status
2. **Run tests**: `pnpm test`
3. **Type check**: `pnpm type-check`
4. **Commit work**: Create meaningful commits
5. **Consider key rotation** if session was particularly sensitive

## 🎯 Best Practices

1. **Provide only necessary variables** for the task at hand
2. **Use time-limited access** for sensitive operations
3. **Monitor activity** during remote sessions
4. **Review changes carefully** before committing
5. **Rotate keys regularly** (monthly or after major sessions)
6. **Keep production credentials separate** - never use production keys in development
7. **Document changes** that require environment variable updates
8. **Test thoroughly** before deploying changes

## 📚 Additional Resources

- [Supabase Dashboard](https://supabase.com/dashboard/project/qhibeqcsixitokxllhom)
- [Project README](README.md)
- [Setup Guide](SETUP_COMPLETE.md)
- [Claude Documentation](Claude%20Documentation/)
- [CLAUDE.md](CLAUDE.md) - Claude Code project guidance

## 🆘 Support

If you encounter issues:

1. Check this guide's troubleshooting section
2. Review Supabase logs for errors
3. Verify all environment variables are correct
4. Test connection with verification scripts
5. Check project documentation for specific features

---

**Last Updated**: January 2025
**Project**: VISION Platform V2
**Supabase Project**: qhibeqcsixitokxllhom
