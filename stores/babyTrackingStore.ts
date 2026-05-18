// ---------------------------------------------------------------------------
// BabyTrackingStore — client-side state for active feed/sleep sessions.
// Timer start times are persisted to AsyncStorage so they survive app kills.
// ---------------------------------------------------------------------------

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FEED_SESSION_KEY = 'active_feed_session';
const SLEEP_SESSION_KEY = 'active_sleep_session';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type FeedSide = 'left' | 'right' | 'both';
export type SleepKind = 'nap' | 'night';

export interface ActiveFeedSession {
  babyId: string;
  startedAt: Date;
  side?: FeedSide;
}

export interface ActiveSleepSession {
  babyId: string;
  startedAt: Date;
  kind: SleepKind;
}

interface BabyTrackingState {
  activeFeedSession: ActiveFeedSession | null;
  activeSleepSession: ActiveSleepSession | null;

  // Feed session actions
  setActiveFeedSession: (session: ActiveFeedSession) => void;
  clearActiveFeedSession: () => void;

  // Sleep session actions
  setActiveSleepSession: (session: ActiveSleepSession) => void;
  clearActiveSleepSession: () => void;

  // Hydrate from AsyncStorage on app launch
  hydrate: () => Promise<void>;
}

// ---------------------------------------------------------------------------
// Serialization helpers (Date ↔ ISO string for AsyncStorage)
// ---------------------------------------------------------------------------

interface SerializedFeedSession {
  babyId: string;
  startedAt: string;
  side?: FeedSide;
}

interface SerializedSleepSession {
  babyId: string;
  startedAt: string;
  kind: SleepKind;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useBabyTrackingStore = create<BabyTrackingState>((set) => ({
  activeFeedSession: null,
  activeSleepSession: null,

  setActiveFeedSession: (session) => {
    set({ activeFeedSession: session });
    const serialized: SerializedFeedSession = {
      babyId: session.babyId,
      startedAt: session.startedAt.toISOString(),
      side: session.side,
    };
    AsyncStorage.setItem(FEED_SESSION_KEY, JSON.stringify(serialized)).catch(
      () => null,
    );
  },

  clearActiveFeedSession: () => {
    set({ activeFeedSession: null });
    AsyncStorage.removeItem(FEED_SESSION_KEY).catch(() => null);
  },

  setActiveSleepSession: (session) => {
    set({ activeSleepSession: session });
    const serialized: SerializedSleepSession = {
      babyId: session.babyId,
      startedAt: session.startedAt.toISOString(),
      kind: session.kind,
    };
    AsyncStorage.setItem(SLEEP_SESSION_KEY, JSON.stringify(serialized)).catch(
      () => null,
    );
  },

  clearActiveSleepSession: () => {
    set({ activeSleepSession: null });
    AsyncStorage.removeItem(SLEEP_SESSION_KEY).catch(() => null);
  },

  hydrate: async () => {
    const [feedRaw, sleepRaw] = await Promise.all([
      AsyncStorage.getItem(FEED_SESSION_KEY),
      AsyncStorage.getItem(SLEEP_SESSION_KEY),
    ]);

    let feedSession: ActiveFeedSession | null = null;
    if (feedRaw) {
      try {
        const parsed = JSON.parse(feedRaw) as SerializedFeedSession;
        feedSession = {
          babyId: parsed.babyId,
          startedAt: new Date(parsed.startedAt),
          side: parsed.side,
        };
      } catch {
        AsyncStorage.removeItem(FEED_SESSION_KEY).catch(() => null);
      }
    }

    let sleepSession: ActiveSleepSession | null = null;
    if (sleepRaw) {
      try {
        const parsed = JSON.parse(sleepRaw) as SerializedSleepSession;
        sleepSession = {
          babyId: parsed.babyId,
          startedAt: new Date(parsed.startedAt),
          kind: parsed.kind,
        };
      } catch {
        AsyncStorage.removeItem(SLEEP_SESSION_KEY).catch(() => null);
      }
    }

    set({ activeFeedSession: feedSession, activeSleepSession: sleepSession });
  },
}));
