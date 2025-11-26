/**
 * Seed script to create test users for different roles
 * Run with: npx tsx scripts/seed-test-users.ts
 *
 * Creates the following test users:
 * - Owner: Full access, can manage organization settings
 * - Admin: Can manage team members and most settings
 * - Editor: Can create/edit content but limited admin access
 * - Viewer: Read-only access
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

// Test user definitions
const TEST_USERS = [
  {
    email: 'owner@visionplatform.org',
    password: 'OwnerPass123!',
    name: 'Sarah Johnson',
    role: 'Owner',
    title: 'Executive Director',
    avatar_url: null
  },
  {
    email: 'admin@visionplatform.org',
    password: 'AdminPass123!',
    name: 'Michael Chen',
    role: 'Admin',
    title: 'Operations Manager',
    avatar_url: null
  },
  {
    email: 'editor@visionplatform.org',
    password: 'EditorPass123!',
    name: 'Emily Rodriguez',
    role: 'Editor',
    title: 'Program Coordinator',
    avatar_url: null
  },
  {
    email: 'viewer@visionplatform.org',
    password: 'ViewerPass123!',
    name: 'David Kim',
    role: 'Viewer',
    title: 'Board Member',
    avatar_url: null
  }
];

// Demo organization
const DEMO_ORGANIZATION = {
  name: 'Vision Demo Organization',
  type: 'Nonprofit',
  industry: 'Social Services',
  website: 'https://demo.visionplatform.org',
  mission: 'Demonstrating the full capabilities of the VISION Platform',
  staff_count: 50,
  annual_budget: 2500000,
  focus_areas: ['Education', 'Healthcare', 'Community Development', 'Technology'],
  address_city: 'San Francisco',
  address_state: 'CA',
  address_country: 'USA',
  brand_primary_color: '#0047AB',
  brand_secondary_color: '#6D28D9'
};

async function createOrGetUser(user: typeof TEST_USERS[0]) {
  // Check if user exists
  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  const existingUser = existingUsers?.users?.find(u => u.email === user.email);

  if (existingUser) {
    console.log(`   ✓ User exists: ${user.email} (${user.role})`);
    return existingUser.id;
  }

  // Create new user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: user.email,
    password: user.password,
    email_confirm: true,
    user_metadata: {
      full_name: user.name
    }
  });

  if (authError) {
    throw new Error(`Failed to create user ${user.email}: ${authError.message}`);
  }

  console.log(`   ✓ Created user: ${user.email} (${user.role})`);

  // Create user record in public.users
  const { error: userError } = await supabase
    .from('users')
    .upsert({
      id: authData.user.id,
      email: user.email,
      name: user.name,
      avatar_url: user.avatar_url
    }, { onConflict: 'id' });

  if (userError) {
    console.error(`   ⚠️  Warning: Could not create user record for ${user.email}:`, userError.message);
  }

  return authData.user.id;
}

async function createOrGetOrganization(ownerId: string) {
  // Check if demo org exists
  const { data: existingOrg } = await supabase
    .from('organizations')
    .select('*')
    .eq('name', DEMO_ORGANIZATION.name)
    .is('deleted_at', null)
    .single();

  if (existingOrg) {
    console.log(`   ✓ Organization exists: ${DEMO_ORGANIZATION.name}`);
    return existingOrg;
  }

  // Create organization
  const { data: newOrg, error: orgError } = await supabase
    .from('organizations')
    .insert({
      ...DEMO_ORGANIZATION,
      owner_id: ownerId
    })
    .select()
    .single();

  if (orgError) {
    throw new Error(`Failed to create organization: ${orgError.message}`);
  }

  console.log(`   ✓ Created organization: ${DEMO_ORGANIZATION.name}`);
  return newOrg;
}

async function addMemberToOrganization(orgId: string, userId: string, role: string) {
  // Check if membership exists
  const { data: existingMember } = await supabase
    .from('organization_members')
    .select('id')
    .eq('organization_id', orgId)
    .eq('user_id', userId)
    .is('deleted_at', null)
    .single();

  if (existingMember) {
    // Update role if different
    const { error: updateError } = await supabase
      .from('organization_members')
      .update({ role, status: 'active' })
      .eq('id', existingMember.id);

    if (updateError) {
      console.error(`   ⚠️  Warning: Could not update member role:`, updateError.message);
    }
    return;
  }

  // Create membership
  const { error: memberError } = await supabase
    .from('organization_members')
    .insert({
      organization_id: orgId,
      user_id: userId,
      role,
      status: 'active'
    });

  if (memberError) {
    console.error(`   ⚠️  Warning: Could not add member:`, memberError.message);
  }
}

async function setUserPreferences(userId: string, orgId: string) {
  const { error } = await supabase
    .from('user_preferences')
    .upsert({
      user_id: userId,
      active_organization_id: orgId,
      theme: 'light',
      language: 'en'
    }, { onConflict: 'user_id' });

  if (error) {
    console.error(`   ⚠️  Warning: Could not set user preferences:`, error.message);
  }
}

async function seedDemoData(orgId: string, ownerId: string) {
  console.log('\n4️⃣  Creating demo content...');

  // Create folders
  const folders = [
    { name: 'Grant Applications', description: 'Active and pending grant applications', color: '#0047AB', icon: 'folder' },
    { name: 'Board Documents', description: 'Meeting minutes, bylaws, and governance', color: '#6D28D9', icon: 'folder' },
    { name: 'Program Reports', description: 'Quarterly and annual program reports', color: '#047857', icon: 'folder' },
    { name: 'Marketing Materials', description: 'Brochures, presentations, and media', color: '#C2410C', icon: 'folder' },
    { name: 'Financial Records', description: 'Budgets, audits, and financial statements', color: '#B91C1C', icon: 'folder' }
  ];

  for (const folder of folders) {
    const { error } = await supabase
      .from('folders')
      .upsert({
        organization_id: orgId,
        name: folder.name,
        description: folder.description,
        color: folder.color,
        icon: folder.icon,
        created_by: ownerId
      }, { onConflict: 'organization_id,name' });

    if (!error) {
      console.log(`   ✓ Created folder: ${folder.name}`);
    }
  }

  // Create VisionFlow projects
  const projects = [
    {
      organization_id: orgId,
      title: 'Q1 Community Outreach Campaign',
      description: 'Comprehensive outreach initiative to engage local communities',
      status: 'ACTIVE',
      priority: 'HIGH',
      start_date: new Date().toISOString(),
      due_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      progress: 35,
      created_by: ownerId
    },
    {
      organization_id: orgId,
      title: 'Annual Fundraising Gala',
      description: 'Planning and execution of annual fundraising event',
      status: 'PLANNING',
      priority: 'HIGH',
      start_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      due_date: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(),
      progress: 10,
      created_by: ownerId
    },
    {
      organization_id: orgId,
      title: 'Website Redesign Project',
      description: 'Modernize organizational website with improved UX',
      status: 'ACTIVE',
      priority: 'MEDIUM',
      start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      due_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      progress: 65,
      created_by: ownerId
    }
  ];

  for (const project of projects) {
    const { error } = await supabase
      .from('projects')
      .insert(project);

    if (!error) {
      console.log(`   ✓ Created project: ${project.title}`);
    }
  }

  // Create tasks
  const tasks = [
    {
      organization_id: orgId,
      title: 'Review grant proposal draft',
      description: 'Review and provide feedback on the Q2 grant proposal',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      created_by: ownerId
    },
    {
      organization_id: orgId,
      title: 'Update donor database',
      description: 'Clean up and update donor contact information',
      status: 'NOT_STARTED',
      priority: 'MEDIUM',
      due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      created_by: ownerId
    },
    {
      organization_id: orgId,
      title: 'Schedule board meeting',
      description: 'Coordinate schedules and send invitations for Q2 board meeting',
      status: 'COMPLETE',
      priority: 'HIGH',
      due_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      completion_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      created_by: ownerId
    },
    {
      organization_id: orgId,
      title: 'Prepare monthly newsletter',
      description: 'Draft and design the monthly newsletter for stakeholders',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      created_by: ownerId
    },
    {
      organization_id: orgId,
      title: 'Volunteer orientation session',
      description: 'Plan and conduct orientation for new volunteers',
      status: 'NOT_STARTED',
      priority: 'LOW',
      due_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
      created_by: ownerId
    }
  ];

  for (const task of tasks) {
    const { error } = await supabase
      .from('tasks')
      .insert(task);

    if (!error) {
      console.log(`   ✓ Created task: ${task.title}`);
    }
  }

  // Create Community Compass assessment
  const { data: assessment, error: assessmentError } = await supabase
    .from('community_assessments')
    .insert({
      organization_id: orgId,
      title: 'Underserved Youth in Urban Areas',
      description: 'Comprehensive assessment of challenges facing youth in urban communities',
      status: 'in_progress',
      created_by: ownerId
    })
    .select()
    .single();

  if (!assessmentError && assessment) {
    console.log(`   ✓ Created Community Compass assessment`);

    // Add chips/statements
    const chips = [
      { assessment_id: assessment.id, category: 'thinks', content: 'Education is the key to a better future' },
      { assessment_id: assessment.id, category: 'thinks', content: 'Technology skills are essential for success' },
      { assessment_id: assessment.id, category: 'feels', content: 'Hopeful about opportunities but anxious about access' },
      { assessment_id: assessment.id, category: 'feels', content: 'Disconnected from traditional support systems' },
      { assessment_id: assessment.id, category: 'says', content: 'We need more mentorship programs' },
      { assessment_id: assessment.id, category: 'says', content: 'Transportation is a major barrier' },
      { assessment_id: assessment.id, category: 'does', content: 'Seeks information through social media' },
      { assessment_id: assessment.id, category: 'does', content: 'Participates in after-school programs when available' }
    ];

    for (const chip of chips) {
      await supabase.from('statement_chips').insert(chip);
    }
    console.log(`   ✓ Added ${chips.length} empathy map statements`);

    // Add needs
    const needs = [
      { assessment_id: assessment.id, title: 'Access to Technology', description: 'Computers and internet access for homework and skill development', priority: 'high', category: 'resources' },
      { assessment_id: assessment.id, title: 'Mentorship Programs', description: 'Connection with positive role models and career guidance', priority: 'high', category: 'support' },
      { assessment_id: assessment.id, title: 'Safe Spaces', description: 'Community centers and safe places to gather after school', priority: 'medium', category: 'environment' },
      { assessment_id: assessment.id, title: 'Job Training', description: 'Vocational training and job readiness programs', priority: 'medium', category: 'skills' }
    ];

    for (const need of needs) {
      await supabase.from('community_needs').insert(need);
    }
    console.log(`   ✓ Added ${needs.length} community needs`);
  }

  // Create notifications for demo
  const notifications = [
    {
      user_id: ownerId,
      organization_id: orgId,
      title: 'New team member joined',
      message: 'Michael Chen has joined the organization as Admin',
      type: 'team',
      priority: 'normal',
      read: false
    },
    {
      user_id: ownerId,
      organization_id: orgId,
      title: 'Task deadline approaching',
      message: 'Review grant proposal draft is due in 7 days',
      type: 'task',
      priority: 'high',
      read: false
    },
    {
      user_id: ownerId,
      organization_id: orgId,
      title: 'Project milestone reached',
      message: 'Website Redesign Project has reached 65% completion',
      type: 'project',
      priority: 'normal',
      read: true
    }
  ];

  for (const notification of notifications) {
    const { error } = await supabase
      .from('notifications')
      .insert(notification);

    if (!error) {
      console.log(`   ✓ Created notification: ${notification.title}`);
    }
  }
}

async function main() {
  console.log('🌱 Starting test user and demo data seeding...\n');

  try {
    // Step 1: Create all test users
    console.log('1️⃣  Creating test users...');
    const userIds: Record<string, string> = {};

    for (const user of TEST_USERS) {
      const userId = await createOrGetUser(user);
      userIds[user.role] = userId;
    }

    // Step 2: Create demo organization (owner creates it)
    console.log('\n2️⃣  Creating demo organization...');
    const org = await createOrGetOrganization(userIds['Owner']);

    // Step 3: Add all users to organization with their roles
    console.log('\n3️⃣  Adding users to organization...');
    for (const user of TEST_USERS) {
      await addMemberToOrganization(org.id, userIds[user.role], user.role);
      await setUserPreferences(userIds[user.role], org.id);
      console.log(`   ✓ Added ${user.name} as ${user.role}`);
    }

    // Step 4: Seed demo data
    await seedDemoData(org.id, userIds['Owner']);

    // Print summary
    console.log('\n' + '═'.repeat(60));
    console.log('✅ Seeding completed successfully!');
    console.log('═'.repeat(60));
    console.log('\n📋 TEST USER CREDENTIALS:\n');

    for (const user of TEST_USERS) {
      console.log(`   ${user.role.toUpperCase()}:`);
      console.log(`   Email:    ${user.email}`);
      console.log(`   Password: ${user.password}`);
      console.log(`   Name:     ${user.name}`);
      console.log(`   Title:    ${user.title}`);
      console.log('');
    }

    console.log('📊 DEMO ORGANIZATION:');
    console.log(`   Name: ${org.name}`);
    console.log(`   ID:   ${org.id}`);
    console.log('');
    console.log('🚀 Login at: http://localhost:3000/signin');
    console.log('');
    console.log('💡 ROLE CAPABILITIES:');
    console.log('   Owner  - Full access, organization settings, billing');
    console.log('   Admin  - Team management, content management, reports');
    console.log('   Editor - Create/edit content, view reports');
    console.log('   Viewer - Read-only access to content');
    console.log('═'.repeat(60));

  } catch (error) {
    console.error('\n❌ Error during seeding:', error);
    process.exit(1);
  }
}

// Run the seed function
main();
