import type { Subscription, PaymentMethod, Invoice, BillingContact } from '@/types/billing';

const SUBSCRIPTION_KEY = 'vision_subscription';
const PAYMENT_METHODS_KEY = 'vision_payment_methods';
const INVOICES_KEY = 'vision_invoices';
const BILLING_CONTACT_KEY = 'vision_billing_contact';

const PLAN_PRICES: Record<'free' | 'pro' | 'enterprise', number> = {
  free: 0,
  pro: 249,
  enterprise: 999,
};

export const billingService = {
  // Subscription Management
  async getSubscription(): Promise<Subscription | null> {
    if (typeof window === 'undefined') return null;

    const sub = localStorage.getItem(SUBSCRIPTION_KEY);
    return sub ? JSON.parse(sub) : null;
  },

  async upgradePlan(newPlan: 'pro' | 'enterprise'): Promise<Subscription> {
    if (typeof window === 'undefined') throw new Error('Cannot upgrade plan on server');

    const sub = await this.getSubscription();
    if (!sub) throw new Error('No subscription found');

    const nextBillingDate = new Date();
    nextBillingDate.setMonth(nextBillingDate.getMonth() + (sub.billingCycle === 'monthly' ? 1 : 12));

    const updated: Subscription = {
      ...sub,
      plan: newPlan,
      price: PLAN_PRICES[newPlan],
      nextBillingDate: nextBillingDate.toISOString(),
      cancelAtPeriodEnd: false,
    };

    localStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(updated));
    return updated;
  },

  async downgradePlan(newPlan: 'free' | 'pro'): Promise<Subscription> {
    if (typeof window === 'undefined') throw new Error('Cannot downgrade plan on server');

    const sub = await this.getSubscription();
    if (!sub) throw new Error('No subscription found');

    const updated: Subscription = {
      ...sub,
      plan: newPlan,
      price: PLAN_PRICES[newPlan],
      cancelAtPeriodEnd: true, // Downgrades happen at period end
    };

    localStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(updated));
    return updated;
  },

  async changeBillingCycle(newCycle: 'monthly' | 'yearly'): Promise<Subscription> {
    if (typeof window === 'undefined') throw new Error('Cannot change billing cycle on server');

    const sub = await this.getSubscription();
    if (!sub) throw new Error('No subscription found');

    const updated: Subscription = {
      ...sub,
      billingCycle: newCycle,
    };

    localStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(updated));
    return updated;
  },

  async cancelSubscription(): Promise<void> {
    if (typeof window === 'undefined') throw new Error('Cannot cancel subscription on server');

    const sub = await this.getSubscription();
    if (!sub) throw new Error('No subscription found');

    sub.cancelAtPeriodEnd = true;
    sub.status = 'cancelled';
    localStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(sub));
  },

  async reactivateSubscription(): Promise<Subscription> {
    if (typeof window === 'undefined') throw new Error('Cannot reactivate subscription on server');

    const sub = await this.getSubscription();
    if (!sub) throw new Error('No subscription found');

    const updated: Subscription = {
      ...sub,
      status: 'active',
      cancelAtPeriodEnd: false,
    };

    localStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(updated));
    return updated;
  },

  // Payment Methods
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    if (typeof window === 'undefined') return [];

    const methods = localStorage.getItem(PAYMENT_METHODS_KEY);
    return methods ? JSON.parse(methods) : [];
  },

  async updatePaymentMethod(paymentMethod: Omit<PaymentMethod, 'id' | 'isDefault'>): Promise<PaymentMethod> {
    if (typeof window === 'undefined') throw new Error('Cannot update payment method on server');

    const methods = await this.getPaymentMethods();

    // Set all existing methods to non-default
    methods.forEach((m) => {
      m.isDefault = false;
    });

    const newMethod: PaymentMethod = {
      id: `pm_${Date.now()}`,
      ...paymentMethod,
      isDefault: true,
    };

    methods.push(newMethod);
    localStorage.setItem(PAYMENT_METHODS_KEY, JSON.stringify(methods));

    return newMethod;
  },

  async removePaymentMethod(methodId: string): Promise<void> {
    if (typeof window === 'undefined') throw new Error('Cannot remove payment method on server');

    const methods = await this.getPaymentMethods();
    const filtered = methods.filter((m) => m.id !== methodId);

    if (filtered.length === methods.length) {
      throw new Error('Payment method not found');
    }

    localStorage.setItem(PAYMENT_METHODS_KEY, JSON.stringify(filtered));
  },

  // Invoices
  async getInvoices(): Promise<Invoice[]> {
    if (typeof window === 'undefined') return [];

    const invoices = localStorage.getItem(INVOICES_KEY);
    return invoices ? JSON.parse(invoices) : [];
  },

  async downloadInvoice(invoiceId: string): Promise<string> {
    if (typeof window === 'undefined') throw new Error('Cannot download invoice on server');

    const invoices = await this.getInvoices();
    const invoice = invoices.find((i) => i.id === invoiceId);

    if (!invoice) {
      throw new Error('Invoice not found');
    }

    // In a real app, this would return a PDF URL from the server
    return invoice.pdfUrl || `#invoice-${invoiceId}`;
  },

  // Billing Contact
  async getBillingContact(): Promise<BillingContact | null> {
    if (typeof window === 'undefined') return null;

    const contact = localStorage.getItem(BILLING_CONTACT_KEY);
    return contact ? JSON.parse(contact) : null;
  },

  async updateBillingContact(contact: BillingContact): Promise<BillingContact> {
    if (typeof window === 'undefined') throw new Error('Cannot update billing contact on server');

    // Validate email
    if (!contact.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
      throw new Error('Invalid email address');
    }

    localStorage.setItem(BILLING_CONTACT_KEY, JSON.stringify(contact));
    return contact;
  },

  // Initialize mock data
  async initializeBillingData(
    subscription: Subscription,
    paymentMethods: PaymentMethod[],
    invoices: Invoice[],
    contact: BillingContact
  ): Promise<void> {
    if (typeof window === 'undefined') return;

    const existingSub = await this.getSubscription();
    const existingMethods = await this.getPaymentMethods();
    const existingInvoices = await this.getInvoices();
    const existingContact = await this.getBillingContact();

    if (!existingSub) {
      localStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(subscription));
    }

    if (existingMethods.length === 0) {
      localStorage.setItem(PAYMENT_METHODS_KEY, JSON.stringify(paymentMethods));
    }

    if (existingInvoices.length === 0) {
      localStorage.setItem(INVOICES_KEY, JSON.stringify(invoices));
    }

    if (!existingContact) {
      localStorage.setItem(BILLING_CONTACT_KEY, JSON.stringify(contact));
    }
  },
};
