export type UserRole =
  | 'super_admin'
  | 'org_admin'
  | 'funder_admin'
  | 'member'
  | 'viewer';

const ADMIN_ALLOWED_ROLES: UserRole[] = ['super_admin', 'org_admin', 'funder_admin'];

export const ADMIN_PORTAL_ENABLED =
  process.env.NEXT_PUBLIC_ADMIN_PORTAL_ENABLED === undefined
    ? true
    : process.env.NEXT_PUBLIC_ADMIN_PORTAL_ENABLED === 'true';

export function userCanAccessAdmin(role: UserRole | undefined): boolean {
  if (!role) return false;
  return ADMIN_ALLOWED_ROLES.includes(role);
}

export function isSuperAdmin(role: UserRole | undefined): boolean {
  return role === 'super_admin';
}

export function isOrgAdmin(role: UserRole | undefined): boolean {
  return role === 'org_admin';
}

export function isFunderAdmin(role: UserRole | undefined): boolean {
  return role === 'funder_admin' || role === 'super_admin';
}

export function canImpersonate(role: UserRole | undefined): boolean {
  return isSuperAdmin(role);
}
