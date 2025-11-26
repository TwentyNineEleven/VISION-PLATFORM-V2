# VISION Platform Documentation System

**Purpose:** Complete guide to the documentation system structure and usage
**Last Updated:** November 17, 2025
**Status:** Production Ready

---

## Overview

The VISION Platform uses a **two-tier documentation system**:

1. **Strategic Documentation** (`/documentation`) - High-level steering documents
2. **Tactical Specifications** (`/.kiro/specs`) - Detailed implementation specs

This guide explains what goes where, when to use each, and how to maintain the system.

---

## Quick Decision Tree

**"Where should I put this documentation?"**

```
START: What are you documenting?

├─ Is it about VISION Platform's overall approach/architecture/standards?
│  └─ YES → /documentation/general/
│
├─ Is it about a specific platform feature (auth, search, notifications)?
│  └─ YES → /documentation/platform/features/{feature-name}/
│
├─ Is it about a specific app (CapacityIQ, FundingFramer)?
│  └─ YES → /documentation/apps/{app-name}/
│
├─ Is it about infrastructure/DevOps (Supabase, deployment, CI/CD)?
│  └─ YES → /documentation/infrastructure/
│
├─ Is it about a shared package (UI library, database client)?
│  └─ YES → /documentation/packages/{package-name}/
│
├─ Is it DETAILED implementation spec with user stories and tasks?
│  └─ YES → /.kiro/specs/{feature-name}/
│
└─ Is it research, ADR, runbook, or training material?
   └─ YES → /documentation/{research|adrs|runbooks|training}/
```

---

## Two-Tier System Explained

### Tier 1: Strategic Documentation (`/documentation`)

**Purpose:** High-level guidance for understanding the platform

**Contains:**
- Product requirements (PRD)
- Architecture decisions
- Code standards
- Security guidelines
- Testing strategy
- Feature overviews
- API design patterns
- Best practices

**Audience:**
- New developers onboarding
- Architects making decisions
- Teams understanding the "why"
- Anyone needing context

**Format:**
- Markdown READMEs
- Architecture diagrams
- Decision records
- Pattern libraries

**Example Files:**
- `/documentation/general/PRD.md` - What we're building
- `/documentation/general/ARCHITECTURE.md` - How it's structured
- `/documentation/platform/features/authentication/README.md` - Auth overview

---

### Tier 2: Tactical Specifications (`/.kiro/specs`)

**Purpose:** Detailed implementation instructions for specific features

**Contains:**
- User stories with acceptance criteria
- Database schemas
- API endpoint specifications
- Component designs
- Step-by-step implementation tasks
- Testing checklists

**Audience:**
- Developers implementing features
- QA testing features
- Product managers tracking progress
- AI agents building code

**Format:**
- `requirements.md` - What to build (user stories)
- `design.md` - How to build it (technical design)
- `tasks.md` - Step-by-step implementation
- `README.md` - Quick overview (optional)

**Example Files:**
- `/.kiro/specs/platform-shell-authentication/requirements.md`
- `/.kiro/specs/platform-shell-authentication/design.md`
- `/.kiro/specs/platform-shell-authentication/tasks.md`

---

## When to Use Which

### Use `/documentation` When:

✅ Explaining the **overall approach**
✅ Documenting **architecture patterns**
✅ Defining **standards and guidelines**
✅ Providing **onboarding materials**
✅ Describing **feature capabilities** (what it does)
✅ Recording **architectural decisions**
✅ Sharing **best practices**

**Example Scenarios:**
- "I need to explain our multi-tenant security approach"
- "I want to document our React component standards"
- "I need to onboard a new developer"
- "I want to explain what the authentication system does"

### Use `/.kiro/specs` When:

✅ Building a **specific feature**
✅ Need **user stories** and **acceptance criteria**
✅ Designing **database schemas** for a feature
✅ Specifying **API endpoints** in detail
✅ Creating **task breakdowns** for implementation
✅ Documenting **component props** and **interfaces**
✅ Writing **test cases** for a feature

