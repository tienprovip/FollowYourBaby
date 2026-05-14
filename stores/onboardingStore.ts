import { create } from 'zustand';
import type { Journey } from '@/lib/constants';

// ---------------------------------------------------------------------------
// Onboarding store — holds draft answers across onboarding steps.
// Persisted to Zustand in-memory only (no AsyncStorage needed for this MVP
// since onboarding is a short linear flow; resume-from-middle is handled
// by the NavigationGuard checking onboardingCompleted on the session).
// ---------------------------------------------------------------------------

export interface OnboardingState {
  // Step 1: journey selection
  journey: Journey | null;

  // Step 2a: pregnancy fields
  dueDate: string | null;
  concerns: string[];

  // Step 2b: baby fields
  babyName: string;
  birthDate: string | null;
  gender: 'male' | 'female' | 'unknown';
  birthWeightGrams: number | null;

  // --- Actions ---
  setJourney: (j: Journey) => void;
  setDueDate: (d: string) => void;
  toggleConcern: (c: string) => void;
  setBabyInfo: (info: {
    babyName?: string;
    birthDate?: string;
    gender?: 'male' | 'female' | 'unknown';
    birthWeightGrams?: number | null;
  }) => void;
  reset: () => void;
}

const initialState = {
  journey: null,
  dueDate: null,
  concerns: [] as string[],
  babyName: '',
  birthDate: null,
  gender: 'unknown' as const,
  birthWeightGrams: null,
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  ...initialState,

  setJourney: (j) => set({ journey: j }),

  setDueDate: (d) => set({ dueDate: d }),

  toggleConcern: (c) =>
    set((state) => ({
      concerns: state.concerns.includes(c)
        ? state.concerns.filter((x) => x !== c)
        : [...state.concerns, c],
    })),

  setBabyInfo: (info) =>
    set((state) => ({
      babyName: info.babyName ?? state.babyName,
      birthDate: info.birthDate ?? state.birthDate,
      gender: info.gender ?? state.gender,
      birthWeightGrams:
        info.birthWeightGrams !== undefined
          ? info.birthWeightGrams
          : state.birthWeightGrams,
    })),

  reset: () => set(initialState),
}));
