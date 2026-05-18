// ---------------------------------------------------------------------------
// DiaperButton — one large tap to log a diaper change.
// Three variants: wet, dirty, both.
// ---------------------------------------------------------------------------

import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { cn } from '@/lib/cn';

type DiaperKind = 'wet' | 'dirty' | 'both';

interface DiaperButtonProps {
  kind: DiaperKind;
  onPress: () => void;
  disabled?: boolean;
  className?: string;
}

const CONFIG: Record<
  DiaperKind,
  { emoji: string; label: string; bgClass: string }
> = {
  wet: {
    emoji: '💧',
    label: 'Ướt',
    bgClass: 'bg-brand-blue/20',
  },
  dirty: {
    emoji: '💩',
    label: 'Bẩn',
    bgClass: 'bg-amber-100',
  },
  both: {
    emoji: '🔄',
    label: 'Cả hai',
    bgClass: 'bg-brand-mint/30',
  },
};

function DiaperButton({ kind, onPress, disabled, className }: DiaperButtonProps) {
  const { emoji, label, bgClass } = CONFIG[kind];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled}
      className={cn(
        'flex-1 items-center justify-center py-5 rounded-card gap-y-2',
        bgClass,
        disabled && 'opacity-50',
        className,
      )}
      accessibilityRole="button"
      accessibilityLabel={`Ghi tã ${label}`}
      accessibilityState={{ disabled }}
    >
      <Text style={{ fontSize: 32 }}>{emoji}</Text>
      <Text className="text-brand-navy font-bold text-base">{label}</Text>
    </TouchableOpacity>
  );
}

export default DiaperButton;
