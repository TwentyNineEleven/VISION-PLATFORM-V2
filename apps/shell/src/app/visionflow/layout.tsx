/**
 * VisionFlow Layout
 * Provides top navigation for all VisionFlow pages
 * No left sidebar - uses top tabs only per AppShell architecture
 * Uses Glow UI design system and 2911 Bold Color System
 */

'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CreateTaskModal } from '@/components/visionflow/CreateTaskModal';
import { GlowButton } from '@/components/glow-ui/GlowButton';
import { Plus, Lightbulb } from 'lucide-react';

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
  const router = useRouter();
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);

  const isActiveTab = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleTaskCreated = (task: any) => {
    // Navigate to the tasks page after successful creation
    router.push('/visionflow/tasks');
  };

  return (
    <>
      <div className="flex h-full flex-col">
        {/* Top Navigation */}
        <div className="border-b border-border bg-background shadow-ambient-card">
          <div className="px-6">
            {/* App Title */}
            <div className="flex items-center justify-between border-b border-border pb-4 pt-6">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">
                  VisionFlow
                </h1>
                <p className="text-sm text-muted-foreground">
                  Task Management & Project Execution
                </p>
              </div>
              <div className="flex gap-3">
                <GlowButton
                  variant="outline"
                  size="default"
                  onClick={() => setShowCreateTaskModal(true)}
                >
                  <Plus className="h-4 w-4" />
                  New Task
                </GlowButton>
                <GlowButton
                  variant="default"
                  size="default"
                  glow="medium"
                  className="bg-vision-purple-700 hover:bg-vision-purple-900"
                >
                  <Lightbulb className="h-4 w-4" />
                  AI Plan Builder
                </GlowButton>
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
                      rounded-t-lg px-4 py-2.5 text-sm font-medium transition-all
                      ${
                        active
                          ? 'bg-muted text-primary shadow-glow-primary-sm'
                          : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
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
        <div className="flex-1 overflow-y-auto bg-background">
          <div className="mx-auto max-w-7xl p-6">{children}</div>
        </div>
      </div>

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={showCreateTaskModal}
        onClose={() => setShowCreateTaskModal(false)}
        onSuccess={handleTaskCreated}
      />
    </>
  );
}
