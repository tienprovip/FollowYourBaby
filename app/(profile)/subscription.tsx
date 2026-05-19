import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSubscription, FREE_AI_MESSAGES_PER_DAY } from '@/hooks/useSubscription';
import { useSubscriptionStore } from '@/stores/subscriptionStore';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatExpiry(expiresAt: string | null): string {
  if (!expiresAt) return 'Không giới hạn';
  const d = new Date(expiresAt);
  return d.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

const TIER_LABELS: Record<string, string> = {
  free: 'Miễn phí',
  premium: 'Premium',
  family_premium: 'Family Premium',
};

const TIER_COLORS: Record<string, string> = {
  free: '#6B7280',
  premium: '#FF8FA8',
  family_premium: '#B79CFF',
};

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export default function SubscriptionScreen() {
  const router = useRouter();
  const {
    tier,
    expiresAt,
    isActive,
    trialDaysLeft,
    isPremium,
    aiMessagesUsedToday,
    aiMessagesLeft,
  } = useSubscription();

  const { reset: resetSubscription } = useSubscriptionStore();

  const tierLabel = TIER_LABELS[tier] ?? tier;
  const tierColor = TIER_COLORS[tier] ?? '#6B7280';

  function handleManageSubscription() {
    // TODO: wire RevenueCat managementURL or direct to App Store / Google Play
    Alert.alert(
      'Quản lý gói',
      'Vui lòng quản lý gói đăng ký trực tiếp trong App Store hoặc Google Play.',
      [{ text: 'Đã hiểu' }],
    );
  }

  function handleRestorePurchases() {
    // TODO: wire RevenueCat restorePurchases()
    Alert.alert(
      'Khôi phục giao dịch',
      'Tính năng này sẽ được kích hoạt khi tích hợp hệ thống thanh toán.',
      [{ text: 'Đã hiểu' }],
    );
  }

  function handleUpgrade() {
    router.push('/paywall');
  }

  // Dev-only helper to reset subscription state for testing
  function handleDevReset() {
    Alert.alert(
      'Đặt lại gói (Dev)',
      'Xác nhận đặt lại về Free?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đặt lại',
          style: 'destructive',
          onPress: () => {
            resetSubscription();
            Alert.alert('Đã đặt lại', 'Gói đã được đặt về Free.');
          },
        },
      ],
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Gói đăng ký' }} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>

        {/* Current plan card */}
        <View style={styles.planCard}>
          <View style={styles.planCardHeader}>
            <View>
              <Text style={styles.planCardLabel}>Gói hiện tại</Text>
              <Text style={[styles.planCardTier, { color: tierColor }]}>{tierLabel}</Text>
            </View>
            <View style={[styles.planBadge, { backgroundColor: tierColor + '20' }]}>
              <Text style={[styles.planBadgeText, { color: tierColor }]}>
                {isActive ? (trialDaysLeft !== null ? `Thử nghiệm` : 'Đang hoạt động') : 'Hết hạn'}
              </Text>
            </View>
          </View>

          {trialDaysLeft !== null && (
            <View style={styles.trialRow}>
              <Text style={styles.trialIcon}>⏳</Text>
              <Text style={styles.trialText}>
                Còn {trialDaysLeft} ngày thử nghiệm miễn phí
              </Text>
            </View>
          )}

          {expiresAt && tier !== 'free' && (
            <View style={styles.expiryRow}>
              <Text style={styles.expiryLabel}>Hết hạn:</Text>
              <Text style={styles.expiryValue}>{formatExpiry(expiresAt)}</Text>
            </View>
          )}
        </View>

        {/* AI usage (free tier) */}
        {!isPremium && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tin nhắn AI hôm nay</Text>
            <View style={styles.aiUsageRow}>
              <View style={styles.aiUsageBar}>
                <View
                  style={[
                    styles.aiUsageFill,
                    {
                      width: `${Math.min(100, (aiMessagesUsedToday / FREE_AI_MESSAGES_PER_DAY) * 100)}%`,
                      backgroundColor:
                        aiMessagesUsedToday >= FREE_AI_MESSAGES_PER_DAY ? '#EF4444' : '#FF8FA8',
                    },
                  ]}
                />
              </View>
              <Text style={styles.aiUsageCount}>
                {aiMessagesUsedToday}/{FREE_AI_MESSAGES_PER_DAY}
              </Text>
            </View>
            {aiMessagesLeft === 0 && (
              <Text style={styles.aiUsageWarning}>
                Bạn đã dùng hết tin nhắn hôm nay. Sẽ được đặt lại vào ngày mai.
              </Text>
            )}
          </View>
        )}

        {/* Feature summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tính năng của gói</Text>
          <FeatureRow
            label="AI Chat"
            value={isPremium ? 'Không giới hạn' : `${FREE_AI_MESSAGES_PER_DAY} tin/ngày`}
            active={true}
          />
          <FeatureRow
            label="Tóm tắt AI hàng tuần"
            value={isPremium ? 'Có' : 'Không có'}
            active={isPremium}
          />
          <FeatureRow
            label="Cảnh báo nguy cơ AI"
            value={isPremium ? 'Có' : 'Không có'}
            active={isPremium}
          />
          <FeatureRow
            label="Số hồ sơ bé"
            value={tier === 'family_premium' ? 'Không giới hạn' : tier === 'premium' ? 'Tối đa 3' : '1 hồ sơ'}
            active={true}
          />
          <FeatureRow
            label="Chia sẻ chăm sóc"
            value={isPremium ? (tier === 'family_premium' ? 'Tối đa 5 người' : 'Có') : 'Không có'}
            active={isPremium}
          />
          <FeatureRow
            label="Xuất dữ liệu (CSV/PDF)"
            value={isPremium ? 'Có' : 'Không có'}
            active={isPremium}
          />
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          {!isPremium && (
            <Pressable
              onPress={handleUpgrade}
              style={({ pressed }) => [styles.primaryButton, pressed && { opacity: 0.82 }]}
              accessibilityRole="button"
              accessibilityLabel="Nâng cấp gói"
            >
              <Text style={styles.primaryButtonText}>Nâng cấp Premium</Text>
            </Pressable>
          )}

          {isPremium && (
            <Pressable
              onPress={handleManageSubscription}
              style={({ pressed }) => [styles.secondaryButton, pressed && { opacity: 0.82 }]}
              accessibilityRole="button"
              accessibilityLabel="Quản lý gói đăng ký"
            >
              <Text style={styles.secondaryButtonText}>Quản lý gói đăng ký</Text>
            </Pressable>
          )}

          <Pressable
            onPress={handleRestorePurchases}
            style={({ pressed }) => [styles.ghostButton, pressed && { opacity: 0.7 }]}
            accessibilityRole="button"
            accessibilityLabel="Khôi phục giao dịch"
          >
            <Text style={styles.ghostButtonText}>Khôi phục giao dịch</Text>
          </Pressable>
        </View>

        {/* Legal links */}
        <View style={styles.legalRow}>
          <Text style={styles.legalLink}>Chính sách riêng tư</Text>
          <Text style={styles.legalSep}> · </Text>
          <Text style={styles.legalLink}>Điều khoản dịch vụ</Text>
        </View>

        {/* Dev-only reset */}
        {__DEV__ && (
          <Pressable
            onPress={handleDevReset}
            style={styles.devButton}
            accessibilityRole="button"
          >
            <Text style={styles.devButtonText}>[Dev] Đặt lại về Free</Text>
          </Pressable>
        )}
      </ScrollView>
    </>
  );
}

