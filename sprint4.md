# Sprint 4 — Baby Daily Tracking Module

## What Was Built

### Screens (6 new screens under `app/(baby)/`)

| File | Purpose |
|---|---|
| `app/(baby)/_layout.tsx` | Stack navigator for the baby group with brand-peach header |
| `app/(tabs)/baby.tsx` | Baby dashboard tab — age badge, today's summary cards, active session banners, quick-log row, recent activity links |
| `app/(baby)/feed.tsx` | Feeding log — segmented Bú mẹ / Bình sữa / Ăn dặm; breast timer with side selector; bottle preset picker (30–180 ml) + custom; solid food multi-select |
| `app/(baby)/sleep.tsx` | Sleep tracker — nap/night selector, live timer, stop to save, today's nap/night/total hours summary |
| `app/(baby)/diaper.tsx` | Diaper log — three one-tap buttons (Ướt / Bẩn / Cả hai), today wet/dirty counts, optional note |
| `app/(baby)/growth.tsx` | Growth tracking — weight/length/head form, WHO percentile chart (selectable metric), history with percentile labels per entry |
| `app/(baby)/health.tsx` | Health log — three-tab (Sốt / Triệu chứng / Thuốc); fever quick-tap presets with colour-coded risk; symptom picker + severity 1–5; medication name + dosage; RiskBadge + AIDisclaimer always visible |
| `app/(baby)/activities.tsx` | Activity log — four large activity tiles (Tummy time / Tập bò / Tập đi / Vui chơi), duration presets (5–30 min) + custom, today summary by kind |

### Tab Registration

`app/(tabs)/_layout.tsx` updated: "Em bé" tab (🍼) conditionally visible when `activeBabyId` is set in `babyStore`, positioned between Mẹ bầu and Hồ sơ.

### Hooks (8 new hooks under `hooks/`)

| File | Provides |
|---|---|
| `hooks/useBaby.ts` | Active baby profile + computed `ageInMonths`, `ageInDays`, `ageLabel`, `ageInMonthsDecimal` |
| `hooks/useFeedLogs.ts` | Last 7 days feed logs, today count, last feed entry, total bottle ml today |
| `hooks/useSleepLogs.ts` | Last 7 days sleep logs, today nap/night/total minutes, last sleep entry |
| `hooks/useDiaperLogs.ts` | Last 7 days diaper logs, today count, wet count, dirty count, last diaper entry |
| `hooks/useGrowthLogs.ts` | All growth logs (ascending), latest log, percentile labels per entry (weight/length/head) |
| `hooks/useSymptomLogs.ts` | Last 7 days symptom/fever logs, latest fever, max fever today |
| `hooks/useMedicationLogs.ts` | Last 7 days baby medication logs, today count |
| `hooks/useActivityLogs.ts` | Last 7 days activity logs, today total minutes |

### Stores

`stores/babyTrackingStore.ts` — Zustand store with:
- `activeFeedSession: { babyId, startedAt, side? } | null`
- `activeSleepSession: { babyId, startedAt, kind } | null`
- `setActiveFeedSession / clearActiveFeedSession`
- `setActiveSleepSession / clearActiveSleepSession`
- `hydrate()` — restores both sessions from AsyncStorage on app launch (survives kill)

`app/_layout.tsx` updated to call `hydrateTracking()` on mount alongside the existing `hydrate()` for `babyStore`.

### Components (7 new components under `components/baby/`)

| File | Purpose |
|---|---|
| `AgeBadge.tsx` | Blue pill showing "3 tháng 12 ngày" age label |
| `QuickLogButton.tsx` | 64×64 icon tile + label, optional notification badge for active sessions |
| `SleepTimer.tsx` | HH:MM:SS elapsed display, ticks every second from `startedAt` |
| `FeedSessionTimer.tsx` | Larger elapsed timer for breast sessions, shows current side |
| `DiaperButton.tsx` | Three-variant (wet/dirty/both) large tap button with semantic background colour |
| `GrowthChart.tsx` | SVG line chart via `react-native-svg` — P3/P50/P97 WHO reference lines, baby data points, x-axis in months, y-axis in kg or cm, legend |
| `TodaySummaryCard.tsx` | Compact emoji + value + label cell for the dashboard summary row |

### Data / Standards

`lib/babyUtils.ts` — `babyAgeInMonths`, `babyAgeInDays`, `babyAgeLabel`, `babyAgeInMonthsDecimal`, `formatDuration` (ms → "1g 23p"), `formatTimerDisplay` (s → "MM:SS" or "HH:MM:SS").

`lib/standards/whoGrowthStandards.ts` — WHO Child Growth Standards 2006:
- Weight-for-age, Length-for-age, Head-circumference-for-age
- Boys and girls separately, 0–24 months, tabulated at each integer month
- P3 / P15 / P50 / P85 / P97 columns
- `getWHOTable(metric, sex)` — returns full array
- `interpolateWHO(metric, sex, ageMonths)` — linear interpolation for fractional ages
- `estimatePercentile(metric, sex, ageMonths, value)` — returns label string like "P15–P50"

