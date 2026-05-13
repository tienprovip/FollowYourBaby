import '../global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { queryClient } from '@/lib/queryClient';

// ---------------------------------------------------------------------------
// RootLayout — wraps the entire app with global providers.
// Auth logic and navigation guards are handled inside (auth)/_layout.tsx
// and (tabs)/_layout.tsx by the auth-builder agent.
// ---------------------------------------------------------------------------

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
