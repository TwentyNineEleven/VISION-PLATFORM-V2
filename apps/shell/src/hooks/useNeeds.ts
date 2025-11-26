'use client';

import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/supabase';
import type { Need } from '@/components/community-compass/NeedCard';
import { toast } from '@/lib/toast';

type NeedRow = Database['public']['Tables']['community_needs']['Row'];

const mapNeed = (row: NeedRow): Need => ({
  id: row.id,
  title: row.title,
  description: row.description ?? undefined,
  category: row.category,
  urgencyLevel: row.urgency_level as Need['urgencyLevel'],
  impactLevel: row.impact_level as Need['impactLevel'],
  evidenceLevel: row.evidence_level as Need['evidenceLevel'],
  isAiSuggested: row.is_ai_suggested,
});

export function useNeeds(assessmentId?: string) {
  return useQuery({
    queryKey: ['needs', assessmentId],
    enabled: Boolean(assessmentId),
    queryFn: async () => {
      if (!assessmentId) {
        throw new Error('Assessment ID is required');
      }
      const supabase = createClient();
      const { data, error } = await supabase
        .from('community_needs')
        .select('*')
        .eq('assessment_id', assessmentId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return (data || []).map(mapNeed);
    },
  });
}

export function useCreateNeed(assessmentId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Omit<Need, 'id'>) => {
      if (!assessmentId) throw new Error('Missing assessment id');
      const supabase = createClient();
      const { data, error } = await supabase
        .from('community_needs')
        .insert({
          assessment_id: assessmentId,
          title: payload.title,
          description: payload.description,
          category: payload.category,
          urgency_level: payload.urgencyLevel,
          impact_level: payload.impactLevel,
          evidence_level: payload.evidenceLevel,
          is_ai_suggested: payload.isAiSuggested ?? false,
        })
        .select()
        .single();

      if (error) throw error;
      return mapNeed(data);
    },
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ['needs', assessmentId] });
      const previous = queryClient.getQueryData<Need[]>(['needs', assessmentId]);
      const optimistic: Need = {
        ...payload,
        id: crypto.randomUUID(),
      };
      queryClient.setQueryData<Need[]>(['needs', assessmentId], (current = []) => [...current, optimistic]);
      return { previous };
    },
    onError: (error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['needs', assessmentId], context.previous);
      }
      toast.error('Unable to add need', error.message);
    },
    onSuccess: (created) => {
      queryClient.setQueryData<Need[]>(['needs', assessmentId], (current = []) => {
        const filtered = current.filter(n => n.id !== created.id);
        return [...filtered, created];
      });
      queryClient.invalidateQueries({ queryKey: ['needs', assessmentId] });
    },
  });
}

export function useUpdateNeed(assessmentId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Need) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('community_needs')
        .update({
          title: payload.title,
          description: payload.description,
          category: payload.category,
          urgency_level: payload.urgencyLevel,
          impact_level: payload.impactLevel,
          evidence_level: payload.evidenceLevel,
          is_ai_suggested: payload.isAiSuggested ?? false,
        })
        .eq('id', payload.id)
        .select()
        .single();

      if (error) throw error;
      return mapNeed(data);
    },
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ['needs', assessmentId] });
      const previous = queryClient.getQueryData<Need[]>(['needs', assessmentId]);
      queryClient.setQueryData<Need[]>(['needs', assessmentId], (current = []) =>
        current.map(need => (need.id === payload.id ? payload : need))
      );
      return { previous };
    },
    onError: (error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['needs', assessmentId], context.previous);
      }
      toast.error('Unable to update need', error.message);
    },
    onSuccess: (updated) => {
      queryClient.setQueryData<Need[]>(['needs', assessmentId], (current = []) =>
        current.map(need => (need.id === updated.id ? updated : need))
      );
      queryClient.invalidateQueries({ queryKey: ['needs', assessmentId] });
    },
  });
}

export function useDeleteNeed(assessmentId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient();
      const { error } = await supabase.from('community_needs').delete().eq('id', id);
      if (error) throw error;
      return id;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['needs', assessmentId] });
      const previous = queryClient.getQueryData<Need[]>(['needs', assessmentId]);
      queryClient.setQueryData<Need[]>(['needs', assessmentId], (current = []) =>
        current.filter(need => need.id !== id)
      );
      return { previous };
    },
    onError: (error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['needs', assessmentId], context.previous);
      }
      toast.error('Unable to delete need', error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['needs', assessmentId] });
    },
  });
}
