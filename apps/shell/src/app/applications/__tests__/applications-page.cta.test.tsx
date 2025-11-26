import React from 'react';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { buildApplicationsCtas } from '../page';

const mockOpenAppLauncher = vi.fn();
const mockPush = vi.fn();

vi.mock('@/components/layout/AppShell', () => ({
  useAppShell: () => ({ openAppLauncher: mockOpenAppLauncher }),
}));

describe('ApplicationsPage CTAs', () => {
  beforeEach(() => {
    mockOpenAppLauncher.mockReset();
    mockPush.mockReset();
  });

  it('opens the app launcher when Ask VISION AI is clicked', async () => {
    const handlers = buildApplicationsCtas({
      openAppLauncher: mockOpenAppLauncher,
      navigate: mockPush,
    });

    handlers.onAskVisionAI();

    expect(mockOpenAppLauncher).toHaveBeenCalledTimes(1);
  });

  it('navigates to the usage analytics view when View app usage is clicked', async () => {
    const handlers = buildApplicationsCtas({
      openAppLauncher: mockOpenAppLauncher,
      navigate: mockPush,
    });

    handlers.onViewAppUsage();

    expect(mockPush).toHaveBeenCalledWith('/applications/usage');
  });
});
