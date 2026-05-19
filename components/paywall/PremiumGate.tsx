import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSubscription, type EntitlementKey } from '@/hooks/useSubscription';

// ---------------------------------------------------------------------------
// Feature display config — human-readable name + description shown in the
// locked card so users understand what they are upgrading for.
// ---------------------------------------------------------------------------

const FEATURE_COPY: Record<
  EntitlementKey,
  { name: string; description: string; requiredTier: string }
> = {
  ai_chat: {
    name: 'AI Chat không giới hạn',
    description: 'Bạn đã dùng hết 5 tin nhắn AI hôm nay. Nâng cấp Premium để dùng không giới hạn.',
    requiredTier: 'Premium',
  },
  ai_summary: {
    name: 'Tóm tắt AI hàng tuần',
    description: 'Nhận báo cáo AI thông minh mỗi tuần về hành trình của bé.',
    requiredTier: 'Premium',
  },
  risk_alerts: {
    name: 'Cảnh báo nguy cơ AI',
    description: 'AI phát hiện sớm các dấu hiệu bất thường cần chú ý.',
    requiredTier: 'Premium',
  },
  multi_baby: {
    name: 'Nhiều hồ sơ bé',
    description: 'Nâng cấp để thêm hồ sơ bé thứ hai và theo dõi nhiều bé cùng lúc.',
    requiredTier: 'Premium',
  },
  care_share: {
    name: 'Chia sẻ chăm sóc',
    description: 'Mời người thân hoặc người chăm sóc cùng theo dõi bé.',
    requiredTier: 'Premium',
  },
  export: {
    name: 'Xuất dữ liệu',
    description: 'Tải toàn bộ dữ liệu theo dõi dưới dạng CSV hoặc PDF.',
    requiredTier: 'Premium',
  },
  ocr: {
    name: 'OCR phiếu khám thai',
    description: 'Chụp và trích xuất thông tin từ phiếu khám thai tự động.',
    requiredTier: 'Premium',
  },
  analytics: {
    name: 'Phân tích nâng cao',
    description: 'Biểu đồ so chuẩn WHO và báo cáo chi tiết về sức khỏe bé.',
    requiredTier: 'Premium',
  },
  family_dashboard: {
    name: 'Dashboard gia đình',
    description: 'Xem tổng quan gia đình và quản lý tối đa 5 người chăm sóc.',
    requiredTier: 'Family Premium',
  },
};

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface PremiumGateProps {
  /** The entitlement being checked. */
  feature: EntitlementKey;
  /**
   * Content to render when the user has access.
   * Omit when using PremiumGate as a standalone locked-state card
   * (i.e. the gate replaces content rather than wrapping it).
   */
  children?: React.ReactNode;
  /**
   * Optional: override the locked UI entirely with your own component.
   * Receives `onUpgrade` callback so you can call it from a custom button.
   */
  fallback?: (onUpgrade: () => void) => React.ReactNode;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PremiumGate({ feature, children, fallback }: PremiumGateProps) {
  const router = useRouter();
  const { checkEntitlement } = useSubscription();

  if (checkEntitlement(feature)) {
    // No children means standalone usage — nothing to render when access is granted
    return children == null ? null : <>{children}</>;
  }

  function handleUpgrade() {
    router.push('/paywall');
  }

  if (fallback) {
    return <>{fallback(handleUpgrade)}</>;
  }

  const copy = FEATURE_COPY[feature];

  return (
    <View style={styles.container}>
      <View style={styles.lockIcon}>
        <Text style={styles.lockEmoji}>🔒</Text>
      </View>
      <Text style={styles.title}>{copy.name}</Text>
      <Text style={styles.description}>{copy.description}</Text>
      <Pressable
        onPress={handleUpgrade}
        accessibilityRole="button"
        accessibilityLabel={`Nâng cấp ${copy.requiredTier}`}
        style={({ pressed }) => [styles.ctaButton, pressed && { opacity: 0.82 }]}
      >
        <Text style={styles.ctaText}>Nâng cấp {copy.requiredTier}</Text>
      </Pressable>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
    margin: 16,
  },
  lockIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFF3EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  lockEmoji: {
    fontSize: 26,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1F2B5B',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  ctaButton: {
    backgroundColor: '#FF8FA8',
    borderRadius: 18,
    paddingHorizontal: 28,
    paddingVertical: 13,
    width: '100%',
    alignItems: 'center',
  },
  ctaText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
});

export default PremiumGate;
