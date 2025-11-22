# V2 Documentation Scrubbing Guide

**Created:** 2025-11-19
**Purpose:** Guide for removing V1-specific content from all documentation

---

## Documents That Need Scrubbing

### ✅ COMPLETED
- [x] ARCHITECTURE.md - Cleaned (generic architecture patterns, removed specific app names)

### 🔄 NEEDS SCRUBBING

#### High Priority (Reference Documents)

1. **PROJECT_OVERVIEW.md**
   - Remove: Specific timelines (Phase 1-7, month-by-month)
   - Remove: Specific app names (CapacityIQ, FundingFramer, etc.)
   - Remove: V1 migration details
   - Remove: "Last Updated: 2025-10-31" dates
   - Keep: Product vision, user personas, core principles
   - Transform: To high-level product requirements (what, not when/how)

2. **TECH_STACK.md**
   - Remove: Cost breakdowns with specific numbers
   - Remove: Timeline and review dates
   - Remove: "Migration from Firebase" sections
   - Remove: Specific pricing model recommendations
   - Keep: Technology choices and rationale
   - Keep: Stack decisions and alternatives
   - Transform: To technology reference guide

3. **CODE_STANDARDS.md**
   - Check for: Any V1-specific code examples
   - Check for: References to existing codebase
   - Keep: All coding standards and patterns
   - Update: Dates to 2025-11-19

4. **SECURITY.md**
   - Check for: V1-specific implementation details
   - Keep: All security principles and requirements
   - Transform: To security requirements document

5. **TESTING.md**
   - Check for: V1-specific test examples
   - Keep: Testing strategies and patterns
   - Transform: To testing standards document

6. **API_DESIGN.md**
   - Check for: Specific API endpoints from V1
   - Keep: API design principles
   - Transform: To API standards guide

7. **PERFORMANCE.md**
   - Check for: V1-specific performance metrics
   - Keep: Performance principles and strategies

8. **MULTI_APP_BEST_PRACTICES.md**
   - Check for: V1-specific examples
   - Keep: All best practices patterns

### Platform Feature Requirements

9. **platform/features/authentication/REQUIREMENTS.md**
   - Remove: Any V1 implementation specifics
   - Keep: Business requirements
   - Transform: To auth requirements (what needs to be built)

10. **platform/features/platform-shell/REQUIREMENTS.md**
    - Remove: V1-specific features or implementations
    - Keep: Platform shell requirements
    - Transform: To generic platform requirements

11. **platform/features/organization-onboarding/README.md**
    - Remove: V1 implementation details
    - Keep: Onboarding requirements

12. **platform/features/organization-onboarding/REQUIREMENTS.md**
    - Remove: V1 specifics
    - Keep: Requirements

---

## Scrubbing Checklist

For EACH document, remove or update:

### Dates
- [ ] Update "Last Updated" to 2025-11-19
- [ ] Remove "Next Review" dates
- [ ] Remove specific timeline dates (2025-10-31, etc.)

### V1 References
- [ ] Remove "migrate from Firebase"
- [ ] Remove "existing CapacityIQ"
- [ ] Remove specific app names where they're examples (replace with generic)
- [ ] Remove V1 timeline/phase references (Phase 1, Month 3, etc.)
- [ ] Remove "already built" or "existing" references

### Implementation Details
- [ ] Remove specific database schema from V1
- [ ] Remove specific API endpoints unless they're examples
- [ ] Remove specific component names from V1
- [ ] Remove "50% complete" or status indicators
- [ ] Remove cost estimates tied to V1

### Transform to Generic
- [ ] App names → "Application A", "Application B" or describe functionality
- [ ] Specific timelines → Remove entirely or make generic ("early phase", "later")
- [ ] V1 decisions → Generic decision patterns
- [ ] Implementation examples → Generic patterns

### Keep
- ✅ All principles and patterns
- ✅ Technology choices and rationale
- ✅ Architecture patterns
- ✅ Best practices
- ✅ Security requirements
- ✅ Code standards
- ✅ Design patterns

---

## Quick Replacements

### Find and Replace

```
2025-10-31 → 2025-11-19
Version: 1.0 → Version: 2.0
Owner: Ford Aaro / TwentyNine Eleven → Owner: TwentyNine Eleven
```

### Content Transformations

#### Remove Entirely:
- Timeline sections (Phase 1-7, Months 1-14)
- Specific cost breakdowns
- Migration plans
- "What's already built" sections
- Specific database schemas with V1 table names

#### Transform:
- "CapacityIQ app" → "Assessment application" or "Application example"
- "FundingFramer" → "Grant management application" or generic
- "We are migrating from Firebase" → Remove or "Platform uses Supabase"
- "50% complete" → Remove status indicators

---

## Documents to Delete (If Created)

None currently - all docs should be scrubbed, not deleted.

---

## Validation Checklist

After scrubbing, verify:

- [ ] No references to V1, "existing system", "migration", "already built"
- [ ] No specific month/phase timelines
- [ ] No V1-specific app names (CapacityIQ, FundingFramer, etc.) except where discussing product vision
- [ ] No "Last Updated" dates before 2025-11-19
- [ ] All examples are generic or clearly labeled as examples
- [ ] Documents read as "fresh start" guidance, not V1 documentation

---

## Priority Order

1. **ARCHITECTURE.md** ✅ DONE
2. **PROJECT_OVERVIEW.md** - Remove timelines, transform to product vision
3. **TECH_STACK.md** - Remove V1 specifics, keep tech choices
4. **Platform requirements** - Scrub implementation details
5. **General docs** - Quick pass for V1 references
6. **README.md** - Update if needed
7. **COPY_SUMMARY.md** - Update to reflect scrubbing

---

## Next Steps

After manual scrubbing is complete:
1. Create INDEX.md for V2
2. Mark documentation as "V2 Ready"
3. Add V2 implementation guides as they're created

---

**This is a working document. Update as you scrub files.**
