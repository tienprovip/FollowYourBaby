import React from 'react';
import { Text, View } from 'react-native';
import { cn } from '@/lib/cn';

export interface AIDisclaimerProps {
  /** NativeWind className override for the outer container */
  className?: string;
}

function AIDisclaimer({ className }: AIDisclaimerProps) {
  return (
    <View
      className={cn(
        'flex-row items-start bg-brand-lavender-50 border border-brand-lavender-200 rounded-input px-3 py-2',
        className,
      )}
      accessibilityRole="text"
      accessibilityLabel="Cảnh báo AI: không thay thế bác sĩ"
    >
      <Text className="text-brand-lavender mr-2 text-sm">ℹ</Text>
      <Text className="flex-1 text-brand-lavender-700 text-xs leading-5">
        AI hỗ trợ — không thay thế bác sĩ. Hãy hỏi chuyên gia khi cần.
      </Text>
    </View>
  );
}

export default AIDisclaimer;
