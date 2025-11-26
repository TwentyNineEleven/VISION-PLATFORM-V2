/**
 * Documents API Route
 *
 * GET /api/v1/documents - List documents with filters
 * POST /api/v1/documents - Upload a new document
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { documentService } from '@/services/documentService';
import type { DocumentSearchParams } from '@/types/document';
import { handleApiError } from '@/lib/api-error-handler';
import { logApiRequest } from '@/lib/logger';

// ============================================================================
// GET - List Documents
// ============================================================================

export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    const supabase = await createServerSupabaseClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const organizationId = searchParams.get('organizationId');
    const folderId = searchParams.get('folderId');
    const query = searchParams.get('query');
    const tags = searchParams.get('tags')?.split(',').filter(Boolean);
    const mimeTypes = searchParams.get('mimeTypes')?.split(',').filter(Boolean);
    const uploadedBy = searchParams.get('uploadedBy');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const minSize = searchParams.get('minSize');
    const maxSize = searchParams.get('maxSize');
    const hasAI = searchParams.get('hasAI');
    const sortBy = searchParams.get('sortBy') as any;
    const sortOrder = searchParams.get('sortOrder') as 'asc' | 'desc';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!organizationId) {
      return NextResponse.json(
        { error: 'organizationId is required' },
        { status: 400 }
      );
    }

    // Build search parameters
    const params: DocumentSearchParams = {
      organizationId,
      folderId: folderId || undefined,
      query: query || undefined,
      tags: tags || undefined,
      mimeTypes: mimeTypes || undefined,
      uploadedBy: uploadedBy || undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      minSize: minSize ? parseInt(minSize) : undefined,
      maxSize: maxSize ? parseInt(maxSize) : undefined,
      hasAI: hasAI ? hasAI === 'true' : undefined,
      sortBy: sortBy || 'created_at',
      sortOrder: sortOrder || 'desc',
      limit,
      offset,
    };

    // Search documents
    const result = await documentService.searchDocuments(params);

    // Log successful request
    const duration = Date.now() - startTime;
    logApiRequest({
      method: 'GET',
      path: '/api/v1/documents',
      userId: user.id,
      organizationId,
      duration,
      statusCode: 200,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    const supabase = await createServerSupabaseClient();
    const { data: userData } = await supabase.auth.getUser();

    return handleApiError(error, {
      method: 'GET',
      path: '/api/v1/documents',
      userId: userData.user?.id,
      organizationId: request.nextUrl.searchParams.get('organizationId') || undefined,
    });
  }
}

// ============================================================================
// POST - Upload Document
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const organizationId = formData.get('organizationId') as string;
    const folderId = formData.get('folderId') as string | null;
    const name = formData.get('name') as string | null;
    const description = formData.get('description') as string | null;
    const tagsStr = formData.get('tags') as string | null;
    const metadataStr = formData.get('metadata') as string | null;
    const aiEnabled = formData.get('aiEnabled') === 'true';

    // Validate required fields
    if (!file) {
      return NextResponse.json(
        { error: 'file is required' },
        { status: 400 }
      );
    }

    if (!organizationId) {
      return NextResponse.json(
        { error: 'organizationId is required' },
        { status: 400 }
      );
    }

    // Parse tags and metadata
    let tags: string[] = [];
    if (tagsStr) {
      try {
        tags = JSON.parse(tagsStr);
      } catch {
        tags = tagsStr.split(',').map(t => t.trim());
      }
    }

    let metadata: Record<string, any> = {};
    if (metadataStr) {
      try {
        metadata = JSON.parse(metadataStr);
      } catch {
        // Invalid JSON, ignore
      }
    }

    // Upload document
  const document = await documentService.uploadDocument({
    file,
    organizationId,
    folderId: folderId ?? undefined,
      name: name ?? file.name,
      description: description ?? undefined,
      tags,
      metadata,
      aiEnabled,
    });

  return NextResponse.json({
    success: true,
    data: document,
  }, { status: 200 });
  } catch (error) {
    console.error('Error uploading document:', error);
    return NextResponse.json(
      {
        error: 'Failed to upload document',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
