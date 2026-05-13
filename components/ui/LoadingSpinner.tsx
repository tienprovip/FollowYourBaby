import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { cn } from '@/lib/cn';

export interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  /** Color override — defaults to rose-500 */
  color?: string;
  /** NativeWind className for the wrapper view */
  className?: string;
}

const rnSizeMap: Record<
  NonNullable<LoadingSpinnerProps['size']>,
  'small' | 'large'
> = {
  small: 'small',
  medium: 'large',
  large: 'large',
};

/** Scale applied to large size since RN ActivityIndicator only has small/large */
const scaleMap: Record<NonNullable<LoadingSpinnerProps['size']>, number> = {
  small: 1,
  medium: 1,
  large: 1.5,
};

function LoadingSpinner({
  size = 'medium',
  color = '#f43f5e',
  className,
}: LoadingSpinnerProps) {
  return (
    <View
      className={cn('items-center justify-center', className)}
      accessibilityRole="progressbar"
      accessibilityLabel="Đang tải"
    >
      <ActivityIndicator
        size={rnSizeMap[size]}
        color={color}
        style={{ transform: [{ scale: scaleMap[size] }] }}
      />
    </View>
  );
}

export default LoadingSpinner;
