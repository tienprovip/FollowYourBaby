// ---------------------------------------------------------------------------
// useActivityLogs — TanStack Query hook for baby activity logs.
// ---------------------------------------------------------------------------

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import { useBabyStore } from '@/stores/babyStore';
import { subDays, startOfDay } from 'date-fns';
import type { Database } from '@/types/database';

type ActivityLog = Database['public']['Tables']['activity_logs']['Row'];
type ActivityLogInsert = Database['public']['Tables']['activity_logs']['Insert'];

const ACTIVITY_KEY = 'activity_logs';

export function useActivityLogs() {
  const userId = useAuthStore((s) => s.user?.id);
  const { activeBabyId } = useBabyStore();
  const queryClient = useQueryClient();

  const since = startOfDay(subDays(new Date(), 6)).toISOString();

  const listQuery = useQuery({
    queryKey: [ACTIVITY_KEY, activeBabyId, 'last7'],
    enabled: Boolean(activeBabyId) && Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('baby_id', activeBabyId!)
        .gte('recorded_at', since)
        .order('recorded_at', { ascending: false });
      if (error) throw error;
      return data as ActivityLog[];
    },
  });

  const addMutation = useMutation({
    mutationFn: async (
      input: Omit<ActivityLogInsert, 'owner_id' | 'baby_id'>,
    ) => {
      const { data, error } = await supabase
        .from('activity_logs')
        .insert({ ...input, owner_id: userId!, baby_id: activeBabyId! })
        .select()
        .single();
      if (error) throw error;
      return data as ActivityLog;
    },
    onSuccess: (newLog) => {
      queryClient.setQueryData<ActivityLog[]>(
        [ACTIVITY_KEY, activeBabyId, 'last7'],
        (prev) => (prev ? [newLog, ...prev] : [newLog]),
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('activity_logs')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData<ActivityLog[]>(
        [ACTIVITY_KEY, activeBabyId, 'last7'],
        (prev) => (prev ? prev.filter((l) => l.id !== deletedId) : []),
      );
    },
  });

  const logs = listQuery.data ?? [];

  // Today's summary
  const todayStart = startOfDay(new Date()).toISOString();
  const todayLogs = logs.filter((l) => l.recorded_at >= todayStart);

  const todayTotalMinutes = todayLogs.reduce(
    (sum, l) => sum + (l.duration_min ?? 0),
    0,
  );

  return {
    logs,
    todayLogs,
    todayTotalMinutes,
    isLoading: listQuery.isLoading,
    error: listQuery.error,
    addActivityLog: addMutation.mutateAsync,
    isAdding: addMutation.isPending,
    deleteActivityLog: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
