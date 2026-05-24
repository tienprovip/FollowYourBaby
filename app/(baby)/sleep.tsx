// ---------------------------------------------------------------------------
// Sleep Screen — start/stop sleep sessions, view history
// ---------------------------------------------------------------------------

import React, { useState, useCallback } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Stack } from 'expo-router';
import { inputStyles } from '@/lib/inputStyles';
import { format, parseISO, differenceInMinutes } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useSleepLogs } from '@/hooks/useSleepLogs';
import { useBabyTrackingStore } from '@/stores/babyTrackingStore';
import { useBabyStore } from '@/stores/babyStore';
import { useToast } from '@/components/ui/Toast';
import { formatDuration } from '@/lib/babyUtils';
import SleepTimer from '@/components/baby/SleepTimer';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import type { SleepKind } from '@/stores/babyTrackingStore';
import type { Database } from '@/types/database';

type SleepLog = Database['public']['Tables']['sleep_logs']['Row'];

const KIND_OPTIONS: { key: SleepKind; label: string; emoji: string }[] = [
  { key: 'nap', label: 'Ngu ngay', emoji: '☀️' },
  { key: 'night', label: 'Ngu dem', emoji: '🌙' },
];

function formatSleepDuration(log: SleepLog): string {
  if (!log.ended_at) return 'Dang ngu...';
  const mins = differenceInMinutes(parseISO(log.ended_at), parseISO(log.started_at));
  return formatDuration(mins * 60 * 1000);
}

