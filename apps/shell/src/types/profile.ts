export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  phone?: string;
  title?: string;
  timezone?: string;
  avatar?: string;
  notificationPreferences?: {
    productUpdates: boolean;
    securityAlerts: boolean;
    weeklySummary: boolean;
    channels: string[];
  };
  updatedAt: string;
}

export interface ProfileFormData {
  displayName: string;
  email: string;
  phone?: string;
  title?: string;
  timezone?: string;
  avatar?: string;
  notificationPreferences?: {
    productUpdates: boolean;
    securityAlerts: boolean;
    weeklySummary: boolean;
    channels: string[];
  };
}

export interface ProfileFormErrors {
  displayName?: string;
  email?: string;
  phone?: string;
  title?: string;
  timezone?: string;
  _form?: string;
}
