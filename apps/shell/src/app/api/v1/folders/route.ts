/**
 * Folders API Routes
 * 
 * Endpoints for managing folder hierarchy
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * Convert database row to folder format
 */
function dbToFolder(dbFolder: any) {
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
 * Build folder tree from flat list
 */
function buildFolderTree(folders: any[]): any[] {
  const folderMap = new Map<string, any>();
  folders.forEach(folder => {
    folderMap.set(folder.id, { ...folder, children: [] });
  });

  const rootFolders: any[] = [];

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
}

/**
 * GET /api/v1/folders
 * List folders with optional tree structure
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const organizationId = searchParams.get('organizationId');
    const parentId = searchParams.get('parentId');
    const tree = searchParams.get('tree') === 'true';

    if (!organizationId) {
      return NextResponse.json(
        { success: false, message: 'Organization ID is required' },
        { status: 400 }
      );
    }

    // Fetch folders from database
    let query = supabase
      .from('folders')
      .select('*')
      .eq('organization_id', organizationId)
      .is('deleted_at', null)
      .order('path', { ascending: true });

    // Apply parent filter if specified (only for non-tree requests)
    if (!tree && parentId) {
      query = query.eq('parent_folder_id', parentId);
    } else if (!tree && parentId === null) {
      query = query.is('parent_folder_id', null);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching folders:', error);
      return NextResponse.json(
        {
          success: false,
          message: error.message || 'Failed to fetch folders',
        },
        { status: 500 }
      );
    }

    // Convert database format to folder format
    let folders = (data || []).map(dbToFolder);

    // Build tree structure if requested
    if (tree) {
      folders = buildFolderTree(folders);
    }

    return NextResponse.json({
      success: true,
      data: folders,
    });
  } catch (error) {
    console.error('Error fetching folders:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch folders',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/folders
 * Create a new folder
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { organizationId, name, parentId, color, icon, description } = body;

    // Validate required fields
    if (!organizationId || !name || !name.trim()) {
      return NextResponse.json(
        { success: false, message: 'Organization ID and name are required' },
        { status: 400 }
      );
    }

    // Check if folder with same name exists at this level
    let checkQuery = supabase
      .from('folders')
      .select('id, name')
      .eq('organization_id', organizationId)
      .eq('name', name.trim())
      .is('deleted_at', null);

    if (parentId) {
      checkQuery = checkQuery.eq('parent_folder_id', parentId);
    } else {
      checkQuery = checkQuery.is('parent_folder_id', null);
    }

    const { data: existingFolders } = await checkQuery;

    if (existingFolders && existingFolders.length > 0) {
      return NextResponse.json(
        { success: false, message: 'A folder with this name already exists at this location' },
        { status: 409 }
      );
    }

    // Calculate path and depth if parent is specified
    let path = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
    let depth = 0;

    if (parentId) {
      // Get parent folder to calculate path and depth
      const { data: parentFolder } = await supabase
        .from('folders')
        .select('path, depth')
        .eq('id', parentId)
        .is('deleted_at', null)
        .single();

      if (parentFolder) {
        path = `${parentFolder.path}/${path}`;
        depth = (parentFolder.depth || 0) + 1;
      } else {
        return NextResponse.json(
          { success: false, message: 'Parent folder not found' },
          { status: 404 }
        );
      }
    }

    // Prepare folder data
    const folderData = {
      organization_id: organizationId,
      parent_folder_id: parentId || null,
      name: name.trim(),
      description: description || null,
      color: color || null,
      icon: icon || null,
      path,
      depth,
      is_system: false,
      metadata: {},
      created_by: user.id,
      updated_by: user.id,
    };

    // Insert folder
    const { data, error } = await supabase
      .from('folders')
      .insert(folderData)
      .select()
      .single();

    if (error) {
      console.error('Error creating folder:', error);
      return NextResponse.json(
        {
          success: false,
          message: error.message || 'Failed to create folder',
        },
        { status: 500 }
      );
    }

    // Convert to response format
    const folder = dbToFolder(data);

    return NextResponse.json({
      success: true,
      data: folder,
      message: 'Folder created successfully',
    });
  } catch (error) {
    console.error('Error creating folder:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create folder',
      },
      { status: 500 }
    );
  }
}
