import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

interface SummaryChipProps {
  value: string;
  label: string;
  onPress: () => void;
}

function SummaryChip({ value, label, onPress }: SummaryChipProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${value}`}
      className="flex-1 bg-white rounded-xl py-3 px-2 items-center shadow-brand border border-brand-gray active:opacity-75"
    >
      <Text className="text-brand-navy font-bold text-base leading-tight">{value}</Text>
      <Text className="text-brand-navy/50 text-xs mt-0.5 text-center">{label}</Text>
    </Pressable>
  );
}

interface TodaySummaryStripProps {
  feedCount: number;
  sleepHours: number;
  sleepMinutesRemainder: number;
  diaperCount: number;
  isLoading?: boolean;
}

function SkeletonChip() {
  return (
    <View className="flex-1 bg-white rounded-xl py-3 px-2 items-center shadow-brand border border-brand-gray">
      <View className="h-4 w-10 bg-brand-gray rounded-full mb-1" />
      <View className="h-3 w-8 bg-brand-gray rounded-full" />
    </View>
  );
}

function TodaySummaryStrip({
  feedCount,
  sleepHours,
  sleepMinutesRemainder,
  diaperCount,
  isLoading = false,
}: TodaySummaryStripProps) {
  const router = useRouter();

  const sleepLabel =
    sleepHours > 0
      ? sleepMinutesRemainder > 0
        ? `${sleepHours}g${sleepMinutesRemainder}p`
        : `${sleepHours}g`
      : sleepMinutesRemainder > 0
      ? `${sleepMinutesRemainder}p`
      : '0g';

  return (
    <View className="px-4 mb-4">
      <Text className="text-brand-navy font-bold text-sm mb-2">Hôm nay</Text>
      <View className="flex-row gap-2">
        {isLoading ? (
          <>
            <SkeletonChip />
            <SkeletonChip />
            <SkeletonChip />
          </>
        ) : (
          <>
            <SummaryChip
              value={`${feedCount} lần`}
              label="Bú / ăn"
              onPress={() => router.push('/(tabs)/tracking')}
            />
            <SummaryChip
              value={sleepLabel}
              label="Ngủ"
              onPress={() => router.push('/(tabs)/tracking')}
            />
            <SummaryChip
              value={`${diaperCount} tã`}
              label="Thay tã"
              onPress={() => router.push('/(tabs)/tracking')}
            />
          </>
        )}
      </View>
    </View>
  );
}

export default TodaySummaryStrip;
