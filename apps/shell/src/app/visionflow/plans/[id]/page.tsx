/**
 * VisionFlow Plan Detail Page
 * View and edit plan details, projects, and shares
 * Phase 2A: Plans Management
 */

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { GlowCard, GlowCardContent, GlowCardHeader, GlowCardTitle } from '@/components/glow-ui/GlowCard';
import { GlowButton } from '@/components/glow-ui/GlowButton';
import { GlowBadge } from '@/components/glow-ui/GlowBadge';
import { GlowInput } from '@/components/glow-ui/GlowInput';
import { GlowTextarea } from '@/components/glow-ui/GlowTextarea';
import { GlowSelect } from '@/components/glow-ui/GlowSelect';
import { PlanShareModal } from '../components/PlanShareModal';
import { ArrowLeft, Edit, Share2, Calendar, FolderKanban } from 'lucide-react';

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
    start_date?: string;
    due_date?: string;
  }>;
  shares?: Array<{
    id: string;
    access_level: string;
    shared_with_user?: {
      id: string;
      name: string;
      email: string;
    };
    shared_with_org?: {
      id: string;
      name: string;
    };
  }>;
}

const STATUS_COLORS = {
  DRAFT: { variant: 'outline' as const },
  ACTIVE: { variant: 'info' as const },
  COMPLETE: { variant: 'success' as const },
  ARCHIVED: { variant: 'outline' as const },
};

