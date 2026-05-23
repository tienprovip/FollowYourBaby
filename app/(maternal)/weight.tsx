import React, { useMemo, useState } from 'react';
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
import { format, isSameDay, parseISO, subDays } from 'date-fns';
import { useActivePregnancy } from '@/hooks/usePregnancy';
import { usePregnancyWeights } from '@/hooks/usePregnancyWeights';
import WeightChart from '@/components/maternal/WeightChart';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import DateField from '@/components/ui/DateField';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';

// ---------------------------------------------------------------------------
// Weight Tracking Screen
// ---------------------------------------------------------------------------

export default function WeightScreen() {
  const { pregnancy } = useActivePregnancy();
  const { weights, isLoading, addWeight, isAdding, deleteWeight } =
    usePregnancyWeights(pregnancy?.id ?? null);

  const [showForm, setShowForm] = useState(false);
  const [weightInput, setWeightInput] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const [recordedDate, setRecordedDate] = useState(new Date());

  const [showPrePregnancyForm, setShowPrePregnancyForm] = useState(false);
  const [preWeightInput, setPreWeightInput] = useState('');

  // Date before pregnancy = due_date - 281 days (LMP - 1 day)
  const prePregnancyDate = useMemo(() => {
    if (!pregnancy?.due_date) return null;
    return subDays(parseISO(pregnancy.due_date), 281);
  }, [pregnancy?.due_date]);

  const prePregnancyWeight = useMemo(() => {
    if (!prePregnancyDate) return null;
    return weights.find((w) => isSameDay(parseISO(w.recorded_at), prePregnancyDate)) ?? null;
  }, [weights, prePregnancyDate]);

  // Regular weights = all except the pre-pregnancy baseline
  const regularWeights = useMemo(() => {
    if (!prePregnancyWeight) return weights;
    return weights.filter((w) => w.id !== prePregnancyWeight.id);
  }, [weights, prePregnancyWeight]);

  const baseWeightKg =
    prePregnancyWeight?.weight_kg ?? (weights.length > 0 ? weights[0].weight_kg : null);

  const latestRegularWeight =
    regularWeights.length > 0 ? regularWeights[regularWeights.length - 1] : null;

  async function handleAddPrePregnancy() {
    const kg = parseFloat(preWeightInput.replace(',', '.'));
    if (isNaN(kg) || kg < 30 || kg > 200) {
      Alert.alert('Lỗi', 'Vui lòng nhập cân nặng hợp lệ (30–200 kg)');
      return;
    }
    if (!prePregnancyDate) return;
    try {
      await addWeight({ weight_kg: kg, recorded_at: prePregnancyDate.toISOString() });
      setPreWeightInput('');
      setShowPrePregnancyForm(false);
    } catch {
      Alert.alert('Lỗi', 'Không thể lưu cân nặng. Vui lòng thử lại.');
    }
  }

  async function handleAdd() {
    const kg = parseFloat(weightInput.replace(',', '.'));
    if (isNaN(kg) || kg < 30 || kg > 200) {
      Alert.alert('Lỗi', 'Vui lòng nhập cân nặng hợp lệ (30–200 kg)');
      return;
    }
    try {
      await addWeight({ weight_kg: kg, recorded_at: recordedDate.toISOString(), note: noteInput || undefined });
      setWeightInput('');
      setNoteInput('');
      setRecordedDate(new Date());
      setShowForm(false);
    } catch {
      Alert.alert('Lỗi', 'Không thể lưu cân nặng. Vui lòng thử lại.');
    }
  }

  function handleDelete(id: string) {
    Alert.alert('Xoá cân nặng', 'Bạn có chắc muốn xoá mục này?', [
      { text: 'Huỷ', style: 'cancel' },
      {
        text: 'Xoá',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteWeight(id);
          } catch {
            Alert.alert('Lỗi', 'Không thể xoá. Thử lại sau.');
          }
        },
      },
    ]);
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Cân nặng' }} />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        >
          {/* Pre-pregnancy weight section */}
          {prePregnancyDate && (
            <Card padding="md" className="mb-4">
              <Text className="text-brand-navy font-semibold mb-2">
                Cân nặng trước khi mang thai
              </Text>
              {prePregnancyWeight ? (
                <View className="flex-row items-center">
                  <View className="flex-1">
                    <Text className="text-2xl font-bold text-brand-navy">
                      {prePregnancyWeight.weight_kg}{' '}
                      <Text className="text-base font-normal">kg</Text>
                    </Text>
                    <Text className="text-xs text-brand-navy/60 mt-1">
                      {format(prePregnancyDate, 'dd/MM/yyyy')}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDelete(prePregnancyWeight.id)}
                    accessibilityLabel="Xoá cân nặng trước mang thai"
                    className="p-2"
                  >
                    <Text className="text-red-400 text-sm">Xoá</Text>
                  </TouchableOpacity>
                </View>
              ) : showPrePregnancyForm ? (
                <>
                  <Text className="text-xs text-brand-navy/60 mb-3">
                    Ngày: {format(prePregnancyDate, 'dd/MM/yyyy')} (tự động tính từ ngày dự sinh)
                  </Text>
                  <View className="flex-row items-center gap-x-3 mb-3">
                    <TextInput
                      value={preWeightInput}
                      onChangeText={setPreWeightInput}
                      placeholder="Cân nặng (kg)"
                      keyboardType="decimal-pad"
                      className="flex-1 border border-brand-gray rounded-input px-4 py-3 text-brand-navy bg-white text-base"
                      placeholderTextColor="#1F2B5B60"
                      returnKeyType="done"
                      accessibilityLabel="Nhập cân nặng trước mang thai"
                    />
                    <Text className="text-brand-navy font-medium">kg</Text>
                  </View>
                  <View className="flex-row gap-x-3">
                    <Button
                      label="Lưu"
                      variant="primary"
                      size="md"
                      className="flex-1"
                      loading={isAdding}
                      onPress={handleAddPrePregnancy}
                    />
                    <Button
                      label="Huỷ"
                      variant="secondary"
                      size="md"
                      className="flex-1"
                      onPress={() => setShowPrePregnancyForm(false)}
                    />
                  </View>
                </>
              ) : (
                <Button
                  label="+ Nhập cân nặng trước mang thai"
                  variant="secondary"
                  size="sm"
                  onPress={() => setShowPrePregnancyForm(true)}
                />
              )}
            </Card>
          )}

          {/* Chart */}
          <Card padding="sm" className="mb-4 overflow-hidden">
            <Text className="text-brand-navy font-semibold mb-3 px-2">
              Biểu đồ tăng cân
            </Text>
            <WeightChart
              weights={weights}
              pregnancyWeek={pregnancy?.currentWeek ?? 0}
              baseWeightKg={baseWeightKg}
              dueDate={pregnancy?.due_date ?? null}
              bmiCategory="normal"
              width={320}
              height={200}
            />
          </Card>

          {/* Latest weight */}
          {latestRegularWeight && (
            <Card padding="md" className="mb-4">
              <Text className="text-xs text-brand-navy/60 mb-1">Cân nặng mới nhất</Text>
              <Text className="text-3xl font-bold text-brand-navy">
                {latestRegularWeight.weight_kg}{' '}
                <Text className="text-base font-normal">kg</Text>
              </Text>
              <Text className="text-xs text-brand-navy/60 mt-1">
                {format(parseISO(latestRegularWeight.recorded_at), 'HH:mm, dd/MM/yyyy')}
              </Text>
            </Card>
          )}

          {/* Add form */}
          {showForm ? (
            <Card padding="md" className="mb-4">
              <Text className="text-brand-navy font-semibold mb-3">
                Thêm cân nặng
              </Text>
              <View className="flex-row items-center gap-x-3 mb-3">
                <TextInput
                  value={weightInput}
                  onChangeText={setWeightInput}
                  placeholder="Cân nặng (kg)"
                  keyboardType="decimal-pad"
                  className="flex-1 border border-brand-gray rounded-input px-4 py-3 text-brand-navy bg-white text-base"
                  placeholderTextColor="#1F2B5B60"
                  returnKeyType="done"
                  accessibilityLabel="Nhập cân nặng"
                />
                <Text className="text-brand-navy font-medium">kg</Text>
              </View>
              <DateField
                value={recordedDate}
                onChange={setRecordedDate}
                label="Ngày ghi"
                maximumDate={new Date()}
                className="mb-3"
              />
              <TextInput
                value={noteInput}
                onChangeText={setNoteInput}
                placeholder="Ghi chú (tuỳ chọn)"
                className="border border-brand-gray rounded-input px-4 py-3 text-brand-navy bg-white text-sm mb-3"
                placeholderTextColor="#1F2B5B60"
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
              label="+ Thêm cân nặng"
              variant="primary"
              size="lg"
              className="mb-4"
              onPress={() => { setRecordedDate(new Date()); setShowForm(true); }}
            />
          )}

          {/* History */}
          <Text className="text-brand-navy font-semibold mb-2">Lịch sử</Text>
          {isLoading ? (
            <LoadingSpinner />
          ) : regularWeights.length === 0 ? (
            <EmptyState
              title="Chưa có dữ liệu"
              body="Bắt đầu ghi cân nặng để theo dõi hành trình của bạn"
            />
          ) : (
            [...regularWeights]
              .reverse()
              .map((w) => (
                <Card key={w.id} padding="sm" className="mb-2">
                  <View className="flex-row items-center">
                    <View className="flex-1">
                      <Text className="text-brand-navy font-bold text-lg">
                        {w.weight_kg} kg
                      </Text>
                      <Text className="text-brand-navy/60 text-xs">
                        {format(parseISO(w.recorded_at), 'HH:mm, dd/MM/yyyy')}
                      </Text>
                      {w.note && (
                        <Text className="text-brand-navy/60 text-xs mt-1">
                          {w.note}
                        </Text>
                      )}
                    </View>
                    <TouchableOpacity
                      onPress={() => handleDelete(w.id)}
                      accessibilityLabel="Xoá mục này"
                      className="p-2"
                    >
                      <Text className="text-red-400 text-sm">Xoá</Text>
                    </TouchableOpacity>
                  </View>
                </Card>
              ))
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
