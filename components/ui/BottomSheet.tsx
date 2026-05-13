import React, { useCallback, useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  PanResponder,
  Pressable,
  View,
} from 'react-native';
import { cn } from '@/lib/cn';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const CLOSE_THRESHOLD = 80; // px dragged down before auto-close

export interface BottomSheetProps {
  visible: boolean;
  onDismiss: () => void;
  children: React.ReactNode;
  /** Sheet height as fraction of screen height (0–1). Default 0.5 */
  heightFraction?: number;
  /** NativeWind className for the sheet container */
  className?: string;
  accessibilityLabel?: string;
}

/**
 * Slide-up bottom sheet implemented with React Native Animated.
 * Drag down past the threshold to dismiss.
 */
function BottomSheet({
  visible,
  onDismiss,
  children,
  heightFraction = 0.5,
  className,
  accessibilityLabel = 'Bảng tùy chọn',
}: BottomSheetProps) {
  const sheetHeight = SCREEN_HEIGHT * heightFraction;
  const translateY = useRef(new Animated.Value(sheetHeight)).current;
  const dragOffset = useRef(new Animated.Value(0)).current;

  const animateTo = useCallback(
    (toValue: number, onDone?: () => void) => {
      Animated.timing(translateY, {
        toValue,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start(onDone);
    },
    [translateY],
  );

  useEffect(() => {
    if (visible) {
      translateY.setValue(sheetHeight);
      dragOffset.setValue(0);
      animateTo(0);
    }
  }, [visible, sheetHeight, translateY, dragOffset, animateTo]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 5,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) {
          dragOffset.setValue(g.dy);
        }
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > CLOSE_THRESHOLD) {
          dragOffset.setValue(0);
          animateTo(sheetHeight, onDismiss);
        } else {
          Animated.spring(dragOffset, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  const combinedTranslate = Animated.add(translateY, dragOffset);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onDismiss}
      statusBarTranslucent
      accessibilityViewIsModal
    >
      {/* Backdrop */}
      <Pressable
        className="flex-1 bg-black/40"
        onPress={onDismiss}
        accessibilityRole="button"
        accessibilityLabel="Đóng bảng tùy chọn"
      />

      <Animated.View
        style={[
          {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: sheetHeight,
            transform: [{ translateY: combinedTranslate }],
          },
        ]}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="none"
      >
        <View
          className={cn(
            'flex-1 bg-white rounded-t-2xl overflow-hidden',
            className,
          )}
        >
          {/* Drag handle */}
          <View
            {...panResponder.panHandlers}
            className="items-center pt-3 pb-2"
            accessibilityRole="adjustable"
            accessibilityLabel="Kéo để đóng"
          >
            <View className="w-10 h-1 rounded-full bg-slate-300" />
          </View>

          {children}
        </View>
      </Animated.View>
    </Modal>
  );
}

export default BottomSheet;
