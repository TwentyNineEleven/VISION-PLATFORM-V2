# Phase 2: Testing Guide

**Date:** January 24, 2025

## Pre-Testing Setup

### 1. Apply Migrations
```bash
# Via Supabase Dashboard or CLI
# Ensure migrations are applied in order:
# 1. 20240101000001_create_users_tables.sql (Phase 1)
# 2. 20240102000001_create_organizations_tables.sql (Phase 2)
# 3. 20240102000002_organization_rls_policies.sql (Phase 2)
```

### 2. Configure Environment
```bash
# Ensure .env.local has:
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Install Dependencies
```bash
pnpm install
```

### 4. Build & Start
```bash
pnpm build
pnpm dev
```

---

## Type-Check Validation

```bash
cd apps/shell
pnpm type-check
```

**Expected:** No TypeScript errors

---

## Manual Testing Checklist

### ✅ Test 1: User Signup & Auto-Organization Creation

**Steps:**
1. Navigate to `/signup`
2. Create new account: `test@example.com` / password / "Test User"
3. Submit form

**Expected Results:**
- [ ] User created successfully
- [ ] Personal organization created (`Test User's Organization`)
- [ ] User is Owner of organization
- [ ] Organization set as active in user preferences
- [ ] Redirected to dashboard

**Verify in Supabase:**
```sql
-- Check users table
SELECT * FROM users WHERE email = 'test@example.com';

-- Check organizations table
SELECT * FROM organizations WHERE owner_id = '<user_id>';

-- Check organization_members table
SELECT * FROM organization_members WHERE user_id = '<user_id>';

-- Check user_preferences
SELECT * FROM user_preferences WHERE user_id = '<user_id>';
```

---

### ✅ Test 2: Create Additional Organization

**Steps:**
1. Sign in as test user
2. Call API: `POST /api/v1/organizations`
```json
{
  "name": "Second Organization",
  "industry": "Technology"
}
```

**Expected Results:**
- [ ] Organization created
- [ ] User automatically added as Owner
- [ ] Organization becomes active
- [ ] Returns organization data with ID

**API Test:**
```bash
# Get auth token from browser DevTools (Application > Cookies)
curl -X POST http://localhost:3000/api/v1/organizations \
  -H "Content-Type: application/json" \
  -H "Cookie: sb-<project>-auth-token=<token>" \
  -d '{"name":"Second Organization","industry":"Technology"}'
```

---

### ✅ Test 3: List User Organizations

**Steps:**
1. Call API: `GET /api/v1/organizations`

**Expected Results:**
- [ ] Returns array of organizations
- [ ] Shows user's role in each
- [ ] Includes lastAccessed timestamp
- [ ] Both organizations listed

**API Test:**
```bash
curl http://localhost:3000/api/v1/organizations \
  -H "Cookie: sb-<project>-auth-token=<token>"
```

---

### ✅ Test 4: Get Organization Details

**Steps:**
1. Call API: `GET /api/v1/organizations/<org_id>`

**Expected Results:**
- [ ] Returns organization details
- [ ] Includes user's role
- [ ] Shows all organization fields

---

### ✅ Test 5: Update Organization

**Steps:**
1. Call API: `PATCH /api/v1/organizations/<org_id>`
```json
{
  "mission": "Building the future",
  "website": "https://example.com"
}
```

**Expected Results:**
- [ ] Organization updated
- [ ] Returns updated data
- [ ] Audit log entry created
- [ ] Only Owner/Admin can update

**Verify Audit:**
```sql
SELECT * FROM organization_audit_log 
WHERE organization_id = '<org_id>' 
ORDER BY created_at DESC;
```

---

### ✅ Test 6: Invite Team Member

**Steps:**
1. Call API: `POST /api/v1/organizations/<org_id>/invites`
```json
{
  "email": "teammate@example.com",
  "role": "Editor",
  "message": "Welcome to the team!"
}
```

**Expected Results:**
- [ ] Invite created in database
- [ ] Secure token generated
- [ ] Email sent via Supabase Auth
- [ ] Status = 'pending'
- [ ] Expires in 7 days

**Verify:**
```sql
SELECT * FROM organization_invites 
WHERE organization_id = '<org_id>';
```

---

### ✅ Test 7: List Pending Invites

**Steps:**
1. Call API: `GET /api/v1/organizations/<org_id>/invites`

**Expected Results:**
- [ ] Returns all invites
- [ ] Shows status, email, role
- [ ] Expired invites marked as expired
- [ ] Only Owner/Admin can view

---

### ✅ Test 8: Get Invite by Token (Public)

