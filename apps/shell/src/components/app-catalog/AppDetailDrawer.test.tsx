import { render, screen } from '@testing-library/react';
import { AppDetailDrawer } from './AppDetailDrawer';
import type { AppMetadata } from '@/lib/app-catalog-types';

const mockApp: AppMetadata = {
  id: 'test-app',
  name: 'Test App',
  description: 'Test description for color compliance testing',
  phase: 'VOICE',
  category: 'Discovery',
  audiences: ['Funder', 'Organization'],
  focusTags: ['Impact', 'Strategy'],
  connectedApps: ['app-1', 'app-2'],
  timeToComplete: '30 minutes',
  status: 'beta',
  access: 'Requires Upgrade',
};

describe('AppDetailDrawer - Bold Color System Compliance', () => {
  it('should use vision-gray-300 token for header border', () => {
    const { container } = render(
      <AppDetailDrawer app={mockApp} isOpen={true} onClose={() => {}} />
    );

    const header = container.querySelector('[class*="border-b"]');
    expect(header).toHaveClass('border-vision-gray-300');
    expect(header?.className).not.toMatch(/border-\[#/);
  });

  it('should use vision-gray-950 token for primary headings', () => {
    render(
      <AppDetailDrawer app={mockApp} isOpen={true} onClose={() => {}} />
    );

    const heading = screen.getByText('App Details');
    expect(heading).toHaveClass('text-vision-gray-950');
    expect(heading).not.toHaveClass('text-[#1F2937]');
  });

  it('should use vision-gray-700 token for secondary text', () => {
    const { container } = render(
      <AppDetailDrawer app={mockApp} isOpen={true} onClose={() => {}} />
    );

    const closeButton = container.querySelector('button[aria-label="Close drawer"]');
    expect(closeButton).toHaveClass('text-vision-gray-700');
    expect(closeButton?.className).not.toMatch(/text-\[#64748B\]/);
  });

  it('should use vision-gray-100 token for hover backgrounds', () => {
    const { container } = render(
      <AppDetailDrawer app={mockApp} isOpen={true} onClose={() => {}} />
    );

    const closeButton = container.querySelector('button[aria-label="Close drawer"]');
    expect(closeButton?.className).toMatch(/hover:bg-vision-gray-100/);
    expect(closeButton?.className).not.toMatch(/hover:bg-\[#F1F5F9\]/);
  });

  it('should use vision-blue-950 token for primary button background', () => {
    render(
      <AppDetailDrawer app={mockApp} isOpen={true} onClose={() => {}} />
    );

    const openButton = screen.getByText('Open App');
    expect(openButton).toHaveClass('bg-vision-blue-950');
    expect(openButton).not.toHaveClass('bg-[#0047AB]');
  });

  it('should use vision-blue-700 token for button hover state', () => {
    render(
      <AppDetailDrawer app={mockApp} isOpen={true} onClose={() => {}} />
    );

    const openButton = screen.getByText('Open App');
    expect(openButton.className).toMatch(/hover:bg-vision-blue-700/);
    expect(openButton.className).not.toMatch(/hover:bg-\[#1E3A8A\]/);
  });

  it('should use vision-blue-950 token for input bullet points', () => {
    const { container } = render(
      <AppDetailDrawer app={mockApp} isOpen={true} onClose={() => {}} />
    );

    const bullets = container.querySelectorAll('.bg-vision-blue-950[class*="rounded-full"][class*="h-1.5"]');
    expect(bullets.length).toBeGreaterThan(0);

    const invalidBullets = container.querySelectorAll('[class*="bg-[#0047AB]"]');
    expect(invalidBullets.length).toBe(0);
  });

  it('should use vision-green-900 token for output bullet points', () => {
    const { container } = render(
      <AppDetailDrawer app={mockApp} isOpen={true} onClose={() => {}} />
    );

    const greenBullets = container.querySelectorAll('.bg-vision-green-900[class*="rounded-full"][class*="h-1.5"]');
    expect(greenBullets.length).toBeGreaterThan(0);

    const invalidGreenBullets = container.querySelectorAll('[class*="bg-[#047857]"]');
    expect(invalidGreenBullets.length).toBe(0);
  });

  it('should use vision-gray-100 token for tag backgrounds', () => {
    render(
      <AppDetailDrawer app={mockApp} isOpen={true} onClose={() => {}} />
    );

    const funderTag = screen.getByText('Funder');
    expect(funderTag).toHaveClass('bg-vision-gray-100');
    expect(funderTag).not.toHaveClass('bg-[#F1F5F9]');
  });

  it('should use vision-orange tokens for beta badge', () => {
    render(
      <AppDetailDrawer app={mockApp} isOpen={true} onClose={() => {}} />
    );

    const betaBadge = screen.getByText('Beta');
    expect(betaBadge).toHaveClass('text-vision-orange-900');
    expect(betaBadge).toHaveClass('bg-vision-orange-100');
    expect(betaBadge).not.toHaveClass('text-[#C2410C]');
    expect(betaBadge).not.toHaveClass('bg-[#FFEDD5]');
  });

  it('should use vision-purple tokens for upgrade required badge', () => {
    render(
      <AppDetailDrawer app={mockApp} isOpen={true} onClose={() => {}} />
    );

    const upgradeBadge = screen.getByText('Upgrade Required');
    expect(upgradeBadge).toHaveClass('text-vision-purple-900');
    expect(upgradeBadge).toHaveClass('bg-vision-purple-100');
    expect(upgradeBadge).not.toHaveClass('text-[#6D28D9]');
    expect(upgradeBadge).not.toHaveClass('bg-[#EDE9FE]');
  });

  it('should have zero arbitrary Tailwind colors (text-[#...])', () => {
    const { container } = render(
      <AppDetailDrawer app={mockApp} isOpen={true} onClose={() => {}} />
    );

    const elementsWithArbitraryColors = container.querySelectorAll('[class*="text-[#"]');
    expect(elementsWithArbitraryColors.length).toBe(0);
  });

  it('should have zero arbitrary Tailwind colors (bg-[#...])', () => {
    const { container } = render(
      <AppDetailDrawer app={mockApp} isOpen={true} onClose={() => {}} />
    );

    const elementsWithArbitraryBg = container.querySelectorAll('[class*="bg-[#"]');
    expect(elementsWithArbitraryBg.length).toBe(0);
  });

  it('should have zero arbitrary Tailwind colors (border-[#...])', () => {
    const { container } = render(
      <AppDetailDrawer app={mockApp} isOpen={true} onClose={() => {}} />
    );

    const elementsWithArbitraryBorder = container.querySelectorAll('[class*="border-[#"]');
    expect(elementsWithArbitraryBorder.length).toBe(0);
  });
});
