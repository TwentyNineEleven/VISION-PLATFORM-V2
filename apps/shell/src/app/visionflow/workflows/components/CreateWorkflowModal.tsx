/**
 * CreateWorkflowModal Component
 * Modal for creating a new workflow with step builder
 */

'use client';

import { useState } from 'react';
import { GlowModal, GlowModalClose } from '@/components/glow-ui/GlowModal';
import { GlowButton } from '@/components/glow-ui/GlowButton';
import { GlowInput } from '@/components/glow-ui/GlowInput';
import { GlowTextarea } from '@/components/glow-ui/GlowTextarea';
import { GlowSelect } from '@/components/glow-ui/GlowSelect';
import { Plus, X, GripVertical } from 'lucide-react';

interface WorkflowStep {
  title: string;
  description: string;
  duration_days: number;
  assignee_role: string;
  sort_order: number;
}

interface CreateWorkflowModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateWorkflowModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateWorkflowModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_public: false,
  });
  const [steps, setSteps] = useState<WorkflowStep[]>([
    {
      title: '',
      description: '',
      duration_days: 1,
      assignee_role: 'ORG_STAFF',
      sort_order: 0,
    },
  ]);

  function addStep() {
    setSteps([
      ...steps,
      {
        title: '',
        description: '',
        duration_days: 1,
        assignee_role: 'ORG_STAFF',
        sort_order: steps.length,
      },
    ]);
  }

  function removeStep(index: number) {
    setSteps(steps.filter((_, i) => i !== index).map((s, i) => ({ ...s, sort_order: i })));
  }

  function updateStep(index: number, field: keyof WorkflowStep, value: any) {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setSteps(newSteps);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate
    if (!formData.name.trim()) {
      setError('Workflow name is required');
      setLoading(false);
      return;
    }

    if (steps.some((s) => !s.title.trim())) {
      setError('All steps must have a title');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/v1/apps/visionflow/workflows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description || undefined,
          is_public: formData.is_public,
          steps: steps.map((s, i) => ({
            title: s.title,
            description: s.description,
            sort_order: i,
            duration_days: s.duration_days,
            assignee_role: s.assignee_role,
          })),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create workflow');
      }

      // Reset form
      setFormData({
        name: '',
        description: '',
        is_public: false,
      });
      setSteps([
        {
          title: '',
          description: '',
          duration_days: 1,
          assignee_role: 'ORG_STAFF',
          sort_order: 0,
        },
      ]);

      onOpenChange(false);
      onSuccess();
    } catch (err) {
      console.error('Error creating workflow:', err);
      setError(err instanceof Error ? err.message : 'Failed to create workflow');
    } finally {
      setLoading(false);
    }
  }

  const estimatedDays = steps.reduce((sum, step) => sum + step.duration_days, 0);

  return (
    <GlowModal
      open={open}
      onOpenChange={onOpenChange}
      title="Create New Workflow"
      description="Build a reusable workflow template with steps"
      size="xl"
      footer={
        <>
          <GlowModalClose asChild>
            <GlowButton variant="outline" disabled={loading}>
              Cancel
            </GlowButton>
          </GlowModalClose>
          <GlowButton
            type="submit"
            form="create-workflow-form"
            variant="default"
            glow="medium"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Workflow'}
          </GlowButton>
        </>
      }
    >
      <form id="create-workflow-form" onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
            {error}
          </div>
        )}

        {/* Workflow Info */}
        <div className="space-y-4">
          <GlowInput
            label="Workflow Name"
            placeholder="e.g., Grant Application Process"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            variant="glow"
          />

          <GlowTextarea
            label="Description"
            placeholder="Describe what this workflow does..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            variant="glow"
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_public"
              checked={formData.is_public}
              onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="is_public" className="text-sm text-gray-700">
              Make this workflow public (available to all organizations)
            </label>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Workflow Steps</h3>
            <GlowButton
              type="button"
              variant="outline"
              size="sm"
              onClick={addStep}
            >
              <Plus className="h-4 w-4" />
              Add Step
            </GlowButton>
          </div>

          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={index} className="rounded-lg border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                      Step {index + 1}
                    </span>
                  </div>
                  {steps.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeStep(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <GlowInput
                  label="Step Title"
                  placeholder="e.g., Submit Application"
                  value={step.title}
                  onChange={(e) => updateStep(index, 'title', e.target.value)}
                  required
                  variant="glow"
                />

                <GlowTextarea
                  label="Description"
                  placeholder="What needs to be done in this step?"
                  value={step.description}
                  onChange={(e) => updateStep(index, 'description', e.target.value)}
                  rows={2}
                  variant="glow"
                />

                <div className="grid grid-cols-2 gap-4">
                  <GlowInput
                    label="Duration (days)"
                    type="number"
                    min="1"
                    value={step.duration_days}
                    onChange={(e) => updateStep(index, 'duration_days', parseInt(e.target.value) || 1)}
                    variant="glow"
                  />

                  <GlowSelect
                    label="Assignee Role"
                    value={step.assignee_role}
                    onChange={(e) => updateStep(index, 'assignee_role', e.target.value)}
                  >
                    <option value="ORG_STAFF">Organization Staff</option>
                    <option value="CONSULTANT">Consultant</option>
                    <option value="FUNDER">Funder</option>
                    <option value="PROJECT_LEAD">Project Lead</option>
                  </GlowSelect>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
            <strong>Estimated Duration:</strong> {estimatedDays} {estimatedDays === 1 ? 'day' : 'days'}
          </div>
        </div>
      </form>
    </GlowModal>
  );
}

