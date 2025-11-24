/**
 * VisionFlow Layout
 * Provides top navigation for all VisionFlow pages
 * No left sidebar - uses top tabs only per AppShell architecture
 */

'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface VisionFlowTab {
  id: string;
  label: string;
  href: string;
}

const visionflowTabs: VisionFlowTab[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/visionflow/dashboard' },
  { id: 'tasks', label: 'Tasks', href: '/visionflow/tasks' },
  { id: 'plans', label: 'Plans', href: '/visionflow/plans' },
  { id: 'projects', label: 'Projects', href: '/visionflow/projects' },
  { id: 'workflows', label: 'Workflows', href: '/visionflow/workflows' },
  { id: 'calendar', label: 'Calendar', href: '/visionflow/calendar' },
];

export default function VisionFlowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActiveTab = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Top Navigation */}
      <div className="border-b border-gray-200 bg-white">
        <div className="px-6">
          {/* App Title */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-4 pt-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                VisionFlow
              </h1>
              <p className="text-sm text-gray-600">
                Task Management & Project Execution
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                New Task
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                AI Plan Builder
              </button>
            </div>
          </div>

          {/* Tabs */}
          <nav className="flex gap-1 pt-2" aria-label="VisionFlow navigation">
            {visionflowTabs.map((tab) => {
              const active = isActiveTab(tab.href);
              return (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className={`
                    rounded-t-lg px-4 py-2.5 text-sm font-medium transition-colors
                    ${
                      active
                        ? 'bg-gray-100 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                  aria-current={active ? 'page' : undefined}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Page Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="mx-auto max-w-7xl p-6">{children}</div>
      </div>
    </div>
  );
}
