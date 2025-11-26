/**
 * Seed Community Compass with Mock Data
 * Creates assessments, chips, and needs for testing the UI and workflow
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Mock chip data for different categories (aspirations removed)
const mockChips = {
  experiences: [
    'Youth often feel disconnected from community resources',
    'Families struggle to access mental health services',
    'Language barriers prevent immigrants from seeking help',
    'Seniors experience social isolation in their neighborhoods',
    'Working parents lack childcare options during non-traditional hours',
    'LGBTQ+ youth face discrimination in school environments',
    'Veterans have difficulty transitioning to civilian life',
    'Single mothers need flexible job training programs',
  ],
  barriers: [
    'Limited public transportation to service locations',
    'Lack of culturally competent service providers',
    'Long wait times for appointments (6-8 weeks average)',
    'Services only available during business hours',
    'Application processes require extensive documentation',
    'No interpretation services for non-English speakers',
    'Stigma around seeking mental health support',
    'Digital divide limits access to online resources',
  ],
  urgency: [
    'Immediate need for crisis intervention services',
    'Food insecurity affecting children\'s school performance',
    'Housing instability leading to family displacement',
    'Untreated mental health conditions escalating',
    'Youth homelessness increasing 25% year-over-year',
    'Substance abuse rates rising in teen population',
    'Domestic violence incidents up 40% since pandemic',
    'Senior poverty rates at historic highs',
  ],
  strengths: [
    'Strong network of faith-based organizations',
    'Active parent-teacher associations in schools',
    'Community members willing to volunteer',
    'Local businesses interested in partnerships',
    'Cultural organizations providing programming',
    'Youth leadership programs showing results',
    'Neighborhood watch groups building connections',
    'Community gardens fostering collaboration',
  ],
};

const mockNeeds = [
  {
    title: 'Extended Hours Mental Health Clinic',
    description: 'Establish a mental health clinic with evening and weekend hours to serve working families who cannot access services during traditional business hours.',
    category: 'service',
    urgency_level: 'high',
    impact_level: 'high',
    evidence_level: 'strong',
  },
  {
    title: 'Multilingual Navigator Program',
    description: 'Create a team of community health navigators who speak multiple languages to help immigrant families access healthcare and social services.',
    category: 'support',
    urgency_level: 'critical',
    impact_level: 'critical',
    evidence_level: 'strong',
  },
  {
    title: 'Mobile Food Pantry Routes',
    description: 'Launch mobile food pantry services that visit underserved neighborhoods lacking transportation access to existing food banks.',
    category: 'resource',
    urgency_level: 'critical',
    impact_level: 'high',
    evidence_level: 'moderate',
  },
  {
    title: 'Youth Drop-In Center',
    description: 'Establish a safe drop-in center for LGBTQ+ youth providing counseling, peer support, and connection to affirming services.',
    category: 'infrastructure',
    urgency_level: 'high',
    impact_level: 'critical',
    evidence_level: 'strong',
  },
  {
    title: 'Childcare Subsidy Expansion',
    description: 'Expand childcare subsidies to cover non-traditional work hours (evenings, weekends, overnight) for working parents.',
    category: 'policy',
    urgency_level: 'medium',
    impact_level: 'high',
    evidence_level: 'strong',
  },
];

async function seedCommunityCompass() {
  console.log('🌱 Starting Community Compass seed...');

  // Get the first user (your test account)
  const { data: users, error: userError } = await supabase
    .from('users')
    .select('id')
    .limit(1);

  if (userError || !users || users.length === 0) {
    console.error('❌ No users found:', userError);
    return;
  }

  const userId = users[0].id;
  console.log(`✅ Found user: ${userId}`);

  // Get user's active organization
  const { data: prefs } = await supabase
    .from('user_preferences')
    .select('active_organization_id')
    .eq('user_id', userId)
    .single();

  if (!prefs?.active_organization_id) {
    console.error('❌ No active organization found for user');
    return;
  }

  const orgId = prefs.active_organization_id;
  console.log(`✅ Found organization: ${orgId}`);

  // Create 3 assessments at different stages
  const assessments = [
    {
      user_id: userId,
      organization_id: orgId,
      title: 'Youth Mental Health Services Assessment',
      target_population: 'Youth ages 14-18 experiencing mental health challenges',
      geographic_area: 'Washington, DC',
      status: 'completed',
      current_screen: 5,
      focus_statement: 'We need accessible, culturally responsive mental health services for youth that address language barriers, provide extended hours, and reduce stigma through community-based programming.',
      focus_statement_version: 2,
    },
    {
      user_id: userId,
      organization_id: orgId,
      title: 'Immigrant Family Support Services',
      target_population: 'Immigrant families with children under 12',
      geographic_area: 'Prince George\'s County, MD',
      status: 'in_progress',
      current_screen: 3,
      focus_statement: 'Immigrant families need multilingual navigation services, flexible appointment scheduling, and culturally competent providers to overcome systemic barriers to healthcare and social services.',
      focus_statement_version: 1,
    },
    {
      user_id: userId,
      organization_id: orgId,
      title: 'Senior Housing & Food Security',
      target_population: 'Seniors 65+ living alone',
      geographic_area: 'Arlington, VA',
      status: 'draft',
      current_screen: 1,
    },
  ];

  console.log('📝 Creating assessments...');
  const createdAssessments = [];

  for (const assessment of assessments) {
    const { data, error } = await supabase
      .from('community_assessments')
      .insert(assessment)
      .select()
      .single();

    if (error) {
      console.error(`❌ Error creating assessment "${assessment.title}":`, error);
      continue;
    }

    console.log(`✅ Created assessment: ${data.title} (${data.status})`);
    createdAssessments.push(data);
  }

  // Create chips for the first two assessments (in_progress and completed)
  console.log('\n🎯 Creating statement chips...');

  for (let i = 0; i < 2; i++) {
    const assessment = createdAssessments[i];
    let chipCount = 0;

    // Create chips for each category (excluding aspirations)
    for (const [category, statements] of Object.entries(mockChips)) {
      // Take 4-6 random statements from each category
      const numChips = 4 + Math.floor(Math.random() * 3);
      const selectedStatements = statements
        .sort(() => Math.random() - 0.5)
        .slice(0, numChips);

      for (const text of selectedStatements) {
        // For completed assessment, mark some as selected
        const isSelected = assessment.status === 'completed'
          ? Math.random() > 0.6
          : false;

        const chip = {
          assessment_id: assessment.id,
          text,
          question_category: category,
          is_selected: isSelected,
          is_ai_generated: true,
          confidence: 0.7 + Math.random() * 0.25, // 0.7-0.95
          is_custom: false,
          is_edited: false,
        };

        const { error } = await supabase
          .from('statement_chips')
          .insert(chip);

        if (error) {
          console.error(`❌ Error creating chip:`, error);
        } else {
          chipCount++;
        }
      }
    }

    console.log(`✅ Created ${chipCount} chips for "${assessment.title}"`);
  }

  // Create community needs for the completed assessment
  console.log('\n🎯 Creating community needs...');
  const completedAssessment = createdAssessments[0];

  for (const need of mockNeeds) {
    const { error } = await supabase
      .from('community_needs')
      .insert({
        assessment_id: completedAssessment.id,
        ...need,
        is_ai_suggested: true,
      });

    if (error) {
      console.error(`❌ Error creating need "${need.title}":`, error);
    } else {
      console.log(`✅ Created need: ${need.title}`);
    }
  }

  console.log('\n✨ Community Compass seed complete!\n');
  console.log('📊 Summary:');
  console.log(`   - ${createdAssessments.length} assessments created`);
  console.log(`   - Chips generated for 2 assessments`);
  console.log(`   - ${mockNeeds.length} community needs created`);
  console.log('\n🚀 You can now test the Community Compass workflow!\n');
}

// Run the seed
seedCommunityCompass()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  });
