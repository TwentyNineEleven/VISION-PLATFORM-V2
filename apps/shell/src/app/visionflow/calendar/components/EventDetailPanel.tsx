/**
 * EventDetailPanel Component
 * Shows event details and allows rescheduling
 */

'use client';

import { useState } from 'react';
import { GlowCard, GlowCardContent, GlowCardHeader, GlowCardTitle } from '@/components/glow-ui/GlowCard';
import { GlowButton } from '@/components/glow-ui/GlowButton';
import { GlowInput } from '@/components/glow-ui/GlowInput';
import { GlowBadge } from '@/components/glow-ui/GlowBadge';
import { X, Calendar as CalendarIcon, Tag } from 'lucide-react';

export interface CalendarEventDetail {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'TASK' | 'PROJECT' | 'MILESTONE';
  status: string;
  priority?: string;
  color: string;
  resource: {
    id: string;
    type: string;
    projectId?: string;
  };
}

interface EventDetailPanelProps {
  event: CalendarEventDetail;
  onClose: () => void;
  onUpdate: () => void;
}

export function EventDetailPanel({
  event,
  onClose,
  onUpdate,
}: EventDetailPanelProps) {
  const [newDate, setNewDate] = useState(
    event.start.toISOString().split('T')[0]
  );
  const [saving, setSaving] = useState(false);

  async function handleReschedule() {
    setSaving(true);
    try {
      const endpoint =
        event.type === 'TASK'
          ? `/api/v1/apps/visionflow/tasks/${event.resource.id}`
          : event.type === 'PROJECT'
          ? `/api/v1/apps/visionflow/projects/${event.resource.id}`
          : null;

      if (!endpoint) {
        alert('Rescheduling not available for this event type');
        return;
      }

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          due_date: newDate,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to reschedule');
      }

      onUpdate();
      onClose();
    } catch (err) {
      console.error('Error rescheduling:', err);
      alert('Failed to reschedule. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  const typeColors = {
    TASK: 'bg-blue-100 text-blue-700',
    PROJECT: 'bg-green-100 text-green-700',
    MILESTONE: 'bg-purple-100 text-purple-700',
  };

  return (
    <GlowCard variant="default" padding="md">
      <GlowCardHeader>
        <div className="flex items-center justify-between">
          <GlowCardTitle>{event.title}</GlowCardTitle>
          <button
            onClick={onClose}
            className="rounded p-1 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </GlowCardHeader>
      <GlowCardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <GlowBadge
            variant="outline"
            className={typeColors[event.type]}
          >
            {event.type}
          </GlowBadge>
          <GlowBadge variant="outline" size="sm">
            {event.status}
          </GlowBadge>
          {event.priority && (
            <GlowBadge variant="outline" size="sm">
              {event.priority}
            </GlowBadge>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CalendarIcon className="h-4 w-4" />
            <span>
              {event.start.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>

        {/* Reschedule */}
        <div className="space-y-2 border-t pt-4">
          <h3 className="text-sm font-semibold text-gray-900">Reschedule</h3>
          <GlowInput
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            variant="glow"
          />
          <GlowButton
            onClick={handleReschedule}
            variant="default"
            glow="medium"
            disabled={saving || newDate === event.start.toISOString().split('T')[0]}
            className="w-full"
          >
            {saving ? 'Updating...' : 'Update Date'}
          </GlowButton>
        </div>

        {/* Actions */}
        <div className="flex gap-2 border-t pt-4">
          <GlowButton
            variant="outline"
            onClick={() => {
              const url =
                event.type === 'TASK'
                  ? `/visionflow/tasks/${event.resource.id}`
                  : event.type === 'PROJECT'
                  ? `/visionflow/projects/${event.resource.id}`
                  : '#';
              if (url !== '#') {
                window.location.href = url;
              }
            }}
            className="flex-1"
          >
            View Details
          </GlowButton>
        </div>
      </GlowCardContent>
    </GlowCard>
  );
}

