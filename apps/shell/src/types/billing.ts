export interface Subscription {
  id: string;
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'cancelled' | 'past_due';
  billingCycle: 'monthly' | 'yearly';
  price: number;
  nextBillingDate: string;
  cancelAtPeriodEnd: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'card';
  last4: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed' | 'due';
  pdfUrl?: string;
}

export interface BillingContact {
  email: string;
  company: string;
  taxId: string;
}
