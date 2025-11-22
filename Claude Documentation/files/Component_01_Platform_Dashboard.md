# Component Build Guide: Platform Dashboard

**Component**: Platform Dashboard (Main Landing Page)  
**Priority**: HIGH  
**Estimated Time**: 2-3 days  
**Dependencies**: Navigation Header, App Cards  
**Figma Design**: [Link to be added]

---

## 🔬 PHASE 1: RESEARCH & BEST PRACTICES

### Research Summary: Dashboard Design for SaaS Applications

**Sources**: Nielsen Norman Group, Material Design Guidelines, Glow UI Design System

#### Key Research Findings:

**1. Dashboard Layout Best Practices**
- Modern SaaS dashboards should keep designers and developers in sync and maintain design consistency
- **F-Pattern Reading**: Users scan in an F-shaped pattern (top-left → top-right → down left side)
- **Progressive Disclosure**: Show most important information first, hide complexity
- **Scannable Content**: Use visual hierarchy, whitespace, and grouping
- **Responsive Grid**: 12-column grid for flexibility across screen sizes

**2. Information Hierarchy**
1. **Primary Actions** (Top): Most frequent user tasks
2. **Status/Overview** (Upper): Quick metrics, notifications
3. **Content Grid** (Middle): Main dashboard content (apps, activity)
4. **Navigation** (Left/Top): Persistent access to all areas

**3. Visual Design Principles**
- **Whitespace**: 60-40 rule (60% content, 40% whitespace)
- **Color Usage**: 
  - Primary color: 10% of screen (CTAs, active states)
  - Neutral: 60% (backgrounds, cards)
  - Accent: 30% (secondary elements)
- **Typography Scale**: 
  - Hero/H1: 32-48px
  - H2/Section: 24-32px
  - Body: 16px
  - Small/Caption: 14px

**4. Glow UI Design System Alignment**
- Glow UI provides 6,500+ components with Auto Layout 5.0 and variables structure for rapid SaaS design
- Use Glow UI's responsive templates for dashboard foundation
- Leverage Variables system for theme consistency
- Apply Glow UI's card components for app grid
- Use Glow UI's notification patterns

**5. Card-Based Layouts**
- **Size**: Minimum 200x200px for interactive cards
- **Spacing**: 16-24px gap between cards
- **Hover States**: Subtle elevation change (shadow increase)
- **Click Target**: Minimum 44x44px for touch/click areas

**6. Performance Considerations**
- **Lazy Loading**: Load app cards only when visible
- **Skeleton Screens**: Show loading placeholders
- **Optimistic UI**: Show updates immediately, sync in background

---

## 🎨 DESIGN SPECIFICATIONS

### Layout Structure

```
┌────────────────────────────────────────────────────────────┐
│  HEADER (64px height)                                      │ ← Sticky
├────────────────────────────────────────────────────────────┤
│  WELCOME SECTION (120px)                                   │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ 👋 Welcome back, [Name]!                            │  │
│  │ [Organization Name]                                 │  │
│  │ [Quick Action Buttons]                              │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                            │
│  NOTIFICATIONS SECTION (Collapsible, Max 400px)           │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ 📊 Recent Activity & Notifications                  │  │
│  │ [Notification Items...]                             │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                            │
│  APP GRID SECTION (Flexible height)                       │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ 📱 Your Applications                                │  │
│  │ [Card] [Card] [Card] [Card]                         │  │
│  │ [Card] [Card] [Card] [Card]                         │  │
│  └─────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

### Responsive Breakpoints

```typescript
// Based on Glow UI responsive system
const breakpoints = {
  mobile: '0-767px',      // 1 column for apps
  tablet: '768-1023px',   // 2 columns for apps
  desktop: '1024-1439px', // 3 columns for apps
  wide: '1440px+',        // 4 columns for apps
};
```

### Color Palette (From Glow UI)

```typescript
// To be extracted from your Figma Glow UI file
const colors = {
  background: {
    primary: '#FFFFFF',
    secondary: '#F9FAFB',
    tertiary: '#F3F4F6',
  },
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    tertiary: '#9CA3AF',
  },
  brand: {
    primary: '#3B82F6',    // Adjust to your brand
    hover: '#2563EB',
    active: '#1D4ED8',
  },
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
  border: {
    light: '#E5E7EB',
    medium: '#D1D5DB',
    dark: '#9CA3AF',
  },
};
```

---

## 📋 IMPLEMENTATION CHECKLIST

### Step 1: Create Dashboard Page Component

**File**: `src/app/dashboard/page.tsx`

```typescript
// Mock data for development (no auth required)
const MOCK_USER = {
  id: '1',
  firstName: 'Sarah',
  lastName: 'Johnson',
  email: 'sarah@communityimpact.org',
  avatar: 'https://i.pravatar.cc/150?img=1',
};

