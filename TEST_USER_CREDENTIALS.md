# Test User Login Information

## 🔐 Test Credentials

### Primary Test User
- **Email**: `test@visionplatform.org`
- **Password**: `TestPassword123!`
- **Name**: Sarah Johnson
- **User ID**: `b56a00b7-a47c-438d-ab5a-6f54480beb5d`

### User Details
- ✅ Email Confirmed: Yes
- ✅ Authentication: Working
- ✅ Organizations: 3 organizations (Owner role)
  - Green Earth Initiative
  - Hope Foundation
  - Community Health Partners
- ✅ Active Organization: Green Earth Initiative (`2670cb2f-0bc3-42a3-afe5-7530b338dcb9`)

---

## 🚀 How to Login

### Via UI
1. Go to: http://localhost:3000/signin
2. Enter email: `test@visionplatform.org`
3. Enter password: `TestPassword123!`
4. Click "Sign In"

### Via API (cURL)
```bash
curl -X POST 'https://qhibeqcsixitokxllhom.supabase.co/auth/v1/token?grant_type=password' \
  -H "apikey: ${NEXT_PUBLIC_SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@visionplatform.org",
    "password": "TestPassword123!"
  }'
```

### Via Supabase Client (JavaScript)
```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const { data, error } = await supabase.auth.signInWithPassword({
  email: 'test@visionplatform.org',
  password: 'TestPassword123!'
});
```

---

## 🧪 Verify User Script

Run this command to verify the test user setup:

```bash
npx tsx scripts/verify-user.ts
```

This will check:
- ✓ User exists in `auth.users`
- ✓ User record in `public.users`
- ✓ Organization memberships
- ✓ User preferences
- ✓ Authentication works

---

## 📊 Available Organizations

The test user has **Owner** role in these organizations:

1. **Green Earth Initiative** (Active)
   - ID: `2670cb2f-0bc3-42a3-afe5-7530b338dcb9`
   - Role: Owner

2. **Hope Foundation**
   - Role: Owner

3. **Community Health Partners**
   - Role: Owner

You can switch organizations in the UI using the organization switcher in the top navigation.

---

## 🔧 Testing VisionFlow

Once you've logged in, you can test VisionFlow features:

### 1. Access VisionFlow Dashboard
```
http://localhost:3000/visionflow/dashboard
```

### 2. View Tasks
```
http://localhost:3000/visionflow/tasks
```

### 3. Create a Test Task (API)
```bash
# First, get your access token from login
# Then use it in the Authorization header:

curl -X POST 'http://localhost:3000/api/v1/apps/visionflow/tasks' \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test VisionFlow Task",
    "description": "Testing the VisionFlow integration",
    "status": "NOT_STARTED",
    "priority": "MEDIUM"
  }'
```

---

## 🛡️ Security Notes

- This is a **TEST USER** for development only
- Do not use these credentials in production
- The password follows the platform's security requirements:
  - Minimum 8 characters
  - Contains uppercase letter
  - Contains lowercase letter
  - Contains number
  - Contains special character

---

## 📝 Related Scripts

- **Verify User**: `npx tsx scripts/verify-user.ts`
- **Seed Organizations**: `npx tsx scripts/seed-organizations.ts`
- **Test RLS**: `npx tsx scripts/test-rls.ts`

---

## 💡 Quick Start Testing Flow

1. **Login**:
   ```
   http://localhost:3000/signin
   Email: test@visionplatform.org
   Password: TestPassword123!
   ```

2. **Navigate to Dashboard**:
   ```
   http://localhost:3000/dashboard
   ```

3. **Access VisionFlow** (after DB setup):
   ```
   http://localhost:3000/visionflow/dashboard
   ```

4. **Create Your First Task**:
   - Click "VisionFlow" in the navigation
   - Go to "My Tasks"
   - Click "Create Task"

---

**Last Verified**: November 24, 2025
**Status**: ✅ Working and authenticated successfully
