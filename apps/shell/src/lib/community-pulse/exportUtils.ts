/**
 * CommunityPulse Export Utilities
 * Generate exports of engagement data in various formats
 */

import type { Engagement, EngagementMethod } from '@/types/community-pulse';
import { STAGE_NAMES } from '@/types/community-pulse';

// ============================================================================
// JSON EXPORT
// ============================================================================

export interface EngagementExportData {
  engagement: Engagement;
  method?: EngagementMethod;
  exportedAt: string;
  exportVersion: string;
}

/**
 * Export engagement data as JSON
 */
export function exportToJSON(
  engagement: Engagement,
  method?: EngagementMethod
): string {
  const exportData: EngagementExportData = {
    engagement,
    method,
    exportedAt: new Date().toISOString(),
    exportVersion: '1.0.0',
  };

  return JSON.stringify(exportData, null, 2);
}

/**
 * Download JSON export
 */
export function downloadJSON(engagement: Engagement, method?: EngagementMethod): void {
  const json = exportToJSON(engagement, method);
  const blob = new Blob([json], { type: 'application/json' });
  downloadBlob(blob, `${sanitizeFilename(engagement.title)}-export.json`);
}

// ============================================================================
// CSV EXPORT
// ============================================================================

interface CSVRow {
  [key: string]: string | number | boolean | null;
}

/**
 * Export engagement data as CSV
 */
export function exportToCSV(engagement: Engagement): string {
  const rows: CSVRow[] = [
    {
      field: 'Title',
      value: engagement.title,
    },
    {
      field: 'Status',
      value: engagement.status,
    },
    {
      field: 'Current Stage',
      value: `${engagement.currentStage} - ${STAGE_NAMES[engagement.currentStage - 1]}`,
    },
    {
      field: 'Learning Goal',
      value: engagement.learningGoal || '',
    },
    {
      field: 'Goal Type',
      value: engagement.goalType || '',
    },
    {
      field: 'Target Population',
      value: engagement.targetPopulation || '',
    },
    {
      field: 'Estimated Participants',
      value: engagement.estimatedParticipants || '',
    },
    {
      field: 'Primary Method',
      value: engagement.primaryMethod || '',
    },
    {
      field: 'Participation Model',
      value: engagement.participationModel || '',
    },
    {
      field: 'Budget Estimate',
      value: engagement.budgetEstimate ? `$${engagement.budgetEstimate.toLocaleString()}` : '',
    },
    {
      field: 'Start Date',
      value: engagement.startDate || '',
    },
    {
      field: 'End Date',
      value: engagement.endDate || '',
    },
    {
      field: 'Created At',
      value: new Date(engagement.createdAt).toLocaleDateString(),
    },
    {
      field: 'Updated At',
      value: new Date(engagement.updatedAt).toLocaleDateString(),
    },
  ];

  // Add equity checklist items
  if (engagement.equityChecklist) {
    const checklist = engagement.equityChecklist;
    if (checklist.safety) {
      rows.push({ field: 'Safety - Physical Safety', value: checklist.safety.physicalSafety ? 'Yes' : 'No' });
      rows.push({ field: 'Safety - Emotional Safety', value: checklist.safety.emotionalSafety ? 'Yes' : 'No' });
    }
    if (checklist.accessibility) {
      rows.push({ field: 'Accessibility - Language Access', value: checklist.accessibility.languageAccess ? 'Yes' : 'No' });
      rows.push({ field: 'Accessibility - Compensation', value: checklist.accessibility.compensation ? 'Yes' : 'No' });
    }
    if (checklist.communityBenefit) {
      rows.push({ field: 'Community Benefit - Findings Shared', value: checklist.communityBenefit.findingsShared ? 'Yes' : 'No' });
      rows.push({ field: 'Community Benefit - Informed Consent', value: checklist.communityBenefit.informedConsent ? 'Yes' : 'No' });
    }
  }

  // Convert to CSV
  const headers = ['Field', 'Value'];
  const csvRows = [
    headers.join(','),
    ...rows.map((row) => [escapeCSV(String(row.field)), escapeCSV(String(row.value))].join(',')),
  ];

  return csvRows.join('\n');
}

/**
 * Download CSV export
 */
