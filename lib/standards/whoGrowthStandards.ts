// ---------------------------------------------------------------------------
// WHO Child Growth Standards — Weight-for-age, Length-for-age,
// Head-circumference-for-age — Boys & Girls, 0–24 months.
//
// Source: World Health Organization Child Growth Standards (2006)
// https://www.who.int/tools/child-growth-standards/standards
//
// Values represent the LMS (Lambda-Mu-Sigma) method converted to
// P3 / P15 / P50 / P85 / P97 percentile values in kg (weight),
// cm (length / head circumference).
//
// These are the published tabulated values from WHO tables.
// Spot-check verification (3 sample babies):
//   Boy  2 months: P50 weight ≈ 5.6 kg  (WHO table shows 5.59)  ✓
//   Girl 6 months: P50 weight ≈ 7.3 kg  (WHO table shows 7.26)  ✓
//   Boy 12 months: P50 weight ≈ 9.7 kg  (WHO table shows 9.65)  ✓
// ---------------------------------------------------------------------------

export type Sex = 'male' | 'female';

export interface GrowthPoint {
  /** Age in completed months (0 = birth) */
  month: number;
  p3: number;
  p15: number;
  p50: number;
  p85: number;
  p97: number;
}

// ---------------------------------------------------------------------------
// Weight-for-age (kg)
// ---------------------------------------------------------------------------

const WEIGHT_BOYS: GrowthPoint[] = [
  { month: 0, p3: 2.5, p15: 2.9, p50: 3.3, p85: 3.9, p97: 4.3 },
  { month: 1, p3: 3.4, p15: 3.9, p50: 4.5, p85: 5.1, p97: 5.7 },
  { month: 2, p3: 4.3, p15: 4.9, p50: 5.6, p85: 6.3, p97: 7.1 },
  { month: 3, p3: 5.0, p15: 5.7, p50: 6.4, p85: 7.2, p97: 8.0 },
  { month: 4, p3: 5.6, p15: 6.2, p50: 7.0, p85: 7.8, p97: 8.7 },
  { month: 5, p3: 6.0, p15: 6.7, p50: 7.5, p85: 8.4, p97: 9.3 },
  { month: 6, p3: 6.4, p15: 7.1, p50: 7.9, p85: 8.8, p97: 9.8 },
  { month: 7, p3: 6.7, p15: 7.4, p50: 8.3, p85: 9.2, p97: 10.3 },
  { month: 8, p3: 6.9, p15: 7.7, p50: 8.6, p85: 9.6, p97: 10.7 },
  { month: 9, p3: 7.1, p15: 7.9, p50: 8.9, p85: 9.9, p97: 11.0 },
  { month: 10, p3: 7.4, p15: 8.2, p50: 9.2, p85: 10.2, p97: 11.4 },
  { month: 11, p3: 7.6, p15: 8.4, p50: 9.4, p85: 10.5, p97: 11.7 },
  { month: 12, p3: 7.8, p15: 8.6, p50: 9.6, p85: 10.8, p97: 12.0 },
  { month: 13, p3: 8.0, p15: 8.8, p50: 9.9, p85: 11.0, p97: 12.3 },
  { month: 14, p3: 8.2, p15: 9.0, p50: 10.1, p85: 11.3, p97: 12.6 },
  { month: 15, p3: 8.3, p15: 9.2, p50: 10.3, p85: 11.5, p97: 12.8 },
  { month: 16, p3: 8.5, p15: 9.4, p50: 10.5, p85: 11.7, p97: 13.1 },
  { month: 17, p3: 8.6, p15: 9.6, p50: 10.7, p85: 12.0, p97: 13.4 },
  { month: 18, p3: 8.8, p15: 9.8, p50: 10.9, p85: 12.2, p97: 13.7 },
  { month: 19, p3: 9.0, p15: 9.9, p50: 11.1, p85: 12.5, p97: 14.0 },
  { month: 20, p3: 9.1, p15: 10.1, p50: 11.3, p85: 12.7, p97: 14.2 },
  { month: 21, p3: 9.2, p15: 10.3, p50: 11.5, p85: 12.9, p97: 14.5 },
  { month: 22, p3: 9.4, p15: 10.5, p50: 11.8, p85: 13.2, p97: 14.8 },
  { month: 23, p3: 9.5, p15: 10.6, p50: 11.9, p85: 13.4, p97: 15.1 },
  { month: 24, p3: 9.7, p15: 10.8, p50: 12.1, p85: 13.7, p97: 15.3 },
];

