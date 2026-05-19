import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ---------------------------------------------------------------------------
// Subscription tier definitions
// ---------------------------------------------------------------------------

export type SubscriptionTier = 'free' | 'premium' | 'family_premium';

// AsyncStorage keys
const SUBSCRIPTION_KEY = 'subscription_data';
const AI_USAGE_KEY = 'ai_usage_today';

export interface AIUsageToday {
  date: string;   // YYYY-MM-DD in local time
  count: number;
}

export interface SubscriptionData {
  tier: SubscriptionTier;
  expiresAt: string | null;
  isActive: boolean;
  trialDaysLeft: number | null;
}

interface SubscriptionState extends SubscriptionData {
  // --- Actions ---
  setSubscription: (tier: SubscriptionTier, expiresAt: string | null) => void;
  setTrial: (daysLeft: number) => void;
  reset: () => void;
  /** Hydrate store from AsyncStorage (called on app init alongside authStore). */
  hydrate: () => Promise<void>;

  // AI message quota (free tier only — tracked locally)
  aiUsage: AIUsageToday | null;
  incrementAIUsage: () => Promise<void>;
  resetAIUsageIfNewDay: () => Promise<void>;
}

const INITIAL_SUBSCRIPTION: SubscriptionData = {
  tier: 'free',
  expiresAt: null,
  isActive: true,
  trialDaysLeft: null,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function todayString(): string {
  // Returns YYYY-MM-DD in local timezone
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isExpired(expiresAt: string | null): boolean {
  if (!expiresAt) return false;
  return new Date(expiresAt) < new Date();
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  ...INITIAL_SUBSCRIPTION,
  aiUsage: null,

  setSubscription: (tier, expiresAt) => {
    const isActive = tier === 'free' ? true : !isExpired(expiresAt);
    const data: SubscriptionData = {
      tier,
      expiresAt,
      isActive,
      trialDaysLeft: null,
    };
    set(data);
    AsyncStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(data)).catch(() => null);
  },

  setTrial: (daysLeft) => {
    const data: SubscriptionData = {
      tier: 'premium',
      expiresAt: null,
      isActive: true,
      trialDaysLeft: daysLeft,
    };
    set(data);
    AsyncStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(data)).catch(() => null);
  },

  reset: () => {
    set(INITIAL_SUBSCRIPTION);
    AsyncStorage.removeItem(SUBSCRIPTION_KEY).catch(() => null);
  },

  hydrate: async () => {
    try {
      const [storedSub, storedUsage] = await Promise.all([
        AsyncStorage.getItem(SUBSCRIPTION_KEY),
        AsyncStorage.getItem(AI_USAGE_KEY),
      ]);

      if (storedSub) {
        const parsed = JSON.parse(storedSub) as SubscriptionData;
        // Recheck expiry on hydration
        const isActive =
          parsed.tier === 'free' ? true : !isExpired(parsed.expiresAt);
        set({ ...parsed, isActive });
      }

      if (storedUsage) {
        const parsed = JSON.parse(storedUsage) as AIUsageToday;
        // If stored date is not today, reset count
        if (parsed.date !== todayString()) {
          const reset: AIUsageToday = { date: todayString(), count: 0 };
          set({ aiUsage: reset });
          await AsyncStorage.setItem(AI_USAGE_KEY, JSON.stringify(reset));
        } else {
          set({ aiUsage: parsed });
        }
      } else {
        set({ aiUsage: { date: todayString(), count: 0 } });
      }
    } catch {
      // Fail silently — default free tier is safe fallback
    }
  },

  incrementAIUsage: async () => {
    await get().resetAIUsageIfNewDay();
    const today = todayString();
    const current = get().aiUsage ?? { date: today, count: 0 };
    const updated: AIUsageToday = {
      date: today,
      count: current.count + 1,
    };
    set({ aiUsage: updated });
    await AsyncStorage.setItem(AI_USAGE_KEY, JSON.stringify(updated)).catch(() => null);
  },

  resetAIUsageIfNewDay: async () => {
    const today = todayString();
    const current = get().aiUsage;
    if (!current || current.date !== today) {
      const reset: AIUsageToday = { date: today, count: 0 };
      set({ aiUsage: reset });
      await AsyncStorage.setItem(AI_USAGE_KEY, JSON.stringify(reset)).catch(() => null);
    }
  },
}));