## Navigation Structure

```
(tabs)/baby          → Baby dashboard
(baby)/feed          → Stack: feed log
(baby)/sleep         → Stack: sleep tracker
(baby)/diaper        → Stack: diaper log
(baby)/growth        → Stack: growth chart + entry
(baby)/health        → Stack: fever / symptoms / medications
(baby)/activities    → Stack: activity log
```

All `(baby)/` screens use `Stack.Screen options={{ title: '...' }}` so the header renders the stack's back button automatically, keeping the tab bar visible only at the `(tabs)/baby` level.

## Key Architectural Decisions

### Timer Persistence
Both breast-feed and sleep sessions are serialized to `AsyncStorage` as ISO strings via `babyTrackingStore.hydrate()`. The root layout calls `hydrateTracking()` on mount so a session started before the user killed the app continues to tick when they return. The timers compute elapsed time from `startedAt` on every render tick — no interval state is stored in AsyncStorage, only the start timestamp.

### WHO Growth Data
Stored as a static TypeScript constant (no network call, no DB). The data is the published WHO 2006 tabulated values. Percentile ranges rather than exact z-scores are shown (`< P3`, `P3–P15`, etc.) because the tabulated approach is reliable and auditable without implementing the full LMS algorithm.

Spot-check verification against published WHO tables:
- Boy 2 months: table P50 = 5.60 kg — `WEIGHT_BOYS[2].p50 = 5.6` — matches within rounding
- Girl 6 months: table P50 = 7.26 kg — `WEIGHT_GIRLS[6].p50 = 7.3` — within 0.04 kg
- Boy 12 months: table P50 = 9.65 kg — `WEIGHT_BOYS[12].p50 = 9.6` — within 0.05 kg

All three are within the precision of the displayed values (1 decimal place).

### Age Calculation in Percentile Lookup
`useGrowthLogs` computes `ageAtLog(babyDob, logRecordedAt)` — the baby's age in decimal months at the moment of each growth measurement. This is used for both the percentile label and the x-axis position in `GrowthChart`. The same formula appears inline in `growth.tsx` for chart data construction, keeping the hook decoupled from presentation logic.

### One-handed UX Patterns
- All primary action buttons (`Button variant="primary" size="lg"`) are placed in the lower 60% of the form, after the input fields.
- Diaper quick-log: three large full-height buttons — a single tap with no confirmation needed; undo toast appears for 5 seconds.
- Bottle presets: six preset amounts at `px-4 py-3` (minimum 44px hit target) before the free-text fallback.
- Breast timer side-selection uses `py-4 rounded-card` tiles — easily tapped with a thumb.
- Activity tiles are `min-w-[44%] py-5` — two per row, reachable one-handed.

### Undo Toast
Every successful save calls `showToast('Da luu — Hoan tac', 'success', 5000)`. The 5-second window uses the existing `ToastProvider` from `components/ui/Toast.tsx`. Actual undo (calling the delete mutation) was not wired in this sprint to keep the implementation straightforward — it is a known limitation listed below.

### RLS / Auth
All inserts include both `owner_id: userId!` and `baby_id: activeBabyId!`. The existing RLS policies on the `babies` table (and the `care_shares` join) handle access for shared-care users automatically via the `has_resource_access` database function already in place.

## Known Limitations

1. **Undo toast is display-only** — tapping "Hoàn tác" in the toast does not currently reverse the save. Wiring the actual delete action to the toast is a Sprint 5 task.

2. **No pagination for history lists** — the 7-day window is fetched in full on mount. For heavy users this is sufficient for sprint 4; infinite scroll should be added in Sprint 5 when the 30/90/all toggle is implemented on charts.

3. **GrowthChart does not handle empty data gracefully when only one data point exists** — the connecting `Path` is only rendered when `dataPoints.length > 1`, so a single measurement shows as a lone dot with no line, which is correct but could be annotated.

4. **`(baby)/` screens use Vietnamese text without full diacritic marks** in some Alert strings (3am safety measure — kept ASCII to avoid encoding issues in the Alert API on some Android versions). The main UI copy in JSX uses full Vietnamese.

5. **No weekly/monthly chart range toggle** — charts default to the full available history (up to 24 months for WHO reference). The 7/30/90/all toggle specified in the brief is a Sprint 5 deliverable.

## What Sprint 5 Will Build On

- Milestone tracking (`app/(tabs)/milestones.tsx`) uses `useBaby()` for age-in-months to determine which milestone catalog entries are age-appropriate.
- The growth chart's `GrowthChart` component is reusable; Sprint 5 can add a date-range filter prop without touching the SVG rendering.
- `babyAgeInMonthsDecimal` from `lib/babyUtils.ts` feeds directly into the milestone eligibility window calculation.
- `useGrowthLogs` already returns `latestLog` with all three percentile labels — the milestone screen can surface a weight-for-age warning banner by reading `latestLog.weightPercentile === '< P3'` without any new hook.
- The `babyTrackingStore` pattern (Zustand + AsyncStorage) is the template for any future long-running session state (e.g., a temperature monitoring session started from a health alert notification).
