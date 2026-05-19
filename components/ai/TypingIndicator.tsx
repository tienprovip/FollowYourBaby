import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

const DOT_SIZE = 8;
const DOT_COLOR = '#B79CFF';
const ANIMATION_DURATION = 400;
const ANIMATION_DELAY = 150;

function Dot({ delay }: { delay: number }) {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(translateY, {
          toValue: -6,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.delay(ANIMATION_DELAY * 2),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [delay, translateY]);

  return (
    <Animated.View
      style={[styles.dot, { transform: [{ translateY }] }]}
    />
  );
}

function TypingIndicator() {
  return (
    <View className="items-start mb-3 px-4">
      <View className="bg-white border border-brand-gray rounded-2xl rounded-tl-sm px-4 py-3 shadow-brand">
        <View style={styles.container}>
          <Dot delay={0} />
          <Dot delay={ANIMATION_DELAY} />
          <Dot delay={ANIMATION_DELAY * 2} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 20,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: DOT_COLOR,
  },
});

export default TypingIndicator;
