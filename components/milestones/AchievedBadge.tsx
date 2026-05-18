// ---------------------------------------------------------------------------
// AchievedBadge — green checkmark badge with achieved date
// ---------------------------------------------------------------------------

import React from 'react';
import { Text, View } from 'react-native';
import { cn } from '@/lib/cn';

export interface AchievedBadgeProps {
  achievedAt: string; // ISO date string
  className?: string;
}

function formatAchievedDate(iso: string): string {
  const d = new Date(iso);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

function AchievedBadge({ achievedAt, className }: AchievedBadgeProps) {
  return (
    <View
      className={cn(
        'flex-row items-center bg-brand-mint/30 rounded-full px-3 py-1 self-start',
        className,
      )}
      accessibilityRole="text"
      accessibilityLabel={`Đã đạt ngày ${formatAchievedDate(achievedAt)}`}
    >
      <Text className="text-[#1A7A4A] font-bold text-xs mr-1">✓</Text>
      <Text className="text-[#1A7A4A] text-xs font-semibold">
        {formatAchievedDate(achievedAt)}
      </Text>
    </View>
  );
}

export default AchievedBadge;
