import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { useActivePregnancy } from '@/hooks/usePregnancy';
import { useBabyStore } from '@/stores/babyStore';

// ---------------------------------------------------------------------------
// Tab icon primitives — defined at module level so their references are stable
// and do not trigger re-renders on every layout paint (fixes S6478).
// ---------------------------------------------------------------------------

interface TabIconProps {
  focused: boolean;
}

function HomeIcon({ focused }: TabIconProps) {
  return (
    <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.45 }}>🏠</Text>
  );
}

function PregnancyIcon({ focused }: TabIconProps) {
  return (
    <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.45 }}>🤰</Text>
  );
}

function BabyIcon({ focused }: TabIconProps) {
  return (
    <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.45 }}>🍼</Text>
  );
}

function ProfileIcon({ focused }: TabIconProps) {
  return (
    <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.45 }}>👤</Text>
  );
}

// ---------------------------------------------------------------------------
// Tab layout
// ---------------------------------------------------------------------------

export default function TabsLayout() {
  const { hasActivePregnancy } = useActivePregnancy();
  const { activeBabyId } = useBabyStore();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#F7F7F7',
          borderTopWidth: 1,
          elevation: 8,
          shadowColor: '#1F2B5B',
          shadowOpacity: 0.06,
          shadowRadius: 12,
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: '#FF8FA8',
        tabBarInactiveTintColor: '#B0B8CC',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Trang chủ',
          tabBarIcon: HomeIcon,
        }}
      />
      <Tabs.Screen
        name="pregnancy"
        options={{
          title: 'Mẹ bầu',
          tabBarIcon: PregnancyIcon,
          // Hide tab when user has no active pregnancy.
          // The screen remains routable via router.push for direct navigation.
          href: hasActivePregnancy ? '/(tabs)/pregnancy' : null,
        }}
      />
      <Tabs.Screen
        name="baby"
        options={{
          title: 'Em bé',
          tabBarIcon: BabyIcon,
          href: activeBabyId ? '/(tabs)/baby' : null,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Hồ sơ',
          tabBarIcon: ProfileIcon,
        }}
      />
    </Tabs>
  );
}
