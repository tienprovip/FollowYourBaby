import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ACTIVE_BABY_KEY = 'active_baby_id';
const ACTIVE_PREGNANCY_KEY = 'active_pregnancy_id';

interface ActiveContextState {
  activeBabyId: string | null;
  activePregnancyId: string | null;
  setActiveBabyId: (id: string | null) => void;
  setActivePregnancyId: (id: string | null) => void;
  hydrate: () => Promise<void>;
  reset: () => void;
}

export const useBabyStore = create<ActiveContextState>((set) => ({
  activeBabyId: null,
  activePregnancyId: null,

  setActiveBabyId: (id) => {
    set({ activeBabyId: id });
    if (id) {
      AsyncStorage.setItem(ACTIVE_BABY_KEY, id).catch(() => null);
    } else {
      AsyncStorage.removeItem(ACTIVE_BABY_KEY).catch(() => null);
    }
  },

  setActivePregnancyId: (id) => {
    set({ activePregnancyId: id });
    if (id) {
      AsyncStorage.setItem(ACTIVE_PREGNANCY_KEY, id).catch(() => null);
    } else {
      AsyncStorage.removeItem(ACTIVE_PREGNANCY_KEY).catch(() => null);
    }
  },

  hydrate: async () => {
    const [babyId, pregnancyId] = await Promise.all([
      AsyncStorage.getItem(ACTIVE_BABY_KEY),
      AsyncStorage.getItem(ACTIVE_PREGNANCY_KEY),
    ]);
    set({
      activeBabyId: babyId ?? null,
      activePregnancyId: pregnancyId ?? null,
    });
  },

  reset: () => {
    set({ activeBabyId: null, activePregnancyId: null });
    AsyncStorage.removeItem(ACTIVE_BABY_KEY).catch(() => null);
    AsyncStorage.removeItem(ACTIVE_PREGNANCY_KEY).catch(() => null);
  },
}));
