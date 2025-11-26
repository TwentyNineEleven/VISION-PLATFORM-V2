# Test User Login Information

## Quick Reference

| Role | Email | Password |
|------|-------|----------|
| Owner | `owner@visionplatform.org` | `OwnerPass123!` |
| Admin | `admin@visionplatform.org` | `AdminPass123!` |
| Editor | `editor@visionplatform.org` | `EditorPass123!` |
| Viewer | `viewer@visionplatform.org` | `ViewerPass123!` |
| Legacy | `test@visionplatform.org` | `TestPassword123!` |

---

## Test Users by Role

### Owner - Sarah Johnson
- **Email**: `owner@visionplatform.org`
- **Password**: `OwnerPass123!`
- **Title**: Executive Director
- **Capabilities**:
  - Full organization access
  - Manage billing and subscriptions
  - Configure organization settings
  - Manage all team members
  - Access all features and data

### Admin - Michael Chen
- **Email**: `admin@visionplatform.org`
- **Password**: `AdminPass123!`
- **Title**: Operations Manager
- **Capabilities**:
  - Manage team members (except Owner)
  - Create and manage content
  - View all reports and analytics
  - Configure integrations
  - Cannot modify billing or org settings

### Editor - Emily Rodriguez
- **Email**: `editor@visionplatform.org`
- **Password**: `EditorPass123!`
- **Title**: Program Coordinator
- **Capabilities**:
  - Create and edit documents
  - Manage projects and tasks
  - Create assessments
  - View reports
  - Cannot manage team members

### Viewer - David Kim
- **Email**: `viewer@visionplatform.org`
- **Password**: `ViewerPass123!`
- **Title**: Board Member
- **Capabilities**:
  - View documents and reports
  - View projects and tasks
  - Cannot create or edit content
  - Read-only dashboard access

---

## Demo Organization

**Name**: Vision Demo Organization
**Type**: Nonprofit
**Industry**: Social Services

### Pre-loaded Demo Content:
- 5 document folders (Grant Applications, Board Documents, etc.)
- 3 active projects
- 5 sample tasks
- 1 Community Compass assessment with empathy map data
- Sample notifications

---

## How to Set Up Test Users

### Option 1: Run Seed Script (Recommended)
```bash
npx tsx scripts/seed-test-users.ts
```

This creates all test users, the demo organization, and sample content.

### Option 2: Manual Creation
1. Go to Supabase Dashboard > Authentication > Users
2. Create users with the credentials above
3. Run organization seed: `npx tsx scripts/seed-organizations.ts`

---

## Testing Different Roles

### 1. Test Owner Permissions
```
Login: owner@visionplatform.org / OwnerPass123!
Navigate to: /settings/organization
Expected: Full access to all settings, billing, team management
```

### 2. Test Admin Permissions
```
Login: admin@visionplatform.org / AdminPass123!
Navigate to: /settings/team
Expected: Can invite/remove team members, cannot access billing
```

### 3. Test Editor Permissions
```
Login: editor@visionplatform.org / EditorPass123!
Navigate to: /files
Expected: Can upload/edit documents, cannot manage team
```

### 4. Test Viewer Permissions
```
Login: viewer@visionplatform.org / ViewerPass123!
Navigate to: /dashboard
Expected: Read-only view, no create/edit buttons visible
```

---

## API Authentication

### Get Access Token
```bash
curl -X POST 'YOUR_SUPABASE_URL/auth/v1/token?grant_type=password' \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "owner@visionplatform.org",
    "password": "OwnerPass123!"
  }'
```

### Use Token in API Calls
```bash
curl -X GET 'http://localhost:3000/api/v1/organizations' \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

---

## Feature Testing Checklist

### Dashboard (/dashboard)
- [ ] KPI tiles display correctly
- [ ] Recent apps section shows activity
- [ ] Task list shows assigned tasks
- [ ] Navigation works to all sections

### Files (/files)
- [ ] Folder navigation works
- [ ] Document upload (Editor+)
- [ ] Document preview
- [ ] Move documents between folders

### VisionFlow (/visionflow)
- [ ] Projects list and Kanban view
- [ ] Task management
- [ ] Calendar view
- [ ] Plans and workflows

### Community Compass (/community-compass)
- [ ] Assessment creation (Editor+)
- [ ] Empathy map editing
- [ ] Needs prioritization
- [ ] Export functionality

### Settings (/settings)
- [ ] Profile editing (all users)
- [ ] Organization settings (Owner only)
- [ ] Team management (Admin+)
- [ ] Billing (Owner only)

---

## Troubleshooting

### "Invalid login credentials"
- Ensure the seed script ran successfully
- Check Supabase Auth dashboard for user existence
- Verify email is confirmed

### "Unauthorized" errors
- Check organization membership exists
- Verify active_organization_id in user_preferences
- Ensure RLS policies are correctly applied

### Missing demo data
- Re-run seed script: `npx tsx scripts/seed-test-users.ts`
- Check for errors in console output

---

## Related Scripts

```bash
# Create all test users and demo data
npx tsx scripts/seed-test-users.ts

# Verify user setup
npx tsx scripts/verify-user.ts

# Create additional organizations
npx tsx scripts/seed-organizations.ts

# Seed Community Compass data
npx tsx scripts/seed-community-compass.ts

# Test RLS policies
npx tsx scripts/test-rls.ts
```

---

**Last Updated**: November 26, 2025
**Status**: Ready for testing
