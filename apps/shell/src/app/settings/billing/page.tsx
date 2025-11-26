'use client';

import * as React from 'react';
import {
  GlowCard,
  GlowCardContent,
  GlowCardHeader,
  GlowCardTitle,
  GlowCardDescription,
} from '@/components/glow-ui/GlowCard';
import { GlowBadge, GlowButton, GlowInput, GlowSelect } from '@/components/glow-ui';
import {
  mockBillingHistory,
  mockAIUsageData,
  mockCurrentPlan,
} from '@/lib/mock-data';
import { billingService } from '@/services/billingService';
import type { Subscription, PaymentMethod, Invoice, BillingContact } from '@/types/billing';
import { CreditCard, Download } from 'lucide-react';
import { Stack } from '@/design-system';

export default function BillingPage() {
  const [subscription, setSubscription] = React.useState<Subscription | null>(null);
  const [paymentMethods, setPaymentMethods] = React.useState<PaymentMethod[]>([]);
  const [invoices, setInvoices] = React.useState<Invoice[]>([]);
  const [contact, setContact] = React.useState<BillingContact>({
    email: '',
    company: '',
    taxId: '',
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [showChangePlan, setShowChangePlan] = React.useState(false);
  const [showUpdatePayment, setShowUpdatePayment] = React.useState(false);
  const [newPlan, setNewPlan] = React.useState<'free' | 'pro' | 'enterprise'>('pro');
  const [newPaymentMethod, setNewPaymentMethod] = React.useState({
    type: 'card' as const,
    last4: '',
    brand: 'Visa',
    expiryMonth: 1,
    expiryYear: 2026,
  });

  // Load data on mount
  React.useEffect(() => {
    loadBillingData();
  }, []);

  const loadBillingData = async () => {
    try {
      // Initialize with mock data
      const mockSub: Subscription = {
        id: 'sub_1',
        plan: 'pro',
        status: 'active',
        billingCycle: mockCurrentPlan.cadence === 'monthly' ? 'monthly' : 'yearly',
        price: 249,
        nextBillingDate: mockCurrentPlan.nextBillingDate.toISOString(),
        cancelAtPeriodEnd: false,
      };

      const mockPaymentMethods: PaymentMethod[] = [
        {
          id: 'pm_1',
          type: 'card',
          last4: mockCurrentPlan.paymentMethod.last4,
          brand: mockCurrentPlan.paymentMethod.brand,
          expiryMonth: parseInt(mockCurrentPlan.paymentMethod.expiry.split('/')[0]),
          expiryYear: 2000 + parseInt(mockCurrentPlan.paymentMethod.expiry.split('/')[1]),
          isDefault: true,
        },
      ];

      const mockInvoices: Invoice[] = mockBillingHistory.map((inv) => ({
        id: inv.id,
        invoiceNumber: inv.invoiceNumber,
        date: inv.date.toISOString(),
        amount: inv.amount,
        status: inv.status,
        pdfUrl: inv.downloadUrl,
      }));

      const mockContact: BillingContact = {
        email: 'billing@hopecommunity.org',
        company: 'Hope Community Foundation',
        taxId: '12-3456789',
      };

      await billingService.initializeBillingData(mockSub, mockPaymentMethods, mockInvoices, mockContact);

      const [loadedSub, loadedMethods, loadedInvoices, loadedContact] = await Promise.all([
        billingService.getSubscription(),
        billingService.getPaymentMethods(),
        billingService.getInvoices(),
        billingService.getBillingContact(),
      ]);

      setSubscription(loadedSub);
      setPaymentMethods(loadedMethods);
      setInvoices(loadedInvoices);
      setContact(loadedContact || mockContact);
    } catch (err) {
      console.error('Failed to load billing data:', err);
    }
  };

  const handleChangePlan = async () => {
    if (!subscription) return;

    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const currentPlanIndex = ['free', 'pro', 'enterprise'].indexOf(subscription.plan);
      const newPlanIndex = ['free', 'pro', 'enterprise'].indexOf(newPlan);

      let updated: Subscription;
      if (newPlanIndex > currentPlanIndex) {
        updated = await billingService.upgradePlan(newPlan as 'pro' | 'enterprise');
        setSuccess(`Successfully upgraded to ${newPlan}!`);
      } else {
        updated = await billingService.downgradePlan(newPlan as 'free' | 'pro');
        setSuccess(`Plan will change to ${newPlan} at the end of the billing period`);
      }

      setSubscription(updated);
      setShowChangePlan(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change plan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription) return;
    if (!confirm('Are you sure you want to cancel your subscription? You will lose access at the end of the billing period.')) return;

    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      await billingService.cancelSubscription();
      setSuccess('Subscription cancelled. Access will continue until the end of the billing period.');
      await loadBillingData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel subscription');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePaymentMethod = async () => {
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      if (!newPaymentMethod.last4 || newPaymentMethod.last4.length !== 4) {
        throw new Error('Please enter the last 4 digits of your card');
      }

      await billingService.updatePaymentMethod(newPaymentMethod);
      setSuccess('Payment method updated successfully!');
      await loadBillingData();
      setShowUpdatePayment(false);
      setNewPaymentMethod({
        type: 'card',
        last4: '',
        brand: 'Visa',
        expiryMonth: 1,
        expiryYear: 2026,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update payment method');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveContact = async () => {
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      await billingService.updateBillingContact(contact);
      setSuccess('Billing contact updated successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update billing contact');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadInvoice = async (invoiceId: string) => {
    try {
      const url = await billingService.downloadInvoice(invoiceId);
      // In a real app, this would trigger a download
      window.open(url, '_blank');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download invoice');
    }
  };

  const defaultPaymentMethod = paymentMethods.find((m) => m.isDefault);

  return (
    <Stack gap="6xl">
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

      <GlowCard variant="elevated">
        <GlowCardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <GlowCardTitle>Current plan</GlowCardTitle>
            <GlowCardDescription>Manage billing, cadence, and payment methods.</GlowCardDescription>
          </div>
          {subscription && (
            <GlowBadge variant="info" size="sm">
              {subscription.billingCycle === 'monthly' ? 'Monthly' : 'Annual'}
            </GlowBadge>
          )}
        </GlowCardHeader>
        <GlowCardContent className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-border p-4 shadow-ambient-card">
            <p className="text-sm text-muted-foreground">Plan</p>
            <p className="text-xl font-semibold text-foreground capitalize">{subscription?.plan || 'Pro'}</p>
            <p className="text-sm text-muted-foreground">${subscription?.price || 249}/mo</p>
            <ul className="mt-2 text-xs text-muted-foreground space-y-1">
              <li>• All 21 apps</li>
              <li>• Unlimited members</li>
              <li>• Priority support</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border p-4 shadow-ambient-card">
            <p className="text-sm text-muted-foreground">Next billing</p>
            <p className="text-xl font-semibold text-foreground">
              {subscription ? new Date(subscription.nextBillingDate).toLocaleDateString() : '-'}
            </p>
            <p className="text-sm text-muted-foreground">
              {subscription?.cancelAtPeriodEnd ? 'Cancels at period end' : 'Auto-renews'}
            </p>
            <div className="mt-3 flex gap-2">
              <GlowButton
                variant="outline"
                size="sm"
                onClick={() => setShowChangePlan(!showChangePlan)}
                disabled={isLoading}
              >
                Change plan
              </GlowButton>
              <GlowButton
                variant="ghost"
                size="sm"
                onClick={handleCancelSubscription}
                disabled={isLoading || subscription?.cancelAtPeriodEnd}
              >
                {subscription?.cancelAtPeriodEnd ? 'Cancelled' : 'Cancel subscription'}
              </GlowButton>
            </div>
          </div>
          <div className="rounded-lg border border-border p-4 shadow-ambient-card">
            <p className="text-sm text-muted-foreground">Payment method</p>
            <p className="text-xl font-semibold text-foreground">
              {defaultPaymentMethod?.brand || 'Visa'} •••• {defaultPaymentMethod?.last4 || '4242'}
            </p>
            <p className="text-sm text-muted-foreground">
              Exp {defaultPaymentMethod ? `${String(defaultPaymentMethod.expiryMonth).padStart(2, '0')}/${String(defaultPaymentMethod.expiryYear).slice(-2)}` : '04/26'}
            </p>
            <GlowButton
              variant="outline"
              size="sm"
              className="mt-2"
              leftIcon={<CreditCard className="h-4 w-4" />}
              onClick={() => setShowUpdatePayment(!showUpdatePayment)}
              disabled={isLoading}
            >
              Update payment method
            </GlowButton>
          </div>
        </GlowCardContent>

        {/* Change Plan Form */}
        {showChangePlan && (
          <GlowCardContent className="border-t border-border pt-4">
            <div className="space-y-4">
              <GlowSelect
                label="Select new plan"
                value={newPlan}
                onChange={(e) => setNewPlan(e.target.value as any)}
                disabled={isLoading}
              >
                <option value="free">Free - $0/mo</option>
                <option value="pro">Pro - $249/mo</option>
                <option value="enterprise">Enterprise - $999/mo</option>
              </GlowSelect>
              <div className="flex gap-2">
                <GlowButton onClick={handleChangePlan} disabled={isLoading}>
                  Confirm change
                </GlowButton>
                <GlowButton variant="ghost" onClick={() => setShowChangePlan(false)} disabled={isLoading}>
                  Cancel
                </GlowButton>
              </div>
            </div>
          </GlowCardContent>
        )}

        {/* Update Payment Method Form */}
        {showUpdatePayment && (
          <GlowCardContent className="border-t border-border pt-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <GlowSelect
                label="Card brand"
                value={newPaymentMethod.brand}
                onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, brand: e.target.value })}
                disabled={isLoading}
              >
                <option value="Visa">Visa</option>
                <option value="Mastercard">Mastercard</option>
                <option value="Amex">American Express</option>
                <option value="Discover">Discover</option>
              </GlowSelect>
              <GlowInput
                label="Last 4 digits"
                value={newPaymentMethod.last4}
                onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, last4: e.target.value.slice(0, 4) })}
                placeholder="4242"
                maxLength={4}
                disabled={isLoading}
              />
              <div className="flex gap-2">
                <GlowSelect
                  label="Exp Month"
                  value={newPaymentMethod.expiryMonth}
                  onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, expiryMonth: parseInt(e.target.value) })}
                  disabled={isLoading}
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <option key={month} value={month}>
                      {String(month).padStart(2, '0')}
                    </option>
                  ))}
                </GlowSelect>
                <GlowSelect
                  label="Exp Year"
                  value={newPaymentMethod.expiryYear}
                  onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, expiryYear: parseInt(e.target.value) })}
                  disabled={isLoading}
                >
                  {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </GlowSelect>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <GlowButton onClick={handleUpdatePaymentMethod} disabled={isLoading}>
                Update method
              </GlowButton>
              <GlowButton variant="ghost" onClick={() => setShowUpdatePayment(false)} disabled={isLoading}>
                Cancel
              </GlowButton>
            </div>
          </GlowCardContent>
        )}
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
          {invoices.map((invoice) => (
            <div key={invoice.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border px-3 py-2">
              <div>
                <p className="text-sm font-semibold text-foreground">{invoice.invoiceNumber}</p>
                <p className="text-xs text-muted-foreground">{new Date(invoice.date).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-3">
                <GlowBadge variant={invoice.status === 'paid' ? 'success' : 'warning'} size="sm">
                  {invoice.status}
                </GlowBadge>
                <p className="text-sm font-semibold text-foreground">${invoice.amount}</p>
                <GlowButton
                  variant="outline"
                  size="sm"
                  leftIcon={<Download className="h-4 w-4" />}
                  onClick={() => handleDownloadInvoice(invoice.id)}
                >
                  Download
                </GlowButton>
              </div>
            </div>
          ))}
        </GlowCardContent>
      </GlowCard>

      <GlowCard variant="elevated">
        <GlowCardHeader>
          <GlowCardTitle>Billing contact</GlowCardTitle>
          <GlowCardDescription>Where invoices and renewal notices are sent.</GlowCardDescription>
        </GlowCardHeader>
        <GlowCardContent className="grid gap-4 sm:grid-cols-3">
          <GlowInput
            label="Billing email"
            value={contact.email}
            onChange={(e) => setContact({ ...contact, email: e.target.value })}
            disabled={isLoading}
          />
          <GlowInput
            label="Company name"
            value={contact.company}
            onChange={(e) => setContact({ ...contact, company: e.target.value })}
            disabled={isLoading}
          />
          <GlowInput
            label="Tax ID"
            value={contact.taxId}
            onChange={(e) => setContact({ ...contact, taxId: e.target.value })}
            disabled={isLoading}
          />
          <div className="sm:col-span-3 flex justify-end">
            <GlowButton glow="subtle" onClick={handleSaveContact} disabled={isLoading}>
              Save contact
            </GlowButton>
          </div>
        </GlowCardContent>
      </GlowCard>
    </Stack>
  );
}
