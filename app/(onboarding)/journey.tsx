import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { JOURNEY } from '@/lib/constants';
import type { Journey } from '@/lib/constants';
import { useOnboardingStore } from '@/stores/onboardingStore';
import Stepper from '@/components/ui/Stepper';
import Button from '@/components/ui/Button';

// ---------------------------------------------------------------------------
// Journey card data
// ---------------------------------------------------------------------------

interface JourneyOption {
  key: Journey;
  icon: string;
  title: string;
  description: string;
}

const JOURNEY_OPTIONS: JourneyOption[] = [
  {
    key: JOURNEY.PREGNANT,
    icon: 'O',
    title: 'Mang thai',
    description: 'Theo dõi thai kỳ, lịch khám, thai máy',
  },
  {
    key: JOURNEY.HAS_BABY,
    icon: 'B',
    title: 'Có em bé',
    description: 'Theo dõi bú, ngủ, tã và phát triển',
  },
  {
    key: JOURNEY.MULTIPLE,
    icon: 'M',
    title: 'Nhiều bé',
    description: 'Quản lý nhiều bé hoặc sinh đôi',
  },
];

// ---------------------------------------------------------------------------
// Journey card
// ---------------------------------------------------------------------------

interface JourneyCardProps {
  option: JourneyOption;
  selected: boolean;
  onPress: () => void;
}

function JourneyCard({ option, selected, onPress }: JourneyCardProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityLabel={option.title}
      accessibilityState={{ selected }}
      className={[
        'flex-row items-center rounded-2xl px-5 py-5 mb-4 border-2 min-h-[96px]',
        selected
          ? 'border-rose-500 bg-rose-50'
          : 'border-rose-100 bg-white',
      ].join(' ')}
    >
      {/* Icon placeholder circle */}
      <View
        className={[
          'w-14 h-14 rounded-2xl items-center justify-center mr-4',
          selected ? 'bg-rose-500' : 'bg-rose-100',
        ].join(' ')}
      >
        <Text
          className={[
            'text-2xl font-bold',
            selected ? 'text-white' : 'text-rose-400',
          ].join(' ')}
        >
          {option.icon}
        </Text>
      </View>

      {/* Text block */}
      <View className="flex-1">
        <Text
          className={[
            'text-lg font-bold mb-1',
            selected ? 'text-rose-600' : 'text-gray-900',
          ].join(' ')}
        >
          {option.title}
        </Text>
        <Text className="text-sm text-gray-500 leading-5">
          {option.description}
        </Text>
      </View>

      {/* Selection indicator */}
      <View
        className={[
          'w-6 h-6 rounded-full border-2 items-center justify-center ml-3',
          selected ? 'border-rose-500 bg-rose-500' : 'border-rose-200 bg-white',
        ].join(' ')}
      >
        {selected && (
          <Text className="text-white text-xs font-bold">v</Text>
        )}
      </View>
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export default function JourneyScreen() {
  const router = useRouter();
  const setJourney = useOnboardingStore((s) => s.setJourney);
  const storedJourney = useOnboardingStore((s) => s.journey);

  const [selected, setSelected] = useState<Journey | null>(storedJourney);

  function handleSelect(j: Journey) {
    setSelected(j);
  }

  function handleContinue() {
    if (!selected) return;
    setJourney(selected);
    router.push('/(onboarding)/survey');
  }

  return (
    <SafeAreaView className="flex-1 bg-[#fffdf7]">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 pt-8 pb-10"
        showsVerticalScrollIndicator={false}
      >
        {/* Progress stepper */}
        <Stepper steps={3} currentStep={0} className="mb-10" />

        {/* Header */}
        <View className="mb-8">
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            Chào mừng bạn!
          </Text>
          <Text className="text-base text-gray-500 leading-6">
            Chỉ vài bước nhỏ thôi nhé. Trước tiên, hành trình của bạn là gì?
          </Text>
        </View>

        {/* Journey cards */}
        <View accessibilityRole="radiogroup" accessibilityLabel="Chọn hành trình">
          {JOURNEY_OPTIONS.map((option) => (
            <JourneyCard
              key={option.key}
              option={option}
              selected={selected === option.key}
              onPress={() => handleSelect(option.key)}
            />
          ))}
        </View>
      </ScrollView>

      {/* Bottom CTA — fixed above keyboard */}
      <View className="px-6 pb-8 pt-3 bg-[#fffdf7] border-t border-rose-50">
        <Button
          label="Tiếp tục"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={!selected}
          onPress={handleContinue}
        />
      </View>
    </SafeAreaView>
  );
}
