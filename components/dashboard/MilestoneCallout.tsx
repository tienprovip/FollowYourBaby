import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import type { MilestoneCatalogRow } from '@/hooks/useMilestoneCatalog';

interface MilestoneCalloutProps {
  nextMilestone: MilestoneCatalogRow | null;
}

function MilestoneCallout({ nextMilestone }: MilestoneCalloutProps) {
  const router = useRouter();

  if (!nextMilestone) return null;

  return (
    <Pressable
      onPress={() => router.push('/(tabs)/milestones')}
      accessibilityRole="button"
      accessibilityLabel={`Mốc sắp tới: ${nextMilestone.name_vi}`}
      className="mx-4 mb-4 bg-amber-50 border border-amber-200 rounded-card px-4 py-3 active:opacity-75"
    >
      <View className="flex-row items-center">
        <View className="flex-1">
          <Text className="text-amber-700 font-bold text-xs mb-0.5">Mốc sắp tới</Text>
          <Text className="text-brand-navy font-semibold text-sm">{nextMilestone.name_vi}</Text>
          {nextMilestone.description_vi ? (
            <Text className="text-brand-navy/60 text-xs mt-0.5" numberOfLines={1}>
              {nextMilestone.description_vi}
            </Text>
          ) : null}
        </View>
        <Text className="text-amber-400 text-lg ml-2">{'>'}</Text>
      </View>
    </Pressable>
  );
}

export default MilestoneCallout;
