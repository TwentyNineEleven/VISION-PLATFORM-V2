# Feature Creation Prompt

**Purpose:** Comprehensive AI prompt for researching, documenting, and implementing new features
**Last Updated:** November 13, 2025

---

## How to Use This Prompt

1. Copy the prompt below
2. Replace `{FEATURE_NAME}`, `{FEATURE_TYPE}`, and `{LOCATION}` with your values
3. Paste into Claude or your AI assistant
4. AI will research, document, and create implementation guide

---

## The Feature Creation Prompt

```
I need you to research, document, and create a complete implementation guide for a new feature in the VISION Platform.

---

## FEATURE INFORMATION

**Feature Name:** {FEATURE_NAME}
**Feature Type:** {FEATURE_TYPE} (platform-feature | app-feature)
**Location:** {LOCATION}
  - If platform-feature: `documentation/platform/features/{feature-name}/`
  - If app-feature: `documentation/apps/{app-name}/features/{feature-name}/`

**Brief Description:** {1-2 sentences describing what this feature does}

---

## YOUR TASKS

Complete the following tasks in order. For each task, produce complete, production-ready documentation.

---

### PHASE 1: RESEARCH (30 minutes)

**Task 1.1: Feature Research**

Research and analyze this feature by investigating:

1. **Similar Features in Existing Codebase**
   - Search the codebase for similar functionality
   - Document patterns that already exist
   - Identify reusable components/utilities
   - Note what we can leverage vs. what's new

2. **Technology Stack Requirements**
   - Identify which technologies are needed (from docs/TECH_STACK.md)
   - Check if new dependencies are required
   - Verify compatibility with existing stack

3. **Design System Compliance**
   - Review design-system documentation
   - Identify which Mantine components to use
   - Document design tokens that apply
   - Note accessibility requirements

4. **Security Requirements**
   - Identify authentication needs
   - Determine RLS policy requirements
   - List input validation needs
   - Note any OWASP concerns

5. **Integration Points**
   - Which platform features does this connect to?
   - Which app features does this integrate with?
   - What events should be published/subscribed?
   - What shared data is needed?

**Deliverable 1.1:** Research findings document with:
- Existing patterns to follow
- Technologies required
- Design system components
- Security requirements
- Integration points

---

**Task 1.2: Requirements Analysis**

Analyze the requirements by answering:

1. **User Perspective**
   - Who are the primary users?
   - What problem does this solve?
   - What are the user stories?
   - What's the expected user flow?

2. **Functional Requirements**
   - What are the core features?
   - What are the acceptance criteria?
   - What business rules apply?
   - What's in scope vs. out of scope?

3. **Technical Requirements**
   - What UI components are needed?
   - What API endpoints are needed?
   - What database tables are needed?
   - What state management is needed?

4. **Non-Functional Requirements**
   - Performance targets (load time, response time)
   - Security requirements (auth, validation, RLS)
   - Accessibility requirements (WCAG 2.1 AA)
   - Responsive design requirements (mobile/tablet/desktop)

5. **Dependencies**
   - What must exist before this can be built?
   - What does this enable for the future?
   - What are the risks and mitigation strategies?

**Deliverable 1.2:** Complete requirements analysis

---

### PHASE 2: DOCUMENTATION (1-2 hours)

**Task 2.1: Create README.md**

Using the Feature README Template from TEMPLATES.md, create a comprehensive README.md that includes:

- Feature overview and purpose
- Key capabilities
- User stories
- Technical overview (components, APIs, database)
- Architecture diagram (ASCII or description)
- Dependencies
- Security and performance considerations
- Related documentation links
- Quick links to code locations

**File:** `{LOCATION}/README.md`

---

**Task 2.2: Create REQUIREMENTS.md**

Using the Feature REQUIREMENTS Template from TEMPLATES.md, create a detailed REQUIREMENTS.md that includes:

1. **Executive Summary**
   - What, why, and success metrics

2. **User Requirements**
   - Primary users
   - User stories with acceptance criteria

3. **Functional Requirements**
   - Core features with specific requirements
   - Business rules
   - Feature breakdown

4. **Technical Requirements**
   - Frontend requirements (components, state, routing)
   - Backend requirements (API endpoints with full specs)
   - Database requirements (schema, indexes, RLS policies)

5. **Non-Functional Requirements**
   - Performance, security, accessibility, responsive design, testing

6. **Data Requirements**
   - Data models (TypeScript interfaces)
   - Validation schemas (Zod)
   - Migration plans

7. **Integration Requirements**
   - Internal integrations
   - External integrations
   - Event bus integration

8. **Success Metrics**
   - KPIs, user adoption, technical metrics

9. **Dependencies, Assumptions, Constraints, Risks**

10. **Out of Scope**

**File:** `{LOCATION}/REQUIREMENTS.md`

---

**Task 2.3: Create IMPLEMENTATION.md**

Using the Feature IMPLEMENTATION Template from TEMPLATES.md, create a step-by-step IMPLEMENTATION.md that includes:

1. **Prerequisites**
   - What must be done before starting

2. **Implementation Overview**
   - Estimated time
   - Implementation order

3. **Step 1: Database Schema**
   - Complete SQL migration with:
     - Table creation
     - Indexes
     - RLS policies
     - Triggers
   - Migration application commands
   - RLS testing SQL

4. **Step 2: API Routes**
   - Complete API route code for:
     - GET (list/fetch)
     - POST (create)
     - PATCH/PUT (update)
     - DELETE (if needed)
   - Full TypeScript code with:
     - Authentication
     - Authorization
     - Input validation (Zod)
     - Error handling
     - Response formatting
   - Testing commands

5. **Step 3: Frontend Components**
   - Main page component (full code)
   - Sub-components (full code)
   - State management (if needed)
   - Form handling with validation

6. **Step 4: Integration & Testing**
   - Unit tests (full code)
   - Integration tests (full code)
   - E2E tests (full code)
   - Testing commands

7. **Step 5: Event Bus Integration (if applicable)**
   - Event publishing code
   - Event subscription code

8. **Step 6: Documentation**
   - Documentation checklist

9. **Deployment Checklist**
   - Complete pre-deployment checklist

10. **Troubleshooting**
    - Common issues and solutions

**File:** `{LOCATION}/IMPLEMENTATION.md`

---

### PHASE 3: IMPLEMENTATION PLAN (30 minutes - 1 hour)

**Task 3.1: Create Day-by-Day Implementation Schedule**

Create a detailed implementation timeline that breaks down the work into days:

**Day 1: Database & Backend Foundation**
- Morning: Create and apply migration
- Afternoon: Create API routes
- Deliverable: Database schema complete, API endpoints functional

**Day 2: Frontend Components**
- Morning: Create main page component
- Afternoon: Create sub-components and forms
- Deliverable: UI functional with basic functionality

**Day 3: Integration & Polish**
- Morning: Event bus integration (if needed)
- Afternoon: Testing and bug fixes
- Deliverable: Feature complete and tested

**Day 4: Testing & Documentation (if needed)**
- Morning: Write comprehensive tests
- Afternoon: Update documentation
- Deliverable: Tests passing, docs complete

Include for each day:
- Specific tasks (with file paths)
- Code examples
- Testing procedures
- Deliverables

---

**Task 3.2: Identify Potential Issues**

Analyze the implementation for potential issues:

1. **Technical Challenges**
   - Complex logic areas
   - Performance bottlenecks
   - Integration difficulties

2. **Dependencies**
   - Blocking dependencies
   - External service dependencies

3. **Risks**
   - Security risks
   - Data migration risks
   - Compatibility risks

4. **Mitigation Strategies**
   - How to address each risk
   - Fallback plans

---

### PHASE 4: VALIDATION (15 minutes)

**Task 4.1: Cross-Reference Documentation**

Validate your documentation against:

1. **Code Standards** (docs/general/CODE_STANDARDS.md)
   - TypeScript standards followed
   - React patterns correct
   - Naming conventions consistent

2. **Security Guidelines** (docs/general/SECURITY.md)
   - Authentication required
   - Input validation present
   - RLS policies correct
   - XSS/CSRF/SQL injection prevented

3. **Design System** (docs/platform/features/design-system/)
   - Mantine components used correctly
   - Design tokens applied
   - Accessibility compliant
   - Responsive design implemented

4. **Testing Standards** (docs/general/TESTING.md)
   - 80%+ coverage planned
   - Critical paths tested
   - RLS policies tested

---

**Task 4.2: Create Validation Checklist**

Create a checklist for validating the implementation:

**Documentation Validation:**
- [ ] README.md complete and accurate
- [ ] REQUIREMENTS.md comprehensive
- [ ] IMPLEMENTATION.md has complete code examples
- [ ] All templates followed
- [ ] Links to related docs included
- [ ] Code examples are runnable

**Technical Validation:**
- [ ] Database schema follows conventions
- [ ] RLS policies enforce multi-tenant isolation
- [ ] API routes have authentication
- [ ] Input validation with Zod
- [ ] Error handling present
- [ ] TypeScript types correct
- [ ] Components use Mantine
- [ ] Design tokens applied
- [ ] Responsive design implemented
- [ ] Accessibility compliant (WCAG 2.1 AA)

**Testing Validation:**
- [ ] Unit tests planned (80%+ coverage)
- [ ] Integration tests planned
- [ ] E2E tests planned for critical flows
- [ ] RLS policy tests included

---

## OUTPUT FORMAT

Provide your output in the following structure:

### Part 1: Research Summary
[Concise summary of research findings - 2-3 paragraphs]

### Part 2: Documentation Files

**File 1: README.md**
```markdown
[Complete README.md content using template]
```

**File 2: REQUIREMENTS.md**
```markdown
[Complete REQUIREMENTS.md content using template]
```

**File 3: IMPLEMENTATION.md**
```markdown
[Complete IMPLEMENTATION.md content using template]
```

### Part 3: Implementation Timeline
[Day-by-day breakdown with tasks, code examples, and deliverables]

### Part 4: Validation Results
[Validation checklist with all items checked and notes]

### Part 5: Next Steps
[Clear next steps for developer to begin implementation]

---

## IMPORTANT GUIDELINES

1. **Be Comprehensive:** Every code example should be complete and runnable
2. **Follow Templates:** Use the templates from TEMPLATES.md exactly
3. **Be Specific:** Include exact file paths, command examples, SQL queries
4. **Think Security:** Every feature must have authentication, validation, and RLS
5. **Think Multi-Tenant:** All data must be isolated by organization_id
6. **Think Accessibility:** All UI must meet WCAG 2.1 AA
7. **Think Testing:** Plan for 80%+ test coverage
8. **Think Events:** Consider what events should be published/subscribed
9. **Reference Existing Code:** Look at existing features for patterns
10. **Be Production-Ready:** All code should be ready to deploy

---

## CONTEXT FILES TO REFERENCE

Before starting, read these files for context:

1. **Project Context:**
   - `docs/PRD.md` - Product requirements
   - `docs/TECH_STACK.md` - Technology stack
   - `.claude/CLAUDE.md` - Code standards

2. **Platform Context (for platform features):**
   - `documentation/platform/features/platform-shell/REQUIREMENTS.md`
   - `documentation/platform/features/authentication/REQUIREMENTS.md`
   - `documentation/platform/features/design-system/README.md`

3. **App Context (for app features):**
   - `documentation/apps/{app-name}/README.md` (if exists)
   - Related app feature documentation

4. **Templates:**
   - `documentation/TEMPLATES.md` - All documentation templates

5. **Standards:**
   - `documentation/general/CODE_STANDARDS.md`
   - `documentation/general/SECURITY.md`
   - `documentation/general/TESTING.md`

---

## BEGIN FEATURE CREATION

Start with Phase 1: Research and work through all phases systematically.

Remember: The goal is to create documentation so comprehensive that any developer can implement this feature by following the IMPLEMENTATION.md guide step-by-step.
```

