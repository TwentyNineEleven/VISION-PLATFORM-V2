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
const baseNavConfig: NavItem[] = [
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
    id: 'visionflow',
    label: 'VisionFlow',
    href: '/visionflow',
    icon: 'check-circle-light',
    submenu: [
      { id: 'visionflow-dashboard', label: 'Dashboard', href: '/visionflow/dashboard' },
      { id: 'visionflow-tasks', label: 'My Tasks', href: '/visionflow/tasks' },
      { id: 'visionflow-plans', label: 'Plans', href: '/visionflow/plans' },
      { id: 'visionflow-projects', label: 'Projects', href: '/visionflow/projects' },
      { id: 'visionflow-workflows', label: 'Workflows', href: '/visionflow/workflows' },
      { id: 'visionflow-calendar', label: 'Calendar', href: '/visionflow/calendar' },
    ],
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

function freezeNavItems(items: NavItem[]): ReadonlyArray<NavItem> {
  return items.map((item) =>
    Object.freeze({
      ...item,
      submenu: item.submenu?.map((subItem) => Object.freeze({ ...subItem })),
    })
  );
}

export const navConfig: ReadonlyArray<NavItem> = freezeNavItems(baseNavConfig);

/**
 * Help & Support Item (shown at bottom of sidebar)
 */
export const helpNavItem: Readonly<NavItem> = Object.freeze({
  id: 'help',
  label: 'Help & Support',
  href: '/help',
  icon: 'question-circle-light',
});

/**
 * Get active navigation item based on current path
 */
export function getActiveNavItem(pathname: string, items: NavItem[] = [...navConfig]): string | null {
  // Normalize pathname (remove trailing slash, ensure it starts with /)
  const normalizedPath = pathname.endsWith('/') && pathname.length > 1 
    ? pathname.slice(0, -1) 
    : pathname;

  for (const item of items) {
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
export function getActiveSubmenuItem(pathname: string, items: NavItem[] = [...navConfig]): string | null {
  // Normalize pathname (remove trailing slash, ensure it starts with /)
  const normalizedPath = pathname.endsWith('/') && pathname.length > 1 
    ? pathname.slice(0, -1) 
    : pathname;

  for (const item of items) {
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
 * Build a fresh nav config with derived badge counts (immutable)
 * Call this from AppShell to ensure navigation updates re-render reactively
 */
export function buildNavConfig(options?: { notificationsCount?: number | string }): NavItem[] {
  const { notificationsCount } = options || {};

  return navConfig.map((item) => {
    const nextItem: NavItem = {
      ...item,
      submenu: item.submenu?.map((subItem) => ({ ...subItem })),
    };

    if (item.id === 'notifications') {
      const badge = typeof notificationsCount === 'number'
        ? (Number.isFinite(notificationsCount) && notificationsCount > 0 ? notificationsCount : undefined)
        : typeof notificationsCount === 'string' && notificationsCount.trim().length > 0
          ? notificationsCount
          : undefined;

      if (badge !== undefined) {
        nextItem.badge = badge;
      } else {
        delete nextItem.badge;
      }
    }

    return nextItem;
  });
}
