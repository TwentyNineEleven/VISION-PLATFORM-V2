export interface OrgSubscription {
  id: string;
  organizationId: string;
  organizationName: string;
  plan: string;
  status: 'active' | 'cancelled' | 'past_due';
  monthlyRevenue: number;
  arr: number;
  createdAt: string;
  renewalDate: Date;
  cancelledAt?: string;
  cancellationReason?: string;
  cancelledBy?: string;
  overdueInvoices: number;
  paymentMethod: {
    brand: string;
    last4: string;
  };
}

export interface Refund {
  id: string;
  invoiceId: string;
  amount: number;
  reason: string;
  processedAt: string;
  processedBy: string;
}

const ADMIN_SUBSCRIPTIONS_KEY = 'admin_subscriptions';
const REFUNDS_KEY = 'refunds';

export const adminBillingService = {
  async getOrganizationSubscriptions(): Promise<OrgSubscription[]> {
    if (typeof window === 'undefined') return [];

    const subs = localStorage.getItem(ADMIN_SUBSCRIPTIONS_KEY);
    if (!subs) return [];

    return JSON.parse(subs, (key, value) => {
      if ((key === 'createdAt' || key === 'cancelledAt') && value) {
        return value; // Keep as string for these
      }
      if (key === 'renewalDate' && value) {
        return new Date(value);
      }
      return value;
    });
  },

  async saveSubscriptions(subscriptions: OrgSubscription[]): Promise<void> {
    if (typeof window === 'undefined') throw new Error('Cannot save subscriptions on server');
    localStorage.setItem(ADMIN_SUBSCRIPTIONS_KEY, JSON.stringify(subscriptions));
  },

  async viewOrgSubscription(orgId: string, subscriptions: OrgSubscription[]): Promise<OrgSubscription> {
    const sub = subscriptions.find((s) => s.organizationId === orgId);

    if (!sub) throw new Error('Subscription not found');

    return sub;
  },

  async cancelOrgSubscription(
    orgId: string,
    reason: string,
    subscriptions: OrgSubscription[]
  ): Promise<void> {
    if (typeof window === 'undefined') throw new Error('Cannot cancel subscription on server');

    const updatedSubs = subscriptions.map((sub) => {
      if (sub.organizationId === orgId) {
        return {
          ...sub,
          status: 'cancelled' as const,
          cancelledAt: new Date().toISOString(),
          cancellationReason: reason,
          cancelledBy: 'admin',
        };
      }
      return sub;
    });

    await this.saveSubscriptions(updatedSubs);
  },

  async refundPayment(invoiceId: string, amount: number, reason: string): Promise<void> {
    if (typeof window === 'undefined') throw new Error('Cannot process refund on server');

    const refund: Refund = {
      id: `refund_${Date.now()}`,
      invoiceId,
      amount,
      reason,
      processedAt: new Date().toISOString(),
      processedBy: 'admin',
    };

    const refunds = JSON.parse(localStorage.getItem(REFUNDS_KEY) || '[]') as Refund[];
    refunds.push(refund);
    localStorage.setItem(REFUNDS_KEY, JSON.stringify(refunds));
  },

  async generateBillingReport(params: {
    startDate: string;
    endDate: string;
    format: 'csv' | 'pdf';
    subscriptions: OrgSubscription[];
  }): Promise<Blob> {
    // Filter by date range
    const filtered = params.subscriptions.filter((sub) => {
      const subDate = new Date(sub.createdAt);
      return subDate >= new Date(params.startDate) && subDate <= new Date(params.endDate);
    });

    if (params.format === 'csv') {
      const csv = this.generateCSV(filtered);
      return new Blob([csv], { type: 'text/csv' });
    } else {
      // Mock PDF generation
      const pdfContent = this.generatePDFContent(filtered);
      return new Blob([pdfContent], { type: 'application/pdf' });
    }
  },

  generateCSV(data: OrgSubscription[]): string {
    const headers = ['Organization', 'Plan', 'Status', 'MRR', 'ARR', 'Created', 'Renewal'];
    const rows = data.map((sub) => [
      sub.organizationName,
      sub.plan,
      sub.status,
      sub.monthlyRevenue,
      sub.arr,
      new Date(sub.createdAt).toLocaleDateString(),
      sub.renewalDate.toLocaleDateString(),
    ]);

    return [headers, ...rows].map((row) => row.join(',')).join('\n');
  },

  generatePDFContent(data: OrgSubscription[]): string {
    // Mock PDF content
    const totalMRR = data.reduce((sum, sub) => sum + sub.monthlyRevenue, 0);
    const totalARR = data.reduce((sum, sub) => sum + sub.arr, 0);

    return `BILLING REPORT

Total Organizations: ${data.length}
Total MRR: $${totalMRR.toLocaleString()}
Total ARR: $${totalARR.toLocaleString()}

${data.map((sub) => `${sub.organizationName} - ${sub.plan} - $${sub.arr}`).join('\n')}`;
  },

  downloadReport(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
};
