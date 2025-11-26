# Agent Prompts Index

This document provides quick links to all agent prompts available in this repository for implementing various features and fixes.

---

## 🤖 Available Agent Prompts

### 1. VisionFlow Phase 2+ Implementation
**File**: [VISIONFLOW_PHASE2_AGENT_PROMPT.md](VISIONFLOW_PHASE2_AGENT_PROMPT.md)

**What it does**: Complete implementation guide for remaining VisionFlow pages
- Plans page with sharing functionality
- Projects page with **Kanban board** (from Figma design)
- Workflows page with template builder
- Calendar page with drag-and-drop scheduling

**Figma Design**: https://www.figma.com/design/vyRUcaDKVr9sJwRVj30oAq/Glow-UI-%E2%80%94-Pro-1.7?node-id=37388-42830&m=dev

**Timeline**: 5 weeks (split into 4 phases)

**Usage**:
```bash
# Give this prompt to an AI agent:
"Read VISIONFLOW_PHASE2_AGENT_PROMPT.md and implement Phase 2A (Plans) following all guidelines"
```

**Prerequisites**:
- Phase 0-1 complete (database, task management)
- Figma design access
- Understanding of Glow UI and 2911 color system

---

## 📋 How to Use Agent Prompts

### Step 1: Review the Prompt
Read the prompt file to understand:
- What will be implemented
- Prerequisites needed
- Expected deliverables
- Timeline estimate

### Step 2: Verify Prerequisites
Ensure all prerequisites are met:
- Database migrations run
- Dependencies installed
- Design assets accessible
- Test environment working

### Step 3: Provide to Agent
Give the prompt to your AI agent:
- Use tools like Claude Code, GitHub Copilot, Cursor
- Or assign to human developer as detailed spec
- Include link to this repository

### Step 4: Validate Results
Check deliverables against acceptance criteria:
- Code quality (TypeScript, linting)
- Design fidelity (matches Figma)
- Functionality (manual testing)
- Tests passing (unit, integration)

---

## 🎯 Quick Start Commands

### Run All Validations
```bash
# Type checking
pnpm type-check

# Linting
pnpm lint

# Tests
pnpm test

# Build
pnpm build

# Color system validation
pnpm validate:colors
```

### Start Development
```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Open in browser
open http://localhost:3000
```

### Database Setup
```bash
# Run migrations (if not done)
# See VISIONFLOW_SETUP_COMPLETE.md

# Generate types
npx supabase gen types typescript --project-id qhibeqcsixitokxllhom > apps/shell/src/types/supabase.ts
```

---

## 📚 Related Documentation

### Setup & Configuration
- [VISIONFLOW_SETUP_COMPLETE.md](VISIONFLOW_SETUP_COMPLETE.md) - VisionFlow database setup
- [TEST_USER_CREDENTIALS.md](TEST_USER_CREDENTIALS.md) - Login credentials
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Common issues

### Implementation Guides
- [VISIONFLOW_IMPLEMENTATION_PLAYBOOK.md](VISIONFLOW_IMPLEMENTATION_PLAYBOOK.md) - Architecture guide
- [VISIONFLOW_PR_DESCRIPTION.md](VISIONFLOW_PR_DESCRIPTION.md) - PR template
- [CLAUDE.md](CLAUDE.md) - Project-wide guidelines

### Next Steps
- [NEXT_STEPS_SUMMARY.md](NEXT_STEPS_SUMMARY.md) - What to do next

---

## 🔧 Creating New Agent Prompts

When creating new agent prompts, follow this structure:

### 1. Clear Objective
State what needs to be built in one sentence.

### 2. Context & Requirements
- Current state
- Dependencies
- Design references
- Technology stack

### 3. Detailed Specifications
- File structure
- API endpoints
- Component requirements
- Database schema
- TypeScript types

### 4. Design System Guidelines
- Color palette
- Component usage
- Spacing rules
- Shadow system

### 5. Testing Requirements
- Unit tests
- Integration tests
- E2E tests (if needed)

### 6. Acceptance Criteria
Clear checklist of "done" conditions.

### 7. Implementation Steps
Week-by-week breakdown.

### 8. Deliverables
What files/docs should be created.

---

## 💡 Best Practices

### For Agent Consumers
1. **Read fully** before starting
2. **Ask questions** if unclear
3. **Follow exactly** - don't deviate
4. **Test incrementally** - don't wait until end
5. **Commit often** - small, atomic commits

### For Prompt Writers
1. **Be specific** - no ambiguity
2. **Include examples** - show, don't just tell
3. **Link resources** - Figma, docs, reference code
4. **Set clear expectations** - acceptance criteria
5. **Provide context** - why, not just what

---

## 🆘 Need Help?

### Issues with Prompts
- Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- Review existing implementation in codebase
- Ask specific questions in PR comments

### Technical Questions
- Refer to [CLAUDE.md](CLAUDE.md) for architecture
- Check component library in `apps/shell/src/components/glow-ui/`
- Review database schema in `supabase/migrations/`

### Design Questions
- Reference Figma design link in prompt
- Check 2911 Color System in `CLAUDE.md`
- Review Glow UI components for patterns

---

## 📊 Prompt Status Tracker

| Prompt | Status | Priority | Estimated Time |
|--------|--------|----------|----------------|
| VisionFlow Phase 2+ | ✅ Ready | High | 5 weeks |
| Future prompts... | - | - | - |

---

**Last Updated**: November 24, 2025

**Maintained by**: VISION Platform Development Team
