'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Stack,
  Grid,
  Group,
  Title,
  Text,
  GlowBadge,
  GlowButton,
  GlowCard,
  GlowCardContent,
  GlowCardDescription,
  GlowCardHeader,
  GlowCardTitle,
} from '@/components/glow-ui';
import { Building2, LayoutGrid, Users, AlertTriangle, ArrowUpRight } from 'lucide-react';
import {
  mockAdminActivity,
  mockAdminQuickActions,
  mockAdminStats,
  mockAdminOrganizations,
} from '@/lib/mock-admin';
import { getCurrentUser } from '@/lib/session';
import { isFunderAdmin } from '@/lib/auth';
import { formatDistanceToNow } from 'date-fns';

export default function AdminOverviewPage() {
  const currentUser = getCurrentUser();
  const [stats, setStats] = React.useState(mockAdminStats);
  const [activity, setActivity] = React.useState(mockAdminActivity);

  const statCards = [
    {
      id: 'organizations',
      label: 'Organizations',
      value: stats.totalOrganizations,
      helper: `${stats.activeOrganizations} active workspaces`,
      icon: Building2,
    },
    {
      id: 'users',
      label: 'Users',
      value: stats.totalUsers,
      helper: `${stats.pendingInvites} pending invites`,
      icon: Users,
    },
    {
      id: 'apps',
      label: 'Active apps',
      value: stats.activeApps,
      helper: `${stats.assignedApps} assigned to orgs`,
      icon: LayoutGrid,
    },
    {
      id: 'billing',
      label: 'Billing alerts',
      value: stats.overdueInvoices,
      helper: 'Overdue invoices',
      icon: AlertTriangle,
    },
  ];

  const quickActions = React.useMemo(
    () =>
      mockAdminQuickActions.filter((action) => {
        if (!action.roles) return true;
        return action.roles.some((role) => role === currentUser.roleKey);
      }),
    [currentUser.roleKey]
  );

  const handleQuickAction = (actionId: string) => {
    const action = mockAdminQuickActions.find((item) => item.id === actionId);
    if (!action) return;

    setActivity((prev) => [
      {
        id: `qa-${Date.now()}`,
        type: 'app',
        title: `${action.label} queued`,
        description: 'Mock action recorded for visibility.',
        timestamp: new Date(),
        actor: currentUser.name,
        entity: action.label,
        icon: action.icon,
      },
      ...prev,
    ]);

    setStats((prev) => {
      switch (actionId) {
        case 'create-org':
          return {
            ...prev,
            totalOrganizations: prev.totalOrganizations + 1,
            activeOrganizations: prev.activeOrganizations + 1,
          };
        case 'invite-user':
          return {
            ...prev,
            totalUsers: prev.totalUsers + 1,
            pendingInvites: prev.pendingInvites + 1,
          };
        case 'assign-apps':
          return {
            ...prev,
            assignedApps: prev.assignedApps + 2,
          };
        case 'billing-alerts':
          return {
            ...prev,
            overdueInvoices: Math.max(prev.overdueInvoices - 1, 0),
          };
        default:
          return prev;
      }
    });
  };

  const atRiskOrgs = mockAdminOrganizations.filter((org) => org.riskLevel !== 'low').slice(0, 3);
  const showCohortAction = isFunderAdmin(currentUser.roleKey);

  return (
    <Stack spacing="xl">
      <Stack spacing="sm">
        <GlowBadge variant="info" size="sm">
          Admin Portal
        </GlowBadge>
        <Stack spacing="xs">
          <Title level={1}>Good to see you, {currentUser.name}</Title>
          <Text size="sm" color="secondary">
            Monitor organizations, people, apps, and billing from a single control plane.
          </Text>
        </Stack>
      </Stack>

      <Grid columns={4} gap="md">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <GlowCard key={card.id} variant="interactive">
              <Stack spacing="sm">
                <Group spacing="sm" align="center">
                  <Icon className="h-4 w-4" />
                  <Text size="sm" color="secondary">{card.label}</Text>
                </Group>
                <Text size="xl" weight="semibold" className="text-3xl">{card.value}</Text>
                <Text size="xs" color="tertiary">{card.helper}</Text>
              </Stack>
            </GlowCard>
          );
        })}
      </Grid>

      <div className="grid gap-6 lg:grid-cols-5">
        <GlowCard className="lg:col-span-3" variant="elevated">
          <GlowCardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <GlowCardTitle>Recent admin activity</GlowCardTitle>
              <GlowCardDescription>Latest changes across workspaces.</GlowCardDescription>
            </div>
            <GlowButton variant="ghost" asChild>
              <Link href="/admin/organizations" className="flex items-center gap-1 text-sm">
                View all <ArrowUpRight className="h-4 w-4" />
              </Link>
            </GlowButton>
          </GlowCardHeader>
          <GlowCardContent className="space-y-3">
            {activity.slice(0, 6).map((item) => {
              const Icon = item.icon || Building2;
              return (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center gap-3 rounded-lg border border-border px-3 py-3 shadow-ambient-card"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                  </div>
                </div>
              );
            })}
          </GlowCardContent>
        </GlowCard>

        <GlowCard className="lg:col-span-2" variant="flat">
          <GlowCardHeader>
            <GlowCardTitle>Quick actions</GlowCardTitle>
            <GlowCardDescription>Common admin flows you can trigger in seconds.</GlowCardDescription>
          </GlowCardHeader>
          <GlowCardContent className="space-y-3">
            {quickActions.map((action) => (
              <div
                key={action.id}
                className="rounded-lg border border-border p-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{action.label}</p>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </div>
                  <GlowButton
                    size="sm"
                    variant="outline"
                    onClick={() => handleQuickAction(action.id)}
                  >
                    {action.ctaLabel}
                  </GlowButton>
                </div>
              </div>
            ))}
            {!quickActions.length && (
              <p className="text-sm text-muted-foreground">
                No quick actions available for your role.
              </p>
            )}
          </GlowCardContent>
        </GlowCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <GlowCard variant="interactive">
          <GlowCardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <GlowCardTitle>Organizations needing attention</GlowCardTitle>
              <GlowCardDescription>Accounts with risk indicators or reduced activity.</GlowCardDescription>
            </div>
            <GlowBadge variant="warning" size="sm">
              {atRiskOrgs.length} flagged
            </GlowBadge>
          </GlowCardHeader>
          <GlowCardContent className="space-y-3">
            {atRiskOrgs.map((org) => (
              <div
                key={org.id}
                className="flex flex-wrap items-center gap-3 rounded-lg border border-border px-3 py-2"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">{org.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {org.plan} • {org.region}
                  </p>
                </div>
                <GlowBadge
                  variant={org.riskLevel === 'high' ? 'warning' : 'info'}
                  size="sm"
                >
                  {org.riskLevel}
                </GlowBadge>
              </div>
            ))}
            {!atRiskOrgs.length && (
              <p className="text-sm text-muted-foreground">All organizations are healthy 🎉</p>
            )}
          </GlowCardContent>
        </GlowCard>

        {showCohortAction && (
          <GlowCard variant="interactive">
            <GlowCardHeader>
              <GlowCardTitle>Cohort spotlight</GlowCardTitle>
              <GlowCardDescription>Track funder-only group performance.</GlowCardDescription>
            </GlowCardHeader>
            <GlowCardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                The <span className="font-semibold text-foreground">Community Builders</span> cohort
                has 18 active grantees and 3 overdue milestones.
              </p>
              <GlowButton asChild glow="subtle">
                <Link href="/admin/cohorts">Manage cohorts</Link>
              </GlowButton>
            </GlowCardContent>
          </GlowCard>
        )}
      </div>
    </Stack>
  );
}

