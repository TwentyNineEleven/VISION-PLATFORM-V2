# Community Compass - Complete Implementation & Improvement Report

**Document Version:** 1.0
**Date:** November 25, 2025
**Status:** Implementation Roadmap
**Priority:** High - Production Readiness

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current State Analysis](#current-state-analysis)
3. [Critical Completions Required](#critical-completions-required)
4. [Infrastructure Improvements](#infrastructure-improvements)
5. [Feature Enhancements](#feature-enhancements)
6. [Performance Optimizations](#performance-optimizations)
7. [Security Hardening](#security-hardening)
8. [Testing Strategy](#testing-strategy)
9. [Developer Experience](#developer-experience)
10. [Implementation Roadmap](#implementation-roadmap)
11. [Success Metrics](#success-metrics)

---

## Executive Summary

### Current Status
- **Completion Level:** 70% (Core workflow functional, infrastructure incomplete)
- **Production Ready:** ❌ No (requires critical completions)
- **MVP Ready:** ⚠️ Partial (needs export + error handling)
- **Code Quality:** 8/10 (well-architected, missing tests)
- **User Experience:** 7/10 (functional, needs polish)

### Top 5 Priorities
1. **Export Functionality** - Users cannot download completed assessments
2. **Service Layer Extraction** - Enable testing and maintainability
3. **State Management Migration** - TanStack Query for better performance
4. **Error Handling** - Production-grade error tracking and user messaging
5. **Testing Infrastructure** - Prevent regressions and enable CI/CD

### Estimated Timeline to Production
- **MVP Launch:** 2-3 weeks (critical completions only)
- **Full PRD Compliance:** 6-8 weeks (all features + enhancements)
- **Enterprise Grade:** 10-12 weeks (full testing + monitoring + optimizations)

---

## Current State Analysis

### What's Working ✅

#### Core Functionality
1. **Assessment Creation**
   - Form validation working
   - Organization context properly set
   - Database persistence functional
   - RLS policies enforced

2. **AI Chip Generation**
   - 4 categories (experiences, barriers, urgency, strengths)
   - 4 empathy quadrants (pain points, feelings, influences, intentions)
   - Auto-generation on empty categories
   - 8-12 chips per category
   - Under 15 words per chip
   - Strength-based language
   - Community-centered voice

3. **Focus Statement Generation**
   - 150-200 word synthesis
   - Based on selected chips
   - Feedback loop for regeneration
   - Version tracking
   - Word count validation

4. **Empathy Map**
   - Color-coded quadrants
   - AI narrative generation
   - Chip selection
   - Regeneration with feedback

5. **Needs Assessment**
   - Manual creation
   - Category classification
   - Urgency/impact/evidence levels
   - CRUD operations
   - Visual cards with badges

6. **Persona Generation**
   - 3-6 personas per assessment
   - Demographic details
   - Goals and barriers
   - Strengths and support systems
   - Life situations

7. **Design System**
   - Glow UI components throughout
   - 2911 Bold Color System compliance
   - AppShell layout integration
   - Mobile responsive
   - Loading states
   - Disabled states

8. **Database Architecture**
   - Normalized schema
   - RLS policies
   - Automatic timestamps
   - Soft delete support
   - Foreign key constraints

### What's Not Working ❌

#### Critical Failures
1. **Export Functionality**
   - Buttons exist but no implementation
   - `console.log` placeholder code
   - Cannot deliver reports to users
   - Blocks MVP launch

2. **No Testing**
   - Zero test files
   - No CI/CD pipeline
   - High regression risk
   - Can't validate AI quality

3. **Poor Error Handling**
   - Generic error messages
   - No structured logging
   - No error tracking service
   - Console.error only

4. **No Service Layer**
   - Business logic in pages
   - API calls in components
   - Code duplication
   - Hard to test

5. **State Management Issues**
   - Manual loading states
   - No cache invalidation
   - Refetch entire datasets
   - No optimistic updates

#### Partial Implementations
1. **AI Model Version**
   - Using Sonnet 3 instead of Sonnet 4
   - Missing latest capabilities

2. **RLS Policies**
   - User-based instead of org-based
   - Not fully multi-tenant compliant

3. **Navigation Flow**
   - No progress indicator
   - No save draft
   - No validation between screens

4. **AI Needs Suggestion**
   - Button exists
   - Not implemented

---

## Critical Completions Required

### 1. Export Functionality Implementation

**Priority:** 🔴 CRITICAL
**Effort:** 3-4 days
**Complexity:** Medium
**User Impact:** HIGH - Blocks MVP launch

#### Current State
```typescript
// apps/shell/src/app/community-compass/assessments/[id]/profile/page.tsx:41-44
const handleExport = (format: 'pdf' | 'docx' | 'markdown') => {
    // TODO: Implement export
    console.log('Exporting as', format);
};
```

#### Required Implementation

**Step 1: Install Dependencies**
```bash
pnpm add react-pdf @react-pdf/renderer docx marked date-fns
pnpm add -D @types/marked
```

**Step 2: Create Export Service**
```typescript
// apps/shell/src/services/exportService.ts

import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { pdf, Document as PDFDocument, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { marked } from 'marked';

export interface ExportData {
  assessment: {
    title: string;
    targetPopulation: string;
    geographicArea: string;
    createdAt: string;
  };
  focusStatement: string;
  selectedChips: {
    experiences: string[];
    barriers: string[];
    urgency: string[];
    strengths: string[];
  };
  empathyMap: {
    painPoints: string[];
    feelings: string[];
    influences: string[];
    intentions: string[];
    narrative: string;
  };
  needs: Array<{
    title: string;
    description: string;
    category: string;
    urgencyLevel: string;
    impactLevel: string;
    evidenceLevel: string;
  }>;
  personas: Array<{
    ageRange: string;
    lifeSituation: string;
    goals: string[];
    barriers: string[];
    strengths: string[];
    supportSystems: string[];
  }>;
}

export const exportService = {
  /**
   * Export assessment as PDF
   */
  async exportAsPDF(data: ExportData): Promise<Blob> {
    const PDFDoc = () => (
      <PDFDocument>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.title}>{data.assessment.title}</Text>
            <Text style={styles.subtitle}>
              Community Assessment Report
            </Text>
            <Text style={styles.metadata}>
              Target Population: {data.assessment.targetPopulation}
            </Text>
            <Text style={styles.metadata}>
              Geographic Area: {data.assessment.geographicArea}
            </Text>
            <Text style={styles.metadata}>
              Generated: {new Date(data.assessment.createdAt).toLocaleDateString()}
            </Text>
          </View>

          {/* Focus Statement */}
          <View style={styles.section}>
            <Text style={styles.heading}>Community Focus Statement</Text>
            <Text style={styles.body}>{data.focusStatement}</Text>
          </View>

          {/* Selected Insights */}
          <View style={styles.section}>
            <Text style={styles.heading}>Community Insights</Text>
            {Object.entries(data.selectedChips).map(([category, chips]) => (
              <View key={category} style={styles.subsection}>
                <Text style={styles.subheading}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Text>
                {chips.map((chip, idx) => (
                  <Text key={idx} style={styles.bullet}>• {chip}</Text>
                ))}
              </View>
            ))}
          </View>

          {/* Empathy Map */}
          <View style={styles.section}>
            <Text style={styles.heading}>Empathy Map</Text>
            <Text style={styles.body}>{data.empathyMap.narrative}</Text>
            {Object.entries(data.empathyMap)
              .filter(([key]) => key !== 'narrative')
              .map(([quadrant, items]) => (
                <View key={quadrant} style={styles.subsection}>
                  <Text style={styles.subheading}>
                    {quadrant.charAt(0).toUpperCase() + quadrant.slice(1).replace(/([A-Z])/g, ' $1')}
                  </Text>
                  {(items as string[]).map((item, idx) => (
                    <Text key={idx} style={styles.bullet}>• {item}</Text>
                  ))}
                </View>
              ))}
          </View>

          {/* Community Needs */}
          <View style={styles.section}>
            <Text style={styles.heading}>Community Needs</Text>
            {data.needs.map((need, idx) => (
              <View key={idx} style={styles.subsection}>
                <Text style={styles.subheading}>{need.title}</Text>
                <Text style={styles.body}>{need.description}</Text>
                <Text style={styles.metadata}>
                  Category: {need.category} | Urgency: {need.urgencyLevel} |
                  Impact: {need.impactLevel} | Evidence: {need.evidenceLevel}
                </Text>
              </View>
            ))}
          </View>

          {/* Personas */}
          <View style={styles.section}>
            <Text style={styles.heading}>Community Personas</Text>
            {data.personas.map((persona, idx) => (
              <View key={idx} style={styles.subsection}>
                <Text style={styles.subheading}>Persona {idx + 1}</Text>
                <Text style={styles.body}>Age: {persona.ageRange}</Text>
                <Text style={styles.body}>Situation: {persona.lifeSituation}</Text>
                <Text style={styles.body}>Goals: {persona.goals.join(', ')}</Text>
                <Text style={styles.body}>Barriers: {persona.barriers.join(', ')}</Text>
                <Text style={styles.body}>Strengths: {persona.strengths.join(', ')}</Text>
              </View>
            ))}
          </View>
        </Page>
      </PDFDocument>
    );

    const blob = await pdf(<PDFDoc />).toBlob();
    return blob;
  },

  /**
   * Export assessment as DOCX
   */
  async exportAsDOCX(data: ExportData): Promise<Blob> {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            // Title
            new Paragraph({
              text: data.assessment.title,
              heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
              text: 'Community Assessment Report',
              heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Target Population: ${data.assessment.targetPopulation}`,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Geographic Area: ${data.assessment.geographicArea}`,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Generated: ${new Date(data.assessment.createdAt).toLocaleDateString()}`,
                }),
              ],
            }),
            new Paragraph({ text: '' }), // Spacer

            // Focus Statement
            new Paragraph({
              text: 'Community Focus Statement',
              heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({
              text: data.focusStatement,
            }),
            new Paragraph({ text: '' }),

            // Selected Insights
            new Paragraph({
              text: 'Community Insights',
              heading: HeadingLevel.HEADING_2,
            }),
            ...Object.entries(data.selectedChips).flatMap(([category, chips]) => [
              new Paragraph({
                text: category.charAt(0).toUpperCase() + category.slice(1),
                heading: HeadingLevel.HEADING_3,
              }),
              ...chips.map(
                chip =>
                  new Paragraph({
                    text: `• ${chip}`,
                    bullet: { level: 0 },
                  })
              ),
            ]),

            // Empathy Map
            new Paragraph({
              text: 'Empathy Map',
              heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({
              text: data.empathyMap.narrative,
            }),
            ...Object.entries(data.empathyMap)
              .filter(([key]) => key !== 'narrative')
              .flatMap(([quadrant, items]) => [
                new Paragraph({
                  text: quadrant.charAt(0).toUpperCase() + quadrant.slice(1).replace(/([A-Z])/g, ' $1'),
                  heading: HeadingLevel.HEADING_3,
                }),
                ...(items as string[]).map(
                  item =>
                    new Paragraph({
                      text: `• ${item}`,
                      bullet: { level: 0 },
                    })
                ),
              ]),

            // Community Needs
            new Paragraph({
              text: 'Community Needs',
              heading: HeadingLevel.HEADING_2,
            }),
            ...data.needs.flatMap(need => [
              new Paragraph({
                text: need.title,
                heading: HeadingLevel.HEADING_3,
              }),
              new Paragraph({
                text: need.description,
              }),
              new Paragraph({
                text: `Category: ${need.category} | Urgency: ${need.urgencyLevel} | Impact: ${need.impactLevel}`,
              }),
            ]),

            // Personas
            new Paragraph({
              text: 'Community Personas',
              heading: HeadingLevel.HEADING_2,
            }),
            ...data.personas.flatMap((persona, idx) => [
              new Paragraph({
                text: `Persona ${idx + 1}`,
                heading: HeadingLevel.HEADING_3,
              }),
              new Paragraph({ text: `Age: ${persona.ageRange}` }),
              new Paragraph({ text: `Situation: ${persona.lifeSituation}` }),
              new Paragraph({ text: `Goals: ${persona.goals.join(', ')}` }),
              new Paragraph({ text: `Barriers: ${persona.barriers.join(', ')}` }),
              new Paragraph({ text: `Strengths: ${persona.strengths.join(', ')}` }),
            ]),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    return blob;
  },

  /**
   * Export assessment as Markdown
   */
  async exportAsMarkdown(data: ExportData): Promise<Blob> {
    const markdown = `# ${data.assessment.title}

## Community Assessment Report

**Target Population:** ${data.assessment.targetPopulation}
**Geographic Area:** ${data.assessment.geographicArea}
**Generated:** ${new Date(data.assessment.createdAt).toLocaleDateString()}

---

## Community Focus Statement

${data.focusStatement}

---

## Community Insights

${Object.entries(data.selectedChips)
  .map(
    ([category, chips]) =>
      `### ${category.charAt(0).toUpperCase() + category.slice(1)}\n\n${chips.map(chip => `- ${chip}`).join('\n')}`
  )
  .join('\n\n')}

---

## Empathy Map

${data.empathyMap.narrative}

${Object.entries(data.empathyMap)
  .filter(([key]) => key !== 'narrative')
  .map(
    ([quadrant, items]) =>
      `### ${quadrant.charAt(0).toUpperCase() + quadrant.slice(1).replace(/([A-Z])/g, ' $1')}\n\n${(items as string[]).map(item => `- ${item}`).join('\n')}`
  )
  .join('\n\n')}

---

## Community Needs

${data.needs
  .map(
    need =>
      `### ${need.title}\n\n${need.description}\n\n**Category:** ${need.category} | **Urgency:** ${need.urgencyLevel} | **Impact:** ${need.impactLevel} | **Evidence:** ${need.evidenceLevel}`
  )
  .join('\n\n')}

---

## Community Personas

${data.personas
  .map(
    (persona, idx) =>
      `### Persona ${idx + 1}

- **Age:** ${persona.ageRange}
- **Situation:** ${persona.lifeSituation}
- **Goals:** ${persona.goals.join(', ')}
- **Barriers:** ${persona.barriers.join(', ')}
- **Strengths:** ${persona.strengths.join(', ')}
- **Support Systems:** ${persona.supportSystems.join(', ')}`
  )
  .join('\n\n')}

---

*Generated by VISION Platform - Community Compass*
`;

    const blob = new Blob([markdown], { type: 'text/markdown' });
    return blob;
  },
};

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  section: {
    marginBottom: 20,
  },
  subsection: {
    marginBottom: 12,
    marginLeft: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#0047AB', // vision-blue
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
  },
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 8,
    color: '#0047AB',
  },
  subheading: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#1F2937',
  },
  body: {
    fontSize: 12,
    lineHeight: 1.6,
    marginBottom: 8,
  },
  bullet: {
    fontSize: 11,
    marginBottom: 4,
    marginLeft: 10,
  },
  metadata: {
    fontSize: 10,
    color: '#64748B',
    marginBottom: 4,
  },
});
```

**Step 3: Create Export API Route**
```typescript
// apps/shell/src/app/api/assessments/[id]/export/route.ts

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { exportService, type ExportData } from '@/services/exportService';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerSupabaseClient();
    const { id } = await params;

    // Authenticate
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { format } = await request.json();

    if (!['pdf', 'docx', 'markdown'].includes(format)) {
      return NextResponse.json({ error: 'Invalid format' }, { status: 400 });
    }

    // Fetch assessment
    const { data: assessment, error: assessmentError } = await supabase
      .from('community_assessments')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (assessmentError || !assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    // Fetch chips
    const { data: chips } = await supabase
      .from('statement_chips')
      .select('*')
      .eq('assessment_id', id)
      .eq('is_selected', true);

    // Fetch needs
    const { data: needs } = await supabase
      .from('community_needs')
      .select('*')
      .eq('assessment_id', id);

    // Build export data
    const exportData: ExportData = {
      assessment: {
        title: assessment.title,
        targetPopulation: assessment.target_population,
        geographicArea: assessment.geographic_area,
        createdAt: assessment.created_at,
      },
      focusStatement: assessment.focus_statement || '',
      selectedChips: {
        experiences: chips?.filter(c => c.question_category === 'experiences').map(c => c.text) || [],
        barriers: chips?.filter(c => c.question_category === 'barriers').map(c => c.text) || [],
        urgency: chips?.filter(c => c.question_category === 'urgency').map(c => c.text) || [],
        strengths: chips?.filter(c => c.question_category === 'strengths').map(c => c.text) || [],
      },
      empathyMap: {
        painPoints: chips?.filter(c => c.question_category === 'pain_points').map(c => c.text) || [],
        feelings: chips?.filter(c => c.question_category === 'feelings').map(c => c.text) || [],
        influences: chips?.filter(c => c.question_category === 'influences').map(c => c.text) || [],
        intentions: chips?.filter(c => c.question_category === 'intentions').map(c => c.text) || [],
        narrative: assessment.empathy_narrative || '',
      },
      needs: needs?.map(n => ({
        title: n.title,
        description: n.description,
        category: n.category,
        urgencyLevel: n.urgency_level,
        impactLevel: n.impact_level,
        evidenceLevel: n.evidence_level,
      })) || [],
      personas: JSON.parse(assessment.personas || '[]'),
    };

    // Generate export
    let blob: Blob;
    let contentType: string;
    let filename: string;

    switch (format) {
      case 'pdf':
        blob = await exportService.exportAsPDF(exportData);
        contentType = 'application/pdf';
        filename = `assessment-${id}.pdf`;
        break;
      case 'docx':
        blob = await exportService.exportAsDOCX(exportData);
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        filename = `assessment-${id}.docx`;
        break;
      case 'markdown':
        blob = await exportService.exportAsMarkdown(exportData);
        contentType = 'text/markdown';
        filename = `assessment-${id}.md`;
        break;
      default:
        return NextResponse.json({ error: 'Invalid format' }, { status: 400 });
    }

    const buffer = await blob.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}
```

**Step 4: Update Frontend**
```typescript
// apps/shell/src/app/community-compass/assessments/[id]/profile/page.tsx

const handleExport = async (format: 'pdf' | 'docx' | 'markdown') => {
  setExporting(format);
  try {
    const response = await fetch(`/api/assessments/${params.id}/export`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ format }),
    });

    if (!response.ok) {
      throw new Error('Export failed');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `assessment-${params.id}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success(`Assessment exported as ${format.toUpperCase()}`);
  } catch (error) {
    console.error('Error exporting:', error);
    toast.error('Failed to export assessment');
  } finally {
    setExporting(null);
  }
};
```

**Step 5: Add Database Fields**
```sql
-- Add missing fields to community_assessments
ALTER TABLE public.community_assessments
ADD COLUMN IF NOT EXISTS empathy_narrative TEXT,
ADD COLUMN IF NOT EXISTS personas JSONB DEFAULT '[]'::jsonb;
```

**Testing Checklist:**
- [ ] PDF export generates valid file
- [ ] DOCX export opens in Microsoft Word
- [ ] Markdown export has correct formatting
- [ ] All sections included (focus statement, chips, empathy, needs, personas)
- [ ] File downloads with correct name
- [ ] Toast notification shows success/error
- [ ] Works with incomplete assessments (missing sections)
- [ ] RLS prevents cross-org exports

---

### 2. Service Layer Extraction

**Priority:** 🔴 CRITICAL
**Effort:** 2-3 days
**Complexity:** Medium
**User Impact:** LOW (improves maintainability, enables testing)

#### Current Problem
Business logic scattered across page components and API routes, making code hard to test and maintain.

#### Required Implementation

**Create Service Files:**

```typescript
// apps/shell/src/services/assessmentService.ts

import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/supabase';

type Assessment = Database['public']['Tables']['community_assessments']['Row'];
type AssessmentInsert = Database['public']['Tables']['community_assessments']['Insert'];
type AssessmentUpdate = Database['public']['Tables']['community_assessments']['Update'];

export class AssessmentNotFoundError extends Error {
  constructor(id: string) {
    super(`Assessment not found: ${id}`);
    this.name = 'AssessmentNotFoundError';
  }
}

export class AssessmentValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AssessmentValidationError';
  }
}

export const assessmentService = {
  /**
   * Create a new assessment
   */
  async create(data: {
    title: string;
    targetPopulation: string;
    geographicArea: string;
    organizationId: string;
    userId: string;
  }): Promise<Assessment> {
    const supabase = createClient();

    // Validation
    if (!data.title?.trim()) {
      throw new AssessmentValidationError('Title is required');
    }
    if (!data.targetPopulation?.trim()) {
      throw new AssessmentValidationError('Target population is required');
    }
    if (data.title.length > 200) {
      throw new AssessmentValidationError('Title must be 200 characters or less');
    }

    const { data: assessment, error } = await supabase
      .from('community_assessments')
      .insert({
        title: data.title.trim(),
        target_population: data.targetPopulation.trim(),
        geographic_area: data.geographicArea.trim(),
        organization_id: data.organizationId,
        user_id: data.userId,
        status: 'draft',
        current_screen: 1,
      })
      .select()
      .single();

    if (error) {
      console.error('Create assessment error:', error);
      throw new Error(`Failed to create assessment: ${error.message}`);
    }

    return assessment;
  },

  /**
   * Get assessment by ID
   */
  async getById(id: string): Promise<Assessment> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('community_assessments')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new AssessmentNotFoundError(id);
    }

    return data;
  },

  /**
   * Get all assessments for current user
   */
  async getAll(options?: {
    status?: 'draft' | 'in_progress' | 'completed';
    limit?: number;
    offset?: number;
  }): Promise<{ assessments: Assessment[]; total: number }> {
    const supabase = createClient();

    let query = supabase
      .from('community_assessments')
      .select('*', { count: 'exact' })
      .order('updated_at', { ascending: false });

    if (options?.status) {
      query = query.eq('status', options.status);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 20) - 1);
    }

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Failed to fetch assessments: ${error.message}`);
    }

    return {
      assessments: data || [],
      total: count || 0,
    };
  },

  /**
   * Update assessment
   */
  async update(id: string, updates: AssessmentUpdate): Promise<Assessment> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('community_assessments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new AssessmentNotFoundError(id);
      }
      throw new Error(`Failed to update assessment: ${error.message}`);
    }

    return data;
  },

  /**
   * Delete assessment (soft delete)
   */
  async delete(id: string): Promise<void> {
    const supabase = createClient();

    const { error } = await supabase
      .from('community_assessments')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete assessment: ${error.message}`);
    }
  },

  /**
   * Update current screen
   */
  async updateScreen(id: string, screen: number): Promise<Assessment> {
    return this.update(id, { current_screen: screen });
  },

  /**
   * Update status
   */
  async updateStatus(
    id: string,
    status: 'draft' | 'in_progress' | 'completed'
  ): Promise<Assessment> {
    return this.update(id, { status });
  },

  /**
   * Save focus statement
   */
  async saveFocusStatement(
    id: string,
    statement: string,
    version: number,
    feedback?: string
  ): Promise<Assessment> {
    return this.update(id, {
      focus_statement: statement,
      focus_statement_version: version,
      focus_statement_feedback: feedback ? { feedback, timestamp: new Date().toISOString() } : null,
    });
  },
};
```

```typescript
// apps/shell/src/services/chipService.ts

