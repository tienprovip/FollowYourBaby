import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import { useBabyStore } from '@/stores/babyStore';
import { startOfMonth, subMonths, parseISO, differenceInMinutes } from 'date-fns';
import { useGrowthLogs } from './useGrowthLogs';
import { useKickCounts } from './useKickCounts';
import { usePregnancyWeights } from './usePregnancyWeights';
import type { Database } from '@/types/database';

type FeedLog = Database['public']['Tables']['feed_logs']['Row'];
type SleepLog = Database['public']['Tables']['sleep_logs']['Row'];
type DiaperLog = Database['public']['Tables']['diaper_logs']['Row'];

export interface WeekSummary {
  weekLabel: string;
  feedCount: number;
  feedMl: number;
  sleepMinutes: number;
  diaperCount: number;
}

function sleepDuration(log: SleepLog): number {
  if (!log.ended_at) return 0;
  return differenceInMinutes(parseISO(log.ended_at), parseISO(log.started_at));
}

export function useMonthlyAggregate(
  pregnancyId: string | null,
  babySex?: string | null,
  babyDob?: string | null,
) {
  const userId = useAuthStore((s) => s.user?.id);
  const { activeBabyId } = useBabyStore();

  const monthStart = startOfMonth(new Date()).toISOString();
  const prevMonthStart = startOfMonth(subMonths(new Date(), 1)).toISOString();

  const feedQuery = useQuery({
    queryKey: ['feed_logs_month', activeBabyId, monthStart],
    enabled: Boolean(activeBabyId) && Boolean(userId),
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feed_logs')
        .select('*')
        .eq('baby_id', activeBabyId!)
        .gte('started_at', prevMonthStart)
        .order('started_at', { ascending: true });
      if (error) throw error;
      return data as FeedLog[];
    },
  });

  const sleepQuery = useQuery({
    queryKey: ['sleep_logs_month', activeBabyId, monthStart],
    enabled: Boolean(activeBabyId) && Boolean(userId),
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sleep_logs')
        .select('*')
        .eq('baby_id', activeBabyId!)
        .gte('started_at', prevMonthStart)
        .order('started_at', { ascending: true });
      if (error) throw error;
      return data as SleepLog[];
    },
  });

  const diaperQuery = useQuery({
    queryKey: ['diaper_logs_month', activeBabyId, monthStart],
    enabled: Boolean(activeBabyId) && Boolean(userId),
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('diaper_logs')
        .select('*')
        .eq('baby_id', activeBabyId!)
        .gte('recorded_at', prevMonthStart)
        .order('recorded_at', { ascending: true });
      if (error) throw error;
      return data as DiaperLog[];
    },
  });

  const growth = useGrowthLogs(babySex, babyDob);
  const pregnancyWeights = usePregnancyWeights(pregnancyId);
  const kicks = useKickCounts(pregnancyId);

  const weeklySummaries = useMemo<WeekSummary[]>(() => {
    const feeds = feedQuery.data ?? [];
    const sleeps = sleepQuery.data ?? [];
    const diapers = diaperQuery.data ?? [];

    const weeks: WeekSummary[] = [];
    const now = new Date();
    const startDay = startOfMonth(now);

    for (let weekIdx = 0; weekIdx < 4; weekIdx++) {
      const weekStart = new Date(startDay.getTime() + weekIdx * 7 * 86400000);
      const weekEnd = new Date(weekStart.getTime() + 7 * 86400000);
      const wStartIso = weekStart.toISOString();
      const wEndIso = weekEnd.toISOString();

      const wFeeds = feeds.filter(
        (l) => l.started_at >= wStartIso && l.started_at < wEndIso,
      );
      const wSleeps = sleeps.filter(
        (l) => l.started_at >= wStartIso && l.started_at < wEndIso,
      );
      const wDiapers = diapers.filter(
        (l) => l.recorded_at >= wStartIso && l.recorded_at < wEndIso,
      );

      weeks.push({
        weekLabel: `T${weekIdx + 1}`,
        feedCount: wFeeds.length,
        feedMl: wFeeds.reduce((s, l) => s + (l.amount_ml ?? 0), 0),
        sleepMinutes: wSleeps.reduce((s, l) => s + sleepDuration(l), 0),
        diaperCount: wDiapers.length,
      });
    }

    return weeks;
  }, [feedQuery.data, sleepQuery.data, diaperQuery.data]);

  const totalThisMonth = useMemo(() => {
    const feeds = feedQuery.data ?? [];
    const sleeps = sleepQuery.data ?? [];
    const diapers = diaperQuery.data ?? [];
    const monthIso = monthStart;

    const mFeeds = feeds.filter((l) => l.started_at >= monthIso);
    const mSleeps = sleeps.filter((l) => l.started_at >= monthIso);
    const mDiapers = diapers.filter((l) => l.recorded_at >= monthIso);

    return {
      feedCount: mFeeds.length,
      feedMl: mFeeds.reduce((s, l) => s + (l.amount_ml ?? 0), 0),
      sleepHours: Math.round(
        mSleeps.reduce((s, l) => s + sleepDuration(l), 0) / 60,
      ),
      diaperCount: mDiapers.length,
    };
  }, [feedQuery.data, sleepQuery.data, diaperQuery.data, monthStart]);

  const isLoading =
    feedQuery.isLoading ||
    sleepQuery.isLoading ||
    diaperQuery.isLoading ||
    growth.isLoading;

  return {
    weeklySummaries,
    totalThisMonth,
    growthLogs: growth.logs,
    latestGrowth: growth.latestLog,
    pregnancyWeights: pregnancyWeights.weights,
    kickSessions: kicks.sessions,
    isLoading,
  };
}
