/**
 * Verify test user exists and can authenticate
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function verifyUser() {
  console.log('🔍 Verifying test user...\n');

  const testEmail = 'test@visionplatform.org';

  try {
    // Check auth.users
    const { data: authUsers } = await supabase.auth.admin.listUsers();
    const authUser = authUsers?.users?.find(u => u.email === testEmail);

    if (!authUser) {
      console.error('❌ User not found in auth.users');
      return;
    }

    console.log('✅ Auth user found:');
    console.log(`   ID: ${authUser.id}`);
    console.log(`   Email: ${authUser.email}`);
    console.log(`   Email Confirmed: ${authUser.email_confirmed_at ? 'Yes' : 'No'}`);
    console.log(`   Created: ${authUser.created_at}\n`);

    // Check public.users
    const { data: publicUser, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (userError || !publicUser) {
      console.error('⚠️  User not found in public.users table');
      console.error('   Error:', userError?.message);
    } else {
      console.log('✅ Public user record found:');
      console.log(`   Name: ${publicUser.name}`);
      console.log(`   Email: ${publicUser.email}\n`);
    }

    // Check organizations
    const { data: orgs, error: orgsError } = await supabase
      .from('organization_members')
      .select(`
        role,
        organizations (
          id,
          name
        )
      `)
      .eq('user_id', authUser.id)
      .eq('status', 'active');

    if (orgsError) {
      console.error('⚠️  Error fetching organizations:', orgsError.message);
    } else if (!orgs || orgs.length === 0) {
      console.log('⚠️  No organizations found for user');
    } else {
      console.log(`✅ Organizations (${orgs.length}):`);
      orgs.forEach((membership) => {
        const org = membership.organizations as any;
        console.log(`   - ${org.name} (${membership.role})`);
      });
      console.log('');
    }

    // Check user preferences
    const { data: prefs, error: prefsError } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', authUser.id)
      .single();

    if (prefsError) {
      console.log('⚠️  No user preferences found');
    } else {
      console.log('✅ User preferences:');
      console.log(`   Active Org ID: ${prefs.active_organization_id || 'None'}`);
      console.log(`   Theme: ${prefs.theme}`);
      console.log(`   Language: ${prefs.language}\n`);
    }

    console.log('📋 Test Credentials:');
    console.log(`   Email: ${testEmail}`);
    console.log(`   Password: TestPassword123!\n`);

    console.log('🧪 Testing authentication...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: 'TestPassword123!'
    });

    if (signInError) {
      console.error('❌ Authentication failed:', signInError.message);
      console.log('\n💡 Possible issues:');
      console.log('   1. Email not confirmed');
      console.log('   2. Password incorrect');
      console.log('   3. Account disabled');
    } else {
      console.log('✅ Authentication successful!');
      console.log(`   Access Token: ${signInData.session?.access_token?.substring(0, 20)}...`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

verifyUser();
