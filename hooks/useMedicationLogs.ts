// ---------------------------------------------------------------------------
// useMedicationLogs — TanStack Query hook for baby medication logs.
// ---------------------------------------------------------------------------

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import { useBabyStore } from '@/stores/babyStore';
import { subDays, startOfDay } from 'date-fns';
import type { Database } from '@/types/database';

type MedicationLog = Database['public']['Tables']['medication_logs']['Row'];
type MedicationLogInsert = Database['public']['Tables']['medication_logs']['Insert'];

const MED_KEY = 'medication_logs_baby';

export function useBabyMedicationLogs() {
  const userId = useAuthStore((s) => s.user?.id);
  const { activeBabyId } = useBabyStore();
  const queryClient = useQueryClient();

  const since = startOfDay(subDays(new Date(), 6)).toISOString();

  const listQuery = useQuery({
    queryKey: [MED_KEY, activeBabyId, 'last7'],
    enabled: Boolean(activeBabyId) && Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('medication_logs')
        .select('*')
        .eq('baby_id', activeBabyId!)
        .gte('given_at', since)
        .order('given_at', { ascending: false });
      if (error) throw error;
      return data as MedicationLog[];
    },
  });

  const addMutation = useMutation({
    mutationFn: async (
      input: Omit<MedicationLogInsert, 'owner_id' | 'baby_id'>,
    ) => {
      const { data, error } = await supabase
        .from('medication_logs')
        .insert({ ...input, owner_id: userId!, baby_id: activeBabyId! })
        .select()
        .single();
      if (error) throw error;
      return data as MedicationLog;
    },
    onSuccess: (newLog) => {
      queryClient.setQueryData<MedicationLog[]>(
        [MED_KEY, activeBabyId, 'last7'],
        (prev) => (prev ? [newLog, ...prev] : [newLog]),
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('medication_logs')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData<MedicationLog[]>(
        [MED_KEY, activeBabyId, 'last7'],
        (prev) => (prev ? prev.filter((l) => l.id !== deletedId) : []),
      );
    },
  });

  const logs = listQuery.data ?? [];

  // Today's count
  const todayStart = startOfDay(new Date()).toISOString();
  const todayLogs = logs.filter((l) => l.given_at >= todayStart);

  return {
    logs,
    todayLogs,
    todayCount: todayLogs.length,
    isLoading: listQuery.isLoading,
    error: listQuery.error,
    addMedicationLog: addMutation.mutateAsync,
    isAdding: addMutation.isPending,
    deleteMedicationLog: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
