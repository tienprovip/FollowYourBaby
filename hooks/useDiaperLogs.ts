// ---------------------------------------------------------------------------
// useDiaperLogs — TanStack Query hook for baby diaper logs.
// ---------------------------------------------------------------------------

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import { useBabyStore } from '@/stores/babyStore';
import { subDays, startOfDay } from 'date-fns';
import type { Database } from '@/types/database';

type DiaperLog = Database['public']['Tables']['diaper_logs']['Row'];
type DiaperLogInsert = Database['public']['Tables']['diaper_logs']['Insert'];

const DIAPER_KEY = 'diaper_logs';

export function useDiaperLogs() {
  const userId = useAuthStore((s) => s.user?.id);
  const { activeBabyId } = useBabyStore();
  const queryClient = useQueryClient();

  const since = startOfDay(subDays(new Date(), 6)).toISOString();

  const listQuery = useQuery({
    queryKey: [DIAPER_KEY, activeBabyId, 'last7'],
    enabled: Boolean(activeBabyId) && Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('diaper_logs')
        .select('*')
        .eq('baby_id', activeBabyId!)
        .gte('recorded_at', since)
        .order('recorded_at', { ascending: false });
      if (error) throw error;
      return data as DiaperLog[];
    },
  });

  const addMutation = useMutation({
    mutationFn: async (
      input: Omit<DiaperLogInsert, 'owner_id' | 'baby_id'>,
    ) => {
      const { data, error } = await supabase
        .from('diaper_logs')
        .insert({ ...input, owner_id: userId!, baby_id: activeBabyId! })
        .select()
        .single();
      if (error) throw error;
      return data as DiaperLog;
    },
    onSuccess: (newLog) => {
      queryClient.setQueryData<DiaperLog[]>(
        [DIAPER_KEY, activeBabyId, 'last7'],
        (prev) => (prev ? [newLog, ...prev] : [newLog]),
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('diaper_logs')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData<DiaperLog[]>(
        [DIAPER_KEY, activeBabyId, 'last7'],
        (prev) => (prev ? prev.filter((l) => l.id !== deletedId) : []),
      );
    },
  });

  const logs = listQuery.data ?? [];

  // Today's count by kind
  const todayStart = startOfDay(new Date()).toISOString();
  const todayLogs = logs.filter((l) => l.recorded_at >= todayStart);
  const todayWet = todayLogs.filter(
    (l) => l.kind === 'wet' || l.kind === 'both',
  ).length;
  const todayDirty = todayLogs.filter(
    (l) => l.kind === 'dirty' || l.kind === 'both',
  ).length;
  const lastDiaper = logs[0] ?? null;

  return {
    logs,
    todayLogs,
    todayCount: todayLogs.length,
    todayWet,
    todayDirty,
    lastDiaper,
    isLoading: listQuery.isLoading,
    error: listQuery.error,
    addDiaperLog: addMutation.mutateAsync,
    isAdding: addMutation.isPending,
    deleteDiaperLog: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
