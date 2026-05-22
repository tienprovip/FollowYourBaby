import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
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
import Svg, { Circle, Line, Polyline, Polygon, Rect } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { differenceInDays, format, parseISO, startOfDay } from 'date-fns';
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

type TrackingSection = 'overview' | 'development' | 'knowledge';

const PINK = '#FF4F7B';
const NAVY = '#1F2B5B';
const TRACK = '#ECEAF1';

const TRACKING_SECTIONS: { key: TrackingSection; label: string }[] = [
  { key: 'overview', label: 'Tổng quan' },
  { key: 'development', label: 'Sự phát triển' },
  { key: 'knowledge', label: 'Mẹ cần biết' },
];

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

function TrackingTabs({
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
          className="absolute bottom-1 left-1 top-1 rounded-full border border-brand-pink-200 bg-white"
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
                isActive ? 'text-brand-pink-500' : 'text-brand-navy'
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

function estimateFetalSize(week: number) {
  const length = Math.max(0.4, week * 1.25);
  const weight =
    week < 8
      ? week
      : week < 20
        ? week * week * 1.1
        : Math.min(3600, Math.round((week - 20) * 150 + 300));

  if (week <= 8) {
    return {
      fruit: 'Hạt đậu nhỏ',
      length: `${length.toFixed(1)} cm`,
      weight: `${Math.round(weight)} g`,
    };
  }
  if (week <= 13) {
    return {
      fruit: 'Quả chanh',
      length: `${length.toFixed(1)} cm`,
      weight: `${Math.round(weight)} g`,
    };
  }
  if (week <= 20) {
    return {
      fruit: 'Quả bơ',
      length: `${length.toFixed(1)} cm`,
      weight: `${Math.round(weight)} g`,
    };
  }
  if (week <= 28) {
    return {
      fruit: 'Quả đu đủ',
      length: `${length.toFixed(1)} cm`,
      weight: `${Math.round(weight)} g`,
    };
  }
  if (week <= 36) {
    return {
      fruit: 'Quả bí nhỏ',
      length: `${length.toFixed(1)} cm`,
      weight: `${Math.round(weight)} g`,
    };
  }

  return {
    fruit: 'Em bé đủ tháng',
    length: `${length.toFixed(1)} cm`,
    weight: `${Math.round(weight)} g`,
  };
}

function WeekSelector({
  selectedWeek,
  onSelectWeek,
}: {
  selectedWeek: number;
  onSelectWeek: (week: number) => void;
}) {
  const weeks = Array.from({ length: 42 }, (_, index) => index + 1);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="mb-4"
      contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
    >
      {weeks.map((week) => {
        const isActive = week === selectedWeek;
        return (
          <Pressable
            key={week}
            onPress={() => onSelectWeek(week)}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={`Tuần ${week}`}
            className={`rounded-full px-5 py-2.5 ${isActive ? 'bg-brand-pink-500' : 'bg-white'}`}
          >
            <Text className={`text-xs font-bold ${isActive ? 'text-white' : 'text-brand-navy/60'}`}>
              Tuần {week}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

function DevelopmentBullet({ title, body }: { title: string; body: string }) {
  return (
    <View className="flex-row items-start py-3">
      <View className="mr-3 mt-0.5 h-5 w-5 items-center justify-center rounded-full bg-brand-pink-500">
        <Ionicons name="checkmark" size={12} color="#FFFFFF" />
      </View>
      <View className="flex-1">
        <Text className="text-sm font-bold text-brand-navy">{title}</Text>
        <Text className="mt-1 text-xs font-semibold leading-5 text-brand-navy/60">{body}</Text>
      </View>
    </View>
  );
}

function PregnancyDevelopmentTab({
  currentWeek,
  weekDetail,
}: {
  currentWeek: number;
  weekDetail: string;
}) {
  const [selectedWeek, setSelectedWeek] = useState(Math.max(1, currentWeek || 1));
  const fetalSize = estimateFetalSize(selectedWeek);
  const selectedWeekDetail = selectedWeek === currentWeek ? weekDetail : `${selectedWeek} tuần`;

  return (
    <View>
      <WeekSelector selectedWeek={selectedWeek} onSelectWeek={setSelectedWeek} />
      <View className="px-5">
        <Text className="mb-3 text-sm font-bold text-brand-navy">Thai nhi của mẹ</Text>
        <Card className="mb-5" padding="lg">
          <View className="flex-row items-center">
            <PregnancyIllustration />
            <View className="ml-5 flex-1">
              <Text className="text-base font-bold text-brand-navy">Tuần thai thứ</Text>
              <Text className="mt-2 text-5xl font-bold text-brand-pink-500">{selectedWeek}</Text>
              <Text className="mt-1 text-sm font-bold text-brand-navy">({selectedWeekDetail})</Text>
              <Text className="mt-3 text-xs font-bold text-brand-navy/60">
                Kích thước tương đương
              </Text>
              <Text className="mt-1 text-base font-bold text-brand-navy">Quả đu đủ</Text>
            </View>
          </View>
          <View className="mt-6 flex-row border-t border-brand-gray pt-4">
            <View className="flex-1 items-center">
              <Text className="text-xs font-semibold text-brand-navy/50">Chiều dài (CRL)</Text>
              <Text className="mt-1 text-sm font-bold text-brand-navy">{fetalSize.length}</Text>
            </View>
            <View className="w-px bg-brand-gray" />
            <View className="flex-1 items-center">
              <Text className="text-xs font-semibold text-brand-navy/50">Cân nặng</Text>
              <Text className="mt-1 text-sm font-bold text-brand-navy">{fetalSize.weight}</Text>
            </View>
          </View>
        </Card>

        <Text className="mb-2 text-lg font-bold text-brand-navy">Sự phát triển của thai nhi</Text>
        <Text className="mb-4 text-sm font-semibold leading-6 text-brand-navy/70">
          Bé đang phát triển rất nhanh! Các cơ quan quan trọng đang hoàn thiện dần. Bé có thể nghe
          được âm thanh và cảm nhận ánh sáng mẹ nhé.
        </Text>
        <Card padding="lg">
          <DevelopmentBullet
            title="Hệ thần kinh tiếp tục phát triển"
            body="Não bộ phát triển nhanh, các kết nối thần kinh ngày càng hoàn thiện."
          />
          <DevelopmentBullet
            title="Bé nghe được âm thanh"
            body="Bé có thể nghe thấy giọng nói, nhạc và âm thanh từ bên ngoài."
          />
          <DevelopmentBullet
            title="Da bé bắt đầu có lớp bảo vệ"
            body="Lớp màng bảo vệ hình thành, giúp bảo vệ làn da non nớt của bé."
          />
        </Card>
      </View>
    </View>
  );
}

function KnowledgeRow({
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
      className="mb-3 flex-row items-center rounded-card bg-white p-4 shadow-brand"
      accessibilityRole="button"
      onPress={() => router.push('/(tabs)/knowledge')}
    >
      <View
        className="mr-4 h-12 w-12 items-center justify-center rounded-input"
        style={{ backgroundColor: `${color}22` }}
      >
        <MaterialCommunityIcons name={icon} size={24} color={color} />
      </View>
      <View className="flex-1">
        <Text className="text-sm font-bold text-brand-navy">{title}</Text>
        <Text className="mt-1 text-xs font-semibold leading-5 text-brand-navy/60">{body}</Text>
      </View>
      <Ionicons name="chevron-forward" size={17} color={NAVY} />
    </TouchableOpacity>
  );
}

function PregnancyKnowledgeTab({ currentWeek }: { currentWeek: number }) {
  return (
    <View className="px-5">
      <Text className="mb-4 text-base font-bold text-brand-navy">
        Mẹ cần biết trong tuần {currentWeek}
      </Text>
      <Card className="mb-4 border-[#FFD9B8] bg-[#FFF7EA]" padding="lg">
        <View className="flex-row items-center">
          <View className="flex-1 pr-3">
            <Text className="text-sm font-bold text-[#B56A24]">Dinh dưỡng cho mẹ</Text>
            <Text className="mt-2 text-xs font-semibold leading-5 text-[#8D5A22]">
              Tăng cường thực phẩm giàu sắt, canxi và axit folic để hỗ trợ bé phát triển.
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/knowledge')}
              className="mt-4 self-start"
            >
              <Text className="text-xs font-bold text-brand-pink-600">Xem chi tiết ›</Text>
            </TouchableOpacity>
          </View>
          <View className="h-20 w-24 items-center justify-center rounded-card bg-white">
            <Text style={{ fontSize: 42 }}>🥗</Text>
          </View>
        </View>
      </Card>
      <KnowledgeRow
        icon="human-pregnant"
        title="Những thay đổi của cơ thể mẹ"
        body="Tìm hiểu thay đổi thường gặp tuần này."
        color="#FF6D91"
      />
      <KnowledgeRow
        icon="account-heart-outline"
        title="Lời khuyên từ chuyên gia"
        body="Gợi ý, lưu ý quan trọng cho mẹ bầu tuần 22."
        color="#8C5CFF"
      />
      <KnowledgeRow
        icon="weather-night"
        title="Giấc ngủ & tinh thần"
        body="Mẹ nên ngủ đủ giấc, nghỉ ngơi hợp lý để giảm căng thẳng."
        color="#8C5CFF"
      />
      <KnowledgeRow
        icon="alert-outline"
        title="Dấu hiệu cần lưu ý"
        body="Những dấu hiệu bất thường mẹ cần theo dõi và gặp bác sĩ."
        color="#FF4F7B"
      />
      <KnowledgeRow
        icon="help-circle-outline"
        title="Câu hỏi thường gặp"
        body="Giải đáp các thắc mắc phổ biến từ mẹ bầu."
        color="#4FA8FF"
      />
    </View>
  );
}

function getMotherWeekInfo(week: number) {
  if (week <= 12) {
    return {
      focus: 'Ổn định giai đoạn đầu thai kỳ',
      nutrition: 'Ưu tiên axit folic, sắt và các bữa nhỏ dễ tiêu để giảm buồn nôn.',
      body: 'Mẹ có thể mệt hơn, buồn nôn, căng tức ngực hoặc nhạy cảm với mùi.',
      advice: 'Nghỉ ngơi nhiều hơn, uống đủ nước và trao đổi với bác sĩ nếu nghén nặng.',
      sleep: 'Ngủ sớm, chia nhỏ thời gian nghỉ trong ngày để cơ thể hồi phục.',
      warning: 'Ra máu, đau bụng dữ dội hoặc chóng mặt nhiều cần được thăm khám sớm.',
    };
  }

  if (week <= 27) {
    return {
      focus: 'Duy trì năng lượng cho tam cá nguyệt thứ 2',
      nutrition: 'Tăng cường đạm, canxi, sắt và rau xanh để hỗ trợ bé phát triển nhanh.',
      body: 'Bụng rõ hơn, mẹ có thể thấy đau lưng nhẹ, căng da và bắt đầu cảm nhận thai máy.',
      advice: 'Vận động nhẹ, theo dõi cân nặng đều và chuẩn bị lịch khám đúng hẹn.',
      sleep: 'Nằm nghiêng bên trái và kê gối đỡ bụng để dễ chịu hơn khi ngủ.',
      warning: 'Thai máy giảm rõ, đau đầu nhiều, phù nhanh hoặc đau bụng bất thường cần lưu ý.',
    };
  }

  if (week <= 36) {
    return {
      focus: 'Chuẩn bị cho giai đoạn cuối thai kỳ',
      nutrition: 'Chia nhỏ bữa ăn, bổ sung canxi và uống đủ nước để hạn chế chuột rút.',
      body: 'Mẹ có thể nặng nề hơn, khó ngủ, đau lưng, phù nhẹ và đi tiểu thường xuyên.',
      advice: 'Chuẩn bị đồ đi sinh, theo dõi cơn gò và duy trì khám thai định kỳ.',
      sleep: 'Nghỉ nhiều hơn, kê cao chân khi phù và tránh nằm ngửa lâu.',
      warning: 'Cơn gò đều, ra nước âm đạo, ra máu hoặc đau đầu kèm nhìn mờ cần đi khám.',
    };
  }

  return {
    focus: 'Theo dõi sát ngày dự sinh',
    nutrition: 'Ăn nhẹ, dễ tiêu, uống đủ nước và chuẩn bị năng lượng cho chuyển dạ.',
    body: 'Mẹ có thể thấy bụng tụt, cơn gò Braxton Hicks rõ hơn và áp lực vùng chậu tăng.',
    advice: 'Theo dõi dấu hiệu chuyển dạ, giữ điện thoại và giấy tờ khám thai sẵn sàng.',
    sleep: 'Nghỉ khi có thể, ưu tiên tư thế thoải mái và nhờ người thân hỗ trợ.',
    warning: 'Ra nước ối, ra máu, thai máy giảm hoặc cơn gò đều tăng dần cần đến cơ sở y tế.',
  };
}

function PregnancyKnowledgeTabWithWeeks({ currentWeek }: { currentWeek: number }) {
  const [selectedWeek, setSelectedWeek] = useState(Math.max(1, currentWeek || 1));
  const weekInfo = getMotherWeekInfo(selectedWeek);

  return (
    <View>
      <WeekSelector selectedWeek={selectedWeek} onSelectWeek={setSelectedWeek} />
      <View className="px-5">
        <Text className="mb-4 text-base font-bold text-brand-navy">
          Mẹ cần biết trong tuần {selectedWeek}
        </Text>
        <Card className="mb-4 border-[#FFD9B8] bg-[#FFF7EA]" padding="lg">
          <View className="flex-row items-center">
            <View className="flex-1 pr-3">
              <Text className="text-sm font-bold text-[#B56A24]">{weekInfo.focus}</Text>
              <Text className="mt-2 text-xs font-semibold leading-5 text-[#8D5A22]">
                {weekInfo.nutrition}
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/(tabs)/knowledge')}
                className="mt-4 self-start"
              >
                <Text className="text-xs font-bold text-brand-pink-600">Xem chi tiết ›</Text>
              </TouchableOpacity>
            </View>
            <View className="h-20 w-24 items-center justify-center rounded-card bg-white">
              <Text style={{ fontSize: 42 }}>🥗</Text>
            </View>
          </View>
        </Card>
        <KnowledgeRow
          icon="human-pregnant"
          title="Những thay đổi của cơ thể mẹ"
          body={weekInfo.body}
          color="#FF6D91"
        />
        <KnowledgeRow
          icon="account-heart-outline"
          title="Lời khuyên từ chuyên gia"
          body={weekInfo.advice}
          color="#8C5CFF"
        />
        <KnowledgeRow
          icon="weather-night"
          title="Giấc ngủ & tinh thần"
          body={weekInfo.sleep}
          color="#8C5CFF"
        />
        <KnowledgeRow
          icon="alert-outline"
          title="Dấu hiệu cần lưu ý"
          body={weekInfo.warning}
          color="#FF4F7B"
        />
        <KnowledgeRow
          icon="help-circle-outline"
          title="Câu hỏi thường gặp"
          body="Giải đáp các thắc mắc phổ biến từ mẹ bầu."
          color="#4FA8FF"
        />
      </View>
    </View>
  );
}

export default function PregnancyTab() {
  const [activeSection, setActiveSection] = useState<TrackingSection>('overview');
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
  const weekDetail = (() => {
    const today = startOfDay(new Date());
    if (pregnancy.due_date != null) {
      const daysElapsed = Math.max(0, 280 - differenceInDays(startOfDay(parseISO(pregnancy.due_date)), today));
      return `${Math.floor(daysElapsed / 7)} tuần ${daysElapsed % 7} ngày`;
    }
    if (pregnancy.lmp_date != null) {
      const days = Math.max(0, differenceInDays(today, startOfDay(parseISO(pregnancy.lmp_date))));
      return `${Math.floor(days / 7)} tuần ${days % 7} ngày`;
    }
    return `${currentWeek} tuần`;
  })();
  const daysLeft = pregnancy.daysUntilDue != null ? Math.max(pregnancy.daysUntilDue, 0) : null;

  return (
    <SafeAreaView className="flex-1 bg-brand-peach" edges={['top']}>
      <ScrollView
        className="flex-1"
        refreshControl={<RefreshControl refreshing={dataLoading} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: 34 }}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader title="Theo dõi thai kỳ" />
        <TrackingTabs active={activeSection} onChange={setActiveSection} />

        {activeSection === 'overview' ? (
          <View className="px-5">
            <Card className="mb-4 border-brand-pink-100" padding="lg">
              <View className="flex-row items-center">
                <View className="flex-1 pr-3">
                  <Text className="text-base font-bold text-brand-navy">Tuần thai thứ</Text>
                  <Text className="mt-2 text-5xl font-bold text-brand-pink-500">{currentWeek}</Text>
                  <Text className="mt-1 text-sm font-bold text-brand-navy">({weekDetail})</Text>
                  <View className="mt-3 flex-row items-center">
                    <Text className="text-xs font-bold text-brand-navy">
                      Ngày dự sinh: {dueDate}
                    </Text>
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
                Mẹ ơi, con của mẹ đang phát triển rất tốt! Hãy duy trì chế độ dinh dưỡng và nghỉ
                ngơi hợp lý nhé.
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
                    <Text className="text-center text-xs font-bold text-[#5A8CFF]">
                      Xem lịch sử
                    </Text>
                  </TouchableOpacity>
                </View>
                <View className="w-px bg-brand-gray" />
                <View className="flex-1 pl-4">
                  <Text className="text-xs font-semibold text-brand-navy/60">
                    Chiều cao tử cung
                  </Text>
                  <Text className="text-sm font-bold text-brand-navy">24 cm</Text>
                  <MiniLineChart color="#FF4F7B" values={[20, 24, 29, 33, 40]} />
                  <TouchableOpacity onPress={() => router.push('/(maternal)/prenatal-visits')}>
                    <Text className="text-center text-xs font-bold text-[#5A8CFF]">
                      Xem lịch sử
                    </Text>
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
                  <Text className="mt-1 text-xs font-bold text-brand-pink-500">
                    {todayKickCount}
                  </Text>
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
        ) : activeSection === 'development' ? (
          <PregnancyDevelopmentTab currentWeek={currentWeek} weekDetail={weekDetail} />
        ) : (
          <PregnancyKnowledgeTabWithWeeks currentWeek={currentWeek} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
