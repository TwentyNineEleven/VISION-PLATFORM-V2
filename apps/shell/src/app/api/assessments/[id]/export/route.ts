import { createServerSupabaseClient } from '@/lib/supabase/server';
import { exportService, type ExportData, type ExportFormat, type ExportPersona } from '@/services/exportService';
import type { AsyncRouteParams } from '@/types/next';
import type { Database } from '@/types/supabase';
import { NextRequest, NextResponse } from 'next/server';

type StatementChip = Database['public']['Tables']['statement_chips']['Row'];
type CommunityNeed = Database['public']['Tables']['community_needs']['Row'];
type AssessmentRow = Database['public']['Tables']['community_assessments']['Row'];

const isExportFormat = (value: unknown): value is ExportFormat =>
  typeof value === 'string' && ['pdf', 'docx', 'markdown'].includes(value);

const toStringArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map(item => `${item}`.trim()).filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(/[,;]+/)
      .map(item => item.trim())
      .filter(Boolean);
  }

  return [];
};

const mapPersonas = (raw: unknown): ExportPersona[] => {
  if (!raw) return [];

  const personasArray = Array.isArray(raw)
    ? raw
    : typeof raw === 'string'
      ? (() => {
          try {
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
          } catch {
            return [];
          }
        })()
      : [];

  return personasArray.map((persona, idx) => {
    const typed = persona as Record<string, unknown>;
    return {
      namePlaceholder:
        typeof typed.namePlaceholder === 'string'
          ? typed.namePlaceholder
          : typeof typed.name === 'string'
            ? typed.name
            : undefined,
      ageRange: typeof typed.ageRange === 'string' ? typed.ageRange : undefined,
      lifeSituation: typeof typed.lifeSituation === 'string' ? typed.lifeSituation : undefined,
      goals: toStringArray(typed.goals),
      barriers: toStringArray(typed.barriers),
      strengths: toStringArray(typed.strengths),
      supportSystems: toStringArray(typed.supportSystems),
      motivations: typeof typed.motivations === 'string' ? typed.motivations : undefined,
    };
  });
};

const mapChips = (chips: StatementChip[]) => {
  const selectedChips: Record<string, string[]> = {
    experiences: [],
    barriers: [],
    urgency: [],
    strengths: [],
    aspirations: [],
  };

  const empathyMap = {
    painPoints: [] as string[],
    feelings: [] as string[],
    influences: [] as string[],
    intentions: [] as string[],
  };

  chips.forEach(chip => {
    const category = chip.question_category;
    switch (category) {
      case 'experiences':
      case 'barriers':
      case 'urgency':
      case 'strengths':
      case 'aspirations':
        selectedChips[category] = [...(selectedChips[category] || []), chip.text];
        break;
      case 'pain':
      case 'pain_points':
        empathyMap.painPoints.push(chip.text);
        break;
      case 'feelings':
        empathyMap.feelings.push(chip.text);
        break;
      case 'influences':
        empathyMap.influences.push(chip.text);
        break;
      case 'intentions':
        empathyMap.intentions.push(chip.text);
        break;
      default:
        break;
    }
  });

  return { selectedChips, empathyMap };
};

const mapNeeds = (needs: CommunityNeed[]) =>
  needs.map(need => ({
    title: need.title,
    description: need.description ?? '',
    category: need.category,
    urgencyLevel: need.urgency_level,
    impactLevel: need.impact_level,
    evidenceLevel: need.evidence_level,
  }));

const buildExportData = (
  assessment: AssessmentRow,
  chips: StatementChip[] = [],
  needs: CommunityNeed[] = []
): ExportData => {
  const { selectedChips, empathyMap } = mapChips(chips);

  return {
    assessment: {
      title: assessment.title,
      targetPopulation: assessment.target_population,
      geographicArea: assessment.geographic_area,
      createdAt: assessment.created_at,
    },
    focusStatement: assessment.focus_statement || '',
    selectedChips,
    empathyMap: {
      ...empathyMap,
      narrative: assessment.empathy_narrative || '',
    },
    needs: mapNeeds(needs),
    personas: mapPersonas(assessment.personas),
  };
};

export async function POST(request: NextRequest, { params }: AsyncRouteParams<{ id: string }>) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { format } = body ?? {};

    if (!isExportFormat(format)) {
      return NextResponse.json({ error: 'Invalid format' }, { status: 400 });
    }

    // Fetch assessment with ownership check (RLS enforced)
    const { data: assessment, error: assessmentError } = await supabase
      .from('community_assessments')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (assessmentError || !assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    const [{ data: chips }, { data: needs }] = await Promise.all([
      supabase
        .from('statement_chips')
        .select('*')
        .eq('assessment_id', id)
        .eq('is_selected', true),
      supabase.from('community_needs').select('*').eq('assessment_id', id),
    ]);

    const exportData = buildExportData(assessment, chips || [], needs || []);

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
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}
