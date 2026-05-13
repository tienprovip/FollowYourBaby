// TODO: Install @react-native-community/datetimepicker to enable native time picking.
// Run: npx expo install @react-native-community/datetimepicker
// Once installed, replace the Pressable fallback below with DateTimePicker mode="time".

import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { cn } from '@/lib/cn';

export interface TimeFieldProps {
  /** Currently selected time as a Date (only hours/minutes used) */
  value?: Date;
  /** Called when the user picks a time */
  onChange?: (date: Date) => void;
  /** Label displayed above the field */
  label?: string;
  /** Placeholder shown when no time is selected */
  placeholder?: string;
  /** Error message */
  error?: string;
  /** NativeWind className override */
  className?: string;
}

function formatTime(date: Date): string {
  const h = date.getHours().toString().padStart(2, '0');
  const m = date.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

/**
 * Time picker field.
 * Currently renders a styled Pressable stub.
 * Replace with DateTimePicker mode="time" from @react-native-community/datetimepicker
 * after running: npx expo install @react-native-community/datetimepicker
 */
function TimeField({
  value,
  onChange,
  label,
  placeholder = 'Chọn giờ',
  error,
  className,
}: TimeFieldProps) {
  const hasError = Boolean(error);

  return (
    <View className={cn('w-full', className)}>
      {label && (
        <Text className="text-slate-700 text-sm font-semibold mb-1">
          {label}
        </Text>
      )}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label ?? placeholder}
        className={cn(
          'flex-row items-center bg-white border rounded-xl px-3 min-h-[44px]',
          hasError ? 'border-red-500' : 'border-rose-200',
        )}
        onPress={() => {
          // When @react-native-community/datetimepicker is installed,
          // trigger the native picker here.
        }}
      >
        <Text className="text-rose-400 mr-2">🕐</Text>
        <Text
          className={cn(
            'flex-1 text-base py-2',
            value ? 'text-slate-900' : 'text-slate-400',
          )}
        >
          {value ? formatTime(value) : placeholder}
        </Text>
      </Pressable>

      {hasError && (
        <Text className="text-red-500 text-xs mt-1" accessibilityRole="alert">
          {error}
        </Text>
      )}
    </View>
  );
}

export default TimeField;