import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/supabase';

type Chip = Database['public']['Tables']['statement_chips']['Row'];
type ChipInsert = Database['public']['Tables']['statement_chips']['Insert'];

export const chipService = {
  /**
   * Get all chips for an assessment
   */
  async getByAssessment(assessmentId: string): Promise<Chip[]> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('statement_chips')
      .select('*')
      .eq('assessment_id', assessmentId)
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch chips: ${error.message}`);
    }

    return data || [];
  },

  /**
   * Create multiple chips
   */
  async createMany(chips: ChipInsert[]): Promise<Chip[]> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('statement_chips')
      .insert(chips)
      .select();

    if (error) {
      throw new Error(`Failed to create chips: ${error.message}`);
    }

    return data || [];
  },

  /**
   * Toggle chip selection
   */
  async toggleSelection(chipId: string, isSelected: boolean): Promise<Chip> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('statement_chips')
      .update({ is_selected: isSelected })
      .eq('id', chipId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to toggle chip: ${error.message}`);
    }

    return data;
  },

  /**
   * Update chip text
   */
  async updateText(chipId: string, text: string): Promise<Chip> {
    const supabase = createClient();

    const { data: currentChip } = await supabase
      .from('statement_chips')
      .select('text, is_custom')
      .eq('id', chipId)
      .single();

    const { data, error } = await supabase
      .from('statement_chips')
      .update({
        text,
        is_edited: !currentChip?.is_custom,
        original_text: currentChip?.is_custom ? null : currentChip?.text,
      })
      .eq('id', chipId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update chip: ${error.message}`);
    }

    return data;
  },

  /**
   * Delete chip
   */
  async delete(chipId: string): Promise<void> {
    const supabase = createClient();

    const { error } = await supabase
      .from('statement_chips')
      .delete()
      .eq('id', chipId);

    if (error) {
      throw new Error(`Failed to delete chip: ${error.message}`);
    }
  },

  /**
   * Get selected chips grouped by category
   */
  async getSelectedByCategory(assessmentId: string): Promise<Record<string, string[]>> {
    const chips = await this.getByAssessment(assessmentId);

    const selected = chips.filter(c => c.is_selected);
    const grouped: Record<string, string[]> = {};

    selected.forEach(chip => {
      if (!grouped[chip.question_category]) {
        grouped[chip.question_category] = [];
      }
      grouped[chip.question_category].push(chip.text);
    });

    return grouped;
  },
};
```

```typescript
// apps/shell/src/services/aiGenerationService.ts

import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface GenerateChipsOptions {
  targetPopulation: string;
  category: 'experiences' | 'barriers' | 'urgency' | 'strengths' | 'pain_points' | 'feelings' | 'influences' | 'intentions';
  existingChips?: string[];
  count?: number;
}

export interface GeneratedChip {
  text: string;
  confidence: number;
  sourceCitation?: string;
}

export const aiGenerationService = {
  /**
   * Generate chips for a category
   */
  async generateChips(options: GenerateChipsOptions): Promise<GeneratedChip[]> {
    const { targetPopulation, category, existingChips = [], count = 10 } = options;

    const categoryPrompts: Record<string, string> = {
      experiences: 'lived experiences and daily realities',
      barriers: 'challenges and obstacles they face',
      urgency: 'urgent needs and time-sensitive concerns',
      strengths: 'assets, capabilities, and sources of resilience',
      pain_points: 'frustrations, challenges, and difficulties',
      feelings: 'emotions and affective states',
      influences: 'external factors and social influences',
      intentions: 'goals, hopes, and aspirations',
    };

    const prompt = `You are a community assessment expert helping to understand ${targetPopulation}.

Generate ${count} concise statements about their ${categoryPrompts[category]}.

Requirements:
- Each statement must be 8-15 words
- Use first-person community voice ("We...", "I...", "Our...")
- Use strength-based language (avoid deficit framing like "lack", "problem", "issue")
- Be specific and concrete (not generic)
- Reflect diversity within the community
- Avoid stereotypes and assumptions
- Do not repeat or closely paraphrase these existing statements: ${existingChips.join('; ')}

Format your response as a JSON array of objects with this structure:
[
  {
    "text": "The statement text here",
    "confidence": 0.85,
    "sourceCitation": "Optional: Research source if applicable"
  }
]

Generate the statements now:`;

    const message = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229', // TODO: Upgrade to claude-sonnet-4-20250514
      max_tokens: 2048,
      temperature: 0.8,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    // Extract JSON from response
    const jsonMatch = content.text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }

    const chips: GeneratedChip[] = JSON.parse(jsonMatch[0]);

    // Validate and clean
    return chips
      .filter(chip => {
        const wordCount = chip.text.split(/\s+/).length;
        return wordCount >= 8 && wordCount <= 15;
      })
      .slice(0, count);
  },

  /**
   * Generate focus statement
   */
  async generateFocusStatement(
    targetPopulation: string,
    selectedChips: Record<string, string[]>,
    previousStatement?: string,
    feedback?: string
  ): Promise<{ statement: string; wordCount: number }> {
    const allChips = Object.entries(selectedChips)
      .map(([category, chips]) => `${category.toUpperCase()}:\n${chips.map(c => `- ${c}`).join('\n')}`)
      .join('\n\n');

    let prompt = `You are a community assessment expert. Write a comprehensive focus statement about ${targetPopulation}.

Base your statement on these community insights:

${allChips}

Requirements:
- 150-200 words
- Use first-person community voice
- Strength-based language (highlight assets and capabilities)
- Synthesize insights across all categories
- Be specific and actionable
- Avoid jargon and clinical language
- Create a narrative that honors community wisdom`;

    if (previousStatement && feedback) {
      prompt += `\n\nPrevious statement:\n${previousStatement}\n\nUser feedback:\n${feedback}\n\nGenerate an improved version incorporating this feedback.`;
    }

    const message = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1024,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    const statement = content.text.trim();
    const wordCount = statement.split(/\s+/).length;

    return { statement, wordCount };
  },

  /**
   * Generate empathy narrative
   */
  async generateEmpathyNarrative(
    targetPopulation: string,
    selectedChips: Record<string, string[]>
  ): Promise<string> {
    const allChips = Object.entries(selectedChips)
      .map(([quadrant, chips]) => `${quadrant.toUpperCase()}:\n${chips.map(c => `- ${c}`).join('\n')}`)
      .join('\n\n');

    const prompt = `You are a community assessment expert. Write a compelling empathy narrative about ${targetPopulation}.

Base your narrative on these empathy map insights:

${allChips}

Requirements:
- 200-300 words
- First-person community voice
- Emotionally resonant but professional
- Synthesize across all quadrants
- Show depth of understanding
- Strength-based framing

Write the narrative now:`;

    const message = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1024,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    return content.text.trim();
  },

  /**
   * Generate personas
   */
  async generatePersonas(
    targetPopulation: string,
    focusStatement: string,
    count: number = 3
  ): Promise<any[]> {
    const prompt = `You are a community assessment expert. Create ${count} diverse personas representing ${targetPopulation}.

Context from focus statement:
${focusStatement}

For each persona, provide:
- ageRange: e.g., "25-35"
- lifeSituation: 1-2 sentence description
- goals: Array of 3-4 goals
- barriers: Array of 3-4 barriers
- strengths: Array of 3-4 strengths
- supportSystems: Array of 2-3 support systems
- motivations: 1 sentence

Requirements:
- Represent diversity (age, circumstances, needs)
- Avoid stereotypes
- Strength-based framing
- Realistic and specific

Format as JSON array.`;

    const message = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 2048,
      temperature: 0.8,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    const jsonMatch = content.text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Failed to parse personas');
    }

    return JSON.parse(jsonMatch[0]);
  },
};
```

**Migration Steps:**
1. Create service files
2. Write unit tests for each service
3. Update API routes to use services
4. Update page components to use services
5. Remove duplicate logic
6. Test thoroughly

---

### 3. TanStack Query Integration

**Priority:** 🟠 HIGH
**Effort:** 3-4 days
**Complexity:** Medium
**User Impact:** MEDIUM (better UX, faster performance)

#### Benefits
- Automatic caching and invalidation
- Optimistic updates
- Background refetching
- Loading/error states handled automatically
- Better performance

#### Implementation

**Step 1: Install Dependencies**
```bash
pnpm add @tanstack/react-query @tanstack/react-query-devtools
```

**Step 2: Create Query Client**
```typescript
// apps/shell/src/lib/queryClient.ts

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retry: 1,
    },
    mutations: {
      retry: 1,
    },
  },
});
```

**Step 3: Wrap App**
```typescript
// apps/shell/src/app/layout.tsx

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@/lib/queryClient';

export default function RootLayout({ children }: { children: React.Node }) {
  return (
    <html>
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </body>
    </html>
  );
}
```

**Step 4: Create Query Hooks**
```typescript
// apps/shell/src/hooks/useAssessments.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assessmentService } from '@/services/assessmentService';
import { toast } from 'sonner';

export function useAssessment(id: string) {
  return useQuery({
    queryKey: ['assessment', id],
    queryFn: () => assessmentService.getById(id),
    enabled: !!id,
  });
}

export function useAssessments(options?: {
  status?: 'draft' | 'in_progress' | 'completed';
}) {
  return useQuery({
    queryKey: ['assessments', options],
    queryFn: () => assessmentService.getAll(options),
  });
}

export function useCreateAssessment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assessmentService.create,
    onSuccess: (newAssessment) => {
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
      queryClient.setQueryData(['assessment', newAssessment.id], newAssessment);
      toast.success('Assessment created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create assessment');
    },
  });
}

export function useUpdateAssessment(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: any) => assessmentService.update(id, updates),
    onMutate: async (updates) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['assessment', id] });

      // Snapshot previous value
      const previous = queryClient.getQueryData(['assessment', id]);

      // Optimistically update
      queryClient.setQueryData(['assessment', id], (old: any) => ({
        ...old,
        ...updates,
      }));

      return { previous };
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previous) {
        queryClient.setQueryData(['assessment', id], context.previous);
      }
      toast.error('Failed to update assessment');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessment', id] });
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
    },
  });
}
```

**Step 5: Update Components**
```typescript
// Before (manual state):
const [assessment, setAssessment] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetchAssessment();
}, [id]);

// After (TanStack Query):
const { data: assessment, isLoading } = useAssessment(params.id);
```

---

### 4. Error Handling Infrastructure

**Priority:** 🟠 HIGH
**Effort:** 2 days
**Complexity:** Low-Medium
**User Impact:** HIGH (better debugging, better UX)

#### Implementation

**Step 1: Create Error Classes**
```typescript
// apps/shell/src/lib/errors.ts

export class ApplicationError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'ApplicationError';
  }

  toJSON() {
    return {
      error: {
        code: this.code,
        message: this.message,
        details: this.details,
        timestamp: new Date().toISOString(),
      },
    };
  }
}

export class ValidationError extends ApplicationError {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', 400, details);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends ApplicationError {
  constructor(message: string = 'Unauthorized') {
    super(message, 'AUTHENTICATION_ERROR', 401);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends ApplicationError {
  constructor(message: string = 'Forbidden') {
    super(message, 'AUTHORIZATION_ERROR', 403);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends ApplicationError {
  constructor(resource: string, id?: string) {
    super(
      id ? `${resource} not found: ${id}` : `${resource} not found`,
      'NOT_FOUND_ERROR',
      404
    );
    this.name = 'NotFoundError';
  }
}

export class AIServiceError extends ApplicationError {
  constructor(message: string, details?: any) {
    super(message, 'AI_SERVICE_ERROR', 502, details);
    this.name = 'AIServiceError';
  }
}

export class RateLimitError extends ApplicationError {
  constructor(retryAfter?: number) {
    super(
      'Rate limit exceeded',
      'RATE_LIMIT_ERROR',
      429,
      retryAfter ? { retryAfter } : undefined
    );
    this.name = 'RateLimitError';
  }
}
```

**Step 2: Error Middleware**
```typescript
// apps/shell/src/lib/errorHandler.ts

import { NextResponse } from 'next/server';
import { ApplicationError } from './errors';

export function handleApiError(error: unknown): NextResponse {
  console.error('API Error:', error);

  if (error instanceof ApplicationError) {
    return NextResponse.json(error.toJSON(), { status: error.statusCode });
  }

  // Unknown error
  return NextResponse.json(
    {
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred',
        timestamp: new Date().toISOString(),
      },
    },
    { status: 500 }
  );
}
```

**Step 3: Update API Routes**
```typescript
// Example usage in route:
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new AuthenticationError();
    }

    const body = await request.json();

    if (!body.title) {
      throw new ValidationError('Title is required', { field: 'title' });
    }

    // ... rest of logic

  } catch (error) {
    return handleApiError(error);
  }
}
```

**Step 4: Add Error Boundaries**
```typescript
// apps/shell/src/components/ErrorBoundary.tsx

'use client';

import React from 'react';
import { GlowButton, GlowCard } from './glow-ui';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error boundary caught:', error, errorInfo);
    // TODO: Send to Sentry
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-screen items-center justify-center p-4">
          <GlowCard className="max-w-md">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="rounded-full bg-red-100 p-3">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Something went wrong</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {this.state.error?.message || 'An unexpected error occurred'}
                </p>
              </div>
              <GlowButton
                onClick={() => {
                  this.setState({ hasError: false, error: undefined });
                  window.location.reload();
                }}
              >
                Reload Page
              </GlowButton>
            </div>
          </GlowCard>
        </div>
      );
    }

    return this.props.children;
  }
}
```

**Step 5: Install Sentry (Production)**
```bash
pnpm add @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

---

### 5. Testing Infrastructure

**Priority:** 🟠 HIGH
**Effort:** 4-5 days
**Complexity:** Medium
**User Impact:** LOW (developer experience, confidence)

#### Implementation

**Step 1: Unit Tests for Services**
```typescript
// apps/shell/src/services/__tests__/assessmentService.test.ts

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { assessmentService, AssessmentNotFoundError, AssessmentValidationError } from '../assessmentService';
import { createClient } from '@/lib/supabase/client';

vi.mock('@/lib/supabase/client');

describe('assessmentService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('should create assessment with valid data', async () => {
      const mockSupabase = {
        from: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: {
            id: '123',
            title: 'Test Assessment',
            status: 'draft',
          },
          error: null,
        }),
      };

      (createClient as any).mockReturnValue(mockSupabase);

      const result = await assessmentService.create({
        title: 'Test Assessment',
        targetPopulation: 'Youth',
        geographicArea: 'DC',
        organizationId: 'org-123',
        userId: 'user-123',
      });

      expect(result.title).toBe('Test Assessment');
      expect(mockSupabase.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test Assessment',
          target_population: 'Youth',
        })
      );
    });

    it('should throw validation error for empty title', async () => {
      await expect(
        assessmentService.create({
          title: '',
          targetPopulation: 'Youth',
          geographicArea: 'DC',
          organizationId: 'org-123',
          userId: 'user-123',
        })
      ).rejects.toThrow(AssessmentValidationError);
    });

    it('should trim whitespace from inputs', async () => {
      const mockSupabase = {
        from: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { id: '123' },
          error: null,
        }),
      };

      (createClient as any).mockReturnValue(mockSupabase);

      await assessmentService.create({
        title: '  Test  ',
        targetPopulation: '  Youth  ',
        geographicArea: 'DC',
        organizationId: 'org-123',
        userId: 'user-123',
      });

      expect(mockSupabase.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test',
          target_population: 'Youth',
        })
      );
    });
  });

  describe('getById', () => {
    it('should return assessment when found', async () => {
      const mockAssessment = { id: '123', title: 'Test' };
      const mockSupabase = {
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: mockAssessment,
          error: null,
        }),
      };

      (createClient as any).mockReturnValue(mockSupabase);

      const result = await assessmentService.getById('123');
      expect(result).toEqual(mockAssessment);
    });

    it('should throw NotFoundError when assessment does not exist', async () => {
      const mockSupabase = {
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: { code: 'PGRST116' },
        }),
      };

      (createClient as any).mockReturnValue(mockSupabase);

      await expect(assessmentService.getById('nonexistent')).rejects.toThrow(
        AssessmentNotFoundError
      );
    });
  });
});
```

**Step 2: Integration Tests for API**
```typescript
// apps/shell/src/app/api/assessments/__tests__/route.test.ts

