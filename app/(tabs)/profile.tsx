import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar, Button } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface MenuItemProps {
  label: string;
  icon: IoniconsName;
  onPress?: () => void;
  value?: string;
}

function MenuItem({ label, icon, onPress, value }: MenuItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole="button"
      accessibilityState={{ disabled: !onPress }}
      className="flex-row items-center rounded-input bg-white px-4 py-4 shadow-brand active:opacity-70"
    >
      <View className="mr-3 h-8 w-8 items-center justify-center rounded-full bg-brand-gray">
        <Ionicons name={icon} size={18} color="#1F2B5B" />
      </View>
      <Text className="flex-1 text-[15px] font-semibold text-brand-navy">{label}</Text>
      {value && <Text className="mr-2 text-sm font-medium text-brand-navy/35">{value}</Text>}
      <Ionicons name="chevron-forward" size={18} color="#B0B8CC" />
    </TouchableOpacity>
  );
}

export default function ProfileTab() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profile } = useProfile();
  const { user, signOut } = useAuth();

  const displayName = profile?.full_name ?? user?.displayName ?? 'Mẹ của Bé Gấu';
  const email = user?.email ?? 'ngoc.mom@gmail.com';

  return (
    <ScrollView
      className="flex-1 bg-brand-peach"
      contentContainerStyle={{ paddingTop: insets.top + 18, paddingBottom: 96 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="px-5">
        <Text className="mb-7 text-xl font-bold text-brand-navy">Tài khoản</Text>

        <View className="mb-7 flex-row items-center">
          <Avatar
            uri={profile?.avatar_url ?? user?.avatarUrl ?? undefined}
            name={displayName}
            size="lg"
            className="bg-brand-pink-100"
          />
          <View className="ml-4 flex-1">
            <Text className="text-base font-bold text-brand-navy">{displayName}</Text>
            <Text className="mt-1 text-sm font-medium text-brand-navy/55">{email}</Text>
          </View>
        </View>

        <View className="gap-3">
          <MenuItem
            label="Hồ sơ của bé"
            icon="id-card-outline"
            onPress={() => router.push('/(profile)/babies')}
          />
          <MenuItem
            label="Hồ sơ của mẹ"
            icon="person-outline"
            onPress={() => router.push('/(profile)/')}
          />
          <MenuItem
            label="Thai kỳ"
            icon="heart-outline"
            onPress={() => router.push('/(profile)/pregnancies')}
          />
          <MenuItem
            label="Chia sẻ chăm sóc"
            icon="people-outline"
            onPress={() => router.push('/(profile)/care-sharing')}
          />
          <MenuItem
            label="Mời người chăm sóc"
            icon="mail-outline"
            onPress={() => router.push('/(profile)/invite')}
          />
          <MenuItem label="Cài đặt" icon="settings-outline" />
          <MenuItem
            label="Cài đặt thông báo"
            icon="notifications-outline"
            onPress={() => router.push('/(profile)/notification-settings')}
          />
          <MenuItem label="Ngôn ngữ" icon="globe-outline" value="Tiếng Việt" />
          <MenuItem label="Trung tâm trợ giúp" icon="help-circle-outline" />
          <MenuItem label="Giới thiệu ứng dụng" icon="information-circle-outline" />
        </View>

        <Button
          label="Đăng xuất"
          variant="primary"
          size="lg"
          className="mt-5 w-full shadow-brand"
          onPress={signOut}
        />
      </View>
    </ScrollView>
  );
}
