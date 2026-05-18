// ---------------------------------------------------------------------------
// Milestones Tab — developmental milestone tracker dashboard.
// ---------------------------------------------------------------------------

import React, { useState, useMemo } from 'react';
import {
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useBaby } from '@/hooks/useBaby';
import { useBabyStore } from '@/stores/babyStore';
import { useMilestoneCatalog } from '@/hooks/useMilestoneCatalog';
import { useMilestones } from '@/hooks/useMilestones';
import { useToast } from '@/components/ui/Toast';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Modal from '@/components/ui/Modal';
import DateField from '@/components/ui/DateField';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import AIDisclaimer from '@/components/ui/AIDisclaimer';
import MilestoneCard from '@/components/milestones/MilestoneCard';
import CategoryFilter, {
  type CategoryFilterValue,
} from '@/components/milestones/CategoryFilter';
import MilestoneProgress from '@/components/milestones/MilestoneProgress';
import type { MilestoneCatalogRow } from '@/hooks/useMilestoneCatalog';

// ---------------------------------------------------------------------------
// Quick-mark modal state
// ---------------------------------------------------------------------------

interface QuickMarkState {
  catalogItem: MilestoneCatalogRow;
  defaultDate: Date;
}

// ---------------------------------------------------------------------------
// Main screen
// ---------------------------------------------------------------------------

