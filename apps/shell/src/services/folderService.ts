/**
 * Folder Service
 * 
 * Handles all folder-related operations including:
 * - CRUD operations
 * - Hierarchy management
 * - Navigation
 * - Permissions
 */

'use client';

import { createClient } from '@/lib/supabase/client';
import type {
  Folder,
  FolderWithChildren,
  CreateFolderRequest,
  UpdateFolderRequest,
} from '@/types/document';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Convert database row to Folder type
 */
function dbToFolder(dbFolder: any): Folder {
  return {
    id: dbFolder.id,
    organizationId: dbFolder.organization_id,
    parentFolderId: dbFolder.parent_folder_id,
    name: dbFolder.name,
    description: dbFolder.description,
    color: dbFolder.color,
    icon: dbFolder.icon,
    path: dbFolder.path,
    depth: dbFolder.depth,
    isSystem: dbFolder.is_system,
    metadata: dbFolder.metadata || {},
    createdBy: dbFolder.created_by,
    updatedBy: dbFolder.updated_by,
    createdAt: dbFolder.created_at,
    updatedAt: dbFolder.updated_at,
    deletedAt: dbFolder.deleted_at,
    deletedBy: dbFolder.deleted_by,
  };
}

/**
 * Convert Folder type to database format
 */
function folderToDb(folder: Partial<CreateFolderRequest | UpdateFolderRequest>): any {
  const dbFolder: any = {};

  if (folder.name !== undefined) dbFolder.name = folder.name;
  if (folder.description !== undefined) dbFolder.description = folder.description;
  if (folder.color !== undefined) dbFolder.color = folder.color;
  if (folder.icon !== undefined) dbFolder.icon = folder.icon;
  if ('organizationId' in folder && folder.organizationId !== undefined) {
    dbFolder.organization_id = folder.organizationId;
  }
  if ('parentFolderId' in folder && folder.parentFolderId !== undefined) {
    dbFolder.parent_folder_id = folder.parentFolderId;
  }

  return dbFolder;
}

// ============================================================================
// FOLDER SERVICE
// ============================================================================

