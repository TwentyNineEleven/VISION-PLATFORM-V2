# Sidebar Navigation Documentation

**Component**: Dashboard Sidebar Navigation  
**Location**: `apps/shell/src/components/dashboard/DashboardSidebar.tsx`  
**Last Updated**: December 2024  
**Status**: Production Ready

---

## Overview

The Dashboard Sidebar provides persistent navigation for the VISION Platform. It features a collapsible design with support for parent items with submenus, badges for notifications, and proper active state management.

---

## Routing Structure

### Independent Routes

All navigation items use **independent top-level routes** (not nested under `/dashboard`):

| Item | Route | Description |
|------|-------|-------------|
| Dashboard | `/dashboard` | Main dashboard page |
| Applications | `/applications` | Applications listing |
| Funder | `/funder` | Funder portal |
| Notifications | `/notifications` | Notifications center |
| Files | `/files` | File management |
| Settings | `/settings` | Settings (defaults to profile) |

### Dashboard Submenu

The Dashboard item has an expandable submenu with the following items:

| Submenu Item | Route | Description |
|--------------|-------|-------------|
| Dashboard | `/dashboard` | Main dashboard |
| App Catalog | `/applications` | Applications catalog |
| Notifications | `/notifications` | Notifications center |

**Note**: Submenu items share routes with standalone items, but the active state logic ensures only one item is highlighted at a time.

---

## Component Structure

### Interfaces

```typescript
interface SubItem {
  id: string;
  label: string;
  href: string;
}

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;           // For standalone items
  badge?: number;          // Notification count
  subItems?: SubItem[];    // For items with submenus
}
```

### Navigation Items Configuration

```typescript
const sidebarItems: SidebarItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <Home className="w-5 h-5" />,
    subItems: [
      { id: 'default', label: 'Dashboard', href: '/dashboard' },
      { id: 'apps', label: 'App Catalog', href: '/applications' },
      { id: 'notifications', label: 'Notifications', href: '/notifications' },
    ],
  },
  {
    id: 'apps',
    label: 'Applications',
    icon: <Layers3 className="w-5 h-5" />,
    href: '/applications',
  },
  {
    id: 'funder',
    label: 'Funder',
    icon: <Handshake className="w-5 h-5" />,
    href: '/funder',
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: <MessageSquare className="w-5 h-5" />,
    href: '/notifications',
    badge: 3,
  },
  {
    id: 'files',
    label: 'Files',
    icon: <UploadCloud className="w-5 h-5" />,
    href: '/files',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings className="w-5 h-5" />,
    href: '/settings',
  },
];
```

---

## Active State Logic

### Preventing Multiple Selections

The sidebar implements logic to prevent multiple items from being active simultaneously:

1. **Submenu Priority**: If a route matches both a submenu item and a standalone item, only the submenu item is highlighted.

2. **Parent Active State**: A parent item is active when any of its submenu items are active.

3. **Exact Match Priority**: The active state uses exact pathname matching first, then falls back to `startsWith` matching.

### Active State Detection

```typescript
// Check if any submenu item is active
const hasActiveSubItem = (item: SidebarItem) => {
  if (!item.subItems) return false;
  return item.subItems.some((sub) => isActive(sub.href, true));
};

// Check if parent should be active
const isParentActive = (item: SidebarItem) => {
  if (item.subItems) {
    return hasActiveSubItem(item);
  }
  if (item.href) {
    const isThisActive = isActive(item.href);
    // Exclude if this is also a submenu item of another parent
    const isSubmenuOfAnother = sidebarItems.some(
      (otherItem) =>
        otherItem.id !== item.id &&
        otherItem.subItems?.some((sub) => sub.href === item.href && isActive(sub.href, true))
    );
    return isThisActive && !isSubmenuOfAnother;
  }
  return false;
};
```

---

## Design System Integration

### Colors

All colors use the design system semantic tokens:

