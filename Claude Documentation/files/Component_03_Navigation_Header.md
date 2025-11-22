# Component Build Guide: Navigation Header

**Component**: Navigation Header (Global App Shell)  
**Priority**: HIGH - Required for all pages  
**Estimated Time**: 1-2 days  
**Dependencies**: None (foundational component)  
**Figma Design**: [Link to be added]

---

## 🔬 PHASE 1: RESEARCH & BEST PRACTICES

### Research Summary: SaaS Application Navigation Patterns

**Sources**: Nielsen Norman Group, Material Design, Glow UI Navigation Components

#### Key Research Findings:

**1. Header Layout Best Practices**
- **Fixed/Sticky**: Header should remain visible during scroll (sticky positioning)
- **Height**: 60-72px is optimal for desktop, provides sufficient click targets
- **Logo Placement**: Top-left, acts as home button
- **Search**: Center or right-center for prominence
- **User Menu**: Always top-right (F-pattern reading)
- **Notifications**: Next to user menu, shows badge count

**2. Organization Switcher**
- **Placement**: Next to logo or in user menu
- **Visual Indicator**: Current org name clearly visible
- **Quick Switch**: Dropdown for multi-org users
- **Context Persistence**: Remember last selected org

**3. App Switcher Patterns**
- **Trigger**: Icon or "Apps" button in header
- **Display**: Dropdown or modal with app grid
- **Quick Access**: Show recently used apps first
- **Keyboard Shortcut**: Cmd/Ctrl + K for power users

**4. Responsive Navigation**
- **Mobile**: Hamburger menu replaces full nav
- **Tablet**: Hybrid approach (some items visible, some hidden)
- **Desktop**: Full navigation visible
- **Breakpoint**: 768px is standard mobile/desktop transition

**5. Glow UI Navigation Patterns**
- Glow UI provides 6,500+ components including comprehensive navigation systems
- Uses variables for consistent theming across navigation states
- Auto Layout 5.0 ensures responsive behavior
- Includes hover states, active states, and focus indicators
- Professional SaaS navigation patterns with proper spacing and hierarchy

**6. Accessibility Requirements**
- **Keyboard Navigation**: All elements accessible via Tab
- **ARIA Labels**: Proper labels for screen readers
- **Focus Indicators**: Visible focus rings (2px, high contrast)
- **Color Contrast**: Minimum 4.5:1 ratio for text

---

## 🎨 DESIGN SPECIFICATIONS

### Header Structure

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  [Logo] [Org▾] │ [🔍 Search...]  │  [🔔 3] [Apps] [👤▾]     │
│                                                              │
└──────────────────────────────────────────────────────────────┘
    ↑              ↑                  ↑        ↑       ↑
  Brand     Organization          Utility   Quick   User
  Section    Context              Zone      Access  Menu
```

### Dimensions

```typescript
const headerSpecs = {
  height: {
    desktop: '64px',
    mobile: '56px',
  },
  padding: {
    horizontal: '24px',
    mobile: '16px',
  },
  zIndex: 1000, // Always on top
  backgroundColor: '#FFFFFF',
  borderBottom: '1px solid #E5E7EB',
};
```

### Responsive Behavior

```
Desktop (1024px+):
[Logo] [Org▾] │ [🔍 Search...]│ [🔔] [Apps] [👤▾]

Tablet (768-1023px):
[Logo] [Org▾] │ [🔍] │ [🔔] [👤▾]

Mobile (< 768px):
[☰] [Logo] │ [🔔] [👤▾]
```

---

## 📋 IMPLEMENTATION CHECKLIST

### Step 1: Create Header Component

**File**: `src/components/layout/Header.tsx`

```typescript
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Bell, Grid3x3, ChevronDown, Menu } from 'lucide-react';
import { UserMenu } from './UserMenu';
import { NotificationDropdown } from './NotificationDropdown';
import { AppSwitcher } from './AppSwitcher';
import { OrganizationSwitcher } from './OrganizationSwitcher';

// Mock data for development
const MOCK_USER = {
  name: 'Sarah Johnson',
  email: 'sarah@communityimpact.org',
  avatar: 'https://i.pravatar.cc/150?img=1',
  role: 'Admin',
};

const MOCK_ORG = {
  name: 'Community Impact Foundation',
  slug: 'community-impact',
};

const MOCK_UNREAD_NOTIFICATIONS = 3;

