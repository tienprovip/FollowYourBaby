// ---------------------------------------------------------------------------
// Baby Dashboard Tab — daily summary + quick-log actions
// ---------------------------------------------------------------------------

import React, { useCallback, useRef, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useBaby } from '@/hooks/useBaby';
import { useFeedLogs } from '@/hooks/useFeedLogs';
import { useSleepLogs } from '@/hooks/useSleepLogs';
import { useDiaperLogs } from '@/hooks/useDiaperLogs';
import { useGrowthLogs } from '@/hooks/useGrowthLogs';
import { useBabyTrackingStore } from '@/stores/babyTrackingStore';
import { useBabyStore } from '@/stores/babyStore';
import AgeBadge from '@/components/baby/AgeBadge';
import QuickLogButton from '@/components/baby/QuickLogButton';
import TodaySummaryCard from '@/components/baby/TodaySummaryCard';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// ---------------------------------------------------------------------------
// Feed type labels
// ---------------------------------------------------------------------------
const FEED_TYPE_LABELS: Record<string, string> = {
  breast: 'Bú mẹ',
  bottle: 'Bình sữa',
  solid: 'Ăn dặm',
};

// ---------------------------------------------------------------------------
// Helper — format relative time
// ---------------------------------------------------------------------------
function relativeTime(isoStr: string): string {
  const then = parseISO(isoStr);
  const diffMin = Math.floor((Date.now() - then.getTime()) / 60000);
  if (diffMin < 1) return 'Vừa xong';
  if (diffMin < 60) return `${diffMin} phút trước`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH} giờ trước`;
  return format(then, 'HH:mm, dd/MM', { locale: vi });
}

// ---------------------------------------------------------------------------
// Main screen
// ---------------------------------------------------------------------------

export default function BabyTab() {
  const { activeBabyId } = useBabyStore();
  const { baby, isLoading: babyLoading } = useBaby();
  const { lastFeed, todayLogs: feedToday, isLoading: feedLoading } = useFeedLogs();
  const {
    lastSleep,
    todayNapMinutes,
    todayNightMinutes,
    isLoading: sleepLoading,
  } = useSleepLogs();
  const { todayCount: diaperCount, isLoading: diaperLoading } = useDiaperLogs();
  const { latestLog: latestGrowth, isLoading: growthLoading } = useGrowthLogs(
    baby?.sex,
    baby?.dob,
  );
  const { activeFeedSession, activeSleepSession } = useBabyTrackingStore();

  const dataLoading =
    babyLoading || feedLoading || sleepLoading || diaperLoading || growthLoading;

  const onRefresh = useCallback(() => {
    // TanStack Query handles re-fetch via cache invalidation
  }, []);

  // --- No active baby ---
  if (!activeBabyId) {
    return (
      <View className="flex-1 bg-brand-peach">
        <EmptyState
          title="Chưa chọn bé"
          body="Thêm hoặc chọn một em bé trong phần Hồ sơ để bắt đầu theo dõi."
          cta={{
            label: 'Đến Hồ sơ',
            onPress: () => router.push('/(tabs)/profile'),
          }}
        />
      </View>
    );
  }

  if (babyLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-brand-peach">
        <LoadingSpinner />
      </View>
    );
  }

  const totalSleepH = ((todayNapMinutes + todayNightMinutes) / 60).toFixed(1);

  return (
    <ScrollView
      className="flex-1 bg-brand-peach"
      refreshControl={
        <RefreshControl refreshing={dataLoading} onRefresh={onRefresh} />
      }
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Header */}
      <View className="px-5 pt-14 pb-4 flex-row items-center justify-between">
        <View>
          <Text className="text-brand-navy text-2xl font-bold">
            {baby?.name ?? 'Em bé'}
          </Text>
          {baby && (
            <AgeBadge ageLabel={baby.ageLabel} className="mt-1" />
          )}
        </View>
        <Text style={{ fontSize: 36 }}>
          {baby?.sex === 'female' ? '👧' : '👦'}
        </Text>
      </View>

      {/* Active session banners */}
      {activeFeedSession && (
        <TouchableOpacity
          onPress={() => router.push('/(baby)/feed')}
          className="mx-5 mb-3 bg-brand-blue/30 rounded-card px-4 py-3 flex-row items-center gap-x-3"
        >
          <Text style={{ fontSize: 20 }}>🍼</Text>
          <View className="flex-1">
            <Text className="text-brand-navy font-semibold text-sm">
              Đang bú mẹ
            </Text>
            <Text className="text-brand-navy/60 text-xs">
              Bắt đầu lúc{' '}
              {format(activeFeedSession.startedAt, 'HH:mm')}
            </Text>
          </View>
          <Text className="text-brand-navy/60 text-xs">Nhấn để xem</Text>
        </TouchableOpacity>
      )}

      {activeSleepSession && (
        <TouchableOpacity
          onPress={() => router.push('/(baby)/sleep')}
          className="mx-5 mb-3 bg-brand-lavender/20 rounded-card px-4 py-3 flex-row items-center gap-x-3"
        >
          <Text style={{ fontSize: 20 }}>😴</Text>
          <View className="flex-1">
            <Text className="text-brand-navy font-semibold text-sm">
              Bé đang ngủ
            </Text>
            <Text className="text-brand-navy/60 text-xs">
              Bắt đầu lúc{' '}
              {format(activeSleepSession.startedAt, 'HH:mm')}
            </Text>
          </View>
          <Text className="text-brand-navy/60 text-xs">Nhấn để xem</Text>
        </TouchableOpacity>
      )}

      {/* Today's summary */}
      <View className="px-5 mb-4">
        <Text className="text-base font-semibold text-brand-navy mb-2">
          Hôm nay
        </Text>
        <Card padding="none">
          <View className="flex-row">
            <TodaySummaryCard
              emoji="🍼"
              value={String(feedToday.length)}
              label="Bữa ăn"
            />
            <View className="w-px bg-brand-gray" />
            <TodaySummaryCard
              emoji="😴"
              value={`${totalSleepH}g`}
              label="Ngủ"
            />
            <View className="w-px bg-brand-gray" />
            <TodaySummaryCard
              emoji="💧"
              value={String(diaperCount)}
              label="Thay tã"
            />
            {latestGrowth?.weight_g != null && (
              <>
                <View className="w-px bg-brand-gray" />
                <TodaySummaryCard
                  emoji="📏"
                  value={`${(latestGrowth.weight_g / 1000).toFixed(2)}kg`}
                  label="Cân nặng"
                />
              </>
            )}
          </View>
        </Card>
      </View>

      {/* Quick log */}
      <View className="px-5 mb-4">
        <Text className="text-base font-semibold text-brand-navy mb-3">
          Ghi nhanh
        </Text>
        <View className="flex-row gap-x-3">
          <QuickLogButton
            emoji="🍼"
            label="Bú / Ăn"
            onPress={() => router.push('/(baby)/feed')}
            badge={activeFeedSession ? 'ON' : undefined}
          />
          <QuickLogButton
            emoji="😴"
            label="Ngủ"
            onPress={() => router.push('/(baby)/sleep')}
            badge={activeSleepSession ? 'ON' : undefined}
          />
          <QuickLogButton
            emoji="💧"
            label="Tã"
            onPress={() => router.push('/(baby)/diaper')}
          />
          <QuickLogButton
            emoji="📏"
            label="Tăng trưởng"
            onPress={() => router.push('/(baby)/growth')}
          />
          <QuickLogButton
            emoji="🏥"
            label="Sức khoẻ"
            onPress={() => router.push('/(baby)/health')}
          />
        </View>
      </View>

      {/* Recent activity quick links */}
      <View className="px-5 gap-y-2">
        <Text className="text-base font-semibold text-brand-navy mb-1">
          Gần đây
        </Text>

        {lastFeed && (
          <TouchableOpacity
            onPress={() => router.push('/(baby)/feed')}
            className="bg-white rounded-card px-4 py-3 flex-row items-center shadow-brand"
          >
            <Text style={{ fontSize: 20 }} className="mr-3">
              🍼
            </Text>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-brand-navy">
                {FEED_TYPE_LABELS[lastFeed.type] ?? lastFeed.type}
              </Text>
              <Text className="text-xs text-brand-navy/60">
                {relativeTime(lastFeed.started_at)}
              </Text>
            </View>
            <Text className="text-brand-navy/40">›</Text>
          </TouchableOpacity>
        )}

        {lastSleep && (
          <TouchableOpacity
            onPress={() => router.push('/(baby)/sleep')}
            className="bg-white rounded-card px-4 py-3 flex-row items-center shadow-brand"
          >
            <Text style={{ fontSize: 20 }} className="mr-3">
              😴
            </Text>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-brand-navy">
                {lastSleep.kind === 'nap' ? 'Ngủ ngày' : 'Ngủ đêm'}
              </Text>
              <Text className="text-xs text-brand-navy/60">
                {relativeTime(lastSleep.started_at)}
                {lastSleep.ended_at ? '' : ' — Đang ngủ'}
              </Text>
            </View>
            <Text className="text-brand-navy/40">›</Text>
          </TouchableOpacity>
        )}

        {/* Activities link */}
        <TouchableOpacity
          onPress={() => router.push('/(baby)/activities')}
          className="bg-white rounded-card px-4 py-3 flex-row items-center shadow-brand"
        >
          <Text style={{ fontSize: 20 }} className="mr-3">
            🎮
          </Text>
          <View className="flex-1">
            <Text className="text-sm font-semibold text-brand-navy">
              Hoạt động
            </Text>
            <Text className="text-xs text-brand-navy/60">
              Tummy time, tập bò, tập đi
            </Text>
          </View>
          <Text className="text-brand-navy/40">›</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
