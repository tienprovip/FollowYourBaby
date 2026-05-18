import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { cn } from '@/lib/cn';
import type { SymptomInfo } from '@/hooks/usePregnancySymptoms';

interface SymptomChipProps {
  symptom: SymptomInfo;
  selected: boolean;
  severity: number;
  onPress: () => void;
  onSeverityChange?: (severity: number) => void;
  className?: string;
}

const SEVERITY_LABELS = ['', 'Nhẹ', 'Nhẹ', 'Vừa', 'Nặng', 'Rất nặng'];

function SymptomChip({
  symptom,
  selected,
  severity,
  onPress,
  onSeverityChange,
  className,
}: SymptomChipProps) {
  return (
    <View className={cn('mb-2', className)}>
      <Pressable
        onPress={onPress}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: selected }}
        accessibilityLabel={symptom.label}
        className={cn(
          'rounded-input px-4 py-3 flex-row items-center border',
          selected
            ? 'bg-brand-pink-100 border-brand-pink'
            : 'bg-white border-brand-gray',
        )}
      >
        <Text className="text-base mr-3 w-6 text-center text-brand-navy">
          {symptom.emoji}
        </Text>
        <Text
          className={cn(
            'flex-1 text-sm font-medium',
            selected ? 'text-brand-pink' : 'text-brand-navy',
          )}
        >
          {symptom.label}
        </Text>
        {selected && (
          <Text className="text-xs text-brand-pink font-medium">
            {SEVERITY_LABELS[severity]}
          </Text>
        )}
      </Pressable>

      {selected && onSeverityChange && (
        <View className="mt-2 px-2">
          <Text className="text-xs text-brand-navy/60 mb-1">
            Mức độ: {SEVERITY_LABELS[severity]}
          </Text>
          <View className="flex-row gap-x-2">
            {[1, 2, 3, 4, 5].map((level) => (
              <Pressable
                key={level}
                onPress={() => onSeverityChange(level)}
                accessibilityLabel={`Mức độ ${level}: ${SEVERITY_LABELS[level]}`}
                className={cn(
                  'flex-1 items-center justify-center py-2 rounded-input',
                  severity >= level ? 'bg-brand-pink' : 'bg-brand-gray',
                )}
              >
                <Text
                  className={cn(
                    'text-xs font-bold',
                    severity >= level ? 'text-white' : 'text-brand-navy/40',
                  )}
                >
                  {level}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

export default SymptomChip;
