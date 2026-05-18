import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import type { Database } from '@/types/database';

type SymptomRow = Database['public']['Tables']['pregnancy_symptoms']['Row'];
type SymptomInsert = Database['public']['Tables']['pregnancy_symptoms']['Insert'];

const SYMPTOMS_KEY = 'pregnancy_symptoms';

// ---------------------------------------------------------------------------
// Symptom catalogue — Vietnamese labels + severity risk rules
// ---------------------------------------------------------------------------

export interface SymptomInfo {
  key: string;
  label: string;
  emoji: string;
  /** Severity level at which this symptom becomes red-risk */
  redThreshold: number | null;
  /** Whether this symptom is always red-risk regardless of severity */
  alwaysRed: boolean;
}

export const SYMPTOM_CATALOGUE: SymptomInfo[] = [
  { key: 'buon_nau', label: 'Buồn nôn', emoji: 'N', redThreshold: null, alwaysRed: false },
  { key: 'ok_nghen', label: 'Ốm nghén', emoji: 'N', redThreshold: null, alwaysRed: false },
  { key: 'met_moi', label: 'Mệt mỏi', emoji: 'M', redThreshold: 5, alwaysRed: false },
  { key: 'mat_ngu', label: 'Mất ngủ', emoji: 'Z', redThreshold: null, alwaysRed: false },
  { key: 'o_chua', label: 'Ợ chua', emoji: 'O', redThreshold: null, alwaysRed: false },
  { key: 'chuot_rut', label: 'Chuột rút', emoji: 'C', redThreshold: 4, alwaysRed: false },
  { key: 'dau_lung', label: 'Đau lưng', emoji: 'D', redThreshold: 4, alwaysRed: false },
  { key: 'phu_tay_chan', label: 'Phù tay/chân', emoji: 'P', redThreshold: 4, alwaysRed: false },
  { key: 'tam_trang_buon', label: 'Tâm trạng buồn', emoji: 'T', redThreshold: 5, alwaysRed: false },
  { key: 'lo_au', label: 'Lo âu', emoji: 'L', redThreshold: 5, alwaysRed: false },
  { key: 'dau_dau', label: 'Đau đầu', emoji: 'H', redThreshold: 4, alwaysRed: false },
  { key: 'chong_mat', label: 'Chóng mặt', emoji: 'X', redThreshold: 4, alwaysRed: false },
  { key: 'ra_dich_bat_thuong', label: 'Ra dịch bất thường', emoji: 'D', redThreshold: null, alwaysRed: true },
  { key: 'ra_mau', label: 'Ra máu', emoji: 'R', redThreshold: null, alwaysRed: true },
];

export const RED_SYMPTOMS = new Set(
  SYMPTOM_CATALOGUE.filter((s) => s.alwaysRed).map((s) => s.key),
);

export function getSymptomInfo(key: string): SymptomInfo | undefined {
  return SYMPTOM_CATALOGUE.find((s) => s.key === key);
}

/**
 * Evaluate risk level for a symptom entry.
 * Returns 'red' | 'yellow' | 'green'.
 */
export function evaluateSymptomRisk(
  symptomKey: string,
  severity: number,
): 'red' | 'yellow' | 'green' {
  const info = getSymptomInfo(symptomKey);
  if (!info) return 'green';
  if (info.alwaysRed) return 'red';
  if (info.redThreshold !== null && severity >= info.redThreshold) return 'red';
  if (severity >= 3) return 'yellow';
  return 'green';
}

// ---------------------------------------------------------------------------
// usePregnancySymptoms hook
// ---------------------------------------------------------------------------

export function usePregnancySymptoms(pregnancyId: string | null) {
  const userId = useAuthStore((s) => s.user?.id);
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: [SYMPTOMS_KEY, pregnancyId],
    enabled: Boolean(pregnancyId && userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pregnancy_symptoms')
        .select('*')
        .eq('pregnancy_id', pregnancyId!)
        .order('recorded_at', { ascending: false });
      if (error) throw error;
      return data as SymptomRow[];
    },
  });

  const addMutation = useMutation({
    mutationFn: async (
      input: Pick<SymptomInsert, 'symptom_key' | 'severity' | 'recorded_at' | 'note'>,
    ) => {
      const { data, error } = await supabase
        .from('pregnancy_symptoms')
        .insert({
          pregnancy_id: pregnancyId!,
          owner_id: userId!,
          symptom_key: input.symptom_key,
          severity: input.severity ?? null,
          recorded_at: input.recorded_at ?? new Date().toISOString(),
          note: input.note ?? null,
        })
        .select()
        .single();
      if (error) throw error;
      return data as SymptomRow;
    },
    onSuccess: (newEntry) => {
      queryClient.setQueryData<SymptomRow[]>(
        [SYMPTOMS_KEY, pregnancyId],
        (prev) => [newEntry, ...(prev ?? [])],
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('pregnancy_symptoms')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      queryClient.setQueryData<SymptomRow[]>(
        [SYMPTOMS_KEY, pregnancyId],
        (prev) => prev?.filter((s) => s.id !== id) ?? [],
      );
    },
  });

  // Today's symptoms
  const today = new Date().toDateString();
  const todaySymptoms = (listQuery.data ?? []).filter(
    (s) => new Date(s.recorded_at).toDateString() === today,
  );

  // Highest risk level across today's symptoms
  const todayMaxRisk = todaySymptoms.reduce<'red' | 'yellow' | 'green'>(
    (max, s) => {
      const level = evaluateSymptomRisk(s.symptom_key, s.severity ?? 1);
      if (level === 'red') return 'red';
      if (level === 'yellow' && max !== 'red') return 'yellow';
      return max;
    },
    'green',
  );

  return {
    symptoms: listQuery.data ?? [],
    todaySymptoms,
    todayMaxRisk,
    isLoading: listQuery.isLoading,
    error: listQuery.error,
    addSymptom: addMutation.mutateAsync,
    isAdding: addMutation.isPending,
    deleteSymptom: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}

export default usePregnancySymptoms;