import { describe, it, expect, beforeEach } from 'vitest';
import { POST, GET } from '../route';
import { NextRequest } from 'next/server';

describe('POST /api/assessments', () => {
  it('should create assessment and return 201', async () => {
    const request = new NextRequest('http://localhost/api/assessments', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Test Assessment',
        targetPopulation: 'Youth ages 14-18',
        geographicArea: 'Washington, DC',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.assessment).toHaveProperty('id');
    expect(data.assessment.title).toBe('Test Assessment');
  });

  it('should return 401 when not authenticated', async () => {
    // Mock unauthenticated request
    const request = new NextRequest('http://localhost/api/assessments', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Test',
        targetPopulation: 'Youth',
        geographicArea: 'DC',
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(401);
  });

  it('should return 400 when missing required fields', async () => {
    const request = new NextRequest('http://localhost/api/assessments', {
      method: 'POST',
      body: JSON.stringify({
        title: '', // Empty title
        targetPopulation: 'Youth',
        geographicArea: 'DC',
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});
```

**Step 3: E2E Tests with Playwright**
```typescript
// e2e/community-compass.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Community Compass Assessment Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/signin');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  test('complete full assessment workflow', async ({ page }) => {
    // Navigate to Community Compass
    await page.goto('/community-compass');
    await expect(page).toHaveTitle(/Community Compass/);

    // Create new assessment
    await page.click('text=Create Assessment');
    await page.fill('[name="title"]', 'Youth Services Assessment');
    await page.fill('[name="targetPopulation"]', 'Youth ages 14-18 in foster care');
    await page.fill('[name="geographicArea"]', 'Washington, DC');
    await page.click('button:has-text("Create Assessment")');

    // Wait for redirect to assessment detail
    await page.waitForURL(/\/assessments\/[a-f0-9-]+$/);

    // Screen 1: Chip Selection
    await expect(page.locator('text=Experiences')).toBeVisible();

    // Wait for AI chips to generate
    await page.waitForSelector('[data-testid="chip"]', { timeout: 10000 });

    // Select some chips
    const chips = page.locator('[data-testid="chip"]');
    await chips.nth(0).click();
    await chips.nth(1).click();
    await chips.nth(2).click();

    // Generate focus statement
    await page.click('text=Generate Focus Statement');
    await expect(page.locator('[data-testid="focus-statement"]')).toBeVisible({ timeout: 15000 });

    // Screen 2: Empathy Map
    await page.click('text=Continue to Empathy Map');
    await expect(page.locator('text=Pain Points')).toBeVisible();

    // Select empathy chips
    await page.waitForSelector('[data-testid="empathy-chip"]', { timeout: 10000 });
    const empathyChips = page.locator('[data-testid="empathy-chip"]');
    await empathyChips.nth(0).click();
    await empathyChips.nth(1).click();

    // Generate narrative
    await page.click('text=Generate Empathy Narrative');
    await expect(page.locator('[data-testid="empathy-narrative"]')).toBeVisible({ timeout: 15000 });

    // Screen 3: Needs
    await page.click('text=Continue to Needs');
    await expect(page.locator('text=Community Needs')).toBeVisible();

    // Add a need
    await page.click('text=Add Need');
    await page.fill('[name="needTitle"]', 'Mental Health Support');
    await page.fill('[name="needDescription"]', 'Access to trauma-informed counseling');
    await page.selectOption('[name="category"]', 'service');
    await page.selectOption('[name="urgencyLevel"]', 'high');
    await page.click('button:has-text("Save Need")');

    await expect(page.locator('text=Mental Health Support')).toBeVisible();

    // Screen 4: Profile & Export
    await page.click('text=Continue to Profile');
    await expect(page.locator('text=Community Profile')).toBeVisible();

    // Generate personas
    await page.click('text=Generate Personas');
    await expect(page.locator('[data-testid="persona-card"]')).toHaveCount(3, { timeout: 20000 });

    // Test export
    const downloadPromise = page.waitForEvent('download');
    await page.click('text=Export as PDF');
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('.pdf');

    // Complete assessment
    await page.click('text=Complete Assessment');
    await page.waitForURL('/community-compass');

    // Verify assessment appears in list
    await expect(page.locator('text=Youth Services Assessment')).toBeVisible();
  });

  test('should handle errors gracefully', async ({ page }) => {
    await page.goto('/community-compass');

    // Try to create assessment without title
    await page.click('text=Create Assessment');
    await page.fill('[name="targetPopulation"]', 'Youth');
    await page.fill('[name="geographicArea"]', 'DC');
    await page.click('button:has-text("Create Assessment")');

    // Should show error message
    await expect(page.locator('text=Title is required')).toBeVisible();
  });

  test('should persist data across screens', async ({ page }) => {
    await page.goto('/community-compass');
    await page.click('text=Create Assessment');

    // Fill form
    await page.fill('[name="title"]', 'Persistence Test');
    await page.fill('[name="targetPopulation"]', 'Youth');
    await page.fill('[name="geographicArea"]', 'DC');
    await page.click('button:has-text("Create Assessment")');

    // Navigate through screens
    await page.waitForURL(/\/assessments\/[a-f0-9-]+$/);
    const assessmentUrl = page.url();

    // Go to empathy map
    await page.click('text=Continue to Empathy Map');

    // Go back to chip selection
    await page.goBack();

    // Verify we're on the same assessment
    expect(page.url()).toBe(assessmentUrl);
    await expect(page.locator('text=Persistence Test')).toBeVisible();
  });
});
```

**Step 4: Configure Vitest**
```typescript
// vitest.config.ts

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./apps/shell/src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'apps/shell/src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData/',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './apps/shell/src'),
    },
  },
});
```

**Testing Checklist:**
- [ ] Unit tests for all services (80%+ coverage)
- [ ] Integration tests for all API routes
- [ ] E2E test for complete assessment flow
- [ ] E2E test for error scenarios
- [ ] E2E test for export functionality
- [ ] CI/CD pipeline configured
- [ ] Coverage reports in PRs

---

## Infrastructure Improvements

### 6. Database Schema Enhancements

**Priority:** 🟡 MEDIUM
**Effort:** 1 day
**Complexity:** Low

#### Missing Fields

**Add to `community_assessments`:**
```sql
-- Migration: 20251126000000_enhance_assessments_schema.sql

