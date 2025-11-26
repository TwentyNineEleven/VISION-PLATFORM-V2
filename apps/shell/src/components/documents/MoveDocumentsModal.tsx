'use client';

import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, Check, Folder, X } from 'lucide-react';
import type { FolderWithChildren } from '@/types/document';

interface MoveDocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  folders: FolderWithChildren[];
  currentFolderId: string | null;
  isSubmitting: boolean;
  errorMessage?: string | null;
  onConfirm: (targetFolderId: string | null) => void;
}

export interface FolderOption {
  id: string | null;
  name: string;
  depth: number;
  path: string;
}

export function flattenFoldersForMove(
  folders: FolderWithChildren[],
  depth = 0,
  parentPath = 'Root'
): FolderOption[] {
  return folders.flatMap((folder) => {
    const path = `${parentPath} / ${folder.name}`;
    const current: FolderOption = {
      id: folder.id,
      name: folder.name,
      depth,
      path,
    };

    const children = folder.children?.length
      ? flattenFoldersForMove(folder.children, depth + 1, path)
      : [];

    return [current, ...children];
  });
}

export default function MoveDocumentsModal({
  isOpen,
  onClose,
  folders,
  currentFolderId,
  isSubmitting,
  errorMessage,
  onConfirm,
}: MoveDocumentsModalProps) {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(currentFolderId);

  useEffect(() => {
    if (isOpen) {
      setSelectedFolderId(currentFolderId);
    }
  }, [isOpen, currentFolderId]);

  const folderOptions = useMemo(() => {
    return [
      { id: null, name: 'Workspace root', depth: 0, path: 'Root' },
      ...flattenFoldersForMove(folders),
    ];
  }, [folders]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Folder className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Move documents</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Choose a destination folder for the selected documents
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            aria-label="Close move documents modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
          {errorMessage && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900">Unable to move documents</p>
                <p className="text-sm text-red-700 mt-1">{errorMessage}</p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Select a target folder. Moving to the workspace root will remove any existing folder assignment.
            </p>

            <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
              {folderOptions.map((option) => (
                <label
                  key={option.id ?? 'root'}
                  className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedFolderId === option.id ? 'bg-blue-50/60 border-l-4 border-blue-500' : ''
                  }`}
                  style={{ paddingLeft: `${option.depth * 12 + 12}px` }}
                >
                  <input
                    type="radio"
                    name="targetFolder"
                    className="sr-only"
                    checked={selectedFolderId === option.id}
                    onChange={() => setSelectedFolderId(option.id)}
                  />
                  <div className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center">
                    {selectedFolderId === option.id && <Check className="w-4 h-4 text-blue-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{option.name}</p>
                    <p className="text-xs text-gray-500">{option.path}</p>
                  </div>
                </label>
              ))}
            </div>
            {folderOptions.length === 1 && (
              <div className="text-sm text-gray-500">Create a folder to see more destinations.</div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(selectedFolderId ?? null)}
            disabled={isSubmitting || !folderOptions.length}
            className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Moving…' : 'Move documents'}
          </button>
        </div>
      </div>
    </div>
  );
}
