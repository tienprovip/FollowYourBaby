import { Stack } from 'expo-router';

export default function MilestonesLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#FFF3EC' },
        headerTintColor: '#1F2B5B',
        headerTitleStyle: { fontWeight: '700' },
        headerBackTitle: 'Quay lai',
      }}
    />
  );
}