-- Add missing fields
ALTER TABLE public.community_assessments
ADD COLUMN IF NOT EXISTS empathy_narrative TEXT,
ADD COLUMN IF NOT EXISTS personas JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS shared_with UUID[] DEFAULT ARRAY[]::UUID[],
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_assessments_org_id ON public.community_assessments(organization_id);
CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON public.community_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_status ON public.community_assessments(status);
CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON public.community_assessments(created_at DESC);

-- Add GIN index for JSONB fields
CREATE INDEX IF NOT EXISTS idx_assessments_metadata ON public.community_assessments USING GIN(metadata);
CREATE INDEX IF NOT EXISTS idx_assessments_personas ON public.community_assessments USING GIN(personas);
```

**Add to `statement_chips`:**
```sql
ALTER TABLE public.statement_chips
ADD COLUMN IF NOT EXISTS source_citation TEXT,
ADD COLUMN IF NOT EXISTS embedding vector(1536); -- For pgvector semantic search

-- Create index for vector similarity search
CREATE INDEX IF NOT EXISTS idx_chips_embedding ON public.statement_chips
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
```

**Create new table for personas:**
```sql
CREATE TABLE IF NOT EXISTS public.community_personas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES public.community_assessments(id) ON DELETE CASCADE,
    name_placeholder TEXT,
    age_range TEXT NOT NULL,
    life_situation TEXT NOT NULL,
    goals TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    barriers TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    strengths TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    support_systems TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    motivations TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.community_personas ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view personas for their assessments"
    ON public.community_personas
    FOR SELECT
    USING (
        assessment_id IN (
            SELECT id FROM public.community_assessments WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert personas for their assessments"
    ON public.community_personas
    FOR INSERT
    WITH CHECK (
        assessment_id IN (
            SELECT id FROM public.community_assessments WHERE user_id = auth.uid()
        )
    );
```

---

### 7. Organization-Level RLS Migration

**Priority:** 🟡 MEDIUM
**Effort:** 1 day
**Complexity:** Medium
**User Impact:** LOW (architectural alignment)

#### Current Problem
RLS policies use `user_id` instead of `organization_id`, not fully multi-tenant.

#### Solution

**Step 1: Create Session Variable Pattern**
```sql
-- Migration: 20251126000001_migrate_to_org_rls.sql

-- Drop existing user-based policies
DROP POLICY IF EXISTS "Users can view their own assessments" ON public.community_assessments;
DROP POLICY IF EXISTS "Users can insert their own assessments" ON public.community_assessments;
DROP POLICY IF EXISTS "Users can update their own assessments" ON public.community_assessments;

-- Create organization-based policies
CREATE POLICY "Organization members can view assessments"
    ON public.community_assessments
    FOR SELECT
    USING (
        organization_id IN (
            SELECT organization_id
            FROM public.organization_members
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Organization members can insert assessments"
    ON public.community_assessments
    FOR INSERT
    WITH CHECK (
        organization_id IN (
            SELECT organization_id
            FROM public.organization_members
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Assessment owners and org admins can update"
    ON public.community_assessments
    FOR UPDATE
    USING (
        user_id = auth.uid() OR
        organization_id IN (
            SELECT organization_id
            FROM public.organization_members
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Only owners can delete assessments"
    ON public.community_assessments
    FOR DELETE
    USING (user_id = auth.uid());
```

**Step 2: Update API Routes**
```typescript
// Ensure organization context is always set
const { data: prefs } = await supabase
  .from('user_preferences')
  .select('active_organization_id')
  .eq('user_id', user.id)
  .single();

if (!prefs?.active_organization_id) {
  throw new AuthorizationError('No active organization');
}

// All queries automatically filter by org via RLS
```

---

### 8. Rate Limiting Implementation

**Priority:** 🟡 MEDIUM
**Effort:** 1 day
**Complexity:** Medium
**User Impact:** MEDIUM (prevents abuse)

#### Implementation

**Step 1: Install Dependencies**
```bash
pnpm add @upstash/ratelimit @upstash/redis
```

**Step 2: Create Rate Limiter**
```typescript
// apps/shell/src/lib/rateLimit.ts

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Token bucket algorithm - replenishes over time
export const aiRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.tokenBucket(10, '1m', 20), // 10 per minute, max 20 tokens
  analytics: true,
  prefix: 'ratelimit:ai',
});

export const apiRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1m'), // 100 requests per minute
  analytics: true,
  prefix: 'ratelimit:api',
});

export async function checkRateLimit(
  identifier: string,
  limiter: Ratelimit = apiRateLimiter
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  const { success, limit, remaining, reset } = await limiter.limit(identifier);

  return {
    success,
    limit,
    remaining,
    reset,
  };
}
```

**Step 3: Apply to AI Routes**
```typescript
// apps/shell/src/app/api/ai/generate-chips/route.ts

import { checkRateLimit, aiRateLimiter } from '@/lib/rateLimit';
import { RateLimitError } from '@/lib/errors';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new AuthenticationError();
    }

    // Check rate limit
    const { success, remaining, reset } = await checkRateLimit(user.id, aiRateLimiter);

    if (!success) {
      const retryAfter = Math.ceil((reset - Date.now()) / 1000);
      throw new RateLimitError(retryAfter);
    }

    // Add rate limit headers to response
    const response = NextResponse.json(data);
    response.headers.set('X-RateLimit-Limit', limit.toString());
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    response.headers.set('X-RateLimit-Reset', reset.toString());

    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
```

---

### 9. Claude Sonnet 4 Upgrade

**Priority:** 🟡 MEDIUM
**Effort:** 0.5 days
**Complexity:** Low
**User Impact:** MEDIUM (better AI quality)

#### Implementation

**Step 1: Update Model ID**
```typescript
// apps/shell/src/services/aiGenerationService.ts

const message = await anthropic.messages.create({
  model: 'claude-sonnet-4-20250514', // Updated from claude-3-sonnet-20240229
  max_tokens: 2048,
  temperature: 0.8,
  messages: [{ role: 'user', content: prompt }],
});
```

**Step 2: Test Prompt Compatibility**
```typescript
// Run tests to ensure prompts still work with new model
pnpm test src/services/__tests__/aiGenerationService.test.ts
```

**Step 3: Update Documentation**
```markdown
// Update CLAUDE.md and PRD to reflect model upgrade
AI Stack: Claude Sonnet 4 (claude-sonnet-4-20250514)
```

---

## Feature Enhancements

### 10. Progress Indicator & Save Draft

**Priority:** 🟡 MEDIUM
**Effort:** 1 day
**Complexity:** Low
**User Impact:** HIGH (better UX)

#### Implementation

**Step 1: Create Progress Component**
```typescript
// apps/shell/src/components/community-compass/AssessmentProgress.tsx

'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  number: number;
  title: string;
  href: string;
  status: 'complete' | 'current' | 'upcoming';
}

interface AssessmentProgressProps {
  currentScreen: number;
  assessmentId: string;
}

export function AssessmentProgress({ currentScreen, assessmentId }: AssessmentProgressProps) {
  const steps: Step[] = [
    {
      number: 1,
      title: 'Chip Selection',
      href: `/community-compass/assessments/${assessmentId}`,
      status: currentScreen > 1 ? 'complete' : currentScreen === 1 ? 'current' : 'upcoming',
    },
    {
      number: 2,
      title: 'Empathy Map',
      href: `/community-compass/assessments/${assessmentId}/empathy-map`,
      status: currentScreen > 2 ? 'complete' : currentScreen === 2 ? 'current' : 'upcoming',
    },
    {
      number: 3,
      title: 'Needs',
      href: `/community-compass/assessments/${assessmentId}/needs`,
      status: currentScreen > 3 ? 'complete' : currentScreen === 3 ? 'current' : 'upcoming',
    },
    {
      number: 4,
      title: 'Profile',
      href: `/community-compass/assessments/${assessmentId}/profile`,
      status: currentScreen === 4 ? 'current' : 'upcoming',
    },
  ];

  return (
    <nav aria-label="Assessment progress">
      <ol className="flex items-center justify-between">
        {steps.map((step, stepIdx) => (
          <li key={step.title} className={cn('relative', stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20 flex-1' : '')}>
            {/* Connector Line */}
            {stepIdx !== steps.length - 1 && (
              <div className="absolute left-8 top-4 -ml-px mt-0.5 h-0.5 w-full" aria-hidden="true">
                <div
                  className={cn(
                    'h-full w-full',
                    step.status === 'complete' ? 'bg-vision-blue-600' : 'bg-gray-200'
                  )}
                />
              </div>
            )}

            <a
              href={step.status !== 'upcoming' ? step.href : undefined}
              className={cn(
                'group relative flex items-center',
                step.status === 'upcoming' && 'cursor-not-allowed'
              )}
            >
              <span className="flex items-center px-3 py-3 text-sm font-medium">
                {/* Step Number/Check */}
                <span
                  className={cn(
                    'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full',
                    step.status === 'complete' && 'bg-vision-blue-600 group-hover:bg-vision-blue-700',
                    step.status === 'current' && 'border-2 border-vision-blue-600 bg-white',
                    step.status === 'upcoming' && 'border-2 border-gray-300 bg-white'
                  )}
                >
                  {step.status === 'complete' ? (
                    <Check className="h-5 w-5 text-white" aria-hidden="true" />
                  ) : (
                    <span
                      className={cn(
                        step.status === 'current' && 'text-vision-blue-600',
                        step.status === 'upcoming' && 'text-gray-500'
                      )}
                    >
                      {step.number}
                    </span>
                  )}
                </span>

                {/* Step Title */}
                <span
                  className={cn(
                    'ml-3 text-sm font-medium',
                    step.status === 'complete' && 'text-gray-900',
                    step.status === 'current' && 'text-vision-blue-600',
                    step.status === 'upcoming' && 'text-gray-500'
                  )}
                >
                  {step.title}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
```

**Step 2: Add to Layout**
```typescript
// apps/shell/src/app/community-compass/assessments/[id]/layout.tsx

'use client';

import { AssessmentProgress } from '@/components/community-compass/AssessmentProgress';
import { useAssessment } from '@/hooks/useAssessments';
import { useParams } from 'next/navigation';

export default function AssessmentLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const { data: assessment } = useAssessment(params.id as string);

  return (
    <div className="flex flex-col gap-6 p-8">
      {assessment && (
        <AssessmentProgress
          currentScreen={assessment.current_screen}
          assessmentId={assessment.id}
        />
      )}
      {children}
    </div>
  );
}
```

**Step 3: Auto-Save Draft**
```typescript
// apps/shell/src/hooks/useAutoSave.ts

import { useEffect, useRef } from 'react';
import { useUpdateAssessment } from './useAssessments';
import { useDebouncedCallback } from 'use-debounce';

export function useAutoSave(assessmentId: string, data: any, delay: number = 2000) {
  const { mutate: updateAssessment } = useUpdateAssessment(assessmentId);
  const previousData = useRef(data);

  const debouncedSave = useDebouncedCallback(() => {
    if (JSON.stringify(data) !== JSON.stringify(previousData.current)) {
      updateAssessment(data);
      previousData.current = data;
    }
  }, delay);

  useEffect(() => {
    debouncedSave();
  }, [data, debouncedSave]);
}

// Usage in component:
useAutoSave(assessmentId, {
  focus_statement: focusStatement,
  focus_statement_version: focusVersion,
});
```

---

### 11. AI Needs Suggestion

**Priority:** 🟡 MEDIUM
**Effort:** 1-2 days
**Complexity:** Medium
**User Impact:** HIGH (saves time)

#### Implementation

**Step 1: Create AI Service Method**
```typescript
// apps/shell/src/services/aiGenerationService.ts

export const aiGenerationService = {
  // ... existing methods

  /**
   * Suggest community needs based on assessment data
   */
  async suggestNeeds(
    targetPopulation: string,
    selectedChips: Record<string, string[]>,
    focusStatement: string,
    count: number = 5
  ): Promise<Array<{
    title: string;
    description: string;
    category: string;
    urgencyLevel: string;
    impactLevel: string;
    evidenceLevel: string;
    rationale: string;
  }>> {
    const allChips = Object.entries(selectedChips)
      .map(([category, chips]) => `${category.toUpperCase()}:\n${chips.map(c => `- ${c}`).join('\n')}`)
      .join('\n\n');

    const prompt = `You are a community assessment expert analyzing ${targetPopulation}.

Context:
${focusStatement}

Community Insights:
${allChips}

Based on this data, suggest ${count} critical community needs.

For each need, provide:
- title: Brief (3-7 words)
- description: Clear description (1-2 sentences)
- category: One of [service, resource, policy, infrastructure, support]
- urgencyLevel: One of [low, medium, high, critical]
- impactLevel: One of [low, medium, high, transformative]
- evidenceLevel: One of [anecdotal, observed, documented, research-backed]
- rationale: Why this need is important (1 sentence)

Requirements:
- Prioritize high-impact, evidence-based needs
- Be specific and actionable
- Align with community voice from chips
- Avoid generic or assumed needs

Format as JSON array.`;

    const message = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 2048,
      temperature: 0.7,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    const jsonMatch = content.text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Failed to parse needs');
    }

    return JSON.parse(jsonMatch[0]);
  },
};
```

**Step 2: Create API Route**
```typescript
// apps/shell/src/app/api/ai/suggest-needs/route.ts

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { aiGenerationService } from '@/services/aiGenerationService';
import { checkRateLimit, aiRateLimiter } from '@/lib/rateLimit';
import { handleApiError } from '@/lib/errorHandler';
import { AuthenticationError, ValidationError } from '@/lib/errors';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new AuthenticationError();
    }

    // Rate limiting
    const { success, remaining, limit, reset } = await checkRateLimit(user.id, aiRateLimiter);
    if (!success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Reset': reset.toString(),
          },
        }
      );
    }

    const { assessmentId } = await request.json();

    if (!assessmentId) {
      throw new ValidationError('Assessment ID is required');
    }

    // Fetch assessment data
    const { data: assessment, error: assessmentError } = await supabase
      .from('community_assessments')
      .select('*')
      .eq('id', assessmentId)
      .eq('user_id', user.id)
      .single();

    if (assessmentError || !assessment) {
      throw new ValidationError('Assessment not found');
    }

    // Fetch selected chips
    const { data: chips } = await supabase
      .from('statement_chips')
      .select('*')
      .eq('assessment_id', assessmentId)
      .eq('is_selected', true);

    const selectedChips: Record<string, string[]> = {};
    chips?.forEach(chip => {
      if (!selectedChips[chip.question_category]) {
        selectedChips[chip.question_category] = [];
      }
      selectedChips[chip.question_category].push(chip.text);
    });

    // Generate suggestions
    const suggestedNeeds = await aiGenerationService.suggestNeeds(
      assessment.target_population,
      selectedChips,
      assessment.focus_statement || '',
      5
    );

    const response = NextResponse.json({ suggestedNeeds });
    response.headers.set('X-RateLimit-Limit', limit.toString());
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    response.headers.set('X-RateLimit-Reset', reset.toString());

    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
```

**Step 3: Update Needs Page**
```typescript
// apps/shell/src/app/community-compass/assessments/[id]/needs/page.tsx

const [suggestedNeeds, setSuggestedNeeds] = useState<any[]>([]);
const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

const handleGetSuggestions = async () => {
  setIsLoadingSuggestions(true);
  try {
    const response = await fetch('/api/ai/suggest-needs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assessmentId: params.id }),
    });

    if (!response.ok) throw new Error('Failed to get suggestions');

    const data = await response.json();
    setSuggestedNeeds(data.suggestedNeeds);
    toast.success('AI suggestions generated');
  } catch (error) {
    console.error('Error:', error);
    toast.error('Failed to generate suggestions');
  } finally {
    setIsLoadingSuggestions(false);
  }
};

const handleAddSuggestedNeed = async (need: any) => {
  try {
    const response = await fetch('/api/needs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        assessmentId: params.id,
        ...need,
        isAiSuggested: true,
      }),
    });

    if (!response.ok) throw new Error('Failed to add need');

    const data = await response.json();
    setNeeds(prev => [...prev, data.need]);
    setSuggestedNeeds(prev => prev.filter(n => n.title !== need.title));
    toast.success('Need added');
  } catch (error) {
    toast.error('Failed to add need');
  }
};
```

---

### 12. Semantic Search with pgvector

**Priority:** 🟢 LOW
**Effort:** 2-3 days
**Complexity:** High
**User Impact:** MEDIUM (discover similar assessments)

#### Implementation

**Step 1: Enable pgvector**
```sql
-- Run in Supabase SQL editor
CREATE EXTENSION IF NOT EXISTS vector;
```

**Step 2: Add Embedding Generation**
```typescript
// apps/shell/src/services/embeddingService.ts

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const embeddingService = {
  /**
   * Generate embedding for text
   */
  async generateEmbedding(text: string): Promise<number[]> {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
      dimensions: 1536,
    });

    return response.data[0].embedding;
  },

  /**
   * Find similar chips using vector similarity
   */
  async findSimilarChips(
    assessmentId: string,
    queryText: string,
    limit: number = 10
  ): Promise<any[]> {
    const embedding = await this.generateEmbedding(queryText);
    const supabase = createClient();

    const { data, error } = await supabase.rpc('match_chips', {
      query_embedding: embedding,
      match_threshold: 0.7,
      match_count: limit,
      exclude_assessment: assessmentId,
    });

    if (error) {
      throw new Error(`Failed to find similar chips: ${error.message}`);
    }

    return data || [];
  },
};
```

**Step 3: Create Matching Function**
```sql
-- Migration: 20251126000002_add_semantic_search.sql