export function downloadCSV(engagement: Engagement): void {
  const csv = exportToCSV(engagement);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, `${sanitizeFilename(engagement.title)}-export.csv`);
}

// ============================================================================
// MARKDOWN EXPORT (for reports)
// ============================================================================

/**
 * Export engagement as Markdown report
 */
export function exportToMarkdown(
  engagement: Engagement,
  method?: EngagementMethod
): string {
  const lines: string[] = [];

  // Header
  lines.push(`# ${engagement.title}`);
  lines.push('');
  lines.push(`**Status:** ${formatStatus(engagement.status)}`);
  lines.push(`**Current Stage:** ${engagement.currentStage} of 7 - ${STAGE_NAMES[engagement.currentStage - 1]}`);
  lines.push(`**Created:** ${new Date(engagement.createdAt).toLocaleDateString()}`);
  lines.push('');

  // Stage 1: Learning Goals
  lines.push('## 1. Learning Goals');
  lines.push('');
  if (engagement.learningGoal) {
    lines.push(engagement.learningGoal);
  } else {
    lines.push('_Not specified_');
  }
  if (engagement.goalType) {
    lines.push('');
    lines.push(`**Goal Type:** ${formatGoalType(engagement.goalType)}`);
  }
  lines.push('');

  // Stage 2: Community Context
  lines.push('## 2. Community Context');
  lines.push('');
  if (engagement.targetPopulation) {
    lines.push(`**Target Population:** ${engagement.targetPopulation}`);
  }
  if (engagement.estimatedParticipants) {
    lines.push(`**Estimated Participants:** ${engagement.estimatedParticipants}`);
  }
  if (engagement.demographics?.languages?.length) {
    lines.push(`**Languages:** ${engagement.demographics.languages.join(', ')}`);
  }
  if (engagement.relationshipHistory) {
    lines.push('');
    lines.push('**Relationship History:**');
    lines.push(engagement.relationshipHistory);
  }
  if (engagement.culturalConsiderations) {
    lines.push('');
    lines.push('**Cultural Considerations:**');
    lines.push(engagement.culturalConsiderations);
  }
  lines.push('');

  // Stage 3: Method Selection
  lines.push('## 3. Engagement Method');
  lines.push('');
  if (method) {
    lines.push(`**Primary Method:** ${method.name}`);
    lines.push(`**Category:** ${method.category}`);
    lines.push(`**Group Size:** ${method.groupSizeMin}-${method.groupSizeMax} participants`);
    lines.push(`**Duration:** ${method.durationMin}-${method.durationMax} minutes`);
    lines.push(`**Estimated Cost:** $${method.costEstimateLow.toLocaleString()}-$${method.costEstimateHigh.toLocaleString()}`);
    lines.push('');
    lines.push(`**Best For:** ${method.bestFor}`);
  } else if (engagement.primaryMethod) {
    lines.push(`**Primary Method:** ${engagement.primaryMethod}`);
  } else {
    lines.push('_Not selected_');
  }
  if (engagement.methodRationale) {
    lines.push('');
    lines.push('**Rationale:**');
    lines.push(engagement.methodRationale);
  }
  lines.push('');

  // Stage 4: Strategy Design
  lines.push('## 4. Strategy Design');
  lines.push('');
  if (engagement.participationModel) {
    lines.push(`**Participation Model:** ${formatParticipationModel(engagement.participationModel)}`);
  }
  if (engagement.recruitmentPlan) {
    lines.push('');
    lines.push('**Recruitment Plan:**');
    lines.push(engagement.recruitmentPlan);
  }
  lines.push('');

  // Equity Checklist
  if (engagement.equityChecklist) {
    lines.push('### Equity Checklist');
    lines.push('');
    const checklist = engagement.equityChecklist;

    if (checklist.safety) {
      lines.push('**Safety:**');
      if (checklist.safety.physicalSafety !== undefined) {
        lines.push(`- [${checklist.safety.physicalSafety ? 'x' : ' '}] Physical safety plan in place`);
      }
      if (checklist.safety.emotionalSafety !== undefined) {
        lines.push(`- [${checklist.safety.emotionalSafety ? 'x' : ' '}] Emotional safety protocols`);
      }
    }

    if (checklist.accessibility) {
      lines.push('');
      lines.push('**Accessibility:**');
      if (checklist.accessibility.languageAccess !== undefined) {
        lines.push(`- [${checklist.accessibility.languageAccess ? 'x' : ' '}] Language access provided`);
      }
      if (checklist.accessibility.compensation !== undefined) {
        lines.push(`- [${checklist.accessibility.compensation ? 'x' : ' '}] Participant compensation`);
      }
    }

    if (checklist.communityBenefit) {
      lines.push('');
      lines.push('**Community Benefit:**');
      if (checklist.communityBenefit.informedConsent !== undefined) {
        lines.push(`- [${checklist.communityBenefit.informedConsent ? 'x' : ' '}] Informed consent process`);
      }
      if (checklist.communityBenefit.findingsShared !== undefined) {
        lines.push(`- [${checklist.communityBenefit.findingsShared ? 'x' : ' '}] Findings will be shared`);
      }
    }
    lines.push('');
  }

  // Stage 6: Timeline & Budget
  lines.push('## 5. Timeline & Budget');
  lines.push('');
  if (engagement.startDate) {
    lines.push(`**Start Date:** ${engagement.startDate}`);
  }
  if (engagement.endDate) {
    lines.push(`**End Date:** ${engagement.endDate}`);
  }
  if (engagement.budgetEstimate) {
    lines.push(`**Budget Estimate:** $${engagement.budgetEstimate.toLocaleString()}`);
  }
  lines.push('');

  // Footer
  lines.push('---');
  lines.push('');
  lines.push(`*Generated by CommunityPulse on ${new Date().toLocaleDateString()}*`);

  return lines.join('\n');
}

