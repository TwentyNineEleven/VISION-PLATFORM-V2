/**
 * PlanCard Component
 * Displays a plan with status, progress, and actions
 */

'use client';

import Link from 'next/link';
import { GlowCard, GlowCardContent, GlowCardHeader, GlowCardTitle } from '@/components/glow-ui/GlowCard';
import { GlowBadge } from '@/components/glow-ui/GlowBadge';
import { GlowButton } from '@/components/glow-ui/GlowButton';
import { MoreVertical, Share2, Trash2, Calendar } from 'lucide-react';
import { useState } from 'react';

interface Plan {
  id: string;
  title: string;
  description?: string;
  status: 'DRAFT' | 'ACTIVE' | 'COMPLETE' | 'ARCHIVED';
  visibility: 'USER_PRIVATE' | 'ORG' | 'SHARED';
  start_date?: string;
  end_date?: string;
  created_at: string;
  projects?: Array<{
    id: string;
    title: string;
    status: string;
    progress_percentage: number;
  }>;
}

interface PlanCardProps {
  plan: Plan;
  progress: number;
  onDelete: () => void;
  onShare: () => void;
}

const STATUS_COLORS = {
  DRAFT: { variant: 'outline' as const, className: 'text-gray-700' },
  ACTIVE: { variant: 'info' as const, className: 'text-blue-700' },
  COMPLETE: { variant: 'success' as const, className: 'text-green-700' },
  ARCHIVED: { variant: 'outline' as const, className: 'text-gray-500' },
};

const VISIBILITY_ICONS = {
  USER_PRIVATE: '🔒',
  ORG: '🏢',
  SHARED: '🌐',
};

export function PlanCard({ plan, progress, onDelete, onShare }: PlanCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const statusConfig = STATUS_COLORS[plan.status];
  const projectCount = plan.projects?.length || 0;
  const visibilityIcon = VISIBILITY_ICONS[plan.visibility];

  function formatDate(dateString?: string): string {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  return (
    <GlowCard variant="interactive" padding="md" className="relative">
      <GlowCardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Link href={`/visionflow/plans/${plan.id}`}>
              <GlowCardTitle className="text-lg hover:text-blue-600 transition-colors">
                {plan.title}
              </GlowCardTitle>
            </Link>
            {plan.description && (
              <p className="mt-1 text-sm text-gray-600 line-clamp-2">{plan.description}</p>
            )}
          </div>
          <div className="relative">
            <GlowButton
              variant="ghost"
              size="icon"
              onClick={() => setShowMenu(!showMenu)}
            >
              <MoreVertical className="h-4 w-4" />
            </GlowButton>
            {showMenu && (
              <div className="absolute right-0 top-10 z-10 w-48 rounded-md border bg-white shadow-lg">
                <div className="py-1">
                  <button
                    onClick={() => {
                      onShare();
                      setShowMenu(false);
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Share2 className="h-4 w-4" />
                    Share Plan
                  </button>
                  <button
                    onClick={() => {
                      onDelete();
                      setShowMenu(false);
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Plan
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </GlowCardHeader>

      <GlowCardContent className="space-y-4">
        {/* Status and Visibility */}
        <div className="flex items-center gap-2">
          <GlowBadge variant={statusConfig.variant} size="sm">
            {plan.status}
          </GlowBadge>
          <span className="text-sm text-gray-500">{visibilityIcon}</span>
          <span className="text-xs text-gray-500">{VISIBILITY_LABELS[plan.visibility]}</span>
        </div>

        {/* Progress Bar */}
        {projectCount > 0 && (
          <div>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium text-gray-900">{progress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Project Count and Dates */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <span>{projectCount} {projectCount === 1 ? 'project' : 'projects'}</span>
          </div>
          {plan.start_date && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(plan.start_date)}</span>
            </div>
          )}
        </div>
      </GlowCardContent>
    </GlowCard>
  );
}

const VISIBILITY_LABELS: Record<string, string> = {
  USER_PRIVATE: 'Private',
  ORG: 'Organization',
  SHARED: 'Shared',
};

