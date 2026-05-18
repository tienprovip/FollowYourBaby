# Sprint 3 — Maternal Tracking Module

## What was built

### Screens

| File | Title | Description |
|---|---|---|
| `app/(tabs)/pregnancy.tsx` | Mẹ bầu (tab) | Pregnancy dashboard: current week, days to due date, today summary (weight/kicks/symptoms), quick-log row, next visit card, navigation links |
| `app/(maternal)/weight.tsx` | Cân nặng | Weight log list + SVG line chart overlaid with IOM 2009 standard gain curve; add + delete entries |
| `app/(maternal)/kick-counter.tsx` | Thai máy | Live kick counter: start session, tap-to-count with haptic feedback, running timer, save with risk check, session history |
| `app/(maternal)/symptoms.tsx` | Triệu chứng | Symptom picker with 13 Vietnamese symptom types, severity slider 1–5, risk evaluation per entry, day-grouped history |
| `app/(maternal)/prenatal-visits.tsx` | Lịch khám | Add/delete prenatal visits with type (checkup/ultrasound/test), date-time picker, location and notes; split upcoming/past lists |
| `app/(maternal)/medications.tsx` | Thuốc & Vitamin | Add/delete medications with times-per-day and specific time inputs; active vs stopped grouping |
| `app/(maternal)/_layout.tsx` | Stack layout | Shared header style for all maternal stack screens |

### Hooks

| File | Purpose |
|---|---|
| `hooks/usePregnancy.ts` | `useActivePregnancy` — resolves active pregnancy from store, computes `currentWeek`, `daysUntilDue`, `trimester`. Exports `calculatePregnancyWeek` helper. |
| `hooks/usePregnancyWeights.ts` | List + add + delete weight entries. Exposes `latestWeight`. |
| `hooks/useKickCounts.ts` | Start / end / cancel kick sessions. Exposes `todayKickCount`, `isSessionLowKick` risk check, constants `KICK_RISK_THRESHOLD` and `KICK_SESSION_DURATION_HOURS`. |
| `hooks/usePregnancySymptoms.ts` | List + add + delete symptoms. Exports `SYMPTOM_CATALOGUE`, `evaluateSymptomRisk`, `getSymptomInfo`, `RED_SYMPTOMS`. Computes `todayMaxRisk`. |
| `hooks/usePrenatalVisits.ts` | List + add + update + delete visits. Computes `upcomingVisits`, `pastVisits`, `nextVisit`. |
| `hooks/usePregnancyMedications.ts` | CRUD medications. Exports `MedicationSchedule` type. Computes `activeMedications`. |

### Components

| File | Purpose |
|---|---|
| `components/maternal/WeekBadge.tsx` | Large current-week display with trimester-colour coding |
| `components/maternal/SymptomChip.tsx` | Tappable symptom chip with inline severity 1–5 bar |
| `components/maternal/KickButton.tsx` | 200 px circular tap target with count display and expo-haptics medium impact feedback |
| `components/maternal/WeightChart.tsx` | react-native-svg line chart: actual weight gain vs IOM 2009 band (shaded area between low/high); current-week marker; legend |

### Store

`stores/maternalStore.ts` — Zustand store tracking the in-progress kick session (`sessionId`, `startedAt`, `count`, `isRunning`). Not persisted (session resets on app close — by design, a partial kick session is abandoned).

### Standard curves

`lib/standards/weightGainCurves.ts` — IOM 2009 recommended weight gain curves for four BMI categories (underweight / normal / overweight / obese), week 0–40. Exports `getWeightGainCurve`, `interpolateWeightGain`, `getBmiCategory`.

### Tab layout update

`app/(tabs)/_layout.tsx` — Added "Mẹ bầu" tab (PregnancyIcon) conditionally shown via `href: null` when `hasActivePregnancy` is false. Tab icon components moved to module scope to avoid S6478 inline-definition warning.

## Navigation

- Home tab → quick-action buttons navigate to `/(maternal)/weight`, `/(maternal)/kick-counter`, `/(maternal)/symptoms`, `/(maternal)/prenatal-visits`
- Pregnancy tab → same quick-action row + card links to `/(maternal)/medications`
- All maternal screens are in a Stack group `(maternal)` with a consistent peach-coloured header

## Key architectural decisions

1. **Kick session state is split**: the Supabase row is created immediately on "Start" (so a crash does not lose the session ID), but the live count lives in `maternalStore` for instant tap response. On save, `endSession` writes the final count to Supabase.

2. **Risk evaluation is pure and co-located with data**: `evaluateSymptomRisk` in `usePregnancySymptoms.ts` runs synchronously at render time — no Edge Function needed for basic symptom risk. Severe symptoms trigger an `Alert` immediately after save. The AI Edge Function will add deeper reasoning in Sprint 6.

3. **Weight chart uses no third-party chart library**: react-native-svg (already installed) drives the chart, keeping the bundle lean and giving full control over the IOM curve rendering.

4. **IOM curves are static data** in `lib/standards/weightGainCurves.ts`. Linear interpolation fills gaps between tabulated weeks. The user's BMI category defaults to `normal` and can be extended once the onboarding flow captures pre-pregnancy weight/height.

5. **Tabs hide gracefully**: if `hasActivePregnancy` is false, the Mẹ bầu tab is hidden (`href: null`) but the screen remains routable — future onboarding can deep-link directly.

## Limitations / known issues

- `WeightChart` approximates weeks for historical entries by evenly spacing them backwards from the current week. Exact week-per-entry requires comparing `recorded_at` against `lmp_date`, which is straightforward to add once the pregnancy week hook is extended to accept a date parameter.
- The BMI category for the weight chart is hardcoded to `normal`. Sprint 3 does not capture pre-pregnancy weight in onboarding. The `bmiCategory` prop is wired up on the component — the caller should pass the correct value once the data is available.
- `expo-haptics` silently no-ops on devices where haptics are unavailable (web, simulator without haptics). No user-facing fallback is needed.
- The Vietnamese locale `vi` is imported from `date-fns/locale`. This adds ~20 KB to the bundle but is necessary for readable day-of-week labels in the visit scheduler.
- Kick counter timer state (`elapsedSeconds`) lives in component `useState`. If the user navigates away and back during an active session, the timer resets to zero but the session remains open in Supabase. This is acceptable for MVP; a background timer service should be added before production.

## What Sprint 4 (baby tracking) will build on

- The same TanStack Query + hook pattern used here: one hook per domain table, mutations update the query cache directly.
- `components/ui/` primitives (Card, Button, Badge, RiskBadge, EmptyState) are all reusable as-is.
- `stores/babyStore.ts` already stores `activeBabyId` — Sprint 4 hooks will consume it the same way maternal hooks consume `activePregnancyId`.
- `lib/standards/` can be extended with WHO growth curve data for baby weight, height, and head circumference charting using the same SVG chart approach.

## Data the supabase-architect needs to add

- No new tables required for Sprint 3 — all tables (`pregnancy_weights`, `kick_counts`, `pregnancy_symptoms`, `prenatal_visits`, `pregnancy_medications`) were already migrated.
- Consider adding a `pre_pregnancy_weight_kg` and `pre_pregnancy_height_cm` column to the `pregnancies` table so the weight chart can automatically derive BMI category and baseline.
- The `articles` table should gain a `pregnancy_week_min` / `pregnancy_week_max` integer range to support week-specific guidance content (referenced in the Sprint 3 scope but content delivery is out of scope here).
