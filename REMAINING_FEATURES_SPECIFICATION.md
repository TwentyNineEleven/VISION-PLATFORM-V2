# VISION Platform V2 - Remaining Features Specification

**Document Version**: 1.0
**Last Updated**: November 24, 2025
**Status**: Planning Document

---

## Table of Contents

1. [Production Hardening Requirements](#1-production-hardening-requirements)
2. [Core Integration Specifications](#2-core-integration-specifications)
3. [Application Module Specifications](#3-application-module-specifications)
4. [Advanced Features Specifications](#4-advanced-features-specifications)
5. [Implementation Estimates](#5-implementation-estimates)

---

## 1. PRODUCTION HARDENING REQUIREMENTS

### **1.1 Error Tracking & Monitoring**

#### **Objective**
Implement comprehensive error tracking and application monitoring for production reliability.

#### **Requirements**

**Error Tracking Service**:
- [ ] Set up Sentry (recommended) or alternative (Datadog, Rollbar)
- [ ] Configure error boundaries in React components
- [ ] Capture unhandled errors and exceptions
- [ ] Track API errors with context
- [ ] Source map upload for production debugging
- [ ] User context in error reports
- [ ] Performance monitoring integration

**Implementation Details**:
```typescript
// src/lib/monitoring/sentry.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay(),
  ],
});

// Error boundary component
// src/components/ErrorBoundary.tsx
```

**Logging System**:
- [ ] Implement structured logging (Winston or Pino)
- [ ] Log levels: error, warn, info, debug
- [ ] Contextual logging (user, org, action)
- [ ] Log aggregation (CloudWatch, LogDNA)
- [ ] Log retention policy

**Implementation Details**:
```typescript
// src/lib/logger.ts
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: { colorize: true }
  }
});

// Usage
logger.info({ userId, orgId, action: 'document.upload' }, 'Document uploaded');
logger.error({ err, userId }, 'Failed to process document');
```

**Effort Estimate**: 3-4 days
**Priority**: High

---

### **1.2 Automated Testing**

#### **Objective**
Achieve 70-80% test coverage for core functionality with unit, integration, and E2E tests.

#### **Requirements**

**Unit Tests** (Target: 80% coverage):
- [ ] Service layer tests (all 14 services)
- [ ] Utility function tests
- [ ] React hook tests
- [ ] Component logic tests
- [ ] Database helper function tests

**Files to Test**:
```
src/services/
  ├── documentService.ts
  ├── folderService.ts
  ├── organizationService.ts
  ├── teamService.ts
  ├── profileService.ts
  ├── notificationService.ts
  └── ... (11 services total)

src/lib/
  ├── utils.ts
  ├── upload.ts
  ├── toast.ts
  └── validation.ts

src/hooks/
  └── (custom hooks)
```

**Example Test**:
```typescript
// src/services/__tests__/documentService.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { documentService } from '../documentService';

describe('documentService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('uploadDocument', () => {
    it('should upload a document successfully', async () => {
      const file = new File(['content'], 'test.pdf');
      const result = await documentService.upload(file, {
        organizationId: 'org-123',
        folderId: 'folder-456',
      });

      expect(result).toHaveProperty('id');
      expect(result.name).toBe('test.pdf');
    });

    it('should reject files over 15MB', async () => {
      const largeFile = new File(['x'.repeat(16 * 1024 * 1024)], 'large.pdf');

      await expect(
        documentService.upload(largeFile, { organizationId: 'org-123' })
      ).rejects.toThrow('File size exceeds 15MB');
    });
  });
});
```

**Integration Tests**:
- [ ] API endpoint tests (all 16 endpoints)
- [ ] Authentication flow tests
- [ ] Database operation tests
- [ ] File upload/download tests
- [ ] Supabase integration tests

**Example Test**:
```typescript
// src/app/api/v1/documents/__tests__/route.test.ts
import { describe, it, expect } from 'vitest';
import { GET, POST } from '../route';

describe('/api/v1/documents', () => {
  it('GET should return user documents', async () => {
    const request = new Request('http://localhost/api/v1/documents');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('documents');
    expect(Array.isArray(data.documents)).toBe(true);
  });

  it('POST should upload a document', async () => {
    const formData = new FormData();
    formData.append('file', new File(['content'], 'test.pdf'));

    const request = new Request('http://localhost/api/v1/documents', {
      method: 'POST',
      body: formData,
    });

    const response = await POST(request);
    expect(response.status).toBe(201);
  });
});
```

**E2E Tests** (Playwright or Cypress):
- [ ] User registration flow
- [ ] Login flow
- [ ] Document upload flow
- [ ] Folder creation flow
- [ ] Team invitation flow
- [ ] Organization creation flow
- [ ] Bulk operations flow

**Example Test**:
```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test('user can sign up and log in', async ({ page }) => {
  // Sign up
  await page.goto('/signup');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'SecurePass123!');
  await page.fill('[name="name"]', 'Test User');
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL('/dashboard');

  // Log out
  await page.click('[data-testid="user-menu"]');
  await page.click('text=Sign out');

  // Log in
  await page.goto('/signin');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'SecurePass123!');
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL('/dashboard');
});

test('user can upload a document', async ({ page }) => {
  await page.goto('/files');

  await page.click('text=Upload');
  await page.setInputFiles('[type="file"]', './fixtures/test.pdf');
  await page.fill('[name="name"]', 'Test Document');
  await page.click('button:has-text("Upload")');

  await expect(page.locator('text=Test Document')).toBeVisible();
});
```

**Test Configuration**:
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
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

**Effort Estimate**: 5-7 days
**Priority**: High

---

### **1.3 Security Hardening**

#### **Objective**
Implement production-grade security measures beyond current RLS policies.

#### **Requirements**

**Rate Limiting**:
- [ ] Per-user rate limits (API calls per minute)
- [ ] Per-organization rate limits
- [ ] Per-IP rate limits for auth endpoints
- [ ] Configurable limits by endpoint
- [ ] Rate limit headers in responses

**Implementation Details**:
```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  analytics: true,
});

export async function middleware(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1';
  const { success, limit, reset, remaining } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        }
      }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
```

**CSRF Protection**:
- [ ] CSRF tokens for state-changing operations
- [ ] Double submit cookie pattern
- [ ] SameSite cookie attribute
- [ ] Origin/Referer validation

**Content Security Policy**:
- [ ] Strict CSP headers
- [ ] Script nonce generation
- [ ] Allowed domains configuration
- [ ] Report-only mode for testing

**Implementation Details**:
```typescript
// next.config.ts
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline';
      style-src 'self' 'unsafe-inline';
      img-src 'self' blob: data: https:;
      font-src 'self';
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      upgrade-insecure-requests;
    `.replace(/\s{2,}/g, ' ').trim()
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
];

export default {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};
```

**Additional Security**:
- [ ] API request validation (Zod schemas)
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (React escaping + CSP)
- [ ] Secure headers (Helmet.js patterns)
- [ ] Session timeout configuration
- [ ] Password strength requirements
- [ ] Account lockout after failed attempts

**Effort Estimate**: 2-3 days
**Priority**: High

---

### **1.4 CI/CD Pipeline**

#### **Objective**
Automate testing, building, and deployment processes.

#### **Requirements**

**GitHub Actions Workflow**:
- [ ] Automated testing on PR
- [ ] Automated linting on PR
- [ ] Automated type checking on PR
- [ ] Build verification on PR
- [ ] Automated deployment on merge to main
- [ ] Environment-specific deployments (dev, staging, prod)
- [ ] Database migration automation
- [ ] Rollback capability

**Implementation Details**:
```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: 20
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Run linter
        run: pnpm lint

      - name: Run type check
        run: pnpm type-check

      - name: Run tests
        run: pnpm test:ci

      - name: Upload coverage
        uses: codecov/codecov-action@v3

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: 20
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Build application
        run: pnpm build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build
          path: apps/shell/.next

  deploy-staging:
    needs: build
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel (staging)
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          scope: ${{ secrets.VERCEL_ORG_ID }}

  deploy-production:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run database migrations
        run: |
          npx supabase db push --project-ref ${{ secrets.SUPABASE_PROJECT_REF }}

      - name: Deploy to Vercel (production)
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          scope: ${{ secrets.VERCEL_ORG_ID }}
```

**Effort Estimate**: 2-3 days
**Priority**: High

---

### **1.5 Monitoring & Analytics**

#### **Objective**
Implement comprehensive application and user monitoring.

#### **Requirements**

**Application Monitoring**:
- [ ] Set up application performance monitoring
- [ ] Monitor API response times
- [ ] Track error rates
- [ ] Database query performance
- [ ] Memory usage tracking
- [ ] Uptime monitoring

**User Analytics**:
- [ ] Set up PostHog or Mixpanel
- [ ] Track user events (page views, actions)
- [ ] Funnel analysis (signup, onboarding)
- [ ] Feature usage tracking
- [ ] Retention metrics
- [ ] User session recording (optional)

**Implementation Details**:
```typescript
// src/lib/analytics/posthog.ts
import posthog from 'posthog-js';

export const initAnalytics = () => {
  if (typeof window !== 'undefined') {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') posthog.debug();
      },
    });
  }
};

export const trackEvent = (event: string, properties?: Record<string, any>) => {
  posthog.capture(event, properties);
};

// Usage
trackEvent('document_uploaded', {
  documentId: doc.id,
  fileSize: doc.size,
  fileType: doc.type,
});
```

**Business Metrics Dashboard**:
- [ ] User signup rate
- [ ] Active users (DAU, WAU, MAU)
- [ ] Document upload volume
- [ ] Organization creation rate
- [ ] Feature adoption rates
- [ ] User retention cohorts

**Effort Estimate**: 2-3 days
**Priority**: Medium-High

---

## 2. CORE INTEGRATION SPECIFICATIONS

### **2.1 Email Integration**

#### **Objective**
Implement transactional email system for user communications.

#### **Requirements**

**Email Service Provider**:
- [ ] Choose provider: **Resend** (recommended), SendGrid, or AWS SES
- [ ] Set up account and verify domain
- [ ] Configure API keys
- [ ] Set up email templates

**Email Types to Implement**:

1. **Welcome Email**
   - Sent after user registration
   - Include getting started guide
   - Link to onboarding

2. **Organization Invitation**
   - Sent when user is invited to org
   - Include org logo and branding
   - Secure accept link with token
   - Expiration notice (7 days)

3. **Password Reset**
   - Sent when user requests password reset
   - Secure reset link with token
   - Link expiration time

4. **Notification Digest**
   - Daily or weekly summary
   - Recent activity
   - Pending items
   - Unread notifications

5. **Activity Notifications** (Optional)
   - Document shared with you
   - Mentioned in comment
   - Task assigned
   - Deadline reminder

**Implementation Details**:
```typescript
// src/lib/email/resend.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendInvitationEmail = async ({
  to,
  organizationName,
  organizationLogo,
  inviterName,
  inviteToken,
  message,
}: {
  to: string;
  organizationName: string;
  organizationLogo?: string;
  inviterName: string;
  inviteToken: string;
  message?: string;
}) => {
  const acceptUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${inviteToken}`;

  await resend.emails.send({
    from: 'VISION Platform <noreply@visionplatform.io>',
    to,
    subject: `You've been invited to join ${organizationName}`,
    html: InvitationEmailTemplate({
      organizationName,
      organizationLogo,
      inviterName,
      acceptUrl,
      message,
    }),
  });
};
```

**Email Templates** (React Email):
```typescript
// src/emails/InvitationEmail.tsx
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface InvitationEmailProps {
  organizationName: string;
  organizationLogo?: string;
  inviterName: string;
  acceptUrl: string;
  message?: string;
}

