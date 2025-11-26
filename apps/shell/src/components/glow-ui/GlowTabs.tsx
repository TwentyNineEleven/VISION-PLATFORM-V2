'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';
import { GlowBadge } from './GlowBadge';

/**
 * Tab Item Interface
 */
export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ElementType;
  badge?: string | number;
  badgeVariant?: 'default' | 'success' | 'warning' | 'info';
  disabled?: boolean;
}

/**
 * Glow Tabs Props
 */
export interface GlowTabsProps {
  tabs: TabItem[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

/**
 * Glow Tabs Component
 * Beautiful tabbed interface with glow effects
 */
export function GlowTabs({
  tabs,
  defaultValue,
  value,
  onValueChange,
  variant = 'default',
  orientation = 'horizontal',
  className,
}: GlowTabsProps) {
  return (
    <TabsPrimitive.Root
      defaultValue={defaultValue || tabs[0]?.id}
      value={value}
      onValueChange={onValueChange}
      orientation={orientation}
      className={cn('w-full', className)}
    >
      <TabsPrimitive.List
        className={cn(
          'flex',
          orientation === 'horizontal'
            ? 'border-b border-border'
            : 'flex-col border-r border-border w-48',
          variant === 'pills' && 'border-none gap-2',
          variant === 'underline' && 'gap-6'
        )}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <TabsPrimitive.Trigger
              key={tab.id}
              value={tab.id}
              disabled={tab.disabled}
              className={cn(
                'inline-flex items-center justify-center gap-2 whitespace-nowrap px-4 py-2.5 text-sm font-medium transition-all',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                'disabled:pointer-events-none disabled:opacity-50',
                'data-[state=active]:text-foreground',
                'data-[state=inactive]:text-muted-foreground hover:text-foreground',

                // Default variant
                variant === 'default' &&
                  cn(
                    'border-b-2 border-transparent',
                    'data-[state=active]:border-primary data-[state=active]:shadow-glow-primary-sm'
                  ),

                // Pills variant
                variant === 'pills' &&
                  cn(
                    'rounded-md',
                    'data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow-primary-sm',
                    'data-[state=inactive]:hover:bg-accent'
                  ),

                // Underline variant
                variant === 'underline' &&
                  cn(
                    'border-b-2 border-transparent',
                    'data-[state=active]:border-primary'
                  )
              )}
            >
              {Icon && <Icon className="h-4 w-4" />}
              {tab.label}
              {tab.badge && (
                <GlowBadge
                  variant={tab.badgeVariant || 'default'}
                  size="sm"
                >
                  {tab.badge}
                </GlowBadge>
              )}
            </TabsPrimitive.Trigger>
          );
        })}
      </TabsPrimitive.List>

      {tabs.map((tab) => (
        <TabsPrimitive.Content
          key={tab.id}
          value={tab.id}
          className={cn(
            'mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'animate-fade-in'
          )}
        >
          {tab.content}
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  );
}

/**
 * Example Tabs
 */
export const exampleTabs: TabItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Overview</h3>
        <p className="text-sm text-muted-foreground">
          This is the overview tab content. You can display summary information,
          key metrics, or quick access to important features here.
        </p>
      </div>
    ),
  },
  {
    id: 'analytics',
    label: 'Analytics',
    badge: 'New',
    badgeVariant: 'success',
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Analytics</h3>
        <p className="text-sm text-muted-foreground">
          View detailed analytics, charts, and reports about your organization&apos;s
          performance and impact.
        </p>
      </div>
    ),
  },
  {
    id: 'settings',
    label: 'Settings',
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure your preferences, manage integrations, and customize your
          experience.
        </p>
      </div>
    ),
  },
  {
    id: 'disabled',
    label: 'Disabled',
    disabled: true,
    content: <div>This tab is disabled</div>,
  },
];
