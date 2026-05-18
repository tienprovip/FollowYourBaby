// ---------------------------------------------------------------------------
// All Achieved Milestones Screen — sorted desc, grouped by category
// ---------------------------------------------------------------------------

import React from 'react';
import { SectionList, Text, TouchableOpacity, View } from 'react-native';
import { Stack, router } from 'expo-router';
import { useBaby } from '@/hooks/useBaby';
import { useMilestones } from '@/hooks/useMilestones';
import { useMilestoneCatalog } from '@/hooks/useMilestoneCatalog';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import AchievedBadge from '@/components/milestones/AchievedBadge';
import type { MilestoneRow } from '@/hooks/useMilestones';
import type { MilestoneCatalogRow } from '@/hooks/useMilestoneCatalog';
import type { MilestoneCategory } from '@/types/database';

const CATEGORY_ORDER: MilestoneCategory[] = [
  'motor',
  'language',
  'cognitive',
  'social',
];

const CATEGORY_LABELS: Record<MilestoneCategory, string> = {
  motor: 'Van dong',
  language: 'Ngon ngu',
  cognitive: 'Nhan thuc',
  social: 'Xa hoi',
};

const CATEGORY_EMOJI: Record<MilestoneCategory, string> = {
  motor: '',
  language: '',
  cognitive: '',
  social: '',
};

interface AchievedWithCatalog {
  achieved: MilestoneRow;
  catalog: MilestoneCatalogRow;
}

interface Section {
  title: string;
  category: MilestoneCategory;
  data: AchievedWithCatalog[];
}

export default function AllAchievedScreen() {
  const { baby, isLoading: babyLoading } = useBaby();
  const babyAge = baby?.ageInMonths ?? 0;
  const { achieved, isLoading: milestonesLoading } = useMilestones(babyAge);
  const { catalog, isLoading: catalogLoading } = useMilestoneCatalog();

  const isLoading = babyLoading || milestonesLoading || catalogLoading;

  const sections: Section[] = React.useMemo(() => {
    const catalogMap = new Map<string, MilestoneCatalogRow>();
    for (const c of catalog) catalogMap.set(c.key, c);

    const result: Section[] = [];
    for (const category of CATEGORY_ORDER) {
      const items = achieved
        .filter((m) => m.category === category)
        .map((m) => ({ achieved: m, catalog: catalogMap.get(m.key)! }))
        .filter((item) => item.catalog != null)
        .sort((a, b) => {
          const dateA = a.achieved.achieved_at ?? '';
          const dateB = b.achieved.achieved_at ?? '';
          return dateB.localeCompare(dateA); // desc
        });

      if (items.length > 0) {
        result.push({
          title: `${CATEGORY_EMOJI[category]} ${CATEGORY_LABELS[category]}`,
          category,
          data: items,
        });
      }
    }
    return result;
  }, [achieved, catalog]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-brand-peach">
        <LoadingSpinner />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Moc da dat' }} />

      {achieved.length === 0 ? (
        <EmptyState
          title="Chua co moc nao"
          body="Hay danh dau khi be dat duoc moc phat trien dau tien!"
        />
      ) : (
        <SectionList
          className="flex-1 bg-brand-peach"
          contentContainerStyle={{ padding: 20, paddingBottom: 60 }}
          sections={sections}
          keyExtractor={(item) => item.achieved.id}
          renderSectionHeader={({ section }) => (
            <View className="mb-2 mt-4">
              <Text className="text-brand-navy font-bold text-base">
                {section.title}
              </Text>
            </View>
          )}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: '/(milestones)/[key]',
                  params: { key: item.catalog.key },
                })
              }
              className="bg-white rounded-card shadow-brand border border-brand-mint/50 px-4 py-3 mb-2"
              accessibilityRole="button"
              accessibilityLabel={item.catalog.title_vi}
            >
              <View className="flex-row items-start justify-between">
                <View className="flex-1 mr-3">
                  <Text className="text-brand-navy font-semibold text-sm mb-1">
                    {item.catalog.title_vi}
                  </Text>
                  {item.achieved.note ? (
                    <Text
                      className="text-brand-navy/50 text-xs leading-5"
                      numberOfLines={2}
                    >
                      {item.achieved.note}
                    </Text>
                  ) : null}
                </View>
                {item.achieved.achieved_at ? (
                  <AchievedBadge achievedAt={item.achieved.achieved_at} />
                ) : null}
              </View>
            </TouchableOpacity>
          )}
          stickySectionHeadersEnabled={false}
        />
      )}
    </>
  );
}
