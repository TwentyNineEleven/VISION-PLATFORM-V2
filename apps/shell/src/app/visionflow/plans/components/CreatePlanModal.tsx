/**
 * CreatePlanModal Component
 * Modal for creating a new plan
 */

'use client';

import { useState } from 'react';
import { GlowModal, GlowModalClose } from '@/components/glow-ui/GlowModal';
import { GlowButton } from '@/components/glow-ui/GlowButton';
import { GlowInput } from '@/components/glow-ui/GlowInput';
import { GlowTextarea } from '@/components/glow-ui/GlowTextarea';
import { GlowSelect } from '@/components/glow-ui/GlowSelect';

interface CreatePlanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreatePlanModal({ open, onOpenChange, onSuccess }: CreatePlanModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'DRAFT',
    visibility: 'ORG',
    start_date: '',
    end_date: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/v1/apps/visionflow/plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description || undefined,
          status: formData.status,
          visibility: formData.visibility,
          start_date: formData.start_date || undefined,
          end_date: formData.end_date || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create plan');
      }

      // Reset form
      setFormData({
        title: '',
        description: '',
        status: 'DRAFT',
        visibility: 'ORG',
        start_date: '',
        end_date: '',
      });

      onOpenChange(false);
      onSuccess();
    } catch (err) {
      console.error('Error creating plan:', err);
      setError(err instanceof Error ? err.message : 'Failed to create plan');
    } finally {
      setLoading(false);
    }
  }

  return (
    <GlowModal
      open={open}
      onOpenChange={onOpenChange}
      title="Create New Plan"
      description="Create a new strategic plan to organize your projects and goals"
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
            form="create-plan-form"
            variant="default"
            glow="medium"
            disabled={loading || !formData.title.trim()}
          >
            {loading ? 'Creating...' : 'Create Plan'}
          </GlowButton>
        </>
      }
    >
      <form id="create-plan-form" onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
            {error}
          </div>
        )}

        <GlowInput
          label="Plan Title"
          placeholder="e.g., Q1 2025 Strategic Plan"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          variant="glow"
        />

        <GlowTextarea
          label="Description"
          placeholder="Describe the purpose and goals of this plan..."
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
            <option value="DRAFT">Draft</option>
            <option value="ACTIVE">Active</option>
            <option value="COMPLETE">Complete</option>
            <option value="ARCHIVED">Archived</option>
          </GlowSelect>

          <GlowSelect
            label="Visibility"
            value={formData.visibility}
            onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
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
            value={formData.start_date}
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            variant="glow"
          />

          <GlowInput
            label="End Date"
            type="date"
            value={formData.end_date}
            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
            variant="glow"
          />
        </div>
      </form>
    </GlowModal>
  );
}

