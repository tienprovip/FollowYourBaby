import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import Card from '@/components/ui/Card';
import type { GrowthLogWithPercentile } from '@/hooks/useGrowthLogs';

interface GrowthMiniCardProps {
  latestLog: GrowthLogWithPercentile | null;
  isLoading?: boolean;
}

function SkeletonRow() {
  return (
    <View className="flex-row gap-4 mb-2">
      <View className="h-4 w-20 bg-brand-gray rounded-full" />
      <View className="h-4 w-16 bg-brand-gray rounded-full" />
    </View>
  );
}

function StatItem({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <View className="flex-1">
      <Text className="text-brand-navy/50 text-xs mb-0.5">{label}</Text>
      <Text className="text-brand-navy font-bold text-sm">{value}</Text>
      {sub ? <Text className="text-brand-navy/40 text-xs">{sub}</Text> : null}
    </View>
  );
}

function GrowthMiniCard({ latestLog, isLoading = false }: GrowthMiniCardProps) {
  const router = useRouter();

  const weightStr = latestLog?.weight_g
    ? `${(latestLog.weight_g / 1000).toFixed(2)} kg`
    : '--';
  const heightStr = latestLog?.length_cm ? `${latestLog.length_cm} cm` : '--';
  const dateStr = latestLog?.recorded_at
    ? new Date(latestLog.recorded_at).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
      })
    : null;

  return (
    <Card className="mx-4 mb-4">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-brand-navy font-bold text-sm">Tăng trưởng</Text>
        <Pressable
          onPress={() => router.push('/(tabs)/tracking')}
          accessibilityRole="button"
          accessibilityLabel="Xem chi tiết tăng trưởng"
        >
          <Text className="text-brand-pink text-xs font-semibold">Xem chi tiết</Text>
        </Pressable>
      </View>

      {isLoading ? (
        <>
          <SkeletonRow />
          <SkeletonRow />
        </>
      ) : latestLog ? (
        <View>
          <View className="flex-row mb-2">
            <StatItem
              label="Cân nặng"
              value={weightStr}
              sub={latestLog.weightPercentile ? `P${latestLog.weightPercentile}` : undefined}
            />
            <StatItem
              label="Chiều cao"
              value={heightStr}
              sub={latestLog.lengthPercentile ? `P${latestLog.lengthPercentile}` : undefined}
            />
            {latestLog.head_cm ? (
              <StatItem
                label="Vòng đầu"
                value={`${latestLog.head_cm} cm`}
                sub={latestLog.headPercentile ? `P${latestLog.headPercentile}` : undefined}
              />
            ) : null}
          </View>
          {dateStr ? (
            <Text className="text-brand-navy/40 text-xs">Cập nhật {dateStr}</Text>
          ) : null}
        </View>
      ) : (
        <View className="py-2">
          <Text className="text-brand-navy/50 text-sm">Chưa có dữ liệu tăng trưởng.</Text>
          <Pressable
            onPress={() => router.push('/(tabs)/tracking')}
            accessibilityRole="button"
            className="mt-2"
          >
            <Text className="text-brand-pink text-sm font-semibold">Thêm số đo ngay</Text>
          </Pressable>
        </View>
      )}
    </Card>
  );
}

export default GrowthMiniCard;
