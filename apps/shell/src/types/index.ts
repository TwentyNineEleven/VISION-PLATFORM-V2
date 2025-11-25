// Common types for the VISION Platform

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface Organization {
  id: string;
  name: string;
  logo?: string;
}

// Re-export module types
export * from './community-pulse';
