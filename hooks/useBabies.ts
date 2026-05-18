import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import { useBabyStore } from '@/stores/babyStore';
import type { Database } from '@/types/database';

type BabyRow = Database['public']['Tables']['babies']['Row'];
type BabyInsert = Database['public']['Tables']['babies']['Insert'];
type BabyUpdate = Database['public']['Tables']['babies']['Update'];

export type BabyHealthProfile = Database['public']['Tables']['baby_health_profile']['Row'];

const BABIES_KEY = 'babies';

export function useBabies() {
  const userId = useAuthStore((s) => s.user?.id);
  const queryClient = useQueryClient();
  const { setActiveBabyId } = useBabyStore();

  const listQuery = useQuery({
    queryKey: [BABIES_KEY, userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('babies')
        .select('*')
        .eq('owner_id', userId!)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data as BabyRow[];
    },
  });

  const addMutation = useMutation({
    mutationFn: async (input: Omit<BabyInsert, 'owner_id'>) => {
      const { data, error } = await supabase
        .from('babies')
        .insert({ ...input, owner_id: userId! })
        .select()
        .single();
      if (error) throw error;
      return data as BabyRow;
    },
    onSuccess: (newBaby) => {
      queryClient.setQueryData<BabyRow[]>([BABIES_KEY, userId], (prev) =>
        prev ? [...prev, newBaby] : [newBaby],
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Pick<BabyUpdate, 'id'> & Omit<BabyUpdate, 'id' | 'owner_id'>) => {
      const { data, error } = await supabase
        .from('babies')
        .update(updates)
        .eq('id', id!)
        .select()
        .single();
      if (error) throw error;
      return data as BabyRow;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData<BabyRow[]>([BABIES_KEY, userId], (prev) =>
        prev ? prev.map((b) => (b.id === updated.id ? updated : b)) : [updated],
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (babyId: string) => {
      const { error } = await supabase
        .from('babies')
        .delete()
        .eq('id', babyId);
      if (error) throw error;
      return babyId;
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData<BabyRow[]>([BABIES_KEY, userId], (prev) =>
        prev ? prev.filter((b) => b.id !== deletedId) : [],
      );
      const { activeBabyId } = useBabyStore.getState();
      if (activeBabyId === deletedId) {
        setActiveBabyId(null);
      }
    },
  });

  const healthQuery = (babyId: string) =>
    useQuery({
      queryKey: ['baby_health', babyId],
      enabled: Boolean(babyId),
      queryFn: async () => {
        const { data, error } = await supabase
          .from('baby_health_profile')
          .select('*')
          .eq('baby_id', babyId)
          .maybeSingle();
        if (error) throw error;
        return data as BabyHealthProfile | null;
      },
    });

  const upsertHealthMutation = useMutation({
    mutationFn: async (health: Database['public']['Tables']['baby_health_profile']['Insert']) => {
      const { data, error } = await supabase
        .from('baby_health_profile')
        .upsert(health, { onConflict: 'baby_id' })
        .select()
        .single();
      if (error) throw error;
      return data as BabyHealthProfile;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(['baby_health', updated.baby_id], updated);
    },
  });

  return {
    babies: listQuery.data ?? [],
    isLoading: listQuery.isLoading,
    error: listQuery.error,
    addBaby: addMutation.mutateAsync,
    isAdding: addMutation.isPending,
    updateBaby: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteBaby: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    useBabyHealth: healthQuery,
    upsertBabyHealth: upsertHealthMutation.mutateAsync,
    isUpsertingHealth: upsertHealthMutation.isPending,
  };
}
