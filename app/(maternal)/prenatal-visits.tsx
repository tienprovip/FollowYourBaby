import React, { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { inputStyles } from '@/lib/inputStyles';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useActivePregnancy } from '@/hooks/usePregnancy';
import { usePrenatalVisits } from '@/hooks/usePrenatalVisits';
import { useOcrVisit, OcrResult } from '@/hooks/useOcrVisit';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import AIDisclaimer from '@/components/ui/AIDisclaimer';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import type { PrenatalVisitType } from '@/types/database';

// ---------------------------------------------------------------------------
// Constants & helpers
// ---------------------------------------------------------------------------

type VisitTab = 'schedule' | 'results';

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

function confidenceColor(c: 'high' | 'medium' | 'low'): string {
  if (c === 'high') return '#AEE6C8';
  if (c === 'medium') return '#FFE4B5';
  return '#FFCDD2';
}

function confidenceLabel(c: 'high' | 'medium' | 'low'): string {
  if (c === 'high') return 'Trích xuất chính xác';
  if (c === 'medium') return 'Một số thông tin có thể sai';
  return 'Ảnh mờ — kiểm tra lại';
}

// ---------------------------------------------------------------------------
// OCR Confirmation Sheet
// ---------------------------------------------------------------------------

interface OcrSheetProps {
  visible: boolean;
  visitId: string;
  ocrResult: OcrResult;
  onSave: (
    visitId: string,
    fields: {
      scheduled_at?: string;
      location?: string | null;
      doctor_name?: string | null;
      next_visit_date?: string | null;
      notes?: string | null;
      document_url?: string | null;
    }
  ) => Promise<void>;
  onClose: () => void;
  isSaving: boolean;
}