CREATE OR REPLACE FUNCTION match_chips(
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  exclude_assessment uuid
)
RETURNS TABLE (
  id uuid,
  text text,
  assessment_id uuid,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    statement_chips.id,
    statement_chips.text,
    statement_chips.assessment_id,
    1 - (statement_chips.embedding <=> query_embedding) AS similarity
  FROM statement_chips
  WHERE
    statement_chips.embedding IS NOT NULL
    AND statement_chips.assessment_id != exclude_assessment
    AND 1 - (statement_chips.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;
```

**Step 4: Generate Embeddings on Insert**
```typescript
// apps/shell/src/app/api/chips/route.ts

import { embeddingService } from '@/services/embeddingService';

// After creating chips, generate embeddings
const chipsWithEmbeddings = await Promise.all(
  newChips.map(async (chip) => {
    const embedding = await embeddingService.generateEmbedding(chip.text);
    return { ...chip, embedding };
  })
);

await supabase
  .from('statement_chips')
  .upsert(chipsWithEmbeddings);
```

---

## Performance Optimizations

### 13. Caching Strategy

**Priority:** 🟡 MEDIUM
**Effort:** 1 day
**Complexity:** Low-Medium
**User Impact:** MEDIUM (faster load times)

#### Implementation

**Browser Caching (TanStack Query)**
Already covered in section 3.

**Server Caching**
```typescript
// apps/shell/src/app/api/assessments/route.ts

export const revalidate = 60; // Revalidate every 60 seconds

export async function GET(request: NextRequest) {
  // ... existing code

  const response = NextResponse.json(data);

  // Add cache headers
  response.headers.set(
    'Cache-Control',
    'public, s-maxage=60, stale-while-revalidate=120'
  );

  return response;
}
```

**Static Asset Optimization**
```typescript
// next.config.ts

const nextConfig = {
  images: {
    domains: ['your-supabase-project.supabase.co'],
    formats: ['image/avif', 'image/webp'],
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
};
```

---

### 14. Database Query Optimization

**Priority:** 🟡 MEDIUM
**Effort:** 1 day
**Complexity:** Medium
**User Impact:** HIGH (faster queries)

#### Implementation

**Add Composite Indexes**
```sql
-- Migration: 20251126000003_add_performance_indexes.sql

-- Composite index for common query pattern
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_chips_assessment_selected
ON public.statement_chips(assessment_id, is_selected)
WHERE deleted_at IS NULL;

-- Index for filtering by category and selection
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_chips_category_selected
ON public.statement_chips(question_category, is_selected, assessment_id)
WHERE deleted_at IS NULL;

-- Index for needs filtering
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_needs_assessment_category
ON public.community_needs(assessment_id, category)
WHERE deleted_at IS NULL;

-- Partial index for active assessments
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_assessments_active
ON public.community_assessments(organization_id, status, updated_at DESC)
WHERE deleted_at IS NULL;
```

**Optimize Queries**
```typescript
// Before: Multiple queries
const assessment = await getAssessment(id);
const chips = await getChips(id);
const needs = await getNeeds(id);

// After: Single query with joins
const { data } = await supabase
  .from('community_assessments')
  .select(`
    *,
    chips:statement_chips(*),
    needs:community_needs(*)
  `)
  .eq('id', id)
  .single();
```

**Add Connection Pooling**
```typescript
// In Supabase, enable pgBouncer in settings
// Update connection string to use pooler

// apps/shell/src/lib/supabase/server.ts
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Use pooler for serverless functions
const poolerUrl = supabaseUrl.replace('supabase.co', 'pooler.supabase.com');
```

---

## Security Hardening

### 15. Input Validation with Zod

**Priority:** 🟠 HIGH
**Effort:** 1 day
**Complexity:** Low
**User Impact:** HIGH (prevent bad data)

#### Implementation

**Create Schemas**
```typescript
// apps/shell/src/lib/validation/schemas.ts

import { z } from 'zod';

export const createAssessmentSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or less')
    .trim(),
  targetPopulation: z.string()
    .min(10, 'Target population must be at least 10 characters')
    .max(500, 'Target population must be 500 characters or less')
    .trim(),
  geographicArea: z.string()
    .min(2, 'Geographic area is required')
    .max(200, 'Geographic area must be 200 characters or less')
    .trim(),
});

export const createNeedSchema = z.object({
  assessmentId: z.string().uuid('Invalid assessment ID'),
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be 100 characters or less'),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be 1000 characters or less'),
  category: z.enum(['service', 'resource', 'policy', 'infrastructure', 'support']),
  urgencyLevel: z.enum(['low', 'medium', 'high', 'critical']),
  impactLevel: z.enum(['low', 'medium', 'high', 'transformative']),
  evidenceLevel: z.enum(['anecdotal', 'observed', 'documented', 'research-backed']),
});

