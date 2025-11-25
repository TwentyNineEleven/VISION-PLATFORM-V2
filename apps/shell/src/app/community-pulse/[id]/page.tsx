/**
 * CommunityPulse - Engagement Detail/Editor
 * View and edit engagement strategy by stage
 */

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { communityPulseService } from '@/services/communityPulseService';
import { GlowButton } from '@/components/glow-ui/GlowButton';
import { GlowCard } from '@/components/glow-ui/GlowCard';
import type { Engagement, EngagementMethod } from '@/types/community-pulse';
import { STAGE_NAMES, STAGE_DESCRIPTIONS } from '@/types/community-pulse';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  AlertCircle,
  FileText,
  Users,
  Target,
  Settings,
  Calendar,
  Download,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';

const STAGE_ICONS = [Target, Users, Settings, FileText, FileText, Calendar, Download];

export default function EngagementDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [engagement, setEngagement] = useState<Engagement | null>(null);
  const [methods, setMethods] = useState<EngagementMethod[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [engagementData, methodsData] = await Promise.all([
          communityPulseService.getEngagement(id),
          communityPulseService.getMethods(),
        ]);

        if (!engagementData) {
          setError('Engagement not found');
          return;
        }

        setEngagement(engagementData);
        setMethods(methodsData);
      } catch (err) {
        console.error('Error loading engagement:', err);
        setError('Failed to load engagement');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  const getStageStatus = (stageIndex: number) => {
    if (!engagement) return 'pending';
    if (stageIndex + 1 < engagement.currentStage) return 'completed';
    if (stageIndex + 1 === engagement.currentStage) return 'current';
    return 'pending';
  };

  const getMethodName = (slug: string) => {
    const method = methods.find((m) => m.slug === slug);
    return method?.name || slug;
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-vision-blue-950"></div>
          <p className="text-muted-foreground">Loading strategy...</p>
        </div>
      </div>
    );
  }

  if (error || !engagement) {
    return (
      <div className="max-w-2xl mx-auto">
        <GlowCard className="p-8 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
          <h2 className="mt-4 text-lg font-semibold text-foreground">
            {error || 'Engagement not found'}
          </h2>
          <p className="mt-2 text-muted-foreground">
            The strategy you're looking for doesn't exist or you don't have
            access.
          </p>
          <Link href="/community-pulse">
            <GlowButton variant="default" className="mt-6">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </GlowButton>
          </Link>
        </GlowCard>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/community-pulse"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-semibold text-foreground">
            {engagement.title}
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
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
            <span className="text-sm text-muted-foreground">
              Stage {engagement.currentStage} of 7
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <GlowButton variant="outline">
            <Sparkles className="h-4 w-4" />
            AI Assist
          </GlowButton>
        </div>
      </div>

      {/* Progress Steps */}
      <GlowCard className="p-6">
        <h2 className="text-sm font-medium text-muted-foreground mb-4">
          Strategy Progress
        </h2>
        <div className="grid grid-cols-7 gap-2">
          {STAGE_NAMES.map((name, index) => {
            const status = getStageStatus(index);
            const Icon = STAGE_ICONS[index];
            return (
              <div key={name} className="text-center">
                <div
                  className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full ${
                    status === 'completed'
                      ? 'bg-vision-green-100 text-vision-green-700'
                      : status === 'current'
                      ? 'bg-vision-blue-950 text-white'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {status === 'completed' ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <p
                  className={`mt-2 text-xs ${
                    status === 'current'
                      ? 'font-medium text-foreground'
                      : 'text-muted-foreground'
                  }`}
                >
                  {name}
                </p>
              </div>
            );
          })}
        </div>
      </GlowCard>

      {/* Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stage 1: Learning Goal */}
          <GlowCard>
            <div className="border-b border-border px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-vision-blue-100 text-vision-blue-950">
                    <Target className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">
                      1. Learning Goal
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      What you want to learn
                    </p>
                  </div>
                </div>
                <Link href={`/community-pulse/${id}/stage/1`}>
                  <GlowButton variant="ghost" size="sm">
                    Edit
                  </GlowButton>
                </Link>
              </div>
            </div>
            <div className="px-6 py-4">
              {engagement.learningGoal ? (
                <p className="text-sm text-foreground">
                  {engagement.learningGoal}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No learning goal defined yet
                </p>
              )}
              {engagement.goalType && (
                <span className="mt-2 inline-flex items-center rounded-full bg-vision-purple-50 px-2.5 py-0.5 text-xs font-medium text-vision-purple-700">
                  {engagement.goalType}
                </span>
              )}
            </div>
          </GlowCard>

          {/* Stage 2: Community Context */}
          <GlowCard>
            <div className="border-b border-border px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-vision-green-100 text-vision-green-700">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">
                      2. Community Context
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Who you're engaging
                    </p>
                  </div>
                </div>
                <Link href={`/community-pulse/${id}/stage/2`}>
                  <GlowButton variant="ghost" size="sm">
                    Edit
                  </GlowButton>
                </Link>
              </div>
            </div>
            <div className="px-6 py-4">
              {engagement.targetPopulation ? (
                <div className="space-y-2">
                  <p className="text-sm text-foreground">
                    <span className="font-medium">Target:</span>{' '}
                    {engagement.targetPopulation}
                  </p>
                  {engagement.estimatedParticipants && (
                    <p className="text-sm text-foreground">
                      <span className="font-medium">Est. Participants:</span>{' '}
                      {engagement.estimatedParticipants}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Community context not defined yet
                </p>
              )}
            </div>
          </GlowCard>

          {/* Stage 3: Method Selection */}
          <GlowCard>
            <div className="border-b border-border px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-vision-orange-100 text-vision-orange-700">
                    <Settings className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">
                      3. Engagement Method
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      How you'll engage
                    </p>
                  </div>
                </div>
                <Link href={`/community-pulse/${id}/stage/3`}>
                  <GlowButton variant="ghost" size="sm">
                    Edit
                  </GlowButton>
                </Link>
              </div>
            </div>
            <div className="px-6 py-4">
              {engagement.primaryMethod ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">
                    {getMethodName(engagement.primaryMethod)}
                  </p>
                  {engagement.methodRationale && (
                    <p className="text-sm text-muted-foreground">
                      {engagement.methodRationale}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No method selected yet
                </p>
              )}
            </div>
          </GlowCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Continue Button */}
          <GlowCard className="p-6">
            <h3 className="font-medium text-foreground mb-2">Continue Editing</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {STAGE_DESCRIPTIONS[engagement.currentStage - 1]}
            </p>
            <Link href={`/community-pulse/${id}/stage/${engagement.currentStage}`}>
              <GlowButton variant="default" glow="medium" className="w-full">
                Continue to Stage {engagement.currentStage}
                <ArrowRight className="h-4 w-4" />
              </GlowButton>
            </Link>
          </GlowCard>

          {/* Quick Stats */}
          <GlowCard className="p-6">
            <h3 className="font-medium text-foreground mb-4">Strategy Info</h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Created</dt>
                <dd className="text-foreground">
                  {new Date(engagement.createdAt).toLocaleDateString()}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Last Updated</dt>
                <dd className="text-foreground">
                  {new Date(engagement.updatedAt).toLocaleDateString()}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Progress</dt>
                <dd className="text-foreground">
                  {Math.round(((engagement.currentStage - 1) / 7) * 100)}%
                </dd>
              </div>
              {engagement.budgetEstimate && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Budget Est.</dt>
                  <dd className="text-foreground">
                    ${engagement.budgetEstimate.toLocaleString()}
                  </dd>
                </div>
              )}
            </dl>
          </GlowCard>

          {/* Actions */}
          <GlowCard className="p-6">
            <h3 className="font-medium text-foreground mb-4">Actions</h3>
            <div className="space-y-2">
              <GlowButton variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4" />
                Preview Strategy
              </GlowButton>
              <GlowButton variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4" />
                Export Materials
              </GlowButton>
            </div>
          </GlowCard>
        </div>
      </div>
    </div>
  );
}
