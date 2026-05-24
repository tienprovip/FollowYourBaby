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
    >
      <Stack.Screen name="symptoms" options={{ title: 'Dấu hiệu cơ thể' }} />
      <Stack.Screen name="kick-counter" options={{ title: 'Đếm thai máy' }} />
      <Stack.Screen name="weight" options={{ title: 'Cân nặng thai kỳ' }} />
      <Stack.Screen name="height" options={{ title: 'Chiều cao' }} />
      <Stack.Screen name="medications" options={{ title: 'Thuốc & Vitamin' }} />
      <Stack.Screen name="prenatal-visits" options={{ title: 'Lịch khám thai' }} />
    </Stack>
  );
}
