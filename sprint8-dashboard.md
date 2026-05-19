# Sprint 8 — Dashboard & Analytics

## Summary
Enhanced the home dashboard with live tracking data and built a dedicated analytics screen.

## Files Created
- `components/dashboard/TodaySummaryStrip.tsx` — today's feed/sleep/diaper chips
- `components/dashboard/GrowthMiniCard.tsx` — latest weight/height/head stat card
- `components/dashboard/MilestoneCallout.tsx` — upcoming expected milestone callout
- `components/dashboard/UpcomingVisitCard.tsx` — next prenatal visit card
- `components/dashboard/SimpleBarChart.tsx` — pure-View bar chart (no external lib)
- `hooks/useDashboardData.ts` — aggregates all tracking hooks into one
- `hooks/useWeeklyAggregate.ts` — 7-day per-day aggregate (feed/sleep/diaper/kick/weight)
- `hooks/useMonthlyAggregate.ts` — 30-day aggregate
- `app/(tabs)/analytics.tsx` — analytics screen with period picker + baby/pregnancy stats + AI summary

## Files Modified
- `app/(tabs)/index.tsx` — integrated TodaySummaryStrip, DailySummaryCard, MilestoneCallout, UpcomingVisitCard, GrowthMiniCard, NotificationBell, analytics shortcut
- `app/(tabs)/_layout.tsx` — added analytics as hidden tab

## Known Limitations / TODOs
- `useWeeklyAggregate` always computes 7 days regardless of `period` (month view shows same 7-day data)
- Monthly aggregate (`useMonthlyAggregate.ts`) created but not yet wired to analytics screen
- Growth chart not yet a visual chart — shows numbers only
- No weight-vs-standard curve comparison for pregnancy tracking
