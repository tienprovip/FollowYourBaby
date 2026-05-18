// ---------------------------------------------------------------------------
// useGrowthLogs — TanStack Query hook for baby growth measurements.
// ---------------------------------------------------------------------------

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import { useBabyStore } from '@/stores/babyStore';
import { estimatePercentile } from '@/lib/standards/whoGrowthStandards';
import type { Database } from '@/types/database';
import type { Sex } from '@/lib/standards/whoGrowthStandards';

type GrowthLog = Database['public']['Tables']['growth_logs']['Row'];
type GrowthLogInsert = Database['public']['Tables']['growth_logs']['Insert'];

const GROWTH_KEY = 'growth_logs';

const MS_PER_MONTH = 1000 * 60 * 60 * 24 * 30.4375;

export interface GrowthLogWithPercentile extends GrowthLog {
  weightPercentile?: string;
  lengthPercentile?: string;
  headPercentile?: string;
}

/** Age in decimal months at the time a given log was recorded. */
function ageAtLog(babyDob: string, logRecordedAt: string): number {
  const dob = new Date(babyDob).getTime();
  const logTime = new Date(logRecordedAt).getTime();
  const months = (logTime - dob) / MS_PER_MONTH;
  return Math.max(0, Math.min(24, months));
}

export function useGrowthLogs(babySex?: string | null, babyDob?: string | null) {
  const userId = useAuthStore((s) => s.user?.id);
  const { activeBabyId } = useBabyStore();
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: [GROWTH_KEY, activeBabyId],
    enabled: Boolean(activeBabyId) && Boolean(userId),
    queryFn: async () => {
      const babyId = activeBabyId as string;
      const { data, error } = await supabase
        .from('growth_logs')
        .select('*')
        .eq('baby_id', babyId)
        .order('recorded_at', { ascending: true });
      if (error) throw error;
      return data as GrowthLog[];
    },
  });

  const addMutation = useMutation({
    mutationFn: async (
      input: Omit<GrowthLogInsert, 'owner_id' | 'baby_id'>,
    ) => {
      const { data, error } = await supabase
        .from('growth_logs')
        .insert({ ...input, owner_id: userId!, baby_id: activeBabyId! })
        .select()
        .single();
      if (error) throw error;
      return data as GrowthLog;
    },
    onSuccess: (newLog) => {
      queryClient.setQueryData<GrowthLog[]>(
        [GROWTH_KEY, activeBabyId],
        (prev) =>
          prev
            ? [...prev, newLog].sort((a, b) =>
                a.recorded_at.localeCompare(b.recorded_at),
              )
            : [newLog],
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('growth_logs')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData<GrowthLog[]>(
        [GROWTH_KEY, activeBabyId],
        (prev) => (prev ? prev.filter((l) => l.id !== deletedId) : []),
      );
    },
  });

  const rawLogs = listQuery.data ?? [];
  const sex: Sex = babySex === 'female' ? 'female' : 'male';

  const logs: GrowthLogWithPercentile[] = rawLogs.map((log) => {
    const ageMonths = babyDob ? ageAtLog(babyDob, log.recorded_at) : 0;

    const weightPercentile =
      log.weight_g === null
        ? undefined
        : estimatePercentile('weight', sex, ageMonths, log.weight_g / 1000);

    const lengthPercentile =
      log.length_cm === null
        ? undefined
        : estimatePercentile('length', sex, ageMonths, log.length_cm);

    const headPercentile =
      log.head_cm === null
        ? undefined
        : estimatePercentile('head', sex, ageMonths, log.head_cm);

    return { ...log, weightPercentile, lengthPercentile, headPercentile };
  });

  const latestLog = logs.at(-1) ?? null;

  return {
    logs,
    latestLog,
    isLoading: listQuery.isLoading,
    error: listQuery.error,
    addGrowthLog: addMutation.mutateAsync,
    isAdding: addMutation.isPending,
    deleteGrowthLog: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
