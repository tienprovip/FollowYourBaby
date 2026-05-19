# Sprint 8 — Push Notifications & Reminders

## Summary
Built the full push notification infrastructure and in-app reminders center.

## Files Created
- `lib/notifications.ts` — registerForPushNotificationsAsync, scheduleXxxReminder, cancel helpers, Android channel setup
- `lib/vaccinationSchedule.ts` — hardcoded Vietnam standard vaccine schedule by age
- `hooks/useNotifications.ts` — permission request, push token registration to Supabase, schedule/cancel helpers
- `app/(tabs)/reminders.tsx` — in-app notification center: upcoming visits, medications, vaccinations, custom reminders
- `app/(profile)/notification-settings.tsx` — per-category toggles + quiet hours
- `components/ui/NotificationBell.tsx` — header bell icon with unread badge

## Files Modified
- `app/_layout.tsx` — setupAndroidNotificationChannel on mount
- `app/(tabs)/_layout.tsx` — reminders registered as hidden tab
- `app/(tabs)/index.tsx` — NotificationBell added to header
- `app/(tabs)/profile.tsx` — notification settings link added
- `components/ui/index.ts` — NotificationBell exported

## Known Limitations / TODOs
- Push token not yet sent to a backend notification service (only saved to user_metadata)
- Quiet hours stored in AsyncStorage; not synced to server
- Vaccination schedule is hardcoded — not personalised from baby health profile
- No deep-link handling from notification tap to relevant screen yet