const MOCK_ORG = {
  id: '1',
  name: 'Community Impact Foundation',
  plan: 'Professional',
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header will be imported from separate component */}
      <DashboardHeader user={MOCK_USER} organization={MOCK_ORG} />
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WelcomeSection user={MOCK_USER} />
        <NotificationsSection />
        <ApplicationsGrid />
      </main>
    </div>
  );
}
```

**✅ TASK CHECKLIST:**
- [ ] Create `src/app/dashboard/page.tsx` file
- [ ] Add MOCK_USER and MOCK_ORG constants
- [ ] Set up basic layout structure
- [ ] Import component placeholders (will build next)
- [ ] Verify page renders at `http://localhost:3000/dashboard`

---

### Step 2: Build Welcome Section Component

**File**: `src/components/dashboard/WelcomeSection.tsx`

```typescript
import { Button } from '@/components/ui/button';
import { Upload, BarChart3, PenTool } from 'lucide-react';

interface WelcomeSectionProps {
  user: {
    firstName: string;
    lastName: string;
  };
}

export function WelcomeSection({ user }: WelcomeSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            👋 Welcome back, {user.firstName}!
          </h1>
          <p className="text-gray-600">
            {/* Organization name will be added */}
            Community Impact Foundation
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Upload Document
          </Button>
          <Button variant="outline" size="sm">
            <BarChart3 className="w-4 h-4 mr-2" />
            View Analytics
          </Button>
          <Button variant="default" size="sm">
            <PenTool className="w-4 h-4 mr-2" />
            Start Draft
          </Button>
        </div>
      </div>
    </div>
  );
}
```

**✅ TASK CHECKLIST:**
- [ ] Create `src/components/dashboard/WelcomeSection.tsx`
- [ ] Install lucide-react if not already: `npm install lucide-react`
- [ ] Create Button component (use Glow UI or shadcn/ui)
- [ ] Style with Tailwind classes matching Glow UI
- [ ] Add hover states to buttons
- [ ] Test responsiveness (stack buttons on mobile)

---

### Step 3: Build Notifications Section

**File**: `src/components/dashboard/NotificationsSection.tsx`

```typescript
import { Bell, CheckCircle, AlertCircle, Info } from 'lucide-react';

const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    type: 'success' as const,
    app: 'CapacityIQ',
    title: 'Assessment "Q4 2025" completed',
    message: 'Your quarterly capacity assessment is ready for review.',
    actionUrl: '/capacityiq/assessments/q4-2025',
    actionLabel: 'View Results',
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    type: 'warning' as const,
    app: 'FundingFramer',
    title: 'Grant draft ready for review',
    message: 'Youth Program Expansion grant draft is ready.',
    actionUrl: '/fundingframer/grants/youth-expansion',
    actionLabel: 'Review Draft',
    timestamp: '1 day ago',
  },
  {
    id: '3',
    type: 'info' as const,
    app: 'Document Library',
    title: '3 new documents uploaded',
    message: 'Board meeting minutes and financial reports added.',
    actionUrl: '/documents',
    actionLabel: 'View Documents',
    timestamp: '2 days ago',
  },
];

const ICON_MAP = {
  success: CheckCircle,
  warning: AlertCircle,
  info: Info,
};

const COLOR_MAP = {
  success: 'text-green-600 bg-green-50',
  warning: 'text-amber-600 bg-amber-50',
  info: 'text-blue-600 bg-blue-50',
};

export function NotificationsSection() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <Bell className="w-5 h-5 mr-2" />
          Recent Activity & Notifications
        </h2>
        <button className="text-sm text-blue-600 hover:text-blue-700">
          View All
        </button>
      </div>

      <div className="space-y-3">
        {MOCK_NOTIFICATIONS.map((notification) => {
          const Icon = ICON_MAP[notification.type];
          const colorClass = COLOR_MAP[notification.type];

          return (
            <div
              key={notification.id}
              className="flex items-start space-x-3 p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
            >
              <div className={`p-2 rounded-full ${colorClass}`}>
                <Icon className="w-5 h-5" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {notification.app}: {notification.title}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {notification.message}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                    {notification.timestamp}
                  </span>
                </div>
                
                <button className="text-sm text-blue-600 hover:text-blue-700 mt-2 font-medium">
                  {notification.actionLabel} →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

**✅ TASK CHECKLIST:**
- [ ] Create `src/components/dashboard/NotificationsSection.tsx`
- [ ] Add MOCK_NOTIFICATIONS array
- [ ] Implement icon mapping based on notification type
- [ ] Style notification cards with hover states
- [ ] Add "View All" button (non-functional for now)
- [ ] Test with different notification types

---

### Step 4: Build Applications Grid

**File**: `src/components/dashboard/ApplicationsGrid.tsx`

```typescript
import { AppCard } from './AppCard';

