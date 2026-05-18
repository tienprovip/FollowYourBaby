// ---------------------------------------------------------------------------
// Activities Screen — tummy time, crawl practice, walking, play
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
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useActivityLogs } from '@/hooks/useActivityLogs';
import { useToast } from '@/components/ui/Toast';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import type { Database } from '@/types/database';

type ActivityLog = Database['public']['Tables']['activity_logs']['Row'];
type ActivityKind = 'tummy_time' | 'crawl' | 'walk' | 'play';

const ACTIVITY_OPTIONS: {
  kind: ActivityKind;
  label: string;
  emoji: string;
  color: string;
}[] = [
  { kind: 'tummy_time', label: 'Tap nam san', emoji: '🤰', color: 'bg-brand-blue/15' },
  { kind: 'crawl', label: 'Tap bo', emoji: '🦀', color: 'bg-brand-mint/20' },
  { kind: 'walk', label: 'Tap di', emoji: '👶', color: 'bg-brand-peach' },
  { kind: 'play', label: 'Vui choi', emoji: '🎮', color: 'bg-brand-lavender/15' },
];

const DURATION_PRESETS = [5, 10, 15, 20, 30];

export default function ActivitiesScreen() {
  const { logs, isLoading, todayTotalMinutes, addActivityLog, isAdding, deleteActivityLog } =
    useActivityLogs();
  const { show: showToast } = useToast();

  const [selectedKind, setSelectedKind] = useState<ActivityKind | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [customDuration, setCustomDuration] = useState('');
  const [note, setNote] = useState('');
  const [showForm, setShowForm] = useState(false);

  async function handleSave() {
    if (!selectedKind) {
      Alert.alert('Loi', 'Vui long chon loai hoat dong.');
      return;
    }
    const mins = duration ?? parseInt(customDuration, 10);
    if (isNaN(mins) || mins <= 0) {
      Alert.alert('Loi', 'Vui long nhap thoi gian hop le.');
      return;
    }
    try {
      await addActivityLog({
        recorded_at: new Date().toISOString(),
        kind: selectedKind,
        duration_min: mins,
        note: note.trim() || null,
      });
      setSelectedKind(null);
      setDuration(null);
      setCustomDuration('');
      setNote('');
      setShowForm(false);
      showToast('Da luu hoat dong — Hoan tac', 'success', 5000);
    } catch {
      Alert.alert('Loi', 'Khong the luu. Vui long thu lai.');
    }
  }

  const handleDelete = useCallback(
    (id: string) => {
      Alert.alert('Xoa hoat dong', 'Ban co chac?', [
        { text: 'Huy', style: 'cancel' },
        {
          text: 'Xoa',
          style: 'destructive',
          onPress: async () => {
            try { await deleteActivityLog(id); } catch { Alert.alert('Loi', 'Khong the xoa.'); }
          },
        },
      ]);
    },
    [deleteActivityLog],
  );

  // Today's activity breakdown
  const todayByKind: Partial<Record<ActivityKind, number>> = {};
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  logs
    .filter((l) => new Date(l.recorded_at) >= todayStart)
    .forEach((l) => {
      const k = l.kind as ActivityKind;
      todayByKind[k] = (todayByKind[k] ?? 0) + (l.duration_min ?? 0);
    });

  return (
    <>
      <Stack.Screen options={{ title: 'Hoat dong' }} />
      <ScrollView
        className="flex-1 bg-brand-peach"
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      >
        {/* Today summary */}
        <Card padding="md" className="mb-4">
          <Text className="text-brand-navy font-semibold mb-2">
            Hom nay — Tong cong: {todayTotalMinutes} phut
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {ACTIVITY_OPTIONS.map((opt) => {
              const mins = todayByKind[opt.kind] ?? 0;
              if (mins === 0) return null;
              return (
                <View
                  key={opt.kind}
                  className={`flex-row items-center gap-x-1 px-3 py-1 rounded-full ${opt.color}`}
                >
                  <Text>{opt.emoji}</Text>
                  <Text className="text-brand-navy text-xs font-semibold">
                    {opt.label}: {mins}p
                  </Text>
                </View>
              );
            })}
            {todayTotalMinutes === 0 && (
              <Text className="text-brand-navy/60 text-sm">
                Chua co hoat dong nao hom nay
              </Text>
            )}
          </View>
        </Card>

        {/* Activity picker */}
        <Text className="text-brand-navy font-semibold mb-3">Ghi hoat dong</Text>
        <View className="flex-row flex-wrap gap-3 mb-4">
          {ACTIVITY_OPTIONS.map((opt) => (
            <Pressable
              key={opt.kind}
              onPress={() => {
                setSelectedKind(opt.kind);
                setShowForm(true);
              }}
              className={`flex-1 min-w-[44%] items-center py-5 rounded-card border-2 ${
                selectedKind === opt.kind
                  ? 'border-brand-blue bg-brand-blue/10'
                  : `border-brand-gray ${opt.color}`
              }`}
              accessibilityRole="button"
              accessibilityLabel={opt.label}
            >
              <Text style={{ fontSize: 32 }}>{opt.emoji}</Text>
              <Text className="text-brand-navy font-semibold text-sm mt-2">
                {opt.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Form */}
        {showForm && selectedKind && (
          <Card padding="md" className="mb-4">
            <Text className="text-brand-navy font-semibold mb-3">
              {ACTIVITY_OPTIONS.find((a) => a.kind === selectedKind)?.emoji}{' '}
              {ACTIVITY_OPTIONS.find((a) => a.kind === selectedKind)?.label}
            </Text>

            <Text className="text-brand-navy text-sm mb-2">Thoi gian (phut)</Text>
            <View className="flex-row gap-x-2 mb-3 flex-wrap">
              {DURATION_PRESETS.map((d) => (
                <Pressable
                  key={d}
                  onPress={() => {
                    setDuration(d);
                    setCustomDuration('');
                  }}
                  className={`px-4 py-3 rounded-btn border mb-2 ${
                    duration === d
                      ? 'border-brand-blue bg-brand-blue/10'
                      : 'border-brand-gray bg-white'
                  }`}
                  accessibilityRole="button"
                  accessibilityLabel={`${d} phut`}
                >
                  <Text
                    className={`font-semibold ${
                      duration === d ? 'text-brand-blue' : 'text-brand-navy'
                    }`}
                  >
                    {d}p
                  </Text>
                </Pressable>
              ))}
            </View>
            <TextInput
              value={customDuration}
              onChangeText={(t) => {
                setCustomDuration(t);
                setDuration(null);
              }}
              placeholder="So phut khac..."
              keyboardType="number-pad"
              className="border border-brand-gray rounded-input px-4 py-3 text-brand-navy text-sm mb-3"
              placeholderTextColor="#1F2B5B60"
            />
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="Ghi chu (tuy chon)"
              className="border border-brand-gray rounded-input px-4 py-3 text-brand-navy text-sm mb-4"
              placeholderTextColor="#1F2B5B60"
            />
            <View className="flex-row gap-x-3">
              <Button
                label="Luu"
                variant="primary"
                size="md"
                className="flex-1"
                loading={isAdding}
                onPress={handleSave}
              />
              <Button
                label="Huy"
                variant="secondary"
                size="md"
                className="flex-1"
                onPress={() => {
                  setShowForm(false);
                  setSelectedKind(null);
                  setDuration(null);
                  setCustomDuration('');
                  setNote('');
                }}
              />
            </View>
          </Card>
        )}

        {/* History */}
        <Text className="text-brand-navy font-semibold mb-2">Lich su 7 ngay</Text>
        {isLoading ? (
          <LoadingSpinner />
        ) : logs.length === 0 ? (
          <EmptyState
            title="Chua co hoat dong"
            body="Ghi lai cac hoat dong hang ngay cua be"
          />
        ) : (
          logs.map((log) => (
            <ActivityLogRow
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
// ActivityLogRow
// ---------------------------------------------------------------------------

function ActivityLogRow({
  log,
  onDelete,
}: {
  log: ActivityLog;
  onDelete: () => void;
}) {
  const opt = ACTIVITY_OPTIONS.find((a) => a.kind === log.kind);
  const timeStr = format(parseISO(log.recorded_at), 'HH:mm dd/MM', {
    locale: vi,
  });

  return (
    <Card padding="sm" className="mb-2">
      <View className="flex-row items-center">
        <Text style={{ fontSize: 22 }} className="mr-3">
          {opt?.emoji ?? '🎮'}
        </Text>
        <View className="flex-1">
          <Text className="text-brand-navy font-semibold text-sm">
            {opt?.label ?? log.kind}
          </Text>
          <Text className="text-brand-navy/70 text-xs">
            {log.duration_min} phut
          </Text>
          <Text className="text-brand-navy/50 text-xs">{timeStr}</Text>
          {log.note && (
            <Text className="text-brand-navy/50 text-xs">{log.note}</Text>
          )}
        </View>
        <TouchableOpacity
          onPress={onDelete}
          className="p-2"
          accessibilityLabel="Xoa hoat dong"
        >
          <Text className="text-red-400 text-sm">Xoa</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}
