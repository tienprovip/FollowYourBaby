import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Card from '@/components/ui/Card';
import AIDisclaimer from '@/components/ui/AIDisclaimer';
import RiskBadge from '@/components/ui/RiskBadge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAIDailySummary } from '@/hooks/useAIDailySummary';

interface DailySummaryCardProps {
  babyId?: string | null;
  pregnancyId?: string | null;
}

function SkeletonLine({ width }: { width: string }) {
  return (
    <View
      className={`h-3 bg-brand-gray rounded-full mb-2 ${width}`}
      accessibilityRole="none"
    />
  );
}

function DailySummaryCard({ babyId, pregnancyId }: DailySummaryCardProps) {
  const [expanded, setExpanded] = useState(false);

  const { summary, highlights, riskLevel, actionItems, isLoading, error, refetch } =
    useAIDailySummary({ babyId, pregnancyId, period: 'daily' });

  const hasContext = Boolean(babyId || pregnancyId);

  if (!hasContext) return null;

  return (
    <Card className="mx-4 mb-4">
      <AIDisclaimer className="mb-3" />

      {isLoading ? (
        <View className="py-2">
          <LoadingSpinner size="small" className="mb-3" />
          <SkeletonLine width="w-full" />
          <SkeletonLine width="w-4/5" />
          <SkeletonLine width="w-3/4" />
        </View>
      ) : error ? (
        <View className="py-2">
          <Text className="text-red-500 text-sm mb-2">Không thể tải tóm tắt hôm nay.</Text>
          <Pressable onPress={() => refetch()} accessibilityRole="button">
            <Text className="text-brand-pink text-sm font-semibold">Thử lại</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable
          onPress={() => setExpanded((v) => !v)}
          accessibilityRole="button"
          accessibilityLabel={expanded ? 'Thu gọn tóm tắt' : 'Mở rộng tóm tắt'}
        >
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-brand-navy font-bold text-sm flex-1 mr-2">
              Tóm tắt hôm nay
            </Text>
            <View className="flex-row items-center gap-2">
              <RiskBadge risk_level={riskLevel} />
              <Text className="text-brand-lavender text-xs font-medium">
                {expanded ? 'Thu gọn ▲' : 'Đọc thêm ▼'}
              </Text>
            </View>
          </View>

          <Text
            className="text-brand-navy/80 text-sm leading-6"
            numberOfLines={expanded ? undefined : 2}
          >
            {summary || 'Chưa có dữ liệu để tóm tắt hôm nay.'}
          </Text>

          {expanded && highlights.length > 0 && (
            <View className="mt-3">
              <Text className="text-brand-navy font-semibold text-xs mb-1">Điểm nổi bật:</Text>
              {highlights.map((h, i) => (
                <Text key={i} className="text-brand-navy/70 text-xs leading-5">
                  {'•'} {h}
                </Text>
              ))}
            </View>
          )}

          {expanded && actionItems.length > 0 && (
            <View className="mt-3">
              <Text className="text-brand-navy font-semibold text-xs mb-1">Gợi ý:</Text>
              {actionItems.map((a, i) => (
                <Text key={i} className="text-brand-lavender-700 text-xs leading-5">
                  {'•'} {a}
                </Text>
              ))}
            </View>
          )}
        </Pressable>
      )}
    </Card>
  );
}

export default DailySummaryCard;
