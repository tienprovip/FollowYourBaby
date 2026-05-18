// ---------------------------------------------------------------------------
// Baby Profile Detail Screen — basic info, health profile, growth summary,
// and quick links to growth chart + milestones.
// ---------------------------------------------------------------------------

import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Stack, router } from 'expo-router';
import { useBaby } from '@/hooks/useBaby';
import { useBabyProfile } from '@/hooks/useBabyProfile';
import { useGrowthLogs } from '@/hooks/useGrowthLogs';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import type { Json } from '@/types/database';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const SEX_LABELS: Record<string, string> = {
  male: 'Be trai',
  female: 'Be gai',
  other: 'Khac',
};

function formatDob(isoDate: string): string {
  const d = new Date(isoDate);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

// Safely convert a Json array of records with a "name" key to string[]
function jsonToStringList(json: Json | null | undefined): string[] {
  if (!json || !Array.isArray(json)) return [];
  return json
    .filter(
      (item): item is Record<string, Json> =>
        typeof item === 'object' && item !== null && !Array.isArray(item),
    )
    .map((item) => {
      const name = item['name'];
      return typeof name === 'string' ? name : JSON.stringify(item);
    })
    .filter(Boolean);
}

// ---------------------------------------------------------------------------
// InfoRow
// ---------------------------------------------------------------------------

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  if (!value) return null;
  return (
    <View className="flex-row items-start py-2 border-b border-brand-gray last:border-0">
      <Text className="text-brand-navy/60 text-sm w-36">{label}</Text>
      <Text className="text-brand-navy text-sm font-medium flex-1">{value}</Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Main screen
// ---------------------------------------------------------------------------

export default function BabyProfileScreen() {
  const { baby, isLoading: babyLoading } = useBaby();
  const { healthProfile, isLoading: healthLoading } = useBabyProfile();
  const { latestLog, isLoading: growthLoading } = useGrowthLogs(
    baby?.sex,
    baby?.dob,
  );

  const isLoading = babyLoading || healthLoading || growthLoading;

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-brand-peach">
        <LoadingSpinner />
      </View>
    );
  }

  if (!baby) {
    return (
      <EmptyState
        title="Chua co be nao"
        body="Them em be trong phan Ho so de xem thong tin."
        cta={{ label: 'Quay lai', onPress: () => router.back() }}
      />
    );
  }

  const allergies = jsonToStringList(healthProfile?.allergies);
  const medHistory = jsonToStringList(healthProfile?.medical_history);

  return (
    <>
      <Stack.Screen options={{ title: baby.name }} />

      <ScrollView
        className="flex-1 bg-brand-peach"
        contentContainerStyle={{ padding: 20, paddingBottom: 60 }}
      >
        {/* ----------------------------------------------------------------- */}
        {/* Avatar + name */}
        {/* ----------------------------------------------------------------- */}
        <View className="items-center mb-6">
          <View className="w-20 h-20 rounded-full bg-brand-mint/40 items-center justify-center mb-3">
            <Text style={{ fontSize: 40 }}>
              {baby.sex === 'female' ? '' : ''}
            </Text>
          </View>
          <Text className="text-brand-navy text-2xl font-bold">{baby.name}</Text>
          <Text className="text-brand-navy/60 text-sm mt-1">{baby.ageLabel}</Text>
        </View>

        {/* ----------------------------------------------------------------- */}
        {/* Basic info */}
        {/* ----------------------------------------------------------------- */}
        <Card padding="md" className="mb-4">
          <Text className="text-brand-navy font-bold mb-3">Thong tin co ban</Text>
          <InfoRow label="Ngay sinh" value={formatDob(baby.dob)} />
          <InfoRow label="Gioi tinh" value={SEX_LABELS[baby.sex ?? ''] ?? null} />
          {baby.birth_weight_g != null && (
            <InfoRow
              label="Can nang luc sinh"
              value={`${(baby.birth_weight_g / 1000).toFixed(3)} kg`}
            />
          )}
          {baby.birth_length_cm != null && (
            <InfoRow
              label="Chieu dai luc sinh"
              value={`${baby.birth_length_cm} cm`}
            />
          )}
        </Card>

        {/* ----------------------------------------------------------------- */}
        {/* Growth summary */}
        {/* ----------------------------------------------------------------- */}
        {latestLog && (
          <Card padding="md" className="mb-4">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-brand-navy font-bold">Tang truong</Text>
              <TouchableOpacity
                onPress={() => router.push('/(baby)/growth')}
                accessibilityRole="link"
              >
                <Text className="text-brand-pink text-xs font-semibold">
                  Xem bieu do
                </Text>
              </TouchableOpacity>
            </View>
            <View className="flex-row flex-wrap gap-4">
              {latestLog.weight_g != null && (
                <View className="items-center min-w-[80px]">
                  <Text className="text-brand-navy text-xl font-bold">
                    {(latestLog.weight_g / 1000).toFixed(2)} kg
                  </Text>
                  <Text className="text-brand-navy/60 text-xs">Can nang</Text>
                  {latestLog.weightPercentile && (
                    <Badge
                      label={latestLog.weightPercentile}
                      variant="blue"
                      className="mt-1"
                    />
                  )}
                </View>
              )}
              {latestLog.length_cm != null && (
                <View className="items-center min-w-[80px]">
                  <Text className="text-brand-navy text-xl font-bold">
                    {latestLog.length_cm.toFixed(1)} cm
                  </Text>
                  <Text className="text-brand-navy/60 text-xs">Chieu cao</Text>
                  {latestLog.lengthPercentile && (
                    <Badge
                      label={latestLog.lengthPercentile}
                      variant="blue"
                      className="mt-1"
                    />
                  )}
                </View>
              )}
              {latestLog.head_cm != null && (
                <View className="items-center min-w-[80px]">
                  <Text className="text-brand-navy text-xl font-bold">
                    {latestLog.head_cm.toFixed(1)} cm
                  </Text>
                  <Text className="text-brand-navy/60 text-xs">Vong dau</Text>
                  {latestLog.headPercentile && (
                    <Badge
                      label={latestLog.headPercentile}
                      variant="blue"
                      className="mt-1"
                    />
                  )}
                </View>
              )}
            </View>
          </Card>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* Health profile */}
        {/* ----------------------------------------------------------------- */}
        <Card padding="md" className="mb-4">
          <Text className="text-brand-navy font-bold mb-3">Ho so suc khoe</Text>

          <Text className="text-brand-navy/70 text-sm font-semibold mb-1">
            Di ung
          </Text>
          {allergies.length > 0 ? (
            <View className="flex-row flex-wrap gap-2 mb-3">
              {allergies.map((a) => (
                <Badge key={a} label={a} variant="yellow" />
              ))}
            </View>
          ) : (
            <Text className="text-brand-navy/40 text-sm mb-3">
              Chua ghi nhan di ung
            </Text>
          )}

          <Text className="text-brand-navy/70 text-sm font-semibold mb-1">
            Tien su benh
          </Text>
          {medHistory.length > 0 ? (
            <View className="gap-y-1 mb-2">
              {medHistory.map((h) => (
                <Text key={h} className="text-brand-navy/70 text-sm">
                  - {h}
                </Text>
              ))}
            </View>
          ) : (
            <Text className="text-brand-navy/40 text-sm">
              Chua co tien su benh
            </Text>
          )}
        </Card>

        {/* ----------------------------------------------------------------- */}
        {/* Quick links */}
        {/* ----------------------------------------------------------------- */}
        <View className="gap-y-3">
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/milestones')}
            className="bg-white rounded-card shadow-brand px-4 py-4 flex-row items-center border border-brand-mint/40"
            accessibilityRole="button"
          >
            <Text style={{ fontSize: 24 }} className="mr-3"></Text>
            <View className="flex-1">
              <Text className="text-brand-navy font-semibold text-sm">
                Moc phat trien
              </Text>
              <Text className="text-brand-navy/50 text-xs">
                Theo doi va danh dau cac moc quan trong
              </Text>
            </View>
            <Text className="text-brand-navy/40">›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(baby)/growth')}
            className="bg-white rounded-card shadow-brand px-4 py-4 flex-row items-center border border-brand-blue/40"
            accessibilityRole="button"
          >
            <Text style={{ fontSize: 24 }} className="mr-3">📏</Text>
            <View className="flex-1">
              <Text className="text-brand-navy font-semibold text-sm">
                Bieu do tang truong
              </Text>
              <Text className="text-brand-navy/50 text-xs">
                Xem bieu do WHO can nang, chieu cao
              </Text>
            </View>
            <Text className="text-brand-navy/40">›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}
