/**
 * VisionFlow Workflows Page
 * List workflows and templates with preview and apply functionality
 * Phase 2C: Workflows
 */

'use client';

import { useEffect, useState } from 'react';
import { GlowCard, GlowCardContent, GlowCardHeader, GlowCardTitle } from '@/components/glow-ui/GlowCard';
import { GlowButton } from '@/components/glow-ui/GlowButton';
import { GlowInput } from '@/components/glow-ui/GlowInput';
import { GlowTabs, type TabItem } from '@/components/glow-ui/GlowTabs';
import { GlowBadge } from '@/components/glow-ui/GlowBadge';
import { CreateWorkflowModal } from './components/CreateWorkflowModal';
import { WorkflowPreviewModal } from './components/WorkflowPreviewModal';
import { Search, Plus, Play, Eye, Copy } from 'lucide-react';

import type { WorkflowStep as WorkflowStepType } from '@/types/visionflow';

type WorkflowStep = WorkflowStepType;

import type { Workflow as WorkflowType } from '@/types/visionflow';

type Workflow = WorkflowType;

export default function VisionFlowWorkflowsPage() {
  const [myWorkflows, setMyWorkflows] = useState<Workflow[]>([]);
  const [publicTemplates, setPublicTemplates] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);

  useEffect(() => {
    loadWorkflows();
  }, []);

  async function loadWorkflows() {
    try {
      setLoading(true);
      setError(null);

      // Load user workflows
      const myResponse = await fetch('/api/v1/apps/visionflow/workflows?is_public=false');
      if (myResponse.ok) {
        const myData = await myResponse.json();
        setMyWorkflows(myData.workflows || []);
      }

      // Load public templates
      const publicResponse = await fetch('/api/v1/apps/visionflow/workflows?is_public=true');
      if (publicResponse.ok) {
        const publicData = await publicResponse.json();
        setPublicTemplates(publicData.workflows || []);
      }
    } catch (err) {
      console.error('Error loading workflows:', err);
      setError('Failed to load workflows. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handlePreview(workflow: Workflow) {
    setSelectedWorkflow(workflow);
    setPreviewModalOpen(true);
  }

  function handleCopyToMyWorkflows(workflow: Workflow) {
    // In a real app, this would create a copy of the workflow
    // For now, just show a message
    alert(`Copying "${workflow.name}" to My Workflows...`);
    // TODO: Implement copy functionality
  }

  const filteredMyWorkflows = myWorkflows.filter((w) =>
    w.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPublicTemplates = publicTemplates.filter((w) =>
    w.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
          <p className="text-gray-600">Loading workflows...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Workflows</h2>
          <p className="mt-1 text-sm text-gray-600">
            Create reusable workflow templates for your projects
          </p>
        </div>
        <GlowButton
          onClick={() => setCreateModalOpen(true)}
          variant="default"
          glow="medium"
        >
          <Plus className="h-4 w-4" />
          New Workflow
        </GlowButton>
      </div>

      {/* Search */}
      <GlowCard variant="flat" padding="md">
        <GlowInput
          type="text"
          placeholder="Search workflows..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<Search className="h-4 w-4" />}
        />
      </GlowCard>

      {/* Tabs */}
      <GlowTabs
        tabs={[
          {
            id: 'my-workflows',
            label: `My Workflows (${filteredMyWorkflows.length})`,
            content: (
              <WorkflowGrid
                workflows={filteredMyWorkflows}
                onPreview={handlePreview}
                onApply={(w) => {
                  setSelectedWorkflow(w);
                  setPreviewModalOpen(true);
                }}
              />
            ),
          },
          {
            id: 'templates',
            label: `Public Templates (${filteredPublicTemplates.length})`,
            content: (
              <WorkflowGrid
                workflows={filteredPublicTemplates}
                onPreview={handlePreview}
                onApply={(w) => {
                  setSelectedWorkflow(w);
                  setPreviewModalOpen(true);
                }}
                onCopy={handleCopyToMyWorkflows}
                showCopyButton={true}
              />
            ),
          },
        ]}
        defaultValue="my-workflows"
      />

      {/* Modals */}
      <CreateWorkflowModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSuccess={loadWorkflows}
      />

      {selectedWorkflow && (
        <WorkflowPreviewModal
          open={previewModalOpen}
          onOpenChange={setPreviewModalOpen}
          workflow={selectedWorkflow}
        />
      )}
    </div>
  );
}

// Workflow Grid Component
function WorkflowGrid({
  workflows,
  onPreview,
  onApply,
  onCopy,
  showCopyButton = false,
}: {
  workflows: Workflow[];
  onPreview: (workflow: Workflow) => void;
  onApply: (workflow: Workflow) => void;
  onCopy?: (workflow: Workflow) => void;
  showCopyButton?: boolean;
}) {
  if (workflows.length === 0) {
    return (
      <GlowCard variant="flat" padding="lg">
        <div className="text-center py-12">
          <p className="text-sm text-gray-500">No workflows found</p>
        </div>
      </GlowCard>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {workflows.map((workflow) => (
        <GlowCard key={workflow.id} variant="interactive" padding="md">
          <GlowCardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <GlowCardTitle className="text-lg">{workflow.name}</GlowCardTitle>
                {workflow.description && (
                  <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                    {workflow.description}
                  </p>
                )}
              </div>
              {workflow.is_public && (
                <GlowBadge variant="info" size="sm">
                  Public
                </GlowBadge>
              )}
            </div>
          </GlowCardHeader>
          <GlowCardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{workflow.steps?.length || 0} steps</span>
              <span>{workflow.estimated_days} days</span>
            </div>
            <div className="flex gap-2">
              <GlowButton
                variant="outline"
                size="sm"
                onClick={() => onPreview(workflow)}
                className="flex-1"
              >
                <Eye className="h-4 w-4" />
                Preview
              </GlowButton>
              <GlowButton
                variant="default"
                size="sm"
                onClick={() => onApply(workflow)}
                className="flex-1"
              >
                <Play className="h-4 w-4" />
                Apply
              </GlowButton>
              {showCopyButton && onCopy && (
                <GlowButton
                  variant="ghost"
                  size="sm"
                  onClick={() => onCopy(workflow)}
                >
                  <Copy className="h-4 w-4" />
                </GlowButton>
              )}
            </div>
          </GlowCardContent>
        </GlowCard>
      ))}
    </div>
  );
}

