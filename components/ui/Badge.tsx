import React from 'react';
import { Text, View } from 'react-native';
import { cn } from '@/lib/cn';

export interface BadgeProps {
  label: string;
  variant?: 'green' | 'yellow' | 'red' | 'neutral' | 'pink' | 'lavender' | 'blue';
  /** NativeWind className override */
  className?: string;
}

const containerVariants: Record<NonNullable<BadgeProps['variant']>, string> = {
  green:    'bg-brand-mint/30',
  yellow:   'bg-amber-100',
  red:      'bg-red-100',
  neutral:  'bg-brand-gray',
  pink:     'bg-brand-pink-100',
  lavender: 'bg-brand-lavender-50',
  blue:     'bg-[#A9D6FF]/25',
};

const textVariants: Record<NonNullable<BadgeProps['variant']>, string> = {
  green:    'text-[#1A7A4A]',
  yellow:   'text-amber-700',
  red:      'text-red-700',
  neutral:  'text-brand-navy/60',
  pink:     'text-brand-pink-600',
  lavender: 'text-brand-lavender-700',
  blue:     'text-[#1A6099]',
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
