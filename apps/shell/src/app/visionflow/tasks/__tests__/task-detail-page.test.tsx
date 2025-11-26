import { afterEach, describe, expect, it, vi } from 'vitest';
import { addCommentWithFallback, fetchTaskData, isSupabaseConfigured } from '../[id]/page';

const { mockGetTask, mockAddComment } = vi.hoisted(() => ({
  mockGetTask: vi.fn(),
  mockAddComment: vi.fn(),
}));

vi.mock('@/services/visionflowService', () => ({
  visionflowService: {
    getTask: mockGetTask,
    addComment: mockAddComment,
  },
}));

describe('VisionFlow task detail data helpers', () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    mockGetTask.mockReset();
    mockAddComment.mockReset();
    Object.assign(process.env, originalEnv);
  });

  it('detects Supabase configuration', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon';

    expect(isSupabaseConfigured()).toBe(true);
  });

  it('fetches task data from the VisionFlow service when configured', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon';

    mockGetTask.mockResolvedValueOnce({
      id: 'task-123',
      title: 'Service-backed task',
      status: 'IN_PROGRESS',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    const { task, infoMessage } = await fetchTaskData('task-123');

    expect(mockGetTask).toHaveBeenCalledWith('task-123');
    expect(task?.title).toBe('Service-backed task');
    expect(infoMessage).toBeNull();
  });

  it('falls back to demo fixtures when Supabase is missing', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = '';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = '';

    const { task, infoMessage } = await fetchTaskData('demo-task-onboarding');

    expect(mockGetTask).not.toHaveBeenCalled();
    expect(task?.title).toMatch(/VisionFlow onboarding/i);
    expect(infoMessage).toMatch(/demo task from fixtures/i);
  });

  it('posts a comment through the service when Supabase is configured', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon';

    mockAddComment.mockResolvedValueOnce({ id: 'comment-1', created_at: '2024-01-01T00:00:00.000Z' });

    const result = await addCommentWithFallback('task-123', 'Hello from service');

    expect(mockAddComment).toHaveBeenCalledWith('task-123', 'current-user', 'Hello from service');
    expect(result.id).toBe('comment-1');
    expect(result.content).toBe('Hello from service');
  });

  it('creates a local comment when Supabase is not configured', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = '';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = '';

    const result = await addCommentWithFallback('task-123', 'Local comment');

    expect(mockAddComment).not.toHaveBeenCalled();
    expect(result.content).toBe('Local comment');
    expect(result.user.name).toBe('You');
  });
});