export default function SleepScreen() {
  const { activeBabyId } = useBabyStore();
  const { logs, isLoading, todayNapMinutes, todayNightMinutes, addSleepLog, isAdding, deleteSleepLog } =
    useSleepLogs();
  const { activeSleepSession, setActiveSleepSession, clearActiveSleepSession } =
    useBabyTrackingStore();
  const { show: showToast } = useToast();

  const [selectedKind, setSelectedKind] = useState<SleepKind>('nap');
  const [note, setNote] = useState('');

  function startSleep() {
    if (!activeBabyId) return;
    setActiveSleepSession({
      babyId: activeBabyId,
      startedAt: new Date(),
      kind: selectedKind,
    });
  }

  async function stopSleep() {
    if (!activeSleepSession) return;
    try {
      await addSleepLog({
        started_at: activeSleepSession.startedAt.toISOString(),
        ended_at: new Date().toISOString(),
        kind: activeSleepSession.kind,
        note: note || null,
      });
      clearActiveSleepSession();
      setNote('');
      showToast('Da luu giac ngu — Hoan tac', 'success', 5000);
    } catch {
      Alert.alert('Loi', 'Khong the luu giac ngu.');
    }
  }

  async function markStillSleeping() {
    if (!activeBabyId) return;
    // Save with no ended_at — indicates still sleeping
    try {
      await addSleepLog({
        started_at: activeSleepSession
          ? activeSleepSession.startedAt.toISOString()
          : new Date().toISOString(),
        ended_at: null,
        kind: selectedKind,
        note: 'Dang ngu',
      });
      clearActiveSleepSession();
      showToast('Da ghi — con ngu', 'success', 5000);
    } catch {
      Alert.alert('Loi', 'Khong the luu.');
    }
  }

  const handleDelete = useCallback(
    (id: string) => {
      Alert.alert('Xoa giac ngu', 'Ban co chac?', [
        { text: 'Huy', style: 'cancel' },
        {
          text: 'Xoa',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteSleepLog(id);
            } catch {
              Alert.alert('Loi', 'Khong the xoa.');
            }
          },
        },
      ]);
    },
    [deleteSleepLog],
  );

  const napH = (todayNapMinutes / 60).toFixed(1);
  const nightH = (todayNightMinutes / 60).toFixed(1);

  return (
    <>
      <Stack.Screen options={{ title: 'Giac ngu' }} />
      <ScrollView
        className="flex-1 bg-brand-peach"
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      >
        {/* Today's summary */}
        <Card padding="md" className="mb-4">
          <Text className="text-brand-navy font-semibold mb-2">Hom nay</Text>
          <View className="flex-row">
            <View className="flex-1 items-center">
              <Text className="text-2xl font-bold text-brand-navy">{napH}g</Text>
              <Text className="text-xs text-brand-navy/60">Ngu ngay</Text>
            </View>
            <View className="w-px bg-brand-gray" />
            <View className="flex-1 items-center">
              <Text className="text-2xl font-bold text-brand-navy">{nightH}g</Text>
              <Text className="text-xs text-brand-navy/60">Ngu dem</Text>
            </View>
            <View className="w-px bg-brand-gray" />
            <View className="flex-1 items-center">
              <Text className="text-2xl font-bold text-brand-navy">
                {((todayNapMinutes + todayNightMinutes) / 60).toFixed(1)}g
              </Text>
              <Text className="text-xs text-brand-navy/60">Tong cong</Text>
            </View>
          </View>
        </Card>

        {/* Active session or start buttons */}
        {activeSleepSession ? (
          <Card padding="lg" className="mb-4 items-center">
            <Text className="text-brand-navy font-semibold mb-4">
              {activeSleepSession.kind === 'nap' ? 'Ngu ngay' : 'Ngu dem'}
            </Text>
            <SleepTimer startedAt={activeSleepSession.startedAt} className="mb-4" />
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="Ghi chu (tuy chon)"
              className="w-full border border-brand-gray rounded-input px-4 py-3 text-brand-navy text-sm mb-4"
              placeholderTextColor="#1F2B5B60"
              style={inputStyles.field}
            />
            <View className="flex-row gap-x-3 w-full">
              <Button
                label="Thuc day"
                variant="primary"
                size="md"
                className="flex-1"
                loading={isAdding}
                onPress={stopSleep}
              />
              <Button
                label="Huy phien"
                variant="secondary"
                size="md"
                className="flex-1"
                onPress={() => clearActiveSleepSession()}
              />
            </View>
          </Card>
        ) : (
          <Card padding="lg" className="mb-4">
            <Text className="text-brand-navy font-semibold mb-3">
              Loai giac ngu
            </Text>
            <View className="flex-row gap-x-3 mb-4">
              {KIND_OPTIONS.map((opt) => (
                <Pressable
                  key={opt.key}
                  onPress={() => setSelectedKind(opt.key)}
                  className={`flex-1 items-center py-4 rounded-card border-2 ${
                    selectedKind === opt.key
                      ? 'border-brand-blue bg-brand-blue/10'
                      : 'border-brand-gray bg-white'
                  }`}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selectedKind === opt.key }}
                  accessibilityLabel={opt.label}
                >
                  <Text style={{ fontSize: 28 }}>{opt.emoji}</Text>
                  <Text
                    className={`text-sm mt-1 font-semibold ${
                      selectedKind === opt.key
                        ? 'text-brand-blue'
                        : 'text-brand-navy/60'
                    }`}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              ))}
            </View>
            <Button
              label="Bat dau ngu"
              variant="primary"
              size="lg"
              onPress={startSleep}
            />
          </Card>
        )}

        {/* History */}
        <Text className="text-brand-navy font-semibold mb-2">Lich su 7 ngay</Text>
        {isLoading ? (
          <LoadingSpinner />
        ) : logs.length === 0 ? (
          <EmptyState
            title="Chua co ban ghi"
            body="Bat dau theo doi giac ngu cua be"
          />
        ) : (
          logs.map((log) => (
            <SleepLogRow key={log.id} log={log} onDelete={() => handleDelete(log.id)} />
          ))
        )}
      </ScrollView>
    </>
  );
}

// ---------------------------------------------------------------------------
// SleepLogRow
// ---------------------------------------------------------------------------

function SleepLogRow({
  log,
  onDelete,
}: {
  log: SleepLog;
  onDelete: () => void;
}) {
  const kindLabel = log.kind === 'nap' ? 'Ngu ngay' : 'Ngu dem';
  const kindEmoji = log.kind === 'nap' ? '☀️' : '🌙';
  const startStr = format(parseISO(log.started_at), 'HH:mm dd/MM', { locale: vi });
  const duration = formatSleepDuration(log);

  return (
    <Card padding="sm" className="mb-2">
      <View className="flex-row items-center">
        <Text style={{ fontSize: 22 }} className="mr-3">
          {kindEmoji}
        </Text>
        <View className="flex-1">
          <Text className="text-brand-navy font-semibold text-sm">
            {kindLabel} — {duration}
          </Text>
          <Text className="text-brand-navy/50 text-xs">{startStr}</Text>
          {log.note && (
            <Text className="text-brand-navy/50 text-xs">{log.note}</Text>
          )}
        </View>
        <TouchableOpacity onPress={onDelete} className="p-2" accessibilityLabel="Xoa ban ghi">
          <Text className="text-red-400 text-sm">Xoa</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}
