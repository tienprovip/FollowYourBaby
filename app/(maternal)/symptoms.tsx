import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { format, parseISO } from 'date-fns';
import { useActivePregnancy } from '@/hooks/usePregnancy';
import {
  usePregnancySymptoms,
  SYMPTOM_CATALOGUE,
  evaluateSymptomRisk,
  getSymptomInfo,
  RED_SYMPTOMS,
} from '@/hooks/usePregnancySymptoms';
import { usePregnancyVitals } from '@/hooks/usePregnancyVitals';
import SymptomChip from '@/components/maternal/SymptomChip';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import DateField from '@/components/ui/DateField';
import RiskBadge from '@/components/ui/RiskBadge';
import AIDisclaimer from '@/components/ui/AIDisclaimer';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import { inputStyles } from '@/lib/inputStyles';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Tab = 'symptoms' | 'blood_pressure' | 'blood_sugar' | 'heart_rate';

interface SelectedSymptom {
  key: string;
  severity: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function bpStatus(systolic: number, diastolic: number): { label: string; color: string } {
  if (systolic > 180 || diastolic > 120) return { label: 'Rất cao', color: '#dc2626' };
  if (systolic >= 140 || diastolic >= 90) return { label: 'Huyết áp cao', color: '#ea580c' };
  if (systolic >= 130 || diastolic >= 80) return { label: 'Cao nhẹ', color: '#d97706' };
  if (systolic >= 120 && diastolic < 80) return { label: 'Ngưỡng cao', color: '#ca8a04' };
  return { label: 'Bình thường', color: '#16a34a' };
}

function bsStatus(mmolL: number): { label: string; color: string } {
  if (mmolL >= 7) return { label: 'Cao — cần khám', color: '#dc2626' };
  if (mmolL >= 5.6) return { label: 'Ngưỡng cao', color: '#d97706' };
  if (mmolL < 3.9) return { label: 'Thấp', color: '#2563eb' };
  return { label: 'Bình thường', color: '#16a34a' };
}

function bloodSugarAsMmolL(value: number, unit?: string | null): number {
  if (unit === 'mg/dL') return value / 18.0182;
  return value;
}

function formatBloodSugar(value: number): string {
  return value.toFixed(1).replace(/\.0$/, '');
}

function hrStatus(bpm: number): { label: string; color: string } {
  if (bpm > 110) return { label: 'Nhanh', color: '#ea580c' };
  if (bpm < 55) return { label: 'Chậm', color: '#2563eb' };
  return { label: 'Bình thường', color: '#16a34a' };
}

// ---------------------------------------------------------------------------
// Tab bar
// ---------------------------------------------------------------------------

const TABS: { key: Tab; label: string; helper: string; icon: string }[] = [
  { key: 'symptoms', label: 'Triệu chứng', helper: 'Cảm giác', icon: 'TC' },
  { key: 'blood_pressure', label: 'Huyết áp', helper: 'mmHg', icon: 'HA' },
  { key: 'blood_sugar', label: 'Đường huyết', helper: 'mmol/L', icon: 'ĐH' },
  { key: 'heart_rate', label: 'Nhịp tim', helper: 'bpm', icon: 'NT' },
];

function TabBar({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 12, gap: 10 }}
    >
      {TABS.map((t) => (
        <TouchableOpacity
          key={t.key}
          onPress={() => onChange(t.key)}
          accessibilityRole="button"
          accessibilityState={{ selected: active === t.key }}
          style={[styles.tabItem, active === t.key ? styles.tabItemActive : styles.tabItemIdle]}
        >
          <View style={styles.tabContent}>
            <View
              style={[styles.tabIcon, active === t.key ? styles.tabIconActive : styles.tabIconIdle]}
            >
              <Text
                style={[
                  styles.tabIconText,
                  active === t.key ? styles.tabIconTextActive : styles.tabIconTextIdle,
                ]}
              >
                {t.icon}
              </Text>
            </View>
            <View style={styles.tabLabelWrap}>
              <Text
                style={[
                  styles.tabLabel,
                  active === t.key ? styles.tabLabelActive : styles.tabLabelIdle,
                ]}
              >
                {t.label}
              </Text>
              <Text style={styles.tabHelper}>{t.helper}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    minWidth: 116,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  tabItemActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FF8FA8',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 3,
  },
  tabItemIdle: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderColor: '#FFFFFF',
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
  },
  tabIcon: {
    height: 32,
    width: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconActive: {
    backgroundColor: '#FF8FA8',
  },
  tabIconIdle: {
    backgroundColor: '#F7F7F7',
  },
  tabIconText: {
    fontSize: 10,
    fontWeight: '700',
  },
  tabIconTextActive: {
    color: '#FFFFFF',
  },
  tabIconTextIdle: {
    color: 'rgba(31,43,91,0.5)',
  },
  tabLabelWrap: {
    flex: 1,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  tabLabelActive: {
    color: '#1F2B5B',
  },
  tabLabelIdle: {
    color: 'rgba(31,43,91,0.7)',
  },
  tabHelper: {
    color: 'rgba(31,43,91,0.45)',
    fontSize: 11,
  },
});

function StatusPill({ label, color }: { label: string; color: string }) {
  return (
    <View
      style={{
        backgroundColor: `${color}20`,
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 4,
      }}
    >
      <Text style={{ color, fontSize: 12, fontWeight: '700' }}>{label}</Text>
    </View>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View className="mb-3">
      <Text className="text-brand-navy text-lg font-bold">{title}</Text>
      {subtitle && <Text className="text-brand-navy/55 text-xs mt-0.5">{subtitle}</Text>}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Vital tab — blood pressure
// ---------------------------------------------------------------------------

function BloodPressureTab({ pregnancyId }: { pregnancyId: string }) {
  const { vitals, isLoading, addVital, isAdding, deleteVital } = usePregnancyVitals(
    pregnancyId,
    'blood_pressure',
  );

  const [showForm, setShowForm] = useState(false);
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [recordedDate, setRecordedDate] = useState(new Date());

  async function handleAdd() {
    const s = parseFloat(systolic);
    const d = parseFloat(diastolic);
    if (isNaN(s) || s < 60 || s > 250) {
      Alert.alert('Lỗi', 'Huyết áp tâm thu không hợp lệ (60–250 mmHg)');
      return;
    }
    if (isNaN(d) || d < 40 || d > 150) {
      Alert.alert('Lỗi', 'Huyết áp tâm trương không hợp lệ (40–150 mmHg)');
      return;
    }
    try {
      await addVital({
        value1: s,
        value2: d,
        unit: 'mmHg',
        recorded_at: recordedDate.toISOString(),
      });
      setSystolic('');
      setDiastolic('');
      setRecordedDate(new Date());
      setShowForm(false);
    } catch {
      Alert.alert('Lỗi', 'Không thể lưu. Vui lòng thử lại.');
    }
  }

  function handleDelete(id: string) {
    Alert.alert('Xoá', 'Bạn có chắc muốn xoá mục này?', [
      { text: 'Huỷ', style: 'cancel' },
      {
        text: 'Xoá',
        style: 'destructive',
        onPress: () => deleteVital(id).catch(() => Alert.alert('Lỗi', 'Không thể xoá.')),
      },
    ]);
  }

  return (
    <View>
      {/* Latest */}
      {vitals.length > 0 &&
        (() => {
          const latest = vitals[0];
          const st = bpStatus(latest.value1, latest.value2 ?? 0);
          return (
            <Card padding="md" className="mb-4 border-brand-pink-100">
              <View className="flex-row items-start justify-between mb-3">
                <View>
                  <Text className="text-xs font-semibold uppercase text-brand-pink-600">
                    Chỉ số mới nhất
                  </Text>
                  <Text className="text-brand-navy/55 text-xs mt-0.5">
                    {format(parseISO(latest.recorded_at), 'HH:mm, dd/MM/yyyy')}
                  </Text>
                </View>
                <StatusPill label={st.label} color={st.color} />
              </View>
              <View className="flex-row items-end gap-x-2">
                <Text className="text-4xl font-bold text-brand-navy">{latest.value1}</Text>
                <Text className="text-2xl font-bold text-brand-navy/50 mb-1">
                  / {latest.value2}
                </Text>
                <Text className="text-sm text-brand-navy/60 mb-1.5">mmHg</Text>
              </View>
              <Text className="text-brand-navy/55 text-xs mt-3 leading-5">
                Theo dõi huyết áp đều đặn, đặc biệt khi có đau đầu, hoa mắt hoặc phù nhiều.
              </Text>
              {(latest.value1 >= 140 || (latest.value2 ?? 0) >= 90) && (
                <View className="mt-3">
                  <AIDisclaimer />
                </View>
              )}
            </Card>
          );
        })()}

      {/* Form */}
      {showForm ? (
        <Card padding="md" className="mb-4">
          <SectionTitle
            title="Thêm huyết áp"
            subtitle="Nhập tâm thu và tâm trương theo máy đo tại nhà hoặc phòng khám."
          />
          <View className="flex-row items-center gap-x-3 mb-3">
            <View className="flex-1">
              <Text className="text-xs text-brand-navy/60 mb-1">Tâm thu</Text>
              <TextInput
                value={systolic}
                onChangeText={setSystolic}
                placeholder="120"
                keyboardType="number-pad"
                className="border border-brand-gray rounded-input px-4 py-3 text-brand-navy bg-white text-base"
                placeholderTextColor="#1F2B5B60"
                style={inputStyles.field}
              />
            </View>
            <Text className="text-brand-navy/40 text-2xl mt-4">/</Text>
            <View className="flex-1">
              <Text className="text-xs text-brand-navy/60 mb-1">Tâm trương</Text>
              <TextInput
                value={diastolic}
                onChangeText={setDiastolic}
                placeholder="80"
                keyboardType="number-pad"
                className="border border-brand-gray rounded-input px-4 py-3 text-brand-navy bg-white text-base"
                placeholderTextColor="#1F2B5B60"
                style={inputStyles.field}
              />
            </View>
          </View>
          <DateField
            value={recordedDate}
            onChange={setRecordedDate}
            label="Ngày ghi"
            maximumDate={new Date()}
            className="mb-3"
          />
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
          label="Thêm huyết áp"
          variant="primary"
          size="lg"
          className="mb-5"
          onPress={() => {
            setRecordedDate(new Date());
            setShowForm(true);
          }}
        />
      )}

      {/* History */}
      <SectionTitle
        title="Lịch sử"
        subtitle={vitals.length > 0 ? `${vitals.length} lần ghi gần đây` : undefined}
      />
      {isLoading ? (
        <LoadingSpinner />
      ) : vitals.length === 0 ? (
        <EmptyState
          title="Chưa có dữ liệu huyết áp"
          body="Ghi chỉ số đầu tiên để theo dõi xu hướng trong thai kỳ."
          cta={{ label: 'Thêm huyết áp', onPress: () => setShowForm(true) }}
          className="bg-white rounded-card border border-brand-gray"
        />
      ) : (
        vitals.map((v) => {
          const st = bpStatus(v.value1, v.value2 ?? 0);
          return (
            <Card key={v.id} padding="sm" className="mb-2">
              <View className="flex-row items-center">
                <View className="flex-1">
                  <View className="flex-row items-center gap-x-2">
                    <Text className="text-brand-navy font-bold text-lg">
                      {v.value1}/{v.value2} mmHg
                    </Text>
                    <StatusPill label={st.label} color={st.color} />
                  </View>
                  <Text className="text-brand-navy/50 text-xs mt-1">
                    {format(parseISO(v.recorded_at), 'HH:mm, dd/MM/yyyy')}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => handleDelete(v.id)} className="p-2">
                  <Text className="text-red-400 text-sm">Xoá</Text>
                </TouchableOpacity>
              </View>
            </Card>
          );
        })
      )}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Vital tab — blood sugar
// ---------------------------------------------------------------------------

function BloodSugarTab({ pregnancyId }: { pregnancyId: string }) {
  const { vitals, isLoading, addVital, isAdding, deleteVital } = usePregnancyVitals(
    pregnancyId,
    'blood_sugar',
  );

  const [showForm, setShowForm] = useState(false);
  const [value, setValue] = useState('');
  const [recordedDate, setRecordedDate] = useState(new Date());

  async function handleAdd() {
    const v = parseFloat(value.replace(',', '.'));
    if (isNaN(v) || v < 1.7 || v > 33.3) {
      Alert.alert('Lỗi', 'Đường huyết không hợp lệ (1.7–33.3 mmol/L)');
      return;
    }
    try {
      await addVital({ value1: v, unit: 'mmol/L', recorded_at: recordedDate.toISOString() });
      setValue('');
      setRecordedDate(new Date());
      setShowForm(false);
    } catch {
      Alert.alert('Lỗi', 'Không thể lưu. Vui lòng thử lại.');
    }
  }

  function handleDelete(id: string) {
    Alert.alert('Xoá', 'Bạn có chắc muốn xoá mục này?', [
      { text: 'Huỷ', style: 'cancel' },
      {
        text: 'Xoá',
        style: 'destructive',
        onPress: () => deleteVital(id).catch(() => Alert.alert('Lỗi', 'Không thể xoá.')),
      },
    ]);
  }

  return (
    <View>
      {vitals.length > 0 &&
        (() => {
          const latest = vitals[0];
          const latestMmolL = bloodSugarAsMmolL(latest.value1, latest.unit);
          const st = bsStatus(latestMmolL);
          return (
            <Card padding="md" className="mb-4 border-brand-lavender-100">
              <View className="flex-row items-start justify-between mb-3">
                <View>
                  <Text className="text-xs font-semibold uppercase text-brand-lavender-700">
                    Chỉ số mới nhất
                  </Text>
                  <Text className="text-brand-navy/55 text-xs mt-0.5">
                    {format(parseISO(latest.recorded_at), 'HH:mm, dd/MM/yyyy')}
                  </Text>
                </View>
                <StatusPill label={st.label} color={st.color} />
              </View>
              <View className="flex-row items-end gap-x-2">
                <Text className="text-4xl font-bold text-brand-navy">
                  {formatBloodSugar(latestMmolL)}
                </Text>
                <Text className="text-sm text-brand-navy/60 mb-1.5">mmol/L</Text>
              </View>
              {latestMmolL >= 7 && <AIDisclaimer className="mt-3" />}
            </Card>
          );
        })()}

      {showForm ? (
        <Card padding="md" className="mb-4">
          <SectionTitle
            title="Thêm đường huyết"
            subtitle="Ghi theo đơn vị mmol/L để theo dõi các lần đo gần đây."
          />
          <View className="flex-row items-center gap-x-3 mb-3">
            <TextInput
              value={value}
              onChangeText={setValue}
              placeholder="5.3"
              keyboardType="decimal-pad"
              className="flex-1 border border-brand-gray rounded-input px-4 py-3 text-brand-navy bg-white text-base"
              placeholderTextColor="#1F2B5B60"
              style={inputStyles.field}
            />
            <Text className="text-brand-navy font-medium">mmol/L</Text>
          </View>
          <DateField
            value={recordedDate}
            onChange={setRecordedDate}
            label="Ngày ghi"
            maximumDate={new Date()}
            className="mb-3"
          />
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
          label="Thêm đường huyết"
          variant="primary"
          size="lg"
          className="mb-5"
          onPress={() => {
            setRecordedDate(new Date());
            setShowForm(true);
          }}
        />
      )}

      <SectionTitle
        title="Lịch sử"
        subtitle={vitals.length > 0 ? `${vitals.length} lần ghi gần đây` : undefined}
      />
      {isLoading ? (
        <LoadingSpinner />
      ) : vitals.length === 0 ? (
        <EmptyState
          title="Chưa có dữ liệu đường huyết"
          body="Ghi lần đo đầu tiên để dễ nhìn lại khi cần."
          cta={{ label: 'Thêm đường huyết', onPress: () => setShowForm(true) }}
          className="bg-white rounded-card border border-brand-gray"
        />
      ) : (
        vitals.map((v) => {
          const mmolL = bloodSugarAsMmolL(v.value1, v.unit);
          const st = bsStatus(mmolL);
          return (
            <Card key={v.id} padding="sm" className="mb-2">
              <View className="flex-row items-center">
                <View className="flex-1">
                  <View className="flex-row items-center gap-x-2">
                    <Text className="text-brand-navy font-bold text-lg">
                      {formatBloodSugar(mmolL)} mmol/L
                    </Text>
                    <StatusPill label={st.label} color={st.color} />
                  </View>
                  <Text className="text-brand-navy/50 text-xs mt-1">
                    {format(parseISO(v.recorded_at), 'HH:mm, dd/MM/yyyy')}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => handleDelete(v.id)} className="p-2">
                  <Text className="text-red-400 text-sm">Xoá</Text>
                </TouchableOpacity>
              </View>
            </Card>
          );
        })
      )}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Vital tab — heart rate
// ---------------------------------------------------------------------------

function HeartRateTab({ pregnancyId }: { pregnancyId: string }) {
  const { vitals, isLoading, addVital, isAdding, deleteVital } = usePregnancyVitals(
    pregnancyId,
    'heart_rate',
  );

  const [showForm, setShowForm] = useState(false);
  const [value, setValue] = useState('');
  const [recordedDate, setRecordedDate] = useState(new Date());

  async function handleAdd() {
    const v = parseInt(value, 10);
    if (isNaN(v) || v < 30 || v > 250) {
      Alert.alert('Lỗi', 'Nhịp tim không hợp lệ (30–250 bpm)');
      return;
    }
    try {
      await addVital({ value1: v, unit: 'bpm', recorded_at: recordedDate.toISOString() });
      setValue('');
      setRecordedDate(new Date());
      setShowForm(false);
    } catch {
      Alert.alert('Lỗi', 'Không thể lưu. Vui lòng thử lại.');
    }
  }

  function handleDelete(id: string) {
    Alert.alert('Xoá', 'Bạn có chắc muốn xoá mục này?', [
      { text: 'Huỷ', style: 'cancel' },
      {
        text: 'Xoá',
        style: 'destructive',
        onPress: () => deleteVital(id).catch(() => Alert.alert('Lỗi', 'Không thể xoá.')),
      },
    ]);
  }

  return (
    <View>
      {vitals.length > 0 &&
        (() => {
          const latest = vitals[0];
          const st = hrStatus(latest.value1);
          return (
            <Card padding="md" className="mb-4 border-brand-blue/40">
              <View className="flex-row items-start justify-between mb-3">
                <View>
                  <Text className="text-xs font-semibold uppercase text-[#1A6099]">
                    Chỉ số mới nhất
                  </Text>
                  <Text className="text-brand-navy/55 text-xs mt-0.5">
                    {format(parseISO(latest.recorded_at), 'HH:mm, dd/MM/yyyy')}
                  </Text>
                </View>
                <StatusPill label={st.label} color={st.color} />
              </View>
              <View className="flex-row items-end gap-x-2">
                <Text className="text-4xl font-bold text-brand-navy">{latest.value1}</Text>
                <Text className="text-sm text-brand-navy/60 mb-1.5">bpm</Text>
              </View>
              {(latest.value1 > 110 || latest.value1 < 55) && <AIDisclaimer className="mt-3" />}
            </Card>
          );
        })()}

      {showForm ? (
        <Card padding="md" className="mb-4">
          <SectionTitle
            title="Thêm nhịp tim"
            subtitle="Ghi nhịp tim khi nghỉ hoặc theo chỉ dẫn từ bác sĩ."
          />
          <View className="flex-row items-center gap-x-3 mb-3">
            <TextInput
              value={value}
              onChangeText={setValue}
              placeholder="75"
              keyboardType="number-pad"
              className="flex-1 border border-brand-gray rounded-input px-4 py-3 text-brand-navy bg-white text-base"
              placeholderTextColor="#1F2B5B60"
              style={inputStyles.field}
            />
            <Text className="text-brand-navy font-medium">bpm</Text>
          </View>
          <DateField
            value={recordedDate}
            onChange={setRecordedDate}
            label="Ngày ghi"
            maximumDate={new Date()}
            className="mb-3"
          />
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
          label="Thêm nhịp tim"
          variant="primary"
          size="lg"
          className="mb-5"
          onPress={() => {
            setRecordedDate(new Date());
            setShowForm(true);
          }}
        />
      )}

      <SectionTitle
        title="Lịch sử"
        subtitle={vitals.length > 0 ? `${vitals.length} lần ghi gần đây` : undefined}
      />
      {isLoading ? (
        <LoadingSpinner />
      ) : vitals.length === 0 ? (
        <EmptyState
          title="Chưa có dữ liệu nhịp tim"
          body="Ghi lần đo đầu tiên để lưu lại thay đổi theo thời gian."
          cta={{ label: 'Thêm nhịp tim', onPress: () => setShowForm(true) }}
          className="bg-white rounded-card border border-brand-gray"
        />
      ) : (
        vitals.map((v) => {
          const st = hrStatus(v.value1);
          return (
            <Card key={v.id} padding="sm" className="mb-2">
              <View className="flex-row items-center">
                <View className="flex-1">
                  <View className="flex-row items-center gap-x-2">
                    <Text className="text-brand-navy font-bold text-lg">{v.value1} bpm</Text>
                    <StatusPill label={st.label} color={st.color} />
                  </View>
                  <Text className="text-brand-navy/50 text-xs mt-1">
                    {format(parseISO(v.recorded_at), 'HH:mm, dd/MM/yyyy')}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => handleDelete(v.id)} className="p-2">
                  <Text className="text-red-400 text-sm">Xoá</Text>
                </TouchableOpacity>
              </View>
            </Card>
          );
        })
      )}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Symptoms tab (existing logic, with date picker added)
// ---------------------------------------------------------------------------

function SymptomsTab({ pregnancyId }: { pregnancyId: string }) {
  const { symptoms, todaySymptoms, todayMaxRisk, isLoading, addSymptom, isAdding, deleteSymptom } =
    usePregnancySymptoms(pregnancyId);

  const [showForm, setShowForm] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState<SelectedSymptom[]>([]);
  const [recordedDate, setRecordedDate] = useState(new Date());

  function toggleSymptom(key: string) {
    setSelectedSymptoms((prev) => {
      const exists = prev.find((s) => s.key === key);
      if (exists) return prev.filter((s) => s.key !== key);
      return [...prev, { key, severity: 2 }];
    });
  }

  function setSeverity(key: string, severity: number) {
    setSelectedSymptoms((prev) => prev.map((s) => (s.key === key ? { ...s, severity } : s)));
  }

  function getSelected(key: string): SelectedSymptom | undefined {
    return selectedSymptoms.find((s) => s.key === key);
  }

  async function handleSave() {
    if (selectedSymptoms.length === 0) {
      Alert.alert('Chưa chọn', 'Hãy chọn ít nhất một triệu chứng.');
      return;
    }
    const hasRedSymptom = selectedSymptoms.some(
      (s) => evaluateSymptomRisk(s.key, s.severity) === 'red',
    );
    try {
      await Promise.all(
        selectedSymptoms.map((s) =>
          addSymptom({
            symptom_key: s.key,
            severity: s.severity,
            recorded_at: recordedDate.toISOString(),
          }),
        ),
      );
      setSelectedSymptoms([]);
      setRecordedDate(new Date());
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

  const groupedSymptoms = symptoms.reduce<Record<string, typeof symptoms>>((acc, s) => {
    const dateKey = format(parseISO(s.recorded_at), 'yyyy-MM-dd');
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(s);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedSymptoms).sort().reverse();

  return (
    <View>
      {/* Today summary */}
      {todaySymptoms.length > 0 && (
        <Card padding="md" className="mb-4 border-brand-pink-100">
          <View className="flex-row items-start justify-between mb-3">
            <View className="flex-1 pr-3">
              <Text className="text-xs font-semibold uppercase text-brand-pink-600">Hôm nay</Text>
              <Text className="text-brand-navy text-xl font-bold mt-1">
                {todaySymptoms.length} triệu chứng đã ghi
              </Text>
              <Text className="text-brand-navy/55 text-xs mt-1">
                Mức độ cao nhất đang được phân loại bên cạnh.
              </Text>
            </View>
            <RiskBadge risk_level={todayMaxRisk} />
          </View>
          {todayMaxRisk === 'red' && (
            <Text className="text-red-600 text-sm mb-3 leading-5">
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
          <SectionTitle
            title="Chọn triệu chứng"
            subtitle="Chọn một hoặc nhiều dấu hiệu, sau đó chỉnh mức độ từ 1 đến 5."
          />

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

          <DateField
            value={recordedDate}
            onChange={setRecordedDate}
            label="Ngày ghi"
            maximumDate={new Date()}
            className="mt-1 mb-3"
          />

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
          label="Thêm triệu chứng"
          variant="primary"
          size="lg"
          className="mb-5"
          onPress={() => {
            setRecordedDate(new Date());
            setShowForm(true);
          }}
        />
      )}

      {/* History */}
      <SectionTitle
        title="Lịch sử"
        subtitle={symptoms.length > 0 ? `${symptoms.length} mục đã ghi` : undefined}
      />
      {isLoading ? (
        <LoadingSpinner />
      ) : sortedDates.length === 0 ? (
        <EmptyState
          title="Chưa có triệu chứng nào"
          body="Ghi lại cảm giác hôm nay để dễ theo dõi và trao đổi khi đi khám."
          cta={{ label: 'Thêm triệu chứng', onPress: () => setShowForm(true) }}
          className="bg-white rounded-card border border-brand-gray"
        />
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
                        {risk !== 'green' && <RiskBadge risk_level={risk} />}
                      </View>
                      <Text className="text-brand-navy/60 text-xs mt-0.5">
                        Mức độ: {s.severity ?? 1}/5 — {format(parseISO(s.recorded_at), 'HH:mm')}
                      </Text>
                      {s.note && <Text className="text-brand-navy/60 text-xs mt-1">{s.note}</Text>}
                    </View>
                    <TouchableOpacity onPress={() => handleDelete(s.id)} className="p-2">
                      <Text className="text-red-400 text-sm">Xoá</Text>
                    </TouchableOpacity>
                  </View>
                </Card>
              );
            })}
          </View>
        ))
      )}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Main screen
// ---------------------------------------------------------------------------

export default function SymptomsScreen() {
  const { pregnancy } = useActivePregnancy();
  const [activeTab, setActiveTab] = useState<Tab>('symptoms');
  const currentTab = TABS.find((tab) => tab.key === activeTab) ?? TABS[0];

  function renderActiveTab() {
    if (!pregnancy) {
      return (
        <EmptyState
          title="Chưa tìm thấy thai kỳ"
          body="Hãy tạo hồ sơ thai kỳ trước khi ghi dấu hiệu cơ thể."
          className="bg-white rounded-card border border-brand-gray"
        />
      );
    }

    if (activeTab === 'blood_pressure') return <BloodPressureTab pregnancyId={pregnancy.id} />;
    if (activeTab === 'blood_sugar') return <BloodSugarTab pregnancyId={pregnancy.id} />;
    if (activeTab === 'heart_rate') return <HeartRateTab pregnancyId={pregnancy.id} />;
    return <SymptomsTab pregnancyId={pregnancy.id} />;
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-brand-peach"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="px-5 pt-5">
          <View className="rounded-card border border-white bg-white px-5 py-5 shadow-brand">
            <Text className="text-xs font-semibold uppercase text-brand-pink-600">
              Theo dõi thai kỳ
            </Text>
            <Text className="text-brand-navy text-2xl font-bold mt-1">Dấu hiệu cơ thể</Text>
            <Text className="text-brand-navy/60 text-sm leading-5 mt-2">
              Ghi triệu chứng và các chỉ số quan trọng để nhìn lại thay đổi mỗi ngày.
            </Text>
            <View className="mt-4 flex-row flex-wrap gap-2">
              <View className="rounded-full bg-brand-pink-50 px-3 py-1">
                <Text className="text-brand-pink-700 text-xs font-semibold">
                  {pregnancy?.currentWeek != null ? `Tuần ${pregnancy.currentWeek}` : 'Thai kỳ'}
                </Text>
              </View>
              <View className="rounded-full bg-brand-lavender-50 px-3 py-1">
                <Text className="text-brand-lavender-700 text-xs font-semibold">
                  {currentTab.label}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <TabBar active={activeTab} onChange={setActiveTab} />

        <View className="px-5 pt-1">{renderActiveTab()}</View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
