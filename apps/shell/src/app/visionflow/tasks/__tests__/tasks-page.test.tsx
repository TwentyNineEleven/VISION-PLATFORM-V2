import { describe, expect, it, vi, afterEach } from 'vitest';
import { createTaskWithFallback, fetchTasksData, isSupabaseConfigured } from '../page';

const { mockGetTasks, mockCreateTask } = vi.hoisted(() => ({
  mockGetTasks: vi.fn(),
  mockCreateTask: vi.fn(),
}));

vi.mock('@/services/visionflowService', () => ({
  visionflowService: {
    getTasks: mockGetTasks,
    createTask: mockCreateTask,
  },
}));

describe('VisionFlow tasks page data helpers', () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    mockGetTasks.mockReset();
    mockCreateTask.mockReset();
    Object.assign(process.env, originalEnv);
  });

  it('detects when Supabase is configured', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon';

    expect(isSupabaseConfigured()).toBe(true);
  });

  it('uses the VisionFlow service when Supabase is configured', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon';

    mockGetTasks.mockResolvedValueOnce([
      { id: 'task-123', title: 'Service task', status: 'IN_PROGRESS' },
    ]);

    const { tasks, infoMessage } = await fetchTasksData('all', 'all');

    expect(mockGetTasks).toHaveBeenCalledWith({ priority: undefined, status: undefined });
    expect(tasks[0].title).toBe('Service task');
    expect(infoMessage).toBeNull();
  });

  it('falls back to demo fixtures and message when Supabase is missing', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = '';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = '';

    const { tasks, infoMessage } = await fetchTasksData('all', 'all');

    expect(mockGetTasks).not.toHaveBeenCalled();
    expect(tasks.some((task) => task.title.includes('VisionFlow onboarding'))).toBe(true);
    expect(infoMessage).toMatch(/demo tasks from fixtures/i);
  });

  it('creates a task through the service when Supabase is configured', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon';

    mockCreateTask.mockResolvedValueOnce({ id: 'task-999', title: 'New Task', status: 'NOT_STARTED' });

    const { task, infoMessage } = await createTaskWithFallback('New Task');

    expect(mockCreateTask).toHaveBeenCalledWith({ status: 'NOT_STARTED', title: 'New Task' });
    expect(task.id).toBe('task-999');
    expect(infoMessage).toBeNull();
  });

  it('creates a demo task locally when Supabase is not configured', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = '';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = '';

    const { task, infoMessage } = await createTaskWithFallback('Local Task');

    expect(mockCreateTask).not.toHaveBeenCalled();
    expect(task.title).toBe('Local Task');
    expect(infoMessage).toMatch(/created locally/i);
  });
});
