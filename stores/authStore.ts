import { create } from 'zustand';
import type { UserProfile } from '@/types/app';

// ---------------------------------------------------------------------------
// Auth store — holds the authenticated user's session and profile.
// Server state (fetching profile from Supabase) goes through TanStack Query;
// this store only carries client-side auth status.
// ---------------------------------------------------------------------------

interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  setUser: (user: UserProfile | null) => void;
  setLoading: (isLoading: boolean) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  reset: () => set({ user: null, isLoading: false }),
}));
