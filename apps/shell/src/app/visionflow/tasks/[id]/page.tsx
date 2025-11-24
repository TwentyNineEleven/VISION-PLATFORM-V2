/**
 * VisionFlow Task Detail Page
 * Comprehensive task view with editing, comments, activity, and attachments
 * Phase 1: Task Management
 */

'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TaskAssignments } from '@/components/visionflow/TaskAssignments';

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
    assigned_to: string;
    role?: string;
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

const STATUS_OPTIONS = [
  { value: 'NOT_STARTED', label: 'Not Started', color: 'gray' },
  { value: 'IN_PROGRESS', label: 'In Progress', color: 'blue' },
  { value: 'BLOCKED', label: 'Blocked', color: 'red' },
  { value: 'COMPLETE', label: 'Complete', color: 'green' },
  { value: 'CANCELLED', label: 'Cancelled', color: 'gray' },
];

const PRIORITY_OPTIONS = [
  { value: 'LOW', label: 'Low', color: 'gray' },
  { value: 'MEDIUM', label: 'Medium', color: 'yellow' },
  { value: 'HIGH', label: 'High', color: 'orange' },
  { value: 'URGENT', label: 'Urgent', color: 'red' },
];

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
  const [activeTab, setActiveTab] = useState<'comments' | 'activity'>('comments');

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
      // const response = await fetch(`/api/v1/apps/visionflow/tasks/${id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     title: editedTitle,
      //     description: editedDescription,
      //     status: editedStatus,
      //     priority: editedPriority,
      //     due_date: editedDueDate,
      //     estimated_hours: editedEstimatedHours ? parseFloat(editedEstimatedHours) : null,
      //   }),
      // });
      // const data = await response.json();
      // setTask(data.task);
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
      // const response = await fetch(`/api/v1/apps/visionflow/tasks/${id}/comments`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ content: newComment }),
      // });
      // const data = await response.json();
      // Reload task to show new comment
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
      // await fetch(`/api/v1/apps/visionflow/tasks/${id}`, { method: 'DELETE' });
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
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 mx-auto"></div>
          <p className="text-gray-600">Loading task...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-6">
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
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="mt-2 text-sm text-red-700">{error}</p>
            <div className="mt-4">
              <Link
                href="/visionflow/tasks"
                className="text-sm font-medium text-red-800 hover:text-red-900"
              >
                ← Back to Tasks
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Task not found</p>
        <Link
          href="/visionflow/tasks"
          className="mt-4 inline-block text-blue-600 hover:text-blue-700"
        >
          ← Back to Tasks
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Link
              href="/visionflow/tasks"
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
            {task.project && (
              <span className="text-sm text-gray-500">
                {task.project.title}
              </span>
            )}
          </div>

          {editing ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="text-2xl font-semibold text-gray-900 border-b-2 border-blue-600 focus:outline-none w-full"
            />
          ) : (
            <h1 className="text-2xl font-semibold text-gray-900">{task.title}</h1>
          )}
        </div>

        <div className="flex items-center gap-2">
          {editing ? (
            <>
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-lg hover:bg-red-50"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
            {editing ? (
              <textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                rows={6}
                className="w-full border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                placeholder="Add a description..."
              />
            ) : (
              <p className="text-gray-700 whitespace-pre-wrap">
                {task.description || 'No description provided'}
              </p>
            )}
          </div>

          {/* Subtasks */}
          {task.subtasks && task.subtasks.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Subtasks ({task.subtasks.length})
              </h2>
              <div className="space-y-2">
                {task.subtasks.map((subtask) => (
                  <div
                    key={subtask.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={subtask.status === 'COMPLETE'}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600"
                      readOnly
                    />
                    <Link
                      href={`/visionflow/tasks/${subtask.id}`}
                      className="flex-1 text-gray-900 hover:text-blue-600"
                    >
                      {subtask.title}
                    </Link>
                    {subtask.priority && (
                      <span className="text-xs text-gray-500">{subtask.priority}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comments & Activity */}
          <div className="bg-white rounded-lg shadow">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex gap-8 px-6" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('comments')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'comments'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Comments ({task.comments?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab('activity')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'activity'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Activity ({task.activity?.length || 0})
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'comments' ? (
                <div className="space-y-4">
                  {/* Comment Input */}
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">You</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={3}
                        className="w-full border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Add a comment..."
                      />
                      <button
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                        className="mt-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        Comment
                      </button>
                    </div>
                  </div>

                  {/* Comments List */}
                  {task.comments && task.comments.length > 0 ? (
                    <div className="space-y-4 mt-6">
                      {task.comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                          <div className="flex-shrink-0">
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-xs font-medium text-gray-600">
                                {comment.user.name.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900">
                                {comment.user.name}
                              </span>
                              <span className="text-sm text-gray-500">
                                {new Date(comment.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="mt-1 text-gray-700">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-8">No comments yet</p>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {task.activity && task.activity.length > 0 ? (
                    task.activity.map((activity) => (
                      <div key={activity.id} className="flex gap-3">
                        <div className="flex-shrink-0">
                          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <svg
                              className="h-4 w-4 text-gray-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-700">
                            <span className="font-medium">
                              {activity.user?.name || 'System'}
                            </span>{' '}
                            {activity.action.toLowerCase()} this task
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(activity.created_at).toLocaleString()}
                          </p>
                          {activity.changes && (
                            <pre className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded">
                              {JSON.stringify(activity.changes, null, 2)}
                            </pre>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-8">No activity yet</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Priority */}
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              {editing ? (
                <select
                  value={editedStatus}
                  onChange={(e) => setEditedStatus(e.target.value)}
                  className="w-full border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${STATUS_OPTIONS.find(o => o.value === task.status)?.color || 'gray'}-100 text-${STATUS_OPTIONS.find(o => o.value === task.status)?.color || 'gray'}-700`}>
                  {STATUS_OPTIONS.find(o => o.value === task.status)?.label}
                </span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              {editing ? (
                <select
                  value={editedPriority}
                  onChange={(e) => setEditedPriority(e.target.value)}
                  className="w-full border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">None</option>
                  {PRIORITY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="text-gray-900">
                  {task.priority ? PRIORITY_OPTIONS.find(o => o.value === task.priority)?.label : 'None'}
                </span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              {editing ? (
                <input
                  type="date"
                  value={editedDueDate}
                  onChange={(e) => setEditedDueDate(e.target.value)}
                  className="w-full border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                />
              ) : (
                <span className="text-gray-900">
                  {task.due_date
                    ? new Date(task.due_date).toLocaleDateString()
                    : 'Not set'}
                </span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Hours
              </label>
              {editing ? (
                <input
                  type="number"
                  value={editedEstimatedHours}
                  onChange={(e) => setEditedEstimatedHours(e.target.value)}
                  step="0.5"
                  min="0"
                  className="w-full border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                />
              ) : (
                <span className="text-gray-900">
                  {task.estimated_hours ? `${task.estimated_hours}h` : 'Not set'}
                </span>
              )}
            </div>
          </div>

          {/* Assignees */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Assignees</h3>
            <TaskAssignments
              taskId={task.id}
              assignments={task.assignments || []}
              onAssignmentsChange={() => {
                // Reload task data when assignments change
                loadTask();
              }}
            />
          </div>

          {/* Attachments */}
          {task.attachments && task.attachments.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Attachments ({task.attachments.length})
              </h3>
              <div className="space-y-2">
                {task.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50"
                  >
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                      />
                    </svg>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {attachment.file_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {attachment.file_size
                          ? `${(attachment.file_size / 1024).toFixed(1)} KB`
                          : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="bg-white rounded-lg shadow p-6 text-sm">
            <div className="space-y-2">
              <div>
                <span className="text-gray-500">Created:</span>
                <span className="ml-2 text-gray-900">
                  {new Date(task.created_at).toLocaleDateString()}
                </span>
              </div>
              {task.created_by_user && (
                <div>
                  <span className="text-gray-500">Created by:</span>
                  <span className="ml-2 text-gray-900">
                    {task.created_by_user.name}
                  </span>
                </div>
              )}
              <div>
                <span className="text-gray-500">Last updated:</span>
                <span className="ml-2 text-gray-900">
                  {new Date(task.updated_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
