import React, { useCallback, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { format, addHours } from 'date-fns';
import { vi } from 'date-fns/locale';

import { useBabyStore } from '@/stores/babyStore';
import { useBabies } from '@/hooks/useBabies';
import { usePregnancies } from '@/hooks/usePregnancies';
import { usePrenatalVisits } from '@/hooks/usePrenatalVisits';
import { usePregnancyMedications } from '@/hooks/usePregnancyMedications';
import { useNotifications } from '@/hooks/useNotifications';
import {
  getVaccinationSchedule,
  type ScheduledVaccine,
} from '@/lib/vaccinationSchedule';
import {
  scheduleVaccinationReminder,
  schedulePrenatalVisitReminder,
} from '@/lib/notifications';
import {
  BottomSheet,
  Button,
  Card,
  EmptyState,
  LoadingSpinner,
} from '@/components/ui';

interface ReminderRowProps {
  icon: string;
  iconColor: string;
  title: string;
  subtitle: string;
  badgeLabel?: string;
  badgeColor?: string;
  enabled?: boolean;
  onToggle?: (val: boolean) => void;
  onPress?: () => void;
}

function ReminderRow({
  icon,
  iconColor,
  title,
  subtitle,
  badgeLabel,
  badgeColor = '#AEE6C8',
  enabled,
  onToggle,
  onPress,
}: ReminderRowProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center py-3 px-1 active:opacity-70"
      accessibilityRole={onPress ? 'button' : 'none'}
    >
      <View
        className="w-10 h-10 rounded-full items-center justify-center mr-3"
        style={{ backgroundColor: iconColor + '22' }}
      >
        <Text className="text-lg">{icon}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-brand-navy font-semibold text-sm">{title}</Text>
        <Text className="text-brand-navy/60 text-xs mt-0.5">{subtitle}</Text>
      </View>
      {!!badgeLabel && (
        <View
          className="rounded-full px-2 py-0.5 ml-2"
          style={{ backgroundColor: badgeColor }}
        >
          <Text className="text-xs font-semibold text-brand-navy/70">
            {badgeLabel}
          </Text>
        </View>
      )}
      {onToggle !== undefined && enabled !== undefined && (
        <Switch
          value={enabled}
          onValueChange={onToggle}
          trackColor={{ false: '#E5E7EB', true: '#FF8FA8' }}
          thumbColor="#fff"
          className="ml-2"
        />
      )}
    </Pressable>
  );
}

interface SectionHeaderProps {
  title: string;
}

function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <Text className="text-xs font-bold text-brand-navy/50 uppercase tracking-wider mb-2 mt-5 px-1">
      {title}
    </Text>
  );
}

