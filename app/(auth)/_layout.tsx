import { Stack } from 'expo-router';

// ---------------------------------------------------------------------------
// Auth group layout — all auth screens share a headerless stack.
// Background colour is set per-screen via SafeAreaView.
// ---------------------------------------------------------------------------

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#fffdf7' },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}
