import { Tabs } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];
type MaterialCommunityIconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

interface TabIconProps {
  focused: boolean;
  color: string;
}

function makeTabIcon(name: IoniconsName, focusedName: IoniconsName) {
  return function TabIcon({ focused, color }: TabIconProps) {
    return (
      <Ionicons
        name={focused ? focusedName : name}
        size={focused ? 23 : 22}
        color={color}
      />
    );
  };
}

function makeMaterialTabIcon(name: MaterialCommunityIconName, focusedName: MaterialCommunityIconName) {
  return function TabIcon({ focused, color }: TabIconProps) {
    return (
      <MaterialCommunityIcons
        name={focused ? focusedName : name}
        size={focused ? 24 : 23}
        color={color}
      />
    );
  };
}

const HomeIcon = makeTabIcon('home-outline', 'home');
const TrackingIcon = makeTabIcon('create-outline', 'create');
const AIChatIcon = makeMaterialTabIcon('robot-outline', 'robot');
const KnowledgeIcon = makeTabIcon('book-outline', 'book');
const ProfileIcon = makeTabIcon('person-outline', 'person');

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 8);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          elevation: 12,
          shadowColor: '#1F2B5B',
          shadowOffset: { width: 0, height: -6 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
          height: 58 + bottomInset,
          paddingTop: 8,
          paddingBottom: bottomInset,
        },
        tabBarActiveTintColor: '#FF8FA8',
        tabBarInactiveTintColor: '#1F2B5B',
        tabBarItemStyle: {
          paddingVertical: 2,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          marginTop: 2,
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
      <Tabs.Screen name="pregnancy" options={{ tabBarButton: () => null, tabBarItemStyle: { display: 'none' } }} />
      <Tabs.Screen name="baby" options={{ tabBarButton: () => null, tabBarItemStyle: { display: 'none' } }} />
      <Tabs.Screen name="milestones" options={{ tabBarButton: () => null, tabBarItemStyle: { display: 'none' } }} />
    </Tabs>
  );
}
