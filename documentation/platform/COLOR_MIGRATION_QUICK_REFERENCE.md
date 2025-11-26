# Color Migration Quick Reference

**Bold Color System v3.0 - Developer Cheat Sheet**

---

## 🎨 Common Color Mappings

### Hex to Vision Token

| Old Hex | New Token | Usage |
|---------|-----------|-------|
| `#0047AB` | `text-primary` or `bg-primary` | Primary brand blue |
| `#2563EB` | `text-vision-blue-700` | Lighter blue |
| `#047857` | `text-secondary` or `bg-secondary` | Success green |
| `#C2410C` | `text-accent` or `bg-accent` | Warning orange |
| `#B91C1C` | `text-destructive` or `bg-destructive` | Error red |
| `#6D28D9` | `text-vision-purple-900` | Purple accent |
| `#1F2937` | `text-foreground` | Primary text |
| `#64748B` | `text-vision-gray-700` | Secondary text |
| `#94A3B8` | `text-muted-foreground` | Muted text |
| `#FFFFFF` | `bg-card` or `bg-vision-gray-0` | White background |
| `#F8FAFC` | `bg-background` | Page background |
| `#F1F5F9` | `bg-vision-gray-100` | Subtle background |
| `#E2E8F0` | `border-border` | Borders |
| `#DBEAFE` | `bg-vision-blue-50` | Light blue bg |

### Generic Tailwind to Vision

| Old Class | New Token |
|-----------|-----------|
| `text-gray-900` | `text-vision-gray-950` |
| `text-gray-800` | `text-foreground` |
| `text-gray-600` | `text-vision-gray-700` |
| `text-gray-500` | `text-vision-gray-700` |
| `text-gray-400` | `text-muted-foreground` |
| `bg-gray-50` | `bg-vision-gray-50` |
| `bg-gray-100` | `bg-vision-gray-100` |
| `border-gray-200` | `border-border` |
| `text-blue-600` | `text-primary` |
| `bg-blue-50` | `bg-vision-blue-50` |

### Opacity Variants

| Old Pattern | New Token | Why |
|-------------|-----------|-----|
| `text-primary/80` | `text-vision-blue-700` | Explicit control |
| `bg-muted/40` | `bg-vision-gray-50` | Better performance |
| `bg-primary/10` | `bg-vision-blue-50` | Semantic token |
| `bg-destructive/10` | `bg-vision-red-50` | Semantic token |
| `border-primary/30` | `border-border` | Standard border |
| `ring-primary/50` | `ring-primary ring-opacity-50` | Split for clarity |

---

## 📦 Phase-Specific Colors

```tsx
// VOICE Phase (Green)
bg-vision-green-50 text-vision-green-700

// INSPIRE Phase (Orange)  
bg-vision-orange-50 text-vision-orange-900

// INITIATE Phase (Blue)
bg-vision-blue-50 text-vision-blue-700

// NARRATE Phase (Purple)
bg-vision-purple-50 text-vision-purple-900
```

---

## 🔍 Quick Find & Replace

### VS Code Regex Patterns

```regex
// Find hardcoded hex colors
#[0-9A-Fa-f]{6}

// Find generic gray classes
text-gray-[0-9]{3}
bg-gray-[0-9]{2,3}
border-gray-[0-9]{3}

// Find blue utilities
text-blue-[0-9]{3}
bg-blue-[0-9]{2,3}

// Find opacity variants
/(text|bg|border)-[a-z]+\/[0-9]{1,2}/
```

---

## ✅ Validation Commands

```bash
# Check color violations
pnpm validate:colors

# Count violations by directory
pnpm validate:colors 2>&1 | grep "apps/shell" | wc -l

# Specific file check
pnpm validate:colors 2>&1 | grep "AppCard.tsx"

# Build check
pnpm build

# Type check
pnpm type-check
```

---

## 🎯 Common Patterns

### Navigation Items
```tsx
// Active state
className="bg-vision-blue-50 text-primary"

// Inactive state  
className="text-vision-gray-700 hover:bg-vision-gray-100"
```

### Cards
```tsx
// Card container
className="bg-card border border-border"

// Card header
className="text-foreground font-semibold"

// Card description
className="text-vision-gray-700"
```

### Buttons
```tsx
// Primary
className="bg-primary text-white hover:bg-vision-blue-700"

// Secondary  
className="bg-secondary text-white"

// Ghost
className="text-primary hover:bg-vision-gray-100"
```

### Forms
```tsx
// Input
className="border-border focus:border-primary"

// Label
className="text-vision-gray-950 font-medium"

// Helper text
className="text-muted-foreground text-sm"
```

---

## ⚠️ Don't Replace These

**Legitimate uses (keep as-is):**
- Design system theme files (`src/design-system/theme/*.ts`)
- Color constant definitions
- Inline SVG fill colors (case-by-case)
- Third-party library colors (if unavoidable)
- Overlay backdrops (`bg-black/50` is acceptable)

---

## 🚀 Quick Commands

```bash
# Create feature branch
git checkout -b fix/color-remediation-phase-X

# Check current violations
pnpm validate:colors 2>&1 | tee violations-before.txt

# After fixes
pnpm validate:colors 2>&1 | tee violations-after.txt

# Compare
diff violations-before.txt violations-after.txt

# Commit
git commit -m "feat(colors): migrate [component] to Bold Color System v3.0"
```

---

## 📚 Full Documentation

- [Master Plan](./COLOR_SYSTEM_REMEDIATION_MASTER_PLAN.md)
- [Phase 1 Guide](./COLOR_REMEDIATION_PHASE_1_QUICK_WINS.md)
- [Phase 2 Guide](./COLOR_REMEDIATION_PHASE_2_NAVIGATION.md)
- [Phase 3 Guide](./COLOR_REMEDIATION_PHASE_3_DASHBOARD.md)
- [Phase 4 Guide](./COLOR_REMEDIATION_PHASE_4_APP_CATALOG.md)

---

**Print this for easy reference during migration!** 🎨
