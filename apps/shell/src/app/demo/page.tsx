'use client';

import * as React from 'react';
import {
  GlowButton,
  GlowCard,
  GlowCardHeader,
  GlowCardTitle,
  GlowCardDescription,
  GlowCardContent,
  GlowInput,
  GlowBadge,
  GlowModal,
  GlowModalClose,
  GlowTabs,
  exampleTabs,
} from '@/components/glow-ui';
import { AppLauncher, App, AppCategory } from '@/components/dashboard/AppLauncher';
import { LoginForm } from '@/components/auth/LoginForm';
import { NavigationSidebar, defaultNavItems } from '@/components/navigation/NavigationSidebar';
import {
  DashboardHeader,
  exampleNotifications,
} from '@/components/navigation/DashboardHeader';
import { DataTable, Column, exampleRowActions } from '@/components/data/DataTable';
import {
  Mail,
  Lock,
  Star,
  TrendingUp,
  Users,
  FileText,
  Settings,
  Zap,
  BarChart3,
  Wallet,
  Activity,
  FolderOpen,
  Handshake,
} from 'lucide-react';

/**
 * Demo Page
 * Showcases all Glow UI components with interactive examples
 */
export default function DemoPage() {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');

  return (
    <div className="min-h-screen bg-background">
      {/* Layout with Sidebar */}
      <div className="flex">
        {/* Navigation Sidebar */}
        <NavigationSidebar
          items={defaultNavItems}
          currentPath="/demo"
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          organization={{
            name: 'VISION Platform',
            plan: 'Pro',
          }}
          user={{
            name: 'John Doe',
            email: 'john@example.org',
          }}
        />

        {/* Main Content */}
        <div className="flex-1">
          {/* Dashboard Header */}
          <DashboardHeader
            theme={theme}
            onThemeToggle={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            notifications={exampleNotifications}
            showSearch
            showAppSwitcher
            showNotifications
            showThemeToggle
          />

          {/* Content Area */}
          <main className="p-6 space-y-8">
            {/* Page Header */}
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">
                Glow UI Component Library
              </h1>
              <p className="text-muted-foreground">
                Interactive demo of all VISION Platform UI components with Glow
                effects
              </p>
            </div>

            {/* Component Showcase Sections */}
            <div className="space-y-12">
              {/* Section 1: Buttons */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">Buttons</h2>
                <GlowCard>
                  <GlowCardContent className="space-y-6 pt-6">
                    {/* Button Variants */}
                    <div>
                      <h3 className="text-sm font-medium mb-3">Variants</h3>
                      <div className="flex flex-wrap gap-3">
                        <GlowButton variant="default">Default</GlowButton>
                        <GlowButton variant="secondary">Secondary</GlowButton>
                        <GlowButton variant="outline">Outline</GlowButton>
                        <GlowButton variant="ghost">Ghost</GlowButton>
                        <GlowButton variant="link">Link</GlowButton>
                        <GlowButton variant="accent">Accent</GlowButton>
                        <GlowButton variant="gradient">Gradient</GlowButton>
                        <GlowButton variant="destructive">Destructive</GlowButton>
                      </div>
                    </div>

                    {/* Button Sizes */}
                    <div>
                      <h3 className="text-sm font-medium mb-3">Sizes</h3>
                      <div className="flex flex-wrap items-center gap-3">
                        <GlowButton size="sm">Small</GlowButton>
                        <GlowButton size="default">Default</GlowButton>
                        <GlowButton size="lg">Large</GlowButton>
                        <GlowButton size="xl">Extra Large</GlowButton>
                      </div>
                    </div>

                    {/* Button with Glow */}
                    <div>
                      <h3 className="text-sm font-medium mb-3">Glow Effects</h3>
                      <div className="flex flex-wrap gap-3">
                        <GlowButton glow="subtle">Subtle Glow</GlowButton>
                        <GlowButton glow="medium">Medium Glow</GlowButton>
                        <GlowButton glow="strong">Strong Glow</GlowButton>
                        <GlowButton glow="pulse">Pulse Glow</GlowButton>
                      </div>
                    </div>

                    {/* Button with Icons */}
                    <div>
                      <h3 className="text-sm font-medium mb-3">With Icons</h3>
                      <div className="flex flex-wrap gap-3">
                        <GlowButton leftIcon={<Star className="h-4 w-4" />}>
                          Left Icon
                        </GlowButton>
                        <GlowButton rightIcon={<TrendingUp className="h-4 w-4" />}>
                          Right Icon
                        </GlowButton>
                        <GlowButton loading>Loading</GlowButton>
                      </div>
                    </div>
                  </GlowCardContent>
                </GlowCard>
              </section>

              {/* Section 2: Cards */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">Cards</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <GlowCard variant="default">
                    <GlowCardHeader>
                      <GlowCardTitle>Default Card</GlowCardTitle>
                      <GlowCardDescription>
                        Ambient lighting effect
                      </GlowCardDescription>
                    </GlowCardHeader>
                    <GlowCardContent>
                      <p className="text-sm text-muted-foreground">
                        This card has the default ambient shadow effect with hover
                        enhancement.
                      </p>
                    </GlowCardContent>
                  </GlowCard>

                  <GlowCard variant="elevated">
                    <GlowCardHeader>
                      <GlowCardTitle>Elevated Card</GlowCardTitle>
                      <GlowCardDescription>
                        Stronger shadow depth
                      </GlowCardDescription>
                    </GlowCardHeader>
                    <GlowCardContent>
                      <p className="text-sm text-muted-foreground">
                        Elevated cards appear to float above the page with enhanced
                        shadows.
                      </p>
                    </GlowCardContent>
                  </GlowCard>

                  <GlowCard variant="interactive">
                    <GlowCardHeader>
                      <GlowCardTitle>Interactive Card</GlowCardTitle>
                      <GlowCardDescription>
                        Clickable with animation
                      </GlowCardDescription>
                    </GlowCardHeader>
                    <GlowCardContent>
                      <p className="text-sm text-muted-foreground">
                        Interactive cards lift on hover and can be clicked.
                      </p>
                    </GlowCardContent>
                  </GlowCard>

                  <GlowCard variant="glow">
                    <GlowCardHeader>
                      <GlowCardTitle>Glow Card</GlowCardTitle>
                      <GlowCardDescription>
                        Primary color glow
                      </GlowCardDescription>
                    </GlowCardHeader>
                    <GlowCardContent>
                      <p className="text-sm text-muted-foreground">
                        Cards with the primary brand color glow effect.
                      </p>
                    </GlowCardContent>
                  </GlowCard>
                </div>
              </section>

              {/* Section 3: Inputs */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">Inputs</h2>
                <GlowCard>
                  <GlowCardContent className="space-y-6 pt-6">
                    <GlowInput
                      label="Email Address"
                      placeholder="you@example.org"
                      type="email"
                      leftIcon={<Mail className="h-4 w-4" />}
                    />

                    <GlowInput
                      label="Password"
                      placeholder="Enter password"
                      type="password"
                      variant="glow"
                      leftIcon={<Lock className="h-4 w-4" />}
                      helperText="Password must be at least 8 characters"
                    />

                    <GlowInput
                      label="With Error"
                      placeholder="Invalid input"
                      error="This field is required"
                    />

                    <GlowInput
                      label="With Success"
                      placeholder="Valid input"
                      success="Looks good!"
                      defaultValue="john@example.org"
                    />
                  </GlowCardContent>
                </GlowCard>
              </section>

              {/* Section 4: Badges */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">Badges</h2>
                <GlowCard>
                  <GlowCardContent className="space-y-6 pt-6">
                    <div>
                      <h3 className="text-sm font-medium mb-3">Variants</h3>
                      <div className="flex flex-wrap gap-3">
                        <GlowBadge variant="default">Default</GlowBadge>
                        <GlowBadge variant="secondary">Secondary</GlowBadge>
                        <GlowBadge variant="accent">Accent</GlowBadge>
                        <GlowBadge variant="destructive">Destructive</GlowBadge>
                        <GlowBadge variant="outline">Outline</GlowBadge>
                        <GlowBadge variant="success">Success</GlowBadge>
                        <GlowBadge variant="warning">Warning</GlowBadge>
                        <GlowBadge variant="info">Info</GlowBadge>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-3">With Icons</h3>
                      <div className="flex flex-wrap gap-3">
                        <GlowBadge
                          variant="success"
                          leftIcon={<TrendingUp className="h-3 w-3" />}
                        >
                          Active
                        </GlowBadge>
                        <GlowBadge
                          variant="warning"
                          leftIcon={<Zap className="h-3 w-3" />}
                        >
                          Beta
                        </GlowBadge>
                        <GlowBadge variant="info" glow="medium">
                          12 New
                        </GlowBadge>
                      </div>
                    </div>
                  </GlowCardContent>
                </GlowCard>
              </section>

              {/* Section 5: Tabs */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">Tabs</h2>
                <GlowCard>
                  <GlowCardContent className="pt-6">
                    <GlowTabs tabs={exampleTabs} variant="default" />
                  </GlowCardContent>
                </GlowCard>
              </section>

              {/* Section 6: Modal */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">Modal</h2>
                <GlowCard>
                  <GlowCardContent className="pt-6">
                    <GlowButton onClick={() => setModalOpen(true)} glow="medium">
                      Open Modal
                    </GlowButton>

                    <GlowModal
                      open={modalOpen}
                      onOpenChange={setModalOpen}
                      title="Example Modal"
                      description="This is an example modal dialog with glow effects and smooth animations."
                      size="md"
                      footer={
                        <>
                          <GlowModalClose asChild>
                            <GlowButton variant="outline">Cancel</GlowButton>
                          </GlowModalClose>
                          <GlowButton variant="default" glow="medium">
                            Confirm
                          </GlowButton>
                        </>
                      }
                    >
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          Modal content goes here. You can add forms, images, or
                          any other components.
                        </p>
                      </div>
                    </GlowModal>
                  </GlowCardContent>
                </GlowCard>
              </section>

              {/* Section 7: App Launcher */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">App Launcher</h2>
                <AppLauncher
                  apps={exampleApps}
                  onLaunchApp={(app) => console.log('Launch:', app)}
                  onRequestAccess={(app) => console.log('Request:', app)}
                />
              </section>

              {/* Section 8: Data Table */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">Data Table</h2>
                <DataTable
                  columns={exampleColumns}
                  data={exampleData}
                  rowActions={exampleRowActions}
                  showSearch
                  showExport
                  pageSize={5}
                />
              </section>

              {/* Section 9: Authentication */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">Authentication</h2>
                <LoginForm
                  onSubmit={async (data) => {
                    console.log('Login:', data);
                  }}
                />
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

/**
 * Example Data for Components
 */

// Example Apps
const exampleApps: App[] = [
  {
    id: '1',
    name: 'CapacityIQ',
    description: 'Organizational assessment and capacity building tool',
    icon: BarChart3,
    status: 'active',
    moduleKey: 'operate',
    moduleLabel: 'Operate Systems',
    primaryCategory: 'Capacity Building',
    categories: ['Capacity Building'],
    shortDescription: 'Organizational assessment and capacity building tool',
    isFavorite: true,
    lastUsed: new Date(),
    badge: 'Popular',
    badgeVariant: 'success',
  },
  {
    id: '2',
    name: 'FundingFramer',
    description: 'AI-powered grant writing assistant',
    icon: Wallet,
    status: 'available',
    moduleKey: 'narrate',
    moduleLabel: 'Narrate Impact',
    primaryCategory: 'Fundraising',
    categories: ['Fundraising'],
    shortDescription: 'AI-powered grant writing assistant',
    badge: 'New',
    badgeVariant: 'info',
  },
  {
    id: '3',
    name: 'ImpactTracker',
    description: 'Track and measure program impact and outcomes',
    icon: Activity,
    status: 'active',
    moduleKey: 'operate',
    moduleLabel: 'Operate Systems',
    primaryCategory: 'Impact Measurement',
    categories: ['Impact Measurement'],
    shortDescription: 'Track and measure program impact and outcomes',
    isFavorite: false,
  },
  {
    id: '4',
    name: 'TeamSync',
    description: 'Collaborative team workspace and project management',
    icon: Users,
    status: 'active',
    moduleKey: 'initiate',
    moduleLabel: 'Initiate Action',
    primaryCategory: 'Program Management',
    categories: ['Program Management'],
    shortDescription: 'Collaborative team workspace and project management',
  },
  {
    id: '5',
    name: 'DocuVault',
    description: 'Secure document storage and intelligent search',
    icon: FolderOpen,
    status: 'coming-soon',
    moduleKey: 'operate',
    moduleLabel: 'Operate Systems',
    primaryCategory: 'Program Management',
    categories: ['Program Management'],
    shortDescription: 'Secure document storage and intelligent search',
  },
  {
    id: '6',
    name: 'VolunteerHub',
    description: 'Volunteer management and engagement platform',
    icon: Handshake,
    status: 'restricted',
    moduleKey: 'voice',
    moduleLabel: 'Voice of the Community',
    primaryCategory: 'Capacity Building',
    categories: ['Capacity Building'],
    shortDescription: 'Volunteer management and engagement platform',
  },
];

// Example Table Data
interface ExampleDataRow {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  lastActive: Date;
}

const exampleData: ExampleDataRow[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.org',
    role: 'Admin',
    status: 'active',
    lastActive: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.org',
    role: 'Member',
    status: 'active',
    lastActive: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.org',
    role: 'Member',
    status: 'pending',
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: '4',
    name: 'Alice Williams',
    email: 'alice@example.org',
    role: 'Viewer',
    status: 'inactive',
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
  },
];

const exampleColumns: Column<ExampleDataRow>[] = [
  {
    id: 'name',
    header: 'Name',
    accessor: 'name',
    sortable: true,
  },
  {
    id: 'email',
    header: 'Email',
    accessor: 'email',
    sortable: true,
  },
  {
    id: 'role',
    header: 'Role',
    accessor: 'role',
    sortable: true,
    cell: (value) => (
      <GlowBadge variant="outline" size="sm">
        {value}
      </GlowBadge>
    ),
  },
  {
    id: 'status',
    header: 'Status',
    accessor: 'status',
    sortable: true,
    cell: (value: 'active' | 'inactive' | 'pending') => {
      const variants = {
        active: 'success' as const,
        pending: 'warning' as const,
        inactive: 'outline' as const,
      };
      return (
        <GlowBadge variant={variants[value]} size="sm">
          {value}
        </GlowBadge>
      );
    },
  },
  {
    id: 'lastActive',
    header: 'Last Active',
    accessor: 'lastActive',
    sortable: true,
    cell: (value: Date) => {
      const now = new Date();
      const diff = now.getTime() - value.getTime();
      const mins = Math.floor(diff / 60000);
      const hours = Math.floor(mins / 60);
      const days = Math.floor(hours / 24);

      if (mins < 60) return `${mins}m ago`;
      if (hours < 24) return `${hours}h ago`;
      return `${days}d ago`;
    },
  },
];
