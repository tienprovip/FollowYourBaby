import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Stack } from 'expo-router';
import { useActivePregnancy } from '@/hooks/usePregnancy';
import {
  usePregnancySymptoms,
  SYMPTOM_CATALOGUE,
  evaluateSymptomRisk,
  getSymptomInfo,
  RED_SYMPTOMS,
} from '@/hooks/usePregnancySymptoms';
import SymptomChip from '@/components/maternal/SymptomChip';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import RiskBadge from '@/components/ui/RiskBadge';
import AIDisclaimer from '@/components/ui/AIDisclaimer';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { format, parseISO } from 'date-fns';

// ---------------------------------------------------------------------------
// Symptoms Screen
// ---------------------------------------------------------------------------

interface SelectedSymptom {
  key: string;
  severity: number;
}

export default function SymptomsScreen() {
  const { pregnancy } = useActivePregnancy();
  const {
    symptoms,
    todaySymptoms,
    todayMaxRisk,
    isLoading,
    addSymptom,
    isAdding,
    deleteSymptom,
  } = usePregnancySymptoms(pregnancy?.id ?? null);

  const [showForm, setShowForm] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState<SelectedSymptom[]>([]);

  function toggleSymptom(key: string) {
    setSelectedSymptoms((prev) => {
      const exists = prev.find((s) => s.key === key);
      if (exists) {
        return prev.filter((s) => s.key !== key);
      }
      return [...prev, { key, severity: 2 }];
    });
  }

  function setSeverity(key: string, severity: number) {
    setSelectedSymptoms((prev) =>
      prev.map((s) => (s.key === key ? { ...s, severity } : s)),
    );
  }

  function getSelected(key: string): SelectedSymptom | undefined {
    return selectedSymptoms.find((s) => s.key === key);
  }

  async function handleSave() {
    if (selectedSymptoms.length === 0) {
      Alert.alert('Chưa chọn', 'Hãy chọn ít nhất một triệu chứng.');
      return;
    }

    // Check if any red-risk symptom is selected
    const hasRedSymptom = selectedSymptoms.some(
      (s) => evaluateSymptomRisk(s.key, s.severity) === 'red',
    );

    try {
      await Promise.all(
        selectedSymptoms.map((s) =>
          addSymptom({
            symptom_key: s.key,
            severity: s.severity,
            recorded_at: new Date().toISOString(),
          }),
        ),
      );
      setSelectedSymptoms([]);
      setShowForm(false);

      if (hasRedSymptom) {
        Alert.alert(
          'Cảnh báo nghiêm trọng',
          'Bạn có triệu chứng cần được chú ý ngay. Hãy đến cơ sở y tế hoặc liên hệ bác sĩ ngay lập tức.',
          [{ text: 'Đã hiểu' }],
        );
      }
    } catch {
      Alert.alert('Lỗi', 'Không thể lưu triệu chứng. Vui lòng thử lại.');
    }
  }

  function handleDelete(id: string) {
    Alert.alert('Xoá triệu chứng', 'Bạn có chắc muốn xoá mục này?', [
      { text: 'Huỷ', style: 'cancel' },
      {
        text: 'Xoá',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteSymptom(id);
          } catch {
            Alert.alert('Lỗi', 'Không thể xoá. Thử lại sau.');
          }
        },
      },
    ]);
  }

  // Group symptoms by date
  const groupedSymptoms = symptoms.reduce<Record<string, typeof symptoms>>((acc, s) => {
    const dateKey = format(parseISO(s.recorded_at), 'yyyy-MM-dd');
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(s);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedSymptoms).sort().reverse();

  return (
    <>
      <Stack.Screen options={{ title: 'Triệu chứng' }} />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      >
        {/* Today summary */}
        {todaySymptoms.length > 0 && (
          <Card padding="md" className="mb-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-brand-navy font-semibold">Hôm nay</Text>
              <RiskBadge risk_level={todayMaxRisk} />
            </View>
            {todayMaxRisk === 'red' && (
              <Text className="text-red-600 text-sm mb-2">
                Hãy đến cơ sở y tế nếu bạn có triệu chứng bất thường nghiêm trọng.
              </Text>
            )}
            <View className="flex-row flex-wrap gap-2">
              {todaySymptoms.map((s) => {
                const info = getSymptomInfo(s.symptom_key);
                const risk = evaluateSymptomRisk(s.symptom_key, s.severity ?? 1);
                return (
                  <View
                    key={s.id}
                    className={`rounded-full px-3 py-1 ${
                      risk === 'red'
                        ? 'bg-red-100'
                        : risk === 'yellow'
                        ? 'bg-amber-100'
                        : 'bg-brand-mint/20'
                    }`}
                  >
                    <Text
                      className={`text-xs font-medium ${
                        risk === 'red'
                          ? 'text-red-700'
                          : risk === 'yellow'
                          ? 'text-amber-700'
                          : 'text-[#1A7A4A]'
                      }`}
                    >
                      {info?.label ?? s.symptom_key} ({s.severity ?? 1}/5)
                    </Text>
                  </View>
                );
              })}
            </View>
            {todayMaxRisk !== 'green' && <AIDisclaimer className="mt-3" />}
          </Card>
        )}

        {/* Add form */}
        {showForm ? (
          <Card padding="md" className="mb-4">
            <Text className="text-brand-navy font-semibold mb-1">
              Chọn triệu chứng hôm nay
            </Text>
            <Text className="text-brand-navy/60 text-xs mb-3">
              Nhấn để chọn, kéo thanh trượt để điều chỉnh mức độ
            </Text>

            {SYMPTOM_CATALOGUE.map((symptom) => {
              const sel = getSelected(symptom.key);
              return (
                <SymptomChip
                  key={symptom.key}
                  symptom={symptom}
                  selected={Boolean(sel)}
                  severity={sel?.severity ?? 2}
                  onPress={() => toggleSymptom(symptom.key)}
                  onSeverityChange={(v) => setSeverity(symptom.key, v)}
                />
              );
            })}

            {/* Red symptom warning */}
            {selectedSymptoms.some((s) => RED_SYMPTOMS.has(s.key)) && (
              <View className="bg-red-50 border border-red-200 rounded-input px-3 py-2 mb-3">
                <Text className="text-red-700 text-sm font-medium">
                  Cảnh báo: Triệu chứng bạn chọn có thể cần đến gặp bác sĩ ngay.
                </Text>
              </View>
            )}

            <View className="flex-row gap-x-3 mt-2">
              <Button
                label={`Lưu (${selectedSymptoms.length})`}
                variant="primary"
                size="md"
                className="flex-1"
                loading={isAdding}
                disabled={selectedSymptoms.length === 0}
                onPress={handleSave}
              />
              <Button
                label="Huỷ"
                variant="secondary"
                size="md"
                className="flex-1"
                onPress={() => {
                  setShowForm(false);
                  setSelectedSymptoms([]);
                }}
              />
            </View>
          </Card>
        ) : (
          <Button
            label="+ Thêm triệu chứng"
            variant="primary"
            size="lg"
            className="mb-4"
            onPress={() => setShowForm(true)}
          />
        )}

        {/* History grouped by day */}
        <Text className="text-brand-navy font-semibold mb-2">Lịch sử</Text>
        {isLoading ? (
          <LoadingSpinner />
        ) : sortedDates.length === 0 ? (
          <Text className="text-brand-navy/60 text-sm text-center py-4">
            Chưa có triệu chứng nào được ghi nhận.
          </Text>
        ) : (
          sortedDates.map((dateKey) => (
            <View key={dateKey} className="mb-4">
              <Text className="text-brand-navy/60 text-xs font-semibold mb-2 uppercase">
                {format(new Date(dateKey + 'T00:00:00'), 'EEEE, dd/MM/yyyy')}
              </Text>
              {groupedSymptoms[dateKey].map((s) => {
                const info = getSymptomInfo(s.symptom_key);
                const risk = evaluateSymptomRisk(s.symptom_key, s.severity ?? 1);
                return (
                  <Card key={s.id} padding="sm" className="mb-2">
                    <View className="flex-row items-center">
                      <View className="flex-1">
                        <View className="flex-row items-center gap-x-2">
                          <Text className="text-brand-navy font-medium">
                            {info?.label ?? s.symptom_key}
                          </Text>
                          {risk !== 'green' && (
                            <RiskBadge risk_level={risk} />
                          )}
                        </View>
                        <Text className="text-brand-navy/60 text-xs mt-0.5">
                          Mức độ: {s.severity ?? 1}/5 —{' '}
                          {format(parseISO(s.recorded_at), 'HH:mm')}
                        </Text>
                        {s.note && (
                          <Text className="text-brand-navy/60 text-xs mt-1">
                            {s.note}
                          </Text>
                        )}
                      </View>
                      <TouchableOpacity
                        onPress={() => handleDelete(s.id)}
                        className="p-2"
                        accessibilityLabel="Xoá mục này"
                      >
                        <Text className="text-red-400 text-sm">Xoá</Text>
                      </TouchableOpacity>
                    </View>
                  </Card>
                );
              })}
            </View>
          ))
        )}
      </ScrollView>
    </>
  );
}
