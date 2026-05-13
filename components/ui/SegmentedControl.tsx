import React, { useRef } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { cn } from '@/lib/cn';

export interface SegmentOption {
  key: string;
  label: string;
}

export interface SegmentedControlProps {
  options: SegmentOption[];
  selectedKey: string;
  onChange: (key: string) => void;
  /** NativeWind className for the outer track */
  className?: string;
}

/**
 * Pill-style segmented control for tabbing within a screen.
 * Uses a sliding animated indicator.
 */
function SegmentedControl({
  options,
  selectedKey,
  onChange,
  className,
}: SegmentedControlProps) {
  const selectedIndex = options.findIndex((o) => o.key === selectedKey);
  const translateX = useRef(new Animated.Value(selectedIndex)).current;

  function handlePress(index: number, key: string) {
    Animated.spring(translateX, {
      toValue: index,
      useNativeDriver: true,
      tension: 200,
      friction: 20,
    }).start();
    onChange(key);
  }

  const segmentWidth = `${100 / options.length}%`;

  return (
    <View
      className={cn(
        'flex-row bg-rose-100 rounded-xl p-1 relative overflow-hidden',
        className,
      )}
      accessibilityRole="tablist"
    >
      {options.map((option, index) => {
        const isSelected = option.key === selectedKey;
        return (
          <Pressable
            key={option.key}
            onPress={() => handlePress(index, option.key)}
            accessibilityRole="tab"
            accessibilityLabel={option.label}
            accessibilityState={{ selected: isSelected }}
            style={{ flex: 1 }}
            className={cn(
              'items-center justify-center py-2 rounded-lg z-10',
              isSelected ? 'bg-white shadow-sm' : '',
            )}
          >
            <Text
              className={cn(
                'text-sm font-semibold',
                isSelected ? 'text-rose-600' : 'text-rose-400',
              )}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default SegmentedControl;
