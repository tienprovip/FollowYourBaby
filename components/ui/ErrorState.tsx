import React from 'react';
import { Text, View } from 'react-native';
import { cn } from '@/lib/cn';
import Button from './Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  /** Called when the retry button is pressed */
  onRetry?: () => void;
  /** Label for the retry button */
  retryLabel?: string;
  /** NativeWind className override */
  className?: string;
}

function ErrorState({
  title = 'Có lỗi xảy ra',
  message = 'Vui lòng thử lại sau.',
  onRetry,
  retryLabel = 'Thử lại',
  className,
}: ErrorStateProps) {
  return (
    <View
      className={cn('flex-1 items-center justify-center px-8 py-12', className)}
      accessibilityRole="alert"
    >
      <Text className="text-4xl mb-4">⚠️</Text>

      <Text className="text-slate-900 text-lg font-semibold text-center mb-2">
        {title}
      </Text>

      <Text className="text-slate-500 text-sm text-center leading-6 mb-6">
        {message}
      </Text>

      {onRetry && (
        <Button
          label={retryLabel}
          onPress={onRetry}
          variant="secondary"
          size="md"
          accessibilityLabel={retryLabel}
        />
      )}
    </View>
  );
}

export default ErrorState;
