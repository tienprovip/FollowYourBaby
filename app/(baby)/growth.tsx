// ---------------------------------------------------------------------------
// Growth Screen — log weight / length / head + WHO percentile chart
// ---------------------------------------------------------------------------

import React, { useState, useCallback } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Stack } from 'expo-router';
import { inputStyles } from '@/lib/inputStyles';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useBaby } from '@/hooks/useBaby';
import { useGrowthLogs } from '@/hooks/useGrowthLogs';
import { useToast } from '@/components/ui/Toast';
import GrowthChart from '@/components/baby/GrowthChart';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import type { GrowthMetric, Sex } from '@/lib/standards/whoGrowthStandards';
import type { Database } from '@/types/database';
import type { GrowthLogWithPercentile } from '@/hooks/useGrowthLogs';

const METRIC_SEGMENTS: { key: GrowthMetric; label: string }[] = [
  { key: 'weight', label: 'Can nang' },
  { key: 'length', label: 'Chieu cao' },
  { key: 'head', label: 'Vong dau' },
];

export default function GrowthScreen() {
  const { baby } = useBaby();
  const sex: Sex = baby?.sex === 'female' ? 'female' : 'male';
  const { logs, latestLog, isLoading, addGrowthLog, isAdding, deleteGrowthLog } =
    useGrowthLogs(baby?.sex, baby?.dob);
  const { show: showToast } = useToast();

  const [showForm, setShowForm] = useState(false);
  const [weightInput, setWeightInput] = useState('');
  const [lengthInput, setLengthInput] = useState('');
  const [headInput, setHeadInput] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const [selectedMetric, setSelectedMetric] = useState<GrowthMetric>('weight');

  async function handleAdd() {
    const weightG = weightInput
      ? Math.round(parseFloat(weightInput.replace(',', '.')) * 1000)
      : null;
    const lengthCm = lengthInput
      ? parseFloat(lengthInput.replace(',', '.'))
      : null;
    const headCm = headInput
      ? parseFloat(headInput.replace(',', '.'))
      : null;

    if (!weightG && !lengthCm && !headCm) {
      Alert.alert('Loi', 'Vui long nhap it nhat mot chi so.');
      return;
    }
    if (weightG !== null && (isNaN(weightG) || weightG < 500 || weightG > 30000)) {
      Alert.alert('Loi', 'Can nang phai tu 0.5 den 30 kg.');
      return;
    }
    if (lengthCm !== null && (isNaN(lengthCm) || lengthCm < 30 || lengthCm > 130)) {
      Alert.alert('Loi', 'Chieu dai phai tu 30 den 130 cm.');
      return;
    }

    try {
      await addGrowthLog({
        recorded_at: new Date().toISOString(),
        weight_g: weightG,
        length_cm: lengthCm,
        head_cm: headCm,
        note: noteInput || null,
      });
      setWeightInput('');
      setLengthInput('');
      setHeadInput('');
      setNoteInput('');
      setShowForm(false);
      showToast('Da luu chi so tang truong — Hoan tac', 'success', 5000);
    } catch {
      Alert.alert('Loi', 'Khong the luu. Vui long thu lai.');
    }
  }

  const handleDelete = useCallback(
    (id: string) => {
      Alert.alert('Xoa chi so', 'Ban co chac?', [
        { text: 'Huy', style: 'cancel' },
        {
          text: 'Xoa',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteGrowthLog(id);
            } catch {
              Alert.alert('Loi', 'Khong the xoa.');
            }
          },
        },
      ]);
    },
    [deleteGrowthLog],
  );

  // Build chart data points for the selected metric.
  // The hook already computes ageMonths-at-measurement via the same formula,
  // so we derive it locally here the same way (avoids coupling to hook internals).
  const MS_PER_MONTH = 1000 * 60 * 60 * 24 * 30.4375;

  const chartData = logs
    .filter((l) => {
      if (selectedMetric === 'weight') return l.weight_g !== null;
      if (selectedMetric === 'length') return l.length_cm !== null;
      if (selectedMetric === 'head') return l.head_cm !== null;
      return false;
    })
    .map((l) => {
      const ageMonths = baby?.dob
        ? Math.max(
            0,
            Math.min(
              24,
              (new Date(l.recorded_at).getTime() - new Date(baby.dob).getTime()) /
                MS_PER_MONTH,
            ),
          )
        : 0;

      let value = 0;
      if (selectedMetric === 'weight') value = (l.weight_g ?? 0) / 1000;
      if (selectedMetric === 'length') value = l.length_cm ?? 0;
      if (selectedMetric === 'head') value = l.head_cm ?? 0;
      return { ageMonths, value };
    });

  return (
    <>
      <Stack.Screen options={{ title: 'Tang truong' }} />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          className="flex-1 bg-brand-peach"
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        >
          {/* Latest measurement */}
          {latestLog && (
            <Card padding="md" className="mb-4">
              <Text className="text-brand-navy font-semibold mb-2">Chi so moi nhat</Text>
              <View className="flex-row flex-wrap gap-3">
                {latestLog.weight_g != null && (
                  <View className="items-center">
                    <Text className="text-2xl font-bold text-brand-navy">
                      {(latestLog.weight_g / 1000).toFixed(2)} kg
                    </Text>
                    <Text className="text-xs text-brand-navy/60">Can nang</Text>
                    {latestLog.weightPercentile && (
                      <Badge
                        label={latestLog.weightPercentile}
                        variant="blue"
                        className="mt-1"
                      />
                    )}
                  </View>
                )}
                {latestLog.length_cm !== null && (
                  <View className="items-center">
                    <Text className="text-2xl font-bold text-brand-navy">
                      {latestLog.length_cm.toFixed(1)} cm
                    </Text>
                    <Text className="text-xs text-brand-navy/60">Chieu cao</Text>
                    {latestLog.lengthPercentile && (
                      <Badge
                        label={latestLog.lengthPercentile}
                        variant="blue"
                        className="mt-1"
                      />
                    )}
                  </View>
                )}
                {latestLog.head_cm !== null && (
                  <View className="items-center">
                    <Text className="text-2xl font-bold text-brand-navy">
                      {latestLog.head_cm.toFixed(1)} cm
                    </Text>
                    <Text className="text-xs text-brand-navy/60">Vong dau</Text>
                    {latestLog.headPercentile && (
                      <Badge
                        label={latestLog.headPercentile}
                        variant="blue"
                        className="mt-1"
                      />
                    )}
                  </View>
                )}
              </View>
            </Card>
          )}

          {/* Chart metric selector */}
          <View className="flex-row gap-x-2 mb-2">
            {METRIC_SEGMENTS.map((m) => (
              <TouchableOpacity
                key={m.key}
                onPress={() => setSelectedMetric(m.key)}
                className={`flex-1 items-center py-2 rounded-btn border ${
                  selectedMetric === m.key
                    ? 'border-brand-blue bg-brand-blue/10'
                    : 'border-brand-gray bg-white'
                }`}
                accessibilityRole="tab"
                accessibilityState={{ selected: selectedMetric === m.key }}
              >
                <Text
                  className={`text-xs font-semibold ${
                    selectedMetric === m.key ? 'text-brand-blue' : 'text-brand-navy/60'
                  }`}
                >
                  {m.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Growth chart */}
          <Card padding="sm" className="mb-4 overflow-hidden">
            <GrowthChart
              metric={selectedMetric}
              sex={sex}
              dataPoints={chartData}
              height={220}
            />
          </Card>

          {/* Add form */}
          {showForm ? (
            <Card padding="md" className="mb-4">
              <Text className="text-brand-navy font-semibold mb-3">
                Them chi so moi
              </Text>
              <View className="gap-y-3 mb-4">
                <View className="flex-row items-center gap-x-2">
                  <TextInput
                    value={weightInput}
                    onChangeText={setWeightInput}
                    placeholder="Can nang (kg)"
                    keyboardType="decimal-pad"
                    className="flex-1 border border-brand-gray rounded-input px-4 py-3 text-brand-navy text-sm"
                    placeholderTextColor="#1F2B5B60"
                    style={inputStyles.field}
                  />
                  <Text className="text-brand-navy font-medium w-8">kg</Text>
                </View>
                <View className="flex-row items-center gap-x-2">
                  <TextInput
                    value={lengthInput}
                    onChangeText={setLengthInput}
                    placeholder="Chieu cao (cm)"
                    keyboardType="decimal-pad"
                    className="flex-1 border border-brand-gray rounded-input px-4 py-3 text-brand-navy text-sm"
                    placeholderTextColor="#1F2B5B60"
                    style={inputStyles.field}
                  />
                  <Text className="text-brand-navy font-medium w-8">cm</Text>
                </View>
                <View className="flex-row items-center gap-x-2">
                  <TextInput
                    value={headInput}
                    onChangeText={setHeadInput}
                    placeholder="Vong dau (cm)"
                    keyboardType="decimal-pad"
                    className="flex-1 border border-brand-gray rounded-input px-4 py-3 text-brand-navy text-sm"
                    placeholderTextColor="#1F2B5B60"
                    style={inputStyles.field}
                  />
                  <Text className="text-brand-navy font-medium w-8">cm</Text>
                </View>
                <TextInput
                  value={noteInput}
                  onChangeText={setNoteInput}
                  placeholder="Ghi chu (tuy chon)"
                  className="border border-brand-gray rounded-input px-4 py-3 text-brand-navy text-sm"
                  placeholderTextColor="#1F2B5B60"
                  style={inputStyles.field}
                />
              </View>
              <View className="flex-row gap-x-3">
                <Button
                  label="Luu"
                  variant="primary"
                  size="md"
                  className="flex-1"
                  loading={isAdding}
                  onPress={handleAdd}
                />
                <Button
                  label="Huy"
                  variant="secondary"
                  size="md"
                  className="flex-1"
                  onPress={() => setShowForm(false)}
                />
              </View>
            </Card>
          ) : (
            <Button
              label="+ Them chi so"
              variant="primary"
              size="lg"
              className="mb-4"
              onPress={() => setShowForm(true)}
            />
          )}

          {/* History */}
          <Text className="text-brand-navy font-semibold mb-2">Lich su</Text>
          {isLoading ? (
            <LoadingSpinner />
          ) : logs.length === 0 ? (
            <EmptyState
              title="Chua co chi so"
              body="Them can nang hoac chieu cao dau tien cho be"
            />
          ) : (
            [...logs]
              .reverse()
              .map((log) => (
                <GrowthLogRow
                  key={log.id}
                  log={log}
                  onDelete={() => handleDelete(log.id)}
                />
              ))
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

// ---------------------------------------------------------------------------
// GrowthLogRow
// ---------------------------------------------------------------------------

function GrowthLogRow({
  log,
  onDelete,
}: {
  log: GrowthLogWithPercentile;
  onDelete: () => void;
}) {
  const dateStr = format(parseISO(log.recorded_at), "dd 'thang' MM yyyy", {
    locale: vi,
  });

  return (
    <Card padding="sm" className="mb-2">
      <View className="flex-row items-start">
        <View className="flex-1">
          <Text className="text-brand-navy/60 text-xs mb-1">{dateStr}</Text>
          <View className="flex-row flex-wrap gap-x-4 gap-y-1">
            {log.weight_g != null && (
              <View>
                <Text className="text-brand-navy font-bold">
                  {(log.weight_g / 1000).toFixed(2)} kg
                </Text>
                {log.weightPercentile && (
                  <Text className="text-xs text-brand-navy/50">
                    {log.weightPercentile}
                  </Text>
                )}
              </View>
            )}
            {log.length_cm !== null && (
              <View>
                <Text className="text-brand-navy font-bold">
                  {log.length_cm.toFixed(1)} cm
                </Text>
                {log.lengthPercentile && (
                  <Text className="text-xs text-brand-navy/50">
                    {log.lengthPercentile}
                  </Text>
                )}
              </View>
            )}
            {log.head_cm !== null && (
              <View>
                <Text className="text-brand-navy font-bold">
                  {log.head_cm.toFixed(1)} cm vd
                </Text>
                {log.headPercentile && (
                  <Text className="text-xs text-brand-navy/50">
                    {log.headPercentile}
                  </Text>
                )}
              </View>
            )}
          </View>
          {log.note && (
            <Text className="text-brand-navy/50 text-xs mt-1">{log.note}</Text>
          )}
        </View>
        <TouchableOpacity
          onPress={onDelete}
          className="p-2"
          accessibilityLabel="Xoa chi so"
        >
          <Text className="text-red-400 text-sm">Xoa</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}
