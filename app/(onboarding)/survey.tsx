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

import { useOnboardingStore } from '@/stores/onboardingStore';
import Stepper from '@/components/ui/Stepper';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import DateField from '@/components/ui/DateField';
import SegmentedControl from '@/components/ui/SegmentedControl';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PREGNANCY_CONCERNS = [
  'Buồn nôn',
  'Mệt mỏi',
  'Tăng cân',
  'Thai máy',
  'Dinh dưỡng',
  'Chuẩn bị sinh',
  'Khám thai',
  'Tâm trạng',
];

const GENDER_OPTIONS = [
  { key: 'male', label: 'Bé trai' },
  { key: 'female', label: 'Bé gái' },
  { key: 'unknown', label: 'Chưa biết' },
];

// ---------------------------------------------------------------------------
// Concern chip
// ---------------------------------------------------------------------------

interface ConcernChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

function ConcernChip({ label, selected, onPress }: ConcernChipProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityState={{ checked: selected }}
      className={[
        'px-4 py-2 rounded-full mr-2 mb-2 border',
        selected
          ? 'bg-rose-500 border-rose-500'
          : 'bg-white border-rose-200',
      ].join(' ')}
    >
      <Text
        className={[
          'text-sm font-medium',
          selected ? 'text-white' : 'text-gray-700',
        ].join(' ')}
      >
        {label}
      </Text>
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Pregnancy survey section
// ---------------------------------------------------------------------------

interface PregnancySurveyProps {
  dueDate: string | null;
  concerns: string[];
  onDueDateChange: (d: string) => void;
  onToggleConcern: (c: string) => void;
  dueDateError: string | null;
}

function PregnancySurvey({
  dueDate,
  concerns,
  onDueDateChange,
  onToggleConcern,
  dueDateError,
}: PregnancySurveyProps) {
  const dueDateValue = dueDate ? new Date(dueDate) : undefined;

  return (
    <View>
      <Text className="text-lg font-bold text-gray-900 mb-1">
        Ngay dự sinh của bé
      </Text>
      <Text className="text-sm text-gray-500 mb-4">
        Dùng để tính tuần thai và nhắc lịch khám.
      </Text>

      <DateField
        label="Ngày dự sinh"
        placeholder="Chọn ngày dự sinh"
        value={dueDateValue}
        onChange={(d) => onDueDateChange(d.toISOString().split('T')[0])}
        minimumDate={new Date()}
        error={dueDateError ?? undefined}
        className="mb-6"
      />

      <Text className="text-lg font-bold text-gray-900 mb-1">
        Bạn quan tâm điều gì?
      </Text>
      <Text className="text-sm text-gray-500 mb-4">
        Chọn những điều bạn muốn theo dõi (có thể chọn nhiều).
      </Text>

      <View className="flex-row flex-wrap">
        {PREGNANCY_CONCERNS.map((concern) => (
          <ConcernChip
            key={concern}
            label={concern}
            selected={concerns.includes(concern)}
            onPress={() => onToggleConcern(concern)}
          />
        ))}
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Baby survey section
// ---------------------------------------------------------------------------

interface BabySurveyProps {
  babyName: string;
  birthDate: string | null;
  gender: 'male' | 'female' | 'unknown';
  birthWeightGrams: number | null;
  isMultiple: boolean;
  onBabyNameChange: (name: string) => void;
  onBirthDateChange: (d: string) => void;
  onGenderChange: (g: 'male' | 'female' | 'unknown') => void;
  onBirthWeightChange: (w: number | null) => void;
  birthDateError: string | null;
}

function BabySurvey({
  babyName,
  birthDate,
  gender,
  birthWeightGrams,
  isMultiple,
  onBabyNameChange,
  onBirthDateChange,
  onGenderChange,
  onBirthWeightChange,
  birthDateError,
}: BabySurveyProps) {
  const birthDateValue = birthDate ? new Date(birthDate) : undefined;

  function handleWeightText(text: string) {
    const parsed = parseInt(text, 10);
    onBirthWeightChange(isNaN(parsed) ? null : parsed);
  }

  return (
    <View>
      {isMultiple && (
        <View className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 mb-5">
          <Text className="text-sm text-rose-700">
            Bạn có thể thêm bé thứ hai sau khi hoàn tất onboarding.
          </Text>
        </View>
      )}

      <Input
        label="Tên bé"
        placeholder="Ví dụ: Bé Na, Bé Minh..."
        value={babyName}
        onChangeText={onBabyNameChange}
        className="mb-4"
      />

      <DateField
        label="Ngày sinh"
        placeholder="Chọn ngày sinh"
        value={birthDateValue}
        onChange={(d) => onBirthDateChange(d.toISOString().split('T')[0])}
        maximumDate={new Date()}
        error={birthDateError ?? undefined}
        className="mb-4"
      />

      <Text className="text-slate-700 text-sm font-semibold mb-1">
        Giới tính
      </Text>
      <SegmentedControl
        options={GENDER_OPTIONS}
        selectedKey={gender}
        onChange={(key) => onGenderChange(key as 'male' | 'female' | 'unknown')}
        className="mb-4"
      />

      <Input
        label="Cân nặng lúc sinh (gram) — tùy chọn"
        placeholder="Ví dụ: 3200"
        type="numeric"
        value={birthWeightGrams !== null ? String(birthWeightGrams) : ''}
        onChangeText={handleWeightText}
        helperText="Dùng để vẽ biểu đồ tăng trưởng."
        className="mb-2"
      />
    </View>
  );
}

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export default function SurveyScreen() {
  const router = useRouter();
  const store = useOnboardingStore();

  const {
    journey,
    dueDate,
    concerns,
    babyName,
    birthDate,
    gender,
    birthWeightGrams,
    setDueDate,
    toggleConcern,
    setBabyInfo,
  } = store;

  const [dueDateError, setDueDateError] = useState<string | null>(null);
  const [birthDateError, setBirthDateError] = useState<string | null>(null);

  const isPregnant = journey === 'pregnant';
  const isMultiple = journey === 'multiple';

  function validate(): boolean {
    let valid = true;

    if (isPregnant) {
      if (!dueDate) {
        setDueDateError('Vui lòng chọn ngày dự sinh.');
        valid = false;
      } else {
        setDueDateError(null);
      }
    } else {
      if (!birthDate) {
        setBirthDateError('Vui lòng chọn ngày sinh của bé.');
        valid = false;
      } else {
        setBirthDateError(null);
      }
    }

    return valid;
  }

  function handleContinue() {
    if (!validate()) return;
    router.push('/(onboarding)/complete');
  }

  function handleBack() {
    router.back();
  }

  return (
    <SafeAreaView className="flex-1 bg-[#fffdf7]">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-6 pt-8 pb-10"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Progress stepper */}
          <Stepper steps={3} currentStep={1} className="mb-10" />

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

          {/* Header */}
          <View className="mb-6">
            <Text className="text-2xl font-bold text-gray-900 mb-2">
              {isPregnant ? 'Thông tin thai kỳ' : 'Thông tin về bé'}
            </Text>
            <Text className="text-base text-gray-500 leading-6">
              Giúp chúng tôi cá nhân hóa trải nghiệm cho bạn.
            </Text>
          </View>

          {/* Dynamic survey content */}
          {isPregnant ? (
            <PregnancySurvey
              dueDate={dueDate}
              concerns={concerns}
              onDueDateChange={setDueDate}
              onToggleConcern={toggleConcern}
              dueDateError={dueDateError}
            />
          ) : (
            <BabySurvey
              babyName={babyName}
              birthDate={birthDate}
              gender={gender}
              birthWeightGrams={birthWeightGrams}
              isMultiple={isMultiple}
              onBabyNameChange={(name) => setBabyInfo({ babyName: name })}
              onBirthDateChange={(d) => setBabyInfo({ birthDate: d })}
              onGenderChange={(g) => setBabyInfo({ gender: g })}
              onBirthWeightChange={(w) => setBabyInfo({ birthWeightGrams: w })}
              birthDateError={birthDateError}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom CTA */}
      <View className="px-6 pb-8 pt-3 bg-[#fffdf7] border-t border-rose-50">
        <Button
          label="Tiếp tục"
          variant="primary"
          size="lg"
          className="w-full"
          onPress={handleContinue}
        />
      </View>
    </SafeAreaView>
  );
}
