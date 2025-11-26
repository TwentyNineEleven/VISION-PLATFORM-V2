/**
 * CommunityPulse - Templates Library
 * Browse and use engagement strategy templates
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { useOrganization } from '@/contexts/OrganizationContext';
import { communityPulseService } from '@/services/communityPulseService';
import { GlowButton } from '@/components/glow-ui/GlowButton';
import { GlowCard } from '@/components/glow-ui/GlowCard';
import { GlowInput } from '@/components/glow-ui/GlowInput';
import type { EngagementTemplate, EngagementMethod } from '@/types/community-pulse';
import {
  Search,
  FileText,
  Users,
  Globe,
  Building,
  Copy,
  Star,
  ArrowRight,
} from 'lucide-react';
import { toast } from 'sonner';

// Built-in templates
const BUILT_IN_TEMPLATES: Partial<EngagementTemplate>[] = [
  {
    id: 'youth-voice',
    name: 'Youth Voice in Program Design',
    description:
      'Engage young people to co-design programs that serve them. Uses focus groups with youth-friendly facilitation.',
    methodSlug: 'focus_groups',
    isPublic: true,
    useCount: 156,
  },
  {
    id: 'needs-assessment',
    name: 'Community Needs Assessment',
    description:
      'Comprehensive approach to understanding community needs using surveys and listening sessions.',
    methodSlug: 'listening_sessions',
    isPublic: true,
    useCount: 243,
  },
  {
    id: 'advisory-board',
    name: 'Community Advisory Board Launch',
    description:
      'Recruit and onboard community members to serve on an advisory board.',
    methodSlug: 'community_forums',
    isPublic: true,
    useCount: 89,
  },
  {
    id: 'service-feedback',
    name: 'Service Improvement Feedback',
    description:
      'Gather feedback from service recipients to improve program delivery.',
    methodSlug: 'interviews',
    isPublic: true,
    useCount: 312,
  },
  {
    id: 'strategic-visioning',
    name: 'Strategic Planning Community Input',
    description:
      'Engage community in organizational strategic planning process.',
    methodSlug: 'visioning',
    isPublic: true,
    useCount: 67,
  },
  {
    id: 'multilingual-engagement',
    name: 'Multilingual Community Engagement',
    description:
      'Template designed for engaging diverse, multilingual communities with interpretation built in.',
    methodSlug: 'world_cafe',
    isPublic: true,
    useCount: 124,
  },
];

export default function TemplatesPage() {
  const router = useRouter();
  const { user } = useUser();
  const { activeOrganization } = useOrganization();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [templates, setTemplates] = useState<EngagementTemplate[]>([]);
  const [methods, setMethods] = useState<EngagementMethod[]>([]);
  const [filter, setFilter] = useState<'all' | 'public' | 'organization'>('all');

  useEffect(() => {
    async function loadData() {
      try {
        const [templatesData, methodsData] = await Promise.all([
          activeOrganization?.id
            ? communityPulseService.getTemplates(activeOrganization.id)
            : Promise.resolve([]),
          communityPulseService.getMethods(),
        ]);
        setTemplates(templatesData);
        setMethods(methodsData);
      } catch (err) {
        console.error('Error loading templates:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [activeOrganization?.id]);

  const getMethodName = (slug?: string) => {
    if (!slug) return 'Multiple Methods';
    const method = methods.find((m) => m.slug === slug);
    return method?.name || slug;
  };

  const handleUseTemplate = async (template: Partial<EngagementTemplate>) => {
    if (!activeOrganization?.id || !user?.id) {
      toast.error('Please select an organization');
      return;
    }

    try {
      // Create engagement from template
      const engagement = await communityPulseService.createEngagement(
        activeOrganization.id,
        user.id,
        `${template.name} - Copy`
      );

      // Apply template data if available
      if (template.templateData) {
        await communityPulseService.updateEngagement(engagement.id, {
          ...template.templateData,
          primaryMethod: template.methodSlug,
        });
      } else if (template.methodSlug) {
        await communityPulseService.updateEngagement(engagement.id, {
          primaryMethod: template.methodSlug,
        });
      }

      toast.success('Template applied! Redirecting to your new strategy...');
      router.push(`/community-pulse/${engagement.id}`);
    } catch (err) {
      console.error('Error using template:', err);
      toast.error('Failed to create strategy from template');
    }
  };

  // Combine built-in and custom templates
  const allTemplates = [
    ...BUILT_IN_TEMPLATES.map((t) => ({
      ...t,
      templateData: {},
      createdAt: '',
    })) as EngagementTemplate[],
    ...templates,
  ];

  const filteredTemplates = allTemplates.filter((template) => {
    const matchesSearch =
      search === '' ||
      template.name.toLowerCase().includes(search.toLowerCase()) ||
      template.description?.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === 'all' ||
      (filter === 'public' && template.isPublic) ||
      (filter === 'organization' && !template.isPublic);

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-vision-blue-950"></div>
          <p className="text-muted-foreground">Loading templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Strategy Templates
        </h1>
        <p className="mt-1 text-muted-foreground">
          Start with a proven template and customize for your community
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <GlowInput
            type="text"
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-vision-blue-950 text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('public')}
            className={`flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              filter === 'public'
                ? 'bg-vision-blue-950 text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <Globe className="h-3 w-3" />
            Public
          </button>
          <button
            onClick={() => setFilter('organization')}
            className={`flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              filter === 'organization'
                ? 'bg-vision-blue-950 text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <Building className="h-3 w-3" />
            My Organization
          </button>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <GlowCard
            key={template.id}
            className="p-6 hover:shadow-lg transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-vision-blue-100 text-vision-blue-950">
                  <FileText className="h-5 w-5" />
                </div>
              </div>
              <div className="flex items-center gap-1">
                {template.isPublic ? (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Globe className="h-3 w-3" />
                    Public
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Building className="h-3 w-3" />
                    Private
                  </span>
                )}
              </div>
            </div>

            <h3 className="font-semibold text-foreground mb-2">
              {template.name}
            </h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {template.description}
            </p>

            <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {getMethodName(template.methodSlug)}
              </span>
              {template.useCount && template.useCount > 0 && (
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  Used {template.useCount} times
                </span>
              )}
            </div>

            <GlowButton
              variant="outline"
              className="w-full group-hover:bg-vision-blue-950 group-hover:text-white group-hover:border-vision-blue-950 transition-colors"
              onClick={() => handleUseTemplate(template)}
            >
              <Copy className="h-4 w-4" />
              Use This Template
              <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </GlowButton>
          </GlowCard>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-sm font-semibold text-foreground">
            No templates found
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Try adjusting your search or filter
          </p>
        </div>
      )}

      {/* Create Template CTA */}
      <GlowCard className="p-6 bg-gradient-to-br from-vision-purple-50 to-vision-blue-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground">
              Create Your Own Template
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Save your successful strategies as templates for future use
            </p>
          </div>
          <GlowButton variant="default" onClick={() => router.push('/community-pulse/new')}>
            Create Strategy
            <ArrowRight className="h-4 w-4" />
          </GlowButton>
        </div>
      </GlowCard>
    </div>
  );
}