- **Active Background**: `semanticColors.backgroundInfoLight` (light blue)
- **Active Text**: `semanticColors.textBrand` (deep blue #002C55)
- **Inactive Text**: `semanticColors.textSecondary` (warm gray)
- **Badge Background**: `semanticColors.fillPrimary` (deep blue)
- **Badge Text**: `semanticColors.textInverse` (white)
- **Borders**: `semanticColors.borderSecondary` and `semanticColors.borderBrand`

### Spacing

- **Item Height**: 40px (`h-10`)
- **Horizontal Padding**: 10px (`px-2.5`)
- **Gap between icon and text**: 8px (`gap-2`)
- **Submenu Left Padding**: 20px (`ml-5 pl-5`)
- **Submenu Item Padding**: 18px left, 6px right, 8px vertical

### Typography

- **Font Family**: `var(--font-family-body)` (Open Sans)
- **Font Size**: 14px (`text-sm`)
- **Font Weight**: Medium (`font-medium`)
- **Line Height**: 20px (`line-height-sm`)

---

## Features

### Collapsible Sidebar

- **Expanded Width**: 256px (`w-64`)
- **Collapsed Width**: 64px (`w-16`)
- **Toggle Button**: Hamburger menu icon in header
- **State Management**: `isCollapsed` state controls width and content visibility

### Submenu Expansion

- **Auto-Expand**: Parent items automatically expand when a submenu item is active
- **Manual Toggle**: Click parent item to expand/collapse submenu
- **State Management**: `expandedItems` Set tracks which parents are expanded

### Badges

- **Display**: Circular badge with count (e.g., "3" for notifications)
- **Size**: Minimum 18px × 18px
- **Position**: Right side of item label
- **Collapsed State**: Badge appears as absolute positioned element in top-right corner

### Alert Card

The sidebar includes an optional "Used Space" alert card:

- **Location**: Between navigation items and footer
- **Content**: Storage usage information with upgrade button
- **Visibility**: Hidden when sidebar is collapsed

### Help & Support

- **Location**: Footer section
- **Route**: `/help`
- **Icon**: Question circle icon

---

## Icons

All icons use `lucide-react`:

- **Dashboard**: `Home`
- **Applications**: `Layers3`
- **Funder**: `Handshake`
- **Notifications**: `MessageSquare`
- **Files**: `UploadCloud`
- **Settings**: `Settings`
- **Help**: `HelpCircle`
- **Upgrade**: `Crown`
- **Menu Toggle**: `Menu`

**Icon Size**: 20px × 20px (`w-5 h-5`)

---

## Responsive Behavior

### Desktop (1024px+)
- Full sidebar visible
- All labels and submenus shown
- Alert card visible

### Tablet (768px - 1023px)
- Sidebar can be collapsed
- Same functionality as desktop

### Mobile (< 768px)
- Sidebar hidden by default (`hidden lg:flex`)
- Accessible via hamburger menu in header

---

## Usage Example

```typescript
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex">
      <DashboardSidebar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
```

---

## Adding New Navigation Items

To add a new navigation item:

1. **Add to `sidebarItems` array**:
```typescript
{
  id: 'new-item',
  label: 'New Item',
  icon: <NewIcon className="w-5 h-5" />,
  href: '/new-item',
  badge: 0, // Optional
}
```

2. **Create the route** in `apps/shell/src/app/new-item/page.tsx`

3. **Update this documentation** with the new route

---

## Troubleshooting

### Multiple Items Active

**Issue**: Multiple navigation items appear active simultaneously.

**Solution**: Check that the active state logic properly excludes items that are submenu items of other parents.

### Submenu Not Expanding

**Issue**: Submenu doesn't auto-expand when route matches.

**Solution**: Verify the `useEffect` hook that auto-expands parents is running and checking the correct routes.

### Routes Not Working

**Issue**: Clicking navigation items doesn't navigate.

**Solution**: Ensure routes exist in `apps/shell/src/app/` directory structure.

---

## Related Documentation

- [Platform Shell Requirements](./REQUIREMENTS.md)
- [Design System Colors](../../../../src/design-system/theme/colors.ts)
- [Component Build Guide: Navigation Header](../../../../../Claude%20Documentation/files/Component_03_Navigation_Header.md)

---

**Last Updated**: December 2024  
**Maintained By**: Development Team