// ---------------------------------------------------------------------------
// FeatureRow sub-component
// ---------------------------------------------------------------------------

interface FeatureRowProps {
  label: string;
  value: string;
  active: boolean;
}

function FeatureRow({ label, value, active }: FeatureRowProps) {
  return (
    <View style={featureStyles.row}>
      <Text style={featureStyles.label}>{label}</Text>
      <Text style={[featureStyles.value, !active && featureStyles.valueMuted]}>
        {value}
      </Text>
    </View>
  );
}

const featureStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 11,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F3F4F6',
  },
  label: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2B5B',
    textAlign: 'right',
  },
  valueMuted: {
    color: '#9CA3AF',
  },
});

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#FFF3EC',
  },
  content: {
    padding: 20,
    paddingBottom: 48,
    gap: 20,
  },
  // Plan card
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
    gap: 12,
  },
  planCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planCardLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  planCardTier: {
    fontSize: 22,
    fontWeight: '700',
  },
  planBadge: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  planBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  trialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#B79CFF20',
    borderRadius: 12,
    padding: 12,
  },
  trialIcon: {
    fontSize: 16,
  },
  trialText: {
    fontSize: 13,
    color: '#7C5CDB',
    fontWeight: '600',
    flex: 1,
  },
  expiryRow: {
    flexDirection: 'row',
    gap: 6,
  },
  expiryLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  expiryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2B5B',
  },
  // Section
  section: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2B5B',
    marginBottom: 12,
  },
  // AI usage
  aiUsageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  aiUsageBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  aiUsageFill: {
    height: 8,
    borderRadius: 4,
  },
  aiUsageCount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2B5B',
    minWidth: 32,
    textAlign: 'right',
  },
  aiUsageWarning: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 8,
    lineHeight: 18,
  },
  // Actions
  actions: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#FF8FA8',
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FF8FA8',
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FF8FA8',
  },
  ghostButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  ghostButtonText: {
    fontSize: 14,
    color: '#6B7280',
    textDecorationLine: 'underline',
  },
  // Legal
  legalRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  legalLink: {
    fontSize: 12,
    color: '#6B7280',
    textDecorationLine: 'underline',
  },
  legalSep: {
    fontSize: 12,
    color: '#D1D5DB',
  },
  // Dev
  devButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  devButtonText: {
    fontSize: 12,
    color: '#EF4444',
  },
});