export const updateAssessmentSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  targetPopulation: z.string().min(10).max(500).optional(),
  geographicArea: z.string().min(2).max(200).optional(),
  status: z.enum(['draft', 'in_progress', 'completed']).optional(),
  currentScreen: z.number().int().min(1).max(4).optional(),
  focusStatement: z.string().max(5000).optional(),
  empathyNarrative: z.string().max(5000).optional(),
  metadata: z.record(z.any()).optional(),
});

export type CreateAssessmentInput = z.infer<typeof createAssessmentSchema>;
export type CreateNeedInput = z.infer<typeof createNeedSchema>;
export type UpdateAssessmentInput = z.infer<typeof updateAssessmentSchema>;
```

**Apply in API Routes**
```typescript
// apps/shell/src/app/api/assessments/route.ts

import { createAssessmentSchema } from '@/lib/validation/schemas';
import { ValidationError } from '@/lib/errors';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = createAssessmentSchema.parse(body);

    // ... rest of logic with validatedData

  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Invalid input', {
        errors: error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
    }
    return handleApiError(error);
  }
}
```

**Apply in Forms**
```typescript
// apps/shell/src/app/community-compass/assessments/new/page.tsx

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createAssessmentSchema } from '@/lib/validation/schemas';

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(createAssessmentSchema),
});
```

---

### 16. CSRF Protection

**Priority:** 🟡 MEDIUM
**Effort:** 0.5 days
**Complexity:** Low
**User Impact:** LOW (security best practice)

#### Implementation

**Add CSRF Middleware**
```typescript
// apps/shell/src/middleware.ts

