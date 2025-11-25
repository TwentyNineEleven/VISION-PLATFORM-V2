import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * POST /api/v1/organizations/[id]/upload-logo
 * Upload organization logo to Supabase Storage
 * Requires: Owner or Admin role
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerSupabaseClient();
    const { id } = params;

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check user's role (must be Owner or Admin)
    const { data: membership } = await supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', id)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .is('deleted_at', null)
      .single();

    if (!membership || !['Owner', 'Admin'].includes(membership.role)) {
      return NextResponse.json(
        { error: 'Forbidden - requires Owner or Admin role' },
        { status: 403 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload a JPEG, PNG, WebP, or SVG image.' },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB.' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop();
    const fileName = `${id}/${timestamp}_${randomString}.${extension}`;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Get organization's old logo to delete it later
    const { data: org } = await supabase
      .from('organizations')
      .select('logo_url')
      .eq('id', id)
      .single();

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('organization-logos')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Error uploading to storage:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('organization-logos')
      .getPublicUrl(fileName);

    // Update organization with new logo URL
    const { error: updateError } = await supabase
      .from('organizations')
      .update({ logo_url: publicUrl })
      .eq('id', id);

    if (updateError) {
      console.error('Error updating organization:', updateError);
      // Try to clean up uploaded file
      await supabase.storage.from('organization-logos').remove([fileName]);
      return NextResponse.json(
        { error: 'Failed to update organization' },
        { status: 500 }
      );
    }

    // Delete old logo if it exists
    if (org?.logo_url) {
      try {
        // Extract path from old URL
        const oldPath = org.logo_url.split('/organization-logos/')[1];
        if (oldPath) {
          await supabase.storage.from('organization-logos').remove([oldPath]);
        }
      } catch (err) {
        console.error('Error deleting old logo:', err);
        // Don't fail the request if old file deletion fails
      }
    }

    return NextResponse.json({
      data: {
        url: publicUrl,
        path: fileName,
      },
    });
  } catch (error) {
    console.error('Unexpected error in POST /api/v1/organizations/[id]/upload-logo:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
