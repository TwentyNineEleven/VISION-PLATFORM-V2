'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayoutShell } from '@/components/admin/AdminLayoutShell';
import { ADMIN_PORTAL_ENABLED, userCanAccessAdmin } from '@/lib/auth';
import { getCurrentUser } from '@/lib/session';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const currentUser = getCurrentUser();

  React.useEffect(() => {
    if (!ADMIN_PORTAL_ENABLED || !userCanAccessAdmin(currentUser.roleKey)) {
      router.replace('/dashboard');
    }
  }, [router, currentUser.roleKey]);

  if (!ADMIN_PORTAL_ENABLED || !userCanAccessAdmin(currentUser.roleKey)) {
    return null;
  }

  return <AdminLayoutShell>{children}</AdminLayoutShell>;
}

