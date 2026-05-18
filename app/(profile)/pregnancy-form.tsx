import { useEffect } from 'react';
import {
  Alert,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { usePregnancies } from '@/hooks/usePregnancies';
import { Button, DateField } from '@/components/ui';
import { toLocalDateStr, fromLocalDateStr } from '@/lib/dateUtils';

const isoToDate = fromLocalDateStr;
const dateToIso = toLocalDateStr;

const schema = z.object({
  due_date: z.date({ required_error: 'Vui lòng chọn ngày dự sinh' }),
  lmp_date: z.date().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function PregnancyFormScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEdit = Boolean(id);
  const { pregnancies, addPregnancy, updatePregnancy, archivePregnancy, isAdding, isUpdating, isArchiving } =
    usePregnancies();

  const existing = isEdit ? pregnancies.find((p) => p.id === id) : undefined;

  const { control, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { due_date: undefined, lmp_date: undefined },
  });

  useEffect(() => {
    if (existing) {
      reset({
        due_date: isoToDate(existing.due_date),
        lmp_date: isoToDate(existing.lmp_date),
      });
    }
  }, [existing, reset]);

  async function onSubmit(values: FormValues) {
    try {
      if (isEdit && id) {
        await updatePregnancy({
          id,
          due_date: values.due_date ? dateToIso(values.due_date) : null,
          lmp_date: values.lmp_date ? dateToIso(values.lmp_date) : null,
        });
      } else {
        await addPregnancy({
          due_date: values.due_date ? dateToIso(values.due_date) : null,
          lmp_date: values.lmp_date ? dateToIso(values.lmp_date) : null,
        });
      }
      router.back();
    } catch {
      Alert.alert('Lỗi', 'Không thể lưu thông tin. Vui lòng thử lại.');
    }
  }

  function handleArchive(status: 'completed' | 'lost') {
    const label = status === 'completed' ? 'Đã sinh' : 'Lưu thai';
    Alert.alert(
      'Lưu trữ thai kỳ',
      `Xác nhận cập nhật trạng thái thai kỳ thành "${label}"?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xác nhận',
          onPress: async () => {
            try {
              await archivePregnancy({ id: id!, status });
              router.back();
            } catch {
              Alert.alert('Lỗi', 'Không thể cập nhật trạng thái. Vui lòng thử lại.');
            }
          },
        },
      ],
    );
  }

  const isSaving = isAdding || isUpdating;

  return (
    <>
      <Stack.Screen options={{ title: isEdit ? 'Chỉnh sửa thai kỳ' : 'Thêm thai kỳ' }} />
      <ScrollView
        className="flex-1 bg-brand-peach"
        contentContainerStyle={{ padding: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="bg-white rounded-card p-5 shadow-brand gap-y-4">
          <Controller
            control={control}
            name="due_date"
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <DateField
                label="Ngày dự sinh (DSD)"
                value={value}
                onChange={onChange}
                error={error?.message}
                minimumDate={new Date()}
              />
            )}
          />

          <Controller
            control={control}
            name="lmp_date"
            render={({ field: { value, onChange } }) => (
              <View>
                <DateField
                  label="Ngày kinh cuối cùng (KCC)"
                  value={value}
                  onChange={onChange}
                  maximumDate={new Date()}
                />
                <Text className="mt-1 text-xs text-brand-navy/50">
                  Không bắt buộc — dùng để tính tuần thai
                </Text>
              </View>
            )}
          />
        </View>

        <Button
          label={isEdit ? 'Lưu thay đổi' : 'Thêm thai kỳ'}
          variant="primary"
          size="lg"
          loading={isSaving}
          onPress={handleSubmit(onSubmit)}
          className="mt-6"
        />

        {isEdit && existing?.status === 'active' && (
          <View className="mt-4 gap-y-2">
            <Text className="text-xs text-brand-navy/50 text-center mb-1">
              Lưu trữ thai kỳ này
            </Text>
            <Button
              label="Đã sinh thành công"
              variant="secondary"
              size="md"
              loading={isArchiving}
              onPress={() => handleArchive('completed')}
            />
            <Button
              label="Lưu thai"
              variant="destructive"
              size="md"
              loading={isArchiving}
              onPress={() => handleArchive('lost')}
            />
          </View>
        )}

        <Button
          label="Hủy"
          variant="ghost"
          size="md"
          onPress={() => router.back()}
          className="mt-2"
        />
      </ScrollView>
    </>
  );
}
