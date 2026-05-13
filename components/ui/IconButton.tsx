import React, { forwardRef } from 'react';
import { Pressable, PressableProps, View } from 'react-native';
import { cn } from '@/lib/cn';

export interface IconButtonProps extends Omit<PressableProps, 'style'> {
  /** Icon element to render inside the button */
  icon: React.ReactNode;
  /** Accessible label describing the action */
  accessibilityLabel: string;
  /** Visual style */
  variant?: 'filled' | 'outline' | 'ghost';
  /** Size — all variants keep min 44pt tap target per iOS HIG */
  size?: 'sm' | 'md' | 'lg';
  /** NativeWind className override */
  className?: string;
}

const containerVariants: Record<NonNullable<IconButtonProps['variant']>, string> = {
  filled: 'bg-rose-500 active:bg-rose-600',
  outline: 'bg-transparent border border-rose-300 active:bg-rose-50',
  ghost: 'bg-transparent active:bg-rose-50',
};

/** All sizes keep a min 44pt hit area; icon area itself may be smaller. */
const sizeClasses: Record<NonNullable<IconButtonProps['size']>, string> = {
  sm: 'w-11 h-11',
  md: 'w-12 h-12',
  lg: 'w-14 h-14',
};

const IconButton = forwardRef<View, IconButtonProps>(
  (
    {
      icon,
      accessibilityLabel,
      variant = 'filled',
      size = 'md',
      disabled,
      className,
      ...rest
    },
    ref,
  ) => (
    <Pressable
      ref={ref}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      className={cn(
        'items-center justify-center rounded-full',
        containerVariants[variant],
        sizeClasses[size],
        disabled && 'opacity-50',
        className,
      )}
      {...rest}
    >
      {icon}
    </Pressable>
  ),
);

IconButton.displayName = 'IconButton';

export default IconButton;
