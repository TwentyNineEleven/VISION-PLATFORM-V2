/**
 * Create Task Modal Component
 * Reusable modal for creating new tasks with form validation
 * Phase 1: Task Management
 * Uses Glow UI design system and 2911 Bold Color System
 */

'use client';

import { useState, useEffect } from 'react';
import {
  GlowModal,
  GlowModalClose,
} from '@/components/glow-ui/GlowModal';
import { GlowButton } from '@/components/glow-ui/GlowButton';
import { GlowInput } from '@/components/glow-ui/GlowInput';
import { GlowTextarea } from '@/components/glow-ui/GlowTextarea';
import { GlowSelect } from '@/components/glow-ui/GlowSelect';
import { GlowBadge } from '@/components/glow-ui/GlowBadge';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (task: any) => void;
  projectId?: string;
  milestoneId?: string;
  parentTaskId?: string;
}

const STATUS_OPTIONS = [
  { value: 'NOT_STARTED', label: 'Not Started' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'BLOCKED', label: 'Blocked' },
  { value: 'COMPLETE', label: 'Complete' },
];

const PRIORITY_OPTIONS = [
  { value: '', label: 'None' },
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
  { value: 'URGENT', label: 'Urgent' },
];

export function CreateTaskModal({
  isOpen,
  onClose,
  onSuccess,
  projectId,
  milestoneId,
  parentTaskId,
}: CreateTaskModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('NOT_STARTED');
  const [priority, setPriority] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('');

  // Validation
  const [titleError, setTitleError] = useState('');

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setTitle('');
      setDescription('');
      setStatus('NOT_STARTED');
      setPriority('');
      setDueDate('');
      setEstimatedHours('');
      setError(null);
      setTitleError('');
    }
  }, [isOpen]);

  const validateForm = () => {
    let valid = true;

    if (!title.trim()) {
      setTitleError('Title is required');
      valid = false;
    } else {
      setTitleError('');
    }

    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // TODO: Create task via API
      // const response = await fetch('/api/v1/apps/visionflow/tasks', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     title,
      //     description,
      //     status,
      //     priority: priority || null,
      //     due_date: dueDate || null,
      //     estimated_hours: estimatedHours ? parseFloat(estimatedHours) : null,
      //     project_id: projectId || null,
      //     milestone_id: milestoneId || null,
      //     parent_task_id: parentTaskId || null,
      //   }),
      // });

      // if (!response.ok) {
      //   throw new Error('Failed to create task');
      // }

      // const data = await response.json();

      // Mock success for development
      alert('Task creation will work once database is connected');

      if (onSuccess) {
        // onSuccess(data.task);
      }

      onClose();
    } catch (err) {
      console.error('Error creating task:', err);
      setError(err instanceof Error ? err.message : 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  // Context info badge
  const getContextBadge = () => {
    if (parentTaskId) {
      return (
        <GlowBadge variant="info" size="sm">
          Creating Subtask
        </GlowBadge>
      );
    }
    if (milestoneId) {
      return (
        <GlowBadge variant="info" size="sm">
          In Milestone
        </GlowBadge>
      );
    }
    if (projectId) {
      return (
        <GlowBadge variant="info" size="sm">
          In Project
        </GlowBadge>
      );
    }
    return null;
  };

  return (
    <GlowModal
      open={isOpen}
      onOpenChange={onClose}
      title="Create New Task"
      description="Add a new task to your workflow"
      size="xl"
      footer={
        <>
          <GlowModalClose asChild>
            <GlowButton variant="outline" disabled={loading}>
              Cancel
            </GlowButton>
          </GlowModalClose>
          <GlowButton
            variant="default"
            glow="medium"
            loading={loading}
            onClick={handleSubmit}
          >
            {loading ? 'Creating...' : 'Create Task'}
          </GlowButton>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Context Badge */}
        {getContextBadge() && (
          <div className="flex items-center gap-2">
            {getContextBadge()}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="rounded-lg bg-vision-red-50 p-4 border border-vision-red-900/20">
            <div className="flex items-start gap-3">
              <svg
                className="h-5 w-5 text-vision-red-900 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm text-vision-red-900 flex-1">{error}</p>
            </div>
          </div>
        )}

        {/* Title */}
        <GlowInput
          label="Title"
          placeholder="Enter task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={titleError}
          required
          inputSize="lg"
        />

        {/* Description */}
        <GlowTextarea
          label="Description"
          placeholder="Add a detailed description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />

        {/* Status and Priority Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Status */}
          <GlowSelect
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </GlowSelect>

          {/* Priority */}
          <GlowSelect
            label="Priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            {PRIORITY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </GlowSelect>
        </div>

        {/* Due Date and Estimated Hours Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Due Date */}
          <GlowInput
            type="date"
            label="Due Date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          {/* Estimated Hours */}
          <GlowInput
            type="number"
            label="Estimated Hours"
            placeholder="0.0"
            value={estimatedHours}
            onChange={(e) => setEstimatedHours(e.target.value)}
            step="0.5"
            min="0"
          />
        </div>

        {/* Context Info */}
        {(projectId || milestoneId || parentTaskId) && (
          <div className="rounded-lg bg-vision-blue-50 p-4 border border-vision-blue-950/20">
            <div className="flex items-start gap-3">
              <svg
                className="h-5 w-5 text-vision-blue-950 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1">
                <p className="text-sm text-vision-blue-950">
                  {parentTaskId && 'This task will be created as a subtask'}
                  {milestoneId &&
                    !parentTaskId &&
                    'This task will be added to the selected milestone'}
                  {projectId &&
                    !milestoneId &&
                    !parentTaskId &&
                    'This task will be added to the selected project'}
                </p>
              </div>
            </div>
          </div>
        )}
      </form>
    </GlowModal>
  );
}
