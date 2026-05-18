import { create } from 'zustand';

// ---------------------------------------------------------------------------
// UI store — transient display state: modals, bottom sheets, toasts.
// ---------------------------------------------------------------------------

interface UiState {
  isGlobalLoading: boolean;
  toastMessage: string | null;
  // Intro carousel state — persisted to SecureStore by the consumer
  introSeen: boolean;
  introReady: boolean;
  setGlobalLoading: (value: boolean) => void;
  showToast: (message: string) => void;
  clearToast: () => void;
  setIntroSeen: (v: boolean) => void;
  setIntroReady: (v: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  isGlobalLoading: false,
  toastMessage: null,
  introSeen: false,
  introReady: false,
  setGlobalLoading: (value) => set({ isGlobalLoading: value }),
  showToast: (message) => set({ toastMessage: message }),
  clearToast: () => set({ toastMessage: null }),
  setIntroSeen: (v) => set({ introSeen: v }),
  setIntroReady: (v) => set({ introReady: v }),
}));
