'use client';

/**
 * App Detail Drawer Component
 * 
 * Right-side drawer showing complete app details.
 * Opens when user clicks "View details" on an app card.
 * 
 * Uses Glow UI drawer pattern with 480-640px width.
 */

import * as React from 'react';
import { X, Clock, Users, Link2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AppMetadata } from '@/lib/app-catalog-types';
import { AppIcon } from '@/components/apps/AppIcon';
import { phaseColorMap, phaseLabels, type Phase } from '@/lib/phase-colors';

export interface AppDetailDrawerProps {
  app: AppMetadata | null;
  isOpen: boolean;
  onClose: () => void;
  onLaunch?: (app: AppMetadata) => void;
}

export function AppDetailDrawer({
  app,
  isOpen,
  onClose,
  onLaunch,
}: AppDetailDrawerProps) {
  const phase: Phase = (app?.phase || app?.transformationArea || 'OPERATE') as Phase;
  const phaseColor = phaseColorMap[phase];
  const phaseLabel = phaseLabels[phase] || phase;

  if (!app) return null;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          'fixed right-0 top-0 z-50 h-full w-full max-w-[640px] bg-white shadow-2xl transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex h-full flex-col overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#E2E8F0] px-6 py-4">
            <h2 className="text-xl font-bold text-[#1F2937]">App Details</h2>
            <button
              onClick={onClose}
              className="flex items-center justify-center rounded-lg p-2 text-[#64748B] transition-colors hover:bg-[#F1F5F9]"
              aria-label="Close drawer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 px-6 py-6">
            <div className="space-y-6">
              {/* Icon + App Name + Module Tag */}
              <div className="flex items-start gap-4">
                <AppIcon app={app} size="lg" className="shadow-none" />
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <h3 className="text-2xl font-bold text-[#1F2937]">
                      {app.name}
                    </h3>
                    <span
                      className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white"
                      style={{
                        backgroundColor: phaseColor,
                      }}
                    >
                      {phaseLabel.toUpperCase().replace(/\s+/g, ' ')}
                    </span>
                  </div>
                  <p className="text-base text-[#64748B] leading-relaxed">
                    {app.description}
                  </p>
                </div>
              </div>

              {/* Open App Button */}
              <button
                onClick={() => {
                  onLaunch?.(app);
                  onClose();
                }}
                className="w-full rounded-lg bg-[#0047AB] px-4 py-3 text-base font-semibold text-white transition-all hover:bg-[#1E3A8A] hover:shadow-md"
              >
                Open App
              </button>

              {/* What this tool is for */}
              <div>
                <h4 className="mb-2 text-sm font-semibold text-[#1F2937]">
                  What this tool is for
                </h4>
                <p className="text-sm text-[#64748B] leading-relaxed">
                  {app.description}
                </p>
              </div>

              {/* Inputs Required */}
              <div>
                <h4 className="mb-2 text-sm font-semibold text-[#1F2937]">
                  Inputs Required
                </h4>
                <ul className="space-y-1 text-sm text-[#64748B]">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#0047AB]" />
                    <span>Organization information and context</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#0047AB]" />
                    <span>Relevant documents and data</span>
                  </li>
                </ul>
              </div>

              {/* Outputs Generated */}
              <div>
                <h4 className="mb-2 text-sm font-semibold text-[#1F2937]">
                  Outputs Generated
                </h4>
                <ul className="space-y-1 text-sm text-[#64748B]">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#047857]" />
                    <span>Structured deliverables and reports</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#047857]" />
                    <span>Actionable insights and recommendations</span>
                  </li>
                </ul>
              </div>

              {/* Audiences */}
              {app.audiences && app.audiences.length > 0 && (
                <div>
                  <h4 className="mb-2 text-sm font-semibold text-[#1F2937]">
                    Best for
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {app.audiences.map((audience, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-[#F1F5F9] px-3 py-1.5 text-xs font-medium text-[#64748B]"
                      >
                        {audience}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Focus Tags */}
              {app.focusTags && app.focusTags.length > 0 && (
                <div>
                  <h4 className="mb-2 text-sm font-semibold text-[#1F2937]">
                    Focus Areas
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {app.focusTags.map((tag, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-[#F1F5F9] px-3 py-1.5 text-xs font-medium text-[#64748B]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Connected Apps */}
              {app.connectedApps && app.connectedApps.length > 0 && (
                <div>
                  <h4 className="mb-2 text-sm font-semibold text-[#1F2937]">
                    Works well with
                  </h4>
                  <div className="space-y-2">
                    {app.connectedApps.map((connectedAppId) => (
                      <div
                        key={connectedAppId}
                        className="flex items-center gap-2 text-sm text-[#0047AB]"
                      >
                        <Link2 size={16} />
                        <span>{connectedAppId}</span>
                        <ArrowRight size={14} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Time to Complete */}
              {app.timeToComplete && (
                <div className="flex items-center gap-2 text-sm text-[#64748B]">
                  <Clock size={16} />
                  <span>{app.timeToComplete}</span>
                </div>
              )}

              {/* Status Tags */}
              <div className="flex flex-wrap gap-2">
                {app.status === 'beta' && (
                  <span className="rounded px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-[#C2410C] bg-[#FFEDD5]">
                    Beta
                  </span>
                )}
                {app.status === 'coming-soon' && (
                  <span className="rounded px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-[#C2410C] bg-[#FFEDD5]">
                    Coming Soon
                  </span>
                )}
                {app.access === 'Requires Upgrade' && (
                  <span className="rounded px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-[#6D28D9] bg-[#EDE9FE]">
                    Upgrade Required
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
