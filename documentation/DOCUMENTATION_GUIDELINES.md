# Documentation Guidelines & Categories

**Purpose:** Comprehensive guide for where to add ANY type of documentation
**Last Updated:** November 13, 2025
**Status:** Living Document

---

## 📂 Complete Documentation Taxonomy

This document defines where EVERY type of documentation should be placed in the VISION Platform documentation system.

---

## 🗂️ Primary Categories

### 1. General (`documentation/general/`)

**Purpose:** Project-wide information that applies to everything

**Add documentation here if it:**
- Applies to the entire project (not specific to platform or apps)
- Covers project-wide standards, processes, or guidelines
- Is needed by all developers regardless of what they're building
- Describes overall architecture, deployment, or security

**Subcategories:**

#### Project Information
- `PROJECT_OVERVIEW.md` - What VISION Platform is
- `PRODUCT_ROADMAP.md` - Product vision and roadmap
- `CHANGELOG.md` - Version history and changes
- `GLOSSARY.md` - Terms and definitions

#### Developer Resources
- `GETTING_STARTED.md` - Environment setup
- `CODE_STANDARDS.md` - Coding conventions
- `TECH_STACK.md` - Technology decisions
- `DEVELOPMENT_WORKFLOW.md` - Git workflow, PR process
- `TROUBLESHOOTING.md` - Common issues and solutions

#### Architecture & Design
- `ARCHITECTURE.md` - System architecture overview
- `DATA_MODEL.md` - Cross-platform data models
- `API_STANDARDS.md` - API design standards
- `DATABASE_CONVENTIONS.md` - Database naming, RLS patterns

#### Quality & Security
- `SECURITY.md` - Security guidelines
- `TESTING.md` - Testing strategy
- `PERFORMANCE.md` - Performance guidelines
- `ACCESSIBILITY.md` - Accessibility standards (WCAG 2.1 AA)

#### Operations
- `DEPLOYMENT.md` - Deployment procedures
- `MONITORING.md` - Logging and monitoring
- `INCIDENT_RESPONSE.md` - How to handle incidents
- `BACKUP_RECOVERY.md` - Backup and recovery procedures

#### Team & Process
- `CONTRIBUTING.md` - How to contribute
- `CODE_REVIEW.md` - Code review guidelines
- `ONBOARDING.md` - New team member onboarding
- `MEETING_NOTES.md` - Architecture decision records

#### Inventory & Status
- `EXISTING_WORK_INVENTORY.md` - What's already built
- `PROJECT_STATUS.md` - Current status and progress
- `TECHNICAL_DEBT.md` - Known technical debt

---

### 2. Platform (`documentation/platform/`)

**Purpose:** Platform-shell specific documentation (the container that hosts apps)

**Add documentation here if it:**
- Is specific to the platform-shell application
- Relates to cross-app functionality (auth, navigation, settings)
- Describes platform-level features (not app features)
- Is needed to build or maintain the platform container

**Structure:**
```
platform/
├── features/          ← Platform feature documentation
├── implementation/    ← Time-based implementation guides
├── api/              ← Platform API documentation
├── components/       ← Platform-specific components
└── integration/      ← Cross-app integration patterns
```

#### Features (`platform/features/`)

**Add feature documentation here for:**
- Authentication & authorization
- Organization management
- User management & profiles
- Navigation & routing
- Settings pages (profile, org, team, billing)
- Notification system
- Global search
- Document management
- Funder portal
- Onboarding flow
- Event bus / cross-app communication
- Design system
- Any other platform-wide feature

**Each feature should have:**
```
{feature-name}/
├── README.md          ← Overview
├── REQUIREMENTS.md    ← What to build
├── IMPLEMENTATION.md  ← How to build it
├── API.md            ← API endpoints (if applicable)
├── COMPONENTS.md     ← React components (if applicable)
├── DATABASE.md       ← Database schema (if applicable)
└── TESTING.md        ← Testing approach (if complex)
```

#### Implementation (`platform/implementation/`)

**Add time-based implementation guides:**
- `week-1-2/` - Days 1-10 implementation
- `week-3-4/` - Days 11-20 implementation
- `week-5-6/` - Days 21-30 implementation
- `sprint-{n}/` - Sprint-based implementation
- `milestone-{n}/` - Milestone-based implementation

**Each implementation period should have:**
```
{period}/
├── README.md              ← Overview
├── IMPLEMENTATION_PLAN.md ← Day-by-day or task-by-task plan
├── DELIVERABLES.md        ← Expected deliverables
└── TESTING.md             ← Testing procedures
```

#### API (`platform/api/`)

**Add API documentation here for:**
- Platform API overview
- Authentication endpoints
- User endpoints
- Organization endpoints
- Document endpoints
- Notification endpoints
- Any platform-level API

