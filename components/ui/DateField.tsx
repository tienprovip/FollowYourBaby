import React, { useState } from 'react';
import { Modal, Platform, Pressable, Text, View } from 'react-native';
import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
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

  const hasError = Boolean(error);
  const isIOS = Platform.OS === 'ios';

  function openPicker() {
    setTempDate(value ?? new Date());
    setShow(true);
  }

  // Android: onChange fires once on confirm (event.type === 'set') or cancel ('dismissed')
  function handleAndroidChange(event: DateTimePickerEvent, selected?: Date) {
    setShow(false);
    if (event.type === 'set' && selected) {
      onChange?.(selected);
    }
  }

  // iOS: onChange fires on every scroll — accumulate into tempDate
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

      {/* Android: render picker inline when show=true — native dialog appears automatically */}
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

      {/* iOS: wrap in modal so the spinner doesn't push the layout */}
      {isIOS && (
        <Modal
          transparent
          animationType="slide"
          visible={show}
          onRequestClose={cancelIOS}
        >
          {/* Backdrop — tap to cancel */}
          <Pressable
            style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}
            onPress={cancelIOS}
          >
            {/* Content — use View (not Pressable) so touches don't bubble to backdrop */}
            <View
              style={{ backgroundColor: 'white', borderTopLeftRadius: 16, borderTopRightRadius: 16, paddingBottom: 32 }}
              onStartShouldSetResponder={() => true}
            >
              {/* Toolbar */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' }}>
                <Pressable onPress={cancelIOS} hitSlop={12}>
                  <Text style={{ color: '#fb7185', fontSize: 16 }}>Hủy</Text>
                </Pressable>
                <Text style={{ color: '#111827', fontWeight: '600', fontSize: 16 }}>
                  {label ?? 'Chọn ngày'}
                </Text>
                <Pressable onPress={confirmIOS} hitSlop={12}>
                  <Text style={{ color: '#f43f5e', fontWeight: '700', fontSize: 16 }}>Xong</Text>
                </Pressable>
              </View>

              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                minimumDate={minimumDate}
                maximumDate={maximumDate}
                onChange={handleIOSChange}
              />
            </View>
          </Pressable>
        </Modal>
      )}
    </View>
  );
}

export default DateField;