import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // CSRF protection for state-changing methods
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    const origin = req.headers.get('origin');
    const host = req.headers.get('host');

    // Verify origin matches host
    if (origin && !origin.includes(host || '')) {
      return new NextResponse('CSRF validation failed', { status: 403 });
    }
  }

  return res;
}

export const config = {
  matcher: '/api/:path*',
};
```

---

### 17. Content Security Policy

**Priority:** 🟡 MEDIUM
**Effort:** 0.5 days
**Complexity:** Low
**User Impact:** LOW (security hardening)

#### Implementation

```typescript
// next.config.ts

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' *.vercel-insights.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: https:;
  font-src 'self' data:;
  connect-src 'self' *.supabase.co *.anthropic.com *.vercel.com;
  frame-ancestors 'none';
`;

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim(),
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
];

const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};
```

---

## Implementation Roadmap

### Phase 1: Critical MVP Launch (Week 1-2)

#### Week 1
- **Day 1-3:** Implement export functionality (PDF, DOCX, Markdown)
- **Day 4-5:** Extract service layer (assessment, chip, AI services)

#### Week 2
- **Day 1-2:** Add basic error handling (error classes, boundaries)
- **Day 3:** Implement input validation with Zod
- **Day 4-5:** Write critical unit tests (services)

**Deliverable:** Functional MVP with export, better error handling, basic tests

