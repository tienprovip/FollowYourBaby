---
name: new-screen
description: Scaffold a new Expo Router screen for FollowYourBaby with its custom hook, optional Zustand slice, and NativeWind styling. Use when the user asks to add a new screen, tab, or route — e.g. "tạo màn theo dõi cân nặng", "add prenatal visit screen". Enforces the project convention: no direct fetch in components, hooks for server state (TanStack Query), Zustand for UI state, components/ui/ primitives over hand-rolled UI.
---

# Skill: new-screen

Scaffold a new screen following FollowYourBaby conventions.

## Pre-flight — ask the user

1. **Route group**: `(auth)`, `(onboarding)`, `(tabs)`, or new group?
2. **Screen name** (kebab-case file → `weight-tracking.tsx`).
3. **Data source**: which Supabase table(s) or Edge Function does it read/write?
4. **Active context**: does it depend on `activeBabyId` / `activePregnancyId` from `babyStore`?

## File layout

For a screen called `weight-tracking` under `(tabs)`:

```
app/(tabs)/weight-tracking.tsx       # screen component
hooks/useWeightLogs.ts               # TanStack Query hook
components/tracking/WeightCard.tsx   # presentation pieces (if reused)
```

If new UI state is needed (modal, draft form), add a slice to an existing store (`uiStore.ts`) rather than creating a new one.

## Screen template

```tsx
// app/(tabs)/weight-tracking.tsx
import { View, ScrollView } from "react-native";
import { Stack } from "expo-router";
import { useWeightLogs } from "@/hooks/useWeightLogs";
import { useActiveBaby } from "@/stores/babyStore";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";

export default function WeightTrackingScreen() {
  const activeBaby = useActiveBaby();
  const { data, isLoading, error } = useWeightLogs(activeBaby?.id);

  if (!activeBaby) return <EmptyState title="Chưa chọn bé" />;
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorState onRetry={() => {}} />;
  if (!data?.length) return <EmptyState title="Chưa có dữ liệu cân nặng" />;

  return (
    <>
      <Stack.Screen options={{ title: "Cân nặng" }} />
      <ScrollView className="flex-1 bg-white px-4">
        <View className="py-4">
          {/* content */}
        </View>
      </ScrollView>
    </>
  );
}
```

## Hook template (TanStack Query)

```ts
// hooks/useWeightLogs.ts
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/database";

type WeightLog = Database["public"]["Tables"]["weight_logs"]["Row"];

export function useWeightLogs(babyId: string | undefined) {
  return useQuery({
    queryKey: ["weight-logs", babyId],
    enabled: !!babyId,
    queryFn: async (): Promise<WeightLog[]> => {
      const { data, error } = await supabase
        .from("weight_logs")
        .select("*")
        .eq("baby_id", babyId!)
        .order("logged_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}
```

For mutations use `useMutation` + invalidate `["weight-logs", babyId]` on success.

## Mandatory rules

- **No `useState` for server data** — always TanStack Query.
- **No direct `supabase.from(...)` in the screen** — always through a hook.
- **All Vietnamese strings inline** for now (no i18n layer yet); when `vn-content-curator` lands, migrate to keys.
- **Use `components/ui/` primitives** (Button, Card, Input, Badge, LoadingSpinner, ErrorState, EmptyState) — don't roll your own.
- **NativeWind first**; `StyleSheet.create` only for animations or dynamic styles.
- **Accessibility**: every Pressable needs `accessibilityLabel`; every form input needs an associated label.
- **One-handed UX**: for tracking screens (3am feeding logs), put primary CTAs in the bottom half of the screen.

## Empty / loading / error states

Every screen with server data MUST handle: loading, error (with retry), empty, and the unhappy "no active baby/pregnancy selected" case. Use the `EmptyState` / `ErrorState` / `LoadingSpinner` primitives.

## After scaffolding

1. Run `npx tsc --noEmit` — must pass.
2. Run `npx expo start` and verify the screen renders on the simulator.
3. If the screen is reachable from a tab, add it to the tab bar in `(tabs)/_layout.tsx`.
4. Test the empty + error states manually.

## Don't

- Don't add a Zustand store for data that comes from the server.
- Don't import from `supabase/functions/*` in the client — call them via `supabase.functions.invoke(...)`.
- Don't hard-code colors — use NativeWind theme tokens from `tailwind.config.js`.
