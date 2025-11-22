# AI Agent Development Framework

**Version:** 1.0
**Last Updated:** November 12, 2025
**Owner:** Platform Engineering Team

---

## 📋 Framework Overview

### Purpose

This framework provides comprehensive guidelines for developing AI agents within the VISION Platform ecosystem. It covers agent architecture, prompt engineering, cost optimization, quality assurance, and integration patterns.

### AI Strategy

The VISION Platform uses a **multi-model AI strategy** optimized for cost, performance, and quality:

| Model | Use Case | Cost | Response Time | Quality Score |
|-------|----------|------|---------------|---------------|
| **Claude 3.5 Sonnet** | Primary content generation | $3/$15 per MTok | 2-5s | 95/100 |
| **Claude 3 Opus** | Complex analysis only | $15/$75 per MTok | 5-10s | 98/100 |
| **OpenAI Ada-002** | Embeddings for search | $0.10 per MTok | <1s | N/A |
| **Ollama (local)** | Development/testing | Free | 1-3s | 85/100 |

---

## 🤖 Agent Architecture

### Agent Types

#### 1. Content Generation Agents

**Purpose:** Generate high-quality written content (grant proposals, impact stories, marketing copy)

**Characteristics:**
- Long-form output (500-5000 tokens)
- Requires organization context
- Benefits from prompt caching
- High quality expectations

**Examples:**
- Grant Writer Pro
- Impact Story Generator
- Marketing Content Creator
- Annual Report Writer

#### 2. Analysis Agents

**Purpose:** Analyze data and provide insights (assessment analysis, benchmark comparison)

**Characteristics:**
- Medium-length output (200-1000 tokens)
- Structured data input
- Numerical reasoning required
- High accuracy expectations

**Examples:**
- CapacityIQ Assessment Analyzer
- Financial Health Analyzer
- Program Impact Evaluator
- Competitive Landscape Analyzer

#### 3. Assistant Agents

**Purpose:** Provide real-time help and suggestions (form assistance, content improvement)

**Characteristics:**
- Short output (50-300 tokens)
- Fast response required
- Conversational tone
- Context-aware

**Examples:**
- Form Field Assistant
- Writing Improvement Suggester
- Data Entry Helper
- Quick Question Answerer

#### 4. Research Agents

**Purpose:** Find and synthesize information (funder research, community analysis)

**Characteristics:**
- Variable output length
- Web search integration
- Citation required
- Source verification

**Examples:**
- Funder Research Scout
- Community Data Analyzer
- Competitive Intelligence Gatherer
- Best Practices Researcher

---

## 🏗️ Agent Implementation Pattern

### Standard Agent Structure

```typescript
// packages/ai-functions/src/agents/[agent-name]/index.ts

import Anthropic from '@anthropic-ai/sdk';
import { trackAICost } from '../../tracking/cost-tracker';
import { AgentResponse, AgentError } from '../../types';

export interface [AgentName]Input {
  // Input parameters
  organizationId: string;
  // ... agent-specific inputs
}

export interface [AgentName]Output {
  content: string;
  confidence: number;
  tokensUsed: number;
  cost: number;
  citations?: string[];
}

/**
 * [Agent Name] - [Brief description]
 *
 * Purpose: [What this agent does]
 * Input: [What data it needs]
 * Output: [What it produces]
 *
 * @example
 * const result = await [agentName]({
 *   organizationId: 'org-123',
 *   // ... inputs
 * });
 */
export async function [agentName](
  input: [AgentName]Input
): Promise<AgentResponse<[AgentName]Output>> {
  try {
    // 1. Validate input
    validateInput(input);

    // 2. Get organization context
    const orgContext = await getOrganizationContext(input.organizationId);

    // 3. Build prompt
    const prompt = buildPrompt(input, orgContext);

    // 4. Call Claude API
    const response = await callClaude(prompt, {
      model: 'claude-3-5-sonnet-20241022',
      maxTokens: 4096,
      temperature: 0.7,
      useCache: true,
    });

    // 5. Parse and validate output
    const output = parseOutput(response);

    // 6. Track costs
    await trackAICost({
      organization_id: input.organizationId,
      agent_name: '[agent-name]',
      model: 'claude-3-5-sonnet-20241022',
      input_tokens: response.usage.input_tokens,
      output_tokens: response.usage.output_tokens,
      cost: calculateCost(response.usage),
    });

    // 7. Return result
    return {
      success: true,
      data: output,
    };
  } catch (error) {
    // 8. Handle errors
    return {
      success: false,
      error: {
        message: 'Agent execution failed',
        code: 'AGENT_ERROR',
        details: error,
      },
    };
  }
}

// Helper functions
function validateInput(input: [AgentName]Input): void {
  // Input validation logic
}

function buildPrompt(input: [AgentName]Input, orgContext: any): string {
  // Prompt construction logic
}

async function callClaude(prompt: string, options: any): Promise<any> {
  // Claude API call logic
}

function parseOutput(response: any): [AgentName]Output {
  // Output parsing logic
}

function calculateCost(usage: { input_tokens: number; output_tokens: number }): number {
  const inputCost = (usage.input_tokens / 1000000) * 3.0;
  const outputCost = (usage.output_tokens / 1000000) * 15.0;
  return inputCost + outputCost;
}
```

