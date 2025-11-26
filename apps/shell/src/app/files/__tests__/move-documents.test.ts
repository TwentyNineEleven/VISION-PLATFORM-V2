import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { moveDocuments } from '../page';

declare global {
  // eslint-disable-next-line no-var
  var fetch: ReturnType<typeof vi.fn>;
}

describe('moveDocuments helper', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('sends PATCH requests for each document', async () => {
    const mockResponse = { ok: true } as Response;
    global.fetch.mockResolvedValue(mockResponse);

    await moveDocuments(['doc-1', 'doc-2'], 'folder-123');

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.fetch).toHaveBeenCalledWith('/api/v1/documents/doc-1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folderId: 'folder-123' }),
    });
    expect(global.fetch).toHaveBeenCalledWith('/api/v1/documents/doc-2', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folderId: 'folder-123' }),
    });
  });

  it('throws when any response is not ok', async () => {
    global.fetch
      .mockResolvedValueOnce({ ok: true } as Response)
      .mockResolvedValueOnce({ ok: false } as Response);

    await expect(moveDocuments(['doc-1', 'doc-2'], null)).rejects.toThrow(
      'Failed to move one or more documents'
    );
  });
});
