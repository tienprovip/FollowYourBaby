import React from 'react';
import {
  KeyboardAvoidingView,
  Modal as RNModal,
  Platform,
  Pressable,
  View,
} from 'react-native';
import { cn } from '@/lib/cn';

export interface ModalProps {
  /** Controls visibility */
  visible: boolean;
  /** Called when backdrop is pressed or escape is triggered */
  onDismiss: () => void;
  children: React.ReactNode;
  /** NativeWind className for the inner content card */
  className?: string;
  /** Accessible label for the modal */
  accessibilityLabel?: string;
}

/**
 * Centered modal with semi-transparent backdrop.
 * Dismisses on backdrop press or Android back.
 */
function Modal({
  visible,
  onDismiss,
  children,
  className,
  accessibilityLabel = 'Hộp thoại',
}: ModalProps) {
  return (
    <RNModal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onDismiss}
      statusBarTranslucent
      accessibilityViewIsModal
    >
      {/* Backdrop */}
      <Pressable
        className="flex-1 bg-black/40 items-center justify-center px-6"
        onPress={onDismiss}
        accessibilityRole="button"
        accessibilityLabel="Đóng hộp thoại"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="w-full"
        >
          {/* Stop propagation so tapping inside doesn't dismiss */}
          <Pressable
            onPress={(e) => e.stopPropagation()}
            accessibilityRole="none"
            accessibilityLabel={accessibilityLabel}
          >
            <View
              className={cn(
                'bg-white rounded-2xl shadow-lg p-6 w-full',
                className,
              )}
            >
              {children}
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </RNModal>
  );
}

export default Modal;
