'use client';

import * as React from 'react';
import {
  GlowBadge,
  GlowButton,
  GlowCard,
  GlowCardContent,
  GlowCardHeader,
  GlowCardTitle,
  GlowInput,
  GlowModal,
} from '@/components/glow-ui';
import { mockCohorts, mockGrantees } from '@/lib/mock-data';
import { getCurrentUser } from '@/lib/session';
import { isFunderAdmin } from '@/lib/auth';
import { format } from 'date-fns';

export default function AdminCohortsPage() {
  const currentUser = getCurrentUser();
  const canView = isFunderAdmin(currentUser.roleKey);
  const [cohorts, setCohorts] = React.useState(mockCohorts);
  const [createModalOpen, setCreateModalOpen] = React.useState(false);
  const [detailModalOpen, setDetailModalOpen] = React.useState(false);
  const [selectedCohortId, setSelectedCohortId] = React.useState<string | null>(null);
  const [cohortForm, setCohortForm] = React.useState({
    name: '',
    focus: '',
    memberCount: 10,
  });

  const selectedCohort = cohorts.find((cohort) => cohort.id === selectedCohortId);
  const cohortMembers = mockGrantees.filter((grantee) => grantee.cohortId === selectedCohortId);

  const handleCreateCohort = () => {
    if (!cohortForm.name) return;
    setCohorts((prev) => [
      {
        id: `cohort-${Date.now()}`,
        name: cohortForm.name,
        createdAt: new Date(),
        memberCount: cohortForm.memberCount,
        focus: cohortForm.focus || 'General',
      },
      ...prev,
    ]);
    setCohortForm({ name: '', focus: '', memberCount: 10 });
    setCreateModalOpen(false);
  };

  if (!canView) {
    return (
      <GlowCard>
        <GlowCardHeader>
          <GlowCardTitle>Cohorts</GlowCardTitle>
          <p className="text-sm text-muted-foreground">
            Cohort management is only available to funder admins. Contact your platform owner for access.
          </p>
        </GlowCardHeader>
      </GlowCard>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Cohorts</h1>
          <p className="text-sm text-muted-foreground">Group grantees for shared reporting and milestones.</p>
        </div>
        <GlowButton glow="subtle" onClick={() => setCreateModalOpen(true)}>
          Create cohort
        </GlowButton>
      </div>

      <GlowCard variant="interactive">
        <GlowCardHeader>
          <GlowCardTitle>Active cohorts</GlowCardTitle>
        </GlowCardHeader>
        <GlowCardContent className="space-y-3">
          {cohorts.map((cohort) => (
            <div
              key={cohort.id}
              className="rounded-lg border border-border p-3 shadow-ambient-card"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{cohort.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {cohort.memberCount} members · Created {format(cohort.createdAt, 'MMM d, yyyy')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <GlowBadge variant="outline" size="sm">
                    {cohort.focus}
                  </GlowBadge>
                  <GlowButton
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedCohortId(cohort.id);
                      setDetailModalOpen(true);
                    }}
                  >
                    View
                  </GlowButton>
                </div>
              </div>
            </div>
          ))}
        </GlowCardContent>
      </GlowCard>

      <GlowModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        title="Create cohort"
        description="Group grantees for shared tracking and reporting."
        size="lg"
        footer={
          <>
            <GlowButton variant="outline" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </GlowButton>
            <GlowButton glow="subtle" onClick={handleCreateCohort}>
              Create
            </GlowButton>
          </>
        }
      >
        <div className="space-y-4">
          <GlowInput
            label="Name"
            value={cohortForm.name}
            onChange={(event) => setCohortForm((prev) => ({ ...prev, name: event.target.value }))}
          />
          <GlowInput
            label="Focus"
            value={cohortForm.focus}
            onChange={(event) => setCohortForm((prev) => ({ ...prev, focus: event.target.value }))}
          />
          <GlowInput
            label="Starting members"
            type="number"
            value={cohortForm.memberCount}
            onChange={(event) =>
              setCohortForm((prev) => ({ ...prev, memberCount: Number(event.target.value) }))
            }
          />
        </div>
      </GlowModal>

      <GlowModal
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        title={selectedCohort?.name || 'Cohort details'}
        description="Assigned grantees and tools"
        size="lg"
      >
        {selectedCohort && (
          <div className="space-y-3">
            {cohortMembers.length === 0 && (
              <p className="text-sm text-muted-foreground">No members assigned yet.</p>
            )}
            {cohortMembers.map((grantee) => (
              <div key={grantee.id} className="rounded-lg border border-border p-3">
                <p className="text-sm font-semibold text-foreground">{grantee.name}</p>
                <p className="text-xs text-muted-foreground">
                  {grantee.focusArea} · Capacity score {grantee.capacityScore}
                </p>
              </div>
            ))}
          </div>
        )}
      </GlowModal>
    </div>
  );
}

