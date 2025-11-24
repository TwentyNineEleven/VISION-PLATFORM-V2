# AGENT START PROMPT: Pages 5-8 Remediation

**Execution Target:** Pages 5-8 of VISION Platform V2
**Estimated Total Effort:** 26 hours
**Execution Timeline:** Week 2-4
**Agent Coordination:** Multiple agents working in sequence

---

## EXECUTIVE SUMMARY

You are about to begin remediation work on **Pages 5-8** of the VISION Platform V2. This prompt provides all necessary context, execution steps, and validation criteria to successfully complete this work.

**Pages in Scope:**
- **Page 5:** App Detail (`/apps/[slug]`) - 6 hours
- **Page 6:** App Onboarding (`/apps/[slug]/onboarding`) - 6 hours
- **Page 7:** Notifications (`/notifications`) - 4 hours
- **Page 8:** Files (`/files`) - 8 hours

**Total:** 26 hours

---

## PHASE 0: PRE-WORK REVIEW

Before starting any work, you MUST review these documents:

### 1. Master Plan
```bash
code /Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/documentation/platform/COMPLETE_PLATFORM_SHELL_MASTER_PLAN.md
```
**What to read:**
- Page-by-Page Execution Breakdown (Pages 5-8 sections)
- Success Criteria for each page
- Week-by-week timeline

### 2. Agent Execution Guide
```bash
code /Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/documentation/platform/AGENT_EXECUTION_GUIDE.md
```
**What to read:**
- Execution Order (prevent conflicts)
- Handoff Procedures (agent-to-agent)
- Conflict Prevention Matrix

### 3. Agent Prompts (Based on Assignment)
You will be assigned ONE agent role per page. Read your role's prompt:

**Agent 001 (Color Compliance):**
```bash
code /Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/documentation/platform/AGENT_PROMPT_COLOR_COMPLIANCE_SPECIALIST.md
```

**Agent 002 (Component Migration):**
```bash
code /Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/documentation/platform/AGENT_PROMPT_COMPONENT_MIGRATION_SPECIALIST.md
```

**Agent 003 (Accessibility):**
```bash
code /Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/documentation/platform/AGENT_PROMPT_ACCESSIBILITY_ENHANCEMENT_SPECIALIST.md
```

**Agent 004 (CTA Functionality):**
```bash
code /Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/documentation/platform/AGENT_PROMPT_CTA_FUNCTIONALITY_SPECIALIST.md
```

**Agent 006 (Testing & Coverage):**
```bash
code /Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/documentation/platform/AGENT_PROMPT_TESTING_COVERAGE_SPECIALIST.md
```

---

## PAGE 5: APP DETAIL (`/apps/[slug]`)

### Overview
- **File:** `apps/shell/src/app/apps/[slug]/page.tsx`
- **Priority:** P0 - Critical
- **Total Effort:** 6 hours
- **Execution Order:** Week 2-3

### Issues to Fix

#### 1. Colors (Week 2 Monday - 2 hours)
**Agent:** 001 (Color Compliance Specialist)
**Assignment:** Fix 4 color violations

**Violations:**
```typescript
// Expected violations (from audit):
// - Inline hex colors in metadata displays
// - Arbitrary Tailwind colors for status badges
// - Generic gray colors for descriptions
```

**Expected Fix:**
- Replace inline colors with Bold Color System tokens
- Use `vision-blue-950` for primary elements
- Use `vision-green-900` for active/enabled status
- Use `vision-gray-700` for secondary text

**Validation:**
```bash
pnpm validate:colors
pnpm test apps/shell/src/app/apps/\[slug\]/
```

#### 2. Launch Paths (Week 3 - 3 hours)
**Agent:** 004 (CTA Functionality Specialist)
**Assignment:** Fix broken app launch paths

**Current Issues:**
- Launch buttons non-functional
- Coming soon apps missing proper messaging
- App metadata not displaying correctly

