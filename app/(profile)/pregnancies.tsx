import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';

import { usePregnancies } from '@/hooks/usePregnancies';
import { useBabyStore } from '@/stores/babyStore';
import { Badge, Button, EmptyState, LoadingSpinner } from '@/components/ui';
import type { Database } from '@/types/database';

type PregnancyRow = Database['public']['Tables']['pregnancies']['Row'];

function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'Chưa rõ';
  return new Date(dateStr).toLocaleDateString('vi-VN');
}

function weeksSince(lmpDate: string | null): number | null {
  if (!lmpDate) return null;
  const diff = Date.now() - new Date(lmpDate).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
}

const STATUS_LABELS: Record<string, { label: string; variant: 'green' | 'neutral' | 'red' }> = {
  active: { label: 'Đang mang thai', variant: 'green' },
  completed: { label: 'Đã sinh', variant: 'neutral' },
  lost: { label: 'Lưu thai', variant: 'red' },
};

export default function PregnanciesScreen() {
  const router = useRouter();
  const { pregnancies, isLoading } = usePregnancies();
  const { activePregnancyId, setActivePregnancyId } = useBabyStore();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-brand-peach">
        <LoadingSpinner />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Thai kỳ' }} />
      <FlatList
        data={pregnancies}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 80 }}
        style={{ backgroundColor: '#FFF3EC' }}
        ListEmptyComponent={
          <EmptyState
            title="Chưa có thai kỳ nào"
            description="Thêm thông tin thai kỳ để theo dõi hành trình mang thai."
          />
        }
        ListFooterComponent={
          <Button
            label="Thêm thai kỳ"
            variant="primary"
            size="lg"
            onPress={() => router.push('/(profile)/pregnancy-form')}
            className="mt-4"
          />
        }
        renderItem={({ item }: { item: PregnancyRow }) => {
          const isActive = activePregnancyId === item.id;
          const statusInfo = STATUS_LABELS[item.status] ?? { label: item.status, variant: 'neutral' as const };
          const weeks = weeksSince(item.lmp_date);

          return (
            <TouchableOpacity
              onPress={() => {
                if (item.status === 'active') setActivePregnancyId(item.id);
              }}
              accessibilityRole="button"
              accessibilityLabel={`Chọn thai kỳ`}
              className={`bg-white rounded-card p-4 shadow-brand border ${
                isActive ? 'border-brand-pink' : 'border-brand-gray'
              }`}
            >
              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center gap-x-2">
                  <Badge label={statusInfo.label} variant={statusInfo.variant} />
                  {isActive && <Badge label="Đang theo dõi" variant="pink" />}
                </View>
              </View>

              <Text className="text-sm text-brand-navy/70 mt-1">
                Ngày dự sinh: <Text className="font-semibold text-brand-navy">{formatDate(item.due_date)}</Text>
              </Text>
              {item.lmp_date && (
                <Text className="text-sm text-brand-navy/70 mt-0.5">
                  Kỳ kinh cuối: {formatDate(item.lmp_date)}
                  {weeks !== null && <Text className="text-brand-pink font-semibold"> ({weeks} tuần)</Text>}
                </Text>
              )}

              <View className="flex-row gap-x-3 mt-3">
                <TouchableOpacity
                  onPress={() =>
                    router.push({ pathname: '/(profile)/pregnancy-form', params: { id: item.id } })
                  }
                  accessibilityRole="button"
                  className="flex-1 bg-brand-peach rounded-btn py-2 items-center"
                >
                  <Text className="text-sm font-semibold text-brand-pink">Chỉnh sửa</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </>
  );
}