---

### Phase 2: Infrastructure & Polish (Week 3-4)

#### Week 3
- **Day 1-2:** Integrate TanStack Query
- **Day 3:** Add rate limiting
- **Day 4-5:** Upgrade to Claude Sonnet 4 and test

#### Week 4
- **Day 1-2:** Migrate to org-level RLS
- **Day 3:** Add progress indicator and auto-save
- **Day 4-5:** Write integration tests for API routes

**Deliverable:** Production-ready infrastructure, better UX

---

### Phase 3: Advanced Features (Week 5-6)

#### Week 5
- **Day 1-2:** Implement AI needs suggestion
- **Day 3-4:** Add semantic search with pgvector
- **Day 5:** Database query optimization

#### Week 6
- **Day 1-2:** Implement caching strategy
- **Day 3:** Add Sentry error tracking
- **Day 4-5:** Write E2E tests with Playwright

**Deliverable:** Full-featured application with monitoring

---

### Phase 4: Production Hardening (Week 7-8)

#### Week 7
- **Day 1:** Add CSRF protection and CSP headers
- **Day 2-3:** Performance optimization (indexes, caching)
- **Day 4-5:** Security audit and penetration testing

#### Week 8
- **Day 1-2:** Add CloudWatch/analytics integration
- **Day 3:** Documentation updates
- **Day 4-5:** Load testing and optimization

**Deliverable:** Enterprise-grade, production-hardened application

---

## Success Metrics

### Technical Metrics
- [ ] **Test Coverage:** ≥80% for services, ≥60% overall
- [ ] **API Response Time:** <200ms p95 for reads, <500ms for AI calls
- [ ] **Error Rate:** <0.1% in production
- [ ] **Uptime:** 99.9% availability
- [ ] **Security:** No critical vulnerabilities
- [ ] **Performance:** Lighthouse score >90

### User Experience Metrics
- [ ] **Time to Complete Assessment:** <30 minutes
- [ ] **Export Success Rate:** >99%
- [ ] **AI Generation Success Rate:** >95%
- [ ] **User Satisfaction:** >4.5/5 stars
- [ ] **Feature Adoption:** >80% use export, >60% use AI suggestions

### Business Metrics
- [ ] **Assessments Created:** Track weekly/monthly
- [ ] **Active Organizations:** Track growth
- [ ] **Export Downloads:** Track format preferences
- [ ] **Support Tickets:** <5% of users need help
- [ ] **Retention:** >85% monthly active users

---

## Appendix

### A. File Structure After Completion

```
apps/shell/src/
├── app/
│   ├── api/
│   │   ├── assessments/
│   │   │   ├── [id]/
│   │   │   │   └── export/
│   │   │   │       └── route.ts ✅ NEW
│   │   │   └── route.ts ✅ UPDATED
│   │   ├── ai/
│   │   │   ├── generate-chips/route.ts ✅ UPDATED
│   │   │   ├── generate-focus-statement/route.ts ✅ UPDATED
│   │   │   └── suggest-needs/route.ts ✅ NEW
│   │   └── needs/route.ts ✅ NEW
│   └── community-compass/
│       ├── assessments/
│       │   └── [id]/
│       │       ├── layout.tsx ✅ NEW (progress indicator)
│       │       ├── page.tsx ✅ UPDATED
│       │       ├── empathy-map/page.tsx ✅ UPDATED
│       │       ├── needs/page.tsx ✅ UPDATED
│       │       └── profile/page.tsx ✅ UPDATED
│       └── page.tsx
├── components/
│   ├── community-compass/
│   │   ├── AssessmentProgress.tsx ✅ NEW
│   │   ├── ChipSelector.tsx
│   │   ├── NeedCard.tsx
│   │   └── PersonaCard.tsx
│   └── ErrorBoundary.tsx ✅ NEW
├── hooks/
│   ├── useAssessments.ts ✅ NEW (TanStack Query)
│   ├── useChips.ts ✅ NEW
│   ├── useNeeds.ts ✅ NEW
│   └── useAutoSave.ts ✅ NEW
├── lib/
│   ├── errors.ts ✅ NEW
│   ├── errorHandler.ts ✅ NEW
│   ├── rateLimit.ts ✅ NEW
│   ├── queryClient.ts ✅ NEW
│   └── validation/
│       └── schemas.ts ✅ NEW
├── services/
│   ├── assessmentService.ts ✅ NEW
│   ├── chipService.ts ✅ NEW
│   ├── needService.ts ✅ NEW
│   ├── aiGenerationService.ts ✅ NEW
│   ├── exportService.ts ✅ NEW
│   ├── embeddingService.ts ✅ NEW
│   └── __tests__/
│       ├── assessmentService.test.ts ✅ NEW
│       ├── chipService.test.ts ✅ NEW
│       └── aiGenerationService.test.ts ✅ NEW
└── middleware.ts ✅ UPDATED (CSRF)
```

### B. Environment Variables Needed

```bash
# Existing
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=

# New Additions
OPENAI_API_KEY=                # For embeddings
UPSTASH_REDIS_REST_URL=       # For rate limiting
UPSTASH_REDIS_REST_TOKEN=     # For rate limiting
SENTRY_DSN=                    # For error tracking
NEXT_PUBLIC_SENTRY_DSN=       # For client-side errors
```

### C. Dependencies to Install

```bash
# Core functionality
pnpm add react-pdf @react-pdf/renderer docx marked
pnpm add @tanstack/react-query @tanstack/react-query-devtools
pnpm add zod @hookform/resolvers-zod

# Infrastructure
pnpm add @upstash/ratelimit @upstash/redis
pnpm add @sentry/nextjs
pnpm add openai  # For embeddings

# Development
pnpm add -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom
pnpm add -D @playwright/test
pnpm add -D @types/marked
```

---

## Conclusion

This report provides a complete roadmap for bringing Community Compass from 70% to 100% implementation with production-grade quality. The priorities are structured to deliver user value quickly while building the infrastructure needed for long-term success.

**Key Takeaways:**
1. **Export functionality is the #1 blocker** - Users can't get value without it
2. **Testing is critical** - Prevents regressions as features expand
3. **Service layer enables everything** - Testing, maintainability, scalability
4. **TanStack Query improves UX significantly** - Better performance, simpler code
5. **Security hardening is non-negotiable** - Input validation, rate limiting, RLS

Follow the 8-week roadmap to achieve enterprise-grade quality while maintaining velocity.