### Example Implementation: Grant Writer Agent

```typescript
// packages/ai-functions/src/agents/grant-writer/index.ts

import Anthropic from '@anthropic-ai/sdk';
import { trackAICost } from '../../tracking/cost-tracker';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface GrantWriterInput {
  organizationId: string;
  grantOpportunity: {
    title: string;
    funderName: string;
    amount: number;
    deadline: string;
    requirements: string;
    focusAreas: string[];
  };
  section: 'needs_statement' | 'project_description' | 'evaluation_plan' | 'budget_narrative';
  additionalContext?: string;
}

export interface GrantWriterOutput {
  content: string;
  confidence: number;
  wordCount: number;
  tokensUsed: number;
  cost: number;
  suggestions: string[];
}

/**
 * Grant Writer Pro Agent
 *
 * Generates high-quality grant proposal content tailored to the
 * organization's mission and the funder's requirements.
 *
 * Uses Claude 3.5 Sonnet with prompt caching for cost optimization.
 * Includes organization context and past successful proposals.
 */
export async function generateGrantProposal(
  input: GrantWriterInput
): Promise<AgentResponse<GrantWriterOutput>> {
  try {
    // Get organization profile and past proposals
    const orgContext = await getOrganizationContext(input.organizationId);
    const pastProposals = await getSuccessfulProposals(input.organizationId);

    // Build system prompt with caching
    const systemPrompt = [
      {
        type: 'text' as const,
        text: `You are an expert grant writer specializing in nonprofit funding proposals. You have 20+ years of experience writing successful grant proposals that have secured over $100M in funding.

Your writing style is:
- Clear and compelling
- Data-driven with specific examples
- Aligned with funder priorities
- Professional yet passionate
- Results-oriented

You always:
- Use active voice
- Include specific metrics and outcomes
- Connect programs to community needs
- Demonstrate organizational capacity
- Show sustainability planning`,
        cache_control: { type: 'ephemeral' as const },
      },
      {
        type: 'text' as const,
        text: `ORGANIZATION CONTEXT:\n${JSON.stringify(orgContext, null, 2)}`,
        cache_control: { type: 'ephemeral' as const },
      },
      {
        type: 'text' as const,
        text: `SUCCESSFUL PROPOSAL EXAMPLES:\n${formatPastProposals(pastProposals)}`,
        cache_control: { type: 'ephemeral' as const },
      },
    ];

    // Build user prompt
    const userPrompt = `Write a compelling ${input.section.replace('_', ' ')} for a grant proposal with these details:

GRANT OPPORTUNITY:
- Funder: ${input.grantOpportunity.funderName}
- Title: ${input.grantOpportunity.title}
- Amount: $${input.grantOpportunity.amount.toLocaleString()}
- Focus Areas: ${input.grantOpportunity.focusAreas.join(', ')}
- Requirements: ${input.grantOpportunity.requirements}

${input.additionalContext ? `ADDITIONAL CONTEXT:\n${input.additionalContext}` : ''}

Generate a comprehensive ${input.section.replace('_', ' ')} (800-1200 words) that:
1. Directly addresses the funder's priorities
2. Uses specific data and examples from our organization
3. Demonstrates clear outcomes and impact
4. Shows alignment with our mission
5. Includes measurable evaluation metrics

