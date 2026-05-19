import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/hooks/useAuth';
import { useBabyStore } from '@/stores/babyStore';
import { useBabies } from '@/hooks/useBabies';
import { usePregnancies } from '@/hooks/usePregnancies';
import DailySummaryCard from '@/components/ai/DailySummaryCard';
import { NotificationBell } from '@/components/ui';
import { useDashboardData } from '@/hooks/useDashboardData';
import TodaySummaryStrip from '@/components/dashboard/TodaySummaryStrip';
import GrowthMiniCard from '@/components/dashboard/GrowthMiniCard';
import MilestoneCallout from '@/components/dashboard/MilestoneCallout';
import UpcomingVisitCard from '@/components/dashboard/UpcomingVisitCard';

interface QuickActionProps {
  icon: string;
  label: string;
  sublabel: string;
  onPress: () => void;
  color: string;
}

function QuickAction({ icon, label, sublabel, onPress, color }: QuickActionProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      className="flex-1 bg-white rounded-card shadow-brand border border-brand-gray p-4 active:opacity-75"
    >
      <Text className="text-2xl mb-2">{icon}</Text>
      <Text className={`text-sm font-bold ${color}`}>{label}</Text>
      <Text className="text-brand-navy/50 text-xs mt-0.5">{sublabel}</Text>
    </Pressable>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Chào buổi sáng';
  if (hour < 18) return 'Chào buổi chiều';
  return 'Chào buổi tối';
}

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { activeBabyId, activePregnancyId } = useBabyStore();
  const { babies } = useBabies();
  const { pregnancies } = usePregnancies();

  const resolvedBabyId = activeBabyId ?? babies[0]?.id ?? null;
  const resolvedPregnancyId = activePregnancyId ?? pregnancies[0]?.id ?? null;

  const firstName = user?.displayName?.split(' ').pop() ?? 'bạn';
  const greeting = getGreeting();
  const activeBabyName = babies.find((b) => b.id === resolvedBabyId)?.name ?? null;

  const dashboard = useDashboardData();
  const todayFeedCount = dashboard.feeds.todayLogs?.length ?? 0;
  const sleepTotal = (dashboard.sleeps.todayNapMinutes ?? 0) + (dashboard.sleeps.todayNightMinutes ?? 0);
  const nextMilestone = dashboard.milestones.expectedNow?.[0] ?? null;
  const nextVisit = dashboard.prenatalVisits.nextVisit ?? null;
  const dataLoading =
    dashboard.feeds.isLoading || dashboard.sleeps.isLoading || dashboard.diapers.isLoading;

  return (
    <SafeAreaView className="flex-1 bg-brand-peach" edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Header */}
        <View className="px-4 pt-5 pb-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-brand-navy/50 text-sm">{greeting},</Text>
              <Text className="text-brand-navy text-2xl font-bold mt-0.5">{firstName}</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Pressable
                onPress={() => router.push('/(tabs)/analytics' as never)}
                accessibilityRole="button"
                accessibilityLabel="Xem báo cáo"
                className="bg-white rounded-btn px-3 py-1.5 border border-brand-gray"
              >
                <Text className="text-brand-navy text-xs font-semibold">📊 Báo cáo</Text>
              </Pressable>
              <NotificationBell />
            </View>
          </View>
          {activeBabyName && (
            <Text className="text-brand-navy/60 text-sm mt-1">
              Đang theo dõi bé{' '}
              <Text className="font-semibold text-brand-pink">{activeBabyName}</Text>
            </Text>
          )}
        </View>

        {/* Today stats — baby context */}
        {dashboard.activeContext === 'baby' && (
          <TodaySummaryStrip
            feedCount={todayFeedCount}
            sleepHours={Math.floor(sleepTotal / 60)}
            sleepMinutesRemainder={sleepTotal % 60}
            diaperCount={dashboard.diapers.todayCount ?? 0}
            isLoading={dataLoading}
          />
        )}

        {/* AI daily summary */}
        <DailySummaryCard babyId={resolvedBabyId} pregnancyId={resolvedPregnancyId} />

        {/* Milestone callout — baby context */}
        {dashboard.activeContext === 'baby' && (
          <MilestoneCallout nextMilestone={nextMilestone} />
        )}

        {/* Upcoming visit — pregnancy context */}
        {dashboard.activeContext === 'pregnancy' && (
          <UpcomingVisitCard nextVisit={nextVisit} pregnancyId={resolvedPregnancyId} />
        )}

        {/* Growth mini card — baby context */}
        {dashboard.activeContext === 'baby' && (
          <GrowthMiniCard
            latestLog={dashboard.growth.latestLog ?? null}
            isLoading={dashboard.growth.isLoading}
          />
        )}

        {/* Quick actions */}
        <View className="px-4 mb-2">
          <Text className="text-brand-navy font-bold text-sm mb-3">Thao tác nhanh</Text>
          <View className="flex-row gap-3 mb-3">
            <QuickAction
              icon="📝"
              label="Theo dõi bé"
              sublabel="Bú, ngủ, tã"
              onPress={() => router.push('/(tabs)/tracking')}
              color="text-brand-blue"
            />
            <QuickAction
              icon="🤖"
              label="Chat AI"
              sublabel="Hỏi trợ lý"
              onPress={() => router.push('/(tabs)/ai-chat')}
              color="text-brand-lavender"
            />
          </View>
          <View className="flex-row gap-3">
            <QuickAction
              icon="⭐"
              label="Mốc phát triển"
              sublabel="Tiến độ bé"
              onPress={() => router.push('/(tabs)/milestones')}
              color="text-amber-500"
            />
            <QuickAction
              icon="📚"
              label="Kiến thức"
              sublabel="Bài viết hay"
              onPress={() => router.push('/(tabs)/knowledge')}
              color="text-brand-mint"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
