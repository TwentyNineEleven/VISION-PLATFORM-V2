import type { AdminUserRecord, AdminUserStatus } from '@/lib/mock-admin';

const ADMIN_USERS_KEY = 'admin_users';
const PASSWORD_RESETS_KEY = 'password_resets';

export interface PasswordReset {
  userId: string;
  tempPassword: string;
  resetAt: string;
  resetBy: string;
}

export const userAdminService = {
  async getUsers(): Promise<AdminUserRecord[]> {
    if (typeof window === 'undefined') return [];

    const users = localStorage.getItem(ADMIN_USERS_KEY);
    if (!users) return [];

    return JSON.parse(users, (key, value) => {
      if ((key === 'lastLogin' || key === 'statusChangedAt') && value) {
        return new Date(value);
      }
      return value;
    });
  },

  async saveUsers(users: AdminUserRecord[]): Promise<void> {
    if (typeof window === 'undefined') throw new Error('Cannot save users on server');
    localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(users));
  },

  async toggleUserStatus(userId: string, active: boolean): Promise<void> {
    if (typeof window === 'undefined') throw new Error('Cannot toggle user status on server');

    const users = await this.getUsers();
    const user = users.find((u) => u.id === userId);

    if (!user) throw new Error('User not found');

    user.status = active ? 'active' : 'suspended';
    (user as any).statusChangedAt = new Date().toISOString();
    (user as any).statusChangedBy = 'admin';

    await this.saveUsers(users);
  },

  async resetPassword(userId: string): Promise<string> {
    if (typeof window === 'undefined') throw new Error('Cannot reset password on server');

    const tempPassword = `temp_${Math.random().toString(36).slice(2, 10)}`;

    // Log password reset
    const resets = JSON.parse(localStorage.getItem(PASSWORD_RESETS_KEY) || '[]') as PasswordReset[];
    resets.push({
      userId,
      tempPassword,
      resetAt: new Date().toISOString(),
      resetBy: 'admin',
    });
    localStorage.setItem(PASSWORD_RESETS_KEY, JSON.stringify(resets));

    // In production: send email with reset link
    console.log(`Password reset for user ${userId}: ${tempPassword}`);

    return tempPassword;
  },

  async deleteUser(userId: string): Promise<void> {
    if (typeof window === 'undefined') throw new Error('Cannot delete user on server');

    const users = await this.getUsers();
    const filtered = users.filter((u) => u.id !== userId);

    if (filtered.length === users.length) {
      throw new Error('User not found');
    }

    await this.saveUsers(filtered);
  },

  async impersonateUser(userId: string): Promise<void> {
    if (typeof window === 'undefined') throw new Error('Cannot impersonate user on server');

    // Store current admin session
    const adminSession = localStorage.getItem('admin_session');
    if (adminSession) {
      localStorage.setItem('impersonation_admin', adminSession);
    }

    // Set impersonation
    localStorage.setItem('impersonating_user', userId);
    localStorage.setItem('impersonation_started', new Date().toISOString());

    console.log(`Impersonating user ${userId}`);
  },
};
