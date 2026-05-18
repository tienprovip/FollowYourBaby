import React, { useCallback } from 'react';
import {
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useActivePregnancy } from '@/hooks/usePregnancy';
import { usePregnancyWeights } from '@/hooks/usePregnancyWeights';
import { useKickCounts } from '@/hooks/useKickCounts';
import { usePregnancySymptoms } from '@/hooks/usePregnancySymptoms';
import { usePrenatalVisits } from '@/hooks/usePrenatalVisits';
import WeekBadge from '@/components/maternal/WeekBadge';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import RiskBadge from '@/components/ui/RiskBadge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';

// ---------------------------------------------------------------------------
// Pregnancy Dashboard Tab
// ---------------------------------------------------------------------------

const VISIT_TYPE_LABELS: Record<string, string> = {
  checkup: 'Khám thai',
  ultrasound: 'Siêu âm',
  test: 'Xét nghiệm',
};

const VISIT_TYPE_BADGE: Record<string, 'blue' | 'lavender' | 'pink'> = {
  checkup: 'pink',
  ultrasound: 'blue',
  test: 'lavender',
};

function QuickActionButton({
  emoji,
  label,
  onPress,
}: {
  emoji: string;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-1 items-center gap-y-1"
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View className="w-14 h-14 rounded-card bg-white shadow-brand items-center justify-center">
        <Text style={{ fontSize: 24 }}>{emoji}</Text>
      </View>
      <Text className="text-xs text-brand-navy font-medium text-center">{label}</Text>
    </TouchableOpacity>
  );
}

