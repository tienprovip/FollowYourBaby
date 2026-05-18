// ---------------------------------------------------------------------------
// Baby utility helpers — age calculation, duration formatting
// ---------------------------------------------------------------------------

import { differenceInDays, differenceInMonths } from 'date-fns';

/**
 * Returns the baby's age in completed months.
 */
export function babyAgeInMonths(dob: Date): number {
  return Math.max(0, differenceInMonths(new Date(), dob));
}

/**
 * Returns the baby's age in completed days.
 */
export function babyAgeInDays(dob: Date): number {
  return Math.max(0, differenceInDays(new Date(), dob));
}

/**
 * Human-readable age label in Vietnamese.
 * Examples:
 *   3 ngày tuổi
 *   2 tuần 4 ngày
 *   3 tháng 12 ngày
 *   1 năm 2 tháng
 */
export function babyAgeLabel(dob: Date): string {
  const totalDays = babyAgeInDays(dob);

  if (totalDays === 0) return 'Hôm nay';
  if (totalDays < 7) return `${totalDays} ngày tuổi`;

  if (totalDays < 30) {
    const weeks = Math.floor(totalDays / 7);
    const days = totalDays % 7;
    if (days === 0) return `${weeks} tuần tuổi`;
    return `${weeks} tuần ${days} ngày`;
  }

  const months = differenceInMonths(new Date(), dob);
  if (months < 12) {
    const remainingDays = totalDays - months * 30;
    const clampedDays = Math.max(0, Math.min(remainingDays, 29));
    if (clampedDays === 0) return `${months} tháng tuổi`;
    return `${months} tháng ${clampedDays} ngày`;
  }

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (remainingMonths === 0) return `${years} tuổi`;
  return `${years} năm ${remainingMonths} tháng`;
}

/**
 * Format a duration in milliseconds to a compact Vietnamese string.
 * Examples:
 *   3500 ms        → "3 giây"
 *   65000 ms       → "1p 5 giây"
 *   3723000 ms     → "1g 2p"
 */
export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    if (minutes === 0) return `${hours}g`;
    return `${hours}g ${minutes}p`;
  }
  if (minutes > 0) {
    if (seconds === 0) return `${minutes}p`;
    return `${minutes}p ${seconds}g`;
  }
  return `${seconds} giây`;
}

/**
 * Format a duration in seconds as HH:MM:SS for timer display.
 */
export function formatTimerDisplay(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const hh = String(h).padStart(2, '0');
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  if (h > 0) return `${hh}:${mm}:${ss}`;
  return `${mm}:${ss}`;
}

/**
 * Compute a baby's age in months (decimal) for WHO chart lookups.
 * More precise than integer months.
 */
export function babyAgeInMonthsDecimal(dob: Date): number {
  const days = babyAgeInDays(dob);
  return days / 30.4375; // average days per month
}
