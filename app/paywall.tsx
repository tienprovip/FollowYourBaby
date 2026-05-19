import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { useSubscriptionStore } from '@/stores/subscriptionStore';
import { useSubscription } from '@/hooks/useSubscription';

// ---------------------------------------------------------------------------
// Pricing constants — amounts in VND
// ---------------------------------------------------------------------------

const PLANS = [
  {
    id: 'free' as const,
    name: 'Miễn phí',
    monthlyPrice: null,
    yearlyPrice: null,
    highlight: false,
    badge: null,
    color: '#6B7280',
    borderColor: '#E5E7EB',
    features: [
      'Theo dõi đầy đủ (bú, ngủ, tã, tăng trưởng…)',
      'Danh sách mốc phát triển cơ bản',
      '5 tin nhắn AI mỗi ngày',
      '1 hồ sơ bé hoặc thai kỳ',
      'Nhắc nhở cơ bản',
    ],
    lockedFeatures: [
      'AI không giới hạn',
      'Nhiều hồ sơ bé',
      'Chia sẻ chăm sóc',
      'Xuất dữ liệu',
    ],
  },
  {
    id: 'premium' as const,
    name: 'Premium',
    monthlyPrice: 99000,
    yearlyPrice: 799000,
    highlight: true,
    badge: 'Phổ biến nhất',
    color: '#FF8FA8',
    borderColor: '#FF8FA8',
    features: [
      'AI chat không giới hạn',
      'Tóm tắt AI hàng tuần',
      'Cảnh báo nguy cơ AI',
      'Tối đa 3 hồ sơ bé',
      'Chia sẻ chăm sóc (premium)',
      'Xuất dữ liệu CSV/PDF',
      'OCR phiếu khám thai',
      'Biểu đồ phân tích nâng cao',
    ],
    lockedFeatures: [],
  },
  {
    id: 'family_premium' as const,
    name: 'Family Premium',
    monthlyPrice: 149000,
    yearlyPrice: 1199000,
    highlight: false,
    badge: null,
    color: '#B79CFF',
    borderColor: '#B79CFF',
    features: [
      'Tất cả tính năng Premium',
      'Không giới hạn hồ sơ bé',
      'Chia sẻ với tối đa 5 người',
      'Quản lý phân quyền đầy đủ',
      'Dashboard gia đình / cặp đôi',
    ],
    lockedFeatures: [],
  },
] as const;

// ---------------------------------------------------------------------------
// Helper: format VND
// ---------------------------------------------------------------------------

function formatVND(amount: number): string {
  return amount.toLocaleString('vi-VN') + '₫';
}

// ---------------------------------------------------------------------------
// PlanCard
// ---------------------------------------------------------------------------

interface PlanCardProps {
  plan: (typeof PLANS)[number];
  billingCycle: 'monthly' | 'yearly';
  isCurrent: boolean;
  onSelect: () => void;
}

