import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';
import {
  loadNotificationPrefs,
  saveNotificationPrefs,
  type NotificationPrefs,
} from '@/hooks/useNotifications';
import { Button, Card } from '@/components/ui';

const CATEGORY_LABELS: Record<
  keyof NotificationPrefs['categories'],
  { label: string; icon: string }
> = {
  feed: { label: 'Nhắc bú / ăn', icon: '🍼' },
  sleep: { label: 'Nhắc giấc ngủ', icon: '😴' },
  medication: { label: 'Nhắc thuốc', icon: '💊' },
  prenatal: { label: 'Lịch khám thai', icon: '🏥' },
  vaccination: { label: 'Lịch tiêm phòng', icon: '💉' },
  insight: { label: 'Gợi ý AI', icon: '🤖' },
};

function parseTimeToDate(timeStr: string): Date {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const d = new Date();
  d.setHours(hours, minutes, 0, 0);
  return d;
}

function formatDateToTime(date: Date): string {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

interface TimeRowProps {
  label: string;
  value: string;
  onPress: () => void;
}

function TimeRow({ label, value, onPress }: TimeRowProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between py-3 px-1"
      accessibilityRole="button"
    >
      <Text className="text-sm text-brand-navy">{label}</Text>
      <View className="flex-row items-center gap-1">
        <Text className="text-sm font-semibold text-brand-pink">{value}</Text>
        <Ionicons name="chevron-forward" size={14} color="#FF8FA8" />
      </View>
    </TouchableOpacity>
  );
}

export default function NotificationSettingsScreen() {
  const [prefs, setPrefs] = useState<NotificationPrefs | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showPicker, setShowPicker] = useState<'start' | 'end' | null>(null);
  const [pickerDate, setPickerDate] = useState<Date>(new Date());

  useEffect(() => {
    loadNotificationPrefs().then(setPrefs);
  }, []);

  if (!prefs) {
    return (
      <View className="flex-1 bg-brand-peach items-center justify-center">
        <Text className="text-brand-navy/50">Đang tải...</Text>
      </View>
    );
  }

  const quietHours = prefs.quietHours ?? { start: '22:00', end: '06:00' };

  async function handleSave() {
    if (!prefs) return;
    setIsSaving(true);
    try {
      await saveNotificationPrefs(prefs);
      Alert.alert('Đã lưu', 'Cài đặt thông báo đã được cập nhật.');
    } catch {
      Alert.alert('Lỗi', 'Không thể lưu cài đặt. Vui lòng thử lại.');
    } finally {
      setIsSaving(false);
    }
  }

  function toggleCategory(key: keyof NotificationPrefs['categories']) {
    if (!prefs) return;
    setPrefs({
      ...prefs,
      categories: {
        ...prefs.categories,
        [key]: !prefs.categories[key],
      },
    });
  }

  function toggleQuietHours(enabled: boolean) {
    if (!prefs) return;
    setPrefs({
      ...prefs,
      quietHours: enabled ? { start: '22:00', end: '06:00' } : null,
    });
  }

  function openTimePicker(which: 'start' | 'end') {
    const current = which === 'start' ? quietHours.start : quietHours.end;
    setPickerDate(parseTimeToDate(current));
    setShowPicker(which);
  }

  function handleTimeChange(
    event: DateTimePickerEvent,
    selected: Date | undefined,
  ) {
    if (Platform.OS === 'android') {
      setShowPicker(null);
    }
    if (event.type === 'dismissed' || !selected) {
      setShowPicker(null);
      return;
    }

    const timeStr = formatDateToTime(selected);

    if (!prefs) return;
    setPrefs({
      ...prefs,
      quietHours: {
        ...quietHours,
        [showPicker === 'start' ? 'start' : 'end']: timeStr,
      },
    });

    if (Platform.OS === 'ios') {
      setPickerDate(selected);
    }
  }

  function confirmIosPicker() {
    setShowPicker(null);
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Cài đặt thông báo' }} />
      <ScrollView
        className="flex-1 bg-brand-peach"
        contentContainerStyle={{ padding: 20, paddingBottom: 48 }}
      >
        <Text className="text-xs font-bold text-brand-navy/50 uppercase tracking-wider mb-2">
          Giờ im lặng
        </Text>
        <Card className="mb-4">
          <View className="flex-row items-center justify-between py-2 px-1">
            <View className="flex-1 mr-3">
              <Text className="text-sm font-semibold text-brand-navy">
                Bật giờ im lặng
              </Text>
              <Text className="text-xs text-brand-navy/50 mt-0.5">
                Không nhắc nhở (trừ cảnh báo đỏ) trong khoảng giờ này
              </Text>
            </View>
            <Switch
              value={prefs.quietHours !== null}
              onValueChange={toggleQuietHours}
              trackColor={{ false: '#E5E7EB', true: '#FF8FA8' }}
              thumbColor="#fff"
            />
          </View>

          {prefs.quietHours !== null && (
            <>
              <View className="h-px bg-brand-gray mx-1" />
              <TimeRow
                label="Bắt đầu im lặng"
                value={quietHours.start}
                onPress={() => openTimePicker('start')}
              />
              <View className="h-px bg-brand-gray mx-1" />
              <TimeRow
                label="Kết thúc im lặng"
                value={quietHours.end}
                onPress={() => openTimePicker('end')}
              />
            </>
          )}
        </Card>

        <Text className="text-xs font-bold text-brand-navy/50 uppercase tracking-wider mb-2 mt-2">
          Loại thông báo
        </Text>
        <Card className="mb-6">
          {(
            Object.keys(CATEGORY_LABELS) as Array<
              keyof NotificationPrefs['categories']
            >
          ).map((key, idx, arr) => (
            <View key={key}>
              {idx > 0 && <View className="h-px bg-brand-gray mx-1" />}
              <View className="flex-row items-center justify-between py-3 px-1">
                <View className="flex-row items-center flex-1 mr-3">
                  <Text className="text-lg mr-2">
                    {CATEGORY_LABELS[key].icon}
                  </Text>
                  <Text className="text-sm text-brand-navy">
                    {CATEGORY_LABELS[key].label}
                  </Text>
                </View>
                <Switch
                  value={prefs.categories[key]}
                  onValueChange={() => toggleCategory(key)}
                  trackColor={{ false: '#E5E7EB', true: '#FF8FA8' }}
                  thumbColor="#fff"
                />
              </View>
              {idx === arr.length - 1 && null}
            </View>
          ))}
        </Card>

        <Button
          label={isSaving ? 'Đang lưu...' : 'Lưu cài đặt'}
          variant="primary"
          size="lg"
          loading={isSaving}
          onPress={handleSave}
        />

        {showPicker !== null && (
          <>
            <DateTimePicker
              value={pickerDate}
              mode="time"
              is24Hour
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleTimeChange}
              themeVariant="light"
            />
            {Platform.OS === 'ios' && (
              <View className="mt-3">
                <Button
                  label="Xong"
                  variant="secondary"
                  size="sm"
                  onPress={confirmIosPicker}
                />
              </View>
            )}
          </>
        )}
      </ScrollView>
    </>
  );
}