**Structure:**
```
api/
├── README.md              ← API overview
├── AUTHENTICATION.md      ← Auth API
├── USERS.md              ← User API
├── ORGANIZATIONS.md      ← Organization API
├── DOCUMENTS.md          ← Document API
├── NOTIFICATIONS.md      ← Notification API
└── WEBHOOKS.md           ← Webhook documentation
```

#### Components (`platform/components/`)

**Add component documentation here for:**
- Shared platform components
- Layout components (AppLayout, Header, Sidebar)
- Navigation components
- Auth components (LoginForm, SignupForm)
- Complex shared components

**Structure:**
```
components/
├── README.md              ← Component library overview
├── LAYOUT_COMPONENTS.md   ← Layout components
├── AUTH_COMPONENTS.md     ← Authentication components
├── NAVIGATION.md          ← Navigation components
└── FORMS.md              ← Form components
```

#### Integration (`platform/integration/`)

**Add integration documentation here for:**
- How apps integrate with platform
- Event bus patterns
- Shared state management
- Data flow between apps
- Cross-app communication

**Structure:**
```
integration/
├── README.md              ← Integration overview
├── EVENT_BUS.md          ← Event bus usage
├── SHARED_STATE.md       ← Shared state patterns
├── DATA_FLOW.md          ← Data flow patterns
└── AUTHENTICATION.md     ← How apps use platform auth
```

---

### 3. Apps (`documentation/apps/`)

**Purpose:** Individual application documentation

**Add documentation here if it:**
- Is specific to a single application
- Describes app-specific features or functionality
- Only applies to one app (not the platform)

**Structure:**
```
apps/{app-name}/
├── README.md          ← App overview
├── features/          ← App feature documentation
├── implementation/    ← App implementation guides
├── api/              ← App-specific API docs
├── components/       ← App-specific components
├── migrations/       ← Migration guides (e.g., Firebase → Supabase)
└── testing/          ← App-specific testing
```

#### Current Apps

**CapacityIQ** (`apps/capacity-assessment/`)
- Organizational assessment tool
- Features: assessments, benchmarking, recommendations, progress tracking

**FundingFramer** (`apps/funding-framer/`)
- Grant management application
- Features: proposals, opportunities, knowledge base, citations, reports

**CRM Lite** (`apps/crm-lite/`)
- Donor relationship management
- Features: contacts, donations, campaigns, reporting

#### Adding New Apps

When adding a new app, create:
```bash
mkdir -p documentation/apps/{new-app-name}/{features,implementation,api,components}
touch documentation/apps/{new-app-name}/README.md
```

Update `documentation/INDEX.md` with the new app.

---

## 📑 Special Documentation Categories

### 4. Packages (`documentation/packages/`)

**Purpose:** Shared package/library documentation

**Add documentation here for:**
- `@vision/ui` - Component library
- `@vision/auth` - Authentication utilities
- `@vision/database` - Database client and hooks
- `@vision/documents` - Document management
- `@vision/ai-functions` - AI utilities
- `@vision/events` - Event bus
- Any other shared package

**Structure:**
```
packages/{package-name}/
├── README.md          ← Package overview
├── API.md            ← Public API documentation
├── USAGE.md          ← Usage examples
├── COMPONENTS.md     ← Components (if UI package)
├── HOOKS.md          ← React hooks (if applicable)
└── MIGRATION.md      ← Migration guides for breaking changes
```

### 5. Infrastructure (`documentation/infrastructure/`)

**Purpose:** DevOps, infrastructure, and deployment documentation

**Add documentation here for:**
- Supabase setup and configuration
- Vercel deployment
- Environment variables
- CI/CD pipelines
- Database migrations
- Monitoring and logging setup
- Infrastructure as code

**Structure:**
```
infrastructure/
├── README.md              ← Infrastructure overview
├── SUPABASE.md           ← Supabase setup
├── VERCEL.md             ← Vercel deployment
├── ENVIRONMENT.md        ← Environment variables
├── CICD.md               ← CI/CD setup
├── MIGRATIONS.md         ← Migration management
├── MONITORING.md         ← Monitoring setup
└── BACKUP.md             ← Backup procedures
```

### 6. Integrations (`documentation/integrations/`)

**Purpose:** Third-party service integrations

**Add documentation here for:**
- Stripe (billing)
- Claude API (AI)
- OpenAI (embeddings)
- Email services (SendGrid, etc.)
- Analytics (PostHog, Plausible)
- Error tracking (Sentry)
- Any external service integration

**Structure:**
```
integrations/
├── README.md              ← Integrations overview
├── STRIPE.md             ← Stripe integration
├── CLAUDE_API.md         ← Claude AI integration
├── OPENAI.md             ← OpenAI integration
├── EMAIL.md              ← Email service
├── ANALYTICS.md          ← Analytics integration
└── ERROR_TRACKING.md     ← Error tracking
```