export default function MilestonesTab() {
  const { activeBabyId } = useBabyStore();
  const { baby, isLoading: babyLoading } = useBaby();
  const babyAge = baby?.ageInMonths ?? 0;

  const { catalog, isLoading: catalogLoading } = useMilestoneCatalog();
  const {
    achieved,
    achievedKeys,
    achievedMap,
    expectedNow,
    recentlyAchieved,
    totalAchieved,
    overdue,
    isLoading: milestonesLoading,
    markAchieved,
    isMarking,
  } = useMilestones(babyAge);
  const { show: showToast } = useToast();

  const [categoryFilter, setCategoryFilter] = useState<CategoryFilterValue>('all');
  const [quickMark, setQuickMark] = useState<QuickMarkState | null>(null);
  const [markDate, setMarkDate] = useState(new Date());
  const [markNote, setMarkNote] = useState('');

  const isLoading = babyLoading || catalogLoading || milestonesLoading;

  // -----------------------------------------------------------------------
  // Filtered catalog (for "Tat ca" section)
  // -----------------------------------------------------------------------
  const filteredCatalog = useMemo(() => {
    if (categoryFilter === 'all') return catalog;
    return catalog.filter((c) => c.category === categoryFilter);
  }, [catalog, categoryFilter]);

  // -----------------------------------------------------------------------
  // Refresh
  // -----------------------------------------------------------------------
  function onRefresh() {
    // TanStack Query manages refetch
  }

  // -----------------------------------------------------------------------
  // Guard: no active baby
  // -----------------------------------------------------------------------
  if (!activeBabyId) {
    return (
      <View className="flex-1 bg-brand-peach">
        <EmptyState
          title="Chua chon be"
          body="Them hoac chon mot em be trong phan Ho so de theo doi moc phat trien."
          cta={{
            label: 'Den Ho so',
            onPress: () => router.push('/(tabs)/profile'),
          }}
        />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-brand-peach">
        <LoadingSpinner />
      </View>
    );
  }

  // -----------------------------------------------------------------------
  // Quick mark handler
  // -----------------------------------------------------------------------
  async function handleQuickMark() {
    if (!quickMark) return;
    try {
      await markAchieved({
        key: quickMark.catalogItem.key,
        category: quickMark.catalogItem.category,
        achieved_at: [markDate.getFullYear(), String(markDate.getMonth() + 1).padStart(2, '0'), String(markDate.getDate()).padStart(2, '0')].join('-'),
        note: markNote.trim() || null,
      });
      setQuickMark(null);
      setMarkNote('');
      showToast(
        `Chuc mung! Be da dat moc "${quickMark.catalogItem.title_vi}"`,
        'success',
        4000,
      );
    } catch {
      Alert.alert('Loi', 'Khong the luu. Vui long thu lai.');
    }
  }

  return (
    <>
      <ScrollView
        className="flex-1 bg-brand-peach"
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        {/* ----------------------------------------------------------------- */}
        {/* Header */}
        {/* ----------------------------------------------------------------- */}
        <View className="px-5 pt-14 pb-4">
          <Text className="text-brand-navy text-2xl font-bold">
            Moc phat trien
          </Text>
          {baby && (
            <Text className="text-brand-navy/60 text-sm mt-1">
              {baby.name} - {baby.ageLabel}
            </Text>
          )}
        </View>

        {/* ----------------------------------------------------------------- */}
        {/* Progress bar */}
        {/* ----------------------------------------------------------------- */}
        <View className="px-5 mb-4">
          <Card padding="md">
            <MilestoneProgress
              achieved={totalAchieved}
              total={catalog.length}
            />
          </Card>
        </View>

        {/* ----------------------------------------------------------------- */}
        {/* Overdue alert summary */}
        {/* ----------------------------------------------------------------- */}
        {overdue.length > 0 && (
          <View className="mx-5 mb-4 bg-amber-50 border border-amber-200 rounded-card px-4 py-3">
            <Text className="text-amber-800 font-semibold text-sm mb-1">
              {overdue.length} moc can theo doi
            </Text>
            <Text className="text-amber-700 text-xs leading-5">
              Moi be phat trien khac nhau. Neu ban lo lang, hay trao doi voi
              bac si nhi khoa.
            </Text>
          </View>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* Expected this month section */}
        {/* ----------------------------------------------------------------- */}
        {expectedNow.length > 0 && categoryFilter === 'all' && (
          <View className="px-5 mb-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-brand-navy font-bold text-base">
                Du kien thang nay
              </Text>
              <Text className="text-brand-navy/40 text-xs">
                {expectedNow.length} moc
              </Text>
            </View>
            <View className="gap-y-3">
              {expectedNow.map((item) => (
                <MilestoneCard
                  key={item.key}
                  catalogItem={item}
                  achievedRecord={achievedMap.get(item.key) ?? null}
                  babyAgeInMonths={babyAge}
                  onPress={() =>
                    router.push({
                      pathname: '/(milestones)/[key]',
                      params: { key: item.key },
                    })
                  }
                  onMarkAchieved={() => {
                    setMarkDate(new Date());
                    setMarkNote('');
                    setQuickMark({ catalogItem: item, defaultDate: new Date() });
                  }}
                />
              ))}
            </View>
          </View>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* Recently achieved section */}
        {/* ----------------------------------------------------------------- */}
        {recentlyAchieved.length > 0 && categoryFilter === 'all' && (
          <View className="px-5 mb-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-brand-navy font-bold text-base">
                Vua dat duoc
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/(milestones)/achieved')}
              >
                <Text className="text-brand-pink text-xs font-semibold">
                  Xem tat ca
                </Text>
              </TouchableOpacity>
            </View>
            <View className="gap-y-3">
              {recentlyAchieved.slice(0, 3).map((m) => {
                const cat = catalog.find((c) => c.key === m.key);
                if (!cat) return null;
                return (
                  <MilestoneCard
                    key={m.id}
                    catalogItem={cat}
                    achievedRecord={m}
                    babyAgeInMonths={babyAge}
                    onPress={() =>
                      router.push({
                        pathname: '/(milestones)/[key]',
                        params: { key: cat.key },
                      })
                    }
                  />
                );
              })}
            </View>
          </View>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* Category filter + full list */}
        {/* ----------------------------------------------------------------- */}
        <View className="px-5 mb-3">
          <Text className="text-brand-navy font-bold text-base mb-3">
            Tat ca cac moc
          </Text>
          <CategoryFilter
            selected={categoryFilter}
            onChange={setCategoryFilter}
            className="mb-4"
          />
          <View className="gap-y-3">
            {filteredCatalog.map((item) => (
              <MilestoneCard
                key={item.key}
                catalogItem={item}
                achievedRecord={achievedMap.get(item.key) ?? null}
                babyAgeInMonths={babyAge}
                onPress={() =>
                  router.push({
                    pathname: '/(milestones)/[key]',
                    params: { key: item.key },
                  })
                }
                onMarkAchieved={() => {
                  if (achievedKeys.has(item.key)) return;
                  setMarkDate(new Date());
                  setMarkNote('');
                  setQuickMark({ catalogItem: item, defaultDate: new Date() });
                }}
              />
            ))}
          </View>
        </View>

        {/* Disclaimer footer */}
        <View className="px-5 mt-2 mb-4">
          <AIDisclaimer />
          <Text className="text-brand-navy/40 text-xs text-center mt-3 leading-5">
            Cac moc tren chi mang tinh tham khao. Moi tre phat trien theo
            toc do rieng. Hay trao doi voi bac si khi co bat ky lo lang nao.
          </Text>
        </View>
      </ScrollView>

      {/* ----------------------------------------------------------------- */}
      {/* Quick mark modal */}
      {/* ----------------------------------------------------------------- */}
      <Modal
        visible={quickMark !== null}
        onDismiss={() => setQuickMark(null)}
        accessibilityLabel="Danh dau dat moc"
      >
        <Text className="text-brand-navy text-lg font-bold mb-1">
          Danh dau dat
        </Text>
        {quickMark && (
          <Text className="text-brand-navy/60 text-sm mb-4">
            {quickMark.catalogItem.title_vi}
          </Text>
        )}

        <DateField
          label="Ngay dat"
          value={markDate}
          onChange={setMarkDate}
          maximumDate={new Date()}
          className="mb-4"
        />

        <Input
          label="Ghi chu (tuy chon)"
          value={markNote}
          onChangeText={setMarkNote}
          placeholder="Be lan dau bo vao ngay..."
          multiline
          numberOfLines={3}
          className="mb-6"
          inputClassName="h-auto"
        />

        <View className="flex-row gap-x-3">
          <Button
            label="Luu"
            variant="primary"
            size="md"
            className="flex-1"
            loading={isMarking}
            onPress={handleQuickMark}
          />
          <Button
            label="Huy"
            variant="secondary"
            size="md"
            className="flex-1"
            onPress={() => setQuickMark(null)}
          />
        </View>
      </Modal>
    </>
  );
}