**Expected Implementation:**
```typescript
// Service layer pattern
export const appService = {
  async launchApp(appSlug: string): Promise<AppLaunchResult> {
    // CURRENT: localStorage stub
    const apps = JSON.parse(localStorage.getItem('apps') || '[]');
    const app = apps.find((a: App) => a.slug === appSlug);

    if (!app) {
      throw new Error('App not found');
    }

    if (app.status === 'coming_soon') {
      throw new Error('App is coming soon');
    }

    // Simulate app launch
    return {
      launchUrl: `/apps/${appSlug}/launch`,
      status: 'success',
    };

    // FUTURE API:
    // return await api.post(`/apps/${appSlug}/launch`);
  },
};
```

**Validation:**
```bash
# All CTAs functional
# Proper error messaging for coming soon apps
# Launch buttons show loading states
```

#### 3. Accessibility (Week 5 - 1 hour)
**Agent:** 003 (Accessibility Enhancement Specialist)
**Assignment:** Keyboard navigation for launch buttons

**Expected Implementation:**
- Ensure all interactive elements keyboard accessible
- Add proper ARIA labels for action buttons
- Test with Tab navigation

**Validation:**
```bash
# Lighthouse Accessibility: 100/100
# axe violations: 0
# Keyboard test: PASS
```

---

## PAGE 6: APP ONBOARDING (`/apps/[slug]/onboarding`)

### Overview
- **File:** `apps/shell/src/app/apps/[slug]/onboarding/page.tsx`
- **Priority:** P0 - Critical
- **Total Effort:** 6 hours
- **Execution Order:** Week 3-4

### Issues to Fix

#### 1. Mock Steps (Week 3 - 4 hours)
**Agent:** 004 (CTA Functionality Specialist)
**Assignment:** Replace fake stepper with real flow

**Current Issues:**
- Stepper component is mock/non-functional
- Steps don't advance
- No data persistence between steps

**Expected Implementation:**
```typescript
// Multi-step form with state management
export default function AppOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<OnboardingData>({});
  const [isLoading, setIsLoading] = useState(false);

  const steps = [
    { id: 'welcome', title: 'Welcome', component: WelcomeStep },
    { id: 'configure', title: 'Configure', component: ConfigureStep },
    { id: 'permissions', title: 'Permissions', component: PermissionsStep },
    { id: 'complete', title: 'Complete', component: CompleteStep },
  ];

  const handleNext = async () => {
    // Validate current step
    const isValid = await validateStep(currentStep, formData);
    if (!isValid) return;

    // Save progress
    await onboardingService.saveProgress(formData);

    // Advance
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      await onboardingService.completeOnboarding(formData);
      // Redirect to app
    } catch (err) {
      // Error handling
    } finally {
      setIsLoading(false);
    }
  };

  // Render current step
}
```

**Service Layer:**
```typescript
// apps/shell/src/services/onboardingService.ts
export const onboardingService = {
  async saveProgress(data: OnboardingData): Promise<void> {
    // CURRENT: localStorage
    localStorage.setItem('onboarding-progress', JSON.stringify(data));

    // FUTURE API:
    // await api.post('/onboarding/progress', data);
  },

  async completeOnboarding(data: OnboardingData): Promise<void> {
    // CURRENT: localStorage
    localStorage.setItem('onboarding-complete', JSON.stringify(data));

    // FUTURE API:
    // await api.post('/onboarding/complete', data);
  },
};
```

**Validation:**
- All steps functional
- Next/Back buttons work
- Form data persists between steps
- Completion flow works

#### 2. Form Validation (Week 4 - 2 hours)
**Agent:** 004 (CTA Functionality Specialist)
**Assignment:** Add proper validation