---

## Example Usage

### Example 1: Platform Feature

```
**Feature Name:** Team Invitations
**Feature Type:** platform-feature
**Location:** documentation/platform/features/team-invitations/
**Brief Description:** Allow organization admins to invite new team members via email with role-based permissions.
```

### Example 2: App Feature

```
**Feature Name:** Grant Budgets
**Feature Type:** app-feature
**Location:** documentation/apps/funding-framer/features/grant-budgets/
**Brief Description:** Allow users to create detailed budgets for grant proposals with line items, categories, and automated calculations.
```

---

## Quick Start Commands

### Create Platform Feature Documentation
```bash
# 1. Create feature directory
mkdir -p documentation/platform/features/{feature-name}

# 2. Use the FEATURE_CREATION_PROMPT above with AI

# 3. AI will generate:
#    - README.md
#    - REQUIREMENTS.md
#    - IMPLEMENTATION.md

# 4. Review and refine the documentation

# 5. Begin implementation following IMPLEMENTATION.md
```

### Create App Feature Documentation
```bash
# 1. Create feature directory
mkdir -p documentation/apps/{app-name}/features/{feature-name}

# 2. Use the FEATURE_CREATION_PROMPT above with AI

# 3. AI will generate complete documentation

# 4. Begin implementation
```