export const InvitationEmail = ({
  organizationName,
  organizationLogo,
  inviterName,
  acceptUrl,
  message,
}: InvitationEmailProps) => (
  <Html>
    <Head />
    <Preview>You've been invited to join {organizationName}</Preview>
    <Body style={main}>
      <Container style={container}>
        {organizationLogo && (
          <Img
            src={organizationLogo}
            width="48"
            height="48"
            alt={organizationName}
            style={logo}
          />
        )}
        <Heading style={h1}>
          Join {organizationName} on VISION Platform
        </Heading>
        <Text style={text}>
          {inviterName} has invited you to join {organizationName} on VISION Platform.
        </Text>
        {message && (
          <Section style={messageBox}>
            <Text style={messageText}>"{message}"</Text>
          </Section>
        )}
        <Section style={buttonContainer}>
          <Button style={button} href={acceptUrl}>
            Accept Invitation
          </Button>
        </Section>
        <Text style={text}>
          This invitation will expire in 7 days.
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          If you weren't expecting this invitation, you can ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
);

const main = { /* styles */ };
// ... more styles
```

**Update Existing Services**:
```typescript
// src/services/emailService.ts (replace console.log with actual sends)
import { sendInvitationEmail, sendWelcomeEmail, sendPasswordResetEmail } from '@/lib/email/resend';

