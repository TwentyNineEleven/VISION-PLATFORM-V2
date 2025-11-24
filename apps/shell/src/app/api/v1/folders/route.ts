/**
 * Folders API Routes
 * 
 * Endpoints for managing folder hierarchy
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { folderService } from '@/services/folderService';

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

    let folders;
    
    if (tree) {
      // Get folder tree
      folders = await folderService.getFolderTree(organizationId);
    } else {
      // Get all folders for organization
      folders = await folderService.getFolders(organizationId);
      
      // Filter by parentId if specified
      if (parentId) {
        folders = folders.filter(f => f.parentFolderId === parentId);
      } else if (parentId === null) {
        // Get only root folders
        folders = folders.filter(f => f.parentFolderId === null);
      }
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
    if (!organizationId || !name) {
      return NextResponse.json(
        { success: false, message: 'Organization ID and name are required' },
        { status: 400 }
      );
    }

    // Create folder
    const folder = await folderService.createFolder({
      organizationId,
      name,
      parentFolderId: parentId,
      color,
      icon,
      description,
    });

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
