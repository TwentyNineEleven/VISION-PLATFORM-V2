# Security Requirements & Guidelines
# VISION Platform

**Last Updated:** 2025-11-19
**Classification:** Critical - All developers must read and follow

---

## Security Principles

### Core Tenets
1. **Never trust user input** - Always validate and sanitize
2. **Principle of least privilege** - Minimal permissions required
3. **Defense in depth** - Multiple layers of security
4. **Fail securely** - Errors should not expose sensitive data
5. **Multi-tenant isolation** - Organizations must be completely separated
6. **Security by default** - Secure configurations out of the box

---

## Multi-Tenant Security (CRITICAL)

### Row-Level Security (RLS)

**All tables MUST have RLS enabled:**

```sql
-- Enable RLS on every table
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
-- ... all tables
```

**Organization Isolation Policy Pattern:**

```sql
-- Standard isolation policy for all organization-scoped tables
CREATE POLICY "org_isolation"
ON table_name
FOR ALL
USING (org_id = auth.organization_id());

-- Helper function to get current user's organization
CREATE OR REPLACE FUNCTION auth.organization_id()
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT org_id
  FROM user_organizations
  WHERE user_id = auth.uid()
  LIMIT 1;
$$;
```

**Testing RLS Policies:**

```typescript
// ALWAYS test RLS policies
describe('RLS Policies', () => {
  it('prevents cross-organization data access', async () => {
    // User from Org A
    const clientA = createClient({ userId: userFromOrgA })
    const { data: dataA } = await clientA.from('grants').select('*')

    // User from Org B
    const clientB = createClient({ userId: userFromOrgB })
    const { data: dataB } = await clientB.from('grants').select('*')

    // Verify no overlap
    expect(dataA.some(item =>
      dataB.find(b => b.id === item.id)
    )).toBe(false)
  })
})
```

---

## Authentication & Authorization

### Authentication Requirements

**Strong Password Policy:**
```typescript
const PASSWORD_REQUIREMENTS = {
  minLength: 12,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  preventCommonPasswords: true,
  preventUserInfo: true, // No email, name in password
}

// Validation with Zod
const passwordSchema = z.string()
  .min(12, 'Password must be at least 12 characters')
  .regex(/[A-Z]/, 'Must contain uppercase letter')
  .regex(/[a-z]/, 'Must contain lowercase letter')
  .regex(/[0-9]/, 'Must contain number')
  .regex(/[^A-Za-z0-9]/, 'Must contain special character')
```

**Account Protection:**
- [ ] Account lockout after 5 failed login attempts
- [ ] Lockout duration: 15 minutes (increases with repeated failures)
- [ ] Session timeout: 30 minutes of inactivity
- [ ] Absolute session timeout: 8 hours
- [ ] Multi-factor authentication (MFA) required for admins
- [ ] MFA available for all users

**Password Reset Flow:**
```typescript
// Secure password reset implementation
async function initiatePasswordReset(email: string) {
  // Generate secure token
  const resetToken = await generateSecureToken() // Crypto-random
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

  // Store hashed token
  await supabase.from('password_resets').insert({
    email,
    token_hash: await hashToken(resetToken),
    expires_at: expiresAt,
    used: false,
  })

  // Send email with token (NEVER log the token)
  await sendPasswordResetEmail(email, resetToken)
}

// Token must be single-use
async function validateResetToken(token: string) {
  const hash = await hashToken(token)
  const { data } = await supabase
    .from('password_resets')
    .select('*')
    .eq('token_hash', hash)
    .eq('used', false)
    .gt('expires_at', new Date())
    .single()

  if (!data) {
    throw new Error('Invalid or expired reset token')
  }

  // Mark as used immediately
  await supabase
    .from('password_resets')
    .update({ used: true, used_at: new Date() })
    .eq('id', data.id)

  return data
}
```

### Authorization (RBAC)

**Role Definitions:**

```typescript
enum OrganizationRole {
  OWNER = 'owner',           // Full access, billing, user management
  ADMIN = 'admin',           // Full access, no billing changes
  STAFF = 'staff',           // Standard access to assigned apps
  BOARD_MEMBER = 'board',    // BoardPortal access, limited other apps
  VOLUNTEER = 'volunteer',   // EventManager access only
  VIEWER = 'viewer',         // Read-only access
}

enum FunderRole {
  FUNDER_ADMIN = 'funder_admin',     // Full portfolio access
  PROGRAM_OFFICER = 'program_officer', // Assigned grantees only
  ANALYST = 'analyst',                 // Read-only analytics
}
```

**Permission Checking:**

