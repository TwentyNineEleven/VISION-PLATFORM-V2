# AGENT START PROMPT: PAGE 1 - DASHBOARD (`/dashboard`)

## EXECUTIVE SUMMARY

You are tasked with remediating **Page 1: Dashboard** (`/dashboard`) as part of the VISION Platform V2 remediation project.

**Key Details:**
- **File:** `apps/shell/src/app/dashboard/page.tsx`
- **Priority:** P0 - Critical
- **Total Effort:** 16 hours
- **Execution Timeline:** Week 1-6

**Issues to Fix:**
- 5 inline hex colors → Bold Color System tokens
- 1 native button → GlowButton
- "Ask VISION AI" and "Share update" functionality
- Accessibility (aria-labels, keyboard navigation)
- Typography and spacing polish

**Agents Involved:**
1. **Agent 001** (Color Compliance) - Week 1 Monday - 3 hours
2. **Agent 002** (Component Migration) - Week 1 Wednesday - 1 hour
3. **Agent 004** (CTA Functionality) - Week 3 Wednesday - 8 hours
4. **Agent 003** (Accessibility) - Week 5 - 2 hours
5. **Agent 001** (Polish) - Week 6 - 2 hours

**Success Criteria:**
- ✅ All 5 color violations fixed
- ✅ Native button replaced with GlowButton
- ✅ "Ask VISION AI" modal opens and sends query
- ✅ "Share update" form validates and submits
- ✅ All interactive elements keyboard accessible
- ✅ Typography and spacing polished
- ✅ Type-check passes
- ✅ Tests pass with ≥85% coverage
- ✅ Build succeeds

---

## ⚠️ CRITICAL: MANDATORY AGENT ADHERENCE

1. ✅ Read your complete agent-specific prompt
2. ✅ Follow EVERY step (no skipping)
3. ✅ Run ALL validation commands
4. ✅ Perform self-review to find additional issues
5. ✅ Fix ALL issues found (not just listed ones)
6. ✅ Document all changes

---

## PRE-WORK: REQUIRED READING

1. **Master Plan:** `COMPLETE_PLATFORM_SHELL_MASTER_PLAN.md` - Page 1 section
2. **Your Agent Prompt:** Read your complete agent-specific prompt
3. **Execution Guide:** `AGENT_EXECUTION_GUIDE.md`
4. **Remediation Plan:** `VISION_PLATFORM_REMEDIATION_EXECUTION_PLAN.md`

---

## DETAILED ISSUE BREAKDOWN

### ISSUE 1: 5 COLOR VIOLATIONS (Week 1 Monday - 3 hours)

**Agent:** 001 (Color Compliance Specialist)

#### ⚠️ MANDATORY SELF-REVIEW
```bash
cat apps/shell/src/app/dashboard/page.tsx
grep -rn "#[0-9a-fA-F]\{3,6\}\|rgb(\|gray-" apps/shell/src/app/dashboard/page.tsx
pnpm validate:colors
```

**Expected Violations (minimum 5, find ALL):**
```typescript
// ❌ BEFORE - Inline hex and Tailwind gray colors
<div className="bg-gray-50 border border-gray-200">
  <h1 style={{ color: '#111827' }}>Welcome Back</h1>
  <div className="bg-gray-100">
    <span style={{ color: '#6B7280' }}>Quick Actions</span>
  </div>
  <button className="bg-#3B82F6 text-white">Ask VISION AI</button>
</div>
```

**Expected Fix:**
```typescript
// ✅ AFTER - Bold Color System tokens
<div className="bg-vision-surface-secondary border border-vision-border-default">
  <h1 className="text-vision-text-primary">Welcome Back</h1>
  <div className="bg-vision-surface-secondary">
    <span className="text-vision-text-secondary">Quick Actions</span>
  </div>
  <button className="bg-vision-blue-600 text-white">Ask VISION AI</button>
</div>
```

**Success Criteria:**
- ✅ All 5+ color violations fixed
- ✅ No inline styles with colors
- ✅ `pnpm validate:colors` passes (0 violations)

---

### ISSUE 2: NATIVE BUTTON (Week 1 Wednesday - 1 hour)

**Agent:** 002 (Component Migration Specialist)

#### ⚠️ MANDATORY SELF-REVIEW
```bash
grep -rn "<button" apps/shell/src/app/dashboard/page.tsx
pnpm validate:components
```