export default function PregnancyTab() {
  const { pregnancy, isLoading, hasActivePregnancy } = useActivePregnancy();

  const pregnancyId = pregnancy?.id ?? null;

  const { latestWeight, isLoading: weightsLoading } =
    usePregnancyWeights(pregnancyId);
  const { todayKickCount, isLoading: kicksLoading } =
    useKickCounts(pregnancyId);
  const { todaySymptoms, todayMaxRisk, isLoading: symptomsLoading } =
    usePregnancySymptoms(pregnancyId);
  const { nextVisit, isLoading: visitsLoading } =
    usePrenatalVisits(pregnancyId);

  const dataLoading =
    isLoading || weightsLoading || kicksLoading || symptomsLoading || visitsLoading;

  const onRefresh = useCallback(() => {
    // TanStack Query handles refetch via focus/mount; force with invalidation if needed
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-brand-peach">
        <LoadingSpinner />
      </View>
    );
  }

  if (!hasActivePregnancy) {
    return (
      <View className="flex-1 bg-brand-peach">
        <EmptyState
          title="Chưa có thai kỳ nào"
          body="Thêm thông tin thai kỳ của bạn để bắt đầu theo dõi."
          cta={{
            label: 'Thêm thai kỳ',
            onPress: () => Alert.alert('Sắp có', 'Tính năng sắp ra mắt.'),
          }}
        />
      </View>
    );
  }

  const p = pregnancy!;

  return (
    <ScrollView
      className="flex-1 bg-brand-peach"
      refreshControl={
        <RefreshControl refreshing={dataLoading} onRefresh={onRefresh} />
      }
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Header */}
      <View className="px-5 pt-14 pb-4">
        <Text className="text-brand-navy text-2xl font-bold">Mẹ bầu</Text>
        <Text className="text-brand-navy/60 text-sm">
          Hành trình thai kỳ của bạn
        </Text>
      </View>

      {/* Week Card */}
      <View className="px-5 mb-4">
        <Card className="overflow-hidden" padding="none">
          <View className="flex-row">
            {/* Week Badge */}
            <View className="flex-1 items-center justify-center py-6">
              <WeekBadge
                week={p.currentWeek}
                trimester={p.trimester}
              />
            </View>

            {/* Due date info */}
            <View className="flex-1 justify-center px-4 gap-y-3">
              {p.daysUntilDue !== null && (
                <View>
                  <Text className="text-3xl font-bold text-brand-navy">
                    {p.daysUntilDue > 0 ? p.daysUntilDue : 0}
                  </Text>
                  <Text className="text-xs text-brand-navy/60">
                    {p.daysUntilDue > 1
                      ? 'ngày đến dự sinh'
                      : p.daysUntilDue === 1
                      ? 'ngày đến dự sinh'
                      : 'Đã đến ngày dự sinh'}
                  </Text>
                </View>
              )}
              {p.due_date && (
                <View>
                  <Text className="text-sm font-semibold text-brand-navy">
                    {format(parseISO(p.due_date), 'dd/MM/yyyy')}
                  </Text>
                  <Text className="text-xs text-brand-navy/60">Ngày dự sinh</Text>
                </View>
              )}
            </View>
          </View>
        </Card>
      </View>

      {/* Today's Summary */}
      <View className="px-5 mb-4">
        <Text className="text-base font-semibold text-brand-navy mb-2">
          Hôm nay
        </Text>
        <Card padding="md">
          <View className="flex-row justify-between">
            <View className="flex-1 items-center gap-y-1">
              <Text className="text-2xl font-bold text-brand-navy">
                {latestWeight ? `${latestWeight.weight_kg}` : '--'}
              </Text>
              <Text className="text-xs text-brand-navy/60">kg (mới nhất)</Text>
            </View>
            <View className="w-px bg-brand-gray" />
            <View className="flex-1 items-center gap-y-1">
              <Text className="text-2xl font-bold text-brand-navy">
                {todayKickCount}
              </Text>
              <Text className="text-xs text-brand-navy/60">Thai máy hôm nay</Text>
            </View>
            <View className="w-px bg-brand-gray" />
            <View className="flex-1 items-center gap-y-1">
              <Text className="text-2xl font-bold text-brand-navy">
                {todaySymptoms.length}
              </Text>
              <Text className="text-xs text-brand-navy/60">Triệu chứng</Text>
            </View>
          </View>

          {todayMaxRisk !== 'green' && (
            <View className="mt-3 pt-3 border-t border-brand-gray">
              <View className="flex-row items-center gap-x-2">
                <RiskBadge risk_level={todayMaxRisk} />
                {todayMaxRisk === 'red' && (
                  <Text className="flex-1 text-xs text-red-600">
                    Hãy đến cơ sở y tế ngay nếu có dấu hiệu bất thường
                  </Text>
                )}
                {todayMaxRisk === 'yellow' && (
                  <Text className="flex-1 text-xs text-amber-700">
                    Theo dõi thêm và liên hệ bác sĩ nếu cần
                  </Text>
                )}
              </View>
            </View>
          )}
        </Card>
      </View>

      {/* Quick Actions */}
      <View className="px-5 mb-4">
        <Text className="text-base font-semibold text-brand-navy mb-3">
          Ghi nhanh
        </Text>
        <View className="flex-row gap-x-3">
          <QuickActionButton
            emoji="⚖️"
            label="Cân nặng"
            onPress={() => router.push('/(maternal)/weight')}
          />
          <QuickActionButton
            emoji="👶"
            label="Thai máy"
            onPress={() => router.push('/(maternal)/kick-counter')}
          />
          <QuickActionButton
            emoji="📋"
            label="Triệu chứng"
            onPress={() => router.push('/(maternal)/symptoms')}
          />
          <QuickActionButton
            emoji="🏥"
            label="Lịch khám"
            onPress={() => router.push('/(maternal)/prenatal-visits')}
          />
        </View>
      </View>

      {/* Next Visit Card */}
      {nextVisit && (
        <View className="px-5 mb-4">
          <Text className="text-base font-semibold text-brand-navy mb-2">
            Lịch khám tới
          </Text>
          <Card
            padding="md"
            onPress={() => router.push('/(maternal)/prenatal-visits')}
          >
            <View className="flex-row items-start gap-x-3">
              <View className="w-12 h-12 rounded-card bg-brand-blue/20 items-center justify-center">
                <Text style={{ fontSize: 22 }}>🏥</Text>
              </View>
              <View className="flex-1">
                <View className="flex-row items-center gap-x-2 mb-1">
                  <Badge
                    label={VISIT_TYPE_LABELS[nextVisit.type] ?? nextVisit.type}
                    variant={VISIT_TYPE_BADGE[nextVisit.type] ?? 'neutral'}
                  />
                </View>
                <Text className="text-brand-navy font-semibold">
                  {format(parseISO(nextVisit.scheduled_at), "EEEE, dd 'tháng' MM", {
                    locale: vi,
                  })}
                </Text>
                <Text className="text-brand-navy font-bold text-lg">
                  {format(parseISO(nextVisit.scheduled_at), 'HH:mm')}
                </Text>
                {nextVisit.location && (
                  <Text className="text-brand-navy/60 text-xs mt-0.5">
                    {nextVisit.location}
                  </Text>
                )}
              </View>
            </View>
          </Card>
        </View>
      )}

      {/* Quick links */}
      <View className="px-5 gap-y-2">
        {[
          { label: 'Theo dõi cân nặng', route: '/(maternal)/weight' as const },
          { label: 'Lịch khám thai', route: '/(maternal)/prenatal-visits' as const },
          { label: 'Thuốc & Vitamin', route: '/(maternal)/medications' as const },
        ].map(({ label, route }) => (
          <TouchableOpacity
            key={route}
            onPress={() => router.push(route)}
            className="bg-white rounded-card px-4 py-3 flex-row items-center shadow-brand"
          >
            <Text className="flex-1 text-sm font-medium text-brand-navy">{label}</Text>
            <Text className="text-brand-navy/40">›</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
