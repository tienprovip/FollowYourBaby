import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useBabyStore } from '@/stores/babyStore';
import { useBaby } from '@/hooks/useBaby';
import { useActivePregnancy } from '@/hooks/usePregnancy';
import { useWeeklyAggregate, type DayAggregate } from '@/hooks/useWeeklyAggregate';
import { useAIDailySummary } from '@/hooks/useAIDailySummary';
import type { GrowthLogWithPercentile } from '@/hooks/useGrowthLogs';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import AIDisclaimer from '@/components/ui/AIDisclaimer';
import SimpleBarChart from '@/components/dashboard/SimpleBarChart';

type Period = 'week' | 'month';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatSleepDuration(totalMinutes: number, count: number): string {
  const avg = count > 0 ? totalMinutes / count : 0;
  const h = Math.floor(avg / 60);
  const m = Math.round(avg % 60);
  return m > 0 ? `${h}g${m}p` : `${h}g`;
}

function formatTotalSleep(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return m > 0 ? `${h}g${m}p` : `${h}g`;
}

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

interface SegmentProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

function Segment({ label, active, onPress }: SegmentProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      className={`flex-1 py-2 items-center rounded-btn ${active ? 'bg-brand-pink' : 'bg-transparent'}`}
    >
      <Text className={`text-sm font-bold ${active ? 'text-white' : 'text-brand-navy/60'}`}>
        {label}
      </Text>
    </Pressable>
  );
}

interface StatRowProps {
  label: string;
  value: string;
  sub?: string;
}