export function Header() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section: Logo + Org Switcher */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo */}
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold">
                V
              </div>
              <span className="hidden sm:block text-xl font-bold text-gray-900">
                VISION
              </span>
            </Link>

            {/* Organization Switcher */}
            <div className="hidden md:block">
              <OrganizationSwitcher currentOrg={MOCK_ORG} />
            </div>
          </div>

          {/* Center Section: Search (Desktop) */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents, apps, or anything..."
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className={`
                  w-full pl-10 pr-4 py-2 border rounded-lg transition-all
                  ${isSearchFocused 
                    ? 'border-blue-500 ring-2 ring-blue-100' 
                    : 'border-gray-300 hover:border-gray-400'
                  }
                  focus:outline-none
                `}
              />
            </div>
          </div>

          {/* Right Section: Utilities */}
          <div className="flex items-center space-x-2">
            {/* Search Icon (Mobile/Tablet) */}
            <button className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
              <Search className="w-5 h-5" />
            </button>

            {/* Notifications */}
            <div className="relative">
              <NotificationDropdown unreadCount={MOCK_UNREAD_NOTIFICATIONS} />
            </div>

            {/* App Switcher */}
            <button className="hidden sm:flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <Grid3x3 className="w-5 h-5" />
              <span className="hidden lg:inline text-sm font-medium">Apps</span>
            </button>

            {/* User Menu */}
            <UserMenu user={MOCK_USER} />
          </div>
        </div>
      </div>

      {/* Mobile Menu (Slide-out) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-3">
            <OrganizationSwitcher currentOrg={MOCK_ORG} />
            
            <div className="pt-3 border-t border-gray-200">
              <Link
                href="/documents"
                className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                📚 Documents
              </Link>
              <Link
                href="/settings"
                className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                ⚙️ Settings
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
```

**✅ TASK CHECKLIST:**
- [ ] Create `src/components/layout/Header.tsx`
- [ ] Add mock user and organization data
- [ ] Implement responsive layout (mobile/tablet/desktop)
- [ ] Add mobile menu toggle
- [ ] Create search input with focus states
- [ ] Add placeholder components (will build next)

---

### Step 2: Build Organization Switcher

**File**: `src/components/layout/OrganizationSwitcher.tsx`

```typescript
'use client';

import { useState } from 'react';
import { ChevronDown, Building2, Check } from 'lucide-react';

interface Org {
  name: string;
  slug: string;
}

interface OrganizationSwitcherProps {
  currentOrg: Org;
}

// Mock additional orgs (for consultants/funders)
const MOCK_ORGS = [
  { name: 'Community Impact Foundation', slug: 'community-impact' },
  { name: 'Youth Development Center', slug: 'youth-dev' },
  { name: 'Senior Services Network', slug: 'senior-services' },
];

export function OrganizationSwitcher({ currentOrg }: OrganizationSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors"
      >
        <Building2 className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-900 max-w-[200px] truncate">
          {currentOrg.name}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute left-0 top-full mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Your Organizations
              </div>

              {MOCK_ORGS.map((org) => (
                <button
                  key={org.slug}
                  onClick={() => {
                    // Would switch organization here
                    setIsOpen(false);
                  }}
                  className={`
                    w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors
                    ${org.slug === currentOrg.slug
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-4 h-4" />
                    <span className="text-sm font-medium truncate">
                      {org.name}
                    </span>
                  </div>
                  
                  {org.slug === currentOrg.slug && (
                    <Check className="w-4 h-4 text-blue-700" />
                  )}
                </button>
              ))}

              <div className="mt-2 pt-2 border-t border-gray-200">
                <button className="w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg text-left">
                  + Create New Organization
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
```

**✅ TASK CHECKLIST:**
- [ ] Create `src/components/layout/OrganizationSwitcher.tsx`
- [ ] Add dropdown toggle functionality
- [ ] Display list of organizations
- [ ] Highlight current organization
- [ ] Add "Create New Organization" button
- [ ] Close dropdown when clicking outside

---

### Step 3: Build Notification Dropdown

**File**: `src/components/layout/NotificationDropdown.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Bell, CheckCircle, AlertCircle, Info } from 'lucide-react';
import Link from 'next/link';

interface NotificationDropdownProps {
  unreadCount: number;
}

const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    type: 'success' as const,
    title: 'Assessment completed',
    message: 'Q4 Capacity Assessment is ready',
    link: '/capacityiq/assessments/q4',
    timestamp: '2h ago',
    read: false,
  },
  {
    id: '2',
    type: 'warning' as const,
    title: 'Draft ready for review',
    message: 'Youth Program grant needs review',
    link: '/fundingframer/grants/youth',
    timestamp: '1d ago',
    read: false,
  },
  {
    id: '3',
    type: 'info' as const,
    title: 'Documents uploaded',
    message: '3 new documents in library',
    link: '/documents',
    timestamp: '2d ago',
    read: true,
  },
];

const ICON_MAP = {
  success: CheckCircle,
  warning: AlertCircle,
  info: Info,
};

const COLOR_MAP = {
  success: 'text-green-600',
  warning: 'text-amber-600',
  info: 'text-blue-600',
};

export function NotificationDropdown({ unreadCount }: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell className="w-5 h-5" />
        
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Notifications Panel */}
          <div className="absolute right-0 top-full mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Notifications
                </h3>
                <button className="text-sm text-blue-600 hover:text-blue-700">
                  Mark all read
                </button>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {MOCK_NOTIFICATIONS.map((notification) => {
                const Icon = ICON_MAP[notification.type];
                const colorClass = COLOR_MAP[notification.type];

                return (
                  <Link
                    key={notification.id}
                    href={notification.link}
                    onClick={() => setIsOpen(false)}
                    className={`
                      block px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100
                      ${!notification.read ? 'bg-blue-50' : ''}
                    `}
                  >
                    <div className="flex items-start space-x-3">
                      <Icon className={`w-5 h-5 mt-0.5 ${colorClass}`} />
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {notification.timestamp}
                        </p>
                      </div>

                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="p-3 border-t border-gray-200">
              <Link
                href="/notifications"
                onClick={() => setIsOpen(false)}
                className="block text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View All Notifications
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
```

**✅ TASK CHECKLIST:**
- [ ] Create `src/components/layout/NotificationDropdown.tsx`
- [ ] Add notification badge with count
- [ ] Build dropdown panel
- [ ] Display notifications with icons
- [ ] Highlight unread notifications
- [ ] Add "Mark all read" button
- [ ] Link to notification detail pages

---

### Step 4: Build User Menu

**File**: `src/components/layout/UserMenu.tsx`

```typescript
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User, Settings, HelpCircle, LogOut, ChevronDown } from 'lucide-react';

interface UserMenuProps {
  user: {
    name: string;
    email: string;
    avatar: string;
    role: string;
  };
}

export function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 pl-2 pr-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <img
          src={user.avatar}
          alt={user.name}
          className="w-8 h-8 rounded-full"
        />
        <ChevronDown className="hidden sm:block w-4 h-4 text-gray-500" />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            {/* User Info */}
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user.email}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {user.role}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              <Link
                href="/settings/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="text-sm">My Profile</span>
              </Link>

              <Link
                href="/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span className="text-sm">Settings</span>
              </Link>

              <Link
                href="/help"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <HelpCircle className="w-4 h-4" />
                <span className="text-sm">Help & Support</span>
              </Link>

              <div className="my-2 border-t border-gray-200"></div>

              <button
                onClick={() => {
                  // Would handle logout here
                  setIsOpen(false);
                }}
                className="w-full flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
```

**✅ TASK CHECKLIST:**
- [ ] Create `src/components/layout/UserMenu.tsx`
- [ ] Display user avatar and name
- [ ] Build dropdown menu
- [ ] Add menu items (Profile, Settings, Help, Logout)
- [ ] Style logout button differently (red)
- [ ] Close menu when clicking items or outside

---

### Step 5: Add Header to Root Layout

**File**: `src/app/layout.tsx`

```typescript
import { Header } from '@/components/layout/Header';
import './globals.css';

export const metadata = {
  title: 'VISION Platform',
  description: 'Comprehensive SaaS suite for nonprofit organizations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
```

**✅ TASK CHECKLIST:**
- [ ] Add Header component to root layout
- [ ] Verify header appears on all pages
- [ ] Test sticky behavior (header stays at top when scrolling)
- [ ] Ensure proper z-index (header above other content)

---

## 🧪 TESTING CHECKLIST

### Visual Testing
- [ ] Header displays correctly on all pages
- [ ] Logo is clickable and returns to dashboard
- [ ] Organization switcher shows current org
- [ ] Search bar is visible and functional
- [ ] Notification badge shows count
- [ ] User avatar displays correctly

### Interaction Testing
- [ ] Organization switcher dropdown opens/closes
- [ ] Notification dropdown opens/closes
- [ ] User menu dropdown opens/closes
- [ ] Mobile menu toggle works
- [ ] All links navigate correctly
- [ ] Dropdowns close when clicking outside

### Responsive Testing
- [ ] Desktop: Full header with search bar
- [ ] Tablet: Search icon instead of full search
- [ ] Mobile: Hamburger menu, minimal elements

### Accessibility Testing
- [ ] All elements keyboard accessible
- [ ] Focus indicators visible
- [ ] ARIA labels present
- [ ] Screen reader compatible

---

## 📸 FIGMA DESIGN INTEGRATION

**PLACEHOLDER**: Add link to your Glow UI Figma design for this component

**Design Link**: `[TO BE ADDED]`

### Design Extraction Checklist
- [ ] Extract header height
- [ ] Extract spacing between elements
- [ ] Match logo styling
- [ ] Confirm dropdown styling
- [ ] Match notification badge design
- [ ] Verify user avatar size

---

## ✅ COMPLETION CRITERIA

This component is COMPLETE when:
- [ ] Header displays on all pages
- [ ] All dropdowns functional
- [ ] Fully responsive (mobile → desktop)
- [ ] Sticky positioning works
- [ ] Mock data displays correctly
- [ ] Matches Glow UI design system
- [ ] No console errors
- [ ] Accessible via keyboard

---

**Last Updated**: November 19, 2025  
**Status**: Ready for Development  
**Figma Design**: [Pending]
