'use client';

/**
 * App Catalog Page Route
 * 
 * Main entry point for the App Catalog page.
 */

import { AppCatalogPage } from '@/components/app-catalog/AppCatalogPage';
import { APP_CATALOG_DATA } from '@/lib/app-catalog-data';
import { useRouter } from 'next/navigation';

export default function AppCatalogRoute() {
  const router = useRouter();

  const handleLaunchApp = (app: { route?: string; launchPath?: string }) => {
    const route = app.route || app.launchPath;
    if (route) {
      router.push(route as any);
    }
  };

  const handleToggleFavorite = (appId: string) => {
    // TODO: Implement favorite toggle with backend
    console.log('Toggle favorite:', appId);
  };

  return (
    <AppCatalogPage
      apps={APP_CATALOG_DATA}
      onLaunchApp={handleLaunchApp}
      onToggleFavorite={handleToggleFavorite}
    />
  );
}

