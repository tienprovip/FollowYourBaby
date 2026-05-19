import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import Card from '@/components/ui/Card';
import type { Database } from '@/types/database';

type VisitRow = Database['public']['Tables']['prenatal_visits']['Row'];

interface UpcomingVisitCardProps {
  nextVisit: VisitRow | null;
  pregnancyId: string | null;
}

const VISIT_TYPE_LABELS: Record<string, string> = {
  checkup: 'Khám thai',
  ultrasound: 'Siêu âm',
  blood_test: 'Xét nghiệm máu',
  glucose_test: 'Xét nghiệm đường',
  other: 'Lịch khám',
};

function UpcomingVisitCard({ nextVisit, pregnancyId }: UpcomingVisitCardProps) {
  const router = useRouter();

  if (!pregnancyId) return null;

  const handlePress = () => router.push('/(tabs)/tracking');

  if (!nextVisit) {
    return (
      <Card className="mx-4 mb-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-brand-navy font-bold text-sm mb-1">Lịch khám thai</Text>
            <Text className="text-brand-navy/50 text-xs">Chưa có lịch khám sắp tới</Text>
          </View>
          <Pressable
            onPress={handlePress}
            accessibilityRole="button"
            accessibilityLabel="Thêm lịch khám"
            className="bg-brand-pink/10 rounded-btn px-3 py-1.5"
          >
            <Text className="text-brand-pink font-semibold text-xs">Thêm lịch</Text>
          </Pressable>
        </View>
      </Card>
    );
  }

  const visitDate = new Date(nextVisit.scheduled_at);
  const dateStr = visitDate.toLocaleDateString('vi-VN', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
  });
  const timeStr = visitDate.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const typeLabel = VISIT_TYPE_LABELS[nextVisit.type ?? 'checkup'] ?? 'Lịch khám';

  const daysUntil = Math.ceil(
    (visitDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );
  const urgencyColor =
    daysUntil <= 1
      ? 'text-red-600'
      : daysUntil <= 3
      ? 'text-amber-600'
      : 'text-brand-navy/50';

  return (
    <Card className="mx-4 mb-4" onPress={handlePress} accessibilityLabel="Xem lịch khám">
      <View className="flex-row items-center">
        <View className="w-10 h-10 rounded-xl bg-brand-pink/10 items-center justify-center mr-3">
          <Text className="text-xl">H</Text>
        </View>
        <View className="flex-1">
          <Text className="text-brand-navy font-bold text-sm">{typeLabel}</Text>
          <Text className="text-brand-navy/60 text-xs mt-0.5">
            {dateStr} - {timeStr}
          </Text>
          {nextVisit.location ? (
            <Text className="text-brand-navy/50 text-xs" numberOfLines={1}>
              {nextVisit.location}
            </Text>
          ) : null}
        </View>
        <Text className={`text-xs font-semibold ${urgencyColor}`}>
          {daysUntil === 0 ? 'Hôm nay' : daysUntil === 1 ? 'Ngày mai' : `${daysUntil} ngày`}
        </Text>
      </View>
    </Card>
  );
}

export default UpcomingVisitCard;
