import '../global.css';

import { useEffect, useRef } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';

import { queryClient } from '@/lib/queryClient';
import { useAuth } from '@/hooks/useAuth';
import { useUiStore } from '@/stores/uiStore';
import { useBabyStore } from '@/stores/babyStore';
import { useBabyTrackingStore } from '@/stores/babyTrackingStore';
import { useSubscriptionStore } from '@/stores/subscriptionStore';
import { setupAndroidNotificationChannel } from '@/lib/notifications';

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
  const { hydrate: hydrateTracking } = useBabyTrackingStore();
  const { hydrate: hydrateSubscription } = useSubscriptionStore();
  const notificationResponseRef = useRef<ReturnType<typeof Notifications.addNotificationResponseReceivedListener> | null>(null);

  // Hydrate intro state from SecureStore once on mount.
  useEffect(() => {
    SecureStore.getItemAsync(INTRO_SEEN_KEY).then((value) => {
      setIntroSeen(value === 'true');
      setIntroReady(true);
    });
    hydrate();
    hydrateTracking();
    hydrateSubscription();
    setupAndroidNotificationChannel().catch(() => null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Notification deep-link handler — tapping a push notification navigates to the
  // route embedded in the notification data payload.
  useEffect(() => {
    notificationResponseRef.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data as Record<
          string,
          unknown
        >;
        const route = data?.route as string | undefined;
        if (route) {
          router.push(route as Parameters<typeof router.push>[0]);
        }
      });

    return () => {
      notificationResponseRef.current?.remove();
    };
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
    const inTabsGroup = segment === '(tabs)';
    const inAuthenticatedGroup =
      inTabsGroup ||
      segment === '(maternal)' ||
      segment === '(baby)' ||
      segment === '(milestones)' ||
      segment === '(profile)';

    // Allow the invite accept screen to render without re-routing
    if (inInviteGroup) return;

    if (!introSeen && !inIntroGroup) {
      router.replace('/(intro)');
    } else if (introSeen && !user && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (introSeen && user && !user.onboardingCompleted && !inOnboardingGroup) {
      router.replace('/(onboarding)/journey');
    } else if (introSeen && user && user.onboardingCompleted && !inAuthenticatedGroup) {
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
        <Stack screenOptions={{ headerShown: false }}>
          {/* Paywall — presented as full-screen modal from anywhere in the app */}
          <Stack.Screen
            name="paywall"
            options={{
              presentation: 'modal',
              headerShown: false,
              animation: 'slide_from_bottom',
            }}
          />
        </Stack>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
