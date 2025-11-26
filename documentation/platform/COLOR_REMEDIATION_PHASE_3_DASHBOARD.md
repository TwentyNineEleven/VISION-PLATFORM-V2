# Color Remediation Phase 3: Dashboard Components

**Status:** 🟡 READY FOR EXECUTION  
**Target:** 100% Dashboard Color Compliance  
**Timeline:** Week 3  
**Estimated Effort:** 12-16 hours

---

## 🎯 Objective

Refactor all dashboard UI components to use the Bold Color System v3.0, eliminating hardcoded hex colors and generic Tailwind classes while preserving data visualization quality and dashboard UX.

---

## 📋 Scope

Target ~60 color violations in dashboard components. Focus on:
- Dashboard pages
- Widget components
- Chart color palettes
- Generic Tailwind color migrations

---

## 🎨 Dashboard Color Standards

| Purpose | Token | Example Usage |
|---------|-------|---------------|
| Widget background | `bg-card` | Cards, panels |
| Primary text | `text-foreground` | Headings |
| Secondary text | `text-vision-gray-700` | Labels |
| Borders | `border-border` | Dividers |
| Chart primary | `bg-vision-blue-700` | Main data series |
| Chart success | `bg-vision-green-700` | Positive values |
| Chart warning | `bg-vision-orange-900` | Alert values |

---

## 🔧 Common Replacements

```tsx
// Generic Tailwind → Vision Tokens
text-gray-900 → text-vision-gray-950
text-gray-600 → text-vision-gray-700
bg-gray-100 → bg-vision-gray-100
border-gray-200 → border-border

// Hardcoded Hex → Vision Tokens
#3c61dd → bg-vision-blue-700
#16A34A → bg-vision-green-700
#C2410C → bg-vision-orange-900
#ebedef → bg-vision-gray-100
```

---

## ✅ Completion Criteria

- [ ] All dashboard files pass color validation
- [ ] Charts remain readable
- [ ] Build passes
- [ ] Visual regression tests pass

---

**Next:** [Phase 4 - App Catalog](./COLOR_REMEDIATION_PHASE_4_APP_CATALOG.md)
