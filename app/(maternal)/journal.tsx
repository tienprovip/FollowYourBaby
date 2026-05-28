import React, { useState } from 'react';
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
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useActivePregnancy } from '@/hooks/usePregnancy';
import {
  usePregnancyJournal,
  MOOD_CATALOGUE,
  getMoodInfo,
  type MoodKey,
} from '@/hooks/usePregnancyJournal';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import DateField from '@/components/ui/DateField';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import { inputStyles } from '@/lib/inputStyles';

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SectionTitle({ title, count }: { title: string; count?: number }) {
  return (
    <View className="flex-row items-center gap-x-2 mb-3">
      <Text className="text-brand-navy text-base font-bold">{title}</Text>
      {count !== undefined && (
        <View className="rounded-full bg-brand-lavender-50 px-2 py-0.5">
          <Text className="text-brand-lavender-700 text-xs font-semibold">{count}</Text>
        </View>
      )}
    </View>
  );
}

function MoodChip({
  emoji,
  label,
  selected,
  onPress,
}: {
  emoji: string;
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`items-center rounded-btn px-3 py-2 mr-2 mb-2 border ${
        selected
          ? 'bg-brand-lavender-100 border-brand-lavender-400'
          : 'bg-white border-brand-gray'
      }`}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text style={{ fontSize: 20 }}>{emoji}</Text>
      <Text
        className={`text-xs mt-1 font-medium ${
          selected ? 'text-brand-lavender-700' : 'text-brand-navy/60'
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

// ---------------------------------------------------------------------------
// Main screen
// ---------------------------------------------------------------------------

export default function JournalScreen() {
  const { pregnancy } = useActivePregnancy();
  const { entries, isLoading, addEntry, isAdding, deleteEntry } = usePregnancyJournal(
    pregnancy?.id ?? null,
  );

  const [showForm, setShowForm] = useState(false);
  const [mood, setMood] = useState<MoodKey | null>(null);
  const [titleInput, setTitleInput] = useState('');
  const [contentInput, setContentInput] = useState('');
  const [recordedDate, setRecordedDate] = useState(new Date());

  function resetForm() {
    setMood(null);
    setTitleInput('');
    setContentInput('');
    setRecordedDate(new Date());
    setShowForm(false);
  }

  async function handleSave() {
    if (!contentInput.trim()) {
      Alert.alert('Thiếu nội dung', 'Vui lòng ghi ít nhất một dòng nhật ký.');
      return;
    }
    try {
      await addEntry({
        content: contentInput.trim(),
        title: titleInput.trim() || null,
        mood: mood ?? null,
        recorded_at: recordedDate.toISOString(),
      });
      resetForm();
    } catch {
      Alert.alert('Lỗi', 'Không thể lưu nhật ký. Vui lòng thử lại.');
    }
  }

  async function handleDelete(id: string) {
    Alert.alert('Xoá nhật ký', 'Bạn có chắc muốn xoá mục này?', [
      { text: 'Huỷ', style: 'cancel' },
      {
        text: 'Xoá',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteEntry(id);
          } catch {
            Alert.alert('Lỗi', 'Không thể xoá. Vui lòng thử lại.');
          }
        },
      },
    ]);
  }

  // Group entries by date (yyyy-MM-dd)
  const grouped = entries.reduce<Record<string, typeof entries>>(
    (acc, entry) => {
      const dateKey = entry.recorded_at.slice(0, 10);
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(entry);
      return acc;
    },
    {},
  );
  const sortedDates = Object.keys(grouped).sort().reverse();

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-brand-peach"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header card */}
        <View className="px-5 pt-5">
          <View className="rounded-card border border-white bg-white px-5 py-5 shadow-brand">
            <Text className="text-xs font-semibold uppercase text-brand-lavender-600">
              Theo dõi thai kỳ
            </Text>
            <Text className="text-brand-navy text-2xl font-bold mt-1">Nhật ký thai kỳ</Text>
            <Text className="text-brand-navy/60 text-sm leading-5 mt-2">
              Ghi lại cảm xúc, kỷ niệm và những khoảnh khắc đáng nhớ trong hành trình mang thai.
            </Text>
            {pregnancy?.currentWeek != null && (
              <View className="mt-3 flex-row">
                <View className="rounded-full bg-brand-lavender-50 px-3 py-1">
                  <Text className="text-brand-lavender-700 text-xs font-semibold">
                    Tuần {pregnancy.currentWeek}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        <View className="px-5 pt-4">
          {/* No pregnancy guard */}
          {!pregnancy ? (
            <EmptyState
              title="Chưa có thai kỳ"
              body="Hãy tạo hồ sơ thai kỳ trước khi ghi nhật ký."
              className="bg-white rounded-card border border-brand-gray"
            />
          ) : (
            <>
              {/* Toggle button */}
              {!showForm && (
                <Button
                  label="+ Thêm nhật ký hôm nay"
                  variant="primary"
                  size="md"
                  className="mb-4"
                  onPress={() => {
                    setRecordedDate(new Date());
                    setShowForm(true);
                  }}
                />
              )}

              {/* Add form */}
              {showForm && (
                <Card padding="md" className="mb-4">
                  <Text className="text-brand-navy text-base font-bold mb-1">
                    Ghi nhật ký
                  </Text>
                  <Text className="text-brand-navy/55 text-xs mb-4">
                    Hôm nay bạn cảm thấy thế nào?
                  </Text>

                  {/* Mood selector */}
                  <Text className="text-brand-navy/70 text-xs font-semibold mb-2 uppercase">
                    Tâm trạng
                  </Text>
                  <View className="flex-row flex-wrap mb-3">
                    {MOOD_CATALOGUE.map((m) => (
                      <MoodChip
                        key={m.key}
                        emoji={m.emoji}
                        label={m.label}
                        selected={mood === m.key}
                        onPress={() => setMood(mood === m.key ? null : m.key)}
                      />
                    ))}
                  </View>

                  {/* Title */}
                  <Text className="text-brand-navy/70 text-xs font-semibold mb-1 uppercase">
                    Tiêu đề (tuỳ chọn)
                  </Text>
                  <TextInput
                    value={titleInput}
                    onChangeText={setTitleInput}
                    placeholder="VD: Lần đầu cảm nhận thai máy..."
                    placeholderTextColor="#9CA3AF"
                    className="border border-brand-pink-200 rounded-input px-3 py-2 text-brand-navy text-sm mb-3"
                    style={inputStyles.field}
                    returnKeyType="next"
                  />

                  {/* Content */}
                  <Text className="text-brand-navy/70 text-xs font-semibold mb-1 uppercase">
                    Nội dung
                  </Text>
                  <TextInput
                    value={contentInput}
                    onChangeText={setContentInput}
                    placeholder="Ghi lại cảm xúc, sự kiện, kỷ niệm hôm nay..."
                    placeholderTextColor="#9CA3AF"
                    multiline
                    numberOfLines={5}
                    className="border border-brand-pink-200 rounded-input px-3 py-2 text-brand-navy text-sm mb-3 min-h-[100px]"
                    style={inputStyles.multiline}
                    textAlignVertical="top"
                  />

                  {/* Date */}
                  <DateField
                    value={recordedDate}
                    onChange={setRecordedDate}
                    label="Ngày ghi"
                    maximumDate={new Date()}
                    className="mb-3"
                  />

                  <View className="flex-row gap-x-3 mt-1">
                    <Button
                      label="Lưu"
                      variant="primary"
                      size="md"
                      className="flex-1"
                      loading={isAdding}
                      disabled={!contentInput.trim()}
                      onPress={handleSave}
                    />
                    <Button
                      label="Huỷ"
                      variant="secondary"
                      size="md"
                      className="flex-1"
                      onPress={resetForm}
                    />
                  </View>
                </Card>
              )}

              {/* History */}
              <SectionTitle title="Nhật ký của bạn" count={entries.length} />
              {isLoading ? (
                <LoadingSpinner />
              ) : sortedDates.length === 0 ? (
                <EmptyState
                  title="Chưa có nhật ký nào"
                  body="Hãy ghi lại cảm xúc và kỷ niệm trong hành trình mang thai của bạn."
                  cta={{ label: 'Viết nhật ký đầu tiên', onPress: () => setShowForm(true) }}
                  className="bg-white rounded-card border border-brand-gray"
                />
              ) : (
                sortedDates.map((dateKey) => (
                  <View key={dateKey} className="mb-4">
                    <Text className="text-brand-navy/60 text-xs font-semibold mb-2 uppercase">
                      {format(new Date(dateKey + 'T00:00:00'), 'EEEE, dd/MM/yyyy', { locale: vi })}
                    </Text>
                    {grouped[dateKey].map((entry) => {
                      const moodInfo = entry.mood ? getMoodInfo(entry.mood) : null;
                      return (
                        <Card key={entry.id} padding="md" className="mb-2">
                          {/* Mood + time + delete row */}
                          <View className="flex-row items-center gap-x-2 mb-1">
                            {moodInfo && (
                              <Text style={{ fontSize: 16 }}>{moodInfo.emoji}</Text>
                            )}
                            {moodInfo && (
                              <View className="rounded-full bg-brand-lavender-50 px-2 py-0.5">
                                <Text className="text-brand-lavender-700 text-xs">
                                  {moodInfo.label}
                                </Text>
                              </View>
                            )}
                            <Text className="text-brand-navy/40 text-xs ml-auto">
                              {format(parseISO(entry.recorded_at), 'HH:mm')}
                            </Text>
                            <TouchableOpacity
                              onPress={() => handleDelete(entry.id)}
                              className="pl-3"
                              accessibilityRole="button"
                              accessibilityLabel="Xoá nhật ký"
                            >
                              <Text className="text-red-400 text-xs">Xoá</Text>
                            </TouchableOpacity>
                          </View>
                          {/* Title */}
                          {entry.title ? (
                            <Text className="text-brand-navy font-semibold text-sm mb-1">
                              {entry.title}
                            </Text>
                          ) : null}
                          {/* Content preview */}
                          <Text
                            className="text-brand-navy/70 text-sm leading-5"
                            numberOfLines={3}
                          >
                            {entry.content}
                          </Text>
                        </Card>
                      );
                    })}
                  </View>
                ))
              )}
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

