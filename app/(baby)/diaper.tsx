// ---------------------------------------------------------------------------
// Diaper Screen — quick-log diaper changes with counts + history
// ---------------------------------------------------------------------------

import React, { useState, useCallback } from 'react';
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Stack } from 'expo-router';
import { inputStyles } from '@/lib/inputStyles';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useDiaperLogs } from '@/hooks/useDiaperLogs';
import { useToast } from '@/components/ui/Toast';
import DiaperButton from '@/components/baby/DiaperButton';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import type { Database } from '@/types/database';

type DiaperLog = Database['public']['Tables']['diaper_logs']['Row'];
type DiaperKind = 'wet' | 'dirty' | 'both';

const KIND_LABELS: Record<DiaperKind, string> = {
  wet: 'Uot',
  dirty: 'Ban',
  both: 'Ca hai',
};

const KIND_EMOJIS: Record<DiaperKind, string> = {
  wet: '💧',
  dirty: '💩',
  both: '🔄',
};

export default function DiaperScreen() {
  const { logs, isLoading, todayWet, todayDirty, todayCount, addDiaperLog, isAdding, deleteDiaperLog } =
    useDiaperLogs();
  const { show: showToast } = useToast();

  const [note, setNote] = useState('');
  const [pendingKind, setPendingKind] = useState<DiaperKind | null>(null);

  async function handleQuickLog(kind: DiaperKind) {
    try {
      await addDiaperLog({
        kind,
        recorded_at: new Date().toISOString(),
        note: note || null,
      });
      setNote('');
      setPendingKind(null);
      showToast(`Da ghi ta ${KIND_LABELS[kind]} — Hoan tac`, 'success', 5000);
    } catch {
      Alert.alert('Loi', 'Khong the luu. Vui long thu lai.');
    }
  }

  const handleDelete = useCallback(
    (id: string) => {
      Alert.alert('Xoa ban ghi', 'Ban co chac?', [
        { text: 'Huy', style: 'cancel' },
        {
          text: 'Xoa',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDiaperLog(id);
            } catch {
              Alert.alert('Loi', 'Khong the xoa.');
            }
          },
        },
      ]);
    },
    [deleteDiaperLog],
  );

  return (
    <>
      <Stack.Screen options={{ title: 'Thay ta' }} />
      <ScrollView
        className="flex-1 bg-brand-peach"
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      >
        {/* Today's counts */}
        <Card padding="md" className="mb-4">
          <Text className="text-brand-navy font-semibold mb-2">Hom nay</Text>
          <View className="flex-row">
            <View className="flex-1 items-center">
              <Text className="text-2xl font-bold text-brand-navy">{todayCount}</Text>
              <Text className="text-xs text-brand-navy/60">Tong</Text>
            </View>
            <View className="w-px bg-brand-gray" />
            <View className="flex-1 items-center">
              <Text className="text-2xl font-bold text-brand-navy">{todayWet}</Text>
              <Text className="text-xs text-brand-navy/60">Uot</Text>
            </View>
            <View className="w-px bg-brand-gray" />
            <View className="flex-1 items-center">
              <Text className="text-2xl font-bold text-brand-navy">{todayDirty}</Text>
              <Text className="text-xs text-brand-navy/60">Ban</Text>
            </View>
          </View>
        </Card>

        {/* Quick log buttons */}
        <Text className="text-brand-navy font-semibold mb-3">Ghi nhanh</Text>
        <View className="flex-row gap-x-3 mb-4">
          <DiaperButton
            kind="wet"
            onPress={() => handleQuickLog('wet')}
            disabled={isAdding}
          />
          <DiaperButton
            kind="dirty"
            onPress={() => handleQuickLog('dirty')}
            disabled={isAdding}
          />
          <DiaperButton
            kind="both"
            onPress={() => handleQuickLog('both')}
            disabled={isAdding}
          />
        </View>

        {/* Optional note */}
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="Ghi chu (tuy chon — ap dung cho lan ghi tiep theo)"
          className="border border-brand-gray rounded-input px-4 py-3 text-brand-navy text-sm mb-4 bg-white"
          placeholderTextColor="#1F2B5B60"
          style={inputStyles.field}
        />

        {/* History */}
        <Text className="text-brand-navy font-semibold mb-2">Lich su 7 ngay</Text>
        {isLoading ? (
          <LoadingSpinner />
        ) : logs.length === 0 ? (
          <EmptyState
            title="Chua co ban ghi"
            body="Nhan vao mot trong cac nut tren de ghi lan thay ta dau tien"
          />
        ) : (
          logs.map((log) => (
            <DiaperLogRow
              key={log.id}
              log={log}
              onDelete={() => handleDelete(log.id)}
            />
          ))
        )}
      </ScrollView>
    </>
  );
}

// ---------------------------------------------------------------------------
// DiaperLogRow
// ---------------------------------------------------------------------------

function DiaperLogRow({
  log,
  onDelete,
}: {
  log: DiaperLog;
  onDelete: () => void;
}) {
  const kind = log.kind as DiaperKind;
  const timeStr = format(parseISO(log.recorded_at), 'HH:mm, dd/MM', {
    locale: vi,
  });

  return (
    <Card padding="sm" className="mb-2">
      <View className="flex-row items-center">
        <Text style={{ fontSize: 22 }} className="mr-3">
          {KIND_EMOJIS[kind] ?? '💧'}
        </Text>
        <View className="flex-1">
          <Text className="text-brand-navy font-semibold text-sm">
            {KIND_LABELS[kind] ?? kind}
          </Text>
          <Text className="text-brand-navy/50 text-xs">{timeStr}</Text>
          {log.note && (
            <Text className="text-brand-navy/50 text-xs">{log.note}</Text>
          )}
        </View>
        <TouchableOpacity
          onPress={onDelete}
          className="p-2"
          accessibilityLabel="Xoa ban ghi"
        >
          <Text className="text-red-400 text-sm">Xoa</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}