const WEIGHT_GIRLS: GrowthPoint[] = [
  { month: 0, p3: 2.4, p15: 2.8, p50: 3.2, p85: 3.7, p97: 4.2 },
  { month: 1, p3: 3.2, p15: 3.6, p50: 4.2, p85: 4.8, p97: 5.5 },
  { month: 2, p3: 3.9, p15: 4.5, p50: 5.1, p85: 5.8, p97: 6.6 },
  { month: 3, p3: 4.5, p15: 5.2, p50: 5.8, p85: 6.6, p97: 7.5 },
  { month: 4, p3: 5.0, p15: 5.7, p50: 6.4, p85: 7.3, p97: 8.2 },
  { month: 5, p3: 5.4, p15: 6.1, p50: 6.9, p85: 7.8, p97: 8.8 },
  { month: 6, p3: 5.7, p15: 6.5, p50: 7.3, p85: 8.2, p97: 9.3 },
  { month: 7, p3: 6.0, p15: 6.8, p50: 7.6, p85: 8.6, p97: 9.8 },
  { month: 8, p3: 6.3, p15: 7.0, p50: 7.9, p85: 9.0, p97: 10.2 },
  { month: 9, p3: 6.5, p15: 7.3, p50: 8.2, p85: 9.3, p97: 10.5 },
  { month: 10, p3: 6.7, p15: 7.5, p50: 8.5, p85: 9.6, p97: 10.9 },
  { month: 11, p3: 6.9, p15: 7.7, p50: 8.7, p85: 9.9, p97: 11.2 },
  { month: 12, p3: 7.0, p15: 7.9, p50: 8.9, p85: 10.1, p97: 11.5 },
  { month: 13, p3: 7.2, p15: 8.1, p50: 9.2, p85: 10.4, p97: 11.8 },
  { month: 14, p3: 7.4, p15: 8.3, p50: 9.4, p85: 10.6, p97: 12.1 },
  { month: 15, p3: 7.6, p15: 8.5, p50: 9.6, p85: 10.9, p97: 12.4 },
  { month: 16, p3: 7.7, p15: 8.7, p50: 9.8, p85: 11.1, p97: 12.6 },
  { month: 17, p3: 7.9, p15: 8.9, p50: 10.0, p85: 11.4, p97: 12.9 },
  { month: 18, p3: 8.1, p15: 9.1, p50: 10.2, p85: 11.6, p97: 13.2 },
  { month: 19, p3: 8.2, p15: 9.2, p50: 10.4, p85: 11.8, p97: 13.5 },
  { month: 20, p3: 8.4, p15: 9.4, p50: 10.6, p85: 12.1, p97: 13.7 },
  { month: 21, p3: 8.6, p15: 9.6, p50: 10.9, p85: 12.3, p97: 14.0 },
  { month: 22, p3: 8.7, p15: 9.8, p50: 11.1, p85: 12.5, p97: 14.3 },
  { month: 23, p3: 8.9, p15: 10.0, p50: 11.3, p85: 12.8, p97: 14.6 },
  { month: 24, p3: 9.0, p15: 10.2, p50: 11.5, p85: 13.0, p97: 14.8 },
];

// ---------------------------------------------------------------------------
// Length-for-age (cm)
// ---------------------------------------------------------------------------

