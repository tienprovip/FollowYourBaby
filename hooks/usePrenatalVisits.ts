import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import type { Database } from '@/types/database';

type VisitRow = Database['public']['Tables']['prenatal_visits']['Row'];
type VisitInsert = Database['public']['Tables']['prenatal_visits']['Insert'];
type VisitUpdate = Database['public']['Tables']['prenatal_visits']['Update'];

const VISITS_KEY = 'prenatal_visits';

// ---------------------------------------------------------------------------
// usePrenatalVisits
// ---------------------------------------------------------------------------

export function usePrenatalVisits(pregnancyId: string | null) {
  const userId = useAuthStore((s) => s.user?.id);
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: [VISITS_KEY, pregnancyId],
    enabled: Boolean(pregnancyId && userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prenatal_visits')
        .select('*')
        .eq('pregnancy_id', pregnancyId!)
        .order('scheduled_at', { ascending: true });
      if (error) throw error;
      return data as VisitRow[];
    },
  });

  const addMutation = useMutation({
    mutationFn: async (
      input: Pick<VisitInsert, 'scheduled_at' | 'type' | 'location' | 'notes' | 'document_url' | 'doctor_name' | 'next_visit_date'>,
    ) => {
      const { data, error } = await supabase
        .from('prenatal_visits')
        .insert({
          pregnancy_id: pregnancyId!,
          owner_id: userId!,
          scheduled_at: input.scheduled_at,
          type: input.type ?? 'checkup',
          location: input.location ?? null,
          notes: input.notes ?? null,
          document_url: input.document_url ?? null,
          doctor_name: input.doctor_name ?? null,
          next_visit_date: input.next_visit_date ?? null,
        })
        .select()
        .single();
      if (error) throw error;
      return data as VisitRow;
    },
    onSuccess: (newVisit) => {
      queryClient.setQueryData<VisitRow[]>(
        [VISITS_KEY, pregnancyId],
        (prev) => {
          const updated = [newVisit, ...(prev ?? [])];
          return updated.sort(
            (a, b) =>
              new Date(a.scheduled_at).getTime() -
              new Date(b.scheduled_at).getTime(),
          );
        },
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: Pick<VisitUpdate, 'id'> &
      Omit<VisitUpdate, 'id' | 'owner_id' | 'pregnancy_id'>) => {
      const { data, error } = await supabase
        .from('prenatal_visits')
        .update(updates)
        .eq('id', id!)
        .select()
        .single();
      if (error) throw error;
      return data as VisitRow;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData<VisitRow[]>(
        [VISITS_KEY, pregnancyId],
        (prev) =>
          prev?.map((v) => (v.id === updated.id ? updated : v)) ?? [updated],
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('prenatal_visits')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      queryClient.setQueryData<VisitRow[]>(
        [VISITS_KEY, pregnancyId],
        (prev) => prev?.filter((v) => v.id !== id) ?? [],
      );
    },
  });

  const now = new Date();
  const upcomingVisits = (listQuery.data ?? []).filter(
    (v) => new Date(v.scheduled_at) >= now,
  );
  const pastVisits = (listQuery.data ?? []).filter(
    (v) => new Date(v.scheduled_at) < now,
  );
  const nextVisit = upcomingVisits[0] ?? null;

  return {
    visits: listQuery.data ?? [],
    upcomingVisits,
    pastVisits,
    nextVisit,
    isLoading: listQuery.isLoading,
    error: listQuery.error,
    addVisit: addMutation.mutateAsync,
    isAdding: addMutation.isPending,
    updateVisit: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteVisit: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}

export default usePrenatalVisits;
