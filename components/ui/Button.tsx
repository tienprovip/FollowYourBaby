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
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
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
  primary: 'bg-rose-500 active:bg-rose-600',
  secondary: 'bg-rose-100 active:bg-rose-200',
  ghost: 'bg-transparent active:bg-rose-50',
  destructive: 'bg-red-500 active:bg-red-600',
};

const textVariants: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'text-white',
  secondary: 'text-rose-600',
  ghost: 'text-rose-500',
  destructive: 'text-white',
};

const containerSizes: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-4 py-2 rounded-xl min-h-[36px]',
  md: 'px-6 py-3 rounded-xl min-h-[44px]',
  lg: 'px-8 py-4 rounded-xl min-h-[52px]',
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
            color={variant === 'primary' || variant === 'destructive' ? '#ffffff' : '#f43f5e'}
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
              {loading ? 'Đang tải...' : label}
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
