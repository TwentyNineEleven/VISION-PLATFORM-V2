/**
 * VisionFlow Plans Page
 * List all plans with filtering, search, and actions
 * Phase 2A: Plans Management
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { GlowCard, GlowCardContent, GlowCardHeader, GlowCardTitle } from '@/components/glow-ui/GlowCard';
import { GlowButton } from '@/components/glow-ui/GlowButton';
import { GlowInput } from '@/components/glow-ui/GlowInput';
import { GlowSelect } from '@/components/glow-ui/GlowSelect';
import { GlowBadge } from '@/components/glow-ui/GlowBadge';
import { CreatePlanModal } from './components/CreatePlanModal';
import { PlanCard } from './components/PlanCard';
import { PlanShareModal } from './components/PlanShareModal';
import { Search, Plus, Filter } from 'lucide-react';

interface Plan {
  id: string;
  title: string;
  description?: string;
  status: 'DRAFT' | 'ACTIVE' | 'COMPLETE' | 'ARCHIVED';
  visibility: 'USER_PRIVATE' | 'ORG' | 'SHARED';
  start_date?: string;
  end_date?: string;
  created_at: string;
  owner?: {
    id: string;
    name: string;
    email: string;
    avatar_url?: string;
  };
  projects?: Array<{
    id: string;
    title: string;
    status: string;
    progress_percentage: number;
  }>;
}

const STATUS_COLORS = {
  DRAFT: 'bg-gray-100 text-gray-700',
  ACTIVE: 'bg-blue-100 text-blue-700',
  COMPLETE: 'bg-green-100 text-green-700',
  ARCHIVED: 'bg-gray-100 text-gray-500',
};

const VISIBILITY_LABELS = {
  USER_PRIVATE: 'Private',
  ORG: 'Organization',
  SHARED: 'Shared',
};

export default function VisionFlowPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [visibilityFilter, setVisibilityFilter] = useState<string>('all');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  useEffect(() => {
    loadPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, visibilityFilter]);

  async function loadPlans() {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      if (visibilityFilter !== 'all') {
        params.append('visibility', visibilityFilter);
      }

      const response = await fetch(`/api/v1/apps/visionflow/plans?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to load plans');
      }

      const data = await response.json();
      setPlans(data.plans || []);
    } catch (err) {
      console.error('Error loading plans:', err);
      setError('Failed to load plans. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDeletePlan(planId: string) {
    if (!confirm('Are you sure you want to delete this plan? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/v1/apps/visionflow/plans/${planId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete plan');
      }

      // Reload plans
      await loadPlans();
    } catch (err) {
      console.error('Error deleting plan:', err);
      alert('Failed to delete plan. Please try again.');
    }
  }

  function handleSharePlan(plan: Plan) {
    setSelectedPlan(plan);
    setShareModalOpen(true);
  }

  function calculateProgress(plan: Plan): number {
    if (!plan.projects || plan.projects.length === 0) {
      return 0;
    }

    const totalProgress = plan.projects.reduce((sum, project) => sum + (project.progress_percentage || 0), 0);
    return Math.round(totalProgress / plan.projects.length);
  }

  const filteredPlans = plans.filter((plan) => {
    if (searchQuery && !plan.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
          <p className="text-gray-600">Loading plans...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <GlowCard variant="flat" padding="md">
        <div className="rounded-lg bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      </GlowCard>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Plans</h2>
          <p className="mt-1 text-sm text-gray-600">
            {filteredPlans.length} {filteredPlans.length === 1 ? 'plan' : 'plans'}
          </p>
        </div>
        <GlowButton
          onClick={() => setCreateModalOpen(true)}
          variant="default"
          glow="medium"
        >
          <Plus className="h-4 w-4" />
          New Plan
        </GlowButton>
      </div>

      {/* Filters */}
      <GlowCard variant="flat" padding="md">
        <div className="flex flex-wrap gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[300px]">
            <GlowInput
              type="text"
              placeholder="Search plans..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>

          {/* Status Filter */}
          <div className="min-w-[150px]">
            <GlowSelect
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="ACTIVE">Active</option>
              <option value="COMPLETE">Complete</option>
              <option value="ARCHIVED">Archived</option>
            </GlowSelect>
          </div>

          {/* Visibility Filter */}
          <div className="min-w-[150px]">
            <GlowSelect
              value={visibilityFilter}
              onChange={(e) => setVisibilityFilter(e.target.value)}
            >
              <option value="all">All Visibility</option>
              <option value="USER_PRIVATE">Private</option>
              <option value="ORG">Organization</option>
              <option value="SHARED">Shared</option>
            </GlowSelect>
          </div>
        </div>
      </GlowCard>

      {/* Plans Grid */}
      {filteredPlans.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPlans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              progress={calculateProgress(plan)}
              onDelete={() => handleDeletePlan(plan.id)}
              onShare={() => handleSharePlan(plan)}
            />
          ))}
        </div>
      ) : (
        <GlowCard variant="flat" padding="lg">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No plans found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery || statusFilter !== 'all' || visibilityFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Get started by creating your first plan'}
            </p>
            {!searchQuery && statusFilter === 'all' && visibilityFilter === 'all' && (
              <div className="mt-6">
                <GlowButton
                  onClick={() => setCreateModalOpen(true)}
                  variant="default"
                  glow="medium"
                >
                  <Plus className="h-4 w-4" />
                  New Plan
                </GlowButton>
              </div>
            )}
          </div>
        </GlowCard>
      )}

      {/* Modals */}
      <CreatePlanModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSuccess={loadPlans}
      />

      {selectedPlan && (
        <PlanShareModal
          open={shareModalOpen}
          onOpenChange={setShareModalOpen}
          plan={selectedPlan}
          onSuccess={loadPlans}
        />
      )}
    </div>
  );
}

