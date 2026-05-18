// ---------------------------------------------------------------------------
// SleepTimer — displays elapsed time for an active sleep session.
// Ticks every second. Persists across background via babyTrackingStore.
// ---------------------------------------------------------------------------

import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { formatTimerDisplay } from '@/lib/babyUtils';
import { cn } from '@/lib/cn';

interface SleepTimerProps {
  startedAt: Date;
  /** NativeWind className for the outer container */
  className?: string;
}

function SleepTimer({ startedAt, className }: SleepTimerProps) {
  const [elapsed, setElapsed] = useState(
    Math.floor((Date.now() - startedAt.getTime()) / 1000),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAt.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startedAt]);

  return (
    <View
      className={cn('items-center', className)}
      accessibilityRole="timer"
      accessibilityLabel={`Đang ngủ: ${formatTimerDisplay(elapsed)}`}
    >
      <Text className="text-4xl font-bold text-brand-navy tabular-nums">
        {formatTimerDisplay(elapsed)}
      </Text>
      <Text className="text-xs text-brand-navy/60 mt-1">Đang ngủ</Text>
    </View>
  );
}

export default SleepTimer;
