import { redirect } from 'next/navigation';
import { AdminLayoutShell } from '@/components/admin/AdminLayoutShell';
import { ADMIN_PORTAL_ENABLED, userCanAccessAdmin } from '@/lib/auth';
import { getCurrentUser } from '@/lib/session';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const currentUser = getCurrentUser();

  if (!ADMIN_PORTAL_ENABLED || !userCanAccessAdmin(currentUser.roleKey)) {
    redirect('/dashboard');
  }

  return <AdminLayoutShell>{children}</AdminLayoutShell>;
}

