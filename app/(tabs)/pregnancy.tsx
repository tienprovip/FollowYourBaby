import React, { useCallback } from 'react';
import { Alert, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Circle, Line, Polyline, Polygon, Rect } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { differenceInDays, format, parseISO } from 'date-fns';
import { useActivePregnancy } from '@/hooks/usePregnancy';
import { usePregnancyWeights } from '@/hooks/usePregnancyWeights';
import { useKickCounts } from '@/hooks/useKickCounts';
import { usePregnancySymptoms } from '@/hooks/usePregnancySymptoms';
import { usePrenatalVisits } from '@/hooks/usePrenatalVisits';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface HeaderProps {
  title: string;
}

interface MetricPillProps {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  label: string;
  value: string;
  accent: string;
}

interface TodoItemProps {
  title: string;
  body: string;
  done?: boolean;
}

const PINK = '#FF4F7B';
const NAVY = '#1F2B5B';
const TRACK = '#ECEAF1';

function ScreenHeader({ title }: HeaderProps) {
  return (
    <View className="px-6 pb-4 pt-3">
      <View className="flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => router.back()}
          className="h-10 w-10 items-start justify-center"
          accessibilityRole="button"
          accessibilityLabel="Quay lại"
        >
          <Ionicons name="arrow-back" size={24} color={NAVY} />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-brand-navy">{title}</Text>
        <TouchableOpacity
          onPress={() => router.push('/(maternal)/prenatal-visits')}
          className="h-10 w-10 items-end justify-center"
          accessibilityRole="button"
          accessibilityLabel="Lịch khám"
        >
          <Ionicons name="calendar-outline" size={22} color={NAVY} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function SegmentTabs() {
  return (
    <View className="mx-5 mb-5 flex-row rounded-full bg-white/80 p-1 shadow-brand">
      {['Tổng quan', 'Sự phát triển', 'Mẹ cần biết'].map((label, index) => (
        <View
          key={label}
          className={`flex-1 items-center rounded-full py-3 ${
            index === 0 ? 'bg-white border border-brand-pink-200' : ''
          }`}
        >
          <Text
            className={`text-xs font-bold ${
              index === 0 ? 'text-brand-pink-500' : 'text-brand-navy'
            }`}
          >
            {label}
          </Text>
        </View>
      ))}
    </View>
  );
}

function PregnancyIllustration({ compact = false }: { compact?: boolean }) {
  return (
    <View
      className={`items-center justify-center rounded-full bg-brand-pink-100 ${
        compact ? 'h-28 w-28' : 'h-36 w-36'
      }`}
    >
      <View className="absolute h-full w-full rounded-full border-8 border-brand-pink-300" />
      <View
        className={`items-center justify-center rounded-full bg-[#FFBBC6] ${
          compact ? 'h-20 w-20' : 'h-28 w-28'
        }`}
      >
        <Text style={{ fontSize: compact ? 42 : 56 }}>👶</Text>
      </View>
    </View>
  );
}

function ProgressBar({ progress }: { progress: number }) {
  const progressWidth = `${Math.max(4, Math.min(100, progress * 100))}%` as `${number}%`;
  return (
    <View className="mt-5">
      <View className="h-2 overflow-hidden rounded-full bg-[#E8E6EE]">
        <View className="h-full rounded-full bg-brand-pink-500" style={{ width: progressWidth }} />
      </View>
      <View
        className="absolute -top-1.5 h-5 w-5 rounded-full border-2 border-white bg-brand-pink-400 shadow-brand"
        style={{ left: progressWidth }}
      />
    </View>
  );
}

function MetricPill({ icon, label, value, accent }: MetricPillProps) {
  return (
    <View className="flex-1">
      <View className="mb-2 h-9 w-9 items-center justify-center rounded-input bg-white shadow-brand">
        <MaterialCommunityIcons name={icon} size={18} color={accent} />
      </View>
      <Text className="text-[11px] font-semibold text-brand-navy/60">{label}</Text>
      <Text className="mt-1 text-sm font-bold text-brand-navy">{value}</Text>
    </View>
  );
}

function MiniLineChart({ color, values }: { color: string; values: number[] }) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(max - min, 1);
  const points = values
    .map((value, index) => {
      const x = 10 + index * (110 / Math.max(values.length - 1, 1));
      const y = 72 - ((value - min) / range) * 46;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <Svg width="100%" height={90} viewBox="0 0 132 90">
      {[20, 42, 64].map((y) => (
        <Line
          key={y}
          x1="10"
          x2="122"
          y1={y}
          y2={y}
          stroke="#ECEAF1"
          strokeDasharray="3 4"
          strokeWidth="1"
        />
      ))}
      <Polyline points={points} fill="none" stroke={color} strokeWidth="3" />
      {points.split(' ').map((point) => {
        const [cx, cy] = point.split(',');
        return (
          <Circle key={point} cx={cx} cy={cy} r="3" fill="#FFFFFF" stroke={color} strokeWidth="2" />
        );
      })}
    </Svg>
  );
}

function TodoItem({ title, body, done = false }: TodoItemProps) {
  return (
    <View className="mb-4 flex-row items-start">
      <View
        className={`mr-3 mt-0.5 h-5 w-5 items-center justify-center rounded-full border ${
          done ? 'border-brand-pink-500 bg-brand-pink-500' : 'border-brand-navy/40 bg-white'
        }`}
      >
        {done && <Ionicons name="checkmark" size={12} color="#FFFFFF" />}
      </View>
      <View className="flex-1">
        <Text className="text-sm font-bold text-brand-navy">{title}</Text>
        <Text className="mt-0.5 text-xs font-medium text-brand-navy/60">{body}</Text>
      </View>
    </View>
  );
}

function AdviceCard({ title, tag, emoji }: { title: string; tag: string; emoji: string }) {
  return (
    <View className="mr-3 w-28">
      <View className="mb-2 h-24 items-center justify-center overflow-hidden rounded-input bg-brand-pink-50">
        <Text style={{ fontSize: 42 }}>{emoji}</Text>
      </View>
      <Text className="text-xs font-bold leading-4 text-brand-navy">{title}</Text>
      <View className="mt-2 self-start rounded-full bg-brand-blue/20 px-2 py-1">
        <Text className="text-[10px] font-bold text-[#4D8CDA]">{tag}</Text>
      </View>
    </View>
  );
}

function VisitRow({
  date,
  title,
  status,
}: {
  date: string;
  title: string;
  status: 'next' | 'done';
}) {
  return (
    <View className="mt-3 flex-row items-center">
      <View
        className={`mr-3 h-9 w-9 items-center justify-center rounded-input ${
          status === 'next' ? 'bg-brand-pink-100' : 'bg-brand-mint/30'
        }`}
      >
        <Ionicons name="calendar-outline" size={17} color={status === 'next' ? PINK : '#26B99A'} />
      </View>
      <View className="flex-1">
        <Text className="text-xs font-bold text-brand-navy">{date}</Text>
        <Text className="text-[11px] font-medium text-brand-navy/60">{title}</Text>
      </View>
      <View
        className={`rounded-full px-3 py-1.5 ${
          status === 'next' ? 'bg-brand-pink-100' : 'bg-brand-mint/30'
        }`}
      >
        <Text
          className={`text-[10px] font-bold ${
            status === 'next' ? 'text-brand-pink-600' : 'text-[#19A987]'
          }`}
        >
          {status === 'next' ? 'Sắp tới' : 'Đã khám'}
        </Text>
      </View>
    </View>
  );
}

export default function PregnancyTab() {
  const { pregnancy, isLoading, hasActivePregnancy } = useActivePregnancy();
  const pregnancyId = pregnancy?.id ?? null;
  const { weights, latestWeight, isLoading: weightsLoading } = usePregnancyWeights(pregnancyId);
  const { todayKickCount, isLoading: kicksLoading } = useKickCounts(pregnancyId);
  const { todaySymptoms, isLoading: symptomsLoading } = usePregnancySymptoms(pregnancyId);
  const { nextVisit, pastVisits, isLoading: visitsLoading } = usePrenatalVisits(pregnancyId);

  const dataLoading =
    isLoading || weightsLoading || kicksLoading || symptomsLoading || visitsLoading;

  const onRefresh = useCallback(() => {
    // TanStack Query refreshes these queries when the screen remounts or regains focus.
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-brand-peach">
        <LoadingSpinner />
      </View>
    );
  }

  if (!hasActivePregnancy || !pregnancy) {
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

  const totalPregnancyWeeks = 40;
  const currentWeek = Math.max(0, pregnancy.currentWeek);
  const progress = Math.min(currentWeek / totalPregnancyWeeks, 1);
  const weightKg = latestWeight?.weight_kg;
  const firstWeight = weights[0]?.weight_kg;
  const weightDelta = weightKg != null && firstWeight != null ? weightKg - firstWeight : null;
  const chartValues =
    weights.length >= 2 ? weights.slice(-5).map((item) => item.weight_kg) : [50, 53, 55, 57, 60];
  const dueDate = pregnancy.due_date
    ? format(parseISO(pregnancy.due_date), 'dd/MM/yyyy')
    : '--/--/----';
  const weekDetail =
    pregnancy.lmp_date != null
      ? (() => {
          const days = Math.max(0, differenceInDays(new Date(), parseISO(pregnancy.lmp_date)));
          return `${Math.floor(days / 7)} tuần ${days % 7} ngày`;
        })()
      : `${currentWeek} tuần`;
  const daysLeft = pregnancy.daysUntilDue != null ? Math.max(pregnancy.daysUntilDue, 0) : null;

  return (
    <SafeAreaView className="flex-1 bg-[#FFF8FA]" edges={['top']}>
      <ScrollView
        className="flex-1"
        refreshControl={<RefreshControl refreshing={dataLoading} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: 34 }}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader title="Theo dõi thai kỳ" />
        <SegmentTabs />

        <View className="px-5">
          <Card className="mb-4 border-brand-pink-100" padding="lg">
            <View className="flex-row items-center">
              <View className="flex-1 pr-3">
                <Text className="text-base font-bold text-brand-navy">Tuần thai thứ</Text>
                <Text className="mt-2 text-5xl font-bold text-brand-pink-500">{currentWeek}</Text>
                <Text className="mt-1 text-sm font-bold text-brand-navy">({weekDetail})</Text>
                <View className="mt-3 flex-row items-center">
                  <Text className="text-xs font-bold text-brand-navy">Ngày dự sinh: {dueDate}</Text>
                  <View className="ml-2 h-6 w-6 items-center justify-center rounded-full bg-brand-blue/20">
                    <Ionicons name="pencil" size={12} color={NAVY} />
                  </View>
                </View>
              </View>
              <PregnancyIllustration />
            </View>
            <ProgressBar progress={progress} />
            <View className="mt-4 flex-row justify-between">
              <Text className="text-xs font-bold text-brand-navy">
                Tam cá nguyệt thứ {pregnancy.trimester}
              </Text>
              <Text className="text-xs font-bold text-brand-navy">
                {daysLeft != null ? `Còn ${Math.ceil(daysLeft / 7)} tuần nữa` : 'Đang cập nhật'}
              </Text>
            </View>
          </Card>

          <View className="mb-4 flex-row items-center rounded-card border border-[#FFD9B8] bg-[#FFF7EA] p-4">
            <Text className="flex-1 text-xs font-semibold leading-5 text-[#B56A24]">
              Mẹ ơi, con của mẹ đang phát triển rất tốt! Hãy duy trì chế độ dinh dưỡng và nghỉ ngơi
              hợp lý nhé.
            </Text>
            <View className="ml-3 h-10 w-10 items-center justify-center rounded-full bg-white">
              <Text style={{ fontSize: 22 }}>💝</Text>
            </View>
          </View>

          <Card className="mb-4 border-brand-pink-100 bg-brand-pink-50" padding="lg">
            <View className="flex-row items-center">
              <View className="flex-1 pr-4">
                <Text className="text-base font-bold text-brand-navy">Sự phát triển của bé</Text>
                <Text className="mt-4 text-sm font-bold leading-5 text-brand-navy">
                  Thai nhi đang phát triển nhanh chóng.
                </Text>
                <Text className="mt-2 text-sm font-semibold leading-5 text-brand-navy/70">
                  Bé có thể đã nghe được âm thanh và cảm nhận được ánh sáng.
                </Text>
                <TouchableOpacity
                  onPress={() => router.push('/(tabs)/knowledge')}
                  className="mt-5 self-start rounded-input bg-brand-pink-100 px-4 py-2"
                >
                  <Text className="text-xs font-bold text-brand-pink-600">Xem chi tiết</Text>
                </TouchableOpacity>
              </View>
              <PregnancyIllustration compact />
            </View>
          </Card>

          <Card className="mb-4" padding="lg">
            <View className="mb-5 flex-row items-center justify-between">
              <Text className="text-base font-bold text-brand-navy">Chỉ số của mẹ</Text>
              <Text className="text-xs font-bold text-brand-navy/50">Cập nhật: Hôm nay</Text>
            </View>
            <View className="flex-row">
              <MetricPill
                icon="scale-bathroom"
                label="Cân nặng"
                value={weightKg != null ? `${weightKg.toFixed(1)} kg` : '-- kg'}
                accent={PINK}
              />
              <MetricPill icon="heart-pulse" label="Huyết áp" value="110/70" accent="#6B8BFF" />
              <MetricPill icon="water" label="Đường huyết" value="4.8 mmol/L" accent="#20B7A8" />
              <MetricPill icon="heart" label="Nhịp tim" value="78 bpm" accent="#FF6D91" />
            </View>
            {weightDelta != null && (
              <Text className="mt-3 text-xs font-semibold text-brand-navy/60">
                Cân nặng thay đổi {weightDelta >= 0 ? '+' : ''}
                {weightDelta.toFixed(1)} kg từ lần ghi đầu tiên.
              </Text>
            )}
          </Card>

          <Card className="mb-4" padding="lg">
            <Text className="mb-4 text-base font-bold text-brand-navy">Theo dõi cơ thể mẹ</Text>
            <View className="flex-row">
              <View className="flex-1 pr-4">
                <Text className="text-xs font-semibold text-brand-navy/60">Cân nặng</Text>
                <Text className="text-sm font-bold text-brand-navy">
                  {weightKg != null ? `${weightKg.toFixed(1)} kg` : '-- kg'}
                </Text>
                <MiniLineChart color={PINK} values={chartValues} />
                <TouchableOpacity onPress={() => router.push('/(maternal)/weight')}>
                  <Text className="text-center text-xs font-bold text-[#5A8CFF]">Xem lịch sử</Text>
                </TouchableOpacity>
              </View>
              <View className="w-px bg-brand-gray" />
              <View className="flex-1 pl-4">
                <Text className="text-xs font-semibold text-brand-navy/60">Chiều cao tử cung</Text>
                <Text className="text-sm font-bold text-brand-navy">24 cm</Text>
                <MiniLineChart color="#FF4F7B" values={[20, 24, 29, 33, 40]} />
                <TouchableOpacity onPress={() => router.push('/(maternal)/prenatal-visits')}>
                  <Text className="text-center text-xs font-bold text-[#5A8CFF]">Xem lịch sử</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Card>

          <Card className="mb-4" padding="lg">
            <View className="flex-row items-center">
              <View className="flex-1 pr-3">
                <Text className="text-base font-bold text-brand-navy">Đếm thai máy</Text>
                <Text className="mt-3 text-xs font-semibold leading-5 text-brand-navy/60">
                  Theo dõi số lần thai máy mỗi ngày để đảm bảo bé khỏe mạnh.
                </Text>
                <TouchableOpacity
                  onPress={() => router.push('/(maternal)/kick-counter')}
                  className="mt-4 self-start rounded-input bg-brand-pink-100 px-4 py-2"
                >
                  <Text className="text-xs font-bold text-brand-pink-600">Đếm ngay</Text>
                </TouchableOpacity>
              </View>
              <View className="h-24 w-28 items-center justify-center rounded-full bg-brand-lavender-50">
                <Text style={{ fontSize: 42 }}>👣</Text>
                <Text className="mt-1 text-xs font-bold text-brand-pink-500">{todayKickCount}</Text>
              </View>
            </View>
          </Card>

          <Card className="mb-4" padding="lg">
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-base font-bold text-brand-navy">Việc cần làm</Text>
              <Text className="text-xs font-bold text-brand-navy/60">3/5 đã hoàn thành</Text>
            </View>
            <TodoItem title="Uống vitamin tổng hợp" body="1 viên sau bữa sáng" done />
            <TodoItem title="Đi bộ 20 phút" body="Vận động nhẹ nhàng tốt cho mẹ và bé" done />
            <TodoItem
              title="Theo dõi cân nặng"
              body={weightKg != null ? 'Đã có số đo mới nhất' : 'Cập nhật cân nặng tuần này'}
              done={weightKg != null}
            />
            <TodoItem title="Đọc về dinh dưỡng thai kỳ" body="Tìm hiểu thực phẩm tốt cho bé" />
            <TodoItem
              title="Khám thai định kỳ"
              body={
                nextVisit
                  ? `Lần khám tiếp theo: ${format(parseISO(nextVisit.scheduled_at), 'dd/MM/yyyy')}`
                  : 'Đặt lịch khám tiếp theo'
              }
            />
          </Card>

          <Card className="mb-4" padding="lg">
            <View className="mb-3 flex-row items-center justify-between">
              <Text className="text-base font-bold text-brand-navy">Lịch khám thai kỳ</Text>
              <TouchableOpacity onPress={() => router.push('/(maternal)/prenatal-visits')}>
                <Text className="text-xs font-bold text-brand-navy">Xem tất cả ›</Text>
              </TouchableOpacity>
            </View>
            {nextVisit ? (
              <VisitRow
                date={format(parseISO(nextVisit.scheduled_at), 'dd/MM/yyyy - HH:mm')}
                title={nextVisit.location ?? 'Lịch khám sắp tới'}
                status="next"
              />
            ) : (
              <Text className="text-xs font-semibold text-brand-navy/60">
                Chưa có lịch khám sắp tới.
              </Text>
            )}
            {pastVisits.slice(-2).map((visit) => (
              <VisitRow
                key={visit.id}
                date={format(parseISO(visit.scheduled_at), 'dd/MM/yyyy - HH:mm')}
                title={visit.location ?? 'Đã hoàn thành'}
                status="done"
              />
            ))}
          </Card>

          <Card className="mb-4" padding="lg">
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-base font-bold text-brand-navy">Gợi ý hôm nay</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/knowledge')}>
                <Text className="text-xs font-bold text-brand-navy">Xem tất cả ›</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <AdviceCard title="Thực phẩm giàu sắt cho mẹ bầu" tag="Dinh dưỡng" emoji="🥗" />
              <AdviceCard title="5 bài tập yoga tốt cho mẹ bầu" tag="Vận động" emoji="🧘‍♀️" />
              <AdviceCard title="Mẹo ngủ ngon trong thai kỳ" tag="Giấc ngủ" emoji="😴" />
            </ScrollView>
          </Card>

          <Card className="border-brand-pink-100 bg-brand-pink-50" padding="lg">
            <View className="flex-row items-center">
              <View className="flex-1">
                <Text className="text-base font-bold text-brand-navy">Theo dõi hôm nay</Text>
                <Text className="mt-2 text-xs font-semibold text-brand-navy/60">
                  {todaySymptoms.length > 0
                    ? `Bạn đã ghi ${todaySymptoms.length} triệu chứng hôm nay.`
                    : 'Ghi lại triệu chứng nếu mẹ thấy cơ thể có thay đổi.'}
                </Text>
              </View>
              <Svg width={82} height={70} viewBox="0 0 82 70">
                <Rect x="20" y="10" width="42" height="52" rx="10" fill="#FFFFFF" />
                <Rect x="28" y="4" width="26" height="12" rx="5" fill="#FF8FA8" />
                <Line x1="31" y1="28" x2="53" y2="28" stroke={TRACK} strokeWidth="4" />
                <Line x1="31" y1="40" x2="53" y2="40" stroke={TRACK} strokeWidth="4" />
                <Polygon points="12,54 24,44 28,62" fill="#FF8FA8" opacity="0.35" />
              </Svg>
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
