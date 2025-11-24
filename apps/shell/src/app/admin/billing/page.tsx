'use client';

import * as React from 'react';
import {
  GlowBadge,
  GlowButton,
  GlowCard,
  GlowCardContent,
  GlowCardHeader,
  GlowCardTitle,
  GlowModal,
  GlowInput,
} from '@/components/glow-ui';
import { mockBillingHistory, mockAIUsageData, mockCurrentPlan } from '@/lib/mock-data';
import { mockAdminBillingAccounts } from '@/lib/mock-admin';
import { getCurrentUser } from '@/lib/session';
import { isOrgAdmin, isSuperAdmin } from '@/lib/auth';
import Link from 'next/link';
import { CreditCard, Download } from 'lucide-react';
import { adminBillingService, type OrgSubscription } from '@/services/adminBillingService';

export default function AdminBillingPage() {
  const currentUser = getCurrentUser();
  const isSuper = isSuperAdmin(currentUser.roleKey);
  const orgOnly = isOrgAdmin(currentUser.roleKey) && !isSuper;

  const [accounts, setAccounts] = React.useState(mockAdminBillingAccounts);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [viewModalOpen, setViewModalOpen] = React.useState(false);
  const [refundModalOpen, setRefundModalOpen] = React.useState(false);
  const [selectedAccount, setSelectedAccount] = React.useState<any | null>(null);
  const [refundAmount, setRefundAmount] = React.useState('');
  const [refundReason, setRefundReason] = React.useState('');

  // Clear messages after 5 seconds
  React.useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const loadData = async () => {
    try {
      const subs = await adminBillingService.getOrganizationSubscriptions();
      if (subs.length > 0) {
        // Convert OrgSubscription to account format
        const formattedAccounts = subs.map((sub) => ({
          id: sub.id,
          orgName: sub.organizationName,
          plan: sub.plan,
          arr: sub.arr,
          renewalDate: sub.renewalDate,
          status: sub.status === 'active' ? 'paid' : sub.status === 'past_due' ? 'due' : 'delinquent',
          overdueInvoices: sub.overdueInvoices,
          paymentMethod: sub.paymentMethod,
        }));
        setAccounts(formattedAccounts);
      }
    } catch (err) {
      console.error('Failed to load billing data:', err);
    }
  };

  React.useEffect(() => {
    if (isSuper) {
      loadData();
    }
  }, [isSuper]);

  const totalArr = accounts.reduce((sum, account) => sum + account.arr, 0);
  const delinquentAccounts = accounts.filter((account) => account.status !== 'paid');

  const handleViewSubscription = (account: any) => {
    setSelectedAccount(account);
    setViewModalOpen(true);
  };

  const handleCancelSubscription = async (account: any) => {
    const reason = prompt('Please provide a reason for cancellation:');

    if (!reason) {
      alert('Cancellation reason is required.');
      return;
    }

    if (
      !confirm(
        `Cancel subscription for "${account.orgName}"?\n\nThis will cancel their ${account.plan} plan.\n\nAre you sure?`
      )
    ) {
      return;
    }

    setIsLoading(true);

    try {
      const subs = await adminBillingService.getOrganizationSubscriptions();
      await adminBillingService.cancelOrgSubscription(account.id, reason, subs);
      await loadData();
      setSuccess('Subscription cancelled successfully');
    } catch (err) {
      setError('Failed to cancel subscription');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenRefund = (account: any) => {
    setSelectedAccount(account);
    setRefundAmount('');
    setRefundReason('');
    setRefundModalOpen(true);
  };

  const handleProcessRefund = async () => {
    if (!selectedAccount || !refundAmount || !refundReason) {
      setError('Please fill in all fields');
      return;
    }

    const amount = parseFloat(refundAmount);
    if (isNaN(amount) || amount <= 0) {
      setError('Invalid refund amount');
      return;
    }

    setIsLoading(true);

    try {
      await adminBillingService.refundPayment(`invoice_${selectedAccount.id}`, amount, refundReason);
      setSuccess(`Refund of $${amount} processed successfully`);
      setRefundModalOpen(false);
    } catch (err) {
      setError('Failed to process refund');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportReport = async (format: 'csv' | 'pdf') => {
    setIsLoading(true);

    try {
      const subs = await adminBillingService.getOrganizationSubscriptions();

      // Use current month date range
      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const blob = await adminBillingService.generateBillingReport({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        format,
        subscriptions: subs,
      });

      const filename = `billing-report-${now.getFullYear()}-${now.getMonth() + 1}.${format}`;
      adminBillingService.downloadReport(blob, filename);

      setSuccess(`Report exported as ${format.toUpperCase()}`);
    } catch (err) {
      setError('Failed to export report');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div
          className="rounded-lg border border-vision-error-600 bg-vision-error-50 px-4 py-3 text-vision-error-600"
          role="alert"
        >
          <strong className="font-semibold">Error:</strong> {error}
        </div>
      )}
      {success && (
        <div
          className="rounded-lg border border-vision-success-600 bg-vision-success-50 px-4 py-3 text-vision-success-600"
          role="status"
        >
          <strong className="font-semibold">Success:</strong> {success}
        </div>
      )}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-foreground">Billing</h1>
        <p className="text-sm text-muted-foreground">
          Monitor plans, invoice health, and AI usage across every workspace.
        </p>
      </div>

      {orgOnly && (
        <GlowCard variant="interactive">
          <GlowCardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <GlowCardTitle>Organization billing</GlowCardTitle>
              <p className="text-sm text-muted-foreground">
                You&apos;re seeing org-admin view. Visit workspace billing settings for details.
              </p>
            </div>
            <GlowButton asChild>
              <Link href="/settings/billing">Go to workspace billing</Link>
            </GlowButton>
          </GlowCardHeader>
          <GlowCardContent className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-border p-3">
              <p className="text-xs uppercase text-muted-foreground">Plan</p>
              <p className="text-lg font-semibold text-foreground">{mockCurrentPlan.name}</p>
              <p className="text-xs text-muted-foreground">{mockCurrentPlan.price}</p>
            </div>
            <div className="rounded-lg border border-border p-3">
              <p className="text-xs uppercase text-muted-foreground">Next billing</p>
              <p className="text-lg font-semibold text-foreground">
                {mockCurrentPlan.nextBillingDate.toLocaleDateString()}
              </p>
            </div>
            <div className="rounded-lg border border-border p-3">
              <p className="text-xs uppercase text-muted-foreground">Payment method</p>
              <p className="text-lg font-semibold text-foreground">
                {mockCurrentPlan.paymentMethod.brand} •••• {mockCurrentPlan.paymentMethod.last4}
              </p>
            </div>
          </GlowCardContent>
        </GlowCard>
      )}

      {isSuper && (
        <>
          <GlowCard variant="elevated">
            <GlowCardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <GlowCardTitle>Global billing overview</GlowCardTitle>
                <p className="text-sm text-muted-foreground">
                  ARR across {mockAdminBillingAccounts.length} workspaces.
                </p>
              </div>
              <GlowBadge variant="info" size="sm">
                ${totalArr.toLocaleString()} ARR
              </GlowBadge>
            </GlowCardHeader>
            <GlowCardContent className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">
                  List of organization subscriptions with plan details, revenue, renewal dates, and payment status
                </caption>
                <thead>
                  <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                    <th scope="col" className="px-3 py-2 font-semibold">Organization</th>
                    <th scope="col" className="px-3 py-2 font-semibold">Plan</th>
                    <th scope="col" className="px-3 py-2 font-semibold">ARR</th>
                    <th scope="col" className="px-3 py-2 font-semibold">Renewal</th>
                    <th scope="col" className="px-3 py-2 font-semibold">Status</th>
                    <th scope="col" className="px-3 py-2 font-semibold">Overdue invoices</th>
                    <th scope="col" className="px-3 py-2 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {accounts.map((account) => (
                    <tr key={account.id} className="hover:bg-muted/40">
                      <td className="px-3 py-3">
                        <p className="font-semibold text-foreground">{account.orgName}</p>
                        <p className="text-xs text-muted-foreground">{account.paymentMethod.brand}</p>
                      </td>
                      <td className="px-3 py-3">{account.plan}</td>
                      <td className="px-3 py-3">${account.arr.toLocaleString()}</td>
                      <td className="px-3 py-3">{account.renewalDate.toLocaleDateString()}</td>
                      <td className="px-3 py-3">
                        <GlowBadge
                          variant={
                            account.status === 'paid'
                              ? 'success'
                              : account.status === 'due'
                              ? 'warning'
                              : 'destructive'
                          }
                        >
                          {account.status}
                          <span className="sr-only">payment status</span>
                        </GlowBadge>
                      </td>
                      <td className="px-3 py-3">{account.overdueInvoices}</td>
                      <td className="px-3 py-3">
                        <div className="flex flex-wrap gap-2">
                          <GlowButton
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewSubscription(account)}
                            aria-label={`View subscription details for ${account.orgName}`}
                          >
                            View
                          </GlowButton>
                          <GlowButton
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCancelSubscription(account)}
                            disabled={isLoading}
                            aria-label={`Cancel subscription for ${account.orgName}`}
                          >
                            Cancel
                          </GlowButton>
                          <GlowButton
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenRefund(account)}
                            disabled={isLoading}
                            aria-label={`Process refund for ${account.orgName}`}
                          >
                            Refund
                          </GlowButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </GlowCardContent>
          </GlowCard>

          <div className="grid gap-6 lg:grid-cols-2">
            <GlowCard variant="interactive">
              <GlowCardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <GlowCardTitle>AI usage</GlowCardTitle>
                  <p className="text-sm text-muted-foreground">{mockAIUsageData.periodLabel}</p>
                </div>
                <GlowBadge variant="outline" size="sm">
                  {mockAIUsageData.totalTokens.toLocaleString()} tokens
                </GlowBadge>
              </GlowCardHeader>
              <GlowCardContent className="space-y-3">
                {mockAIUsageData.byApp.map((entry) => (
                  <div key={entry.appId} className="flex items-center justify-between text-sm">
                    <span className="text-foreground">{entry.appName}</span>
                    <span className="text-muted-foreground">
                      {entry.tokens.toLocaleString()} tokens (${entry.cost})
                    </span>
                  </div>
                ))}
              </GlowCardContent>
            </GlowCard>

            <GlowCard variant="interactive">
              <GlowCardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <GlowCardTitle>At-risk accounts</GlowCardTitle>
                  <p className="text-sm text-muted-foreground">
                    {delinquentAccounts.length} of {mockAdminBillingAccounts.length} accounts require review.
                  </p>
                </div>
              </GlowCardHeader>
              <GlowCardContent className="space-y-3">
                {delinquentAccounts.map((account) => (
                  <div key={account.id} className="rounded-lg border border-border p-3">
                    <p className="text-sm font-semibold text-foreground">{account.orgName}</p>
                    <p className="text-xs text-muted-foreground">
                      {account.status === 'delinquent' ? 'Delinquent' : 'Payment due'} · {account.overdueInvoices}{' '}
                      overdue
                    </p>
                    <GlowButton variant="ghost" size="sm" className="mt-2">
                      Collect payment
                    </GlowButton>
                  </div>
                ))}
                {!delinquentAccounts.length && (
                  <p className="text-sm text-muted-foreground">All accounts are current.</p>
                )}
              </GlowCardContent>
            </GlowCard>
          </div>

          <GlowCard variant="flat">
            <GlowCardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <GlowCardTitle>Invoice history</GlowCardTitle>
                <p className="text-sm text-muted-foreground">Download invoices for auditing.</p>
              </div>
              <div className="flex gap-2">
                <GlowButton
                  variant="outline"
                  leftIcon={<Download className="h-4 w-4" />}
                  onClick={() => handleExportReport('csv')}
                  disabled={isLoading}
                  aria-label="Export billing report as CSV"
                >
                  Export CSV
                </GlowButton>
                <GlowButton
                  variant="outline"
                  onClick={() => handleExportReport('pdf')}
                  disabled={isLoading}
                  aria-label="Export billing report as PDF"
                >
                  Export PDF
                </GlowButton>
              </div>
            </GlowCardHeader>
            <GlowCardContent className="space-y-2">
              {mockBillingHistory.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-semibold text-foreground">{invoice.invoiceNumber}</p>
                    <p className="text-xs text-muted-foreground">{invoice.date.toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <GlowBadge variant={invoice.status === 'paid' ? 'success' : 'warning'} size="sm">
                      {invoice.status}
                    </GlowBadge>
                    <p className="text-sm font-semibold text-foreground">${invoice.amount}</p>
                    <GlowButton variant="outline" size="sm" leftIcon={<CreditCard className="h-4 w-4" />}>
                      Download
                    </GlowButton>
                  </div>
                </div>
              ))}
            </GlowCardContent>
          </GlowCard>
        </>
      )}

      {/* View Subscription Modal */}
      <GlowModal
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
        title="Subscription Details"
        description={selectedAccount?.orgName}
        size="lg"
      >
        {selectedAccount && (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-border p-3">
                <p className="text-xs uppercase text-muted-foreground">Plan</p>
                <p className="text-base font-semibold text-foreground">{selectedAccount.plan}</p>
              </div>
              <div className="rounded-lg border border-border p-3">
                <p className="text-xs uppercase text-muted-foreground">ARR</p>
                <p className="text-base font-semibold text-foreground">
                  ${selectedAccount.arr.toLocaleString()}
                </p>
              </div>
              <div className="rounded-lg border border-border p-3">
                <p className="text-xs uppercase text-muted-foreground">Renewal Date</p>
                <p className="text-base font-semibold text-foreground">
                  {selectedAccount.renewalDate.toLocaleDateString()}
                </p>
              </div>
              <div className="rounded-lg border border-border p-3">
                <p className="text-xs uppercase text-muted-foreground">Status</p>
                <p className="text-base font-semibold text-foreground capitalize">{selectedAccount.status}</p>
              </div>
              <div className="rounded-lg border border-border p-3">
                <p className="text-xs uppercase text-muted-foreground">Payment Method</p>
                <p className="text-base font-semibold text-foreground">
                  {selectedAccount.paymentMethod.brand} •••• {selectedAccount.paymentMethod.last4 || '****'}
                </p>
              </div>
              <div className="rounded-lg border border-border p-3">
                <p className="text-xs uppercase text-muted-foreground">Overdue Invoices</p>
                <p className="text-base font-semibold text-foreground">{selectedAccount.overdueInvoices}</p>
              </div>
            </div>
          </div>
        )}
      </GlowModal>

      {/* Refund Modal */}
      <GlowModal
        open={refundModalOpen}
        onOpenChange={setRefundModalOpen}
        title="Process Refund"
        description={selectedAccount ? `Process refund for ${selectedAccount.orgName}` : 'Process refund'}
        size="md"
        footer={
          <>
            <GlowButton variant="outline" onClick={() => setRefundModalOpen(false)}>
              Cancel
            </GlowButton>
            <GlowButton glow="subtle" onClick={handleProcessRefund} disabled={isLoading}>
              Process Refund
            </GlowButton>
          </>
        }
      >
        <div className="space-y-4">
          <GlowInput
            label="Refund Amount"
            type="number"
            step="0.01"
            min="0"
            value={refundAmount}
            onChange={(e) => setRefundAmount(e.target.value)}
            placeholder="0.00"
            required
          />
          <GlowInput
            label="Reason"
            value={refundReason}
            onChange={(e) => setRefundReason(e.target.value)}
            placeholder="Reason for refund"
            required
          />
        </div>
      </GlowModal>
    </div>
  );
}

