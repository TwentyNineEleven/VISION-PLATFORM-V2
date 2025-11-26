import { Grid3x3 } from 'lucide-react';
import type { App } from '@/components/dashboard/AppLauncher';
import type { AppCardProps, AppStatus as CardStatus } from '@/components/AppCard';

export const mapStatusToCardStatus = (status?: App['status']): CardStatus => {
  if (status === 'coming-soon') return 'coming_soon';
  if (status === 'restricted' || status === 'beta') return 'paused';
  return 'active';
};

export const mapAppToCardProps = (app: App): AppCardProps => ({
  id: app.id,
  name: app.name,
  description: app.shortDescription ?? app.description ?? '',
  module: app.moduleKey,
  category: app.primaryCategory,
  icon: app.icon || Grid3x3,
  status: mapStatusToCardStatus(app.status),
  isFavorite: app.isFavorite,
  isNew: app.isNew,
  isPopular: app.isPopular,
  launchPath: app.launchPath,
  onboardingPath: app.onboardingPath,
});

