'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  GlowBadge,
  GlowButton,
  GlowCard,
  GlowCardContent,
  GlowCardHeader,
  GlowCardTitle,
  GlowInput,
  GlowModal,
  GlowSelect,
} from '@/components/glow-ui';
import {
  mockAdminOrganizations,
  type AdminOrganization,
  type OrganizationKind,
  type OrganizationPlan,
} from '@/lib/mock-admin';
import { canImpersonate } from '@/lib/auth';
import { getCurrentUser } from '@/lib/session';
import { Building2, User, MapPin } from 'lucide-react';

const organizationTypes: OrganizationKind[] = ['Nonprofit', 'Funder', 'Consultant'];
const organizationPlans: OrganizationPlan[] = ['Free', 'Pro', 'Enterprise'];

export default function AdminOrganizationsPage() {
  const currentUser = getCurrentUser();
  const [organizations, setOrganizations] = React.useState<AdminOrganization[]>(mockAdminOrganizations);
  const [search, setSearch] = React.useState('');
  const [planFilter, setPlanFilter] = React.useState<OrganizationPlan | 'all'>('all');
  const [createModalOpen, setCreateModalOpen] = React.useState(false);
  const [detailModalOpen, setDetailModalOpen] = React.useState(false);
  const [selectedOrg, setSelectedOrg] = React.useState<AdminOrganization | null>(null);
  const [creatingOrg, setCreatingOrg] = React.useState({
    name: '',
    type: 'Nonprofit' as OrganizationKind,
    plan: 'Pro' as OrganizationPlan,
    contactName: '',
    contactEmail: '',
    notes: '',
  });

  const filteredOrganizations = organizations.filter((org) => {
    const matchesSearch =
      !search ||
      org.name.toLowerCase().includes(search.toLowerCase()) ||
      org.primaryContact.email.toLowerCase().includes(search.toLowerCase());
    const matchesPlan = planFilter === 'all' || org.plan === planFilter;
    return matchesSearch && matchesPlan;
  });

  const handleCreateOrganization = () => {
    if (!creatingOrg.name.trim()) return;
    const newOrg: AdminOrganization = {
      id: `org-${Date.now()}`,
      name: creatingOrg.name.trim(),
      type: creatingOrg.type,
      plan: creatingOrg.plan,
      status: 'active',
      region: 'Unassigned',
      activeApps: 0,
      userCount: 0,
      primaryContact: {
        name: creatingOrg.contactName || 'Pending',
        email: creatingOrg.contactEmail || 'pending@example.com',
      },
      notes: creatingOrg.notes,
      lastActive: new Date(),
      tags: [],
      riskLevel: 'low',
    };
    setOrganizations((prev) => [newOrg, ...prev]);
    setCreatingOrg({
      name: '',
      type: 'Nonprofit',
      plan: 'Pro',
      contactName: '',
      contactEmail: '',
      notes: '',
    });
    setCreateModalOpen(false);
  };

  const openDetail = (org: AdminOrganization) => {
    setSelectedOrg(org);
    setDetailModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Organizations</h1>
          <p className="text-sm text-muted-foreground">
            Provision, review, and troubleshoot every workspace on VISION.
          </p>
        </div>
        <GlowButton glow="subtle" onClick={() => setCreateModalOpen(true)} leftIcon={<Building2 className="h-4 w-4" />}>
          Create organization
        </GlowButton>
      </div>

      <GlowCard variant="interactive">
        <GlowCardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <GlowCardTitle>Directory</GlowCardTitle>
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <GlowInput
              placeholder="Search by name or email"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <GlowSelect
              value={planFilter}
              onChange={(event) => setPlanFilter(event.target.value as OrganizationPlan | 'all')}
            >
              <option value="all">All plans</option>
              {organizationPlans.map((plan) => (
                <option key={plan} value={plan}>
                  {plan}
                </option>
              ))}
            </GlowSelect>
          </div>
        </GlowCardHeader>

        <GlowCardContent className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-3 py-2 font-semibold">Organization</th>
                <th className="px-3 py-2 font-semibold">Type</th>
                <th className="px-3 py-2 font-semibold">Plan</th>
                <th className="px-3 py-2 font-semibold">Active apps</th>
                <th className="px-3 py-2 font-semibold">Users</th>
                <th className="px-3 py-2 font-semibold">Status</th>
                <th className="px-3 py-2 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredOrganizations.map((org) => (
                <tr key={org.id} className="hover:bg-muted/40">
                  <td className="px-3 py-3">
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground">{org.name}</span>
                      <span className="text-xs text-muted-foreground">{org.primaryContact.email}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3">{org.type}</td>
                  <td className="px-3 py-3">
                    <GlowBadge variant={org.plan === 'Enterprise' ? 'success' : org.plan === 'Pro' ? 'info' : 'default'}>
                      {org.plan}
                    </GlowBadge>
                  </td>
                  <td className="px-3 py-3">{org.activeApps}</td>
                  <td className="px-3 py-3">{org.userCount}</td>
                  <td className="px-3 py-3">
                    <GlowBadge variant={org.status === 'active' ? 'success' : 'warning'}>{org.status}</GlowBadge>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-2">
                      <GlowButton variant="outline" size="sm" onClick={() => openDetail(org)}>
                        View
                      </GlowButton>
                      <GlowButton asChild variant="ghost" size="sm">
                        <Link href={`/dashboard/admin/apps?orgId=${org.id}` as any}>Manage apps</Link>
                      </GlowButton>
                      <GlowButton
                        variant="ghost"
                        size="sm"
                        disabled={!canImpersonate(currentUser.roleKey)}
                      >
                        Impersonate
                      </GlowButton>
                    </div>
                  </td>
                </tr>
              ))}
              {!filteredOrganizations.length && (
                <tr>
                  <td colSpan={7} className="px-3 py-6 text-center text-sm text-muted-foreground">
                    No organizations match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </GlowCardContent>
      </GlowCard>

      <GlowModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        title="Create organization"
        description="Provision a new workspace with default permissions and apps."
        size="lg"
        footer={
          <>
            <GlowButton variant="outline" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </GlowButton>
            <GlowButton glow="subtle" onClick={handleCreateOrganization}>
              Create
            </GlowButton>
          </>
        }
      >
        <div className="grid gap-4 md:grid-cols-2">
          <GlowInput
            label="Organization name"
            placeholder="e.g., Beacon Literacy Lab"
            value={creatingOrg.name}
            onChange={(event) => setCreatingOrg((prev) => ({ ...prev, name: event.target.value }))}
          />
          <GlowSelect
            label="Type"
            value={creatingOrg.type}
            onChange={(event) =>
              setCreatingOrg((prev) => ({ ...prev, type: event.target.value as OrganizationKind }))
            }
          >
            {organizationTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </GlowSelect>
          <GlowSelect
            label="Plan"
            value={creatingOrg.plan}
            onChange={(event) =>
              setCreatingOrg((prev) => ({ ...prev, plan: event.target.value as OrganizationPlan }))
            }
          >
            {organizationPlans.map((plan) => (
              <option key={plan} value={plan}>
                {plan}
              </option>
            ))}
          </GlowSelect>
          <GlowInput
            label="Primary contact"
            placeholder="Contact name"
            value={creatingOrg.contactName}
            onChange={(event) =>
              setCreatingOrg((prev) => ({ ...prev, contactName: event.target.value }))
            }
          />
          <GlowInput
            label="Contact email"
            type="email"
            value={creatingOrg.contactEmail}
            onChange={(event) =>
              setCreatingOrg((prev) => ({ ...prev, contactEmail: event.target.value }))
            }
          />
          <div className="md:col-span-2">
            <GlowInput
              label="Notes"
              placeholder="Internal notes"
              value={creatingOrg.notes}
              onChange={(event) => setCreatingOrg((prev) => ({ ...prev, notes: event.target.value }))}
            />
          </div>
        </div>
      </GlowModal>

      <GlowModal
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        title={selectedOrg?.name}
        description="Workspace overview"
        size="lg"
      >
        {selectedOrg && (
          <div className="space-y-4 text-sm">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-border p-3">
                <p className="text-xs uppercase text-muted-foreground">Plan</p>
                <p className="text-base font-semibold text-foreground">{selectedOrg.plan}</p>
              </div>
              <div className="rounded-lg border border-border p-3">
                <p className="text-xs uppercase text-muted-foreground">Active apps</p>
                <p className="text-base font-semibold text-foreground">{selectedOrg.activeApps}</p>
              </div>
              <div className="rounded-lg border border-border p-3">
                <p className="text-xs uppercase text-muted-foreground">Members</p>
                <p className="text-base font-semibold text-foreground">{selectedOrg.userCount}</p>
              </div>
            </div>

            <div className="rounded-lg border border-border p-3">
              <p className="text-xs uppercase text-muted-foreground mb-1">Primary contact</p>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-2 text-primary">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{selectedOrg.primaryContact.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedOrg.primaryContact.email}</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border p-3">
              <p className="text-xs uppercase text-muted-foreground mb-1">Region & tags</p>
              <div className="flex flex-wrap items-center gap-2">
                <GlowBadge variant="outline" size="sm" className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {selectedOrg.region}
                </GlowBadge>
                {selectedOrg.tags.map((tag) => (
                  <GlowBadge key={tag} variant="info" size="sm">
                    {tag}
                  </GlowBadge>
                ))}
              </div>
            </div>

            {selectedOrg.notes && (
              <div className="rounded-lg border border-border p-3">
                <p className="text-xs uppercase text-muted-foreground mb-1">Notes</p>
                <p className="text-sm text-foreground">{selectedOrg.notes}</p>
              </div>
            )}
          </div>
        )}
      </GlowModal>
    </div>
  );
}

