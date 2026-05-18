import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@/lib/zodResolver';

import Button from '@/components/ui/Button';
import FormField from '@/components/ui/FormField';
import {
  AuthHeader,
  AuthIllustration,
  AuthScreen,
  BackButton,
  SuccessPanel,
} from '@/components/auth/AuthChrome';
import { useAuth } from '@/hooks/useAuth';

const forgotSchema = z.object({
  email: z
    .string()
    .min(1, 'Nhập email nhé.')
    .email('Email chưa đúng định dạng.'),
});

type ForgotForm = z.infer<typeof forgotSchema>;

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

  if (sent) {
    return (
      <AuthScreen contentClassName="min-h-full">
        <BackButton
          label="Quay lại đăng nhập"
          onPress={() => router.replace('/(auth)/login')}
        />

        <AuthHeader
          title="Quên mật khẩu"
          subtitle="Yêu cầu đặt lại mật khẩu đã được gửi thành công."
        />

        <AuthIllustration variant="lock" />

        <SuccessPanel
          title="Yêu cầu đã được gửi!"
          message={`Vui lòng kiểm tra ${sentEmail} để đặt lại mật khẩu.`}
        />

        <Button
          label="Quay lại đăng nhập"
          variant="ghost"
          size="lg"
          className="mt-7 w-full border border-brand-lavender-400"
          textClassName="text-brand-lavender-600"
          onPress={() => router.replace('/(auth)/login')}
        />
      </AuthScreen>
    );
  }

  return (
    <AuthScreen contentClassName="min-h-full">
      <BackButton label="Quay lại đăng nhập" onPress={() => router.back()} />

      <AuthHeader
        title="Quên mật khẩu"
        subtitle="Nhập email đã đăng ký để nhận hướng dẫn đặt lại mật khẩu."
      />

      <AuthIllustration variant="lock" />

      <FormField
        control={control}
        name="email"
        placeholder="Email hoặc số điện thoại"
        type="email"
        autoComplete="email"
        autoCapitalize="none"
        returnKeyType="done"
        onSubmitEditing={handleSubmit(onSubmit)}
      />

      {serverError ? (
        <View className="mt-3 rounded-input border border-red-200 bg-red-50 px-4 py-3">
          <Text className="text-sm text-red-600" accessibilityRole="alert">
            {serverError}
          </Text>
        </View>
      ) : null}

      <Button
        label="Gửi yêu cầu"
        variant="primary"
        size="lg"
        className="mt-7 w-full shadow-brand"
        loading={isSubmitting}
        disabled={isSubmitting}
        onPress={handleSubmit(onSubmit)}
      />
    </AuthScreen>
  );
}
