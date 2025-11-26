import { useMemo } from 'react';
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/supabase';
import { toast } from '@/lib/toast';

type CommunityAssessment = Database['public']['Tables']['community_assessments']['Row'];

export interface CreateAssessmentInput {
  title: string;
  targetPopulation: string;
  geographicArea: string;
}

export interface UpdateAssessmentInput {
  title?: string;
  targetPopulation?: string;
  geographicArea?: string;
  focusStatement?: string | null;
  status?: string;
  currentScreen?: number;
}

const buildAssessment = (row: CommunityAssessment) => ({
  ...row,
  focusStatement: row.focus_statement,
});

export function useAssessments() {
  const query = useQuery({
    queryKey: ['assessments'],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('community_assessments')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        throw error;
      }

      return (data || []).map(buildAssessment);
    },
  });

  return query;
}

export function useAssessment(assessmentId?: string) {
  const query = useQuery({
    queryKey: ['assessments', assessmentId],
    enabled: Boolean(assessmentId),
    queryFn: async () => {
      if (!assessmentId) {
        throw new Error('Assessment ID is required');
      }
      const supabase = createClient();
      const { data, error } = await supabase
        .from('community_assessments')
        .select('*')
        .eq('id', assessmentId)
        .single();

      if (error) {
        throw error;
      }

      return buildAssessment(data);
    },
  });

  return query;
}

export function useCreateAssessment(options?: {
  onSuccess?: (data: CommunityAssessment) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateAssessmentInput) => {
      const response = await fetch('/api/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: payload.title,
          targetPopulation: payload.targetPopulation,
          geographicArea: payload.geographicArea,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.error || 'Failed to create assessment');
      }

      const json = await response.json();
      return json.assessment as CommunityAssessment;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      toast.error('Unable to create assessment', error.message);
      options?.onError?.(error);
    },
  });
}

export function useUpdateAssessment(assessmentId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (changes: UpdateAssessmentInput) => {
      if (!assessmentId) throw new Error('Missing assessment id');
      const supabase = createClient();
      const { error, data } = await supabase
        .from('community_assessments')
        .update({
          title: changes.title,
          target_population: changes.targetPopulation,
          geographic_area: changes.geographicArea,
          focus_statement: changes.focusStatement,
          status: changes.status,
          current_screen: changes.currentScreen,
        })
        .eq('id', assessmentId)
        .select()
        .single();

      if (error) throw error;
      return buildAssessment(data);
    },
    onMutate: async (changes) => {
      await queryClient.cancelQueries({ queryKey: ['assessments', assessmentId] });
      const previous = queryClient.getQueryData(['assessments', assessmentId]);

      queryClient.setQueryData(['assessments', assessmentId], (current: any) => ({
        ...current,
        ...changes,
      }));

      return { previous };
    },
    onError: (error, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['assessments', assessmentId], context.previous);
      }
      toast.error('Unable to update assessment', error.message);
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(['assessments', assessmentId], updated);
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
    },
  });
}

export function useAssessmentTitle(assessment?: CommunityAssessment) {
  return useMemo(() => assessment?.title ?? 'Community Assessment', [assessment?.title]);
}