/**
 * Download Markdown export
 */
export function downloadMarkdown(engagement: Engagement, method?: EngagementMethod): void {
  const md = exportToMarkdown(engagement, method);
  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
  downloadBlob(blob, `${sanitizeFilename(engagement.title)}-report.md`);
}

// ============================================================================
// PRINT-FRIENDLY HTML
// ============================================================================

/**
 * Generate print-friendly HTML
 */
export function generatePrintHTML(
  engagement: Engagement,
  method?: EngagementMethod
): string {
  const markdown = exportToMarkdown(engagement, method);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHTML(engagement.title)} - CommunityPulse Report</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      color: #1a1a1a;
    }
    h1 { color: #0047AB; border-bottom: 2px solid #0047AB; padding-bottom: 0.5rem; }
    h2 { color: #333; margin-top: 2rem; }
    h3 { color: #555; }
    strong { color: #333; }
    ul { list-style-type: none; padding-left: 0; }
    li { margin: 0.25rem 0; }
    li:before { content: ""; }
    hr { border: none; border-top: 1px solid #ddd; margin: 2rem 0; }
    @media print {
      body { padding: 0; }
      h1 { page-break-after: avoid; }
      h2, h3 { page-break-after: avoid; }
    }
  </style>
</head>
<body>
${markdownToHTML(markdown)}
</body>
</html>`;
}

/**
 * Open print dialog
 */
export function printEngagement(engagement: Engagement, method?: EngagementMethod): void {
  const html = generatePrintHTML(engagement, method);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50);
}

function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function escapeHTML(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatStatus(status: string): string {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatGoalType(type: string): string {
  const types: Record<string, string> = {
    explore: 'Explore - Understand experiences and perceptions',
    test: 'Test - Validate ideas and assumptions',
    decide: 'Decide - Make choices and prioritize',
  };
  return types[type] || type;
}

function formatParticipationModel(model: string): string {
  const models: Record<string, string> = {
    informational: 'Informational - Gathering input from community',
    consultative: 'Consultative - Co-interpreting findings together',
    collaborative: 'Collaborative - Co-designing solutions together',
    community_controlled: 'Community-Controlled - Community leads, we support',
  };
  return models[model] || model;
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function markdownToHTML(markdown: string): string {
  // Simple markdown to HTML conversion
  return markdown
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/_(.+?)_/g, '<em>$1</em>')
    .replace(/^- \[x\] (.+)$/gm, '<li>✓ $1</li>')
    .replace(/^- \[ \] (.+)$/gm, '<li>☐ $1</li>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    .replace(/^---$/gm, '<hr>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(.+)$/gm, (match) => {
      if (match.startsWith('<')) return match;
      return `<p>${match}</p>`;
    })
    .replace(/<p><\/p>/g, '');
}
