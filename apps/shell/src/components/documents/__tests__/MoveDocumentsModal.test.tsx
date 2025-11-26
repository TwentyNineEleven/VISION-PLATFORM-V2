import { describe, expect, it } from 'vitest';
import { flattenFoldersForMove } from '../MoveDocumentsModal';
import type { FolderWithChildren } from '@/types/document';

const folderFixtures: FolderWithChildren[] = [
  {
    id: 'folder-1',
    organizationId: 'org-1',
    parentFolderId: null,
    name: 'Parent folder',
    description: 'top',
    color: '#000',
    icon: 'folder',
    path: 'parent',
    depth: 0,
    isSystem: false,
    metadata: {},
    createdBy: 'user-1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
    children: [
      {
        id: 'folder-2',
        organizationId: 'org-1',
        parentFolderId: 'folder-1',
        name: 'Child folder',
        description: 'child',
        color: '#111',
        icon: 'folder',
        path: 'parent/child',
        depth: 1,
        isSystem: false,
        metadata: {},
        createdBy: 'user-1',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
        children: [],
      },
    ],
  },
];

describe('flattenFoldersForMove', () => {
  it('returns flattened folder options with paths', () => {
    const result = flattenFoldersForMove(folderFixtures);

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({ id: 'folder-1', depth: 0, path: 'Root / Parent folder' });
    expect(result[1]).toMatchObject({ id: 'folder-2', depth: 1, path: 'Root / Parent folder / Child folder' });
  });
});
