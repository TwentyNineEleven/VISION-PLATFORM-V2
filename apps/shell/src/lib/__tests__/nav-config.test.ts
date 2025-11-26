import { describe, expect, it } from 'vitest';
import { buildNavConfig, getActiveNavItem, getActiveSubmenuItem, helpNavItem, navConfig } from '../nav-config';

describe('nav-config', () => {
  it('freezes the base nav config to prevent mutation', () => {
    expect(Array.isArray(navConfig)).toBe(true);
    navConfig.forEach((item) => {
      expect(Object.isFrozen(item)).toBe(true);
      item.submenu?.forEach((subItem) => expect(Object.isFrozen(subItem)).toBe(true));
    });
    expect(Object.isFrozen(helpNavItem)).toBe(true);
  });

  it('produces fresh nav items without mutating the base config', () => {
    const first = buildNavConfig({ notificationsCount: 3 });
    const second = buildNavConfig();

    expect(first).not.toBe(second);
    expect(first[0]).not.toBe(navConfig[0]);
    expect(second[0]).not.toBe(navConfig[0]);
    expect(navConfig.find((item) => item.id === 'notifications')?.badge).toBeUndefined();

    const notificationsItem = first.find((item) => item.id === 'notifications');
    expect(notificationsItem?.badge).toBe(3);
    const notificationsItemSecond = second.find((item) => item.id === 'notifications');
    expect(notificationsItemSecond?.badge).toBeUndefined();
  });

  it('detects active nav and submenu items for nested routes', () => {
    const items = buildNavConfig();
<<<<<<< HEAD
    // Test with existing submenu path: /visionflow/tasks/123 should match visionflow-tasks
    expect(getActiveNavItem('/visionflow/tasks/123', items)).toBe('visionflow');
    expect(getActiveSubmenuItem('/visionflow/tasks/123', items)).toBe('visionflow-tasks');
=======
    expect(getActiveNavItem('/visionflow/projects/123', items)).toBe('visionflow');
    expect(getActiveSubmenuItem('/visionflow/projects/123', items)).toBe('visionflow-projects');
>>>>>>> 05f07ec71c0c13bbe1c7d94ae8f18e2a05d381c4
  });
});
