import React, { forwardRef } from 'react';
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  Text,
  View,
} from 'react-native';
import { cn } from '@/lib/cn';

export interface ButtonProps extends Omit<PressableProps, 'style'> {
  /** Visual style of the button */
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'ai';
  /** Size preset */
  size?: 'sm' | 'md' | 'lg';
  /** Shows a spinner and disables interaction */
  loading?: boolean;
  /** Element rendered to the left of the label */
  iconLeft?: React.ReactNode;
  /** Element rendered to the right of the label */
  iconRight?: React.ReactNode;
  /** Button label text */
  label: string;
  /** NativeWind className override */
  className?: string;
  /** Text className override */
  textClassName?: string;
}

const containerVariants: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:     'bg-brand-pink active:bg-brand-pink-500',
  secondary:   'bg-brand-peach active:bg-brand-pink-100',
  ghost:       'bg-transparent active:bg-brand-peach',
  destructive: 'bg-red-500 active:bg-red-600',
  ai:          'bg-brand-lavender active:bg-brand-lavender-500',
};

const textVariants: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:     'text-white',
  secondary:   'text-brand-pink',
  ghost:       'text-brand-pink',
  destructive: 'text-white',
  ai:          'text-white',
};

const containerSizes: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-4 py-2 rounded-btn min-h-[36px]',
  md: 'px-6 py-3 rounded-btn min-h-[44px]',
  lg: 'px-8 py-4 rounded-btn min-h-[52px]',
};

const textSizes: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

const Button = forwardRef<View, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      iconLeft,
      iconRight,
      label,
      disabled,
      className,
      textClassName,
      accessibilityLabel,
      ...rest
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;
    const spinnerColor =
      variant === 'primary' || variant === 'destructive' || variant === 'ai'
        ? '#ffffff'
        : '#FF8FA8';

    return (
      <Pressable
        ref={ref}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityState={{ disabled: isDisabled, busy: loading }}
        disabled={isDisabled}
        className={cn(
          'flex-row items-center justify-center',
          containerVariants[variant],
          containerSizes[size],
          isDisabled && 'opacity-50',
          className,
        )}
        {...rest}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color={spinnerColor}
            accessibilityLabel="Đang tải"
          />
        ) : (
          <>
            {iconLeft && <View className="mr-2">{iconLeft}</View>}
            <Text
              className={cn(
                'font-semibold',
                textVariants[variant],
                textSizes[size],
                textClassName,
              )}
            >
              {label}
            </Text>
            {iconRight && <View className="ml-2">{iconRight}</View>}
          </>
        )}
      </Pressable>
    );
  },
);

Button.displayName = 'Button';

export default Button;
