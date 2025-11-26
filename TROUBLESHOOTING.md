# Troubleshooting Guide

## 🔧 Common Issues & Solutions

### Issue: Webpack ChunkLoadError on Login

**Error Message:**
```
Loading chunk _app-pages-browser_src_lib_supabase_client_ts failed.
ChunkLoadError at __webpack_require__.f.j
```

**Cause:** Hot Module Replacement (HMR) cache issue in development mode

**Solution:**
```bash
# Stop the dev server (Ctrl+C)

# Clear Next.js cache
rm -rf apps/shell/.next

# Restart dev server
pnpm dev
```

**Prevention:**
- This typically happens after pulling new code or switching branches
- Always clear the `.next` cache after major code changes

---

### Issue: "Cannot find module" Errors

**Symptoms:**
- Import errors in browser console
- Module resolution failures

**Solutions:**

1. **Clear all caches:**
   ```bash
   pnpm clean
   rm -rf node_modules/.cache
   pnpm install
   ```

2. **Restart TypeScript server** (in VS Code):
   - Press `Cmd+Shift+P`
   - Type "TypeScript: Restart TS Server"
   - Press Enter

3. **Verify node_modules:**
   ```bash
   pnpm install --force
   ```

---

### Issue: Port Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
```bash
# Find process using port 3000
lsof -ti:3000

# Kill the process
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 pnpm dev
```

---

### Issue: Supabase Connection Errors

**Symptoms:**
- "Invalid JWT token"
- "Network request failed"
- "Failed to fetch"

**Solutions:**

1. **Check environment variables:**
   ```bash
   # Verify .env.local exists and has correct values
   cat .env.local | grep SUPABASE
   ```

2. **Verify Supabase credentials:**
   ```bash
   npx tsx scripts/verify-user.ts
   ```

3. **Check Supabase project status:**
   - Go to: https://supabase.com/dashboard/project/qhibeqcsixitokxllhom
   - Ensure project is active and not paused

---

### Issue: Database Migration Errors

**Symptoms:**
- "Table already exists"
- "Permission denied"
- "Syntax error in SQL"

**Solutions:**

1. **Check migration status:**
   ```bash
   # In Supabase SQL Editor, run:
   SELECT * FROM schema_migrations ORDER BY version DESC LIMIT 10;
   ```

2. **For "table already exists" errors:**
   - VisionFlow migrations use `CREATE TABLE IF NOT EXISTS`
   - They should not fail on existing tables
   - If they do, check for typos or schema conflicts

3. **For permission errors:**
   ```bash
   # Ensure you're logged in
   npx supabase login
   ```

---

### Issue: TypeScript Errors After Type Generation

**Symptoms:**
- Red squiggly lines in VS Code
- Type mismatch errors
- "Cannot find name" errors

**Solutions:**

1. **Restart TypeScript server:**
   - VS Code: `Cmd+Shift+P` → "TypeScript: Restart TS Server"

2. **Verify types were generated:**
   ```bash
   ls -lh apps/shell/src/types/supabase.ts
   ```

3. **Re-generate types:**
   ```bash
   npx supabase gen types typescript --project-id qhibeqcsixitokxllhom > apps/shell/src/types/supabase.ts
   ```

4. **Check for circular dependencies:**
   ```bash
   pnpm type-check
   ```

---

### Issue: Login Not Working

**Symptoms:**
- "Invalid login credentials"
- "Email not confirmed"
- Login button does nothing

**Solutions:**

1. **Verify test user exists:**
   ```bash
   npx tsx scripts/verify-user.ts
   ```

2. **Check credentials:**
   - Email: `test@visionplatform.org`
   - Password: `TestPassword123!`
   - See: [TEST_USER_CREDENTIALS.md](TEST_USER_CREDENTIALS.md)

3. **Check browser console:**
   - Open DevTools (F12)
   - Look for errors in Console tab
   - Check Network tab for failed requests

4. **Clear browser cache:**
   - Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
   - Or clear all site data in DevTools

---

### Issue: VisionFlow Routes Not Found (404)

**Symptoms:**
- 404 error when accessing `/visionflow/*`
- "Page not found"

**Solutions:**

1. **Verify routes exist:**
   ```bash
   ls -la apps/shell/src/app/visionflow/
   ```

2. **Check navigation config:**
   ```bash
   grep -A 10 "visionflow" apps/shell/src/lib/nav-config.ts
   ```

3. **Restart dev server:**
   ```bash
   # Stop server (Ctrl+C)
   pnpm dev
   ```

---

### Issue: Build Failures

**Error Types:**
- TypeScript compilation errors
- Missing dependencies
- Out of memory errors

**Solutions:**

1. **Clear all caches:**
   ```bash
   pnpm clean
   rm -rf apps/shell/.next
   rm -rf node_modules/.cache
   pnpm install
   ```

2. **Check for TypeScript errors:**
   ```bash
   pnpm type-check
   ```

3. **Increase Node memory (if needed):**
   ```bash
   NODE_OPTIONS="--max-old-space-size=4096" pnpm build
   ```

4. **Build without cache:**
   ```bash
   rm -rf apps/shell/.next
   pnpm build
   ```

---

### Issue: Hot Reload Not Working

**Symptoms:**
- Changes not reflecting in browser
- Need to manually refresh
- "Waiting for file changes before starting..."

**Solutions:**

1. **Restart dev server:**
   ```bash
   # Stop (Ctrl+C) and restart
   pnpm dev
   ```

2. **Check file watchers limit (Linux/Mac):**
   ```bash
   # Mac
   sudo sysctl -w kern.maxfiles=65536
   sudo sysctl -w kern.maxfilesperproc=65536

   # Linux
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
   sudo sysctl -p
   ```

3. **Disable browser extensions:**
   - Try in incognito/private mode
   - Disable ad blockers temporarily

---

## 🔍 Debug Commands

### Check Server Status
```bash
# Is the server running?
curl -s http://localhost:3000 | head -20

# Check running processes
lsof -ti:3000
```

### Check Database Connection
```bash
# Verify user and connection
npx tsx scripts/verify-user.ts

# Test RLS policies
npx tsx scripts/test-rls.ts
```

### Check Environment
```bash
# Node version (should be 20+)
node --version

# pnpm version (should be 10.18.1+)
pnpm --version

# Check environment variables
cat .env.local
```

### Validate Code
```bash
# TypeScript
pnpm type-check

# ESLint
pnpm lint

# Color system
pnpm validate:colors

# Component structure
pnpm validate:components
```

---

## 📚 Useful Resources

- **VisionFlow Setup**: [VISIONFLOW_SETUP_COMPLETE.md](VISIONFLOW_SETUP_COMPLETE.md)
- **Test User**: [TEST_USER_CREDENTIALS.md](TEST_USER_CREDENTIALS.md)
- **Next Steps**: [NEXT_STEPS_SUMMARY.md](NEXT_STEPS_SUMMARY.md)
- **Supabase Dashboard**: https://supabase.com/dashboard/project/qhibeqcsixitokxllhom

---

## 🆘 Still Having Issues?

1. **Check the console output** - Errors are usually descriptive
2. **Look at browser DevTools** - Console and Network tabs
3. **Review the logs** - Check terminal output for stack traces
4. **Clear everything** - When in doubt, clean slate:
   ```bash
   pnpm clean
   rm -rf apps/shell/.next
   rm -rf node_modules
   pnpm install
   pnpm dev
   ```

---

**Last Updated:** November 24, 2025
