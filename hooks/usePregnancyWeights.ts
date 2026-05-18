import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import type { Database } from '@/types/database';

type WeightRow = Database['public']['Tables']['pregnancy_weights']['Row'];
type WeightInsert = Database['public']['Tables']['pregnancy_weights']['Insert'];

const WEIGHTS_KEY = 'pregnancy_weights';

// ---------------------------------------------------------------------------
// usePregnancyWeights
// Lists all weight entries for a given pregnancy and provides add mutation.
// ---------------------------------------------------------------------------

export function usePregnancyWeights(pregnancyId: string | null) {
  const userId = useAuthStore((s) => s.user?.id);
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: [WEIGHTS_KEY, pregnancyId],
    enabled: Boolean(pregnancyId && userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pregnancy_weights')
        .select('*')
        .eq('pregnancy_id', pregnancyId!)
        .order('recorded_at', { ascending: true });
      if (error) throw error;
      return data as WeightRow[];
    },
  });

  const addMutation = useMutation({
    mutationFn: async (
      input: Pick<WeightInsert, 'weight_kg' | 'recorded_at' | 'note'>,
    ) => {
      const { data, error } = await supabase
        .from('pregnancy_weights')
        .insert({
          pregnancy_id: pregnancyId!,
          owner_id: userId!,
          weight_kg: input.weight_kg,
          recorded_at: input.recorded_at ?? new Date().toISOString(),
          note: input.note ?? null,
        })
        .select()
        .single();
      if (error) throw error;
      return data as WeightRow;
    },
    onSuccess: (newEntry) => {
      queryClient.setQueryData<WeightRow[]>(
        [WEIGHTS_KEY, pregnancyId],
        (prev) => {
          const updated = prev ? [...prev, newEntry] : [newEntry];
          return updated.sort(
            (a, b) =>
              new Date(a.recorded_at).getTime() -
              new Date(b.recorded_at).getTime(),
          );
        },
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('pregnancy_weights')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      queryClient.setQueryData<WeightRow[]>(
        [WEIGHTS_KEY, pregnancyId],
        (prev) => prev?.filter((w) => w.id !== id) ?? [],
      );
    },
  });

  const latestWeight =
    listQuery.data && listQuery.data.length > 0
      ? listQuery.data[listQuery.data.length - 1]
      : null;

  return {
    weights: listQuery.data ?? [],
    latestWeight,
    isLoading: listQuery.isLoading,
    error: listQuery.error,
    addWeight: addMutation.mutateAsync,
    isAdding: addMutation.isPending,
    deleteWeight: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}

export default usePregnancyWeights;
