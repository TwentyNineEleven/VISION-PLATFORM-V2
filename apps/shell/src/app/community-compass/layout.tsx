import type { ReactNode } from 'react';

export default function CommunityCompassLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Community Compass pages render within the main AppShell
  // No custom layout needed - AppShell provides the navigation
  return <>{children}</>;
}