**Example Scenarios:**
- "I'm implementing the authentication feature"
- "I need to know the exact database schema for audit logs"
- "I want step-by-step tasks for building the search feature"
- "I need detailed acceptance criteria for the notification center"

---

## Directory Structure Reference

### `/documentation` Structure

```
documentation/
├── README.md                   ← Navigation hub
├── INDEX.md                    ← File inventory
├── SYSTEM_OVERVIEW.md          ← Complete system view
├── DOCUMENTATION_SYSTEM.md     ← This file
├── TEMPLATES.md                ← Documentation templates
├── FEATURE_CREATION_PROMPT.md  ← AI prompt for docs
│
├── general/                    ← Project-wide steering docs
│   ├── PRD.md
│   ├── TECH_STACK.md
│   ├── ARCHITECTURE.md
│   ├── SECURITY.md
│   ├── CODE_STANDARDS.md
│   ├── TESTING.md
│   ├── MULTI_APP_BEST_PRACTICES.md
│   ├── API_DESIGN.md
│   ├── PERFORMANCE.md
│   └── ...
│
├── platform/                   ← Platform-shell docs
│   ├── features/              ← Platform features
│   │   ├── authentication/
│   │   │   └── README.md
│   │   ├── event-system/
│   │   ├── notification-center/
│   │   └── ...
│   └── implementation/        ← Time-based implementation
│       ├── week-1-2/
│       ├── week-3-4/
│       └── week-5-6/
│
├── apps/                      ← Application docs
│   ├── capacity-assessment/
│   ├── funding-framer/
│   └── crm-lite/
│
├── packages/                  ← Shared package docs
│   ├── ui/
│   ├── database/
│   └── ...
│
├── infrastructure/            ← DevOps docs
│   ├── funder-organizations/
│   └── ...
│
├── research/                  ← Research & spikes
├── runbooks/                  ← Operational procedures
├── training/                  ← Training materials
└── adrs/                      ← Architecture Decision Records
```

### `/.kiro/specs` Structure

```
.kiro/specs/
├── supabase-setup/
│   ├── requirements.md
│   ├── design.md
│   └── tasks.md
│
├── platform-shell-authentication/
│   ├── requirements.md
│   ├── design.md
│   └── tasks.md
│
├── platform-shell-notification-center/
│   ├── README.md
│   ├── requirements.md
│   ├── design.md
│   └── tasks.md
│
└── {feature-name}/
    ├── requirements.md        ← User stories, acceptance criteria
    ├── design.md             ← Technical design, schemas, APIs
    └── tasks.md              ← Implementation checklist
```

---

## File Naming Conventions

### In `/documentation`

**Feature Directories:**
- Always lowercase with hyphens: `authentication/`, `notification-center/`
- Always contains `README.md` at minimum

**File Names:**
- Use UPPER_CASE.md for major documents: `PRD.md`, `ARCHITECTURE.md`
- Use sentence-case for specific topics: `Getting_Started.md`
- Use README.md for directory entry points

### In `/.kiro/specs`

**Directory Names:**
- Prefix with layer: `platform-shell-*`, `packages-*`, `infrastructure-*`
- Use kebab-case: `platform-shell-notification-center`

**Required Files:**
- `requirements.md` - Always required
- `design.md` - Always required
- `tasks.md` - Always required
- `README.md` - Optional quick overview

---

## Cross-Referencing

### From `/documentation` to `/.kiro/specs`

**In feature READMEs, always link to detailed spec:**

```markdown
## Implementation Specification

For detailed implementation guidance, see:
- [Requirements](../../../.kiro/specs/platform-shell-{feature}/requirements.md)
- [Technical Design](../../../.kiro/specs/platform-shell-{feature}/design.md)
- [Implementation Tasks](../../../.kiro/specs/platform-shell-{feature}/tasks.md)
```

### From `/.kiro/specs` to `/documentation`

**In spec files, reference steering docs:**

