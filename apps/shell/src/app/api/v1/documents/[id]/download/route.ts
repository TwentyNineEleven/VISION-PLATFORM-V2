/**
 * Document Download API Route
 * 
 * GET /api/v1/documents/[id]/download - Get signed download URL
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { documentService } from '@/services/documentService';
import type { AsyncRouteParams } from '@/types/next';

// ============================================================================
// GET - Get Download URL
// ============================================================================

export async function GET(
  request: NextRequest,
  { params }: AsyncRouteParams<{ id: string }>
) {
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

    const { id: documentId } = await params;

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const expiresIn = parseInt(searchParams.get('expiresIn') || '3600'); // Default 1 hour

    // Validate expiresIn (max 24 hours)
    if (expiresIn > 86400) {
      return NextResponse.json(
        { error: 'expiresIn cannot exceed 24 hours (86400 seconds)' },
        { status: 400 }
      );
    }

    // Get document to check it exists and user has access
    const document = await documentService.getDocument(documentId);

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Get download URL
    const downloadUrl = await documentService.getDownloadUrl(documentId, expiresIn);

    return NextResponse.json({
      success: true,
      data: {
        url: downloadUrl,
        expiresIn,
        document: {
          id: document.id,
          name: document.name,
          mimeType: document.mimeType,
          fileSize: document.fileSize,
        },
      },
    });
  } catch (error) {
    console.error('Error generating download URL:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate download URL',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
