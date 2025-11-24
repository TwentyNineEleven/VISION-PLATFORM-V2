/**
 * Folder Tree Component
 * 
 * Hierarchical folder navigation with expand/collapse
 */

'use client';

import { useState, useEffect } from 'react';
import { Folder, ChevronRight, ChevronDown, Plus, FolderPlus } from 'lucide-react';
import type { FolderWithChildren } from '@/types/document';

interface FolderTreeProps {
  organizationId: string;
  currentFolderId: string | null;
  onFolderClick: (folderId: string | null) => void;
  onCreateFolder?: () => void;
}

interface FolderNodeProps {
  folder: FolderWithChildren;
  level: number;
  isSelected: boolean;
  onSelect: (folderId: string) => void;
  expandedFolders: Set<string>;
  onToggleExpand: (folderId: string) => void;
}

function FolderNode({
  folder,
  level,
  isSelected,
  onSelect,
  expandedFolders,
  onToggleExpand,
}: FolderNodeProps) {
  const isExpanded = expandedFolders.has(folder.id);
  const hasChildren = folder.children && folder.children.length > 0;

  return (
    <div>
      <button
        onClick={() => onSelect(folder.id)}
        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
          isSelected
            ? 'bg-blue-50 text-blue-600 font-medium'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
        style={{ paddingLeft: `${level * 12 + 12}px` }}
      >
        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(folder.id);
            }}
            className="p-0.5 hover:bg-gray-200 rounded transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
          </button>
        )}
        {!hasChildren && <div className="w-4" />}
        
        <Folder
          className="w-4 h-4 flex-shrink-0"
          style={folder.color ? { color: folder.color } : undefined}
        />
        
        <span className="flex-1 truncate text-left">{folder.name}</span>
        
        {folder.documentCount !== undefined && (
          <span className="text-xs text-gray-400 ml-auto">
            {folder.documentCount}
          </span>
        )}
      </button>

      {hasChildren && isExpanded && (
        <div>
          {folder.children!.map((child) => (
            <FolderNode
              key={child.id}
              folder={child}
              level={level + 1}
              isSelected={isSelected}
              onSelect={onSelect}
              expandedFolders={expandedFolders}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function FolderTree({
  organizationId,
  currentFolderId,
  onFolderClick,
  onCreateFolder,
}: FolderTreeProps) {
  const [folders, setFolders] = useState<FolderWithChildren[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadFolders();
  }, [organizationId]);

  const loadFolders = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `/api/v1/folders?organizationId=${organizationId}&tree=true`
      );
      
      if (!response.ok) {
        throw new Error('Failed to load folders');
      }
      
      const result = await response.json();
      
      if (result.success) {
        setFolders(result.data || []);
        
        // Auto-expand folders in the path to current folder
        if (currentFolderId) {
          const pathFolders = findPathToFolder(result.data, currentFolderId);
          setExpandedFolders(new Set(pathFolders));
        }
      } else {
        setError(result.message || 'Failed to load folders');
      }
    } catch (err) {
      console.error('Error loading folders:', err);
      setError(err instanceof Error ? err.message : 'Failed to load folders');
    } finally {
      setIsLoading(false);
    }
  };

  const findPathToFolder = (
    folders: FolderWithChildren[],
    targetId: string,
    path: string[] = []
  ): string[] => {
    for (const folder of folders) {
      const newPath = [...path, folder.id];
      
      if (folder.id === targetId) {
        return newPath;
      }
      
      if (folder.children && folder.children.length > 0) {
        const found = findPathToFolder(folder.children, targetId, newPath);
        if (found.length > 0) {
          return found;
        }
      }
    }
    
    return [];
  };

  const toggleExpand = (folderId: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const handleFolderSelect = (folderId: string) => {
    onFolderClick(folderId);
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-2">
          <div className="h-8 bg-gray-200 rounded"></div>
          <div className="h-8 bg-gray-200 rounded ml-4"></div>
          <div className="h-8 bg-gray-200 rounded ml-4"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="text-sm text-red-600 bg-red-50 rounded-lg p-3">
          {error}
        </div>
        <button
          onClick={loadFolders}
          className="mt-2 text-sm text-blue-600 hover:text-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header with Create Folder Button */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Folders
        </div>
        {onCreateFolder && (
          <button
            onClick={onCreateFolder}
            className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Create folder"
          >
            <FolderPlus className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* All Files (Root) */}
      <button
        onClick={() => onFolderClick(null)}
        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm mb-1 transition-colors ${
          currentFolderId === null
            ? 'bg-blue-50 text-blue-600 font-medium'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <Folder className="w-4 h-4" />
        <span>All Files</span>
      </button>

      {/* Folder Tree */}
      {folders.length === 0 ? (
        <div className="mt-4 text-center">
          <FolderPlus className="w-12 h-12 mx-auto text-gray-300 mb-2" />
          <p className="text-sm text-gray-500 mb-2">No folders yet</p>
          {onCreateFolder && (
            <button
              onClick={onCreateFolder}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Create your first folder
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-0.5">
          {folders.map((folder) => (
            <FolderNode
              key={folder.id}
              folder={folder}
              level={0}
              isSelected={currentFolderId === folder.id}
              onSelect={handleFolderSelect}
              expandedFolders={expandedFolders}
              onToggleExpand={toggleExpand}
            />
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Quick Filters
        </div>
        <div className="space-y-1">
          <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Recent</span>
          </button>
          <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Shared with me</span>
          </button>
          <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span>Starred</span>
          </button>
        </div>
      </div>
    </div>
  );
}