**Expected Implementation:**
```typescript
// Use Zod for validation
import { z } from 'zod';

const onboardingSchema = z.object({
  appName: z.string().min(1, 'App name is required'),
  configuration: z.object({
    apiKey: z.string().min(10, 'API key must be at least 10 characters'),
    webhookUrl: z.string().url('Must be a valid URL').optional(),
  }),
  permissions: z.array(z.string()).min(1, 'Select at least one permission'),
});

// Validation in component
const validateStep = async (step: number, data: OnboardingData) => {
  try {
    if (step === 1) {
      onboardingSchema.pick({ appName: true }).parse(data);
    } else if (step === 2) {
      onboardingSchema.pick({ configuration: true }).parse(data);
    }
    return true;
  } catch (err) {
    if (err instanceof z.ZodError) {
      setErrors(err.flatten().fieldErrors);
    }
    return false;
  }
};
```

**Validation:**
- All fields validated
- Error messages display inline
- Cannot advance with invalid data
- Success feedback on completion

---

## PAGE 7: NOTIFICATIONS (`/notifications`)

### Overview
- **File:** `apps/shell/src/app/notifications/page.tsx`
- **Priority:** P1 - High
- **Total Effort:** 4 hours
- **Execution Order:** Week 2-4

### Issues to Fix

#### 1. Colors (Week 2 Monday - 1 hour)
**Agent:** 001 (Color Compliance Specialist)
**Assignment:** Fix 1 opacity hack

**Violation:**
```typescript
// ❌ BEFORE
<div className="bg-primary/10">
  Notification item
</div>

// ✅ AFTER
<div className="bg-vision-blue-50">
  Notification item
</div>
```

**Validation:**
```bash
pnpm validate:colors
# Expected: 0 violations
```

#### 2. Persistence (Week 4 - 2 hours)
**Agent:** 004 (CTA Functionality Specialist)
**Assignment:** Mark as read/delete functionality

**Expected Implementation:**
```typescript
// Service layer
export const notificationService = {
  async getNotifications(): Promise<Notification[]> {
    const notifications = JSON.parse(
      localStorage.getItem('notifications') || '[]'
    );
    return notifications;
  },

  async markAsRead(notificationId: string): Promise<void> {
    const notifications = await this.getNotifications();
    const updated = notifications.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    );
    localStorage.setItem('notifications', JSON.stringify(updated));
  },

  async deleteNotification(notificationId: string): Promise<void> {
    const notifications = await this.getNotifications();
    const filtered = notifications.filter(n => n.id !== notificationId);
    localStorage.setItem('notifications', JSON.stringify(filtered));
  },

  async markAllAsRead(): Promise<void> {
    const notifications = await this.getNotifications();
    const updated = notifications.map(n => ({ ...n, read: true }));
    localStorage.setItem('notifications', JSON.stringify(updated));
  },
};
```

**Component:**
```typescript
const handleMarkAsRead = async (id: string) => {
  setIsLoading(true);
  try {
    await notificationService.markAsRead(id);
    // Refresh notifications
    const updated = await notificationService.getNotifications();
    setNotifications(updated);
  } catch (err) {
    setError('Failed to mark as read');
  } finally {
    setIsLoading(false);
  }
};

const handleDelete = async (id: string) => {
  if (!confirm('Delete this notification?')) return;

  setIsLoading(true);
  try {
    await notificationService.deleteNotification(id);
    const updated = await notificationService.getNotifications();
    setNotifications(updated);
  } catch (err) {
    setError('Failed to delete notification');
  } finally {
    setIsLoading(false);
  }
};
```

**Validation:**
- Mark as read works
- Delete notification works
- Mark all as read works
- Notifications persist in localStorage
- Proper user feedback (toasts)

#### 3. Accessibility (Week 5 - 1 hour)
**Agent:** 003 (Accessibility Enhancement Specialist)
**Assignment:** Icon button labels

**Expected Implementation:**
```typescript
<GlowButton
  variant="ghost"
  size="icon"
  onClick={() => handleMarkAsRead(notification.id)}
  aria-label="Mark notification as read"
>
  <CheckIcon className="w-4 h-4" />
</GlowButton>

<GlowButton
  variant="ghost"
  size="icon"
  onClick={() => handleDelete(notification.id)}
  aria-label="Delete notification"
>
  <TrashIcon className="w-4 h-4" />
</GlowButton>
```

