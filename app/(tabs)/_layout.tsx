import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

function makeTabIcon(name: IoniconsName, focusedName: IoniconsName) {
  return function TabIcon({ focused }: { focused: boolean }) {
    return (
      <Ionicons
        name={focused ? focusedName : name}
        size={22}
        color={focused ? '#FF8FA8' : '#B0B8CC'}
      />
    );
  };
}

const HomeIcon = makeTabIcon('home-outline', 'home');
const TrackingIcon = makeTabIcon('pulse-outline', 'pulse');
const AIChatIcon = makeTabIcon('sparkles-outline', 'sparkles');
const KnowledgeIcon = makeTabIcon('book-outline', 'book');
const ProfileIcon = makeTabIcon('person-outline', 'person');

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#F0F0F0',
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
        options={{ title: 'Trang chủ', tabBarIcon: HomeIcon }}
      />
      <Tabs.Screen
        name="tracking"
        options={{ title: 'Theo dõi', tabBarIcon: TrackingIcon }}
      />
      <Tabs.Screen
        name="ai-chat"
        options={{ title: 'AI trợ lý', tabBarIcon: AIChatIcon }}
      />
      <Tabs.Screen
        name="knowledge"
        options={{ title: 'Kiến thức', tabBarIcon: KnowledgeIcon }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Tài khoản', tabBarIcon: ProfileIcon }}
      />

      {/* Routable but hidden from the tab bar */}
      <Tabs.Screen name="pregnancy" options={{ tabBarButton: () => null }} />
      <Tabs.Screen name="baby" options={{ tabBarButton: () => null }} />
      <Tabs.Screen name="milestones" options={{ tabBarButton: () => null }} />
    </Tabs>
  );
}
