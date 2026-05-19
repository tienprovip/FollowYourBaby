import { useCallback, useEffect, useRef, useState } from 'react';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import {
  registerForPushNotificationsAsync,
  addNotificationResponseListener,
  addNotificationReceivedListener,
  scheduleFeedReminder,
  scheduleSleepReminder,
  scheduleMedicationReminder,
  cancelNotification,
  cancelAllNotifications,
  type ScheduleOptions,
} from '@/lib/notifications';

const PUSH_TOKEN_KEY = 'expo_push_token';

export type PermissionStatus = 'granted' | 'denied' | 'undetermined';

export interface NotificationPrefs {
  quietHours: { start: string; end: string } | null;
  categories: {
    feed: boolean;
    sleep: boolean;
    medication: boolean;
    prenatal: boolean;
    vaccination: boolean;
    insight: boolean;
  };
}

const DEFAULT_PREFS: NotificationPrefs = {
  quietHours: { start: '22:00', end: '06:00' },
  categories: {
    feed: true,
    sleep: true,
    medication: true,
    prenatal: true,
    vaccination: true,
    insight: true,
  },
};

const PREFS_KEY = 'notification_prefs';

export async function loadNotificationPrefs(): Promise<NotificationPrefs> {
  try {
    const raw = await AsyncStorage.getItem(PREFS_KEY);
    if (!raw) return DEFAULT_PREFS;
    return JSON.parse(raw) as NotificationPrefs;
  } catch {
    return DEFAULT_PREFS;
  }
}

export async function saveNotificationPrefs(
  prefs: NotificationPrefs,
): Promise<void> {
  await AsyncStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}

interface UseNotificationsReturn {
  pushToken: string | null;
  permissionStatus: PermissionStatus;
  isRegistered: boolean;
  prefs: NotificationPrefs;
  registerPushToken: () => Promise<void>;
  scheduleReminder: (params: ReminderParams) => Promise<string | null>;
  cancelReminder: (notificationId: string) => Promise<void>;
  cancelAll: () => Promise<void>;
  updatePrefs: (prefs: NotificationPrefs) => Promise<void>;
}

export type ReminderParams =
  | { type: 'feed'; babyId: string; babyName: string; intervalHours: number }
  | { type: 'sleep'; babyId: string; babyName: string }
  | { type: 'medication'; medicationName: string; scheduledTime: Date };

export function useNotifications(): UseNotificationsReturn {
  const userId = useAuthStore((s) => s.user?.id);
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] =
    useState<PermissionStatus>('undetermined');
  const [isRegistered, setIsRegistered] = useState(false);
  const [prefs, setPrefs] = useState<NotificationPrefs>(DEFAULT_PREFS);

  const responseListenerRef = useRef<ReturnType<typeof Notifications.addNotificationResponseReceivedListener> | null>(null);
  const receivedListenerRef = useRef<ReturnType<typeof Notifications.addNotificationReceivedListener> | null>(null);

  useEffect(() => {
    loadNotificationPrefs().then(setPrefs);
  }, []);

  useEffect(() => {
    registerPushToken();
  }, [userId]);

  useEffect(() => {
    responseListenerRef.current = addNotificationResponseListener(() => {});
    receivedListenerRef.current = addNotificationReceivedListener(() => {});
    return () => {
      responseListenerRef.current?.remove();
      receivedListenerRef.current?.remove();
    };
  }, []);

  const registerPushToken = useCallback(async () => {
    const token = await registerForPushNotificationsAsync();

    const { status } = await Notifications.getPermissionsAsync();
    setPermissionStatus(status as PermissionStatus);

    if (!token) {
      setIsRegistered(false);
      return;
    }

    const cached = await AsyncStorage.getItem(PUSH_TOKEN_KEY).catch(() => null);

    if (cached !== token) {
      await AsyncStorage.setItem(PUSH_TOKEN_KEY, token).catch(() => null);

      if (userId) {
        await supabase.auth
          .updateUser({ data: { push_token: token } })
          .catch(() => null);
      }
    }

    setPushToken(token);
    setIsRegistered(true);
  }, [userId]);

  const scheduleReminder = useCallback(
    async (params: ReminderParams): Promise<string | null> => {
      const options: ScheduleOptions = {
        quietHours: prefs.quietHours,
      };

      if (params.type === 'feed') {
        if (!prefs.categories.feed) return null;
        return scheduleFeedReminder(
          params.babyId,
          params.babyName,
          params.intervalHours,
          options,
        );
      }
      if (params.type === 'sleep') {
        if (!prefs.categories.sleep) return null;
        return scheduleSleepReminder(params.babyId, params.babyName, options);
      }
      if (params.type === 'medication') {
        if (!prefs.categories.medication) return null;
        return scheduleMedicationReminder(
          params.medicationName,
          params.scheduledTime,
          options,
        );
      }
      return null;
    },
    [prefs],
  );

  const cancelReminder = useCallback(async (id: string) => {
    await cancelNotification(id);
  }, []);

  const cancelAll = useCallback(async () => {
    await cancelAllNotifications();
  }, []);

  const updatePrefs = useCallback(async (next: NotificationPrefs) => {
    await saveNotificationPrefs(next);
    setPrefs(next);
  }, []);

  return {
    pushToken,
    permissionStatus,
    isRegistered,
    prefs,
    registerPushToken,
    scheduleReminder,
    cancelReminder,
    cancelAll,
    updatePrefs,
  };
}

export default useNotifications;
