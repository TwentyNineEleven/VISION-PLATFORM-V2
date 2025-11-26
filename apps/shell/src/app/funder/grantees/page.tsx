'use client';

import * as React from 'react';
import {
  GlowCard,
  GlowCardContent,
  GlowCardHeader,
  GlowCardTitle,
  GlowCardDescription,
} from '@/components/glow-ui/GlowCard';
import { GlowInput, GlowBadge, GlowButton, GlowSelect, GlowModal } from '@/components/glow-ui';
import { mockApps, mockGrantees, mockCohorts } from '@/lib/mock-data';
import type { Grantee } from '@/lib/mock-data';
import { Filter, Users, Download, ArrowUpRight, ArrowUpDown, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type SortField = 'name' | 'capacityScore' | 'lastCheckIn';
type SortDirection = 'asc' | 'desc';

export default function FunderGranteesPage() {
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'on-track' | 'at-risk' | 'off-track'>('all');
  const [riskFilter, setRiskFilter] = React.useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [cohortFilter, setCohortFilter] = React.useState<'all' | string>('all');
  const [showInviteModal, setShowInviteModal] = React.useState(false);
  const [inviteForm, setInviteForm] = React.useState({
    name: '',
    email: '',
    organizationName: '',
  });
  const [success, setSuccess] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [sortField, setSortField] = React.useState<SortField>('lastCheckIn');
  const [sortDirection, setSortDirection] = React.useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);

  const handleInviteGrantee = () => {
    if (!inviteForm.name || !inviteForm.email || !inviteForm.organizationName) {
      setError('Please fill in all fields');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteForm.email)) {
      setError('Invalid email address');
      return;
    }

    // In a real app, this would call a service
    setSuccess(`Invitation sent to ${inviteForm.email}`);
    setShowInviteModal(false);
    setInviteForm({ name: '', email: '', organizationName: '' });
    setError(null);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const filtered = mockGrantees.filter((g) => {
    const matchesSearch = g.name.toLowerCase().includes(search.toLowerCase()) ||
                         g.focusArea.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || g.status === statusFilter;
    const matchesRisk = riskFilter === 'all' || g.riskLevel === riskFilter;
    const matchesCohort = cohortFilter === 'all' || g.cohortId === cohortFilter;
    return matchesSearch && matchesStatus && matchesRisk && matchesCohort;
  });

  // Sort filtered data
  const sorted = [...filtered].sort((a, b) => {
    let comparison = 0;
    switch (sortField) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'capacityScore':
        comparison = a.capacityScore - b.capacityScore;
        break;
      case 'lastCheckIn':
        comparison = a.lastCheckIn.getTime() - b.lastCheckIn.getTime();
        break;
    }
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // Pagination
  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = sorted.slice(startIndex, endIndex);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, riskFilter, cohortFilter]);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      {error && (
        <div className="bg-destructive/10 border border-destructive/50 text-destructive px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-success/10 border border-success/50 text-success px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm font-medium text-primary">Funder</p>
          <h1 className="text-3xl font-semibold text-foreground">Grantees</h1>
          <p className="text-sm text-muted-foreground">Monitor performance, capacity, and risk across grantees.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <GlowButton variant="outline" leftIcon={<Download className="h-4 w-4" />}>
            Export CSV
          </GlowButton>
          <GlowButton glow="subtle" rightIcon={<Users className="h-4 w-4" />} onClick={() => setShowInviteModal(true)}>
            Invite grantee
          </GlowButton>
        </div>
      </div>

      <GlowCard variant="flat">
                <GlowCardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <GlowCardTitle>Filters</GlowCardTitle>
                    <GlowCardDescription>Search and filter the portfolio.</GlowCardDescription>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-3 py-1 text-xs text-primary">
                    <Filter className="h-4 w-4" />
                    Dynamic filters
                  </div>
                </GlowCardHeader>
                <GlowCardContent className="grid gap-4 md:grid-cols-4">
                  <GlowInput
                    placeholder="Search grantees..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <GlowSelect
                    label="Status"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                  >
                    <option value="all">All</option>
                    <option value="on-track">On Track</option>
                    <option value="at-risk">At Risk</option>
                    <option value="off-track">Off Track</option>
                  </GlowSelect>
                  <GlowSelect
                    label="Risk level"
                    value={riskFilter}
                    onChange={(e) => setRiskFilter(e.target.value as any)}
                  >
                    <option value="all">All</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </GlowSelect>
                  <GlowSelect
                    label="Cohort"
                    value={cohortFilter}
                    onChange={(e) => setCohortFilter(e.target.value as any)}
                  >
                    <option value="all">All cohorts</option>
                    {mockCohorts.map((cohort) => (
                      <option key={cohort.id} value={cohort.id}>
                        {cohort.name}
                      </option>
                    ))}
                  </GlowSelect>
                </GlowCardContent>
              </GlowCard>

              <GlowCard variant="elevated">
                <GlowCardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <GlowCardTitle>Portfolio</GlowCardTitle>
                    <GlowCardDescription>
                      Capacity and risk snapshot. Showing {startIndex + 1}-{Math.min(endIndex, sorted.length)} of {sorted.length} {sorted.length === 1 ? 'grantee' : 'grantees'}
                    </GlowCardDescription>
                  </div>
                  <GlowSelect
                    label="Items per page"
                    value={itemsPerPage.toString()}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="w-32"
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                  </GlowSelect>
                </GlowCardHeader>
                <GlowCardContent className="overflow-hidden">
                  <div className="overflow-x-auto rounded-lg border border-border">
                    <table className="min-w-full divide-y divide-border text-sm">
                      <thead className="bg-muted/50">
                        <tr>
                          <th
                            className="cursor-pointer px-4 py-3 text-left font-semibold text-muted-foreground hover:bg-muted/70 transition-colors group"
                            onClick={() => handleSort('name')}
                          >
                            <div className="flex items-center gap-1">
                              Grantee
                              <ArrowUpDown className={cn(
                                "h-4 w-4 transition-all",
                                sortField === 'name' ? "text-primary" : "text-muted-foreground/40 group-hover:text-muted-foreground"
                              )} />
                            </div>
                          </th>
                          <th className="px-6 py-3 text-left font-semibold text-muted-foreground">Focus</th>
                          <th className="px-6 py-3 text-center font-semibold text-muted-foreground w-32">Status</th>
                          <th
                            className="cursor-pointer px-6 py-3 text-center font-semibold text-muted-foreground hover:bg-muted/70 transition-colors group w-28"
                            onClick={() => handleSort('capacityScore')}
                          >
                            <div className="flex items-center justify-center gap-1">
                              Capacity
                              <ArrowUpDown className={cn(
                                "h-4 w-4 transition-all",
                                sortField === 'capacityScore' ? "text-primary" : "text-muted-foreground/40 group-hover:text-muted-foreground"
                              )} />
                            </div>
                          </th>
                          <th className="px-6 py-3 text-center font-semibold text-muted-foreground w-28">Risk</th>
                          <th
                            className="cursor-pointer px-4 py-3 text-left font-semibold text-muted-foreground hover:bg-muted/70 transition-colors group"
                            onClick={() => handleSort('lastCheckIn')}
                          >
                            <div className="flex items-center gap-1">
                              Last check-in
                              <ArrowUpDown className={cn(
                                "h-4 w-4 transition-all",
                                sortField === 'lastCheckIn' ? "text-primary" : "text-muted-foreground/40 group-hover:text-muted-foreground"
                              )} />
                            </div>
                          </th>
                          <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border bg-background">
                        {paginatedData.map((grantee, index) => (
                          <tr
                            key={grantee.id}
                            className={cn(
                              "hover:bg-muted/30 transition-colors cursor-pointer",
                              index % 2 === 0 ? "bg-background" : "bg-muted/10"
                            )}
                          >
                            <td className="px-4 py-4">
                              <div className="flex flex-col">
                                <span className="font-semibold text-foreground">{grantee.name}</span>
                                <span className="text-xs text-muted-foreground mt-0.5 sm:hidden">{grantee.focusArea}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-muted-foreground hidden sm:table-cell">{grantee.focusArea}</td>
                            <td className="px-6 py-4">
                              <div className="flex justify-center">
                                <GlowBadge
                                  variant={
                                    grantee.status === 'on-track'
                                      ? 'success'
                                      : grantee.status === 'at-risk'
                                        ? 'warning'
                                        : 'destructive'
                                  }
                                  size="sm"
                                  className="min-w-[90px] justify-center"
                                >
                                  {grantee.status}
                                </GlowBadge>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex justify-center">
                                <span className={cn(
                                  "text-sm font-semibold",
                                  grantee.capacityScore >= 80 && "text-success",
                                  grantee.capacityScore >= 60 && grantee.capacityScore < 80 && "text-warning",
                                  grantee.capacityScore < 60 && "text-destructive"
                                )}>{grantee.capacityScore}%</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex justify-center">
                                <GlowBadge
                                  variant={
                                    grantee.riskLevel === 'high'
                                      ? 'destructive'
                                      : grantee.riskLevel === 'medium'
                                        ? 'warning'
                                        : 'outline'
                                  }
                                  size="sm"
                                  className="min-w-[80px] justify-center"
                                >
                                  {grantee.riskLevel === 'high' && <AlertCircle className="h-3 w-3 mr-1" />}
                                  {grantee.riskLevel}
                                </GlowBadge>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-muted-foreground text-sm">
                              {grantee.lastCheckIn.toLocaleDateString('en-US', {
                                month: '2-digit',
                                day: '2-digit',
                                year: 'numeric'
                              })}
                            </td>
                            <td className="px-4 py-4 text-right">
                              <GlowButton variant="ghost" size="sm" rightIcon={<ArrowUpRight className="h-4 w-4" />}>
                                <span className="hidden sm:inline">View details</span>
                                <span className="sm:hidden">View</span>
                              </GlowButton>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {sorted.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="rounded-full bg-muted p-3 mb-3">
                        <Users className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-medium text-foreground mb-1">No grantees found</p>
                      <p className="text-xs text-muted-foreground">
                        Try adjusting your filters or search terms
                      </p>
                    </div>
                  )}

                  {sorted.length > 0 && totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-border px-4 py-3 mt-4">
                      <div className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                      </div>
                      <div className="flex items-center gap-2">
                        <GlowButton
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                          leftIcon={<ChevronLeft className="h-4 w-4" />}
                        >
                          Previous
                        </GlowButton>
                        <div className="hidden sm:flex items-center gap-1">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }
                            return (
                              <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={cn(
                                  "px-3 py-1 text-sm rounded-md transition-colors",
                                  currentPage === pageNum
                                    ? "bg-primary text-primary-foreground font-semibold"
                                    : "text-muted-foreground hover:bg-muted"
                                )}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                        </div>
                        <GlowButton
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                          rightIcon={<ChevronRight className="h-4 w-4" />}
                        >
                          Next
                        </GlowButton>
                      </div>
                    </div>
                  )}
                </GlowCardContent>
      </GlowCard>

      {/* Invite Grantee Modal */}
      <GlowModal
        open={showInviteModal}
        onOpenChange={setShowInviteModal}
        title="Invite Grantee"
        description="Send an invitation to a new grantee organization."
      >
        <div className="space-y-4">
          <GlowInput
            label="Organization Name"
            value={inviteForm.organizationName}
            onChange={(e) => setInviteForm({ ...inviteForm, organizationName: e.target.value })}
            placeholder="Hope Community Foundation"
          />
          <GlowInput
            label="Contact Name"
            value={inviteForm.name}
            onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
            placeholder="John Doe"
          />
          <GlowInput
            label="Email Address"
            type="email"
            value={inviteForm.email}
            onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
            placeholder="contact@organization.org"
          />
          <div className="flex justify-end gap-2 pt-4">
            <GlowButton variant="ghost" onClick={() => setShowInviteModal(false)}>
              Cancel
            </GlowButton>
            <GlowButton onClick={handleInviteGrantee}>
              Send Invitation
            </GlowButton>
          </div>
        </div>
      </GlowModal>
    </div>
  );
}
