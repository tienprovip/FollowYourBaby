import '../global.css';

import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import * as Linking from 'expo-linking';

import { queryClient } from '@/lib/queryClient';
import { useAuth } from '@/hooks/useAuth';
import { useUiStore } from '@/stores/uiStore';
import { useBabyStore } from '@/stores/babyStore';

export const INTRO_SEEN_KEY = 'intro_seen';
const APP_SCHEME = 'followyourbaby';

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
  const { hydrate } = useBabyStore();

  // Hydrate intro state from SecureStore once on mount.
  useEffect(() => {
    SecureStore.getItemAsync(INTRO_SEEN_KEY).then((value) => {
      setIntroSeen(value === 'true');
      setIntroReady(true);
    });
    hydrate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Deep link handler — routes followyourbaby://invite/<token> to the accept screen
  useEffect(() => {
    function handleUrl(event: { url: string }) {
      const parsed = Linking.parse(event.url);
      if (parsed.scheme === APP_SCHEME && parsed.path?.startsWith('invite/')) {
        const token = parsed.path?.replace('invite/', '');
        if (token) {
          router.push(`/invite/${token}`);
        }
      }
    }

    const subscription = Linking.addEventListener('url', handleUrl);

    // Handle the URL that launched the app (cold start)
    Linking.getInitialURL().then((url) => {
      if (url) handleUrl({ url });
    });

    return () => subscription.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isLoading || !introReady) return;

    const segment = segments[0];
    const inAuthGroup = segment === '(auth)';
    const inOnboardingGroup = segment === '(onboarding)';
    const inIntroGroup = segment === '(intro)';
    const inInviteGroup = segment === 'invite';

    // Allow the invite accept screen to render without re-routing
    if (inInviteGroup) return;

    if (!introSeen && !inIntroGroup) {
      router.replace('/(intro)');
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
