# Testing Framework Documentation

**Version:** 1.0
**Last Updated:** November 12, 2025
**Owner:** Platform Engineering Team

---

## 📋 Testing Philosophy

### Testing Pyramid

```
                    ▲
                   / \
                  /   \
                 / E2E \
                /-------\
               /         \
              / Integration\
             /-------------\
            /               \
           /  Unit Tests     \
          /___________________\

Target Coverage:
- Unit Tests: 70% of test suite
- Integration Tests: 20% of test suite
- E2E Tests: 10% of test suite
```

### Coverage Targets

| Test Type | Target Coverage | Minimum Coverage | Priority Areas |
|-----------|----------------|------------------|----------------|
| **Overall** | 85% | 80% | Critical business logic |
| **Utilities** | 100% | 100% | All helper functions |
| **Components** | 90% | 85% | Interactive components |
| **API Routes** | 95% | 90% | All endpoints |
| **Database** | 100% | 100% | RLS policies, migrations |
| **AI Integration** | 85% | 80% | Cost tracking, error handling |

---

## 🛠️ Testing Stack

### Core Testing Libraries

```json
{
  "devDependencies": {
    // Test Runners & Frameworks
    "vitest": "^1.0.0",
    "playwright": "^1.40.0",

    // React Testing
    "@testing-library/react": "^14.1.0",
    "@testing-library/user-event": "^14.5.0",
    "@testing-library/jest-dom": "^6.1.0",

    // Mocking
    "msw": "^2.0.0",
    "@faker-js/faker": "^8.3.0",

    // Coverage
    "@vitest/coverage-v8": "^1.0.0"
  }
}
```

### Test Configuration

#### Vitest Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
        'dist/',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@vision/ui': path.resolve(__dirname, '../packages/ui/src'),
      '@vision/database': path.resolve(__dirname, '../packages/database/src'),
      '@vision/ai-functions': path.resolve(__dirname, '../packages/ai-functions/src'),
    },
  },
});
```

#### Test Setup File

```typescript
// tests/setup.ts
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key';
process.env.ANTHROPIC_API_KEY = 'test-anthropic-key';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => '/test-path',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock Supabase client
vi.mock('@vision/database', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn(),
      signIn: vi.fn(),
      signOut: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(),
    })),
  })),
}));
```

---

## 🧪 Unit Testing

### 1. Utility Function Tests

```typescript
// lib/utils/date-utils.test.ts
import { describe, it, expect } from 'vitest';
import { formatDeadline, isDeadlineUpcoming, daysUntilDeadline } from './date-utils';

describe('Date Utils', () => {
  describe('formatDeadline', () => {
    it('formats date in MM/DD/YYYY format', () => {
      const date = new Date('2025-12-31');
      expect(formatDeadline(date)).toBe('12/31/2025');
    });

    it('handles invalid dates gracefully', () => {
      expect(formatDeadline(null)).toBe('No deadline');
      expect(formatDeadline(undefined)).toBe('No deadline');
    });
  });

  describe('isDeadlineUpcoming', () => {
    it('returns true for deadlines within 7 days', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(isDeadlineUpcoming(tomorrow)).toBe(true);
    });

    it('returns false for past deadlines', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isDeadlineUpcoming(yesterday)).toBe(false);
    });
  });

  describe('daysUntilDeadline', () => {
    it('calculates days correctly', () => {
      const future = new Date();
      future.setDate(future.getDate() + 5);
      expect(daysUntilDeadline(future)).toBe(5);
    });

    it('returns negative for past dates', () => {
      const past = new Date();
      past.setDate(past.getDate() - 3);
      expect(daysUntilDeadline(past)).toBe(-3);
    });
  });
});
```

### 2. React Component Tests

```typescript
// components/GrantCard.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GrantCard } from './GrantCard';
import { Grant } from '@vision/database/types';

const mockGrant: Grant = {
  id: '123',
  organization_id: 'org-1',
  title: 'Community Garden Grant',
  description: 'Funding for urban agriculture',
  amount_requested: 50000,
  deadline: new Date('2025-12-31'),
  status: 'draft',
  created_at: new Date('2025-01-01'),
  updated_at: new Date('2025-01-15'),
};

