// ---------------------------------------------------------------------------
// CategoryFilter — horizontal scrollable filter chip row for milestone categories.
// ---------------------------------------------------------------------------

import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { cn } from '@/lib/cn';
import type { MilestoneCategory } from '@/types/database';

export type CategoryFilterValue = MilestoneCategory | 'all';

export interface CategoryFilterProps {
  selected: CategoryFilterValue;
  onChange: (value: CategoryFilterValue) => void;
  className?: string;
}

interface FilterChip {
  value: CategoryFilterValue;
  label: string;
  emoji: string;
}

const CHIPS: FilterChip[] = [
  { value: 'all', label: 'Tất cả', emoji: '' },
  { value: 'motor', label: 'Vận động', emoji: '' },
  { value: 'language', label: 'Ngôn ngữ', emoji: '' },
  { value: 'cognitive', label: 'Nhận thức', emoji: '' },
  { value: 'social', label: 'Xã hội', emoji: '' },
];

function CategoryFilter({ selected, onChange, className }: CategoryFilterProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingHorizontal: 0 }}
      className={cn(className)}
      accessibilityRole="tablist"
    >
      {CHIPS.map((chip) => {
        const isActive = chip.value === selected;
        return (
          <Pressable
            key={chip.value}
            onPress={() => onChange(chip.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={chip.label}
            className={cn(
              'px-4 py-2 rounded-full border',
              isActive
                ? 'bg-brand-mint border-[#AEE6C8]'
                : 'bg-white border-brand-gray',
            )}
          >
            <Text
              className={cn(
                'text-xs font-semibold',
                isActive ? 'text-[#1A7A4A]' : 'text-brand-navy/60',
              )}
            >
              {chip.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

export default CategoryFilter;
