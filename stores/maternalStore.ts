import { create } from 'zustand';

// ---------------------------------------------------------------------------
// MaternalStore — client-side state for active kick-counting session.
// Server state (persisted records) is managed via TanStack Query in hooks.
// ---------------------------------------------------------------------------

export interface ActiveKickSession {
  /** ID returned by Supabase after inserting the initial kick_counts row */
  sessionId: string;
  pregnancyId: string;
  startedAt: Date;
  /** Current kick count (incremented locally, synced on save) */
  count: number;
  isRunning: boolean;
}

interface MaternalState {
  /** Currently active kick counting session, null when not counting */
  activeKickSession: ActiveKickSession | null;

  startKickSession: (sessionId: string, pregnancyId: string) => void;
  incrementKick: () => void;
  endKickSession: () => void;
  cancelKickSession: () => void;
}

export const useMaternalStore = create<MaternalState>((set, get) => ({
  activeKickSession: null,

  startKickSession: (sessionId, pregnancyId) => {
    set({
      activeKickSession: {
        sessionId,
        pregnancyId,
        startedAt: new Date(),
        count: 0,
        isRunning: true,
      },
    });
  },

  incrementKick: () => {
    const session = get().activeKickSession;
    if (!session || !session.isRunning) return;
    set({
      activeKickSession: { ...session, count: session.count + 1 },
    });
  },

  endKickSession: () => {
    const session = get().activeKickSession;
    if (!session) return;
    set({
      activeKickSession: { ...session, isRunning: false },
    });
  },

  cancelKickSession: () => {
    set({ activeKickSession: null });
  },
}));
