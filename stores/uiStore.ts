import { create } from 'zustand';

// ---------------------------------------------------------------------------
// UI store — transient display state: modals, bottom sheets, toasts.
// ---------------------------------------------------------------------------

interface UiState {
  isGlobalLoading: boolean;
  toastMessage: string | null;
  setGlobalLoading: (value: boolean) => void;
  showToast: (message: string) => void;
  clearToast: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  isGlobalLoading: false,
  toastMessage: null,
  setGlobalLoading: (value) => set({ isGlobalLoading: value }),
  showToast: (message) => set({ toastMessage: message }),
  clearToast: () => set({ toastMessage: null }),
}));
