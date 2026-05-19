import { Stack } from 'expo-router';

export default function BabyLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#fff5f7' },
        headerTintColor: '#1F2B5B',
        headerTitleStyle: { fontWeight: '700' },
        headerBackTitle: 'Quay lại',
      }}
    />
  );
}
