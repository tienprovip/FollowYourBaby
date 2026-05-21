import React from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format, parseISO } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import { useBabyStore } from '@/stores/babyStore';
import { useBabies } from '@/hooks/useBabies';
import { usePregnancies } from '@/hooks/usePregnancies';
import { useDashboardData } from '@/hooks/useDashboardData';
import { NotificationBell } from '@/components/ui';
import { babyAgeLabel } from '@/lib/babyUtils';
import {
  calculateDaysUntilDue,
  calculatePregnancyWeek,
} from '@/hooks/usePregnancy';

type IconFamily = 'ion' | 'material';
type IonIconName = React.ComponentProps<typeof Ionicons>['name'];
type MaterialIconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

interface SuggestionCardProps {
  icon: string;
  title: string;
  subtitle: string;
  tint: 'pink' | 'lavender' | 'blue';
  onPress: () => void;
}

interface QuickToolProps {
  family: IconFamily;
  icon: IonIconName | MaterialIconName;
  label: string;
  color: string;
  background: string;
  onPress: () => void;
}

interface MetricPillProps {
  label: string;
  value: string;
  subtitle: string;
  color: string;
}

interface BabyStatProps {
  family: IconFamily;
  icon: IonIconName | MaterialIconName;
  label: string;
  value: string;
  color: string;
}

function renderIcon(
  family: IconFamily,
  icon: IonIconName | MaterialIconName,
  size: number,
  color: string,
) {
  if (family === 'material') {
    return (
      <MaterialCommunityIcons
        name={icon as MaterialIconName}
        size={size}
        color={color}
      />
    );
  }

  return <Ionicons name={icon as IonIconName} size={size} color={color} />;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Chào mẹ!';
  if (hour < 18) return 'Chào mẹ!';
  return 'Chào mẹ!';
}

function formatDate(value: string | null): string {
  if (!value) return 'Chưa cập nhật';
  return format(parseISO(value), 'dd/MM/yyyy');
}

function formatBabyWeight(grams?: number | null): string {
  if (!grams) return '-- kg';
  return `${(grams / 1000).toFixed(1)} kg`;
}

function formatBabyLength(length?: number | null): string {
  if (!length) return '-- cm';
  return `${Math.round(length)} cm`;
}

function getDaysUntilDate(value?: string | null): number | null {
  if (!value) return null;
  const target = new Date(value).getTime();
  if (Number.isNaN(target)) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.max(0, Math.ceil((target - today.getTime()) / 86400000));
}

function SuggestionCard({ icon, title, subtitle, tint, onPress }: SuggestionCardProps) {
  const tintClass =
    tint === 'lavender'
      ? 'bg-brand-lavender-50 border-brand-lavender-100'
      : tint === 'blue'
      ? 'bg-soft-blue-50 border-soft-blue-100'
      : 'bg-brand-pink-50 border-brand-pink-100';

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      className={`flex-1 min-h-[88px] rounded-input border ${tintClass} items-center justify-center px-2 py-3 active:opacity-75`}
    >
      <Text className="text-3xl">{icon}</Text>
      <Text className="text-brand-navy mt-2 text-center text-sm font-bold">
        {title}
      </Text>
      <Text className="mt-0.5 text-center text-[11px] font-semibold leading-4 text-brand-navy/55">
        {subtitle}
      </Text>
    </Pressable>
  );
}

function QuickTool({ family, icon, label, color, background, onPress }: QuickToolProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      className="flex-1 items-center active:opacity-75"
    >
      <View
        className="h-12 w-12 rounded-input items-center justify-center border border-white"
        style={{ backgroundColor: background }}
      >
        {renderIcon(family, icon, 25, color)}
      </View>
      <Text className="mt-2 text-center text-[11px] font-bold leading-4 text-brand-navy">
        {label}
      </Text>
    </Pressable>
  );
}

function MetricPill({ label, value, subtitle, color }: MetricPillProps) {
  return (
    <View className="flex-1">
      <Text className="text-xs font-bold text-brand-navy/70">{label}</Text>
      <Text className="mt-1 text-[15px] font-extrabold" style={{ color }}>
        {value}
      </Text>
      <Text className="mt-0.5 text-[11px] font-semibold text-brand-navy/45">
        {subtitle}
      </Text>
    </View>
  );
}

function BabyStat({ family, icon, label, value, color }: BabyStatProps) {
  return (
    <View className="flex-1 items-center">
      <View className="h-7 w-7 rounded-full items-center justify-center bg-brand-lavender-50">
        {renderIcon(family, icon, 16, color)}
      </View>
      <Text className="mt-1 text-[10px] font-bold text-brand-navy/55">
        {label}
      </Text>
      <Text className="mt-0.5 text-center text-[11px] font-extrabold text-brand-navy">
        {value}
      </Text>
    </View>
  );
}

