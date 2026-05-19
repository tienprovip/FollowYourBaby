import {
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';

import { useCareShares } from '@/hooks/useCareShares';
import { useSubscription } from '@/hooks/useSubscription';
import { Avatar, Badge, Button, EmptyState, LoadingSpinner } from '@/components/ui';
import type { Database } from '@/types/database';

type CareShareRow = Database['public']['Tables']['care_shares']['Row'];

const PERMISSION_LABELS: Record<string, { label: string; variant: 'green' | 'blue' | 'lavender' }> = {
  view: { label: 'Xem', variant: 'blue' },
  edit: { label: 'Chỉnh sửa', variant: 'green' },
  full: { label: 'Toàn quyền', variant: 'lavender' },
};

const RESOURCE_LABELS: Record<string, string> = {
  baby: 'Hồ sơ bé',
  pregnancy: 'Thai kỳ',
};

export default function CareSharingScreen() {
  const router = useRouter();
  const { canShareCare } = useSubscription();
  const {
    sharesGranted,
    isLoadingGranted,
    sharesReceived,
    isLoadingReceived,
    revokeShare,
    isRevoking,
  } = useCareShares();

  function handleInvite() {
    if (!canShareCare) {
      Alert.alert(
        'Tính năng Premium',
        'Chia sẻ chăm sóc chỉ có trên gói Premium trở lên. Nâng cấp để mời người thân cùng theo dõi bé.',
        [
          { text: 'Để sau', style: 'cancel' },
          { text: 'Nâng cấp', onPress: () => router.push('/paywall') },
        ],
      );
      return;
    }
    router.push('/(profile)/invite');
  }

  const isLoading = isLoadingGranted || isLoadingReceived;

  function confirmRevoke(share: CareShareRow & { profiles: { full_name: string | null; avatar_url: string | null } | null }) {
    const name = share.profiles?.full_name ?? 'người dùng này';
    Alert.alert(
      'Thu hồi quyền truy cập',
      `Bạn có chắc muốn thu hồi quyền truy cập của ${name}?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Thu hồi',
          style: 'destructive',
          onPress: async () => {
            try {
              await revokeShare(share.id);
            } catch {
              Alert.alert('Lỗi', 'Không thể thu hồi quyền. Vui lòng thử lại.');
            }
          },
        },
      ],
    );
  }

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-brand-peach">
        <LoadingSpinner />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Chia sẻ chăm sóc' }} />
      <FlatList
        data={[]}
        keyExtractor={() => 'placeholder'}
        style={{ backgroundColor: '#fff5f7' }}
        contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
        renderItem={null}
        ListHeaderComponent={
          <>
            {/* Shares I granted */}
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-base font-bold text-brand-navy">Bạn đã chia sẻ với</Text>
              <Button
                label="Mời người"
                variant="primary"
                size="sm"
                onPress={handleInvite}
              />
            </View>

            {sharesGranted.length === 0 ? (
              <EmptyState
                title="Chưa chia sẻ với ai"
                description="Mời người thân hoặc người chăm sóc để cùng theo dõi."
                className="mb-6"
              />
            ) : (
              <View className="gap-y-3 mb-6">
                {sharesGranted.map((share) => {
                  const perm = PERMISSION_LABELS[share.permission] ?? { label: share.permission, variant: 'neutral' as const };
                  return (
                    <View key={share.id} className="bg-white rounded-card p-4 shadow-brand border border-brand-gray">
                      <View className="flex-row items-center gap-x-3">
                        <Avatar
                          name={share.profiles?.full_name ?? undefined}
                          size="sm"
                        />
                        <View className="flex-1">
                          <Text className="text-sm font-semibold text-brand-navy">
                            {share.profiles?.full_name ?? 'Chờ chấp nhận...'}
                          </Text>
                          <Text className="text-xs text-brand-navy/50">
                            {RESOURCE_LABELS[share.resource_type] ?? share.resource_type}
                          </Text>
                        </View>
                        <Badge label={perm.label} variant={perm.variant} />
                      </View>
                      {share.accepted_at === null && (
                        <Text className="text-xs text-amber-500 mt-2">Đang chờ người nhận xác nhận</Text>
                      )}
                      <TouchableOpacity
                        onPress={() => confirmRevoke(share as Parameters<typeof confirmRevoke>[0])}
                        disabled={isRevoking}
                        accessibilityRole="button"
                        className="mt-3 bg-red-50 rounded-btn py-2 items-center"
                      >
                        <Text className="text-sm font-semibold text-red-500">Thu hồi quyền</Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            )}

            {/* Shares granted to me */}
            <Text className="text-base font-bold text-brand-navy mb-2">Được chia sẻ với bạn</Text>

            {sharesReceived.length === 0 ? (
              <EmptyState
                title="Chưa có dữ liệu được chia sẻ"
                description="Khi ai đó chia sẻ dữ liệu với bạn, nó sẽ xuất hiện ở đây."
              />
            ) : (
              <View className="gap-y-3">
                {sharesReceived.map((share) => {
                  const perm = PERMISSION_LABELS[share.permission] ?? { label: share.permission, variant: 'neutral' as const };
                  return (
                    <View key={share.id} className="bg-white rounded-card p-4 shadow-brand border border-brand-lavender/40">
                      <View className="bg-brand-lavender/10 rounded-input px-3 py-2 mb-3">
                        <Text className="text-xs text-brand-lavender-700 font-medium">
                          Bạn đang xem dữ liệu được chia sẻ
                        </Text>
                      </View>
                      <View className="flex-row items-center gap-x-3">
                        <View className="flex-1">
                          <Text className="text-xs text-brand-navy/50">
                            {RESOURCE_LABELS[share.resource_type] ?? share.resource_type}
                          </Text>
                          {share.accepted_at === null && (
                            <Text className="text-xs text-amber-500 mt-1">Chưa được chấp nhận</Text>
                          )}
                        </View>
                        <Badge label={perm.label} variant={perm.variant} />
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </>
        }
      />
    </>
  );
}