**Validation:**
- All icon buttons have aria-label
- Keyboard navigation works
- Screen reader announces actions

---

## PAGE 8: FILES (`/files`)

### Overview
- **File:** `apps/shell/src/app/files/page.tsx`
- **Priority:** P0 - Critical
- **Total Effort:** 8 hours
- **Execution Order:** Week 2-4

### Issues to Fix

#### 1. Colors (Week 2 Tuesday - 3 hours)
**Agent:** 001 (Color Compliance Specialist)
**Assignment:** Fix 6 Tailwind grays

**Violations:**
```typescript
// ❌ BEFORE: Generic Tailwind grays
text-gray-400  // → text-vision-gray-500
text-gray-600  // → text-vision-gray-700
text-gray-800  // → text-vision-gray-950
bg-gray-50     // → bg-vision-gray-50
bg-gray-100    // → bg-vision-gray-100
border-gray-300 // → border-vision-gray-300
```

**Validation:**
```bash
pnpm validate:colors
# Expected: 0 violations across entire Files page
```

#### 2. Accessibility (Week 5 - 2 hours)
**Agent:** 003 (Accessibility Enhancement Specialist)
**Assignment:** Table caption, file status labels

**Expected Implementation:**
```typescript
<table>
  <caption className="text-lg font-semibold mb-4 text-vision-gray-950">
    File Directory
  </caption>
  <thead>
    <tr>
      <th scope="col">Name</th>
      <th scope="col">Size</th>
      <th scope="col">Modified</th>
      <th scope="col">Status</th>
      <th scope="col">Actions</th>
    </tr>
  </thead>
  <tbody>
    {files.map(file => (
      <tr key={file.id}>
        <td>{file.name}</td>
        <td>{formatFileSize(file.size)}</td>
        <td>{formatDate(file.modified)}</td>
        <td>
          <span className={getStatusColor(file.status)}>
            {file.status}
            <span className="sr-only">
              File status: {file.status}
            </span>
          </span>
        </td>
        <td>
          <GlowButton
            size="icon"
            variant="ghost"
            aria-label={`Download ${file.name}`}
          >
            <DownloadIcon />
          </GlowButton>
        </td>
      </tr>
    ))}
  </tbody>
</table>
```

**Validation:**
- Table has caption
- All status indicators have sr-only text
- Icon buttons have descriptive aria-labels

#### 3. CTAs (Week 4 - 3 hours)
**Agent:** 004 (CTA Functionality Specialist)
**Assignment:** Upload/download/delete actions

**Expected Implementation:**
```typescript
// Service layer
export const fileService = {
  async getFiles(): Promise<File[]> {
    const files = JSON.parse(localStorage.getItem('files') || '[]');
    return files;
  },

  async uploadFile(file: File): Promise<UploadedFile> {
    // CURRENT: Mock file upload
    const uploadedFile: UploadedFile = {
      id: Date.now().toString(),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
      status: 'uploaded',
    };

    const files = await this.getFiles();
    files.unshift(uploadedFile);
    localStorage.setItem('files', JSON.stringify(files));

    return uploadedFile;

    // FUTURE API:
    // const formData = new FormData();
    // formData.append('file', file);
    // return await api.post('/files/upload', formData);
  },

  async downloadFile(fileId: string): Promise<void> {
    // CURRENT: Mock download
    const files = await this.getFiles();
    const file = files.find(f => f.id === fileId);
    if (!file) throw new Error('File not found');

    // Simulate download
    console.log('Downloading:', file.name);

    // FUTURE API:
    // const blob = await api.get(`/files/${fileId}/download`, {
    //   responseType: 'blob'
    // });
    // downloadBlob(blob, file.name);
  },

  async deleteFile(fileId: string): Promise<void> {
    const files = await this.getFiles();
    const filtered = files.filter(f => f.id !== fileId);
    localStorage.setItem('files', JSON.stringify(filtered));

    // FUTURE API:
    // await api.delete(`/files/${fileId}`);
  },
};
```