export const emailService = {
  async sendInvitation(params) {
    await sendInvitationEmail(params);
  },

  async sendWelcome(params) {
    await sendWelcomeEmail(params);
  },

  async sendPasswordReset(params) {
    await sendPasswordResetEmail(params);
  },
};
```

**Testing**:
- [ ] Test all email templates in development
- [ ] Verify deliverability
- [ ] Check spam scores
- [ ] Test on multiple email clients
- [ ] Validate all links work
- [ ] Check unsubscribe links

**Effort Estimate**: 3-5 days
**Priority**: High

---

### **2.2 Real-Time Notifications**

#### **Objective**
Implement real-time updates using Supabase Realtime.

#### **Requirements**

**Real-Time Features**:
1. **Live Notifications**
   - New notification appears instantly
   - Notification count updates
   - Badge updates

2. **Live Activity Feed**
   - Document activity updates
   - Team member activity
   - Organization events

3. **Presence Indicators** (Optional)
   - Show who's online
   - Show who's viewing a document
   - Typing indicators

**Implementation Details**:
```typescript
// src/hooks/useRealtimeNotifications.ts
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useOrganization } from '@/contexts/OrganizationContext';

export const useRealtimeNotifications = () => {
  const { activeOrganization } = useOrganization();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!activeOrganization) return;

    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `organization_id=eq.${activeOrganization.id}`,
        },
        (payload) => {
          setNotifications((prev) => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeOrganization]);

  return notifications;
};
```

**Update Components**:
```typescript
// src/components/navigation/NotificationDropdown.tsx
import { useRealtimeNotifications } from '@/hooks/useRealtimeNotifications';

