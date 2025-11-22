# VISION Platform V2 - Documentation

**Project:** VISION Platform V2 (Fresh Build)
**Created:** November 19, 2025
**Status:** Active Development

---

## About This Documentation

This documentation has been carefully curated from the original VISION Platform to provide **guidance and framework** for building VISION Platform V2. This is a **fresh build**, not a migration of the previous implementation.

### What Was Copied

The documentation included here represents **knowledge, patterns, and requirements** - NOT implementation specifics from the previous build:

#### 1. Framework & Templates
- **TEMPLATES.md** - Documentation templates for consistency
- **FEATURE_CREATION_PROMPT.md** - AI-assisted feature documentation creation
- **DOCUMENTATION_GUIDELINES.md** - Where to place different types of documentation
- **DOCUMENTATION_SYSTEM.md** - Complete overview of the documentation system

#### 2. General Guidelines & Standards
- **PROJECT_OVERVIEW.md** - High-level product vision and goals
- **TECH_STACK.md** - Technology choices and rationale
- **CODE_STANDARDS.md** - Coding conventions and best practices
- **ARCHITECTURE.md** - System architecture principles
- **SECURITY.md** - Security guidelines and requirements
- **TESTING.md** - Testing strategy and standards
- **API_DESIGN.md** - API design principles
- **PERFORMANCE.md** - Performance considerations
- **MULTI_APP_BEST_PRACTICES.md** - Multi-app architecture patterns
- **development-philosophy/** - Development principles and philosophy

#### 3. Platform Feature Requirements (As Guidance)
- **authentication/** - Authentication requirements and patterns
- **design-system/** - Design system specifications
- **event-system/** - Event-driven architecture patterns
- **platform-shell/** - Platform container requirements
- **organization-onboarding/** - Onboarding flow requirements

#### 4. Research & Reference
- **AI_AGENT_FRAMEWORK.md** - AI integration patterns
- **AI_DEVELOPMENT_PROMPT.md** - AI-assisted development guidance
- **USER_JOURNEY_ANALYSIS.md** - User experience insights

#### 5. Infrastructure Reference
- **funder-organizations/** - Funder organization structure and requirements

### What Was NOT Copied

To ensure a clean start, the following were intentionally excluded:

- ❌ **Implementation Plans** - Build-specific day-by-day plans from V1
- ❌ **Status Reports** - Completion reports, validation summaries from V1
- ❌ **Archive Documents** - Historical documents from V1 development
- ❌ **Implementation Details** - Code examples specific to V1 build
- ❌ **App-Specific Docs** - Previous app implementations (CapacityIQ, etc.)
- ❌ **Build-Specific Audits** - Documentation audits from V1
- ❌ **INDEX.md** - Old index (create new one as needed)

---

## Documentation Structure

```
documentation/
│
├── README.md                              ← You are here
├── TEMPLATES.md                           ← Documentation templates
├── FEATURE_CREATION_PROMPT.md             ← Feature documentation creation
├── DOCUMENTATION_GUIDELINES.md            ← Documentation organization guide
├── DOCUMENTATION_SYSTEM.md               ← System overview
│
├── general/                               ← Project-wide standards
│   ├── PROJECT_OVERVIEW.md
│   ├── TECH_STACK.md
│   ├── CODE_STANDARDS.md
│   ├── ARCHITECTURE.md
│   ├── SECURITY.md
│   ├── TESTING.md
│   ├── API_DESIGN.md
│   ├── PERFORMANCE.md
│   ├── MULTI_APP_BEST_PRACTICES.md
│   └── development-philosophy/
│
├── platform/                              ← Platform guidance
│   └── features/
│       ├── authentication/
│       ├── design-system/
│       ├── event-system/
│       ├── platform-shell/
│       └── organization-onboarding/
│
├── research/                              ← Research & patterns
│   ├── AI_AGENT_FRAMEWORK.md
│   ├── AI_DEVELOPMENT_PROMPT.md
│   └── USER_JOURNEY_ANALYSIS.md
│
└── infrastructure/                        ← Infrastructure reference
    └── funder-organizations/
```

---

## Quick Start

### For New Features
1. Review [FEATURE_CREATION_PROMPT.md](FEATURE_CREATION_PROMPT.md)
2. Use [TEMPLATES.md](TEMPLATES.md) for structure
3. Follow [DOCUMENTATION_GUIDELINES.md](DOCUMENTATION_GUIDELINES.md) for placement

### For Development Standards
1. Start with [general/PROJECT_OVERVIEW.md](general/PROJECT_OVERVIEW.md)
2. Review [general/CODE_STANDARDS.md](general/CODE_STANDARDS.md)
3. Check [general/TECH_STACK.md](general/TECH_STACK.md)

### For Architecture Guidance
1. Read [general/ARCHITECTURE.md](general/ARCHITECTURE.md)
2. Review [general/MULTI_APP_BEST_PRACTICES.md](general/MULTI_APP_BEST_PRACTICES.md)
3. Check platform feature requirements for patterns

### For Security & Quality
1. Review [general/SECURITY.md](general/SECURITY.md)
2. Check [general/TESTING.md](general/TESTING.md)
3. Review [general/PERFORMANCE.md](general/PERFORMANCE.md)

---

## How to Use This Documentation

### As Requirements
The platform feature documentation (authentication, design-system, etc.) should be used as **requirements and patterns**, not implementation instructions. These describe **what** needs to be built and **why**, but the **how** is up to your new implementation.

### As Guidance
The general documentation provides proven patterns and standards. Adapt them to your new architecture rather than copying blindly.

### As Templates
Use the templates and prompts to create NEW documentation for V2-specific features and implementations.

### As Reference
The research and infrastructure docs provide context and insights that remain relevant regardless of implementation.

---

## Creating New Documentation

### When to Create Documentation

1. **New Feature** - Use FEATURE_CREATION_PROMPT.md
2. **Implementation Plan** - Create your own for V2 (don't reuse V1)
3. **API Changes** - Document new endpoints
4. **Architecture Decisions** - Record significant decisions

### Where to Place Documentation

Follow [DOCUMENTATION_GUIDELINES.md](DOCUMENTATION_GUIDELINES.md) decision matrix:

- **Project-wide standards** → `general/`
- **Platform features** → `platform/features/{feature}/`
- **Apps** → `apps/{app-name}/` (create as needed)
- **Packages** → `packages/{package}/` (create as needed)
- **Infrastructure** → `infrastructure/` (expand as needed)
- **Research** → `research/` (expand as needed)

---

## Best Practices for V2

### 1. Don't Copy Implementation
The V1 implementation details are not in this documentation for a reason. Build V2 with fresh eyes and new approaches.

### 2. Use Requirements as Guidance
The platform feature requirements describe **user needs and business logic**, which remain valid. The implementation approach is yours to define.

### 3. Document As You Go
Create NEW implementation documentation specific to V2. Use the templates provided.

### 4. Maintain Standards
The code standards, security guidelines, and architecture principles are proven. Follow them unless you have a compelling reason to deviate.

### 5. Build on Patterns
The patterns in research/ and platform features represent lessons learned. Build on this knowledge.

---

## Next Steps

1. **Review Core Documentation**
   - Read PROJECT_OVERVIEW.md for product vision
   - Review TECH_STACK.md for technology choices
   - Understand CODE_STANDARDS.md for development approach

2. **Create V2 Index**
   - Create a new INDEX.md as you build
   - Track what documentation you create
   - Keep it current

3. **Document Your Implementation**
   - Use FEATURE_CREATION_PROMPT.md for features
   - Create implementation plans for V2
   - Document architecture decisions

4. **Expand Structure**
   - Add `apps/` as you build applications
   - Add `packages/` for shared libraries
   - Expand `infrastructure/` as needed

---

## Important Notes

### This is NOT a Migration
VISION Platform V2 is a fresh build. This documentation provides:
- ✅ Requirements and business logic
- ✅ Patterns and best practices
- ✅ Standards and guidelines
- ❌ NOT implementation details from V1
- ❌ NOT build-specific plans from V1

### Adapt, Don't Copy
These documents are **guidance**, not gospel. Adapt them to:
- Your new architecture
- Your new implementation approach
- Lessons learned from V1
- New requirements and insights

### Keep It Fresh
As you build V2:
- Create NEW documentation for V2 specifics
- Update templates if they don't fit
- Add to research/ as you learn
- Keep standards current

---

## Documentation Maintenance

### As You Build
- Document new features using templates
- Update this README as structure evolves
- Create INDEX.md when structure stabilizes
- Link documentation together

### Regular Updates
- Keep "Last Updated" dates current
- Mark outdated docs as deprecated
- Archive V2-specific obsolete docs separately
- Review quarterly

---

## Questions?

### About the Documentation System
- Check [DOCUMENTATION_SYSTEM.md](DOCUMENTATION_SYSTEM.md)
- Review [DOCUMENTATION_GUIDELINES.md](DOCUMENTATION_GUIDELINES.md)

### About Documentation Placement
- Use the decision matrix in [DOCUMENTATION_GUIDELINES.md](DOCUMENTATION_GUIDELINES.md)
- When in doubt, start in `general/` and move later

### About Feature Documentation
- Use [FEATURE_CREATION_PROMPT.md](FEATURE_CREATION_PROMPT.md)
- Follow templates in [TEMPLATES.md](TEMPLATES.md)

---

## Summary

You now have:
- ✅ Complete documentation framework
- ✅ Proven standards and guidelines
- ✅ Feature requirements as guidance
- ✅ Research and patterns to build on
- ✅ Clean slate for V2 implementation

**Build VISION Platform V2 with confidence, guided by proven patterns but free to innovate.**

---

**Version:** 2.0
**Created:** 2025-11-19
**For:** VISION Platform V2 (Fresh Build)
