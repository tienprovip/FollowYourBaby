import { useSubscriptionStore } from '@/stores/subscriptionStore';

// ---------------------------------------------------------------------------
// Free tier limits
// ---------------------------------------------------------------------------

export const FREE_AI_MESSAGES_PER_DAY = 5;
export const FREE_MAX_BABIES = 1;
export const PREMIUM_MAX_BABIES = 3;

// ---------------------------------------------------------------------------
// Feature keys — these are the canonical strings checked throughout the app.
// Any new feature gate must use one of these keys so the check is consistent.
// ---------------------------------------------------------------------------

export type EntitlementKey =
  | 'ai_chat'            // unlimited AI chat (free = 5/day)
  | 'ai_summary'         // weekly AI summary
  | 'risk_alerts'        // AI risk alerts
  | 'multi_baby'         // more than 1 baby profile
  | 'care_share'         // invite caregivers
  | 'export'             // CSV/PDF export
  | 'ocr'                // prenatal document OCR
  | 'analytics'          // advanced analytics & charts
  | 'family_dashboard';  // couple/family dashboard (family_premium only)

// ---------------------------------------------------------------------------
// Per-tier entitlement map
// ---------------------------------------------------------------------------

const PREMIUM_FEATURES: EntitlementKey[] = [
  'ai_chat',
  'ai_summary',
  'risk_alerts',
  'multi_baby',
  'care_share',
  'export',
  'ocr',
  'analytics',
];

const FAMILY_PREMIUM_FEATURES: EntitlementKey[] = [
  ...PREMIUM_FEATURES,
  'family_dashboard',
];

function hasEntitlement(
  tier: 'free' | 'premium' | 'family_premium',
  isActive: boolean,
  feature: EntitlementKey,
): boolean {
  if (!isActive) return false;
  if (tier === 'family_premium') return FAMILY_PREMIUM_FEATURES.includes(feature);
  if (tier === 'premium') return PREMIUM_FEATURES.includes(feature);
  // free tier — no premium features
  return false;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useSubscription() {
  const {
    tier,
    expiresAt,
    isActive,
    trialDaysLeft,
    aiUsage,
  } = useSubscriptionStore();

  const isPremium = isActive && (tier === 'premium' || tier === 'family_premium');
  const isFamilyPremium = isActive && tier === 'family_premium';

  // AI message quota: free users get FREE_AI_MESSAGES_PER_DAY per day.
  // During trial or paid subscription, unlimited.
  const aiMessagesUsedToday = aiUsage?.count ?? 0;
  const canUseAI = isPremium || aiMessagesUsedToday < FREE_AI_MESSAGES_PER_DAY;
  const aiMessagesLeft = isPremium
    ? Infinity
    : Math.max(0, FREE_AI_MESSAGES_PER_DAY - aiMessagesUsedToday);

  // Baby profile limits
  const maxBabies = isFamilyPremium
    ? Infinity
    : isPremium
    ? PREMIUM_MAX_BABIES
    : FREE_MAX_BABIES;

  const canAddBaby = (currentCount: number) => currentCount < maxBabies;
  const canShareCare = hasEntitlement(tier, isActive, 'care_share');

  /**
   * Generic entitlement check. Returns true when the user can access the feature.
   * For 'ai_chat' specifically, also respects the daily message quota.
   */
  function checkEntitlement(feature: EntitlementKey): boolean {
    if (feature === 'ai_chat') return canUseAI;
    return hasEntitlement(tier, isActive, feature);
  }

  return {
    tier,
    expiresAt,
    isActive,
    trialDaysLeft,
    isPremium,
    isFamilyPremium,
    // AI quota
    canUseAI,
    aiMessagesUsedToday,
    aiMessagesLeft,
    // Baby limits
    maxBabies,
    canAddBaby,
    // Care sharing
    canShareCare,
    // Generic gate
    checkEntitlement,
    // Feature flags (convenience booleans)
    features: {
      aiUnlimited: isPremium,
      aiSummary: hasEntitlement(tier, isActive, 'ai_summary'),
      riskAlerts: hasEntitlement(tier, isActive, 'risk_alerts'),
      unlimitedBabies: isFamilyPremium,
      careShare: canShareCare,
      export: hasEntitlement(tier, isActive, 'export'),
      ocr: hasEntitlement(tier, isActive, 'ocr'),
      analytics: hasEntitlement(tier, isActive, 'analytics'),
      familyDashboard: hasEntitlement(tier, isActive, 'family_dashboard'),
    },
  };
}