**Component:**
```typescript
const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setIsUploading(true);
  try {
    await fileService.uploadFile(file);
    const updated = await fileService.getFiles();
    setFiles(updated);
    toast.success('File uploaded successfully');
  } catch (err) {
    toast.error('Failed to upload file');
  } finally {
    setIsUploading(false);
  }
};

const handleDownload = async (fileId: string) => {
  try {
    await fileService.downloadFile(fileId);
    toast.success('Download started');
  } catch (err) {
    toast.error('Failed to download file');
  }
};

const handleDelete = async (fileId: string) => {
  if (!confirm('Delete this file?')) return;

  try {
    await fileService.deleteFile(fileId);
    const updated = await fileService.getFiles();
    setFiles(updated);
    toast.success('File deleted');
  } catch (err) {
    toast.error('Failed to delete file');
  }
};
```

**Validation:**
- Upload button functional
- File upload shows progress
- Download button works
- Delete button works with confirmation
- All actions have user feedback

---

## EXECUTION WORKFLOW (CRITICAL - FOLLOW EXACTLY)

### Step 1: Determine Your Agent Role

Based on the week and page assignment, identify your role:

**Week 2:**
- Monday: Agent 001 (Colors) - Pages 5, 7, 8
- Tuesday: Agent 001 (Colors) - Page 8 (continued)

**Week 3:**
- Week 3: Agent 004 (CTAs) - Pages 5, 6

**Week 4:**
- Week 4: Agent 004 (CTAs) - Pages 6, 7, 8

**Week 5:**
- Week 5: Agent 003 (Accessibility) - Pages 5, 7, 8

### Step 2: Read Your Agent Prompt

```bash
# Example: If you are Agent 001
code /Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/documentation/platform/AGENT_PROMPT_COLOR_COMPLIANCE_SPECIALIST.md

# Read ENTIRE prompt
# Understand your mission
# Follow the step-by-step workflow
```

### Step 3: Create Feature Branch

```bash
# Example for Page 5 (App Detail) - Agent 001
git checkout -b fix/ux-audit-app-detail-colors

# Example for Page 6 (App Onboarding) - Agent 004
git checkout -b fix/ux-audit-app-onboarding-cta-functionality
```

### Step 4: Follow Agent Prompt Workflow

Each agent prompt has a detailed step-by-step workflow (Section H). Follow it EXACTLY:

**Agent 001 (Colors):**
1. Preparation (15 min)
2. Write Tests FIRST (30 min)
3. Make Fixes (45-60 min)
4. Validation (20 min)
5. Commit & PR (30 min)

**Agent 004 (CTAs):**
1. Preparation & Analysis (15-20 min)
2. Create Service Layer (30-45 min)
3. Wire CTAs in Component (45-60 min)
4. Write Tests (30-45 min)
5. Manual Testing (20-30 min)
6. Commit & PR (15-20 min)

**Agent 003 (Accessibility):**
1. Preparation (10 min)
2. Write Tests FIRST (30-45 min)
3. Make Fixes (45-60 min)
4. Validate Fixes (20-30 min)
5. Commit & PR (15-20 min)

### Step 5: Validation (MUST PASS ALL)

```bash
# TypeScript type checking
pnpm type-check
# Expected: 0 errors

# ESLint validation
pnpm lint
# Expected: 0 errors, 0 warnings

# Color token validation (Agent 001 only)
pnpm validate:colors
# Expected: 0 violations

# Component usage validation (Agent 002 only)
pnpm validate:components
# Expected: 0 violations

# Unit tests
pnpm test apps/shell/src/app/[your-page]/
# Expected: All tests passing, ≥85% coverage

# Build validation
pnpm --filter @vision/shell run build
# Expected: Successful build
```

### Step 6: Create Pull Request

Use the PR template from your agent prompt. Include:

1. **Audit Reference:** Which page, which issue
2. **Changes Made:** Specific fixes applied
3. **Validation Results:** All checks passing
4. **Screenshots:** Before/after (if visual changes)