---

## Tips for Best Results

1. **Be Specific:** The more detail you provide about the feature, the better the output
2. **Provide Context:** Mention related features, user flows, or business requirements
3. **Review Output:** Always review AI-generated documentation for accuracy
4. **Iterate:** Run the prompt multiple times if needed to refine
5. **Test Examples:** Verify all code examples actually work
6. **Update as Needed:** Documentation should evolve with the feature

---

## Validation After AI Generation

After AI generates documentation, validate:

- [ ] All three files created (README, REQUIREMENTS, IMPLEMENTATION)
- [ ] Code examples are complete and runnable
- [ ] SQL migrations have RLS policies
- [ ] API routes have authentication and validation
- [ ] Components use Mantine and design tokens
- [ ] Tests are comprehensive (unit, integration, E2E)
- [ ] Security requirements addressed
- [ ] Accessibility requirements addressed
- [ ] Links to related documentation included
- [ ] Implementation timeline is realistic

---

## Support

If you encounter issues with this prompt:

1. Check [TEMPLATES.md](TEMPLATES.md) for template examples
2. Review existing feature documentation for patterns
3. Consult [documentation/general/CODE_STANDARDS.md](general/CODE_STANDARDS.md)
4. Ask in team chat for clarification

---

**This prompt creates production-ready, comprehensive documentation for any feature in the VISION Platform. Use it every time you need to document a new feature!**

---

**Version:** v1.0 (2025-11-13)