describe('GrantCard', () => {
  it('renders grant information correctly', () => {
    render(<GrantCard grant={mockGrant} />);

    expect(screen.getByText('Community Garden Grant')).toBeInTheDocument();
    expect(screen.getByText('Funding for urban agriculture')).toBeInTheDocument();
    expect(screen.getByText('$50,000')).toBeInTheDocument();
  });

  it('displays correct status badge', () => {
    render(<GrantCard grant={mockGrant} />);

    const badge = screen.getByText('Draft');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('badge-draft');
  });

  it('calls onClick handler when card is clicked', () => {
    const handleClick = vi.fn();
    render(<GrantCard grant={mockGrant} onClick={handleClick} />);

    const card = screen.getByRole('article');
    fireEvent.click(card);

    expect(handleClick).toHaveBeenCalledWith(mockGrant);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows deadline warning for upcoming deadlines', () => {
    const upcomingGrant = {
      ...mockGrant,
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
    };

    render(<GrantCard grant={upcomingGrant} />);
    expect(screen.getByText(/due in 3 days/i)).toBeInTheDocument();
  });

  it('disables actions for submitted grants', () => {
    const submittedGrant = { ...mockGrant, status: 'submitted' };
    render(<GrantCard grant={submittedGrant} />);

    const editButton = screen.queryByRole('button', { name: /edit/i });
    expect(editButton).not.toBeInTheDocument();
  });
});
```

### 3. Custom Hook Tests

```typescript
// hooks/useGrants.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGrants } from './useGrants';
import { createClient } from '@vision/database';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useGrants', () => {
  beforeEach(() => {
    queryClient.clear();
  });

  it('fetches grants successfully', async () => {
    const mockGrants = [
      { id: '1', title: 'Grant 1', status: 'draft' },
      { id: '2', title: 'Grant 2', status: 'submitted' },
    ];

    const supabase = createClient();
    vi.mocked(supabase.from('grants').select).mockResolvedValueOnce({
      data: mockGrants,
      error: null,
    });

    const { result } = renderHook(() => useGrants('org-1'), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockGrants);
    expect(result.current.error).toBeNull();
  });

  it('handles errors gracefully', async () => {
    const mockError = new Error('Database connection failed');

    const supabase = createClient();
    vi.mocked(supabase.from('grants').select).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useGrants('org-1'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeDefined();
    expect(result.current.data).toBeUndefined();
  });

  it('refetches data when organization changes', async () => {
    const { result, rerender } = renderHook(
      ({ orgId }) => useGrants(orgId),
      { wrapper, initialProps: { orgId: 'org-1' } }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Change organization
    rerender({ orgId: 'org-2' });

    await waitFor(() => expect(result.current.isFetching).toBe(true));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
```

---

## 🔗 Integration Testing

### 1. API Route Tests

```typescript
// app/api/grants/route.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createMocks } from 'node-mocks-http';
import { GET, POST } from './route';
import { createClient } from '@vision/database';
import { testUtils } from '@/tests/utils';

describe('Grants API', () => {
  let testOrg: string;
  let testUser: string;

  beforeAll(async () => {
    // Set up test database
    const { orgId, userId } = await testUtils.createTestOrganization();
    testOrg = orgId;
    testUser = userId;
  });

  afterAll(async () => {
    // Clean up test data
    await testUtils.cleanupTestOrganization(testOrg);
  });

  describe('GET /api/grants', () => {
    it('returns grants for authenticated user', async () => {
      const { req } = createMocks({
        method: 'GET',
        headers: {
          authorization: `Bearer ${await testUtils.getTestToken(testUser)}`,
        },
      });

      const response = await GET(req as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
    });

    it('returns 401 for unauthenticated requests', async () => {
      const { req } = createMocks({ method: 'GET' });

      const response = await GET(req as any);
      expect(response.status).toBe(401);
    });

    it('filters grants by organization', async () => {
      // Create grant for test org
      await testUtils.createGrant({
        organization_id: testOrg,
        title: 'Test Grant',
      });

      // Create another org and grant
      const { orgId: otherOrg } = await testUtils.createTestOrganization();
      await testUtils.createGrant({
        organization_id: otherOrg,
        title: 'Other Org Grant',
      });

      const { req } = createMocks({
        method: 'GET',
        headers: {
          authorization: `Bearer ${await testUtils.getTestToken(testUser)}`,
        },
      });

      const response = await GET(req as any);
      const data = await response.json();

      // Should only see grants from testOrg
      expect(data.data.every(g => g.organization_id === testOrg)).toBe(true);
      expect(data.data.find(g => g.title === 'Other Org Grant')).toBeUndefined();

      await testUtils.cleanupTestOrganization(otherOrg);
    });
  });

  describe('POST /api/grants', () => {
    it('creates a new grant', async () => {
      const grantData = {
        title: 'New Grant',
        description: 'Test grant description',
        amount_requested: 25000,
        deadline: '2025-12-31',
      };

      const { req } = createMocks({
        method: 'POST',
        headers: {
          authorization: `Bearer ${await testUtils.getTestToken(testUser)}`,
        },
        body: grantData,
      });

      const response = await POST(req as any);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.title).toBe(grantData.title);
      expect(data.data.organization_id).toBe(testOrg);
    });

    it('validates required fields', async () => {
      const { req } = createMocks({
        method: 'POST',
        headers: {
          authorization: `Bearer ${await testUtils.getTestToken(testUser)}`,
        },
        body: {}, // Missing required fields
      });

      const response = await POST(req as any);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain('validation');
    });
  });
});
```

### 2. Database Integration Tests

```typescript
// tests/integration/database/rls-policies.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createClient } from '@vision/database';
import { testUtils } from '@/tests/utils';

describe('Row Level Security Policies', () => {
  let org1: { orgId: string; userId: string };
  let org2: { orgId: string; userId: string };

  beforeAll(async () => {
    org1 = await testUtils.createTestOrganization();
    org2 = await testUtils.createTestOrganization();
  });

  afterAll(async () => {
    await testUtils.cleanupTestOrganization(org1.orgId);
    await testUtils.cleanupTestOrganization(org2.orgId);
  });

  describe('Grants Table', () => {
    it('prevents cross-tenant data access', async () => {
      // Create grant in org1
      const org1Client = await testUtils.getClientForUser(org1.userId);
      const { data: grant } = await org1Client
        .from('grants')
        .insert({
          title: 'Org 1 Grant',
          organization_id: org1.orgId,
        })
        .select()
        .single();

      // Try to access with org2 credentials
      const org2Client = await testUtils.getClientForUser(org2.userId);
      const { data, error } = await org2Client
        .from('grants')
        .select()
        .eq('id', grant.id)
        .single();

      // Should not return data - RLS blocks access
      expect(data).toBeNull();
      expect(error).toBeDefined();
    });

    it('allows access to own organization data', async () => {
      const org1Client = await testUtils.getClientForUser(org1.userId);

      const { data: grant } = await org1Client
        .from('grants')
        .insert({
          title: 'Test Grant',
          organization_id: org1.orgId,
        })
        .select()
        .single();

      const { data: fetchedGrant, error } = await org1Client
        .from('grants')
        .select()
        .eq('id', grant.id)
        .single();

      expect(error).toBeNull();
      expect(fetchedGrant).toBeDefined();
      expect(fetchedGrant.id).toBe(grant.id);
    });

    it('prevents unauthorized updates', async () => {
      // Create grant in org1
      const org1Client = await testUtils.getClientForUser(org1.userId);
      const { data: grant } = await org1Client
        .from('grants')
        .insert({
          title: 'Org 1 Grant',
          organization_id: org1.orgId,
        })
        .select()
        .single();

      // Try to update with org2 credentials
      const org2Client = await testUtils.getClientForUser(org2.userId);
      const { data, error } = await org2Client
        .from('grants')
        .update({ title: 'Hacked!' })
        .eq('id', grant.id);

      // Should fail - RLS blocks update
      expect(error).toBeDefined();
      expect(data).toBeNull();

      // Verify original data unchanged
      const { data: unchanged } = await org1Client
        .from('grants')
        .select()
        .eq('id', grant.id)
        .single();

      expect(unchanged.title).toBe('Org 1 Grant');
    });
  });

  describe('Documents Table', () => {
    it('enforces RLS on document access', async () => {
      const org1Client = await testUtils.getClientForUser(org1.userId);
      const org2Client = await testUtils.getClientForUser(org2.userId);

      // Create document in org1
      const { data: doc } = await org1Client
        .from('documents')
        .insert({
          title: 'Private Document',
          organization_id: org1.orgId,
        })
        .select()
        .single();

      // Org2 should not see it
      const { data: crossTenantAccess } = await org2Client
        .from('documents')
        .select()
        .eq('id', doc.id);

      expect(crossTenantAccess).toHaveLength(0);
    });
  });
});
```

### 3. AI Integration Tests

```typescript
// tests/integration/ai/claude-api.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateGrantProposal, trackAICost } from '@vision/ai-functions';
import { testUtils } from '@/tests/utils';

describe('Claude API Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('generates grant proposal with organization context', async () => {
    const { orgId } = await testUtils.createTestOrganization();

    const result = await generateGrantProposal({
      organizationId: orgId,
      grantOpportunity: 'Environmental conservation grant',
      userPrompt: 'Write a proposal for $50,000',
    });

    expect(result.content).toBeDefined();
    expect(result.content.length).toBeGreaterThan(100);
    expect(result.tokens_used).toBeGreaterThan(0);
    expect(result.cost).toBeGreaterThan(0);

    await testUtils.cleanupTestOrganization(orgId);
  });

  it('tracks AI costs per organization', async () => {
    const { orgId } = await testUtils.createTestOrganization();

    await generateGrantProposal({
      organizationId: orgId,
      grantOpportunity: 'Test grant',
      userPrompt: 'Test prompt',
    });

    const costs = await testUtils.getAICosts(orgId);
    expect(costs.total_cost).toBeGreaterThan(0);
    expect(costs.total_tokens).toBeGreaterThan(0);

    await testUtils.cleanupTestOrganization(orgId);
  });

  it('implements rate limiting', async () => {
    const { orgId } = await testUtils.createTestOrganization();

    // Make multiple rapid requests
    const requests = Array(10).fill(null).map(() =>
      generateGrantProposal({
        organizationId: orgId,
        grantOpportunity: 'Test',
        userPrompt: 'Test',
      })
    );

    const results = await Promise.allSettled(requests);

    // Some should be rate limited
    const rateLimited = results.filter(
      r => r.status === 'rejected' && r.reason.message.includes('rate limit')
    );
    expect(rateLimited.length).toBeGreaterThan(0);

    await testUtils.cleanupTestOrganization(orgId);
  });

  it('handles API errors gracefully', async () => {
    // Mock API failure
    vi.mocked(anthropic.messages.create).mockRejectedValueOnce(
      new Error('API unavailable')
    );

    await expect(
      generateGrantProposal({
        organizationId: 'test-org',
        grantOpportunity: 'Test',
        userPrompt: 'Test',
      })
    ).rejects.toThrow('Failed to generate content');
  });
});
```

---

## 🎭 End-to-End Testing

### 1. Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // Mobile testing
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### 2. E2E Test Examples

```typescript
// tests/e2e/grant-workflow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Grant Management Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('complete grant creation workflow', async ({ page }) => {
    // Navigate to grants
    await page.click('text=Grants');
    await expect(page).toHaveURL('/grants');

    // Create new grant
    await page.click('text=New Grant');
    await expect(page).toHaveURL('/grants/new');

    // Fill out form
    await page.fill('[name="title"]', 'Community Center Grant');
    await page.fill('[name="description"]', 'Funding for new community center');
    await page.fill('[name="amount_requested"]', '100000');
    await page.fill('[name="deadline"]', '2025-12-31');

    // Submit
    await page.click('button:has-text("Create Grant")');

    // Verify success
    await expect(page).toHaveURL(/\/grants\/[a-z0-9-]+$/);
    await expect(page.locator('h1')).toContainText('Community Center Grant');
  });

  test('AI-powered grant proposal generation', async ({ page }) => {
    // Navigate to existing grant
    await page.goto('/grants/test-grant-id/edit');

    // Open AI assistant
    await page.click('button:has-text("Generate with AI")');

    // Fill AI prompt
    await page.fill('[name="ai_prompt"]', 'Write a compelling needs statement');

    // Generate
    await page.click('button:has-text("Generate")');

    // Wait for generation (may take a few seconds)
    await expect(page.locator('[data-testid="ai-output"]')).toBeVisible({ timeout: 10000 });

    // Verify content generated
    const content = await page.locator('[data-testid="ai-output"]').textContent();
    expect(content).toBeTruthy();
    expect(content.length).toBeGreaterThan(100);

    // Insert generated content
    await page.click('button:has-text("Insert")');

    // Verify inserted into editor
    const editorContent = await page.locator('[data-testid="proposal-editor"]').textContent();
    expect(editorContent).toContain(content);
  });

  test('document upload and attachment', async ({ page }) => {
    await page.goto('/grants/test-grant-id/edit');

    // Upload document
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'budget.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('test pdf content'),
    });

    // Wait for upload
    await expect(page.locator('text=budget.pdf')).toBeVisible({ timeout: 5000 });

    // Verify attached
    const attachments = page.locator('[data-testid="attachments"] li');
    await expect(attachments).toHaveCount(1);
    await expect(attachments.first()).toContainText('budget.pdf');
  });

  test('grant status transitions', async ({ page }) => {
    await page.goto('/grants/test-grant-id');

    // Initial status: Draft
    await expect(page.locator('[data-testid="status-badge"]')).toContainText('Draft');

    // Submit grant
    await page.click('button:has-text("Submit")');
    await page.click('button:has-text("Confirm")');

    // Status updated
    await expect(page.locator('[data-testid="status-badge"]')).toContainText('Submitted');

    // Edit button should be disabled
    await expect(page.locator('button:has-text("Edit")')).toBeDisabled();
  });
});
```

### 3. Accessibility Testing

```typescript
// tests/e2e/accessibility.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test('homepage should not have accessibility violations', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('grants page should meet WCAG AA', async ({ page }) => {
    await page.goto('/grants');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('keyboard navigation works', async ({ page }) => {
    await page.goto('/grants');

    // Tab through interactive elements
    await page.keyboard.press('Tab');
    let focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(['A', 'BUTTON', 'INPUT']).toContain(focused);

    // Continue tabbing
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Verify focus visible
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('screen reader landmarks present', async ({ page }) => {
    await page.goto('/grants');

    // Check for proper ARIA landmarks
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('[role="navigation"]')).toBeVisible();
  });
});
```

---

## 🤖 Testing Utilities

### Test Helpers

```typescript
// tests/utils/test-utils.ts
import { createClient } from '@vision/database';
import { faker } from '@faker-js/faker';