### Step 7: Request Reviews

- Assign 2 reviewers
- Add Agent 005 (Validation Specialist) for final review
- Add labels based on your work

---

## SUCCESS CRITERIA (ALL MUST BE TRUE)

### Per-Page Success Criteria

**For EACH page you work on:**

- [ ] All automated validation checks passing
- [ ] All issues from audit addressed
- [ ] Visual appearance preserved (or improved)
- [ ] Functionality working (no regressions)
- [ ] Tests written and passing (≥85% coverage)
- [ ] PR created with complete documentation
- [ ] 2 reviewer approvals obtained
- [ ] PR merged to main
- [ ] Feature branch deleted

### Overall Success Criteria (Pages 5-8)

- [ ] **Page 5 (App Detail):** All 3 agents complete (Colors, CTAs, A11y)
- [ ] **Page 6 (App Onboarding):** Agent 004 complete (Mock steps, Validation)
- [ ] **Page 7 (Notifications):** All 3 agents complete (Colors, CTAs, A11y)
- [ ] **Page 8 (Files):** All 3 agents complete (Colors, CTAs, A11y)
- [ ] **Test Coverage:** ≥85% across all 4 pages
- [ ] **Zero Regressions:** Old functionality preserved
- [ ] **Documentation:** API contracts documented for backend team

---

## QUICK REFERENCE: FILES TO WORK ON

### Page 5: App Detail
```
apps/shell/src/app/apps/[slug]/page.tsx
apps/shell/src/app/apps/[slug]/page.test.tsx (you create)
apps/shell/src/services/appService.ts (Agent 004 creates)
```

### Page 6: App Onboarding
```
apps/shell/src/app/apps/[slug]/onboarding/page.tsx
apps/shell/src/app/apps/[slug]/onboarding/page.test.tsx (you create)
apps/shell/src/services/onboardingService.ts (Agent 004 creates)
```

### Page 7: Notifications
```
apps/shell/src/app/notifications/page.tsx
apps/shell/src/app/notifications/page.test.tsx (you create)
apps/shell/src/services/notificationService.ts (Agent 004 creates)
```

### Page 8: Files
```
apps/shell/src/app/files/page.tsx
apps/shell/src/app/files/page.test.tsx (you create)
apps/shell/src/services/fileService.ts (Agent 004 creates)
```

---

## FINAL CHECKLIST BEFORE STARTING

Before you begin work, verify:

- [ ] I have read the master plan for my assigned page
- [ ] I have read the agent execution guide
- [ ] I have read my agent prompt (001, 002, 003, 004, or 006)
- [ ] I understand which page I'm working on
- [ ] I understand which agent role I'm performing
- [ ] I know which week this work happens
- [ ] I have checked for dependencies (other agents must finish first)
- [ ] I have created the correct feature branch
- [ ] I am ready to follow the step-by-step workflow

---

## BEGIN EXECUTION

**START NOW with your assigned page and agent role.**

Example starting commands:

```bash
# If you are Agent 001 working on Page 5 (App Detail)
git checkout -b fix/ux-audit-app-detail-colors
code /Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/documentation/platform/AGENT_PROMPT_COLOR_COMPLIANCE_SPECIALIST.md
code apps/shell/src/app/apps/[slug]/page.tsx

# If you are Agent 004 working on Page 6 (App Onboarding)
git checkout -b fix/ux-audit-app-onboarding-cta-functionality
code /Users/fordaaro/Documents/apps/VISION-PLATFORM-V2/documentation/platform/AGENT_PROMPT_CTA_FUNCTIONALITY_SPECIALIST.md
touch apps/shell/src/services/onboardingService.ts
code apps/shell/src/services/onboardingService.ts
```

**Proceed with Phase 1, Step 1.1 of your agent prompt.**

Good luck! Execute with precision.

---

**END OF AGENT START PROMPT**

**Document Status:** READY FOR EXECUTION
**Pages Covered:** 5-8
**Total Effort:** 26 hours
**Expected Completion:** Week 2-5
