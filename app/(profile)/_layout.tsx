import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#fff5f7' },
        headerTintColor: '#1F2B5B',
        headerTitleStyle: { fontWeight: '700', fontSize: 18 },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: '#fff5f7' },
      }}
    />
  );
}
