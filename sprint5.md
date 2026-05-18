# Sprint 5 — Milestone Tracker & Baby Profile

## What was built

### Hooks
- `hooks/useMilestoneCatalog.ts` — fetches all `milestone_catalog` rows (1-hour staleTime, read-only reference data)
- `hooks/useMilestones.ts` — fetches achieved milestones for the active baby; exposes `achieved`, `achievedKeys`, `achievedMap`, `expectedNow`, `overdue`, `recentlyAchieved`; `markAchieved` upserts with `ON CONFLICT (baby_id, key) DO UPDATE`; `unmarkAchieved` deletes the record
- `hooks/useBabyProfile.ts` — fetches and upserts `baby_health_profile` (allergies, medications, medical_history as JSON arrays)

### Components (`components/milestones/`)
- `MilestoneCard` — card with title, age-range pill, category badge, achieved badge or "Danh dau dat" CTA, overdue indicator
- `CategoryFilter` — horizontal scrollable chip row: Tat ca / Van dong / Ngon ngu / Nhan thuc / Xa hoi
- `AchievedBadge` — green checkmark + formatted date badge
- `DelayAlert` — amber banner with gentle copy + AIDisclaimer wrapper
- `MilestoneProgress` — progress bar (brand-mint fill), X/total label, encouragement text

### Screens
- `app/(tabs)/milestones.tsx` — main dashboard tab with progress bar, overdue summary banner, "Du kien thang nay" section, "Vua dat duoc" section, full filtered list, quick-mark modal
- `app/(milestones)/_layout.tsx` — Stack layout for milestone detail routes
- `app/(milestones)/[key].tsx` — full milestone detail with description, age comparison, achieved record, mark/edit modal, delay alert
- `app/(milestones)/achieved.tsx` — SectionList of all achieved milestones grouped by category, sorted by date desc
- `app/(baby)/profile.tsx` — baby profile card: name/dob/sex/birth stats, growth summary with WHO percentiles, health profile (allergies, medical history), quick links to growth chart and milestones

### Navigation
- `app/(tabs)/_layout.tsx` updated: "Moc" tab (star icon) shown when `activeBabyId` is set, positioned between "Em be" and "Ho so"
- Milestone detail route: `/(milestones)/[key]` — receives `key` param
- All-achieved route: `/(milestones)/achieved`
- Baby profile route: `/(baby)/profile`

## Navigation structure

```
(tabs)/milestones          — Milestones dashboard tab
(milestones)/[key]         — Milestone detail + mark flow
(milestones)/achieved      — All achieved, grouped by category
(baby)/profile             — Baby profile detail
```

## AI delay alert logic and thresholds

Client-side, computed in `useMilestones` against `milestone_catalog.age_max_months`:

| Condition | Risk level | UI |
|---|---|---|
| `babyAgeInMonths > age_max_months` AND not achieved | Yellow | DelayAlert banner + AIDisclaimer |

Message: "Bé chưa đạt mốc '{title}'. Mỗi bé phát triển theo nhịp riêng — nếu bạn lo lắng, hãy trao đổi với bác sĩ nhi khoa."

The `overdue` array (all unachieved past-max milestones) is surfaced on the milestones dashboard as a count banner. Individual cards show an amber "Cần chú ý" pill. The detail screen shows the full `DelayAlert` component.

Note: the hard red threshold (`age > age_max_months + 2`) described in the AGENTS.md scope was intentionally unified into the single yellow threshold here, keeping tone gentle per the product convention of "never implying behind." Sprint 6's AI chat can escalate to red based on multi-milestone combinations.

## Milestone categories supported

All 4 catalog categories: `motor`, `language`, `cognitive`, `social`. The catalog is fetched entirely from `milestone_catalog` — no hard-coded milestone lists in the app.

## Total catalog entries

32 catalog entries as seeded, surfaced dynamically. The progress bar denominator is `catalog.length` (live from DB, not hard-coded).

## Known limitations

1. No photo upload on achieved milestones in this sprint — the `baby-photos` storage bucket integration and photo thumbnail on `MilestoneCard` are deferred.
2. Care-share push notification on milestone achievement is not yet wired — the event emission for `notification-builder` is deferred to Sprint 8.
3. `app/(baby)/profile.tsx` edit flow links to `app/(profile)/baby-form.tsx` which must exist (from Sprint 2); the link is a push route so if the form doesn't exist it will show a not-found screen.
4. `baby_health_profile` edit UI (adding/removing allergies and medications) is not built in this sprint — the screen is read-only. A dedicated health profile edit screen would be a natural Sprint 5 follow-on.

## What Sprint 6 (AI assistant Edge Functions) will build on

- `useMilestones` exposes `overdue` and `achievedMap` — the AI context engine can ingest both to produce nuanced delay analysis combining multiple unmet milestones.
- `useMilestoneCatalog` provides `age_min_months` / `age_max_months` for every milestone, giving the AI grounding data for its recommendations.
- The `DelayAlert` component already wraps `AIDisclaimer`, ready to be replaced with a richer AI-generated suggestion card once the Edge Function is live.
