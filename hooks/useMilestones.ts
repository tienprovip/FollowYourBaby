// ---------------------------------------------------------------------------
// useMilestones — achieved milestone records for the active baby.
// Provides derived sets: achievedKeys, expectedNow, overdue.
// ---------------------------------------------------------------------------

import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import { useBabyStore } from '@/stores/babyStore';
import { useMilestoneCatalog } from './useMilestoneCatalog';
import type { Database } from '@/types/database';
import type { MilestoneCategory } from '@/types/database';

export type MilestoneRow =
  Database['public']['Tables']['milestones']['Row'];

export interface MarkAchievedInput {
  key: string;
  category: MilestoneCategory;
  achieved_at: string; // ISO date string YYYY-MM-DD
  note?: string | null;
}

const MILESTONES_KEY = 'milestones';

export function useMilestones(babyAgeInMonths: number) {
  const userId = useAuthStore((s) => s.user?.id);
  const { activeBabyId } = useBabyStore();
  const queryClient = useQueryClient();
  const { catalog } = useMilestoneCatalog();

  // -----------------------------------------------------------------------
  // Fetch achieved milestones for this baby
  // -----------------------------------------------------------------------
  const listQuery = useQuery({
    queryKey: [MILESTONES_KEY, activeBabyId],
    enabled: Boolean(activeBabyId) && Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('milestones')
        .select('*')
        .eq('baby_id', activeBabyId!)
        .order('achieved_at', { ascending: false });
      if (error) throw error;
      return data as MilestoneRow[];
    },
    staleTime: 2 * 60 * 1000,
  });

  // -----------------------------------------------------------------------
  // Mark a milestone as achieved (upsert)
  // -----------------------------------------------------------------------
  const markMutation = useMutation({
    mutationFn: async (input: MarkAchievedInput) => {
      const { data, error } = await supabase
        .from('milestones')
        .upsert(
          {
            baby_id: activeBabyId!,
            owner_id: userId!,
            key: input.key,
            category: input.category,
            achieved_at: input.achieved_at,
            note: input.note ?? null,
          },
          { onConflict: 'baby_id,key' },
        )
        .select()
        .single();
      if (error) throw error;
      return data as MilestoneRow;
    },
    onSuccess: (upserted) => {
      queryClient.setQueryData<MilestoneRow[]>(
        [MILESTONES_KEY, activeBabyId],
        (prev) => {
          if (!prev) return [upserted];
          const without = prev.filter((m) => m.key !== upserted.key);
          return [upserted, ...without];
        },
      );
    },
  });

  // -----------------------------------------------------------------------
  // Unmark a milestone (delete the achieved record)
  // -----------------------------------------------------------------------
  const unmarkMutation = useMutation({
    mutationFn: async (key: string) => {
      const { error } = await supabase
        .from('milestones')
        .delete()
        .eq('baby_id', activeBabyId!)
        .eq('key', key);
      if (error) throw error;
      return key;
    },
    onSuccess: (deletedKey) => {
      queryClient.setQueryData<MilestoneRow[]>(
        [MILESTONES_KEY, activeBabyId],
        (prev) => (prev ? prev.filter((m) => m.key !== deletedKey) : []),
      );
    },
  });

  // -----------------------------------------------------------------------
  // Derived data
  // -----------------------------------------------------------------------
  const achieved = listQuery.data ?? [];

  const achievedKeys = useMemo(
    () => new Set(achieved.map((m) => m.key)),
    [achieved],
  );

  const achievedMap = useMemo(() => {
    const map = new Map<string, MilestoneRow>();
    for (const m of achieved) map.set(m.key, m);
    return map;
  }, [achieved]);

  // Milestones expected for the baby's current age (range overlaps)
  const expectedNow = useMemo(
    () =>
      catalog.filter(
        (c) =>
          c.age_min_months <= babyAgeInMonths &&
          babyAgeInMonths <= c.age_max_months &&
          !achievedKeys.has(c.key),
      ),
    [catalog, babyAgeInMonths, achievedKeys],
  );

  // Overdue: baby is past the max age and hasn't achieved
  const overdue = useMemo(
    () =>
      catalog.filter(
        (c) =>
          babyAgeInMonths > c.age_max_months && !achievedKeys.has(c.key),
      ),
    [catalog, babyAgeInMonths, achievedKeys],
  );

  // Recently achieved (last 30 days)
  const recentlyAchieved = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    return achieved.filter(
      (m) => m.achieved_at && new Date(m.achieved_at) >= cutoff,
    );
  }, [achieved]);

  return {
    achieved,
    achievedKeys,
    achievedMap,
    expectedNow,
    overdue,
    recentlyAchieved,
    totalAchieved: achieved.length,
    isLoading: listQuery.isLoading,
    error: listQuery.error,
    markAchieved: markMutation.mutateAsync,
    isMarking: markMutation.isPending,
    unmarkAchieved: unmarkMutation.mutateAsync,
    isUnmarking: unmarkMutation.isPending,
  };
}
