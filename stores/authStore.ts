import { create } from 'zustand';
import type { Session, Subscription } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { UserProfile } from '@/types/app';
import type { UserRole, Journey } from '@/lib/constants';

// ---------------------------------------------------------------------------
// Helper — map a raw Supabase User object to the app's UserProfile shape.
// Falls back gracefully when metadata fields are absent (e.g. social login
// where the provider may name things differently).
// ---------------------------------------------------------------------------

function mapSupabaseUser(
  supabaseUser: NonNullable<Session['user']>,
): UserProfile {
  const meta = supabaseUser.user_metadata ?? {};

  // Providers use different field names — try common ones in order
  const displayName: string =
    (meta['display_name'] as string | undefined) ??
    (meta['full_name'] as string | undefined) ??
    (meta['name'] as string | undefined) ??
    supabaseUser.email?.split('@')[0] ??
    'Người dùng';

  const avatarUrl: string | null =
    (meta['avatar_url'] as string | undefined) ??
    (meta['picture'] as string | undefined) ??
    null;

  // Defaults — onboarding flow will update role and journey after first sign-in
  const role: UserRole =
    (meta['role'] as UserRole | undefined) ?? 'parent';
  const journey: Journey =
    (meta['journey'] as Journey | undefined) ?? 'has_baby';
  const onboardingCompleted: boolean =
    (meta['onboarding_completed'] as boolean | undefined) ?? false;

  return {
    id: supabaseUser.id,
    email: supabaseUser.email ?? '',
    displayName,
    avatarUrl,
    role,
    journey,
    onboardingCompleted,
    createdAt: supabaseUser.created_at,
    updatedAt: supabaseUser.updated_at ?? supabaseUser.created_at,
  };
}

// ---------------------------------------------------------------------------
// Store shape
// ---------------------------------------------------------------------------

interface AuthState {
  /** Supabase session object (contains access/refresh tokens) */
  session: Session | null;
  /** Mapped app user profile derived from the session */
  user: UserProfile | null;
  /** True while the initial session check is in progress */
  isLoading: boolean;

  // --- Actions ---
  /**
   * Must be called once on app startup (in useAuth).
   * Reads the persisted session from SecureStore and subscribes to
   * onAuthStateChange so the store stays in sync automatically.
   */
  initialize: () => Promise<void>;

  /** Email + password sign in. Returns { error } on failure. */
  signInWithEmail: (
    email: string,
    password: string,
  ) => Promise<{ error: string | null }>;

  /** Email + password sign up. Returns { error } on failure. */
  signUpWithEmail: (
    email: string,
    password: string,
    displayName: string,
  ) => Promise<{ error: string | null }>;

  /** Sign the user out and clear all local state. */
  signOut: () => Promise<void>;

  /** Send a password-reset email. Returns { error } on failure. */
  sendPasswordReset: (
    email: string,
  ) => Promise<{ error: string | null }>;

  /** Hard-reset the store to its initial values (e.g. after sign-out). */
  reset: () => void;

  // Internal — exposed so initialize() can clean up the listener on demand
  _authSubscription: Subscription | null;
}

// ---------------------------------------------------------------------------
// Store implementation
// ---------------------------------------------------------------------------

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  isLoading: true,
  _authSubscription: null,

  initialize: async () => {
    // Guard: if already subscribed, don't set up a second listener
    if (get()._authSubscription !== null) return;

    // Read persisted session from SecureStore via the Supabase client
    const {
      data: { session },
    } = await supabase.auth.getSession();

    set({
      session,
      user: session?.user ? mapSupabaseUser(session.user) : null,
      isLoading: false,
    });

    // Subscribe to future auth state changes (sign in, sign out, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      set({
        session: newSession,
        user: newSession?.user ? mapSupabaseUser(newSession.user) : null,
        isLoading: false,
      });
    });

    set({ _authSubscription: subscription });
  },

  signInWithEmail: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (error) return { error: error.message };
    return { error: null };
  },

  signUpWithEmail: async (email, password, displayName) => {
    const { error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: {
          display_name: displayName.trim(),
          full_name: displayName.trim(),
        },
      },
    });
    if (error) return { error: error.message };
    return { error: null };
  },

  signOut: async () => {
    // Unsubscribe before signing out to avoid spurious state updates
    const sub = get()._authSubscription;
    if (sub) {
      sub.unsubscribe();
    }
    await supabase.auth.signOut();
    set({
      session: null,
      user: null,
      isLoading: false,
      _authSubscription: null,
    });
  },

  sendPasswordReset: async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
    );
    if (error) return { error: error.message };
    return { error: null };
  },

  reset: () =>
    set({
      session: null,
      user: null,
      isLoading: false,
      _authSubscription: null,
    }),
}));