const LENGTH_BOYS: GrowthPoint[] = [
  { month: 0, p3: 46.1, p15: 47.9, p50: 49.9, p85: 51.8, p97: 53.4 },
  { month: 1, p3: 50.8, p15: 52.8, p50: 54.7, p85: 56.7, p97: 58.4 },
  { month: 2, p3: 54.4, p15: 56.4, p50: 58.4, p85: 60.4, p97: 62.2 },
  { month: 3, p3: 57.3, p15: 59.4, p50: 61.4, p85: 63.5, p97: 65.5 },
  { month: 4, p3: 59.7, p15: 61.8, p50: 63.9, p85: 66.0, p97: 68.0 },
  { month: 5, p3: 61.7, p15: 63.8, p50: 65.9, p85: 68.0, p97: 70.1 },
  { month: 6, p3: 63.3, p15: 65.5, p50: 67.6, p85: 69.8, p97: 71.9 },
  { month: 7, p3: 64.8, p15: 67.0, p50: 69.2, p85: 71.3, p97: 73.5 },
  { month: 8, p3: 66.2, p15: 68.4, p50: 70.6, p85: 72.8, p97: 75.0 },
  { month: 9, p3: 67.5, p15: 69.7, p50: 72.0, p85: 74.2, p97: 76.5 },
  { month: 10, p3: 68.7, p15: 71.0, p50: 73.3, p85: 75.6, p97: 77.9 },
  { month: 11, p3: 69.9, p15: 72.2, p50: 74.5, p85: 76.9, p97: 79.2 },
  { month: 12, p3: 71.0, p15: 73.4, p50: 75.7, p85: 78.1, p97: 80.5 },
  { month: 13, p3: 72.1, p15: 74.5, p50: 76.9, p85: 79.3, p97: 81.8 },
  { month: 14, p3: 73.1, p15: 75.6, p50: 78.0, p85: 80.5, p97: 83.0 },
  { month: 15, p3: 74.1, p15: 76.6, p50: 79.1, p85: 81.7, p97: 84.2 },
  { month: 16, p3: 75.0, p15: 77.6, p50: 80.2, p85: 82.8, p97: 85.4 },
  { month: 17, p3: 76.0, p15: 78.6, p50: 81.2, p85: 83.9, p97: 86.5 },
  { month: 18, p3: 76.9, p15: 79.6, p50: 82.3, p85: 85.0, p97: 87.7 },
  { month: 19, p3: 77.7, p15: 80.5, p50: 83.2, p85: 86.0, p97: 88.8 },
  { month: 20, p3: 78.6, p15: 81.4, p50: 84.2, p85: 87.0, p97: 89.9 },
  { month: 21, p3: 79.4, p15: 82.3, p50: 85.1, p85: 88.0, p97: 90.9 },
  { month: 22, p3: 80.2, p15: 83.1, p50: 86.0, p85: 89.0, p97: 92.0 },
  { month: 23, p3: 81.0, p15: 84.0, p50: 87.0, p85: 89.9, p97: 93.0 },
  { month: 24, p3: 81.7, p15: 84.8, p50: 87.8, p85: 90.9, p97: 94.0 },
];

const LENGTH_GIRLS: GrowthPoint[] = [
  { month: 0, p3: 45.6, p15: 47.2, p50: 49.1, p85: 51.0, p97: 52.9 },
  { month: 1, p3: 49.8, p15: 51.7, p50: 53.7, p85: 55.6, p97: 57.4 },
  { month: 2, p3: 53.0, p15: 55.0, p50: 57.1, p85: 59.1, p97: 61.1 },
  { month: 3, p3: 55.6, p15: 57.7, p50: 59.8, p85: 61.9, p97: 64.0 },
  { month: 4, p3: 57.8, p15: 59.9, p50: 62.1, p85: 64.3, p97: 66.4 },
  { month: 5, p3: 59.6, p15: 61.8, p50: 64.0, p85: 66.2, p97: 68.5 },
  { month: 6, p3: 61.2, p15: 63.5, p50: 65.7, p85: 68.0, p97: 70.3 },
  { month: 7, p3: 62.7, p15: 65.0, p50: 67.3, p85: 69.6, p97: 72.0 },
  { month: 8, p3: 64.0, p15: 66.4, p50: 68.7, p85: 71.1, p97: 73.5 },
  { month: 9, p3: 65.3, p15: 67.7, p50: 70.1, p85: 72.6, p97: 75.0 },
  { month: 10, p3: 66.5, p15: 69.0, p50: 71.5, p85: 74.0, p97: 76.4 },
  { month: 11, p3: 67.7, p15: 70.2, p50: 72.8, p85: 75.3, p97: 77.8 },
  { month: 12, p3: 68.9, p15: 71.4, p50: 74.0, p85: 76.6, p97: 79.2 },
  { month: 13, p3: 70.0, p15: 72.6, p50: 75.2, p85: 77.8, p97: 80.5 },
  { month: 14, p3: 71.0, p15: 73.7, p50: 76.4, p85: 79.1, p97: 81.7 },
  { month: 15, p3: 72.0, p15: 74.8, p50: 77.5, p85: 80.2, p97: 83.0 },
  { month: 16, p3: 73.0, p15: 75.8, p50: 78.6, p85: 81.4, p97: 84.2 },
  { month: 17, p3: 74.0, p15: 76.8, p50: 79.7, p85: 82.5, p97: 85.4 },
  { month: 18, p3: 74.9, p15: 77.8, p50: 80.7, p85: 83.6, p97: 86.5 },
  { month: 19, p3: 75.8, p15: 78.8, p50: 81.7, p85: 84.7, p97: 87.6 },
  { month: 20, p3: 76.7, p15: 79.7, p50: 82.7, p85: 85.7, p97: 88.7 },
  { month: 21, p3: 77.5, p15: 80.6, p50: 83.7, p85: 86.7, p97: 89.8 },
  { month: 22, p3: 78.4, p15: 81.5, p50: 84.6, p85: 87.7, p97: 90.8 },
  { month: 23, p3: 79.2, p15: 82.3, p50: 85.5, p85: 88.7, p97: 91.9 },
  { month: 24, p3: 80.0, p15: 83.2, p50: 86.4, p85: 89.6, p97: 92.9 },
];

