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
  GlowButton,
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
  TrendingUp,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
      icon: <AlertTriangle className="w-5 h-5 text-warning" />,
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
        return <AlertTriangle className="w-5 h-5 text-warning" />;
      case 'milestone':
        return <CheckCircle className="w-5 h-5 text-success" />;
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

      <div className="px-8 py-8">
        <Stack spacing="xl">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric) => (
              <MetricWidget
                key={metric.id}
                title={metric.title}
                value={metric.value}
                icon={metric.icon}
                trend={metric.trend}
              />
            ))}
          </div>

          {/* Portfolio Health Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-1 w-12 rounded-full bg-primary" />
              <h2 className="text-xl font-bold text-foreground">Performance Metrics</h2>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.5fr,1fr]">
              <GlowCard variant="elevated" className="h-full shadow-lg">
                <GlowCardHeader className="pb-4">
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <GlowCardTitle className="text-xl">Portfolio health</GlowCardTitle>
                      <GlowCardDescription className="text-sm mt-1">Performance across key capacity drivers</GlowCardDescription>
                    </div>
                    <div className="flex items-center gap-2 rounded-full bg-success/10 border border-success/20 px-3 py-1.5">
                      <TrendingUp className="h-4 w-4 text-success" />
                      <span className="text-sm font-bold text-success">+5%</span>
                    </div>
                  </div>
                </GlowCardHeader>
                <GlowCardContent className="space-y-6">
                  <div className="bg-gradient-to-br from-muted/50 to-muted/20 rounded-xl p-5 border border-border/50">
                    <SimpleBarChart data={chartData} className="h-40" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {mockPortfolioHealthData.map((point, index) => (
                      <div
                        key={point.label}
                        className="group rounded-xl border-2 border-border bg-gradient-to-br from-background to-muted/20 p-5 hover:border-primary/50 hover:shadow-md transition-all"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                            {point.label}
                          </p>
                          <div className={cn(
                            "h-2.5 w-2.5 rounded-full ring-2 ring-offset-2 ring-offset-background",
                            point.value >= 80 ? "bg-success ring-success/30" :
                            point.value >= 60 ? "bg-warning ring-warning/30" :
                            "bg-destructive ring-destructive/30"
                          )} />
                        </div>
                        <p className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors">{point.value}%</p>
                      </div>
                    ))}
                  </div>
                </GlowCardContent>
              </GlowCard>

              <GlowCard variant="elevated" className="shadow-lg">
                <GlowCardHeader className="pb-4">
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <GlowCardTitle className="text-xl">At-risk grantees</GlowCardTitle>
                      <GlowCardDescription className="text-sm mt-1">Needs attention in the last {timeRange} days</GlowCardDescription>
                    </div>
                    {atRiskGrantees.length > 0 && (
                      <div className="flex items-center gap-2 rounded-full bg-destructive/10 border border-destructive/20 px-3 py-1.5">
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                        <span className="text-sm font-bold text-destructive">{atRiskGrantees.length}</span>
                      </div>
                    )}
                  </div>
                </GlowCardHeader>
                <GlowCardContent className="space-y-3">
                  {atRiskGrantees.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="rounded-full bg-success/10 p-4 mb-4 ring-4 ring-success/20">
                        <CheckCircle className="h-8 w-8 text-success" />
                      </div>
                      <p className="text-base font-bold text-foreground">All grantees on track</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        No attention needed at this time
                      </p>
                    </div>
                  ) : (
                    atRiskGrantees.map((grantee) => (
                      <div
                        key={grantee.id}
                        className="rounded-xl border-2 border-border bg-gradient-to-br from-background to-muted/10 p-4 hover:border-destructive/50 hover:shadow-md transition-all cursor-pointer group"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <p className="font-bold text-foreground truncate">{grantee.name}</p>
                              <GlowBadge
                                variant={
                                  grantee.riskLevel === 'high'
                                    ? 'destructive'
                                    : grantee.riskLevel === 'medium'
                                      ? 'warning'
                                      : 'secondary'
                                }
                                size="sm"
                                className="shrink-0"
                              >
                                {grantee.riskLevel}
                              </GlowBadge>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                              <Clock className="h-3.5 w-3.5" />
                              <span>Last check-in {grantee.lastCheckIn.toLocaleDateString()}</span>
                            </div>
                          </div>
                          <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                        </div>
                      </div>
                    ))
                  )}
                </GlowCardContent>
              </GlowCard>
            </div>
          </div>

          {/* Activity Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-1 w-12 rounded-full bg-primary" />
              <h2 className="text-xl font-bold text-foreground">Activity & Milestones</h2>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.6fr,1fr]">
              <GlowCard variant="elevated" className="shadow-lg">
                <GlowCardHeader className="pb-4">
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <GlowCardTitle className="text-xl">Recent activity</GlowCardTitle>
                      <GlowCardDescription className="text-sm mt-1">Automatic updates across the portfolio</GlowCardDescription>
                    </div>
                    <GlowButton variant="ghost" size="sm" className="font-semibold">
                      View all
                    </GlowButton>
                  </div>
                </GlowCardHeader>
              <GlowCardContent className="space-y-3">
                {mockFunderActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 rounded-lg border border-border bg-background p-4 hover:border-primary/50 hover:bg-muted/30 transition-all cursor-pointer"
                  >
                    <div
                      className={cn(
                        "rounded-full p-2.5 shrink-0",
                        activity.type === 'risk' && "bg-warning/10 border border-warning/20",
                        activity.type === 'milestone' && "bg-success/10 border border-success/20",
                        activity.type === 'update' && "bg-primary/10 border border-primary/20"
                      )}
                    >
                      {activityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground mb-1">{activity.title}</p>
                      <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">
                          {activity.timestamp.toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </GlowCardContent>
            </GlowCard>

              <GlowCard variant="elevated" className="shadow-lg">
                <GlowCardHeader className="pb-4">
                  <GlowCardTitle className="text-xl">Key milestones</GlowCardTitle>
                  <GlowCardDescription className="text-sm mt-1">Upcoming deadlines & reviews</GlowCardDescription>
                </GlowCardHeader>
              <GlowCardContent className="space-y-3">
                <div className="flex items-start gap-3 rounded-lg bg-primary/5 border border-primary/20 p-4 hover:bg-primary/10 transition-colors cursor-pointer group">
                  <div className="rounded-full bg-primary/10 p-2 shrink-0">
                    <ArrowUpRight className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground mb-1">Q2 capacity planning report</p>
                    <p className="text-xs text-muted-foreground">Due Apr 30</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg bg-primary/5 border border-primary/20 p-4 hover:bg-primary/10 transition-colors cursor-pointer group">
                  <div className="rounded-full bg-primary/10 p-2 shrink-0">
                    <CalendarClock className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground mb-1">Portfolio review scheduled</p>
                    <p className="text-xs text-muted-foreground">May 12</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg bg-primary/5 border border-primary/20 p-4 hover:bg-primary/10 transition-colors cursor-pointer group">
                  <div className="rounded-full bg-primary/10 p-2 shrink-0">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground mb-1">Site visit window opens</p>
                    <p className="text-xs text-muted-foreground">May 20</p>
                  </div>
                </div>
              </GlowCardContent>
              </GlowCard>
            </div>
          </div>

          {/* Cohorts Section */}
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-1 w-12 rounded-full bg-primary" />
                <h2 className="text-xl font-bold text-foreground">Cohort overview</h2>
              </div>
              <GlowButton variant="outline" size="default" className="font-semibold">
                Manage cohorts
              </GlowButton>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {cohortSummaries.map((cohort) => (
                <GlowCard key={cohort.id} variant="elevated" className="hover:border-primary/50 hover:shadow-lg transition-all group">
                  <GlowCardHeader className="pb-4">
                    <div className="flex items-start justify-between w-full mb-3">
                      <div className="flex-1">
                        <GlowCardTitle className="text-xl group-hover:text-primary transition-colors">{cohort.name}</GlowCardTitle>
                        <GlowCardDescription className="mt-1.5 text-sm">{cohort.focus}</GlowCardDescription>
                      </div>
                      <div className={cn(
                        "rounded-full px-4 py-1.5 text-sm font-bold ring-2 ring-offset-2 ring-offset-background",
                        cohort.avgHealth >= 80 ? "bg-success/10 text-success ring-success/30" :
                        cohort.avgHealth >= 60 ? "bg-warning/10 text-warning ring-warning/30" :
                        "bg-destructive/10 text-destructive ring-destructive/30"
                      )}>
                        {cohort.avgHealth}%
                      </div>
                    </div>
                  </GlowCardHeader>
                  <GlowCardContent className="space-y-5">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-br from-muted/50 to-muted/20 rounded-xl border border-border/50">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 rounded-lg p-2">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <span className="text-lg font-bold text-foreground">{cohort.memberCount}</span>
                          <p className="text-xs font-medium text-muted-foreground">members</p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">avg health</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-3">
                        {cohort.members.slice(0, 5).map((member) => (
                          <div
                            key={member.id}
                            className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border-3 border-background flex items-center justify-center text-sm font-bold text-primary shadow-md ring-1 ring-primary/20"
                            title={member.name}
                          >
                            {member.name.charAt(0)}
                          </div>
                        ))}
                      </div>
                      {cohort.members.length > 5 && (
                        <span className="text-sm font-bold text-muted-foreground">
                          +{cohort.members.length - 5}
                        </span>
                      )}
                    </div>
                    <div className="pt-4 border-t border-border space-y-3">
                      <div className="flex items-center text-xs font-medium text-muted-foreground">
                        <CalendarClock className="h-3.5 w-3.5 mr-2" />
                        Created {cohort.createdAt.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </div>
                      <div className="flex gap-2">
                        <GlowButton variant="outline" size="sm" className="flex-1 font-semibold">
                          Manage
                        </GlowButton>
                        <GlowButton variant="ghost" size="sm" className="flex-1 font-semibold">
                          View details
                        </GlowButton>
                      </div>
                    </div>
                  </GlowCardContent>
                </GlowCard>
              ))}
            </div>
          </div>
        </Stack>
      </div>
    </Container>
  );
}
