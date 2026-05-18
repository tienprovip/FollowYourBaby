// ---------------------------------------------------------------------------
// IOM 2009 Weight Gain Guidelines for Pregnancy
// Source: Institute of Medicine (IOM) 2009 — Weight Gain During Pregnancy
// https://www.ncbi.nlm.nih.gov/books/NBK32813/
//
// Each curve entry: { week, low_kg, high_kg } — cumulative gain from pre-pregnancy
// BMI categories:
//   underweight  : BMI < 18.5  → recommended total gain 12.5–18 kg
//   normal       : BMI 18.5–24.9 → recommended total gain 11.5–16 kg
//   overweight   : BMI 25–29.9 → recommended total gain 7–11.5 kg
//   obese        : BMI >= 30  → recommended total gain 5–9 kg
// ---------------------------------------------------------------------------

export type BmiCategory = 'underweight' | 'normal' | 'overweight' | 'obese';

export interface WeightGainPoint {
  week: number;
  low_kg: number;
  high_kg: number;
}

export function getBmiCategory(bmi: number): BmiCategory {
  if (bmi < 18.5) return 'underweight';
  if (bmi < 25) return 'normal';
  if (bmi < 30) return 'overweight';
  return 'obese';
}

// Linearly interpolated cumulative weight gain curves per IOM 2009
// Weeks 0–40. First trimester gain is minimal (0.5–2 kg total),
// then roughly linear in second and third trimesters.

const CURVES: Record<BmiCategory, WeightGainPoint[]> = {
  underweight: [
    { week: 0, low_kg: 0, high_kg: 0 },
    { week: 4, low_kg: 0.3, high_kg: 0.6 },
    { week: 8, low_kg: 0.6, high_kg: 1.2 },
    { week: 12, low_kg: 0.9, high_kg: 1.8 },
    { week: 16, low_kg: 2.5, high_kg: 4.0 },
    { week: 20, low_kg: 4.5, high_kg: 7.0 },
    { week: 24, low_kg: 6.5, high_kg: 10.0 },
    { week: 28, low_kg: 8.5, high_kg: 13.0 },
    { week: 32, low_kg: 10.0, high_kg: 15.0 },
    { week: 36, low_kg: 11.5, high_kg: 17.0 },
    { week: 40, low_kg: 12.5, high_kg: 18.0 },
  ],
  normal: [
    { week: 0, low_kg: 0, high_kg: 0 },
    { week: 4, low_kg: 0.3, high_kg: 0.5 },
    { week: 8, low_kg: 0.5, high_kg: 1.0 },
    { week: 12, low_kg: 0.8, high_kg: 1.5 },
    { week: 16, low_kg: 2.5, high_kg: 4.0 },
    { week: 20, low_kg: 4.0, high_kg: 6.5 },
    { week: 24, low_kg: 6.0, high_kg: 9.5 },
    { week: 28, low_kg: 7.5, high_kg: 12.0 },
    { week: 32, low_kg: 9.0, high_kg: 14.0 },
    { week: 36, low_kg: 10.5, high_kg: 15.5 },
    { week: 40, low_kg: 11.5, high_kg: 16.0 },
  ],
  overweight: [
    { week: 0, low_kg: 0, high_kg: 0 },
    { week: 4, low_kg: 0.2, high_kg: 0.4 },
    { week: 8, low_kg: 0.4, high_kg: 0.8 },
    { week: 12, low_kg: 0.6, high_kg: 1.2 },
    { week: 16, low_kg: 1.5, high_kg: 3.0 },
    { week: 20, low_kg: 2.5, high_kg: 5.0 },
    { week: 24, low_kg: 3.5, high_kg: 7.0 },
    { week: 28, low_kg: 5.0, high_kg: 9.0 },
    { week: 32, low_kg: 6.0, high_kg: 10.5 },
    { week: 36, low_kg: 6.5, high_kg: 11.0 },
    { week: 40, low_kg: 7.0, high_kg: 11.5 },
  ],
  obese: [
    { week: 0, low_kg: 0, high_kg: 0 },
    { week: 4, low_kg: 0.1, high_kg: 0.3 },
    { week: 8, low_kg: 0.3, high_kg: 0.6 },
    { week: 12, low_kg: 0.5, high_kg: 1.0 },
    { week: 16, low_kg: 1.0, high_kg: 2.5 },
    { week: 20, low_kg: 2.0, high_kg: 4.0 },
    { week: 24, low_kg: 3.0, high_kg: 6.0 },
    { week: 28, low_kg: 3.5, high_kg: 7.0 },
    { week: 32, low_kg: 4.0, high_kg: 8.0 },
    { week: 36, low_kg: 4.5, high_kg: 8.5 },
    { week: 40, low_kg: 5.0, high_kg: 9.0 },
  ],
};

/**
 * Get the weight gain curve for a given BMI category.
 * Returns the full array of { week, low_kg, high_kg } from week 0 to 40.
 */
export function getWeightGainCurve(category: BmiCategory): WeightGainPoint[] {
  return CURVES[category];
}

/**
 * Linearly interpolate the expected weight gain range at a given week.
 * Returns { low_kg, high_kg } cumulative gain from pre-pregnancy weight.
 */
export function interpolateWeightGain(
  week: number,
  category: BmiCategory,
): { low_kg: number; high_kg: number } {
  const curve = CURVES[category];
  const clampedWeek = Math.max(0, Math.min(40, week));

  // Find surrounding points
  let lower = curve[0];
  let upper = curve[curve.length - 1];

  for (let i = 0; i < curve.length - 1; i++) {
    if (curve[i].week <= clampedWeek && curve[i + 1].week >= clampedWeek) {
      lower = curve[i];
      upper = curve[i + 1];
      break;
    }
  }

  if (lower.week === upper.week) {
    return { low_kg: lower.low_kg, high_kg: lower.high_kg };
  }

  const ratio = (clampedWeek - lower.week) / (upper.week - lower.week);
  return {
    low_kg: parseFloat((lower.low_kg + ratio * (upper.low_kg - lower.low_kg)).toFixed(1)),
    high_kg: parseFloat((lower.high_kg + ratio * (upper.high_kg - lower.high_kg)).toFixed(1)),
  };
}
