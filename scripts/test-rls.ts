/**
 * Test RLS policies for organization_members table
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const testEmail = 'test@visionplatform.org';
const testPassword = 'TestPassword123!';

async function testRLS() {
  console.log('🔍 Testing RLS Policies...\n');

  // Create client with anon key (simulates browser)
  const anonClient = createClient(supabaseUrl, supabaseAnonKey);

  // Sign in
  console.log('1️⃣  Signing in...');
  const { data: authData, error: signInError } = await anonClient.auth.signInWithPassword({
    email: testEmail,
    password: testPassword,
  });

  if (signInError || !authData.user) {
    console.error('❌ Sign in failed:', signInError?.message);
    process.exit(1);
  }

  console.log('✅ Signed in as:', authData.user.email);
  console.log('   User ID:', authData.user.id, '\n');

  // Test 1: Query organization_members with anon key
  console.log('2️⃣  Testing organization_members query (with auth)...');
  const { data: members, error: membersError } = await anonClient
    .from('organization_members')
    .select('*')
    .eq('user_id', authData.user.id);

  if (membersError) {
    console.error('❌ Error:', {
      message: membersError.message,
      details: membersError.details,
      hint: membersError.hint,
      code: membersError.code
    });
  } else {
    console.log(`✅ Found ${members?.length || 0} memberships`);
    if (members && members.length > 0) {
      console.log('   First membership:', {
        org_id: members[0].organization_id,
        role: members[0].role,
        status: members[0].status
      });
    }
  }

  // Test 2: Query with service role (bypass RLS)
  console.log('\n3️⃣  Testing with service role (bypass RLS)...');
  const serviceClient = createClient(supabaseUrl, supabaseServiceKey);
  const { data: serviceMembers, error: serviceError } = await serviceClient
    .from('organization_members')
    .select('*')
    .eq('user_id', authData.user.id);

  if (serviceError) {
    console.error('❌ Error:', serviceError.message);
  } else {
    console.log(`✅ Found ${serviceMembers?.length || 0} memberships (service role)`);
    if (serviceMembers && serviceMembers.length > 0) {
      serviceMembers.forEach((m, i) => {
        console.log(`   ${i + 1}. Org: ${m.organization_id}, Role: ${m.role}`);
      });
    }
  }

  // Test 3: Check RLS policies on the table
  console.log('\n4️⃣  Checking RLS policies...');
  const { data: policies, error: policiesError } = await serviceClient
    .from('pg_policies')
    .select('*')
    .eq('tablename', 'organization_members');

  if (policiesError) {
    console.error('❌ Error fetching policies:', policiesError.message);
  } else {
    console.log(`✅ Found ${policies?.length || 0} policies:`);
    policies?.forEach((p: any) => {
      console.log(`   - ${p.policyname} (${p.cmd})`);
    });
  }
}

testRLS().catch(console.error);
