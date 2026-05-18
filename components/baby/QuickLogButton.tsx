// ---------------------------------------------------------------------------
// QuickLogButton — large icon + label button optimised for one-handed use.
// Uses brand-blue accent for baby tracking.
// ---------------------------------------------------------------------------

import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { cn } from '@/lib/cn';

interface QuickLogButtonProps {
  emoji: string;
  label: string;
  onPress: () => void;
  /** Optional notification badge (e.g. active timer indicator) */
  badge?: string;
  /** Override accent color class (default brand-blue) */
  accentClass?: string;
  className?: string;
}

function QuickLogButton({
  emoji,
  label,
  onPress,
  badge,
  accentClass = 'bg-brand-blue/20',
  className,
}: QuickLogButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={cn('flex-1 items-center gap-y-1.5', className)}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View
        className={cn(
          'w-16 h-16 rounded-card items-center justify-center relative',
          accentClass,
        )}
      >
        <Text style={{ fontSize: 28 }}>{emoji}</Text>
        {badge && (
          <View className="absolute -top-1 -right-1 bg-brand-pink rounded-full min-w-[18px] h-[18px] items-center justify-center px-1">
            <Text className="text-white text-[10px] font-bold">{badge}</Text>
          </View>
        )}
      </View>
      <Text className="text-xs text-brand-navy font-semibold text-center">
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default QuickLogButton;
