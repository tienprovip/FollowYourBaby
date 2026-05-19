import React, { useState } from 'react';
import {
  Image,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { JOURNEY } from '@/lib/constants';
import type { Journey } from '@/lib/constants';
import { useOnboardingStore } from '@/stores/onboardingStore';

const BRAND_NAVY = '#1F2B5B';
const BRAND_PINK = '#F45B7F';

const ONBOARDING_IMAGES = {
  pregnant: require('../../assets/images/intro/intro-pregnancy.png'),
  baby: require('../../assets/images/intro/intro-baby.png'),
  family: require('../../assets/images/intro/intro-family.png'),
} satisfies Record<string, ImageSourcePropType>;

interface JourneyOption {
  key: Journey;
  image: ImageSourcePropType;
  title: string;
  description: string;
}

const JOURNEY_OPTIONS: JourneyOption[] = [
  {
    key: JOURNEY.PREGNANT,
    image: ONBOARDING_IMAGES.pregnant,
    title: 'Đang mang bầu',
    description: 'Theo dõi thai kỳ và nhận kiến thức cho mẹ bầu',
  },
  {
    key: JOURNEY.HAS_BABY,
    image: ONBOARDING_IMAGES.baby,
    title: 'Đã có em bé',
    description: 'Theo dõi sự phát triển và chăm sóc bé yêu',
  },
  {
    key: JOURNEY.MULTIPLE,
    image: ONBOARDING_IMAGES.family,
    title: 'Nhiều em bé',
    description: 'Tôi đang chăm sóc nhiều hơn một bé',
  },
];

function OnboardingStepper({ currentStep }: { currentStep: number }) {
  return (
    <View style={styles.stepper}>
      {[0, 1, 2].map((step, index) => (
        <React.Fragment key={step}>
          <View
            style={[
              styles.stepDot,
              step === currentStep ? styles.stepDotActive : styles.stepDotInactive,
            ]}
          />
          {index < 2 && (
            <View
              style={[
                styles.stepLine,
                index < currentStep ? styles.stepLineActive : styles.stepLineInactive,
              ]}
            />
          )}
        </React.Fragment>
      ))}
    </View>
  );
}

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
      style={[styles.journeyCard, selected && styles.journeyCardSelected]}
    >
      <Image source={option.image} resizeMode="contain" style={styles.journeyImage} />

      <View style={styles.journeyText}>
        <Text style={styles.journeyTitle}>{option.title}</Text>
        <Text style={styles.journeyDescription}>{option.description}</Text>
      </View>

      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected ? <Text style={styles.radioCheck}>✓</Text> : null}
      </View>
    </Pressable>
  );
}

export default function JourneyScreen() {
  const router = useRouter();
  const setJourney = useOnboardingStore((s) => s.setJourney);
  const storedJourney = useOnboardingStore((s) => s.journey);

  const [selected, setSelected] = useState<Journey | null>(
    storedJourney ?? JOURNEY.PREGNANT,
  );

  function handleContinue() {
    if (!selected) return;
    setJourney(selected);
    router.push('/(onboarding)/survey');
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topRow}>
          <Text style={styles.backIcon}>{'<'}</Text>
          <OnboardingStepper currentStep={0} />
          <View style={styles.backSpacer} />
        </View>

        <View style={styles.header}>
          <Text style={styles.heading}>Chào mừng bạn!</Text>
          <Text style={styles.subheading}>
            Hãy cho chúng tôi biết tình trạng hiện tại để cá nhân hóa trải nghiệm phù hợp với bạn nhé.
          </Text>
        </View>

        <View accessibilityRole="radiogroup" accessibilityLabel="Chọn trạng thái">
          {JOURNEY_OPTIONS.map((option) => (
            <JourneyCard
              key={option.key}
              option={option}
              selected={selected === option.key}
              onPress={() => setSelected(option.key)}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Tiếp tục"
          onPress={handleContinue}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>Tiếp tục</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff5f7',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 112,
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  backIcon: {
    color: BRAND_NAVY,
    fontSize: 34,
    lineHeight: 34,
    width: 36,
  },
  backSpacer: {
    width: 36,
  },
  stepper: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  stepDot: {
    borderRadius: 999,
    height: 12,
    width: 12,
  },
  stepDotActive: {
    backgroundColor: BRAND_PINK,
  },
  stepDotInactive: {
    backgroundColor: '#D8D2D6',
  },
  stepLine: {
    height: 2,
    width: 54,
  },
  stepLineActive: {
    backgroundColor: '#F8A4B7',
  },
  stepLineInactive: {
    backgroundColor: '#E4DEE2',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  heading: {
    color: BRAND_NAVY,
    fontFamily: 'Nunito',
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 31,
    marginBottom: 12,
    textAlign: 'center',
  },
  subheading: {
    color: '#2E3158',
    fontSize: 15,
    lineHeight: 24,
    maxWidth: 318,
    textAlign: 'center',
  },
  journeyCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#EFE3E8',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 128,
    marginBottom: 16,
    paddingHorizontal: 16,
    shadowColor: '#8A5160',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 14,
  },
  journeyCardSelected: {
    borderColor: BRAND_PINK,
    shadowColor: BRAND_PINK,
    shadowOpacity: 0.12,
  },
  journeyImage: {
    height: 96,
    marginRight: 16,
    width: 110,
  },
  journeyText: {
    flex: 1,
  },
  journeyTitle: {
    color: BRAND_NAVY,
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 24,
    marginBottom: 8,
  },
  journeyDescription: {
    color: '#3F4166',
    fontSize: 14,
    lineHeight: 22,
  },
  radio: {
    alignItems: 'center',
    borderColor: '#DDD5DC',
    borderRadius: 999,
    borderWidth: 1.5,
    height: 24,
    justifyContent: 'center',
    marginLeft: 12,
    width: 24,
  },
  radioSelected: {
    backgroundColor: BRAND_PINK,
    borderColor: BRAND_PINK,
  },
  radioCheck: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    lineHeight: 20,
  },
  footer: {
    backgroundColor: '#fff5f7',
    bottom: 0,
    left: 0,
    paddingBottom: 34,
    paddingHorizontal: 24,
    paddingTop: 12,
    position: 'absolute',
    right: 0,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: BRAND_PINK,
    borderRadius: 18,
    height: 56,
    justifyContent: 'center',
    shadowColor: BRAND_PINK,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
});
