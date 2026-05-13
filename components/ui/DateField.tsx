// TODO: Install @react-native-community/datetimepicker to enable native date picking.
// Run: npx expo install @react-native-community/datetimepicker
// Once installed, replace the Pressable fallback below with DateTimePicker.

import React, { useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { cn } from '@/lib/cn';

export interface DateFieldProps {
  /** Currently selected date */
  value?: Date;
  /** Called when the user picks a date */
  onChange?: (date: Date) => void;
  /** Label displayed above the field */
  label?: string;
  /** Placeholder shown when no date is selected */
  placeholder?: string;
  /** Error message */
  error?: string;
  /** Minimum selectable date */
  minimumDate?: Date;
  /** Maximum selectable date */
  maximumDate?: Date;
  /** NativeWind className override */
  className?: string;
}

function formatDate(date: Date): string {
  const d = date.getDate().toString().padStart(2, '0');
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

/**
 * Date picker field.
 * Currently renders a styled Pressable that opens a manual date input.
 * Replace with DateTimePicker from @react-native-community/datetimepicker
 * after running: npx expo install @react-native-community/datetimepicker
 */
function DateField({
  value,
  onChange,
  label,
  placeholder = 'Chọn ngày',
  error,
  className,
}: DateFieldProps) {
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
        <Text className="text-rose-400 mr-2">📅</Text>
        <Text
          className={cn(
            'flex-1 text-base py-2',
            value ? 'text-slate-900' : 'text-slate-400',
          )}
        >
          {value ? formatDate(value) : placeholder}
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

export default DateField;
