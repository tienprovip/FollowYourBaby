import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Stack } from 'expo-router';
import { useActivePregnancy } from '@/hooks/usePregnancy';
import { usePregnancyMedications } from '@/hooks/usePregnancyMedications';
import type { MedicationSchedule } from '@/hooks/usePregnancyMedications';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import type { Database } from '@/types/database';
import type { Json } from '@/types/database';
import { toLocalDateStr } from '@/lib/dateUtils';

// ---------------------------------------------------------------------------
// Medications Screen
// ---------------------------------------------------------------------------

type MedRow = Database['public']['Tables']['pregnancy_medications']['Row'];

const TIMES_OPTIONS = [1, 2, 3, 4];

function scheduleLabel(schedule: Json): string {
  if (!schedule || typeof schedule !== 'object' || Array.isArray(schedule)) {
    return 'Hàng ngày';
  }
  const s = schedule as { timesPerDay?: number; frequency?: string; times?: string[] };
  const freq = s.frequency ?? 'hàng ngày';
  const times = s.timesPerDay ?? 1;
  if (s.times && Array.isArray(s.times) && s.times.length > 0) {
    return `${times}x/${freq} (${(s.times as string[]).join(', ')})`;
  }
  return `${times} lần/${freq}`;
}

function MedicationCard({
  med,
  onDelete,
}: {
  med: MedRow;
  onDelete: (id: string) => void;
}) {
  const isActive = !med.ended_at || med.ended_at >= toLocalDateStr(new Date());

  return (
    <Card padding="md" className="mb-3">
      <View className="flex-row items-start">
        <View className="flex-1">
          <View className="flex-row items-center gap-x-2 mb-1">
            <Text className="text-brand-navy font-semibold text-base">
              {med.name}
            </Text>
            {isActive ? (
              <Badge label="Đang dùng" variant="green" />
            ) : (
              <Badge label="Đã dừng" variant="neutral" />
            )}
          </View>
          {med.dosage && (
            <Text className="text-brand-navy/70 text-sm">{med.dosage}</Text>
          )}
          <Text className="text-brand-navy/60 text-xs mt-1">
            {scheduleLabel(med.schedule)}
          </Text>
          {med.started_at && (
            <Text className="text-brand-navy/50 text-xs mt-0.5">
              Bắt đầu: {med.started_at}
              {med.ended_at ? ` — Kết thúc: ${med.ended_at}` : ''}
            </Text>
          )}
        </View>
        <TouchableOpacity
          onPress={() => onDelete(med.id)}
          className="p-2"
          accessibilityLabel="Xoá thuốc này"
        >
          <Text className="text-red-400 text-sm">Xoá</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}

export default function MedicationsScreen() {
  const { pregnancy } = useActivePregnancy();
  const {
    activeMedications,
    medications,
    isLoading,
    addMedication,
    isAdding,
    deleteMedication,
  } = usePregnancyMedications(pregnancy?.id ?? null);

  const [showForm, setShowForm] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [dosageInput, setDosageInput] = useState('');
  const [timesPerDay, setTimesPerDay] = useState(1);
  const [timeInputs, setTimeInputs] = useState<string[]>(['08:00']);
  const [showStopped, setShowStopped] = useState(false);

  function updateTimeInput(index: number, value: string) {
    setTimeInputs((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  }

  function handleTimesChange(times: number) {
    setTimesPerDay(times);
    const defaults = ['07:00', '12:00', '19:00', '22:00'];
    setTimeInputs(defaults.slice(0, times));
  }

  async function handleAdd() {
    if (!nameInput.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên thuốc/vitamin.');
      return;
    }
    const schedule: MedicationSchedule = {
      timesPerDay,
      times: timeInputs,
      frequency: 'ngày',
    };
    try {
      await addMedication({
        name: nameInput.trim(),
        dosage: dosageInput.trim() || undefined,
        schedule,
        started_at: toLocalDateStr(new Date()),
      });
      setNameInput('');
      setDosageInput('');
      setTimesPerDay(1);
      setTimeInputs(['08:00']);
      setShowForm(false);
    } catch {
      Alert.alert('Lỗi', 'Không thể lưu thuốc. Vui lòng thử lại.');
    }
  }

  function handleDelete(id: string) {
    Alert.alert('Xoá thuốc', 'Bạn có chắc muốn xoá thuốc này?', [
      { text: 'Huỷ', style: 'cancel' },
      {
        text: 'Xoá',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteMedication(id);
          } catch {
            Alert.alert('Lỗi', 'Không thể xoá. Thử lại sau.');
          }
        },
      },
    ]);
  }

  const stoppedMedications = medications.filter(
    (m) => m.ended_at && m.ended_at < toLocalDateStr(new Date()),
  );

  return (
    <>
      <Stack.Screen options={{ title: 'Thuốc & Vitamin' }} />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      >
        {/* Add form */}
        {showForm ? (
          <Card padding="md" className="mb-4">
            <Text className="text-brand-navy font-semibold mb-3">
              Thêm thuốc / vitamin
            </Text>

            <Text className="text-brand-navy/70 text-xs mb-1">Tên thuốc *</Text>
            <TextInput
              value={nameInput}
              onChangeText={setNameInput}
              placeholder="Axit folic, Sắt, Canxi..."
              className="border border-brand-gray rounded-input px-4 py-3 text-brand-navy bg-white text-sm mb-3"
              placeholderTextColor="#1F2B5B60"
            />

            <Text className="text-brand-navy/70 text-xs mb-1">Liều dùng</Text>
            <TextInput
              value={dosageInput}
              onChangeText={setDosageInput}
              placeholder="Ví dụ: 400mcg, 1 viên"
              className="border border-brand-gray rounded-input px-4 py-3 text-brand-navy bg-white text-sm mb-3"
              placeholderTextColor="#1F2B5B60"
            />

            <Text className="text-brand-navy/70 text-xs mb-2">Số lần uống / ngày</Text>
            <View className="flex-row gap-x-2 mb-3">
              {TIMES_OPTIONS.map((n) => (
                <TouchableOpacity
                  key={n}
                  onPress={() => handleTimesChange(n)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: timesPerDay === n }}
                  className={`flex-1 rounded-input py-2 items-center border ${
                    timesPerDay === n
                      ? 'bg-brand-pink border-brand-pink'
                      : 'bg-white border-brand-gray'
                  }`}
                >
                  <Text
                    className={`text-sm font-bold ${
                      timesPerDay === n ? 'text-white' : 'text-brand-navy'
                    }`}
                  >
                    {n}x
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Time inputs */}
            <Text className="text-brand-navy/70 text-xs mb-2">Giờ uống</Text>
            <View className="flex-row flex-wrap gap-2 mb-3">
              {timeInputs.map((t, i) => (
                <TextInput
                  key={i}
                  value={t}
                  onChangeText={(v) => updateTimeInput(i, v)}
                  placeholder="HH:MM"
                  keyboardType="numbers-and-punctuation"
                  className="border border-brand-gray rounded-input px-3 py-2 text-brand-navy bg-white text-sm w-20"
                  placeholderTextColor="#1F2B5B60"
                  accessibilityLabel={`Giờ uống lần ${i + 1}`}
                />
              ))}
            </View>

            <View className="flex-row gap-x-3">
              <Button
                label="Lưu"
                variant="primary"
                size="md"
                className="flex-1"
                loading={isAdding}
                onPress={handleAdd}
              />
              <Button
                label="Huỷ"
                variant="secondary"
                size="md"
                className="flex-1"
                onPress={() => setShowForm(false)}
              />
            </View>
          </Card>
        ) : (
          <Button
            label="+ Thêm thuốc / vitamin"
            variant="primary"
            size="lg"
            className="mb-4"
            onPress={() => setShowForm(true)}
          />
        )}

        {/* Active medications */}
        <Text className="text-brand-navy font-semibold mb-2">Đang dùng</Text>
        {isLoading ? (
          <LoadingSpinner />
        ) : activeMedications.length === 0 ? (
          <Text className="text-brand-navy/60 text-sm mb-4">
            Chưa có thuốc nào đang dùng.
          </Text>
        ) : (
          activeMedications.map((m) => (
            <MedicationCard key={m.id} med={m} onDelete={handleDelete} />
          ))
        )}

        {/* Stopped medications toggle */}
        {stoppedMedications.length > 0 && (
          <>
            <TouchableOpacity
              onPress={() => setShowStopped((v) => !v)}
              className="py-2 mb-2"
              accessibilityRole="button"
            >
              <Text className="text-brand-navy/60 text-sm">
                {showStopped ? 'Ẩn' : 'Xem'} thuốc đã dừng (
                {stoppedMedications.length})
              </Text>
            </TouchableOpacity>
            {showStopped &&
              stoppedMedications.map((m) => (
                <MedicationCard key={m.id} med={m} onDelete={handleDelete} />
              ))}
          </>
        )}
      </ScrollView>
    </>
  );
}
