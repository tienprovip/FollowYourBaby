import React from 'react';
import { Text, View } from 'react-native';
import { cn } from '@/lib/cn';

interface WeekBadgeProps {
  week: number;
  trimester: 1 | 2 | 3;
  className?: string;
}

const trimesterColors: Record<1 | 2 | 3, { bg: string; text: string; label: string }> = {
  1: { bg: 'bg-brand-lavender-50', text: 'text-brand-lavender', label: 'Tam cá nguyệt 1' },
  2: { bg: 'bg-brand-peach', text: 'text-brand-pink', label: 'Tam cá nguyệt 2' },
  3: { bg: 'bg-brand-mint/20', text: 'text-[#1A7A4A]', label: 'Tam cá nguyệt 3' },
};

function WeekBadge({ week, trimester, className }: WeekBadgeProps) {
  const colors = trimesterColors[trimester];

  return (
    <View
      className={cn(
        'rounded-card items-center justify-center px-6 py-4',
        colors.bg,
        className,
      )}
      accessibilityRole="text"
      accessibilityLabel={`Tuần thai ${week}, ${colors.label}`}
    >
      <Text className={cn('text-5xl font-bold', colors.text)}>{week}</Text>
      <Text className={cn('text-base font-semibold mt-1', colors.text)}>
        Tuần thai
      </Text>
      <View className="mt-2 bg-white/60 rounded-full px-3 py-1">
        <Text className={cn('text-xs font-medium', colors.text)}>
          {colors.label}
        </Text>
      </View>
    </View>
  );
}

export default WeekBadge;
