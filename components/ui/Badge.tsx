import React from 'react';
import { Text, View } from 'react-native';
import { cn } from '@/lib/cn';

export interface BadgeProps {
  label: string;
  variant?: 'green' | 'yellow' | 'red' | 'neutral';
  /** NativeWind className override */
  className?: string;
}

const containerVariants: Record<NonNullable<BadgeProps['variant']>, string> = {
  green: 'bg-mint-100',
  yellow: 'bg-amber-100',
  red: 'bg-red-100',
  neutral: 'bg-slate-100',
};

const textVariants: Record<NonNullable<BadgeProps['variant']>, string> = {
  green: 'text-mint-700',
  yellow: 'text-amber-700',
  red: 'text-red-700',
  neutral: 'text-slate-600',
};

function Badge({ label, variant = 'neutral', className }: BadgeProps) {
  return (
    <View
      className={cn(
        'rounded-full px-3 py-1 self-start',
        containerVariants[variant],
        className,
      )}
      accessibilityRole="text"
    >
      <Text
        className={cn('text-xs font-semibold', textVariants[variant])}
      >
        {label}
      </Text>
    </View>
  );
}

export default Badge;
