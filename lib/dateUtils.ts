/**
 * Format a Date as YYYY-MM-DD using LOCAL timezone.
 * Never use toISOString() for date-only fields — it converts to UTC first,
 * causing off-by-one errors for users in UTC+7 (Vietnam).
 */
export function toLocalDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Parse a YYYY-MM-DD string into a local midnight Date.
 * new Date('YYYY-MM-DD') treats the string as UTC midnight — wrong for local display.
 */
export function fromLocalDateStr(iso: string | null | undefined): Date | undefined {
  if (!iso) return undefined;
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d);
}
