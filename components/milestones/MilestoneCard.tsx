// ---------------------------------------------------------------------------
// MilestoneCard — single milestone item card.
// Shows title, age range pill, achieved badge or CTA, and optional delay alert.
// ---------------------------------------------------------------------------

import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { cn } from '@/lib/cn';
import Badge from '@/components/ui/Badge';
import AchievedBadge from './AchievedBadge';
import type { MilestoneCatalogRow } from '@/hooks/useMilestoneCatalog';
import type { MilestoneRow } from '@/hooks/useMilestones';

export interface MilestoneCardProps {
  catalogItem: MilestoneCatalogRow;
  achievedRecord?: MilestoneRow | null;
  babyAgeInMonths: number;
  onPress: () => void;
  onMarkAchieved?: () => void;
  className?: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  motor: 'Vận động',
  language: 'Ngôn ngữ',
  cognitive: 'Nhận thức',
  social: 'Xã hội',
};

function MilestoneCard({
  catalogItem,
  achievedRecord,
  babyAgeInMonths,
  onPress,
  onMarkAchieved,
  className,
}: MilestoneCardProps) {
  const isAchieved = Boolean(achievedRecord?.achieved_at);
  const isOverdue =
    babyAgeInMonths > catalogItem.age_max_months && !isAchieved;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={catalogItem.title_vi}
      className={cn(
        'bg-white rounded-card shadow-brand border border-brand-gray p-4',
        isAchieved && 'border-brand-mint/60',
        isOverdue && 'border-amber-200',
        className,
      )}
    >
      {/* Top row: title + category badge */}
      <View className="flex-row items-start justify-between mb-2 gap-x-2">
        <Text
          className={cn(
            'flex-1 text-sm font-semibold text-brand-navy',
            isAchieved && 'text-[#1A7A4A]',
          )}
          numberOfLines={2}
        >
          {catalogItem.title_vi}
        </Text>
        <Badge
          label={CATEGORY_LABELS[catalogItem.category] ?? catalogItem.category}
          variant={isAchieved ? 'green' : 'neutral'}
          className="shrink-0"
        />
      </View>

      {/* Age range pill */}
      <View className="flex-row items-center mb-3 gap-x-2">
        <View className="bg-brand-blue/20 rounded-full px-2 py-0.5 self-start">
          <Text className="text-[#1A6099] text-xs font-medium">
            {catalogItem.age_min_months}–{catalogItem.age_max_months} tháng
          </Text>
        </View>

        {/* Overdue indicator */}
        {isOverdue && (
          <View className="bg-amber-100 rounded-full px-2 py-0.5 self-start">
            <Text className="text-amber-700 text-xs font-medium">
              Cần chú ý
            </Text>
          </View>
        )}
      </View>

      {/* Description excerpt */}
      <Text
        className="text-brand-navy/60 text-xs leading-5 mb-3"
        numberOfLines={2}
      >
        {catalogItem.description_vi}
      </Text>

      {/* Footer: achieved badge OR mark button */}
      {isAchieved && achievedRecord?.achieved_at ? (
        <AchievedBadge achievedAt={achievedRecord.achieved_at} />
      ) : (
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            onMarkAchieved?.();
          }}
          className="self-start bg-brand-mint/20 border border-brand-mint rounded-btn px-4 py-2"
          accessibilityRole="button"
          accessibilityLabel={`Đánh dấu đạt ${catalogItem.title_vi}`}
        >
          <Text className="text-[#1A7A4A] text-xs font-semibold">
            Danh dau dat
          </Text>
        </Pressable>
      )}
    </Pressable>
  );
}

export default MilestoneCard;
