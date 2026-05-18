// ---------------------------------------------------------------------------
// useFeedLogs — TanStack Query hook for baby feeding logs.
// ---------------------------------------------------------------------------

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import { useBabyStore } from '@/stores/babyStore';
import { subDays, startOfDay } from 'date-fns';
import type { Database } from '@/types/database';

type FeedLog = Database['public']['Tables']['feed_logs']['Row'];
type FeedLogInsert = Database['public']['Tables']['feed_logs']['Insert'];

const FEED_KEY = 'feed_logs';

export function useFeedLogs() {
  const userId = useAuthStore((s) => s.user?.id);
  const { activeBabyId } = useBabyStore();
  const queryClient = useQueryClient();

  const since = startOfDay(subDays(new Date(), 6)).toISOString();

  const listQuery = useQuery({
    queryKey: [FEED_KEY, activeBabyId, 'last7'],
    enabled: Boolean(activeBabyId) && Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feed_logs')
        .select('*')
        .eq('baby_id', activeBabyId!)
        .gte('started_at', since)
        .order('started_at', { ascending: false });
      if (error) throw error;
      return data as FeedLog[];
    },
  });

  const addMutation = useMutation({
    mutationFn: async (input: Omit<FeedLogInsert, 'owner_id' | 'baby_id'>) => {
      const { data, error } = await supabase
        .from('feed_logs')
        .insert({ ...input, owner_id: userId!, baby_id: activeBabyId! })
        .select()
        .single();
      if (error) throw error;
      return data as FeedLog;
    },
    onSuccess: (newLog) => {
      queryClient.setQueryData<FeedLog[]>(
        [FEED_KEY, activeBabyId, 'last7'],
        (prev) => (prev ? [newLog, ...prev] : [newLog]),
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('feed_logs').delete().eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData<FeedLog[]>(
        [FEED_KEY, activeBabyId, 'last7'],
        (prev) => (prev ? prev.filter((l) => l.id !== deletedId) : []),
      );
    },
  });

  const logs = listQuery.data ?? [];

  // Today's summary
  const todayStart = startOfDay(new Date()).toISOString();
  const todayLogs = logs.filter((l) => l.started_at >= todayStart);
  const lastFeed = logs[0] ?? null;

  const totalBottleMl = todayLogs
    .filter((l) => l.type === 'bottle')
    .reduce((sum, l) => sum + (l.amount_ml ?? 0), 0);

  return {
    logs,
    todayLogs,
    lastFeed,
    totalBottleMlToday: totalBottleMl,
    isLoading: listQuery.isLoading,
    error: listQuery.error,
    addFeedLog: addMutation.mutateAsync,
    isAdding: addMutation.isPending,
    deleteFeedLog: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
