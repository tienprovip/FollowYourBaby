import { View } from 'react-native';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Shown briefly while NavigationGuard (in _layout.tsx) resolves the session
// and redirects to either /(auth)/login or /(tabs)/.
export default function RootIndex() {
  return (
    <View className="flex-1 items-center justify-center bg-brand-peach">
      <LoadingSpinner size="large" />
    </View>
  );
}
