import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useActivePregnancy } from '@/hooks/usePregnancy';
import { useBabyStore } from '@/stores/babyStore';
import EmptyState from '@/components/ui/EmptyState';
import PregnancyTab from './pregnancy';
import BabyTab from './baby';

export default function TrackingTab() {
  const { hasActivePregnancy } = useActivePregnancy();
  const { activeBabyId } = useBabyStore();

  if (hasActivePregnancy) return <PregnancyTab />;
  if (activeBabyId) return <BabyTab />;

  return (
    <SafeAreaView className="flex-1 bg-brand-peach" edges={['top']}>
      <EmptyState
        title="Chưa có hành trình nào"
        body="Thêm thai kỳ hoặc hồ sơ em bé để bắt đầu theo dõi."
        cta={{
          label: 'Thiết lập hồ sơ',
          onPress: () => router.push('/(tabs)/profile'),
        }}
      />
    </SafeAreaView>
  );
}
