// ---------------------------------------------------------------------------
// useMilestoneCatalog — fetches the full milestone_catalog reference table.
// This data is static (seeded) so we use a long staleTime.
// ---------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

export type MilestoneCatalogRow =
  Database['public']['Tables']['milestone_catalog']['Row'];

export function useMilestoneCatalog() {
  const query = useQuery({
    queryKey: ['milestone_catalog'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('milestone_catalog')
        .select('*')
        .order('age_min_months', { ascending: true });
      if (error) throw error;
      return data as MilestoneCatalogRow[];
    },
    staleTime: 60 * 60 * 1000, // 1 hour — catalog rarely changes
    gcTime: 24 * 60 * 60 * 1000,
  });

  return {
    catalog: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
  };
}