function StatRow({ label, value, sub }: StatRowProps) {
  return (
    <View className="flex-row items-center justify-between py-2 border-b border-brand-gray">
      <Text className="text-brand-navy/70 text-sm">{label}</Text>
      <View className="items-end">
        <Text className="text-brand-navy font-bold text-sm">{value}</Text>
        {sub ? <Text className="text-brand-navy/40 text-xs">{sub}</Text> : null}
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Section components
// ---------------------------------------------------------------------------

interface BabyStatsSectionProps {
  days: DayAggregate[];
  latestGrowth: GrowthLogWithPercentile | null;
}

function BabyStatsSection({ days, latestGrowth }: BabyStatsSectionProps) {
  const totalFeeds = days.reduce((s, d) => s + d.feedCount, 0);
  const avgFeeds = days.length ? (totalFeeds / days.length).toFixed(1) : '0';
  const totalSleepMin = days.reduce((s, d) => s + d.sleepMinutes, 0);
  const totalDiapers = days.reduce((s, d) => s + d.diaperCount, 0);

  const feedData = days.map((d) => ({ label: d.date.slice(5), value: d.feedCount }));
  const sleepData = days.map((d) => ({ label: d.date.slice(5), value: Math.round(d.sleepMinutes / 60) }));

  return (
    <>
      <Card className="mx-4 mb-4">
        <Text className="text-brand-navy font-bold text-sm mb-3">Bú / Ăn (7 ngày)</Text>
        <SimpleBarChart data={feedData} color="#FF8FA8" unit=" lần" />
        <View className="mt-3">
          <StatRow label="Trung bình / ngày" value={`${avgFeeds} lần`} />
          <StatRow label="Tổng 7 ngày" value={`${totalFeeds} lần`} />
        </View>
      </Card>

      <Card className="mx-4 mb-4">
        <Text className="text-brand-navy font-bold text-sm mb-3">Giấc ngủ (7 ngày)</Text>
        <SimpleBarChart data={sleepData} color="#B79CFF" unit="g" height={80} />
        <View className="mt-3">
          <StatRow label="Trung bình / ngày" value={formatSleepDuration(totalSleepMin, days.length)} />
          <StatRow label="Tổng 7 ngày" value={formatTotalSleep(totalSleepMin)} />
        </View>
      </Card>

      <Card className="mx-4 mb-4">
        <Text className="text-brand-navy font-bold text-sm mb-3">Thay tã (7 ngày)</Text>
        <StatRow label="Tổng 7 ngày" value={`${totalDiapers} tã`} />
        <StatRow label="Trung bình / ngày" value={`${(totalDiapers / 7).toFixed(1)} tã`} />
      </Card>

      {latestGrowth && <GrowthCard log={latestGrowth} />}
    </>
  );
}

interface GrowthCardProps {
  log: GrowthLogWithPercentile;
}

function GrowthCard({ log }: GrowthCardProps) {
  return (
    <Card className="mx-4 mb-4">
      <Text className="text-brand-navy font-bold text-sm mb-3">Tăng trưởng gần nhất</Text>
      {log.weight_g ? (
        <StatRow
          label="Cân nặng"
          value={`${(log.weight_g / 1000).toFixed(2)} kg`}
          sub={log.weightPercentile ? `Percentile P${log.weightPercentile}` : undefined}
        />
      ) : null}
      {log.length_cm ? <StatRow label="Chiều cao" value={`${log.length_cm} cm`} /> : null}
      {log.head_cm ? <StatRow label="Vòng đầu" value={`${log.head_cm} cm`} /> : null}
    </Card>
  );
}

interface PregnancyStatsSectionProps {
  days: DayAggregate[];
}

function PregnancyStatsSection({ days }: PregnancyStatsSectionProps) {
  const totalKicks = days.reduce((s, d) => s + d.kickCount, 0);
  const kickData = days.map((d) => ({ label: d.date.slice(5), value: d.kickCount }));

  return (
    <Card className="mx-4 mb-4">
      <Text className="text-brand-navy font-bold text-sm mb-3">Thai máy (7 ngày)</Text>
      <SimpleBarChart data={kickData} color="#AEE6C8" unit=" lần" />
      <View className="mt-3">
        <StatRow label="Tổng thai máy" value={`${totalKicks} lần`} />
        <StatRow label="Trung bình / ngày" value={`${(totalKicks / 7).toFixed(1)} lần`} />
      </View>
    </Card>
  );
}

interface AISummaryCardProps {
  period: Period;
  isLoading: boolean;
  summary: string;
}

function AISummaryCard({ period, isLoading, summary }: AISummaryCardProps) {
  return (
    <Card className="mx-4 mb-4">
      <Text className="text-brand-navy font-bold text-sm mb-2">
        Nhận xét AI ({period === 'week' ? 'tuần này' : 'tháng này'})
      </Text>
      <AIDisclaimer />
      {isLoading ? (
        <LoadingSpinner />
      ) : summary ? (
        <Text className="text-brand-navy/80 text-sm mt-2 leading-relaxed">{summary}</Text>
      ) : (
        <Text className="text-brand-navy/50 text-sm mt-2">
          Chưa đủ dữ liệu để tạo nhận xét. Hãy ghi nhật ký thêm vài ngày nhé!
        </Text>
      )}
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export default function AnalyticsScreen() {
  const router = useRouter();
  const [period, setPeriod] = useState<Period>('week');
  const { activeBabyId, activePregnancyId } = useBabyStore();

  const { baby } = useBaby();
  const { pregnancy } = useActivePregnancy();

  const pregnancyId = activePregnancyId ?? pregnancy?.id ?? null;
  const babyId = activeBabyId ?? baby?.id ?? null;

  const { days, latestGrowth, isLoading } = useWeeklyAggregate(pregnancyId, baby?.sex, baby?.dob);
  const aiSummary = useAIDailySummary({
    babyId,
    pregnancyId,
    period: period === 'week' ? 'weekly' : 'monthly',
  });

  return (
    <SafeAreaView className="flex-1 bg-brand-peach" edges={['top']}>
      <View className="px-4 pt-4 pb-3 flex-row items-center">
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Quay lại"
          className="mr-3 p-1"
        >
          <Text className="text-brand-navy text-lg">←</Text>
        </Pressable>
        <Text className="text-brand-navy text-lg font-bold flex-1">Báo cáo</Text>
      </View>

      <View className="mx-4 mb-4 bg-white rounded-btn p-1 flex-row border border-brand-gray">
        <Segment label="7 ngày" active={period === 'week'} onPress={() => setPeriod('week')} />
        <Segment label="30 ngày" active={period === 'month'} onPress={() => setPeriod('month')} />
      </View>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          {baby && <BabyStatsSection days={days} latestGrowth={latestGrowth ?? null} />}
          {pregnancy && !baby && <PregnancyStatsSection days={days} />}
          <AISummaryCard
            period={period}
            isLoading={aiSummary.isLoading}
            summary={aiSummary.summary}
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
