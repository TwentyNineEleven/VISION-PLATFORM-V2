/**
 * WorkflowPreviewModal Component
 * Preview workflow steps and apply to project
 */

'use client';

import { useState, useEffect } from 'react';
import { GlowModal, GlowModalClose } from '@/components/glow-ui/GlowModal';
import { GlowButton } from '@/components/glow-ui/GlowButton';
import { GlowSelect } from '@/components/glow-ui/GlowSelect';
import { GlowBadge } from '@/components/glow-ui/GlowBadge';
import { Play, Calendar, User } from 'lucide-react';

interface WorkflowStep {
  id: string;
  title: string;
  description?: string;
  sort_order: number;
  duration_days: number;
  assignee_role: string;
}

interface Workflow {
  id: string;
  name: string;
  description?: string;
  estimated_days: number;
  steps?: WorkflowStep[];
}

interface WorkflowPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workflow: Workflow;
}

export function WorkflowPreviewModal({
  open,
  onOpenChange,
  workflow,
}: WorkflowPreviewModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<Array<{ id: string; title: string }>>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  useEffect(() => {
    if (open) {
      loadProjects();
    }
  }, [open]);

  async function loadProjects() {
    try {
      const response = await fetch('/api/v1/apps/visionflow/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
      }
    } catch (err) {
      console.error('Error loading projects:', err);
    }
  }

  async function handleApply() {
    if (!selectedProjectId) {
      setError('Please select a project');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/v1/apps/visionflow/workflows/${workflow.id}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project_id: selectedProjectId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to apply workflow');
      }

      const data = await response.json();
      alert(data.message || 'Workflow applied successfully!');
      onOpenChange(false);
    } catch (err) {
      console.error('Error applying workflow:', err);
      setError(err instanceof Error ? err.message : 'Failed to apply workflow');
    } finally {
      setLoading(false);
    }
  }

  const sortedSteps = (workflow.steps || []).sort((a, b) => a.sort_order - b.sort_order);
  let cumulativeDays = 0;

  return (
    <GlowModal
      open={open}
      onOpenChange={onOpenChange}
      title={`Preview: ${workflow.name}`}
      description={workflow.description}
      size="lg"
      footer={
        <>
          <GlowModalClose asChild>
            <GlowButton variant="outline" disabled={loading}>
              Close
            </GlowButton>
          </GlowModalClose>
          <GlowButton
            onClick={handleApply}
            variant="default"
            glow="medium"
            disabled={loading || !selectedProjectId}
          >
            <Play className="h-4 w-4" />
            {loading ? 'Applying...' : 'Apply to Project'}
          </GlowButton>
        </>
      }
    >
      <div className="space-y-6">
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
            {error}
          </div>
        )}

        {/* Project Selection */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Select Project
          </label>
          <GlowSelect
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
          >
            <option value="">Choose a project...</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.title}
              </option>
            ))}
          </GlowSelect>
        </div>

        {/* Workflow Summary */}
        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Workflow Summary</h3>
              <p className="mt-1 text-sm text-gray-600">
                {sortedSteps.length} steps • {workflow.estimated_days} days estimated
              </p>
            </div>
          </div>
        </div>

        {/* Steps Timeline */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">Steps</h3>
          <div className="space-y-3">
            {sortedSteps.map((step, index) => {
              cumulativeDays += step.duration_days;
              return (
                <div key={step.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                      {index + 1}
                    </div>
                    {index < sortedSteps.length - 1 && (
                      <div className="mt-1 h-12 w-0.5 bg-gray-200" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2 pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{step.title}</h4>
                        {step.description && (
                          <p className="mt-1 text-sm text-gray-600">{step.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{step.duration_days} {step.duration_days === 1 ? 'day' : 'days'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{step.assignee_role.replace('_', ' ')}</span>
                      </div>
                      <GlowBadge variant="outline" size="sm">
                        Day {cumulativeDays - step.duration_days + 1}-{cumulativeDays}
                      </GlowBadge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </GlowModal>
  );
}