function SectionShell({
  title,
  actionLabel,
  onAction,
  children,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  children: React.ReactNode;
}) {
  return (
    <View className="mx-4 mb-3 rounded-card border border-brand-pink-100 bg-white p-4 shadow-brand">
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="text-[17px] font-extrabold text-brand-navy">{title}</Text>
        {actionLabel && onAction && (
          <Pressable onPress={onAction} accessibilityRole="button">
            <Text className="text-[13px] font-bold text-brand-navy/60">
              {actionLabel} ›
            </Text>
          </Pressable>
        )}
      </View>
      {children}
    </View>
  );
}

function MiniTrend({ color }: { color: string }) {
  return (
    <View className="mt-2 h-8 flex-row items-end gap-1">
      {[10, 15, 12, 21, 18, 27].map((height, index) => (
        <View
          key={`${height}-${index}`}
          className="w-2 rounded-full"
          style={{ height, backgroundColor: color, opacity: 0.35 + index * 0.08 }}
        />
      ))}
    </View>
  );
}

function EmptyHomeState({ onPress }: { onPress: () => void }) {
  return (
    <View className="mx-4 mt-8 rounded-card border border-brand-pink-100 bg-white p-5 shadow-brand">
      <Text className="text-4xl">🌷</Text>
      <Text className="mt-3 text-xl font-extrabold text-brand-navy">
        Bắt đầu hành trình của mẹ
      </Text>
      <Text className="mt-2 text-[15px] leading-6 text-brand-navy/65">
        Thêm thai kỳ hoặc hồ sơ bé để trang chủ hiển thị gợi ý, chỉ số theo dõi
        và công cụ nhanh phù hợp mỗi ngày.
      </Text>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        className="mt-5 rounded-btn bg-brand-pink px-4 py-3"
      >
        <Text className="text-center text-[15px] font-extrabold text-white">
          Cập nhật hồ sơ
        </Text>
      </Pressable>
    </View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { activeBabyId, activePregnancyId } = useBabyStore();
  const { babies } = useBabies();
  const { pregnancies } = usePregnancies();
  const dashboard = useDashboardData();

  const resolvedBabyId = activeBabyId ?? babies[0]?.id ?? null;
  const resolvedPregnancyId = activePregnancyId ?? pregnancies[0]?.id ?? null;
  const fallbackBaby = babies.find((baby) => baby.id === resolvedBabyId) ?? babies[0] ?? null;
  const fallbackPregnancy =
    pregnancies.find((pregnancy) => pregnancy.id === resolvedPregnancyId) ??
    pregnancies.find((pregnancy) => pregnancy.status === 'active') ??
    pregnancies[0] ??
    null;

  const isBabyCase = dashboard.activeContext === 'baby' || Boolean(fallbackBaby);
  const baby = dashboard.baby ?? fallbackBaby;
  const pregnancy = dashboard.pregnancy ?? fallbackPregnancy;
  const firstName = user?.displayName?.split(' ').pop() ?? 'mẹ';
  const greeting = getGreeting();
  const latestGrowth = dashboard.growth.latestLog;
  const latestWeight = dashboard.pregnancyWeights.latestWeight;
  const sleepTotalMinutes =
    (dashboard.sleeps.todayNapMinutes ?? 0) + (dashboard.sleeps.todayNightMinutes ?? 0);
  const sleepHours = Math.floor(sleepTotalMinutes / 60);
  const feedCount = dashboard.feeds.todayLogs?.length ?? 0;
  const computedPregnancyWeek =
    dashboard.pregnancy?.currentWeek ??
    (pregnancy
      ? calculatePregnancyWeek(pregnancy.lmp_date, pregnancy.due_date)
      : 22);
  const computedDaysUntilDue =
    dashboard.pregnancy?.daysUntilDue ??
    (pregnancy ? calculateDaysUntilDue(pregnancy.due_date) : null);
  const weekProgress = Math.min(
    100,
    Math.max(3, (computedPregnancyWeek / 40) * 100),
  );
  const daysUntilDue = computedDaysUntilDue;
  const pregnancyWeek = computedPregnancyWeek;
  const daysUntilNextVisit = getDaysUntilDate(
    dashboard.prenatalVisits.nextVisit?.scheduled_at,
  );
  const babyAge = baby
    ? 'ageLabel' in baby && typeof baby.ageLabel === 'string'
      ? baby.ageLabel
      : babyAgeLabel(new Date(baby.dob))
    : '8 tháng 10 ngày';

  return (
    <SafeAreaView className="flex-1 bg-brand-peach" edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View className="px-4 pb-2 pt-5">
          <View className="flex-row items-center justify-between">
            <View className="flex-row flex-1 items-center">
              <View className="mr-3 h-16 w-16 items-center justify-center rounded-full bg-brand-pink-100">
                <Text className="text-4xl">{isBabyCase ? '👩‍🍼' : '🤰'}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-xl font-extrabold text-brand-navy">
                  {greeting} 👋
                </Text>
                <Text className="mt-1 text-[15px] font-semibold text-brand-navy/65">
                  {isBabyCase
                    ? `Chúc ${firstName} và bé một ngày tuyệt vời`
                    : `Chúc ${firstName} một ngày tốt lành`}
                </Text>
              </View>
            </View>
            <NotificationBell />
          </View>
        </View>

        {!baby && !pregnancy ? (
          <EmptyHomeState onPress={() => router.push('/(tabs)/profile')} />
        ) : isBabyCase ? (
          <>
            <View className="mx-4 mb-3 rounded-card border border-brand-pink-100 bg-white p-4 shadow-brand">
              <View className="flex-row items-center">
                <View className="h-24 w-24 items-center justify-center rounded-full border-4 border-brand-lavender-100 bg-brand-pink-50">
                  {baby?.photo_url ? (
                    <Image
                      source={{ uri: baby.photo_url }}
                      className="h-full w-full rounded-full"
                    />
                  ) : (
                    <Text className="text-5xl">👶</Text>
                  )}
                </View>
                <View className="ml-4 flex-1">
                  <View className="flex-row items-center">
                    <Text className="text-brand-navy text-2xl font-extrabold">
                      {baby?.name ?? 'Bé yêu'}
                    </Text>
                    <Pressable
                      onPress={() => router.push('/(profile)/baby-form' as never)}
                      accessibilityRole="button"
                      className="ml-2 h-8 w-8 items-center justify-center rounded-full bg-brand-gray"
                    >
                      <Ionicons name="pencil" size={15} color="#1F2B5B" />
                    </Pressable>
                  </View>
                  <Text className="mt-2 text-[15px] font-extrabold text-brand-lavender-700">
                    {babyAge}
                  </Text>
                  <Text className="mt-2 text-[15px] font-semibold text-brand-navy/70">
                    Ngày sinh: {formatDate(baby?.dob ?? null)}
                  </Text>
                </View>
              </View>

              <View className="mt-5 flex-row rounded-input bg-brand-gray/60 px-2 py-3">
                <BabyStat
                  family="material"
                  icon="weight-kilogram"
                  label="Cân nặng"
                  value={formatBabyWeight(latestGrowth?.weight_g ?? baby?.birth_weight_g)}
                  color="#7C5CDB"
                />
                <BabyStat
                  family="material"
                  icon="human-male-height"
                  label="Chiều cao"
                  value={formatBabyLength(latestGrowth?.length_cm ?? baby?.birth_length_cm)}
                  color="#7C5CDB"
                />
                <BabyStat
                  family="material"
                  icon="baby-bottle-outline"
                  label="Bú sữa"
                  value={`${feedCount} cữ/ngày`}
                  color="#26A6C8"
                />
                <BabyStat
                  family="ion"
                  icon="moon-outline"
                  label="Ngủ"
                  value={sleepHours > 0 ? `${sleepHours} giờ/ngày` : '-- giờ/ngày'}
                  color="#26A6C8"
                />
              </View>
            </View>

            <SectionShell
              title="Gợi ý hôm nay"
              actionLabel="Xem tất cả"
              onAction={() => router.push('/(tabs)/knowledge')}
            >
              <View className="flex-row gap-3">
                <SuggestionCard
                  icon="🥗"
                  title="Dinh dưỡng"
                  subtitle="Thực đơn cho bé"
                  tint="pink"
                  onPress={() => router.push('/(tabs)/knowledge')}
                />
                <SuggestionCard
                  icon="🏃‍♀️"
                  title="Phát triển"
                  subtitle="Kỹ năng cho bé"
                  tint="pink"
                  onPress={() => router.push('/(tabs)/milestones')}
                />
                <SuggestionCard
                  icon="🧴"
                  title="Chăm sóc"
                  subtitle="Tắm và vệ sinh"
                  tint="lavender"
                  onPress={() => router.push('/(tabs)/knowledge')}
                />
              </View>
            </SectionShell>

            <SectionShell title="Theo dõi sự phát triển">
              <View className="flex-row gap-3">
                <View className="flex-1 rounded-input border border-brand-gray bg-white p-3">
                  <Text className="text-sm font-bold text-brand-navy/70">Chiều cao</Text>
                  <Text className="mt-1 text-lg font-extrabold text-brand-navy">
                    {formatBabyLength(latestGrowth?.length_cm ?? baby?.birth_length_cm)}
                  </Text>
                  <Text className="text-[11px] font-semibold text-brand-lavender-700">
                    +1.5 cm so với tháng trước
                  </Text>
                  <MiniTrend color="#B79CFF" />
                </View>
                <View className="flex-1 rounded-input border border-brand-gray bg-white p-3">
                  <Text className="text-sm font-bold text-brand-navy/70">Cân nặng</Text>
                  <Text className="mt-1 text-lg font-extrabold text-brand-navy">
                    {formatBabyWeight(latestGrowth?.weight_g ?? baby?.birth_weight_g)}
                  </Text>
                  <Text className="text-[11px] font-semibold text-brand-lavender-700">
                    +0.6 kg so với tháng trước
                  </Text>
                  <MiniTrend color="#B79CFF" />
                </View>
              </View>
            </SectionShell>

            <SectionShell title="Công cụ nhanh">
              <View className="flex-row gap-2">
                <QuickTool
                  family="material"
                  icon="needle"
                  label="Lịch tiêm chủng"
                  color="#7C5CDB"
                  background="#F4F0FF"
                  onPress={() => router.push('/(tabs)/reminders')}
                />
                <QuickTool
                  family="material"
                  icon="shield-check"
                  label="Sổ tiêm chủng"
                  color="#17A693"
                  background="#E8FBF5"
                  onPress={() => router.push('/(tabs)/baby')}
                />
                <QuickTool
                  family="ion"
                  icon="book"
                  label="Nhật ký bé"
                  color="#7C5CDB"
                  background="#F4F0FF"
                  onPress={() => router.push('/(tabs)/tracking')}
                />
                <QuickTool
                  family="ion"
                  icon="document-text-outline"
                  label="Kết quả khám"
                  color="#4F6CE8"
                  background="#EEF3FF"
                  onPress={() => router.push('/(tabs)/profile')}
                />
              </View>
            </SectionShell>
          </>
        ) : (
          <>
            <View className="mx-4 mb-3 rounded-card border border-brand-pink-100 bg-white p-4 shadow-brand">
              <View className="flex-row items-center justify-between">
                <View className="flex-1 pr-4">
                  <Text className="text-lg font-extrabold text-brand-navy">
                    Tuần thai thứ <Text className="text-brand-pink-500">{pregnancyWeek}</Text>
                  </Text>
                  <Text className="mt-3 text-5xl font-extrabold text-brand-pink-500">
                    {pregnancyWeek}
                  </Text>
                  <Text className="mt-1 text-[15px] font-semibold text-brand-navy/70">
                    {daysUntilDue !== null
                      ? `(${daysUntilDue} ngày nữa)`
                      : '(đang cập nhật ngày dự sinh)'}
                  </Text>
                  <Text className="mt-2 text-[15px] font-semibold text-brand-navy/70">
                    Ngày dự sinh: {formatDate(pregnancy?.due_date ?? null)}
                  </Text>
                </View>
                <View className="h-32 w-32 items-center justify-center rounded-full bg-brand-pink-100">
                  <View className="h-24 w-24 items-center justify-center rounded-full bg-brand-pink-200">
                    <Text className="text-6xl">👶</Text>
                  </View>
                </View>
              </View>

              <View className="mt-5">
                <View className="h-2 rounded-full bg-brand-gray">
                  <View
                    className="h-2 rounded-full bg-brand-pink"
                    style={{ width: `${weekProgress}%` }}
                  />
                </View>
                <View className="mt-2 flex-row justify-between">
                  <Text className="text-brand-navy/50 text-[10px] font-bold">Tuần 1</Text>
                  <Text className="text-brand-navy/50 text-[10px] font-bold">Tuần 40</Text>
                </View>
              </View>
            </View>

            <SectionShell
              title="Gợi ý hôm nay"
              actionLabel="Xem tất cả"
              onAction={() => router.push('/(tabs)/knowledge')}
            >
              <View className="flex-row gap-3">
                <SuggestionCard
                  icon="🥗"
                  title="Dinh dưỡng"
                  subtitle="Canxi cho mẹ bầu"
                  tint="pink"
                  onPress={() => router.push('/(tabs)/knowledge')}
                />
                <SuggestionCard
                  icon="🧘‍♀️"
                  title="Vận động"
                  subtitle="Yoga mẹ bầu"
                  tint="pink"
                  onPress={() => router.push('/(tabs)/knowledge')}
                />
                <SuggestionCard
                  icon="📋"
                  title="Kiểm tra"
                  subtitle="Danh sách cần làm"
                  tint="blue"
                  onPress={() => router.push('/(maternal)/prenatal-visits' as never)}
                />
              </View>
            </SectionShell>

            <SectionShell title="Tiến trình & theo dõi">
              <View className="flex-row gap-3">
                <MetricPill
                  label="Tăng cân"
                  value={
                    latestWeight
                      ? `+${Math.max(latestWeight.weight_kg - 52, 0).toFixed(1)} kg`
                      : '+-- kg'
                  }
                  subtitle="bình thường"
                  color="#17A693"
                />
                <MetricPill
                  label="Cân nặng"
                  value={latestWeight ? `${latestWeight.weight_kg.toFixed(1)} kg` : '-- kg'}
                  subtitle="Cập nhật gần nhất"
                  color="#17A693"
                />
                <MetricPill
                  label="Huyết áp"
                  value="110/70"
                  subtitle="Bình thường"
                  color="#7C5CDB"
                />
                <MetricPill
                  label="Nhịp tim thai"
                  value="145 bpm"
                  subtitle="2 giờ trước"
                  color="#7C5CDB"
                />
              </View>
            </SectionShell>

            <SectionShell title="Công cụ nhanh">
              <View className="flex-row gap-2">
                <QuickTool
                  family="ion"
                  icon="calendar"
                  label="Lịch khám thai"
                  color="#FF6B8A"
                  background="#FFF0F3"
                  onPress={() => router.push('/(maternal)/prenatal-visits' as never)}
                />
                <QuickTool
                  family="ion"
                  icon="document-text"
                  label="Kết quả khám"
                  color="#4F6CE8"
                  background="#EEF3FF"
                  onPress={() => router.push('/(tabs)/profile')}
                />
                <QuickTool
                  family="material"
                  icon="baby-face-outline"
                  label="Đếm cử động thai"
                  color="#FF6B8A"
                  background="#FFF0F3"
                  onPress={() => router.push('/(maternal)/kick-counter' as never)}
                />
                <QuickTool
                  family="ion"
                  icon="book"
                  label="Nhật ký thai kỳ"
                  color="#7C5CDB"
                  background="#F4F0FF"
                  onPress={() => router.push('/(tabs)/pregnancy')}
                />
              </View>
            </SectionShell>
          </>
        )}

        <View className="mx-4 mt-1 rounded-card border border-brand-pink-100 bg-brand-pink-50 p-4">
          <Text className="text-base font-extrabold text-brand-pink-600">
            Việc cần làm
          </Text>
          <View className="mt-3 gap-3">
            {(isBabyCase
              ? [
                  ['restaurant-outline', 'Ghi lại cữ bú hôm nay', 'Theo dõi lượng bú và thời điểm gần nhất'],
                  ['moon-outline', 'Cập nhật giấc ngủ', 'Ghi giấc ngủ ban ngày và giấc đêm của bé'],
                  ['bar-chart-outline', 'Kiểm tra tăng trưởng', 'Cập nhật cân nặng, chiều cao khi có số đo mới'],
                  ['notifications-outline', 'Xem nhắc nhở sắp tới', 'Tiêm chủng, thuốc và lịch khám của bé'],
                ]
              : [
                  ['medical-outline', 'Uống thuốc bổ', 'Nhắc mẹ uống vitamin và thuốc bổ đúng lịch'],
                  [
                    'calendar-outline',
                    'Lịch khám định kỳ',
                    daysUntilNextVisit === null
                      ? 'Chưa có lịch khám sắp tới'
                      : `Còn ${daysUntilNextVisit} ngày đến lịch khám`,
                  ],
                  ['walk-outline', 'Vận động nhẹ nhàng', 'Đi bộ hoặc giãn cơ nhẹ theo sức của mẹ'],
                  ['water-outline', 'Uống 2 lít nước', 'Chia nhỏ lượng nước trong ngày để mẹ dễ theo dõi'],
                ]
            ).map(([icon, title, subtitle]) => (
              <View key={title} className="flex-row items-center rounded-input bg-white px-3 py-3">
                <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-brand-lavender-50">
                  <Ionicons name={icon as IonIconName} size={20} color="#B79CFF" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-extrabold text-brand-navy">{title}</Text>
                  <Text className="mt-0.5 text-xs font-semibold leading-5 text-brand-navy/60">
                    {subtitle}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
