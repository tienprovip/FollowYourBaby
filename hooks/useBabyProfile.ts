// ---------------------------------------------------------------------------
// useBabyProfile — fetch and update the baby_health_profile record.
// ---------------------------------------------------------------------------

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useBabyStore } from '@/stores/babyStore';
import type { Database, Json } from '@/types/database';

type HealthProfileRow =
  Database['public']['Tables']['baby_health_profile']['Row'];

export interface HealthProfileUpdate {
  allergies?: Json;
  medications?: Json;
  medical_history?: Json;
}

const HEALTH_PROFILE_KEY = 'baby_health_profile';

export function useBabyProfile() {
  const { activeBabyId } = useBabyStore();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [HEALTH_PROFILE_KEY, activeBabyId],
    enabled: Boolean(activeBabyId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('baby_health_profile')
        .select('*')
        .eq('baby_id', activeBabyId!)
        .maybeSingle();
      if (error) throw error;
      return data as HealthProfileRow | null;
    },
    staleTime: 5 * 60 * 1000,
  });

  const updateMutation = useMutation({
    mutationFn: async (updates: HealthProfileUpdate) => {
      const { data, error } = await supabase
        .from('baby_health_profile')
        .upsert(
          { baby_id: activeBabyId!, ...updates },
          { onConflict: 'baby_id' },
        )
        .select()
        .single();
      if (error) throw error;
      return data as HealthProfileRow;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData([HEALTH_PROFILE_KEY, activeBabyId], updated);
    },
  });

  return {
    healthProfile: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error,
    updateHealthProfile: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
}
