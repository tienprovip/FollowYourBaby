import React, { useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { inputStyles } from '@/lib/inputStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack } from 'expo-router';
import { format, parseISO } from 'date-fns';
import { useActivePregnancy } from '@/hooks/usePregnancy';
import Button from '@/components/ui/Button';
import DateField from '@/components/ui/DateField';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface HeightRecord {
  id: string;
  height_cm: number;
  note?: string;
  recorded_at: string;
}

const STORAGE_PREFIX = 'maternal-height-records';

export default function MaternalHeightScreen() {
  const { pregnancy } = useActivePregnancy();
  const storageKey = useMemo(
    () => `${STORAGE_PREFIX}:${pregnancy?.id ?? 'default'}`,
    [pregnancy?.id],
  );
  const [records, setRecords] = useState<HeightRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [heightInput, setHeightInput] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const [recordedDate, setRecordedDate] = useState(new Date());

  useEffect(() => {
    let mounted = true;

    async function hydrate() {
      setIsLoading(true);
      const raw = await AsyncStorage.getItem(storageKey).catch(() => null);
      if (!mounted) return;

      if (raw == null) {
        setRecords([]);
        setIsLoading(false);
        return;
      }

      try {
        const parsed = JSON.parse(raw) as HeightRecord[];
        setRecords(Array.isArray(parsed) ? parsed : []);
      } catch {
        setRecords([]);
      } finally {
        setIsLoading(false);
      }
    }

    hydrate();

    return () => {
      mounted = false;
    };
  }, [storageKey]);

  async function persist(nextRecords: HeightRecord[]) {
    setRecords(nextRecords);
    await AsyncStorage.setItem(storageKey, JSON.stringify(nextRecords));
  }

  async function handleAdd() {
    const height = Number.parseFloat(heightInput.replace(',', '.'));
    if (Number.isNaN(height) || height < 10 || height > 60) {
      Alert.alert('Chưa đúng', 'Nhập chiều dài tử cung hợp lệ từ 10-60 mm nhé.');
      return;
    }

    const nextRecord: HeightRecord = {
      id: `${Date.now()}`,
      height_cm: height,
      note: noteInput.trim() || undefined,
      recorded_at: recordedDate.toISOString(),
    };

    try {
      await persist([...records, nextRecord]);
      setHeightInput('');
      setNoteInput('');
      setRecordedDate(new Date());
      setShowForm(false);
    } catch {
      Alert.alert('Có lỗi rồi', 'Chưa lưu được số đo, mẹ thử lại sau ít phút nhé.');
    }
  }

  function handleDelete(id: string) {
    Alert.alert('Xóa số đo', 'Xóa số đo này nhé?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          try {
            await persist(records.filter((record) => record.id !== id));
          } catch {
            Alert.alert('Có lỗi rồi', 'Chưa xóa được số đo, mẹ thử lại sau ít phút nhé.');
          }
        },
      },
    ]);
  }

  const latestRecord = records.length > 0 ? records[records.length - 1] : undefined;

  return (
    <>
      <Stack.Screen options={{ title: 'Chiều dài tử cung' }} />
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        {latestRecord && (
          <Card padding="md" className="mb-4">
            <Text className="mb-1 text-xs font-semibold text-brand-navy/60">Số đo mới nhất</Text>
            <Text className="text-3xl font-bold text-brand-navy">
              {latestRecord.height_cm}{' '}
              <Text className="text-base font-normal text-brand-navy/70">cm</Text>
            </Text>
            <Text className="mt-1 text-xs font-semibold text-brand-navy/60">
              {format(parseISO(latestRecord.recorded_at), 'HH:mm, dd/MM/yyyy')}
            </Text>
          </Card>
        )}

        {showForm ? (
          <Card padding="md" className="mb-4">
            <Text className="mb-3 font-semibold text-brand-navy">Ghi lại chiều dài tử cung</Text>
            <View className="mb-3 flex-row items-center gap-x-3">
              <TextInput
                value={heightInput}
                onChangeText={setHeightInput}
                placeholder="Chiều dài (mm)"
                keyboardType="decimal-pad"
                className="flex-1 rounded-input border border-brand-gray bg-white px-4 py-3 text-base text-brand-navy"
                placeholderTextColor="#1F2B5B60"
                returnKeyType="done"
                accessibilityLabel="Nhập chiều dài tử cung"
                style={inputStyles.field}
              />
              <Text className="font-medium text-brand-navy">mm</Text>
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
              placeholder="Ghi chú thêm"
              className="mb-3 rounded-input border border-brand-gray bg-white px-4 py-3 text-sm text-brand-navy"
              placeholderTextColor="#1F2B5B60"
              style={inputStyles.field}
            />
            <View className="flex-row gap-x-3">
              <Button
                label="Lưu"
                variant="primary"
                size="md"
                className="flex-1"
                onPress={handleAdd}
              />
              <Button
                label="Hủy"
                variant="secondary"
                size="md"
                className="flex-1"
                onPress={() => setShowForm(false)}
              />
            </View>
          </Card>
        ) : (
          <Button
            label="+ Thêm số đo"
            variant="primary"
            size="lg"
            className="mb-4"
            onPress={() => {
              setRecordedDate(new Date());
              setShowForm(true);
            }}
          />
        )}

        <Text className="mb-2 font-semibold text-brand-navy">Lịch sử</Text>
        {isLoading ? (
          <LoadingSpinner />
        ) : records.length === 0 ? (
          <EmptyState
            title="Chưa có số đo"
            body="Mẹ có thể ghi lại chiều dài tử cung sau mỗi lần đo để theo dõi thay đổi."
          />
        ) : (
          [...records].reverse().map((record) => (
            <Card key={record.id} padding="sm" className="mb-2">
              <View className="flex-row items-center">
                <View className="flex-1">
                  <Text className="text-lg font-bold text-brand-navy">{record.height_cm} cm</Text>
                  <Text className="text-xs text-brand-navy/60">
                    {format(parseISO(record.recorded_at), 'HH:mm, dd/MM/yyyy')}
                  </Text>
                  {record.note && (
                    <Text className="mt-1 text-xs text-brand-navy/60">{record.note}</Text>
                  )}
                </View>
                <TouchableOpacity
                  onPress={() => handleDelete(record.id)}
                  accessibilityLabel="Xóa số đo này"
                  className="p-2"
                >
                  <Text className="text-sm text-red-400">Xóa</Text>
                </TouchableOpacity>
              </View>
            </Card>
          ))
        )}
      </ScrollView>
    </>
  );
}
