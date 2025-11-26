import React from 'react';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import {
  buildDashboardCtas,
  toggleFavoriteWithPersistence,
} from '../page';

const mockOpenAppLauncher = vi.fn();
const mockPush = vi.fn();
const mockToggleFavorite = vi.fn();

describe('DashboardPage CTAs', () => {
  beforeEach(() => {
    mockOpenAppLauncher.mockReset();
    mockPush.mockReset();
    mockToggleFavorite.mockReset();
  });

  it('opens the app launcher when Ask VISION AI is clicked', async () => {
    const handlers = buildDashboardCtas({
      openAppLauncher: mockOpenAppLauncher,
      navigate: mockPush,
    });

    handlers.onAskVisionAI();

    expect(mockOpenAppLauncher).toHaveBeenCalledTimes(1);
  });

  it('navigates to transformation learn-more anchor', async () => {
    const handlers = buildDashboardCtas({
      openAppLauncher: mockOpenAppLauncher,
      navigate: mockPush,
    });

    handlers.onLearnMore();

    expect(mockPush).toHaveBeenCalledWith('/#transformation');
  });

  it('toggles favorites when the recent app star is clicked', async () => {
    const setFavoriteAppIds = vi.fn();

    toggleFavoriteWithPersistence('demo-app', setFavoriteAppIds, {
      toggleFavorite: mockToggleFavorite,
    } as any);

    expect(mockToggleFavorite).toHaveBeenCalledTimes(1);
  });
});
