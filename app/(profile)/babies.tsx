import { useState } from 'react';
import {
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';

import { useBabies } from '@/hooks/useBabies';
import { useBabyStore } from '@/stores/babyStore';
import { Avatar, Badge, Button, EmptyState, LoadingSpinner } from '@/components/ui';
import type { Database } from '@/types/database';

type BabyRow = Database['public']['Tables']['babies']['Row'];

function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'Chưa có';
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN');
}

function genderLabel(sex: string | null): string {
  if (sex === 'male') return 'Bé trai';
  if (sex === 'female') return 'Bé gái';
  return 'Không rõ';
}

export default function BabiesScreen() {
  const router = useRouter();
  const { babies, isLoading, deleteBaby } = useBabies();
  const { activeBabyId, setActiveBabyId } = useBabyStore();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function confirmDelete(baby: BabyRow) {
    Alert.alert(
      'Xóa hồ sơ bé',
      `Bạn có chắc muốn xóa hồ sơ của "${baby.name}"? Hành động này không thể hoàn tác.`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            setDeletingId(baby.id);
            try {
              await deleteBaby(baby.id);
            } catch {
              Alert.alert('Lỗi', 'Không thể xóa. Vui lòng thử lại.');
            } finally {
              setDeletingId(null);
            }
          },
        },
      ],
    );
  }

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-brand-peach">
        <LoadingSpinner />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Danh sách bé' }} />
      <FlatList
        data={babies}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 80 }}
        style={{ backgroundColor: '#fff5f7' }}
        ListEmptyComponent={
          <EmptyState
            title="Chưa có hồ sơ bé nào"
            description="Thêm hồ sơ bé đầu tiên của bạn để bắt đầu theo dõi."
          />
        }
        ListFooterComponent={
          <Button
            label="Thêm bé"
            variant="primary"
            size="lg"
            onPress={() => router.push('/(profile)/baby-form')}
            className="mt-4"
          />
        }
        renderItem={({ item }) => {
          const isActive = activeBabyId === item.id;
          return (
            <TouchableOpacity
              onPress={() => setActiveBabyId(item.id)}
              accessibilityRole="button"
              accessibilityLabel={`Chọn bé ${item.name}`}
              className={`bg-white rounded-card p-4 shadow-brand border ${
                isActive ? 'border-brand-pink' : 'border-brand-gray'
              }`}
            >
              <View className="flex-row items-center gap-x-3">
                <Avatar
                  uri={item.photo_url ?? undefined}
                  name={item.name}
                  size="md"
                />
                <View className="flex-1">
                  <View className="flex-row items-center gap-x-2">
                    <Text className="text-base font-bold text-brand-navy">{item.name}</Text>
                    {isActive && <Badge label="Đang chọn" variant="pink" />}
                  </View>
                  <Text className="text-xs text-brand-navy/60 mt-0.5">
                    {genderLabel(item.sex)} · Sinh ngày {formatDate(item.dob)}
                  </Text>
                </View>
              </View>

              <View className="flex-row gap-x-3 mt-3">
                <TouchableOpacity
                  onPress={() => router.push({ pathname: '/(profile)/baby-form', params: { id: item.id } })}
                  accessibilityRole="button"
                  className="flex-1 bg-brand-peach rounded-btn py-2 items-center"
                >
                  <Text className="text-sm font-semibold text-brand-pink">Chỉnh sửa</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => confirmDelete(item)}
                  disabled={deletingId === item.id}
                  accessibilityRole="button"
                  className="flex-1 bg-red-50 rounded-btn py-2 items-center"
                >
                  <Text className="text-sm font-semibold text-red-500">
                    {deletingId === item.id ? 'Đang xóa...' : 'Xóa'}
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </>
  );
}
