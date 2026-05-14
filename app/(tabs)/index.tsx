import { View, Text } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';

export default function HomeScreen() {
  const { user, signOut } = useAuth();

  return (
    <View className="flex-1 items-center justify-center bg-rose-50 px-6 gap-y-4">
      <Text className="text-2xl font-semibold text-rose-600">FollowYourBaby</Text>
      <Text className="text-slate-500">Sprint 1 — Auth ready</Text>
      {user ? (
        <Text className="text-sm text-gray-500">Đang đăng nhập: {user.email}</Text>
      ) : null}
      <Button
        label="Đăng xuất"
        variant="secondary"
        size="md"
        onPress={signOut}
      />
    </View>
  );
}
