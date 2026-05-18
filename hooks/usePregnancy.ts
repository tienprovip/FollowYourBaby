import { useMemo } from 'react';
import { differenceInDays, differenceInWeeks, parseISO } from 'date-fns';
import { usePregnancies } from './usePregnancies';
import { useBabyStore } from '@/stores/babyStore';
import type { Database } from '@/types/database';

type PregnancyRow = Database['public']['Tables']['pregnancies']['Row'];

// ---------------------------------------------------------------------------
// Pregnancy week calculation helpers
// ---------------------------------------------------------------------------

export function calculatePregnancyWeek(
  lmpDate: string | null,
  dueDate: string | null,
): number {
  const now = new Date();

  if (lmpDate) {
    const lmp = parseISO(lmpDate);
    const days = differenceInDays(now, lmp);
    return Math.max(0, Math.min(42, Math.floor(days / 7)));
  }

  if (dueDate) {
    const due = parseISO(dueDate);
    const weeksRemaining = differenceInWeeks(due, now);
    return Math.max(0, Math.min(42, 40 - weeksRemaining));
  }

  return 0;
}

export function calculateDaysUntilDue(dueDate: string | null): number | null {
  if (!dueDate) return null;
  const due = parseISO(dueDate);
  const days = differenceInDays(due, new Date());
  return days;
}

// ---------------------------------------------------------------------------
// useActivePregnancy — resolves the active pregnancy record + computed fields
// ---------------------------------------------------------------------------

export interface ActivePregnancy extends PregnancyRow {
  currentWeek: number;
  daysUntilDue: number | null;
  trimester: 1 | 2 | 3;
}

export function useActivePregnancy() {
  const { pregnancies, isLoading, error } = usePregnancies();
  const { activePregnancyId } = useBabyStore();

  const activePregnancy = useMemo<ActivePregnancy | null>(() => {
    if (!pregnancies.length) return null;

    // Prefer the stored active pregnancy ID; fall back to first active one
    const base =
      (activePregnancyId
        ? pregnancies.find((p) => p.id === activePregnancyId && p.status === 'active')
        : null) ?? pregnancies.find((p) => p.status === 'active') ?? null;

    if (!base) return null;

    const currentWeek = calculatePregnancyWeek(base.lmp_date, base.due_date);
    const daysUntilDue = calculateDaysUntilDue(base.due_date);
    const trimester: 1 | 2 | 3 =
      currentWeek < 14 ? 1 : currentWeek < 28 ? 2 : 3;

    return { ...base, currentWeek, daysUntilDue, trimester };
  }, [pregnancies, activePregnancyId]);

  return {
    pregnancy: activePregnancy,
    isLoading,
    error,
    hasActivePregnancy: activePregnancy !== null,
  };
}

export default useActivePregnancy;
