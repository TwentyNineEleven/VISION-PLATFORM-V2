# VISION Platform V2 - Validation Scripts

This directory contains automated validation scripts to enforce VISION Platform design system compliance.

## Available Scripts

### 🎨 Color Validation (`validate-colors.ts`)

Ensures all colors use the Bold Color System v3.0 tokens instead of inline colors or generic Tailwind classes.

**Usage:**
```bash
# Validate all files
pnpm validate:colors

# Validate only staged files (for pre-commit hooks)
pnpm validate:colors:staged

# Show help
pnpm validate:colors --help
```

**What it checks:**
- ❌ Inline hex colors (`#0047AB`, `#FF0000`)
- ❌ RGB/RGBA colors (`rgb(0, 71, 171)`, `rgba(255, 0, 0, 0.5)`)
- ❌ HSL/HSLA colors (`hsl(217, 100%, 34%)`)
- ❌ Generic Tailwind colors (`text-blue-500`, `bg-red-600`)
- ❌ Arbitrary Tailwind values (`text-[#0047AB]`, `bg-[rgb(255,0,0)]`)
- ❌ Opacity modifiers on non-vision tokens (`text-blue-500/50`)

**Approved tokens:**
- ✅ `vision-blue-950`, `vision-blue-900`, `vision-blue-800`, etc.
- ✅ `vision-green-900`, `vision-green-800`, etc.
- ✅ `vision-orange-900`, `vision-orange-800`, etc.
- ✅ `vision-purple-900`, `vision-purple-800`, etc.
- ✅ `vision-red-900`, `vision-red-800`, etc.

**Reference:**
- [tailwind.config.ts](../apps/shell/tailwind.config.ts) (lines 53-117)
- [VISION_PLATFORM_COMPLETE_UX_UI_AUDIT.md](../documentation/platform/VISION_PLATFORM_COMPLETE_UX_UI_AUDIT.md)

---

### 🧩 Component Validation (`validate-components.ts`)

Ensures all interactive elements use Glow UI design system components instead of native HTML form elements.

**Usage:**
```bash
# Validate all files
pnpm validate:components

# Validate only staged files (for pre-commit hooks)
pnpm validate:components:staged

# Show help
pnpm validate:components --help
```

**What it checks:**
- ❌ Native `<button>` elements → Use `<GlowButton>`
- ❌ Native `<input>` elements → Use `<GlowInput>` (except `type="hidden"`)
- ❌ Native `<select>` elements → Use `<GlowSelect>`
- ❌ Native `<textarea>` elements → Use `<GlowTextarea>`

**Exceptions:**
- ✅ Glow UI component files themselves (e.g., `GlowButton.tsx`)
- ✅ Test files (`*.test.tsx`, `*.test.ts`)
- ✅ Storybook files (`*.stories.tsx`, `*.stories.ts`)
- ✅ `<input type="hidden">` elements (allowed for form state)

**Example replacements:**

```tsx
// ❌ FORBIDDEN
<button className="bg-blue-500 text-white px-4 py-2 rounded">
  Click me
</button>

// ✅ CORRECT
<GlowButton variant="primary" size="default">
  Click me
</GlowButton>
```

```tsx
// ❌ FORBIDDEN
<input
  type="email"
  className="border rounded px-3 py-2"
  placeholder="Email address"
/>

// ✅ CORRECT
<GlowInput
  type="email"
  placeholder="Email address"
/>
```

```tsx
// ❌ FORBIDDEN
<select className="border rounded px-3 py-2">
  <option value="1">Option 1</option>
  <option value="2">Option 2</option>
</select>

// ✅ CORRECT
<GlowSelect label="Choose option" onChange={handleChange}>
  <option value="1">Option 1</option>
  <option value="2">Option 2</option>
</GlowSelect>
```

**Reference:**
- [GLOW_UI_IMPLEMENTATION.md](../GLOW_UI_IMPLEMENTATION.md)
- [Glow UI Components](../apps/shell/src/components/glow-ui/)

---

## Pre-Commit Hooks

Both scripts support `--staged` flag for use in pre-commit hooks:

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "pnpm validate:colors:staged && pnpm validate:components:staged"
    }
  }
}
```

---

## Exit Codes

Both scripts follow standard Unix exit code conventions:

- `0` - All validations passed ✅
- `1` - Violations found ❌

---

## Integration with CI/CD

Add these scripts to your CI/CD pipeline to enforce compliance:

```yaml
# .github/workflows/validation.yml
name: Validation

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - name: Install dependencies
        run: pnpm install
      - name: Validate colors
        run: pnpm validate:colors
      - name: Validate components
        run: pnpm validate:components
```

---

## Validation Workflow

As documented in [VISION_PLATFORM_REMEDIATION_EXECUTION_PLAN.md](../documentation/platform/VISION_PLATFORM_REMEDIATION_EXECUTION_PLAN.md), the complete validation workflow includes:

1. **TypeScript Type Checking**
   ```bash
   pnpm type-check
   ```

2. **ESLint Validation**
   ```bash
   pnpm lint
   ```

3. **Color Token Validation**
   ```bash
   pnpm validate:colors
   ```

4. **Component Usage Validation**
   ```bash
   pnpm validate:components
   ```

5. **Unit Tests**
   ```bash
   pnpm test
   ```

6. **Production Build**
   ```bash
   pnpm build
   ```

**Run all validations:**
```bash
pnpm type-check && \
pnpm lint && \
pnpm validate:colors && \
pnpm validate:components && \
pnpm test && \
pnpm build
```

---

## Troubleshooting

### Color Violations

**Problem:** Script reports color violations but you're using vision tokens.

**Solution:** Ensure you're using the exact token names from `tailwind.config.ts`:
- `vision-blue-950` (not `blue-950` or `vision-blue`)
- Check for opacity modifiers (e.g., `/50`, `/10`) - use lighter shades instead

### Component Violations

**Problem:** False positive for `<input type="hidden">`

**Solution:** The script should automatically exclude these. If not, verify the pattern matches:
```tsx
<input type="hidden" name="..." value="..." />
```

**Problem:** Need to use native element in a specific case

**Solution:**
1. Check if there's a Glow UI component that fits your use case
2. If genuinely needed, add an exception to the script's `COMPONENT_PATTERNS` array
3. Document the exception with a comment in the code

---

## Contributing

When adding new validation rules:

1. Update the appropriate script (`validate-colors.ts` or `validate-components.ts`)
2. Add tests for the new pattern
3. Update this README with the new rule
4. Update the relevant documentation in `/documentation/platform/`

---

## Support

For questions or issues with validation scripts:

1. Check [VISION_PLATFORM_VALIDATION_AGENT_PROMPT.md](../documentation/platform/VISION_PLATFORM_VALIDATION_AGENT_PROMPT.md)
2. Review [CODE_STANDARDS.md](../documentation/general/CODE_STANDARDS.md)
3. Consult the [VISION_PLATFORM_REMEDIATION_EXECUTION_PLAN.md](../documentation/platform/VISION_PLATFORM_REMEDIATION_EXECUTION_PLAN.md)

---

**Last Updated:** 2025-11-23
**Maintained By:** VISION Platform V2 Team
