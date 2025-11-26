export interface Cohort {
  id: string;
  name: string;
  description: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  status: 'active' | 'upcoming' | 'archived';
  granteeCount: number;
  totalFunding: number;
  fundingAllocated: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface CohortFormData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
}

export interface CohortFormErrors {
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  _form?: string;
}
