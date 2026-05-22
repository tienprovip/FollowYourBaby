import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Circle, Line, Polyline, Rect } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useBaby } from '@/hooks/useBaby';
import { useFeedLogs } from '@/hooks/useFeedLogs';
import { useSleepLogs } from '@/hooks/useSleepLogs';
import { useDiaperLogs } from '@/hooks/useDiaperLogs';
import { useGrowthLogs } from '@/hooks/useGrowthLogs';
import { useBabyTrackingStore } from '@/stores/babyTrackingStore';
import { useBabyStore } from '@/stores/babyStore';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface HeaderProps {
  title: string;
}

interface BabyMetricProps {
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

type TrackingSection = 'overview' | 'development' | 'knowledge';

const PURPLE = '#8C5CFF';
const NAVY = '#1F2B5B';

const TRACKING_SECTIONS: { key: TrackingSection; label: string }[] = [
  { key: 'overview', label: 'Tổng quan' },
  { key: 'development', label: 'Sự phát triển' },
  { key: 'knowledge', label: 'Mẹ cần biết' },
];

const FEED_TYPE_LABELS: Record<string, string> = {
  breast: 'Bú mẹ',
  bottle: 'Bình sữa',
  solid: 'Ăn dặm',
};

function relativeTime(isoStr: string): string {
  const then = parseISO(isoStr);
  const diffMin = Math.floor((Date.now() - then.getTime()) / 60000);
  if (diffMin < 1) return 'Vừa xong';
  if (diffMin < 60) return `${diffMin} phút trước`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH} giờ trước`;
  return format(then, 'HH:mm, dd/MM', { locale: vi });
}

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
          onPress={() => router.push('/(tabs)/reminders')}
          className="h-10 w-10 items-end justify-center"
          accessibilityRole="button"
          accessibilityLabel="Lịch nhắc"
        >
          <Ionicons name="calendar-outline" size={22} color={NAVY} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function BabyAvatar({ large = false }: { large?: boolean }) {
  return (
    <View
      className={`items-center justify-center rounded-full bg-brand-lavender-100 ${
        large ? 'h-28 w-28' : 'h-24 w-24'
      }`}
    >
      <View className="absolute h-full w-full rounded-full border-4 border-brand-lavender-200" />
      <View
        className={`items-center justify-center rounded-full bg-[#FFD0BD] ${
          large ? 'h-20 w-20' : 'h-16 w-16'
        }`}
      >
        <Text style={{ fontSize: large ? 48 : 38 }}>👶</Text>
      </View>
    </View>
  );
}

function BabyMetric({ icon, label, value, accent }: BabyMetricProps) {
  return (
    <View className="mr-3 min-w-[70px]">
      <View className="mb-2 h-8 w-8 items-center justify-center rounded-input bg-white shadow-brand">
        <MaterialCommunityIcons name={icon} size={17} color={accent} />
      </View>
      <Text className="text-[10px] font-semibold text-brand-navy/60">{label}</Text>
      <Text className="mt-0.5 text-xs font-bold text-brand-navy">{value}</Text>
    </View>
  );
}

function GrowthChart({ values, latestLabel }: { values: number[]; latestLabel: string }) {
  const min = Math.min(...values, 2);
  const max = Math.max(...values, 10);
  const range = Math.max(max - min, 1);
  const points = values
    .map((value, index) => {
      const x = 18 + index * (250 / Math.max(values.length - 1, 1));
      const y = 128 - ((value - min) / range) * 88;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <View>
      <View className="mb-3 flex-row rounded-full bg-[#F7F5FC] p-1">
        <View className="flex-1 items-center rounded-full border border-brand-lavender-500 bg-white py-2">
          <Text className="text-xs font-bold text-brand-lavender-700">Cân nặng</Text>
        </View>
        <View className="flex-1 items-center py-2">
          <Text className="text-xs font-bold text-brand-navy/60">Chiều cao</Text>
        </View>
      </View>
      <View className="flex-row justify-end">
        <Text className="text-xs font-bold text-brand-lavender-700">{latestLabel}</Text>
      </View>
      <Svg width="100%" height={164} viewBox="0 0 288 164">
        {[40, 62, 84, 106, 128].map((y) => (
          <Line
            key={y}
            x1="18"
            x2="268"
            y1={y}
            y2={y}
            stroke="#E8E5F0"
            strokeDasharray="3 4"
            strokeWidth="1"
          />
        ))}
        <Polyline
          points={`18,130 70,116 122,102 174,90 226,77 268,58`}
          fill="none"
          stroke="#B79CFF"
          strokeDasharray="4 5"
          strokeWidth="2"
        />
        <Polyline points={points} fill="none" stroke={PURPLE} strokeWidth="3" />
        {points.split(' ').map((point) => {
          const [cx, cy] = point.split(',');
          return (
            <Circle
              key={point}
              cx={cx}
              cy={cy}
              r="4"
              fill="#FFFFFF"
              stroke={PURPLE}
              strokeWidth="2"
            />
          );
        })}
      </Svg>
      <View className="flex-row justify-center gap-x-6">
        <View className="flex-row items-center">
          <View className="mr-2 h-0.5 w-5 bg-brand-lavender-500" />
          <Text className="text-[10px] font-semibold text-brand-navy/60">Cân nặng của bé</Text>
        </View>
        <View className="flex-row items-center">
          <View className="mr-2 h-0.5 w-5 border-t border-dashed border-brand-lavender-400" />
          <Text className="text-[10px] font-semibold text-brand-navy/60">Chuẩn WHO</Text>
        </View>
      </View>
    </View>
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
      <View className="mb-2 h-24 items-center justify-center overflow-hidden rounded-input bg-brand-blue/30">
        <Text style={{ fontSize: 44 }}>{emoji}</Text>
      </View>
      <Text className="text-xs font-bold leading-4 text-brand-navy">{title}</Text>
      <View className="mt-2 self-start rounded-full bg-brand-lavender-100 px-2 py-1">
        <Text className="text-[10px] font-bold text-brand-lavender-700">{tag}</Text>
      </View>
    </View>
  );
}

function QuickTool({
  icon,
  label,
  color,
  onPress,
}: {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  label: string;
  color: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-1 items-center"
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View className="mb-2 h-14 w-14 items-center justify-center rounded-card bg-white shadow-brand">
        <MaterialCommunityIcons name={icon} size={27} color={color} />
      </View>
      <Text className="text-center text-[11px] font-bold text-brand-navy">{label}</Text>
    </TouchableOpacity>
  );
}

function BabyTrackingTabs({
  active,
  onChange,
}: {
  active: TrackingSection;
  onChange: (section: TrackingSection) => void;
}) {
  const [trackWidth, setTrackWidth] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;
  const activeIndex = Math.max(
    0,
    TRACKING_SECTIONS.findIndex((item) => item.key === active),
  );
  const tabWidth = trackWidth > 0 ? (trackWidth - 8) / TRACKING_SECTIONS.length : 0;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: activeIndex * tabWidth,
      useNativeDriver: true,
      tension: 180,
      friction: 18,
    }).start();
  }, [activeIndex, tabWidth, translateX]);

  return (
    <View
      onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}
      className="relative mx-5 mb-5 flex-row overflow-hidden rounded-full bg-white/80 p-1 shadow-brand"
    >
      {tabWidth > 0 && (
        <Animated.View
          pointerEvents="none"
          className="absolute bottom-1 left-1 top-1 rounded-full border border-brand-lavender-200 bg-white"
          style={{
            width: tabWidth,
            transform: [{ translateX }],
          }}
        />
      )}
      {TRACKING_SECTIONS.map((item) => {
        const isActive = item.key === active;

        return (
          <Pressable
            key={item.key}
            onPress={() => onChange(item.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            className="z-10 flex-1 items-center rounded-full py-3"
          >
            <Text
              className={`text-xs font-bold ${
                isActive ? 'text-brand-lavender-700' : 'text-brand-navy'
              }`}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function BabyMilestoneRow({
  icon,
  title,
  body,
  color,
}: {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  title: string;
  body: string;
  color: string;
}) {
  return (
    <View className="mb-3 flex-row items-center rounded-card bg-white p-4 shadow-brand">
      <View
        className="mr-4 h-12 w-12 items-center justify-center rounded-input"
        style={{ backgroundColor: `${color}22` }}
      >
        <MaterialCommunityIcons name={icon} size={23} color={color} />
      </View>
      <View className="flex-1">
        <View className="flex-row items-center">
          <Text className="flex-1 text-sm font-bold text-brand-navy">{title}</Text>
          <View className="rounded-full bg-brand-mint/40 px-2 py-1">
            <Text className="text-[10px] font-bold text-[#16A085]">Đạt</Text>
          </View>
        </View>
        <Text className="mt-1 text-xs font-semibold leading-5 text-brand-navy/60">{body}</Text>
      </View>
    </View>
  );
}

function BabyDevelopmentTab({ babyName, ageLabel }: { babyName: string; ageLabel: string }) {
  return (
    <View className="px-5">
      <Card className="mb-4 border-brand-lavender-100" padding="lg">
        <View className="flex-row items-center">
          <BabyAvatar large />
          <View className="ml-5 flex-1">
            <View className="flex-row items-center">
              <Text className="text-2xl font-bold text-brand-navy">{babyName}</Text>
              <TouchableOpacity
                onPress={() => router.push('/(baby)/profile')}
                className="ml-3 h-8 w-8 items-center justify-center rounded-full bg-white shadow-brand"
              >
                <Ionicons name="pencil" size={14} color={NAVY} />
              </TouchableOpacity>
            </View>
            <Text className="mt-3 text-sm font-bold text-brand-lavender-700">{ageLabel}</Text>
            <View className="mt-3 self-start rounded-full bg-brand-lavender-50 px-3 py-1.5">
              <Text className="text-xs font-bold text-brand-navy/70">Tuần thứ 37</Text>
            </View>
          </View>
        </View>
      </Card>

      <Text className="mb-2 text-lg font-bold text-brand-navy">Bé phát triển như thế nào?</Text>
      <Text className="mb-4 text-sm font-semibold leading-6 text-brand-navy/70">
        Bé đang phát triển rất tốt! Dưới đây là những mốc phát triển nổi bật của bé ở tuần này.
      </Text>

      <BabyMilestoneRow
        icon="baby-face-outline"
        title="Vận động thô"
        body="Bé có thể tự ngồi vững, bắt đầu bò hoặc di chuyển bằng cách trườn."
        color="#2BCB9A"
      />
      <BabyMilestoneRow
        icon="hand-wave-outline"
        title="Vận động tinh"
        body="Bé cầm nắm đồ vật bằng cả bàn tay, chuyển đồ từ tay này sang tay kia."
        color="#4FA8FF"
      />
      <BabyMilestoneRow
        icon="chat-processing-outline"
        title="Ngôn ngữ"
        body="Bé bập bẹ nhiều âm hơn và phản ứng khi được gọi tên."
        color="#FF6D91"
      />
      <BabyMilestoneRow
        icon="shield-star-outline"
        title="Nhận thức"
        body="Bé tò mò khám phá đồ vật, nhận biết người thân quen."
        color="#6B8BFF"
      />
      <BabyMilestoneRow
        icon="heart-outline"
        title="Cảm xúc - xã hội"
        body="Bé thích chơi trò tương tác, cười khi được trêu đùa."
        color="#FF9F43"
      />

      <TouchableOpacity
        onPress={() => router.push('/(tabs)/milestones')}
        className="mt-2 rounded-card border border-brand-lavender-200 bg-brand-lavender-50 py-4"
      >
        <Text className="text-center text-sm font-bold text-brand-lavender-700">
          Xem chi tiết các mốc phát triển ›
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function BabyKnowledgeRow({
  icon,
  title,
  body,
  color,
}: {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  title: string;
  body: string;
  color: string;
}) {
  return (
    <TouchableOpacity
      onPress={() => router.push('/(tabs)/knowledge')}
      accessibilityRole="button"
      className="mb-3 flex-row items-center rounded-card bg-white p-4 shadow-brand"
    >
      <View
        className="mr-4 h-14 w-14 items-center justify-center rounded-input"
        style={{ backgroundColor: `${color}20` }}
      >
        <MaterialCommunityIcons name={icon} size={27} color={color} />
      </View>
      <View className="flex-1">
        <Text className="text-sm font-bold text-brand-navy">{title}</Text>
        <Text className="mt-1 text-xs font-semibold leading-5 text-brand-navy/60">{body}</Text>
      </View>
      <View className="items-end">
        <Text className="mb-1 text-[10px] font-bold text-brand-lavender-700">Xem chi tiết</Text>
        <Ionicons name="chevron-forward" size={16} color={PURPLE} />
      </View>
    </TouchableOpacity>
  );
}

function BabyKnowledgeTab() {
  return (
    <View className="px-5">
      <Text className="mb-4 text-base font-bold text-brand-navy">Mẹ cần biết</Text>
      <BabyKnowledgeRow
        icon="baby-bottle-outline"
        title="Chăm sóc bé"
        body="Hướng dẫn chăm sóc bé theo từng giai đoạn phát triển."
        color="#4FA8FF"
      />
      <BabyKnowledgeRow
        icon="food-apple-outline"
        title="Dinh dưỡng"
        body="Gợi ý chế độ ăn dặm, dinh dưỡng phù hợp cho bé."
        color="#FF8A3D"
      />
      <BabyKnowledgeRow
        icon="weather-night"
        title="Giấc ngủ"
        body="Thiết lập thói quen ngủ tốt cho bé từ sớm."
        color="#8C5CFF"
      />
      <BabyKnowledgeRow
        icon="shield-check-outline"
        title="Sức khỏe"
        body="Lịch tiêm chủng, phòng bệnh và những lưu ý quan trọng."
        color="#20B7A8"
      />
      <BabyKnowledgeRow
        icon="puzzle-outline"
        title="Phát triển toàn diện"
        body="Trò chơi, hoạt động giúp bé phát triển trí tuệ và cảm xúc."
        color="#FF9F43"
      />
      <BabyKnowledgeRow
        icon="alert-outline"
        title="Dấu hiệu cần lưu ý"
        body="Những dấu hiệu bất thường mẹ cần theo dõi và gặp bác sĩ."
        color="#FF4F7B"
      />
    </View>
  );
}

export default function BabyTab() {
  const [activeSection, setActiveSection] = useState<TrackingSection>('overview');
  const { activeBabyId } = useBabyStore();
  const { baby, isLoading: babyLoading } = useBaby();
  const { lastFeed, todayLogs: feedToday, isLoading: feedLoading } = useFeedLogs();
  const { lastSleep, todayNapMinutes, todayNightMinutes, isLoading: sleepLoading } = useSleepLogs();
  const { todayCount: diaperCount, isLoading: diaperLoading } = useDiaperLogs();
  const {
    latestLog: latestGrowth,
    logs: growthLogs,
    isLoading: growthLoading,
  } = useGrowthLogs(baby?.sex, baby?.dob);
  const { activeFeedSession, activeSleepSession } = useBabyTrackingStore();

  const dataLoading = babyLoading || feedLoading || sleepLoading || diaperLoading || growthLoading;

  const onRefresh = useCallback(() => {
    // TanStack Query refreshes cached data through focus and invalidation.
  }, []);

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
  const weightKg = latestGrowth?.weight_g != null ? latestGrowth.weight_g / 1000 : null;
  const lengthCm = latestGrowth?.length_cm ?? null;
  const growthValues =
    growthLogs.filter((log) => log.weight_g != null).length >= 2
      ? growthLogs
          .filter((log) => log.weight_g != null)
          .slice(-6)
          .map((log) => (log.weight_g ?? 0) / 1000)
      : [4.2, 4.8, 5.5, 6.1, 6.7, weightKg ?? 8.2];
  const completedTasks = [
    feedToday.length > 0,
    todayNapMinutes + todayNightMinutes > 0,
    diaperCount > 0,
    weightKg != null,
  ].filter(Boolean).length;

  return (
    <SafeAreaView className="flex-1 bg-brand-peach" edges={['top']}>
      <ScrollView
        className="flex-1"
        refreshControl={<RefreshControl refreshing={dataLoading} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: 34 }}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader title="Theo dõi bé" />
        <BabyTrackingTabs active={activeSection} onChange={setActiveSection} />

        {activeSection === 'overview' ? (
          <View className="px-5">
            {(activeFeedSession || activeSleepSession) && (
              <TouchableOpacity
                onPress={() => router.push(activeFeedSession ? '/(baby)/feed' : '/(baby)/sleep')}
                className="mb-4 flex-row items-center rounded-card bg-brand-lavender-50 px-4 py-3"
              >
                <Text className="mr-3 text-xl">{activeFeedSession ? '🍼' : '😴'}</Text>
                <View className="flex-1">
                  <Text className="text-sm font-bold text-brand-navy">
                    {activeFeedSession ? 'Đang bú mẹ' : 'Bé đang ngủ'}
                  </Text>
                  <Text className="text-xs font-medium text-brand-navy/60">
                    Nhấn để mở phiên đang chạy
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={NAVY} />
              </TouchableOpacity>
            )}

            <Card className="mb-4 border-brand-lavender-100" padding="lg">
              <View className="flex-row items-center">
                <BabyAvatar large />
                <View className="ml-5 flex-1">
                  <View className="flex-row items-center">
                    <Text className="text-2xl font-bold text-brand-navy">
                      {baby?.name ?? 'Bé yêu'}
                    </Text>
                    <TouchableOpacity
                      onPress={() => router.push('/(baby)/profile')}
                      className="ml-3 h-8 w-8 items-center justify-center rounded-full bg-white shadow-brand"
                    >
                      <Ionicons name="pencil" size={14} color={NAVY} />
                    </TouchableOpacity>
                  </View>
                  <Text className="mt-3 text-sm font-bold text-brand-lavender-700">
                    {baby?.ageLabel ?? 'Đang cập nhật'}
                  </Text>
                  <Text className="mt-3 text-xs font-bold text-brand-navy">
                    Ngày sinh: {baby?.dob ? format(parseISO(baby.dob), 'dd/MM/yyyy') : '--/--/----'}
                  </Text>
                </View>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-6">
                <BabyMetric
                  icon="weight-kilogram"
                  label="Cân nặng"
                  value={weightKg != null ? `${weightKg.toFixed(1)} kg` : '-- kg'}
                  accent={PURPLE}
                />
                <BabyMetric
                  icon="human-male-height"
                  label="Chiều cao"
                  value={lengthCm != null ? `${lengthCm} cm` : '-- cm'}
                  accent="#7B61FF"
                />
                <BabyMetric
                  icon="baby-bottle-outline"
                  label="Bú sữa"
                  value={`${feedToday.length} cữ/ngày`}
                  accent="#20B7D9"
                />
                <BabyMetric
                  icon="weather-night"
                  label="Ngủ"
                  value={`${totalSleepH} giờ/đêm`}
                  accent="#4FA8FF"
                />
                <TouchableOpacity
                  onPress={() => router.push('/(baby)/growth')}
                  className="h-8 w-8 items-center justify-center rounded-full border border-brand-gray"
                >
                  <Ionicons name="chevron-forward" size={16} color={NAVY} />
                </TouchableOpacity>
              </ScrollView>
            </Card>

            <Card className="mb-4" padding="lg">
              <View className="flex-row items-center">
                <View className="flex-1 pr-3">
                  <View className="mb-4 flex-row items-center justify-between">
                    <Text className="text-base font-bold text-brand-navy">
                      Sự phát triển của bé
                    </Text>
                    <TouchableOpacity onPress={() => router.push('/(tabs)/milestones')}>
                      <Text className="text-xs font-bold text-brand-navy">Xem chi tiết ›</Text>
                    </TouchableOpacity>
                  </View>
                  <Text className="text-sm font-bold leading-5 text-brand-navy">
                    Bé đang phát triển rất tốt!
                  </Text>
                  <Text className="mt-2 text-sm font-semibold leading-5 text-brand-navy/70">
                    Hãy tiếp tục duy trì chế độ chăm sóc và dinh dưỡng phù hợp nhé.
                  </Text>
                </View>
                <BabyAvatar />
              </View>
            </Card>

            <Card className="mb-4" padding="lg">
              <Text className="mb-4 text-base font-bold text-brand-navy">Biểu đồ tăng trưởng</Text>
              <GrowthChart
                values={growthValues}
                latestLabel={weightKg != null ? `${weightKg.toFixed(1)} kg` : '-- kg'}
              />
            </Card>

            <Card className="mb-4" padding="lg">
              <View className="mb-4 flex-row items-center justify-between">
                <Text className="text-base font-bold text-brand-navy">Việc cần làm</Text>
                <Text className="text-xs font-bold text-brand-navy/60">
                  {completedTasks}/4 đã hoàn thành
                </Text>
              </View>
              <TodoItem
                title="Cho bé ăn dặm"
                body={
                  lastFeed
                    ? `${FEED_TYPE_LABELS[lastFeed.type] ?? lastFeed.type} - ${relativeTime(lastFeed.started_at)}`
                    : 'Bữa trưa - 11:30'
                }
                done={feedToday.length > 0}
              />
              <TodoItem title="Tắm cho bé" body="Buổi tối - 20:00" done={diaperCount > 0} />
              <TodoItem title="Đọc sách cùng bé" body="Thời gian gắn kết yêu thương" />
              <TodoItem
                title="Theo dõi cân nặng"
                body={weightKg != null ? 'Đã có cân nặng mới nhất' : 'Cập nhật cân nặng tuần này'}
                done={weightKg != null}
              />
              <View className="items-end">
                <Svg width={96} height={78} viewBox="0 0 96 78">
                  <Rect x="26" y="12" width="44" height="56" rx="10" fill="#F1E9FF" />
                  <Rect x="34" y="6" width="28" height="12" rx="5" fill="#A578FF" />
                  <Line x1="38" y1="30" x2="58" y2="30" stroke="#B79CFF" strokeWidth="4" />
                  <Line x1="38" y1="44" x2="58" y2="44" stroke="#B79CFF" strokeWidth="4" />
                  <Circle cx="76" cy="39" r="13" fill="#B79CFF" opacity="0.75" />
                </Svg>
              </View>
            </Card>

            <Card className="mb-4" padding="lg">
              <View className="mb-4 flex-row items-center justify-between">
                <Text className="text-base font-bold text-brand-navy">Gợi ý hôm nay</Text>
                <TouchableOpacity onPress={() => router.push('/(tabs)/knowledge')}>
                  <Text className="text-xs font-bold text-brand-navy">Xem tất cả ›</Text>
                </TouchableOpacity>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <AdviceCard title="Thực đơn ăn dặm cho bé 8-9 tháng" tag="Dinh dưỡng" emoji="🍲" />
                <AdviceCard
                  title="5 trò chơi giúp bé phát triển trí não"
                  tag="Phát triển"
                  emoji="🧸"
                />
                <AdviceCard title="Bí quyết giúp bé ngủ ngon hơn" tag="Giấc ngủ" emoji="😴" />
              </ScrollView>
            </Card>

            <Card className="mb-4 border-brand-lavender-100 bg-brand-lavender-50" padding="lg">
              <View className="flex-row items-center">
                <View className="flex-1">
                  <Text className="text-base font-bold text-brand-lavender-700">
                    Hỏi FollowYourBaby AI
                  </Text>
                  <Text className="mt-2 text-sm font-bold leading-5 text-brand-navy">
                    Giải đáp thắc mắc 24/7 về sự phát triển của bé
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => router.push('/(tabs)/ai-chat')}
                  className="mr-3 rounded-input bg-brand-lavender-500 px-5 py-3"
                >
                  <Text className="text-xs font-bold text-white">Hỏi ngay</Text>
                </TouchableOpacity>
                <View className="h-20 w-20 items-center justify-center rounded-full bg-white">
                  <MaterialCommunityIcons name="robot-happy-outline" size={42} color={PURPLE} />
                </View>
              </View>
            </Card>

            <Card padding="lg">
              <Text className="mb-4 text-base font-bold text-brand-navy">
                Công cụ theo dõi nhanh
              </Text>
              <View className="flex-row gap-x-3">
                <QuickTool
                  icon="needle"
                  label="Lịch tiêm chủng"
                  color="#8C5CFF"
                  onPress={() => router.push('/(tabs)/reminders')}
                />
                <QuickTool
                  icon="book-open-page-variant"
                  label="Nhật ký bé"
                  color="#8C5CFF"
                  onPress={() => router.push('/(baby)/activities')}
                />
                <QuickTool
                  icon="file-document-outline"
                  label="Kết quả khám"
                  color="#4F8DFF"
                  onPress={() => router.push('/(baby)/health')}
                />
                <QuickTool
                  icon="shield-check-outline"
                  label="Sổ tiêm chủng"
                  color="#20B7A8"
                  onPress={() => router.push('/(tabs)/reminders')}
                />
              </View>
              {lastSleep && (
                <Text className="mt-4 text-xs font-semibold text-brand-navy/60">
                  Giấc ngủ gần nhất: {lastSleep.kind === 'nap' ? 'ngủ ngày' : 'ngủ đêm'} -{' '}
                  {relativeTime(lastSleep.started_at)}
                </Text>
              )}
            </Card>
          </View>
        ) : activeSection === 'development' ? (
          <BabyDevelopmentTab
            babyName={baby?.name ?? 'Bé yêu'}
            ageLabel={baby?.ageLabel ?? 'Đang cập nhật'}
          />
        ) : (
          <BabyKnowledgeTab />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
