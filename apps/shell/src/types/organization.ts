export interface OrganizationAddress {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface OrganizationBrandColors {
  primary: string;
  secondary: string;
}

export interface Organization {
  id: string;
  name: string;
  type?: string;
  website?: string;
  industry?: string;
  ein?: string;
  logo?: string;
  mission?: string;
  foundedYear?: number;
  staffCount?: number;
  annualBudget?: string;
  focusAreas?: string[];
  address: OrganizationAddress;
  brandColors?: OrganizationBrandColors;
  updatedAt: string;
}


