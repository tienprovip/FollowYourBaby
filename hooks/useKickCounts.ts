import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import { useMaternalStore } from '@/stores/maternalStore';
import type { Database } from '@/types/database';

type KickRow = Database['public']['Tables']['kick_counts']['Row'];
type KickInsert = Database['public']['Tables']['kick_counts']['Insert'];

const KICKS_KEY = 'kick_counts';

// Risk threshold: fewer than 10 kicks in a 2-hour session
export const KICK_RISK_THRESHOLD = 10;
export const KICK_SESSION_DURATION_HOURS = 2;

// ---------------------------------------------------------------------------
// useKickCounts
// Manages kick counting sessions for a given pregnancy.
// ---------------------------------------------------------------------------

export function useKickCounts(pregnancyId: string | null) {
  const userId = useAuthStore((s) => s.user?.id);
  const queryClient = useQueryClient();
  const { startKickSession, cancelKickSession } = useMaternalStore();

  const listQuery = useQuery({
    queryKey: [KICKS_KEY, pregnancyId],
    enabled: Boolean(pregnancyId && userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kick_counts')
        .select('*')
        .eq('pregnancy_id', pregnancyId!)
        .order('started_at', { ascending: false });
      if (error) throw error;
      return data as KickRow[];
    },
  });

  // Start a new session — inserts a row with count=0, ended_at=null
  const startSessionMutation = useMutation({
    mutationFn: async () => {
      const startedAt = new Date().toISOString();
      const { data, error } = await supabase
        .from('kick_counts')
        .insert({
          pregnancy_id: pregnancyId!,
          owner_id: userId!,
          started_at: startedAt,
          count: 0,
        })
        .select()
        .single();
      if (error) throw error;
      return data as KickRow;
    },
    onSuccess: (row) => {
      startKickSession(row.id, pregnancyId!);
      queryClient.setQueryData<KickRow[]>(
        [KICKS_KEY, pregnancyId],
        (prev) => [row, ...(prev ?? [])],
      );
    },
  });

  // Save (end) a session — sets ended_at and final count
  const endSessionMutation = useMutation({
    mutationFn: async ({
      sessionId,
      count,
      note,
    }: {
      sessionId: string;
      count: number;
      note?: string;
    }) => {
      const { data, error } = await supabase
        .from('kick_counts')
        .update({
          ended_at: new Date().toISOString(),
          count,
          note: note ?? null,
        })
        .eq('id', sessionId)
        .select()
        .single();
      if (error) throw error;
      return data as KickRow;
    },
    onSuccess: (updated) => {
      cancelKickSession();
      queryClient.setQueryData<KickRow[]>(
        [KICKS_KEY, pregnancyId],
        (prev) =>
          prev?.map((k) => (k.id === updated.id ? updated : k)) ?? [updated],
      );
    },
  });

  // Delete a completed session from history
  const deleteSessionMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      const { error } = await supabase
        .from('kick_counts')
        .delete()
        .eq('id', sessionId);
      if (error) throw error;
      return sessionId;
    },
    onSuccess: (sessionId) => {
      queryClient.setQueryData<KickRow[]>(
        [KICKS_KEY, pregnancyId],
        (prev) => prev?.filter((k) => k.id !== sessionId) ?? [],
      );
    },
  });

  // Cancel an in-progress session (deletes the placeholder row)
  const cancelSessionMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      const { error } = await supabase
        .from('kick_counts')
        .delete()
        .eq('id', sessionId);
      if (error) throw error;
      return sessionId;
    },
    onSuccess: (sessionId) => {
      cancelKickSession();
      queryClient.setQueryData<KickRow[]>(
        [KICKS_KEY, pregnancyId],
        (prev) => prev?.filter((k) => k.id !== sessionId) ?? [],
      );
    },
  });

  /**
   * Determine if a completed session is below the kick threshold.
   * Returns true if the session lasted <= 2h and count < 10.
   */
  function isSessionLowKick(session: KickRow): boolean {
    if (!session.ended_at) return false;
    const durationMs =
      new Date(session.ended_at).getTime() -
      new Date(session.started_at).getTime();
    const durationHours = durationMs / (1000 * 60 * 60);
    return (
      durationHours <= KICK_SESSION_DURATION_HOURS &&
      session.count < KICK_RISK_THRESHOLD
    );
  }

  // Today's sessions
  const today = new Date().toDateString();
  const todaySessions = (listQuery.data ?? []).filter(
    (k) => new Date(k.started_at).toDateString() === today,
  );
  const todayKickCount = todaySessions.reduce((sum, s) => sum + s.count, 0);

  return {
    sessions: listQuery.data ?? [],
    todaySessions,
    todayKickCount,
    isLoading: listQuery.isLoading,
    error: listQuery.error,
    startSession: startSessionMutation.mutateAsync,
    isStarting: startSessionMutation.isPending,
    endSession: endSessionMutation.mutateAsync,
    isEnding: endSessionMutation.isPending,
    cancelSession: cancelSessionMutation.mutateAsync,
    isCancelling: cancelSessionMutation.isPending,
    deleteSession: deleteSessionMutation.mutateAsync,
    isDeleting: deleteSessionMutation.isPending,
    isSessionLowKick,
  };
}

export default useKickCounts;