```typescript
// ALWAYS check permissions before operations
async function checkPermission(
  userId: string,
  resource: string,
  action: 'read' | 'write' | 'delete'
): Promise<boolean> {
  const { data: membership } = await supabase
    .from('user_organizations')
    .select('role, permissions')
    .eq('user_id', userId)
    .single()

  if (!membership) return false

  // Check role-based permissions
  const rolePermissions = ROLE_PERMISSIONS[membership.role]
  return rolePermissions[resource]?.includes(action) ?? false
}

// Example usage
export async function updateGrant(grantId: string, data: Partial<Grant>) {
  const user = await getCurrentUser()

  if (!await checkPermission(user.id, 'grants', 'write')) {
    throw new ForbiddenError('Insufficient permissions to update grants')
  }

  // Proceed with update
  return await supabase
    .from('grants')
    .update(data)
    .eq('id', grantId)
    .eq('org_id', user.org_id) // Extra safety check
}
```

---

## Input Validation & Sanitization

### Validation Requirements

**ALL user input MUST be validated before processing:**

```typescript
// Define schema for all inputs
const grantProposalSchema = z.object({
  title: z.string().min(3).max(200),
  funder_name: z.string().min(2).max(100),
  amount_requested: z.number().positive().max(10_000_000),
  deadline: z.date().min(new Date()),
  description: z.string().min(100).max(10000),
  org_id: z.string().uuid(),
})

// Validate before processing
export async function createGrant(input: unknown) {
  // Parse and validate
  const result = grantProposalSchema.safeParse(input)

  if (!result.success) {
    return {
      success: false,
      error: 'Invalid grant data',
      details: result.error.format(), // Don't expose to client
    }
  }

  // Use validated data
  const validData = result.data
  // ... proceed with creation
}
```

**Sanitization for User-Generated Content:**

```typescript
import DOMPurify from 'isomorphic-dompurify'

// Sanitize HTML content
function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['p', 'b', 'i', 'u', 'a', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'title'],
    ALLOW_DATA_ATTR: false,
  })
}

// Sanitize for display
function sanitizeForDisplay(input: string): string {
  // Remove any HTML tags
  return input.replace(/<[^>]*>/g, '')
}
```

---

## Database Security

### Query Security

**ALWAYS use parameterized queries (Supabase handles this):**

```typescript
// ✅ CORRECT: Parameterized query
const { data } = await supabase
  .from('grants')
  .select('*')
  .eq('funder_name', userInput)
  .eq('org_id', orgId)

// ❌ NEVER: String concatenation
// const { data } = await supabase.rpc('execute_sql', {
//   sql: `SELECT * FROM grants WHERE funder_name = '${userInput}'`
// })
```

**Prepared Statements for Raw SQL:**

```sql
-- Use prepared statements for custom functions
CREATE OR REPLACE FUNCTION search_grants(
  p_org_id UUID,
  p_query TEXT
)
RETURNS SETOF grants
LANGUAGE sql
STABLE
AS $$
  SELECT *
  FROM grants
  WHERE org_id = p_org_id
    AND (
      title ILIKE '%' || p_query || '%'
      OR description ILIKE '%' || p_query || '%'
    );
$$;
```

### Encryption

**Data at Rest:**
- Database: AES-256 encryption (Supabase default)
- File Storage: AES-256 encryption (Supabase Storage default)
- Backups: Encrypted with separate keys

**Data in Transit:**
- TLS 1.3 for all connections
- Certificate pinning for mobile apps
- No unencrypted HTTP connections allowed

**Sensitive Field Encryption:**

```typescript
// Encrypt PII before storing
import { encrypt, decrypt } from '@vision/utils/crypto'

interface SensitiveData {
  ssn?: string
  tax_id?: string
  bank_account?: string
}

async function storeSensitiveData(data: SensitiveData) {
  const encrypted = {
    ssn_encrypted: data.ssn ? await encrypt(data.ssn) : null,
    tax_id_encrypted: data.tax_id ? await encrypt(data.tax_id) : null,
    bank_account_encrypted: data.bank_account ? await encrypt(data.bank_account) : null,
  }

  return await supabase.from('sensitive_data').insert(encrypted)
}
```

---

## API Security

### Required Security Headers

**All API responses MUST include:**

```typescript
export function setSecurityHeaders(response: Response) {
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  )
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://api.anthropic.com https://api.openai.com;"
  )
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Permissions-Policy',
    'geolocation=(), microphone=(), camera=()'
  )

  return response
}
```

### Rate Limiting

**API Rate Limits:**

