import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function setupAndroidNotificationChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync('default', {
    name: 'Nhắc nhở',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#FF8FA8',
  });
  await Notifications.setNotificationChannelAsync('reminders', {
    name: 'Nhắc nhở bé',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#FF8FA8',
  });
  await Notifications.setNotificationChannelAsync('medication', {
    name: 'Nhắc thuốc',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 500, 250, 500],
    lightColor: '#B79CFF',
  });
}

export async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (Platform.OS === 'android') {
    await setupAndroidNotificationChannel();
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return null;
  }

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId;

  if (!projectId) {
    return null;
  }

  try {
    const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
    return tokenData.data;
  } catch {
    return null;
  }
}

function isInQuietHours(
  quietHours: { start: string; end: string } | null,
): boolean {
  if (!quietHours) return false;

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [startH, startM] = quietHours.start.split(':').map(Number);
  const [endH, endM] = quietHours.end.split(':').map(Number);
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  if (startMinutes <= endMinutes) {
    return currentMinutes >= startMinutes && currentMinutes < endMinutes;
  }
  return currentMinutes >= startMinutes || currentMinutes < endMinutes;
}

export interface ScheduleOptions {
  quietHours?: { start: string; end: string } | null;
}

export async function scheduleFeedReminder(
  babyId: string,
  babyName: string,
  intervalHours: number,
  options: ScheduleOptions = {},
): Promise<string | null> {
  if (isInQuietHours(options.quietHours ?? null)) return null;

  const trigger = new Date(Date.now() + intervalHours * 60 * 60 * 1000);

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Nhắc bú',
      body: `${babyName}: đã đến giờ bú rồi!`,
      data: {
        type: 'feed_reminder',
        babyId,
        route: '/(tabs)/tracking',
      },
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: trigger,
    },
  });
  return id;
}

export async function scheduleSleepReminder(
  babyId: string,
  babyName: string,
  options: ScheduleOptions = {},
): Promise<string | null> {
  if (isInQuietHours(options.quietHours ?? null)) return null;

  const twoHoursLater = new Date(Date.now() + 2 * 60 * 60 * 1000);

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Kiểm tra bé',
      body: `${babyName}: bé ngủ đã 2 giờ, hãy kiểm tra tã nhé!`,
      data: {
        type: 'sleep_reminder',
        babyId,
        route: '/(tabs)/tracking',
      },
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: twoHoursLater,
    },
  });
  return id;
}

export async function scheduleMedicationReminder(
  medicationName: string,
  scheduledTime: Date,
  options: ScheduleOptions = {},
): Promise<string | null> {
  if (scheduledTime <= new Date()) return null;
  if (isInQuietHours(options.quietHours ?? null)) return null;

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Nhắc uống thuốc',
      body: `Đến giờ uống ${medicationName} rồi!`,
      data: {
        type: 'medication_reminder',
        medicationName,
        route: '/(tabs)/tracking',
      },
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: scheduledTime,
    },
  });
  return id;
}

export async function scheduleVaccinationReminder(
  babyId: string,
  babyName: string,
  vaccineName: string,
  scheduledDate: Date,
  options: ScheduleOptions = {},
): Promise<string | null> {
  const oneDayBefore = new Date(scheduledDate.getTime() - 24 * 60 * 60 * 1000);
  if (oneDayBefore <= new Date()) return null;
  if (isInQuietHours(options.quietHours ?? null)) return null;

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Nhắc tiêm phòng',
      body: `${babyName}: ngày mai là lịch tiêm ${vaccineName}!`,
      data: {
        type: 'vaccination_reminder',
        babyId,
        vaccineName,
        route: '/(tabs)/reminders',
      },
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: oneDayBefore,
    },
  });
  return id;
}

export async function schedulePrenatalVisitReminder(
  pregnancyId: string,
  visitType: string,
  scheduledAt: Date,
  options: ScheduleOptions = {},
): Promise<string[]> {
  const ids: string[] = [];
  const now = new Date();

  const oneDayBefore = new Date(scheduledAt.getTime() - 24 * 60 * 60 * 1000);
  const twoHoursBefore = new Date(scheduledAt.getTime() - 2 * 60 * 60 * 1000);

  if (oneDayBefore > now && !isInQuietHours(options.quietHours ?? null)) {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Nhắc khám thai',
        body: `Ngày mai bạn có lịch ${visitType}. Đừng quên nhé!`,
        data: {
          type: 'prenatal_visit_reminder',
          pregnancyId,
          route: '/(tabs)/reminders',
        },
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: oneDayBefore,
      },
    });
    ids.push(id);
  }

  if (twoHoursBefore > now) {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Sắp đến giờ khám thai',
        body: `Còn 2 tiếng nữa là đến ${visitType}. Chuẩn bị đi nhé!`,
        data: {
          type: 'prenatal_visit_reminder',
          pregnancyId,
          route: '/(tabs)/reminders',
        },
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: twoHoursBefore,
      },
    });
    ids.push(id);
  }

  return ids;
}

export async function cancelNotification(notificationId: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}

export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
  return Notifications.getAllScheduledNotificationsAsync();
}

export function addNotificationResponseListener(
  handler: (response: Notifications.NotificationResponse) => void,
): ReturnType<typeof Notifications.addNotificationResponseReceivedListener> {
  return Notifications.addNotificationResponseReceivedListener(handler);
}

export function addNotificationReceivedListener(
  handler: (notification: Notifications.Notification) => void,
): ReturnType<typeof Notifications.addNotificationReceivedListener> {
  return Notifications.addNotificationReceivedListener(handler);
}