export const testUtils = {
  /**
   * Create a test organization with user
   */
  async createTestOrganization() {
    const supabase = createClient();

    const orgId = faker.string.uuid();
    const userId = faker.string.uuid();

    await supabase.from('organizations').insert({
      id: orgId,
      name: faker.company.name(),
      slug: faker.helpers.slugify(faker.company.name()),
      plan_tier: 'basic',
    });

    await supabase.from('user_profiles').insert({
      id: userId,
      organization_id: orgId,
      email: faker.internet.email(),
      full_name: faker.person.fullName(),
      role: 'org_admin',
    });

    return { orgId, userId };
  },

  /**
   * Clean up test organization
   */
  async cleanupTestOrganization(orgId: string) {
    const supabase = createClient();
    await supabase.from('organizations').delete().eq('id', orgId);
  },

  /**
   * Create test grant
   */
  async createGrant(data: Partial<Grant>) {
    const supabase = createClient();
    const { data: grant } = await supabase
      .from('grants')
      .insert({
        title: faker.company.catchPhrase(),
        description: faker.lorem.paragraph(),
        amount_requested: faker.number.int({ min: 10000, max: 100000 }),
        deadline: faker.date.future(),
        status: 'draft',
        ...data,
      })
      .select()
      .single();

    return grant;
  },

  /**
   * Get authenticated client for user
   */
  async getClientForUser(userId: string) {
    const supabase = createClient();
    // Set auth context
    const { data: session } = await supabase.auth.admin.createSession(userId);
    return createClient(session.access_token);
  },

  /**
   * Get test JWT token
   */
  async getTestToken(userId: string) {
    const supabase = createClient();
    const { data } = await supabase.auth.admin.createSession(userId);
    return data.session.access_token;
  },

  /**
   * Get AI costs for organization
   */
  async getAICosts(orgId: string) {
    const supabase = createClient();
    const { data } = await supabase
      .from('ai_usage_logs')
      .select('total_cost:cost.sum(), total_tokens:tokens_used.sum()')
      .eq('organization_id', orgId)
      .single();

    return data;
  },
};
```

### Mock Data Factories

```typescript
// tests/utils/factories.ts
import { faker } from '@faker-js/faker';
import type { Grant, Organization, UserProfile } from '@vision/database/types';

