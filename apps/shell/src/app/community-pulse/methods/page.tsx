/**
 * CommunityPulse - Methods Library
 * Browse all 15 engagement methods
 */

'use client';

import { useEffect, useState } from 'react';
import { communityPulseService } from '@/services/communityPulseService';
import { GlowCard } from '@/components/glow-ui/GlowCard';
import { GlowInput } from '@/components/glow-ui/GlowInput';
import type { EngagementMethod, MethodCategory } from '@/types/community-pulse';
import { Search, Users, Clock, DollarSign, AlertCircle } from 'lucide-react';

const CATEGORY_LABELS: Record<MethodCategory, string> = {
  discussion: 'Discussion',
  survey: 'Survey',
  workshop: 'Workshop',
  creative: 'Creative',
  observation: 'Observation',
  digital: 'Digital',
};

const CATEGORY_COLORS: Record<MethodCategory, string> = {
  discussion: 'bg-vision-blue-100 text-vision-blue-950',
  survey: 'bg-vision-green-100 text-vision-green-700',
  workshop: 'bg-vision-orange-100 text-vision-orange-700',
  creative: 'bg-vision-purple-100 text-vision-purple-700',
  observation: 'bg-gray-100 text-gray-700',
  digital: 'bg-cyan-100 text-cyan-700',
};

export default function MethodsLibraryPage() {
  const [loading, setLoading] = useState(true);
  const [methods, setMethods] = useState<EngagementMethod[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MethodCategory | 'all'>('all');

  useEffect(() => {
    async function loadMethods() {
      try {
        const data = await communityPulseService.getMethods();
        setMethods(data);
      } catch (err) {
        console.error('Error loading methods:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMethods();
  }, []);

  const filteredMethods = methods.filter((method) => {
    const matchesSearch =
      search === '' ||
      method.name.toLowerCase().includes(search.toLowerCase()) ||
      method.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || method.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(methods.map((m) => m.category))] as (MethodCategory | 'all')[];

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-vision-blue-950"></div>
          <p className="text-muted-foreground">Loading methods...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Engagement Methods Library
        </h1>
        <p className="mt-1 text-muted-foreground">
          Browse 15 research-based community engagement methods
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <GlowInput
            type="text"
            placeholder="Search methods..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-vision-blue-950 text-white'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {cat === 'all' ? 'All' : CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Methods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMethods.map((method) => (
          <GlowCard key={method.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-foreground">{method.name}</h3>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  CATEGORY_COLORS[method.category]
                }`}
              >
                {CATEGORY_LABELS[method.category]}
              </span>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              {method.description}
            </p>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>
                  {method.groupSizeMin}-{method.groupSizeMax} participants
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>
                  {method.durationMin}-{method.durationMax} min
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span>
                  ${method.costEstimateLow.toLocaleString()}-$
                  {method.costEstimateHigh.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs font-medium text-foreground mb-2">
                Best for:
              </p>
              <p className="text-xs text-muted-foreground">{method.bestFor}</p>
            </div>

            {method.equityConsiderations.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-1 mb-2">
                  <AlertCircle className="h-3 w-3 text-vision-orange-700" />
                  <p className="text-xs font-medium text-foreground">
                    Equity Considerations:
                  </p>
                </div>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {method.equityConsiderations.slice(0, 2).map((note, i) => (
                    <li key={i}>• {note}</li>
                  ))}
                </ul>
              </div>
            )}
          </GlowCard>
        ))}
      </div>

      {filteredMethods.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No methods match your search</p>
        </div>
      )}
    </div>
  );
}
