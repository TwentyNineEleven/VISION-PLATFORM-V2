/**
 * ProjectCard Component
 * Draggable card for Kanban board
 */

'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GlowCard, GlowCardContent } from '@/components/glow-ui/GlowCard';
import { GlowBadge } from '@/components/glow-ui/GlowBadge';
import { Calendar, User, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface Project {
  id: string;
  title: string;
  description?: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'AT_RISK' | 'COMPLETED' | 'BLOCKED' | 'ON_HOLD';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  due_date?: string;
  progress_percentage: number;
  plan?: {
    id: string;
    title: string;
  };
}

interface ProjectCardProps {
  project: Project;
  isDragging?: boolean;
}

const PRIORITY_COLORS = {
  LOW: 'bg-gray-100 text-gray-700',
  MEDIUM: 'bg-yellow-100 text-yellow-700',
  HIGH: 'bg-orange-100 text-orange-700',
  URGENT: 'bg-red-100 text-red-700',
};

export function ProjectCard({ project, isDragging }: ProjectCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging || isSortableDragging ? 0.5 : 1,
  };

  function formatDate(dateString?: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  const isOverdue = project.due_date && new Date(project.due_date) < new Date() && project.status !== 'COMPLETED';

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Link href={`/visionflow/projects/${project.id}` as any}>
        <GlowCard
          variant="interactive"
          padding="sm"
          className={`cursor-grab active:cursor-grabbing ${isDragging || isSortableDragging ? 'shadow-lg' : ''}`}
        >
          <GlowCardContent className="space-y-3">
            {/* Title and Priority */}
            <div className="flex items-start justify-between gap-2">
              <h4 className="flex-1 font-medium text-gray-900 line-clamp-2">
                {project.title}
              </h4>
              {project.priority && project.priority !== 'LOW' && (
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${PRIORITY_COLORS[project.priority]}`}
                >
                  {project.priority}
                </span>
              )}
            </div>

            {/* Description */}
            {project.description && (
              <p className="text-xs text-gray-600 line-clamp-2">
                {project.description}
              </p>
            )}

            {/* Plan Link */}
            {project.plan && (
              <div className="text-xs text-gray-500">
                Plan: {project.plan.title}
              </div>
            )}

            {/* Progress Bar */}
            {project.progress_percentage > 0 && (
              <div>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium text-gray-900">
                    {project.progress_percentage}%
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${project.progress_percentage}%` }}
                  />
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              {project.due_date && (
                <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-600' : ''}`}>
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(project.due_date)}</span>
                  {isOverdue && <AlertCircle className="h-3 w-3" />}
                </div>
              )}
            </div>
          </GlowCardContent>
        </GlowCard>
      </Link>
    </div>
  );
}