**Expected Native Component:**
```typescript
// ❌ BEFORE
<button
  onClick={() => setShowShareModal(true)}
  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
>
  Share Update
</button>
```

**Expected Fix:**
```typescript
// ✅ AFTER
import { GlowButton } from '@vision/design-system';

<GlowButton
  onClick={() => setShowShareModal(true)}
>
  Share Update
</GlowButton>
```

**Success Criteria:**
- ✅ Native button replaced with GlowButton
- ✅ `pnpm validate:components` passes

---

### ISSUE 3: ASK VISION AI & SHARE UPDATE (Week 3 Wednesday - 8 hours)

**Agent:** 004 (CTA Functionality Specialist)

**COMPLEX TASK** - Full day of work implementing two major features

#### Feature 1: Ask VISION AI Modal (4 hours)

**Types:** `apps/shell/src/types/ai.ts`
```typescript
export interface AIQuery {
  id: string;
  question: string;
  answer?: string;
  status: 'pending' | 'answered' | 'error';
  createdAt: string;
  answeredAt?: string;
}

export interface AIConversation {
  id: string;
  queries: AIQuery[];
  createdAt: string;
  updatedAt: string;
}
```

**Service:** `apps/shell/src/services/aiService.ts`
```typescript
import type { AIQuery, AIConversation } from '@/types/ai';

export const aiService = {
  async askQuestion(question: string): Promise<AIQuery> {
    if (!question || question.trim().length === 0) {
      throw new Error('Question cannot be empty');
    }

    if (question.length > 500) {
      throw new Error('Question must be less than 500 characters');
    }

    const query: AIQuery = {
      id: `query_${Date.now()}`,
      question: question.trim(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    // Simulate AI processing
    setTimeout(async () => {
      query.status = 'answered';
      query.answer = this.generateMockAnswer(question);
      query.answeredAt = new Date().toISOString();

      // Save to conversation history
      await this.saveToHistory(query);
    }, 2000);

    return query;
  },

  async getConversationHistory(): Promise<AIConversation | null> {
    const history = localStorage.getItem('ai_conversation');
    return history ? JSON.parse(history) : null;
  },

  async saveToHistory(query: AIQuery): Promise<void> {
    let conversation = await this.getConversationHistory();

    if (!conversation) {
      conversation = {
        id: `conv_${Date.now()}`,
        queries: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    conversation.queries.push(query);
    conversation.updatedAt = new Date().toISOString();

    localStorage.setItem('ai_conversation', JSON.stringify(conversation));
  },

  generateMockAnswer(question: string): string {
    // Simple mock responses based on keywords
    const lowerQ = question.toLowerCase();

    if (lowerQ.includes('application') || lowerQ.includes('app')) {
      return 'You currently have 12 applications enabled in your workspace. You can manage them in the Applications section.';
    }

    if (lowerQ.includes('team') || lowerQ.includes('member')) {
      return 'Your team has 8 active members. You can invite more members from Settings > Team.';
    }

    if (lowerQ.includes('notification')) {
      return 'You have 3 unread notifications. You can view them in the Notifications page.';
    }

    return 'I understand your question. This is a mock response. In production, VISION AI will provide intelligent answers based on your workspace data.';
  },
};
```

**Component:**
```typescript
'use client';

import { useState } from 'react';
import { GlowButton, GlowInput, GlowModal } from '@vision/design-system';
import { aiService } from '@/services/aiService';
import type { AIQuery } from '@/types/ai';

export function AskAIButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [currentQuery, setCurrentQuery] = useState<AIQuery | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAsk = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const query = await aiService.askQuestion(question);
      setCurrentQuery(query);

      // Poll for answer (in real implementation, use WebSocket)
      const pollInterval = setInterval(async () => {
        const history = await aiService.getConversationHistory();
        const updatedQuery = history?.queries.find(q => q.id === query.id);

        if (updatedQuery?.status === 'answered') {
          setCurrentQuery(updatedQuery);
          setIsLoading(false);
          clearInterval(pollInterval);
        }
      }, 500);

      // Cleanup after 10 seconds
      setTimeout(() => clearInterval(pollInterval), 10000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to ask question');
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setQuestion('');
    setCurrentQuery(null);
    setError(null);
  };

  return (
    <>
      <GlowButton
        onClick={() => setIsOpen(true)}
        variant="secondary"
      >
        Ask VISION AI
      </GlowButton>

      <GlowModal
        isOpen={isOpen}
        onClose={handleClose}
        title="Ask VISION AI"
      >
        <div className="space-y-4">
          <GlowInput
            label="Your Question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask anything about your workspace..."
            disabled={isLoading}
            error={error}
            multiline
            rows={3}
          />

          {currentQuery?.answer && (
            <div className="bg-vision-blue-50 border border-vision-blue-200 rounded-lg p-4">
              <h3 className="text-vision-text-primary font-semibold mb-2">
                Answer:
              </h3>
              <p className="text-vision-text-secondary">
                {currentQuery.answer}
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <GlowButton variant="ghost" onClick={handleClose}>
              Cancel
            </GlowButton>
            <GlowButton
              onClick={handleAsk}
              disabled={isLoading || !question.trim()}
            >
              {isLoading ? 'Asking...' : 'Ask'}
            </GlowButton>
          </div>
        </div>
      </GlowModal>
    </>
  );
}
```