**Steps:**
1. Get token from database or email
2. Call API: `GET /api/v1/invites/<token>`

**Expected Results:**
- [ ] Returns invite details (public endpoint)
- [ ] Shows organization name
- [ ] Shows inviter name
- [ ] Shows isValid status
- [ ] Works without authentication

---

### ✅ Test 9: Accept Invite

**Steps:**
1. Sign up/sign in as invited user
2. Call API: `POST /api/v1/invites/<token>`

**Expected Results:**
- [ ] Membership created
- [ ] User added to organization with correct role
- [ ] Invite status = 'accepted'
- [ ] accepted_at timestamp set
- [ ] Organization set as active (if first org)

**Verify:**
```sql
SELECT * FROM organization_members 
WHERE user_id = '<invited_user_id>' 
AND organization_id = '<org_id>';
```

---

### ✅ Test 10: List Organization Members

**Steps:**
1. Call API: `GET /api/v1/organizations/<org_id>/members`

**Expected Results:**
- [ ] Returns all active members
- [ ] Shows name, email, role
- [ ] Shows joined date
- [ ] Sorted by joined_at

---

### ✅ Test 11: Update Member Role

**Steps:**
1. Call API: `PATCH /api/v1/organizations/<org_id>/members/<member_id>`
```json
{
  "role": "Admin"
}
```

**Expected Results:**
- [ ] Member role updated
- [ ] Only Owner/Admin can update
- [ ] Cannot change own role
- [ ] Only Owner can change Owner role

---

### ✅ Test 12: Remove Member

**Steps:**
1. Call API: `DELETE /api/v1/organizations/<org_id>/members/<member_id>`

**Expected Results:**
- [ ] Member soft deleted
- [ ] deleted_at timestamp set
- [ ] Cannot remove self
- [ ] Only Owner can remove Owner/Admin

**Verify:**
```sql
SELECT * FROM organization_members 
WHERE id = '<member_id>';
-- Should have deleted_at set
```

---

### ✅ Test 13: Resend Invite

**Steps:**
1. Call API: `POST /api/v1/organizations/<org_id>/invites/<invite_id>`

**Expected Results:**
- [ ] resend_count incremented
- [ ] last_sent_at updated
- [ ] Email sent again
- [ ] Only pending invites can be resent

---

### ✅ Test 14: Cancel Invite

**Steps:**
1. Call API: `DELETE /api/v1/organizations/<org_id>/invites/<invite_id>`

**Expected Results:**
- [ ] Invite status = 'cancelled'
- [ ] No longer appears in pending invites
- [ ] Token invalid for acceptance

---

### ✅ Test 15: Delete Organization

**Steps:**
1. Call API: `DELETE /api/v1/organizations/<org_id>`

**Expected Results:**
- [ ] Organization soft deleted
- [ ] deleted_at timestamp set
- [ ] Only Owner can delete
- [ ] Active org switched if deleted
- [ ] Members still exist (soft delete cascades)

**Verify:**
```sql
SELECT * FROM organizations WHERE id = '<org_id>';
-- Should have deleted_at set
```

---

## RLS Policy Testing

### Test Row-Level Security

**Test 1: User can only see their organization memberships**
```sql
-- As user A, try to query user B's memberships
SELECT * FROM organization_members WHERE user_id = '<user_b_id>';
-- Should return empty (RLS blocks)
```

**Test 2: User cannot see organizations they're not members of**
```sql
-- As user A, try to query org they don't belong to
SELECT * FROM organizations WHERE id = '<other_org_id>';
-- Should return empty
```

**Test 3: User cannot update organizations without proper role**
```sql
-- As Editor, try to update organization
UPDATE organizations SET name = 'Hacked' WHERE id = '<org_id>';
-- Should fail (RLS blocks)
```

**Test 4: Invite tokens work without authentication**
```sql
-- Public access to valid invite
SELECT * FROM organization_invites WHERE token = '<valid_token>';
-- Should work (invite_token_valid function)
```

---

## React Component Testing

### Test useOrganization Hook

**Component Test:**
```tsx
import { useOrganization } from '@/contexts/OrganizationContext';

function TestComponent() {
  const {
    activeOrganization,
    userOrganizations,
    currentRole,
    canManageMembers,
    switchOrganization,
  } = useOrganization();

  return (
    <div>
      <p>Active: {activeOrganization?.name}</p>
      <p>Role: {currentRole}</p>
      <p>Can Manage: {canManageMembers ? 'Yes' : 'No'}</p>
      <p>Org Count: {userOrganizations.length}</p>
    </div>
  );
}
```

