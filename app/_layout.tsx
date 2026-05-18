import '../global.css';

import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';

import { queryClient } from '@/lib/queryClient';
import { useAuth } from '@/hooks/useAuth';
import { useUiStore } from '@/stores/uiStore';

export const INTRO_SEEN_KEY = 'intro_seen';

// ---------------------------------------------------------------------------
// NavigationGuard — lives inside RootLayout so it is never unmounted.
// Order of redirects:
//   1. Intro not seen → /(intro)  (first-time users)
//   2. Not signed in  → /(auth)/login
//   3. Signed in, no onboarding → /(onboarding)/journey
//   4. Fully set up   → /(tabs)
// ---------------------------------------------------------------------------

function NavigationGuard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const { introSeen, introReady, setIntroSeen, setIntroReady } = useUiStore();

  // Hydrate intro state from SecureStore once on mount.
  useEffect(() => {
    SecureStore.getItemAsync(INTRO_SEEN_KEY).then((value) => {
      setIntroSeen(value === 'true');
      setIntroReady(true);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isLoading || !introReady) return;

    const segment = segments[0] as string | undefined;
    const inAuthGroup = segment === '(auth)';
    const inOnboardingGroup = segment === '(onboarding)';
    const inIntroGroup = segment === '(intro)';

    if (!introSeen && !inIntroGroup) {
      // Cast needed: /(intro) is a new route not yet in the generated router types
      router.replace('/(intro)' as Parameters<typeof router.replace>[0]);
    } else if (introSeen && !user && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (introSeen && user && !user.onboardingCompleted && !inOnboardingGroup) {
      router.replace('/(onboarding)/journey');
    } else if (introSeen && user && user.onboardingCompleted && (inAuthGroup || inOnboardingGroup)) {
      router.replace('/(tabs)');
    }
  }, [user, isLoading, segments, router, introSeen, introReady]);

  return null;
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <NavigationGuard />
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
