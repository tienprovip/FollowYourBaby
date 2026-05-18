import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Stack } from 'expo-router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, Button, FormField } from '@/components/ui';
import { USER_ROLE } from '@/lib/constants';

const schema = z.object({
  full_name: z.string().min(1, 'Vui lòng nhập họ tên').max(100),
  phone: z.string().max(20).optional().or(z.literal('')),
});

type FormValues = z.infer<typeof schema>;

const ROLE_LABELS: Record<string, string> = {
  pregnant_mother: 'Mẹ bầu',
  parent: 'Phụ huynh',
  caregiver: 'Người chăm sóc',
};

export default function ProfileEditScreen() {
  const { profile, isLoading, updateProfile, isUpdating } = useProfile();
  const { signOut } = useAuth();
  const [saveSuccess, setSaveSuccess] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: {
      full_name: profile?.full_name ?? '',
      phone: profile?.phone ?? '',
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      await updateProfile({
        full_name: values.full_name,
        phone: values.phone || null,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch {
      Alert.alert('Lỗi', 'Không thể lưu thông tin. Vui lòng thử lại.');
    }
  }

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-brand-peach">
        <ActivityIndicator color="#FF8FA8" size="large" />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Hồ sơ của tôi' }} />
      <ScrollView className="flex-1 bg-brand-peach" contentContainerStyle={{ padding: 20 }}>
        <View className="items-center mb-8 mt-2">
          <Avatar
            uri={profile?.avatar_url ?? undefined}
            name={profile?.full_name ?? 'Người dùng'}
            size="lg"
          />
          <Text className="mt-3 text-base font-semibold text-brand-navy">
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

        <View className="bg-white rounded-card p-5 shadow-brand mb-4 gap-y-4">
          <Text className="text-base font-bold text-brand-navy mb-1">Thông tin cơ bản</Text>

          <FormField
            control={control}
            name="full_name"
            label="Họ và tên"
            placeholder="Nguyễn Thị Lan"
          />

          <FormField
            control={control}
            name="phone"
            label="Số điện thoại"
            placeholder="0901 234 567"
            type="numeric"
          />

          <View className="bg-brand-gray rounded-input px-4 py-3">
            <Text className="text-xs text-brand-navy/50 mb-0.5">Vai trò</Text>
            <Text className="text-sm text-brand-navy font-medium">
              {profile?.role ? (ROLE_LABELS[profile.role] ?? profile.role) : 'Chưa thiết lập'}
            </Text>
          </View>
        </View>

        <Button
          label={saveSuccess ? 'Đã lưu!' : 'Lưu thay đổi'}
          variant="primary"
          size="lg"
          loading={isUpdating}
          onPress={handleSubmit(onSubmit)}
          className="mb-4"
        />

        <Button
          label="Đăng xuất"
          variant="ghost"
          size="md"
          onPress={() => {
            Alert.alert('Đăng xuất', 'Bạn có chắc muốn đăng xuất không?', [
              { text: 'Hủy', style: 'cancel' },
              { text: 'Đăng xuất', style: 'destructive', onPress: signOut },
            ]);
          }}
        />
      </ScrollView>
    </>
  );
}