```typescript
const RATE_LIMITS = {
  // Per IP address
  anonymous: {
    requests: 100,
    window: 15 * 60 * 1000, // 15 minutes
  },
  // Per authenticated user
  authenticated: {
    requests: 1000,
    window: 15 * 60 * 1000,
  },
  // Auth endpoints (stricter)
  auth: {
    requests: 5,
    window: 15 * 60 * 1000,
  },
  // AI endpoints (cost control)
  ai: {
    requests: 100,
    window: 60 * 60 * 1000, // 1 hour
  },
}

// Implementation
async function checkRateLimit(
  identifier: string,
  limitType: keyof typeof RATE_LIMITS
): Promise<boolean> {
  const limit = RATE_LIMITS[limitType]
  const key = `ratelimit:${limitType}:${identifier}`

  const count = await redis.incr(key)

  if (count === 1) {
    await redis.expire(key, limit.window / 1000)
  }

  return count <= limit.requests
}
```

### CORS Configuration

```typescript
const CORS_CONFIG = {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://app.vision-platform.com', 'https://vision-platform.com']
    : ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['X-Total-Count'],
  credentials: true,
  maxAge: 86400, // 24 hours
}
```

---

## Common Vulnerabilities Prevention

### OWASP Top 10 Checklist

#### 1. Injection
- [x] All inputs validated with Zod
- [x] Parameterized database queries only
- [x] No dynamic SQL construction
- [x] Input sanitization for HTML content

#### 2. Broken Authentication
- [x] Strong password requirements
- [x] Account lockout mechanism
- [x] Session timeout enforced
- [x] Secure password reset flow
- [x] MFA available

#### 3. Sensitive Data Exposure
- [x] HTTPS everywhere (TLS 1.3)
- [x] Encryption at rest (AES-256)
- [x] No sensitive data in logs
- [x] PII encryption for storage

#### 4. XML External Entities (XXE)
- [x] No XML processing (use JSON)
- [x] If XML needed, disable external entities

#### 5. Broken Access Control
- [x] RLS on all tables
- [x] Authorization checks on all endpoints
- [x] Role-based permissions enforced
- [x] No direct object references

#### 6. Security Misconfiguration
- [x] Secure defaults everywhere
- [x] Security headers on all responses
- [x] No debug info in production
- [x] Regular dependency updates

#### 7. Cross-Site Scripting (XSS)
- [x] Input sanitization
- [x] Output encoding
- [x] CSP headers
- [x] DOMPurify for HTML

#### 8. Insecure Deserialization
- [x] Validate all serialized data
- [x] No eval() or similar functions
- [x] Type checking before processing

#### 9. Using Components with Known Vulnerabilities
- [x] Dependabot enabled
- [x] Weekly dependency reviews
- [x] Automated security scanning
- [x] No dependencies with critical CVEs

#### 10. Insufficient Logging & Monitoring
- [x] All auth events logged
- [x] Failed access attempts logged
- [x] Security events monitored
- [x] Real-time alerting

---

## AI-Generated Code Security

### Review Checklist for AI Code

**Before merging any AI-generated code, verify:**

- [ ] Input validation present and comprehensive
- [ ] No hardcoded credentials or API keys
- [ ] Authentication checks on protected routes
- [ ] Authorization checks for resource access
- [ ] SQL queries use parameterized statements
- [ ] Error messages don't expose sensitive data
- [ ] HTTPS enforced for external requests
- [ ] Sensitive data properly encrypted
- [ ] No use of deprecated or vulnerable libraries
- [ ] RLS policies correctly implemented
- [ ] Logging doesn't include PII
- [ ] Rate limiting implemented where needed

### Prohibited Patterns

**AI often generates these insecure patterns - NEVER MERGE:**

```typescript
// ❌ NEVER DO THIS
eval(userInput)
Function(userInput)()
exec(userInput)
dangerouslySetInnerHTML={{ __html: userInput }}

// SQL injection
const query = `SELECT * FROM users WHERE id = '${userId}'`

// Exposing sensitive data
catch (error) {
  return { error: error.stack } // Exposes internals
}

// Hardcoded credentials
const API_KEY = 'sk-1234567890abcdef'

// No input validation
async function createUser(data: any) { // 'any' type!
  return await supabase.from('users').insert(data) // No validation!
}
```

**✅ DO THIS INSTEAD:**

```typescript
// Validated inputs
const userSchema = z.object({ /* ... */ })
const validData = userSchema.parse(input)

// Parameterized queries
await supabase.from('users').select('*').eq('id', userId)

// Safe error handling
catch (error) {
  logger.error('Operation failed', { error, userId }) // Log for debugging
  return { error: 'An error occurred' } // Generic message to user
}

// Environment variables
const API_KEY = process.env.ANTHROPIC_API_KEY

// Proper validation
async function createUser(input: unknown) {
  const validData = userSchema.parse(input)
  return await supabase.from('users').insert(validData)
}
```

---

## Dependency Management

