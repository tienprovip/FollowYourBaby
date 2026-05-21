import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useCareShares } from '@/hooks/useCareShares';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui';

type AcceptState = 'idle' | 'loading' | 'accepted' | 'error';

export default function AcceptInviteScreen() {
  const { token } = useLocalSearchParams<{ token: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { acceptInvite } = useCareShares();

  const [state, setState] = useState<AcceptState>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!token || !user) return;
    handleAccept();
    // Run only once when screen mounts with a valid token
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user]);

  async function handleAccept() {
    if (!token) return;
    setState('loading');
    try {
      await acceptInvite(token);
      setState('accepted');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Lời mời không hợp lệ hoặc đã hết hạn.');
      setState('error');
    }
  }

  if (!user) {
    return (
      <>
        <Stack.Screen options={{ title: 'Lời mời chăm sóc', headerShown: false }} />
        <SafeAreaView
          className="flex-1 items-center justify-center bg-brand-peach px-6 gap-y-4"
          edges={['top']}
        >
          <Text className="text-2xl font-bold text-brand-navy text-center">
            Vui lòng đăng nhập trước
          </Text>
          <Text className="text-sm text-brand-navy/60 text-center">
            Bạn cần đăng nhập để chấp nhận lời mời chia sẻ chăm sóc.
          </Text>
          <Button
            label="Đăng nhập"
            variant="primary"
            size="lg"
            onPress={() => router.replace('/(auth)/login')}
          />
        </SafeAreaView>
      </>
    );
  }

  if (state === 'loading') {
    return (
      <>
        <Stack.Screen options={{ title: 'Đang xử lý...', headerShown: false }} />
        <SafeAreaView
          className="flex-1 items-center justify-center bg-brand-peach gap-y-4"
          edges={['top']}
        >
          <ActivityIndicator color="#FF8FA8" size="large" />
          <Text className="text-sm text-brand-navy/60">Đang xác nhận lời mời...</Text>
        </SafeAreaView>
      </>
    );
  }

  if (state === 'accepted') {
    return (
      <>
        <Stack.Screen options={{ title: 'Lời mời đã chấp nhận', headerShown: false }} />
        <SafeAreaView
          className="flex-1 items-center justify-center bg-brand-peach px-6 gap-y-4"
          edges={['top']}
        >
          <View className="w-16 h-16 rounded-full bg-brand-mint/30 items-center justify-center mb-2">
            <Text className="text-3xl">✓</Text>
          </View>
          <Text className="text-2xl font-bold text-brand-navy text-center">
            Đã chấp nhận lời mời!
          </Text>
          <Text className="text-sm text-brand-navy/60 text-center">
            Bạn giờ có thể xem dữ liệu được chia sẻ từ trang chia sẻ chăm sóc.
          </Text>
          <Button
            label="Về trang chủ"
            variant="primary"
            size="lg"
            onPress={() => router.replace('/(tabs)')}
          />
        </SafeAreaView>
      </>
    );
  }

  if (state === 'error') {
    return (
      <>
        <Stack.Screen options={{ title: 'Lỗi', headerShown: false }} />
        <SafeAreaView
          className="flex-1 items-center justify-center bg-brand-peach px-6 gap-y-4"
          edges={['top']}
        >
          <Text className="text-2xl font-bold text-brand-navy text-center">
            Không thể chấp nhận lời mời
          </Text>
          <Text className="text-sm text-red-500 text-center">{errorMsg}</Text>
          <Button
            label="Về trang chủ"
            variant="secondary"
            size="lg"
            onPress={() => router.replace('/(tabs)')}
          />
        </SafeAreaView>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Lời mời chăm sóc', headerShown: false }} />
      <SafeAreaView
        className="flex-1 items-center justify-center bg-brand-peach px-6 gap-y-4"
        edges={['top']}
      >
        <Text className="text-2xl font-bold text-brand-navy text-center">
          Bạn được mời chia sẻ chăm sóc
        </Text>
        <Text className="text-sm text-brand-navy/60 text-center">
          Nhấn nút bên dưới để chấp nhận và xem dữ liệu được chia sẻ.
        </Text>
        <Button label="Chấp nhận lời mời" variant="primary" size="lg" onPress={handleAccept} />
      </SafeAreaView>
    </>
  );
}
