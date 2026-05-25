import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

import { supabase } from '@/lib/supabase';

// ---------------------------------------------------------------------------
// Subscription tier definitions
// ---------------------------------------------------------------------------

export type SubscriptionTier = 'free' | 'premium' | 'family_premium';

const SUBSCRIPTION_KEY = 'subscription_data';

export interface AIUsageToday {
  date: string;   // YYYY-MM-DD
  count: number;
}

export interface SubscriptionData {
  tier: SubscriptionTier;
  expiresAt: string | null;
  isActive: boolean;
  trialDaysLeft: number | null;
}

interface SubscriptionState extends SubscriptionData {
  setSubscription: (tier: SubscriptionTier, expiresAt: string | null) => void;
  setTrial: (daysLeft: number) => void;
  reset: () => void;
  hydrate: () => Promise<void>;

  // AI message quota — tracked in Supabase (ai_daily_usage table)
  aiUsage: AIUsageToday | null;
  fetchAIUsage: () => Promise<void>;
  incrementAIUsage: () => Promise<void>;
}

const INITIAL_SUBSCRIPTION: SubscriptionData = {
  tier: 'free',
  expiresAt: null,
  isActive: true,
  trialDaysLeft: null,
};

function todayString(): string {
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

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  ...INITIAL_SUBSCRIPTION,
  aiUsage: null,

  setSubscription: (tier, expiresAt) => {
    const isActive = tier === 'free' ? true : !isExpired(expiresAt);
    const data: SubscriptionData = { tier, expiresAt, isActive, trialDaysLeft: null };
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
    set({ ...INITIAL_SUBSCRIPTION, aiUsage: null });
    AsyncStorage.removeItem(SUBSCRIPTION_KEY).catch(() => null);
  },

  hydrate: async () => {
    try {
      const storedSub = await AsyncStorage.getItem(SUBSCRIPTION_KEY);
      if (storedSub) {
        const parsed = JSON.parse(storedSub) as SubscriptionData;
        const isActive = parsed.tier === 'free' ? true : !isExpired(parsed.expiresAt);
        set({ ...parsed, isActive });
      }
    } catch {
      // Fail silently — default free tier is safe fallback
    }
  },

  fetchAIUsage: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('ai_daily_usage')
        .select('count')
        .eq('user_id', user.id)
        .eq('usage_date', todayString())
        .maybeSingle();

      if (error) return;

      set({ aiUsage: { date: todayString(), count: data?.count ?? 0 } });
    } catch {
      // Fallback to 0 — safe default
      set({ aiUsage: { date: todayString(), count: 0 } });
    }
  },

  incrementAIUsage: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .rpc('increment_ai_usage', { p_user_id: user.id });

      if (!error && typeof data === 'number') {
        set({ aiUsage: { date: todayString(), count: data } });
      } else {
        set((state) => ({
          aiUsage: {
            date: todayString(),
            count: (state.aiUsage?.count ?? 0) + 1,
          },
        }));
      }
    } catch {
      set((state) => ({
        aiUsage: {
          date: todayString(),
          count: (state.aiUsage?.count ?? 0) + 1,
        },
      }));
    }
  },
}));
