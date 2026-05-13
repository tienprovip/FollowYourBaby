import React from 'react';
import { Image, Text, View } from 'react-native';
import { cn } from '@/lib/cn';

export interface AvatarProps {
  /** Remote or local image URI */
  uri?: string;
  /** Displayed as initials when no image URI is provided */
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** NativeWind className override */
  className?: string;
}

const sizeDimensions: Record<NonNullable<AvatarProps['size']>, number> = {
  xs: 24,
  sm: 32,
  md: 44,
  lg: 64,
};

const sizeClasses: Record<NonNullable<AvatarProps['size']>, string> = {
  xs: 'w-6 h-6 rounded-full',
  sm: 'w-8 h-8 rounded-full',
  md: 'w-11 h-11 rounded-full',
  lg: 'w-16 h-16 rounded-full',
};

const textSizeClasses: Record<NonNullable<AvatarProps['size']>, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-xl',
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function Avatar({ uri, name, size = 'md', className }: AvatarProps) {
  const dim = sizeDimensions[size];
  const label = name ?? 'Avatar';

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={{ width: dim, height: dim, borderRadius: dim / 2 }}
        className={cn(sizeClasses[size], className)}
        accessibilityLabel={label}
        accessibilityRole="image"
      />
    );
  }

  return (
    <View
      className={cn(
        'bg-rose-100 items-center justify-center',
        sizeClasses[size],
        className,
      )}
      accessibilityLabel={label}
      accessibilityRole="image"
    >
      <Text className={cn('text-rose-600 font-semibold', textSizeClasses[size])}>
        {name ? getInitials(name) : '?'}
      </Text>
    </View>
  );
}

export default Avatar;
