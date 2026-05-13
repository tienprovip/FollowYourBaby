import React from 'react';
import { Text, View } from 'react-native';
import { cn } from '@/lib/cn';

export interface StepperProps {
  /** Total number of steps */
  steps: number;
  /** Zero-based index of the current step */
  currentStep: number;
  /** NativeWind className override */
  className?: string;
}

/**
 * Linear onboarding progress indicator.
 * Completed steps are rose-filled, active step has a ring, future steps are muted.
 */
function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <View
      className={cn('flex-row items-center justify-center', className)}
      accessibilityRole="progressbar"
      accessibilityLabel={`Bước ${currentStep + 1} trên ${steps}`}
      accessibilityValue={{ min: 0, max: steps - 1, now: currentStep }}
    >
      {Array.from({ length: steps }).map((_, index) => {
        const completed = index < currentStep;
        const active = index === currentStep;
        const isLast = index === steps - 1;

        return (
          <React.Fragment key={index}>
            {/* Step dot */}
            <View
              className={cn(
                'w-8 h-8 rounded-full items-center justify-center',
                completed && 'bg-rose-500',
                active && 'bg-white border-2 border-rose-500',
                !completed && !active && 'bg-rose-100',
              )}
            >
              {completed ? (
                <Text className="text-white text-xs font-bold">✓</Text>
              ) : (
                <Text
                  className={cn(
                    'text-xs font-semibold',
                    active ? 'text-rose-500' : 'text-rose-300',
                  )}
                >
                  {index + 1}
                </Text>
              )}
            </View>

            {/* Connector line */}
            {!isLast && (
              <View
                className={cn(
                  'h-0.5 flex-1 mx-1',
                  completed ? 'bg-rose-500' : 'bg-rose-100',
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

export default Stepper;
