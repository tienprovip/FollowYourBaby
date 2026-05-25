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
      <View className="w-5 h-5 rounded-full bg-brand-lavender-100 items-center justify-center mr-2 mt-0.5">
        <Text className="text-brand-lavender-700 text-xs font-bold">i</Text>
      </View>
      <Text className="flex-1 text-brand-lavender-700 text-xs leading-5">
        Thông tin từ AI, không thay thế ý kiến bác sĩ. Hãy hỏi chuyên gia khi cần.
      </Text>
    </View>
  );
}

export default AIDisclaimer;