### 7. Research (`documentation/research/`)

**Purpose:** Research, spike results, and technical investigations

**Add documentation here for:**
- Technology evaluation
- Proof of concepts
- Research findings
- Technical spikes
- Competitor analysis
- User research

**Structure:**
```
research/
├── README.md              ← Research index
├── technology-evaluation/
│   ├── {topic}-{date}.md
│   └── ...
├── proof-of-concepts/
│   ├── {poc-name}/
│   └── ...
├── user-research/
│   ├── {study-name}/
│   └── ...
└── technical-spikes/
    ├── {spike-name}.md
    └── ...
```

### 8. Runbooks (`documentation/runbooks/`)

**Purpose:** Operational procedures and how-to guides

**Add documentation here for:**
- How to handle specific incidents
- Step-by-step operational procedures
- Emergency response guides
- Data recovery procedures
- User support procedures

**Structure:**
```
runbooks/
├── README.md              ← Runbooks index
├── INCIDENT_RESPONSE.md  ← General incident response
├── DATABASE_RECOVERY.md  ← Database recovery
├── USER_SUPPORT.md       ← User support procedures
├── ROLLBACK.md           ← Deployment rollback
└── DATA_MIGRATION.md     ← Data migration procedures
```

### 9. Workshops & Training (`documentation/training/`)

**Purpose:** Training materials and workshops

**Add documentation here for:**
- Onboarding workshops
- Training modules
- Video tutorials (links)
- Learning paths
- Certification programs

**Structure:**
```
training/
├── README.md              ← Training overview
├── onboarding/
│   ├── week-1.md
│   ├── week-2.md
│   └── ...
├── workshops/
│   ├── react-best-practices.md
│   ├── supabase-deep-dive.md
│   └── ...
└── learning-paths/
    ├── frontend-developer.md
    ├── backend-developer.md
    └── ...
```

### 10. ADRs (`documentation/adrs/`)

**Purpose:** Architecture Decision Records

**Add documentation here for:**
- Significant architectural decisions
- Technology choices and rationale
- Trade-offs and alternatives considered

**Structure:**
```
adrs/
├── README.md              ← ADR index
├── 0001-use-supabase.md
├── 0002-monorepo-structure.md
├── 0003-mantine-ui.md
└── NNNN-{decision-name}.md
```

**ADR Template:**
```markdown
# ADR-NNNN: {Decision Title}

**Date:** YYYY-MM-DD
**Status:** Proposed | Accepted | Deprecated | Superseded
**Deciders:** [Names]

## Context
[What is the issue we're facing?]

## Decision
[What decision did we make?]

## Consequences
**Positive:**
- Benefit 1
- Benefit 2

**Negative:**
- Trade-off 1
- Trade-off 2

## Alternatives Considered
- Alternative 1 - Why rejected
- Alternative 2 - Why rejected
```

---

## 🎯 Decision Matrix: Where Should My Documentation Go?

Use this flowchart to determine where to place documentation:

```
Is it about the entire project?
├─ YES → documentation/general/
└─ NO ↓

Is it about the platform-shell container?
├─ YES → documentation/platform/
└─ NO ↓

Is it about a specific app?
├─ YES → documentation/apps/{app-name}/
└─ NO ↓

Is it about a shared package?
├─ YES → documentation/packages/{package-name}/
└─ NO ↓

Is it about infrastructure/DevOps?
├─ YES → documentation/infrastructure/
└─ NO ↓

Is it about a third-party integration?
├─ YES → documentation/integrations/
└─ NO ↓

Is it research or investigation?
├─ YES → documentation/research/
└─ NO ↓

Is it an operational procedure?
├─ YES → documentation/runbooks/
└─ NO ↓

Is it training material?
├─ YES → documentation/training/
└─ NO ↓

Is it an architectural decision?
├─ YES → documentation/adrs/
└─ NO ↓

When in doubt → documentation/general/
```

---

## 📋 Documentation Checklist

When adding ANY documentation, ensure:

- [ ] **Location is correct** - Used decision matrix above
- [ ] **README exists** - Folder has README.md explaining contents
- [ ] **INDEX.md updated** - Added to documentation/INDEX.md
- [ ] **Links work** - All internal links use relative paths
- [ ] **Template followed** - Used appropriate template from TEMPLATES.md
- [ ] **Standard structure** - Follows naming conventions
- [ ] **Status clear** - Marked as Draft/In Progress/Complete
- [ ] **Owner identified** - Has owner/maintainer listed
- [ ] **Date updated** - Last updated date is current
- [ ] **Related docs linked** - Links to related documentation

