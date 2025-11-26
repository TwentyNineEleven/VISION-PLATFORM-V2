/**
 * VisionFlow Projects Page
 * Kanban board and list view for projects
 * Phase 2B: Projects with Kanban
 */

'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { GlowCard, GlowCardContent } from '@/components/glow-ui/GlowCard';
import { GlowButton } from '@/components/glow-ui/GlowButton';
import { GlowInput } from '@/components/glow-ui/GlowInput';
import { GlowSelect } from '@/components/glow-ui/GlowSelect';
// Projects page doesn't use tabs - removed unused import
import { ProjectKanban } from './components/ProjectKanban';
import { CreateProjectModal } from './components/CreateProjectModal';
import { Search, Plus, LayoutGrid, List } from 'lucide-react';

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

function VisionFlowProjectsPageContent() {
  const searchParams = useSearchParams();
  const planId = searchParams.get('plan');

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [createModalOpen, setCreateModalOpen] = useState(false);

  useEffect(() => {
    loadProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planId, statusFilter, priorityFilter]);

  async function loadProjects() {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (planId) {
        params.append('plan_id', planId);
      }
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      if (priorityFilter !== 'all') {
        params.append('priority', priorityFilter);
      }

      const response = await fetch(`/api/v1/apps/visionflow/projects?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to load projects');
      }

      const data = await response.json();
      setProjects(data.projects || []);
    } catch (err) {
      console.error('Error loading projects:', err);
      setError('Failed to load projects. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(projectId: string, newStatus: string) {
    try {
      const response = await fetch(`/api/v1/apps/visionflow/projects/${projectId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update project status');
      }

      // Update local state optimistically
      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? { ...p, status: newStatus as Project['status'] } : p))
      );
    } catch (err) {
      console.error('Error updating project status:', err);
      // Reload to get correct state
      await loadProjects();
      throw err;
    }
  }

  const filteredProjects = projects.filter((project) => {
    if (searchQuery && !project.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
          <p className="text-gray-600">Loading projects...</p>
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
          <h2 className="text-2xl font-semibold text-gray-900">Projects</h2>
          <p className="mt-1 text-sm text-gray-600">
            {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <GlowButton
            variant={viewMode === 'kanban' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('kanban')}
          >
            <LayoutGrid className="h-4 w-4" />
            Kanban
          </GlowButton>
          <GlowButton
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
            List
          </GlowButton>
          <GlowButton
            onClick={() => setCreateModalOpen(true)}
            variant="default"
            glow="medium"
          >
            <Plus className="h-4 w-4" />
            New Project
          </GlowButton>
        </div>
      </div>

      {/* Filters */}
      <GlowCard variant="flat" padding="md">
        <div className="flex flex-wrap gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[300px]">
            <GlowInput
              type="text"
              placeholder="Search projects..."
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
              <option value="NOT_STARTED">Not Started</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="AT_RISK">At Risk</option>
              <option value="COMPLETED">Completed</option>
            </GlowSelect>
          </div>

          {/* Priority Filter */}
          <div className="min-w-[150px]">
            <GlowSelect
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </GlowSelect>
          </div>
        </div>
      </GlowCard>

      {/* Content */}
      {viewMode === 'kanban' ? (
        <ProjectKanban
          projects={filteredProjects}
          onStatusChange={handleStatusChange}
          onCreateProject={() => setCreateModalOpen(true)}
        />
      ) : (
        <GlowCard variant="flat" padding="md">
          <div className="space-y-2">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{project.title}</h3>
                    {project.description && (
                      <p className="mt-1 text-sm text-gray-600">{project.description}</p>
                    )}
                    {project.plan && (
                      <p className="mt-1 text-xs text-gray-500">Plan: {project.plan.title}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">{project.progress_percentage}%</span>
                    <span className="text-sm text-gray-500">{project.status}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-sm text-gray-500">No projects found</p>
                <GlowButton
                  onClick={() => setCreateModalOpen(true)}
                  variant="outline"
                  className="mt-4"
                >
                  <Plus className="h-4 w-4" />
                  Create Project
                </GlowButton>
              </div>
            )}
          </div>
        </GlowCard>
      )}

      {/* Create Modal */}
      <CreateProjectModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSuccess={loadProjects}
        defaultPlanId={planId || undefined}
      />
    </div>
  );
}

export default function VisionFlowProjectsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-96 items-center justify-center">
          <div className="text-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
            <p className="text-gray-600">Loading projects...</p>
          </div>
        </div>
      }
    >
      <VisionFlowProjectsPageContent />
    </Suspense>
  );
}

