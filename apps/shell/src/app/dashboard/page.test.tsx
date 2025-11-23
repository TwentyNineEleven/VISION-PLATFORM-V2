import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const heroPath = path.resolve(__dirname, '../../components/dashboard/HeroWelcome.tsx');
const heroSource = fs.readFileSync(heroPath, 'utf8');
const miniAppPath = path.resolve(__dirname, '../../components/dashboard/MiniAppCard.tsx');
const miniAppSource = fs.readFileSync(miniAppPath, 'utf8');
const phaseColorsPath = path.resolve(__dirname, '../../lib/phase-colors.ts');
const phaseColorsSource = fs.readFileSync(phaseColorsPath, 'utf8');

describe('HeroWelcome Bold Color Tokens', () => {
  it('renders the CTA button with the Bold color classes', () => {
    expect(heroSource).toContain('className="bg-vision-blue-950');
    expect(heroSource).toContain('text-vision-gray-0');
    expect(heroSource).not.toMatch(/style\s*=\s*{{[^}]*#0047AB/);
  });

  it('renders the hero card with the vision gray background class', () => {
    expect(heroSource).toContain('className="border-vision-gray-100 bg-vision-gray-50');
    expect(heroSource).not.toContain("backgroundColor: '#F8FAFC'");
  });
});

describe('MiniAppCard Bold Color Tokens', () => {
  it('relies on phase token helpers instead of inline phase colors', () => {
    expect(miniAppSource).toContain('const phaseClasses = getPhaseTokenClasses(meta.phase);');
    expect(miniAppSource).not.toContain('phaseColor');
    expect(miniAppSource).not.toContain('phaseSoftColor');
    expect(miniAppSource).not.toMatch(/style\s*=\s*{{[^}]*backgroundColor/);
  });

  it('uses the computed phase classes when building the launch button', () => {
    expect(miniAppSource).toContain('phaseClasses.buttonBackground');
    expect(miniAppSource).toContain('phaseClasses.buttonHover');
  });
});

describe('Phase token mapping', () => {
  it('defines vision color tokens for hero and accent states', () => {
    expect(phaseColorsSource).toContain('vision-blue-50');
    expect(phaseColorsSource).toContain('vision-blue-950');
    expect(phaseColorsSource).toContain('vision-green-600');
    expect(phaseColorsSource).toContain('vision-green-50');
  });
});
