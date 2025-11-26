import { redirect } from 'next/navigation';

export default function SettingsIndexPage() {
  // Cast to satisfy Next typed redirects for this legacy backup route.
  redirect('/dashboard/settings/profile' as any);
}
