# Color Remediation Plan

The latest full `pnpm validate:colors --all` run reports 927 violations. The grouped summary highlights a handful of recurring tokens that should be remediated first to accelerate compliance.

## Top offending tokens

| Token | Frequency |
| --- | ---: |
| `#007F5F` | 72 |
| `text-gray-500` | 47 |
| `#00B88D` | 39 |
| `text-gray-700` | 37 |
| `text-blue-600` | 35 |
| `text-gray-900` | 34 |
| `text-gray-600` | 33 |
| `#001A33` | 28 |
| `border-gray-200` | 27 |
| `text-[#001A33]` | 24 |

## Recommended remediation sequence

1. **Create an explicit mapping to Bold color tokens** for the top offenders above (e.g., replace `text-gray-500`/`text-gray-600` with `vision-surface-subtle`/`vision-foreground-muted`, align `#007F5F` and `#00B88D` with the approved greens, and map `#001A33` and derivatives to the primary ink tokens). Document these replacements in `scripts/validate-colors.ts` so the mapping is repeatable across PRs.
2. **Sweep shared layouts/components first** (navigation, dashboard, task pages) where violations are dense; this yields the largest reduction per file. Use the validator’s grouped output to focus edits and rerun `pnpm validate:colors --all` after each area to keep momentum measurable.
3. **Normalize custom utility classes** (e.g., `bg-[#007F5F]/10`, `text-[#001A33]`) by replacing them with standardized Tailwind config tokens or CSS variables bound to the Bold palette to avoid future regex escapes.
4. **Introduce lint-time enforcement** in CI using the staged-only mode by default and an `--all` weekly job; this prevents reintroducing deprecated tokens while the backlog is being burned down.

## Suggested working pattern

- Work in small batches (per page or component group), replace tokens using the agreed map, and re-run `pnpm validate:colors` locally.
- Leave TODO comments only when a design token is genuinely missing; otherwise, replace immediately to avoid growing debt.
- Keep PRs scoped to color updates to reduce review overhead and avoid coupling with unrelated logic changes.
