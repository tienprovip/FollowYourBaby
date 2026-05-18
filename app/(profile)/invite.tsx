import { useState } from 'react';
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useCareShares } from '@/hooks/useCareShares';
import { useBabies } from '@/hooks/useBabies';
import { usePregnancies } from '@/hooks/usePregnancies';
import { Button, FormField } from '@/components/ui';

const schema = z.object({
  invitee_email: z.string().email('Email không hợp lệ'),
  resource_type: z.enum(['baby', 'pregnancy']),
  resource_id: z.string().min(1, 'Vui lòng chọn bé hoặc thai kỳ'),
  permission: z.enum(['view', 'edit', 'full']),
});

type FormValues = z.infer<typeof schema>;

const PERMISSION_OPTIONS: { value: 'view' | 'edit' | 'full'; label: string; desc: string }[] = [
  { value: 'view', label: 'Xem', desc: 'Chỉ đọc nhật ký và hồ sơ' },
  { value: 'edit', label: 'Chỉnh sửa', desc: 'Có thể thêm và sửa nhật ký' },
  { value: 'full', label: 'Toàn quyền', desc: 'Tất cả ngoại trừ chuyển quyền sở hữu' },
];

export default function InviteScreen() {
  const router = useRouter();
  const { inviteCaregiver, isInviting } = useCareShares();
  const { babies } = useBabies();
  const { pregnancies } = usePregnancies();
  const [resourceType, setResourceType] = useState<'baby' | 'pregnancy'>('baby');

  const { control, handleSubmit, setValue, watch } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      invitee_email: '',
      resource_type: 'baby',
      resource_id: '',
      permission: 'view',
    },
  });

  const selectedPermission = watch('permission');
  const selectedResourceId = watch('resource_id');

  function handleResourceTypeChange(type: 'baby' | 'pregnancy') {
    setResourceType(type);
    setValue('resource_type', type);
    setValue('resource_id', '');
  }

  async function onSubmit(values: FormValues) {
    try {
      await inviteCaregiver({
        inviteeEmail: values.invitee_email,
        resourceType: values.resource_type,
        resourceId: values.resource_id,
        permission: values.permission,
      });
      Alert.alert(
        'Đã gửi lời mời',
        `Lời mời đã được gửi đến ${values.invitee_email}. Họ cần xác nhận để có quyền truy cập.`,
        [{ text: 'OK', onPress: () => router.back() }],
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Không thể gửi lời mời.';
      Alert.alert('Lỗi', msg);
    }
  }

  const activeResources = resourceType === 'baby'
    ? babies
    : pregnancies.filter((p) => p.status === 'active');

  return (
    <>
      <Stack.Screen options={{ title: 'Mời người chăm sóc' }} />
      <ScrollView
        className="flex-1 bg-brand-peach"
        contentContainerStyle={{ padding: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="bg-white rounded-card p-5 shadow-brand gap-y-4 mb-4">
          <Text className="text-base font-bold text-brand-navy">Thông tin người được mời</Text>

          <FormField
            control={control}
            name="invitee_email"
            label="Email"
            placeholder="nguyen@example.com"
            type="email"
          />
        </View>

        {/* Resource type toggle */}
        <View className="bg-white rounded-card p-5 shadow-brand mb-4">
          <Text className="text-sm font-semibold text-brand-navy mb-3">Chia sẻ gì?</Text>
          <View className="flex-row gap-x-3">
            {(['baby', 'pregnancy'] as const).map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => handleResourceTypeChange(type)}
                accessibilityRole="radio"
                accessibilityState={{ checked: resourceType === type }}
                className={`flex-1 rounded-btn py-2 items-center border ${
                  resourceType === type
                    ? 'bg-brand-pink border-brand-pink'
                    : 'bg-white border-brand-gray'
                }`}
              >
                <Text className={`text-sm font-semibold ${resourceType === type ? 'text-white' : 'text-brand-navy'}`}>
                  {type === 'baby' ? 'Hồ sơ bé' : 'Thai kỳ'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Resource picker */}
        <View className="bg-white rounded-card p-5 shadow-brand mb-4">
          <Text className="text-sm font-semibold text-brand-navy mb-3">
            Chọn {resourceType === 'baby' ? 'bé' : 'thai kỳ'}
          </Text>
          <Controller
            control={control}
            name="resource_id"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <View className="gap-y-2">
                {activeResources.length === 0 && (
                  <Text className="text-sm text-brand-navy/50">
                    {resourceType === 'baby'
                      ? 'Chưa có hồ sơ bé nào.'
                      : 'Không có thai kỳ đang hoạt động.'}
                  </Text>
                )}
                {activeResources.map((resource) => {
                  const label = 'name' in resource
                    ? resource.name
                    : `Dự sinh: ${resource.due_date ?? 'Chưa rõ'}`;
                  const isSelected = value === resource.id;
                  return (
                    <TouchableOpacity
                      key={resource.id}
                      onPress={() => onChange(resource.id)}
                      accessibilityRole="radio"
                      accessibilityState={{ checked: isSelected }}
                      className={`rounded-input px-4 py-3 border ${
                        isSelected ? 'bg-brand-pink/10 border-brand-pink' : 'bg-brand-gray border-transparent'
                      }`}
                    >
                      <Text className={`text-sm font-medium ${isSelected ? 'text-brand-pink' : 'text-brand-navy'}`}>
                        {label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
                {error && (
                  <Text className="text-xs text-red-500">{error.message}</Text>
                )}
              </View>
            )}
          />
        </View>

        {/* Permission selector */}
        <View className="bg-white rounded-card p-5 shadow-brand mb-6">
          <Text className="text-sm font-semibold text-brand-navy mb-3">Mức quyền</Text>
          <Controller
            control={control}
            name="permission"
            render={({ field: { onChange } }) => (
              <View className="gap-y-2">
                {PERMISSION_OPTIONS.map((opt) => {
                  const isSelected = selectedPermission === opt.value;
                  return (
                    <TouchableOpacity
                      key={opt.value}
                      onPress={() => onChange(opt.value)}
                      accessibilityRole="radio"
                      accessibilityState={{ checked: isSelected }}
                      className={`rounded-input px-4 py-3 border flex-row items-center ${
                        isSelected ? 'bg-brand-lavender/10 border-brand-lavender' : 'bg-brand-gray border-transparent'
                      }`}
                    >
                      <View className="flex-1">
                        <Text className={`text-sm font-semibold ${isSelected ? 'text-brand-lavender-700' : 'text-brand-navy'}`}>
                          {opt.label}
                        </Text>
                        <Text className="text-xs text-brand-navy/50 mt-0.5">{opt.desc}</Text>
                      </View>
                      {isSelected && (
                        <View className="w-4 h-4 rounded-full bg-brand-lavender items-center justify-center">
                          <View className="w-2 h-2 rounded-full bg-white" />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          />
        </View>

        <Button
          label="Gửi lời mời"
          variant="primary"
          size="lg"
          loading={isInviting}
          onPress={handleSubmit(onSubmit)}
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