export const folderService = {
  /**
   * Get folder by ID
   */
  async getFolder(folderId: string): Promise<Folder | null> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('folders')
      .select('*')
      .eq('id', folderId)
      .is('deleted_at', null)
      .single();

    if (error || !data) {
      console.error('Error fetching folder:', error);
      return null;
    }

    return dbToFolder(data);
  },

  /**
   * Get all folders for an organization (flat list)
   */
  async getFolders(organizationId: string): Promise<Folder[]> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('folders')
      .select('*')
      .eq('organization_id', organizationId)
      .is('deleted_at', null)
      .order('path', { ascending: true });

    if (error) {
      console.error('Error fetching folders:', error);
      return [];
    }

    return data.map(dbToFolder);
  },

  /**
   * Get folder tree (hierarchical structure)
   */
  async getFolderTree(organizationId: string): Promise<FolderWithChildren[]> {
    const folders = await this.getFolders(organizationId);

    // Build a map of folders by ID for quick lookup
    const folderMap = new Map<string, FolderWithChildren>();
    folders.forEach(folder => {
      folderMap.set(folder.id, { ...folder, children: [] });
    });

    // Build the tree structure
    const rootFolders: FolderWithChildren[] = [];

    folders.forEach(folder => {
      const folderWithChildren = folderMap.get(folder.id)!;

      if (folder.parentFolderId) {
        // Add to parent's children
        const parent = folderMap.get(folder.parentFolderId);
        if (parent) {
          parent.children.push(folderWithChildren);
        }
      } else {
        // Root level folder
        rootFolders.push(folderWithChildren);
      }
    });

    return rootFolders;
  },

  /**
   * Get folders at a specific level (by parent)
   */
  async getFoldersByParent(
    organizationId: string,
    parentFolderId: string | null
  ): Promise<Folder[]> {
    const supabase = createClient();

    let query = supabase
      .from('folders')
      .select('*')
      .eq('organization_id', organizationId)
      .is('deleted_at', null)
      .order('name', { ascending: true });

    if (parentFolderId) {
      query = query.eq('parent_folder_id', parentFolderId);
    } else {
      query = query.is('parent_folder_id', null);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching folders by parent:', error);
      return [];
    }

    return data.map(dbToFolder);
  },

  /**
   * Get folder breadcrumb path (from root to current folder)
   */
  async getFolderBreadcrumb(folderId: string): Promise<Folder[]> {
    const supabase = createClient();

    const { data: folder } = await supabase
      .from('folders')
      .select('path, organization_id')
      .eq('id', folderId)
      .single();

    if (!folder || !folder.path) return [];

    // Extract folder IDs from path (format: /id1/id2/id3/)
    const folderIds = folder.path
      .split('/')
      .filter(id => id.length > 0);

    if (folderIds.length === 0) return [];

    // Fetch all folders in the path
    const { data: folders } = await supabase
      .from('folders')
      .select('*')
      .in('id', folderIds)
      .eq('organization_id', folder.organization_id)
      .is('deleted_at', null)
      .order('depth', { ascending: true });

    if (!folders) return [];

    return folders.map(dbToFolder);
  },

  /**
   * Create a new folder
   */
  async createFolder(request: CreateFolderRequest): Promise<Folder> {
    const supabase = createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Validate folder name
    if (!request.name || request.name.trim().length === 0) {
      throw new Error('Folder name is required');
    }

    // Check if folder with same name exists at this level
    const existing = await this.getFoldersByParent(
      request.organizationId,
      request.parentFolderId || null
    );

    if (existing.some(f => f.name === request.name)) {
      throw new Error('A folder with this name already exists at this location');
    }

    const dbFolder = {
      ...folderToDb(request),
      created_by: user.id,
      updated_by: user.id,
    };

    const { data, error } = await supabase
      .from('folders')
      .insert(dbFolder)
      .select()
      .single();

    if (error || !data) {
      console.error('Error creating folder:', error);
      throw new Error(`Failed to create folder: ${error?.message || 'Unknown error'}`);
    }

    return dbToFolder(data);
  },

  /**
   * Update folder
   */
  async updateFolder(folderId: string, request: UpdateFolderRequest): Promise<Folder> {
    const supabase = createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const dbFolder = {
      ...folderToDb(request),
      updated_by: user.id,
    };

    const { data, error } = await supabase
      .from('folders')
      .update(dbFolder)
      .eq('id', folderId)
      .is('deleted_at', null)
      .select()
      .single();

    if (error || !data) {
      console.error('Error updating folder:', error);
      throw new Error(`Failed to update folder: ${error?.message || 'Unknown error'}`);
    }

    return dbToFolder(data);
  },

  /**
   * Move folder to a new parent
   */
  async moveFolder(folderId: string, newParentFolderId: string | null): Promise<Folder> {
    const supabase = createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get current folder to check if move is valid
    const folder = await this.getFolder(folderId);
    if (!folder) {
      throw new Error('Folder not found');
    }

    // Can't move a folder into itself or its descendants
    if (newParentFolderId) {
      const newParent = await this.getFolder(newParentFolderId);
      if (!newParent) {
        throw new Error('Destination folder not found');
      }

      // Check if new parent is a descendant of current folder
      if (newParent.path.includes(`/${folderId}/`)) {
        throw new Error('Cannot move folder into its own subfolder');
      }

      // Check organization match
      if (folder.organizationId !== newParent.organizationId) {
        throw new Error('Cannot move folder to different organization');
      }
    }

    // Update parent folder ID (trigger will update path automatically)
    const { data, error } = await supabase
      .from('folders')
      .update({
        parent_folder_id: newParentFolderId,
        updated_by: user.id,
      })
      .eq('id', folderId)
      .is('deleted_at', null)
      .select()
      .single();

    if (error || !data) {
      console.error('Error moving folder:', error);
      throw new Error(`Failed to move folder: ${error?.message || 'Unknown error'}`);
    }

    return dbToFolder(data);
  },

  /**
   * Delete folder (soft delete)
   */
  async deleteFolder(folderId: string): Promise<void> {
    const supabase = createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Check if folder has subfolders or documents
    const { data: subfolders } = await supabase
      .from('folders')
      .select('id')
      .eq('parent_folder_id', folderId)
      .is('deleted_at', null)
      .limit(1);

    if (subfolders && subfolders.length > 0) {
      throw new Error('Cannot delete folder with subfolders. Please delete or move subfolders first.');
    }

    const { data: documents } = await supabase
      .from('documents')
      .select('id')
      .eq('folder_id', folderId)
      .is('deleted_at', null)
      .limit(1);

    if (documents && documents.length > 0) {
      throw new Error('Cannot delete folder with documents. Please delete or move documents first.');
    }

    // Soft delete
    const { error } = await supabase
      .from('folders')
      .update({
        deleted_at: new Date().toISOString(),
        deleted_by: user.id,
      })
      .eq('id', folderId);

    if (error) {
      console.error('Error deleting folder:', error);
      throw new Error(`Failed to delete folder: ${error.message}`);
    }
  },

  /**
   * Get document count for a folder (including subfolders)
   */
  async getDocumentCount(folderId: string, includeSubfolders: boolean = false): Promise<number> {
    const supabase = createClient();

    if (!includeSubfolders) {
      // Count documents directly in this folder
      const { count, error } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true })
        .eq('folder_id', folderId)
        .is('deleted_at', null);

      if (error) {
        console.error('Error counting documents:', error);
        return 0;
      }

      return count || 0;
    }

    // Get folder to access its path
    const folder = await this.getFolder(folderId);
    if (!folder) return 0;

    // Get all subfolders using path pattern matching
    const { data: subfolders } = await supabase
      .from('folders')
      .select('id')
      .eq('organization_id', folder.organizationId)
      .like('path', `${folder.path}%`)
      .is('deleted_at', null);

    if (!subfolders) return 0;

    const folderIds = [folderId, ...subfolders.map(f => f.id)];

    // Count documents in all folders
    const { count, error } = await supabase
      .from('documents')
      .select('*', { count: 'exact', head: true })
      .in('folder_id', folderIds)
      .is('deleted_at', null);

    if (error) {
      console.error('Error counting documents with subfolders:', error);
      return 0;
    }

    return count || 0;
  },

  /**
   * Search folders by name
   */
  async searchFolders(organizationId: string, query: string): Promise<Folder[]> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('folders')
      .select('*')
      .eq('organization_id', organizationId)
      .ilike('name', `%${query}%`)
      .is('deleted_at', null)
      .order('name', { ascending: true })
      .limit(20);

    if (error) {
      console.error('Error searching folders:', error);
      return [];
    }

    return data.map(dbToFolder);
  },

  /**
   * Get recent folders (by updated_at)
   */
  async getRecentFolders(organizationId: string, limit: number = 10): Promise<Folder[]> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('folders')
      .select('*')
      .eq('organization_id', organizationId)
      .is('deleted_at', null)
      .order('updated_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent folders:', error);
      return [];
    }

    return data.map(dbToFolder);
  },

  /**
   * Validate folder name
   */
  validateFolderName(name: string): { valid: boolean; error?: string } {
    if (!name || name.trim().length === 0) {
      return { valid: false, error: 'Folder name cannot be empty' };
    }

    if (name.length > 255) {
      return { valid: false, error: 'Folder name is too long (max 255 characters)' };
    }

    // Check for invalid characters
    const invalidChars = /[<>:"|?*\x00-\x1F\/\\]/g;
    if (invalidChars.test(name)) {
      return { valid: false, error: 'Folder name contains invalid characters' };
    }

    return { valid: true };
  },

  /**
   * Get folder statistics
   */
  async getFolderStatistics(organizationId: string): Promise<{
    totalFolders: number;
    totalDocuments: number;
    maxDepth: number;
    recentlyUpdated: Folder[];
  }> {
    const supabase = createClient();

    // Get total folders count
    const { count: folderCount } = await supabase
      .from('folders')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId)
      .is('deleted_at', null);

    // Get total documents count
    const { count: docCount } = await supabase
      .from('documents')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId)
      .is('deleted_at', null);

    // Get max depth
    const { data: maxDepthData } = await supabase
      .from('folders')
      .select('depth')
      .eq('organization_id', organizationId)
      .is('deleted_at', null)
      .order('depth', { ascending: false })
      .limit(1);

    // Get recently updated folders
    const recentlyUpdated = await this.getRecentFolders(organizationId, 5);

    return {
      totalFolders: folderCount || 0,
      totalDocuments: docCount || 0,
      maxDepth: maxDepthData?.[0]?.depth || 0,
      recentlyUpdated,
    };
  },
};

// ============================================================================
// EXPORT
// ============================================================================

export default folderService;
