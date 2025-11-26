/**
 * Seed Test Data for Local Database
 * 
 * Seeds the local Supabase instance with comprehensive test data.
 * Run this before tests: pnpm tsx scripts/seed-test-data.ts
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function seedTestData() {
  console.log('🌱 Seeding test database...');
  console.log(`   URL: ${SUPABASE_URL}`);

  try {
    // 1. Create auth users first (users table references auth.users)
    console.log('\n📝 Creating auth users...');
    const testUsers = [
      {
        id: '00000000-0000-0000-0000-000000000001',
        email: 'owner@test.com',
        name: 'Test Owner',
      },
      {
        id: '00000000-0000-0000-0000-000000000002',
        email: 'admin@test.com',
        name: 'Test Admin',
      },
      {
        id: '00000000-0000-0000-0000-000000000003',
        email: 'editor@test.com',
        name: 'Test Editor',
      },
      {
        id: '00000000-0000-0000-0000-000000000004',
        email: 'viewer@test.com',
        name: 'Test Viewer',
      },
    ];

    // Create auth users using admin API
    for (const user of testUsers) {
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        email_confirm: true,
        user_metadata: { name: user.name },
      });

      if (authError && !authError.message.includes('already registered')) {
        console.warn(`   ⚠️  Auth user ${user.email}: ${authError.message}`);
      } else if (authUser?.user) {
        user.id = authUser.user.id;
        console.log(`   ✅ Created auth user: ${user.email} (${user.id})`);
      } else if (authError?.message.includes('already registered')) {
        // User already exists - query public.users table to get the ID
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('email', user.email)
          .single();
        
        if (existingUser?.id) {
          user.id = existingUser.id;
          console.log(`   ✅ Found existing user: ${user.email} (${user.id})`);
        } else {
          // If not in public.users, try to get from auth
          const { data: { users } } = await supabase.auth.admin.listUsers();
          const existing = users?.find(u => u.email === user.email);
          if (existing) {
            user.id = existing.id;
            console.log(`   ✅ Found existing auth user: ${user.email} (${user.id})`);
          } else {
            console.warn(`   ⚠️  User ${user.email} exists but couldn't find ID`);
          }
        }
      }
    }

    // 2. Get actual user IDs from auth (for existing users)
    console.log('\n🔍 Getting actual auth user IDs...');
    const { data: { users: authUsers } } = await supabase.auth.admin.listUsers();
    
    for (const user of testUsers) {
      // Find the actual auth user by email
      const authUser = authUsers?.find(u => u.email === user.email);
      if (authUser) {
        user.id = authUser.id; // Use the actual auth user ID
        console.log(`   ✅ Found auth user ID for ${user.email}: ${user.id}`);
      } else if (!user.id) {
        console.warn(`   ⚠️  Could not find auth user ID for ${user.email}`);
      }
    }

    // 3. Create public.users records (with actual IDs)
    console.log('\n📝 Creating public users...');
    for (const user of testUsers) {
      if (!user.id) {
        console.warn(`   ⚠️  No ID for ${user.email}, skipping public.users insert`);
        continue;
      }
      
      const { error } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          email: user.email,
          name: user.name,
          avatar_url: null,
        }, { onConflict: 'id' });
      
      if (error && !error.message.includes('duplicate')) {
        console.warn(`   ⚠️  User ${user.email}: ${error.message}`);
      } else {
        console.log(`   ✅ User: ${user.email} (${user.id})`);
      }
    }

    // 4. Create test organization
    console.log('\n🏢 Creating test organization...');
    // Use the actual user ID from auth (first user should be owner)
    const ownerId = testUsers[0].id;
    if (!ownerId) {
      throw new Error(`Owner user ID not found for ${testUsers[0].email}. Cannot create organization.`);
    }
    
    const testOrg = {
      id: '00000000-0000-0000-0000-000000000010',
      name: 'Test Organization',
      type: 'nonprofit',
      ein: '12-3456789',
      website: 'https://test.org',
      owner_id: ownerId, // Use actual auth user ID
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .upsert(testOrg, { onConflict: 'id' })
      .select()
      .single();

    if (orgError && !orgError.message.includes('duplicate')) {
      throw orgError;
    }
    console.log(`   ✅ Organization: ${testOrg.name} (${org?.id || testOrg.id})`);

    // 5. Create organization members
    console.log('\n👥 Creating organization members...');
    // Ensure all user IDs are available
    if (!testUsers[0].id || !testUsers[1].id || !testUsers[2].id) {
      throw new Error('Some user IDs are missing. Cannot create members.');
    }
    
    const members = [
      {
        id: '00000000-0000-0000-0000-000000000020',
        organization_id: testOrg.id,
        user_id: testUsers[0].id, // Use actual auth user ID
        role: 'Owner',
        status: 'active',
        joined_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        deleted_at: null,
      },
      {
        id: '00000000-0000-0000-0000-000000000021',
        organization_id: testOrg.id,
        user_id: testUsers[1].id, // Use actual auth user ID
        role: 'Admin',
        status: 'active',
        joined_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        deleted_at: null,
      },
      {
        id: '00000000-0000-0000-0000-000000000022',
        organization_id: testOrg.id,
        user_id: testUsers[2].id, // Use actual auth user ID
        role: 'Editor',
        status: 'active',
        joined_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        deleted_at: null,
      },
    ];

    for (const member of members) {
      const { error } = await supabase
        .from('organization_members')
        .upsert(member, { onConflict: 'id' });
      
      if (error && !error.message.includes('duplicate')) {
        console.warn(`   ⚠️  Member ${member.user_id}: ${error.message}`);
      } else {
        console.log(`   ✅ Member: ${member.role}`);
      }
    }

    // 6. Create test documents (for documentService tests)
    console.log('\n📄 Creating test documents...');
    const testDocuments = [
      {
        id: '00000000-0000-0000-0000-000000000100',
        organization_id: testOrg.id,
        name: 'Test Document 1.pdf',
        file_path: `${testOrg.id}/Test Document 1.pdf`,
        file_size: 1024000,
        mime_type: 'application/pdf',
        extension: 'pdf',
        version_number: 1,
        current_version_id: null,
        tags: ['important', 'test'],
        metadata: {},
        extracted_text: 'This is test document content for testing purposes.',
        extracted_text_length: 50,
        text_extracted_at: new Date().toISOString(),
        ai_enabled: false,
        ai_processing_status: 'disabled',
        uploaded_by: testUsers[0].id || ownerId, // Use actual user ID
        updated_by: testUsers[0].id || ownerId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        deleted_at: null,
        folder_id: null,
        description: 'Test document for documentService tests',
      },
      {
        id: '00000000-0000-0000-0000-000000000101',
        organization_id: testOrg.id,
        name: 'Test Document 2.docx',
        file_path: `${testOrg.id}/Test Document 2.docx`,
        file_size: 2048000,
        mime_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        extension: 'docx',
        version_number: 1,
        current_version_id: null,
        tags: ['test'],
        metadata: {},
        extracted_text: 'Another test document with different content.',
        extracted_text_length: 45,
        text_extracted_at: new Date().toISOString(),
        ai_enabled: false,
        ai_processing_status: 'disabled',
        uploaded_by: testUsers[1].id || ownerId, // Use actual user ID
        updated_by: testUsers[1].id || ownerId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        deleted_at: null,
        folder_id: null,
        description: 'Second test document',
      },
    ];

    for (const doc of testDocuments) {
      const { error } = await supabase
        .from('documents')
        .upsert(doc, { onConflict: 'id' });
      
      if (error && !error.message.includes('duplicate')) {
        console.warn(`   ⚠️  Document ${doc.name}: ${error.message}`);
      } else {
        console.log(`   ✅ Document: ${doc.name}`);
      }
    }

    // 7. Create test invites (for teamService tests)
    console.log('\n📧 Creating test invites...');
    const testInvites = [
      {
        id: '00000000-0000-0000-0000-000000000200',
        organization_id: testOrg.id,
        email: 'pending@test.com',
        role: 'Viewer',
        token: 'test-token-pending-123',
        status: 'pending',
        invited_by: testUsers[0].id || ownerId, // Use actual user ID
        invited_by_name: testUsers[0].name,
        invited_by_email: testUsers[0].email,
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        deleted_at: null,
      },
    ];

    for (const invite of testInvites) {
      const { error } = await supabase
        .from('organization_invites')
        .upsert(invite, { onConflict: 'id' });
      
      if (error && !error.message.includes('duplicate')) {
        console.warn(`   ⚠️  Invite ${invite.email}: ${error.message}`);
      } else {
        console.log(`   ✅ Invite: ${invite.email}`);
      }
    }

    console.log('\n✅ Test data seeding complete!');
    console.log(`\n📊 Summary:`);
    console.log(`   - Users: ${testUsers.length}`);
    console.log(`   - Organization: 1`);
    console.log(`   - Members: ${members.length}`);
    console.log(`   - Documents: ${testDocuments.length}`);
    console.log(`   - Invites: ${testInvites.length}`);
    console.log(`\n🧪 Ready for testing!`);
    
  } catch (error: any) {
    console.error('\n❌ Error seeding test data:', error);
    console.error('   Message:', error.message);
    throw error;
  }
}

seedTestData()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed:', error);
    process.exit(1);
  });