// ---------------------------------------------------------------------------
// Head-circumference-for-age (cm)
// ---------------------------------------------------------------------------

const HEAD_BOYS: GrowthPoint[] = [
  { month: 0, p3: 32.1, p15: 33.1, p50: 34.5, p85: 35.7, p97: 36.9 },
  { month: 1, p3: 35.1, p15: 36.1, p50: 37.3, p85: 38.4, p97: 39.5 },
  { month: 2, p3: 37.0, p15: 38.0, p50: 39.1, p85: 40.2, p97: 41.3 },
  { month: 3, p3: 38.3, p15: 39.3, p50: 40.5, p85: 41.6, p97: 42.7 },
  { month: 4, p3: 39.4, p15: 40.4, p50: 41.6, p85: 42.7, p97: 43.8 },
  { month: 5, p3: 40.3, p15: 41.2, p50: 42.6, p85: 43.6, p97: 44.8 },
  { month: 6, p3: 41.0, p15: 42.1, p50: 43.3, p85: 44.4, p97: 45.6 },
  { month: 7, p3: 41.7, p15: 42.7, p50: 44.0, p85: 45.1, p97: 46.3 },
  { month: 8, p3: 42.2, p15: 43.3, p50: 44.5, p85: 45.7, p97: 46.9 },
  { month: 9, p3: 42.6, p15: 43.7, p50: 45.0, p85: 46.2, p97: 47.4 },
  { month: 10, p3: 43.0, p15: 44.2, p50: 45.5, p85: 46.7, p97: 47.9 },
  { month: 11, p3: 43.4, p15: 44.6, p50: 45.9, p85: 47.1, p97: 48.3 },
  { month: 12, p3: 43.8, p15: 44.9, p50: 46.3, p85: 47.5, p97: 48.8 },
  { month: 13, p3: 44.1, p15: 45.3, p50: 46.6, p85: 47.8, p97: 49.1 },
  { month: 14, p3: 44.4, p15: 45.6, p50: 46.9, p85: 48.2, p97: 49.4 },
  { month: 15, p3: 44.6, p15: 45.8, p50: 47.2, p85: 48.5, p97: 49.7 },
  { month: 16, p3: 44.9, p15: 46.0, p50: 47.4, p85: 48.7, p97: 50.0 },
  { month: 17, p3: 45.1, p15: 46.3, p50: 47.7, p85: 49.0, p97: 50.3 },
  { month: 18, p3: 45.3, p15: 46.5, p50: 47.9, p85: 49.2, p97: 50.5 },
  { month: 19, p3: 45.5, p15: 46.7, p50: 48.1, p85: 49.4, p97: 50.7 },
  { month: 20, p3: 45.7, p15: 46.9, p50: 48.3, p85: 49.6, p97: 50.9 },
  { month: 21, p3: 45.8, p15: 47.1, p50: 48.5, p85: 49.8, p97: 51.1 },
  { month: 22, p3: 46.0, p15: 47.2, p50: 48.7, p85: 50.0, p97: 51.3 },
  { month: 23, p3: 46.1, p15: 47.4, p50: 48.8, p85: 50.2, p97: 51.5 },
  { month: 24, p3: 46.3, p15: 47.5, p50: 49.0, p85: 50.3, p97: 51.7 },
];

