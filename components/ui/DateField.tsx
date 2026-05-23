import React, { useLayoutEffect, useRef, useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
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

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(date: Date): string {
  const d = date.getDate().toString().padStart(2, '0');
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

const MONTH_LABELS = [
  'Tháng 1',
  'Tháng 2',
  'Tháng 3',
  'Tháng 4',
  'Tháng 5',
  'Tháng 6',
  'Tháng 7',
  'Tháng 8',
  'Tháng 9',
  'Tháng 10',
  'Tháng 11',
  'Tháng 12',
];

// ---------------------------------------------------------------------------
// Wheel column
// ---------------------------------------------------------------------------

const ITEM_H = 46;

interface WheelProps {
  items: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
  wheelHeight: number;
  pad: number;
  flex?: number;
}

function Wheel({ items, selectedIndex, onChange, wheelHeight, pad, flex = 1 }: WheelProps) {
  const ref = useRef<ScrollView>(null);

  useLayoutEffect(() => {
    ref.current?.scrollTo({ y: selectedIndex * ITEM_H, animated: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally mount-only: scrolls to initial position once

  function handleScrollEnd(e: { nativeEvent: { contentOffset: { y: number } } }) {
    const raw = Math.round(e.nativeEvent.contentOffset.y / ITEM_H);
    const clamped = Math.max(0, Math.min(items.length - 1, raw));
    onChange(clamped);
  }

  return (
    <View style={{ flex, height: wheelHeight }}>
      {/* center-row highlight */}
      <View style={[styles.wheelHighlight, { top: pad }]} pointerEvents="none" />
      <ScrollView
        ref={ref}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_H}
        decelerationRate="fast"
        onMomentumScrollEnd={handleScrollEnd}
        contentContainerStyle={{ paddingVertical: pad }}
      >
        {items.map((label, i) => (
          <View key={`${label}-${i}`} style={styles.wheelItem}>
            <Text style={[styles.wheelText, i === selectedIndex && styles.wheelTextSelected]}>
              {label}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

// ---------------------------------------------------------------------------
// iOS wheel date picker sheet
// ---------------------------------------------------------------------------

interface WheelSheetProps {
  value: Date;
  onChange: (d: Date) => void;
  onCancel: () => void;
  onConfirm: () => void;
  label?: string;
  minimumDate?: Date;
}

function WheelSheet({
  value,
  onChange,
  onCancel,
  onConfirm,
  label,
  minimumDate,
}: WheelSheetProps) {
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();

  // Target ~50% screen height for the wheel area, minus toolbar (~60px) and safe area
  const toolbarH = 60;
  const targetH = screenHeight * 0.5 - toolbarH - Math.max(insets.bottom, 8);
  const rawVisible = Math.floor(targetH / ITEM_H);
  // Keep odd so selected item is perfectly centered
  const visibleCount = Math.max(3, rawVisible % 2 === 0 ? rawVisible - 1 : rawVisible);
  const wheelHeight = visibleCount * ITEM_H;
  const pad = ITEM_H * Math.floor(visibleCount / 2);

  const minYear = minimumDate?.getFullYear() ?? new Date().getFullYear() - 1;
  const maxYear = new Date().getFullYear() + 10;
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => String(minYear + i));

  const [yearIdx, setYearIdx] = useState(Math.max(0, value.getFullYear() - minYear));
  const [monthIdx, setMonthIdx] = useState(value.getMonth()); // 0-based
  const [dayIdx, setDayIdx] = useState(value.getDate() - 1); // 0-based

  const currentYear = minYear + yearIdx;
  const currentMonth = monthIdx + 1; // 1-based for daysInMonth
  const totalDays = daysInMonth(currentYear, currentMonth);
  const days = Array.from({ length: totalDays }, (_, i) => String(i + 1).padStart(2, '0'));
  const clampedDayIdx = Math.min(dayIdx, totalDays - 1);

  function handleYearChange(idx: number) {
    setYearIdx(idx);
    const d = new Date(
      minYear + idx,
      monthIdx,
      Math.min(clampedDayIdx + 1, daysInMonth(minYear + idx, monthIdx + 1)),
    );
    onChange(d);
  }

  function handleMonthChange(idx: number) {
    setMonthIdx(idx);
    const d = new Date(
      currentYear,
      idx,
      Math.min(clampedDayIdx + 1, daysInMonth(currentYear, idx + 1)),
    );
    onChange(d);
  }

  function handleDayChange(idx: number) {
    setDayIdx(idx);
    const d = new Date(currentYear, monthIdx, idx + 1);
    onChange(d);
  }

  return (
    <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {/* Toolbar */}
      <View style={styles.toolbar}>
        <Pressable onPress={onCancel} hitSlop={12}>
          <Text style={styles.cancelBtn}>Hủy</Text>
        </Pressable>
        <Text style={styles.titleText}>{label ?? 'Chọn ngày'}</Text>
        <Pressable onPress={onConfirm} hitSlop={12}>
          <Text style={styles.confirmBtn}>Xong</Text>
        </Pressable>
      </View>

      {/* Wheels */}
      <View style={styles.wheels}>
        <Wheel
          items={days}
          selectedIndex={clampedDayIdx}
          onChange={handleDayChange}
          wheelHeight={wheelHeight}
          pad={pad}
          flex={1}
        />
        <Wheel
          items={MONTH_LABELS}
          selectedIndex={monthIdx}
          onChange={handleMonthChange}
          wheelHeight={wheelHeight}
          pad={pad}
          flex={2}
        />
        <Wheel
          items={years}
          selectedIndex={yearIdx}
          onChange={handleYearChange}
          wheelHeight={wheelHeight}
          pad={pad}
          flex={1}
        />
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// DateField
// ---------------------------------------------------------------------------

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

  function handleAndroidChange(event: DateTimePickerEvent, selected?: Date) {
    setShow(false);
    if (event.type === 'set' && selected) onChange?.(selected);
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
      {label && <Text className="mb-1 text-sm font-semibold text-brand-navy/70">{label}</Text>}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label ?? placeholder}
        onPress={openPicker}
        className="flex-row items-center bg-white rounded-input px-4 py-3"
        style={{ borderWidth: 1, borderColor: hasError ? '#ef4444' : '#F7F7F7' }}
      >
        <Text className={cn('flex-1 text-base', value ? 'text-brand-navy' : 'text-brand-navy/40')}>
          {value ? formatDate(value) : placeholder}
        </Text>
      </Pressable>

      {hasError && (
        <Text className="text-red-500 text-xs mt-1" accessibilityRole="alert">
          {error}
        </Text>
      )}

      {/* Android native dialog */}
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

      {/* iOS custom wheel picker — avoids UICalendarView internal padding issues */}
      {isIOS && (
        <Modal transparent animationType="slide" visible={show} onRequestClose={cancelIOS}>
          <View style={styles.overlay}>
            <Pressable style={StyleSheet.absoluteFillObject} onPress={cancelIOS} />
            <WheelSheet
              value={tempDate}
              onChange={setTempDate}
              onCancel={cancelIOS}
              onConfirm={confirmIOS}
              label={label}
              minimumDate={minimumDate}
            />
          </View>
        </Modal>
      )}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

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
  cancelBtn: { color: '#fb7185', fontSize: 16, fontWeight: '500' },
  titleText: { color: '#111827', fontSize: 16, fontWeight: '600' },
  confirmBtn: { color: '#f43f5e', fontSize: 16, fontWeight: '700' },
  wheels: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  wheelHighlight: {
    position: 'absolute',
    left: 4,
    right: 4,
    height: ITEM_H,
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
  },
  wheelItem: {
    height: ITEM_H,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wheelText: {
    fontSize: 17,
    color: '#9ca3af',
    fontWeight: '400',
  },
  wheelTextSelected: {
    color: '#111827',
    fontWeight: '600',
  },
});

export default DateField;