function PlanCard({ plan, billingCycle, isCurrent, onSelect }: PlanCardProps) {
  const price =
    billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
  const isFree = plan.monthlyPrice === null;

  const yearlyPerMonth =
    plan.yearlyPrice !== null
      ? Math.round(plan.yearlyPrice / 12)
      : null;

  return (
    <View
      style={[
        styles.planCard,
        plan.highlight && styles.planCardHighlight,
        { borderColor: plan.borderColor },
      ]}
    >
      {/* Badge */}
      {plan.badge && (
        <View style={[styles.planBadge, { backgroundColor: plan.color }]}>
          <Text style={styles.planBadgeText}>{plan.badge}</Text>
        </View>
      )}

      {/* Header */}
      <View style={styles.planHeader}>
        <Text style={[styles.planName, { color: plan.color }]}>{plan.name}</Text>

        {isFree ? (
          <Text style={styles.planPriceFree}>Miễn phí</Text>
        ) : (
          <View>
            {billingCycle === 'yearly' && yearlyPerMonth !== null ? (
              <>
                <Text style={styles.planPrice}>
                  {formatVND(yearlyPerMonth)}
                  <Text style={styles.planPricePeriod}>/tháng</Text>
                </Text>
                <Text style={styles.planPriceTotal}>
                  Thanh toán {formatVND(plan.yearlyPrice!)} / năm
                </Text>
              </>
            ) : (
              <Text style={styles.planPrice}>
                {formatVND(price!)}
                <Text style={styles.planPricePeriod}>/tháng</Text>
              </Text>
            )}
          </View>
        )}
      </View>

      {/* Feature list */}
      <View style={styles.featureList}>
        {plan.features.map((feat) => (
          <View key={feat} style={styles.featureRow}>
            <Text style={[styles.featureCheck, { color: plan.color }]}>✓</Text>
            <Text style={styles.featureText}>{feat}</Text>
          </View>
        ))}
        {plan.lockedFeatures.map((feat) => (
          <View key={feat} style={styles.featureRow}>
            <Text style={styles.featureLock}>—</Text>
            <Text style={styles.featureTextLocked}>{feat}</Text>
          </View>
        ))}
      </View>

      {/* CTA */}
      {isFree ? (
        <View style={[styles.ctaButton, styles.ctaButtonFree]}>
          <Text style={styles.ctaButtonTextFree}>
            {isCurrent ? 'Gói hiện tại' : 'Tiếp tục miễn phí'}
          </Text>
        </View>
      ) : (
        <Pressable
          onPress={onSelect}
          accessibilityRole="button"
          accessibilityLabel={`Mua gói ${plan.name}`}
          style={({ pressed }) => [
            styles.ctaButton,
            { backgroundColor: plan.color },
            pressed && { opacity: 0.82 },
            isCurrent && styles.ctaButtonCurrent,
          ]}
        >
          <Text style={styles.ctaButtonText}>
            {isCurrent ? 'Gói hiện tại' : 'Mua ngay'}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export default function PaywallScreen() {
  const router = useRouter();
  const { tier } = useSubscription();
  const { setTrial } = useSubscriptionStore();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  function handleSelectPlan(planId: 'premium' | 'family_premium') {
    // TODO: wire RevenueCat — present native IAP sheet here.
    // For now, stub with Alert as instructed for pre-MVP.
    Alert.alert(
      'Sắp ra mắt',
      'Thanh toán sẽ được tích hợp sớm. Vui lòng thử lại sau.',
      [{ text: 'Đã hiểu', style: 'default' }],
    );
  }

  function handleStartTrial() {
    // TODO: wire RevenueCat free trial entitlement.
    // Temporarily grant 7-day trial locally so dev can test gated screens.
    setTrial(7);
    Alert.alert(
      'Kích hoạt thử nghiệm',
      'Bạn đang dùng thử Premium 7 ngày! Tính năng thanh toán thực sẽ được tích hợp sớm.',
      [{ text: 'Bắt đầu', onPress: () => router.back() }],
    );
  }

  function handleRestorePurchases() {
    // TODO: wire RevenueCat restorePurchases().
    Alert.alert('Khôi phục giao dịch', 'Tính năng này sẽ được kích hoạt khi tích hợp thanh toán.');
  }

  const yearlySavingsPct = 20;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft} />
          <Text style={styles.headerTitle}>Nâng cấp FollowYourBaby</Text>
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Đóng"
            style={styles.closeButton}
            hitSlop={12}
          >
            <Text style={styles.closeIcon}>✕</Text>
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Trial banner */}
          {tier === 'free' && (
            <Pressable
              onPress={handleStartTrial}
              accessibilityRole="button"
              style={({ pressed }) => [styles.trialBanner, pressed && { opacity: 0.82 }]}
            >
              <Text style={styles.trialBannerEmoji}>🎁</Text>
              <View style={styles.trialBannerText}>
                <Text style={styles.trialBannerTitle}>Dùng thử Premium 7 ngày miễn phí</Text>
                <Text style={styles.trialBannerSub}>Không cần thẻ tín dụng ngay bây giờ</Text>
              </View>
              <Text style={styles.trialBannerArrow}>›</Text>
            </Pressable>
          )}

          {/* Billing toggle */}
          <View style={styles.billingToggle}>
            <Pressable
              onPress={() => setBillingCycle('monthly')}
              style={[
                styles.billingOption,
                billingCycle === 'monthly' && styles.billingOptionActive,
              ]}
              accessibilityRole="radio"
              accessibilityState={{ checked: billingCycle === 'monthly' }}
            >
              <Text
                style={[
                  styles.billingOptionText,
                  billingCycle === 'monthly' && styles.billingOptionTextActive,
                ]}
              >
                Hàng tháng
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setBillingCycle('yearly')}
              style={[
                styles.billingOption,
                billingCycle === 'yearly' && styles.billingOptionActive,
              ]}
              accessibilityRole="radio"
              accessibilityState={{ checked: billingCycle === 'yearly' }}
            >
              <Text
                style={[
                  styles.billingOptionText,
                  billingCycle === 'yearly' && styles.billingOptionTextActive,
                ]}
              >
                Hàng năm
              </Text>
              {billingCycle === 'yearly' && (
                <View style={styles.savingsBadge}>
                  <Text style={styles.savingsBadgeText}>Tiết kiệm {yearlySavingsPct}%</Text>
                </View>
              )}
            </Pressable>
          </View>

          {/* Plan cards */}
          {PLANS.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              billingCycle={billingCycle}
              isCurrent={tier === plan.id}
              onSelect={() => handleSelectPlan(plan.id as 'premium' | 'family_premium')}
            />
          ))}

          {/* Restore + legal */}
          <Pressable
            onPress={handleRestorePurchases}
            accessibilityRole="button"
            style={styles.restoreButton}
          >
            <Text style={styles.restoreText}>Khôi phục giao dịch</Text>
          </Pressable>

          <Text style={styles.legalText}>
            Thanh toán sẽ được tính qua Apple App Store hoặc Google Play tùy nền tảng.
            Tự động gia hạn trừ khi hủy trước 24 giờ khi hết hạn.
          </Text>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF3EC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFF3EC',
  },
  headerLeft: {
    width: 36,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1F2B5B',
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    gap: 16,
  },
  // Trial banner
  trialBanner: {
    backgroundColor: '#B79CFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  trialBannerEmoji: {
    fontSize: 28,
  },
  trialBannerText: {
    flex: 1,
  },
  trialBannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  trialBannerSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  trialBannerArrow: {
    fontSize: 22,
    color: '#fff',
    fontWeight: '600',
  },
  // Billing toggle
  billingToggle: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    padding: 4,
    gap: 4,
  },
  billingOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  billingOptionActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  billingOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  billingOptionTextActive: {
    color: '#1F2B5B',
  },
  savingsBadge: {
    backgroundColor: '#AEE6C8',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  savingsBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1A7A4A',
  },
  // Plan card
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    borderWidth: 2,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
    position: 'relative',
  },
  planCardHighlight: {
    shadowOpacity: 0.14,
    shadowRadius: 28,
    elevation: 8,
  },
  planBadge: {
    position: 'absolute',
    top: -12,
    alignSelf: 'center',
    left: '50%',
    marginLeft: -54,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
    zIndex: 1,
  },
  planBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  planHeader: {
    marginBottom: 16,
    marginTop: 8,
  },
  planName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
  },
  planPriceFree: {
    fontSize: 24,
    fontWeight: '700',
    color: '#6B7280',
  },
  planPrice: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1F2B5B',
  },
  planPricePeriod: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6B7280',
  },
  planPriceTotal: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  featureList: {
    gap: 10,
    marginBottom: 20,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  featureCheck: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    width: 16,
  },
  featureText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
    lineHeight: 20,
  },
  featureLock: {
    fontSize: 14,
    color: '#D1D5DB',
    lineHeight: 20,
    width: 16,
    textAlign: 'center',
  },
  featureTextLocked: {
    fontSize: 14,
    color: '#D1D5DB',
    flex: 1,
    lineHeight: 20,
  },
  // CTA button
  ctaButton: {
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
  },
  ctaButtonFree: {
    backgroundColor: '#F3F4F6',
  },
  ctaButtonCurrent: {
    opacity: 0.6,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  ctaButtonTextFree: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },
  // Restore
  restoreButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  restoreText: {
    fontSize: 14,
    color: '#6B7280',
    textDecorationLine: 'underline',
  },
  legalText: {
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 17,
    paddingHorizontal: 8,
  },
});
