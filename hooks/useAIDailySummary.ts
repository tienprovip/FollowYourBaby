import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

// ---------------------------------------------------------------------------
// useAIDailySummary
// Client hook for the `ai-summary` Edge Function. Caches results via TanStack
// Query so the same (baby/pregnancy, period, date) tuple is not regenerated
// every screen mount.
// ---------------------------------------------------------------------------

export type Period = 'daily' | 'weekly' | 'monthly';
export type RiskLevel = 'green' | 'yellow' | 'red';

export interface SummaryResult {
  summary: string;
  highlights: string[];
  risk_level: RiskLevel;
  action_items: string[];
}

export interface UseAIDailySummaryOptions {
  babyId?: string | null;
  pregnancyId?: string | null;
  period?: Period;
  date?: string;          // ISO date, defaults to today server-side
  enabled?: boolean;
}

export function useAIDailySummary(options: UseAIDailySummaryOptions = {}) {
  const {
    babyId = null,
    pregnancyId = null,
    period = 'daily',
    date,
    enabled = true,
  } = options;

  const queryKey = ['ai_summary', period, babyId, pregnancyId, date ?? 'today'];

  const query = useQuery({
    queryKey,
    enabled: enabled && Boolean(babyId || pregnancyId),
    staleTime: 1000 * 60 * 30, // 30 min — summaries change slowly within a day
    queryFn: async (): Promise<SummaryResult> => {
      const { data, error } = await supabase.functions.invoke<SummaryResult & { error?: string }>('ai-summary', {
        body: {
          period,
          baby_id: babyId,
          pregnancy_id: pregnancyId,
          date,
        },
      });
      if (error) throw new Error(error.message);
      if (!data) throw new Error('Không nhận được tóm tắt từ trợ lý.');
      if (data.error) throw new Error(data.error);
      return {
        summary: data.summary,
        highlights: data.highlights ?? [],
        risk_level: data.risk_level,
        action_items: data.action_items ?? [],
      };
    },
  });

  return {
    summary: query.data?.summary ?? '',
    highlights: query.data?.highlights ?? [],
    riskLevel: query.data?.risk_level ?? ('green' as RiskLevel),
    actionItems: query.data?.action_items ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  };
}
