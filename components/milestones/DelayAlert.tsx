// ---------------------------------------------------------------------------
// DelayAlert — gentle yellow banner for overdue milestones.
// Always wraps in AIDisclaimer per safety conventions.
// ---------------------------------------------------------------------------

import React from 'react';
import { Text, View } from 'react-native';
import { cn } from '@/lib/cn';
import AIDisclaimer from '@/components/ui/AIDisclaimer';

export interface DelayAlertProps {
  milestoneTitle: string;
  className?: string;
}

function DelayAlert({ milestoneTitle, className }: DelayAlertProps) {
  return (
    <View className={cn('gap-y-2', className)}>
      <View
        className="bg-amber-50 border border-amber-200 rounded-input px-3 py-3"
        accessibilityRole="alert"
      >
        <View className="flex-row items-start">
          <Text className="text-amber-500 mr-2 text-sm font-bold">!</Text>
          <View className="flex-1">
            <Text className="text-amber-800 text-sm font-semibold mb-1">
              Cần chú ý
            </Text>
            <Text className="text-amber-700 text-xs leading-5">
              Bé chưa đạt mốc "{milestoneTitle}". Mỗi bé phát triển theo nhịp
              riêng — nếu bạn lo lắng, hãy trao đổi với bác sĩ nhi khoa.
            </Text>
          </View>
        </View>
      </View>
      <AIDisclaimer />
    </View>
  );
}

export default DelayAlert;
