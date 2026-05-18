import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@/lib/zodResolver';

import Button from '@/components/ui/Button';
import FormField from '@/components/ui/FormField';
import { ToastProvider, useToast } from '@/components/ui/Toast';
import {
  AuthHeader,
  AuthScreen,
  Divider,
  LockIcon,
  MailIcon,
  SocialButton,
} from '@/components/auth/AuthChrome';
import { useAuth } from '@/hooks/useAuth';

const loginSchema = z.object({
  email: z.string().min(1, 'Nhập email nhé.').email('Email chưa đúng định dạng.'),
  password: z.string().min(1, 'Nhập mật khẩu nhé.').min(8, 'Mật khẩu phải có ít nhất 8 ký tự.'),
});

type LoginForm = z.infer<typeof loginSchema>;

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
  }

  function handleSocialStub() {
    showToast('Tính năng này sắp ra mắt nhé.', 'info');
  }

  return (
    <AuthScreen contentClassName="min-h-full justify-center">
      <AuthHeader
        title="Chào mừng trở lại!"
        subtitle={
          <>
            Đăng nhập để tiếp tục hành trình cùng{' '}
            <Text className="font-bold text-brand-pink-500">FollowYourBaby</Text>
          </>
        }
      />

      <View className="gap-y-4">
        <FormField
          control={control}
          name="email"
          placeholder="Email hoặc số điện thoại"
          type="email"
          autoComplete="email"
          autoCapitalize="none"
          prefixIcon={<MailIcon />}
          returnKeyType="next"
        />

        <FormField
          control={control}
          name="password"
          placeholder="Mật khẩu"
          type="password"
          autoComplete="password"
          prefixIcon={<LockIcon />}
          returnKeyType="done"
          onSubmitEditing={handleSubmit(onSubmit)}
        />
      </View>

      {serverError ? (
        <View className="mt-3 rounded-input border border-red-200 bg-red-50 px-4 py-3">
          <Text className="text-sm text-red-600" accessibilityRole="alert">
            {serverError}
          </Text>
        </View>
      ) : null}

      <Pressable
        onPress={() => router.push('/(auth)/forgot-password')}
        accessibilityRole="button"
        accessibilityLabel="Quên mật khẩu"
        className="mt-3 self-end py-2"
      >
        <Text className="text-sm font-semibold text-brand-lavender-600">Quên mật khẩu?</Text>
      </Pressable>

      <Button
        label="Đăng nhập"
        variant="primary"
        size="lg"
        className="mt-5 w-full shadow-brand"
        loading={isSubmitting}
        disabled={isSubmitting}
        onPress={handleSubmit(onSubmit)}
      />

      <Divider label="hoặc đăng nhập với" />

      <View className="flex-row gap-x-3">
        <View className="flex-1">
          <SocialButton label="Google" provider="google" onPress={handleSocialStub} />
        </View>
        <View className="flex-1">
          <SocialButton label="Apple" provider="apple" onPress={handleSocialStub} />
        </View>
      </View>
      <View className="mt-3 flex-row gap-x-3">
        <View className="flex-1">
          <SocialButton label="Facebook" provider="facebook" onPress={handleSocialStub} />
        </View>
        <View className="flex-1" />
      </View>

      <View className="mt-8 min-h-[24px] flex-row items-center justify-center">
        <Text className="text-sm text-brand-navy/60">Chưa có tài khoản? </Text>
        <Pressable
          onPress={() => router.push('/(auth)/register')}
          accessibilityRole="button"
          accessibilityLabel="Đăng ký ngay"
        >
          <Text className="text-sm font-bold text-brand-pink-500">Đăng ký ngay</Text>
        </Pressable>
      </View>
    </AuthScreen>
  );
}

export default function LoginScreen() {
  return (
    <ToastProvider>
      <LoginContent />
    </ToastProvider>
  );
}
