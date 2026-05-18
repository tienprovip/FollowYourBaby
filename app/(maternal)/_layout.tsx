import { Stack } from 'expo-router';

export default function MaternalLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#FFF3EC' },
        headerTintColor: '#1F2B5B',
        headerTitleStyle: { fontWeight: '700' },
        headerBackTitle: 'Quay lại',
        contentStyle: { backgroundColor: '#FFF3EC' },
      }}
    />
  );
}
