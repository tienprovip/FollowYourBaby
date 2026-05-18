import React, { useCallback, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  ViewToken,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

import { INTRO_SEEN_KEY } from '@/app/_layout';
import { useUiStore } from '@/stores/uiStore';

const BRAND_NAVY = '#1F2B5B';
const BRAND_PINK = '#F45B7F';
const BRAND_LAVENDER = '#8C6BE8';

const INTRO_IMAGES = {
  pregnancy: require('../../assets/images/intro/intro-pregnancy.png'),
  baby: require('../../assets/images/intro/intro-baby.png'),
  ai: require('../../assets/images/intro/intro-ai.png'),
  family: require('../../assets/images/intro/intro-family.png'),
  logo: require('../../assets/images/intro/intro-logo.png'),
} satisfies Record<string, ImageSourcePropType>;

interface SlideItem {
  id: string;
  image: ImageSourcePropType;
  title: string;
  subtitle: string;
}

const SLIDES: SlideItem[] = [
  {
    id: 'pregnancy',
    image: INTRO_IMAGES.pregnancy,
    title: 'Đồng hành cùng mẹ',
    subtitle: 'Theo dõi thai kỳ, sức khỏe mẹ và sự phát triển của bé mỗi ngày',
  },
  {
    id: 'baby',
    image: INTRO_IMAGES.baby,
    title: 'Hiểu bé hơn mỗi ngày',
    subtitle: 'Theo dõi cân nặng, chiều cao, giấc ngủ và các cột mốc quan trọng của bé',
  },
  {
    id: 'ai',
    image: INTRO_IMAGES.ai,
    title: 'Trợ lý AI thông minh',
    subtitle: 'Giải đáp mọi thắc mắc 24/7 về thai kỳ và chăm sóc bé yêu',
  },
  {
    id: 'family',
    image: INTRO_IMAGES.family,
    title: 'Lưu giữ khoảnh khắc',
    subtitle: 'Ghi lại những kỷ niệm đáng nhớ trong hành trình làm mẹ',
  },
];

type ListItem = SlideItem | { id: 'cta' };

function isSlideItem(item: ListItem): item is SlideItem {
  return item.id !== 'cta';
}

function BrandName() {
  return (
    <Text className="text-center font-display font-bold" style={styles.brandName}>
      <Text style={{ color: BRAND_NAVY }}>Follow</Text>
      <Text style={{ color: BRAND_LAVENDER }}>Your</Text>
      <Text style={{ color: BRAND_PINK }}>Baby</Text>
    </Text>
  );
}

interface PaginationDotsProps {
  scrollX: Animated.Value;
  width: number;
}

function PaginationDots({ scrollX, width }: PaginationDotsProps) {
  return (
    <View className="flex-row items-center justify-center gap-x-3">
      {SLIDES.map((slide, index) => (
        <Animated.View
          key={slide.id}
          style={[
            styles.dot,
            {
              width: scrollX.interpolate({
                inputRange: [
                  (index - 1) * width,
                  index * width,
                  (index + 1) * width,
                ],
                outputRange: [8, 22, 8],
                extrapolate: 'clamp',
              }),
              opacity: scrollX.interpolate({
                inputRange: [
                  (index - 1) * width,
                  index * width,
                  (index + 1) * width,
                ],
                outputRange: [0.45, 1, 0.45],
                extrapolate: 'clamp',
              }),
              backgroundColor: scrollX.interpolate({
                inputRange: [
                  (index - 1) * width,
                  index * width,
                  (index + 1) * width,
                ],
                outputRange: ['#DECBD2', BRAND_PINK, '#DECBD2'],
                extrapolate: 'clamp',
              }),
            },
          ]}
        />
      ))}
    </View>
  );
}

interface SlidePageProps {
  item: SlideItem;
  width: number;
  scrollX: Animated.Value;
}

function SlidePage({ item, width, scrollX }: SlidePageProps) {
  return (
    <View style={{ width }} className="flex-1">
      <View style={styles.slide}>
        <Image
          source={item.image}
          resizeMode="contain"
          style={styles.slideImage}
          accessible
          accessibilityLabel={item.title}
        />

        <View style={styles.slideTextBlock}>
          <Text className="text-center font-display font-bold text-brand-navy" style={styles.slideTitle}>
            {item.title}
          </Text>
          <Text className="mt-4 text-center text-brand-navy/80" style={styles.slideSubtitle}>
            {item.subtitle}
          </Text>
          <View className="mt-11">
            <PaginationDots scrollX={scrollX} width={width} />
          </View>
        </View>
      </View>
    </View>
  );
}

interface CtaPageProps {
  width: number;
  onGetStarted: () => void;
  onLogin: () => void;
}

function IntroButton({
  label,
  variant,
  onPress,
}: {
  label: string;
  variant: 'primary' | 'secondary';
  onPress: () => void;
}) {
  const [pressed, setPressed] = useState(false);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[
        styles.ctaButton,
        variant === 'primary' ? styles.ctaButtonPrimary : styles.ctaButtonSecondary,
        pressed && styles.ctaButtonPressed,
      ]}
    >
      <Text
        className="text-base font-display font-bold"
        style={variant === 'primary' ? styles.primaryButtonText : styles.secondaryButtonText}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function CtaPage({ width, onGetStarted, onLogin }: CtaPageProps) {
  return (
    <View style={{ width }} className="flex-1">
      <View style={styles.ctaPage}>
        <Image
          source={INTRO_IMAGES.logo}
          resizeMode="contain"
          style={styles.logoImage}
          accessible
          accessibilityLabel="FollowYourBaby"
        />

        <BrandName />

        <Text className="mt-5 text-center text-brand-navy/80" style={styles.ctaSubtitle}>
          Ứng dụng đồng hành cùng mẹ và bé từ thai kỳ đến những năm tháng đầu đời.
        </Text>

        <View className="w-full gap-y-4 px-5" style={styles.ctaActions}>
          <IntroButton label="Bắt đầu ngay" variant="primary" onPress={onGetStarted} />
          <IntroButton label="Đăng nhập" variant="secondary" onPress={onLogin} />
        </View>

        <View className="mt-8 flex-row items-center justify-center">
          <Text className="text-sm text-brand-navy/55">Bạn đã có tài khoản? </Text>
          <Pressable
            onPress={onLogin}
            accessibilityRole="button"
            accessibilityLabel="Đăng nhập"
          >
            <Text className="text-sm font-display font-bold text-brand-pink-500">Đăng nhập</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export default function IntroScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { setIntroSeen } = useUiStore();
  const [currentPage, setCurrentPage] = useState(0);
  const listRef = useRef<FlatList<ListItem>>(null);
  const allItems = useRef<ListItem[]>([...SLIDES, { id: 'cta' }]).current;
  const scrollX = useRef(new Animated.Value(0)).current;

  const isCtaPage = currentPage === SLIDES.length;

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const nextIndex = viewableItems[0]?.index;
      if (nextIndex != null) {
        setCurrentPage(nextIndex);
      }
    },
    [],
  );

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 60 }).current;

  async function markDoneAndNavigate(dest: '/(auth)/register' | '/(auth)/login') {
    await SecureStore.setItemAsync(INTRO_SEEN_KEY, 'true');
    setIntroSeen(true);
    router.replace(dest);
  }

  function handleSkip() {
    listRef.current?.scrollToIndex({ index: SLIDES.length, animated: true });
  }

  function getItemLayout(_: ArrayLike<ListItem> | null | undefined, index: number) {
    return { length: width, offset: width * index, index };
  }

  return (
    <SafeAreaView style={styles.screen}>
      {!isCtaPage && (
        <View className="absolute right-6 top-4 z-10">
          <Pressable
            onPress={handleSkip}
            accessibilityRole="button"
            accessibilityLabel="Bỏ qua"
            className="px-2 py-2"
          >
            <Text className="text-sm font-display font-bold text-brand-navy/45">Bỏ qua</Text>
          </Pressable>
        </View>
      )}

      <Animated.FlatList
        ref={listRef}
        data={allItems}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.carousel}
        getItemLayout={getItemLayout}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false },
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        renderItem={({ item }) => {
          if (!isSlideItem(item)) {
            return (
              <CtaPage
                width={width}
                onGetStarted={() => markDoneAndNavigate('/(auth)/register')}
                onLogin={() => markDoneAndNavigate('/(auth)/login')}
              />
            );
          }

          return <SlidePage item={item} width={width} scrollX={scrollX} />;
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFF8F6',
  },
  carousel: {
    flex: 1,
  },
  slide: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingTop: 18,
    paddingBottom: 40,
  },
  slideImage: {
    alignSelf: 'center',
    width: '100%',
    height: '67%',
  },
  slideTextBlock: {
    paddingHorizontal: 38,
    paddingBottom: 4,
  },
  slideTitle: {
    fontSize: 24,
    lineHeight: 31,
  },
  slideSubtitle: {
    fontSize: 16,
    lineHeight: 25,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  dotActive: {
    backgroundColor: BRAND_PINK,
  },
  dotInactive: {
    backgroundColor: '#DECBD2',
  },
  ctaPage: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingBottom: 34,
    paddingTop: 28,
  },
  logoImage: {
    alignSelf: 'center',
    width: 170,
    height: 170,
    borderRadius: 34,
    marginBottom: 22,
  },
  brandName: {
    fontSize: 30,
    lineHeight: 36,
  },
  ctaSubtitle: {
    alignSelf: 'center',
    maxWidth: 290,
    fontSize: 16,
    lineHeight: 26,
  },
  ctaActions: {
    marginTop: 72,
  },
  ctaButton: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
  },
  ctaButtonPrimary: {
    backgroundColor: BRAND_PINK,
    shadowColor: BRAND_PINK,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 4,
  },
  ctaButtonSecondary: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0CED8',
  },
  ctaButtonPressed: {
    opacity: 0.82,
  },
  primaryButtonText: {
    color: '#FFFFFF',
  },
  secondaryButtonText: {
    color: BRAND_PINK,
  },
});
