import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@/lib/zodResolver';

import Button from '@/components/ui/Button';
import FormField from '@/components/ui/FormField';
import { ToastProvider, useToast } from '@/components/ui/Toast';
import {
  AuthHeader,
  AuthScreen,
  AuthTabs,
  BackButton,
  LockIcon,
  MailIcon,
  SuccessPanel,
  UserIcon,
} from '@/components/auth/AuthChrome';
import { cn } from '@/lib/cn';
import { useAuth } from '@/hooks/useAuth';

const registerSchema = z
  .object({
    displayName: z
      .string()
      .min(1, 'Nhập họ và tên nhé.')
      .min(2, 'Họ và tên phải có ít nhất 2 ký tự.')
      .max(60, 'Họ và tên không được vượt quá 60 ký tự.'),
    email: z.string().min(1, 'Nhập email nhé.').email('Email chưa đúng định dạng.'),
    password: z
      .string()
      .min(1, 'Nhập mật khẩu nhé.')
      .min(8, 'Mật khẩu phải có ít nhất 8 ký tự.')
      .regex(/[A-Z]/, 'Mật khẩu phải có ít nhất 1 chữ hoa.')
      .regex(/[0-9]/, 'Mật khẩu phải có ít nhất 1 chữ số.'),
    confirmPassword: z.string().min(1, 'Nhập lại mật khẩu nhé.'),
    acceptedTerms: z.boolean().refine((value) => value, 'Đồng ý với điều khoản để tiếp tục nhé.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp.',
    path: ['confirmPassword'],
  });

type RegisterForm = z.infer<typeof registerSchema>;

interface PasswordChecklistProps {
  password: string;
}

function PasswordChecklist({ password }: PasswordChecklistProps) {
  const checks = [
    { label: 'Ít nhất 8 ký tự', pass: password.length >= 8 },
    { label: 'Có chữ hoa A-Z', pass: /[A-Z]/.test(password) },
    { label: 'Có chữ số 0-9', pass: /[0-9]/.test(password) },
  ];

  if (!password) return null;

  return (
    <View className="mt-2 gap-y-1 px-1">
      {checks.map((check) => (
        <View key={check.label} className="flex-row items-center gap-x-2">
          <Text
            className={cn(
              'text-xs font-bold',
              check.pass ? 'text-green-600' : 'text-brand-navy/35',
            )}
          >
            {check.pass ? '✓' : '○'}
          </Text>
          <Text className={cn('text-xs', check.pass ? 'text-green-700' : 'text-brand-navy/45')}>
            {check.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

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
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptedTerms: false,
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
    setEmailSent(true);
  }

  function handlePhoneStub() {
    showToast('Đăng ký bằng số điện thoại sắp ra mắt.', 'info');
  }

  if (emailSent) {
    return (
      <AuthScreen contentClassName="min-h-full justify-center">
        <BackButton label="Quay lại đăng nhập" onPress={() => router.replace('/(auth)/login')} />
        <AuthHeader
          title="Kiểm tra hộp thư"
          subtitle="Chúng tôi đã gửi email xác nhận tài khoản của bạn."
        />
        <SuccessPanel
          title="Yêu cầu đã được gửi!"
          message="Vui lòng kiểm tra email để kích hoạt tài khoản trước khi đăng nhập."
        />
        <Button
          label="Quay lại đăng nhập"
          variant="primary"
          size="lg"
          className="mt-8 w-full"
          onPress={() => router.replace('/(auth)/login')}
        />
      </AuthScreen>
    );
  }

  return (
    <AuthScreen>
      <BackButton label="Quay lại đăng nhập" onPress={() => router.back()} />

      <AuthHeader title="Tạo tài khoản" subtitle="Đồng hành cùng mẹ và bé ngay hôm nay" />

      <AuthTabs onPhonePress={handlePhoneStub} />

      <View className="gap-y-3">
        <FormField
          control={control}
          name="displayName"
          placeholder="Họ và tên"
          type="text"
          autoComplete="name"
          prefixIcon={<UserIcon />}
          returnKeyType="next"
        />

        <FormField
          control={control}
          name="email"
          placeholder="Email"
          type="email"
          autoComplete="email"
          autoCapitalize="none"
          prefixIcon={<MailIcon />}
          returnKeyType="next"
        />

        <View>
          <FormField
            control={control}
            name="password"
            placeholder="Mật khẩu"
            type="password"
            autoComplete="new-password"
            prefixIcon={<LockIcon />}
            returnKeyType="next"
          />
          <PasswordChecklist password={watchedPassword} />
        </View>

        <FormField
          control={control}
          name="confirmPassword"
          placeholder="Xác nhận mật khẩu"
          type="password"
          autoComplete="new-password"
          prefixIcon={<LockIcon />}
          returnKeyType="done"
          onSubmitEditing={handleSubmit(onSubmit)}
        />
      </View>

      <Controller
        control={control}
        name="acceptedTerms"
        render={({ field: { onChange, value } }) => (
          <Pressable
            onPress={() => onChange(!value)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: value }}
            accessibilityLabel="Tôi đồng ý với điều khoản sử dụng và chính sách bảo mật"
            className="mt-4 flex-row items-start"
          >
            <View
              className={cn(
                'mr-3 mt-0.5 h-5 w-5 items-center justify-center rounded border-2',
                value
                  ? 'border-brand-pink-500 bg-brand-pink-500'
                  : 'border-brand-navy bg-brand-navy/5',
              )}
            >
              {value ? <Text className="text-xs font-bold text-white">✓</Text> : null}
            </View>
            <Text className="flex-1 text-sm leading-5 text-brand-navy/65">
              Tôi đồng ý với{' '}
              <Text className="font-semibold text-brand-lavender-600">Điều khoản sử dụng</Text> và{' '}
              <Text className="font-semibold text-brand-lavender-600">Chính sách bảo mật</Text>
            </Text>
          </Pressable>
        )}
      />
      {errors.acceptedTerms ? (
        <Text className="mt-1 text-xs text-red-500" accessibilityRole="alert">
          {errors.acceptedTerms.message}
        </Text>
      ) : null}

      {serverError ? (
        <View className="mt-3 rounded-input border border-red-200 bg-red-50 px-4 py-3">
          <Text className="text-sm text-red-600" accessibilityRole="alert">
            {serverError}
          </Text>
        </View>
      ) : null}

      <Button
        label="Đăng ký"
        variant="primary"
        size="lg"
        className="mt-7 w-full shadow-brand"
        loading={isSubmitting}
        disabled={isSubmitting}
        onPress={handleSubmit(onSubmit)}
      />

      <View className="mt-8 flex-row justify-center">
        <Text className="text-sm text-brand-navy/60">Đã có tài khoản? </Text>
        <Pressable
          onPress={() => router.push('/(auth)/login')}
          accessibilityRole="button"
          accessibilityLabel="Đăng nhập"
        >
          <Text className="text-sm font-bold text-brand-pink-500">Đăng nhập</Text>
        </Pressable>
      </View>
    </AuthScreen>
  );
}

export default function RegisterScreen() {
  return (
    <ToastProvider>
      <RegisterContent />
    </ToastProvider>
  );
}