export const factories = {
  organization: (overrides?: Partial<Organization>): Organization => ({
    id: faker.string.uuid(),
    name: faker.company.name(),
    slug: faker.helpers.slugify(faker.company.name()),
    plan_tier: faker.helpers.arrayElement(['basic', 'professional', 'enterprise']),
    subscription_status: 'active',
    settings: {},
    created_at: faker.date.past(),
    updated_at: faker.date.recent(),
    ...overrides,
  }),

  userProfile: (overrides?: Partial<UserProfile>): UserProfile => ({
    id: faker.string.uuid(),
    organization_id: faker.string.uuid(),
    email: faker.internet.email(),
    full_name: faker.person.fullName(),
    role: faker.helpers.arrayElement(['org_admin', 'staff', 'volunteer']),
    avatar_url: faker.image.avatar(),
    created_at: faker.date.past(),
    updated_at: faker.date.recent(),
    ...overrides,
  }),

  grant: (overrides?: Partial<Grant>): Grant => ({
    id: faker.string.uuid(),
    organization_id: faker.string.uuid(),
    title: faker.company.catchPhrase(),
    description: faker.lorem.paragraphs(2),
    amount_requested: faker.number.int({ min: 10000, max: 500000 }),
    amount_awarded: null,
    deadline: faker.date.future(),
    status: faker.helpers.arrayElement(['draft', 'submitted', 'awarded', 'rejected']),
    funder_name: faker.company.name(),
    created_at: faker.date.past(),
    updated_at: faker.date.recent(),
    ...overrides,
  }),
};
```

---

## 📊 Continuous Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  unit-integration-tests:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: supabase/postgres:15.1.0.117
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v3

      - uses: pnpm/action-setup@v2
        with:
          version: 8

      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Run database migrations
        run: pnpm supabase db reset
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/postgres

      - name: Run unit tests
        run: pnpm test:unit

      - name: Run integration tests
        run: pnpm test:integration
        env:
          SUPABASE_URL: http://localhost:54321
          SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  e2e-tests:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Install Playwright browsers
        run: pnpm playwright install --with-deps

      - name: Start Supabase
        run: pnpm supabase start

      - name: Build application
        run: pnpm build

      - name: Run E2E tests
        run: pnpm test:e2e

      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

---

## 🎯 Testing Checklist

### Before Every PR

- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] E2E tests for changed features pass
- [ ] Code coverage meets 80% threshold
- [ ] No accessibility violations
- [ ] RLS policies tested for new tables
- [ ] AI cost tracking tested
- [ ] Error handling tested
- [ ] Edge cases covered

### Before Production Deploy

- [ ] Full E2E test suite passes
- [ ] Load testing completed
- [ ] Security testing passed
- [ ] Accessibility audit passed
- [ ] Database migrations tested
- [ ] Rollback plan tested
- [ ] Monitoring alerts configured

---

## 📚 Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library Documentation](https://testing-library.com/)
- [MSW Documentation](https://mswjs.io/)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Remember:** Tests are documentation. Write tests that clearly communicate intent and make the codebase easier to understand and maintain.
