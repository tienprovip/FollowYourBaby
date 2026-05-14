import { useState } from 'react';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { useAuthStore } from '@/stores/authStore';

// ---------------------------------------------------------------------------
// useOnboarding
// Submission hook called from complete.tsx.
// Persists journey, baby/pregnancy records and marks onboarding done.
// ---------------------------------------------------------------------------

interface SubmitResult {
  error: string | null;
}

export function useOnboarding() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const router = useRouter();
  const store = useOnboardingStore();

  // We need the current Supabase user id directly
  const session = useAuthStore((s) => s.session);

  async function submit(): Promise<SubmitResult> {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const userId = session?.user?.id;
      if (!userId) {
        throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      }

      const { journey, dueDate, babyName, birthDate, gender, birthWeightGrams } = store;

      if (!journey) {
        throw new Error('Vui lòng chọn hành trình trước.');
      }

      // 1. Insert domain records -------------------------------------------------

      if (journey === 'pregnant') {
        if (dueDate) {
          const { error: pgError } = await supabase
            .from('pregnancies')
            .insert({
              owner_id: userId,
              due_date: dueDate,
            });
          if (pgError) throw new Error(pgError.message);
        }
      } else {
        // has_baby or multiple
        const name = babyName.trim() || 'Em bé';
        if (birthDate) {
          const { error: babyError } = await supabase
            .from('baby_profiles')
            .insert({
              owner_id: userId,
              name,
              birth_date: birthDate,
              gender,
              birth_weight_grams: birthWeightGrams ?? null,
            });
          if (babyError) throw new Error(babyError.message);
        }
      }

      // 2. Mark onboarding completed in user_metadata ---------------------------

      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          journey,
          role: journey === 'pregnant' ? 'mother' : 'parent',
          onboarding_completed: true,
        },
      });
      if (updateError) throw new Error(updateError.message);

      // 3. Clean up store and navigate ------------------------------------------

      store.reset();
      router.replace('/(tabs)/');

      return { error: null };
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Có lỗi xảy ra. Vui lòng thử lại.';
      setSubmitError(message);
      return { error: message };
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    submit,
    isSubmitting,
    submitError,
  };
}