Use our organization's data and successful past proposal patterns, but create fresh, original content tailored specifically to this opportunity.`;

    // Call Claude API
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      temperature: 0.7,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    // Parse response
    const content = response.content[0].type === 'text' ? response.content[0].text : '';
    const wordCount = content.split(/\s+/).length;

    // Calculate confidence based on output quality
    const confidence = calculateConfidence(content, input.grantOpportunity);

    // Generate improvement suggestions
    const suggestions = generateSuggestions(content, input.grantOpportunity);

    // Track costs
    const cost = calculateCost(response.usage);
    await trackAICost({
      organization_id: input.organizationId,
      agent_name: 'grant-writer-pro',
      model: 'claude-3-5-sonnet-20241022',
      input_tokens: response.usage.input_tokens,
      output_tokens: response.usage.output_tokens,
      cost,
      operation: `generate_${input.section}`,
      metadata: {
        funder: input.grantOpportunity.funderName,
        amount: input.grantOpportunity.amount,
      },
    });

    return {
      success: true,
      data: {
        content,
        confidence,
        wordCount,
        tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
        cost,
        suggestions,
      },
    };
  } catch (error) {
    console.error('Grant writer agent error:', error);
    return {
      success: false,
      error: {
        message: 'Failed to generate grant proposal content',
        code: 'GRANT_WRITER_ERROR',
        details: error,
      },
    };
  }
}

// Helper functions
async function getOrganizationContext(orgId: string) {
  // Fetch organization profile, mission, programs, impact data
  const { data } = await supabase
    .from('organizations')
    .select(`
      *,
      programs(*),
      impact_metrics(*),
      team_members:user_profiles(*)
    `)
    .eq('id', orgId)
    .single();

  return data;
}

async function getSuccessfulProposals(orgId: string) {
  // Fetch past successful proposals for learning
  const { data } = await supabase
    .from('grants')
    .select('proposal_content, funder_name, amount_awarded')
    .eq('organization_id', orgId)
    .eq('status', 'awarded')
    .order('created_at', { ascending: false })
    .limit(5);

  return data;
}

function formatPastProposals(proposals: any[]): string {
  return proposals
    .map(
      (p, i) => `
EXAMPLE ${i + 1}:
Funder: ${p.funder_name}
Amount Awarded: $${p.amount_awarded.toLocaleString()}
Excerpt: ${p.proposal_content.substring(0, 500)}...
`
    )
    .join('\n---\n');
}

function calculateConfidence(content: string, opportunity: any): number {
  let score = 0.5; // Base confidence

  // Check for funder name mentions
  if (content.toLowerCase().includes(opportunity.funderName.toLowerCase())) {
    score += 0.1;
  }

  // Check for focus area coverage
  const focusCoverage = opportunity.focusAreas.filter((area: string) =>
    content.toLowerCase().includes(area.toLowerCase())
  ).length;
  score += (focusCoverage / opportunity.focusAreas.length) * 0.2;

  // Check for data/metrics
  const hasMetrics = /\d+%|\d+\s+(people|clients|participants|households)/.test(content);
  if (hasMetrics) score += 0.1;

  // Check length appropriateness
  const wordCount = content.split(/\s+/).length;
  if (wordCount >= 800 && wordCount <= 1200) score += 0.1;

  return Math.min(score, 1.0);
}

function generateSuggestions(content: string, opportunity: any): string[] {
  const suggestions: string[] = [];

  // Check for missing focus areas
  opportunity.focusAreas.forEach((area: string) => {
    if (!content.toLowerCase().includes(area.toLowerCase())) {
      suggestions.push(`Consider adding more content about: ${area}`);
    }
  });

  // Check for data points
  const metricMatches = content.match(/\d+%|\d+\s+(people|clients|participants)/g);
  if (!metricMatches || metricMatches.length < 3) {
    suggestions.push('Add more specific metrics and data points');
  }

  // Check for outcome language
  const hasOutcomes = /will|outcome|result|impact|achieve/.test(content.toLowerCase());
  if (!hasOutcomes) {
    suggestions.push('Strengthen outcome and impact language');
  }

  return suggestions;
}