---

## 🔄 Adding New Documentation Categories

If you need to add a completely new category not listed above:

### 1. Justify the Category
Ask yourself:
- Does this fit into an existing category?
- Is there enough documentation to justify a new category?
- Will this category grow over time?
- Does it have a clear, distinct purpose?

### 2. Create the Structure
```bash
mkdir -p documentation/{new-category}
touch documentation/{new-category}/README.md
```

### 3. Document the Category
Add to this file (DOCUMENTATION_GUIDELINES.md):
```markdown
### N. New Category (`documentation/{new-category}/`)

**Purpose:** [Clear description]

**Add documentation here if it:**
- Criterion 1
- Criterion 2

**Structure:**
[Directory structure]
```

### 4. Update Navigation
- Add to `documentation/README.md`
- Add to `documentation/INDEX.md`
- Update decision matrix above

### 5. Create Template (if needed)
Add appropriate template to `documentation/TEMPLATES.md`

---

## 🎨 Naming Conventions

### Files
- `UPPERCASE_WITH_UNDERSCORES.md` for top-level docs
- `Title_Case.md` for specific guides
- `lowercase-with-dashes.md` for detailed docs
- Always use `.md` extension

### Directories
- `lowercase-with-dashes/` for folders
- Descriptive, not abbreviated
- Plural for collections (e.g., `features/`, `integrations/`)

### Special Files
- `README.md` - Overview of directory contents (required in every folder)
- `INDEX.md` - Complete index or table of contents
- `CHANGELOG.md` - Version history
- `GLOSSARY.md` - Terms and definitions

---

## 📊 Documentation Maintenance

### Weekly
- [ ] Review open PRs for documentation needs
- [ ] Update INDEX.md if new docs added
- [ ] Check for broken links

### Monthly
- [ ] Review all "Last Updated" dates
- [ ] Update outdated documentation
- [ ] Archive deprecated docs
- [ ] Check documentation coverage

### Quarterly
- [ ] Full documentation audit
- [ ] Review category structure
- [ ] Update DOCUMENTATION_GUIDELINES.md
- [ ] Team training on new docs

---

## 🚨 Red Flags

Documentation is in the WRONG place if:
- ❌ App-specific docs are in `platform/`
- ❌ Platform docs are in `apps/`
- ❌ General standards are in feature folders
- ❌ Implementation details are in README files
- ❌ API docs are scattered across multiple locations
- ❌ Duplicate documentation exists in multiple places

Fix by moving to correct location and updating links.

---

## 💡 Best Practices

### 1. Single Source of Truth
- One canonical location for each piece of information
- Link to it, don't duplicate it
- If information applies to multiple areas, put it in `general/` and link to it

### 2. DRY (Don't Repeat Yourself)
- Extract common patterns to shared docs
- Use includes/references rather than copying
- Maintain templates in one place (TEMPLATES.md)

### 3. Progressive Disclosure
- README.md = quick overview
- REQUIREMENTS.md = detailed specifications
- IMPLEMENTATION.md = step-by-step guide
- Each layer adds more detail

### 4. Audience-Specific Paths
- New developers → `general/GETTING_STARTED.md`
- Feature implementation → `{location}/IMPLEMENTATION.md`
- API consumers → `{location}/API.md`
- Operations → `runbooks/`

---

## 📞 Questions?

**Where should I put documentation about...**

| Topic | Location |
|-------|----------|
| Project setup | `general/GETTING_STARTED.md` |
| Platform auth | `platform/features/authentication/` |
| App feature | `apps/{app-name}/features/{feature}/` |
| Shared component | `packages/ui/` or `platform/components/` |
| Third-party API | `integrations/{service}.md` |
| Deployment | `infrastructure/DEPLOYMENT.md` |
| Incident handling | `runbooks/INCIDENT_RESPONSE.md` |
| Tech decision | `adrs/NNNN-{decision}.md` |
| Research findings | `research/{topic}/` |
| Training material | `training/{module}/` |

**Still not sure?**
1. Check the decision matrix above
2. Look for similar existing docs
3. Ask in team chat
4. When in doubt, start in `general/` and move later if needed

---

## ✅ Summary

This documentation system can accommodate:
- ✅ General project docs
- ✅ Platform features & implementation
- ✅ App features & implementation
- ✅ Shared packages
- ✅ Infrastructure & DevOps
- ✅ Third-party integrations
- ✅ Research & investigations
- ✅ Operational procedures
- ✅ Training materials
- ✅ Architecture decisions
- ✅ Any future documentation needs

**Every piece of documentation has a clear home in this system.**

---

**This is a living document. Update it as the documentation system evolves!**

---

**Version:** v1.0 (2025-11-13)
**Maintained By:** VISION Platform Team
