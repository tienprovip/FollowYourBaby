// ---------------------------------------------------------------------------
// FeedSessionTimer — live breastfeeding session timer.
// Ticks every second; displays HH:MM:SS elapsed time.
// ---------------------------------------------------------------------------

import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { formatTimerDisplay } from '@/lib/babyUtils';
import { cn } from '@/lib/cn';

interface FeedSessionTimerProps {
  startedAt: Date;
  side?: 'left' | 'right' | 'both';
  className?: string;
}

const SIDE_LABELS: Record<string, string> = {
  left: 'Bên trái',
  right: 'Bên phải',
  both: 'Hai bên',
};

function FeedSessionTimer({ startedAt, side, className }: FeedSessionTimerProps) {
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
      className={cn('items-center gap-y-1', className)}
      accessibilityRole="timer"
      accessibilityLabel={`Đang bú mẹ: ${formatTimerDisplay(elapsed)}`}
    >
      <Text className="text-5xl font-bold text-brand-blue tabular-nums">
        {formatTimerDisplay(elapsed)}
      </Text>
      {side && (
        <Text className="text-sm text-brand-navy/60">
          {SIDE_LABELS[side] ?? side}
        </Text>
      )}
    </View>
  );
}

export default FeedSessionTimer;
