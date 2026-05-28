import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import type { Database } from '@/types/database';

type JournalRow = Database['public']['Tables']['pregnancy_journal_entries']['Row'];
type JournalInsert = Database['public']['Tables']['pregnancy_journal_entries']['Insert'];

const JOURNAL_KEY = 'pregnancy_journal_entries';

export type MoodKey = 'happy' | 'excited' | 'tired' | 'anxious' | 'sad' | 'worried' | 'grateful';

export interface MoodInfo {
  key: MoodKey;
  emoji: string;
  label: string;
}

export const MOOD_CATALOGUE: MoodInfo[] = [
  { key: 'happy',    emoji: '😊', label: 'Vui vẻ' },
  { key: 'excited',  emoji: '🥰', label: 'Hạnh phúc' },
  { key: 'tired',    emoji: '😴', label: 'Mệt mỏi' },
  { key: 'anxious',  emoji: '😰', label: 'Lo lắng' },
  { key: 'sad',      emoji: '😢', label: 'Buồn' },
  { key: 'worried',  emoji: '😮', label: 'Bất an' },
  { key: 'grateful', emoji: '🙏', label: 'Biết ơn' },
];

export function getMoodInfo(key: string): MoodInfo | undefined {
  return MOOD_CATALOGUE.find((m) => m.key === key);
}

export function usePregnancyJournal(pregnancyId: string | null) {
  const userId = useAuthStore((s) => s.user?.id);
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: [JOURNAL_KEY, pregnancyId],
    enabled: Boolean(pregnancyId && userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pregnancy_journal_entries')
        .select('*')
        .eq('pregnancy_id', pregnancyId!)
        .order('recorded_at', { ascending: false });
      if (error) throw error;
      return data as JournalRow[];
    },
  });

  const addMutation = useMutation({
    mutationFn: async (
      input: Pick<JournalInsert, 'content' | 'title' | 'mood' | 'recorded_at'>,
    ) => {
      const { data, error } = await supabase
        .from('pregnancy_journal_entries')
        .insert({
          pregnancy_id: pregnancyId!,
          owner_id: userId!,
          content: input.content,
          title: input.title ?? null,
          mood: input.mood ?? null,
          recorded_at: input.recorded_at ?? new Date().toISOString(),
        })
        .select()
        .single();
      if (error) throw error;
      return data as JournalRow;
    },
    onSuccess: (newEntry) => {
      queryClient.setQueryData<JournalRow[]>(
        [JOURNAL_KEY, pregnancyId],
        (prev) => [newEntry, ...(prev ?? [])],
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('pregnancy_journal_entries')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      queryClient.setQueryData<JournalRow[]>(
        [JOURNAL_KEY, pregnancyId],
        (prev) => prev?.filter((e) => e.id !== id) ?? [],
      );
    },
  });

  return {
    entries: listQuery.data ?? [],
    isLoading: listQuery.isLoading,
    error: listQuery.error,
    addEntry: addMutation.mutateAsync,
    isAdding: addMutation.isPending,
    deleteEntry: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}

export default usePregnancyJournal;
