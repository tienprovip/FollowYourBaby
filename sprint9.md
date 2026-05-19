# Sprint 9 — Subscription / Paywall

## Checklist
- [x] Subscription store with tier, expiry, trial, AI quota
- [x] useSubscription hook with all entitlement keys
- [x] Paywall screen (modal, 3-tier comparison, trial banner)
- [x] PremiumGate component
- [x] Subscription management screen
- [x] AI chat quota gate (5 msg/day free)
- [x] Babies screen add-baby gate
- [x] Care-sharing invite gate
- [x] Paywall registered as modal in root layout
- [x] Subscription shortcut in profile index
- [x] Subscription store hydrated on app init

## Files created
- `stores/subscriptionStore.ts`
- `hooks/useSubscription.ts`
- `app/paywall.tsx`
- `components/paywall/PremiumGate.tsx`
- `app/(profile)/subscription.tsx`

## Files modified
- `app/_layout.tsx` — import + hydrate subscriptionStore, register paywall modal Stack.Screen
- `app/(tabs)/ai-chat.tsx` — quota tracking, PremiumGate overlay, quota banner
- `app/(profile)/babies.tsx` — handleAddBaby gate
- `app/(profile)/care-sharing.tsx` — handleInvite gate
- `app/(profile)/index.tsx` — subscription shortcut card

## Entitlement keys (other agents must use these exact strings)
```
'ai_chat'         — unlimited AI chat; free=5/day tracked in AsyncStorage
'ai_summary'      — weekly AI summary (premium+)
'risk_alerts'     — AI risk alerts (premium+)
'multi_baby'      — >1 baby profile; free=1, premium=3, family=unlimited
'care_share'      — invite caregivers (premium+)
'export'          — CSV/PDF export (premium+)
'ocr'             — prenatal OCR (premium+)
'analytics'       — advanced charts (premium+)
'family_dashboard'— family dashboard (family_premium only)
```

Check via: `useSubscription().checkEntitlement(key)` or `useSubscription().features.<flag>`.

## Tier definitions implemented
| Tier | Price | Limits |
|---|---|---|
| free | 0 | 1 baby, 5 AI msg/day, no sharing |
| premium | 99.000₫/mo · 799.000₫/yr | 3 babies, unlimited AI, care share, export, OCR, analytics |
| family_premium | 149.000₫/mo · 1.199.000₫/yr | unlimited babies, +family_dashboard, up to 5 caregivers |

## Known limitations / TODOs
- No real IAP: all purchase/restore flows stub with Alert. Wire RevenueCat at `// TODO: wire RevenueCat` markers in `app/paywall.tsx` and `app/(profile)/subscription.tsx`.
- No server-side entitlement validation yet (server webhook + check-entitlement Edge Functions are out of scope per brief — add in Phase 2).
- AI quota is tracked locally in AsyncStorage only; a Premium user who clears app storage will temporarily show 0 usage (safe — just loses the counter, never blocks access).
- Trial activation is local-only (setTrial(7)); must be replaced with RevenueCat free trial offer before production.
- `expiresAt` is not yet written by any server webhook; subscriptionStore defaults to null (treated as active) until webhook is wired.
- Pre-existing TS errors in `baby-form.tsx`, `care-sharing.tsx`, `pregnancies.tsx`, `EmptyState` props — not introduced by Sprint 9.
