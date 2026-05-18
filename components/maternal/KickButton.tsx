import React, { useCallback } from 'react';
import { Pressable, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { cn } from '@/lib/cn';

interface KickButtonProps {
  count: number;
  disabled?: boolean;
  onPress: () => void;
  className?: string;
}

// Note: expo-haptics provides tactile feedback on each kick tap.
// It must be installed: expo install expo-haptics
// If not available, the haptic call will be gracefully skipped.

function KickButton({ count, disabled = false, onPress, className }: KickButtonProps) {
  const handlePress = useCallback(async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // Haptics not available on this device — continue silently
    }
    onPress();
  }, [onPress]);

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={`Ghi nhận thai máy. Đã đếm ${count} lần.`}
      className={cn(
        'items-center justify-center rounded-full bg-brand-pink shadow-brand-lg active:opacity-80',
        disabled && 'opacity-40',
        className,
      )}
      style={{ width: 200, height: 200 }}
    >
      <Text className="text-white text-6xl font-bold">{count}</Text>
      <Text className="text-white text-base font-semibold mt-1">Thai máy</Text>
      <Text className="text-white/80 text-xs mt-1">Nhấn để ghi nhận</Text>
    </Pressable>
  );
}

export default KickButton;