#### Feature 2: Share Update Form (4 hours)

**Types:** `apps/shell/src/types/update.ts`
```typescript
export interface Update {
  id: string;
  title: string;
  content: string;
  visibility: 'team' | 'organization' | 'public';
  attachments?: string[];
  createdAt: string;
  createdBy: string;
}
```

**Service:** `apps/shell/src/services/updateService.ts`
```typescript
import type { Update } from '@/types/update';

export const updateService = {
  async shareUpdate(data: Omit<Update, 'id' | 'createdAt' | 'createdBy'>): Promise<Update> {
    // Validation
    if (!data.title || data.title.trim().length === 0) {
      throw new Error('Title is required');
    }

    if (data.title.length > 100) {
      throw new Error('Title must be less than 100 characters');
    }

    if (!data.content || data.content.trim().length === 0) {
      throw new Error('Content is required');
    }

    if (data.content.length > 1000) {
      throw new Error('Content must be less than 1000 characters');
    }

    const update: Update = {
      id: `update_${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
      createdBy: 'current-user', // TODO: Get from auth context
    };

    // Save to localStorage
    const updates = await this.getUpdates();
    updates.unshift(update);
    localStorage.setItem('updates', JSON.stringify(updates));

    return update;
  },

  async getUpdates(): Promise<Update[]> {
    const updates = localStorage.getItem('updates');
    return updates ? JSON.parse(updates) : [];
  },
};
```

**Component:**
```typescript
'use client';

import { useState } from 'react';
import { GlowButton, GlowInput, GlowTextarea, GlowSelect, GlowModal } from '@vision/design-system';
import { updateService } from '@/services/updateService';

export function ShareUpdateButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState<'team' | 'organization' | 'public'>('team');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleShare = async () => {
    setError(null);
    setIsLoading(true);

    try {
      await updateService.shareUpdate({ title, content, visibility });
      setSuccess(true);

      // Close modal after success
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to share update');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setTitle('');
    setContent('');
    setVisibility('team');
    setError(null);
    setSuccess(false);
  };

  return (
    <>
      <GlowButton onClick={() => setIsOpen(true)}>
        Share Update
      </GlowButton>

      <GlowModal
        isOpen={isOpen}
        onClose={handleClose}
        title="Share an Update"
      >
        {success ? (
          <div className="bg-vision-success-50 border border-vision-success-200 text-vision-success-700 px-4 py-3 rounded">
            Update shared successfully!
          </div>
        ) : (
          <div className="space-y-4">
            {error && (
              <div className="bg-vision-error-50 border border-vision-error-200 text-vision-error-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <GlowInput
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's this update about?"
              disabled={isLoading}
              required
            />

            <GlowTextarea
              label="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your update..."
              rows={5}
              disabled={isLoading}
              required
              helperText={`${content.length}/1000 characters`}
            />

            <GlowSelect
              label="Visibility"
              value={visibility}
              onChange={(value) => setVisibility(value as any)}
              options={[
                { value: 'team', label: 'Team Only' },
                { value: 'organization', label: 'Entire Organization' },
                { value: 'public', label: 'Public' },
              ]}
              disabled={isLoading}
            />

            <div className="flex justify-end gap-3">
              <GlowButton variant="ghost" onClick={handleClose}>
                Cancel
              </GlowButton>
              <GlowButton
                onClick={handleShare}
                disabled={isLoading || !title.trim() || !content.trim()}
              >
                {isLoading ? 'Sharing...' : 'Share Update'}
              </GlowButton>
            </div>
          </div>
        )}
      </GlowModal>
    </>
  );
}
```

**Success Criteria:**
- ✅ Ask VISION AI modal opens
- ✅ AI query validates input
- ✅ Mock answer generates after delay
- ✅ Conversation history persists
- ✅ Share update modal opens
- ✅ Form validation works
- ✅ Update persists in localStorage
- ✅ Success message displays

---

### ISSUE 4: ACCESSIBILITY (Week 5 - 2 hours)

**Agent:** 003 (Accessibility Enhancement Specialist)

**Assignment:** Add aria-labels and ensure keyboard navigation

```typescript
// ✅ Add aria-labels to all interactive elements
<GlowButton
  onClick={() => setIsOpen(true)}
  aria-label="Ask VISION AI a question"
>
  Ask VISION AI
</GlowButton>

<GlowButton
  onClick={() => setShowShareModal(true)}
  aria-label="Share an update with your team"
>
  Share Update
</GlowButton>

// ✅ Ensure modal has proper focus management
<GlowModal
  isOpen={isOpen}
  onClose={handleClose}
  title="Ask VISION AI"
  aria-labelledby="ai-modal-title"
  aria-describedby="ai-modal-description"
>
  {/* Content */}
</GlowModal>

// ✅ Add keyboard shortcuts (optional enhancement)
useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    // Ctrl/Cmd + K to open AI
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      setShowAIModal(true);
    }
  };

  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, []);
