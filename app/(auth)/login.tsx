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

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Vui lòng nhập email.')
    .email('Địa chỉ email không hợp lệ.'),
  password: z
    .string()
    .min(1, 'Vui lòng nhập mật khẩu.')
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự.'),
});

type LoginForm = z.infer<typeof loginSchema>;

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

function LoginContent() {
  const router = useRouter();
  const { signIn } = useAuth();
  const { show: showToast } = useToast();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(data: LoginForm) {
    setServerError(null);
    const { error } = await signIn(data.email, data.password);
    if (error) {
      setServerError(error);
    }
    // NavigationGuard in _layout.tsx handles redirect once user is set
  }

  function handleSocialStub() {
    showToast('Sắp ra mắt — tính năng này đang được phát triển.', 'info');
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
              Chào mừng trở lại
            </Text>
            <Text className="text-base text-gray-500">
              Đăng nhập để tiếp tục hành trình của bạn
            </Text>
          </View>

          {/* Form */}
          <View className="gap-y-4">
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

            <FormField
              control={control}
              name="password"
              label="Mật khẩu"
              placeholder="Ít nhất 8 ký tự"
              type="password"
              autoComplete="password"
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

          {/* Forgot password */}
          <View className="items-end mt-3 mb-6">
            <Pressable
              onPress={() => router.push('/(auth)/forgot-password')}
              accessibilityRole="button"
              accessibilityLabel="Quên mật khẩu"
              className="py-1"
            >
              <Text className="text-rose-500 text-sm font-medium">
                Quên mật khẩu?
              </Text>
            </Pressable>
          </View>

          {/* Primary CTA */}
          <Button
            label="Đăng nhập"
            variant="primary"
            size="lg"
            className="w-full"
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

          {/* Social login stubs */}
          <View className="flex-row">
            <SocialButton label="Google" onPress={handleSocialStub} />
            <SocialButton label="Apple" onPress={handleSocialStub} />
            <SocialButton label="Facebook" onPress={handleSocialStub} />
          </View>

          {/* Register link */}
          <View className="flex-row justify-center mt-8">
            <Text className="text-gray-500 text-sm">Chưa có tài khoản? </Text>
            <Pressable
              onPress={() => router.push('/(auth)/register')}
              accessibilityRole="button"
              accessibilityLabel="Đăng ký tài khoản mới"
            >
              <Text className="text-rose-500 text-sm font-semibold">
                Đăng ký
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Screen export — wraps with ToastProvider so useToast works
// ---------------------------------------------------------------------------

export default function LoginScreen() {
  return (
    <ToastProvider>
      <LoginContent />
    </ToastProvider>
  );
}