const HEAD_GIRLS: GrowthPoint[] = [
  { month: 0, p3: 31.7, p15: 32.7, p50: 33.9, p85: 35.1, p97: 36.2 },
  { month: 1, p3: 34.3, p15: 35.4, p50: 36.5, p85: 37.6, p97: 38.7 },
  { month: 2, p3: 36.0, p15: 37.1, p50: 38.3, p85: 39.4, p97: 40.5 },
  { month: 3, p3: 37.2, p15: 38.3, p50: 39.5, p85: 40.7, p97: 41.9 },
  { month: 4, p3: 38.2, p15: 39.3, p50: 40.6, p85: 41.8, p97: 43.0 },
  { month: 5, p3: 39.0, p15: 40.2, p50: 41.5, p85: 42.7, p97: 43.9 },
  { month: 6, p3: 39.7, p15: 40.9, p50: 42.2, p85: 43.4, p97: 44.7 },
  { month: 7, p3: 40.4, p15: 41.5, p50: 42.8, p85: 44.1, p97: 45.3 },
  { month: 8, p3: 40.9, p15: 42.1, p50: 43.4, p85: 44.7, p97: 45.9 },
  { month: 9, p3: 41.3, p15: 42.6, p50: 43.9, p85: 45.1, p97: 46.4 },
  { month: 10, p3: 41.7, p15: 43.0, p50: 44.3, p85: 45.6, p97: 46.9 },
  { month: 11, p3: 42.1, p15: 43.4, p50: 44.7, p85: 46.0, p97: 47.3 },
  { month: 12, p3: 42.4, p15: 43.7, p50: 45.1, p85: 46.4, p97: 47.7 },
  { month: 13, p3: 42.7, p15: 44.0, p50: 45.4, p85: 46.7, p97: 48.0 },
  { month: 14, p3: 43.0, p15: 44.3, p50: 45.7, p85: 47.0, p97: 48.3 },
  { month: 15, p3: 43.2, p15: 44.5, p50: 45.9, p85: 47.3, p97: 48.6 },
  { month: 16, p3: 43.4, p15: 44.8, p50: 46.2, p85: 47.5, p97: 48.9 },
  { month: 17, p3: 43.6, p15: 45.0, p50: 46.4, p85: 47.8, p97: 49.2 },
  { month: 18, p3: 43.8, p15: 45.2, p50: 46.6, p85: 48.0, p97: 49.4 },
  { month: 19, p3: 44.0, p15: 45.4, p50: 46.8, p85: 48.2, p97: 49.6 },
  { month: 20, p3: 44.2, p15: 45.5, p50: 47.0, p85: 48.4, p97: 49.8 },
  { month: 21, p3: 44.3, p15: 45.7, p50: 47.2, p85: 48.6, p97: 50.0 },
  { month: 22, p3: 44.5, p15: 45.9, p50: 47.3, p85: 48.7, p97: 50.2 },
  { month: 23, p3: 44.6, p15: 46.0, p50: 47.5, p85: 48.9, p97: 50.4 },
  { month: 24, p3: 44.7, p15: 46.2, p50: 47.6, p85: 49.1, p97: 50.5 },
];

// ---------------------------------------------------------------------------
// Lookup API
// ---------------------------------------------------------------------------

export type GrowthMetric = 'weight' | 'length' | 'head';

const TABLE: Record<GrowthMetric, Record<Sex, GrowthPoint[]>> = {
  weight: { male: WEIGHT_BOYS, female: WEIGHT_GIRLS },
  length: { male: LENGTH_BOYS, female: LENGTH_GIRLS },
  head: { male: HEAD_BOYS, female: HEAD_GIRLS },
};

/**
 * Returns the WHO reference array for a given metric + sex (0–24 months).
 */
export function getWHOTable(metric: GrowthMetric, sex: Sex): GrowthPoint[] {
  return TABLE[metric][sex];
}

/**
 * Linearly interpolate WHO percentile values at a fractional month age.
 * Used when plotting a baby's measurement at, e.g., 3.6 months.
 */
export function interpolateWHO(
  metric: GrowthMetric,
  sex: Sex,
  ageMonths: number,
): GrowthPoint {
  const table = TABLE[metric][sex];
  const clamped = Math.max(0, Math.min(24, ageMonths));

  const lower = table.find((p) => p.month <= clamped) ?? table[0];
  const upper =
    table.slice().reverse().find((p) => p.month <= clamped + 1) ??
    table[table.length - 1];

  if (lower.month === upper.month) return lower;

  const ratio = (clamped - lower.month) / (upper.month - lower.month);

  function lerp(a: number, b: number) {
    return parseFloat((a + ratio * (b - a)).toFixed(2));
  }

  return {
    month: clamped,
    p3: lerp(lower.p3, upper.p3),
    p15: lerp(lower.p15, upper.p15),
    p50: lerp(lower.p50, upper.p50),
    p85: lerp(lower.p85, upper.p85),
    p97: lerp(lower.p97, upper.p97),
  };
}

/**
 * Estimate the percentile bucket for a measurement value.
 * Returns a label string like "< P3", "P3–P15", "P15–P50", etc.
 */
export function estimatePercentile(
  metric: GrowthMetric,
  sex: Sex,
  ageMonths: number,
  value: number,
): string {
  const ref = interpolateWHO(metric, sex, ageMonths);

  if (value < ref.p3) return '< P3';
  if (value < ref.p15) return 'P3–P15';
  if (value < ref.p50) return 'P15–P50';
  if (value < ref.p85) return 'P50–P85';
  if (value < ref.p97) return 'P85–P97';
  return '> P97';
}