export default function RemindersScreen() {
  const { activeBabyId, activePregnancyId } = useBabyStore();
  const { babies } = useBabies();
  const { pregnancies } = usePregnancies();

  const resolvedBabyId = activeBabyId ?? babies[0]?.id ?? null;
  const resolvedPregnancyId = activePregnancyId ?? pregnancies[0]?.id ?? null;

  const activeBaby = babies.find((b) => b.id === resolvedBabyId) ?? null;
  const activePregnancy =
    pregnancies.find((p) => p.id === resolvedPregnancyId) ?? null;

  const { upcomingVisits, isLoading: visitsLoading } = usePrenatalVisits(
    resolvedPregnancyId,
  );
  const { activeMedications, isLoading: medsLoading } =
    usePregnancyMedications(resolvedPregnancyId);

  const { prefs, scheduleReminder } = useNotifications();

  const [sheetVisible, setSheetVisible] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customHours, setCustomHours] = useState('2');
  const [schedulingId, setSchedulingId] = useState<string | null>(null);
  const [feedEnabled, setFeedEnabled] = useState(true);
  const [sleepEnabled, setSleepEnabled] = useState(true);

  const vaccinationSchedule = useMemo<ScheduledVaccine[]>(() => {
    if (!activeBaby?.dob) return [];
    return getVaccinationSchedule(new Date(activeBaby.dob));
  }, [activeBaby?.dob]);

  const upcomingVaccinations = vaccinationSchedule.filter(
    (v) => v.daysUntilDue >= 0 && v.daysUntilDue <= 60,
  );

  const sevenDayVisits = upcomingVisits.filter((v) => {
    const ms = new Date(v.scheduled_at).getTime() - Date.now();
    return ms > 0 && ms <= 7 * 24 * 60 * 60 * 1000;
  });

  const handleScheduleFeed = useCallback(async () => {
    if (!resolvedBabyId || !activeBaby) return;
    setSchedulingId('feed');
    await scheduleReminder({
      type: 'feed',
      babyId: resolvedBabyId,
      babyName: activeBaby.name,
      intervalHours: 3,
    });
    setSchedulingId(null);
  }, [resolvedBabyId, activeBaby, scheduleReminder]);

  const handleScheduleSleep = useCallback(async () => {
    if (!resolvedBabyId || !activeBaby) return;
    setSchedulingId('sleep');
    await scheduleReminder({
      type: 'sleep',
      babyId: resolvedBabyId,
      babyName: activeBaby.name,
    });
    setSchedulingId(null);
  }, [resolvedBabyId, activeBaby, scheduleReminder]);

  const handleScheduleVaccineReminder = useCallback(
    async (vaccine: ScheduledVaccine) => {
      if (!resolvedBabyId || !activeBaby) return;
      setSchedulingId(vaccine.id);
      await scheduleVaccinationReminder(
        resolvedBabyId,
        activeBaby.name,
        vaccine.name,
        vaccine.dueDate,
        { quietHours: prefs.quietHours },
      );
      setSchedulingId(null);
    },
    [resolvedBabyId, activeBaby, prefs.quietHours],
  );

  const handleScheduleVisitReminder = useCallback(
    async (visitId: string, type: string, scheduledAt: string) => {
      if (!resolvedPregnancyId) return;
      setSchedulingId(visitId);
      await schedulePrenatalVisitReminder(
        resolvedPregnancyId,
        type,
        new Date(scheduledAt),
        { quietHours: prefs.quietHours },
      );
      setSchedulingId(null);
    },
    [resolvedPregnancyId, prefs.quietHours],
  );

  const handleAddCustomReminder = useCallback(async () => {
    const hours = Number.parseFloat(customHours);
    if (!customTitle.trim() || Number.isNaN(hours) || hours <= 0) return;

    await scheduleReminder({
      type: 'medication',
      medicationName: customTitle.trim(),
      scheduledTime: addHours(new Date(), hours),
    });

    setCustomTitle('');
    setCustomHours('2');
    setSheetVisible(false);
  }, [customTitle, customHours, scheduleReminder]);

  const isLoading = visitsLoading || medsLoading;

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-brand-peach" edges={['top']}>
        <LoadingSpinner className="flex-1" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-brand-peach" edges={['top']}>
      <View className="px-4 pt-5 pb-3 flex-row items-center justify-between">
        <Text className="text-brand-navy text-2xl font-bold">Nhắc nhở</Text>
        <Ionicons name="notifications-outline" size={24} color="#1F2B5B" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}
      >
        {activeBaby && (
          <>
            <SectionHeader title="Nhắc bé" />
            <Card>
              <ReminderRow
                icon="🍼"
                iconColor="#FF8FA8"
                title="Nhắc bú (sau 3 giờ)"
                subtitle={
                  feedEnabled
                    ? 'Bật — sẽ nhắc sau 3 giờ kể từ lần bú cuối'
                    : 'Tắt'
                }
                enabled={feedEnabled}
                onToggle={setFeedEnabled}
                onPress={feedEnabled ? handleScheduleFeed : undefined}
              />
              <View className="h-px bg-brand-gray mx-1" />
              <ReminderRow
                icon="😴"
                iconColor="#A9D6FF"
                title="Kiểm tra khi bé ngủ"
                subtitle={
                  sleepEnabled
                    ? 'Bật — nhắc sau 2 giờ ngủ để kiểm tra tã'
                    : 'Tắt'
                }
                enabled={sleepEnabled}
                onToggle={setSleepEnabled}
                onPress={sleepEnabled ? handleScheduleSleep : undefined}
              />
            </Card>
          </>
        )}

        {upcomingVaccinations.length > 0 && (
          <>
            <SectionHeader title="Tiêm phòng sắp tới" />
            <Card>
              {upcomingVaccinations.map((v, idx) => (
                <View key={v.id}>
                  {idx > 0 && <View className="h-px bg-brand-gray mx-1" />}
                  <ReminderRow
                    icon="💉"
                    iconColor="#AEE6C8"
                    title={v.name}
                    subtitle={format(v.dueDate, 'dd/MM/yyyy', { locale: vi })}
                    badgeLabel={
                      v.daysUntilDue === 0
                        ? 'Hôm nay'
                        : v.daysUntilDue === 1
                          ? 'Ngày mai'
                          : `${v.daysUntilDue} ngày`
                    }
                    badgeColor={
                      v.daysUntilDue <= 3 ? '#FFD6D6' : '#AEE6C8'
                    }
                    onPress={() => handleScheduleVaccineReminder(v)}
                  />
                  {schedulingId === v.id && (
                    <Text className="text-xs text-brand-mint px-1 pb-2">
                      Đã lên lịch nhắc nhở!
                    </Text>
                  )}
                </View>
              ))}
            </Card>
          </>
        )}

        {sevenDayVisits.length > 0 && (
          <>
            <SectionHeader title="Khám thai sắp tới (7 ngày)" />
            <Card>
              {sevenDayVisits.map((visit, idx) => (
                <View key={visit.id}>
                  {idx > 0 && <View className="h-px bg-brand-gray mx-1" />}
                  <ReminderRow
                    icon="🏥"
                    iconColor="#B79CFF"
                    title={visit.type ?? 'Khám thai'}
                    subtitle={format(
                      new Date(visit.scheduled_at),
                      "dd/MM/yyyy 'lúc' HH:mm",
                      { locale: vi },
                    )}
                    onPress={() =>
                      handleScheduleVisitReminder(
                        visit.id,
                        visit.type ?? 'Khám thai',
                        visit.scheduled_at,
                      )
                    }
                  />
                  {schedulingId === visit.id && (
                    <Text className="text-xs text-brand-lavender px-1 pb-2">
                      Đã lên lịch nhắc nhở!
                    </Text>
                  )}
                </View>
              ))}
            </Card>
          </>
        )}

        {activeMedications.length > 0 && (
          <>
            <SectionHeader title="Nhắc thuốc" />
            <Card>
              {activeMedications.map((med, idx) => (
                <View key={med.id}>
                  {idx > 0 && <View className="h-px bg-brand-gray mx-1" />}
                  <ReminderRow
                    icon="💊"
                    iconColor="#B79CFF"
                    title={med.name}
                    subtitle={med.dosage ?? 'Uống theo chỉ dẫn'}
                  />
                </View>
              ))}
            </Card>
          </>
        )}

        {!activeBaby &&
          !activePregnancy &&
          sevenDayVisits.length === 0 &&
          upcomingVaccinations.length === 0 && (
            <EmptyState
              title="Chưa có nhắc nhở"
              body="Thêm hồ sơ bé hoặc thai kỳ để xem lịch nhắc nhở."
            />
          )}
      </ScrollView>

      <Pressable
        onPress={() => setSheetVisible(true)}
        className="absolute bottom-8 right-6 w-14 h-14 rounded-full bg-brand-pink shadow-brand-lg items-center justify-center active:opacity-80"
        accessibilityRole="button"
        accessibilityLabel="Thêm nhắc nhở"
      >
        <Ionicons name="add" size={28} color="#fff" />
      </Pressable>

      <BottomSheet
        visible={sheetVisible}
        onDismiss={() => setSheetVisible(false)}
        heightFraction={0.45}
        accessibilityLabel="Thêm nhắc nhở tùy chỉnh"
      >
        <View className="px-5 pt-2 pb-6 flex-1">
          <Text className="text-brand-navy font-bold text-base mb-4">
            Thêm nhắc nhở
          </Text>
          <View className="bg-brand-gray rounded-input px-4 py-3 mb-3">
            <Text className="text-xs text-brand-navy/50 mb-1">Tiêu đề</Text>
            <TextInput
              value={customTitle}
              onChangeText={setCustomTitle}
              placeholder="Ví dụ: Uống sắt, Kiểm tra sốt..."
              placeholderTextColor="#1F2B5B66"
              className="text-sm text-brand-navy"
              returnKeyType="next"
            />
          </View>
          <View className="bg-brand-gray rounded-input px-4 py-3 mb-4">
            <Text className="text-xs text-brand-navy/50 mb-1">
              Nhắc sau bao nhiêu giờ
            </Text>
            <TextInput
              value={customHours}
              onChangeText={setCustomHours}
              keyboardType="decimal-pad"
              placeholder="2"
              placeholderTextColor="#1F2B5B66"
              className="text-sm text-brand-navy"
            />
          </View>
          <Button
            label="Lưu nhắc nhở"
            variant="primary"
            onPress={handleAddCustomReminder}
            disabled={!customTitle.trim()}
          />
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
}
