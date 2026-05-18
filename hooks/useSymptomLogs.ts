// ---------------------------------------------------------------------------
// useSymptomLogs — TanStack Query hook for baby symptom/fever logs.
// ---------------------------------------------------------------------------

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import { useBabyStore } from '@/stores/babyStore';
import { subDays, startOfDay } from 'date-fns';
import type { Database } from '@/types/database';

type SymptomLog = Database['public']['Tables']['symptom_logs']['Row'];
type SymptomLogInsert = Database['public']['Tables']['symptom_logs']['Insert'];

const SYMPTOM_KEY = 'symptom_logs';

/** Fever risk level per temperature */
export function feverRiskLevel(tempC: number | null): 'green' | 'yellow' | 'red' {
  if (!tempC) return 'green';
  if (tempC >= 39.0) return 'red';
  if (tempC >= 38.0) return 'yellow';
  return 'green';
}

export function useBabySymptomLogs() {
  const userId = useAuthStore((s) => s.user?.id);
  const { activeBabyId } = useBabyStore();
  const queryClient = useQueryClient();

  const since = startOfDay(subDays(new Date(), 6)).toISOString();

  const listQuery = useQuery({
    queryKey: [SYMPTOM_KEY, activeBabyId, 'last7'],
    enabled: Boolean(activeBabyId) && Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('symptom_logs')
        .select('*')
        .eq('baby_id', activeBabyId!)
        .gte('recorded_at', since)
        .order('recorded_at', { ascending: false });
      if (error) throw error;
      return data as SymptomLog[];
    },
  });

  const addMutation = useMutation({
    mutationFn: async (
      input: Omit<SymptomLogInsert, 'owner_id' | 'baby_id'>,
    ) => {
      const { data, error } = await supabase
        .from('symptom_logs')
        .insert({ ...input, owner_id: userId!, baby_id: activeBabyId! })
        .select()
        .single();
      if (error) throw error;
      return data as SymptomLog;
    },
    onSuccess: (newLog) => {
      queryClient.setQueryData<SymptomLog[]>(
        [SYMPTOM_KEY, activeBabyId, 'last7'],
        (prev) => (prev ? [newLog, ...prev] : [newLog]),
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('symptom_logs')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData<SymptomLog[]>(
        [SYMPTOM_KEY, activeBabyId, 'last7'],
        (prev) => (prev ? prev.filter((l) => l.id !== deletedId) : []),
      );
    },
  });

  const logs = listQuery.data ?? [];

  // Today's logs
  const todayStart = startOfDay(new Date()).toISOString();
  const todayLogs = logs.filter((l) => l.recorded_at >= todayStart);

  // Highest fever today
  const latestFever = todayLogs.find((l) => l.fever_c !== null) ?? null;
  const maxFeverToday = todayLogs.reduce<number | null>((max, l) => {
    if (l.fever_c === null) return max;
    const val = Number(l.fever_c);
    return max === null || val > max ? val : max;
  }, null);

  return {
    logs,
    todayLogs,
    latestFever,
    maxFeverToday,
    isLoading: listQuery.isLoading,
    error: listQuery.error,
    addSymptomLog: addMutation.mutateAsync,
    isAdding: addMutation.isPending,
    deleteSymptomLog: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
