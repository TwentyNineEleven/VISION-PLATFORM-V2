import type { AdminAppControl, OrgAppAssignment } from '@/lib/mock-admin';

const ADMIN_APP_CONTROLS_KEY = 'admin_app_controls';
const ORG_APP_ASSIGNMENTS_KEY = 'org_app_assignments';

export interface App {
  id: string;
  name: string;
  enabled: boolean;
  installedCount: number;
}

export const adminAppService = {
  async getAppControls(): Promise<AdminAppControl[]> {
    if (typeof window === 'undefined') return [];

    const controls = localStorage.getItem(ADMIN_APP_CONTROLS_KEY);
    if (!controls) return [];

    return JSON.parse(controls);
  },

  async saveAppControls(controls: AdminAppControl[]): Promise<void> {
    if (typeof window === 'undefined') throw new Error('Cannot save app controls on server');
    localStorage.setItem(ADMIN_APP_CONTROLS_KEY, JSON.stringify(controls));
  },

  async getOrgAssignments(): Promise<OrgAppAssignment[]> {
    if (typeof window === 'undefined') return [];

    const assignments = localStorage.getItem(ORG_APP_ASSIGNMENTS_KEY);
    if (!assignments) return [];

    return JSON.parse(assignments, (key, value) => {
      if (key === 'lastUsed' && value) {
        return new Date(value);
      }
      return value;
    });
  },

  async saveOrgAssignments(assignments: OrgAppAssignment[]): Promise<void> {
    if (typeof window === 'undefined') throw new Error('Cannot save org assignments on server');
    localStorage.setItem(ORG_APP_ASSIGNMENTS_KEY, JSON.stringify(assignments));
  },

  async toggleAppStatus(appId: string, enabled: boolean): Promise<void> {
    if (typeof window === 'undefined') throw new Error('Cannot toggle app status on server');

    const controls = await this.getAppControls();
    const control = controls.find((c) => c.appId === appId);

    if (!control) throw new Error('App control not found');

    control.globallyAvailable = enabled;

    await this.saveAppControls(controls);
  },

  async deleteApp(appId: string): Promise<void> {
    if (typeof window === 'undefined') throw new Error('Cannot delete app on server');

    // Remove from controls
    const controls = await this.getAppControls();
    const filteredControls = controls.filter((c) => c.appId !== appId);

    if (filteredControls.length === controls.length) {
      throw new Error('App not found');
    }

    await this.saveAppControls(filteredControls);

    // Remove from all org assignments
    const assignments = await this.getOrgAssignments();
    const updatedAssignments = assignments.map((org) => ({
      ...org,
      apps: org.apps.filter((app) => app.appId !== appId),
    }));

    await this.saveOrgAssignments(updatedAssignments);
  },

  getInstalledCount(appId: string, assignments: OrgAppAssignment[]): number {
    return assignments.reduce((count, org) => {
      const app = org.apps.find((a) => a.appId === appId && a.status === 'enabled');
      return count + (app ? 1 : 0);
    }, 0);
  },
};
