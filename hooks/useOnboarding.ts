import { useState } from 'react';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { useAuthStore } from '@/stores/authStore';
import type { Journey } from '@/lib/constants';

// ---------------------------------------------------------------------------
// useOnboarding
// Submission hook called from complete.tsx.
// Persists journey, baby/pregnancy records and marks onboarding done.
// ---------------------------------------------------------------------------

interface SubmitResult {
  error: string | null;
}

// ---------------------------------------------------------------------------
// Module-level DB helpers (keep submit() complexity low)
// ---------------------------------------------------------------------------

async function ensureProfile(userId: string, displayName?: string) {
  const { error } = await supabase
    .from('profiles')
    .upsert({ id: userId, full_name: displayName ?? null }, { onConflict: 'id' });
  if (error) throw new Error(error.message);
}

async function insertPregnancy(userId: string, dueDate: string) {
  const { error } = await supabase
    .from('pregnancies')
    .insert({ owner_id: userId, due_date: dueDate });
  if (error) throw new Error(error.message);
}

async function insertBaby(
  userId: string,
  name: string,
  dob: string,
  sex: 'male' | 'female' | 'unknown',
  birthWeightG: number | null,
) {
  const { error } = await supabase.from('babies').insert({
    owner_id: userId,
    name,
    dob,
    sex: sex === 'unknown' ? null : sex,
    birth_weight_g: birthWeightG,
  });
  if (error) throw new Error(error.message);
}

async function markOnboardingComplete(userId: string, journey: Journey) {
  const role = journey === 'pregnant' ? 'pregnant_mother' : 'parent';

  const { error: authError } = await supabase.auth.updateUser({
    data: { journey, role, onboarding_completed: true },
  });
  if (authError) throw new Error(authError.message);

  const { error: profileError } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId);
  if (profileError) throw new Error(profileError.message);
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useOnboarding() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const router = useRouter();
  const store = useOnboardingStore();
  const session = useAuthStore((s) => s.session);

  async function submit(): Promise<SubmitResult> {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const userId = session?.user?.id;
      if (!userId) throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');

      const { journey, dueDate, babyName, birthDate, gender, birthWeightGrams } = store;

      if (!journey) throw new Error('Vui lòng chọn hành trình trước.');
      if (journey === 'pregnant' && !dueDate) throw new Error('Vui lòng chọn ngày dự sinh.');
      if (journey !== 'pregnant' && !birthDate) throw new Error('Vui lòng chọn ngày sinh của bé.');

      const displayName =
        session.user.user_metadata?.display_name ??
        session.user.user_metadata?.full_name ??
        session.user.email?.split('@')[0];
      await ensureProfile(userId, displayName);

      if (journey === 'pregnant') {
        await insertPregnancy(userId, dueDate!);
      } else {
        await insertBaby(userId, babyName.trim() || 'Em bé', birthDate!, gender, birthWeightGrams ?? null);
      }

      await markOnboardingComplete(userId, journey);

      store.reset();
      router.replace('/(tabs)');
      return { error: null };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Có lỗi xảy ra. Vui lòng thử lại.';
      setSubmitError(message);
      return { error: message };
    } finally {
      setIsSubmitting(false);
    }
  }

  return { submit, isSubmitting, submitError };
}
