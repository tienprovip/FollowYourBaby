import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@/lib/zodResolver';
import { z } from 'zod';

import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import FormField from '@/components/ui/FormField';

// ---------------------------------------------------------------------------
// Validation schema
// ---------------------------------------------------------------------------

const forgotSchema = z.object({
  email: z
    .string()
    .min(1, 'Vui lòng nhập email.')
    .email('Địa chỉ email không hợp lệ.'),
});

type ForgotForm = z.infer<typeof forgotSchema>;

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { sendPasswordReset } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [sentEmail, setSentEmail] = useState('');

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ForgotForm>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: '' },
  });

  async function onSubmit(data: ForgotForm) {
    setServerError(null);
    const { error } = await sendPasswordReset(data.email);
    if (error) {
      setServerError(error);
      return;
    }
    setSentEmail(data.email);
    setSent(true);
  }

  // --- Success state ---
  if (sent) {
    return (
      <SafeAreaView className="flex-1 bg-[#fffdf7]">
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-6 pt-12 pb-8 items-center"
        >
          {/* Back arrow */}
          <View className="w-full mb-6">
            <Pressable
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Quay lại"
              className="flex-row items-center py-2"
            >
              <Text className="text-rose-500 text-sm font-medium">
                ← Quay lại đăng nhập
              </Text>
            </Pressable>
          </View>

          <View className="w-20 h-20 rounded-full bg-rose-100 items-center justify-center mb-6">
            <Text className="text-4xl">📬</Text>
          </View>

          <Text className="text-2xl font-bold text-gray-900 mb-3 text-center">
            Kiểm tra hộp thư của bạn
          </Text>

          <Text className="text-base text-gray-500 text-center mb-4 leading-6">
            Chúng tôi đã gửi link đặt lại mật khẩu đến
          </Text>

          <Text className="text-base text-rose-500 font-semibold text-center mb-6">
            {sentEmail}
          </Text>

          <Text className="text-sm text-gray-400 text-center mb-8 leading-6">
            Nếu bạn không nhận được email trong vài phút, vui lòng kiểm tra thư
            mục Spam hoặc thử lại với địa chỉ email khác.
          </Text>

          <Button
            label="Về trang đăng nhập"
            variant="primary"
            size="lg"
            className="w-full"
            onPress={() => router.replace('/(auth)/login')}
          />

          <Button
            label="Thử email khác"
            variant="ghost"
            size="md"
            className="w-full mt-3"
            onPress={() => {
              setSent(false);
              setSentEmail('');
              setServerError(null);
            }}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // --- Request state ---
  return (
    <SafeAreaView className="flex-1 bg-[#fffdf7]">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-6 pt-12 pb-8"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back link */}
          <View className="mb-8">
            <Pressable
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Quay lại"
              className="flex-row items-center py-2 self-start"
            >
              <Text className="text-rose-500 text-sm font-medium">
                ← Quay lại đăng nhập
              </Text>
            </Pressable>
          </View>

          {/* Header */}
          <View className="mb-8">
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              Quên mật khẩu?
            </Text>
            <Text className="text-base text-gray-500 leading-6">
              Nhập email đã đăng ký để nhận link đặt lại mật khẩu.
            </Text>
          </View>

          {/* Form */}
          <FormField
            control={control}
            name="email"
            label="Email"
            placeholder="email@example.com"
            type="email"
            autoComplete="email"
            autoCapitalize="none"
            returnKeyType="done"
            onSubmitEditing={handleSubmit(onSubmit)}
          />

          {/* Server error */}
          {serverError ? (
            <View className="mt-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <Text
                className="text-red-600 text-sm"
                accessibilityRole="alert"
              >
                {serverError}
              </Text>
            </View>
          ) : null}

          {/* CTA */}
          <Button
            label="Gửi link đặt lại"
            variant="primary"
            size="lg"
            className="w-full mt-6"
            loading={isSubmitting}
            disabled={isSubmitting}
            onPress={handleSubmit(onSubmit)}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
