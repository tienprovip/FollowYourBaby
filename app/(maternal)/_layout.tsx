import { Stack } from 'expo-router';

export default function MaternalLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#fff5f7' },
        headerTintColor: '#1F2B5B',
        headerTitleStyle: { fontWeight: '700' },
        headerBackTitle: 'Quay lại',
        contentStyle: { backgroundColor: '#fff5f7' },
      }}
    />
  );
}
