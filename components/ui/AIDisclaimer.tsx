import React from 'react';
import { Text, View } from 'react-native';
import { cn } from '@/lib/cn';

export interface AIDisclaimerProps {
  /** NativeWind className override for the outer container */
  className?: string;
}

/**
 * Mandatory disclaimer banner for every AI-generated output surface.
 * Per CLAUDE.md: all AI output must display this notice.
 */
function AIDisclaimer({ className }: AIDisclaimerProps) {
  return (
    <View
      className={cn(
        'flex-row items-start bg-soft-blue-50 border border-soft-blue-200 rounded-xl px-3 py-2',
        className,
      )}
      accessibilityRole="text"
      accessibilityLabel="Cảnh báo AI: không thay thế bác sĩ"
    >
      <Text className="text-soft-blue-500 mr-2 text-sm">ℹ</Text>
      <Text className="flex-1 text-soft-blue-700 text-xs leading-5">
        AI hỗ trợ — không thay thế bác sĩ. Hãy hỏi chuyên gia khi cần.
      </Text>
    </View>
  );
}

export default AIDisclaimer;
