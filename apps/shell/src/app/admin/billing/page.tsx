'use client';

import * as React from 'react';
import {
  GlowBadge,
  GlowButton,
  GlowCard,
  GlowCardContent,
  GlowCardHeader,
  GlowCardTitle,
} from '@/components/glow-ui';
import { mockBillingHistory, mockAIUsageData, mockCurrentPlan } from '@/lib/mock-data';
import { mockAdminBillingAccounts } from '@/lib/mock-admin';
import { getCurrentUser } from '@/lib/session';
import { isOrgAdmin, isSuperAdmin } from '@/lib/auth';
import Link from 'next/link';
import { CreditCard, Download } from 'lucide-react';

export default function AdminBillingPage() {
  const currentUser = getCurrentUser();
  const isSuper = isSuperAdmin(currentUser.roleKey);
  const orgOnly = isOrgAdmin(currentUser.roleKey) && !isSuper;

  const totalArr = mockAdminBillingAccounts.reduce((sum, account) => sum + account.arr, 0);
  const delinquentAccounts = mockAdminBillingAccounts.filter((account) => account.status !== 'paid');

  return (
    <div className="space-y-6">
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
                <thead>
                  <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-3 py-2 font-semibold">Organization</th>
                    <th className="px-3 py-2 font-semibold">Plan</th>
                    <th className="px-3 py-2 font-semibold">ARR</th>
                    <th className="px-3 py-2 font-semibold">Renewal</th>
                    <th className="px-3 py-2 font-semibold">Status</th>
                    <th className="px-3 py-2 font-semibold">Overdue invoices</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mockAdminBillingAccounts.map((account) => (
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
                        </GlowBadge>
                      </td>
                      <td className="px-3 py-3">{account.overdueInvoices}</td>
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
              <GlowButton variant="outline" leftIcon={<Download className="h-4 w-4" />}>
                Export CSV
              </GlowButton>
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
    </div>
  );
}

