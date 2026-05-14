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
import { ToastProvider, useToast } from '@/components/ui/Toast';
import Button from '@/components/ui/Button';
import FormField from '@/components/ui/FormField';

// ---------------------------------------------------------------------------
// Validation schema
// ---------------------------------------------------------------------------

const registerSchema = z
  .object({
    displayName: z
      .string()
      .min(1, 'Vui lòng nhập họ và tên.')
      .min(2, 'Họ và tên phải có ít nhất 2 ký tự.')
      .max(60, 'Họ và tên không được vượt quá 60 ký tự.'),
    email: z
      .string()
      .min(1, 'Vui lòng nhập email.')
      .email('Địa chỉ email không hợp lệ.'),
    password: z
      .string()
      .min(1, 'Vui lòng nhập mật khẩu.')
      .min(8, 'Mật khẩu phải có ít nhất 8 ký tự.')
      .regex(/[A-Z]/, 'Mật khẩu phải có ít nhất 1 chữ hoa.')
      .regex(/[0-9]/, 'Mật khẩu phải có ít nhất 1 chữ số.'),
    confirmPassword: z
      .string()
      .min(1, 'Vui lòng xác nhận mật khẩu.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp.',
    path: ['confirmPassword'],
  });

type RegisterForm = z.infer<typeof registerSchema>;

// ---------------------------------------------------------------------------
// Password strength checklist
// ---------------------------------------------------------------------------

interface PasswordChecklistProps {
  password: string;
}

function PasswordChecklist({ password }: PasswordChecklistProps) {
  const checks = [
    { label: 'Ít nhất 8 ký tự', pass: password.length >= 8 },
    { label: 'Có chữ hoa (A–Z)', pass: /[A-Z]/.test(password) },
    { label: 'Có chữ số (0–9)', pass: /[0-9]/.test(password) },
  ];

  if (!password) return null;

  return (
    <View className="mt-2 px-1 gap-y-1">
      {checks.map((c) => (
        <View key={c.label} className="flex-row items-center gap-x-2">
          <Text className={c.pass ? 'text-green-500 text-xs' : 'text-gray-400 text-xs'}>
            {c.pass ? '✓' : '○'}
          </Text>
          <Text
            className={
              c.pass ? 'text-green-600 text-xs' : 'text-gray-400 text-xs'
            }
          >
            {c.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Social button stub
// ---------------------------------------------------------------------------

interface SocialButtonProps {
  label: string;
  onPress: () => void;
}

function SocialButton({ label, onPress }: SocialButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      className="flex-1 items-center justify-center border border-rose-200 rounded-xl py-3 bg-white active:bg-rose-50 mx-1"
    >
      <Text className="text-gray-700 text-sm font-medium">{label}</Text>
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Inner component (needs ToastProvider context)
// ---------------------------------------------------------------------------

function RegisterContent() {
  const router = useRouter();
  const { signUp } = useAuth();
  const { show: showToast } = useToast();
  const [serverError, setServerError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const watchedPassword = watch('password');

  async function onSubmit(data: RegisterForm) {
    setServerError(null);
    const { error } = await signUp(data.email, data.password, data.displayName);
    if (error) {
      setServerError(error);
      return;
    }
    // Supabase sends a confirmation email by default.
    // Show success state; onboarding is the next step after email verification.
    setEmailSent(true);
  }

  function handleSocialStub() {
    showToast('Sắp ra mắt — tính năng này đang được phát triển.', 'info');
  }

  // --- Success state after registration ---
  if (emailSent) {
    return (
      <SafeAreaView className="flex-1 bg-[#fffdf7]">
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-6 pt-12 pb-8 items-center"
        >
          <View className="w-20 h-20 rounded-full bg-rose-100 items-center justify-center mb-6">
            <Text className="text-4xl">💌</Text>
          </View>
          <Text className="text-2xl font-bold text-gray-900 mb-3 text-center">
            Kiểm tra hộp thư của bạn
          </Text>
          <Text className="text-base text-gray-500 text-center mb-8 leading-6">
            Chúng tôi đã gửi email xác nhận đến địa chỉ của bạn. Vui lòng
            kiểm tra hộp thư (kể cả thư mục Spam) và nhấn vào đường dẫn để
            kích hoạt tài khoản.
          </Text>
          <Button
            label="Về trang đăng nhập"
            variant="primary"
            size="lg"
            className="w-full"
            onPress={() => router.replace('/(auth)/login')}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

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
          {/* Header */}
          <View className="mb-8">
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              Tạo tài khoản
            </Text>
            <Text className="text-base text-gray-500">
              Bắt đầu hành trình cùng FollowYourBaby
            </Text>
          </View>

          {/* Form */}
          <View className="gap-y-4">
            <FormField
              control={control}
              name="displayName"
              label="Họ và tên"
              placeholder="Tên của bạn"
              type="text"
              autoComplete="name"
              returnKeyType="next"
            />

            <FormField
              control={control}
              name="email"
              label="Email"
              placeholder="email@example.com"
              type="email"
              autoComplete="email"
              autoCapitalize="none"
              returnKeyType="next"
            />

            <View>
              <FormField
                control={control}
                name="password"
                label="Mật khẩu"
                placeholder="Ít nhất 8 ký tự"
                type="password"
                autoComplete="new-password"
                returnKeyType="next"
              />
              <PasswordChecklist password={watchedPassword} />
            </View>

            <FormField
              control={control}
              name="confirmPassword"
              label="Xác nhận mật khẩu"
              placeholder="Nhập lại mật khẩu"
              type="password"
              autoComplete="new-password"
              returnKeyType="done"
              onSubmitEditing={handleSubmit(onSubmit)}
            />
          </View>

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

          {/* Primary CTA */}
          <Button
            label="Đăng ký"
            variant="primary"
            size="lg"
            className="w-full mt-6"
            loading={isSubmitting}
            disabled={isSubmitting}
            onPress={handleSubmit(onSubmit)}
          />

          {/* Divider */}
          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px bg-rose-100" />
            <Text className="mx-3 text-gray-400 text-sm">hoặc</Text>
            <View className="flex-1 h-px bg-rose-100" />
          </View>

          {/* Social signup stubs */}
          <View className="flex-row">
            <SocialButton label="Google" onPress={handleSocialStub} />
            <SocialButton label="Apple" onPress={handleSocialStub} />
            <SocialButton label="Facebook" onPress={handleSocialStub} />
          </View>

          {/* Login link */}
          <View className="flex-row justify-center mt-8">
            <Text className="text-gray-500 text-sm">Đã có tài khoản? </Text>
            <Pressable
              onPress={() => router.push('/(auth)/login')}
              accessibilityRole="button"
              accessibilityLabel="Đăng nhập"
            >
              <Text className="text-rose-500 text-sm font-semibold">
                Đăng nhập
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Screen export
// ---------------------------------------------------------------------------

export default function RegisterScreen() {
  return (
    <ToastProvider>
      <RegisterContent />
    </ToastProvider>
  );
}