```markdown
## Related Documentation

See also:
- [/documentation/general/ARCHITECTURE.md](/documentation/general/ARCHITECTURE.md)
- [/documentation/general/SECURITY.md](/documentation/general/SECURITY.md)
- [/documentation/platform/features/{related-feature}/](/documentation/platform/features/{related-feature}/)
```

---

## Creating New Documentation

### Creating Strategic Documentation

**1. Determine Location** (use decision tree above)

**2. Use Template** from `/documentation/TEMPLATES.md`

**3. Create Files:**
```bash
# For platform feature
mkdir -p documentation/platform/features/{feature-name}
cd documentation/platform/features/{feature-name}
touch README.md

# For app feature
mkdir -p documentation/apps/{app-name}/features/{feature-name}
cd documentation/apps/{app-name}/features/{feature-name}
touch README.md
```

**4. Update INDEX.md**

### Creating Tactical Specification

**1. Create Directory:**
```bash
mkdir -p .kiro/specs/{layer}-{feature-name}
cd .kiro/specs/{layer}-{feature-name}
```

**2. Create Required Files:**
```bash
touch requirements.md
touch design.md
touch tasks.md
```

**3. Use Standard Structure:**
- See existing specs for structure
- Include glossary in requirements.md
- Use "SHALL" language for requirements
- Break tasks into < 4 hour chunks

**4. Link from `/documentation`**

---

## Maintenance Guidelines

### Weekly

- [ ] Check for new files in wrong locations
- [ ] Update INDEX.md if files added
- [ ] Fix broken links
- [ ] Update "Last Updated" dates on changed files

### Monthly

- [ ] Review all "Status: Draft" documents
- [ ] Archive outdated documentation
- [ ] Update cross-references
- [ ] Check for duplicate content

### Quarterly

- [ ] Full documentation audit
- [ ] Remove unused docs
- [ ] Consolidate duplicates
- [ ] Update system documentation

---

## Best Practices

### DO:

✅ **Start with strategic docs** - Write overview before diving into specs
✅ **Link everything** - Connect related documents
✅ **Use templates** - Ensures consistency
✅ **Include code examples** - Real, runnable code
✅ **Update timestamps** - "Last Updated" on every change
✅ **Mark status** - Draft, In Progress, Complete
✅ **Cross-reference** - Link strategic ↔ tactical docs

### DON'T:

❌ **Duplicate content** - Link instead of copying
❌ **Mix levels** - Keep strategic and tactical separate
❌ **Skip templates** - Leads to inconsistency
❌ **Use absolute paths** - Use relative links
❌ **Forget to update INDEX** - Keeps inventory current
❌ **Leave docs orphaned** - Always link from parent

---

## Common Scenarios

### Scenario 1: Documenting a New Platform Feature

**Example:** Adding "Team Chat" feature

**Steps:**
1. Create strategic overview:
   - `/documentation/platform/features/team-chat/README.md`
   - Describe what it does, capabilities, use cases

2. Create tactical spec:
   - `/.kiro/specs/platform-shell-team-chat/requirements.md`
   - `/.kiro/specs/platform-shell-team-chat/design.md`
   - `/.kiro/specs/platform-shell-team-chat/tasks.md`

3. Cross-reference:
   - Link README to spec
   - Link spec to README
   - Update `/documentation/INDEX.md`

### Scenario 2: Documenting Infrastructure

**Example:** Documenting CI/CD pipeline

**Steps:**
1. Create infrastructure doc:
   - `/documentation/infrastructure/CICD.md`
   - Describe overall CI/CD approach

2. If specific implementation details:
   - `/.kiro/specs/infrastructure-cicd/` (optional)
   - Only if tactical implementation needed

3. Link from main README

### Scenario 3: Recording an Architecture Decision

**Example:** Deciding to use Mantine UI over Material-UI

**Steps:**
1. Create ADR:
   - `/documentation/adrs/0003-use-mantine-ui.md`
   - Use ADR template
   - Explain context, decision, consequences

