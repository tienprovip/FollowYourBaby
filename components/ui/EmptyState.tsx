import React from 'react';
import { Text, View } from 'react-native';
import { cn } from '@/lib/cn';
import Button from './Button';

export interface EmptyStateProps {
  /** Optional illustration/icon rendered above the title */
  illustration?: React.ReactNode;
  title: string;
  body?: string;
  /** When provided, renders a CTA button */
  cta?: {
    label: string;
    onPress: () => void;
  };
  /** NativeWind className override */
  className?: string;
}

function EmptyState({
  illustration,
  title,
  body,
  cta,
  className,
}: EmptyStateProps) {
  return (
    <View
      className={cn('flex-1 items-center justify-center px-8 py-12', className)}
      accessibilityRole="text"
    >
      {illustration && <View className="mb-6">{illustration}</View>}

      <Text className="text-slate-900 text-lg font-semibold text-center mb-2">
        {title}
      </Text>

      {body && (
        <Text className="text-slate-500 text-sm text-center leading-6 mb-6">
          {body}
        </Text>
      )}

      {cta && (
        <Button
          label={cta.label}
          onPress={cta.onPress}
          variant="primary"
          size="md"
        />
      )}
    </View>
  );
}

export default EmptyState;
