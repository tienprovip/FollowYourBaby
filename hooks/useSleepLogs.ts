// ---------------------------------------------------------------------------
// useSleepLogs — TanStack Query hook for baby sleep logs.
// ---------------------------------------------------------------------------

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import { useBabyStore } from '@/stores/babyStore';
import { subDays, startOfDay, differenceInMinutes, parseISO } from 'date-fns';
import type { Database } from '@/types/database';

type SleepLog = Database['public']['Tables']['sleep_logs']['Row'];
type SleepLogInsert = Database['public']['Tables']['sleep_logs']['Insert'];

const SLEEP_KEY = 'sleep_logs';

export function useSleepLogs() {
  const userId = useAuthStore((s) => s.user?.id);
  const { activeBabyId } = useBabyStore();
  const queryClient = useQueryClient();

  const since = startOfDay(subDays(new Date(), 6)).toISOString();

  const listQuery = useQuery({
    queryKey: [SLEEP_KEY, activeBabyId, 'last7'],
    enabled: Boolean(activeBabyId) && Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sleep_logs')
        .select('*')
        .eq('baby_id', activeBabyId!)
        .gte('started_at', since)
        .order('started_at', { ascending: false });
      if (error) throw error;
      return data as SleepLog[];
    },
  });

  const addMutation = useMutation({
    mutationFn: async (input: Omit<SleepLogInsert, 'owner_id' | 'baby_id'>) => {
      const { data, error } = await supabase
        .from('sleep_logs')
        .insert({ ...input, owner_id: userId!, baby_id: activeBabyId! })
        .select()
        .single();
      if (error) throw error;
      return data as SleepLog;
    },
    onSuccess: (newLog) => {
      queryClient.setQueryData<SleepLog[]>(
        [SLEEP_KEY, activeBabyId, 'last7'],
        (prev) => (prev ? [newLog, ...prev] : [newLog]),
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('sleep_logs').delete().eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData<SleepLog[]>(
        [SLEEP_KEY, activeBabyId, 'last7'],
        (prev) => (prev ? prev.filter((l) => l.id !== deletedId) : []),
      );
    },
  });

  const logs = listQuery.data ?? [];

  // Today's stats
  const todayStart = startOfDay(new Date()).toISOString();
  const todayLogs = logs.filter((l) => l.started_at >= todayStart);

  function durationMin(log: SleepLog): number {
    if (!log.ended_at) return 0;
    return differenceInMinutes(parseISO(log.ended_at), parseISO(log.started_at));
  }

  const todayNapMinutes = todayLogs
    .filter((l) => l.kind === 'nap')
    .reduce((sum, l) => sum + durationMin(l), 0);

  const todayNightMinutes = todayLogs
    .filter((l) => l.kind === 'night')
    .reduce((sum, l) => sum + durationMin(l), 0);

  const lastSleep = logs[0] ?? null;

  return {
    logs,
    todayLogs,
    todayNapMinutes,
    todayNightMinutes,
    todayTotalMinutes: todayNapMinutes + todayNightMinutes,
    lastSleep,
    isLoading: listQuery.isLoading,
    error: listQuery.error,
    addSleepLog: addMutation.mutateAsync,
    isAdding: addMutation.isPending,
    deleteSleepLog: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
