import React, { forwardRef } from 'react';
import { Pressable, PressableProps, View, ViewProps } from 'react-native';
import { cn } from '@/lib/cn';

export interface CardProps {
  children: React.ReactNode;
  /** Inner padding preset */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Optional header slot rendered above children */
  header?: React.ReactNode;
  /** Optional footer slot rendered below children */
  footer?: React.ReactNode;
  /** When provided, the card becomes a Pressable with this handler */
  onPress?: PressableProps['onPress'];
  /** NativeWind className for the outer container */
  className?: string;
  accessibilityLabel?: string;
}

const paddingMap: Record<NonNullable<CardProps['padding']>, string> = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

const CardInner = forwardRef<View, ViewProps & { className?: string }>(
  ({ children, className, ...rest }, ref) => (
    <View ref={ref} className={className} {...rest}>
      {children}
    </View>
  ),
);
CardInner.displayName = 'CardInner';

function Card({
  children,
  padding = 'md',
  header,
  footer,
  onPress,
  className,
  accessibilityLabel,
}: CardProps) {
  const baseClass = cn(
    'bg-white rounded-2xl shadow-sm border border-rose-100',
    className,
  );

  const content = (
    <>
      {header && (
        <View className="border-b border-rose-100 px-4 py-3">{header}</View>
      )}
      <View className={paddingMap[padding]}>{children}</View>
      {footer && (
        <View className="border-t border-rose-100 px-4 py-3">{footer}</View>
      )}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        className={cn(baseClass, 'active:opacity-80')}
      >
        {content}
      </Pressable>
    );
  }

  return <View className={baseClass}>{content}</View>;
}

export default Card;
