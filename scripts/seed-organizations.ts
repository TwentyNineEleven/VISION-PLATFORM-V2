/**
 * Seed script to create test organizations and user data
 * Run with: npx tsx scripts/seed-organizations.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '✗');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function seedOrganizations() {
  console.log('🌱 Starting organization seeding...\n');

  try {
    // Step 1: Create or get test user
    console.log('1️⃣  Creating test user...');
    const testEmail = 'test@visionplatform.org';
    const testPassword = 'TestPassword123!';

    // Try to get existing user first
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    let userId = existingUsers?.users?.find(u => u.email === testEmail)?.id;

    if (!userId) {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: testEmail,
        password: testPassword,
        email_confirm: true,
        user_metadata: {
          full_name: 'Sarah Johnson'
        }
      });

      if (authError) {
        throw new Error(`Failed to create user: ${authError.message}`);
      }

      userId = authData.user.id;
      console.log(`   ✓ Created auth user: ${testEmail}`);

      // Also create entry in users table
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: userId,
          email: testEmail,
          name: 'Sarah Johnson'
        });

      if (userError && !userError.message.includes('duplicate key')) {
        console.error(`   ⚠️  Warning: Could not create user record:`, userError.message);
      } else {
        console.log(`   ✓ Created user record in database`);
      }
    } else {
      console.log(`   ✓ Using existing user: ${testEmail}`);

      // Ensure user exists in users table
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('id', userId)
        .single();

      if (!existingUser) {
        const { error: userError } = await supabase
          .from('users')
          .insert({
            id: userId,
            email: testEmail,
            name: 'Sarah Johnson'
          });

        if (userError) {
          console.error(`   ⚠️  Warning: Could not create user record:`, userError.message);
        } else {
          console.log(`   ✓ Created missing user record in database`);
        }
      }
    }

    // Step 2: Check if organizations already exist
    const { data: existingOrgs } = await supabase
      .from('organizations')
      .select('id, name')
      .eq('owner_id', userId)
      .is('deleted_at', null);

    if (existingOrgs && existingOrgs.length > 0) {
      console.log(`\n   ℹ️  Found ${existingOrgs.length} existing organizations:`);
      existingOrgs.forEach(org => console.log(`      - ${org.name}`));

      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });

      await new Promise<void>((resolve) => {
        readline.question('\n   Continue and add more? (y/n): ', (answer: string) => {
          readline.close();
          if (answer.toLowerCase() !== 'y') {
            console.log('   Skipping organization creation.');
            process.exit(0);
          }
          resolve();
        });
      });
    }

    // Step 3: Create test organizations
    console.log('\n2️⃣  Creating test organizations...');

    const organizations = [
      {
        name: 'Hope Foundation',
        type: 'Nonprofit',
        industry: 'Education',
        website: 'https://hopefoundation.org',
        mission: 'Empowering communities through education and opportunity',
        staff_count: 25,
        annual_budget: 500000,
        focus_areas: ['Education', 'Youth Development', 'Community Building'],
        address_city: 'San Francisco',
        address_state: 'CA',
        address_country: 'USA',
        brand_primary_color: '#0047AB',
        brand_secondary_color: '#1E88E5',
        owner_id: userId
      },
      {
        name: 'Green Earth Initiative',
        type: 'Nonprofit',
        industry: 'Environmental Conservation',
        website: 'https://greenearthinitiative.org',
        mission: 'Protecting our planet for future generations',
        staff_count: 15,
        annual_budget: 350000,
        focus_areas: ['Climate Action', 'Conservation', 'Sustainability'],
        address_city: 'Portland',
        address_state: 'OR',
        address_country: 'USA',
        brand_primary_color: '#2E7D32',
        brand_secondary_color: '#66BB6A',
        owner_id: userId
      },
      {
        name: 'Community Health Partners',
        type: 'Nonprofit',
        industry: 'Healthcare',
        website: 'https://communityhealthpartners.org',
        mission: 'Ensuring access to quality healthcare for all',
        staff_count: 40,
        annual_budget: 1200000,
        focus_areas: ['Healthcare Access', 'Public Health', 'Wellness'],
        address_city: 'Austin',
        address_state: 'TX',
        address_country: 'USA',
        brand_primary_color: '#C62828',
        brand_secondary_color: '#EF5350',
        owner_id: userId
      }
    ];

    const createdOrgs = [];
    for (const org of organizations) {
      const { data: newOrg, error: orgError } = await supabase
        .from('organizations')
        .insert(org)
        .select()
        .single();

      if (orgError) {
        console.error(`   ✗ Failed to create ${org.name}:`, orgError.message);
        continue;
      }

      createdOrgs.push(newOrg);
      console.log(`   ✓ Created: ${org.name}`);

      // Create organization member entry (user is owner)
      const { error: memberError } = await supabase
        .from('organization_members')
        .insert({
          organization_id: newOrg.id,
          user_id: userId,
          role: 'Owner',
          status: 'active'
        });

      if (memberError) {
        console.error(`   ✗ Failed to add member for ${org.name}:`, memberError.message);
      }
    }

    // Step 4: Set first organization as active
    if (createdOrgs.length > 0) {
      console.log('\n3️⃣  Setting up user preferences...');

      const { error: prefsError } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: userId,
          active_organization_id: createdOrgs[0].id,
          theme: 'light',
          language: 'en'
        }, {
          onConflict: 'user_id'
        });

      if (prefsError) {
        console.error(`   ✗ Failed to set user preferences:`, prefsError.message);
      } else {
        console.log(`   ✓ Set active organization: ${createdOrgs[0].name}`);
      }
    }

    // Step 5: Create some test folders for the first org
    if (createdOrgs.length > 0) {
      console.log('\n4️⃣  Creating test folders...');

      const folders = [
        {
          organization_id: createdOrgs[0].id,
          name: 'Grant Applications',
          description: 'Applications for various grants',
          color: '#1E88E5',
          icon: 'folder',
          created_by: userId
        },
        {
          organization_id: createdOrgs[0].id,
          name: 'Reports',
          description: 'Annual and quarterly reports',
          color: '#43A047',
          icon: 'folder',
          created_by: userId
        }
      ];

      for (const folder of folders) {
        const { error: folderError } = await supabase
          .from('folders')
          .insert(folder);

        if (folderError) {
          console.error(`   ✗ Failed to create folder ${folder.name}:`, folderError.message);
        } else {
          console.log(`   ✓ Created folder: ${folder.name}`);
        }
      }
    }

    // Print summary
    console.log('\n✅ Seeding completed successfully!\n');
    console.log('📋 Test Account Details:');
    console.log(`   Email: ${testEmail}`);
    console.log(`   Password: ${testPassword}`);
    console.log(`   User ID: ${userId}`);
    console.log(`\n📊 Created ${createdOrgs.length} organizations:`);
    createdOrgs.forEach((org, i) => {
      console.log(`   ${i + 1}. ${org.name} (ID: ${org.id})`);
    });
    console.log('\n🚀 You can now sign in at http://localhost:3000/signin');

  } catch (error) {
    console.error('\n❌ Error during seeding:', error);
    process.exit(1);
  }
}

// Run the seed function
seedOrganizations();
