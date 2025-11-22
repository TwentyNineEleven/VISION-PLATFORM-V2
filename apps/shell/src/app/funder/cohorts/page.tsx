'use client';

import * as React from 'react';
import {
  GlowCard,
  GlowCardContent,
  GlowCardHeader,
  GlowCardTitle,
  GlowCardDescription,
} from '@/components/glow-ui/GlowCard';
import { GlowBadge, GlowButton, GlowInput, GlowModal, GlowModalClose } from '@/components/glow-ui';
import { ConfirmDialog } from '@/components/settings/ConfirmDialog';
import { mockApps, mockCohorts, mockGrantees } from '@/lib/mock-data';
import { CalendarClock, Users, Plus, Pencil, Trash2 } from 'lucide-react';

export default function FunderCohortsPage() {
  const [createModalOpen, setCreateModalOpen] = React.useState(false);
  const [newCohortName, setNewCohortName] = React.useState('');
  const [newCohortFocus, setNewCohortFocus] = React.useState('');

  const cohorts = React.useMemo(
    () =>
      mockCohorts.map((cohort) => {
        const members = mockGrantees.filter((grantee) => grantee.cohortId === cohort.id);
        const avgHealth = members.length
          ? Math.round(members.reduce((sum, grantee) => sum + grantee.capacityScore, 0) / members.length)
          : 0;
        return { ...cohort, members, avgHealth };
      }),
    []
  );

  return (
    <>
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-sm font-medium text-primary">Funder</p>
            <h1 className="text-3xl font-semibold text-foreground">Cohorts</h1>
            <p className="text-sm text-muted-foreground">
              Organize grantees into cohorts for learning, pilots, and capacity building.
            </p>
          </div>
          <GlowButton glow="subtle" leftIcon={<Plus className="h-4 w-4" />} onClick={() => setCreateModalOpen(true)}>
            New cohort
          </GlowButton>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cohorts.map((cohort) => (
            <GlowCard key={cohort.id} variant="interactive" padding="md" className="h-full">
              <GlowCardHeader className="space-y-1">
                <GlowCardTitle className="text-lg">{cohort.name}</GlowCardTitle>
                <GlowCardDescription>{cohort.focus}</GlowCardDescription>
              </GlowCardHeader>
              <GlowCardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {cohort.memberCount} members
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <CalendarClock className="h-4 w-4" />
                    {cohort.createdAt.toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <GlowBadge variant="outline" size="sm">
                    Avg health {cohort.avgHealth}%
                  </GlowBadge>
                  <span className="text-xs text-muted-foreground">{cohort.members.length} active</span>
                </div>
                <div className="flex -space-x-2">
                  {cohort.members.slice(0, 4).map((member) => (
                    <div
                      key={member.id}
                      className="w-8 h-8 rounded-full bg-primary/10 border border-white flex items-center justify-center text-xs font-semibold text-primary"
                    >
                      {member.name.charAt(0)}
                    </div>
                  ))}
                  {cohort.members.length > 4 && (
                    <div className="w-8 h-8 rounded-full bg-muted border border-white flex items-center justify-center text-xs text-muted-foreground">
                      +{cohort.members.length - 4}
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <GlowButton variant="ghost" size="sm" leftIcon={<Pencil className="h-4 w-4" />}>
                    Edit
                  </GlowButton>
                  <ConfirmDialog
                    title="Delete cohort"
                    description={`Delete ${cohort.name}? Members will remain active but lose cohort context.`}
                    triggerLabel="Delete"
                    triggerVariant="ghost"
                    triggerSize="sm"
                    triggerLeftIcon={<Trash2 className="h-4 w-4" />}
                    onConfirm={() => console.log('delete cohort', cohort.id)}
                  />
                </div>
              </GlowCardContent>
            </GlowCard>
          ))}
        </div>
      </div>

      <GlowModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        title="Create cohort"
        description="Define the cohort name and focus area. You can add members later."
        size="lg"
        footer={
          <>
            <GlowModalClose asChild>
              <GlowButton variant="outline">Cancel</GlowButton>
            </GlowModalClose>
            <GlowButton
              glow="subtle"
              onClick={() => {
                setCreateModalOpen(false);
                setNewCohortName('');
                setNewCohortFocus('');
              }}
            >
              Create cohort
            </GlowButton>
          </>
        }
      >
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Cohort name</label>
            <GlowInput
              placeholder="Innovation Lab 2025"
              value={newCohortName}
              onChange={(e) => setNewCohortName(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Focus area</label>
            <GlowInput
              placeholder="Capacity building for youth programs"
              value={newCohortFocus}
              onChange={(e) => setNewCohortFocus(e.target.value)}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            After creating the cohort you’ll be able to add members, assign facilitators, and track shared outcomes.
          </p>
        </div>
      </GlowModal>
    </>
  );
}
