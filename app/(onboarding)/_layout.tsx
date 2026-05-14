import { Stack } from 'expo-router';

// ---------------------------------------------------------------------------
// Onboarding group layout — all onboarding screens share a headerless stack.
// The progress Stepper is rendered inside each individual screen so it can
// show the correct step count without relying on nested navigator headers.
// ---------------------------------------------------------------------------

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#fffdf7' },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="journey" />
      <Stack.Screen name="survey" />
      <Stack.Screen name="complete" />
    </Stack>
  );
}
