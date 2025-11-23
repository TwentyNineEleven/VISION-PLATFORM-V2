import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

const pagePath = join(__dirname, 'page.tsx');
const pageSource = readFileSync(pagePath, 'utf8');

describe('Settings Team - GlowSelect compliance', () => {
  it('uses GlowSelect for all role selectors', () => {
    const glowSelectMatches = pageSource.match(/<GlowSelect\b/g) ?? [];
    expect(glowSelectMatches.length).toBeGreaterThanOrEqual(2);
  });

  it('marks GlowSelects with the correct test IDs', () => {
    expect(pageSource).toContain('data-testid="invite-role-select"');
    expect(pageSource).toContain('data-testid={`member-role-');
  });

  it('does not render native select elements', () => {
    const nativeSelectMatches = pageSource.match(/<select\b/g) ?? [];
    expect(nativeSelectMatches.length).toBe(0);
  });
});
