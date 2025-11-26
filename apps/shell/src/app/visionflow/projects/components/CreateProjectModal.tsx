/**
 * CreateProjectModal Component
 * Modal for creating a new project
 */

'use client';

import { useState } from 'react';
import { GlowModal, GlowModalClose } from '@/components/glow-ui/GlowModal';
import { GlowButton } from '@/components/glow-ui/GlowButton';
import { GlowInput } from '@/components/glow-ui/GlowInput';
import { GlowTextarea } from '@/components/glow-ui/GlowTextarea';
import { GlowSelect } from '@/components/glow-ui/GlowSelect';

interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  defaultPlanId?: string;
}

export function CreateProjectModal({
  open,
  onOpenChange,
  onSuccess,
  defaultPlanId,
}: CreateProjectModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'NOT_STARTED',
    priority: 'MEDIUM',
    plan_id: defaultPlanId || '',
    start_date: '',
    due_date: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/v1/apps/visionflow/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description || undefined,
          status: formData.status,
          priority: formData.priority,
          plan_id: formData.plan_id || undefined,
          start_date: formData.start_date || undefined,
          due_date: formData.due_date || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create project');
      }

      // Reset form
      setFormData({
        title: '',
        description: '',
        status: 'NOT_STARTED',
        priority: 'MEDIUM',
        plan_id: defaultPlanId || '',
        start_date: '',
        due_date: '',
      });

      onOpenChange(false);
      onSuccess();
    } catch (err) {
      console.error('Error creating project:', err);
      setError(err instanceof Error ? err.message : 'Failed to create project');
    } finally {
      setLoading(false);
    }
  }

  return (
    <GlowModal
      open={open}
      onOpenChange={onOpenChange}
      title="Create New Project"
      description="Create a new project to track your work"
      size="lg"
      footer={
        <>
          <GlowModalClose asChild>
            <GlowButton variant="outline" disabled={loading}>
              Cancel
            </GlowButton>
          </GlowModalClose>
          <GlowButton
            type="submit"
            form="create-project-form"
            variant="default"
            glow="medium"
            disabled={loading || !formData.title.trim()}
          >
            {loading ? 'Creating...' : 'Create Project'}
          </GlowButton>
        </>
      }
    >
      <form id="create-project-form" onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
            {error}
          </div>
        )}

        <GlowInput
          label="Project Title"
          placeholder="e.g., Website Redesign"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          variant="glow"
        />

        <GlowTextarea
          label="Description"
          placeholder="Describe the project goals and scope..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          variant="glow"
        />

        <div className="grid grid-cols-2 gap-4">
          <GlowSelect
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="NOT_STARTED">Not Started</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="AT_RISK">At Risk</option>
            <option value="COMPLETED">Completed</option>
          </GlowSelect>

          <GlowSelect
            label="Priority"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </GlowSelect>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <GlowInput
            label="Start Date"
            type="date"
            value={formData.start_date}
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            variant="glow"
          />

          <GlowInput
            label="Due Date"
            type="date"
            value={formData.due_date}
            onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
            variant="glow"
          />
        </div>
      </form>
    </GlowModal>
  );
}