```

**Success Criteria:**
- ✅ All buttons have aria-labels
- ✅ Modals have proper ARIA attributes
- ✅ Keyboard navigation works
- ✅ Focus management in modals
- ✅ WCAG 2.1 AA compliant

---

### ISSUE 5: POLISH (Week 6 - 2 hours)

**Agent:** 001 (Color Compliance Specialist - Polish role)

**Assignment:** Typography and spacing cleanup

```typescript
// ✅ Consistent heading hierarchy
<h1 className="text-vision-text-primary text-3xl font-bold mb-2">
  Welcome Back, {userName}
</h1>
<p className="text-vision-text-secondary text-base mb-6">
  Here's what's happening in your workspace
</p>

// ✅ Consistent spacing
<div className="space-y-6">
  <section className="space-y-4">
    {/* Content with consistent spacing */}
  </section>
</div>

// ✅ Consistent card styling
<div className="bg-vision-surface-secondary rounded-lg border border-vision-border-default p-6 hover:border-vision-blue-200 transition-colors">
  {/* Card content */}
</div>
```

**Success Criteria:**
- ✅ Consistent typography scale
- ✅ Consistent spacing throughout
- ✅ Proper heading hierarchy
- ✅ Visual polish complete

---

## EXECUTION WORKFLOW

```bash
# Setup
git checkout main && git pull origin main
git checkout -b fix/[agent]-page-1-dashboard
pnpm install

# Self-review
cat apps/shell/src/app/dashboard/page.tsx

# Make changes

# Validate
pnpm type-check
pnpm lint
pnpm validate:colors       # Agent 001
pnpm validate:components   # Agent 002
pnpm test apps/shell/src/app/dashboard/page.test.tsx
pnpm build

# Manual test
pnpm dev

# Create PR
git add [files]
git commit -m "fix(page-1): [work done]"
git push origin [branch]
gh pr create
```

---

## SUCCESS CRITERIA

### All Agents MUST Verify:
- ✅ All validation commands pass
- ✅ Self-review performed
- ✅ Additional issues documented
- ✅ ALL issues fixed (not just listed)
- ✅ Tests pass (≥85% coverage)
- ✅ Manual testing complete
- ✅ PR created

---

## QUICK REFERENCE

**Files:**
- `apps/shell/src/app/dashboard/page.tsx`
- `apps/shell/src/services/aiService.ts` (Agent 004)
- `apps/shell/src/services/updateService.ts` (Agent 004)
- `apps/shell/src/types/ai.ts` (Agent 004)
- `apps/shell/src/types/update.ts` (Agent 004)

**Commands:**
```bash
pnpm type-check
pnpm lint
pnpm validate:colors
pnpm validate:components
pnpm test [file]
pnpm build
pnpm dev
```

**Ready to start:**
```bash
git checkout main && git pull origin main
git checkout -b fix/[agent]-page-1-dashboard
pnpm install
```
