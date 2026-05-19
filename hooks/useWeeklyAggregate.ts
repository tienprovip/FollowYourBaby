import { useMemo } from 'react';
import { startOfDay, subDays, parseISO, differenceInMinutes } from 'date-fns';
import { useFeedLogs } from './useFeedLogs';
import { useSleepLogs } from './useSleepLogs';
import { useDiaperLogs } from './useDiaperLogs';
import { useGrowthLogs } from './useGrowthLogs';
import { useKickCounts } from './useKickCounts';
import { usePregnancyWeights } from './usePregnancyWeights';
import { usePregnancySymptoms } from './usePregnancySymptoms';
import type { Database } from '@/types/database';

type SleepLog = Database['public']['Tables']['sleep_logs']['Row'];

export interface DayAggregate {
  date: string;
  feedCount: number;
  feedMl: number;
  sleepMinutes: number;
  diaperCount: number;
  kickCount: number;
  weightKg: number | null;
  symptomCount: number;
}

function sleepDuration(log: SleepLog): number {
  if (!log.ended_at) return 0;
  return differenceInMinutes(parseISO(log.ended_at), parseISO(log.started_at));
}

function toDateStr(iso: string): string {
  return iso.slice(0, 10);
}

export function useWeeklyAggregate(
  pregnancyId: string | null,
  babySex?: string | null,
  babyDob?: string | null,
) {
  const feeds = useFeedLogs();
  const sleeps = useSleepLogs();
  const diapers = useDiaperLogs();
  const growth = useGrowthLogs(babySex, babyDob);
  const kicks = useKickCounts(pregnancyId);
  const pregnancyWeights = usePregnancyWeights(pregnancyId);
  const pregnancySymptoms = usePregnancySymptoms(pregnancyId);

  const days = useMemo<DayAggregate[]>(() => {
    const result: DayAggregate[] = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const day = startOfDay(subDays(now, i));
      const dateStr = day.toISOString().slice(0, 10);
      const startIso = day.toISOString();
      const endIso = new Date(day.getTime() + 86400000).toISOString();

      const dayFeeds = feeds.logs.filter(
        (l) => l.started_at >= startIso && l.started_at < endIso,
      );
      const daySleeps = sleeps.logs.filter(
        (l) => l.started_at >= startIso && l.started_at < endIso,
      );
      const dayDiapers = diapers.logs.filter(
        (l) => l.recorded_at >= startIso && l.recorded_at < endIso,
      );
      const dayKicks = kicks.sessions.filter(
        (k) => k.started_at >= startIso && k.started_at < endIso,
      );
      const daySymptoms = pregnancySymptoms.symptoms.filter(
        (s) => s.recorded_at >= startIso && s.recorded_at < endIso,
      );

      const weightForDay =
        pregnancyWeights.weights.find((w) => toDateStr(w.recorded_at) === dateStr)
          ?.weight_kg ?? null;

      result.push({
        date: dateStr,
        feedCount: dayFeeds.length,
        feedMl: dayFeeds.reduce((s, l) => s + (l.amount_ml ?? 0), 0),
        sleepMinutes: daySleeps.reduce((s, l) => s + sleepDuration(l), 0),
        diaperCount: dayDiapers.length,
        kickCount: dayKicks.reduce((s, k) => s + k.count, 0),
        weightKg: weightForDay,
        symptomCount: daySymptoms.length,
      });
    }

    return result;
  }, [
    feeds.logs,
    sleeps.logs,
    diapers.logs,
    kicks.sessions,
    pregnancyWeights.weights,
    pregnancySymptoms.symptoms,
  ]);

  const latestGrowth = growth.latestLog;

  const isLoading =
    feeds.isLoading ||
    sleeps.isLoading ||
    diapers.isLoading ||
    growth.isLoading ||
    kicks.isLoading ||
    pregnancyWeights.isLoading ||
    pregnancySymptoms.isLoading;

  return { days, latestGrowth, isLoading };
}
