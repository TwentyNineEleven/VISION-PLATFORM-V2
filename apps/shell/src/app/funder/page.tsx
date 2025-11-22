'use client';

import { useMemo, useState } from 'react';
import { DashboardHeader } from '@/components/funder/DashboardHeader';
import { MetricWidget } from '@/components/funder/MetricWidget';
import { SimpleBarChart } from '@/components/funder/SimpleBarChart';
import {
  Container,
  Stack,
  Grid,
  Group,
  Title,
  Text,
  GlowCard,
  GlowCardHeader,
  GlowCardTitle,
  GlowCardContent,
  GlowCardDescription,
  GlowBadge,
} from '@/components/glow-ui';
import {
  mockApps,
  mockGrantees,
  mockPortfolioHealthData,
  mockFunderActivities,
  mockCohorts,
} from '@/lib/mock-data';
import {
  Users,
  AlertTriangle,
  Target,
  Handshake,
  ArrowUpRight,
  Bell,
  CheckCircle,
  Activity as ActivityIcon,
  MapPin,
  CalendarClock,
} from 'lucide-react';

export default function FunderDashboardPage() {
  const [timeRange, setTimeRange] = useState('30');
  const [cohortFilter, setCohortFilter] = useState<'all' | string>('all');

  const cohortOptions = useMemo(
    () => [{ value: 'all', label: 'All cohorts' }, ...mockCohorts.map((cohort) => ({ value: cohort.id, label: cohort.name }))],
    []
  );

  const filteredGrantees = useMemo(
    () => (cohortFilter === 'all' ? mockGrantees : mockGrantees.filter((grantee) => grantee.cohortId === cohortFilter)),
    [cohortFilter]
  );

  const atRiskGrantees = filteredGrantees.filter((grantee) => grantee.status !== 'on-track' || grantee.riskLevel !== 'low');

  const averageHealth = filteredGrantees.length
    ? Math.round(filteredGrantees.reduce((sum, grantee) => sum + grantee.capacityScore, 0) / filteredGrantees.length)
    : 0;

  const metrics = [
    {
      id: 'active',
      title: 'Active grantees',
      value: filteredGrantees.length,
      icon: <Users className="w-5 h-5 text-primary" />,
      trend: { value: '+3 this month', isPositive: true },
    },
    {
      id: 'health',
      title: 'Portfolio health',
      value: `${averageHealth}%`,
      icon: <Target className="w-5 h-5 text-primary" />,
    },
    {
      id: 'risk',
      title: 'At risk',
      value: atRiskGrantees.length,
      icon: <AlertTriangle className="w-5 h-5 text-orange-500" />,
      trend: {
        value: atRiskGrantees.length === 0 ? 'No issues' : `${atRiskGrantees.length} flagged`,
        isPositive: atRiskGrantees.length === 0,
      },
    },
    {
      id: 'investment',
      title: 'Total investment',
      value: '$24.6M',
      icon: <Handshake className="w-5 h-5 text-primary" />,
      trend: { value: '+6%', isPositive: true },
    },
  ];

  const cohortSummaries = useMemo(
    () =>
      mockCohorts.map((cohort) => {
        const members = mockGrantees.filter((grantee) => grantee.cohortId === cohort.id);
        const avgHealth = members.length
          ? Math.round(members.reduce((sum, grantee) => sum + grantee.capacityScore, 0) / members.length)
          : 0;
        return { ...cohort, members, avgHealth };
      }),
    []
  );

  const chartData = mockPortfolioHealthData.map((point) => point.value);

  const activityIcon = (type: (typeof mockFunderActivities)[number]['type']) => {
    switch (type) {
      case 'risk':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'milestone':
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      default:
        return <Bell className="w-5 h-5 text-primary" />;
    }
  };

  return (
    <Container maxWidth="7xl" className="flex flex-col">
      <DashboardHeader
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        cohortFilter={cohortFilter}
        onCohortChange={setCohortFilter}
        cohortOptions={cohortOptions}
      />

      <div className="px-8 pb-10">
        <Stack spacing="xl">
          <Grid columns={4} gap="md">
            {metrics.map((metric) => (
              <MetricWidget
                key={metric.id}
                title={metric.title}
                value={metric.value}
                icon={metric.icon}
                trend={metric.trend}
              />
            ))}
          </Grid>

          <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
            <GlowCard className="h-full">
              <GlowCardHeader>
                <GlowCardTitle>Portfolio health</GlowCardTitle>
                <GlowCardDescription>Performance across key capacity drivers</GlowCardDescription>
              </GlowCardHeader>
              <GlowCardContent className="space-y-6">
                <SimpleBarChart data={chartData} className="h-24" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {mockPortfolioHealthData.map((point) => (
                    <div key={point.label} className="rounded-lg border border-border p-3">
                      <p className="text-xs text-muted-foreground">{point.label}</p>
                      <p className="text-2xl font-semibold">{point.value}%</p>
                    </div>
                  ))}
                </div>
              </GlowCardContent>
            </GlowCard>

            <GlowCard>
              <GlowCardHeader>
                <GlowCardTitle>At-risk grantees</GlowCardTitle>
                <GlowCardDescription>Needs attention in the last {timeRange} days</GlowCardDescription>
              </GlowCardHeader>
              <GlowCardContent className="space-y-4">
                {atRiskGrantees.length === 0 && (
                  <p className="text-sm text-muted-foreground">No grantees flagged at this time.</p>
                )}
                {atRiskGrantees.map((grantee) => (
                  <div
                    key={grantee.id}
                    className="rounded-lg border border-border p-3 flex items-center justify-between gap-4"
                  >
                    <div>
                      <p className="font-medium">{grantee.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Last check-in {grantee.lastCheckIn.toLocaleDateString()}
                      </p>
                    </div>
                    <GlowBadge
                      variant={
                        grantee.riskLevel === 'high'
                          ? 'destructive'
                          : grantee.riskLevel === 'medium'
                            ? 'warning'
                            : 'secondary'
                      }
                    >
                      {grantee.riskLevel}
                    </GlowBadge>
                  </div>
                ))}
              </GlowCardContent>
            </GlowCard>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.8fr,1fr]">
            <GlowCard>
              <GlowCardHeader>
                <GlowCardTitle>Recent activity</GlowCardTitle>
                <GlowCardDescription>Automatic updates across the portfolio</GlowCardDescription>
              </GlowCardHeader>
              <GlowCardContent className="space-y-4">
                {mockFunderActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 rounded-lg border border-border p-3">
                    <div className="rounded-full bg-muted p-2">{activityIcon(activity.type)}</div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.timestamp.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </GlowCardContent>
            </GlowCard>

            <GlowCard>
              <GlowCardHeader>
                <GlowCardTitle>Key milestones</GlowCardTitle>
                <GlowCardDescription>Upcoming deadlines & reviews</GlowCardDescription>
              </GlowCardHeader>
              <GlowCardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-3 rounded-lg border border-dashed border-border px-3 py-2">
                  <ArrowUpRight className="w-4 h-4 text-primary" />
                  Q2 capacity planning report due Apr 30
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-dashed border-border px-3 py-2">
                  <CalendarClock className="w-4 h-4 text-primary" />
                  Portfolio review scheduled May 12
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-dashed border-border px-3 py-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Site visit window opens May 20
                </div>
              </GlowCardContent>
            </GlowCard>
          </div>

          <Stack spacing="md">
            <Stack spacing="xs">
              <Text size="sm" weight="medium" color="brand">
                Cohorts
              </Text>
              <Title level={3}>Cohort overview</Title>
            </Stack>
            <Grid columns={3} gap="md">
              {cohortSummaries.map((cohort) => (
                <GlowCard key={cohort.id}>
                  <GlowCardHeader>
                    <GlowCardTitle>{cohort.name}</GlowCardTitle>
                    <GlowCardDescription>{cohort.focus}</GlowCardDescription>
                  </GlowCardHeader>
                  <GlowCardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>{cohort.memberCount} members</span>
                      <span className="font-semibold">{cohort.avgHealth}% avg health</span>
                    </div>
                    <div className="flex -space-x-2">
                      {cohort.members.slice(0, 5).map((member) => (
                        <div
                          key={member.id}
                          className="w-8 h-8 rounded-full bg-primary/10 border border-white flex items-center justify-center text-xs font-semibold text-primary"
                        >
                          {member.name.charAt(0)}
                        </div>
                      ))}
                      {cohort.members.length > 5 && (
                        <div className="w-8 h-8 rounded-full bg-muted border border-white flex items-center justify-center text-xs text-muted-foreground">
                          +{cohort.members.length - 5}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Created {cohort.createdAt.toLocaleDateString()}</span>
                      <span>Focus: {cohort.focus}</span>
                    </div>
                    <div className="flex gap-2">
                      <GlowBadge variant="outline">Manage</GlowBadge>
                      <GlowBadge variant="secondary">View</GlowBadge>
                    </div>
                  </GlowCardContent>
                </GlowCard>
              ))}
            </Grid>
          </Stack>
        </Stack>
      </div>
    </Container>
  );
}
