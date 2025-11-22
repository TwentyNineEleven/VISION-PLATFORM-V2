/**
 * Navigation Configuration
 * 
 * Centralized navigation structure matching Glow UI design patterns.
 * All routes and labels are defined here to avoid duplication.
 * 
 * Matches the actual VISION Platform application structure.
 */

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: string; // Icon name for Glow UI icons
  badge?: number | string;
  submenu?: NavSubItem[];
}

export interface NavSubItem {
  id: string;
  label: string;
  href: string;
}

/**
 * Main Navigation Items
 * Matches VISION Platform actual routes and structure
 */
export const navConfig: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: 'house-light',
  },
  {
    id: 'applications',
    label: 'Applications',
    href: '/applications',
    icon: 'layers-3-light',
  },
  {
    id: 'funder',
    label: 'Funder',
    href: '/funder',
    icon: 'handshake-light',
    submenu: [
      { id: 'funder-overview', label: 'Overview', href: '/funder' },
      { id: 'funder-cohorts', label: 'Cohorts', href: '/funder/cohorts' },
      { id: 'funder-grantees', label: 'Grantees', href: '/funder/grantees' },
    ],
  },
  {
    id: 'notifications',
    label: 'Notifications',
    href: '/notifications',
    icon: 'message-bubble-light',
    badge: 0, // Will be updated dynamically based on unread count
  },
  {
    id: 'files',
    label: 'Files',
    href: '/files',
    icon: 'cloud-arrow-up-light',
  },
  {
    id: 'admin',
    label: 'Admin',
    href: '/admin',
    icon: 'gear-light',
    submenu: [
      { id: 'admin-overview', label: 'Overview', href: '/admin' },
      { id: 'admin-users', label: 'Users', href: '/admin/users' },
      { id: 'admin-organizations', label: 'Organizations', href: '/admin/organizations' },
      { id: 'admin-apps', label: 'Apps', href: '/admin/apps' },
      { id: 'admin-cohorts', label: 'Cohorts', href: '/admin/cohorts' },
      { id: 'admin-settings', label: 'Settings', href: '/admin/settings' },
      { id: 'admin-billing', label: 'Billing', href: '/admin/billing' },
    ],
  },
];

/**
 * Help & Support Item (shown at bottom of sidebar)
 */
export const helpNavItem: NavItem = {
  id: 'help',
  label: 'Help & Support',
  href: '/help',
  icon: 'question-circle-light',
};

/**
 * Get active navigation item based on current path
 */
export function getActiveNavItem(pathname: string): string | null {
  // Normalize pathname (remove trailing slash, ensure it starts with /)
  const normalizedPath = pathname.endsWith('/') && pathname.length > 1 
    ? pathname.slice(0, -1) 
    : pathname;

  for (const item of navConfig) {
    // Check if pathname matches the main item href exactly
    if (normalizedPath === item.href) {
      return item.id;
    }
    // Check if pathname starts with the item href (for sub-routes)
    // But make sure we don't match partial paths (e.g., /admin shouldn't match /admin-settings)
    if (normalizedPath.startsWith(`${item.href}/`)) {
      return item.id;
    }
    // Check submenu items first (more specific matches)
    if (item.submenu) {
      for (const subItem of item.submenu) {
        if (normalizedPath === subItem.href || normalizedPath.startsWith(`${subItem.href}/`)) {
          return item.id;
        }
      }
    }
  }
  return null;
}

/**
 * Get active submenu item based on current path
 */
export function getActiveSubmenuItem(pathname: string): string | null {
  // Normalize pathname (remove trailing slash, ensure it starts with /)
  const normalizedPath = pathname.endsWith('/') && pathname.length > 1 
    ? pathname.slice(0, -1) 
    : pathname;

  for (const item of navConfig) {
    if (item.submenu) {
      for (const subItem of item.submenu) {
        if (normalizedPath === subItem.href || normalizedPath.startsWith(`${subItem.href}/`)) {
          return subItem.id;
        }
      }
    }
  }
  return null;
}

/**
 * Update notification badge count
 * Call this function to update the notification count dynamically
 */
export function updateNotificationBadge(count: number): void {
  const notificationsItem = navConfig.find((item) => item.id === 'notifications');
  if (notificationsItem) {
    notificationsItem.badge = count > 0 ? count : undefined;
  }
}