function OcrConfirmSheet({ visible, visitId, ocrResult, onSave, onClose, isSaving }: OcrSheetProps) {
  const { extracted, confidence, document_url } = ocrResult;

  const [visitDate, setVisitDate] = useState(extracted.visit_date ?? '');
  const [facility, setFacility] = useState(extracted.facility_name ?? '');
  const [doctor, setDoctor] = useState(extracted.doctor_name ?? '');
  const [nextDate, setNextDate] = useState(extracted.next_visit_date ?? '');
  const [notes, setNotes] = useState(extracted.notes ?? '');

  async function handleSave() {
    await onSave(visitId, {
      scheduled_at: visitDate ? new Date(visitDate).toISOString() : undefined,
      location: facility || null,
      doctor_name: doctor || null,
      next_visit_date: nextDate ? new Date(nextDate).toISOString() : null,
      notes: notes || null,
      document_url: document_url ?? null,
    });
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/40">
        <View className="bg-white rounded-t-3xl px-5 pt-5 pb-8">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-brand-navy font-bold text-base">Kết quả trích xuất</Text>
            <View
              className="px-3 py-1 rounded-full"
              style={{ backgroundColor: confidenceColor(confidence) }}
            >
              <Text className="text-xs font-medium text-brand-navy">
                {confidenceLabel(confidence)}
              </Text>
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 480 }}>
            <Text className="text-brand-navy/60 text-xs mb-1">Ngày khám</Text>
            <TextInput
              value={visitDate}
              onChangeText={setVisitDate}
              placeholder="YYYY-MM-DD"
              className="border border-brand-gray rounded-input px-4 py-3 text-brand-navy bg-white text-sm mb-3"
              placeholderTextColor="#1F2B5B60"
              style={inputStyles.field}
            />

            <Text className="text-brand-navy/60 text-xs mb-1">Cơ sở khám</Text>
            <TextInput
              value={facility}
              onChangeText={setFacility}
              placeholder="Tên phòng khám / bệnh viện"
              className="border border-brand-gray rounded-input px-4 py-3 text-brand-navy bg-white text-sm mb-3"
              placeholderTextColor="#1F2B5B60"
              style={inputStyles.field}
            />

            <Text className="text-brand-navy/60 text-xs mb-1">Bác sĩ</Text>
            <TextInput
              value={doctor}
              onChangeText={setDoctor}
              placeholder="Tên bác sĩ"
              className="border border-brand-gray rounded-input px-4 py-3 text-brand-navy bg-white text-sm mb-3"
              placeholderTextColor="#1F2B5B60"
              style={inputStyles.field}
            />

            <Text className="text-brand-navy/60 text-xs mb-1">Ngày tái khám</Text>
            <TextInput
              value={nextDate}
              onChangeText={setNextDate}
              placeholder="YYYY-MM-DD (nếu có)"
              className="border border-brand-gray rounded-input px-4 py-3 text-brand-navy bg-white text-sm mb-3"
              placeholderTextColor="#1F2B5B60"
              style={inputStyles.field}
            />

            {(extracted.weight_kg || extracted.blood_pressure || extracted.fetal_heartbeat) && (
              <View className="bg-brand-gray rounded-card p-3 mb-3">
                <Text className="text-brand-navy/70 text-xs font-medium mb-2">
                  Chỉ số y tế (xem thêm trong mục theo dõi)
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {extracted.weight_kg && (
                    <View className="bg-white rounded-full px-3 py-1">
                      <Text className="text-brand-navy text-xs">Cân: {extracted.weight_kg} kg</Text>
                    </View>
                  )}
                  {extracted.blood_pressure && (
                    <View className="bg-white rounded-full px-3 py-1">
                      <Text className="text-brand-navy text-xs">Huyết áp: {extracted.blood_pressure}</Text>
                    </View>
                  )}
                  {extracted.fetal_heartbeat && (
                    <View className="bg-white rounded-full px-3 py-1">
                      <Text className="text-brand-navy text-xs">Tim thai: {extracted.fetal_heartbeat} bpm</Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            <Text className="text-brand-navy/60 text-xs mb-1">Ghi chú</Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Ghi chú từ phiếu khám..."
              multiline
              numberOfLines={3}
              className="border border-brand-gray rounded-input px-4 py-3 text-brand-navy bg-white text-sm mb-3"
              placeholderTextColor="#1F2B5B60"
              style={[inputStyles.multiline, { height: 72 }]}
            />

            <AIDisclaimer />
          </ScrollView>

          <View className="flex-row gap-x-3 mt-4">
            <Button
              label="Lưu thông tin"
              variant="primary"
              size="md"
              className="flex-1"
              loading={isSaving}
              onPress={handleSave}
            />
            <Button
              label="Huỷ"
              variant="secondary"
              size="md"
              className="flex-1"
              onPress={onClose}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// Source picker modal
// ---------------------------------------------------------------------------

interface SourcePickerProps {
  visible: boolean;
  onSelect: (source: 'camera' | 'library') => void;
  onClose: () => void;
}

function SourcePickerModal({ visible, onSelect, onClose }: SourcePickerProps) {
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <TouchableOpacity
        className="flex-1 justify-end bg-black/40"
        activeOpacity={1}
        onPress={onClose}
      >
        <View className="bg-white rounded-t-3xl px-5 pt-5 pb-10">
          <Text className="text-brand-navy font-bold text-base mb-4 text-center">
            Chọn ảnh phiếu khám
          </Text>
          <TouchableOpacity
            className="flex-row items-center py-4 border-b border-brand-gray"
            onPress={() => onSelect('camera')}
          >
            <Text className="text-2xl mr-3">📷</Text>
            <Text className="text-brand-navy font-medium">Chụp ảnh</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row items-center py-4"
            onPress={() => onSelect('library')}
          >
            <Text className="text-2xl mr-3">🖼️</Text>
            <Text className="text-brand-navy font-medium">Chọn từ thư viện</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// Main Screen
// ---------------------------------------------------------------------------

export default function PrenatalVisitsScreen() {
  const { pregnancy } = useActivePregnancy();
  const {
    upcomingVisits,
    pastVisits,
    isLoading,
    addVisit,
    isAdding,
    updateVisit,
    isUpdating,
    deleteVisit,
  } = usePrenatalVisits(pregnancy?.id ?? null);

  const { pickAndExtract, isExtracting, error: ocrError } = useOcrVisit(pregnancy?.id ?? null);

  const { tab: tabParam } = useLocalSearchParams<{ tab?: string }>();
  const [activeTab, setActiveTab] = useState<VisitTab>(
    tabParam === 'results' ? 'results' : 'schedule'
  );

  // Add form state
  const [showForm, setShowForm] = useState(false);
  const [visitType, setVisitType] = useState<PrenatalVisitType>('checkup');
  const [visitDate, setVisitDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [locationInput, setLocationInput] = useState('');
  const [notesInput, setNotesInput] = useState('');

  // OCR state — visitId can be an existing UUID or 'new' for standalone scan
  const [sourcePicker, setSourcePicker] = useState<{ visible: boolean; visitId: string | null }>({
    visible: false,
    visitId: null,
  });
  const [ocrSheet, setOcrSheet] = useState<{
    visible: boolean;
    visitId: string;
    result: OcrResult;
  } | null>(null);

  // -------------------------------------------------------------------------
  // Handlers
  // -------------------------------------------------------------------------

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

  function openSourcePicker(visitId: string) {
    setSourcePicker({ visible: true, visitId });
  }

  async function handleSourceSelected(source: 'camera' | 'library') {
    const visitId = sourcePicker.visitId;
    setSourcePicker({ visible: false, visitId: null });
    if (!visitId) return;

    const result = await pickAndExtract(source);
    if (!result) {
      if (ocrError) Alert.alert('Lỗi OCR', ocrError);
      return;
    }
    setOcrSheet({ visible: true, visitId, result });
  }

  async function handleOcrSave(
    visitId: string,
    fields: {
      scheduled_at?: string;
      location?: string | null;
      doctor_name?: string | null;
      next_visit_date?: string | null;
      notes?: string | null;
      document_url?: string | null;
    }
  ) {
    try {
      if (visitId === 'new') {
        // Standalone scan — create a new visit record
        await addVisit({
          scheduled_at: fields.scheduled_at ?? new Date().toISOString(),
          type: 'checkup',
          location: fields.location ?? undefined,
          notes: fields.notes ?? undefined,
          document_url: fields.document_url ?? undefined,
          doctor_name: fields.doctor_name ?? undefined,
          next_visit_date: fields.next_visit_date ?? undefined,
        });
      } else {
        await updateVisit({ id: visitId, ...fields });
      }
      setOcrSheet(null);

      if (fields.next_visit_date) {
        const dateLabel = format(parseISO(fields.next_visit_date), "dd 'tháng' MM yyyy", {
          locale: vi,
        });
        Alert.alert(
          'Tạo lịch tái khám?',
          `Tạo lịch hẹn tái khám ngày ${dateLabel}?`,
          [
            { text: 'Bỏ qua', style: 'cancel' },
            {
              text: 'Tạo lịch',
              onPress: async () => {
                try {
                  await addVisit({
                    scheduled_at: fields.next_visit_date!,
                    type: 'checkup',
                    location: fields.location ?? undefined,
                  });
                  setActiveTab('schedule');
                } catch {
                  Alert.alert('Lỗi', 'Không thể tạo lịch tái khám.');
                }
              },
            },
          ]
        );
      }
    } catch {
      Alert.alert('Lỗi', 'Không thể lưu thông tin. Vui lòng thử lại.');
    }
  }

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  const sortedPastVisits = [...pastVisits].reverse();

  return (
    <>
      {/* OCR loading overlay */}
      {isExtracting && (
        <View className="absolute inset-0 z-50 items-center justify-center bg-black/30">
          <View className="bg-white rounded-card px-8 py-6 items-center shadow-brand">
            <ActivityIndicator size="large" color="#FF8FA8" />
            <Text className="text-brand-navy font-medium mt-3">
              Đang phân tích phiếu khám...
            </Text>
          </View>
        </View>
      )}

      <SourcePickerModal
        visible={sourcePicker.visible}
        onSelect={handleSourceSelected}
        onClose={() => setSourcePicker({ visible: false, visitId: null })}
      />

      {ocrSheet && (
        <OcrConfirmSheet
          visible={ocrSheet.visible}
          visitId={ocrSheet.visitId}
          ocrResult={ocrSheet.result}
          onSave={handleOcrSave}
          onClose={() => setOcrSheet(null)}
          isSaving={isUpdating || isAdding}
        />
      )}

      {/* Tab switcher */}
      <View className="flex-row mx-5 mt-4 mb-1 rounded-input p-1 bg-brand-gray">
        {(['schedule', 'results'] as VisitTab[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            className="flex-1 py-2.5 rounded-input items-center"
            style={
              activeTab === tab
                ? {
                    backgroundColor: '#FFFFFF',
                    shadowColor: '#000000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.06,
                    shadowRadius: 3,
                    elevation: 1,
                  }
                : undefined
            }
            onPress={() => setActiveTab(tab)}
            accessibilityRole="button"
            accessibilityState={{ selected: activeTab === tab }}
          >
            <Text
              className="text-sm font-semibold"
              style={{ color: activeTab === tab ? '#1F2B5B' : 'rgba(31,43,91,0.4)' }}
            >
              {tab === 'schedule' ? 'Lịch khám' : 'Kết quả khám'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      >
        {/* ------------------------------------------------------------------ */}
        {/* TAB: Lịch khám                                                      */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'schedule' && (
          <>
            {showForm ? (
              <Card padding="md" className="mb-4">
                <Text className="text-brand-navy font-semibold mb-3">Thêm lịch khám</Text>

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

                <Text className="text-brand-navy/70 text-xs mb-2">Cơ sở khám</Text>
                <TextInput
                  value={locationInput}
                  onChangeText={setLocationInput}
                  placeholder="Tên phòng khám / bệnh viện"
                  className="border border-brand-gray rounded-input px-4 py-3 text-brand-navy bg-white text-sm mb-3"
                  placeholderTextColor="#1F2B5B60"
                  style={inputStyles.field}
                />

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
                        <Badge label={getTypeLabel(v.type)} variant={getTypeBadge(v.type)} />
                      </View>
                      <Text className="text-brand-navy font-semibold text-base">
                        {format(parseISO(v.scheduled_at), "EEEE, dd 'tháng' MM yyyy", { locale: vi })}
                      </Text>
                      <Text className="text-brand-navy font-bold text-2xl">
                        {format(parseISO(v.scheduled_at), 'HH:mm')}
                      </Text>
                      {v.location && (
                        <Text className="text-brand-navy/60 text-sm mt-1">🏥 {v.location}</Text>
                      )}
                      {v.notes && (
                        <Text className="text-brand-navy/60 text-xs mt-1">{v.notes}</Text>
                      )}
                    </View>
                    <TouchableOpacity
                      onPress={() => handleDelete(v.id)}
                      className="p-2"
                      accessibilityLabel="Xoá lịch khám này"
                    >
                      <Text className="text-red-400 text-xs">Xoá</Text>
                    </TouchableOpacity>
                  </View>
                </Card>
              ))
            )}
          </>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* TAB: Kết quả khám                                                   */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'results' && (
          <>
            {/* Quét phiếu mới không gắn với lịch khám có sẵn */}
            <TouchableOpacity
              onPress={() => openSourcePicker('new')}
              className="bg-brand-lavender/10 border border-brand-lavender/30 rounded-card p-4 mb-5 flex-row items-center justify-center gap-x-3"
              accessibilityLabel="Quét phiếu khám mới"
            >
              <Text className="text-2xl">📷</Text>
              <View>
                <Text className="text-brand-navy font-semibold text-sm">Quét phiếu khám mới</Text>
                <Text className="text-brand-navy/60 text-xs">
                  Chụp hoặc chọn ảnh phiếu khám từ thư viện
                </Text>
              </View>
            </TouchableOpacity>

            <Text className="text-brand-navy font-semibold mb-2">Kết quả đã lưu</Text>

            {isLoading ? (
              <LoadingSpinner />
            ) : sortedPastVisits.length === 0 ? (
              <View className="items-center py-10">
                <Text className="text-3xl mb-3">🩺</Text>
                <Text className="text-brand-navy/60 text-sm text-center">
                  Chưa có kết quả nào.{'\n'}Sau mỗi lần khám, hãy quét phiếu kết quả để lưu thông tin.
                </Text>
              </View>
            ) : (
              sortedPastVisits.map((v) => (
                <Card key={v.id} padding="md" className="mb-3">
                  <View className="flex-row items-start">
                    <View className="flex-1">
                      <View className="flex-row items-center gap-x-2 mb-1">
                        <Badge label={getTypeLabel(v.type)} variant={getTypeBadge(v.type)} />
                        {v.document_url && (
                          <Text className="text-xs text-brand-lavender">📎 Có tài liệu</Text>
                        )}
                      </View>
                      <Text className="text-brand-navy font-semibold text-base">
                        {format(parseISO(v.scheduled_at), "EEEE, dd 'tháng' MM yyyy", { locale: vi })}
                      </Text>
                      <Text className="text-brand-navy font-bold text-2xl">
                        {format(parseISO(v.scheduled_at), 'HH:mm')}
                      </Text>
                      {v.location && (
                        <Text className="text-brand-navy/60 text-sm mt-1">🏥 {v.location}</Text>
                      )}
                      {v.doctor_name && (
                        <Text className="text-brand-navy/60 text-sm">👨‍⚕️ Bs. {v.doctor_name}</Text>
                      )}
                      {v.next_visit_date && (
                        <View className="flex-row items-center mt-1">
                          <View className="bg-brand-peach rounded-full px-2 py-0.5">
                            <Text className="text-brand-navy text-xs">
                              Tái khám:{' '}
                              {format(parseISO(v.next_visit_date), "dd 'tháng' MM", { locale: vi })}
                            </Text>
                          </View>
                        </View>
                      )}
                      {v.notes && (
                        <Text className="text-brand-navy/60 text-xs mt-1">{v.notes}</Text>
                      )}
                    </View>

                    <TouchableOpacity
                      onPress={() => openSourcePicker(v.id)}
                      className="bg-brand-lavender/10 rounded-btn px-3 py-1.5 mt-0.5"
                      accessibilityLabel="Cập nhật kết quả khám"
                    >
                      <Text className="text-brand-lavender text-xs font-medium">
                        {v.document_url ? '📷 Cập nhật' : '📷 Quét'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </Card>
              ))
            )}
          </>
        )}
      </ScrollView>
    </>
  );
}
