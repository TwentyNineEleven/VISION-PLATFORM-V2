/**
 * VisionFlow Task Detail Page
 * Comprehensive task view with editing, comments, activity, and attachments
 * Phase 1: Task Management
 * Uses Glow UI design system and 2911 Bold Color System
 */

'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TaskAssignments } from '@/components/visionflow/TaskAssignments';
import { GlowButton } from '@/components/glow-ui/GlowButton';
import { GlowCard } from '@/components/glow-ui/GlowCard';
import { GlowInput } from '@/components/glow-ui/GlowInput';
import { GlowTextarea } from '@/components/glow-ui/GlowTextarea';
import { GlowSelect } from '@/components/glow-ui/GlowSelect';
import { GlowBadge } from '@/components/glow-ui/GlowBadge';
import { GlowTabs, TabItem } from '@/components/glow-ui/GlowTabs';
import { ArrowLeft, Edit, Save, Trash2, X, MessageSquare, Activity, Paperclip, CheckSquare } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'BLOCKED' | 'COMPLETE' | 'CANCELLED';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  due_date?: string;
  completion_date?: string;
  estimated_hours?: number;
  actual_hours?: number;
  created_at: string;
  updated_at: string;
  project?: {
    id: string;
    title: string;
    status: string;
  };
  milestone?: {
    id: string;
    title: string;
    due_date?: string;
  };
  created_by_user?: {
    id: string;
    name: string;
    email: string;
    avatar_url?: string;
  };
  assignments?: Array<{
    id: string;
    user_id: string;
    role: 'OWNER' | 'COLLABORATOR' | 'REVIEWER';
    user: {
      id: string;
      name: string;
      email: string;
      avatar_url?: string;
    };
  }>;
  comments?: Array<{
    id: string;
    content: string;
    created_at: string;
    user: {
      id: string;
      name: string;
      email: string;
      avatar_url?: string;
    };
  }>;
  activity?: Array<{
    id: string;
    action: string;
    changes?: any;
    created_at: string;
    user?: {
      id: string;
      name: string;
      email: string;
      avatar_url?: string;
    };
  }>;
  attachments?: Array<{
    id: string;
    file_name: string;
    file_size?: number;
    file_type?: string;
    created_at: string;
    uploaded_by_user: {
      name: string;
    };
  }>;
  subtasks?: Array<{
    id: string;
    title: string;
    status: string;
    priority?: string;
    due_date?: string;
  }>;
}

const STATUS_CONFIG = {
  NOT_STARTED: { label: 'Not Started', variant: 'outline' as const, color: 'bg-vision-gray-50 text-vision-gray-700' },
  IN_PROGRESS: { label: 'In Progress', variant: 'info' as const, color: 'bg-vision-blue-50 text-vision-blue-950' },
  BLOCKED: { label: 'Blocked', variant: 'destructive' as const, color: 'bg-vision-red-50 text-vision-red-900' },
  COMPLETE: { label: 'Complete', variant: 'success' as const, color: 'bg-vision-green-50 text-vision-green-700' },
  CANCELLED: { label: 'Cancelled', variant: 'outline' as const, color: 'bg-vision-gray-50 text-vision-gray-500' },
};

const PRIORITY_CONFIG = {
  LOW: { label: 'Low', variant: 'outline' as const },
  MEDIUM: { label: 'Medium', variant: 'warning' as const },
  HIGH: { label: 'High', variant: 'warning' as const },
  URGENT: { label: 'Urgent', variant: 'destructive' as const },
};