2. Reference in steering docs:
   - Update `/documentation/general/TECH_STACK.md`
   - Add link to ADR

3. Update INDEX.md

---

## Migration from `/docs` to `/documentation`

**Status:** In progress

**Actions Taken:**
- ✅ Deprecation notice added to `/docs/README.md`
- ✅ Main content migrated to `/documentation/general/`
- ⏳ `/docs` to be archived after verification

**What to Do:**
- **New docs:** Always use `/documentation`
- **Existing docs:** Update references to point to `/documentation`
- **Links:** Fix any links pointing to `/docs`

---

## FAQ

### Q: Where do API docs go?

**A:** Depends on scope:
- **General API patterns:** `/documentation/general/API_DESIGN.md`
- **Platform API reference:** `/documentation/platform/api/`
- **Specific feature API:** `/.kiro/specs/{feature}/design.md`

### Q: Where do database schemas go?

**A:** Both places:
- **Overall schema patterns:** `/documentation/general/ARCHITECTURE.md`
- **Specific table schemas:** `/.kiro/specs/{feature}/design.md`

### Q: Should I use /documentation or .kiro/specs for component docs?

**A:** Both:
- **Component library overview:** `/documentation/packages/ui/README.md`
- **Specific component spec:** `/.kiro/specs/{feature}/design.md` (if part of feature)

### Q: What if a feature spans multiple apps?

**A:** Use platform features:
- `/documentation/platform/features/{cross-app-feature}/`
- Explains how it works across apps

### Q: Where do code examples go?

**A:** Both:
- **Pattern examples:** `/documentation/general/CODE_STANDARDS.md`
- **Implementation examples:** `/.kiro/specs/{feature}/design.md`

### Q: How do I handle sensitive documentation?

**A:**
- Keep in separate private repo (not in VISION-PLATFORM)
- Reference (but don't link) from public docs
- Use environment-specific docs

---

## Tools & Automation

### Link Checker (Planned)

```bash
# Future: Validate all internal links
npm run docs:check-links
```

### Documentation Coverage (Planned)

```bash
# Future: Check documentation completeness
npm run docs:coverage
```

### Auto-generation (Planned)

```bash
# Future: Generate API docs from code
npm run docs:generate-api
```

---

## Support

**Questions about the documentation system?**

1. Read this guide (DOCUMENTATION_SYSTEM.md)
2. Check [SYSTEM_OVERVIEW.md](SYSTEM_OVERVIEW.md)
3. Check [README.md](README.md)
4. Ask in team chat
5. Create issue with `documentation` label

**Want to improve the system?**

1. Propose changes in team discussion
2. Create PR with improvements
3. Update this guide
4. Notify team of changes

---

## Summary

### Key Principles

1. **Two-Tier System:** Strategic (/documentation) + Tactical (/.kiro/specs)
2. **Clear Separation:** Overview vs. Implementation
3. **Cross-Referenced:** Always link between tiers
4. **Consistent Structure:** Use templates and conventions
5. **Living Documentation:** Update as project evolves

### Quick Reference

| Documentation Type | Location | Purpose |
|-------------------|----------|---------|
| Product requirements | `/documentation/general/PRD.md` | What we're building |
| Architecture | `/documentation/general/ARCHITECTURE.md` | How it's structured |
| Feature overview | `/documentation/platform/features/{feature}/` | What feature does |
| Feature spec | `/.kiro/specs/{feature}/` | How to implement |
| Code standards | `/documentation/general/CODE_STANDARDS.md` | How to write code |
| Best practices | `/documentation/general/MULTI_APP_BEST_PRACTICES.md` | Patterns to follow |

---

**This guide ensures documentation is:**
- ✅ Easy to find
- ✅ Consistently structured
- ✅ Properly maintained
- ✅ Actually useful

---

**Version:** v1.0 (2025-11-17)
**Status:** Production Ready
**Maintained By:** VISION Platform Team
