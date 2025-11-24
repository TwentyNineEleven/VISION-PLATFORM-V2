/**
 * VisionFlow Dashboard
 * Personal command center showing today's priorities, active projects, and AI insights
 */

'use client';

import { useEffect, useState } from 'react';

interface Task {
  id: string;
  title: string;
  status: string;
  priority?: string;
  due_date?: string;
  project?: {
    id: string;
    title: string;
  };
}

export default function VisionFlowDashboard() {
  const [loading, setLoading] = useState(true);
  const [tasksToday, setTasksToday] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        // TODO: Fetch dashboard data from API
        // For now, showing empty state
        setLoading(false);
      } catch (err) {
        console.error('Error loading dashboard:', err);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
          <p className="text-gray-600">Loading dashboard...</p>
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
      {/* Welcome Header */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">
          Good morning! 👋
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Here's what you need to focus on today
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">
            Tasks Due Today
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            0
          </dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">
            In Progress
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-blue-600">
            0
          </dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">
            Overdue
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-red-600">
            0
          </dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">
            Completed This Week
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-green-600">
            0
          </dd>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* My Day */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                My Day
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Tasks you need to complete today
              </p>
            </div>
            <div className="px-4 py-5 sm:p-6">
              {/* Empty State */}
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-semibold text-gray-900">
                  No tasks for today
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating a new task or plan
                </p>
                <div className="mt-6">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    <svg
                      className="-ml-0.5 h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                    </svg>
                    New Task
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-5">
          {/* AI Insights */}
          <div className="overflow-hidden rounded-lg bg-gradient-to-br from-purple-50 to-blue-50 shadow">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <svg
                  className="h-6 w-6 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                <h3 className="ml-3 text-base font-semibold text-gray-900">
                  AI Insights
                </h3>
              </div>
              <p className="mt-4 text-sm text-gray-700">
                Connect your first app to start receiving AI-powered
                recommendations for task management and project planning.
              </p>
            </div>
          </div>

          {/* Active Projects */}
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                Active Projects
              </h3>
              <p className="mt-4 text-sm text-gray-500">No active projects</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                Recent Activity
              </h3>
              <p className="mt-4 text-sm text-gray-500">No recent activity</p>
            </div>
          </div>
        </div>
      </div>

      {/* Setup Guide */}
      <div className="rounded-lg bg-blue-50 p-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-6 w-6 text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-blue-800">
              Getting Started with VisionFlow
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                VisionFlow is ready to use! To activate database features, run
                the migrations documented in{' '}
                <code className="rounded bg-blue-100 px-1.5 py-0.5 font-mono text-xs">
                  VISIONFLOW_SETUP.md
                </code>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
