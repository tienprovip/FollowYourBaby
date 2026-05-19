import { useBaby } from './useBaby';
import { useFeedLogs } from './useFeedLogs';
import { useSleepLogs } from './useSleepLogs';
import { useDiaperLogs } from './useDiaperLogs';
import { useGrowthLogs } from './useGrowthLogs';
import { useMilestones } from './useMilestones';
import { useActivePregnancy } from './usePregnancy';
import { useKickCounts } from './useKickCounts';
import { usePregnancyWeights } from './usePregnancyWeights';
import { usePregnancySymptoms } from './usePregnancySymptoms';
import { usePrenatalVisits } from './usePrenatalVisits';

export type ActiveContext = 'baby' | 'pregnancy' | 'none';

export function useDashboardData() {
  const { baby, isLoading: babyLoading } = useBaby();
  const { pregnancy, isLoading: pregnancyLoading } = useActivePregnancy();

  const babyAgeMonths = baby?.ageInMonthsDecimal ?? 0;

  const feeds = useFeedLogs();
  const sleeps = useSleepLogs();
  const diapers = useDiaperLogs();
  const growth = useGrowthLogs(baby?.sex, baby?.dob);
  const milestones = useMilestones(babyAgeMonths);

  const kicks = useKickCounts(pregnancy?.id ?? null);
  const pregnancyWeights = usePregnancyWeights(pregnancy?.id ?? null);
  const pregnancySymptoms = usePregnancySymptoms(pregnancy?.id ?? null);
  const prenatalVisits = usePrenatalVisits(pregnancy?.id ?? null);

  const activeContext: ActiveContext = baby
    ? 'baby'
    : pregnancy
    ? 'pregnancy'
    : 'none';

  const isLoading = babyLoading || pregnancyLoading;

  return {
    activeContext,
    baby,
    pregnancy,
    isLoading,
    feeds,
    sleeps,
    diapers,
    growth,
    milestones,
    kicks,
    pregnancyWeights,
    pregnancySymptoms,
    prenatalVisits,
  };
}
