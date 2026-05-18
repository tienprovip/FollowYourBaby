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

import { useBabies } from '@/hooks/useBabies';
import { Button, DateField, FormField, SegmentedControl } from '@/components/ui';
import type { SegmentOption } from '@/components/ui';

// DateField works with Date objects; DB stores YYYY-MM-DD strings.
function isoToDate(iso: string | null | undefined): Date | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  return isNaN(d.getTime()) ? undefined : d;
}

function dateToIso(date: Date): string {
  return date.toISOString().slice(0, 10);
}

const schema = z.object({
  name: z.string().min(1, 'Vui lòng nhập tên bé').max(100),
  dob: z.date({ required_error: 'Vui lòng chọn ngày sinh' }),
  sex: z.enum(['male', 'female', 'other']),
  birth_weight_g: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : null))
    .pipe(z.number().min(500, 'Tối thiểu 500g').max(8000, 'Tối đa 8000g').nullable()),
  birth_length_cm: z
    .string()
    .optional()
    .transform((v) => (v ? parseFloat(v) : null))
    .pipe(z.number().min(20, 'Tối thiểu 20cm').max(80, 'Tối đa 80cm').nullable()),
});

type FormValues = z.infer<typeof schema>;

const SEX_OPTIONS: SegmentOption[] = [
  { key: 'male', label: 'Bé trai' },
  { key: 'female', label: 'Bé gái' },
  { key: 'other', label: 'Khác' },
];

export default function BabyFormScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEdit = Boolean(id);
  const { babies, addBaby, updateBaby, isAdding, isUpdating } = useBabies();

  const existing = isEdit ? babies.find((b) => b.id === id) : undefined;

  const { control, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      dob: undefined,
      sex: 'male',
      birth_weight_g: '' as unknown as null,
      birth_length_cm: '' as unknown as null,
    },
  });

  useEffect(() => {
    if (existing) {
      reset({
        name: existing.name,
        dob: isoToDate(existing.dob),
        sex: (existing.sex ?? 'male') as 'male' | 'female' | 'other',
        birth_weight_g: existing.birth_weight_g?.toString() as unknown as null,
        birth_length_cm: existing.birth_length_cm?.toString() as unknown as null,
      });
    }
  }, [existing, reset]);

  async function onSubmit(values: FormValues) {
    try {
      const dobIso = dateToIso(values.dob);
      if (isEdit && id) {
        await updateBaby({
          id,
          name: values.name,
          dob: dobIso,
          sex: values.sex,
          birth_weight_g: values.birth_weight_g,
          birth_length_cm: values.birth_length_cm,
        });
      } else {
        await addBaby({
          name: values.name,
          dob: dobIso,
          sex: values.sex,
          birth_weight_g: values.birth_weight_g,
          birth_length_cm: values.birth_length_cm,
        });
      }
      router.back();
    } catch {
      Alert.alert('Lỗi', 'Không thể lưu thông tin bé. Vui lòng thử lại.');
    }
  }

  const isSaving = isAdding || isUpdating;

  return (
    <>
      <Stack.Screen options={{ title: isEdit ? 'Chỉnh sửa hồ sơ bé' : 'Thêm hồ sơ bé' }} />
      <ScrollView
        className="flex-1 bg-brand-peach"
        contentContainerStyle={{ padding: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="bg-white rounded-card p-5 shadow-brand gap-y-4">
          <FormField
            control={control}
            name="name"
            label="Tên bé"
            placeholder="Ví dụ: Nam, Bông, Kem..."
          />

          <Controller
            control={control}
            name="dob"
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <DateField
                label="Ngày sinh"
                value={value}
                onChange={onChange}
                error={error?.message}
                maximumDate={new Date()}
              />
            )}
          />

          <Controller
            control={control}
            name="sex"
            render={({ field: { value, onChange } }) => (
              <View>
                <Text className="mb-1.5 text-sm font-semibold text-brand-navy">Giới tính</Text>
                <SegmentedControl
                  options={SEX_OPTIONS}
                  selectedKey={value}
                  onChange={(k) => onChange(k)}
                />
              </View>
            )}
          />

          <FormField
            control={control}
            name="birth_weight_g"
            label="Cân nặng lúc sinh (gram)"
            placeholder="Ví dụ: 3200"
            type="numeric"
            helperText="Không bắt buộc"
          />

          <FormField
            control={control}
            name="birth_length_cm"
            label="Chiều dài lúc sinh (cm)"
            placeholder="Ví dụ: 50.5"
            type="numeric"
            helperText="Không bắt buộc"
          />
        </View>

        <Button
          label={isEdit ? 'Lưu thay đổi' : 'Thêm bé'}
          variant="primary"
          size="lg"
          loading={isSaving}
          onPress={handleSubmit(onSubmit)}
          className="mt-6"
        />
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
