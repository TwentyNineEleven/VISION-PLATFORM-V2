/**
 * CommunityPulse Dashboard
 * Main dashboard showing engagement strategies and quick actions
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useOrganization } from '@/contexts/OrganizationContext';
import { communityPulseService } from '@/services/communityPulseService';
import { GlowButton } from '@/components/glow-ui/GlowButton';
import { GlowCard } from '@/components/glow-ui/GlowCard';
import type { Engagement, EngagementMethod } from '@/types/community-pulse';
import { STAGE_NAMES } from '@/types/community-pulse';
import {
  Plus,
  FileText,
  Users,
  Calendar,
  ArrowRight,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { DashboardSkeleton } from './components/EngagementCardSkeleton';

export default function CommunityPulseDashboard() {
  const { activeOrganization } = useOrganization();
  const [loading, setLoading] = useState(true);
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [methods, setMethods] = useState<EngagementMethod[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!activeOrganization?.id) {
        setLoading(false);
        return;
      }

      try {
        const [engagementsData, methodsData] = await Promise.all([
          communityPulseService.getEngagements(activeOrganization.id),
          communityPulseService.getMethods(),
        ]);
        setEngagements(engagementsData);
        setMethods(methodsData);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [activeOrganization?.id]);

  const inProgressCount = engagements.filter(
    (e) => e.status === 'in_progress' || e.status === 'draft'
  ).length;
  const completedCount = engagements.filter(
    (e) => e.status === 'completed' || e.status === 'exported'
  ).length;

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <p className="ml-3 text-sm text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <GlowCard className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-vision-blue-50 p-3">
              <FileText className="h-6 w-6 text-vision-blue-950" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Strategies
              </p>
              <p className="text-2xl font-semibold text-foreground">
                {engagements.length}
              </p>
            </div>
          </div>
        </GlowCard>

        <GlowCard className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-vision-orange-50 p-3">
              <Clock className="h-6 w-6 text-vision-orange-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                In Progress
              </p>
              <p className="text-2xl font-semibold text-vision-orange-700">
                {inProgressCount}
              </p>
            </div>
          </div>
        </GlowCard>

        <GlowCard className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-vision-green-50 p-3">
              <CheckCircle2 className="h-6 w-6 text-vision-green-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Completed
              </p>
              <p className="text-2xl font-semibold text-vision-green-700">
                {completedCount}
              </p>
            </div>
          </div>
        </GlowCard>

        <GlowCard className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-vision-purple-50 p-3">
              <Users className="h-6 w-6 text-vision-purple-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Methods Available
              </p>
              <p className="text-2xl font-semibold text-vision-purple-700">
                {methods.length}
              </p>
            </div>
          </div>
        </GlowCard>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Strategies List */}
        <div className="lg:col-span-2">
          <GlowCard>
            <div className="border-b border-border px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    My Strategies
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Your community engagement strategies
                  </p>
                </div>
                <Link href="/community-pulse/new">
                  <GlowButton variant="outline" size="sm">
                    <Plus className="h-4 w-4" />
                    New
                  </GlowButton>
                </Link>
              </div>
            </div>

            <div className="divide-y divide-border">
              {engagements.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-sm font-semibold text-foreground">
                    No strategies yet
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Get started by creating your first engagement strategy
                  </p>
                  <div className="mt-6">
                    <Link href="/community-pulse/new">
                      <GlowButton variant="default" glow="medium">
                        <Plus className="h-4 w-4" />
                        Create Your First Strategy
                      </GlowButton>
                    </Link>
                  </div>
                </div>
              ) : (
                engagements.slice(0, 5).map((engagement) => (
                  <Link
                    key={engagement.id}
                    href={`/community-pulse/${engagement.id}`}
                    className="flex items-center justify-between px-6 py-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {engagement.title}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-muted-foreground">
                          Stage {engagement.currentStage}:{' '}
                          {STAGE_NAMES[engagement.currentStage - 1]}
                        </span>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            engagement.status === 'completed' ||
                            engagement.status === 'exported'
                              ? 'bg-vision-green-50 text-vision-green-700'
                              : engagement.status === 'in_progress'
                              ? 'bg-vision-blue-50 text-vision-blue-950'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {engagement.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                ))
              )}
            </div>

            {engagements.length > 5 && (
              <div className="border-t border-border px-6 py-3">
                <Link
                  href="/community-pulse/all"
                  className="text-sm text-primary hover:underline"
                >
                  View all {engagements.length} strategies
                </Link>
              </div>
            )}
          </GlowCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* AI Assistant Card */}
          <GlowCard className="bg-gradient-to-br from-vision-purple-50 to-vision-blue-50">
            <div className="p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-vision-purple-100 p-2">
                  <Sparkles className="h-5 w-5 text-vision-purple-700" />
                </div>
                <h3 className="font-semibold text-foreground">AI Assistant</h3>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Get AI-powered recommendations for engagement methods, question
                protocols, and facilitator guides.
              </p>
              <Link href="/community-pulse/new">
                <GlowButton
                  variant="default"
                  className="mt-4 w-full bg-vision-purple-700 hover:bg-vision-purple-900"
                >
                  Start AI-Guided Strategy
                </GlowButton>
              </Link>
            </div>
          </GlowCard>

          {/* Quick Links */}
          <GlowCard>
            <div className="p-6">
              <h3 className="font-semibold text-foreground">Quick Links</h3>
              <div className="mt-4 space-y-2">
                <Link
                  href="/community-pulse/methods"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted transition-colors"
                >
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>Browse 15 Engagement Methods</span>
                </Link>
                <Link
                  href="/community-pulse/templates"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted transition-colors"
                >
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>Strategy Templates</span>
                </Link>
                <Link
                  href="/community-pulse/new"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted transition-colors"
                >
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Plan New Engagement</span>
                </Link>
              </div>
            </div>
          </GlowCard>

          {/* Getting Started */}
          <GlowCard className="border-vision-blue-200 bg-vision-blue-50/50">
            <div className="p-6">
              <h3 className="font-semibold text-foreground">Getting Started</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                CommunityPulse guides you through designing intentional,
                equity-centered engagement strategies in 7 stages.
              </p>
              <ol className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="font-medium text-vision-blue-950">1.</span>
                  Define your learning goals
                </li>
                <li className="flex gap-2">
                  <span className="font-medium text-vision-blue-950">2.</span>
                  Understand your community
                </li>
                <li className="flex gap-2">
                  <span className="font-medium text-vision-blue-950">3.</span>
                  Select engagement methods
                </li>
                <li className="flex gap-2">
                  <span className="font-medium text-vision-blue-950">4.</span>
                  Design your strategy
                </li>
              </ol>
            </div>
          </GlowCard>
        </div>
      </div>
    </div>
  );
}
