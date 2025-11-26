import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { moveDocuments } from '../moveDocuments';

describe('moveDocuments helper', () => {
  let mockFetch: Mock;

  beforeEach(() => {
    mockFetch = vi.fn();
    vi.stubGlobal('fetch', mockFetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('sends PATCH requests for each document', async () => {
    const mockResponse = { ok: true } as Response;
    mockFetch.mockResolvedValue(mockResponse);

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
    mockFetch
      .mockResolvedValueOnce({ ok: true } as Response)
      .mockResolvedValueOnce({ ok: false } as Response);

    await expect(moveDocuments(['doc-1', 'doc-2'], null)).rejects.toThrow(
      'Failed to move one or more documents'
    );
  });
});
