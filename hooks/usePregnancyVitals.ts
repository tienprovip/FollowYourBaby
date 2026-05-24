import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import type { Database, VitalKind } from '@/types/database';

type VitalRow = Database['public']['Tables']['pregnancy_vitals']['Row'];
type VitalInsert = Database['public']['Tables']['pregnancy_vitals']['Insert'];

const VITALS_KEY = 'pregnancy_vitals';

export function usePregnancyVitals(pregnancyId: string | null, kind: VitalKind) {
  const userId = useAuthStore((s) => s.user?.id);
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: [VITALS_KEY, pregnancyId, kind],
    enabled: Boolean(pregnancyId && userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pregnancy_vitals')
        .select('*')
        .eq('pregnancy_id', pregnancyId!)
        .eq('kind', kind)
        .order('recorded_at', { ascending: false });
      if (error) throw error;
      return data as VitalRow[];
    },
  });

  const addMutation = useMutation({
    mutationFn: async (
      input: Pick<VitalInsert, 'value1' | 'value2' | 'unit' | 'recorded_at' | 'note'>,
    ) => {
      const { data, error } = await supabase
        .from('pregnancy_vitals')
        .insert({
          pregnancy_id: pregnancyId!,
          owner_id: userId!,
          kind,
          value1: input.value1,
          value2: input.value2 ?? null,
          unit: input.unit,
          recorded_at: input.recorded_at ?? new Date().toISOString(),
          note: input.note ?? null,
        })
        .select()
        .single();
      if (error) throw error;
      return data as VitalRow;
    },
    onSuccess: (newEntry) => {
      queryClient.setQueryData<VitalRow[]>(
        [VITALS_KEY, pregnancyId, kind],
        (prev) => {
          const updated = prev ? [newEntry, ...prev] : [newEntry];
          return updated.sort(
            (a, b) =>
              new Date(b.recorded_at).getTime() -
              new Date(a.recorded_at).getTime(),
          );
        },
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('pregnancy_vitals')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      queryClient.setQueryData<VitalRow[]>(
        [VITALS_KEY, pregnancyId, kind],
        (prev) => prev?.filter((v) => v.id !== id) ?? [],
      );
    },
  });

  return {
    vitals: listQuery.data ?? [],
    isLoading: listQuery.isLoading,
    addVital: addMutation.mutateAsync,
    isAdding: addMutation.isPending,
    deleteVital: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