### Security Updates

**Automated Scanning:**
- Dependabot enabled on all repositories
- Weekly dependency update PRs
- Automated security patch merging (minor/patch only)
- Critical CVE notifications to Slack

**Manual Review Process:**
- Major version updates require manual review
- Security advisory review before merging
- Breaking change analysis
- Test suite must pass

**Dependency Audit:**
```bash
# Run before every commit
pnpm audit --audit-level=moderate

# Fix automatically when possible
pnpm audit fix

# Review and update dependencies monthly
pnpm outdated
```

---

## Incident Response Plan

### If Security Issue Discovered

**Immediate Actions (< 1 hour):**
1. Document the issue with full details
2. Assess severity and scope
3. Notify team lead and security contact
4. Implement temporary mitigation if possible
5. Begin detailed investigation

**Short-term Actions (< 24 hours):**
1. Develop comprehensive fix
2. Test fix thoroughly in staging
3. Prepare deployment plan
4. Draft user communication if needed
5. Deploy fix to production
6. Verify fix effectiveness

**Follow-up Actions (< 48 hours):**
1. Post-mortem meeting
2. Document root cause
3. Identify prevention measures
4. Update security documentation
5. Communicate to affected users if required
6. Regulatory notification if legally required

**Notification Thresholds:**
- **Critical (immediate):** Data breach, system compromise
- **High (4 hours):** Authentication bypass, privilege escalation
- **Medium (24 hours):** XSS, CSRF, information disclosure
- **Low (weekly):** Low-risk vulnerabilities, dependency updates

---

## Compliance Requirements

### GDPR Compliance

**User Rights Implementation:**
- [ ] Right to access: Export user data API
- [ ] Right to rectification: Update profile endpoint
- [ ] Right to erasure: Delete account with data scrubbing
- [ ] Right to data portability: JSON export of all data
- [ ] Right to object: Opt-out of non-essential processing

**Data Processing:**
```typescript
// Consent tracking
interface UserConsent {
  user_id: string
  purpose: 'essential' | 'analytics' | 'marketing' | 'ai_processing'
  granted: boolean
  granted_at: Date
  ip_address: string
}

// Data export
async function exportUserData(userId: string): Promise<UserDataExport> {
  return {
    personal_info: await getUserInfo(userId),
    activity_log: await getActivityLog(userId),
    documents: await getUserDocuments(userId),
    grants: await getUserGrants(userId),
    // ... all user data
  }
}

// Data deletion (GDPR right to erasure)
async function deleteUserData(userId: string) {
  // Anonymize instead of hard delete (for audit trail)
  await supabase.from('users').update({
    email: `deleted-${userId}@example.com`,
    name: 'Deleted User',
    deleted_at: new Date(),
  }).eq('id', userId)

  // Scrub PII from related records
  await anonymizeUserActivity(userId)
}
```

### SOC 2 Type II Requirements

**Control Implementation:**
- [ ] Access control: RBAC with audit logging
- [ ] Change management: All changes via PR with review
- [ ] Data backup: Automated daily backups
- [ ] Encryption: TLS 1.3 + AES-256
- [ ] Monitoring: Real-time security monitoring
- [ ] Incident response: Documented procedures
- [ ] Vendor management: Third-party security reviews

---

## Security Testing

### Automated Security Scanning

**Pre-commit Checks:**
```yaml
# .github/workflows/security.yml
- name: Run security checks
  run: |
    pnpm audit --audit-level=moderate
    pnpm run lint:security
    pnpm run test:security
```

**Continuous Monitoring:**
- Snyk for dependency vulnerabilities
- Semgrep for code security patterns
- TruffleHog for secret scanning
- OWASP ZAP for penetration testing

### Manual Security Testing

**Quarterly Security Review:**
- [ ] Penetration testing by third party
- [ ] Code security audit
- [ ] Infrastructure security review
- [ ] Compliance assessment
- [ ] Incident response drill

---

## Secure Development Lifecycle

### Development Phase
1. Threat modeling for new features
2. Security requirements in user stories
3. Secure coding guidelines review
4. Code review with security focus

### Testing Phase
1. Security unit tests
2. Integration security tests
3. Automated vulnerability scanning
4. Manual penetration testing

### Deployment Phase
1. Security configuration review
2. Secrets rotation
3. Deployment checklist verification
4. Post-deployment security validation

### Maintenance Phase
1. Regular dependency updates
2. Security patch monitoring
3. Log review and analysis
4. Incident response readiness

---

**Remember:** Security is everyone's responsibility. When in doubt, ask for a security review before proceeding.

**Last Updated:** 2025-11-19
**Next Review:** 2026-02-19
**Owner:** Ford Aaro / Security Team