export default function VisionFlowPlanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const planId = params.id as string;

  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    status: 'DRAFT' as const,
    visibility: 'ORG' as const,
    start_date: '',
    end_date: '',
  });

  useEffect(() => {
    if (planId) {
      loadPlan();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planId]);

  async function loadPlan() {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/v1/apps/visionflow/plans/${planId}`);

      if (!response.ok) {
        if (response.status === 404) {
          setError('Plan not found');
        } else {
          throw new Error('Failed to load plan');
        }
        return;
      }

      const data = await response.json();
      const planData = data.plan;

      setPlan(planData);
      setEditForm({
        title: planData.title,
        description: planData.description || '',
        status: planData.status,
        visibility: planData.visibility,
        start_date: planData.start_date || '',
        end_date: planData.end_date || '',
      });
    } catch (err) {
      console.error('Error loading plan:', err);
      setError('Failed to load plan. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const response = await fetch(`/api/v1/apps/visionflow/plans/${planId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) {
        throw new Error('Failed to update plan');
      }

      setEditing(false);
      await loadPlan();
    } catch (err) {
      console.error('Error updating plan:', err);
      alert('Failed to update plan. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  function calculateProgress(): number {
    if (!plan?.projects || plan.projects.length === 0) {
      return 0;
    }

    const totalProgress = plan.projects.reduce(
      (sum, project) => sum + (project.progress_percentage || 0),
      0
    );
    return Math.round(totalProgress / plan.projects.length);
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
          <p className="text-gray-600">Loading plan...</p>
        </div>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="space-y-4">
        <GlowButton variant="outline" onClick={() => router.push('/visionflow/plans')}>
          <ArrowLeft className="h-4 w-4" />
          Back to Plans
        </GlowButton>
        <GlowCard variant="flat" padding="md">
          <div className="rounded-lg bg-red-50 p-4">
            <p className="text-sm text-red-800">{error || 'Plan not found'}</p>
          </div>
        </GlowCard>
      </div>
    );
  }

  const progress = calculateProgress();
  const statusConfig = STATUS_COLORS[plan.status];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <GlowButton variant="outline" onClick={() => router.push('/visionflow/plans')}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </GlowButton>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              {editing ? 'Edit Plan' : plan.title}
            </h2>
            {plan.owner && (
              <p className="mt-1 text-sm text-gray-600">
                Created by {plan.owner.name}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!editing && (
            <>
              <GlowButton
                variant="outline"
                onClick={() => setShareModalOpen(true)}
              >
                <Share2 className="h-4 w-4" />
                Share
              </GlowButton>
              <GlowButton
                variant="default"
                onClick={() => setEditing(true)}
              >
                <Edit className="h-4 w-4" />
                Edit
              </GlowButton>
            </>
          )}
          {editing && (
            <>
              <GlowButton
                variant="outline"
                onClick={() => {
                  setEditing(false);
                  loadPlan(); // Reset form
                }}
              >
                Cancel
              </GlowButton>
              <GlowButton
                variant="default"
                glow="medium"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </GlowButton>
            </>
          )}
        </div>
      </div>

      {/* Plan Details */}
      <GlowCard variant="default" padding="lg">
        <GlowCardHeader>
          <div className="flex items-center justify-between">
            <GlowCardTitle>Plan Details</GlowCardTitle>
            <GlowBadge variant={statusConfig.variant} size="sm">
              {plan.status}
            </GlowBadge>
          </div>
        </GlowCardHeader>
        <GlowCardContent className="space-y-4">
          {editing ? (
            <>
              <GlowInput
                label="Title"
                value={editForm.title}
                onChange={(e) =>
                  setEditForm({ ...editForm, title: e.target.value })
                }
                variant="glow"
              />
              <GlowTextarea
                label="Description"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                rows={4}
                variant="glow"
              />
              <div className="grid grid-cols-2 gap-4">
                <GlowSelect
                  label="Status"
                  value={editForm.status}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      status: e.target.value as typeof editForm.status,
                    })
                  }
                >
                  <option value="DRAFT">Draft</option>
                  <option value="ACTIVE">Active</option>
                  <option value="COMPLETE">Complete</option>
                  <option value="ARCHIVED">Archived</option>
                </GlowSelect>
                <GlowSelect
                  label="Visibility"
                  value={editForm.visibility}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      visibility: e.target.value as typeof editForm.visibility,
                    })
                  }
                >
                  <option value="USER_PRIVATE">Private</option>
                  <option value="ORG">Organization</option>
                  <option value="SHARED">Shared</option>
                </GlowSelect>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <GlowInput
                  label="Start Date"
                  type="date"
                  value={editForm.start_date}
                  onChange={(e) =>
                    setEditForm({ ...editForm, start_date: e.target.value })
                  }
                  variant="glow"
                />
                <GlowInput
                  label="End Date"
                  type="date"
                  value={editForm.end_date}
                  onChange={(e) =>
                    setEditForm({ ...editForm, end_date: e.target.value })
                  }
                  variant="glow"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <h3 className="text-sm font-medium text-gray-700">Description</h3>
                <p className="mt-1 text-sm text-gray-600">
                  {plan.description || 'No description provided'}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {plan.start_date && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Start Date</h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {new Date(plan.start_date).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {plan.end_date && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">End Date</h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {new Date(plan.end_date).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </GlowCardContent>
      </GlowCard>

      {/* Progress */}
      {plan.projects && plan.projects.length > 0 && (
        <GlowCard variant="default" padding="lg">
          <GlowCardHeader>
            <GlowCardTitle>Overall Progress</GlowCardTitle>
          </GlowCardHeader>
          <GlowCardContent>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-gray-600">
                {plan.projects.length} {plan.projects.length === 1 ? 'project' : 'projects'}
              </span>
              <span className="font-medium text-gray-900">{progress}%</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </GlowCardContent>
        </GlowCard>
      )}

      {/* Projects */}
      <GlowCard variant="default" padding="lg">
        <GlowCardHeader>
          <div className="flex items-center justify-between">
            <GlowCardTitle>Projects</GlowCardTitle>
            <Link href={`/visionflow/projects?plan=${planId}`}>
              <GlowButton variant="outline" size="sm">
                <FolderKanban className="h-4 w-4" />
                View All Projects
              </GlowButton>
            </Link>
          </div>
        </GlowCardHeader>
        <GlowCardContent>
          {plan.projects && plan.projects.length > 0 ? (
            <div className="space-y-2">
              {plan.projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/visionflow/projects/${project.id}` as any}
                  className="block rounded-lg border p-4 transition-colors hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{project.title}</h4>
                      <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                        {project.progress_percentage}% complete
                      </div>
                    </div>
                    <GlowBadge variant="outline" size="sm">
                      {project.status}
                    </GlowBadge>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500">No projects yet</p>
              <Link href={`/visionflow/projects?plan=${planId}`}>
                <GlowButton variant="outline" size="sm" className="mt-4">
                  Create Project
                </GlowButton>
              </Link>
            </div>
          )}
        </GlowCardContent>
      </GlowCard>

      {/* Share Modal */}
      {plan && (
        <PlanShareModal
          open={shareModalOpen}
          onOpenChange={setShareModalOpen}
          plan={plan}
          onSuccess={loadPlan}
        />
      )}
    </div>
  );
}

