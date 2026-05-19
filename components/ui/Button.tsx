import React, { forwardRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { cn } from '@/lib/cn';

export interface ButtonProps extends Omit<PressableProps, 'style'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'ai';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  label: string;
  className?: string;
  textClassName?: string;
}

const bgColors = StyleSheet.create({
  primary:     { backgroundColor: '#FF6B8A' },
  secondary:   { backgroundColor: '#fff5f7' },
  ghost:       { backgroundColor: 'transparent' },
  destructive: { backgroundColor: '#ef4444' },
  ai:          { backgroundColor: '#9B7AEF' },
});

const bgPressedColors = StyleSheet.create({
  primary:     { backgroundColor: '#E84E70' },
  secondary:   { backgroundColor: '#FFD9E3' },
  ghost:       { backgroundColor: '#fff5f7' },
  destructive: { backgroundColor: '#dc2626' },
  ai:          { backgroundColor: '#7C5CDB' },
});

const borderRadius = StyleSheet.create({
  sm: { borderRadius: 18 },
  md: { borderRadius: 18 },
  lg: { borderRadius: 18 },
});

const textVariants: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:     'text-white',
  secondary:   'text-brand-pink',
  ghost:       'text-brand-pink',
  destructive: 'text-white',
  ai:          'text-white',
};

const innerSizes: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-4 py-2 min-h-[36px]',
  md: 'px-6 py-3 min-h-[44px]',
  lg: 'px-8 py-4 min-h-[52px]',
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
      onPressIn,
      onPressOut,
      ...rest
    },
    ref,
  ) => {
    const [pressed, setPressed] = useState(false);
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
        onPressIn={(e) => {
          setPressed(true);
          onPressIn?.(e);
        }}
        onPressOut={(e) => {
          setPressed(false);
          onPressOut?.(e);
        }}
        style={[
          pressed ? bgPressedColors[variant] : bgColors[variant],
          borderRadius[size],
          isDisabled && { opacity: 0.5 },
        ]}
        className={cn(
          'flex-row items-center justify-center',
          innerSizes[size],
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