const MOCK_APPS = [
  {
    id: 'capacityiq',
    name: 'CapacityIQ',
    description: 'Organizational capacity assessment and benchmarking',
    icon: '📊',
    status: 'active' as const,
    url: '/capacityiq',
    color: 'blue',
  },
  {
    id: 'fundingframer',
    name: 'FundingFramer',
    description: 'AI-assisted grant application drafting',
    icon: '✍️',
    status: 'active' as const,
    url: '/fundingframer',
    color: 'purple',
  },
  {
    id: 'grant-writer',
    name: 'Grant Writer Pro',
    description: 'Complete AI-powered grant development',
    icon: '📝',
    status: 'coming_soon' as const,
    url: null,
    color: 'green',
  },
  {
    id: 'crm-lite',
    name: 'CRM Lite',
    description: 'Contact and donor relationship management',
    icon: '👥',
    status: 'available' as const,
    url: '/crm-lite',
    color: 'orange',
  },
  {
    id: 'impact-story',
    name: 'Impact Story Studio',
    description: 'Create compelling impact narratives',
    icon: '📖',
    status: 'coming_soon' as const,
    url: null,
    color: 'pink',
  },
  {
    id: 'kpi-dashboard',
    name: 'KPI Dashboard Builder',
    description: 'Custom KPI tracking and visualization',
    icon: '📈',
    status: 'available' as const,
    url: '/kpi-dashboard',
    color: 'indigo',
  },
];

export function ApplicationsGrid() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          📱 Your Applications
        </h2>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          Browse All Apps →
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {MOCK_APPS.map((app) => (
          <AppCard key={app.id} app={app} />
        ))}
      </div>
    </div>
  );
}
```

**✅ TASK CHECKLIST:**
- [ ] Create `src/components/dashboard/ApplicationsGrid.tsx`
- [ ] Add MOCK_APPS array with 6+ apps
- [ ] Set up responsive grid (1→2→3→4 columns)
- [ ] Create AppCard component placeholder
- [ ] Add "Browse All Apps" button
- [ ] Verify grid responsiveness on different screen sizes

---

### Step 5: Build App Card Component

**File**: `src/components/dashboard/AppCard.tsx`

```typescript
import { ArrowRight, Lock, Wrench } from 'lucide-react';
import Link from 'next/link';

interface AppCardProps {
  app: {
    id: string;
    name: string;
    description: string;
    icon: string;
    status: 'active' | 'available' | 'coming_soon';
    url: string | null;
    color: string;
  };
}

const STATUS_CONFIG = {
  active: {
    badge: '✓ Active',
    badgeClass: 'bg-green-100 text-green-700',
    buttonLabel: 'Launch App',
    buttonClass: 'bg-blue-600 text-white hover:bg-blue-700',
    buttonIcon: ArrowRight,
  },
  available: {
    badge: '🔒 Available',
    badgeClass: 'bg-gray-100 text-gray-700',
    buttonLabel: 'Request Access',
    buttonClass: 'bg-gray-200 text-gray-700 hover:bg-gray-300',
    buttonIcon: Lock,
  },
  coming_soon: {
    badge: '🚧 Coming Soon',
    badgeClass: 'bg-amber-100 text-amber-700',
    buttonLabel: 'Notify Me',
    buttonClass: 'bg-gray-200 text-gray-700 hover:bg-gray-300',
    buttonIcon: Wrench,
  },
};

