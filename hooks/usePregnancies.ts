import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import { useBabyStore } from '@/stores/babyStore';
import type { Database } from '@/types/database';

type PregnancyRow = Database['public']['Tables']['pregnancies']['Row'];
type PregnancyInsert = Database['public']['Tables']['pregnancies']['Insert'];
type PregnancyUpdate = Database['public']['Tables']['pregnancies']['Update'];

const PREGNANCIES_KEY = 'pregnancies';

export function usePregnancies() {
  const userId = useAuthStore((s) => s.user?.id);
  const queryClient = useQueryClient();
  const { setActivePregnancyId } = useBabyStore();

  const listQuery = useQuery({
    queryKey: [PREGNANCIES_KEY, userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pregnancies')
        .select('*')
        .eq('owner_id', userId!)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as PregnancyRow[];
    },
  });

  const addMutation = useMutation({
    mutationFn: async (input: Omit<PregnancyInsert, 'owner_id'>) => {
      const { data, error } = await supabase
        .from('pregnancies')
        .insert({ ...input, owner_id: userId! })
        .select()
        .single();
      if (error) throw error;
      return data as PregnancyRow;
    },
    onSuccess: (newPregnancy) => {
      queryClient.setQueryData<PregnancyRow[]>([PREGNANCIES_KEY, userId], (prev) =>
        prev ? [newPregnancy, ...prev] : [newPregnancy],
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Pick<PregnancyUpdate, 'id'> & Omit<PregnancyUpdate, 'id' | 'owner_id'>) => {
      const { data, error } = await supabase
        .from('pregnancies')
        .update(updates)
        .eq('id', id!)
        .select()
        .single();
      if (error) throw error;
      return data as PregnancyRow;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData<PregnancyRow[]>([PREGNANCIES_KEY, userId], (prev) =>
        prev ? prev.map((p) => (p.id === updated.id ? updated : p)) : [updated],
      );
    },
  });

  const archiveMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'completed' | 'lost' }) => {
      const { data, error } = await supabase
        .from('pregnancies')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as PregnancyRow;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData<PregnancyRow[]>([PREGNANCIES_KEY, userId], (prev) =>
        prev ? prev.map((p) => (p.id === updated.id ? updated : p)) : [updated],
      );
      const { activePregnancyId } = useBabyStore.getState();
      if (activePregnancyId === updated.id) {
        setActivePregnancyId(null);
      }
    },
  });

  return {
    pregnancies: listQuery.data ?? [],
    isLoading: listQuery.isLoading,
    error: listQuery.error,
    addPregnancy: addMutation.mutateAsync,
    isAdding: addMutation.isPending,
    updatePregnancy: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    archivePregnancy: archiveMutation.mutateAsync,
    isArchiving: archiveMutation.isPending,
  };
}
