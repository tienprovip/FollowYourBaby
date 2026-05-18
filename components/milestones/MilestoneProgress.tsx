// ---------------------------------------------------------------------------
// MilestoneProgress — progress bar with X/total achieved count.
// ---------------------------------------------------------------------------

import React from 'react';
import { Text, View } from 'react-native';
import { cn } from '@/lib/cn';

export interface MilestoneProgressProps {
  achieved: number;
  total: number;
  className?: string;
}

function encouragingLabel(achieved: number, total: number): string {
  const pct = total === 0 ? 0 : achieved / total;
  if (achieved === 0) return 'Hành trình bắt đầu!';
  if (pct < 0.25) return 'Bé đang lớn lên từng ngày!';
  if (pct < 0.5) return 'Bé tiến bộ rất tốt!';
  if (pct < 0.75) return 'Bé thật tuyệt vời!';
  if (pct < 1) return 'Gần đạt hết rồi, tuyệt lắm!';
  return 'Xuất sắc! Bé đã hoàn thành tất cả!';
}

function MilestoneProgress({
  achieved,
  total,
  className,
}: MilestoneProgressProps) {
  const pct = total === 0 ? 0 : Math.min(1, achieved / total);

  return (
    <View className={cn(className)}>
      <View className="flex-row items-center justify-between mb-1">
        <Text className="text-brand-navy font-semibold text-sm">
          Mốc phát triển
        </Text>
        <Text className="text-brand-navy/60 text-xs font-semibold">
          {achieved}/{total}
        </Text>
      </View>

      {/* Track */}
      <View className="h-3 bg-brand-gray rounded-full overflow-hidden">
        <View
          className="h-full bg-brand-mint rounded-full"
          style={{ width: `${Math.round(pct * 100)}%` }}
          accessibilityRole="progressbar"
          accessibilityValue={{ min: 0, max: total, now: achieved }}
        />
      </View>

      <Text className="text-brand-navy/50 text-xs mt-1">
        {encouragingLabel(achieved, total)}
      </Text>
    </View>
  );
}

export default MilestoneProgress;
