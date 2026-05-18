import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import * as SecureStore from 'expo-secure-store';

// ---------------------------------------------------------------------------
// SecureStore adapter — used as Supabase auth storage so tokens are kept in
// the device's secure enclave rather than plain AsyncStorage.
// ---------------------------------------------------------------------------

const secureStoreAdapter = {
  getItem: (key: string): Promise<string | null> => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string): Promise<void> => {
    return SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string): Promise<void> => {
    return SecureStore.deleteItemAsync(key);
  },
};

// ---------------------------------------------------------------------------
// Environment variables — must be set in .env
// ---------------------------------------------------------------------------

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Thiếu biến môi trường Supabase. Vui lòng kiểm tra file .env.'
  );
}

// ---------------------------------------------------------------------------
// Supabase client
// ---------------------------------------------------------------------------

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: secureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
