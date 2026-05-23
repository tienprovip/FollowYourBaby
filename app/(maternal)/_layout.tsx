import { Stack, useRouter } from 'expo-router';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function BackButton() {
  const router = useRouter();
  return (
    <Pressable onPress={() => router.back()} hitSlop={12}>
      <Ionicons name="chevron-back" size={26} color="#1F2B5B" />
    </Pressable>
  );
}

export default function MaternalLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#FFF8FA' },
        headerTintColor: '#1F2B5B',
        headerTitleStyle: { fontWeight: '700', color: '#1F2B5B' },
        headerLeft: () => <BackButton />,
        contentStyle: { backgroundColor: '#FFF8FA' },
      }}
    />
  );
}
