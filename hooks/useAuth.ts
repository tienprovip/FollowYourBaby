import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { mapAuthError } from '@/lib/authErrors';

// ---------------------------------------------------------------------------
// useAuth
// Thin hook that exposes the auth store's state and wraps store actions with
// user-friendly Vietnamese error mapping.
// Calls authStore.initialize() exactly once per app lifecycle.
// ---------------------------------------------------------------------------

export function useAuth() {
  const store = useAuthStore();
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      store.initialize();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Wrapped sign-in ---
  async function signIn(
    email: string,
    password: string,
  ): Promise<{ error: string | null }> {
    const result = await store.signInWithEmail(email, password);
    if (result.error) {
      return { error: mapAuthError(result.error) };
    }
    return { error: null };
  }

  // --- Wrapped sign-up ---
  async function signUp(
    email: string,
    password: string,
    displayName: string,
  ): Promise<{ error: string | null }> {
    const result = await store.signUpWithEmail(email, password, displayName);
    if (result.error) {
      return { error: mapAuthError(result.error) };
    }
    return { error: null };
  }

  // --- Wrapped sign-out ---
  async function signOut(): Promise<void> {
    await store.signOut();
  }

  // --- Wrapped password reset ---
  async function sendPasswordReset(
    email: string,
  ): Promise<{ error: string | null }> {
    const result = await store.sendPasswordReset(email);
    if (result.error) {
      return { error: mapAuthError(result.error) };
    }
    return { error: null };
  }

  return {
    user: store.user,
    session: store.session,
    isLoading: store.isLoading,
    signIn,
    signUp,
    signOut,
    sendPasswordReset,
  };
}
