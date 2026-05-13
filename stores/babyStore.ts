import { create } from 'zustand';
import type { BabyProfile } from '@/types/app';

// ---------------------------------------------------------------------------
// Baby store — tracks the currently active baby profile.
// The list of babies is fetched via TanStack Query; only the selected ID
// lives here so it survives navigation without a refetch.
// ---------------------------------------------------------------------------

interface BabyState {
  activeBabyId: string | null;
  activeBaby: BabyProfile | null;
  setActiveBaby: (baby: BabyProfile | null) => void;
  reset: () => void;
}

export const useBabyStore = create<BabyState>((set) => ({
  activeBabyId: null,
  activeBaby: null,
  setActiveBaby: (baby) =>
    set({ activeBaby: baby, activeBabyId: baby?.id ?? null }),
  reset: () => set({ activeBabyId: null, activeBaby: null }),
}));