**Expected:**
- [ ] Shows active organization
- [ ] Shows correct role
- [ ] Permission helpers work
- [ ] Organization list populated

---

### Test OrganizationSwitcher

**Steps:**
1. Add `<OrganizationSwitcher />` to a page
2. Click dropdown
3. Select different organization
4. Page reloads

**Expected:**
- [ ] Shows current org with logo/icon
- [ ] Shows all user's organizations
- [ ] Active org highlighted
- [ ] Role displayed for each
- [ ] Switching works
- [ ] Loading states show

---

## Performance Testing

### Test Query Performance

```sql
EXPLAIN ANALYZE 
SELECT * FROM organizations 
WHERE id = '<org_id>' AND deleted_at IS NULL;
-- Should use index

EXPLAIN ANALYZE
SELECT om.*, u.* FROM organization_members om
JOIN users u ON u.id = om.user_id
WHERE om.organization_id = '<org_id>' 
AND om.deleted_at IS NULL;
-- Should use indexes efficiently
```

---

## Security Testing

### Test 1: Unauthorized Access
- [ ] Try all endpoints without auth token → 401
- [ ] Try accessing other org's data → 403 or empty
- [ ] Try updating with wrong role → 403

### Test 2: SQL Injection
- [ ] Try malicious inputs in org name
- [ ] Try SQL in email field
- [ ] Verify all inputs sanitized

### Test 3: Token Security
- [ ] Invite tokens are random & secure
- [ ] Tokens expire after 7 days
- [ ] Used tokens cannot be reused

---

## Edge Cases

### Test 1: Expired Invites
- [ ] Invite expires after configured time
- [ ] Auto-expire function runs
- [ ] Cannot accept expired invite

### Test 2: Duplicate Invites
- [ ] Cannot invite existing member
- [ ] Cannot create duplicate pending invite
- [ ] Email validation case-insensitive

### Test 3: Last Organization
- [ ] Deleting last org handled gracefully
- [ ] active_organization_id set to null
- [ ] User can create new org

### Test 4: Concurrent Updates
- [ ] Multiple users editing same org
- [ ] Optimistic locking via updated_at
- [ ] Conflicts handled

---

## Automated Test Suite

### Unit Tests to Write

```typescript
// organizationService.test.ts
describe('organizationService', () => {
  it('creates organization with user as owner')
  it('lists user organizations with roles')
  it('switches active organization')
  it('validates organization data')
  it('handles errors gracefully')
});

// teamService.test.ts
describe('teamService', () => {
  it('invites member with secure token')
  it('accepts valid invite')
  it('rejects expired invite')
  it('prevents duplicate invites')
  it('updates member role')
});

// API tests
describe('Organization API', () => {
  it('requires authentication')
  it('enforces RLS policies')
  it('respects role permissions')
  it('validates input data')
});
```

---

## Test Results Log

### TypeScript Check
```bash
$ cd apps/shell && pnpm type-check
Result: ___________
Errors: ___________
```

### Build Test
```bash
$ pnpm build
Result: ___________
Time: ___________
```

### Manual Tests Passed
- [ ] Test 1: Signup & Auto-Org
- [ ] Test 2: Create Org
- [ ] Test 3: List Orgs
- [ ] Test 4: Get Org Details
- [ ] Test 5: Update Org
- [ ] Test 6: Invite Member
- [ ] Test 7: List Invites
- [ ] Test 8: Get Invite (Public)
- [ ] Test 9: Accept Invite
- [ ] Test 10: List Members
- [ ] Test 11: Update Role
- [ ] Test 12: Remove Member
- [ ] Test 13: Resend Invite
- [ ] Test 14: Cancel Invite
- [ ] Test 15: Delete Org

### RLS Tests Passed
- [ ] Member isolation
- [ ] Organization isolation
- [ ] Role-based updates
- [ ] Public invite access

### Component Tests Passed
- [ ] useOrganization hook
- [ ] OrganizationSwitcher

### Security Tests Passed
- [ ] Auth required
- [ ] RLS enforced
- [ ] Input sanitized
- [ ] Tokens secure

---

## Issues Found

| # | Description | Severity | Status | Fix |
|---|-------------|----------|--------|-----|
| 1 |  |  |  |  |
| 2 |  |  |  |  |

---

## Test Completion

- **Tests Run:** __/__
- **Tests Passed:** __/__
- **Tests Failed:** __/__
- **Coverage:** __%

**Phase 2 Testing Status:** □ In Progress | □ Complete | □ Blocked

**Tested By:** _____________
**Date:** _____________
**Sign-off:** _____________