export default function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [activeTab, setActiveTab] = useState('comments');

  // Editable fields
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedStatus, setEditedStatus] = useState('');
  const [editedPriority, setEditedPriority] = useState('');
  const [editedDueDate, setEditedDueDate] = useState('');
  const [editedEstimatedHours, setEditedEstimatedHours] = useState('');

  const loadTask = async () => {
    try {
      setLoading(true);
      // TODO: Fetch task from API
      // const response = await fetch(`/api/v1/apps/visionflow/tasks/${id}`);
      // const data = await response.json();
      // setTask(data.task);

      // Mock data for development
      setTask(null);
      setError('Database not connected. Run migrations per VISIONFLOW_SETUP.md');
      setLoading(false);
    } catch (err) {
      console.error('Error loading task:', err);
      setError('Failed to load task');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTask();
  }, [id]);

  useEffect(() => {
    if (task) {
      setEditedTitle(task.title);
      setEditedDescription(task.description || '');
      setEditedStatus(task.status);
      setEditedPriority(task.priority || '');
      setEditedDueDate(task.due_date ? task.due_date.split('T')[0] : '');
      setEditedEstimatedHours(task.estimated_hours?.toString() || '');
    }
  }, [task]);

  const handleSave = async () => {
    if (!task) return;

    try {
      setSaving(true);
      // TODO: Save via API
      setEditing(false);
    } catch (err) {
      console.error('Error saving task:', err);
      alert('Failed to save task');
    } finally {
      setSaving(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !task) return;

    try {
      // TODO: Add comment via API
      setNewComment('');
    } catch (err) {
      console.error('Error adding comment:', err);
      alert('Failed to add comment');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      // TODO: Delete via API
      router.push('/visionflow/tasks');
    } catch (err) {
      console.error('Error deleting task:', err);
      alert('Failed to delete task');
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-border border-t-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading task...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <GlowCard variant="elevated" padding="lg" className="bg-vision-red-50 border-vision-red-900/20">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <X className="h-6 w-6 text-vision-red-900" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-vision-red-900">Error</h3>
            <p className="mt-2 text-sm text-vision-red-900">{error}</p>
            <div className="mt-4">
              <Link href="/visionflow/tasks">
                <GlowButton variant="outline" size="sm" className="border-vision-red-900 text-vision-red-900 hover:bg-vision-red-50">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Tasks
                </GlowButton>
              </Link>
            </div>
          </div>
        </div>
      </GlowCard>
    );
  }

  if (!task) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Task not found</p>
        <Link href="/visionflow/tasks" className="mt-4 inline-block">
          <GlowButton variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4" />
            Back to Tasks
          </GlowButton>
        </Link>
      </div>
    );
  }

  // Define tabs for comments/activity
  const tabs: TabItem[] = [
    {
      id: 'comments',
      label: 'Comments',
      icon: MessageSquare,
      badge: task.comments?.length || 0,
      content: (
        <div className="space-y-4 p-6">
          {/* Comment Input */}
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-vision-gray-100 flex items-center justify-center ring-2 ring-white">
                <span className="text-sm font-medium text-vision-gray-700">You</span>
              </div>
            </div>
            <div className="flex-1">
              <GlowTextarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                placeholder="Add a comment..."
              />
              <GlowButton
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                size="sm"
                glow="medium"
                className="mt-3"
              >
                Comment
              </GlowButton>
            </div>
          </div>

          {/* Comments List */}
          {task.comments && task.comments.length > 0 ? (
            <div className="space-y-4 mt-6">
              {task.comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-vision-blue-50 flex items-center justify-center">
                      <span className="text-xs font-medium text-vision-blue-950">
                        {comment.user.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">
                        {comment.user.name}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-1 text-foreground">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No comments yet</p>
          )}
        </div>
      ),
    },
    {
      id: 'activity',
      label: 'Activity',
      icon: Activity,
      badge: task.activity?.length || 0,
      content: (
        <div className="space-y-4 p-6">
          {task.activity && task.activity.length > 0 ? (
            task.activity.map((activity) => (
              <div key={activity.id} className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-vision-gray-100 flex items-center justify-center">
                    <Activity className="h-4 w-4 text-vision-gray-700" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-foreground">
                    <span className="font-medium">
                      {activity.user?.name || 'System'}
                    </span>{' '}
                    {activity.action.toLowerCase()} this task
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(activity.created_at).toLocaleString()}
                  </p>
                  {activity.changes && (
                    <GlowCard variant="flat" padding="sm" className="mt-2 bg-muted">
                      <pre className="text-xs text-muted-foreground overflow-auto">
                        {JSON.stringify(activity.changes, null, 2)}
                      </pre>
                    </GlowCard>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-8">No activity yet</p>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <Link href="/visionflow/tasks">
              <GlowButton variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-5 w-5" />
              </GlowButton>
            </Link>
            {task.project && (
              <GlowBadge variant="outline" size="sm">
                {task.project.title}
              </GlowBadge>
            )}
          </div>

          {editing ? (
            <GlowInput
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              inputSize="lg"
              className="text-2xl font-semibold"
            />
          ) : (
            <h1 className="text-2xl font-semibold text-foreground">{task.title}</h1>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {editing ? (
            <>
              <GlowButton variant="outline" onClick={() => setEditing(false)} size="sm">
                <X className="h-4 w-4" />
                Cancel
              </GlowButton>
              <GlowButton
                onClick={handleSave}
                loading={saving}
                size="sm"
                glow="medium"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </GlowButton>
            </>
          ) : (
            <>
              <GlowButton variant="outline" onClick={() => setEditing(true)} size="sm">
                <Edit className="h-4 w-4" />
                Edit
              </GlowButton>
              <GlowButton variant="destructive" onClick={handleDelete} size="sm">
                <Trash2 className="h-4 w-4" />
                Delete
              </GlowButton>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <GlowCard variant="elevated" padding="lg" className="shadow-ambient-card">
            <h2 className="text-lg font-semibold text-foreground mb-4">Description</h2>
            {editing ? (
              <GlowTextarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                rows={6}
                placeholder="Add a description..."
              />
            ) : (
              <p className="text-foreground whitespace-pre-wrap">
                {task.description || <span className="text-muted-foreground italic">No description provided</span>}
              </p>
            )}
          </GlowCard>

          {/* Subtasks */}
          {task.subtasks && task.subtasks.length > 0 && (
            <GlowCard variant="elevated" padding="lg" className="shadow-ambient-card">
              <div className="flex items-center gap-2 mb-4">
                <CheckSquare className="h-5 w-5 text-foreground" />
                <h2 className="text-lg font-semibold text-foreground">
                  Subtasks ({task.subtasks.length})
                </h2>
              </div>
              <div className="space-y-2">
                {task.subtasks.map((subtask) => (
                  <div
                    key={subtask.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={subtask.status === 'COMPLETE'}
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                      readOnly
                    />
                    <Link
                      href={`/visionflow/tasks/${subtask.id}`}
                      className="flex-1 text-foreground hover:text-primary transition-colors"
                    >
                      {subtask.title}
                    </Link>
                    {subtask.priority && (
                      <GlowBadge variant="outline" size="sm">
                        {subtask.priority}
                      </GlowBadge>
                    )}
                  </div>
                ))}
              </div>
            </GlowCard>
          )}

          {/* Comments & Activity Tabs */}
          <GlowCard variant="elevated" className="shadow-ambient-card overflow-hidden p-0">
            <GlowTabs tabs={tabs} value={activeTab} onValueChange={setActiveTab} variant="default" />
          </GlowCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Priority */}
          <GlowCard variant="elevated" padding="lg" className="shadow-ambient-card space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Status
              </label>
              {editing ? (
                <GlowSelect
                  value={editedStatus}
                  onChange={(e) => setEditedStatus(e.target.value)}
                >
                  {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                    <option key={key} value={key}>
                      {config.label}
                    </option>
                  ))}
                </GlowSelect>
              ) : (
                <GlowBadge variant={STATUS_CONFIG[task.status].variant}>
                  {STATUS_CONFIG[task.status].label}
                </GlowBadge>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Priority
              </label>
              {editing ? (
                <GlowSelect
                  value={editedPriority}
                  onChange={(e) => setEditedPriority(e.target.value)}
                >
                  <option value="">None</option>
                  {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
                    <option key={key} value={key}>
                      {config.label}
                    </option>
                  ))}
                </GlowSelect>
              ) : (
                task.priority ? (
                  <GlowBadge variant={PRIORITY_CONFIG[task.priority].variant}>
                    {PRIORITY_CONFIG[task.priority].label}
                  </GlowBadge>
                ) : (
                  <span className="text-muted-foreground text-sm">None</span>
                )
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Due Date
              </label>
              {editing ? (
                <GlowInput
                  type="date"
                  value={editedDueDate}
                  onChange={(e) => setEditedDueDate(e.target.value)}
                  inputSize="sm"
                />
              ) : (
                <span className="text-foreground text-sm">
                  {task.due_date
                    ? new Date(task.due_date).toLocaleDateString()
                    : <span className="text-muted-foreground">Not set</span>}
                </span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Estimated Hours
              </label>
              {editing ? (
                <GlowInput
                  type="number"
                  value={editedEstimatedHours}
                  onChange={(e) => setEditedEstimatedHours(e.target.value)}
                  step="0.5"
                  min="0"
                  inputSize="sm"
                />
              ) : (
                <span className="text-foreground text-sm">
                  {task.estimated_hours ? `${task.estimated_hours}h` : <span className="text-muted-foreground">Not set</span>}
                </span>
              )}
            </div>
          </GlowCard>

          {/* Assignees */}
          <GlowCard variant="elevated" padding="lg" className="shadow-ambient-card">
            <h3 className="text-sm font-medium text-foreground mb-3">Assignees</h3>
            <TaskAssignments
              taskId={task.id}
              assignments={task.assignments || []}
              onAssignmentsChange={() => {
                loadTask();
              }}
            />
          </GlowCard>

          {/* Attachments */}
          {task.attachments && task.attachments.length > 0 && (
            <GlowCard variant="elevated" padding="lg" className="shadow-ambient-card">
              <div className="flex items-center gap-2 mb-3">
                <Paperclip className="h-4 w-4 text-foreground" />
                <h3 className="text-sm font-medium text-foreground">
                  Attachments ({task.attachments.length})
                </h3>
              </div>
              <div className="space-y-2">
                {task.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <Paperclip className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {attachment.file_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {attachment.file_size
                          ? `${(attachment.file_size / 1024).toFixed(1)} KB`
                          : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </GlowCard>
          )}

          {/* Metadata */}
          <GlowCard variant="flat" padding="md" className="text-sm space-y-2">
            <div>
              <span className="text-muted-foreground">Created:</span>
              <span className="ml-2 text-foreground">
                {new Date(task.created_at).toLocaleDateString()}
              </span>
            </div>
            {task.created_by_user && (
              <div>
                <span className="text-muted-foreground">Created by:</span>
                <span className="ml-2 text-foreground">
                  {task.created_by_user.name}
                </span>
              </div>
            )}
            <div>
              <span className="text-muted-foreground">Last updated:</span>
              <span className="ml-2 text-foreground">
                {new Date(task.updated_at).toLocaleDateString()}
              </span>
            </div>
          </GlowCard>
        </div>
      </div>
    </div>
  );
}
