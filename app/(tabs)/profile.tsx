import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { Avatar } from '@/components/ui';

const ROLE_LABELS: Record<string, string> = {
  pregnant_mother: 'Mẹ bầu',
  parent: 'Phụ huynh',
  caregiver: 'Người chăm sóc',
};

interface MenuItemProps {
  label: string;
  onPress: () => void;
  icon?: string;
}

function MenuItem({ label, icon, onPress }: MenuItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      accessibilityRole="button"
      className="flex-row items-center px-4 py-4 border-b border-brand-gray/50 active:opacity-60"
    >
      {icon && <Text className="text-base mr-3">{icon}</Text>}
      <Text className="flex-1 text-base text-brand-navy font-medium">{label}</Text>
      <Text className="text-brand-navy/30 text-lg">›</Text>
    </TouchableOpacity>
  );
}

export default function ProfileTab() {
  const router = useRouter();
  const { profile } = useProfile();
  const { signOut } = useAuth();

  return (
    <ScrollView className="flex-1 bg-brand-peach" contentContainerStyle={{ paddingBottom: 32 }}>
      {/* Header */}
      <View className="items-center pt-10 pb-6 px-6">
        <Avatar
          uri={profile?.avatar_url ?? undefined}
          name={profile?.full_name ?? 'Người dùng'}
          size="lg"
        />
        <Text className="mt-3 text-xl font-bold text-brand-navy">
          {profile?.full_name ?? 'Chưa cập nhật tên'}
        </Text>
        {profile?.role && (
          <View className="mt-1 bg-brand-pink/15 rounded-full px-3 py-1">
            <Text className="text-xs text-brand-pink font-semibold">
              {ROLE_LABELS[profile.role] ?? profile.role}
            </Text>
          </View>
        )}
      </View>

      {/* Account section */}
      <View className="mx-4 bg-white rounded-card shadow-brand mb-4 overflow-hidden">
        <Text className="text-xs text-brand-navy/40 font-semibold uppercase px-4 pt-3 pb-1 tracking-wider">
          Tài khoản
        </Text>
        <MenuItem label="Thông tin cá nhân" icon="👤" onPress={() => router.push('/(profile)/')} />
        <MenuItem label="Danh sách bé" icon="👶" onPress={() => router.push('/(profile)/babies')} />
        <MenuItem label="Thai kỳ" icon="🤰" onPress={() => router.push('/(profile)/pregnancies')} />
      </View>

      {/* Sharing section */}
      <View className="mx-4 bg-white rounded-card shadow-brand mb-4 overflow-hidden">
        <Text className="text-xs text-brand-navy/40 font-semibold uppercase px-4 pt-3 pb-1 tracking-wider">
          Chia sẻ
        </Text>
        <MenuItem label="Chia sẻ chăm sóc" icon="🤝" onPress={() => router.push('/(profile)/care-sharing')} />
        <MenuItem label="Mời người chăm sóc" icon="✉️" onPress={() => router.push('/(profile)/invite')} />
      </View>

      {/* Sign out */}
      <View className="mx-4">
        <TouchableOpacity
          onPress={signOut}
          accessibilityRole="button"
          className="bg-red-50 rounded-card px-4 py-4 items-center"
        >
          <Text className="text-base font-semibold text-red-500">Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
