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
import { inputStyles } from '@/lib/inputStyles';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useActivePregnancy } from '@/hooks/usePregnancy';
import { usePrenatalVisits } from '@/hooks/usePrenatalVisits';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import type { PrenatalVisitType } from '@/types/database';

// ---------------------------------------------------------------------------
// Prenatal Visits Screen
// ---------------------------------------------------------------------------

const VISIT_TYPES: { value: PrenatalVisitType; label: string; badge: 'pink' | 'blue' | 'lavender' }[] = [
  { value: 'checkup', label: 'Khám thai', badge: 'pink' },
  { value: 'ultrasound', label: 'Siêu âm', badge: 'blue' },
  { value: 'test', label: 'Xét nghiệm', badge: 'lavender' },
];

function getTypeLabel(type: string): string {
  return VISIT_TYPES.find((t) => t.value === type)?.label ?? type;
}

function getTypeBadge(type: string): 'pink' | 'blue' | 'lavender' {
  return VISIT_TYPES.find((t) => t.value === type)?.badge ?? 'pink';
}

export default function PrenatalVisitsScreen() {
  const { pregnancy } = useActivePregnancy();
  const {
    upcomingVisits,
    pastVisits,
    isLoading,
    addVisit,
    isAdding,
    deleteVisit,
  } = usePrenatalVisits(pregnancy?.id ?? null);

  const [showForm, setShowForm] = useState(false);
  const [visitType, setVisitType] = useState<PrenatalVisitType>('checkup');
  const [visitDate, setVisitDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [locationInput, setLocationInput] = useState('');
  const [notesInput, setNotesInput] = useState('');

  async function handleAdd() {
    try {
      await addVisit({
        scheduled_at: visitDate.toISOString(),
        type: visitType,
        location: locationInput || undefined,
        notes: notesInput || undefined,
      });
      setLocationInput('');
      setNotesInput('');
      setVisitDate(new Date());
      setVisitType('checkup');
      setShowForm(false);
    } catch {
      Alert.alert('Lỗi', 'Không thể lưu lịch khám. Vui lòng thử lại.');
    }
  }

  function handleDelete(id: string) {
    Alert.alert('Xoá lịch khám', 'Bạn có chắc muốn xoá lịch này?', [
      { text: 'Huỷ', style: 'cancel' },
      {
        text: 'Xoá',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteVisit(id);
          } catch {
            Alert.alert('Lỗi', 'Không thể xoá. Thử lại sau.');
          }
        },
      },
    ]);
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Lịch khám' }} />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      >
        {/* Add form */}
        {showForm ? (
          <Card padding="md" className="mb-4">
            <Text className="text-brand-navy font-semibold mb-3">Thêm lịch khám</Text>

            {/* Type selector */}
            <Text className="text-brand-navy/70 text-xs mb-2">Loại khám</Text>
            <View className="flex-row gap-x-2 mb-3">
              {VISIT_TYPES.map((t) => (
                <TouchableOpacity
                  key={t.value}
                  onPress={() => setVisitType(t.value)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: visitType === t.value }}
                  className={`flex-1 rounded-input py-2 items-center border ${
                    visitType === t.value
                      ? 'bg-brand-pink border-brand-pink'
                      : 'bg-white border-brand-gray'
                  }`}
                >
                  <Text
                    className={`text-xs font-medium ${
                      visitType === t.value ? 'text-white' : 'text-brand-navy'
                    }`}
                  >
                    {t.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Date picker */}
            <Text className="text-brand-navy/70 text-xs mb-2">Ngày giờ khám</Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              className="border border-brand-gray rounded-input px-4 py-3 bg-white mb-3"
              accessibilityLabel="Chọn ngày giờ khám"
            >
              <Text className="text-brand-navy">
                {format(visitDate, "EEEE, dd 'tháng' MM yyyy — HH:mm", { locale: vi })}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={visitDate}
                mode="datetime"
                display="default"
                minimumDate={new Date()}
                onChange={(_, date) => {
                  setShowDatePicker(false);
                  if (date) setVisitDate(date);
                }}
              />
            )}

            {/* Location */}
            <Text className="text-brand-navy/70 text-xs mb-2">Địa điểm</Text>
            <TextInput
              value={locationInput}
              onChangeText={setLocationInput}
              placeholder="Tên phòng khám / bệnh viện"
              className="border border-brand-gray rounded-input px-4 py-3 text-brand-navy bg-white text-sm mb-3"
              placeholderTextColor="#1F2B5B60"
              style={inputStyles.field}
            />

            {/* Notes */}
            <Text className="text-brand-navy/70 text-xs mb-2">Ghi chú</Text>
            <TextInput
              value={notesInput}
              onChangeText={setNotesInput}
              placeholder="Ghi chú thêm..."
              multiline
              numberOfLines={3}
              className="border border-brand-gray rounded-input px-4 py-3 text-brand-navy bg-white text-sm mb-3"
              placeholderTextColor="#1F2B5B60"
              style={[inputStyles.multiline, { height: 80 }]}
            />

            <View className="flex-row gap-x-3">
              <Button
                label="Lưu lịch"
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
            label="+ Thêm lịch khám"
            variant="primary"
            size="lg"
            className="mb-4"
            onPress={() => setShowForm(true)}
          />
        )}

        {/* Upcoming visits */}
        <Text className="text-brand-navy font-semibold mb-2">Sắp tới</Text>
        {isLoading ? (
          <LoadingSpinner />
        ) : upcomingVisits.length === 0 ? (
          <Text className="text-brand-navy/60 text-sm mb-4">
            Chưa có lịch khám sắp tới.
          </Text>
        ) : (
          upcomingVisits.map((v) => (
            <Card key={v.id} padding="md" className="mb-3">
              <View className="flex-row items-start">
                <View className="flex-1">
                  <View className="flex-row items-center gap-x-2 mb-1">
                    <Badge
                      label={getTypeLabel(v.type)}
                      variant={getTypeBadge(v.type)}
                    />
                  </View>
                  <Text className="text-brand-navy font-semibold text-base">
                    {format(parseISO(v.scheduled_at), "EEEE, dd 'tháng' MM yyyy", {
                      locale: vi,
                    })}
                  </Text>
                  <Text className="text-brand-navy font-bold text-2xl">
                    {format(parseISO(v.scheduled_at), 'HH:mm')}
                  </Text>
                  {v.location && (
                    <Text className="text-brand-navy/60 text-sm mt-1">
                      {v.location}
                    </Text>
                  )}
                  {v.notes && (
                    <Text className="text-brand-navy/60 text-xs mt-1">
                      {v.notes}
                    </Text>
                  )}
                </View>
                <TouchableOpacity
                  onPress={() => handleDelete(v.id)}
                  className="p-2"
                  accessibilityLabel="Xoá lịch khám này"
                >
                  <Text className="text-red-400 text-sm">Xoá</Text>
                </TouchableOpacity>
              </View>
            </Card>
          ))
        )}

        {/* Past visits */}
        {pastVisits.length > 0 && (
          <>
            <Text className="text-brand-navy font-semibold mb-2 mt-4">
              Đã qua
            </Text>
            {pastVisits.reverse().map((v) => (
              <Card key={v.id} padding="sm" className="mb-2 opacity-70">
                <View className="flex-row items-center gap-x-3">
                  <View className="flex-1">
                    <View className="flex-row items-center gap-x-2">
                      <Badge
                        label={getTypeLabel(v.type)}
                        variant={getTypeBadge(v.type)}
                      />
                      <Text className="text-brand-navy/60 text-xs">
                        {format(parseISO(v.scheduled_at), 'dd/MM/yyyy HH:mm')}
                      </Text>
                    </View>
                    {v.location && (
                      <Text className="text-brand-navy/60 text-xs mt-0.5">
                        {v.location}
                      </Text>
                    )}
                  </View>
                </View>
              </Card>
            ))}
          </>
        )}
      </ScrollView>
    </>
  );
}
