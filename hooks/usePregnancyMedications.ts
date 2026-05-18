import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import { toLocalDateStr } from '@/lib/dateUtils';
import type { Database, Json } from '@/types/database';

type MedRow = Database['public']['Tables']['pregnancy_medications']['Row'];
type MedInsert = Database['public']['Tables']['pregnancy_medications']['Insert'];
type MedUpdate = Database['public']['Tables']['pregnancy_medications']['Update'];

const MEDS_KEY = 'pregnancy_medications';

// ---------------------------------------------------------------------------
// Schedule shape stored in the JSONB column
// ---------------------------------------------------------------------------

export interface MedicationSchedule {
  /** How many times per day */
  timesPerDay: number;
  /** Optional specific times, e.g. ["07:00", "19:00"] */
  times?: string[];
  /** Optional day pattern: "daily" | "weekly" | custom note */
  frequency?: string;
}

// ---------------------------------------------------------------------------
// usePregnancyMedications
// ---------------------------------------------------------------------------

export function usePregnancyMedications(pregnancyId: string | null) {
  const userId = useAuthStore((s) => s.user?.id);
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: [MEDS_KEY, pregnancyId],
    enabled: Boolean(pregnancyId && userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pregnancy_medications')
        .select('*')
        .eq('pregnancy_id', pregnancyId!)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data as MedRow[];
    },
  });

  const addMutation = useMutation({
    mutationFn: async (
      input: {
        name: string;
        dosage?: string;
        schedule: MedicationSchedule;
        started_at?: string;
        ended_at?: string;
      },
    ) => {
      const { data, error } = await supabase
        .from('pregnancy_medications')
        .insert({
          pregnancy_id: pregnancyId!,
          owner_id: userId!,
          name: input.name,
          dosage: input.dosage ?? null,
          schedule: input.schedule as unknown as Json,
          started_at: input.started_at ?? toLocalDateStr(new Date()),
          ended_at: input.ended_at ?? null,
        })
        .select()
        .single();
      if (error) throw error;
      return data as MedRow;
    },
    onSuccess: (newMed) => {
      queryClient.setQueryData<MedRow[]>(
        [MEDS_KEY, pregnancyId],
        (prev) => [...(prev ?? []), newMed],
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: Pick<MedUpdate, 'id'> & {
      name?: string;
      dosage?: string;
      schedule?: MedicationSchedule;
      started_at?: string;
      ended_at?: string | null;
    }) => {
      const payload: MedUpdate = {
        name: updates.name,
        dosage: updates.dosage ?? null,
        ended_at: updates.ended_at ?? null,
        started_at: updates.started_at,
      };
      if (updates.schedule) {
        payload.schedule = updates.schedule as unknown as Json;
      }
      const { data, error } = await supabase
        .from('pregnancy_medications')
        .update(payload)
        .eq('id', id!)
        .select()
        .single();
      if (error) throw error;
      return data as MedRow;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData<MedRow[]>(
        [MEDS_KEY, pregnancyId],
        (prev) =>
          prev?.map((m) => (m.id === updated.id ? updated : m)) ?? [updated],
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('pregnancy_medications')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      queryClient.setQueryData<MedRow[]>(
        [MEDS_KEY, pregnancyId],
        (prev) => prev?.filter((m) => m.id !== id) ?? [],
      );
    },
  });

  // Active = no ended_at or ended_at in the future
  const now = toLocalDateStr(new Date());
  const activeMedications = (listQuery.data ?? []).filter(
    (m) => !m.ended_at || m.ended_at >= now,
  );

  return {
    medications: listQuery.data ?? [],
    activeMedications,
    isLoading: listQuery.isLoading,
    error: listQuery.error,
    addMedication: addMutation.mutateAsync,
    isAdding: addMutation.isPending,
    updateMedication: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteMedication: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}

export default usePregnancyMedications;