function calculateCost(usage: { input_tokens: number; output_tokens: number }): number {
  const inputCost = (usage.input_tokens / 1000000) * 3.0; // $3/MTok
  const outputCost = (usage.output_tokens / 1000000) * 15.0; // $15/MTok
  return inputCost + outputCost;
}
```

---

## 💰 Cost Optimization Strategies

### 1. Prompt Caching

**Strategy:** Cache static context (organization profile, guidelines) that doesn't change between requests.

**Implementation:**
```typescript
const systemPrompt = [
  {
    type: 'text',
    text: 'You are an expert grant writer...',
    cache_control: { type: 'ephemeral' }, // Cache for 5 minutes
  },
  {
    type: 'text',
    text: `Organization Context: ${JSON.stringify(orgProfile)}`,
    cache_control: { type: 'ephemeral' }, // Cache organization data
  },
];
```

**Savings:** 90% cost reduction on cached tokens ($3/MTok → $0.30/MTok)

### 2. Model Selection

**Strategy:** Use the right model for the task.

| Task | Model | Why |
|------|-------|-----|
| Simple content | Claude 3.5 Sonnet | Best cost/quality balance |
| Complex analysis | Claude 3 Opus | Worth the premium for accuracy |
| Development/testing | Ollama (local) | Free, good enough for testing |
| Embeddings | OpenAI Ada-002 | Cheapest, specialized |

### 3. Output Length Limits

**Strategy:** Set appropriate max_tokens based on use case.

```typescript
const maxTokensBySection = {
  needs_statement: 1500,      // ~1200 words
  project_description: 2000,  // ~1600 words
  evaluation_plan: 1000,      // ~800 words
  budget_narrative: 1000,     // ~800 words
  quick_help: 200,            // ~150 words
};
```

### 4. Batch Processing

**Strategy:** Process multiple requests in parallel with rate limiting.

```typescript
export async function batchGenerateContent(
  requests: AgentInput[],
  rateLimit: number = 5 // requests per second
): Promise<AgentResponse[]> {
  const results: AgentResponse[] = [];

  for (let i = 0; i < requests.length; i += rateLimit) {
    const batch = requests.slice(i, i + rateLimit);

    const batchResults = await Promise.all(
      batch.map(async (request, index) => {
        // Stagger requests to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, index * 200));
        return generateContent(request);
      })
    );

    results.push(...batchResults);
  }

  return results;
}
```

### 5. Response Streaming

**Strategy:** Stream responses for better UX and reduced perceived latency.

```typescript
export async function* streamGrantProposal(input: GrantWriterInput) {
  const stream = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4096,
    stream: true,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  });

  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      yield event.delta.text;
    }
  }
}