export function AppCard({ app }: AppCardProps) {
  const config = STATUS_CONFIG[app.status];
  const Icon = config.buttonIcon;
  
  const cardContent = (
    <>
      <div className="text-4xl mb-3">{app.icon}</div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {app.name}
      </h3>
      
      <p className="text-sm text-gray-600 mb-4 flex-1">
        {app.description}
      </p>
      
      <div className="flex items-center justify-between">
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${config.badgeClass}`}>
          {config.badge}
        </span>
      </div>
      
      <button
        className={`w-full mt-4 px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center justify-center ${config.buttonClass}`}
        disabled={app.status !== 'active'}
      >
        {config.buttonLabel}
        <Icon className="w-4 h-4 ml-2" />
      </button>
    </>
  );

  if (app.status === 'active' && app.url) {
    return (
      <Link href={app.url}>
        <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md hover:border-gray-300 transition-all cursor-pointer flex flex-col h-full">
          {cardContent}
        </div>
      </Link>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col h-full">
      {cardContent}
    </div>
  );
}
```

**✅ TASK CHECKLIST:**
- [ ] Create `src/components/dashboard/AppCard.tsx`
- [ ] Add status configurations (active, available, coming_soon)
- [ ] Implement conditional rendering based on status
- [ ] Add hover states (shadow, border color)
- [ ] Make active cards clickable (Link wrapper)
- [ ] Style badges with appropriate colors
- [ ] Test all three status types

---

### Step 6: Add Responsive Styles

**File**: `src/app/dashboard/layout.tsx` (or globals.css)

```css
/* Dashboard-specific responsive utilities */
@layer components {
  .dashboard-container {
    @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
  }
  
  .dashboard-card {
    @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
  }
  
  .dashboard-section-title {
    @apply text-xl font-semibold text-gray-900 mb-4;
  }
}

/* Mobile adjustments */
@media (max-width: 767px) {
  .welcome-section {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .welcome-actions {
    margin-top: 1rem;
    width: 100%;
    flex-direction: column;
  }
  
  .welcome-actions button {
    width: 100%;
  }
}
```

**✅ TASK CHECKLIST:**
- [ ] Add responsive CSS utilities
- [ ] Test on mobile (375px width)
- [ ] Test on tablet (768px width)
- [ ] Test on desktop (1440px width)
- [ ] Verify buttons stack properly on mobile
- [ ] Confirm card grid adapts to screen size

---

### Step 7: Add Loading States (Skeleton Screens)

**File**: `src/components/dashboard/DashboardSkeleton.tsx`

```typescript
export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section Skeleton */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>

        {/* Notifications Skeleton */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>

        {/* Apps Grid Skeleton */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

**✅ TASK CHECKLIST:**
- [ ] Create skeleton component
- [ ] Add pulsing animation
- [ ] Match skeleton layout to actual dashboard
- [ ] Test loading appearance
- [ ] Use skeleton while "loading" data (simulate with setTimeout)

---

## 🧪 TESTING CHECKLIST

### Visual Testing
- [ ] Dashboard renders correctly at `/dashboard`
- [ ] All sections visible (Welcome, Notifications, Apps)
- [ ] Mock data displays properly
- [ ] Colors match Glow UI design system
- [ ] Icons render correctly
- [ ] Buttons have proper hover states

### Responsive Testing
- [ ] Mobile (375px): Single column, stacked elements
- [ ] Tablet (768px): 2-column app grid
- [ ] Desktop (1024px): 3-column app grid
- [ ] Wide (1440px+): 4-column app grid

### Interaction Testing
- [ ] Active app cards are clickable
- [ ] Available/Coming Soon cards show appropriate UI
- [ ] Quick action buttons are clickable (no functionality yet)
- [ ] Notification action buttons are clickable
- [ ] "View All" and "Browse All Apps" buttons exist

### Performance Testing
- [ ] Page loads in < 2 seconds
- [ ] No console errors or warnings
- [ ] Smooth scrolling
- [ ] No layout shift on load

---

## 📸 FIGMA DESIGN INTEGRATION

**PLACEHOLDER**: Add link to your Glow UI Figma design for this component

**Design Link**: `[TO BE ADDED]`

### Design Extraction Checklist
- [ ] Export spacing values from Figma
- [ ] Export color variables from Figma
- [ ] Export typography styles from Figma
- [ ] Match border radius values
- [ ] Match shadow elevations
- [ ] Confirm icon sizes

---

## 🐛 COMMON ISSUES & SOLUTIONS

### Issue 1: Cards Not Displaying in Grid
**Solution**: Check grid CSS classes, ensure parent has proper width

### Issue 2: Icons Not Rendering
**Solution**: Verify lucide-react is installed, check import paths

### Issue 3: Hover States Not Working
**Solution**: Ensure Tailwind hover: variant is enabled in config

### Issue 4: Mobile Layout Broken
**Solution**: Add responsive classes (sm:, md:, lg:), test at each breakpoint

---

## ✅ COMPLETION CRITERIA

This component is COMPLETE when:
- [ ] Dashboard page accessible at `/dashboard`
- [ ] All three sections render with mock data
- [ ] 6+ app cards display in responsive grid
- [ ] Hover states work on interactive elements
- [ ] Page is fully responsive (mobile → desktop)
- [ ] Matches Glow UI design system
- [ ] No console errors
- [ ] Screenshot/video captured for review

---

## 📚 NEXT STEPS

After completing the Platform Dashboard:
1. Build **Navigation Header** component
2. Build **Document Library** page
3. Build **Settings Pages**
4. Add routing between pages

---

**Last Updated**: November 19, 2025  
**Status**: Ready for Development  
**Figma Design**: [Pending]
