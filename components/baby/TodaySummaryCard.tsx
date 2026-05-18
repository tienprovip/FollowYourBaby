// ---------------------------------------------------------------------------
// TodaySummaryCard — compact summary row for the baby dashboard.
// Shows a single metric (icon + value + label) in a card cell.
// ---------------------------------------------------------------------------

import React from 'react';
import { Text, View } from 'react-native';
import { cn } from '@/lib/cn';

interface TodaySummaryCardProps {
  emoji: string;
  value: string;
  label: string;
  /** NativeWind className for the outer container */
  className?: string;
}

function TodaySummaryCard({ emoji, value, label, className }: TodaySummaryCardProps) {
  return (
    <View
      className={cn('flex-1 items-center gap-y-0.5 py-3', className)}
      accessibilityRole="text"
      accessibilityLabel={`${label}: ${value}`}
    >
      <Text style={{ fontSize: 22 }}>{emoji}</Text>
      <Text className="text-lg font-bold text-brand-navy">{value}</Text>
      <Text className="text-[10px] text-brand-navy/60 text-center">{label}</Text>
    </View>
  );
}

export default TodaySummaryCard;
