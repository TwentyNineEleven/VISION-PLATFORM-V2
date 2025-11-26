/**
 * ProjectKanban Component
 * Kanban board with drag-and-drop functionality
 */

'use client';

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { useState } from 'react';
import { GlowCard, GlowCardContent, GlowCardHeader, GlowCardTitle } from '@/components/glow-ui/GlowCard';
import { ProjectCard } from './ProjectCard';
import { Plus } from 'lucide-react';

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

interface ProjectKanbanProps {
  projects: Project[];
  onStatusChange: (projectId: string, newStatus: string) => Promise<void>;
  onCreateProject?: () => void;
}

const COLUMNS = [
  { id: 'NOT_STARTED', title: 'Not Started', color: 'bg-gray-100' },
  { id: 'IN_PROGRESS', title: 'In Progress', color: 'bg-blue-100' },
  { id: 'AT_RISK', title: 'At Risk', color: 'bg-orange-100' },
  { id: 'COMPLETED', title: 'Completed', color: 'bg-green-100' },
] as const;

export function ProjectKanban({
  projects,
  onStatusChange,
  onCreateProject,
}: ProjectKanbanProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draggedProject, setDraggedProject] = useState<Project | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
    const project = projects.find((p) => p.id === event.active.id);
    setDraggedProject(project || null);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    setActiveId(null);
    setDraggedProject(null);

    if (!over) {
      return;
    }

    const projectId = active.id as string;
    const newStatus = over.id as string;

    // Find the project's current status
    const project = projects.find((p) => p.id === projectId);
    if (!project || project.status === newStatus) {
      return;
    }

    // Optimistic update
    try {
      await onStatusChange(projectId, newStatus);
    } catch (error) {
      console.error('Error updating project status:', error);
      // In a real app, you'd show an error toast and revert the change
    }
  }

  function getProjectsByStatus(status: string): Project[] {
    return projects.filter((p) => p.status === status);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((column) => {
          const columnProjects = getProjectsByStatus(column.id);
          return (
            <KanbanColumn
              key={column.id}
              column={column}
              projects={columnProjects}
              activeId={activeId}
            />
          );
        })}
      </div>

      <DragOverlay>
        {draggedProject ? (
          <div className="rotate-3 opacity-90">
            <ProjectCard project={draggedProject} isDragging={true} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

// Kanban Column Component
function KanbanColumn({
  column,
  projects,
  activeId,
}: {
  column: typeof COLUMNS[number];
  projects: Project[];
  activeId: string | null;
}) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <div className="flex-shrink-0 w-80">
      <GlowCard variant="flat" padding="sm" className="h-full">
        <GlowCardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${column.color}`} />
              <GlowCardTitle className="text-sm font-semibold">
                {column.title}
              </GlowCardTitle>
              <span className="text-xs text-gray-500">
                ({projects.length})
              </span>
            </div>
          </div>
        </GlowCardHeader>
        <GlowCardContent>
          <div ref={setNodeRef} className="space-y-2 min-h-[200px]">
            <SortableContext
              items={projects.map((p) => p.id)}
              strategy={verticalListSortingStrategy}
            >
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  isDragging={activeId === project.id}
                />
              ))}
            </SortableContext>
            {projects.length === 0 && (
              <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-sm text-gray-400">
                Drop projects here
              </div>
            )}
          </div>
        </GlowCardContent>
      </GlowCard>
    </div>
  );
}

