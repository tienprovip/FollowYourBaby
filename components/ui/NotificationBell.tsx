import React, { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';

export interface NotificationBellProps {
  color?: string;
}

function NotificationBell({ color = '#1F2B5B' }: NotificationBellProps) {
  const router = useRouter();
  const [badgeCount, setBadgeCount] = useState(0);

  useEffect(() => {
    let mounted = true;

    async function syncCount() {
      const scheduled = await Notifications.getAllScheduledNotificationsAsync().catch(
        () => [],
      );
      if (mounted) setBadgeCount(scheduled.length);
    }

    syncCount();

    const sub = Notifications.addNotificationReceivedListener(() => {
      syncCount();
    });

    return () => {
      mounted = false;
      sub.remove();
    };
  }, []);

  return (
    <Pressable
      onPress={() => router.push('/(tabs)/reminders')}
      className="relative w-10 h-10 items-center justify-center active:opacity-70"
      accessibilityRole="button"
      accessibilityLabel={
        badgeCount > 0
          ? `${badgeCount} nhắc nhở đang chờ`
          : 'Trung tâm nhắc nhở'
      }
    >
      <Ionicons name="notifications-outline" size={24} color={color} />
      {badgeCount > 0 && (
        <View className="absolute top-1 right-1 bg-brand-pink rounded-full min-w-[16px] h-4 items-center justify-center px-1">
          <Text className="text-white text-[10px] font-bold leading-none">
            {badgeCount > 99 ? '99+' : String(badgeCount)}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

export default NotificationBell;
