import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import DateField from '@/components/ui/DateField';
import Input from '@/components/ui/Input';
import SegmentedControl from '@/components/ui/SegmentedControl';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { toLocalDateStr } from '@/lib/dateUtils';

const BRAND_NAVY = '#1F2B5B';
const BRAND_PINK = '#F45B7F';

const GENDER_OPTIONS = [
  { key: 'male', label: 'Bé trai' },
  { key: 'female', label: 'Bé gái' },
  { key: 'unknown', label: 'Chưa biết' },
];

const PREGNANCY_ORDER_OPTIONS = [
  { key: '1', label: '1' },
  { key: '2', label: '2' },
  { key: '3', label: '3' },
  { key: '4+', label: 'Từ 4 trở lên' },
];

const toDateInput = toLocalDateStr;

function defaultDueDateFromWeek(week: number): string {
  const d = new Date();
  d.setDate(d.getDate() + Math.max(1, 40 - week) * 7);
  return toDateInput(d);
}

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

function SectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIcon}>
          <Text style={styles.sectionIconText}>{icon}</Text>
        </View>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

function WeekSelector({
  week,
  onChange,
}: {
  week: number;
  onChange: (week: number) => void;
}) {
  const progress = `${((week - 1) / 39) * 100}%` as const;

  return (
    <View>
      <View style={styles.weekRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Giảm tuần thai"
          onPress={() => onChange(Math.max(1, week - 1))}
          style={styles.weekStepButton}
        >
          <Text style={styles.weekStepText}>−</Text>
        </Pressable>
        <View style={styles.weekBadge}>
          <Text style={styles.weekBadgeText}>{week} tuần</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Tăng tuần thai"
          onPress={() => onChange(Math.min(40, week + 1))}
          style={styles.weekStepButton}
        >
          <Text style={styles.weekStepText}>+</Text>
        </Pressable>
      </View>

      <View style={styles.track}>
        <View style={[styles.trackFill, { width: progress }]} />
        <View style={[styles.trackThumb, { left: progress }]} />
      </View>
      <View style={styles.trackLabels}>
        <Text style={styles.trackLabel}>1 tuần</Text>
        <Text style={styles.trackLabel}>40 tuần</Text>
      </View>
    </View>
  );
}

export default function SurveyScreen() {
  const router = useRouter();
  const {
    journey,
    dueDate,
    babyName,
    birthDate,
    gender,
    birthWeightGrams,
    setDueDate,
    setBabyInfo,
  } = useOnboardingStore();

  const [week, setWeek] = useState(22);
  const [pregnancyOrder, setPregnancyOrder] = useState('1');
  const [region, setRegion] = useState('Hà Nội');
  const [dueDateError, setDueDateError] = useState<string | null>(null);
  const [birthDateError, setBirthDateError] = useState<string | null>(null);

  const isPregnant = journey !== 'has_baby' && journey !== 'multiple';
  const currentDueDate = useMemo(() => {
    if (dueDate) return new Date(dueDate);
    return new Date(defaultDueDateFromWeek(week));
  }, [dueDate, week]);
  const currentBirthDate = birthDate ? new Date(birthDate) : undefined;

  function handleContinue() {
    if (isPregnant) {
      if (!dueDate) {
        setDueDate(defaultDueDateFromWeek(week));
      }
      setDueDateError(null);
      router.push('/(onboarding)/complete');
      return;
    }

    if (!birthDate) {
      setBirthDateError('Chọn ngày sinh của bé nhé.');
      return;
    }

    setBirthDateError(null);
    router.push('/(onboarding)/complete');
  }

  function handleWeightText(text: string) {
    const parsed = Number.parseInt(text, 10);
    setBabyInfo({ birthWeightGrams: Number.isNaN(parsed) ? null : parsed });
  }

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topRow}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Quay lại"
              onPress={() => router.back()}
              hitSlop={12}
            >
              <Text style={styles.backIcon}>{'<'}</Text>
            </Pressable>
            <OnboardingStepper currentStep={1} />
            <View style={styles.backSpacer} />
          </View>

          <View style={styles.header}>
            <Text style={styles.heading}>Một vài thông tin về bạn</Text>
            <Text style={styles.subheading}>
              Thông tin này giúp chúng tôi đồng hành và hỗ trợ bạn tốt hơn.
            </Text>
          </View>

          {isPregnant ? (
            <>
              <SectionCard title="Thông tin thai kỳ" icon="♡">
                <DateField
                  label="Ngày dự sinh (EDD)"
                  value={currentDueDate}
                  onChange={(d) => {
                    setDueDate(toDateInput(d));
                    setDueDateError(null);
                  }}
                  minimumDate={new Date()}
                  error={dueDateError ?? undefined}
                  className="mb-5"
                />

                <Text style={styles.fieldLabel}>Bạn đang ở tuần thứ bao nhiêu?</Text>
                <WeekSelector week={week} onChange={setWeek} />

                <Text style={[styles.fieldLabel, styles.fieldLabelSpaced]}>
                  Đây là lần mang thai thứ mấy của bạn?
                </Text>
                <SegmentedControl
                  options={PREGNANCY_ORDER_OPTIONS}
                  selectedKey={pregnancyOrder}
                  onChange={setPregnancyOrder}
                />
              </SectionCard>

              <SectionCard title="Thông tin cá nhân" icon="♡">
                <Text style={styles.fieldLabel}>Khu vực sinh sống</Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Khu vực sinh sống"
                  onPress={() => setRegion(region === 'Hà Nội' ? 'TP. Hồ Chí Minh' : 'Hà Nội')}
                  style={styles.selectField}
                >
                  <Text style={styles.selectText}>{region}</Text>
                  <Text style={styles.selectArrow}>⌄</Text>
                </Pressable>
              </SectionCard>
            </>
          ) : (
            <>
              <SectionCard title="Thông tin về bé" icon="♡">
                <Input
                  label="Tên bé"
                  placeholder="Ví dụ: Bé Na, Bé Minh..."
                  value={babyName}
                  onChangeText={(name) => setBabyInfo({ babyName: name })}
                  className="mb-4"
                />

                <DateField
                  label="Ngày sinh"
                  value={currentBirthDate}
                  placeholder="Chọn ngày sinh"
                  onChange={(d) => {
                    setBabyInfo({ birthDate: toDateInput(d) });
                    setBirthDateError(null);
                  }}
                  maximumDate={new Date()}
                  error={birthDateError ?? undefined}
                  className="mb-4"
                />

                <Text style={styles.fieldLabel}>Giới tính</Text>
                <SegmentedControl
                  options={GENDER_OPTIONS}
                  selectedKey={gender}
                  onChange={(key) => setBabyInfo({ gender: key as 'male' | 'female' | 'unknown' })}
                  className="mb-4"
                />

                <Input
                  label="Cân nặng lúc sinh (gram)"
                  placeholder="Ví dụ: 3200"
                  type="numeric"
                  value={birthWeightGrams !== null ? String(birthWeightGrams) : ''}
                  onChangeText={handleWeightText}
                />
              </SectionCard>

              <SectionCard title="Thông tin cá nhân" icon="♡">
                <Text style={styles.fieldLabel}>Khu vực sinh sống</Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Khu vực sinh sống"
                  onPress={() => setRegion(region === 'Hà Nội' ? 'TP. Hồ Chí Minh' : 'Hà Nội')}
                  style={styles.selectField}
                >
                  <Text style={styles.selectText}>{region}</Text>
                  <Text style={styles.selectArrow}>⌄</Text>
                </Pressable>
              </SectionCard>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

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
  keyboard: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 118,
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
    marginBottom: 22,
  },
  heading: {
    color: BRAND_NAVY,
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
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#F2E6EA',
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 14,
    padding: 16,
    shadowColor: '#8A5160',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 18,
  },
  sectionIcon: {
    alignItems: 'center',
    backgroundColor: '#FFE8EF',
    borderRadius: 8,
    height: 28,
    justifyContent: 'center',
    marginRight: 12,
    width: 28,
  },
  sectionIconText: {
    color: BRAND_PINK,
    fontSize: 16,
    fontWeight: '900',
  },
  sectionTitle: {
    color: BRAND_PINK,
    fontSize: 17,
    fontWeight: '800',
  },
  fieldLabel: {
    color: BRAND_NAVY,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    marginBottom: 12,
  },
  fieldLabelSpaced: {
    marginTop: 20,
  },
  weekRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  weekBadge: {
    backgroundColor: BRAND_PINK,
    borderRadius: 10,
    marginHorizontal: 12,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  weekBadgeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  weekStepButton: {
    alignItems: 'center',
    backgroundColor: '#FFF0F4',
    borderRadius: 999,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  weekStepText: {
    color: BRAND_PINK,
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 24,
  },
  track: {
    backgroundColor: '#ECE7EC',
    borderRadius: 999,
    height: 5,
    marginHorizontal: 4,
    position: 'relative',
  },
  trackFill: {
    backgroundColor: BRAND_PINK,
    borderRadius: 999,
    height: 5,
  },
  trackThumb: {
    backgroundColor: '#FFFFFF',
    borderColor: BRAND_PINK,
    borderRadius: 999,
    borderWidth: 3,
    height: 18,
    marginLeft: -9,
    position: 'absolute',
    top: -6.5,
    width: 18,
  },
  trackLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  trackLabel: {
    color: '#6B6D8C',
    fontSize: 12,
  },
  selectField: {
    alignItems: 'center',
    borderColor: '#E9DDE4',
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 48,
    paddingHorizontal: 14,
  },
  selectText: {
    color: BRAND_NAVY,
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  selectArrow: {
    color: BRAND_NAVY,
    fontSize: 20,
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
