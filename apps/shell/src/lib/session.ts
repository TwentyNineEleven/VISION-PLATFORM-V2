import { mockUser } from './mock-data';
import type { UserRole } from './auth';

export type CurrentUser = typeof mockUser;

export function getCurrentUser(): CurrentUser {
  return mockUser;
}

export function getCurrentUserRole(): UserRole | undefined {
  return mockUser.roleKey;
}

