import '../global.css';

import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { queryClient } from '@/lib/queryClient';
import { useAuth } from '@/hooks/useAuth';

// ---------------------------------------------------------------------------
// NavigationGuard — lives inside RootLayout so it is never unmounted.
// Watches auth state and redirects to login or tabs as needed.
// Keeping this in _layout.tsx (rather than index.tsx) means the guard stays
// active after index.tsx is replaced by a <Redirect>, which is the root cause
// of the "unmatched route" bug that occurs when redirecting from login.
// ---------------------------------------------------------------------------

function NavigationGuard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;

    // Cast to string so TypeScript does not narrow against the stale route
    // union — Expo Router regenerates .expo/types/router.d.ts at build time.
    const segment = segments[0] as string | undefined;
    const inAuthGroup = segment === '(auth)';
    const inOnboardingGroup = segment === '(onboarding)';

    if (!user && !inAuthGroup) {
      // Not signed in — send to login
      router.replace('/(auth)/login');
    } else if (user && !user.onboardingCompleted && !inOnboardingGroup) {
      // Signed in but hasn't completed onboarding — start the flow
      router.replace('/(onboarding)/journey');
    } else if (user && user.onboardingCompleted && (inAuthGroup || inOnboardingGroup)) {
      // Fully onboarded — go straight to the app
      router.replace('/(tabs)/');
    }
  }, [user, isLoading, segments]);

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
