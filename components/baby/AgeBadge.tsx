// ---------------------------------------------------------------------------
// AgeBadge — displays baby age in a friendly Vietnamese format.
// ---------------------------------------------------------------------------

import React from 'react';
import { Text, View } from 'react-native';
import { cn } from '@/lib/cn';

interface AgeBadgeProps {
  ageLabel: string;
  className?: string;
}

function AgeBadge({ ageLabel, className }: AgeBadgeProps) {
  return (
    <View
      className={cn(
        'bg-brand-blue/20 rounded-full px-3 py-1 self-start',
        className,
      )}
      accessibilityRole="text"
      accessibilityLabel={`Tuổi: ${ageLabel}`}
    >
      <Text className="text-brand-navy text-xs font-semibold">{ageLabel}</Text>
    </View>
  );
}

export default AgeBadge;
