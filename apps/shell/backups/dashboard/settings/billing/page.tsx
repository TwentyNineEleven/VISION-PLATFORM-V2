'use client';

import * as React from 'react';
import {
  GlowCard,
  GlowCardContent,
  GlowCardHeader,
  GlowCardTitle,
  GlowCardDescription,
} from '@/components/glow-ui/GlowCard';
import { GlowBadge, GlowButton } from '@/components/glow-ui';
import {
  mockBillingHistory,
  mockAIUsageData,
  mockCurrentPlan,
} from '@/lib/mock-data';
import { CreditCard, Download, LineChart, Wallet } from 'lucide-react';

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <GlowCard variant="elevated">
        <GlowCardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <GlowCardTitle>Current plan</GlowCardTitle>
            <GlowCardDescription>Manage billing, cadence, and payment methods.</GlowCardDescription>
          </div>
          <GlowBadge variant="info" size="sm">
            {mockCurrentPlan.cadence === 'monthly' ? 'Monthly' : 'Annual'}
          </GlowBadge>
        </GlowCardHeader>
        <GlowCardContent className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-border p-4 shadow-ambient-card">
            <p className="text-sm text-muted-foreground">Plan</p>
            <p className="text-xl font-semibold text-foreground">{mockCurrentPlan.name}</p>
            <p className="text-sm text-muted-foreground">{mockCurrentPlan.price}</p>
          </div>
          <div className="rounded-lg border border-border p-4 shadow-ambient-card">
            <p className="text-sm text-muted-foreground">Next billing</p>
            <p className="text-xl font-semibold text-foreground">
              {mockCurrentPlan.nextBillingDate.toLocaleDateString()}
            </p>
            <p className="text-sm text-muted-foreground">Auto-renews</p>
          </div>
          <div className="rounded-lg border border-border p-4 shadow-ambient-card">
            <p className="text-sm text-muted-foreground">Payment method</p>
            <p className="text-xl font-semibold text-foreground">
              {mockCurrentPlan.paymentMethod.brand} •••• {mockCurrentPlan.paymentMethod.last4}
            </p>
            <p className="text-sm text-muted-foreground">Exp {mockCurrentPlan.paymentMethod.expiry}</p>
          </div>
        </GlowCardContent>
      </GlowCard>

      <GlowCard variant="elevated">
        <GlowCardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <GlowCardTitle>AI usage</GlowCardTitle>
            <GlowCardDescription>Tokens and cost in the last 30 days.</GlowCardDescription>
          </div>
          <GlowBadge variant="outline" size="sm">
            {mockAIUsageData.periodLabel}
          </GlowBadge>
        </GlowCardHeader>
        <GlowCardContent className="grid gap-4 md:grid-cols-[1.2fr,1fr]">
          <div className="space-y-3 rounded-lg border border-border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total tokens</p>
                <p className="text-2xl font-semibold text-foreground">
                  {mockAIUsageData.totalTokens.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total cost</p>
                <p className="text-2xl font-semibold text-foreground">${mockAIUsageData.totalCost}</p>
              </div>
            </div>
            <div className="h-36 rounded-md bg-muted p-3">
              <div className="flex h-full items-end gap-2">
                {mockAIUsageData.byApp.map((entry) => (
                  <div key={entry.appId} className="flex-1 space-y-1">
                    <div
                      className="w-full rounded-t-md bg-gradient-to-t from-primary to-secondary shadow-glow-primary-sm"
                      style={{ height: `${Math.max(10, (entry.tokens / mockAIUsageData.totalTokens) * 100)}%` }}
                    />
                    <p className="text-[11px] text-muted-foreground text-center">{entry.appName}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {mockAIUsageData.byApp.map((entry) => (
              <div key={entry.appId} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                <div>
                  <p className="text-sm font-semibold text-foreground">{entry.appName}</p>
                  <p className="text-xs text-muted-foreground">{entry.tokens.toLocaleString()} tokens</p>
                </div>
                <GlowBadge variant="outline" size="sm">
                  ${entry.cost}
                </GlowBadge>
              </div>
            ))}
          </div>
        </GlowCardContent>
      </GlowCard>

      <GlowCard variant="flat">
        <GlowCardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <GlowCardTitle>Billing history</GlowCardTitle>
            <GlowCardDescription>Download invoices and receipts.</GlowCardDescription>
          </div>
          <GlowButton variant="outline" leftIcon={<Download className="h-4 w-4" />}>
            Export CSV
          </GlowButton>
        </GlowCardHeader>
        <GlowCardContent className="space-y-2">
          {mockBillingHistory.map((invoice) => (
            <div key={invoice.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border px-3 py-2">
              <div>
                <p className="text-sm font-semibold text-foreground">{invoice.invoiceNumber}</p>
                <p className="text-xs text-muted-foreground">{invoice.date.toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-3">
                <GlowBadge variant={invoice.status === 'paid' ? 'success' : 'warning'} size="sm">
                  {invoice.status}
                </GlowBadge>
                <p className="text-sm font-semibold text-foreground">${invoice.amount}</p>
                <GlowButton variant="outline" size="sm" leftIcon={<Download className="h-4 w-4" />}>
                  Download
                </GlowButton>
              </div>
            </div>
          ))}
        </GlowCardContent>
      </GlowCard>
    </div>
  );
}
