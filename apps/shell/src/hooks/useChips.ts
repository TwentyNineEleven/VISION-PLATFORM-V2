'use client';

import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/supabase';
import type { Chip } from '@/components/community-compass/ChipSelector';
import { toast } from '@/lib/toast';

type StatementChip = Database['public']['Tables']['statement_chips']['Row'];

export type ChipCategory =
  | 'experiences'
  | 'barriers'
  | 'urgency'
  | 'strengths'
  | 'aspirations'
  | 'pain'
  | 'pain_points'
  | 'feelings'
  | 'influences'
  | 'intentions';

export interface ChipWithCategory extends Chip {
  category: ChipCategory;
}

const mapChip = (chip: StatementChip): ChipWithCategory => ({
  id: chip.id,
  text: chip.text,
  isSelected: chip.is_selected,
  isAiGenerated: chip.is_ai_generated,
  isCustom: chip.is_custom ?? false,
  isEdited: chip.is_edited ?? false,
  category: chip.question_category as ChipCategory,
});

export function useChips(assessmentId?: string) {
  return useQuery({
    queryKey: ['chips', assessmentId],
    enabled: Boolean(assessmentId),
    queryFn: async () => {
      if (!assessmentId) {
        throw new Error('Assessment ID is required');
      }
      const supabase = createClient();
      const { data, error } = await supabase
        .from('statement_chips')
        .select('*')
        .eq('assessment_id', assessmentId)
        .order('created_at', { ascending: true });

      if (error) {
        throw error;
      }

      return (data || []).map(mapChip);
    },
  });
}

export function useToggleChipSelection(assessmentId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { chipId: string; nextSelected: boolean }) => {
      const supabase = createClient();
      const { error, data } = await supabase
        .from('statement_chips')
        .update({ is_selected: input.nextSelected })
        .eq('id', input.chipId)
        .select()
        .single();

      if (error) throw error;
      return mapChip(data);
    },
    onMutate: async ({ chipId, nextSelected }) => {
      await queryClient.cancelQueries({ queryKey: ['chips', assessmentId] });
      const previous = queryClient.getQueryData<ChipWithCategory[]>(['chips', assessmentId]);

      queryClient.setQueryData<ChipWithCategory[]>(['chips', assessmentId], (current = []) =>
        current.map(chip => (chip.id === chipId ? { ...chip, isSelected: nextSelected } : chip))
      );

      return { previous };
    },
    onError: (error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['chips', assessmentId], context.previous);
      }
      toast.error('Unable to update chip', error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chips', assessmentId] });
    },
  });
}

export function useCreateChips(assessmentId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (chips: Array<Omit<StatementChip, 'id' | 'created_at'>>) => {
      if (!assessmentId) throw new Error('Missing assessment id');
      const supabase = createClient();
      const payload = chips.map(chip => ({
        ...chip,
        assessment_id: assessmentId,
      }));

      const { data, error } = await supabase
        .from('statement_chips')
        .insert(payload)
        .select();

      if (error) throw error;
      return (data || []).map(mapChip);
    },
    onMutate: async (newChips) => {
      await queryClient.cancelQueries({ queryKey: ['chips', assessmentId] });
      const previous = queryClient.getQueryData<ChipWithCategory[]>(['chips', assessmentId]);
      const optimistic = (newChips || []).map(chip => ({
        id: crypto.randomUUID(),
        text: chip.text,
        isSelected: chip.is_selected ?? false,
        isAiGenerated: chip.is_ai_generated ?? true,
        isCustom: chip.is_custom ?? false,
        isEdited: chip.is_edited ?? false,
        category: chip.question_category as ChipCategory,
      }));

      queryClient.setQueryData<ChipWithCategory[]>(['chips', assessmentId], (current = []) => [
        ...current,
        ...optimistic,
      ]);

      return { previous };
    },
    onError: (error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['chips', assessmentId], context.previous);
      }
      toast.error('Unable to add chips', error.message);
    },
    onSuccess: (created) => {
      queryClient.setQueryData<ChipWithCategory[]>(['chips', assessmentId], (current = []) => {
        const optimisticIds = new Set(created.map(chip => chip.id));
        const filtered = current.filter(chip => !optimisticIds.has(chip.id));
        return [...filtered, ...created];
      });
      queryClient.invalidateQueries({ queryKey: ['chips', assessmentId] });
    },
  });
}

export function useUpdateChipText(assessmentId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { chipId: string; text: string }) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('statement_chips')
        .update({ text: input.text, is_edited: true })
        .eq('id', input.chipId)
        .select()
        .single();

      if (error) throw error;
      return mapChip(data);
    },
    onMutate: async ({ chipId, text }) => {
      await queryClient.cancelQueries({ queryKey: ['chips', assessmentId] });
      const previous = queryClient.getQueryData<ChipWithCategory[]>(['chips', assessmentId]);
      queryClient.setQueryData<ChipWithCategory[]>(['chips', assessmentId], (current = []) =>
        current.map(chip => (chip.id === chipId ? { ...chip, text, isEdited: true } : chip))
      );
      return { previous };
    },
    onError: (error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['chips', assessmentId], context.previous);
      }
      toast.error('Unable to edit chip', error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chips', assessmentId] });
    },
  });
}

export function useDeleteChip(assessmentId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (chipId: string) => {
      const supabase = createClient();
      const { error } = await supabase.from('statement_chips').delete().eq('id', chipId);
      if (error) throw error;
      return chipId;
    },
    onMutate: async (chipId: string) => {
      await queryClient.cancelQueries({ queryKey: ['chips', assessmentId] });
      const previous = queryClient.getQueryData<ChipWithCategory[]>(['chips', assessmentId]);
      queryClient.setQueryData<ChipWithCategory[]>(['chips', assessmentId], (current = []) =>
        current.filter(chip => chip.id !== chipId)
      );
      return { previous };
    },
    onError: (error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['chips', assessmentId], context.previous);
      }
      toast.error('Unable to delete chip', error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chips', assessmentId] });
    },
  });
}