// Usage in API route
export async function POST(request: Request) {
  const input = await request.json();

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of streamGrantProposal(input)) {
        controller.enqueue(encoder.encode(chunk));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
```

---

## 🎯 Quality Assurance

### Validation Framework

```typescript
// packages/ai-functions/src/validation/quality-checker.ts

export interface QualityMetrics {
  completeness: number;    // 0-1: All required elements present
  relevance: number;       // 0-1: Alignment with requirements
  clarity: number;         // 0-1: Readability and structure
  accuracy: number;        // 0-1: Factual correctness
  overall: number;         // 0-1: Weighted average
}

export async function validateAgentOutput(
  output: string,
  requirements: {
    minWordCount?: number;
    maxWordCount?: number;
    requiredKeywords?: string[];
    prohibitedPhrases?: string[];
    requiredSections?: string[];
  }
): Promise<{ valid: boolean; metrics: QualityMetrics; issues: string[] }> {
  const issues: string[] = [];
  let completeness = 1.0;
  let relevance = 1.0;
  let clarity = 1.0;

  // Check word count
  const wordCount = output.split(/\s+/).length;
  if (requirements.minWordCount && wordCount < requirements.minWordCount) {
    issues.push(`Output too short: ${wordCount} words (min: ${requirements.minWordCount})`);
    completeness -= 0.3;
  }
  if (requirements.maxWordCount && wordCount > requirements.maxWordCount) {
    issues.push(`Output too long: ${wordCount} words (max: ${requirements.maxWordCount})`);
    clarity -= 0.2;
  }

  // Check required keywords
  if (requirements.requiredKeywords) {
    const missing = requirements.requiredKeywords.filter(
      keyword => !output.toLowerCase().includes(keyword.toLowerCase())
    );
    if (missing.length > 0) {
      issues.push(`Missing required keywords: ${missing.join(', ')}`);
      relevance -= (missing.length / requirements.requiredKeywords.length) * 0.5;
    }
  }

  // Check prohibited phrases
  if (requirements.prohibitedPhrases) {
    const found = requirements.prohibitedPhrases.filter(phrase =>
      output.toLowerCase().includes(phrase.toLowerCase())
    );
    if (found.length > 0) {
      issues.push(`Contains prohibited phrases: ${found.join(', ')}`);
      clarity -= 0.3;
    }
  }

  // Check required sections
  if (requirements.requiredSections) {
    const missingSections = requirements.requiredSections.filter(
      section => !output.toLowerCase().includes(section.toLowerCase())
    );
    if (missingSections.length > 0) {
      issues.push(`Missing required sections: ${missingSections.join(', ')}`);
      completeness -= (missingSections.length / requirements.requiredSections.length) * 0.4;
    }
  }

  // Calculate overall score
  const overall = (completeness + relevance + clarity) / 3;

  return {
    valid: issues.length === 0 && overall >= 0.7,
    metrics: {
      completeness: Math.max(0, completeness),
      relevance: Math.max(0, relevance),
      clarity: Math.max(0, clarity),
      accuracy: 0.9, // Assume high accuracy for Claude
      overall: Math.max(0, overall),
    },
    issues,
  };
}
```

### Human-in-the-Loop Pattern

```typescript
export async function generateWithReview(
  input: AgentInput,
  autoApproveThreshold: number = 0.9
): Promise<{ content: string; status: 'auto_approved' | 'needs_review' | 'rejected' }> {
  // Generate content
  const result = await generateContent(input);

  // Validate quality
  const validation = await validateAgentOutput(result.content, {
    minWordCount: 800,
    requiredKeywords: input.requiredKeywords,
  });

  // Auto-approve high-quality content
  if (validation.metrics.overall >= autoApproveThreshold) {
    return {
      content: result.content,
      status: 'auto_approved',
    };
  }

  // Reject very low quality
  if (validation.metrics.overall < 0.5) {
    return {
      content: result.content,
      status: 'rejected',
    };
  }

  // Flag for human review
  return {
    content: result.content,
    status: 'needs_review',
  };
}
```

---

## 📊 Cost Tracking & Analytics

### Cost Tracker Implementation

```typescript
// packages/ai-functions/src/tracking/cost-tracker.ts

export interface AICostRecord {
  organization_id: string;
  agent_name: string;
  model: string;
  input_tokens: number;
  output_tokens: number;
  cost: number;
  operation: string;
  metadata?: Record<string, any>;
  created_at: Date;
}

export async function trackAICost(record: AICostRecord): Promise<void> {
  const supabase = createClient();

  await supabase.from('ai_usage_logs').insert({
    organization_id: record.organization_id,
    agent_name: record.agent_name,
    model: record.model,
    input_tokens: record.input_tokens,
    output_tokens: record.output_tokens,
    cost: record.cost,
    operation: record.operation,
    metadata: record.metadata || {},
    created_at: record.created_at || new Date(),
  });
}

export async function getOrganizationAICosts(
  orgId: string,
  period: 'day' | 'week' | 'month' | 'year' = 'month'
): Promise<{
  totalCost: number;
  totalTokens: number;
  byAgent: Record<string, number>;
  byModel: Record<string, number>;
  trend: Array<{ date: string; cost: number }>;
}> {
  const supabase = createClient();

  const startDate = getStartDate(period);

  const { data: logs } = await supabase
    .from('ai_usage_logs')
    .select('*')
    .eq('organization_id', orgId)
    .gte('created_at', startDate.toISOString());

  // Aggregate costs
  const totalCost = logs?.reduce((sum, log) => sum + log.cost, 0) || 0;
  const totalTokens =
    logs?.reduce((sum, log) => sum + log.input_tokens + log.output_tokens, 0) || 0;

  const byAgent = logs?.reduce((acc, log) => {
    acc[log.agent_name] = (acc[log.agent_name] || 0) + log.cost;
    return acc;
  }, {} as Record<string, number>) || {};

  const byModel = logs?.reduce((acc, log) => {
    acc[log.model] = (acc[log.model] || 0) + log.cost;
    return acc;
  }, {} as Record<string, number>) || {};

  // Calculate trend
  const trend = calculateTrend(logs || [], period);

  return { totalCost, totalTokens, byAgent, byModel, trend };
}

function getStartDate(period: 'day' | 'week' | 'month' | 'year'): Date {
  const now = new Date();
  switch (period) {
    case 'day':
      return new Date(now.setDate(now.getDate() - 1));
    case 'week':
      return new Date(now.setDate(now.getDate() - 7));
    case 'month':
      return new Date(now.setMonth(now.getMonth() - 1));
    case 'year':
      return new Date(now.setFullYear(now.getFullYear() - 1));
  }
}

function calculateTrend(
  logs: any[],
  period: 'day' | 'week' | 'month' | 'year'
): Array<{ date: string; cost: number }> {
  const grouped = logs.reduce((acc, log) => {
    const date = new Date(log.created_at).toISOString().split('T')[0];
    acc[date] = (acc[date] || 0) + log.cost;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(grouped)
    .map(([date, cost]) => ({ date, cost }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
```

---

## 🧪 Testing AI Agents

### Unit Testing

```typescript
// packages/ai-functions/src/agents/grant-writer/grant-writer.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateGrantProposal } from './index';

describe('Grant Writer Agent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('generates grant proposal content', async () => {
    const input = {
      organizationId: 'org-123',
      grantOpportunity: {
        title: 'Community Development Grant',
        funderName: 'Local Foundation',
        amount: 50000,
        deadline: '2025-12-31',
        requirements: 'Support underserved communities',
        focusAreas: ['education', 'youth development'],
      },
      section: 'needs_statement' as const,
    };

    const result = await generateGrantProposal(input);

    expect(result.success).toBe(true);
    expect(result.data?.content).toBeDefined();
    expect(result.data?.content.length).toBeGreaterThan(500);
    expect(result.data?.confidence).toBeGreaterThan(0.5);
    expect(result.data?.wordCount).toBeGreaterThan(100);
  });

  it('includes required focus areas', async () => {
    const input = {
      organizationId: 'org-123',
      grantOpportunity: {
        title: 'Test Grant',
        funderName: 'Test Funder',
        amount: 25000,
        deadline: '2025-12-31',
        requirements: 'Test requirements',
        focusAreas: ['education', 'health'],
      },
      section: 'project_description' as const,
    };

    const result = await generateGrantProposal(input);

    expect(result.data?.content.toLowerCase()).toContain('education');
    expect(result.data?.content.toLowerCase()).toContain('health');
  });

  it('tracks AI costs', async () => {
    const trackCostSpy = vi.spyOn(costTracker, 'trackAICost');

    await generateGrantProposal({
      organizationId: 'org-123',
      grantOpportunity: mockGrantOpportunity,
      section: 'needs_statement',
    });

    expect(trackCostSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        organization_id: 'org-123',
        agent_name: 'grant-writer-pro',
        model: 'claude-3-5-sonnet-20241022',
      })
    );
  });

  it('handles API errors gracefully', async () => {
    // Mock API failure
    vi.mocked(anthropic.messages.create).mockRejectedValueOnce(
      new Error('API rate limit exceeded')
    );

    const result = await generateGrantProposal({
      organizationId: 'org-123',
      grantOpportunity: mockGrantOpportunity,
      section: 'needs_statement',
    });

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.error?.code).toBe('GRANT_WRITER_ERROR');
  });
});
```

---

## 📚 Additional Resources

- [Claude API Documentation](https://docs.anthropic.com/)
- [Prompt Engineering Guide](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering)
- [Claude Prompt Caching](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching)
- [OpenAI Embeddings Guide](https://platform.openai.com/docs/guides/embeddings)

---

**Remember:** AI agents are powerful tools, but they require careful prompt engineering, quality validation, and cost monitoring to be effective in production.
