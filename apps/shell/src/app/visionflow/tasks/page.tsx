/**
 * VisionFlow Tasks Page
 * Comprehensive task list with filtering, search, and quick actions
 * Phase 1: Task Management
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'BLOCKED' | 'COMPLETE' | 'CANCELLED';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  due_date?: string;
  project?: {
    id: string;
    title: string;
  };
  assignments?: Array<{
    user: {
      name: string;
      email: string;
      avatar_url?: string;
    };
  }>;
}

const STATUS_COLORS = {
  NOT_STARTED: 'bg-gray-100 text-gray-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  BLOCKED: 'bg-red-100 text-red-700',
  COMPLETE: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-gray-100 text-gray-500',
};

const PRIORITY_COLORS = {
  LOW: 'bg-gray-100 text-gray-600',
  MEDIUM: 'bg-yellow-100 text-yellow-700',
  HIGH: 'bg-orange-100 text-orange-700',
  URGENT: 'bg-red-100 text-red-700',
};

export default function VisionFlowTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  useEffect(() => {
    async function loadTasks() {
      try {
        setLoading(true);
        // TODO: Fetch tasks from API
        // const response = await fetch('/api/v1/apps/visionflow/tasks');
        // const data = await response.json();
        // setTasks(data.tasks);
        setTasks([]);
        setLoading(false);
      } catch (err) {
        console.error('Error loading tasks:', err);
        setError('Failed to load tasks');
        setLoading(false);
      }
    }

    loadTasks();
  }, [statusFilter, priorityFilter]);

  const filteredTasks = tasks.filter((task) => {
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (statusFilter !== 'all' && task.status !== statusFilter) {
      return false;
    }
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) {
      return false;
    }
    return true;
  });

  const groupTasksByDueDate = (tasks: Task[]) => {
    const overdue: Task[] = [];
    const today: Task[] = [];
    const thisWeek: Task[] = [];
    const later: Task[] = [];

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    tasks.forEach((task) => {
      if (!task.due_date) {
        later.push(task);
        return;
      }

      const dueDate = new Date(task.due_date);
      const dueDateStr = dueDate.toISOString().split('T')[0];

      if (dueDateStr < todayStr && task.status !== 'COMPLETE') {
        overdue.push(task);
      } else if (dueDateStr === todayStr) {
        today.push(task);
      } else if (dueDate <= weekFromNow) {
        thisWeek.push(task);
      } else {
        later.push(task);
      }
    });

    return { overdue, today, thisWeek, later };
  };

  const groupedTasks = groupTasksByDueDate(filteredTasks);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
          <p className="text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
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
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">My Tasks</h2>
          <p className="mt-1 text-sm text-gray-600">
            {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        {/* Search */}
        <div className="flex-1 min-w-[300px]">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full rounded-lg border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="all">All Statuses</option>
          <option value="NOT_STARTED">Not Started</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="BLOCKED">Blocked</option>
          <option value="COMPLETE">Complete</option>
        </select>

        {/* Priority Filter */}
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="rounded-lg border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="all">All Priorities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </select>
      </div>

      {/* Task Groups */}
      <div className="space-y-6">
        {/* Overdue */}
        {groupedTasks.overdue.length > 0 && (
          <TaskGroup title="Overdue" tasks={groupedTasks.overdue} color="red" />
        )}

        {/* Today */}
        {groupedTasks.today.length > 0 && (
          <TaskGroup title="Today" tasks={groupedTasks.today} color="blue" />
        )}

        {/* This Week */}
        {groupedTasks.thisWeek.length > 0 && (
          <TaskGroup title="This Week" tasks={groupedTasks.thisWeek} color="gray" />
        )}

        {/* Later */}
        {groupedTasks.later.length > 0 && (
          <TaskGroup title="Later" tasks={groupedTasks.later} color="gray" />
        )}

        {/* Empty State */}
        {filteredTasks.length === 0 && (
          <div className="rounded-lg bg-white p-12 text-center shadow">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No tasks</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first task
            </p>
            <div className="mt-6">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
              >
                <svg className="-ml-0.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                </svg>
                New Task
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Setup Notice */}
      <div className="rounded-lg bg-blue-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm text-blue-700">
              To start creating tasks, complete the database setup in{' '}
              <code className="rounded bg-blue-100 px-1.5 py-0.5 font-mono text-xs">
                VISIONFLOW_SETUP.md
              </code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Task Group Component
function TaskGroup({
  title,
  tasks,
  color,
}: {
  title: string;
  tasks: Task[];
  color: string;
}) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-gray-700">
        {title} ({tasks.length})
      </h3>
      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center gap-4 rounded-lg bg-white p-4 shadow hover:shadow-md transition-shadow"
          >
            <input
              type="checkbox"
              className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              checked={task.status === 'COMPLETE'}
              readOnly
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Link
                  href={`/visionflow/tasks/${task.id}`}
                  className="font-medium text-gray-900 hover:text-blue-600"
                >
                  {task.title}
                </Link>
                {task.priority && (
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      PRIORITY_COLORS[task.priority]
                    }`}
                  >
                    {task.priority}
                  </span>
                )}
              </div>
              {task.project && (
                <p className="mt-1 text-sm text-gray-500">{task.project.title}</p>
              )}
            </div>
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                STATUS_COLORS[task.status]
              }`}
            >
              {task.status.replace('_', ' ')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