export const NotificationDropdown = () => {
  const realtimeNotifications = useRealtimeNotifications();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Merge realtime with existing
    setNotifications((prev) => [...realtimeNotifications, ...prev]);
  }, [realtimeNotifications]);

  // ... rest of component
};
```

**Presence Implementation**:
```typescript
// src/hooks/usePresence.ts
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export const usePresence = (documentId: string) => {
  const [presentUsers, setPresentUsers] = useState([]);

  useEffect(() => {
    const channel = supabase.channel(`document:${documentId}`);

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        setPresentUsers(Object.values(state).flat());
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        console.log('User joined:', newPresences);
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        console.log('User left:', leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: supabase.auth.user()?.id,
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, [documentId]);

  return presentUsers;
};
```

**Effort Estimate**: 3-4 days
**Priority**: Medium

---

### **2.3 AI Document Processing**

#### **Objective**
Implement AI-powered document analysis and enrichment.

#### **Requirements**

**AI Provider Selection**:
- Option 1: **OpenAI** (GPT-4, recommended for quality)
- Option 2: **Anthropic** (Claude, excellent for long documents)
- Option 3: **Open-source** (LLaMA via Replicate/Together)

**AI Features**:

1. **Document Summarization**
   - Generate 2-3 sentence summary
   - Extract key points
   - Store in `ai_summary` field

2. **Keyword Extraction**
   - Extract 5-10 relevant keywords
   - Store in `ai_keywords` array

3. **Topic Classification**
   - Identify main topics/themes
   - Store in `ai_topics` array

4. **Entity Recognition**
   - Extract people, organizations, locations
   - Store in `ai_entities` JSONB

5. **Sentiment Analysis**
   - Determine document sentiment
   - Store in `ai_sentiment` field

**Implementation Details**:
```typescript
// src/lib/ai/openai.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const analyzeDocument = async (text: string) => {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: `You are a document analysis assistant. Analyze the provided document text and return:
1. A concise 2-3 sentence summary
2. 5-10 relevant keywords
3. 3-5 main topics
4. Named entities (people, organizations, locations)
5. Overall sentiment (positive/negative/neutral)

Return the analysis as JSON.`
      },
      {
        role: 'user',
        content: text,
      }
    ],
    response_format: { type: 'json_object' },
  });

  return JSON.parse(completion.choices[0].message.content);
};

// src/services/documentService.ts (add AI processing)
export const processDocumentWithAI = async (documentId: string) => {
  // Get document
  const doc = await getDocument(documentId);

  // Extract text (already implemented)
  const text = await extractText(doc.storage_path);

  // Analyze with AI
  const analysis = await analyzeDocument(text);

  // Update document
  await supabase
    .from('documents')
    .update({
      ai_summary: analysis.summary,
      ai_keywords: analysis.keywords,
      ai_topics: analysis.topics,
      ai_entities: analysis.entities,
      ai_sentiment: analysis.sentiment,
      ai_processing_status: 'completed',
      ai_processed_at: new Date().toISOString(),
    })
    .eq('id', documentId);
};
```

**Background Processing**:
```typescript
// src/lib/queue/document-processor.ts
// Use Inngest, BullMQ, or similar for background jobs

import { Inngest } from 'inngest';

const inngest = new Inngest({ name: 'VISION Platform' });

export const processDocument = inngest.createFunction(
  { name: 'Process Document with AI' },
  { event: 'document.uploaded' },
  async ({ event, step }) => {
    await step.run('Extract text', async () => {
      return extractText(event.data.documentId);
    });

    await step.run('AI analysis', async () => {
      return processDocumentWithAI(event.data.documentId);
    });

    await step.run('Update search index', async () => {
      return indexDocument(event.data.documentId);
    });
  }
);
```

**AI Cost Management**:
- [ ] Implement usage tracking
- [ ] Set monthly budget limits
- [ ] Queue processing (avoid API rate limits)
- [ ] Cache AI results
- [ ] Only process text documents (skip images unless OCR)

**Effort Estimate**: 5-7 days
**Priority**: Medium

---

### **2.4 Webhook System**

#### **Objective**
Enable third-party integrations via webhooks.

#### **Requirements**

**Webhook Configuration**:
- [ ] Webhook endpoint management
- [ ] Event subscription
- [ ] Retry logic (3 retries with exponential backoff)
- [ ] Webhook signing (HMAC signatures)
- [ ] Webhook logs

**Events to Support**:
- `document.uploaded`
- `document.updated`
- `document.deleted`
- `folder.created`
- `member.invited`
- `member.joined`
- `organization.updated`

**Implementation Details**:
```typescript
// src/lib/webhooks/sender.ts
import crypto from 'crypto';

interface WebhookPayload {
  event: string;
  data: any;
  timestamp: string;
  organization_id: string;
}

export const sendWebhook = async (
  url: string,
  secret: string,
  payload: WebhookPayload
) => {
  const body = JSON.stringify(payload);
  const signature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': signature,
        'X-Webhook-Event': payload.event,
      },
      body,
    });

    // Log webhook
    await logWebhook({
      url,
      event: payload.event,
      status: response.status,
      response_body: await response.text(),
    });

    return response.ok;
  } catch (error) {
    // Log error
    await logWebhook({
      url,
      event: payload.event,
      status: 0,
      error: error.message,
    });

    // Retry logic
    return false;
  }
};

// Usage in document upload
await sendWebhook(
  webhook.url,
  webhook.secret,
  {
    event: 'document.uploaded',
    data: {
      document_id: document.id,
      name: document.name,
      size: document.size,
    },
    timestamp: new Date().toISOString(),
    organization_id: document.organization_id,
  }
);
```

**Database Schema**:
```sql
-- Add to migrations
CREATE TABLE webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  secret TEXT NOT NULL,
  events TEXT[] NOT NULL,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_id UUID REFERENCES webhooks(id) ON DELETE CASCADE,
  event TEXT NOT NULL,
  status INTEGER,
  response_body TEXT,
  error TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Effort Estimate**: 2-3 days
**Priority**: Low-Medium

---

## 3. APPLICATION MODULE SPECIFICATIONS

This section details the specifications for building each of the 20 planned applications. Each app follows a consistent pattern.

### **Application Development Pattern**

Each application module should follow this structure:

```
apps/shell/src/
├── app/
│   └── apps/
│       └── [app-slug]/
│           ├── page.tsx              # Main app page
│           ├── layout.tsx            # App-specific layout
│           └── [feature]/            # Feature pages
│               └── page.tsx
├── components/
│   └── apps/
│       └── [app-slug]/               # App-specific components
│           ├── Dashboard.tsx
│           ├── [Feature]Form.tsx
│           └── [Feature]List.tsx
├── services/
│   └── apps/
│       └── [appSlug]Service.ts       # Business logic
└── types/
    └── apps/
        └── [appSlug].ts              # TypeScript types

supabase/migrations/
└── [timestamp]_create_[app_slug]_tables.sql
```

---

### **3.1 Ops360 (Task/Project Management)**

#### **Priority**: 1 (Build First)
#### **Effort Estimate**: 2-3 weeks

#### **Description**
Task and project management application for coordinating day-to-day operations.

#### **Features**

**Core Features**:
- [ ] Projects with descriptions, dates, owners
- [ ] Tasks with subtasks, assignments, due dates
- [ ] Task statuses (To Do, In Progress, Done)
- [ ] Priority levels (Low, Medium, High, Urgent)
- [ ] Kanban board view
- [ ] List view with filtering/sorting
- [ ] Calendar view
- [ ] Task comments and updates
- [ ] File attachments to tasks
- [ ] Task dependencies (blocked by)
- [ ] Time tracking (optional)
- [ ] Task templates

**Database Schema**:
```sql
CREATE TABLE ops360_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES users(id),
  status TEXT DEFAULT 'active', -- active, completed, archived
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

CREATE TABLE ops360_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES ops360_projects(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  parent_task_id UUID REFERENCES ops360_tasks(id), -- for subtasks
  title TEXT NOT NULL,
  description TEXT,
  assigned_to UUID REFERENCES users(id),
  created_by UUID REFERENCES users(id),
  status TEXT DEFAULT 'todo', -- todo, in_progress, done
  priority TEXT DEFAULT 'medium', -- low, medium, high, urgent
  due_date TIMESTAMP,
  completed_at TIMESTAMP,
  estimated_hours DECIMAL(5,2),
  actual_hours DECIMAL(5,2),
  tags TEXT[],
  order_index INTEGER DEFAULT 0, -- for custom ordering
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

CREATE TABLE ops360_task_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES ops360_tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  comment TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ops360_task_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES ops360_tasks(id) ON DELETE CASCADE,
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE ops360_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE ops360_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ops360_task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ops360_task_attachments ENABLE ROW LEVEL SECURITY;

-- Example policy
CREATE POLICY "Users can view projects in their organization"
  ON ops360_projects FOR SELECT
  USING (is_organization_member(organization_id));

-- Add indexes
CREATE INDEX idx_ops360_tasks_project ON ops360_tasks(project_id);
CREATE INDEX idx_ops360_tasks_assigned ON ops360_tasks(assigned_to);
CREATE INDEX idx_ops360_tasks_status ON ops360_tasks(status);
```

**API Endpoints**:
- `GET /api/v1/apps/ops360/projects` - List projects
- `POST /api/v1/apps/ops360/projects` - Create project
- `GET /api/v1/apps/ops360/projects/[id]` - Get project
- `PATCH /api/v1/apps/ops360/projects/[id]` - Update project
- `DELETE /api/v1/apps/ops360/projects/[id]` - Delete project
- `GET /api/v1/apps/ops360/tasks` - List tasks
- `POST /api/v1/apps/ops360/tasks` - Create task
- `PATCH /api/v1/apps/ops360/tasks/[id]` - Update task
- `DELETE /api/v1/apps/ops360/tasks/[id]` - Delete task
- `POST /api/v1/apps/ops360/tasks/[id]/comments` - Add comment

**UI Components**:
- ProjectList (with filters)
- ProjectCard
- ProjectForm (create/edit)
- KanbanBoard (drag-and-drop)
- TaskCard
- TaskDetailModal
- TaskForm
- TaskList (with filters/sorting)
- CalendarView
- CommentThread

**Key Technologies**:
- `@dnd-kit/core` for drag-and-drop Kanban
- React Hook Form for forms
- React Query for data fetching
- Date-fns for date manipulation

---

### **3.2 MetricMap (KPI Tracking)**

#### **Priority**: 2 (Build Second)
#### **Effort Estimate**: 2-3 weeks

#### **Description**
KPI tracking and dashboard application for monitoring organizational performance.

#### **Features**

**Core Features**:
- [ ] Define KPIs with targets
- [ ] Data entry (manual or API)
- [ ] Visualization (line charts, bar charts, gauges)
- [ ] Goal tracking
- [ ] Alerts for thresholds
- [ ] Custom dashboards
- [ ] Time-series data
- [ ] Comparison views (YoY, MoM)
- [ ] Export reports

**Database Schema**:
```sql
CREATE TABLE metricmap_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  unit TEXT, -- %, $, count, etc.
  target_value DECIMAL(12,2),
  frequency TEXT, -- daily, weekly, monthly, quarterly, annually
  category TEXT, -- financial, programmatic, operational
  owner_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

CREATE TABLE metricmap_data_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_id UUID REFERENCES metricmap_metrics(id) ON DELETE CASCADE,
  value DECIMAL(12,2) NOT NULL,
  date DATE NOT NULL,
  notes TEXT,
  entered_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE metricmap_dashboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  layout JSONB, -- dashboard configuration
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE metricmap_dashboard_widgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dashboard_id UUID REFERENCES metricmap_dashboards(id) ON DELETE CASCADE,
  metric_id UUID REFERENCES metricmap_metrics(id),
  widget_type TEXT, -- line_chart, bar_chart, gauge, number
  config JSONB, -- widget-specific configuration
  position JSONB, -- { x, y, w, h }
  created_at TIMESTAMP DEFAULT NOW()
);

-- RLS and indexes
ALTER TABLE metricmap_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE metricmap_data_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE metricmap_dashboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE metricmap_dashboard_widgets ENABLE ROW LEVEL SECURITY;
```

**API Endpoints**:
- `GET /api/v1/apps/metricmap/metrics` - List metrics
- `POST /api/v1/apps/metricmap/metrics` - Create metric
- `POST /api/v1/apps/metricmap/metrics/[id]/data` - Add data point
- `GET /api/v1/apps/metricmap/metrics/[id]/data` - Get time-series data
- `GET /api/v1/apps/metricmap/dashboards` - List dashboards
- `POST /api/v1/apps/metricmap/dashboards` - Create dashboard

**UI Components**:
- MetricList
- MetricForm
- DataEntryForm
- LineChart (using Recharts or Chart.js)
- BarChart
- GaugeChart
- DashboardBuilder (drag-and-drop)
- DashboardView
- ExportButton

**Key Technologies**:
- `recharts` or `chart.js` for visualizations
- `react-grid-layout` for dashboard builder
- React Query for data fetching

---

### **3.3 Community Compass (Surveys/Listening)**

#### **Priority**: 3 (Build Third)
#### **Effort Estimate**: 2-3 weeks

#### **Description**
Survey and community listening tool for gathering stakeholder feedback.

#### **Features**

**Core Features**:
- [ ] Survey builder (drag-and-drop)
- [ ] Question types (multiple choice, text, rating, matrix)
- [ ] Logic branching (skip logic)
- [ ] Survey distribution (link, email)
- [ ] Response collection
- [ ] Response analysis
- [ ] Export results (CSV, PDF)
- [ ] Anonymous responses (optional)
- [ ] Survey templates

**Database Schema**:
```sql
CREATE TABLE community_compass_surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'draft', -- draft, active, closed
  anonymous BOOLEAN DEFAULT false,
  allow_multiple_responses BOOLEAN DEFAULT false,
  created_by UUID REFERENCES users(id),
  published_at TIMESTAMP,
  closed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE community_compass_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id UUID REFERENCES community_compass_surveys(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL, -- multiple_choice, text, rating, matrix
  options JSONB, -- for multiple choice, rating scale
  required BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  logic JSONB, -- skip logic configuration
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE community_compass_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id UUID REFERENCES community_compass_surveys(id) ON DELETE CASCADE,
  respondent_email TEXT, -- if not anonymous
  respondent_name TEXT,
  ip_address INET,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE community_compass_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  response_id UUID REFERENCES community_compass_responses(id) ON DELETE CASCADE,
  question_id UUID REFERENCES community_compass_questions(id) ON DELETE CASCADE,
  answer_text TEXT,
  answer_value INTEGER, -- for ratings
  answer_options TEXT[], -- for multiple choice
  created_at TIMESTAMP DEFAULT NOW()
);

-- RLS
ALTER TABLE community_compass_surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_compass_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_compass_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_compass_answers ENABLE ROW LEVEL SECURITY;
```

**API Endpoints**:
- `GET /api/v1/apps/community-compass/surveys` - List surveys
- `POST /api/v1/apps/community-compass/surveys` - Create survey
- `GET /api/v1/apps/community-compass/surveys/[id]` - Get survey
- `POST /api/v1/apps/community-compass/surveys/[id]/questions` - Add question
- `GET /api/v1/apps/community-compass/surveys/[id]/responses` - Get responses
- `POST /api/v1/apps/community-compass/surveys/[id]/submit` - Submit response (public)

**UI Components**:
- SurveyBuilder (drag-and-drop)
- QuestionEditor
- SurveyPreview
- SurveyShareModal
- ResponseViewer
- AnalyticsDashboard
- ExportButton

**Key Technologies**:
- `@dnd-kit/core` for survey builder
- React Hook Form for question editing
- Chart.js for response visualization

---

### **3.4-3.20 Remaining Applications**

The remaining 17 applications follow similar patterns:

**VOICE Phase**:
- **Stakeholdr** - Stakeholder mapping (network diagrams, influence matrix)

**INSPIRE Phase**:
- **VisionVerse** - Mission/vision co-creation (collaborative editing)
- **ThinkGrid** - Idea generation (brainstorming boards)

**STRATEGIZE Phase**:
- **PathwayPro** - Logic models (visual flowcharts)
- **Architex** - Program architecture (workflow diagrams)
- **EquiFrame** - Equity assessment (scorecards, checklists)
- **FundFlo** - Revenue planning (financial models)

**INITIATE Phase**:
- **LaunchPath** - Implementation planning (Gantt charts)
- **FundGrid** - Budget builder (spreadsheet-like interface)

**OPERATE Phase**:
- **CapacityIQ** - Capacity assessment (surveys, scorecards)

**SUSTAIN Phase**:
- **FundingFramer** - Grant writing (document editor, templates)
- **ImpactWeave** - Impact storytelling (story builder, media library)

**Each app requires**:
- 3-5 database tables
- 5-10 API endpoints
- 10-15 UI components
- 1 service module
- Type definitions

**Total effort for all 20 apps**: 40-60 weeks (parallelizable with team)

---

## 4. ADVANCED FEATURES SPECIFICATIONS

### **4.1 Advanced Analytics & Reporting**

#### **Objective**
Provide comprehensive analytics and reporting capabilities across the platform.

#### **Features**
- [ ] Organization analytics dashboard
- [ ] User activity reports
- [ ] Document usage statistics
- [ ] Application adoption metrics
- [ ] Custom report builder
- [ ] Scheduled reports (email)
- [ ] Data export (CSV, Excel, PDF)

**Effort Estimate**: 3-4 weeks
**Priority**: Low-Medium

---

### **4.2 Collaboration Features**

#### **Objective**
Enable team collaboration beyond current features.

#### **Features**
- [ ] Comments on any entity (docs, tasks, etc.)
- [ ] @mentions with notifications
- [ ] Activity streams
- [ ] Team chat/messaging
- [ ] Collaborative editing (real-time)

**Effort Estimate**: 4-5 weeks
**Priority**: Medium

---

### **4.3 Mobile Applications**

#### **Objective**
Native mobile apps for iOS and Android.

#### **Approach**
- React Native for cross-platform
- Expo for development workflow
- Share business logic with web

#### **Features**
- [ ] Authentication
- [ ] Dashboard
- [ ] Document viewing
- [ ] Task management
- [ ] Notifications
- [ ] Offline mode

**Effort Estimate**: 8-12 weeks
**Priority**: Low

---

### **4.4 Third-Party Integrations**

#### **Objective**
Connect with commonly used nonprofit tools.

#### **Integrations**
- [ ] Google Workspace (Drive, Calendar, Meet)
- [ ] Microsoft 365 (OneDrive, Outlook, Teams)
- [ ] Slack
- [ ] Zoom
- [ ] Salesforce (for CRM)
- [ ] QuickBooks (for financials)
- [ ] Mailchimp (for email marketing)
- [ ] Zapier (for custom integrations)

**Effort Estimate**: 1-2 weeks per integration
**Priority**: Medium (start with Google/Microsoft)

---

### **4.5 White-Label & Multi-Tenant SaaS**

#### **Objective**
Allow organizations to brand the platform as their own.

#### **Features**
- [ ] Custom domains per organization
- [ ] Custom branding (beyond current logo/colors)
- [ ] Branded email templates
- [ ] Custom login pages
- [ ] Embeddable widgets

**Effort Estimate**: 2-3 weeks
**Priority**: Low

---

### **4.6 API & Developer Platform**

#### **Objective**
Public API for third-party developers.

#### **Features**
- [ ] RESTful API with OpenAPI spec
- [ ] API key management
- [ ] Rate limiting per key
- [ ] API documentation portal
- [ ] Webhooks
- [ ] SDK libraries (JS, Python)

**Effort Estimate**: 3-4 weeks
**Priority**: Medium

---

## 5. IMPLEMENTATION ESTIMATES

### **Summary Table**

| Category | Features | Effort | Priority |
|----------|----------|--------|----------|
| **Production Hardening** | Testing, monitoring, CI/CD, security | 2-3 weeks | HIGH |
| **Core Integrations** | Email, real-time, AI, webhooks | 2-3 weeks | HIGH |
| **First 3 Apps** | Ops360, MetricMap, Community Compass | 6-8 weeks | HIGH |
| **Remaining 17 Apps** | All other planned applications | 34-51 weeks | MEDIUM |
| **Advanced Features** | Analytics, collaboration, mobile, integrations | 16-24 weeks | LOW-MEDIUM |

### **Timeline to MVP**

**Phase 1**: Production Hardening (2-3 weeks)
- Week 1: Error tracking, logging, monitoring
- Week 2: Automated testing
- Week 3: CI/CD, security, documentation

**Phase 2**: Core Integrations (2-3 weeks)
- Week 4: Email integration
- Week 5: Real-time notifications + AI processing
- Week 6: Webhooks (optional)

**Phase 3**: First Applications (6-8 weeks)
- Weeks 7-8: Ops360
- Weeks 9-10: MetricMap
- Weeks 11-12: Community Compass
- Weeks 13-14: Polish, testing, documentation

**Total to MVP**: 12-14 weeks (3-3.5 months)

### **Timeline to Full Platform (v1.0)**

Continuing from MVP:
- Months 4-5: Next 5 applications
- Months 6-7: Next 5 applications
- Months 8-9: Final 7 applications
- Month 10: Advanced features
- Month 11: Mobile apps (if prioritized)
- Month 12: Polish, testing, security audit

**Total to v1.0**: 12 months from today

### **Resource Requirements**

**For MVP (3-4 months)**:
- 1 Full-stack developer: 100%
- 1 Designer: 25% (UI polish, email templates)
- 1 QA: 25% (testing)

**For Full Platform (12 months)**:
- 2-3 Full-stack developers
- 1 Designer: 50%
- 1 QA: 50%
- 1 DevOps: 25%

---

**Document End**
**Version**: 1.0
**Last Updated**: November 24, 2025
**Status**: Planning Document
