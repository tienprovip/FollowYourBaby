import React, { useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cn } from '@/lib/cn';

export interface DateFieldProps {
  value?: Date;
  onChange?: (date: Date) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  minimumDate?: Date;
  maximumDate?: Date;
  className?: string;
}

function formatDate(date: Date): string {
  const d = date.getDate().toString().padStart(2, '0');
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

function DateField({
  value,
  onChange,
  label,
  placeholder = 'Chọn ngày',
  error,
  minimumDate,
  maximumDate,
  className,
}: DateFieldProps) {
  const [show, setShow] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(value ?? new Date());
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const hasError = Boolean(error);
  const isIOS = Platform.OS === 'ios';

  function openPicker() {
    setTempDate(value ?? new Date());
    setShow(true);
  }

  function handleAndroidChange(event: DateTimePickerEvent, selected?: Date) {
    setShow(false);
    if (event.type === 'set' && selected) {
      onChange?.(selected);
    }
  }

  // iOS inline: onChange fires each time user taps a date
  function handleIOSChange(_event: DateTimePickerEvent, selected?: Date) {
    if (selected) setTempDate(selected);
  }

  function confirmIOS() {
    onChange?.(tempDate);
    setShow(false);
  }

  function cancelIOS() {
    setShow(false);
  }

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
        onPress={openPicker}
        className={cn(
          'flex-row items-center bg-white border rounded-xl px-3 min-h-[44px]',
          hasError ? 'border-red-500' : 'border-rose-200',
        )}
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

      {/* Android: inline native dialog */}
      {!isIOS && show && (
        <DateTimePicker
          value={value ?? new Date()}
          mode="date"
          display="default"
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          onChange={handleAndroidChange}
        />
      )}

      {/* iOS: bottom sheet with inline calendar.
          display="inline" renders correctly inside Modal (display="spinner" does not). */}
      {isIOS && (
        <Modal
          transparent
          animationType="slide"
          visible={show}
          onRequestClose={cancelIOS}
        >
          <View style={styles.overlay}>
            <Pressable style={StyleSheet.absoluteFillObject} onPress={cancelIOS} />

            <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 8) }]}>
              {/* Toolbar */}
              <View style={styles.toolbar}>
                <Pressable onPress={cancelIOS} hitSlop={12}>
                  <Text style={styles.cancelBtn}>Hủy</Text>
                </Pressable>
                <Text style={styles.titleText}>{label ?? 'Chọn ngày'}</Text>
                <Pressable onPress={confirmIOS} hitSlop={12}>
                  <Text style={styles.confirmBtn}>Xong</Text>
                </Pressable>
              </View>

              <DateTimePicker
                value={tempDate}
                mode="date"
                display="inline"
                minimumDate={minimumDate}
                maximumDate={maximumDate}
                onChange={handleIOSChange}
                accentColor="#f43f5e"
                themeVariant="light"
                style={[styles.picker, { width }]}
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
  },
  cancelBtn: {
    color: '#fb7185',
    fontSize: 16,
    fontWeight: '500',
  },
  titleText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmBtn: {
    color: '#f43f5e',
    fontSize: 16,
    fontWeight: '700',
  },
  picker: {
    backgroundColor: '#fff',
  },
});

export default DateField;
