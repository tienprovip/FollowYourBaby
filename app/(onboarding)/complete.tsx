import React from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { useOnboardingStore } from '@/stores/onboardingStore';
import { useOnboarding } from '@/hooks/useOnboarding';
import Stepper from '@/components/ui/Stepper';
import Button from '@/components/ui/Button';

// ---------------------------------------------------------------------------
// Summary helpers
// ---------------------------------------------------------------------------

function buildSummary(
  journey: string | null,
  babyName: string,
  dueDate: string | null,
  birthDate: string | null,
): string {
  if (journey === 'pregnant') {
    if (dueDate) {
      const [year, month, day] = dueDate.split('-');
      return `Chúng tôi sẽ đồng hành cùng bạn trong hành trình mang thai, với ngày dự sinh ${day}/${month}/${year}.`;
    }
    return 'Chúng tôi sẽ đồng hành cùng bạn trong suốt hành trình mang thai.';
  }

  const name = babyName.trim() || 'em bé của bạn';

  if (journey === 'multiple') {
    return `Sẵn sàng theo dõi hành trình phát triển của ${name} và các bé khác!`;
  }

  if (birthDate) {
    const [year, month, day] = birthDate.split('-');
    return `Sẵn sàng đồng hành cùng ${name} (sinh ngày ${day}/${month}/${year}) mỗi ngày!`;
  }

  return `Sẵn sàng đồng hành cùng ${name} mỗi ngày!`;
}

function journeyIllustration(journey: string | null): string {
  switch (journey) {
    case 'pregnant':
      return 'O';
    case 'multiple':
      return 'BB';
    default:
      return 'B';
  }
}

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export default function CompleteScreen() {
  const router = useRouter();
  const store = useOnboardingStore();
  const { submit, isSubmitting, submitError } = useOnboarding();

  const { journey, babyName, dueDate, birthDate } = store;

  const summary = buildSummary(journey, babyName, dueDate, birthDate);
  const illustration = journeyIllustration(journey);

  function handleBack() {
    router.back();
  }

  async function handleEnter() {
    await submit();
    // Navigation to /(tabs)/ is handled inside submit() on success
  }

  return (
    <SafeAreaView className="flex-1 bg-[#fffdf7]">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 pt-8 pb-10"
        showsVerticalScrollIndicator={false}
      >
        {/* Progress stepper */}
        <Stepper steps={3} currentStep={2} className="mb-10" />

        {/* Back button */}
        <Pressable
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel="Quay lại"
          className="mb-5 self-start py-1"
        >
          <Text className="text-rose-500 text-sm font-medium">
            Quay lại
          </Text>
        </Pressable>

        {/* Illustration */}
        <View className="items-center mt-4 mb-8">
          <View className="w-28 h-28 rounded-full bg-rose-100 items-center justify-center mb-4">
            <Text className="text-5xl font-bold text-rose-400">
              {illustration}
            </Text>
          </View>
          <Text className="text-2xl font-bold text-gray-900 text-center mb-3">
            Tất cả đã sẵn sàng!
          </Text>
          <Text className="text-base text-gray-500 text-center leading-6 px-4">
            {summary}
          </Text>
        </View>

        {/* Feature highlights */}
        <View className="bg-white rounded-2xl border border-rose-100 px-5 py-4 mb-6">
          <Text className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
            Bạn sẽ có
          </Text>
          {[
            'Theo dõi hàng ngày phù hợp với hành trình của bạn',
            'Trợ lý AI tư vấn cá nhân hóa, 24/7',
            'Nhắc việc thông minh: khám, tiêm phòng, ăn, ngủ',
            'Biểu đồ phát triển và báo cáo tổng hợp',
          ].map((item) => (
            <View key={item} className="flex-row items-start mb-2 last:mb-0">
              <View className="w-5 h-5 rounded-full bg-rose-500 items-center justify-center mr-3 mt-0.5 shrink-0">
                <Text className="text-white text-xs font-bold">v</Text>
              </View>
              <Text className="text-sm text-gray-600 leading-5 flex-1">{item}</Text>
            </View>
          ))}
        </View>

        {/* Error state */}
        {submitError ? (
          <View className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
            <Text
              className="text-red-600 text-sm"
              accessibilityRole="alert"
            >
              {submitError}
            </Text>
          </View>
        ) : null}
      </ScrollView>

      {/* Bottom CTA */}
      <View className="px-6 pb-8 pt-3 bg-[#fffdf7] border-t border-rose-50">
        <Button
          label="Vào app"
          variant="primary"
          size="lg"
          className="w-full"
          loading={isSubmitting}
          disabled={isSubmitting}
          onPress={handleEnter}
        />
      </View>
    </SafeAreaView>
  );
}
