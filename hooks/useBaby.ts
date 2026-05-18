// ---------------------------------------------------------------------------
// useBaby — resolve the active baby profile from Supabase.
// Provides computed age fields derived from the baby's date of birth.
// ---------------------------------------------------------------------------

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useBabyStore } from '@/stores/babyStore';
import { useAuthStore } from '@/stores/authStore';
import {
  babyAgeInMonths,
  babyAgeInDays,
  babyAgeLabel,
  babyAgeInMonthsDecimal,
} from '@/lib/babyUtils';
import type { Database } from '@/types/database';

export type BabyRow = Database['public']['Tables']['babies']['Row'];

export interface ActiveBaby extends BabyRow {
  ageInMonths: number;
  ageInDays: number;
  ageLabel: string;
  ageInMonthsDecimal: number;
}

export function useBaby() {
  const userId = useAuthStore((s) => s.user?.id);
  const { activeBabyId } = useBabyStore();

  const query = useQuery({
    queryKey: ['baby', activeBabyId],
    enabled: Boolean(activeBabyId) && Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('babies')
        .select('*')
        .eq('id', activeBabyId!)
        .single();
      if (error) throw error;
      return data as BabyRow;
    },
    staleTime: 5 * 60 * 1000,
  });

  const activeBaby = useMemo<ActiveBaby | null>(() => {
    if (!query.data) return null;
    const dob = new Date(query.data.dob);
    return {
      ...query.data,
      ageInMonths: babyAgeInMonths(dob),
      ageInDays: babyAgeInDays(dob),
      ageLabel: babyAgeLabel(dob),
      ageInMonthsDecimal: babyAgeInMonthsDecimal(dob),
    };
  }, [query.data]);

  return {
    baby: activeBaby,
    isLoading: query.isLoading,
    error: query.error,
    hasActiveBaby: activeBabyId !== null,
  };
}
