import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { useOnboarding } from '@/hooks/useOnboarding';

const BRAND_NAVY = '#1F2B5B';
const BRAND_PINK = '#F45B7F';

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

function CompleteIllustration() {
  return (
    <Svg width={250} height={250} viewBox="0 0 250 250">
      <Rect x="37" y="48" width="9" height="22" rx="2" fill="#8DDCCB" transform="rotate(-54 41 59)" />
      <Rect x="206" y="48" width="9" height="22" rx="2" fill="#F8A4B7" transform="rotate(39 210 59)" />
      <Rect x="66" y="32" width="8" height="8" rx="1" fill="#F6C37B" transform="rotate(-13 70 36)" />
      <Rect x="183" y="30" width="9" height="9" rx="1" fill="#F6C37B" transform="rotate(34 187 34)" />
      <Rect x="25" y="136" width="18" height="7" rx="2" fill="#F6C37B" transform="rotate(9 34 139)" />
      <Rect x="214" y="128" width="8" height="22" rx="2" fill="#8DDCCB" transform="rotate(17 218 139)" />
      <Rect x="56" y="177" width="8" height="19" rx="2" fill="#F8A4B7" transform="rotate(-49 60 186)" />
      <Rect x="191" y="177" width="18" height="7" rx="2" fill="#8DDCCB" transform="rotate(-9 200 180)" />
      <Rect x="124" y="45" width="6" height="6" rx="1" fill="#F7D46A" transform="rotate(42 127 48)" />
      <Rect x="83" y="65" width="7" height="7" rx="1" fill="#A9D6FF" transform="rotate(24 86 68)" />
      <Rect x="164" y="67" width="7" height="7" rx="1" fill="#8DDCCB" transform="rotate(45 168 70)" />

      <Circle cx="125" cy="124" r="72" fill="#FFEAF0" />
      <Circle cx="125" cy="124" r="58" fill="#FFD5E0" />
      <Circle cx="125" cy="124" r="47" fill={BRAND_PINK} />
      <Path
        d="M99 123l18 18 38-45"
        stroke="#FFFFFF"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      <Circle cx="169" cy="164" r="28" fill="#FF91AA" />
      <Circle cx="158" cy="158" r="3.2" fill="#603447" />
      <Circle cx="181" cy="158" r="3.2" fill="#603447" />
      <Path d="M160 171c7 7 18 7 25 0" stroke="#603447" strokeWidth="3" strokeLinecap="round" fill="none" />
      <Path d="M169 151c-5-10-20-9-20 4 0 14 20 23 20 23s20-9 20-23c0-13-15-14-20-4Z" fill="#FF91AA" />
    </Svg>
  );
}

export default function CompleteScreen() {
  const router = useRouter();
  const { submit, isSubmitting, submitError } = useOnboarding();

  async function handleEnter() {
    await submit();
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topRow}>
          <View style={styles.backSpacer} />
          <OnboardingStepper currentStep={2} />
          <View style={styles.backSpacer} />
        </View>

        <View style={styles.body}>
          <CompleteIllustration />
          <Text style={styles.heading}>Hoàn tất!</Text>
          <Text style={styles.subheading}>
            Cảm ơn bạn đã chia sẻ thông tin. FollowYourBaby sẽ đồng hành cùng bạn trên hành trình tuyệt vời này!
          </Text>
        </View>

        {submitError ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText} accessibilityRole="alert">
              {submitError}
            </Text>
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Bắt đầu trải nghiệm"
          onPress={handleEnter}
          disabled={isSubmitting}
          style={[styles.primaryButton, isSubmitting && styles.disabledButton]}
        >
          <Text style={styles.primaryButtonText}>
            {isSubmitting ? 'Đang lưu...' : 'Bắt đầu trải nghiệm'}
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Vào trang chủ"
          onPress={() => router.replace('/(tabs)')}
          disabled={isSubmitting}
          style={styles.secondaryButton}
        >
          <Text style={styles.secondaryButtonText}>Vào trang chủ</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFF8F6',
  },
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 178,
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 42,
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
  body: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 34,
  },
  heading: {
    color: BRAND_NAVY,
    fontSize: 27,
    fontWeight: '900',
    lineHeight: 34,
    marginTop: 4,
    textAlign: 'center',
  },
  subheading: {
    color: '#2E3158',
    fontSize: 15,
    lineHeight: 24,
    marginTop: 14,
    maxWidth: 315,
    textAlign: 'center',
  },
  errorBox: {
    backgroundColor: '#FFF0F1',
    borderColor: '#FFC8D3',
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 20,
    padding: 14,
  },
  errorText: {
    color: '#C73558',
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    backgroundColor: '#FFF8F6',
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
  disabledButton: {
    opacity: 0.55,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#F4B9C8',
    borderRadius: 18,
    borderWidth: 1,
    height: 52,
    justifyContent: 'center',
    marginTop: 14,
  },
  secondaryButtonText: {
    color: BRAND_PINK,
    fontSize: 16,
    fontWeight: '800',
  },
});
